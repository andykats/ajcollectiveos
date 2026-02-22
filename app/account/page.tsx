"use client"

import { useState, useEffect } from "react"
import { AppSidebar } from "@/components/app-sidebar"
import { SiteHeader } from "@/components/site-header"
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { SaveIcon, ArrowLeftIcon, UploadIcon } from "lucide-react"
import Link from "next/link"
import { getInitials } from "@/lib/utils"
import { AvatarCropper } from "@/components/avatar-cropper"

interface UserData {
  id: string
  email: string
  name: string
  avatar_url: string
}

export default function AccountSettings() {
  const [user, setUser] = useState<UserData | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    avatar_url: ""
  })
  const [avatarFile, setAvatarFile] = useState<File | null>(null)
  const [avatarPreview, setAvatarPreview] = useState<string>("")
  const [cropDialogOpen, setCropDialogOpen] = useState(false)
  const [imageToCrop, setImageToCrop] = useState<string>("")

  useEffect(() => {
    const loadUser = async () => {
      try {
        const response = await fetch('/api/account')
        
        if (response.status === 401) {
          // Redirect to login if not authenticated
          window.location.href = '/login?redirect=/account'
          return
        }
        
        if (response.ok) {
          const result = await response.json()
          if (result.token) {
            setUser(result.user)
            setFormData({
              name: result.user.name || "",
              email: result.user.email || "",
              avatar_url: result.user.avatar_url || ""
            })
          } else {
            console.error("Invalid token received")
          }
        } else {
          console.error("Failed to load user data")
        }
      } catch (error) {
        console.error("Error loading user:", error)
      } finally {
        setLoading(false)
      }
    }
    
    loadUser()
  }, [])

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const handleAvatarFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      // Create preview URL for cropping
      const reader = new FileReader()
      reader.onload = (e) => {
        const result = e.target?.result as string
        setImageToCrop(result)
        setCropDialogOpen(true)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleCropComplete = (croppedFile: File) => {
    setAvatarFile(croppedFile)
    // Create preview URL for the cropped image
    const reader = new FileReader()
    reader.onload = (e) => {
      const result = e.target?.result as string
      setAvatarPreview(result)
      setFormData(prev => ({ ...prev, avatar_url: result }))
    }
    reader.readAsDataURL(croppedFile)
  }

  const uploadAvatar = async (file: File): Promise<string> => {
    const formData = new FormData()
    formData.append('file', file)

    const response = await fetch('/api/account/avatar', {
      method: 'POST',
      body: formData,
    })

    if (!response.ok) {
      throw new Error('Failed to upload avatar')
    }

    const result = await response.json()
    return result.avatar_url
  }

  const handleSave = async () => {
    setSaving(true)
    try {
      let avatarUrl = formData.avatar_url

      // Upload avatar file if selected
      if (avatarFile) {
        try {
          setUploading(true)
          avatarUrl = await uploadAvatar(avatarFile)
        } catch (error) {
          console.error('Error uploading avatar:', error)
          alert('Failed to upload avatar image')
          return
        } finally {
          setUploading(false)
        }
      }

      const response = await fetch('/api/account', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: formData.name,
          avatar_url: avatarUrl
        }),
      })

      if (response.ok) {
        const result = await response.json()
        if (result.token) {
          alert("Profile updated successfully!")
          // Update the user data with the response
          setUser(result.user)
          // Clear file and preview after successful save
          setAvatarFile(null)
          setAvatarPreview("")
        } else {
          alert("Invalid token received")
        }
      } else {
        const error = await response.json()
        alert("Error updating profile: " + error.error)
      }
    } catch (error) {
      console.error("Error updating profile:", error)
      alert("Error updating profile")
    } finally {
      setSaving(false)
    }
  }

  const getAvatarSource = () => {
    if (avatarPreview) return avatarPreview
    if (formData.avatar_url) return formData.avatar_url
    return "/avatars/shadcn.svg"
  }

  if (loading) {
    return (
      <SidebarProvider
        style={
          {
            "--sidebar-width": "calc(var(--spacing) * 72)",
            "--header-height": "calc(var(--spacing) * 12)",
          } as React.CSSProperties
        }
      >
        <AppSidebar variant="inset" />
        <SidebarInset>
          <SiteHeader />
          <div className="flex flex-1 flex-col">
            <div className="@container/main flex flex-1 flex-col gap-2">
              <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
                <div className="px-4 lg:px-6">
                  <p>Loading...</p>
                </div>
              </div>
            </div>
          </div>
        </SidebarInset>
      </SidebarProvider>
    )
  }

  if (!user) {
    return (
      <SidebarProvider
        style={
          {
            "--sidebar-width": "calc(var(--spacing) * 72)",
            "--header-height": "calc(var(--spacing) * 12)",
          } as React.CSSProperties
        }
      >
        <AppSidebar variant="inset" />
        <SidebarInset>
          <SiteHeader />
          <div className="flex flex-1 flex-col">
            <div className="@container/main flex flex-1 flex-col gap-2">
              <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
                <div className="px-4 lg:px-6">
                  <p>Please log in to access account settings.</p>
                </div>
              </div>
            </div>
          </div>
        </SidebarInset>
      </SidebarProvider>
    )
  }

  return (
    <SidebarProvider
      style={
        {
          "--sidebar-width": "calc(var(--spacing) * 72)",
          "--header-height": "calc(var(--spacing) * 12)",
        } as React.CSSProperties
      }
    >
      <AppSidebar variant="inset" />
      <SidebarInset>
        <SiteHeader />
        <div className="flex flex-1 flex-col">
          <div className="@container/main flex flex-1 flex-col gap-2">
            <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
              {/* Avatar Cropper Dialog */}
              <AvatarCropper
                imageSrc={imageToCrop}
                open={cropDialogOpen}
                onOpenChange={setCropDialogOpen}
                onCropComplete={handleCropComplete}
                aspect={1} // Square crop
                minWidth={200}
                minHeight={200}
              />
              
              {/* Header */}
              <div className="px-4 lg:px-6">
                <div className="flex items-center gap-4 mb-6">
                  <Link href="/dashboard">
                    <Button variant="ghost" size="icon">
                      <ArrowLeftIcon className="h-4 w-4" />
                    </Button>
                  </Link>
                  <div>
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Account Settings</h1>
                    <p className="text-gray-600 dark:text-gray-300">Manage your account information and preferences</p>
                  </div>
                </div>
              </div>

              {/* Account Settings Content */}
              <div className="px-4 lg:px-6">
                <div className="grid gap-6">
                  {/* Profile Information */}
                  <Card>
                    <CardHeader>
                      <CardTitle>Profile Information</CardTitle>
                      <CardDescription>Update your personal information</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="flex items-center gap-4 mb-4">
                        <Avatar className="h-16 w-16">
                          <AvatarImage src={getAvatarSource()} alt={formData.name} />
                          <AvatarFallback className="text-lg">
                            {getInitials(formData.name)}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex flex-col gap-2">
                          <div className="flex gap-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => document.getElementById('avatar-upload')?.click()}
                              disabled={uploading}
                            >
                              <UploadIcon className="h-4 w-4 mr-1" />
                              {uploading ? 'Uploading...' : 'Upload Image'}
                            </Button>
                            {avatarPreview && (
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => {
                                  setAvatarFile(null)
                                  setAvatarPreview("")
                                  setFormData(prev => ({ ...prev, avatar_url: user?.avatar_url || "" }))
                                }}
                              >
                                Cancel
                              </Button>
                            )}
                          </div>
                          <Input
                            id="avatar-upload"
                            type="file"
                            accept="image/*"
                            onChange={handleAvatarFileChange}
                            className="hidden"
                          />
                          <Label htmlFor="avatar_url" className="text-sm text-gray-600">Or enter image URL:</Label>
                          <Input
                            id="avatar_url"
                            value={formData.avatar_url}
                            onChange={(e) => handleInputChange('avatar_url', e.target.value)}
                            placeholder="https://example.com/avatar.jpg"
                            className="text-sm"
                          />
                        </div>
                      </div>
                      
                      <div>
                        <Label htmlFor="name">Full Name</Label>
                        <Input
                          id="name"
                          value={formData.name}
                          onChange={(e) => handleInputChange('name', e.target.value)}
                          placeholder="Enter your full name"
                        />
                      </div>
                      
                      <div>
                        <Label htmlFor="email">Email Address</Label>
                        <Input
                          id="email"
                          type="email"
                          value={formData.email}
                          disabled
                          className="bg-gray-100 dark:bg-gray-800"
                        />
                        <p className="text-sm text-gray-500 mt-1">
                          Email cannot be changed. Contact support if you need to update your email.
                        </p>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Account Security */}
                  <Card>
                    <CardHeader>
                      <CardTitle>Account Security</CardTitle>
                      <CardDescription>Manage your password and security settings</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div>
                        <Label>Password</Label>
                        <div className="flex gap-2 mt-1">
                          <Input
                            type="password"
                            value="••••••••"
                            disabled
                            className="bg-gray-100 dark:bg-gray-800"
                          />
                          <Button variant="outline">Change Password</Button>
                        </div>
                      </div>
                      
                      <div>
                        <Label>Two-Factor Authentication</Label>
                        <div className="flex items-center justify-between mt-1">
                          <span className="text-sm text-gray-600 dark:text-gray-400">
                            Add an extra layer of security to your account
                          </span>
                          <Button variant="outline" size="sm">Enable 2FA</Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Save Button */}
                  <div className="flex justify-end">
                    <Button onClick={handleSave} disabled={saving || uploading}>
                      <SaveIcon className={`h-4 w-4 mr-2 ${saving || uploading ? 'animate-spin' : ''}`} />
                      {uploading ? 'Uploading...' : saving ? 'Saving...' : 'Save Changes'}
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}