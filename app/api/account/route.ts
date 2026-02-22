import { NextRequest, NextResponse } from "next/server"
import { createServerClient } from "@supabase/ssr"
import { cookies } from "next/headers"

export async function GET() {
  try {
    const cookieStore = await cookies()
    
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          get(name: string) {
            return cookieStore.get(name)?.value
          },
        },
      }
    )

    const { data: { user }, error } = await supabase.auth.getUser()
    
    if (error || !user) {
      return NextResponse.json({ 
        error: "Not authenticated",
        token: null 
      }, { status: 401 })
    }

    // Get the current session token
    const { data: { session } } = await supabase.auth.getSession()
    
    return NextResponse.json({
      token: session?.access_token || null,
      user: {
        id: user.id,
        email: user.email,
        name: user.user_metadata?.name || "",
        avatar_url: user.user_metadata?.avatar_url || ""
      }
    })
  } catch (error) {
    console.error("Error fetching user:", error)
    return NextResponse.json({ 
      error: "Internal server error",
      token: null 
    }, { status: 500 })
  }
}

export async function PUT(request: NextRequest) {
  try {
    const cookieStore = await cookies()
    
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          get(name: string) {
            return cookieStore.get(name)?.value
          },
        },
      }
    )

    const { data: { user }, error: authError } = await supabase.auth.getUser()
    
    if (authError || !user) {
      return NextResponse.json({ 
        error: "Not authenticated",
        token: null 
      }, { status: 401 })
    }

    const body = await request.json()
    const { name, avatar_url } = body

    // Update user metadata
    const { data, error: updateError } = await supabase.auth.updateUser({
      data: {
        name,
        avatar_url
      }
    })

    if (updateError) {
      return NextResponse.json({ 
        error: updateError.message,
        token: null 
      }, { status: 400 })
    }

    // Get updated session token
    const { data: { session } } = await supabase.auth.getSession()

    return NextResponse.json({
      token: session?.access_token || null,
      message: "Profile updated successfully",
      user: {
        id: data.user.id,
        email: data.user.email,
        name: data.user.user_metadata?.name || "",
        avatar_url: data.user.user_metadata?.avatar_url || ""
      }
    })
  } catch (error) {
    console.error("Error updating user:", error)
    return NextResponse.json({ 
      error: "Internal server error",
      token: null 
    }, { status: 500 })
  }
}