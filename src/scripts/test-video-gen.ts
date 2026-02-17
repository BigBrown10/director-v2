
import { DirectorService } from '@/lib/director/director-service';
import { Actor } from '@/lib/actor/actor-service';
import { renderVideo } from '@/lib/editor/render';
import { servePublicFolder } from '@/utils/static-server';
import fs from 'fs';
import path from 'path';

async function testPipeline() {
    console.log("🎬 Starting Manual Test Pipeline...");

    const director = new DirectorService();
    const actor = new Actor();

    // 1. Mock Data
    const jobId = "test-job-" + Date.now();
    const targetUrl = "https://www.google.com";
    const instruction = "text://Go to google.com, type 'Remotion' into the search bar, wait for results, and scroll down.";
    const theme = {
        id: "apple-minimal", // Test with a specific concept
        name: "Apple Minimal",
        font_family: "San Francisco",
        primary_color: "#000",
        accent_color: "#007aff",
        zoom_aggression: 2
    };

    try {
        // 2. Director Phase
        console.log("\n[Step 1] Creating Director Plan...");
        const plan = await director.createDirectorPlan(instruction, jobId, targetUrl, theme);
        console.log("Plan created with events:", plan.events.length);

        // 3. Actor Phase
        console.log("\n[Step 2] Recording Actor Session...");
        // Ensure directory
        const videoDir = path.resolve(process.cwd(), 'public/videos');
        if (!fs.existsSync(videoDir)) fs.mkdirSync(videoDir, { recursive: true });
        const outputDir = path.resolve(process.cwd(), 'public/outputs');
        if (!fs.existsSync(outputDir)) fs.mkdirSync(outputDir, { recursive: true });

        const rawVideoPath = await actor.recordSession(plan);
        console.log("Raw video captured at:", rawVideoPath);

        // 4. Editor Phase
        console.log("\n[Step 3] Rendering Final Video...");

        // Start Static Server
        const publicDir = path.resolve(process.cwd(), 'public');
        const server = await servePublicFolder(publicDir);

        try {
            const finalPath = await renderVideo(plan, rawVideoPath, theme, server.url);
            console.log("Final video rendered at:", finalPath);
        } finally {
            server.close();
        }

        console.log("\n✅ Test Complete! Check 'videos' folder.");

    } catch (error) {
        console.error("❌ Test Failed:", error);
    }
}

testPipeline();
