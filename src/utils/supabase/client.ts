import { createClient } from '@supabase/supabase-js';
import { Database } from '@/types/db';

// Fallback to placeholder for build time (avoids "supabaseUrl is required" error on Vercel)
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://placeholder.supabase.co";
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "mock-key";

export const supabase = createClient<Database>(supabaseUrl, supabaseKey);
