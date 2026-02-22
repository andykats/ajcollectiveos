import { NextRequest, NextResponse } from "next/server"
import { createServerClient } from "@supabase/ssr"
import { cookies } from "next/headers"
import { UserProfile, UserProfileUpdate } from "@/types/supabase"

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

    // Get user profile from user_profiles table
    const { data: profile, error: profileError } = await supabase
      .from('user_profiles')
      .select('*')
      .eq('user_id', user.id)
      .single()

    if (profileError && profileError.code !== 'PGRST116') { // PGRST116 = not found
      console.error("Error fetching user profile:", profileError)
      return NextResponse.json({ 
        error: "Error fetching profile",
        token: null 
      }, { status: 500 })
    }

    // Get the current session token
    const { data: { session } } = await supabase.auth.getSession()
    
    // If profile doesn't exist, create it from auth user data
    if (!profile) {
      const { data: newProfile, error: createError } = await supabase
        .from('user_profiles')
        .insert({
          user_id: user.id,
          email: user.email || '',
          first_name: user.user_metadata?.firstName || '',
          last_name: user.user_metadata?.lastName || '',
          avatar_url: user.user_metadata?.avatar_url || '',
          phone_country_code: user.user_metadata?.phoneCountryCode || '',
          phone_number: user.user_metadata?.phoneNumber || '',
          whatsapp_country_code: user.user_metadata?.whatsappCountryCode || '',
          whatsapp_number: user.user_metadata?.whatsappNumber || '',
          birthday: user.user_metadata?.birthday || null,
          company: user.user_metadata?.company || '',
          country: user.user_metadata?.country || '',
        })
        .select()
        .single()

      if (createError) {
        console.error("Error creating user profile:", createError)
        return NextResponse.json({ 
          error: "Error creating profile",
          token: null 
        }, { status: 500 })
      }

      return NextResponse.json({
        token: session?.access_token || null,
        user: {
          id: user.id,
          email: newProfile.email,
          name: newProfile.first_name || newProfile.last_name ? `@${newProfile.first_name} ${newProfile.last_name}`.trim() : "",
          firstName: newProfile.first_name || "",
          lastName: newProfile.last_name || "",
          avatar_url: newProfile.avatar_url || "",
          phone: newProfile.phone_country_code && newProfile.phone_number ? `${newProfile.phone_country_code} ${newProfile.phone_number}`.trim() : "",
          whatsapp: newProfile.whatsapp_country_code && newProfile.whatsapp_number ? `${newProfile.whatsapp_country_code} ${newProfile.whatsapp_number}`.trim() : "",
          birthday: newProfile.birthday || "",
          company: newProfile.company || "",
          country: newProfile.country || "",
          phoneCountryCode: newProfile.phone_country_code || "",
          phoneNumber: newProfile.phone_number || "",
          whatsappCountryCode: newProfile.whatsapp_country_code || "",
          whatsappNumber: newProfile.whatsapp_number || ""
        }
      })
    }
    
    return NextResponse.json({
      token: session?.access_token || null,
      user: {
        id: user.id,
        email: profile.email,
        name: profile.first_name || profile.last_name ? `@${profile.first_name} ${profile.last_name}`.trim() : "",
        firstName: profile.first_name || "",
        lastName: profile.last_name || "",
        avatar_url: profile.avatar_url || "",
        phone: profile.phone_country_code && profile.phone_number ? `${profile.phone_country_code} ${profile.phone_number}`.trim() : "",
        whatsapp: profile.whatsapp_country_code && profile.whatsapp_number ? `${profile.whatsapp_country_code} ${profile.whatsapp_number}`.trim() : "",
        birthday: profile.birthday || "",
        company: profile.company || "",
        country: profile.country || "",
        phoneCountryCode: profile.phone_country_code || "",
        phoneNumber: profile.phone_number || "",
        whatsappCountryCode: profile.whatsapp_country_code || "",
        whatsappNumber: profile.whatsapp_number || ""
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
    const { 
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
    } = body

    // Update user profile in user_profiles table
    const updateData: UserProfileUpdate = {
      first_name: firstName,
      last_name: lastName,
      avatar_url: avatar_url,
      phone_country_code: phoneCountryCode,
      phone_number: phoneNumber,
      whatsapp_country_code: whatsappCountryCode,
      whatsapp_number: whatsappNumber,
      birthday: birthday || null,
      company: company,
      country: country,
      updated_at: new Date().toISOString()
    }

    const { data: profile, error: updateError } = await supabase
      .from('user_profiles')
      .update(updateData)
      .eq('user_id', user.id)
      .select()
      .single()

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
        id: user.id,
        email: profile.email,
        name: profile.first_name || profile.last_name ? `@${profile.first_name} ${profile.last_name}`.trim() : "",
        firstName: profile.first_name || "",
        lastName: profile.last_name || "",
        avatar_url: profile.avatar_url || "",
        phone: profile.phone_country_code && profile.phone_number ? `${profile.phone_country_code} ${profile.phone_number}`.trim() : "",
        whatsapp: profile.whatsapp_country_code && profile.whatsapp_number ? `${profile.whatsapp_country_code} ${profile.whatsapp_number}`.trim() : "",
        birthday: profile.birthday || "",
        company: profile.company || "",
        country: profile.country || "",
        phoneCountryCode: profile.phone_country_code || "",
        phoneNumber: profile.phone_number || "",
        whatsappCountryCode: profile.whatsapp_country_code || "",
        whatsappNumber: profile.whatsapp_number || ""
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