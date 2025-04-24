"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Textarea } from "@/components/ui/textarea"
import { Search, Flag, AlertTriangle, CheckCircle, MoreHorizontal } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"

interface Report {
  id: string
  type: string
  subject: string
  reporter: string
  reportedItem: string
  status: string
  priority: string
  dateSubmitted: string
}

interface ReportsManagementTableProps {
  reports?: Report[]
}

// Mock data for reports
const mockReports = [
  {
    id: "REP-1234",
    type: "Property",
    subject: "Misleading property description",
    reporter: "john.doe@example.com",
    reportedItem: "Luxury Apartment in Downtown",
    status: "Open",
    priority: "High",
    dateSubmitted: "2023-04-15",
  },
  {
    id: "REP-1235",
    type: "User",
    subject: "Harassment in messages",
    reporter: "jane.smith@example.com",
    reportedItem: "user123",
    status: "Under Review",
    priority: "Critical",
    dateSubmitted: "2023-04-14",
  },
  {
    id: "REP-1236",
    type: "Property",
    subject: "Fake listing",
    reporter: "mike.wilson@example.com",
    reportedItem: "Beach House with Ocean View",
    status: "Closed",
    priority: "Medium",
    dateSubmitted: "2023-04-12",
  },
  {
    id: "REP-1237",
    type: "Payment",
    subject: "Double charge issue",
    reporter: "sarah.johnson@example.com",
    reportedItem: "Booking #45678",
    status: "Open",
    priority: "High",
    dateSubmitted: "2023-04-11",
  },
  {
    id: "REP-1238",
    type: "User",
    subject: "Inappropriate profile picture",
    reporter: "alex.brown@example.com",
    reportedItem: "user456",
    status: "Under Review",
    priority: "Low",
    dateSubmitted: "2023-04-10",
  },
]

export function ReportsManagementTable({ reports = mockReports }: ReportsManagementTableProps) {
  const { toast } = useToast()
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [typeFilter, setTypeFilter] = useState("all")
  const [selectedReport, setSelectedReport] = useState<Report | null>(null)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [responseText, setResponseText] = useState("")
  const [reportStatuses, setReportStatuses] = useState<Record<string, string>>(
    Object.fromEntries(reports.map((report) => [report.id, report.status])),
  )

  // Filter reports based on search term and filters
  const filteredReports = reports.filter((report) => {
    const matchesSearch =
      report.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      report.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
      report.reporter.toLowerCase().includes(searchTerm.toLowerCase()) ||
      report.reportedItem.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesStatus = statusFilter === "all" || reportStatuses[report.id] === statusFilter
    const matchesType = typeFilter === "all" || report.type === typeFilter

    return matchesSearch && matchesStatus && matchesType
  })

  const handleViewDetails = (report: Report) => {
    setSelectedReport(report)
    setDialogOpen(true)
  }

  const handleStatusChange = (reportId: string, status: string) => {
    setReportStatuses({ ...reportStatuses, [reportId]: status })

    if (selectedReport) {
      toast({
        title: `Report Status Updated`,
        description: `Report ${selectedReport.id} has been marked as ${status}.`,
        variant: status === "Closed" ? "default" : "destructive",
      })
      setDialogOpen(false)
    }
  }

  const getPriorityBadge = (priority: string) => {
    switch (priority) {
      case "Critical":
        return <Badge variant="destructive">Critical</Badge>
      case "High":
        return (
          <Badge variant="destructive" className="bg-orange-500">
            High
          </Badge>
        )
      case "Medium":
        return (
          <Badge variant="outline" className="border-yellow-500 text-yellow-500">
            Medium
          </Badge>
        )
      case "Low":
        return (
          <Badge variant="outline" className="border-green-500 text-green-500">
            Low
          </Badge>
        )
      default:
        return <Badge variant="outline">{priority}</Badge>
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "Open":
        return (
          <Badge variant="outline" className="border-blue-500 text-blue-500">
            Open
          </Badge>
        )
      case "Under Review":
        return (
          <Badge variant="outline" className="border-purple-500 text-purple-500">
            Under Review
          </Badge>
        )
      case "Closed":
        return (
          <Badge variant="outline" className="border-green-500 text-green-500">
            Closed
          </Badge>
        )
      default:
        return <Badge variant="outline">{status}</Badge>
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-xl flex items-center gap-2">
          <Flag className="h-5 w-5" />
          Reports & Complaints
        </CardTitle>
        <CardDescription>Manage user reports and complaints</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col md:flex-row gap-4 mb-4">
          <div className="relative flex-1">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search reports..."
              className="pl-8"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-full md:w-[180px]">
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Statuses</SelectItem>
              <SelectItem value="Open">Open</SelectItem>
              <SelectItem value="Under Review">Under Review</SelectItem>
              <SelectItem value="Closed">Closed</SelectItem>
            </SelectContent>
          </Select>
          <Select value={typeFilter} onValueChange={setTypeFilter}>
            <SelectTrigger className="w-full md:w-[180px]">
              <SelectValue placeholder="Filter by type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Types</SelectItem>
              <SelectItem value="Property">Property</SelectItem>
              <SelectItem value="User">User</SelectItem>
              <SelectItem value="Payment">Payment</SelectItem>
              <SelectItem value="Technical">Technical</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="rounded-md border">
          <table className="w-full">
            <thead>
              <tr className="border-b">
                <th className="text-left p-2">ID</th>
                <th className="text-left p-2">Type</th>
                <th className="hidden md:table-cell text-left p-2">Subject</th>
                <th className="hidden md:table-cell text-left p-2">Reporter</th>
                <th className="text-left p-2">Priority</th>
                <th className="text-left p-2">Status</th>
                <th className="hidden md:table-cell text-left p-2">Date</th>
                <th className="text-left p-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredReports.length > 0 ? (
                filteredReports.map((report) => (
                  <tr key={report.id} className="border-b">
                    <td className="p-2 font-medium">{report.id}</td>
                    <td className="p-2">{report.type}</td>
                    <td className="hidden md:table-cell p-2 max-w-[200px] truncate" title={report.subject}>
                      {report.subject}
                    </td>
                    <td className="hidden md:table-cell p-2">{report.reporter}</td>
                    <td className="p-2">{getPriorityBadge(report.priority)}</td>
                    <td className="p-2">{getStatusBadge(reportStatuses[report.id])}</td>
                    <td className="hidden md:table-cell p-2">{report.dateSubmitted}</td>
                    <td className="p-2">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" className="h-8 w-8 p-0">
                            <span className="sr-only">Open menu</span>
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuLabel>Actions</DropdownMenuLabel>
                          <DropdownMenuItem onClick={() => handleViewDetails(report)}>View details</DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem onClick={() => handleStatusChange(report.id, "Closed")}>
                            Mark as resolved
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleStatusChange(report.id, "Under Review")}>
                            Mark as under review
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={8} className="h-24 text-center">
                    No reports found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {selectedReport && (
          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogContent className="sm:max-w-[600px]">
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2">
                  {selectedReport.priority === "Critical" || selectedReport.priority === "High" ? (
                    <AlertTriangle className="h-5 w-5 text-red-500" />
                  ) : (
                    <Flag className="h-5 w-5" />
                  )}
                  Report {selectedReport.id}
                </DialogTitle>
                <DialogDescription>{selectedReport.subject}</DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <span className="text-sm font-medium">Type:</span>
                  <span className="col-span-3">{selectedReport.type}</span>
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <span className="text-sm font-medium">Reporter:</span>
                  <span className="col-span-3">{selectedReport.reporter}</span>
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <span className="text-sm font-medium">Reported Item:</span>
                  <span className="col-span-3">{selectedReport.reportedItem}</span>
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <span className="text-sm font-medium">Status:</span>
                  <span className="col-span-3">{getStatusBadge(reportStatuses[selectedReport.id])}</span>
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <span className="text-sm font-medium">Priority:</span>
                  <span className="col-span-3">{getPriorityBadge(selectedReport.priority)}</span>
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <span className="text-sm font-medium">Date Submitted:</span>
                  <span className="col-span-3">{selectedReport.dateSubmitted}</span>
                </div>
                <div className="border-t pt-4">
                  <h4 className="text-sm font-medium mb-2">Response</h4>
                  <Textarea
                    placeholder="Enter your response..."
                    value={responseText}
                    onChange={(e) => setResponseText(e.target.value)}
                    className="min-h-[100px]"
                  />
                </div>
              </div>
              <DialogFooter>
                <div className="flex flex-col sm:flex-row gap-2 w-full sm:justify-between">
                  <div className="flex gap-2">
                    <Button variant="outline" onClick={() => handleStatusChange(selectedReport.id, "Under Review")}>
                      Mark as Under Review
                    </Button>
                    <Button
                      variant="default"
                      className="bg-green-600 hover:bg-green-700"
                      onClick={() => handleStatusChange(selectedReport.id, "Closed")}
                    >
                      <CheckCircle className="mr-2 h-4 w-4" />
                      Resolve
                    </Button>
                  </div>
                  <Button variant="destructive">Escalate</Button>
                </div>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        )}
      </CardContent>
    </Card>
  )
}
