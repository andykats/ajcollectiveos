"use client"

import { usePathname } from "next/navigation"
import { ChevronRightIcon } from "lucide-react"
import Link from "next/link"

function capitalizeFirstLetter(string: string) {
  return string.charAt(0).toUpperCase() + string.slice(1)
}

function formatBreadcrumbSegment(segment: string): string {
  // Replace hyphens and underscores with spaces
  const withSpaces = segment.replace(/[-_]/g, " ")
  return capitalizeFirstLetter(withSpaces)
}

export function Breadcrumbs() {
  const pathname = usePathname()
  const segments = pathname.split("/").filter(Boolean)

  if (segments.length === 0) {
    return <span>Home</span>
  }

  return (
    <nav aria-label="Breadcrumb" className="flex items-center space-x-2">
      <Link 
        href="/" 
        className="text-sm font-medium text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100 transition-colors"
      >
        Home
      </Link>
      
      {segments.map((segment, index) => {
        const isLast = index === segments.length - 1
        const href = "/" + segments.slice(0, index + 1).join("/")
        const displayName = formatBreadcrumbSegment(segment)
        
        return (
          <div key={href} className="flex items-center space-x-2">
            <ChevronRightIcon className="h-4 w-4 text-gray-400" />
            {isLast ? (
              <span className="text-sm font-medium text-gray-900 dark:text-gray-100">
                {displayName}
              </span>
            ) : (
              <Link 
                href={href} 
                className="text-sm font-medium text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100 transition-colors"
              >
                {displayName}
              </Link>
            )}
          </div>
        )
      })}
    </nav>
  )
}