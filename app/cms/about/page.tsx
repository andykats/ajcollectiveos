"use client"

import { useState, useEffect } from "react"
import { AppSidebar } from "@/components/app-sidebar"
import { SiteHeader } from "@/components/site-header"
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { SaveIcon, EyeIcon, ArrowLeftIcon } from "lucide-react"
import Link from "next/link"

export default function AboutEditor() {
  const [content, setContent] = useState({
    title: "About Us",
    subtitle: "Learn more about our company and mission",
    missionTitle: "Our Mission",
    missionText: "AJ Collective OS is designed to empower collectives, cooperatives, and collaborative organizations with powerful tools to manage their operations, track performance, and foster team collaboration.",
    visionTitle: "Our Vision",
    visionText: "We envision a world where collaborative organizations can operate efficiently and effectively, leveraging technology to amplify their impact and achieve their collective goals.",
    valuesTitle: "Our Values",
    valuesText: "Collaboration, Transparency, Innovation, and Community Impact are at the core of everything we do.",
    teamTitle: "Our Team",
    teamText: "We are a diverse group of professionals dedicated to building tools that make collaboration easier and more effective."
  })

  const [isSaving, setIsSaving] = useState(false)
  const [lastSaved, setLastSaved] = useState<Date | null>(null)

  const handleSave = async () => {
    setIsSaving(true)
    try {
      const response = await fetch('/api/content/about', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(content),
      })

      if (response.ok) {
        const result = await response.json()
        if (result.token) {
          setLastSaved(new Date())
          console.log("Content saved:", result)
        } else {
          console.error("Invalid token received")
        }
      } else {
        console.error("Failed to save content")
      }
    } catch (error) {
      console.error("Error saving content:", error)
    } finally {
      setIsSaving(false)
    }
  }

  useEffect(() => {
    const loadContent = async () => {
      try {
        const response = await fetch('/api/content/about')
        if (response.ok) {
          const result = await response.json()
          if (result.token) {
            setContent(result.data)
          } else {
            console.error("Invalid token received")
          }
        }
      } catch (error) {
        console.error("Error loading content:", error)
      }
    }
    loadContent()
  }, [])

  const handleInputChange = (field: string, value: string) => {
    setContent(prev => ({ ...prev, [field]: value }))
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
              {/* Editor Header */}
              <div className="px-4 lg:px-6">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-4">
                    <Link href="/cms">
                      <Button variant="ghost" size="icon">
                        <ArrowLeftIcon className="h-4 w-4" />
                      </Button>
                    </Link>
                    <div>
                      <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Edit About Us Page</h1>
                      <p className="text-gray-600 dark:text-gray-300">Manage your About Us page content</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Link href="/about" target="_blank">
                      <Button variant="outline">
                        <EyeIcon className="h-4 w-4 mr-2" />
                        Preview
                      </Button>
                    </Link>
                    <Button onClick={handleSave} disabled={isSaving}>
                      <SaveIcon className={`h-4 w-4 mr-2 ${isSaving ? 'animate-spin' : ''}`} />
                      {isSaving ? 'Saving...' : 'Save Changes'}
                    </Button>
                  </div>
                </div>
                {lastSaved && (
                  <div className="text-sm text-gray-500 mb-4">
                    Last saved: {lastSaved.toLocaleTimeString()}
                  </div>
                )}
              </div>

              {/* Editor Content */}
              <div className="px-4 lg:px-6">
                <div className="grid gap-6">
                  {/* Page Header Section */}
                  <Card>
                    <CardHeader>
                      <CardTitle>Page Header</CardTitle>
                      <CardDescription>Main title and subtitle for the page</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div>
                        <Label htmlFor="title">Page Title</Label>
                        <Input
                          id="title"
                          value={content.title}
                          onChange={(e) => handleInputChange('title', e.target.value)}
                          placeholder="Enter page title"
                        />
                      </div>
                      <div>
                        <Label htmlFor="subtitle">Page Subtitle</Label>
                        <Input
                          id="subtitle"
                          value={content.subtitle}
                          onChange={(e) => handleInputChange('subtitle', e.target.value)}
                          placeholder="Enter page subtitle"
                        />
                      </div>
                    </CardContent>
                  </Card>

                  {/* Mission Section */}
                  <Card>
                    <CardHeader>
                      <CardTitle>Mission Section</CardTitle>
                      <CardDescription>Your company&apos;s mission statement</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div>
                        <Label htmlFor="missionTitle">Section Title</Label>
                        <Input
                          id="missionTitle"
                          value={content.missionTitle}
                          onChange={(e) => handleInputChange('missionTitle', e.target.value)}
                          placeholder="Enter section title"
                        />
                      </div>
                      <div>
                        <Label htmlFor="missionText">Mission Content</Label>
                        <Textarea
                          id="missionText"
                          value={content.missionText}
                          onChange={(e) => handleInputChange('missionText', e.target.value)}
                          placeholder="Enter your mission statement"
                          rows={4}
                        />
                      </div>
                    </CardContent>
                  </Card>

                  {/* Vision Section */}
                  <Card>
                    <CardHeader>
                      <CardTitle>Vision Section</CardTitle>
                      <CardDescription>Your company&apos;s vision statement</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div>
                        <Label htmlFor="visionTitle">Section Title</Label>
                        <Input
                          id="visionTitle"
                          value={content.visionTitle}
                          onChange={(e) => handleInputChange('visionTitle', e.target.value)}
                          placeholder="Enter section title"
                        />
                      </div>
                      <div>
                        <Label htmlFor="visionText">Vision Content</Label>
                        <Textarea
                          id="visionText"
                          value={content.visionText}
                          onChange={(e) => handleInputChange('visionText', e.target.value)}
                          placeholder="Enter your vision statement"
                          rows={4}
                        />
                      </div>
                    </CardContent>
                  </Card>

                  {/* Values Section */}
                  <Card>
                    <CardHeader>
                      <CardTitle>Values Section</CardTitle>
                      <CardDescription>Your company&apos;s core values</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div>
                        <Label htmlFor="valuesTitle">Section Title</Label>
                        <Input
                          id="valuesTitle"
                          value={content.valuesTitle}
                          onChange={(e) => handleInputChange('valuesTitle', e.target.value)}
                          placeholder="Enter section title"
                        />
                      </div>
                      <div>
                        <Label htmlFor="valuesText">Values Content</Label>
                        <Textarea
                          id="valuesText"
                          value={content.valuesText}
                          onChange={(e) => handleInputChange('valuesText', e.target.value)}
                          placeholder="Enter your core values"
                          rows={4}
                        />
                      </div>
                    </CardContent>
                  </Card>

                  {/* Team Section */}
                  <Card>
                    <CardHeader>
                      <CardTitle>Team Section</CardTitle>
                      <CardDescription>Information about your team</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div>
                        <Label htmlFor="teamTitle">Section Title</Label>
                        <Input
                          id="teamTitle"
                          value={content.teamTitle}
                          onChange={(e) => handleInputChange('teamTitle', e.target.value)}
                          placeholder="Enter section title"
                        />
                      </div>
                      <div>
                        <Label htmlFor="teamText">Team Content</Label>
                        <Textarea
                          id="teamText"
                          value={content.teamText}
                          onChange={(e) => handleInputChange('teamText', e.target.value)}
                          placeholder="Enter team information"
                          rows={4}
                        />
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </div>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}