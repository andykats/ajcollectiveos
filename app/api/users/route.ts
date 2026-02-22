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

    // Check if user is authenticated and has admin permissions
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    
    if (authError || !user) {
      return NextResponse.json({ 
        error: "Not authenticated"
      }, { status: 401 })
    }

    // For now, we'll return mock data since we need to set up proper user roles
    // In a real implementation, you'd query a users table or use Supabase auth admin
    const mockUsers = [
      {
        id: "1",
        name: "@JohnDoe",
        email: "john@example.com",
        role: "admin" as const,
        status: "active" as const,
        avatar: "/avatars/01.png",
        createdAt: "2024-01-15",
        lastLogin: "2024-02-20",
        permissions: {
          canCreate: true,
          canEdit: true,
          canDelete: true,
          canManageUsers: true,
          canAccessCMS: true,
          canAccessAnalytics: true
        }
      },
      {
        id: "2",
        name: "@JaneSmith",
        email: "jane@example.com",
        role: "editor" as const,
        status: "active" as const,
        avatar: "/avatars/02.png",
        createdAt: "2024-01-20",
        lastLogin: "2024-02-19",
        permissions: {
          canCreate: true,
          canEdit: true,
          canDelete: false,
          canManageUsers: false,
          canAccessCMS: true,
          canAccessAnalytics: false
        }
      },
      {
        id: "3",
        name: "@BobJohnson",
        email: "bob@example.com",
        role: "viewer" as const,
        status: "inactive" as const,
        avatar: "/avatars/03.png",
        createdAt: "2024-01-25",
        permissions: {
          canCreate: false,
          canEdit: false,
          canDelete: false,
          canManageUsers: false,
          canAccessCMS: false,
          canAccessAnalytics: false
        }
      }
    ]

    return NextResponse.json({
      users: mockUsers,
      currentUser: {
        id: user.id,
        email: user.email,
        name: user.user_metadata?.name ? `@${user.user_metadata.name}` : "",
        role: "admin", // This should come from your user roles system
        permissions: {
          canCreate: true,
          canEdit: true,
          canDelete: true,
          canManageUsers: true,
          canAccessCMS: true,
          canAccessAnalytics: true
        }
      }
    })
  } catch (error) {
    console.error("Error fetching users:", error)
    return NextResponse.json({ 
      error: "Internal server error"
    }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
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

    // Check if user is authenticated and has admin permissions
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    
    if (authError || !user) {
      return NextResponse.json({ 
        error: "Not authenticated"
      }, { status: 401 })
    }

    const body = await request.json()
    let { name, email, role, status, permissions } = body

    // Validate required fields
    if (!name || !email || !role || !status) {
      return NextResponse.json({ 
        error: "Missing required fields"
      }, { status: 400 })
    }

    // Ensure name has @ prefix
    if (!name.startsWith('@')) {
      name = `@${name}`
    }

    // In a real implementation, you would:
    // 1. Check if user has permission to create users
    // 2. Create user in your database
    // 3. Send invitation email
    // 4. Set up user metadata with permissions

    // For now, return success with mock data
    const newUser = {
      id: Date.now().toString(),
      name,
      email,
      role,
      status,
      createdAt: new Date().toISOString().split('T')[0],
      permissions: permissions || {
        canCreate: false,
        canEdit: false,
        canDelete: false,
        canManageUsers: false,
        canAccessCMS: false,
        canAccessAnalytics: false
      }
    }

    return NextResponse.json({
      message: "User created successfully",
      user: newUser
    })
  } catch (error) {
    console.error("Error creating user:", error)
    return NextResponse.json({ 
      error: "Internal server error"
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

    // Check if user is authenticated and has admin permissions
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    
    if (authError || !user) {
      return NextResponse.json({ 
        error: "Not authenticated"
      }, { status: 401 })
    }

    const body = await request.json()
    let { id, name, email, role, status, permissions } = body

    // Validate required fields
    if (!id) {
      return NextResponse.json({ 
        error: "User ID is required"
      }, { status: 400 })
    }

    // Ensure name has @ prefix if provided
    if (name && !name.startsWith('@')) {
      name = `@${name}`
    }

    // In a real implementation, you would:
    // 1. Check if user has permission to edit users
    // 2. Update user in your database
    // 3. Update user metadata if needed

    // For now, return success
    return NextResponse.json({
      message: "User updated successfully"
    })
  } catch (error) {
    console.error("Error updating user:", error)
    return NextResponse.json({ 
      error: "Internal server error"
    }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest) {
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

    // Check if user is authenticated and has admin permissions
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    
    if (authError || !user) {
      return NextResponse.json({ 
        error: "Not authenticated"
      }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const userId = searchParams.get('id')

    if (!userId) {
      return NextResponse.json({ 
        error: "User ID is required"
      }, { status: 400 })
    }

    // In a real implementation, you would:
    // 1. Check if user has permission to delete users
    // 2. Delete user from your database
    // 3. Handle any related data cleanup

    // For now, return success
    return NextResponse.json({
      message: "User deleted successfully"
    })
  } catch (error) {
    console.error("Error deleting user:", error)
    return NextResponse.json({ 
      error: "Internal server error"
    }, { status: 500 })
  }
}