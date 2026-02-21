"use client"

import { useTheme } from "next-themes"
import { Button } from "@/components/ui/button"
import { MoonIcon, SunIcon } from "lucide-react"

export function ThemeToggle() {
  const { setTheme } = useTheme()

  return (
    <div className="flex items-center gap-2">
      <Button
        variant="ghost"
        size="icon"
        aria-label="Use light theme"
        onClick={() => setTheme("light")}
      >
        <SunIcon />
      </Button>
      <Button
        variant="ghost"
        size="icon"
        aria-label="Use dark theme"
        onClick={() => setTheme("dark")}
      >
        <MoonIcon />
      </Button>
    </div>
  )
}
