import { AzureOpenAI } from "openai";
import { ThemeConfig, DirectorScript, TimelineEvent } from "@/types/director";

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

export async function generateScript(transcription: string, theme: ThemeConfig, jobId: string): Promise<DirectorScript> {
    console.log(`[Director] Generating script with Azure OpenAI (${DEPLOYMENT_NAME}) for theme: ${theme.name}`);

    // Mock Response for Development/Demo if keys aren't set
    if (AZURE_OPENAI_API_KEY === "mock-key") {
        return getMockScript(transcription, theme, jobId);
    }

    const systemPrompt = `
    You are a Video Director. Convert this user intent into a JSON timeline.
    
    Target Theme: ${theme.name}
    Theme Mood: ${theme.tags ? theme.tags.join(", ") : "neutral"}
    Zoom Aggression: ${theme.zoom_aggression}

    Actions supported: click, type, hover, scroll, wait, nav.

    Rules:
    1. 'selector' is a CSS selector. be precise.
    2. 'glow_effect' is boolean.

    Return a STRICT JSON object matching 'DirectorScript' info.
    Return ONLY JSON. No preamble.
    `;

    try {
        const response = await client.chat.completions.create({
            model: DEPLOYMENT_NAME,
            messages: [
                { role: "system", content: systemPrompt },
                { role: "user", content: `User Instructions: "${transcription}"` }
            ],
            response_format: { type: "json_object" }
        });

        const content = response.choices[0].message.content;
        if (!content) throw new Error("No content generated");

        const partialScript = JSON.parse(content);

        // Merge with defaults
        return {
            jobId,
            themeId: theme.id,
            musicUrl: "", // Filled later
            events: partialScript.events || [],
            duration: partialScript.duration || 30,
        };

    } catch (error) {
        console.error("Azure OpenAI Error:", error);
        return getMockScript(transcription, theme, jobId);
    }
}

function getMockScript(transcription: string, theme: ThemeConfig, jobId: string): DirectorScript {
    return {
        jobId,
        themeId: theme.id,
        musicUrl: "",
        duration: 15,
        events: [
            {
                id: "evt-1",
                timestamp: 0,
                action: "nav",
                value: "TARGET_URL_PLACEHOLDER",
                description: "Navigating to target application",
            },
            {
                id: "evt-2",
                timestamp: 2,
                action: "wait",
                value: "3000",
                description: "Observing page content",
                glow_effect: true
            },
            {
                id: "evt-3",
                timestamp: 5,
                action: "scroll",
                value: "500",
                description: "Scanning for opportunities",
                glow_effect: true
            },
            {
                id: "evt-4",
                timestamp: 8,
                action: "wait",
                value: "2000",
                description: "Analyzing data",
                glow_effect: true
            }
        ]
    };
}
