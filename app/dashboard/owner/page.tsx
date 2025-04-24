"use client"

import { useAuth } from "@/contexts/auth-context"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"
import { Home, Plus, MessageSquare, DollarSign, BarChart3, FileText, AlertTriangle, LogOut } from "lucide-react"
import { useProperties } from "@/hooks/useProperties"
import { PropertyCard } from "@/components/properties/PropertyCard"
import { useNotifications } from "@/hooks/useNotifications"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { useToast } from "@/components/ui/use-toast"

export default function OwnerDashboard() {
  const { profile, signOut } = useAuth()
  const { properties, usingMockData } = useProperties()
  const { notifications, unreadCount } = useNotifications()
  const router = useRouter()
  const { toast } = useToast()

  // Filter to only show properties owned by this user
  const userProperties = properties?.filter((p) => p.owner_id === profile?.id) || []

  // Mock data for analytics
  const viewsData = [
    { name: "Mon", views: 12 },
    { name: "Tue", views: 19 },
    { name: "Wed", views: 15 },
    { name: "Thu", views: 25 },
    { name: "Fri", views: 32 },
    { name: "Sat", views: 28 },
    { name: "Sun", views: 20 },
  ]

  // Mock data for inquiries
  const inquiries = [
    {
      id: "1",
      renterName: "Emma Wilson",
      renterAvatar: "https://api.dicebear.com/7.x/avatars/svg?seed=emma",
      property: "Modern Downtown Loft",
      propertyId: "prop1",
      message: "Hi, I'm interested in viewing this property. Is it available this weekend?",
      date: new Date(Date.now() - 3600000),
      status: "new",
    },
    {
      id: "2",
      renterName: "James Miller",
      renterAvatar: "https://api.dicebear.com/7.x/avatars/svg?seed=james",
      property: "Riverside Apartment",
      propertyId: "prop2",
      message: "Hello, I have a few questions about the utilities included in the rent.",
      date: new Date(Date.now() - 86400000),
      status: "replied",
    },
    {
      id: "3",
      renterName: "Sophia Chen",
      renterAvatar: "https://api.dicebear.com/7.x/avatars/svg?seed=sophia",
      property: "Luxury Condo",
      propertyId: "prop3",
      message: "I'd like to schedule a viewing for next Tuesday if possible.",
      date: new Date(Date.now() - 172800000),
      status: "new",
    },
  ]

  // Mock data for scheduled viewings
  const scheduledViewings = [
    {
      id: "1",
      property: "Modern Downtown Loft",
      propertyId: "prop1",
      renterName: "Emma Wilson",
      renterAvatar: "https://api.dicebear.com/7.x/avatars/svg?seed=emma",
      date: new Date(Date.now() + 86400000),
    },
    {
      id: "2",
      property: "Riverside Apartment",
      propertyId: "prop2",
      renterName: "David Thompson",
      renterAvatar: "https://api.dicebear.com/7.x/avatars/svg?seed=david",
      date: new Date(Date.now() + 172800000),
    },
  ]

  // Mock data for applications
  const applications = [
    {
      id: "1",
      property: "Modern Downtown Loft",
      propertyId: "prop1",
      renterName: "Emma Wilson",
      renterAvatar: "https://api.dicebear.com/7.x/avatars/svg?seed=emma",
      date: new Date(Date.now() - 259200000),
      status: "pending",
    },
    {
      id: "2",
      property: "Riverside Apartment",
      propertyId: "prop2",
      renterName: "David Thompson",
      renterAvatar: "https://api.dicebear.com/7.x/avatars/svg?seed=david",
      date: new Date(Date.now() - 345600000),
      status: "approved",
    },
    {
      id: "3",
      property: "Luxury Condo",
      propertyId: "prop3",
      renterName: "Sophia Chen",
      renterAvatar: "https://api.dicebear.com/7.x/avatars/svg?seed=sophia",
      date: new Date(Date.now() - 432000000),
      status: "rejected",
    },
  ]

  const handleSignOut = async () => {
    try {
      await signOut()
      toast({
        title: "Logged out successfully",
        description: "You have been logged out of your account.",
      })
      router.push("/")
    } catch (error) {
      console.error("Error signing out:", error)
      toast({
        title: "Error signing out",
        description: "There was a problem signing out. Please try again.",
        variant: "destructive",
      })
    }
  }

  const handlePropertyApproval = (applicationId: string, action: "approve" | "reject") => {
    toast({
      title: action === "approve" ? "Application Approved" : "Application Rejected",
      description: `The application has been ${action === "approve" ? "approved" : "rejected"}.`,
    })
    // In a real app, this would update the application status in the database
  }

  const handleViewingConfirmation = (viewingId: string, action: "confirm" | "reschedule" | "cancel") => {
    const actionText = action === "confirm" ? "confirmed" : action === "reschedule" ? "rescheduled" : "cancelled"

    toast({
      title: `Viewing ${actionText}`,
      description: `The viewing has been ${actionText}.`,
    })
    // In a real app, this would update the viewing status in the database
  }

  return (
    <div className="space-y-8">
      {usingMockData && (
        <Alert className="bg-yellow-50 border-yellow-200">
          <AlertTriangle className="h-4 w-4 text-yellow-600" />
          <AlertTitle className="text-yellow-800">Using Demo Data</AlertTitle>
          <AlertDescription className="text-yellow-700">
            We're currently displaying demo data because the database connection is not available.
          </AlertDescription>
        </Alert>
      )}

      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Welcome, {profile?.full_name}</CardTitle>
            <CardDescription>Manage your properties and connect with potential renters</CardDescription>
          </div>
          <Button variant="outline" className="text-destructive" onClick={handleSignOut}>
            <LogOut className="h-4 w-4 mr-2" />
            Log Out
          </Button>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Button
              variant="outline"
              className="flex items-center justify-start gap-2"
              onClick={() => router.push("/properties/new")}
            >
              <Plus className="h-4 w-4" />
              <span>Add Property</span>
            </Button>
            <Button
              variant="outline"
              className="flex items-center justify-start gap-2"
              onClick={() => router.push("/messages")}
            >
              <MessageSquare className="h-4 w-4" />
              <span>Messages</span>
              <Badge className="ml-auto bg-primary text-xs">{inquiries.filter((i) => i.status === "new").length}</Badge>
            </Button>
            <Button
              variant="outline"
              className="flex items-center justify-start gap-2"
              onClick={() => router.push("/applications")}
            >
              <FileText className="h-4 w-4" />
              <span>Applications</span>
              <Badge className="ml-auto bg-primary text-xs">
                {applications.filter((a) => a.status === "pending").length}
              </Badge>
            </Button>
            <Button
              variant="outline"
              className="flex items-center justify-start gap-2"
              onClick={() => router.push("/analytics")}
            >
              <BarChart3 className="h-4 w-4" />
              <span>Analytics</span>
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Property Performance Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Properties</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{userProperties.length}</div>
            <p className="text-xs text-muted-foreground mt-1">
              {userProperties.filter((p) => p.status === "active").length} active listings
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Views</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">247</div>
            <p className="text-xs text-muted-foreground mt-1">
              <span className="text-success">↑ 12%</span> from last week
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">New Inquiries</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{inquiries.filter((i) => i.status === "new").length}</div>
            <p className="text-xs text-muted-foreground mt-1">
              <span className="text-success">↑ 5%</span> from last week
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Monthly Revenue</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold flex items-center">
              <DollarSign className="h-5 w-5" />
              12,400
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              From {userProperties.filter((p) => p.status === "active").length} active properties
            </p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="properties">
        <TabsList className="mb-6">
          <TabsTrigger value="properties">Properties</TabsTrigger>
          <TabsTrigger value="inquiries">Inquiries</TabsTrigger>
          <TabsTrigger value="viewings">Viewings</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>

        <TabsContent value="properties">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Your Properties</CardTitle>
                <CardDescription>Manage your property listings</CardDescription>
              </div>
              <Button onClick={() => router.push("/properties/new")}>
                <Plus className="h-4 w-4 mr-2" />
                Add Property
              </Button>
            </CardHeader>
            <CardContent>
              {userProperties.length === 0 ? (
                <div className="text-center py-12">
                  <Home className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                  <h3 className="text-lg font-medium mb-2">No properties listed yet</h3>
                  <p className="text-muted-foreground mb-4">Start listing your properties to find tenants</p>
                  <Button onClick={() => router.push("/properties/new")}>Add Your First Property</Button>
                </div>
              ) : (
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {userProperties.slice(0, 3).map((property) => (
                      <PropertyCard
                        key={property.id}
                        id={property.id}
                        title={property.title}
                        price={property.price}
                        location={property.location}
                        bedrooms={property.bedrooms}
                        bathrooms={property.bathrooms}
                        size={property.size}
                        imageUrl={property.imageUrl}
                        status={property.status}
                        onClick={() => router.push(`/properties/${property.id}`)}
                      />
                    ))}
                  </div>
                  {userProperties.length > 3 && (
                    <div className="text-center">
                      <Button variant="outline" onClick={() => router.push("/my-properties")}>
                        View All Properties
                      </Button>
                    </div>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="inquiries">
          <Card>
            <CardHeader>
              <CardTitle>Recent Inquiries</CardTitle>
              <CardDescription>Messages from potential renters</CardDescription>
            </CardHeader>
            <CardContent>
              {inquiries.length === 0 ? (
                <div className="text-center py-12">
                  <MessageSquare className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                  <h3 className="text-lg font-medium mb-2">No inquiries yet</h3>
                  <p className="text-muted-foreground mb-4">
                    When potential renters contact you, their messages will appear here
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {inquiries.map((inquiry) => (
                    <Card key={inquiry.id} className="overflow-hidden">
                      <CardContent className="p-4">
                        <div className="flex items-start gap-4">
                          <div className="h-10 w-10 rounded-full overflow-hidden">
                            <img
                              src={inquiry.renterAvatar || "/placeholder.svg"}
                              alt={inquiry.renterName}
                              className="h-full w-full object-cover"
                            />
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center justify-between">
                              <h4 className="font-medium">{inquiry.renterName}</h4>
                              <div className="flex items-center gap-2">
                                <span className="text-xs text-muted-foreground">
                                  {inquiry.date.toLocaleDateString()}
                                </span>
                                {inquiry.status === "new" && <Badge className="bg-primary">New</Badge>}
                              </div>
                            </div>
                            <p className="text-sm text-muted-foreground">Re: {inquiry.property}</p>
                            <p className="mt-2 text-sm">{inquiry.message}</p>
                            <div className="mt-4 flex justify-end gap-2">
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => router.push(`/messages?id=${inquiry.id}`)}
                              >
                                Reply
                              </Button>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                  <div className="text-center mt-4">
                    <Button variant="outline" onClick={() => router.push("/messages")}>
                      View All Messages
                    </Button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="viewings">
          <Card>
            <CardHeader>
              <CardTitle>Scheduled Viewings</CardTitle>
              <CardDescription>Upcoming property viewings</CardDescription>
            </CardHeader>
            <CardContent>
              {scheduledViewings.length === 0 ? (
                <div className="text-center py-12">
                  <Home className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                  <h3 className="text-lg font-medium mb-2">No viewings scheduled</h3>
                  <p className="text-muted-foreground mb-4">When renters schedule viewings, they will appear here</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {scheduledViewings.map((viewing) => (
                    <Card key={viewing.id} className="overflow-hidden">
                      <CardContent className="p-4">
                        <div className="flex items-start gap-4">
                          <div className="h-10 w-10 rounded-full overflow-hidden">
                            <img
                              src={viewing.renterAvatar || "/placeholder.svg"}
                              alt={viewing.renterName}
                              className="h-full w-full object-cover"
                            />
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center justify-between">
                              <h4 className="font-medium">{viewing.renterName}</h4>
                              <span className="text-xs text-muted-foreground">
                                {viewing.date.toLocaleDateString()} at{" "}
                                {viewing.date.toLocaleTimeString([], {
                                  hour: "2-digit",
                                  minute: "2-digit",
                                })}
                              </span>
                            </div>
                            <p className="text-sm text-muted-foreground">Property: {viewing.property}</p>
                            <div className="mt-4 flex justify-end gap-2">
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => handleViewingConfirmation(viewing.id, "confirm")}
                              >
                                Confirm
                              </Button>
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => handleViewingConfirmation(viewing.id, "reschedule")}
                              >
                                Reschedule
                              </Button>
                              <Button
                                size="sm"
                                variant="outline"
                                className="text-destructive"
                                onClick={() => handleViewingConfirmation(viewing.id, "cancel")}
                              >
                                Cancel
                              </Button>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                  <div className="text-center mt-4">
                    <Button variant="outline" onClick={() => router.push("/appointments")}>
                      View All Appointments
                    </Button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analytics">
          <Card>
            <CardHeader>
              <CardTitle>Property Analytics</CardTitle>
              <CardDescription>Views and engagement metrics</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[300px] w-full bg-muted/20 rounded-lg flex items-center justify-center">
                <p className="text-muted-foreground">Analytics chart will be displayed here</p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium text-muted-foreground">Total Views</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">1,245</div>
                    <p className="text-xs text-muted-foreground mt-1">
                      <span className="text-success">↑ 12%</span> from last month
                    </p>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium text-muted-foreground">Inquiries Rate</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">8.2%</div>
                    <p className="text-xs text-muted-foreground mt-1">
                      <span className="text-success">↑ 2.1%</span> from last month
                    </p>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium text-muted-foreground">Avg. Response Time</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">4.5 hrs</div>
                    <p className="text-xs text-muted-foreground mt-1">
                      <span className="text-destructive">↑ 0.5 hrs</span> from last month
                    </p>
                  </CardContent>
                </Card>
              </div>
              <div className="text-center mt-6">
                <Button onClick={() => router.push("/analytics")}>View Detailed Analytics</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
