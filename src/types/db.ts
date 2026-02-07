export type Json =
    | string
    | number
    | boolean
    | null
    | { [key: string]: Json | undefined }
    | Json[]

export type JobStatus = 'pending' | 'processing' | 'completed' | 'failed'

export interface Job {
    id: string
    user_id: string
    status: JobStatus
    input_audio_url: string | null
    target_url: string
    theme_id: string
    encrypted_credentials: {
        iv: string
        ciphertext: string
    }
    artifacts: {
        logs?: string[]
        timeline?: any // Will be DirectorScript
        final_video_url?: string
    } | null
    created_at: string
}

export interface Theme {
    id: string
    name: string
    tags: string[]
    config: Json
    font_family: string
    primary_color: string
    accent_color: string
    music_keywords: string[]
    voice_style: string
    animation_curve: string
    zoom_aggression: number
}

// Supabase Database Type Helper
export type Database = {
    public: {
        Tables: {
            jobs: {
                Row: Job
                Insert: Omit<Job, 'id' | 'created_at'>
                Update: Partial<Omit<Job, 'id' | 'created_at'>>
                Relationships: []
            }
            themes: {
                Row: Theme
                Insert: Omit<Theme, 'id'>
                Update: Partial<Omit<Theme, 'id'>>
                Relationships: []
            }
        }
        Views: {
            [_ in never]: never
        }
        Functions: {
            [_ in never]: never
        }
        Enums: {
            [_ in never]: never
        }
        CompositeTypes: {
            [_ in never]: never
        }
    }
}
