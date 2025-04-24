import { PropertyCard } from "./PropertyCard"

interface Property {
  id: string
  title: string
  description: string
  price: number
  location: string
  type: string
  specs: {
    beds: number
    baths: number
    sqft: number
  }
  images: string[]
  owner_id: string
  status: "active" | "pending" | "inactive"
}

interface PropertyListProps {
  properties: Property[]
  viewMode?: "grid" | "list"
}

export function PropertyList({ properties, viewMode = "grid" }: PropertyListProps) {
  if (!properties || properties.length === 0) {
    return <div className="text-center py-8">No properties found</div>
  }

  return (
    <div className={`grid gap-6 ${viewMode === "grid" ? "grid-cols-1 md:grid-cols-2 lg:grid-cols-3" : "grid-cols-1"}`}>
      {properties.map((property) => (
        <PropertyCard
          key={property.id}
          id={property.id}
          title={property.title}
          price={property.price}
          location={property.location}
          beds={property.specs.beds}
          baths={property.specs.baths}
          sqft={property.specs.sqft}
          imageUrl={property.images?.[0] || ""}
        />
      ))}
    </div>
  )
}
