import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { CheckCircle, AlertTriangle, XCircle } from "lucide-react"

interface SystemMetric {
  name: string
  value: number
  unit?: string
  status: "healthy" | "warning" | "error"
}

interface SystemMetricsCardProps {
  metrics: SystemMetric[]
}

export function SystemMetricsCard({ metrics }: SystemMetricsCardProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>System Health</CardTitle>
        <CardDescription>Current status of system components</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {metrics.map((metric, index) => (
            <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
              <div className="flex items-center">
                {metric.status === "healthy" ? (
                  <CheckCircle className="h-5 w-5 text-success mr-3" />
                ) : metric.status === "warning" ? (
                  <AlertTriangle className="h-5 w-5 text-warning mr-3" />
                ) : (
                  <XCircle className="h-5 w-5 text-destructive mr-3" />
                )}
                <span className="font-medium">{metric.name}</span>
              </div>
              <div className="flex items-center">
                <span className="font-bold">
                  {metric.value}
                  {metric.unit || ""}
                </span>
                <Badge
                  className={`ml-3 ${
                    metric.status === "healthy"
                      ? "bg-success/20 text-success border-success"
                      : metric.status === "warning"
                        ? "bg-warning/20 text-warning border-warning"
                        : "bg-destructive/20 text-destructive border-destructive"
                  }`}
                >
                  {metric.status}
                </Badge>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
