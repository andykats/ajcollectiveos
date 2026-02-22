"use client"

import { Separator } from "@/components/ui/separator"
import { SidebarTrigger } from "@/components/ui/sidebar"
import { ThemeToggle } from "@/components/theme-toggle"
import { Breadcrumbs } from "@/components/breadcrumbs"
import { NavUser } from "@/components/nav-user"
import { NotificationButton } from "@/components/notification-button"
import { useState, useEffect } from "react"

interface UserData {
  name: string
  email: string
  avatar: string
}

export function SiteHeader() {
  const [user, setUser] = useState<UserData | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadUser = async () => {
      try {
        const response = await fetch('/api/account')
        
        if (response.ok) {
          const result = await response.json()
          if (result.token && result.user) {
            setUser({
              name: result.user.name || "",
              email: result.user.email || "",
              avatar: result.user.avatar_url || "/avatars/shadcn.svg"
            })
          }
        } else if (response.status === 401) {
          // User not authenticated, show default data
          setUser(null)
        }
      } catch (error) {
        console.error("Error loading user for header:", error)
        setUser(null)
      } finally {
        setLoading(false)
      }
    }
    
    loadUser()
  }, [])

  return (
    <header className="flex h-(--header-height) shrink-0 items-center gap-2 border-b transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-(--header-height)">
      <div className="flex w-full items-center gap-2 px-4 lg:gap-3 lg:px-6">
        <SidebarTrigger className="-ms-1" />
        <Separator
          orientation="vertical"
          className="mx-2 h-4 data-vertical:self-auto"
        />
        <Breadcrumbs />
        <div className="ms-auto flex items-center gap-3">
          <ThemeToggle />
          <NotificationButton />
          {!loading && user && <NavUser user={user} />}
        </div>
      </div>
    </header>
  )
}
