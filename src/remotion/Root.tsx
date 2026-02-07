import { Composition } from 'remotion';
import { AgentComposition, AgentCompositionSchema } from './Composition';
import "./style.css"; // Ensure tailwind/globals are loaded if needed, or just basic reset

export const RemotionRoot: React.FC = () => {
    return (
        <>
            <Composition
                id="DirectorAgent"
                component={AgentComposition}
                durationInFrames={30 * 30} // Default 30s @ 30fps
                fps={30}
                width={3840} // 4K 
                height={2160}
                schema={AgentCompositionSchema}
                defaultProps={{
                    videoSource: "", // Placeholder
                    musicSource: "https://cdn.pixabay.com/download/audio/2022/05/27/audio_1808fbf07a.mp3",
                    events: [],
                    theme: {
                        id: "default",
                        name: "Default",
                        tags: [],
                        music_keywords: [],
                        voice_style: "neutral",
                        animation_curve: "ease-in-out",
                        zoom_aggression: 1,
                        font_family: "sans-serif",
                        primary_color: "#00f3ff",
                        accent_color: "#ff00ff"
                    }
                }}
            />
        </>
    );
};
