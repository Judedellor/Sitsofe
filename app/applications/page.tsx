"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { format } from "date-fns"
import { ClipboardList, Search, Filter, Eye, CheckCircle, XCircle, Clock, Home } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useAuth } from "@/hooks/useAuth"
import { useToast } from "@/components/ui/use-toast"

// Mock data - in a real app, this would come from an API
const mockApplications = [
  {
    id: "1",
    propertyId: "101",
    propertyTitle: "Modern Downtown Apartment",
    propertyImage: "/placeholder.svg?height=100&width=200",
    propertyAddress: "123 Main St, Anytown, USA",
    landlordName: "Jane Smith",
    status: "pending",
    submittedDate: "2023-04-15T10:30:00Z",
    rent: 1800,
    moveInDate: "2023-05-01T00:00:00Z",
  },
  {
    id: "2",
    propertyId: "102",
    propertyTitle: "Spacious Suburban House",
    propertyImage: "/placeholder.svg?height=100&width=200",
    propertyAddress: "456 Oak Ave, Somewhere, USA",
    landlordName: "John Doe",
    status: "approved",
    submittedDate: "2023-03-20T14:45:00Z",
    rent: 2500,
    moveInDate: "2023-04-15T00:00:00Z",
  },
  {
    id: "3",
    propertyId: "103",
    propertyTitle: "Cozy Studio near University",
    propertyImage: "/placeholder.svg?height=100&width=200",
    propertyAddress: "789 College Blvd, Collegetown, USA",
    landlordName: "Robert Johnson",
    status: "rejected",
    submittedDate: "2023-02-10T09:15:00Z",
    rent: 1200,
    moveInDate: "2023-03-01T00:00:00Z",
    rejectionReason: "Another applicant was selected",
  },
]

const statusColors = {
  pending: "bg-yellow-100 text-yellow-800",
  approved: "bg-green-100 text-green-800",
  rejected: "bg-red-100 text-red-800",
}

const statusIcons = {
  pending: <Clock className="h-4 w-4 mr-1" />,
  approved: <CheckCircle className="h-4 w-4 mr-1" />,
  rejected: <XCircle className="h-4 w-4 mr-1" />,
}

export default function ApplicationsPage() {
  const { user } = useAuth()
  const [applications, setApplications] = useState(mockApplications)
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const router = useRouter()
  const { toast } = useToast()

  useEffect(() => {
    // Simulate API call
    const timer = setTimeout(() => {
      setLoading(false)
    }, 1000)
    
    return () => clearTimeout(timer)
  }, [])

  const filteredApplications = applications.filter(app => {
    const matchesSearch = app.propertyTitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          app.propertyAddress.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          app.landlordName.toLowerCase().includes(searchQuery.toLowerCase())
    
    const matchesStatus = statusFilter === 'all' || app.status === statusFilter
    
    return matchesSearch && matchesStatus
  })

  const handleViewApplication = (applicationId) => {
    // In a real app, navigate to application details
    toast({
      title: "Feature Coming Soon",
      description: "Application details view is under development",
    })
  }

  const handleViewProperty = (propertyId) => {
    router.push(`/properties/${propertyId}`)
  }

  if (!user) {
    router.push('/login')
    return null
  }

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-6">Rental Applications</h1>
      
      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            placeholder="Search applications..."
            className="pl-9"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-full md:w-[180px]">
            <Filter className="h-4 w-4 mr-2" />
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Statuses</SelectItem>
            <SelectItem value="pending">Pending</SelectItem>
            <SelectItem value="approved">Approved</SelectItem>
            <SelectItem value="rejected">Rejected</SelectItem>
          </SelectContent>
        </Select>
      </div>
      
      <Tabs defaultValue="all">
        <TabsList className="mb-6">
          <TabsTrigger value="all">All Applications</TabsTrigger>
          <TabsTrigger value="pending">Pending</TabsTrigger>
          <TabsTrigger value="approved">Approved</TabsTrigger>
          <TabsTrigger value="rejected">Rejected</TabsTrigger>
        </TabsList>
        
        <TabsContent value="all">
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(3)].map((_, i) => (
                <Card key={i}>
                  <CardHeader className="pb-2">
                    <Skeleton className="h-4 w-3/4 mb-2" />
                    <Skeleton className="h-3 w-1/2" />
                  </CardHeader>
                  <CardContent>
                    <Skeleton className="h-20 w-full mb-4" />
                    <div className="space-y-2">
                      <Skeleton className="h-3 w-full" />
                      <Skeleton className="h-3 w-2/3" />
                      <Skeleton className="h-3 w-1/2" />
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Skeleton className="h-9 w-full" />
                  </CardFooter>
                </Card>
              ))}
            </div>
          ) : filteredApplications.length === 0 ? (
            <div className="text-center py-12">
              <ClipboardList className="mx-auto h-16 w-16 text-muted-foreground mb-4" />
              <h2 className="text-2xl font-semibold mb-2">No applications found</h2>
              <p className="text-muted-foreground mb-6">
                {searchQuery || statusFilter !== 'all' 
                  ? "Try adjusting your search or filters"
                  : "You haven't submitted any rental applications yet"}
              </p>
              <Button onClick={() => router.push('/properties')}>
                Browse Properties
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredApplications.map((application) => (
                <Card key={application.id}>
                  <CardHeader className="pb-2">
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle className="text-lg">{application.propertyTitle}</CardTitle>
                        <CardDescription>{application.propertyAddress}</CardDescription>
                      </div>
                      <Badge className={statusColors[application.status]}>
                        <div className="flex items-center">
                          {statusIcons[application.status]}
                          <span>{application.status.charAt(0).toUpperCase() + application.status.slice(1)}</span>
                        </div>
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="relative h-40 bg-muted mb-4 rounded-md overflow-hidden">
                      {application.propertyImage ? (
                        <img 
                          src={application.propertyImage || "/placeholder.svg"} 
                          alt={application.propertyTitle} 
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <div className="flex h-full items-center justify-center bg-muted">
                          <Home className="h-12 w-12 text-muted-foreground" />
                        </div>
                      )}
                    </div>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Landlord:</span>
                        <span>{application.landlordName}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Rent:</span>
                        <span>${application.rent}/month</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Submitted:</span>
                        <span>{format(new Date(application.submittedDate), 'MMM d, yyyy')}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Move-in Date:</span>
                        <span>{format(new Date(application.moveInDate), 'MMM d, yyyy')}</span>
                      </div>
                      {application.status === 'rejected' && application.rejectionReason && (
                        <div className="pt-2 text-red-600">
                          <p className="font-medium">Reason: {application.rejectionReason}</p>
                        </div>
                      )}
                    </div>
                  </CardContent>
                  <CardFooter className="flex gap-2">
                    <Button 
                      variant="outline" 
                      className="flex-1"
                      onClick={() => handleViewApplication(application.id)}
                    >
                      <Eye className="h-4 w-4 mr-2" /> View Application
                    </Button>
                    <Button 
                      className="flex-1"
                      onClick={() => handleViewProperty(application.propertyId)}
                    >
                      View Property
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>
        
        <TabsContent value="pending">
          {/* Similar content structure as "all" tab but filtered for pending */}
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(2)].map((_, i) => (
                <Card key={i}>
                  <CardHeader className="pb-2">
                    <Skeleton className="h-


\
