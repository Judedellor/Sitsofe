"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Search, UserPlus, MoreHorizontal } from "lucide-react"
import { format } from "date-fns"
import { useToast } from "@/components/ui/use-toast"

interface User {
  id: string
  name: string
  email: string
  role: string
  status: string
  joinDate: Date
  avatar?: string
}

interface UserManagementTableProps {
  users?: User[]
}

// Mock data for users
const mockUsers = [
  {
    id: "1",
    name: "John Doe",
    email: "john@example.com",
    role: "renter",
    status: "active",
    joinDate: new Date(Date.now() - 7776000000),
    avatar: "https://api.dicebear.com/7.x/avatars/svg?seed=john",
  },
  {
    id: "2",
    name: "Jane Smith",
    email: "jane@example.com",
    role: "owner",
    status: "active",
    joinDate: new Date(Date.now() - 15552000000),
    avatar: "https://api.dicebear.com/7.x/avatars/svg?seed=jane",
  },
  {
    id: "3",
    name: "Bob Johnson",
    email: "bob@example.com",
    role: "renter",
    status: "inactive",
    joinDate: new Date(Date.now() - 31104000000),
    avatar: "https://api.dicebear.com/7.x/avatars/svg?seed=bob",
  },
  {
    id: "4",
    name: "Sarah Williams",
    email: "sarah@example.com",
    role: "owner",
    status: "active",
    joinDate: new Date(Date.now() - 2592000000),
    avatar: "https://api.dicebear.com/7.x/avatars/svg?seed=sarah",
  },
  {
    id: "5",
    name: "Michael Brown",
    email: "michael@example.com",
    role: "renter",
    status: "active",
    joinDate: new Date(Date.now() - 5184000000),
    avatar: "https://api.dicebear.com/7.x/avatars/svg?seed=michael",
  },
  {
    id: "6",
    name: "Emily Davis",
    email: "emily@example.com",
    role: "owner",
    status: "active",
    joinDate: new Date(Date.now() - 8640000000),
    avatar: "https://api.dicebear.com/7.x/avatars/svg?seed=emily",
  },
  {
    id: "7",
    name: "David Wilson",
    email: "david@example.com",
    role: "renter",
    status: "active",
    joinDate: new Date(Date.now() - 10368000000),
    avatar: "https://api.dicebear.com/7.x/avatars/svg?seed=david",
  },
  {
    id: "8",
    name: "Lisa Taylor",
    email: "lisa@example.com",
    role: "owner",
    status: "inactive",
    joinDate: new Date(Date.now() - 12960000000),
    avatar: "https://api.dicebear.com/7.x/avatars/svg?seed=lisa",
  },
]

export function UserManagementTable({ users = mockUsers }: UserManagementTableProps) {
  const { toast } = useToast()
  const [searchQuery, setSearchQuery] = useState("")
  const [roleFilter, setRoleFilter] = useState("all")
  const [userStatuses, setUserStatuses] = useState<Record<string, string>>(
    Object.fromEntries(users.map((user) => [user.id, user.status])),
  )

  // Filter users based on search and role filter
  const filteredUsers = users.filter((user) => {
    const matchesSearch =
      searchQuery === "" ||
      user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase())

    const matchesRole = roleFilter === "all" || user.role === roleFilter

    return matchesSearch && matchesRole
  })

  const handleUserAction = (userId: string, action: "edit" | "suspend" | "activate" | "delete") => {
    const user = users.find((u) => u.id === userId)
    if (!user) return

    if (action === "suspend" || action === "activate") {
      const newStatus = action === "suspend" ? "inactive" : "active"
      setUserStatuses({ ...userStatuses, [userId]: newStatus })

      toast({
        title: `User ${action === "suspend" ? "Suspended" : "Activated"}`,
        description: `${user.name} has been ${action === "suspend" ? "suspended" : "activated"}.`,
        variant: action === "suspend" ? "destructive" : "default",
      })
    } else {
      toast({
        title: `User ${action === "edit" ? "Edit" : "Deleted"}`,
        description: `Action performed on ${user.name}.`,
        variant: action === "delete" ? "destructive" : "default",
      })
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>User Management</CardTitle>
        <CardDescription>View and manage all users on the platform</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              placeholder="Search users..."
              className="pl-10"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <div className="flex gap-2">
            <Select value={roleFilter} onValueChange={setRoleFilter}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Filter by role" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Roles</SelectItem>
                <SelectItem value="renter">Renters</SelectItem>
                <SelectItem value="owner">Owners</SelectItem>
                <SelectItem value="admin">Admins</SelectItem>
              </SelectContent>
            </Select>
            <Button>
              <UserPlus className="h-4 w-4 mr-2" />
              Add User
            </Button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="border-b">
                <th className="text-left p-2">User</th>
                <th className="text-left p-2">Email</th>
                <th className="text-left p-2">Role</th>
                <th className="text-left p-2">Status</th>
                <th className="text-left p-2">Joined</th>
                <th className="text-left p-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.map((user) => (
                <tr key={user.id} className="border-b">
                  <td className="p-2">
                    <div className="flex items-center gap-2">
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={user.avatar} />
                        <AvatarFallback>{user.name[0]}</AvatarFallback>
                      </Avatar>
                      <span>{user.name}</span>
                    </div>
                  </td>
                  <td className="p-2">{user.email}</td>
                  <td className="p-2 capitalize">{user.role}</td>
                  <td className="p-2">
                    <Badge
                      className={
                        userStatuses[user.id] === "active"
                          ? "bg-success/20 text-success border-success"
                          : "bg-destructive/20 text-destructive border-destructive"
                      }
                    >
                      {userStatuses[user.id]}
                    </Badge>
                  </td>
                  <td className="p-2">{format(user.joinDate, "MMM d, yyyy")}</td>
                  <td className="p-2">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                        <DropdownMenuItem onClick={() => handleUserAction(user.id, "edit")}>Edit</DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() =>
                            handleUserAction(user.id, userStatuses[user.id] === "active" ? "suspend" : "activate")
                          }
                        >
                          {userStatuses[user.id] === "active" ? "Suspend" : "Activate"}
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                          onClick={() => handleUserAction(user.id, "delete")}
                          className="text-destructive"
                        >
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  )
}
