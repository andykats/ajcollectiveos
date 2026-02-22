"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
// import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
import { BellIcon, XIcon, ClockIcon, CheckCircleIcon, AlertCircleIcon, InfoIcon } from "lucide-react"
import { getInitials } from "@/lib/utils"

interface Notification {
  id: string
  title: string
  message: string
  type: "info" | "success" | "warning" | "error"
  timestamp: string
  read: boolean
  avatar?: string
  actionUrl?: string
}

const mockNotifications: Notification[] = [
  {
    id: "1",
    title: "Welcome to AJ Collective OS!",
    message: "Your account has been successfully created. Start exploring the features.",
    type: "success",
    timestamp: "2 minutes ago",
    read: false,
    avatar: "/avatars/system.png"
  },
  {
    id: "2",
    title: "New user invitation",
    message: "John Doe has been invited to join your organization.",
    type: "info",
    timestamp: "1 hour ago",
    read: false,
    avatar: "/avatars/user.png"
  },
  {
    id: "3",
    title: "System maintenance scheduled",
    message: "The system will undergo maintenance on Sunday, 2:00 AM - 4:00 AM EST.",
    type: "warning",
    timestamp: "3 hours ago",
    read: true
  },
  {
    id: "4",
    title: "Security alert",
    message: "Unusual login activity detected from a new device.",
    type: "error",
    timestamp: "5 hours ago",
    read: true
  },
  {
    id: "5",
    title: "Feature update",
    message: "New user management features are now available in the Settings.",
    type: "info",
    timestamp: "1 day ago",
    read: true
  }
]

const notificationIcons = {
  info: InfoIcon,
  success: CheckCircleIcon,
  warning: AlertCircleIcon,
  error: XIcon
}

const notificationColors = {
  info: "bg-blue-500 text-white",
  success: "bg-green-500 text-white",
  warning: "bg-yellow-500 text-white",
  error: "bg-red-500 text-white"
}

export function NotificationButton() {
  const [isOpen, setIsOpen] = useState(false)
  const [notifications, setNotifications] = useState<Notification[]>(mockNotifications)
  const [unreadCount, setUnreadCount] = useState(0)

  useEffect(() => {
    const unread = notifications.filter(n => !n.read).length
    setUnreadCount(unread)
  }, [notifications])

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Element
      if (!target.closest('.notification-container')) {
        setIsOpen(false)
      }
    }

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside)
      return () => {
        document.removeEventListener('mousedown', handleClickOutside)
      }
    }
  }, [isOpen])

  const markAsRead = (id: string) => {
    setNotifications(prev => 
      prev.map(notification => 
        notification.id === id 
          ? { ...notification, read: true }
          : notification
      )
    )
  }

  const markAllAsRead = () => {
    setNotifications(prev => 
      prev.map(notification => ({ ...notification, read: true }))
    )
  }

  const clearAll = () => {
    setNotifications([])
  }

  return (
    <div className="notification-container relative">
      <Button
        variant="ghost"
        size="sm"
        className="relative"
        onClick={() => setIsOpen(!isOpen)}
      >
        <BellIcon className="h-4 w-4" />
        {unreadCount > 0 && (
          <Badge 
            variant="destructive" 
            className="absolute -top-1 -right-1 h-5 w-5 p-0 flex items-center justify-center text-xs"
          >
            {unreadCount > 99 ? "99+" : unreadCount}
          </Badge>
        )}
      </Button>

      {isOpen && (
        <aside className="fixed top-16 right-4 w-96 max-h-[calc(100vh-4rem)] bg-background border rounded-lg shadow-lg z-50">
          <div className="flex items-center justify-between p-4 border-b">
            <h3 className="font-semibold">Notifications</h3>
            <div className="flex items-center gap-2">
              {notifications.length > 0 && (
                <>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={markAllAsRead}
                    className="text-xs"
                  >
                    Mark all read
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={clearAll}
                    className="text-xs"
                  >
                    Clear all
                  </Button>
                </>
              )}
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsOpen(false)}
                className="h-8 w-8 p-0"
              >
                <XIcon className="h-4 w-4" />
              </Button>
            </div>
          </div>

          <div className="max-h-[calc(100vh-8rem)] overflow-y-auto">
            {notifications.length === 0 ? (
              <div className="p-8 text-center text-muted-foreground">
                <BellIcon className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>No notifications</p>
                <p className="text-sm">You're all caught up!</p>
              </div>
            ) : (
              <div className="divide-y">
                {notifications.map((notification) => {
                  const Icon = notificationIcons[notification.type]
                  return (
                    <div
                      key={notification.id}
                      className={`p-4 hover:bg-muted/50 transition-colors cursor-pointer ${
                        !notification.read ? 'bg-muted/30' : ''
                      }`}
                      onClick={() => markAsRead(notification.id)}
                    >
                      <div className="flex gap-3">
                        <div className="flex-shrink-0">
                          {notification.avatar ? (
                            <Avatar className="h-10 w-10">
                              <AvatarImage src={notification.avatar} alt={notification.title} />
                              <AvatarFallback>
                                {getInitials(notification.title)}
                              </AvatarFallback>
                            </Avatar>
                          ) : (
                            <div className={`h-10 w-10 rounded-full flex items-center justify-center ${notificationColors[notification.type]}`}>
                              <Icon className="h-5 w-5" />
                            </div>
                          )}
                        </div>
                        
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-2">
                            <div className="flex-1">
                              <p className="text-sm font-medium leading-5">
                                {notification.title}
                              </p>
                              <p className="text-sm text-muted-foreground mt-1">
                                {notification.message}
                              </p>
                            </div>
                            {!notification.read && (
                              <div className="h-2 w-2 rounded-full bg-blue-500 flex-shrink-0 mt-2"></div>
                            )}
                          </div>
                          
                          <div className="flex items-center gap-1 mt-2 text-xs text-muted-foreground">
                            <ClockIcon className="h-3 w-3" />
                            <span>{notification.timestamp}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            )}
          </div>
        </aside>
      )}
    </div>
  )
}