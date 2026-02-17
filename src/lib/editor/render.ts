import { bundle } from "@remotion/bundler";
import { renderMedia, selectComposition } from "@remotion/renderer";
import path from "path";
import { DirectorScript } from "@/types/director";

export async function renderVideo(
    script: DirectorScript,
    videoSource: string,
    theme: any,
    serverUrl?: string
): Promise<string> {
    console.log(`[Editor] Starting render for Job ${script.jobId}`);

    // 1. Bundle the Remotion project
    const entryPoint = path.resolve(process.cwd(), "src/remotion/Root.tsx");
    console.log(`[Editor] Bundling ${entryPoint}...`);

    // Define publicDir explicitly
    const publicDir = path.resolve(process.cwd(), 'public');

    const bundleLocation = await bundle({
        entryPoint,
        publicDir,
        // If you need to pass specific webpack overrides, do it here
        // For Next.js projects, we might need to ensure certain loaders
    });

    // Handle Video Source URL
    let finalVideoSource = videoSource;

    if (serverUrl && videoSource.startsWith(publicDir)) {
        // If we have a static server and the file is in public, rewrite to HTTP URL
        const relativePath = videoSource.replace(publicDir, '').replace(/\\/g, '/');
        // Ensure leading slash
        const cleanPath = relativePath.startsWith('/') ? relativePath : '/' + relativePath;
        finalVideoSource = `${serverUrl}${cleanPath}`;
        console.log(`[Editor] Rewrote source to HTTP: ${finalVideoSource}`);
    } else if (path.isAbsolute(videoSource)) {
        // Fallback to file:// protocol if no server or external path
        finalVideoSource = `file://${videoSource}`;
        console.log(`[Editor] Using File Protocol: ${finalVideoSource}`);
    } else {
        console.log(`[Editor] Using Raw Source: ${finalVideoSource}`);
    }

    // 2. Select Composition
    const composition = await selectComposition({
        serveUrl: bundleLocation,
        id: "DirectorAgent",
        inputProps: {
            videoSource: finalVideoSource,
            musicSource: script.musicUrl,
            events: script.events,
            theme
        },
    });

    // 3. Render Media
    // Ensure output directory exists
    const outputDir = path.resolve(process.cwd(), "public/outputs"); // Or use 'videos' but keep distinct from inputs
    const outputLocation = path.resolve(outputDir, `final-${script.jobId}.mp4`);
    console.log(`[Editor] Rendering to ${outputLocation}...`);

    await renderMedia({
        composition,
        serveUrl: bundleLocation,
        codec: "h264",
        outputLocation,
        inputProps: {
            videoSource: finalVideoSource,
            musicSource: script.musicUrl,
            events: script.events,
            theme
        },
    });

    console.log(`[Editor] Render complete!`);
    return outputLocation;
}
