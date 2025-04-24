"use client"

import { useAuth } from "@/contexts/auth-context"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"
import {
  Home,
  Heart,
  MessageSquare,
  Bell,
  Calendar,
  Search,
  Clock,
  MapPin,
  Filter,
  ArrowRight,
  LogOut,
} from "lucide-react"
import { PropertyCard } from "@/components/properties/PropertyCard"
import { usePropertySearch } from "@/hooks/usePropertySearch"
import { useNotifications } from "@/hooks/useNotifications"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { format } from "date-fns"
import { useToast } from "@/components/ui/use-toast"
import Link from "next/link"

export default function RenterDashboard() {
  const { profile, signOut } = useAuth()
  const { results: recentProperties } = usePropertySearch()
  const { notifications, unreadCount } = useNotifications()
  const router = useRouter()
  const { toast } = useToast()

  // Mock data for saved searches
  const savedSearches = [
    { id: "1", name: "Downtown Apartments", filters: "2+ beds, $1000-$1500/mo", date: new Date() },
    { id: "2", name: "Suburban Houses", filters: "3+ beds, 2+ baths", date: new Date(Date.now() - 86400000) },
  ]

  // Mock data for upcoming viewings
  const upcomingViewings = [
    {
      id: "1",
      propertyName: "Modern Downtown Loft",
      propertyId: "prop1",
      address: "123 Main St, Apt 4B",
      date: new Date(Date.now() + 172800000),
      ownerName: "John Smith",
      ownerAvatar: "https://api.dicebear.com/7.x/avatars/svg?seed=john",
    },
    {
      id: "2",
      propertyName: "Spacious Family Home",
      propertyId: "prop2",
      address: "456 Oak Ave",
      date: new Date(Date.now() + 432000000),
      ownerName: "Sarah Johnson",
      ownerAvatar: "https://api.dicebear.com/7.x/avatars/svg?seed=sarah",
    },
  ]

  // Mock data for recent activity
  const recentActivity = [
    { type: "view", property: "Luxury Condo", propertyId: "prop3", date: new Date(Date.now() - 3600000) },
    {
      type: "message",
      property: "Downtown Apartment",
      propertyId: "prop4",
      owner: "Jane Doe",
      date: new Date(Date.now() - 7200000),
    },
    { type: "save", property: "Beachfront Villa", propertyId: "prop5", date: new Date(Date.now() - 86400000) },
    {
      type: "application",
      property: "Modern Loft",
      propertyId: "prop6",
      status: "Under Review",
      date: new Date(Date.now() - 172800000),
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

  const navigateToProperty = (propertyId: string) => {
    router.push(`/properties/${propertyId}`)
  }

  const navigateToSearch = (searchId: string) => {
    // In a real app, this would apply the saved search filters
    router.push(`/properties?saved=${searchId}`)
  }

  return (
    <div className="space-y-8">
      {/* Welcome Card */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Welcome, {profile?.full_name}</CardTitle>
            <CardDescription>Your renter dashboard helps you find and manage your property search</CardDescription>
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
              onClick={() => router.push("/properties")}
            >
              <Search className="h-4 w-4" />
              <span>Find Properties</span>
            </Button>
            <Button
              variant="outline"
              className="flex items-center justify-start gap-2"
              onClick={() => router.push("/saved-properties")}
            >
              <Heart className="h-4 w-4" />
              <span>Saved Properties</span>
            </Button>
            <Button
              variant="outline"
              className="flex items-center justify-start gap-2"
              onClick={() => router.push("/messages")}
            >
              <MessageSquare className="h-4 w-4" />
              <span>Messages</span>
              <Badge className="ml-auto bg-primary text-xs">3</Badge>
            </Button>
            <Button
              variant="outline"
              className="flex items-center justify-start gap-2"
              onClick={() => router.push("/appointments")}
            >
              <Calendar className="h-4 w-4" />
              <span>Viewings</span>
              <Badge className="ml-auto bg-primary text-xs">{upcomingViewings.length}</Badge>
            </Button>
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="dashboard">
        <TabsList className="mb-6">
          <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
          <TabsTrigger value="properties">Properties</TabsTrigger>
          <TabsTrigger value="viewings">Viewings</TabsTrigger>
          <TabsTrigger value="activity">Activity</TabsTrigger>
        </TabsList>

        <TabsContent value="dashboard">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="md:col-span-2 space-y-6">
              {/* Upcoming Viewings */}
              <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                  <div>
                    <CardTitle>Upcoming Viewings</CardTitle>
                    <CardDescription>Your scheduled property viewings</CardDescription>
                  </div>
                  <Button variant="ghost" size="sm" onClick={() => router.push("/appointments")}>
                    View All <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </CardHeader>
                <CardContent>
                  {upcomingViewings.length === 0 ? (
                    <div className="text-center py-6 text-muted-foreground">
                      <Calendar className="mx-auto h-8 w-8 opacity-50 mb-2" />
                      <p>No upcoming viewings scheduled</p>
                      <Button variant="link" onClick={() => router.push("/properties")}>
                        Browse properties to schedule a viewing
                      </Button>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {upcomingViewings.map((viewing) => (
                        <div key={viewing.id} className="flex items-start gap-4 p-4 border rounded-lg">
                          <div className="bg-muted rounded-full p-2">
                            <Calendar className="h-5 w-5 text-primary" />
                          </div>
                          <div className="flex-1">
                            <h4 className="font-medium">
                              <Link
                                href={`/properties/${viewing.propertyId}`}
                                className="hover:text-primary hover:underline"
                              >
                                {viewing.propertyName}
                              </Link>
                            </h4>
                            <div className="flex items-center text-sm text-muted-foreground">
                              <MapPin className="h-3 w-3 mr-1" />
                              {viewing.address}
                            </div>
                            <div className="flex items-center justify-between mt-2">
                              <div className="text-sm font-medium">
                                {format(viewing.date, "EEEE, MMMM d")} at {format(viewing.date, "h:mm a")}
                              </div>
                              <div className="flex items-center">
                                <Avatar className="h-6 w-6 mr-2">
                                  <AvatarImage src={viewing.ownerAvatar || "/placeholder.svg"} />
                                  <AvatarFallback>{viewing.ownerName[0]}</AvatarFallback>
                                </Avatar>
                                <span className="text-sm">{viewing.ownerName}</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Recently Viewed Properties */}
              <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                  <div>
                    <CardTitle>Recently Viewed</CardTitle>
                    <CardDescription>Properties you've recently viewed</CardDescription>
                  </div>
                  <Button variant="ghost" size="sm" onClick={() => router.push("/properties")}>
                    Browse More <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {recentProperties.length > 0 ? (
                      recentProperties
                        .slice(0, 4)
                        .map((property) => (
                          <PropertyCard
                            key={property.id}
                            id={property.id}
                            title={property.title}
                            price={property.price}
                            location={property.location}
                            beds={property.specs.beds}
                            baths={property.specs.baths}
                            sqft={property.specs.sqft}
                            imageUrl={property.images?.[0] || ""}
                          />
                        ))
                    ) : (
                      <div className="col-span-2 text-center py-6 text-muted-foreground">
                        <p>No recently viewed properties</p>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="space-y-6">
              {/* Saved Searches */}
              <Card>
                <CardHeader>
                  <CardTitle>Saved Searches</CardTitle>
                  <CardDescription>Your saved property searches</CardDescription>
                </CardHeader>
                <CardContent>
                  {savedSearches.length === 0 ? (
                    <div className="text-center py-6 text-muted-foreground">
                      <Filter className="mx-auto h-8 w-8 opacity-50 mb-2" />
                      <p>No saved searches</p>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {savedSearches.map((search) => (
                        <div key={search.id} className="p-3 border rounded-lg">
                          <div className="flex items-center justify-between">
                            <h4 className="font-medium">{search.name}</h4>
                            <Button variant="ghost" size="sm" onClick={() => navigateToSearch(search.id)}>
                              <Search className="h-4 w-4" />
                            </Button>
                          </div>
                          <p className="text-sm text-muted-foreground">{search.filters}</p>
                          <p className="text-xs text-muted-foreground mt-2">
                            Saved {format(search.date, "MMM d, yyyy")}
                          </p>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Notifications */}
              <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                  <div>
                    <CardTitle>Notifications</CardTitle>
                    <CardDescription>Your latest updates</CardDescription>
                  </div>
                  {unreadCount > 0 && (
                    <Badge variant="default" className="text-xs">
                      {unreadCount} unread
                    </Badge>
                  )}
                </CardHeader>
                <CardContent>
                  {notifications.length === 0 ? (
                    <div className="text-center py-6 text-muted-foreground">
                      <Bell className="mx-auto h-8 w-8 opacity-50 mb-2" />
                      <p>No notifications</p>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {notifications.slice(0, 5).map((notification) => (
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
                      ))}
                      <Button variant="link" className="w-full" onClick={() => router.push("/notifications")}>
                        View All Notifications
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="properties">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Saved Properties</CardTitle>
                <CardDescription>Properties you've saved</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recentProperties.slice(0, 2).map((property) => (
                    <div key={property.id} className="flex items-start gap-3 border-b pb-3">
                      <div
                        className="relative h-16 w-16 rounded-md overflow-hidden flex-shrink-0 cursor-pointer"
                        onClick={() => navigateToProperty(property.id)}
                      >
                        <img
                          src={property.images[0] || "/placeholder.svg?height=64&width=64"}
                          alt={property.title}
                          className="object-cover h-full w-full"
                        />
                      </div>
                      <div className="flex-1">
                        <h4
                          className="font-medium line-clamp-1 hover:text-primary cursor-pointer"
                          onClick={() => navigateToProperty(property.id)}
                        >
                          {property.title}
                        </h4>
                        <p className="text-sm text-muted-foreground">${property.price}/mo</p>
                        <div className="flex items-center text-xs text-muted-foreground mt-1">
                          <MapPin className="h-3 w-3 mr-1" />
                          {property.location}
                        </div>
                      </div>
                      <Button variant="ghost" size="sm" className="flex-shrink-0">
                        <Heart className="h-4 w-4 fill-primary text-primary" />
                      </Button>
                    </div>
                  ))}
                  <Button variant="outline" className="w-full" onClick={() => router.push("/saved-properties")}>
                    View All Saved Properties
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Recent Applications</CardTitle>
                <CardDescription>Status of your rental applications</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="p-3 border rounded-lg">
                    <div className="flex items-center justify-between">
                      <h4 className="font-medium">Modern Downtown Loft</h4>
                      <Badge className="bg-warning/20 text-warning border-warning">Under Review</Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Applied on {format(new Date(Date.now() - 172800000), "MMM d, yyyy")}
                    </p>
                  </div>
                  <div className="p-3 border rounded-lg">
                    <div className="flex items-center justify-between">
                      <h4 className="font-medium">Riverside Apartment</h4>
                      <Badge className="bg-success/20 text-success border-success">Approved</Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Applied on {format(new Date(Date.now() - 432000000), "MMM d, yyyy")}
                    </p>
                  </div>
                  <Button variant="outline" className="w-full" onClick={() => router.push("/applications")}>
                    View All Applications
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Recommended For You</CardTitle>
                <CardDescription>Based on your preferences</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recentProperties.slice(2, 4).map((property) => (
                    <div key={property.id} className="flex items-start gap-3 border-b pb-3">
                      <div
                        className="relative h-16 w-16 rounded-md overflow-hidden flex-shrink-0 cursor-pointer"
                        onClick={() => navigateToProperty(property.id)}
                      >
                        <img
                          src={property.images[0] || "/placeholder.svg?height=64&width=64"}
                          alt={property.title}
                          className="object-cover h-full w-full"
                        />
                      </div>
                      <div className="flex-1">
                        <h4
                          className="font-medium line-clamp-1 hover:text-primary cursor-pointer"
                          onClick={() => navigateToProperty(property.id)}
                        >
                          {property.title}
                        </h4>
                        <p className="text-sm text-muted-foreground">${property.price}/mo</p>
                        <div className="flex items-center text-xs text-muted-foreground mt-1">
                          <MapPin className="h-3 w-3 mr-1" />
                          {property.location}
                        </div>
                      </div>
                      <Button variant="ghost" size="sm" className="flex-shrink-0">
                        <Heart className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                  <Button variant="outline" className="w-full" onClick={() => router.push("/properties")}>
                    View More Properties
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="viewings">
          <Card>
            <CardHeader>
              <CardTitle>Property Viewings</CardTitle>
              <CardDescription>Manage your scheduled property viewings</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-medium mb-3">Upcoming Viewings</h3>
                  {upcomingViewings.length === 0 ? (
                    <div className="text-center py-6 text-muted-foreground border rounded-lg">
                      <Calendar className="mx-auto h-8 w-8 opacity-50 mb-2" />
                      <p>No upcoming viewings scheduled</p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {upcomingViewings.map((viewing) => (
                        <div key={viewing.id} className="flex items-start gap-4 p-4 border rounded-lg">
                          <div className="bg-muted rounded-full p-3">
                            <Calendar className="h-6 w-6 text-primary" />
                          </div>
                          <div className="flex-1">
                            <h4 className="font-medium text-lg">
                              <Link
                                href={`/properties/${viewing.propertyId}`}
                                className="hover:text-primary hover:underline"
                              >
                                {viewing.propertyName}
                              </Link>
                            </h4>
                            <div className="flex items-center text-muted-foreground">
                              <MapPin className="h-4 w-4 mr-1" />
                              {viewing.address}
                            </div>
                            <div className="mt-3">
                              <div className="text-sm font-medium">
                                {format(viewing.date, "EEEE, MMMM d, yyyy")} at {format(viewing.date, "h:mm a")}
                              </div>
                              <div className="flex items-center mt-2">
                                <Avatar className="h-6 w-6 mr-2">
                                  <AvatarImage src={viewing.ownerAvatar || "/placeholder.svg"} />
                                  <AvatarFallback>{viewing.ownerName[0]}</AvatarFallback>
                                </Avatar>
                                <span className="text-sm">With {viewing.ownerName}</span>
                              </div>
                            </div>
                            <div className="flex gap-2 mt-3">
                              <Button size="sm" variant="outline">
                                Reschedule
                              </Button>
                              <Button size="sm" variant="outline" className="text-destructive">
                                Cancel
                              </Button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <div>
                  <h3 className="text-lg font-medium mb-3">Past Viewings</h3>
                  <div className="space-y-4">
                    <div className="flex items-start gap-4 p-4 border rounded-lg bg-muted/30">
                      <div className="bg-muted rounded-full p-3">
                        <Clock className="h-6 w-6 text-muted-foreground" />
                      </div>
                      <div className="flex-1">
                        <h4 className="font-medium text-lg">
                          <Link href="/properties/luxury-condo" className="hover:text-primary hover:underline">
                            Luxury Downtown Condo
                          </Link>
                        </h4>
                        <div className="flex items-center text-muted-foreground">
                          <MapPin className="h-4 w-4 mr-1" />
                          789 Park Ave, Unit 12A
                        </div>
                        <div className="mt-3">
                          <div className="text-sm font-medium">
                            {format(new Date(Date.now() - 604800000), "EEEE, MMMM d, yyyy")} at 2:00 PM
                          </div>
                          <div className="flex items-center mt-2">
                            <Avatar className="h-6 w-6 mr-2">
                              <AvatarImage src="https://api.dicebear.com/7.x/avatars/svg?seed=michael" />
                              <AvatarFallback>M</AvatarFallback>
                            </Avatar>
                            <span className="text-sm">With Michael Brown</span>
                          </div>
                        </div>
                        <div className="flex gap-2 mt-3">
                          <Button size="sm" onClick={() => router.push("/properties/luxury-condo")}>
                            View Property
                          </Button>
                          <Button size="sm" variant="outline" onClick={() => router.push("/messages/michael")}>
                            Contact Agent
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="activity">
          <Card>
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
              <CardDescription>Your recent actions and updates</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {recentActivity.map((activity, index) => (
                  <div key={index} className="flex gap-4">
                    <div className="relative mt-1">
                      <div className="bg-muted rounded-full p-2">
                        {activity.type === "view" && <Search className="h-4 w-4 text-primary" />}
                        {activity.type === "message" && <MessageSquare className="h-4 w-4 text-primary" />}
                        {activity.type === "save" && <Heart className="h-4 w-4 text-primary" />}
                        {activity.type === "application" && <Home className="h-4 w-4 text-primary" />}
                      </div>
                      {index < recentActivity.length - 1 && (
                        <div className="absolute top-10 bottom-0 left-1/2 w-px -translate-x-1/2 bg-muted" />
                      )}
                    </div>
                    <div className="pb-6">
                      <div className="font-medium">
                        {activity.type === "view" && (
                          <>
                            Viewed{" "}
                            <Link href={`/properties/${activity.propertyId}`} className="text-primary hover:underline">
                              {activity.property}
                            </Link>
                          </>
                        )}
                        {activity.type === "message" && (
                          <>
                            Messaged {activity.owner} about{" "}
                            <Link href={`/properties/${activity.propertyId}`} className="text-primary hover:underline">
                              {activity.property}
                            </Link>
                          </>
                        )}
                        {activity.type === "save" && (
                          <>
                            Saved{" "}
                            <Link href={`/properties/${activity.propertyId}`} className="text-primary hover:underline">
                              {activity.property}
                            </Link>{" "}
                            to favorites
                          </>
                        )}
                        {activity.type === "application" && (
                          <>
                            Application for{" "}
                            <Link href={`/properties/${activity.propertyId}`} className="text-primary hover:underline">
                              {activity.property}
                            </Link>
                            : {activity.status}
                          </>
                        )}
                      </div>
                      <div className="text-sm text-muted-foreground mt-1">
                        {format(activity.date, "MMM d, yyyy")} at {format(activity.date, "h:mm a")}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
