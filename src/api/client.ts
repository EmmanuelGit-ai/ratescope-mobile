// Supabase API Client
// Re-exports the Supabase client and shared error class for all API modules

import { supabase, supabaseConfigured } from "../lib/supabase";
import type { PostgrestError } from "@supabase/supabase-js";

export { supabase, supabaseConfigured };

export class ApiError extends Error {
  code: string;
  constructor(code: string, message: string) {
    super(message);
    this.code = code;
    this.name = "ApiError";
  }
}

export function handleSupabaseError(error: PostgrestError): never {
  throw new ApiError(error.code, error.message);
}
