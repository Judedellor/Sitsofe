"use client"

import { useEffect, useState } from "react"
import { useAuth } from "@/hooks/useAuth"
import { useProperties } from "@/hooks/useProperties"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Loader2, Plus, Edit, Trash2, Eye, BarChart2 } from "lucide-react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import type { Property } from "@/types"

export default function MyPropertiesPage() {
  const { user, userRole, isLoading: authLoading } = useAuth()
  const { getPropertiesByOwner, deleteProperty, isLoading: propertiesLoading } = useProperties()
  const [properties, setProperties] = useState<Property[]>([])
  const [activeProperties, setActiveProperties] = useState<Property[]>([])
  const [draftProperties, setDraftProperties] = useState<Property[]>([])
  const [isClient, setIsClient] = useState(false)
  const router = useRouter()

  useEffect(() => {
    setIsClient(true)

    if (!authLoading && (!user || userRole !== "owner")) {
      router.push("/login")
      return
    }

    if (user) {
      const fetchProperties = async () => {
        const ownerProperties = await getPropertiesByOwner(user.id)
        setProperties(ownerProperties)

        // Filter properties by status
        setActiveProperties(ownerProperties.filter((p) => p.status === "active"))
        setDraftProperties(ownerProperties.filter((p) => p.status === "draft"))
      }

      fetchProperties()
    }
  }, [user, userRole, authLoading, router, getPropertiesByOwner])

  const handleDeleteProperty = async (propertyId: string) => {
    if (window.confirm("Are you sure you want to delete this property?")) {
      await deleteProperty(propertyId)
      // Update the local state after deletion
      setProperties(properties.filter((p) => p.id !== propertyId))
      setActiveProperties(activeProperties.filter((p) => p.id !== propertyId))
      setDraftProperties(draftProperties.filter((p) => p.id !== propertyId))
    }
  }

  if (authLoading || propertiesLoading || !isClient) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  if (!user || userRole !== "owner") {
    return null // Will redirect in useEffect
  }

  const PropertyCard = ({ property }: { property: Property }) => (
    <Card key={property.id} className="overflow-hidden">
      <div className="relative h-48 w-full">
        <img
          src={property.images?.[0] || "/placeholder.svg?height=192&width=384"}
          alt={property.title}
          className="h-full w-full object-cover"
        />
        <Badge className={`absolute right-2 top-2 ${property.status === "active" ? "bg-green-500" : "bg-amber-500"}`}>
          {property.status === "active" ? "Active" : "Draft"}
        </Badge>
      </div>
      <CardHeader>
        <CardTitle className="line-clamp-1">{property.title}</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground">{property.address}</p>
        <p className="mt-2 font-semibold">
          ${property.price.toLocaleString()}
          {property.rentOrSale === "rent" ? "/month" : ""}
        </p>
      </CardContent>
      <CardFooter className="flex justify-between gap-2">
        <Button variant="outline" size="sm" asChild>
          <Link href={`/properties/${property.id}`}>
            <Eye className="mr-1 h-4 w-4" /> View
          </Link>
        </Button>
        <Button variant="outline" size="sm" asChild>
          <Link href={`/analytics?property=${property.id}`}>
            <BarChart2 className="mr-1 h-4 w-4" /> Analytics
          </Link>
        </Button>
        <Button variant="outline" size="sm" asChild>
          <Link href={`/properties/edit/${property.id}`}>
            <Edit className="mr-1 h-4 w-4" /> Edit
          </Link>
        </Button>
        <Button variant="destructive" size="sm" onClick={() => handleDeleteProperty(property.id)}>
          <Trash2 className="mr-1 h-4 w-4" /> Delete
        </Button>
      </CardFooter>
    </Card>
  )

  return (
    <div className="container mx-auto py-8">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-3xl font-bold">My Properties</h1>
        <Button asChild>
          <Link href="/properties/new">
            <Plus className="mr-2 h-4 w-4" /> Add Property
          </Link>
        </Button>
      </div>

      <Tabs defaultValue="all" className="w-full">
        <TabsList className="mb-4">
          <TabsTrigger value="all">All ({properties.length})</TabsTrigger>
          <TabsTrigger value="active">Active ({activeProperties.length})</TabsTrigger>
          <TabsTrigger value="drafts">Drafts ({draftProperties.length})</TabsTrigger>
        </TabsList>

        <TabsContent value="all">
          {properties.length === 0 ? (
            <div className="flex flex-col items-center justify-center rounded-lg border border-dashed p-12 text-center">
              <h3 className="mb-2 text-xl font-semibold">No properties yet</h3>
              <p className="mb-6 text-muted-foreground">Get started by adding your first property listing</p>
              <Button asChild>
                <Link href="/properties/new">
                  <Plus className="mr-2 h-4 w-4" /> Add Property
                </Link>
              </Button>
            </div>
          ) : (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {properties.map((property) => (
                <PropertyCard key={property.id} property={property} />
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="active">
          {activeProperties.length === 0 ? (
            <div className="flex flex-col items-center justify-center rounded-lg border border-dashed p-12 text-center">
              <h3 className="mb-2 text-xl font-semibold">No active properties</h3>
              <p className="mb-6 text-muted-foreground">Publish your draft properties to make them active</p>
              <Button asChild>
                <Link href="/properties/new">
                  <Plus className="mr-2 h-4 w-4" /> Add Property
                </Link>
              </Button>
            </div>
          ) : (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {activeProperties.map((property) => (
                <PropertyCard key={property.id} property={property} />
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="drafts">
          {draftProperties.length === 0 ? (
            <div className="flex flex-col items-center justify-center rounded-lg border border-dashed p-12 text-center">
              <h3 className="mb-2 text-xl font-semibold">No draft properties</h3>
              <p className="mb-6 text-muted-foreground">All your properties are currently active</p>
              <Button asChild>
                <Link href="/properties/new">
                  <Plus className="mr-2 h-4 w-4" /> Add Property
                </Link>
              </Button>
            </div>
          ) : (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {draftProperties.map((property) => (
                <PropertyCard key={property.id} property={property} />
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
}
