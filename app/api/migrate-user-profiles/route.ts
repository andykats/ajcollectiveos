import { createServerClient } from "@supabase/ssr"
import { cookies } from "next/headers"

/**
 * Migration utility to transfer user data from auth.users.user_metadata to user_profiles table
 * This function should be called once to migrate existing data
 */
export async function migrateUserMetadataToProfiles() {
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

    // Get all users with metadata
    const { data: users, error } = await supabase.auth.admin.listUsers()
    
    if (error) {
      console.error("Error fetching users:", error)
      return { success: false, error: "Failed to fetch users" }
    }

    let migratedCount = 0
    let skippedCount = 0
    let errorCount = 0

    for (const user of users.users) {
      try {
        // Check if profile already exists
        const { data: existingProfile } = await supabase
          .from('user_profiles')
          .select('id')
          .eq('user_id', user.id)
          .single()

        if (existingProfile) {
          skippedCount++
          continue
        }

        // Create profile from user metadata
        const { error: profileError } = await supabase
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

        if (profileError) {
          console.error(`Error migrating user ${user.id}:`, profileError)
          errorCount++
        } else {
          migratedCount++
        }
      } catch (err) {
        console.error(`Error processing user ${user.id}:`, err)
        errorCount++
      }
    }

    return {
      success: true,
      migratedCount,
      skippedCount,
      errorCount
    }
  } catch (error) {
    console.error("Migration error:", error)
    return { success: false, error: "Migration failed" }
  }
}

/**
 * One-time API endpoint to trigger migration
 * This should be called only once to migrate existing data
 */
export async function POST() {
  try {
    // This is a one-time operation - you might want to add authentication here
    // to ensure only admins can run this migration
    
    const result = await migrateUserMetadataToProfiles()
    
    if (result.success) {
      return Response.json({
        success: true,
        message: "Migration completed successfully",
        details: {
          migratedCount: result.migratedCount,
          skippedCount: result.skippedCount,
          errorCount: result.errorCount
        }
      })
    } else {
      return Response.json({
        success: false,
        error: result.error
      }, { status: 500 })
    }
  } catch (error) {
    console.error("Migration API error:", error)
    return Response.json({
      success: false,
      error: "Internal server error"
    }, { status: 500 })
  }
}