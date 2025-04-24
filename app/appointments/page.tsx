"use client"

import { useState } from "react"
import { useAuth } from "@/contexts/auth-context"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Input } from "@/components/ui/input"
import { format, isAfter, isBefore } from "date-fns"
import { Search, Calendar, Clock, MapPin, CheckCircle } from "lucide-react"
import { ProtectedRoute } from "@/components/auth/protected-route"
import { useToast } from "@/components/ui/use-toast"
import Link from "next/link"

// Mock appointments data
const mockAppointments = [
  {
    id: "apt1",
    property: {
      id: "prop1",
      title: "Modern Downtown Loft",
      location: "123 Main St, Downtown",
      image: "/placeholder.svg?height=300&width=400",
    },
    date: new Date(Date.now() + 172800000), // 2 days in future
    status: "confirmed",
    otherParty: {
      id: "user1",
      name: "John Smith",
      role: "owner",
      avatar: "https://api.dicebear.com/7.x/avatars/svg?seed=john",
    },
  },
  {
    id: "apt2",
    property: {
      id: "prop2",
      title: "Riverside Apartment",
      location: "456 River Rd, Riverside",
      image: "/placeholder.svg?height=300&width=400",
    },
    date: new Date(Date.now() + 432000000), // 5 days in future
    status: "pending",
    otherParty: {
      id: "user2",
      name: "Sarah Johnson",
      role: "owner",
      avatar: "https://api.dicebear.com/7.x/avatars/svg?seed=sarah",
    },
  },
  {
    id: "apt3",
    property: {
      id: "prop3",
      title: "Luxury Condo",
      location: "789 Ocean Blvd, Beachfront",
      image: "/placeholder.svg?height=300&width=400",
    },
    date: new Date(Date.now() - 259200000), // 3 days in past
    status: "completed",
    otherParty: {
      id: "user3",
      name: "Michael Brown",
      role: "owner",
      avatar: "https://api.dicebear.com/7.x/avatars/svg?seed=michael",
    },
    feedback: {
      rating: 4,
      comment: "Great property, exactly as described. The owner was very helpful.",
    },
  },
  {
    id: "apt4",
    property: {
      id: "prop4",
      title: "Cozy Studio",
      location: "101 Center Ave, Midtown",
      image: "/placeholder.svg?height=300&width=400",
    },
    date: new Date(Date.now() - 86400000), // 1 day in past
    status: "cancelled",
    otherParty: {
      id: "user4",
      name: "Emily Davis",
      role: "owner",
      avatar: "https://api.dicebear.com/7.x/avatars/svg?seed=emily",
    },
    cancellationReason: "Schedule conflict",
  },
]

export default function AppointmentsPage() {
  const { profile } = useAuth()
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const { toast } = useToast()

  // Filter appointments based on search query and status filter
  const filteredAppointments = mockAppointments.filter((apt) => {
    const matchesSearch =
      searchQuery === "" ||
      apt.property.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      apt.property.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
      apt.otherParty.name.toLowerCase().includes(searchQuery.toLowerCase())

    const matchesStatus = statusFilter === "all" || apt.status === statusFilter

    return matchesSearch && matchesStatus
  })

  // Separate appointments into upcoming and past
  const upcomingAppointments = filteredAppointments.filter((apt) => isAfter(apt.date, new Date()))
  const pastAppointments = filteredAppointments.filter((apt) => isBefore(apt.date, new Date()))

  const handleCancelAppointment = (aptId: string) => {
    toast({
      title: "Appointment cancelled",
      description: "The appointment has been cancelled successfully.",
    })
    // In a real app, this would update the appointment status in the database
  }

  const handleRescheduleAppointment = (aptId: string) => {
    toast({
      title: "Reschedule requested",
      description: "Your request to reschedule has been sent.",
    })
    // In a real app, this would initiate a reschedule flow
  }

  const handleConfirmAppointment = (aptId: string) => {
    toast({
      title: "Appointment confirmed",
      description: "The appointment has been confirmed successfully.",
    })
    // In a real app, this would update the appointment status in the database
  }

  return (
    <ProtectedRoute>
      <div className="container mx-auto py-8">
        <h1 className="text-3xl font-bold mb-6">Property Viewings</h1>

        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              placeholder="Search appointments..."
              className="pl-10"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <Button variant="outline" onClick={() => (window.location.href = "/properties")}>
            Schedule New Viewing
          </Button>
        </div>

        <Tabs defaultValue="upcoming">
          <TabsList className="mb-6">
            <TabsTrigger value="upcoming">Upcoming</TabsTrigger>
            <TabsTrigger value="past">Past</TabsTrigger>
          </TabsList>

          <TabsContent value="upcoming" className="space-y-6">
            {upcomingAppointments.length === 0 ? (
              <Card>
                <CardContent className="flex flex-col items-center justify-center py-12">
                  <Calendar className="h-12 w-12 text-muted-foreground mb-4" />
                  <h3 className="text-lg font-medium mb-2">No upcoming viewings</h3>
                  <p className="text-muted-foreground mb-4">
                    {searchQuery
                      ? "No viewings match your search criteria"
                      : "You haven't scheduled any property viewings yet"}
                  </p>
                  <Button onClick={() => (window.location.href = "/properties")}>Browse Properties</Button>
                </CardContent>
              </Card>
            ) : (
              upcomingAppointments.map((appointment) => (
                <Card key={appointment.id} className="overflow-hidden">
                  <div className="grid grid-cols-1 md:grid-cols-3">
                    <div className="relative h-48 md:h-auto">
                      <Link href={`/properties/${appointment.property.id}`}>
                        <img
                          src={appointment.property.image || "/placeholder.svg"}
                          alt={appointment.property.title}
                          className="w-full h-full object-cover"
                        />
                      </Link>
                    </div>
                    <div className="p-6 md:col-span-2">
                      <div className="flex items-start justify-between">
                        <div>
                          <Link href={`/properties/${appointment.property.id}`} className="hover:underline">
                            <h3 className="text-lg font-medium">{appointment.property.title}</h3>
                          </Link>
                          <div className="flex items-center text-muted-foreground mt-1">
                            <MapPin className="h-4 w-4 mr-1" />
                            {appointment.property.location}
                          </div>
                        </div>
                        {appointment.status === "confirmed" && (
                          <Badge className="bg-success/20 text-success border-success">Confirmed</Badge>
                        )}
                        {appointment.status === "pending" && (
                          <Badge className="bg-warning/20 text-warning border-warning">Pending</Badge>
                        )}
                      </div>

                      <div className="mt-4 flex items-center">
                        <Calendar className="h-5 w-5 text-primary mr-2" />
                        <span className="font-medium">
                          {format(appointment.date, "EEEE, MMMM d, yyyy")} at {format(appointment.date, "h:mm a")}
                        </span>
                      </div>

                      <div className="flex items-center mt-4">
                        <Avatar className="h-8 w-8 mr-2">
                          <AvatarImage src={appointment.otherParty.avatar || "/placeholder.svg"} />
                          <AvatarFallback>{appointment.otherParty.name[0]}</AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="text-sm font-medium">{appointment.otherParty.name}</p>
                          <p className="text-xs text-muted-foreground">
                            {appointment.otherParty.role === "owner" ? "Property Owner" : "Potential Renter"}
                          </p>
                        </div>
                      </div>

                      <div className="flex gap-3 mt-6">
                        {appointment.status === "pending" && (
                          <Button onClick={() => handleConfirmAppointment(appointment.id)}>
                            <CheckCircle className="h-4 w-4 mr-2" />
                            Confirm
                          </Button>
                        )}
                        <Button variant="outline" onClick={() => handleRescheduleAppointment(appointment.id)}>
                          Reschedule
                        </Button>
                        <Button
                          variant="outline"
                          className="text-destructive"
                          onClick={() => handleCancelAppointment(appointment.id)}
                        >
                          Cancel
                        </Button>
                        <Button
                          variant="outline"
                          className="ml-auto"
                          onClick={() => (window.location.href = `/messages/${appointment.otherParty.id}`)}
                        >
                          Message
                        </Button>
                      </div>
                    </div>
                  </div>
                </Card>
              ))
            )}
          </TabsContent>

          <TabsContent value="past" className="space-y-6">
            {pastAppointments.length === 0 ? (
              <Card>
                <CardContent className="flex flex-col items-center justify-center py-12">
                  <Clock className="h-12 w-12 text-muted-foreground mb-4" />
                  <h3 className="text-lg font-medium mb-2">No past viewings</h3>
                  <p className="text-muted-foreground mb-4">
                    {searchQuery
                      ? "No past viewings match your search criteria"
                      : "You haven't completed any property viewings yet"}
                  </p>
                </CardContent>
              </Card>
            ) : (
              pastAppointments.map((appointment) => (
                <Card key={appointment.id} className="overflow-hidden">
                  <div className="grid grid-cols-1 md:grid-cols-3">
                    <div className="relative h-48 md:h-auto">
                      <Link href={`/properties/${appointment.property.id}`}>
                        <img
                          src={appointment.property.image || "/placeholder.svg"}
                          alt={appointment.property.title}
                          className="w-full h-full object-cover"
                        />
                      </Link>
                    </div>
                    <div className="p-6 md:col-span-2">
                      <div className="flex items-start justify-between">
                        <div>
                          <Link href={`/properties/${appointment.property.id}`} className="hover:underline">
                            <h3 className="text-lg font-medium">{appointment.property.title}</h3>
                          </Link>
                          <div className="flex items-center text-muted-foreground mt-1">
                            <MapPin className="h-4 w-4 mr-1" />
                            {appointment.property.location}
                          </div>
                        </div>
                        {appointment.status === "completed" && (
                          <Badge className="bg-success/20 text-success border-success">Completed</Badge>
                        )}
                        {appointment.status === "cancelled" && (
                          <Badge className="bg-destructive/20 text-destructive border-destructive">Cancelled</Badge>
                        )}
                      </div>

                      <div className="mt-4 flex items-center">
                        <Calendar className="h-5 w-5 text-muted-foreground mr-2" />
                        <span>
                          {format(appointment.date, "EEEE, MMMM d, yyyy")} at {format(appointment.date, "h:mm a")}
                        </span>
                      </div>

                      <div className="flex items-center mt-4">
                        <Avatar className="h-8 w-8 mr-2">
                          <AvatarImage src={appointment.otherParty.avatar || "/placeholder.svg"} />
                          <AvatarFallback>{appointment.otherParty.name[0]}</AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="text-sm font-medium">{appointment.otherParty.name}</p>
                          <p className="text-xs text-muted-foreground">
                            {appointment.otherParty.role === "owner" ? "Property Owner" : "Potential Renter"}
                          </p>
                        </div>
                      </div>

                      {appointment.status === "cancelled" && appointment.cancellationReason && (
                        <div className="mt-4 p-3 bg-destructive/10 rounded-md">
                          <p className="text-sm font-medium text-destructive">Reason for cancellation:</p>
                          <p className="text-sm">{appointment.cancellationReason}</p>
                        </div>
                      )}

                      {appointment.status === "completed" && appointment.feedback && (
                        <div className="mt-4 p-3 bg-muted rounded-md">
                          <div className="flex items-center">
                            <p className="text-sm font-medium mr-2">Your Rating:</p>
                            <div className="flex">
                              {[1, 2, 3, 4, 5].map((star) => (
                                <span
                                  key={star}
                                  className={
                                    star <= appointment.feedback!.rating ? "text-yellow-500" : "text-muted-foreground"
                                  }
                                >
                                  ★
                                </span>
                              ))}
                            </div>
                          </div>
                          <p className="text-sm mt-1">{appointment.feedback.comment}</p>
                        </div>
                      )}

                      <div className="flex gap-3 mt-6">
                        <Button
                          variant="outline"
                          onClick={() => (window.location.href = `/properties/${appointment.property.id}`)}
                        >
                          View Property
                        </Button>
                        {appointment.status === "completed" && !appointment.feedback && <Button>Leave Feedback</Button>}
                        <Button
                          variant="outline"
                          className="ml-auto"
                          onClick={() => (window.location.href = `/messages/${appointment.otherParty.id}`)}
                        >
                          Message
                        </Button>
                      </div>
                    </div>
                  </div>
                </Card>
              ))
            )}
          </TabsContent>
        </Tabs>
      </div>
    </ProtectedRoute>
  )
}
