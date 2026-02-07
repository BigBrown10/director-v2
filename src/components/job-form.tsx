"use client"

import * as React from "react"
import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { supabase } from "@/utils/supabase/client"
import { encryptPassword } from "@/lib/encryption"
import { jobFormSchema } from "@/lib/schemas"
import { Upload, Mic, MicOff, Play, Wand2, StopCircle } from "lucide-react"

export function JobForm() {
    console.log("🚀 SYSTEM ONLINE: v2.2 (Fresh Webhook Trigger)");
    const [loading, setLoading] = useState(false)
    const [status, setStatus] = useState<"idle" | "submitting" | "processing" | "completed" | "failed">("idle")
    const [targetUrl, setTargetUrl] = useState("")
    const [username, setUsername] = useState("")
    const [password, setPassword] = useState("")
    const [themeId, setThemeId] = useState("")
    const [instructionType, setInstructionType] = useState<"text" | "audio">("text")
    const [textInstructions, setTextInstructions] = useState("")
    const [audioFile, setAudioFile] = useState<File | null>(null)
    const [isRecording, setIsRecording] = useState(false)
    const [recordedUrl, setRecordedUrl] = useState<string | null>(null)
    const mediaRecorderRef = useRef<MediaRecorder | null>(null)
    const chunksRef = useRef<Blob[]>([])
    const [jobResult, setJobResult] = useState<any>(null)

    const startRecording = async () => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
            mediaRecorderRef.current = new MediaRecorder(stream)
            chunksRef.current = []

            mediaRecorderRef.current.ondataavailable = (e) => {
                if (e.data.size > 0) chunksRef.current.push(e.data)
            }

            mediaRecorderRef.current.onstop = () => {
                const blob = new Blob(chunksRef.current, { type: "audio/webm" })
                const file = new File([blob], "voice-instruction.webm", { type: "audio/webm" })
                setAudioFile(file)
                setRecordedUrl(URL.createObjectURL(blob))
            }

            mediaRecorderRef.current.start()
            setIsRecording(true)
        } catch (err) {
            console.error("Microphone access denied:", err)
            alert("Could not access microphone. Please check permissions.")
        }
    }

    const stopRecording = () => {
        if (mediaRecorderRef.current && isRecording) {
            mediaRecorderRef.current.stop()
            setIsRecording(false)
            // Stop all tracks to release mic
            mediaRecorderRef.current.stream.getTracks().forEach(track => track.stop())
        }
    }

    // Poll for updates when processing
    React.useEffect(() => {
        if (status !== "processing" || !jobResult?.id) return;

        const interval = setInterval(async () => {
            const { data } = await supabase.from('jobs').select('*').eq('id', jobResult.id).single();
            if (data) {
                const jobData = data as any;
                if (jobData.status === 'completed') {
                    setJobResult(jobData);
                    setStatus('completed');
                    clearInterval(interval);
                } else if (jobData.status === 'failed') {
                    setStatus('failed');
                    clearInterval(interval);
                }
            }
        }, 3000);

        return () => clearInterval(interval);
    }, [status, jobResult]);


    // Mock themes - in real app would fetch from DB
    const themes = [
        { id: "theme-neon-hype", name: "Neon Hype", color: "#00f3ff" },
        { id: "theme-corporate-clean", name: "Corporate Clean", color: "#ffffff" },
        { id: "theme-minimal-dark", name: "Minimal Dark", color: "#171717" },
    ]

    const handleSurpriseMe = () => {
        const randomTheme = themes[Math.floor(Math.random() * themes.length)]
        setThemeId(randomTheme.id)
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)
        setStatus("submitting")

        try {
            console.log("Validating form...");
            // 1. Validate Form
            if (!targetUrl) throw new Error("Target URL is required");

            let finalInputSignal = "";

            if (instructionType === "text") {
                if (!textInstructions.trim()) throw new Error("Please enter instructions.");
                finalInputSignal = `text://${textInstructions}`;
            } else {
                if (!audioFile) throw new Error("Please upload an audio file.");
                const fileName = `${Date.now()}-${audioFile.name}`
                finalInputSignal = `https://mock-storage.com/${fileName}`;
            }

            // 2. Encrypt Credentials
            console.log("Encrypting credentials...");
            const encryptedCreds = await encryptPassword(password)

            // 3. Submit Job
            console.log("Sending to Supabase...");
            // @ts-ignore
            const { data, error } = await supabase.from('jobs').insert({
                target_url: targetUrl,
                theme_id: themeId || "default-neon", // fallback
                input_audio_url: finalInputSignal,
                encrypted_credentials: encryptedCreds,
                status: 'pending',
            }).select().single()

            if (error) {
                console.error("Supabase Error:", error);
                throw new Error(`Supabase Error: ${error.message}`);
            }

            console.log("Success:", data);
            setJobResult(data);
            setStatus("processing");
            // Alert removed to prevent UI blocking

        } catch (err: any) {
            console.error(err);
            setStatus("idle");
            // Only alert critical errors if needed, or use a toast. Keeping it simple for now.
            alert("Error: " + err.message);
        } finally {
            setLoading(false)
        }
    }

    if (status === "completed" && jobResult?.artifacts?.final_video_path) {
        return (
            <Card className="w-full max-w-2xl mx-auto border-green-500/50 bg-green-950/20 backdrop-blur-xl animate-in zoom-in duration-500">
                <CardHeader>
                    <CardTitle className="text-3xl text-center text-green-400">MISSION ACCOMPLISHED</CardTitle>
                    <CardDescription className="text-center text-green-200/70">Video generated successfully.</CardDescription>
                </CardHeader>
                <CardContent className="flex flex-col items-center gap-6 py-10">
                    <div className="w-24 h-24 rounded-full bg-green-500/20 flex items-center justify-center animate-pulse">
                        <Upload className="w-10 h-10 text-green-400 rotate-180" />
                    </div>
                    <Button
                        size="lg"
                        className="w-full text-xl h-16 bg-green-500 hover:bg-green-400 text-black font-bold tracking-widest"
                        onClick={() => window.open(jobResult.artifacts.final_video_path, '_blank')}
                    >
                        DOWNLOAD VIDEO_EVIDENCE.MP4
                    </Button>
                    <Button variant="ghost" onClick={() => setStatus("idle")} className="text-muted-foreground">
                        Initialize New Mission
                    </Button>
                </CardContent>
            </Card>
        )
    }

    if (status === "processing") {
        return (
            <Card className="w-full max-w-2xl mx-auto border-primary/50 bg-background/80 backdrop-blur-xl">
                <CardHeader>
                    <CardTitle className="text-2xl text-center animate-pulse">AGENT IS WORKING...</CardTitle>
                    <CardDescription className="text-center font-mono">
                        Director: Planning Scrit... <br />
                        Actor: Infiltrating Target... <br />
                        Editor: Rendering Final Cut...
                    </CardDescription>
                </CardHeader>
                <CardContent className="flex justify-center py-12">
                    <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-primary"></div>
                </CardContent>
            </Card>
        )
    }

    return (
        <Card className="w-full max-w-2xl mx-auto border-primary/20 bg-background/50 backdrop-blur-xl animate-in fade-in slide-in-from-bottom-10 duration-700">
            <CardHeader>
                <CardTitle className="text-4xl text-center uppercase tracking-tighter shimmer-text">
                    Initialize <span className="text-primary">Director</span> Agent
                </CardTitle>
                <div className="text-center">
                    <span className="bg-red-500 text-white text-xs px-2 py-1 rounded font-bold tracking-widest animate-pulse">
                        SYSTEM ONLINE v2.0
                    </span>
                </div>
                <CardDescription className="text-center font-mono text-cyan-200/50">
                    Configure parameters for autonomous video generation.
                </CardDescription>
            </CardHeader>

            <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">

                    <div className="space-y-2">
                        <Label htmlFor="url">Target Application URL</Label>
                        <Input
                            id="url"
                            placeholder="https://app.example.com"
                            value={targetUrl}
                            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setTargetUrl(e.target.value)}
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="username">Username (Optional)</Label>
                            <Input
                                id="username"
                                placeholder="User Agent"
                                value={username}
                                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setUsername(e.target.value)}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="password">Password (Optional)</Label>
                            <Input
                                id="password"
                                type="password"
                                placeholder="••••••••"
                                value={password}
                                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setPassword(e.target.value)}
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label>Director Instructions</Label>
                        <Tabs defaultValue="text" onValueChange={(v) => setInstructionType(v as "text" | "audio")} className="w-full">
                            <TabsList className="grid w-full grid-cols-2">
                                <TabsTrigger value="text">Text Input</TabsTrigger>
                                <TabsTrigger value="audio">Voice Note</TabsTrigger>
                            </TabsList>
                            <TabsContent value="text" className="mt-4">
                                <Textarea
                                    placeholder="Describe the video you want directly via text... (e.g., 'Log in to Spotify and play some Jazz')"
                                    className="min-h-[100px] bg-background/50"
                                    value={textInstructions}
                                    onChange={(e) => setTextInstructions(e.target.value)}
                                />
                            </TabsContent>
                            <TabsContent value="audio" className="mt-4">
                                <div className="flex flex-col gap-4">
                                    <div className="flex items-center gap-4">
                                        <div className="relative flex-1 group">
                                            <input
                                                type="file"
                                                accept="audio/*"
                                                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                                                onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                                                    setAudioFile(e.target.files?.[0] || null)
                                                    setRecordedUrl(null)
                                                }}
                                            />
                                            <div className="flex items-center justify-center w-full h-12 border-2 border-dashed border-muted-foreground/30 rounded-none bg-muted/10 group-hover:border-primary/50 group-hover:bg-primary/5 transition-all text-xs text-muted-foreground skew-x-[-10deg]">
                                                {audioFile ? (
                                                    <span className="text-primary font-bold skew-x-[10deg]">{audioFile.name}</span>
                                                ) : (
                                                    <div className="flex items-center gap-2 skew-x-[10deg]">
                                                        <Upload className="w-4 h-4" /> <span>Upload Voice Note</span>
                                                    </div>
                                                )}
                                            </div>
                                        </div>

                                        {!isRecording ? (
                                            <Button
                                                type="button"
                                                variant="outline"
                                                className="w-12 h-12 p-0 text-red-500 hover:text-red-400 hover:bg-red-500/10 border-red-500/20"
                                                onClick={startRecording}
                                                title="Start Recording"
                                            >
                                                <Mic className="w-5 h-5" />
                                            </Button>
                                        ) : (
                                            <Button
                                                type="button"
                                                variant="solid"
                                                className="w-12 h-12 p-0 bg-red-600 hover:bg-red-700 text-white animate-pulse"
                                                onClick={stopRecording}
                                                title="Stop Recording"
                                            >
                                                <StopCircle className="w-5 h-5 fill-current" />
                                            </Button>
                                        )}
                                    </div>

                                    {recordedUrl && (
                                        <div className="w-full bg-background/50 p-2 rounded border border-primary/20">
                                            <audio src={recordedUrl} controls className="w-full h-8" />
                                        </div>
                                    )}
                                </div>
                            </TabsContent>
                        </Tabs>
                    </div>

                    <div className="space-y-2">
                        <Label>Cinematic Theme</Label>
                        <div className="flex gap-2">
                            <div className="flex-1">
                                <Select value={themeId} onValueChange={setThemeId}>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select a visual style..." />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {themes.map(theme => (
                                            <SelectItem key={theme.id} value={theme.id}>{theme.name}</SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                            <Button type="button" variant="neon" onClick={handleSurpriseMe}>
                                <Wand2 className="w-4 h-4 mr-2" />
                                Surprise
                            </Button>
                        </div>
                    </div>

                    <Button
                        type="submit"
                        className="w-full text-lg h-16 mt-4 font-bold tracking-widest bg-gradient-to-r from-primary via-accent to-secondary animate-pulse-slow hover:animate-none hover:scale-[1.01] transition-transform"
                        disabled={loading}
                    >
                        {loading ? "INITIALIZING AGENT..." : "LAUNCH DIRECTOR AGENT"}
                    </Button>
                </form>
            </CardContent>
            <CardFooter className="justify-center border-t border-primary/10 py-4">
                <p className="text-xs text-muted-foreground font-mono">SECURE CONNECTION :: ENCRYPTED :: LOGGING DISABLED</p>
            </CardFooter>
        </Card>
    )
}
