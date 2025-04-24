"use client"

import { useState, useEffect } from "react"
import { createClient } from "@/lib/supabase/client"
import { toast } from "@/components/ui/use-toast"

// Mock data for admin dashboard
const mockAdminData = {
  stats: {
    totalUsers: 1245,
    activeListings: 876,
    monthlyBookings: 342,
    monthlyRevenue: 78500,
    verificationQueue: 24,
    reportedProperties: 7,
    activeDisputes: 12,
    systemHealth: 98,
  },
  revenueData: [
    { month: "Jan", revenue: 45000 },
    { month: "Feb", revenue: 52000 },
    { month: "Mar", revenue: 49000 },
    { month: "Apr", revenue: 63000 },
    { month: "May", revenue: 59000 },
    { month: "Jun", revenue: 68000 },
    { month: "Jul", revenue: 72000 },
    { month: "Aug", revenue: 78500 },
  ],
  systemMetrics: {
    apiHealth: 98,
    dbLatency: 120,
    storageUsage: 68,
    activeUsers: 342,
    errorRate: 0.8,
  },
  propertySubmissions: [
    {
      id: "prop-1",
      title: "Modern Downtown Apartment",
      owner: "John Smith",
      status: "pending",
      submittedAt: "2023-08-15T10:30:00Z",
      images: ["/placeholder.svg?height=100&width=150"],
    },
    {
      id: "prop-2",
      title: "Suburban Family Home",
      owner: "Sarah Johnson",
      status: "pending",
      submittedAt: "2023-08-14T14:45:00Z",
      images: ["/placeholder.svg?height=100&width=150"],
    },
    {
      id: "prop-3",
      title: "Beachfront Villa",
      owner: "Michael Brown",
      status: "pending",
      submittedAt: "2023-08-13T09:15:00Z",
      images: ["/placeholder.svg?height=100&width=150"],
    },
    {
      id: "prop-4",
      title: "Mountain Cabin Retreat",
      owner: "Emily Davis",
      status: "pending",
      submittedAt: "2023-08-12T16:20:00Z",
      images: ["/placeholder.svg?height=100&width=150"],
    },
  ],
  users: [
    {
      id: "user-1",
      name: "John Smith",
      email: "john.smith@example.com",
      role: "renter",
      status: "active",
      joined: "2023-01-15",
    },
    {
      id: "user-2",
      name: "Sarah Johnson",
      email: "sarah.johnson@example.com",
      role: "owner",
      status: "active",
      joined: "2023-02-20",
    },
    {
      id: "user-3",
      name: "Michael Brown",
      email: "michael.brown@example.com",
      role: "owner",
      status: "suspended",
      joined: "2023-03-10",
    },
    {
      id: "user-4",
      name: "Emily Davis",
      email: "emily.davis@example.com",
      role: "renter",
      status: "active",
      joined: "2023-04-05",
    },
    {
      id: "user-5",
      name: "David Wilson",
      email: "david.wilson@example.com",
      role: "admin",
      status: "active",
      joined: "2023-01-05",
    },
    {
      id: "user-6",
      name: "Jennifer Taylor",
      email: "jennifer.taylor@example.com",
      role: "renter",
      status: "inactive",
      joined: "2023-05-12",
    },
    {
      id: "user-7",
      name: "Robert Martinez",
      email: "robert.martinez@example.com",
      role: "owner",
      status: "active",
      joined: "2023-06-18",
    },
    {
      id: "user-8",
      name: "Lisa Anderson",
      email: "lisa.anderson@example.com",
      role: "renter",
      status: "active",
      joined: "2023-07-22",
    },
  ],
  reports: [
    {
      id: "report-1",
      type: "Property",
      subject: "Misleading Property Description",
      reporter: "John Smith",
      reportedItem: "Modern Downtown Apartment",
      status: "pending",
      date: "2023-08-10",
    },
    {
      id: "report-2",
      type: "User",
      subject: "Inappropriate Behavior",
      reporter: "Sarah Johnson",
      reportedItem: "Michael Brown",
      status: "under review",
      date: "2023-08-09",
    },
    {
      id: "report-3",
      type: "Property",
      subject: "Fake Listing",
      reporter: "Emily Davis",
      reportedItem: "Luxury Penthouse Suite",
      status: "resolved",
      date: "2023-08-05",
    },
    {
      id: "report-4",
      type: "Technical",
      subject: "Payment Processing Error",
      reporter: "David Wilson",
      reportedItem: "System",
      status: "pending",
      date: "2023-08-12",
    },
    {
      id: "report-5",
      type: "User",
      subject: "Spam Messages",
      reporter: "Jennifer Taylor",
      reportedItem: "Robert Martinez",
      status: "under review",
      date: "2023-08-11",
    },
  ],
  analyticsData: {
    userGrowth: [
      { month: "Jan", users: 850 },
      { month: "Feb", users: 940 },
      { month: "Mar", users: 1020 },
      { month: "Apr", users: 1080 },
      { month: "May", users: 1140 },
      { month: "Jun", users: 1190 },
      { month: "Jul", users: 1220 },
      { month: "Aug", users: 1245 },
    ],
    propertyDistribution: [
      { type: "Apartment", count: 420 },
      { type: "House", count: 280 },
      { type: "Condo", count: 150 },
      { type: "Villa", count: 26 },
    ],
    bookingTrends: [
      { month: "Jan", bookings: 210 },
      { month: "Feb", bookings: 240 },
      { month: "Mar", bookings: 280 },
      { month: "Apr", bookings: 290 },
      { month: "May", bookings: 310 },
      { month: "Jun", bookings: 325 },
      { month: "Jul", bookings: 335 },
      { month: "Aug", bookings: 342 },
    ],
  },
}

export interface AdminData {
  stats: {
    totalUsers: number
    activeListings: number
    monthlyBookings: number
    monthlyRevenue: number
    verificationQueue: number
    reportedProperties: number
    activeDisputes: number
    systemHealth: number
  }
  revenueData: Array<{ month: string; revenue: number }>
  systemMetrics: {
    apiHealth: number
    dbLatency: number
    storageUsage: number
    activeUsers: number
    errorRate: number
  }
  propertySubmissions: Array<{
    id: string
    title: string
    owner: string
    status: string
    submittedAt: string
    images: string[]
  }>
  users: Array<{
    id: string
    name: string
    email: string
    role: string
    status: string
    joined: string
  }>
  reports: Array<{
    id: string
    type: string
    subject: string
    reporter: string
    reportedItem: string
    status: string
    date: string
  }>
  analyticsData: {
    userGrowth: Array<{ month: string; users: number }>
    propertyDistribution: Array<{ type: string; count: number }>
    bookingTrends: Array<{ month: string; bookings: number }>
  }
}

export function useAdminData() {
  const [data, setData] = useState<AdminData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)
  const [usingMockData, setUsingMockData] = useState(false)

  useEffect(() => {
    const fetchAdminData = async () => {
      setLoading(true)
      setError(null)

      try {
        const supabase = createClient()

        // Set a timeout for the request
        const timeoutPromise = new Promise<never>((_, reject) => {
          setTimeout(() => reject(new Error("Request timed out")), 5000)
        })

        // Create a promise for the actual data fetch
        const fetchPromise = Promise.all([
          supabase.from("users").select("count").single(),
          supabase
            .from("properties")
            .select("count")
            .single(),
          // Add more queries as needed
        ])

        // Race the timeout against the fetch
        const result = await Promise.race([fetchPromise, timeoutPromise])

        // Process the result and set the data
        // This is a placeholder - you would need to transform the actual data
        setData({
          // Transform your Supabase data to match the AdminData interface
          ...mockAdminData, // Fallback for fields we don't have yet
        })
      } catch (err) {
        console.error("Error fetching admin data:", err)
        setError(err instanceof Error ? err : new Error("Unknown error occurred"))
        setUsingMockData(true)
        setData(mockAdminData)

        // Only show toast for network errors, not when we're just using mock data
        if (err instanceof Error && err.message !== "Request timed out") {
          toast({
            title: "Connection Error",
            description: "Could not connect to the database. Using mock data instead.",
            variant: "destructive",
          })
        }
      } finally {
        setLoading(false)
      }
    }

    fetchAdminData()
  }, [])

  const approveProperty = async (propertyId: string) => {
    try {
      const supabase = createClient()

      // In a real app, you would update the property status in Supabase
      // await supabase.from('properties').update({ status: 'approved' }).eq('id', propertyId);

      // For now, we'll just update the local state
      setData((prevData) => {
        if (!prevData) return prevData

        return {
          ...prevData,
          propertySubmissions: prevData.propertySubmissions.map((prop) =>
            prop.id === propertyId ? { ...prop, status: "approved" } : prop,
          ),
        }
      })

      toast({
        title: "Property Approved",
        description: "The property has been approved and is now live.",
      })

      return true
    } catch (err) {
      console.error("Error approving property:", err)
      toast({
        title: "Error",
        description: "Failed to approve property. Please try again.",
        variant: "destructive",
      })
      return false
    }
  }

  const rejectProperty = async (propertyId: string) => {
    try {
      const supabase = createClient()

      // In a real app, you would update the property status in Supabase
      // await supabase.from('properties').update({ status: 'rejected' }).eq('id', propertyId);

      // For now, we'll just update the local state
      setData((prevData) => {
        if (!prevData) return prevData

        return {
          ...prevData,
          propertySubmissions: prevData.propertySubmissions.map((prop) =>
            prop.id === propertyId ? { ...prop, status: "rejected" } : prop,
          ),
        }
      })

      toast({
        title: "Property Rejected",
        description: "The property has been rejected.",
      })

      return true
    } catch (err) {
      console.error("Error rejecting property:", err)
      toast({
        title: "Error",
        description: "Failed to reject property. Please try again.",
        variant: "destructive",
      })
      return false
    }
  }

  const resolveReport = async (reportId: string) => {
    try {
      const supabase = createClient()

      // In a real app, you would update the report status in Supabase
      // await supabase.from('reports').update({ status: 'resolved' }).eq('id', reportId);

      // For now, we'll just update the local state
      setData((prevData) => {
        if (!prevData) return prevData

        return {
          ...prevData,
          reports: prevData.reports.map((report) =>
            report.id === reportId ? { ...report, status: "resolved" } : report,
          ),
        }
      })

      toast({
        title: "Report Resolved",
        description: "The report has been marked as resolved.",
      })

      return true
    } catch (err) {
      console.error("Error resolving report:", err)
      toast({
        title: "Error",
        description: "Failed to resolve report. Please try again.",
        variant: "destructive",
      })
      return false
    }
  }

  return {
    data,
    loading,
    error,
    usingMockData,
    approveProperty,
    rejectProperty,
    resolveReport,
  }
}
