"use client"

import { useState, useEffect } from "react"
import { AppSidebar } from "@/components/app-sidebar"
import { SiteHeader } from "@/components/site-header"
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { PlusIcon, MoreHorizontalIcon, Trash2Icon, EditIcon, ShieldIcon, UserIcon, MailIcon, SearchIcon, FilterIcon } from "lucide-react"
import { getInitials } from "@/lib/utils"

interface User {
  id: string
  name: string
  email: string
  role: "admin" | "editor" | "viewer" | "user"
  status: "active" | "inactive" | "pending"
  avatar?: string
  createdAt: string
  lastLogin?: string
  permissions: {
    canCreate: boolean
    canEdit: boolean
    canDelete: boolean
    canManageUsers: boolean
    canAccessCMS: boolean
    canAccessAnalytics: boolean
  }
}

const initialUsers: User[] = [
  {
    id: "1",
    name: "John Doe",
    email: "john@example.com",
    role: "admin",
    status: "active",
    avatar: "/avatars/01.png",
    createdAt: "2024-01-15",
    lastLogin: "2024-02-20",
    permissions: {
      canCreate: true,
      canEdit: true,
      canDelete: true,
      canManageUsers: true,
      canAccessCMS: true,
      canAccessAnalytics: true
    }
  },
  {
    id: "2",
    name: "Jane Smith",
    email: "jane@example.com",
    role: "editor",
    status: "active",
    avatar: "/avatars/02.png",
    createdAt: "2024-01-20",
    lastLogin: "2024-02-19",
    permissions: {
      canCreate: true,
      canEdit: true,
      canDelete: false,
      canManageUsers: false,
      canAccessCMS: true,
      canAccessAnalytics: false
    }
  },
  {
    id: "3",
    name: "Bob Johnson",
    email: "bob@example.com",
    role: "viewer",
    status: "inactive",
    avatar: "/avatars/03.png",
    createdAt: "2024-01-25",
    permissions: {
      canCreate: false,
      canEdit: false,
      canDelete: false,
      canManageUsers: false,
      canAccessCMS: false,
      canAccessAnalytics: false
    }
  }
]

const roleColors = {
  admin: "bg-red-500 text-white",
  editor: "bg-blue-500 text-white",
  viewer: "bg-green-500 text-white",
  user: "bg-gray-500 text-white"
}

const statusColors = {
  active: "bg-green-100 text-green-800",
  inactive: "bg-gray-100 text-gray-800",
  pending: "bg-yellow-100 text-yellow-800"
}

export default function UsersPage() {
  const [users, setUsers] = useState<User[]>(initialUsers)
  const [loading, setLoading] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")
  const [roleFilter, setRoleFilter] = useState<string>("all")
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [selectedUser, setSelectedUser] = useState<User | null>(null)
  const [currentUser, setCurrentUser] = useState<User | null>(null)

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    role: "user" as User["role"],
    status: "active" as User["status"],
    permissions: {
      canCreate: false,
      canEdit: false,
      canDelete: false,
      canManageUsers: false,
      canAccessCMS: false,
      canAccessAnalytics: false
    }
  })

  useEffect(() => {
    // Load users and current user data from database
    const loadUsersData = async () => {
      try {
        const response = await fetch('/api/users')
        if (response.ok) {
          const result = await response.json()
          if (result.users) {
            setUsers(result.users)
          }
          if (result.currentUser) {
            setCurrentUser(result.currentUser)
          }
        } else {
          console.error("Failed to load users:", response.statusText)
        }
      } catch (error) {
        console.error("Error loading users:", error)
      }
    }

    loadUsersData()
  }, [])

  const filteredUsers = users.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.email.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesRole = roleFilter === "all" || user.role === roleFilter
    const matchesStatus = statusFilter === "all" || user.status === statusFilter
    
    return matchesSearch && matchesRole && matchesStatus
  })

  const handleCreateUser = async () => {
    try {
      const response = await fetch('/api/users', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData)
      })

      if (response.ok) {
        const result = await response.json()
        if (result.user) {
          setUsers([...users, result.user])
        }
        setIsCreateDialogOpen(false)
        resetForm()
      } else {
        console.error("Failed to create user:", response.statusText)
      }
    } catch (error) {
      console.error("Error creating user:", error)
    }
  }

  const handleEditUser = async () => {
    if (!selectedUser) return
    
    try {
      const response = await fetch('/api/users', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          id: selectedUser.id,
          ...formData
        })
      })

      if (response.ok) {
        const updatedUsers = users.map(user => 
          user.id === selectedUser.id 
            ? { ...user, ...formData }
            : user
        )
        setUsers(updatedUsers)
        setIsEditDialogOpen(false)
        setSelectedUser(null)
        resetForm()
      } else {
        console.error("Failed to update user:", response.statusText)
      }
    } catch (error) {
      console.error("Error updating user:", error)
    }
  }

  const handleDeleteUser = async (userId: string) => {
    try {
      const response = await fetch(`/api/users?id=${userId}`, {
        method: 'DELETE'
      })

      if (response.ok) {
        setUsers(users.filter(user => user.id !== userId))
      } else {
        console.error("Failed to delete user:", response.statusText)
      }
    } catch (error) {
      console.error("Error deleting user:", error)
    }
  }

  const resetForm = () => {
    setFormData({
      name: "",
      email: "",
      role: "user",
      status: "active",
      permissions: {
        canCreate: false,
        canEdit: false,
        canDelete: false,
        canManageUsers: false,
        canAccessCMS: false,
        canAccessAnalytics: false
      }
    })
  }

  const openEditDialog = (user: User) => {
    setSelectedUser(user)
    setFormData({
      name: user.name,
      email: user.email,
      role: user.role,
      status: user.status,
      permissions: user.permissions
    })
    setIsEditDialogOpen(true)
  }

  const updatePermission = (permission: keyof typeof formData.permissions, value: boolean) => {
    setFormData(prev => ({
      ...prev,
      permissions: {
        ...prev.permissions,
        [permission]: value
      }
    }))
  }

  const canManageUsers = currentUser?.permissions.canManageUsers

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
                  <h1 className="text-3xl font-bold tracking-tight">Users Management</h1>
                  <p className="text-muted-foreground">
                    Manage users, roles, and permissions for your organization.
                  </p>
                </div>

                <Card>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div>
                        <CardTitle>Users</CardTitle>
                        <CardDescription>
                          Manage your team members and their access levels
                        </CardDescription>
                      </div>
                      {canManageUsers && (
                        <Button onClick={() => setIsCreateDialogOpen(true)}>
                          <PlusIcon className="mr-2 h-4 w-4" />
                          Add User
                        </Button>
                      )}
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="mb-4 flex gap-2">
                      <div className="relative flex-1">
                        <SearchIcon className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                        <Input
                          placeholder="Search users..."
                          value={searchTerm}
                          onChange={(e) => setSearchTerm(e.target.value)}
                          className="pl-9"
                        />
                      </div>
                      <Select value={roleFilter} onValueChange={(value) => setRoleFilter(value || "all")}>
                        <SelectTrigger className="w-[150px]">
                          <SelectValue placeholder="Filter by role" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">All Roles</SelectItem>
                          <SelectItem value="admin">Admin</SelectItem>
                          <SelectItem value="editor">Editor</SelectItem>
                          <SelectItem value="viewer">Viewer</SelectItem>
                          <SelectItem value="user">User</SelectItem>
                        </SelectContent>
                      </Select>
                      <Select value={statusFilter} onValueChange={(value) => setStatusFilter(value || "all")}>
                        <SelectTrigger className="w-[150px]">
                          <SelectValue placeholder="Filter by status" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">All Status</SelectItem>
                          <SelectItem value="active">Active</SelectItem>
                          <SelectItem value="inactive">Inactive</SelectItem>
                          <SelectItem value="pending">Pending</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="rounded-md border">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>User</TableHead>
                            <TableHead>Role</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead>Created</TableHead>
                            <TableHead>Last Login</TableHead>
                            <TableHead className="text-right">Actions</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {filteredUsers.map((user) => (
                            <TableRow 
                              key={user.id} 
                              className="cursor-pointer hover:bg-muted/50 transition-colors"
                              onClick={() => canManageUsers && openEditDialog(user)}
                            >
                              <TableCell>
                                <div className="flex items-center gap-3">
                                  <Avatar className="h-8 w-8">
                                    <AvatarImage src={user.avatar} alt={user.name} />
                                    <AvatarFallback>{getInitials(user.name)}</AvatarFallback>
                                  </Avatar>
                                  <div>
                                    <div className="font-medium">{user.name}</div>
                                    <div className="text-sm text-muted-foreground">{user.email}</div>
                                  </div>
                                </div>
                              </TableCell>
                              <TableCell>
                                <Badge className={roleColors[user.role]}>
                                  {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
                                </Badge>
                              </TableCell>
                              <TableCell>
                                <Badge className={statusColors[user.status]}>
                                  {user.status.charAt(0).toUpperCase() + user.status.slice(1)}
                                </Badge>
                              </TableCell>
                              <TableCell>{user.createdAt}</TableCell>
                              <TableCell>{user.lastLogin || "Never"}</TableCell>
                              <TableCell className="text-right">
                                {canManageUsers && (
                                  <DropdownMenu>
                                    <DropdownMenuTrigger onClick={(e) => e.stopPropagation()}>
                                      <Button variant="ghost" size="sm">
                                        <MoreHorizontalIcon className="h-4 w-4" />
                                      </Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent align="end">
                                      <DropdownMenuItem onClick={() => openEditDialog(user)}>
                                        <EditIcon className="mr-2 h-4 w-4" />
                                        Edit
                                      </DropdownMenuItem>
                                      <DropdownMenuItem 
                                        onClick={() => handleDeleteUser(user.id)}
                                        className="text-red-600"
                                      >
                                        <Trash2Icon className="mr-2 h-4 w-4" />
                                        Delete
                                      </DropdownMenuItem>
                                    </DropdownMenuContent>
                                  </DropdownMenu>
                                )}
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </div>
      </SidebarInset>

      {/* Create User Dialog */}
      <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Create New User</DialogTitle>
            <DialogDescription>
              Add a new user to your organization and assign their role and permissions.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                placeholder="Enter user name"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                placeholder="Enter user email"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="role">Role</Label>
                <Select value={formData.role} onValueChange={(value) => setFormData(prev => ({ ...prev, role: value as User["role"] }))}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select role" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="admin">Admin</SelectItem>
                    <SelectItem value="editor">Editor</SelectItem>
                    <SelectItem value="viewer">Viewer</SelectItem>
                    <SelectItem value="user">User</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="status">Status</Label>
                <Select value={formData.status} onValueChange={(value) => setFormData(prev => ({ ...prev, status: value as User["status"] }))}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="inactive">Inactive</SelectItem>
                    <SelectItem value="pending">Pending</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <div className="grid gap-2">
              <Label>Permissions</Label>
              <div className="grid gap-2 rounded-md border p-3">
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="canCreate"
                    checked={formData.permissions.canCreate}
                    onChange={(e) => updatePermission('canCreate', e.target.checked)}
                  />
                  <Label htmlFor="canCreate" className="text-sm">Can Create Content</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="canEdit"
                    checked={formData.permissions.canEdit}
                    onChange={(e) => updatePermission('canEdit', e.target.checked)}
                  />
                  <Label htmlFor="canEdit" className="text-sm">Can Edit Content</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="canDelete"
                    checked={formData.permissions.canDelete}
                    onChange={(e) => updatePermission('canDelete', e.target.checked)}
                  />
                  <Label htmlFor="canDelete" className="text-sm">Can Delete Content</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="canManageUsers"
                    checked={formData.permissions.canManageUsers}
                    onChange={(e) => updatePermission('canManageUsers', e.target.checked)}
                  />
                  <Label htmlFor="canManageUsers" className="text-sm">Can Manage Users</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="canAccessCMS"
                    checked={formData.permissions.canAccessCMS}
                    onChange={(e) => updatePermission('canAccessCMS', e.target.checked)}
                  />
                  <Label htmlFor="canAccessCMS" className="text-sm">Can Access CMS</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="canAccessAnalytics"
                    checked={formData.permissions.canAccessAnalytics}
                    onChange={(e) => updatePermission('canAccessAnalytics', e.target.checked)}
                  />
                  <Label htmlFor="canAccessAnalytics" className="text-sm">Can Access Analytics</Label>
                </div>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleCreateUser}>Create User</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit User Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Edit User</DialogTitle>
            <DialogDescription>
              Update user information and permissions.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="edit-name">Name</Label>
              <Input
                id="edit-name"
                value={formData.name}
                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                placeholder="Enter user name"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="edit-email">Email</Label>
              <Input
                id="edit-email"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                placeholder="Enter user email"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="edit-role">Role</Label>
                <Select value={formData.role} onValueChange={(value) => setFormData(prev => ({ ...prev, role: value as User["role"] }))}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select role" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="admin">Admin</SelectItem>
                    <SelectItem value="editor">Editor</SelectItem>
                    <SelectItem value="viewer">Viewer</SelectItem>
                    <SelectItem value="user">User</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="edit-status">Status</Label>
                <Select value={formData.status} onValueChange={(value) => setFormData(prev => ({ ...prev, status: value as User["status"] }))}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="inactive">Inactive</SelectItem>
                    <SelectItem value="pending">Pending</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <div className="grid gap-2">
              <Label>Permissions</Label>
              <div className="grid gap-2 rounded-md border p-3">
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="edit-canCreate"
                    checked={formData.permissions.canCreate}
                    onChange={(e) => updatePermission('canCreate', e.target.checked)}
                  />
                  <Label htmlFor="edit-canCreate" className="text-sm">Can Create Content</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="edit-canEdit"
                    checked={formData.permissions.canEdit}
                    onChange={(e) => updatePermission('canEdit', e.target.checked)}
                  />
                  <Label htmlFor="edit-canEdit" className="text-sm">Can Edit Content</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="edit-canDelete"
                    checked={formData.permissions.canDelete}
                    onChange={(e) => updatePermission('canDelete', e.target.checked)}
                  />
                  <Label htmlFor="edit-canDelete" className="text-sm">Can Delete Content</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="edit-canManageUsers"
                    checked={formData.permissions.canManageUsers}
                    onChange={(e) => updatePermission('canManageUsers', e.target.checked)}
                  />
                  <Label htmlFor="edit-canManageUsers" className="text-sm">Can Manage Users</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="edit-canAccessCMS"
                    checked={formData.permissions.canAccessCMS}
                    onChange={(e) => updatePermission('canAccessCMS', e.target.checked)}
                  />
                  <Label htmlFor="edit-canAccessCMS" className="text-sm">Can Access CMS</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="edit-canAccessAnalytics"
                    checked={formData.permissions.canAccessAnalytics}
                    onChange={(e) => updatePermission('canAccessAnalytics', e.target.checked)}
                  />
                  <Label htmlFor="edit-canAccessAnalytics" className="text-sm">Can Access Analytics</Label>
                </div>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleEditUser}>Save Changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </SidebarProvider>
  )
}