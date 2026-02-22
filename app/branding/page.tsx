"use client"

import { useState, useEffect } from "react"
import { AppSidebar } from "@/components/app-sidebar"
import { SiteHeader } from "@/components/site-header"
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { UploadIcon, SaveIcon, PaletteIcon, ImageIcon, TypeIcon } from "lucide-react"
import { getInitials } from "@/lib/utils"

interface BrandingSettings {
  appName: string
  appLogo: string | null
  appDescription: string
  primaryColor: string
  secondaryColor: string
  accentColor: string
  favicon: string | null
  customCSS: string
}

export default function BrandingPage() {
  const [loading, setLoading] = useState(false)
  const [saving, setSaving] = useState(false)
  const [currentUser, setCurrentUser] = useState<{ name: string; email: string; avatar: string } | null>(null)
  
  const [branding, setBranding] = useState<BrandingSettings>({
    appName: "AJ Collective OS",
    appLogo: null,
    appDescription: "Your all-in-one operating system for collective success",
    primaryColor: "#3b82f6",
    secondaryColor: "#8b5cf6",
    accentColor: "#10b981",
    favicon: null,
    customCSS: ""
  })

  const [logoPreview, setLogoPreview] = useState<string | null>(null)
  const [faviconPreview, setFaviconPreview] = useState<string | null>(null)

  useEffect(() => {
    // Load current user data
    const loadCurrentUser = async () => {
      try {
        const response = await fetch('/api/account')
        if (response.ok) {
          const result = await response.json()
          if (result.user) {
            setCurrentUser({
              name: result.user.name,
              email: result.user.email,
              avatar: result.user.avatar_url
            })
          }
        }
      } catch (error) {
        console.error("Error loading current user:", error)
      }
    }

    loadCurrentUser()
  }, [])

  const handleLogoUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (e) => {
        const result = e.target?.result as string
        setLogoPreview(result)
        setBranding(prev => ({ ...prev, appLogo: result }))
      }
      reader.readAsDataURL(file)
    }
  }

  const handleFaviconUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (e) => {
        const result = e.target?.result as string
        setFaviconPreview(result)
        setBranding(prev => ({ ...prev, favicon: result }))
      }
      reader.readAsDataURL(file)
    }
  }

  const handleSave = async () => {
    setSaving(true)
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      // Here you would typically save to your backend
      console.log('Saving branding settings:', branding)
      
      // Show success message or notification
      alert('Branding settings saved successfully!')
    } catch (error) {
      console.error('Error saving branding settings:', error)
      alert('Failed to save branding settings')
    } finally {
      setSaving(false)
    }
  }

  const resetToDefault = () => {
    setBranding({
      appName: "AJ Collective OS",
      appLogo: null,
      appDescription: "Your all-in-one operating system for collective success",
      primaryColor: "#3b82f6",
      secondaryColor: "#8b5cf6",
      accentColor: "#10b981",
      favicon: null,
      customCSS: ""
    })
    setLogoPreview(null)
    setFaviconPreview(null)
  }

  return (
    <SidebarProvider
      style={{
        "--sidebar-width": "calc(var(--spacing) * 72)",
        "--header-height": "calc(var(--spacing) * 12)",
      } as React.CSSProperties
    }>
      <AppSidebar variant="inset" />
      <SidebarInset>
        <SiteHeader />
        <div className="flex flex-1 flex-col">
          <div className="@container/main flex flex-1 flex-col gap-2">
            <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
              <div className="px-4 lg:px-6">
                <div className="mb-6">
                  <h1 className="text-3xl font-bold tracking-tight">Branding</h1>
                  <p className="text-muted-foreground">
                    Customize the appearance and identity of your application.
                  </p>
                </div>

                <div className="grid gap-6">
                  {/* App Identity */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <TypeIcon className="h-5 w-5" />
                        App Identity
                      </CardTitle>
                      <CardDescription>
                        Set your application name, description, and logo
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="grid gap-2">
                        <Label htmlFor="appName">Application Name</Label>
                        <Input
                          id="appName"
                          value={branding.appName}
                          onChange={(e) => setBranding(prev => ({ ...prev, appName: e.target.value }))}
                          placeholder="Enter your app name"
                        />
                      </div>
                      
                      <div className="grid gap-2">
                        <Label htmlFor="appDescription">Application Description</Label>
                        <Textarea
                          id="appDescription"
                          value={branding.appDescription}
                          onChange={(e) => setBranding(prev => ({ ...prev, appDescription: e.target.value }))}
                          placeholder="Brief description of your app"
                          rows={3}
                        />
                      </div>

                      <div className="grid gap-2">
                        <Label>Application Logo</Label>
                        <div className="flex items-center gap-4">
                          <Avatar className="h-16 w-16">
                            <AvatarImage 
                              src={logoPreview || branding.appLogo || undefined} 
                              alt="App Logo" 
                            />
                            <AvatarFallback className="text-lg font-bold">
                              {getInitials(branding.appName)}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <Input
                              type="file"
                              accept="image/*"
                              onChange={handleLogoUpload}
                              className="mb-2"
                            />
                            <p className="text-sm text-muted-foreground">
                              Recommended: 512x512px, PNG or JPG
                            </p>
                          </div>
                        </div>
                      </div>

                      <div className="grid gap-2">
                        <Label>Favicon</Label>
                        <div className="flex items-center gap-4">
                          <div className="h-8 w-8 rounded-md border flex items-center justify-center bg-white">
                            {faviconPreview || branding.favicon ? (
                              <img 
                                src={faviconPreview || branding.favicon || ""} 
                                alt="Favicon" 
                                className="h-6 w-6"
                              />
                            ) : (
                              <ImageIcon className="h-4 w-4 text-muted-foreground" />
                            )}
                          </div>
                          <div>
                            <Input
                              type="file"
                              accept="image/*"
                              onChange={handleFaviconUpload}
                              className="mb-2"
                            />
                            <p className="text-sm text-muted-foreground">
                              Recommended: 32x32px, ICO or PNG format
                            </p>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Color Scheme */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <PaletteIcon className="h-5 w-5" />
                        Color Scheme
                      </CardTitle>
                      <CardDescription>
                        Customize your brand colors
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="grid gap-2">
                        <Label htmlFor="primaryColor">Primary Color</Label>
                        <div className="flex gap-2">
                          <Input
                            id="primaryColor"
                            type="color"
                            value={branding.primaryColor}
                            onChange={(e) => setBranding(prev => ({ ...prev, primaryColor: e.target.value }))}
                            className="w-16 h-10 p-1"
                          />
                          <Input
                            value={branding.primaryColor}
                            onChange={(e) => setBranding(prev => ({ ...prev, primaryColor: e.target.value }))}
                            placeholder="#3b82f6"
                            className="flex-1"
                          />
                        </div>
                      </div>

                      <div className="grid gap-2">
                        <Label htmlFor="secondaryColor">Secondary Color</Label>
                        <div className="flex gap-2">
                          <Input
                            id="secondaryColor"
                            type="color"
                            value={branding.secondaryColor}
                            onChange={(e) => setBranding(prev => ({ ...prev, secondaryColor: e.target.value }))}
                            className="w-16 h-10 p-1"
                          />
                          <Input
                            value={branding.secondaryColor}
                            onChange={(e) => setBranding(prev => ({ ...prev, secondaryColor: e.target.value }))}
                            placeholder="#8b5cf6"
                            className="flex-1"
                          />
                        </div>
                      </div>

                      <div className="grid gap-2">
                        <Label htmlFor="accentColor">Accent Color</Label>
                        <div className="flex gap-2">
                          <Input
                            id="accentColor"
                            type="color"
                            value={branding.accentColor}
                            onChange={(e) => setBranding(prev => ({ ...prev, accentColor: e.target.value }))}
                            className="w-16 h-10 p-1"
                          />
                          <Input
                            value={branding.accentColor}
                            onChange={(e) => setBranding(prev => ({ ...prev, accentColor: e.target.value }))}
                            placeholder="#10b981"
                            className="flex-1"
                          />
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Custom CSS */}
                  <Card>
                    <CardHeader>
                      <CardTitle>Custom CSS</CardTitle>
                      <CardDescription>
                        Add custom CSS to further customize your branding
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="grid gap-2">
                        <Label htmlFor="customCSS">Custom Styles</Label>
                        <Textarea
                          id="customCSS"
                          value={branding.customCSS}
                          onChange={(e) => setBranding(prev => ({ ...prev, customCSS: e.target.value }))}
                          placeholder="Enter custom CSS here..."
                          rows={6}
                          className="font-mono text-sm"
                        />
                      </div>
                    </CardContent>
                  </Card>

                  {/* Preview */}
                  <Card>
                    <CardHeader>
                      <CardTitle>Preview</CardTitle>
                      <CardDescription>
                        See how your branding looks in the application
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="rounded-lg border bg-gradient-to-br from-gray-50 to-gray-100 p-6">
                        <div className="flex items-center gap-3 mb-4">
                          <Avatar className="h-12 w-12">
                            <AvatarImage src={logoPreview || branding.appLogo || undefined} alt={branding.appName} />
                            <AvatarFallback className="text-xl font-bold" style={{ backgroundColor: branding.primaryColor }}>
                              {getInitials(branding.appName)}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <h3 className="text-xl font-bold" style={{ color: branding.primaryColor }}>
                              {branding.appName}
                            </h3>
                            <p className="text-sm text-muted-foreground">
                              {branding.appDescription}
                            </p>
                          </div>
                        </div>
                        
                        <div className="flex gap-2 mb-4">
                          <div 
                            className="h-8 w-8 rounded-full border-2 border-white shadow-sm"
                            style={{ backgroundColor: branding.primaryColor }}
                            title="Primary Color"
                          />
                          <div 
                            className="h-8 w-8 rounded-full border-2 border-white shadow-sm"
                            style={{ backgroundColor: branding.secondaryColor }}
                            title="Secondary Color"
                          />
                          <div 
                            className="h-8 w-8 rounded-full border-2 border-white shadow-sm"
                            style={{ backgroundColor: branding.accentColor }}
                            title="Accent Color"
                          />
                        </div>

                        <div className="flex gap-2">
                          <Button style={{ backgroundColor: branding.primaryColor }}>
                            Primary Button
                          </Button>
                          <Button variant="outline" style={{ borderColor: branding.secondaryColor, color: branding.secondaryColor }}>
                            Secondary Button
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                <div className="flex gap-2 mt-6">
                  <Button onClick={handleSave} disabled={saving}>
                    <SaveIcon className="mr-2 h-4 w-4" />
                    {saving ? "Saving..." : "Save Changes"}
                  </Button>
                  <Button variant="outline" onClick={resetToDefault}>
                    Reset to Default
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}