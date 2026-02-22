import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import { createServerClient } from "@supabase/ssr"

export async function middleware(request: NextRequest) {
  const url = request.nextUrl
  
  // Create Supabase client for middleware
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
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        set(_name: string, _value: string, _options: { [key: string]: unknown }) {
          // Cookies will be handled by the response
        },
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        remove(_name: string, _options: { [key: string]: unknown }) {
          // Cookies will be handled by the response
        },
      },
    }
  )
  
  const {
    data: { session },
  } = await supabase.auth.getSession()

  const isAuthed = !!session
  const pathname = url.pathname

  if (pathname.startsWith("/dashboard") && !isAuthed) {
    const redirectUrl = new URL("/login", request.url)
    redirectUrl.searchParams.set("redirect", pathname)
    return NextResponse.redirect(redirectUrl)
  }

  if (pathname === "/login" && isAuthed) {
    const to = new URL("/dashboard", request.url)
    return NextResponse.redirect(to)
  }

  return NextResponse.next()
}

export const config = {
  matcher: ["/dashboard/:path*", "/login", "/auth/:path*"],
}