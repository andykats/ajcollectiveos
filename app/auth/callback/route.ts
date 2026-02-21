import { NextResponse } from "next/server"
import { createServerClient } from "@supabase/ssr"

export async function GET(request: Request) {
  const url = new URL(request.url)
  const code = url.searchParams.get("code")
  const redirect = url.searchParams.get("redirect") || "/dashboard"

  if (!code) {
    return NextResponse.redirect(new URL("/login", request.url))
  }

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          const cookie = request.headers.get('cookie')
          if (!cookie) return undefined
          const match = cookie.match(new RegExp(`(^| )${name}=([^;]*)`))
          return match ? match[2] : undefined
        },
        set(_name: string, _value: string, _options: { [key: string]: unknown }) {
          // Cookies will be set by the response
        },
        remove(_name: string, _options: { [key: string]: unknown }) {
          // Cookies will be removed by the response
        },
      },
    }
  )
  
  const { error } = await supabase.auth.exchangeCodeForSession(code)
  
  if (error) {
    return NextResponse.redirect(new URL("/login?error=auth_failed", request.url))
  }
  
  return NextResponse.redirect(new URL(redirect, request.url))
}
