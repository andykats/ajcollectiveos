import { cookies } from "next/headers"
import { createServerClient } from "@supabase/ssr"

export async function getSupabaseServer() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  if (!url || !key) {
    throw new Error("Missing NEXT_PUBLIC_SUPABASE_URL or NEXT_PUBLIC_SUPABASE_ANON_KEY")
  }
  
  const cookieStore = await cookies()
  return createServerClient(url, key, {
    cookies: {
      get(name: string) {
        return cookieStore.get(name)?.value
      },
      set(name: string, value: string, options: { [key: string]: unknown }) {
        cookieStore.set({ name, value, ...options })
      },
      remove(name: string, options: { [key: string]: unknown }) {
        cookieStore.set({ name, value: '', ...options })
      },
    },
  })
}
