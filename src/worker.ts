
import { createClient } from '@supabase/supabase-js';
import { parseArgs } from 'util';
import fs from 'fs';
import path from 'path';
import { DirectorService } from '@/lib/director/director-service';
import { Actor } from '@/lib/actor/actor-service';
import { renderVideo } from '@/lib/editor/render';
import { servePublicFolder } from '@/utils/static-server';
import { ThemeConfig } from '@/types/director';

// Initialize Supabase
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

if (!supabaseUrl || !supabaseKey) {
    console.error("CRITICAL: Missing Supabase Credentials.");
    // In a real worker, we might exit, but for dev we warn.
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function main() {
    const { values } = parseArgs({
        args: process.argv.slice(2),
        options: {
            "job-id": { type: "string" },
        },
    });

    const jobId = values["job-id"];

    if (!jobId) {
        console.error("CRITICAL: No Job ID provided.");
        process.exit(1);
    }

    console.log(`[Worker] ✨ Starting Job: ${jobId}`);

    // Instantiate Services
    const director = new DirectorService();
    const actor = new Actor();

    try {
        // 0. Update Status
        await supabase.from('jobs').update({ status: 'processing' }).eq('id', jobId);

        // 1. Fetch Job Details
        const { data: job, error } = await supabase.from('jobs').select('*').eq('id', jobId).single();
        if (error || !job) throw new Error(`Job not found: ${error?.message}`);

        const instruction = job.input_text || job.input_audio_url || "text://Go to google.com and search for AI";
        // Handle case where input might be just text but labeled as url, or handle pure text input if column exists
        // We normalize to a signal string.
        const signal = instruction.startsWith("http") ? instruction : `text://${instruction}`;

        const targetUrl = job.target_url || "https://www.google.com";
        const theme: ThemeConfig = job.theme || {
            id: 'default',
            name: 'Default',
            font_family: 'sans-serif',
            primary_color: '#00f3ff',
            accent_color: '#ff00ff',
            zoom_aggression: 1
        };

        console.log(`[Worker] 🎬 Phase 1: Director Planning...`);
        const script = await director.createDirectorPlan(signal, jobId, targetUrl, theme);

        console.log(`[Worker] 🎭 Phase 2: Actor Recording...`);
        // Ensure videos directory exists (use public/videos as per browser config)
        const videoDir = path.resolve(process.cwd(), 'public/videos');
        if (!fs.existsSync(videoDir)) fs.mkdirSync(videoDir, { recursive: true });

        // Ensure outputs directory exists
        const outputDir = path.resolve(process.cwd(), 'public/outputs');
        if (!fs.existsSync(outputDir)) fs.mkdirSync(outputDir, { recursive: true });

        const rawVideoPath = await actor.recordSession(script);
        console.log(`[Worker] 📹 Raw recording at: ${rawVideoPath}`);

        console.log(`[Worker] 🎨 Phase 3: Editor Rendering...`);

        // Start Static Server for Rendering
        const publicDir = path.resolve(process.cwd(), 'public');
        const server = await servePublicFolder(publicDir);
        let finalVideoPath = "";

        try {
             finalVideoPath = await renderVideo(script, rawVideoPath, theme, server.url);
             console.log(`[Worker] 🎞️ Final video at: ${finalVideoPath}`);
        } finally {
            server.close();
        }

        // 4. Upload / Finish
        let publicUrl = null;
        try {
            const fileName = `final-${jobId}-${Date.now()}.mp4`;
            const fileBuffer = fs.readFileSync(finalVideoPath);
            const { data: uploadData, error: uploadError } = await supabase.storage
                .from('videos')
                .upload(fileName, fileBuffer, { contentType: 'video/mp4' });

            if (uploadError) {
                console.warn(`[Worker] Upload failed (Bucket 'videos' might not exist):`, uploadError.message);
            } else {
                const { data: urlData } = supabase.storage.from('videos').getPublicUrl(fileName);
                publicUrl = urlData.publicUrl;
                console.log(`[Worker] 🌍 Public URL: ${publicUrl}`);
            }
        } catch (uploadErr) {
            console.warn(`[Worker] Upload skipped due to config/error.`, uploadErr);
        }

        // Update Job
        await supabase.from('jobs').update({
            status: 'completed',
            output_url: publicUrl || finalVideoPath, // Fallback to local path if upload fails
            artifacts: { script, raw_video: rawVideoPath }
        }).eq('id', jobId);

        console.log("[Worker] ✅ Job Completed Successfully.");
        process.exit(0);

    } catch (err: any) {
        console.error(`[Worker] 💥 Failed: ${err.message}`);
        console.error(err.stack);
        await supabase.from('jobs').update({
            status: 'failed',
            artifacts: { error: err.message, stack: err.stack }
        }).eq('id', jobId);
        process.exit(1);
    }
}

main();
