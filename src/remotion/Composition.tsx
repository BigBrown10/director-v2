import React, { useMemo } from 'react';
import { AbsoluteFill, Audio, OffthreadVideo, interpolate, useCurrentFrame, useVideoConfig } from 'remotion';
import { z } from 'zod';
import { TimelineEvent } from '@/types/director'; // Ensure types/director.ts is accessible
import { ThemeConfig } from '@/types/director';

// Re-define types for Zod schema integration if needed, or use custom schema props
export const AgentCompositionSchema = z.object({
    videoSource: z.string(),
    musicSource: z.string(),
    events: z.array(z.any()), // typing as any to avoid complex Zod schema for interface re-mapping
    theme: z.any(), // Same here
});

type AgentCompositionProps = {
    videoSource: string;
    musicSource: string;
    events: TimelineEvent[];
    theme: ThemeConfig;
}

export const AgentComposition: React.FC<AgentCompositionProps> = ({ videoSource, musicSource, events, theme }) => {
    const frame = useCurrentFrame();
    const { fps, durationInFrames } = useVideoConfig();

    // 1. Audio Ducking Logic
    // Calculate volume based on "important" events where we might want narration or focus
    // For this MVP, we just keep music steady or duck blindly if we had voiceover.
    // Since we don't have voiceover yet, we'll implement a "Build Up" curve based on the theme.

    const musicVolume = interpolate(
        frame,
        [0, 60, durationInFrames - 60, durationInFrames],
        [0, 0.5, 0.5, 0], // Fade in/out
        { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
    );

    // 2. Smart Visuals (Zoom)
    // Find current active event
    const currentEvent = events.find(e => {
        const startFrame = e.timestamp * fps;
        const endFrame = startFrame + (2 * fps); // Assumption: events last ~2s focus
        return frame >= startFrame && frame < endFrame;
    });

    const zoomStyle = useMemo(() => {
        if (!currentEvent || !currentEvent.zoom_target) {
            return { transform: 'scale(1)', transition: 'transform 0.5s' };
        }
        // In a real app, we'd need coordinates from the "Actor" logs (DirectorScript needs actual x/y)
        // Since we only have selectors in the plan, we simulate a "Punch In" zoom
        // We'll just zoom to center for the "Hype" feel if zoom_target is present.

        // Using theme aggression
        const scale = 1 + ((theme.zoom_aggression - 1) * 0.1);

        return {
            transform: `scale(${scale})`,
            filter: currentEvent.glow_effect ? `drop-shadow(0 0 20px ${theme.primary_color})` : 'none'
        };
    }, [currentEvent, theme]);


    return (
        <AbsoluteFill style={{ backgroundColor: '#000' }}>
            {/* Video Layer */}
            {videoSource ? (
                <AbsoluteFill style={{ ...zoomStyle, transition: `transform 0.5s ${theme.animation_curve}` }}>
                    <OffthreadVideo src={videoSource} />
                </AbsoluteFill>
            ) : (
                <AbsoluteFill className="flex items-center justify-center text-white text-6xl font-bold">
                    <h1 style={{ color: theme.primary_color }}>NO VIDEO SOURCE</h1>
                </AbsoluteFill>
            )}

            {/* Overlay Layer (HUD) */}
            <AbsoluteFill style={{ pointerEvents: 'none' }}>
                {currentEvent && (
                    <div style={{
                        position: 'absolute',
                        bottom: 100,
                        left: 100,
                        backgroundColor: 'rgba(0,0,0,0.7)',
                        padding: '20px',
                        borderLeft: `5px solid ${theme.accent_color}`,
                        color: 'white',
                        fontFamily: theme.font_family,
                        fontSize: '40px'
                    }}>
                        {currentEvent.description.toUpperCase()}
                    </div>
                )}
            </AbsoluteFill>

            {/* Audio Layer */}
            {musicSource && (
                <Audio
                    src={musicSource}
                    volume={musicVolume} // Automated volume
                />
            )}
        </AbsoluteFill>
    );
};
