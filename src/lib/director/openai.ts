import { AzureOpenAI } from "openai";
import { ThemeConfig, DirectorScript, TimelineEvent } from "@/types/director";
import { CreativeConcept } from "./knowledge-base";

// These would come from process.env
const AZURE_OPENAI_ENDPOINT = process.env.AZURE_OPENAI_ENDPOINT || "https://mock-endpoint.openai.azure.com";
const AZURE_OPENAI_API_KEY = process.env.AZURE_OPENAI_API_KEY || "mock-key";
const DEPLOYMENT_NAME = process.env.AZURE_OPENAI_DEPLOYMENT_NAME || "gpt-4o"; // Best for Orchestration
const API_VERSION = "2024-05-01-preview"; // Stable Version

const client = new AzureOpenAI({
    endpoint: AZURE_OPENAI_ENDPOINT,
    apiKey: AZURE_OPENAI_API_KEY,
    apiVersion: API_VERSION,
    dangerouslyAllowBrowser: true // For dev/demo only suited for server-side mostly
});

export async function transcribeAudio(audioUrl: string): Promise<string> {
    console.log(`[Director] Transcribing (Mock) audio from: ${audioUrl}`);
    // In real implementation:
    // const result = await client.audio.transcriptions.create({ file: fs.createReadStream(...) });
    // return result.text;

    return "Go to the settings page, change the theme to dark mode, and then log out.";
}

export async function generateScript(transcription: string, concept: CreativeConcept, jobId: string): Promise<DirectorScript> {
    console.log(`[Director] Generating script with Azure OpenAI (${DEPLOYMENT_NAME}) for concept: ${concept.name}`);

    // Mock Response for Development/Demo if keys aren't set
    if (AZURE_OPENAI_API_KEY === "mock-key") {
        return getMockScript(transcription, concept, jobId);
    }

    const systemPrompt = `
    You are a Creative Video Director. Convert the user's intent into a JSON timeline for a product video.
    
    CREATIVE CONCEPT: "${concept.name}"
    Description: ${concept.description}
    Pacing: ${concept.pacing} (Fast = frequent cuts, Slow = long lingering shots)
    Zoom Aggression: ${concept.zoom_aggression} (1=Subtle, 5=Extreme)
    Mood Tags: ${concept.tags ? concept.tags.join(", ") : "neutral"}

    User Intent: "${transcription}"

    You must generate a sequence of actions to be executed by a browser automation agent (Playwright) and then rendered into a video.

    Actions supported:
    - nav (navigate to url)
    - click (selector required)
    - type (selector and value required)
    - hover (selector required)
    - scroll (selector optional, value optional)
    - wait (value in ms)

    Directing Rules:
    1. 'selector' must be a valid CSS selector. Be specific (e.g. 'button[type="submit"]', '#nav-bar').
    2. 'glow_effect': Set to true if this element is important and should be highlighted.
    3. 'zoom_target': If the concept zoom_aggression is high (>3), use this frequently on key elements.
    4. 'description': Write a short, punchy description of what is happening (this might be shown as subtitles).
    5. 'timestamp': Absolute time in seconds. Respect the '${concept.pacing}' pacing.
       - Fast pacing: Actions every 1-2 seconds.
       - Slow pacing: Actions every 3-5 seconds.

    Return a STRICT JSON object matching 'DirectorScript' info.
    Format:
    {
       "events": [ ... ],
       "duration": number
    }
    Return ONLY JSON. No preamble.
    `;

    try {
        const response = await client.chat.completions.create({
            model: DEPLOYMENT_NAME,
            messages: [
                { role: "system", content: systemPrompt },
                { role: "user", content: `Instructions: "${transcription}"` }
            ],
            response_format: { type: "json_object" }
        });

        const content = response.choices[0].message.content;
        if (!content) throw new Error("No content generated");

        const partialScript = JSON.parse(content);

        // Merge with defaults
        return {
            jobId,
            themeId: concept.id,
            musicUrl: "", // Filled later
            events: partialScript.events || [],
            duration: partialScript.duration || 30,
        };

    } catch (error) {
        console.error("Azure OpenAI Error:", error);
        return getMockScript(transcription, concept, jobId);
    }
}

function getMockScript(transcription: string, concept: CreativeConcept, jobId: string): DirectorScript {
    // Generate a mock script that slightly varies based on pacing
    const isFast = concept.pacing === "fast";
    const gap = isFast ? 1.5 : 4;

    return {
        jobId,
        themeId: concept.id,
        musicUrl: "",
        duration: isFast ? 10 : 20,
        events: [
            {
                id: "evt-1",
                timestamp: 0,
                action: "nav",
                value: "TARGET_URL_PLACEHOLDER",
                description: "Navigating to application",
            },
            {
                id: "evt-2",
                timestamp: gap,
                action: "wait",
                value: "2000",
                description: "Initial Impression",
                glow_effect: false
            },
            {
                id: "evt-3",
                timestamp: gap * 2,
                action: "scroll",
                value: "500",
                description: "Exploring features",
                glow_effect: true
            },
            {
                id: "evt-4",
                timestamp: gap * 3,
                action: "wait",
                value: "1000",
                description: "Deep dive",
                glow_effect: true,
                zoom_target: "body" // Simulated zoom
            }
        ]
    };
}
