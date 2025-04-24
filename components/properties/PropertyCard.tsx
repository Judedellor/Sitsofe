import Image from "next/image"
import Link from "next/link"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Bed, Bath, Square, MapPin } from "lucide-react"

interface PropertyCardProps {
  id: string
  title: string
  price: number
  location: string
  beds: number
  baths: number
  sqft: number
  imageUrl: string
}

export function PropertyCard({ id, title, price, location, beds, baths, sqft, imageUrl }: PropertyCardProps) {
  return (
    <Link href={`/properties/${id}`}>
      <Card className="overflow-hidden h-full transition-all hover:shadow-md">
        <div className="relative h-48 w-full">
          <Image
            src={imageUrl || "/placeholder.svg?height=400&width=600"}
            alt={title || "Property"}
            fill
            className="object-cover"
          />
        </div>
        <CardContent className="p-4">
          <div className="flex justify-between items-start mb-2">
            <h3 className="font-semibold text-lg line-clamp-1">{title || "Untitled Property"}</h3>
            <Badge variant="outline" className="bg-primary/10 text-primary">
              ${(price || 0).toLocaleString()}/mo
            </Badge>
          </div>
          <div className="flex items-center text-muted-foreground mb-3">
            <MapPin className="h-4 w-4 mr-1" />
            <span className="text-sm">{location || "Unknown location"}</span>
          </div>
          <div className="grid grid-cols-3 gap-2 text-sm">
            <div className="flex items-center">
              <Bed className="h-4 w-4 mr-1" />
              <span>
                {beds || 0} {(beds || 0) === 1 ? "Bed" : "Beds"}
              </span>
            </div>
            <div className="flex items-center">
              <Bath className="h-4 w-4 mr-1" />
              <span>
                {baths || 0} {(baths || 0) === 1 ? "Bath" : "Baths"}
              </span>
            </div>
            <div className="flex items-center">
              <Square className="h-4 w-4 mr-1" />
              <span>{(sqft || 0).toLocaleString()} sqft</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  )
}
