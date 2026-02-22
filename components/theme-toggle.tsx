"use client"

import { useTheme } from "next-themes"
import { Button } from "@/components/ui/button"
import { MoonIcon, SunIcon } from "lucide-react"

export function ThemeToggle() {
  const { theme, setTheme } = useTheme()

  const toggleTheme = () => {
    if (theme === "light") {
      setTheme("dark")
    } else if (theme === "dark") {
      setTheme("system")
    } else {
      setTheme("light")
    }
  }

  const getThemeIcon = () => {
    if (theme === "light") {
      return <SunIcon />
    } else if (theme === "dark") {
      return <MoonIcon />
    } else {
      return <SunIcon />
    }
  }

  const getAriaLabel = () => {
    if (theme === "light") {
      return "Switch to dark theme"
    } else if (theme === "dark") {
      return "Switch to system theme"
    } else {
      return "Switch to light theme"
    }
  }

  return (
    <Button
      variant="ghost"
      size="icon"
      aria-label={getAriaLabel()}
      onClick={toggleTheme}
    >
      {getThemeIcon()}
    </Button>
  )
}
