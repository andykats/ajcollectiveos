import { NextRequest, NextResponse } from "next/server"
import { getSupabaseServer } from "@/lib/supabase/server"
import { v4 as uuidv4 } from "uuid"

// Configure upload settings
const MAX_FILE_SIZE = 5 * 1024 * 1024 // 5MB
const ALLOWED_TYPES = ["image/jpeg", "image/jpg", "image/png", "image/webp"]
const BUCKET_NAME = "avatars"

// Simple token generation function
function generateToken(): string {
  return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15)
}

// Ensure bucket exists and is configured
async function ensureBucketExists(supabase: Awaited<ReturnType<typeof getSupabaseServer>>) {
  try {
    // Check if bucket exists
    const { data: buckets, error: listError } = await supabase
      .storage
      .listBuckets()

    if (listError) {
      console.error("Error listing buckets:", listError)
      return false
    }

    const bucketExists = buckets?.some((bucket: { name: string }) => bucket.name === BUCKET_NAME)

    if (!bucketExists) {
      console.log(`Bucket ${BUCKET_NAME} does not exist. Attempting to create it...`)
      
      // Try to create the bucket
      try {
        const { error: createError } = await supabase.storage.createBucket(BUCKET_NAME, {
          public: true,
          fileSizeLimit: '5MB',
          allowedMimeTypes: ALLOWED_TYPES
        })

        if (createError) {
          console.error("Error creating bucket:", createError)
          console.log(`Failed to create bucket ${BUCKET_NAME}. Please create it manually in the Supabase dashboard.`)
          return false
        }

        console.log(`Successfully created bucket ${BUCKET_NAME}`)
        return true
      } catch (createError) {
        console.error("Exception while creating bucket:", createError)
        console.log(`Failed to create bucket ${BUCKET_NAME}. Please create it manually in the Supabase dashboard.`)
        return false
      }
    }

    return true
  } catch (error) {
    console.error("Error checking bucket:", error)
    return false
  }
}

export async function POST(request: NextRequest) {
  try {
    const supabase = await getSupabaseServer()
    
    // Check authentication
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    
    if (authError || !user) {
      return NextResponse.json({ 
        error: "Unauthorized" 
      }, { status: 401 })
    }

    // Ensure bucket exists
    const bucketExists = await ensureBucketExists(supabase)
    if (!bucketExists) {
      return NextResponse.json({ 
        error: "Storage bucket not configured" 
      }, { status: 500 })
    }

    const formData = await request.formData()
    const file = formData.get("file") as File

    if (!file) {
      return NextResponse.json({ 
        error: "No file provided" 
      }, { status: 400 })
    }

    // Validate file type
    if (!ALLOWED_TYPES.includes(file.type)) {
      return NextResponse.json({ 
        error: "Invalid file type. Only JPEG, PNG, and WebP are allowed." 
      }, { status: 400 })
    }

    // Validate file size
    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json({ 
        error: "File too large. Maximum size is 5MB." 
      }, { status: 400 })
    }

    // Generate unique filename
    const fileExtension = file.name.split('.').pop()
    const fileName = `${user.id}-${uuidv4()}.${fileExtension}`
    const filePath = fileName

    // Convert file to buffer for upload
    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)

    // Upload to Supabase Storage
    const { error: uploadError } = await supabase.storage
      .from(BUCKET_NAME)
      .upload(filePath, buffer, {
        contentType: file.type,
        upsert: true
      })

    if (uploadError) {
      console.error("Upload error:", uploadError)
      return NextResponse.json({ 
        error: "Failed to upload file" 
      }, { status: 500 })
    }

    // Get public URL
    const { data: { publicUrl } } = supabase.storage
      .from(BUCKET_NAME)
      .getPublicUrl(filePath)

    // Update user metadata with new avatar URL
    const { error: updateError } = await supabase.auth.updateUser({
      data: { avatar_url: publicUrl }
    })

    if (updateError) {
      console.error("Update user error:", updateError)
      return NextResponse.json({ 
        error: "Failed to update user avatar" 
      }, { status: 500 })
    }

    // Return success response
    return NextResponse.json({
      token: generateToken(),
      avatar_url: publicUrl
    })

  } catch (error) {
    console.error("Avatar upload error:", error)
    return NextResponse.json({ 
      error: "Internal server error" 
    }, { status: 500 })
  }
}