import { ThemeConfig, DirectorScript } from "@/types/director";
import { transcribeAudio, generateScript } from "./openai";
import { fetchMusic } from "./pixabay";
import { CreativeConcept, getConceptById, getRandomConcept } from "./knowledge-base";

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
            // 0. Resolve Creative Concept
            // If the incoming theme has an ID that matches our knowledge base, use the full concept.
            // Otherwise, if it's a "default" request, pick a random concept or use the provided one as is.
            let concept: CreativeConcept;
            const knownConcept = getConceptById(theme.id);

            if (knownConcept) {
                console.log(`[DirectorService] Using known concept: ${knownConcept.name}`);
                concept = knownConcept;
            } else {
                // If the user provided a theme with sufficient data, use it (cast as Concept with defaults)
                // Otherwise pick random for variety if it's just "default"
                if (theme.id === "default" || !theme.name) {
                     console.log(`[DirectorService] No specific theme requested, picking random concept.`);
                     concept = getRandomConcept();
                } else {
                    console.log(`[DirectorService] Using custom user theme.`);
                    concept = {
                        ...theme,
                        description: "Custom User Theme",
                        pacing: "medium" // Default
                    } as CreativeConcept;
                }
            }

            let transcription = "";
            let musicUrl = "";

            // 1. Determine Input Type
            if (instructionSignal.startsWith("text://")) {
                transcription = instructionSignal.replace("text://", "");
                console.log(`[DirectorService] Input is Text: "${transcription}"`);
                musicUrl = await fetchMusic(concept);
            } else {
                // Parallel: Transcribe Audio & Fetch Music
                const [transcribedText, fetchedMusic] = await Promise.all([
                    transcribeAudio(instructionSignal),
                    fetchMusic(concept)
                ]);
                transcription = transcribedText;
                musicUrl = fetchedMusic;
            }

            console.log(`[DirectorService] Transcription: "${transcription.substring(0, 50)}..."`);
            console.log(`[DirectorService] Music URL: ${musicUrl}`);

            // 2. Generate Script
            const script = await generateScript(transcription, concept, jobId);

            // 3. Enrich Script with Real Data
            script.musicUrl = musicUrl;
            // Store the concept details in the script (maybe in themeId or a new field, but strict typing limits us)
            // We'll trust the themeId handles the look and feel in the Editor.
            // If we swapped the concept, we should probably update the script's themeId so the Editor knows what to render.
            script.themeId = concept.id;

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

            console.log(`[DirectorService] Plan created with ${script.events.length} events using concept: ${concept.name}`);
            return script;

        } catch (error) {
            console.error("[DirectorService] Failed to create plan:", error);
            throw error;
        }
    }
}
