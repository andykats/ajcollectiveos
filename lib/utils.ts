import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function getInitials(name: string): string {
  if (!name || typeof name !== 'string') return 'U'
  
  const words = name.trim().split(/\s+/)
  
  if (words.length === 0) return 'U'
  
  if (words.length === 1) {
    return words[0].charAt(0).toUpperCase()
  }
  
  // For multiple words, take first letter of first and last word
  const firstInitial = words[0].charAt(0)
  const lastInitial = words[words.length - 1].charAt(0)
  
  return (firstInitial + lastInitial).toUpperCase()
}