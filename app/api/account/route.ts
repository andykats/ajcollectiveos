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
        name: user.user_metadata?.name ? `@${user.user_metadata.name}` : "",
        firstName: user.user_metadata?.firstName || "",
        lastName: user.user_metadata?.lastName || "",
        avatar_url: user.user_metadata?.avatar_url || "",
        phone: user.user_metadata?.phone || "",
        whatsapp: user.user_metadata?.whatsapp || "",
        birthday: user.user_metadata?.birthday || "",
        company: user.user_metadata?.company || "",
        country: user.user_metadata?.country || "",
        phoneCountryCode: user.user_metadata?.phoneCountryCode || "",
        phoneNumber: user.user_metadata?.phoneNumber || "",
        whatsappCountryCode: user.user_metadata?.whatsappCountryCode || "",
        whatsappNumber: user.user_metadata?.whatsappNumber || ""
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
    const { name, firstName, lastName, avatar_url, phone, whatsapp, birthday, company, country, phoneCountryCode, phoneNumber, whatsappCountryCode, whatsappNumber } = body

    // Update user metadata
    const { data, error: updateError } = await supabase.auth.updateUser({
      data: {
        name,
        firstName,
        lastName,
        avatar_url,
        phone,
        whatsapp,
        birthday,
        company,
        country,
        phoneCountryCode,
        phoneNumber,
        whatsappCountryCode,
        whatsappNumber
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
        name: data.user.user_metadata?.name ? `@${data.user.user_metadata.name}` : "",
        firstName: data.user.user_metadata?.firstName || "",
        lastName: data.user.user_metadata?.lastName || "",
        avatar_url: data.user.user_metadata?.avatar_url || "",
        phone: data.user.user_metadata?.phone || "",
        whatsapp: data.user.user_metadata?.whatsapp || "",
        birthday: data.user.user_metadata?.birthday || "",
        company: data.user.user_metadata?.company || "",
        country: data.user.user_metadata?.country || "",
        phoneCountryCode: data.user.user_metadata?.phoneCountryCode || "",
        phoneNumber: data.user.user_metadata?.phoneNumber || "",
        whatsappCountryCode: data.user.user_metadata?.whatsappCountryCode || "",
        whatsappNumber: data.user.user_metadata?.whatsappNumber || ""
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