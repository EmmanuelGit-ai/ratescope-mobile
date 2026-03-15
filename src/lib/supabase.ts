// Supabase Client
// Single instance for all RateScope database queries

import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://tbhntzndvtgyckwoblte.supabase.co";
const supabaseAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRiaG50em5kdnRneWNrd29ibHRlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzM0NzQ2NzAsImV4cCI6MjA4OTA1MDY3MH0.Iofky9Wer--4YR2zVc40EVPFM6rRnwWRUlFFbNVbgFE";

export const supabaseConfigured = true;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
