import { ThemeConfig, DirectorScript } from "@/types/director";
import { transcribeAudio, generateScript } from "./openai";
import { fetchMusic } from "./pixabay";

export class DirectorService {

    /**
     * Orchestrates the entire "Pre-Production" phase.
     * 1. Transcribes the audio instruction.
     * 2. Fetches appropriate background music.
     * 3. Generates the detailed AV script using GPT.
     */
    async createDirectorPlan(
        instructionSignal: string, // Can be "text://..." or "http://..." (audio)
        jobId: string,
        targetUrl: string,
        theme: ThemeConfig
    ): Promise<DirectorScript> {
        console.log(`[DirectorService] Starting plan for Job ${jobId}`);

        try {
            let transcription = "";
            let musicUrl = "";

            // 1. Determine Input Type
            if (instructionSignal.startsWith("text://")) {
                transcription = instructionSignal.replace("text://", "");
                console.log(`[DirectorService] Input is Text: "${transcription}"`);
                musicUrl = await fetchMusic(theme);
            } else {
                // Parallel: Transcribe Audio & Fetch Music
                const [transcribedText, fetchedMusic] = await Promise.all([
                    transcribeAudio(instructionSignal),
                    fetchMusic(theme)
                ]);
                transcription = transcribedText;
                musicUrl = fetchedMusic;
            }

            console.log(`[DirectorService] Transcription: "${transcription.substring(0, 50)}..."`);
            console.log(`[DirectorService] Music URL: ${musicUrl}`);

            // 2. Generate Script
            const script = await generateScript(transcription, theme, jobId);

            // 3. Enrich Script with Real Data
            script.musicUrl = musicUrl;

            // Inject the 'Nav' event at the start if not present or just ensure it
            // For safety, force the first event to be a NAV to targetUrl
            if (script.events.length === 0 || script.events[0].action !== 'nav') {
                script.events.unshift({
                    id: 'evt-init',
                    timestamp: 0,
                    action: 'nav',
                    value: targetUrl,
                    description: `Navigating to ${targetUrl}`
                });
            } else if (script.events[0].action === 'nav' && script.events[0].value === "TARGET_URL_PLACEHOLDER") {
                script.events[0].value = targetUrl;
            }

            console.log(`[DirectorService] Plan created with ${script.events.length} events.`);
            return script;

        } catch (error) {
            console.error("[DirectorService] Failed to create plan:", error);
            throw error;
        }
    }
}
