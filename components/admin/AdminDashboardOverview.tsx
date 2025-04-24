"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer, LineChart, Line } from "recharts"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import {
  Bell,
  AlertTriangle,
  Users,
  Home,
  Calendar,
  DollarSign,
  ShieldAlert,
  Flag,
  MessageSquare,
  Activity,
} from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { PropertyVerificationCard } from "./PropertyVerificationCard"
import { UserManagementTable } from "./UserManagementTable"
import { SystemMetricsCard } from "./SystemMetricsCard"

// Mock data for the charts
const revenueData = [
  { month: "Jan", revenue: 12000 },
  { month: "Feb", revenue: 19000 },
  { month: "Mar", revenue: 17000 },
  { month: "Apr", revenue: 21000 },
  { month: "May", revenue: 24000 },
  { month: "Jun", revenue: 28000 },
  { month: "Jul", revenue: 32000 },
  { month: "Aug", revenue: 35000 },
  { month: "Sep", revenue: 33000 },
  { month: "Oct", revenue: 37000 },
  { month: "Nov", revenue: 42000 },
  { month: "Dec", revenue: 49000 },
]

const userActivityData = [
  { day: "Mon", signups: 45, logins: 320 },
  { day: "Tue", signups: 52, logins: 380 },
  { day: "Wed", signups: 61, logins: 390 },
  { day: "Thu", signups: 48, logins: 410 },
  { day: "Fri", signups: 38, logins: 395 },
  { day: "Sat", signups: 38, logins: 250 },
  { day: "Sun", signups: 30, logins: 220 },
]

const propertyData = [
  { month: "Jan", listings: 120, bookings: 95 },
  { month: "Feb", listings: 132, bookings: 105 },
  { month: "Mar", listings: 141, bookings: 110 },
  { month: "Apr", listings: 154, bookings: 125 },
  { month: "May", listings: 162, bookings: 130 },
  { month: "Jun", listings: 175, bookings: 140 },
  { month: "Jul", listings: 184, bookings: 150 },
  { month: "Aug", listings: 192, bookings: 155 },
  { month: "Sep", listings: 201, bookings: 160 },
  { month: "Oct", listings: 214, bookings: 170 },
  { month: "Nov", listings: 220, bookings: 175 },
  { month: "Dec", listings: 235, bookings: 185 },
]

// Mock data for the stats
const stats = {
  totalUsers: 12458,
  activeListings: 3254,
  monthlyBookings: 1876,
  monthlyRevenue: 245000,
  verificationQueue: 42,
  reportedProperties: 18,
  activeDisputes: 7,
  systemHealth: "Healthy",
}

// Mock data for notifications
const notifications = [
  { id: 1, message: "New property verification request", time: "5 minutes ago" },
  { id: 2, message: "User reported a property", time: "1 hour ago" },
  { id: 3, message: "System update scheduled", time: "3 hours ago" },
  { id: 4, message: "New dispute filed", time: "5 hours ago" },
  { id: 5, message: "Database backup completed", time: "1 day ago" },
]

export function AdminDashboardOverview() {
  const [activeTab, setActiveTab] = useState("overview")
  const [showNotifications, setShowNotifications] = useState(false)

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Admin Dashboard</h1>
        <div className="flex items-center gap-2">
          <div className="relative">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setShowNotifications(!showNotifications)}
              aria-label="Notifications"
            >
              <Bell className="h-5 w-5" />
              <Badge className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0">
                {notifications.length}
              </Badge>
            </Button>
            {showNotifications && (
              <Card className="absolute right-0 mt-2 w-80 z-50">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm">Notifications</CardTitle>
                </CardHeader>
                <CardContent className="max-h-80 overflow-auto">
                  <div className="space-y-2">
                    {notifications.map((notification) => (
                      <div key={notification.id} className="border-b pb-2 last:border-0">
                        <p className="text-sm">{notification.message}</p>
                        <p className="text-xs text-muted-foreground">{notification.time}</p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>

      {stats.systemHealth !== "Healthy" && (
        <Alert variant="destructive" className="mb-4">
          <AlertTriangle className="h-4 w-4" />
          <AlertTitle>System Alert</AlertTitle>
          <AlertDescription>There are issues with the system that require immediate attention.</AlertDescription>
        </Alert>
      )}

      <Tabs defaultValue="overview" onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-3 mb-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="properties">Properties</TabsTrigger>
          <TabsTrigger value="users">Users</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Users</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.totalUsers.toLocaleString()}</div>
                <p className="text-xs text-muted-foreground">+2.5% from last month</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Active Listings</CardTitle>
                <Home className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.activeListings.toLocaleString()}</div>
                <p className="text-xs text-muted-foreground">+5.2% from last month</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Monthly Bookings</CardTitle>
                <Calendar className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.monthlyBookings.toLocaleString()}</div>
                <p className="text-xs text-muted-foreground">+12.3% from last month</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Monthly Revenue</CardTitle>
                <DollarSign className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">${stats.monthlyRevenue.toLocaleString()}</div>
                <p className="text-xs text-muted-foreground">+8.1% from last month</p>
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Verification Queue</CardTitle>
                <ShieldAlert className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.verificationQueue}</div>
                <p className="text-xs text-muted-foreground">12 urgent</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Reported Properties</CardTitle>
                <Flag className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.reportedProperties}</div>
                <p className="text-xs text-muted-foreground">5 high priority</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Active Disputes</CardTitle>
                <MessageSquare className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.activeDisputes}</div>
                <p className="text-xs text-muted-foreground">2 escalated</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">System Health</CardTitle>
                <Activity className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.systemHealth}</div>
                <p className="text-xs text-muted-foreground">All systems operational</p>
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle>Revenue Trends</CardTitle>
                <CardDescription>Monthly revenue for the past year</CardDescription>
              </CardHeader>
              <CardContent className="h-80">
                <ChartContainer
                  config={{
                    revenue: {
                      label: "Revenue",
                      color: "hsl(var(--chart-1))",
                    },
                  }}
                  className="h-full"
                >
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={revenueData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" />
                      <YAxis />
                      <ChartTooltip content={<ChartTooltipContent />} />
                      <Bar dataKey="revenue" fill="var(--color-revenue)" name="Revenue" />
                    </BarChart>
                  </ResponsiveContainer>
                </ChartContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>User Activity</CardTitle>
                <CardDescription>Daily signups and logins for the past week</CardDescription>
              </CardHeader>
              <CardContent className="h-80">
                <ChartContainer
                  config={{
                    signups: {
                      label: "Signups",
                      color: "hsl(var(--chart-1))",
                    },
                    logins: {
                      label: "Logins",
                      color: "hsl(var(--chart-2))",
                    },
                  }}
                  className="h-full"
                >
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={userActivityData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="day" />
                      <YAxis />
                      <ChartTooltip content={<ChartTooltipContent />} />
                      <Line type="monotone" dataKey="signups" stroke="var(--color-signups)" name="Signups" />
                      <Line type="monotone" dataKey="logins" stroke="var(--color-logins)" name="Logins" />
                    </LineChart>
                  </ResponsiveContainer>
                </ChartContainer>
              </CardContent>
            </Card>
          </div>

          <SystemMetricsCard />
        </TabsContent>

        <TabsContent value="properties" className="space-y-4">
          <PropertyVerificationCard />

          <Card>
            <CardHeader>
              <CardTitle>Property Metrics</CardTitle>
              <CardDescription>Monthly listings and bookings for the past year</CardDescription>
            </CardHeader>
            <CardContent className="h-80">
              <ChartContainer
                config={{
                  listings: {
                    label: "Listings",
                    color: "hsl(var(--chart-1))",
                  },
                  bookings: {
                    label: "Bookings",
                    color: "hsl(var(--chart-2))",
                  },
                }}
                className="h-full"
              >
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={propertyData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <ChartTooltip content={<ChartTooltipContent />} />
                    <Line type="monotone" dataKey="listings" stroke="var(--color-listings)" name="Listings" />
                    <Line type="monotone" dataKey="bookings" stroke="var(--color-bookings)" name="Bookings" />
                  </LineChart>
                </ResponsiveContainer>
              </ChartContainer>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="users" className="space-y-4">
          <UserManagementTable />
        </TabsContent>
      </Tabs>
    </div>
  )
}
