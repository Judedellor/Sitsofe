"use client"

import { useEffect, useState } from "react"
import { useAuth } from "@/hooks/useAuth"
import { useProperties } from "@/hooks/useProperties"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Loader2, Heart, ExternalLink, MessageSquare } from "lucide-react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import type { Property } from "@/types"

export default function SavedPropertiesPage() {
  const { user, userRole, isLoading: authLoading } = useAuth()
  const { getSavedProperties, unsaveProperty, isLoading: propertiesLoading } = useProperties()
  const [savedProperties, setSavedProperties] = useState<Property[]>([])
  const [isClient, setIsClient] = useState(false)
  const router = useRouter()

  useEffect(() => {
    setIsClient(true)

    if (!authLoading && !user) {
      router.push("/login")
      return
    }

    if (user) {
      const fetchSavedProperties = async () => {
        const properties = await getSavedProperties(user.id)
        setSavedProperties(properties)
      }

      fetchSavedProperties()
    }
  }, [user, authLoading, router, getSavedProperties])

  const handleUnsaveProperty = async (propertyId: string) => {
    if (user) {
      await unsaveProperty(user.id, propertyId)
      setSavedProperties(savedProperties.filter((p) => p.id !== propertyId))
    }
  }

  if (authLoading || propertiesLoading || !isClient) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  if (!user) {
    return null // Will redirect in useEffect
  }

  return (
    <div className="container mx-auto py-8">
      <h1 className="mb-6 text-3xl font-bold">Saved Properties</h1>

      {savedProperties.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-lg border border-dashed p-12 text-center">
          <h3 className="mb-2 text-xl font-semibold">No saved properties</h3>
          <p className="mb-6 text-muted-foreground">Browse properties and save your favorites</p>
          <Button asChild>
            <Link href="/properties">Browse Properties</Link>
          </Button>
        </div>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {savedProperties.map((property) => (
            <Card key={property.id} className="overflow-hidden">
              <div className="relative h-48 w-full">
                <img
                  src={property.images?.[0] || "/placeholder.svg?height=192&width=384"}
                  alt={property.title}
                  className="h-full w-full object-cover"
                />
                <Badge
                  className={`absolute right-2 top-2 ${
                    property.availability === "available" ? "bg-green-500" : "bg-red-500"
                  }`}
                >
                  {property.availability === "available" ? "Available" : "Unavailable"}
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
                <div className="mt-2 flex flex-wrap gap-2">
                  <Badge variant="outline">{property.bedrooms} Beds</Badge>
                  <Badge variant="outline">{property.bathrooms} Baths</Badge>
                  <Badge variant="outline">{property.squareFeet} sq ft</Badge>
                </div>
              </CardContent>
              <CardFooter className="flex justify-between gap-2">
                <Button variant="outline" size="sm" asChild>
                  <Link href={`/properties/${property.id}`}>
                    <ExternalLink className="mr-1 h-4 w-4" /> View
                  </Link>
                </Button>
                <Button variant="outline" size="sm" asChild>
                  <Link href={`/messages?property=${property.id}`}>
                    <MessageSquare className="mr-1 h-4 w-4" /> Contact
                  </Link>
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleUnsaveProperty(property.id)}
                  className="text-red-500 hover:bg-red-50 hover:text-red-600"
                >
                  <Heart className="mr-1 h-4 w-4 fill-current" /> Unsave
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
