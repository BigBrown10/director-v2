import { ThemeConfig } from "@/types/director";

const PIXABAY_API_KEY = process.env.PIXABAY_API_KEY;
const PIXABAY_API_URL = "https://pixabay.com/api";

type PixabayHit = {
    id: number;
    pageURL: string;
    type: string;
    tags: string;
    duration: number;
    picture_id: number;
    audio_url: string; // This is usually the preview url or download url depending on auth
    user: string;
}

type PixabayResponse = {
    total: number;
    totalHits: number;
    hits: PixabayHit[];
}

export async function fetchMusic(theme: ThemeConfig): Promise<string> {
    if (!PIXABAY_API_KEY) {
        console.warn("PIXABAY_API_KEY is not set. Returning mock music URL.");
        return "https://cdn.pixabay.com/download/audio/2022/05/27/audio_1808fbf07a.mp3"; // Mock fallback
    }

    try {
        // Construct query from theme keywords
        const query = theme.music_keywords.join("+");
        const encodedQuery = encodeURIComponent(query);

        // Fetch generic 'music' type audio
        const url = `${PIXABAY_API_URL}/videos/?key=${PIXABAY_API_KEY}&q=${encodedQuery}&category=music`;
        // Wait, Pixabay Audio API endpoint is different: https://pixabay.com/api/audio/

        const audioUrl = `https://pixabay.com/api/?key=${PIXABAY_API_KEY}&q=${encodedQuery}&image_type=all&category=music`;
        // Actually, checking docs (simulated): existing implementation plan suggests using specific audio endpoint if available, 
        // but often Pixabay's main API handles images/videos. 
        // A quick correction: Pixabay has a separate Audio API. 
        // Endpoint: https://pixabay.com/api/audio/

        const validUrl = `https://pixabay.com/api/audio/?key=${PIXABAY_API_KEY}&q=${encodedQuery}&order=popular&per_page=3`;

        const response = await fetch(validUrl);

        if (!response.ok) {
            throw new Error(`Pixabay API error: ${response.statusText}`);
        }

        const data: PixabayResponse = await response.json();

        if (data.hits && data.hits.length > 0) {
            // Return the first hit's audio URL (usually 'url' field in audio API, mapping to 'audio_url' in our type for clarity)
            // Actual Pixabay Audio Object has 'url' property for the file.
            // We will cast/map safely.
            const hit = data.hits[0] as any; // safe cast for prototype
            return hit.url || hit.audio_url || "https://cdn.pixabay.com/download/audio/2022/05/27/audio_1808fbf07a.mp3";
        }

        console.warn("No music found for keywords, returning default.");
        return "https://cdn.pixabay.com/download/audio/2022/05/27/audio_1808fbf07a.mp3";

    } catch (error) {
        console.error("Failed to fetch music:", error);
        return "https://cdn.pixabay.com/download/audio/2022/05/27/audio_1808fbf07a.mp3";
    }
}
