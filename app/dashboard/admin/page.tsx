"use client"

import { useState } from "react"
import { useAuth } from "@/contexts/auth-context"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useRouter } from "next/navigation"
import {
  AlertCircle,
  CheckCircle,
  Users,
  Home,
  DollarSign,
  Calendar,
  AlertTriangle,
  Database,
  HardDrive,
  Activity,
  XCircle,
  Search,
  Filter,
  UserPlus,
  Eye,
  CheckSquare,
  XSquare,
  MoreHorizontal,
  Menu,
  Bell,
  LogOut,
} from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { format } from "date-fns"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useToast } from "@/components/ui/use-toast"
import {
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts"

// Mock data for the dashboard
const mockStats = {
  totalUsers: 1248,
  activeListings: 567,
  monthlyBookings: 324,
  monthlyRevenue: 45680,
  verificationQueue: 23,
  reportedProperties: 8,
  activeDisputes: 5,
}

// Mock data for revenue trends
const revenueData = [
  { month: "Jan", revenue: 28000 },
  { month: "Feb", revenue: 32000 },
  { month: "Mar", revenue: 30000 },
  { month: "Apr", revenue: 34000 },
  { month: "May", revenue: 32000 },
  { month: "Jun", revenue: 38000 },
  { month: "Jul", revenue: 42000 },
  { month: "Aug", revenue: 45680 },
]

// Mock data for user growth
const userGrowthData = [
  { month: "Jan", users: 850 },
  { month: "Feb", users: 940 },
  { month: "Mar", users: 1020 },
  { month: "Apr", users: 1080 },
  { month: "May", users: 1140 },
  { month: "Jun", users: 1190 },
  { month: "Jul", users: 1220 },
  { month: "Aug", users: 1248 },
]

// Mock data for property distribution
const propertyDistributionData = [
  { name: "Apartments", value: 45 },
  { name: "Houses", value: 30 },
  { name: "Condos", value: 15 },
  { name: "Townhouses", value: 10 },
]

// Mock data for system health
const systemHealthData = [
  { name: "API Health", value: 98, status: "healthy" },
  { name: "Database Latency", value: 120, unit: "ms", status: "healthy" },
  { name: "Storage Usage", value: 68, unit: "%", status: "warning" },
  { name: "Active Users", value: 342, status: "healthy" },
  { name: "Error Rate", value: 0.8, unit: "%", status: "healthy" },
]

// Mock data for property submissions
const propertySubmissions = [
  {
    id: "1",
    title: "Modern Downtown Apartment",
    owner: "John Smith",
    ownerAvatar: "https://api.dicebear.com/7.x/avatars/svg?seed=john",
    location: "Downtown, City",
    price: 2500,
    status: "pending",
    submittedAt: new Date(Date.now() - 86400000 * 2),
    images: ["/placeholder.svg?height=300&width=400"],
  },
  {
    id: "2",
    title: "Luxury Beachfront Villa",
    owner: "Sarah Johnson",
    ownerAvatar: "https://api.dicebear.com/7.x/avatars/svg?seed=sarah",
    location: "Coastal Drive, Beach City",
    price: 5800,
    status: "pending",
    submittedAt: new Date(Date.now() - 86400000 * 3),
    images: ["/placeholder.svg?height=300&width=400"],
  },
  {
    id: "3",
    title: "Cozy Mountain Cabin",
    owner: "Michael Brown",
    ownerAvatar: "https://api.dicebear.com/7.x/avatars/svg?seed=michael",
    location: "Mountain View, Highland",
    price: 1800,
    status: "pending",
    submittedAt: new Date(Date.now() - 86400000 * 4),
    images: ["/placeholder.svg?height=300&width=400"],
  },
]

// Mock data for users
const users = [
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

// Mock data for notifications
const notifications = [
  {
    id: "1",
    title: "New Property Submission",
    message: "A new property has been submitted for review",
    type: "info",
    time: new Date(Date.now() - 3600000),
  },
  {
    id: "2",
    title: "User Reported Issue",
    message: "A user has reported an issue with a property listing",
    type: "warning",
    time: new Date(Date.now() - 7200000),
  },
  {
    id: "3",
    title: "System Alert",
    message: "Storage usage is approaching 70% of capacity",
    type: "warning",
    time: new Date(Date.now() - 14400000),
  },
  {
    id: "4",
    title: "New User Registration",
    message: "5 new users have registered in the last 24 hours",
    type: "info",
    time: new Date(Date.now() - 86400000),
  },
]

// Colors for charts
const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884D8"]

export default function AdminDashboard() {
  const { profile, signOut } = useAuth()
  const router = useRouter()
  const { toast } = useToast()
  const [activeTab, setActiveTab] = useState("overview")
  const [userSearchQuery, setUserSearchQuery] = useState("")
  const [userRoleFilter, setUserRoleFilter] = useState("all")
  const [propertySearchQuery, setPropertySearchQuery] = useState("")
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)

  // Filter users based on search and role filter
  const filteredUsers = users.filter((user) => {
    const matchesSearch =
      userSearchQuery === "" ||
      user.name.toLowerCase().includes(userSearchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(userSearchQuery.toLowerCase())

    const matchesRole = userRoleFilter === "all" || user.role === userRoleFilter

    return matchesSearch && matchesRole
  })

  // Filter properties based on search
  const filteredProperties = propertySubmissions.filter(
    (property) =>
      propertySearchQuery === "" ||
      property.title.toLowerCase().includes(propertySearchQuery.toLowerCase()) ||
      property.owner.toLowerCase().includes(propertySearchQuery.toLowerCase()) ||
      property.location.toLowerCase().includes(propertySearchQuery.toLowerCase()),
  )

  // Handle property approval
  const handlePropertyApproval = (propertyId: string, action: "approve" | "reject") => {
    const property = propertySubmissions.find((p) => p.id === propertyId)
    if (!property) return

    toast({
      title: action === "approve" ? "Property Approved" : "Property Rejected",
      description: `${property.title} has been ${action === "approve" ? "approved" : "rejected"}.`,
      variant: action === "approve" ? "default" : "destructive",
    })
  }

  // Handle user action
  const handleUserAction = (userId: string, action: "edit" | "suspend" | "delete") => {
    const user = users.find((u) => u.id === userId)
    if (!user) return

    toast({
      title: `User ${action === "edit" ? "Edit" : action === "suspend" ? "Suspended" : "Deleted"}`,
      description: `Action performed on ${user.name}.`,
      variant: action === "delete" ? "destructive" : "default",
    })
  }

  const handleSignOut = async () => {
    try {
      await signOut()
      toast({
        title: "Logged out successfully",
        description: "You have been logged out of your account.",
      })
    } catch (error) {
      console.error("Error signing out:", error)
      toast({
        title: "Error signing out",
        description: "There was a problem signing out. Please try again.",
        variant: "destructive",
      })
    }
  }

  // Check if user has admin access
  if (profile?.role !== "admin") {
    return (
      <Card>
        <CardContent className="p-8 text-center">
          <AlertCircle className="h-12 w-12 mx-auto mb-4 text-destructive" />
          <h2 className="text-xl font-bold mb-2">Access Denied</h2>
          <p className="text-muted-foreground mb-4">You do not have permission to access the admin dashboard.</p>
          <Button onClick={() => router.push("/dashboard")}>Return to Dashboard</Button>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      {/* Admin Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="outline" size="icon" onClick={() => setIsSidebarOpen(!isSidebarOpen)} className="md:hidden">
            <Menu className="h-5 w-5" />
          </Button>
          <div>
            <h1 className="text-2xl font-bold">Admin Dashboard</h1>
            <p className="text-muted-foreground">Manage your platform and monitor system health</p>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <Button variant="outline" className="text-destructive" onClick={handleSignOut}>
            <LogOut className="h-4 w-4 mr-2" />
            Log Out
          </Button>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm" className="relative">
                <Bell className="h-4 w-4 mr-2" />
                Notifications
                <Badge className="ml-2 bg-primary">{notifications.length}</Badge>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-80">
              <DropdownMenuLabel>Recent Notifications</DropdownMenuLabel>
              <DropdownMenuSeparator />
              {notifications.map((notification) => (
                <DropdownMenuItem key={notification.id} className="py-2 px-4 cursor-pointer">
                  <div>
                    <div className="flex items-center justify-between">
                      <span className="font-medium">{notification.title}</span>
                      <Badge variant={notification.type === "warning" ? "destructive" : "default"} className="text-xs">
                        {notification.type === "warning" ? "Warning" : "Info"}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground mt-1">{notification.message}</p>
                    <p className="text-xs text-muted-foreground mt-1">{format(notification.time, "MMM d, h:mm a")}</p>
                  </div>
                </DropdownMenuItem>
              ))}
              <DropdownMenuSeparator />
              <DropdownMenuItem className="py-2 px-4 cursor-pointer">
                <Button variant="ghost" className="w-full" size="sm">
                  View All Notifications
                </Button>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <Avatar>
            <AvatarImage src={profile?.avatar_url} />
            <AvatarFallback>{profile?.full_name?.[0] || "A"}</AvatarFallback>
          </Avatar>
        </div>
      </div>

      {/* Main Dashboard Content */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="mb-6">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="properties">Properties</TabsTrigger>
          <TabsTrigger value="users">Users</TabsTrigger>
          <TabsTrigger value="system">System</TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-6">
          {/* Stats Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Card>
              <CardContent className="p-6 flex flex-col items-center justify-center">
                <Users className="h-8 w-8 text-primary mb-2" />
                <p className="text-2xl font-bold">{mockStats.totalUsers.toLocaleString()}</p>
                <p className="text-sm text-muted-foreground">Total Users</p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6 flex flex-col items-center justify-center">
                <Home className="h-8 w-8 text-primary mb-2" />
                <p className="text-2xl font-bold">{mockStats.activeListings.toLocaleString()}</p>
                <p className="text-sm text-muted-foreground">Active Listings</p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6 flex flex-col items-center justify-center">
                <Calendar className="h-8 w-8 text-primary mb-2" />
                <p className="text-2xl font-bold">{mockStats.monthlyBookings.toLocaleString()}</p>
                <p className="text-sm text-muted-foreground">Monthly Bookings</p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6 flex flex-col items-center justify-center">
                <DollarSign className="h-8 w-8 text-primary mb-2" />
                <p className="text-2xl font-bold">${mockStats.monthlyRevenue.toLocaleString()}</p>
                <p className="text-sm text-muted-foreground">Monthly Revenue</p>
              </CardContent>
            </Card>
          </div>

          {/* Revenue Chart */}
          <Card>
            <CardHeader>
              <CardTitle>Revenue Trends</CardTitle>
              <CardDescription>Monthly revenue for the current year</CardDescription>
            </CardHeader>
            <CardContent className="h-[400px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={revenueData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis tickFormatter={(value) => `$${value.toLocaleString()}`} />
                  <Tooltip formatter={(value) => [`$${value.toLocaleString()}`, "Revenue"]} />
                  <Legend />
                  <Line
                    type="monotone"
                    dataKey="revenue"
                    stroke="#3b82f6"
                    strokeWidth={2}
                    activeDot={{ r: 8 }}
                    name="Revenue"
                  />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Secondary Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">Verification Queue</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center">
                  <div className="text-3xl font-bold">{mockStats.verificationQueue}</div>
                  <Badge className="ml-2 bg-warning/20 text-warning border-warning">Pending</Badge>
                </div>
                <p className="text-xs text-muted-foreground mt-1">Properties awaiting verification</p>
                <Button variant="link" className="p-0 h-auto mt-2 text-sm" onClick={() => setActiveTab("properties")}>
                  View Queue
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">Reported Properties</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center">
                  <div className="text-3xl font-bold">{mockStats.reportedProperties}</div>
                  <Badge className="ml-2 bg-destructive/20 text-destructive border-destructive">Flagged</Badge>
                </div>
                <p className="text-xs text-muted-foreground mt-1">Properties reported by users</p>
                <Button variant="link" className="p-0 h-auto mt-2 text-sm">
                  Review Reports
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">Active Disputes</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center">
                  <div className="text-3xl font-bold">{mockStats.activeDisputes}</div>
                  <Badge className="ml-2 bg-warning/20 text-warning border-warning">Active</Badge>
                </div>
                <p className="text-xs text-muted-foreground mt-1">Disputes requiring resolution</p>
                <Button variant="link" className="p-0 h-auto mt-2 text-sm">
                  Manage Disputes
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* User Growth and Property Distribution */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>User Growth</CardTitle>
                <CardDescription>Total users over time</CardDescription>
              </CardHeader>
              <CardContent className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={userGrowthData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line type="monotone" dataKey="users" stroke="#8884d8" strokeWidth={2} name="Users" />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Property Distribution</CardTitle>
                <CardDescription>Properties by type</CardDescription>
              </CardHeader>
              <CardContent className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={propertyDistributionData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      outerRadius={100}
                      fill="#8884d8"
                      dataKey="value"
                      label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                    >
                      {propertyDistributionData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Properties Tab */}
        <TabsContent value="properties" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Property Verification Queue</CardTitle>
              <CardDescription>Review and approve property submissions</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col md:flex-row gap-4 mb-6">
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground h-4 w-4" />
                  <Input
                    placeholder="Search properties..."
                    className="pl-10"
                    value={propertySearchQuery}
                    onChange={(e) => setPropertySearchQuery(e.target.value)}
                  />
                </div>
                <Button>
                  <Filter className="h-4 w-4 mr-2" />
                  Filter
                </Button>
              </div>

              {filteredProperties.length === 0 ? (
                <div className="text-center py-12">
                  <CheckCircle className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                  <h3 className="text-lg font-medium mb-2">No pending properties</h3>
                  <p className="text-muted-foreground">All property submissions have been reviewed</p>
                </div>
              ) : (
                <div className="space-y-6">
                  {filteredProperties.map((property) => (
                    <div key={property.id} className="border rounded-lg overflow-hidden">
                      <div className="grid grid-cols-1 md:grid-cols-3">
                        <div className="relative h-48 md:h-auto">
                          <img
                            src={property.images[0] || "/placeholder.svg"}
                            alt={property.title}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div className="p-6 md:col-span-2">
                          <div className="flex items-start justify-between">
                            <div>
                              <h3 className="text-lg font-medium">{property.title}</h3>
                              <p className="text-muted-foreground">{property.location}</p>
                              <p className="text-lg font-bold mt-2">${property.price.toLocaleString()}/month</p>
                            </div>
                            <Badge className="bg-warning/20 text-warning border-warning">Pending</Badge>
                          </div>

                          <div className="flex items-center mt-4">
                            <Avatar className="h-8 w-8 mr-2">
                              <AvatarImage src={property.ownerAvatar} />
                              <AvatarFallback>{property.owner[0]}</AvatarFallback>
                            </Avatar>
                            <div>
                              <p className="text-sm font-medium">{property.owner}</p>
                              <p className="text-xs text-muted-foreground">
                                Submitted {format(property.submittedAt, "MMM d, yyyy")}
                              </p>
                            </div>
                          </div>

                          <div className="flex gap-3 mt-6">
                            <Button
                              onClick={() => handlePropertyApproval(property.id, "approve")}
                              className="flex items-center"
                            >
                              <CheckSquare className="h-4 w-4 mr-2" />
                              Approve
                            </Button>
                            <Button
                              variant="outline"
                              onClick={() => handlePropertyApproval(property.id, "reject")}
                              className="flex items-center text-destructive hover:text-destructive"
                            >
                              <XSquare className="h-4 w-4 mr-2" />
                              Reject
                            </Button>
                            <Button variant="outline" className="ml-auto">
                              <Eye className="h-4 w-4 mr-2" />
                              View Details
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Property Management</CardTitle>
              <CardDescription>Overview of all properties on the platform</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card>
                  <CardContent className="p-6 flex flex-col items-center justify-center">
                    <div className="text-2xl font-bold">{mockStats.activeListings}</div>
                    <p className="text-sm text-muted-foreground">Active Listings</p>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-6 flex flex-col items-center justify-center">
                    <div className="text-2xl font-bold">{mockStats.verificationQueue}</div>
                    <p className="text-sm text-muted-foreground">Pending Verification</p>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-6 flex flex-col items-center justify-center">
                    <div className="text-2xl font-bold">{mockStats.reportedProperties}</div>
                    <p className="text-sm text-muted-foreground">Reported Properties</p>
                  </CardContent>
                </Card>
              </div>

              <div className="mt-6">
                <Button>View All Properties</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Users Tab */}
        <TabsContent value="users" className="space-y-6">
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
                    value={userSearchQuery}
                    onChange={(e) => setUserSearchQuery(e.target.value)}
                  />
                </div>
                <div className="flex gap-2">
                  <Select value={userRoleFilter} onValueChange={setUserRoleFilter}>
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
                              user.status === "active"
                                ? "bg-success/20 text-success border-success"
                                : "bg-destructive/20 text-destructive border-destructive"
                            }
                          >
                            {user.status}
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
                              <DropdownMenuItem onClick={() => handleUserAction(user.id, "edit")}>
                                Edit
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => handleUserAction(user.id, "suspend")}>
                                {user.status === "active" ? "Suspend" : "Activate"}
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

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>User Statistics</CardTitle>
                <CardDescription>User growth and activity metrics</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="text-sm font-medium">New Users (30 days)</span>
                      <span className="text-sm font-medium">78</span>
                    </div>
                    <div className="w-full bg-muted rounded-full h-2">
                      <div className="bg-primary h-2 rounded-full" style={{ width: "65%" }}></div>
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="text-sm font-medium">Active Users (Daily)</span>
                      <span className="text-sm font-medium">342</span>
                    </div>
                    <div className="w-full bg-muted rounded-full h-2">
                      <div className="bg-primary h-2 rounded-full" style={{ width: "78%" }}></div>
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="text-sm font-medium">Verified Users</span>
                      <span className="text-sm font-medium">89%</span>
                    </div>
                    <div className="w-full bg-muted rounded-full h-2">
                      <div className="bg-primary h-2 rounded-full" style={{ width: "89%" }}></div>
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="text-sm font-medium">Retention Rate</span>
                      <span className="text-sm font-medium">76%</span>
                    </div>
                    <div className="w-full bg-muted rounded-full h-2">
                      <div className="bg-primary h-2 rounded-full" style={{ width: "76%" }}></div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>User Distribution</CardTitle>
                <CardDescription>Users by role</CardDescription>
              </CardHeader>
              <CardContent className="h-[250px]">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={[
                        { name: "Renters", value: 65 },
                        { name: "Owners", value: 30 },
                        { name: "Admins", value: 5 },
                      ]}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                      label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                    >
                      <Cell fill="#0088FE" />
                      <Cell fill="#00C49F" />
                      <Cell fill="#FFBB28" />
                    </Pie>
                    <Tooltip />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* System Tab */}
        <TabsContent value="system" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>System Health</CardTitle>
              <CardDescription>Current status of system components</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {systemHealthData.map((item, index) => (
                  <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center">
                      {item.status === "healthy" ? (
                        <CheckCircle className="h-5 w-5 text-success mr-3" />
                      ) : item.status === "warning" ? (
                        <AlertTriangle className="h-5 w-5 text-warning mr-3" />
                      ) : (
                        <XCircle className="h-5 w-5 text-destructive mr-3" />
                      )}
                      <span className="font-medium">{item.name}</span>
                    </div>
                    <div className="flex items-center">
                      <span className="font-bold">
                        {item.value}
                        {item.unit || ""}
                      </span>
                      <Badge
                        className={`ml-3 ${
                          item.status === "healthy"
                            ? "bg-success/20 text-success border-success"
                            : item.status === "warning"
                              ? "bg-warning/20 text-warning border-warning"
                              : "bg-destructive/20 text-destructive border-destructive"
                        }`}
                      >
                        {item.status}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>API Performance</CardTitle>
                <CardDescription>Response times over the last 24 hours</CardDescription>
              </CardHeader>
              <CardContent className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart
                    data={[
                      { time: "00:00", ms: 110 },
                      { time: "04:00", ms: 115 },
                      { time: "08:00", ms: 130 },
                      { time: "12:00", ms: 140 },
                      { time: "16:00", ms: 125 },
                      { time: "20:00", ms: 120 },
                      { time: "24:00", ms: 110 },
                    ]}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="time" />
                    <YAxis unit="ms" />
                    <Tooltip formatter={(value) => [`${value}ms`, "Response Time"]} />
                    <Line type="monotone" dataKey="ms" stroke="#8884d8" strokeWidth={2} name="Response Time" />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Error Logs</CardTitle>
                <CardDescription>Recent system errors</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="p-3 bg-destructive/10 rounded-lg">
                    <div className="flex items-center justify-between">
                      <span className="font-medium">Database Connection Error</span>
                      <Badge variant="outline" className="text-destructive border-destructive">
                        Error
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground mt-1">Connection timeout after 30s</p>
                    <p className="text-xs text-muted-foreground mt-1">Today, 10:23 AM</p>
                  </div>

                  <div className="p-3 bg-warning/10 rounded-lg">
                    <div className="flex items-center justify-between">
                      <span className="font-medium">Storage API Warning</span>
                      <Badge variant="outline" className="text-warning border-warning">
                        Warning
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground mt-1">Storage usage approaching 70% capacity</p>
                    <p className="text-xs text-muted-foreground mt-1">Yesterday, 3:45 PM</p>
                  </div>

                  <div className="p-3 bg-destructive/10 rounded-lg">
                    <div className="flex items-center justify-between">
                      <span className="font-medium">Authentication Service Error</span>
                      <Badge variant="outline" className="text-destructive border-destructive">
                        Error
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground mt-1">Rate limit exceeded for IP 192.168.1.45</p>
                    <p className="text-xs text-muted-foreground mt-1">Yesterday, 11:17 AM</p>
                  </div>
                </div>

                <Button variant="outline" className="w-full mt-4">
                  View All Logs
                </Button>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>System Configuration</CardTitle>
              <CardDescription>Manage platform settings and configurations</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Button className="flex items-center justify-center gap-2">
                  <Database className="h-4 w-4" />
                  Database Settings
                </Button>
                <Button className="flex items-center justify-center gap-2">
                  <HardDrive className="h-4 w-4" />
                  Storage Configuration
                </Button>
                <Button className="flex items-center justify-center gap-2">
                  <Activity className="h-4 w-4" />
                  Performance Tuning
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
