"use client"

import * as React from "react"
import Link from "next/link"
import { useState, useEffect } from "react"


import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarGroup,
  SidebarGroupLabel,
} from "@/components/ui/sidebar"
import { CommandIcon, FileTextIcon, LayoutDashboardIcon, SettingsIcon, UsersIcon, PaletteIcon } from "lucide-react"

interface UserData {
  name: string
  email: string
  avatar: string
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
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
          setUser({
            name: "Guest User",
            email: "guest@example.com",
            avatar: "/avatars/shadcn.svg"
          })
        }
      } catch (error) {
        console.error("Error loading user:", error)
        // Show default data on error
        setUser({
          name: "Guest User",
          email: "guest@example.com",
          avatar: "/avatars/shadcn.svg"
        })
      } finally {
        setLoading(false)
      }
    }
    
    loadUser()
  }, [])

  if (loading) {
    return (
      <Sidebar collapsible="offcanvas" {...props}>
        <SidebarHeader>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton
                className="data-[slot=sidebar-menu-button]:p-1.5!"
                render={<a href="#" />}
              >
                <CommandIcon className="size-5!" />
                <span className="text-base font-semibold">Acme Inc.</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarHeader>
        <SidebarContent>
          {/* Dashboard link outside subgroup */}
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton render={<Link href="/dashboard" />}>
                <LayoutDashboardIcon className="size-4" />
                <span>Dashboard</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
          
          <SidebarGroup>
            <SidebarGroupLabel>Essential</SidebarGroupLabel>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton render={<Link href="/cms" />}>
                  <FileTextIcon className="size-4" />
                  <span>CMS</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroup>
        </SidebarContent>
        <SidebarFooter>
          <div className="p-4">
            <p className="text-sm text-gray-500">Loading user...</p>
          </div>
        </SidebarFooter>
      </Sidebar>
    )
  }

  if (!user) {
    return null // This shouldn't happen, but just in case
  }

  return (
    <Sidebar collapsible="offcanvas" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              className="data-[slot=sidebar-menu-button]:p-1.5!"
              render={<a href="#" />}
            >
              <div className="flex items-center gap-2">
                <div className="h-8 w-8 rounded-md bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                  <span className="text-white font-bold text-sm">AJ</span>
                </div>
                <span className="text-base font-semibold">AJ Collective OS</span>
              </div>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        {/* Dashboard link outside subgroup */}
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton render={<Link href="/dashboard" />}>
              <LayoutDashboardIcon className="size-4" />
              <span>Dashboard</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
        
        {/* Essential group with remaining items */}
        <SidebarGroup>
          <SidebarGroupLabel>Essential</SidebarGroupLabel>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton render={<Link href="/cms" />}>
                <FileTextIcon className="size-4" />
                <span>CMS</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarGroup>

        {/* Settings group */}
        <SidebarGroup>
          <SidebarGroupLabel>Settings</SidebarGroupLabel>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton render={<Link href="/users" />}>
                <UsersIcon className="size-4" />
                <span>Users</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton render={<Link href="/branding" />}>
                <PaletteIcon className="size-4" />
                <span>Branding</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        {/* User moved to site header */}
      </SidebarFooter>
    </Sidebar>
  )
}