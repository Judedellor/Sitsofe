"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { CheckSquare, XSquare, Eye, CheckCircle } from "lucide-react"
import { format } from "date-fns"
import { useToast } from "@/components/ui/use-toast"

interface Property {
  id: string
  title: string
  owner: string
  ownerAvatar?: string
  location: string
  price: number
  status: string
  submittedAt: Date
  images: string[]
}

interface PropertyVerificationCardProps {
  properties?: Property[]
}

// Mock data for property submissions
const mockProperties = [
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

export function PropertyVerificationCard({ properties = mockProperties }: PropertyVerificationCardProps) {
  const { toast } = useToast()
  const [verifiedProperties, setVerifiedProperties] = useState<string[]>([])

  const handlePropertyApproval = (propertyId: string, action: "approve" | "reject") => {
    const property = properties.find((p) => p.id === propertyId)
    if (!property) return

    setVerifiedProperties([...verifiedProperties, propertyId])

    toast({
      title: action === "approve" ? "Property Approved" : "Property Rejected",
      description: `${property.title} has been ${action === "approve" ? "approved" : "rejected"}.`,
      variant: action === "approve" ? "default" : "destructive",
    })
  }

  const pendingProperties = properties.filter((p) => !verifiedProperties.includes(p.id))

  return (
    <Card>
      <CardHeader>
        <CardTitle>Property Verification Queue</CardTitle>
        <CardDescription>Review and approve property submissions</CardDescription>
      </CardHeader>
      <CardContent>
        {pendingProperties.length === 0 ? (
          <div className="text-center py-12">
            <CheckCircle className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
            <h3 className="text-lg font-medium mb-2">No pending properties</h3>
            <p className="text-muted-foreground">All property submissions have been reviewed</p>
          </div>
        ) : (
          <div className="space-y-6">
            {pendingProperties.map((property) => (
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
  )
}
