"use client"

import { useEffect, useState } from "react"
import { useAuth } from "@/hooks/useAuth"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
} from "recharts"
import { Loader2 } from "lucide-react"
import { useRouter } from "next/navigation"

// Sample data - in a real app, this would come from your API
const viewsData = [
  { month: "Jan", views: 65 },
  { month: "Feb", views: 59 },
  { month: "Mar", views: 80 },
  { month: "Apr", views: 81 },
  { month: "May", views: 56 },
  { month: "Jun", views: 55 },
  { month: "Jul", views: 40 },
]

const inquiriesData = [
  { month: "Jan", inquiries: 15 },
  { month: "Feb", inquiries: 12 },
  { month: "Mar", inquiries: 19 },
  { month: "Apr", inquiries: 22 },
  { month: "May", inquiries: 14 },
  { month: "Jun", inquiries: 10 },
  { month: "Jul", inquiries: 8 },
]

const propertyPerformanceData = [
  { name: "Coastal Villa", views: 400, inquiries: 24, applications: 12 },
  { name: "Downtown Loft", views: 300, inquiries: 18, applications: 9 },
  { name: "Suburban House", views: 200, inquiries: 12, applications: 6 },
  { name: "Mountain Cabin", views: 278, inquiries: 15, applications: 7 },
]

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042"]

const applicantSourceData = [
  { name: "Direct Search", value: 400 },
  { name: "Referrals", value: 300 },
  { name: "Social Media", value: 300 },
  { name: "Email Campaign", value: 200 },
]

export default function AnalyticsPage() {
  const { user, userRole, isLoading } = useAuth()
  const router = useRouter()
  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    setIsClient(true)

    if (!isLoading && (!user || userRole !== "owner")) {
      router.push("/login")
    }
  }, [user, userRole, isLoading, router])

  if (isLoading || !isClient) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  if (!user || userRole !== "owner") {
    return null // Will redirect in useEffect
  }

  return (
    <div className="container mx-auto py-8">
      <h1 className="mb-6 text-3xl font-bold">Property Analytics</h1>

      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="mb-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="properties">Properties</TabsTrigger>
          <TabsTrigger value="applicants">Applicants</TabsTrigger>
        </TabsList>

        <TabsContent value="overview">
          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Property Views</CardTitle>
                <CardDescription>Monthly views across all properties</CardDescription>
              </CardHeader>
              <CardContent className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={viewsData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line type="monotone" dataKey="views" stroke="#8884d8" activeDot={{ r: 8 }} />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Inquiries</CardTitle>
                <CardDescription>Monthly inquiries across all properties</CardDescription>
              </CardHeader>
              <CardContent className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={inquiriesData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="inquiries" fill="#82ca9d" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="properties">
          <Card>
            <CardHeader>
              <CardTitle>Property Performance</CardTitle>
              <CardDescription>Comparison of views, inquiries, and applications</CardDescription>
            </CardHeader>
            <CardContent className="h-96">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={propertyPerformanceData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="views" fill="#8884d8" />
                  <Bar dataKey="inquiries" fill="#82ca9d" />
                  <Bar dataKey="applications" fill="#ffc658" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="applicants">
          <Card>
            <CardHeader>
              <CardTitle>Applicant Sources</CardTitle>
              <CardDescription>Where your applicants are coming from</CardDescription>
            </CardHeader>
            <CardContent className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={applicantSourceData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  >
                    {applicantSourceData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
