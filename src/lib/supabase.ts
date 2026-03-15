// Supabase Client
// Single instance for all RateScope database queries

import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL ?? "";
const supabaseAnonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY ?? "";

// DEBUG: log whether env vars are loaded (without exposing values)
console.log("[supabase] URL loaded:", supabaseUrl ? `${supabaseUrl.substring(0, 30)}...` : "MISSING");
console.log("[supabase] Key loaded:", supabaseAnonKey ? "yes (length " + supabaseAnonKey.length + ")" : "MISSING");

if (!supabaseUrl || !supabaseAnonKey) {
  console.error("[supabase] FATAL: Missing EXPO_PUBLIC_SUPABASE_URL or EXPO_PUBLIC_SUPABASE_ANON_KEY");
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
