"use client"

import { useState } from "react"
import { useProperties } from "@/hooks/useProperties"
import { PropertyList } from "@/components/properties/PropertyList"
import { PropertySearchForm } from "@/components/search/PropertySearchForm"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Filter, Grid, List, AlertTriangle } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

export default function PropertiesPage() {
  const { properties, loading, usingMockData } = useProperties()
  const [showFilters, setShowFilters] = useState(true)
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
        <div>
          <Badge className="mb-2">Browse Properties</Badge>
          <h1 className="text-3xl font-bold">Find Your Perfect Home</h1>
          <p className="text-muted-foreground mt-2">
            {loading ? "Loading properties..." : `${properties.length} properties available`}
          </p>
        </div>
        <div className="flex items-center space-x-2 mt-4 md:mt-0">
          <Button variant="outline" size="sm" onClick={() => setShowFilters(!showFilters)}>
            <Filter className="h-4 w-4 mr-2" />
            {showFilters ? "Hide Filters" : "Show Filters"}
          </Button>
          <div className="border rounded-md flex">
            <Button
              variant={viewMode === "grid" ? "default" : "ghost"}
              size="sm"
              onClick={() => setViewMode("grid")}
              className="rounded-r-none"
            >
              <Grid className="h-4 w-4" />
            </Button>
            <Button
              variant={viewMode === "list" ? "default" : "ghost"}
              size="sm"
              onClick={() => setViewMode("list")}
              className="rounded-l-none"
            >
              <List className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      {usingMockData && (
        <Alert className="mb-6 bg-yellow-50 border-yellow-200">
          <AlertTriangle className="h-4 w-4 text-yellow-600" />
          <AlertTitle className="text-yellow-800">Using Demo Data</AlertTitle>
          <AlertDescription className="text-yellow-700">
            We're currently displaying demo data because the database connection is not available.
          </AlertDescription>
        </Alert>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {showFilters && (
          <div className="lg:col-span-1">
            <Card className="sticky top-24">
              <CardContent className="p-6">
                <h2 className="text-lg font-semibold mb-4">Filter Properties</h2>
                <PropertySearchForm />
              </CardContent>
            </Card>
          </div>
        )}

        <div className={showFilters ? "lg:col-span-3" : "lg:col-span-4"}>
          {loading ? (
            <div className="text-center py-12">Loading properties...</div>
          ) : properties.length === 0 ? (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-12">
                <p className="text-muted-foreground mb-4">No properties found matching your criteria</p>
                <Button onClick={() => window.location.reload()}>Reset Filters</Button>
              </CardContent>
            </Card>
          ) : (
            <PropertyList properties={properties} viewMode={viewMode} />
          )}
        </div>
      </div>
    </div>
  )
}
