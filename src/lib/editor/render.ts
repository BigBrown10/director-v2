import { bundle } from "@remotion/bundler";
import { renderMedia, selectComposition } from "@remotion/renderer";
import path from "path";
import { DirectorScript } from "@/types/director";

export async function renderVideo(script: DirectorScript, videoSource: string, theme: any): Promise<string> {
    console.log(`[Editor] Starting render for Job ${script.jobId}`);

    // 1. Bundle the Remotion project
    const entryPoint = path.resolve(process.cwd(), "src/remotion/Root.tsx");
    console.log(`[Editor] Bundling ${entryPoint}...`);

    const bundleLocation = await bundle({
        entryPoint,
        // If you need to pass specific webpack overrides, do it here
        // For Next.js projects, we might need to ensure certain loaders
    });

    // 2. Select Composition
    const composition = await selectComposition({
        serveUrl: bundleLocation,
        id: "DirectorAgent",
        inputProps: {
            videoSource,
            musicSource: script.musicUrl,
            events: script.events,
            theme
        },
    });

    // 3. Render Media
    const outputLocation = path.resolve(process.cwd(), "videos", `final-${script.jobId}.mp4`);
    console.log(`[Editor] Rendering to ${outputLocation}...`);

    await renderMedia({
        composition,
        serveUrl: bundleLocation,
        codec: "h264",
        outputLocation,
        inputProps: {
            videoSource,
            musicSource: script.musicUrl,
            events: script.events,
            theme
        },
    });

    console.log(`[Editor] Render complete!`);
    return outputLocation;
}
