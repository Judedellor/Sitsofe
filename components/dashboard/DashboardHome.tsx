"use client"

import { useAuth } from "@/contexts/auth-context"
import { useNotifications } from "@/hooks/useNotifications"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"
import { Bell, Home, Heart, MessageSquare, Settings, User, Calendar, Clock } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { format } from "date-fns"

export function DashboardHome() {
  const { profile } = useAuth()
  const { notifications } = useNotifications()
  const router = useRouter()

  // Get current time for greeting
  const currentHour = new Date().getHours()
  let greeting = "Good morning"
  if (currentHour >= 12 && currentHour < 18) {
    greeting = "Good afternoon"
  } else if (currentHour >= 18) {
    greeting = "Good evening"
  }

  // Mock recent activity data
  const recentActivity = [
    {
      id: "1",
      type: "property_view",
      title: "You viewed Modern Apartment",
      timestamp: new Date(Date.now() - 1000 * 60 * 30), // 30 minutes ago
      icon: <Home className="h-4 w-4" />,
    },
    {
      id: "2",
      type: "message",
      title: "New message from John Doe",
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2), // 2 hours ago
      icon: <MessageSquare className="h-4 w-4" />,
    },
    {
      id: "3",
      type: "saved",
      title: "You saved Downtown Loft to favorites",
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 5), // 5 hours ago
      icon: <Heart className="h-4 w-4" />,
    },
    {
      id: "4",
      type: "appointment",
      title: "Scheduled viewing for Beach House",
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24), // 1 day ago
      icon: <Calendar className="h-4 w-4" />,
    },
  ]

  return (
    <div className="space-y-8">
      {/* Welcome Card */}
      <Card>
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-2xl">
                {greeting}, {profile?.full_name}
              </CardTitle>
              <CardDescription>{format(new Date(), "EEEE, MMMM d, yyyy")}</CardDescription>
            </div>
            <Avatar className="h-12 w-12">
              <AvatarImage src={profile?.avatar_url} alt={profile?.full_name || ""} />
              <AvatarFallback>{profile?.full_name?.charAt(0) || "U"}</AvatarFallback>
            </Avatar>
          </div>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground mb-4">
            Welcome to your {profile?.role} dashboard. Here's what's happening today.
          </p>

          {/* Quick Actions */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Button
              variant="outline"
              className="flex flex-col h-auto py-4 gap-2"
              onClick={() => router.push("/properties")}
            >
              <Home className="h-5 w-5" />
              <span>Browse Properties</span>
            </Button>

            <Button
              variant="outline"
              className="flex flex-col h-auto py-4 gap-2"
              onClick={() => router.push("/messages")}
            >
              <MessageSquare className="h-5 w-5" />
              <span>Messages</span>
            </Button>

            <Button
              variant="outline"
              className="flex flex-col h-auto py-4 gap-2"
              onClick={() => router.push("/profile")}
            >
              <User className="h-5 w-5" />
              <span>Profile</span>
            </Button>

            <Button
              variant="outline"
              className="flex flex-col h-auto py-4 gap-2"
              onClick={() => router.push("/settings")}
            >
              <Settings className="h-5 w-5" />
              <span>Settings</span>
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Activity Feed */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5" />
              Recent Activity
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentActivity.length === 0 ? (
                <p className="text-center text-muted-foreground py-4">No recent activity</p>
              ) : (
                recentActivity.map((activity) => (
                  <div key={activity.id} className="flex items-start gap-3">
                    <div className="mt-0.5 bg-muted rounded-full p-1.5">{activity.icon}</div>
                    <div className="flex-1">
                      <p className="text-sm">{activity.title}</p>
                      <p className="text-xs text-muted-foreground">{format(activity.timestamp, "MMM d, h:mm a")}</p>
                    </div>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>

        {/* Notifications */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Bell className="h-5 w-5" />
              Notifications
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {notifications.length === 0 ? (
                <p className="text-center text-muted-foreground py-4">No notifications</p>
              ) : (
                notifications.slice(0, 4).map((notification) => (
                  <div
                    key={notification.id}
                    className={`p-3 rounded-md ${notification.read ? "bg-background" : "bg-muted"}`}
                  >
                    <div className="font-medium">{notification.title}</div>
                    <div className="text-sm text-muted-foreground">{notification.content}</div>
                    <div className="text-xs text-muted-foreground mt-1">
                      {format(new Date(notification.created_at), "MMM d, h:mm a")}
                    </div>
                  </div>
                ))
              )}

              {notifications.length > 0 && (
                <div className="text-center">
                  <Button variant="link" className="text-sm" onClick={() => router.push("/notifications")}>
                    View all notifications
                  </Button>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
