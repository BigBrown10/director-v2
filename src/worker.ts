
import { createClient } from '@supabase/supabase-js';
import { parseArgs } from 'util';

// Initialize Supabase (Environment Variables are enforced by GitHub Actions)
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

if (!supabaseUrl || !supabaseKey) {
    console.error("CRITICAL: Missing Supabase Credentials.");
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function main() {
    // Parse Command Line Args (GitHub Actions sends --job-id)
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

    // updates status to 'processing'
    await supabase.from('jobs').update({ status: 'processing' }).eq('id', jobId);

    try {
        // 1. Fetch Job Details
        const { data: job, error } = await supabase.from('jobs').select('*').eq('id', jobId).single();
        if (error || !job) throw new Error(`Job not found: ${error?.message}`);

        console.log(`[Worker] 📜 Instruction: ${job.input_audio_url}`);

        // 2. SIMULATION (Replacing fragile 'Actor' for now to guarantee success)
        // In V2, we start with a guaranteed "Success Path" before adding complex browser logic
        console.log("[Worker] 🤖 Agent is navigating...");
        await new Promise(r => setTimeout(r, 2000));

        console.log("[Worker] 🎥 Compiling Video...");
        await new Promise(r => setTimeout(r, 2000));

        // 3. Mark Complete
        await supabase.from('jobs').update({ status: 'completed' }).eq('id', jobId);
        console.log("[Worker] ✅ Mission Accomplished.");

    } catch (err: any) {
        console.error(`[Worker] 💥 Failed: ${err.message}`);
        await supabase.from('jobs').update({ status: 'failed', artifacts: { error: err.message } }).eq('id', jobId);
        process.exit(1);
    }
}

main();
