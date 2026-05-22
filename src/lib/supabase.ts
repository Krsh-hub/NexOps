import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://dummy.supabase.co";
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "dummy";

export const supabase = createClient(supabaseUrl, supabaseKey);

// Utility for handling Supabase single row fetches that might throw
export async function getOne<T>(query: Promise<{ data: T | null; error: any }>): Promise<T | null> {
  const { data, error } = await query;
  if (error) {
    console.error("Supabase Query Error:", error);
    return null;
  }
  return data;
}

export async function getMany<T>(query: Promise<{ data: T[] | null; error: any }>): Promise<T[]> {
  const { data, error } = await query;
  if (error) {
    console.error("Supabase Query Error:", error);
    return [];
  }
  return data || [];
}
