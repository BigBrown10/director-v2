export type ActionType = 'click' | 'type' | 'hover' | 'scroll' | 'wait' | 'nav';

export interface TimelineEvent {
    id: string;
    timestamp: number; // Offset in seconds from start
    action: ActionType;
    selector?: string; // CSS selector for target element
    value?: string; // Text to type or URL to nav to
    description: string; // Narration/reasoning for log
    zoom_target?: string; // Optional selector to zoom into
    glow_effect?: boolean; // Whether to highlight the element
}

export interface DirectorScript {
    jobId: string;
    themeId: string;
    musicUrl: string; // Direct URL to MP3
    voiceoverUrl?: string; // Optional URL if TTS is generated
    events: TimelineEvent[];
    duration: number; // estimated total duration
}

export interface ThemeConfig {
    id: string;
    name: string;
    tags: string[]; // Added tags
    config?: any;
    font_family: string;
    primary_color: string;
    accent_color: string;
    music_keywords: string[];
    voice_style: string;
    animation_curve: string;
    zoom_aggression: number;
}
