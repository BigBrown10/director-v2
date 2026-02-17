import { ThemeConfig } from "@/types/director";

export interface CreativeConcept extends ThemeConfig {
    description: string;
    pacing: "fast" | "medium" | "slow";
}

export const KNOWLEDGE_BASE: CreativeConcept[] = [
    {
        id: "apple-minimal",
        name: "Minimalist Tech",
        description: "Clean, white space, smooth transitions, focus on product details. Inspired by Apple.",
        tags: ["clean", "minimal", "tech", "white"],
        pacing: "slow",
        zoom_aggression: 2, // Subtle, smooth zooms
        color_palette: { primary: "#000000", accent: "#0071e3", background: "#f5f5f7" },
        font_family: "San Francisco, Inter, sans-serif",
        primary_color: "#1d1d1f",
        accent_color: "#0071e3",
        music_keywords: ["ambient", "technology", "piano", "calm"],
        voice_style: "professional",
        animation_curve: "ease-in-out"
    },
    {
        id: "nike-energy",
        name: "High Energy Sports",
        description: "Fast cuts, bold typography, high contrast. Inspired by Nike.",
        tags: ["energy", "bold", "sports", "contrast"],
        pacing: "fast",
        zoom_aggression: 5, // Aggressive punch-ins
        color_palette: { primary: "#ffffff", accent: "#cf0a2c", background: "#000000" },
        font_family: "Impact, Bebas Neue, sans-serif",
        primary_color: "#ffffff",
        accent_color: "#cf0a2c",
        music_keywords: ["upbeat", "electronic", "drums", "intense"],
        voice_style: "energetic",
        animation_curve: "cubic-bezier(0.175, 0.885, 0.32, 1.275)" // Bouncy/Elastic
    },
    {
        id: "slack-playful",
        name: "Playful SaaS",
        description: "Colorful, friendly, bouncy animations. Inspired by Slack/Asana.",
        tags: ["playful", "colorful", "saas", "friendly"],
        pacing: "medium",
        zoom_aggression: 3,
        color_palette: { primary: "#4a154b", accent: "#36c5f0", background: "#ffffff" },
        font_family: "Circular, Lato, sans-serif",
        primary_color: "#4a154b",
        accent_color: "#36c5f0",
        music_keywords: ["happy", "acoustic", "whistle", "upbeat"],
        voice_style: "friendly",
        animation_curve: "ease-out"
    },
    {
        id: "stripe-developer",
        name: "Developer Focus",
        description: "Gradient backgrounds, code snippets, precise motion. Inspired by Stripe.",
        tags: ["developer", "gradient", "precise", "tech"],
        pacing: "medium",
        zoom_aggression: 2,
        color_palette: { primary: "#635bff", accent: "#00d4ff", background: "#f6f9fc" },
        font_family: "Inter, Roboto Mono, monospace",
        primary_color: "#635bff",
        accent_color: "#00d4ff",
        music_keywords: ["synthwave", "future", "digital", "modern"],
        voice_style: "technical",
        animation_curve: "ease-in-out"
    },
    {
        id: "netflix-cinematic",
        name: "Cinematic Dark",
        description: "Dark mode, dramatic lighting, suspenseful pacing. Inspired by Netflix trailers.",
        tags: ["cinematic", "dark", "dramatic"],
        pacing: "slow",
        zoom_aggression: 3,
        color_palette: { primary: "#e50914", accent: "#ffffff", background: "#141414" },
        font_family: "Bebas Neue, sans-serif",
        primary_color: "#e50914",
        accent_color: "#ffffff",
        music_keywords: ["cinematic", "orchestral", "dramatic", "suspense"],
        voice_style: "narrator",
        animation_curve: "ease-in-out"
    },
    {
        id: "spotify-duotone",
        name: "Duotone Vibes",
        description: "Heavy color overlays, bold typography, rhythm-synced. Inspired by Spotify Wrapped.",
        tags: ["duotone", "music", "bold", "colorful"],
        pacing: "fast",
        zoom_aggression: 4,
        color_palette: { primary: "#1db954", accent: "#191414", background: "#191414" },
        font_family: "Montserrat, sans-serif",
        primary_color: "#1db954",
        accent_color: "#ff0090", // Hot pink for contrast
        music_keywords: ["pop", "dance", "beat", "groovy"],
        voice_style: "casual",
        animation_curve: "linear"
    },
    {
        id: "fintech-trust",
        name: "Fintech Trust",
        description: "Secure blues, solid lines, reassuring motion. Inspired by PayPal/Chase.",
        tags: ["finance", "trust", "blue", "secure"],
        pacing: "medium",
        zoom_aggression: 1,
        color_palette: { primary: "#003087", accent: "#009cde", background: "#ffffff" },
        font_family: "Arial, sans-serif",
        primary_color: "#003087",
        accent_color: "#009cde",
        music_keywords: ["corporate", "inspiring", "calm", "piano"],
        voice_style: "reassuring",
        animation_curve: "ease-in"
    },
    {
        id: "luxury-fashion",
        name: "Luxury Elegant",
        description: "Serif fonts, gold accents, slow pans. Inspired by Vogue/Gucci.",
        tags: ["luxury", "elegant", "gold", "fashion"],
        pacing: "slow",
        zoom_aggression: 1,
        color_palette: { primary: "#d4af37", accent: "#000000", background: "#ffffff" },
        font_family: "Playfair Display, serif",
        primary_color: "#d4af37",
        accent_color: "#000000",
        music_keywords: ["classical", "elegant", "violins", "piano"],
        voice_style: "sophisticated",
        animation_curve: "ease-in-out"
    },
    {
        id: "gaming-rgb",
        name: "RGB Gamer",
        description: "Neon colors, glitch effects, rapid movement. Inspired by Razer/Logitech G.",
        tags: ["gaming", "neon", "glitch", "rgb"],
        pacing: "fast",
        zoom_aggression: 5,
        color_palette: { primary: "#00ff00", accent: "#ff00ff", background: "#000000" },
        font_family: "Orbitron, sans-serif",
        primary_color: "#00ff00",
        accent_color: "#ff00ff",
        music_keywords: ["dubstep", "cyberpunk", "electronic", "bass"],
        voice_style: "intense",
        animation_curve: "steps(5)" // Rough/digital feel
    },
    {
        id: "nature-eco",
        name: "Eco Friendly",
        description: "Greens, browns, organic shapes, gentle motion. Inspired by Patagonia.",
        tags: ["eco", "nature", "organic", "green"],
        pacing: "slow",
        zoom_aggression: 1,
        color_palette: { primary: "#2e7d32", accent: "#8d6e63", background: "#f1f8e9" },
        font_family: "Lora, serif",
        primary_color: "#2e7d32",
        accent_color: "#8d6e63",
        music_keywords: ["acoustic", "folk", "nature", "guitar"],
        voice_style: "calm",
        animation_curve: "ease-in-out"
    },
    {
        id: "news-broadcast",
        name: "Breaking News",
        description: "Red/White/Blue, tickers, urgent motion. Inspired by CNN/BBC.",
        tags: ["news", "broadcast", "urgent"],
        pacing: "medium",
        zoom_aggression: 3,
        color_palette: { primary: "#cc0000", accent: "#0000cc", background: "#ffffff" },
        font_family: "Helvetica, sans-serif",
        primary_color: "#cc0000",
        accent_color: "#0000cc",
        music_keywords: ["news", "orchestral", "tension", "alert"],
        voice_style: "authoritative",
        animation_curve: "linear"
    },
    {
        id: "social-viral",
        name: "TikTok Viral",
        description: "Vertical-friendly (conceptually), snappy, text-heavy overlays. Inspired by TikTok trends.",
        tags: ["social", "viral", "tiktok", "snappy"],
        pacing: "fast",
        zoom_aggression: 4,
        color_palette: { primary: "#ff0050", accent: "#00f2ea", background: "#000000" },
        font_family: "Proxima Nova, sans-serif",
        primary_color: "#ff0050",
        accent_color: "#00f2ea",
        music_keywords: ["viral", "pop", "upbeat", "short"],
        voice_style: "casual",
        animation_curve: "spring"
    },
    {
        id: "corporate-blue",
        name: "Corporate Professional",
        description: "Standard blue, clean lines, safe and reliable. Inspired by IBM/Microsoft.",
        tags: ["corporate", "professional", "blue", "safe"],
        pacing: "medium",
        zoom_aggression: 2,
        color_palette: { primary: "#006699", accent: "#333333", background: "#ffffff" },
        font_family: "Segoe UI, sans-serif",
        primary_color: "#006699",
        accent_color: "#333333",
        music_keywords: ["corporate", "business", "neutral", "background"],
        voice_style: "professional",
        animation_curve: "ease-in-out"
    },
    {
        id: "retro-vaporwave",
        name: "Retro Vaporwave",
        description: "Pink/Cyan, grid lines, 80s nostalgia. Inspired by 80s aesthetic.",
        tags: ["retro", "vaporwave", "80s", "nostalgia"],
        pacing: "slow",
        zoom_aggression: 2,
        color_palette: { primary: "#ff71ce", accent: "#01cdfe", background: "#2b213a" },
        font_family: "VCR OSD Mono, monospace",
        primary_color: "#ff71ce",
        accent_color: "#01cdfe",
        music_keywords: ["synthwave", "vaporwave", "chill", "lofi"],
        voice_style: "relaxed",
        animation_curve: "ease-in-out"
    },
    {
        id: "startup-rocket",
        name: "Startup Launch",
        description: "Orange/Purple gradient, ascending motion. Inspired by Product Hunt launches.",
        tags: ["startup", "launch", "rocket", "orange"],
        pacing: "fast",
        zoom_aggression: 4,
        color_palette: { primary: "#ff6154", accent: "#5433ff", background: "#ffffff" },
        font_family: "Helvetica Neue, sans-serif",
        primary_color: "#ff6154",
        accent_color: "#5433ff",
        music_keywords: ["energetic", "motivational", "success", "rock"],
        voice_style: "enthusiastic",
        animation_curve: "ease-out"
    },
    {
        id: "medical-care",
        name: "Medical Care",
        description: "Soft blue/green, clean white, sterile but caring. Inspired by Mayo Clinic.",
        tags: ["medical", "care", "health", "clean"],
        pacing: "slow",
        zoom_aggression: 1,
        color_palette: { primary: "#00a3e0", accent: "#4caf50", background: "#ffffff" },
        font_family: "Open Sans, sans-serif",
        primary_color: "#00a3e0",
        accent_color: "#4caf50",
        music_keywords: ["calm", "ambient", "healing", "soft"],
        voice_style: "gentle",
        animation_curve: "ease-in-out"
    },
    {
        id: "cyber-security",
        name: "Cyber Security",
        description: "Dark blue, lock icons, matrix code effects. Inspired by Norton/McAfee.",
        tags: ["security", "cyber", "lock", "code"],
        pacing: "medium",
        zoom_aggression: 3,
        color_palette: { primary: "#ffce00", accent: "#000000", background: "#1b1b1b" }, // Norton Yellow
        font_family: "Consolas, monospace",
        primary_color: "#ffce00",
        accent_color: "#ffffff",
        music_keywords: ["tension", "electronic", "hacker", "tech"],
        voice_style: "serious",
        animation_curve: "linear"
    },
    {
        id: "education-learn",
        name: "Education Learning",
        description: "Primary colors, simple shapes, chalkboard textures. Inspired by Khan Academy.",
        tags: ["education", "learning", "school", "simple"],
        pacing: "slow",
        zoom_aggression: 2,
        color_palette: { primary: "#14bf96", accent: "#5d5c61", background: "#ffffff" },
        font_family: "Comic Sans MS, sans-serif", // Or something friendlier
        primary_color: "#14bf96",
        accent_color: "#5d5c61",
        music_keywords: ["acoustic", "playful", "learning", "kids"],
        voice_style: "teacher",
        animation_curve: "ease-in-out"
    },
    {
        id: "industrial-heavy",
        name: "Industrial Heavy",
        description: "Greys, oranges, metallic textures. Inspired by CAT/Bosch.",
        tags: ["industrial", "heavy", "construction", "strong"],
        pacing: "slow",
        zoom_aggression: 1,
        color_palette: { primary: "#ff9900", accent: "#333333", background: "#e0e0e0" },
        font_family: "Impact, sans-serif",
        primary_color: "#ff9900",
        accent_color: "#333333",
        music_keywords: ["rock", "drums", "heavy", "power"],
        voice_style: "strong",
        animation_curve: "linear"
    },
    {
        id: "crypto-future",
        name: "Crypto Future",
        description: "Purple/Gold gradients, blockchain nodes, futuristic. Inspired by Coinbase/Binance.",
        tags: ["crypto", "future", "blockchain", "money"],
        pacing: "fast",
        zoom_aggression: 4,
        color_palette: { primary: "#f7931a", accent: "#627eea", background: "#121d33" },
        font_family: "Exo 2, sans-serif",
        primary_color: "#f7931a",
        accent_color: "#627eea",
        music_keywords: ["electronic", "future", "money", "fast"],
        voice_style: "visionary",
        animation_curve: "ease-in-out"
    }
];

export function getConceptById(id: string): CreativeConcept | undefined {
    return KNOWLEDGE_BASE.find(c => c.id === id);
}

export function getRandomConcept(): CreativeConcept {
    const randomIndex = Math.floor(Math.random() * KNOWLEDGE_BASE.length);
    return KNOWLEDGE_BASE[randomIndex];
}
