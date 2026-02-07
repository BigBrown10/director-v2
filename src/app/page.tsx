import { JobForm } from "@/components/job-form"

export default function Home() {
    return (
        <main className="min-h-screen flex flex-col items-center justify-center p-4 relative overflow-hidden">
            {/* Background Elements */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-blue-900/20 via-background to-background pointer-events-none" />
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-primary to-transparent opacity-50" />
            <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-secondary to-transparent opacity-50" />

            {/* Grid Overlay already in globals.css, adding Vignette */}
            <div className="absolute inset-0 bg-[radial-gradient(transparent_0%,_#000_100%)] opacity-80 pointer-events-none" />

            <div className="z-10 w-full max-w-4xl relative">
                <div className="absolute -top-20 -left-20 w-64 h-64 bg-primary/20 rounded-full blur-[100px] pointer-events-none mix-blend-screen animate-pulse" />
                <div className="absolute -bottom-20 -right-20 w-64 h-64 bg-secondary/20 rounded-full blur-[100px] pointer-events-none mix-blend-screen animate-pulse delay-1000" />

                <header className="mb-12 text-center relative">
                    <h1 className="text-6xl md:text-8xl font-black tracking-tighter text-transparent bg-clip-text bg-gradient-to-b from-white to-white/10 drop-shadow-[0_0_30px_rgba(0,243,255,0.3)] select-none">
                        DIRECTOR
                    </h1>
                    <div className="flex items-center justify-center gap-4 mt-2">
                        <div className="h-[2px] w-12 bg-primary" />
                        <p className="font-mono text-primary tracking-[0.5em] text-sm uppercase">Autonomous Video Engine</p>
                        <div className="h-[2px] w-12 bg-primary" />
                    </div>
                </header>

                <JobForm />
            </div>
        </main>
    )
}
