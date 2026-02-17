import React from 'react';
import { AbsoluteFill, Audio, OffthreadVideo, interpolate, useCurrentFrame, useVideoConfig, spring } from 'remotion';
import { z } from 'zod';
import { TimelineEvent } from '@/types/director';
import { ThemeConfig } from '@/types/director';

export const AgentCompositionSchema = z.object({
    videoSource: z.string(),
    musicSource: z.string(),
    events: z.array(z.any()),
    theme: z.any(),
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

    // 1. Identify Current Event Logic
    // Find the event that started most recently but hasn't been superseded
    // We assume events are sorted by timestamp
    const activeEventIndex = events.findLastIndex(e => (e.timestamp * fps) <= frame);
    const activeEvent = activeEventIndex !== -1 ? events[activeEventIndex] : null;

    // 2. Zoom & Camera Logic
    // We want to zoom in when 'zoom_target' is present on the active event.
    // We animate the "level" of zoom.

    // Determine target scale based on active event
    // If zoom_target is set, we use theme aggression. Otherwise scale=1.
    const targetScale = (activeEvent?.zoom_target)
        ? 1 + ((theme.zoom_aggression || 1) * 0.15)
        : 1;

    // Smoothly animate to the target scale using a spring
    // We use the activeEvent's timestamp as the trigger for the spring
    const zoomSpring = spring({
        frame: frame - (activeEvent ? activeEvent.timestamp * fps : 0),
        fps,
        config: {
            damping: 200, // Smooth, not too bouncy unless theme demands
            stiffness: 100,
        },
        durationInFrames: 30 // 1 second transition
    });

    // Interpolate manually if we want continuous smooth movement between keyframes,
    // but here we just want to "move to state".
    // Since spring starts at 0 and goes to 1, we interpolate:
    // This logic is tricky because "from" value changes.
    // Easier approach: Calculate scale for *every* event and interpolate based on time.

    // Better Approach for Zoom:
    // Create keyframes arrays
    const zoomKeyframes = events.map(e => e.timestamp * fps);
    const zoomValues = events.map(e => (e.zoom_target ? 1 + ((theme.zoom_aggression || 1) * 0.15) : 1));

    // Ensure we start at 1
    if (zoomKeyframes.length === 0 || zoomKeyframes[0] > 0) {
        zoomKeyframes.unshift(0);
        zoomValues.unshift(1);
    }
    // Ensure end
    zoomKeyframes.push(durationInFrames);
    zoomValues.push(1);

    const currentScale = interpolate(
        frame,
        zoomKeyframes,
        zoomValues,
        { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: (t) => t*t*(3-2*t) } // Smooth step
    );

    // 3. Audio Logic
    const musicVolume = interpolate(
        frame,
        [0, 60, durationInFrames - 60, durationInFrames],
        [0, 0.4, 0.4, 0],
        { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
    );

    // 4. Overlay / HUD Styling
    const hudStyle: React.CSSProperties = {
        position: 'absolute',
        bottom: 80,
        left: 80,
        padding: '24px 32px',
        backgroundColor: 'rgba(10, 10, 10, 0.85)',
        backdropFilter: 'blur(10px)',
        borderLeft: `6px solid ${theme.accent_color}`,
        borderRadius: '0 12px 12px 0',
        color: '#fff',
        fontFamily: theme.font_family || 'sans-serif',
        boxShadow: '0 10px 30px rgba(0,0,0,0.5)',
        transform: 'translateY(0)',
        opacity: 1,
        transition: 'all 0.5s ease',
        maxWidth: '80%'
    };

    // Animate HUD entry
    const hudOpacity = spring({
        frame: frame - (activeEvent ? activeEvent.timestamp * fps : 0),
        fps,
        config: { stiffness: 100 }
    });

    return (
        <AbsoluteFill style={{ backgroundColor: '#000' }}>
            {/* Video Layer with Zoom */}
            <AbsoluteFill style={{
                transform: `scale(${currentScale})`,
                transformOrigin: 'center center' // In future, use coordinates
            }}>
                {videoSource ? (
                     <OffthreadVideo src={videoSource} />
                ) : (
                    <AbsoluteFill className="flex items-center justify-center bg-gray-900">
                        <h1 style={{ color: theme.primary_color, fontSize: 80 }}>NO SIGNAL</h1>
                    </AbsoluteFill>
                )}
            </AbsoluteFill>

            {/* Cinematic Letterbox (Optional based on theme) */}
            {theme.tags?.includes('cinematic') && (
                <>
                    <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '10%', background: 'black', zIndex: 10 }} />
                    <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: '10%', background: 'black', zIndex: 10 }} />
                </>
            )}

            {/* Flash Effect on heavy zoom */}
            {activeEvent?.glow_effect && (
                <AbsoluteFill
                    style={{
                        backgroundColor: theme.primary_color,
                        opacity: interpolate(frame - (activeEvent.timestamp * fps), [0, 5, 15], [0, 0.2, 0], { extrapolateRight: 'clamp' }),
                        mixBlendMode: 'overlay',
                        pointerEvents: 'none'
                    }}
                />
            )}

            {/* HUD Overlay */}
            <AbsoluteFill style={{ pointerEvents: 'none', zIndex: 20 }}>
                {activeEvent && activeEvent.description && (
                    <div style={{
                        ...hudStyle,
                        opacity: hudOpacity,
                        transform: `translateY(${interpolate(hudOpacity, [0, 1], [20, 0])}px)`
                    }}>
                        <h2 style={{
                            margin: 0,
                            fontSize: '24px',
                            fontWeight: 700,
                            color: theme.primary_color,
                            letterSpacing: '0.05em',
                            textTransform: 'uppercase',
                            marginBottom: '4px'
                        }}>
                            {theme.name || 'DIRECTOR AI'}
                        </h2>
                        <p style={{ margin: 0, fontSize: '32px', fontWeight: 300, lineHeight: 1.2 }}>
                            {activeEvent.description}
                        </p>
                    </div>
                )}
            </AbsoluteFill>

            {/* Audio */}
            {musicSource && <Audio src={musicSource} volume={musicVolume} />}
        </AbsoluteFill>
    );
};
