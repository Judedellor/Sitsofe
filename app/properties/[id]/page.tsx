"use client"

import { useEffect, useState } from "react"
import { useParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ChatInterface } from "@/components/chat/ChatInterface"
import { Bed, Bath, Square, MapPin, Heart, Share } from "lucide-react"
import Image from "next/image"

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
  owner: {
    full_name: string
    avatar_url: string
  }
}

export default function PropertyDetailPage() {
  const params = useParams()
  const id = params.id as string
  const [property, setProperty] = useState<Property | null>(null)
  const [loading, setLoading] = useState(true)
  const [conversationId, setConversationId] = useState<string | null>(null)

  useEffect(() => {
    async function fetchProperty() {
      try {
        setLoading(true)

        // For development, use mock data
        setProperty({
          id,
          title: "Modern Luxury Apartment",
          description:
            "This beautiful apartment features modern amenities, spacious rooms, and a prime location in the heart of downtown. Enjoy stunning city views, a fully equipped kitchen, and access to building amenities including a gym and rooftop terrace.",
          price: 2500,
          location: "Downtown",
          type: "apartment",
          specs: {
            beds: 2,
            baths: 2,
            sqft: 1200,
          },
          images: [
            "https://api.dicebear.com/7.x/shapes/svg?seed=1",
            "https://api.dicebear.com/7.x/shapes/svg?seed=2",
            "https://api.dicebear.com/7.x/shapes/svg?seed=3",
          ],
          owner_id: "123",
          owner: {
            full_name: "John Doe",
            avatar_url: "https://api.dicebear.com/7.x/avatars/svg?seed=123",
          },
        })
        setConversationId("conv1")

        // When ready for production, uncomment:
        /*
        const { data, error } = await supabase
          .from('properties')
          .select(`
            *,
            owner:profiles(full_name, avatar_url)
          `)
          .eq('id', id)
          .single()
        
        if (error) throw error
        setProperty(data)
        
        // Check if conversation exists or create one
        const { data: convData } = await supabase
          .from('conversations')
          .select('id')
          .eq('property_id', id)
          .eq('renter_id', user.id)
          .single()
          
        if (convData) {
          setConversationId(convData.id)
        } else {
          // Create new conversation
          const { data: newConv } = await supabase
            .from('conversations')
            .insert({
              property_id: id,
              owner_id: data.owner_id,
              renter_id: user.id
            })
            .select()
            .single()
            
          setConversationId(newConv.id)
        }
        */
      } catch (error) {
        console.error("Error fetching property:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchProperty()
  }, [id])

  if (loading) {
    return <div className="container mx-auto py-8">Loading property details...</div>
  }

  if (!property) {
    return <div className="container mx-auto py-8">Property not found</div>
  }

  return (
    <div className="container mx-auto py-8">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <h1 className="text-3xl font-bold mb-2">{property.title}</h1>
          <div className="flex items-center text-muted-foreground mb-6">
            <MapPin className="h-4 w-4 mr-1" />
            <span>{property.location}</span>
          </div>

          <div className="relative h-[400px] w-full mb-4 rounded-lg overflow-hidden">
            <Image
              src={property.images[0] || "/placeholder.svg?height=800&width=1200"}
              alt={property.title}
              fill
              className="object-cover"
            />
          </div>

          <div className="grid grid-cols-3 gap-2 mb-6">
            {property.images.slice(1, 4).map((img, i) => (
              <div key={i} className="relative h-24 rounded-md overflow-hidden">
                <Image
                  src={img || "/placeholder.svg"}
                  alt={`${property.title} ${i + 1}`}
                  fill
                  className="object-cover"
                />
              </div>
            ))}
          </div>

          <div className="flex justify-between items-center mb-6">
            <div className="text-3xl font-bold">${property.price}/month</div>
            <div className="flex space-x-2">
              <Button variant="outline" size="icon">
                <Heart className="h-4 w-4" />
              </Button>
              <Button variant="outline" size="icon">
                <Share className="h-4 w-4" />
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4 p-4 bg-muted rounded-lg mb-8">
            <div className="flex flex-col items-center">
              <Bed className="h-5 w-5 mb-1" />
              <div className="font-medium">{property.specs.beds} Beds</div>
            </div>
            <div className="flex flex-col items-center">
              <Bath className="h-5 w-5 mb-1" />
              <div className="font-medium">{property.specs.baths} Baths</div>
            </div>
            <div className="flex flex-col items-center">
              <Square className="h-5 w-5 mb-1" />
              <div className="font-medium">{property.specs.sqft} sqft</div>
            </div>
          </div>

          <Tabs defaultValue="description">
            <TabsList className="mb-4">
              <TabsTrigger value="description">Description</TabsTrigger>
              <TabsTrigger value="amenities">Amenities</TabsTrigger>
              <TabsTrigger value="location">Location</TabsTrigger>
            </TabsList>
            <TabsContent value="description" className="p-4">
              <p>{property.description}</p>
            </TabsContent>
            <TabsContent value="amenities" className="p-4">
              <ul className="list-disc pl-5 space-y-2">
                <li>Central air conditioning</li>
                <li>In-unit washer and dryer</li>
                <li>Stainless steel appliances</li>
                <li>Hardwood floors</li>
                <li>Walk-in closets</li>
                <li>Fitness center access</li>
                <li>Rooftop terrace</li>
              </ul>
            </TabsContent>
            <TabsContent value="location" className="p-4">
              <div className="h-[300px] bg-muted flex items-center justify-center">Map placeholder</div>
            </TabsContent>
          </Tabs>
        </div>

        <div>
          <div className="sticky top-8">
            <div className="mb-6 p-4 border rounded-lg">
              <div className="flex items-center space-x-3 mb-4">
                <Image
                  src={property.owner.avatar_url || "/placeholder.svg"}
                  alt={property.owner.full_name}
                  width={48}
                  height={48}
                  className="rounded-full"
                />
                <div>
                  <h3 className="font-medium">{property.owner.full_name}</h3>
                  <p className="text-sm text-muted-foreground">Property Owner</p>
                </div>
              </div>
              <Button className="w-full mb-2">Schedule a Tour</Button>
              <Button variant="outline" className="w-full">
                Call Owner
              </Button>
            </div>

            {conversationId && (
              <div>
                <h3 className="font-semibold text-lg mb-4">Message the Owner</h3>
                <ChatInterface
                  conversationId={conversationId}
                  otherUserName={property.owner.full_name}
                  otherUserAvatar={property.owner.avatar_url}
                />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
