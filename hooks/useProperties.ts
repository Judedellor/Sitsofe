"use client"

import { useState, useEffect } from "react"
import { supabase, isSupabaseConfigured } from "../lib/supabase/client"

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

// Mock data to use when Supabase is not available
const MOCK_PROPERTIES: Property[] = [
  {
    id: "1",
    title: "Modern Downtown Apartment",
    description: "A beautiful modern apartment in the heart of downtown.",
    price: 2500,
    location: "Downtown, City",
    type: "apartment",
    specs: {
      beds: 2,
      baths: 2,
      sqft: 1200,
    },
    images: ["/placeholder.svg?height=300&width=400"],
    owner_id: "owner-1",
    status: "active",
  },
  {
    id: "2",
    title: "Suburban Family Home",
    description: "Spacious family home in a quiet suburban neighborhood.",
    price: 3500,
    location: "Suburbia, City",
    type: "house",
    specs: {
      beds: 4,
      baths: 3,
      sqft: 2400,
    },
    images: ["/placeholder.svg?height=300&width=400"],
    owner_id: "owner-2",
    status: "active",
  },
  {
    id: "3",
    title: "Luxury Penthouse Suite",
    description: "Exclusive penthouse with panoramic city views.",
    price: 5000,
    location: "Skyline Tower, City",
    type: "penthouse",
    specs: {
      beds: 3,
      baths: 3.5,
      sqft: 3000,
    },
    images: ["/placeholder.svg?height=300&width=400"],
    owner_id: "owner-1",
    status: "active",
  },
]

export function useProperties() {
  const [properties, setProperties] = useState<Property[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)
  const [usingMockData, setUsingMockData] = useState(false)

  useEffect(() => {
    fetchProperties()
  }, [])

  async function fetchProperties(filters?: Partial<Property>) {
    try {
      setLoading(true)
      setError(null)

      // Check if Supabase is configured
      if (!isSupabaseConfigured()) {
        console.warn("Supabase is not configured. Using mock data instead.")
        setProperties(MOCK_PROPERTIES)
        setUsingMockData(true)
        setLoading(false)
        return
      }

      // Use a timeout to prevent hanging requests
      const timeoutPromise = new Promise<{ data: null; error: Error }>((_, reject) =>
        setTimeout(() => reject(new Error("Request timed out")), 5000),
      )

      // Use Supabase to fetch properties with timeout
      try {
        let query = supabase
          .from("properties")
          .select(`
            id,
            title,
            description,
            price,
            location,
            type,
            beds,
            baths,
            sqft,
            owner_id,
            status,
            property_images(url, is_primary)
          `)
          .eq("status", "active")

        if (filters) {
          Object.entries(filters).forEach(([key, value]) => {
            if (value !== undefined) {
              query = query.eq(key, value)
            }
          })
        }

        // Race between the actual request and the timeout
        const { data, error } = await Promise.race([query, timeoutPromise])

        if (error) throw error

        // Transform the data to match our Property interface
        const transformedProperties = (data || []).map((item: any) => ({
          id: item.id,
          title: item.title || "Untitled Property",
          description: item.description || "",
          price: item.price || 0,
          location: item.location || "Unknown location",
          type: item.type || "unknown",
          specs: {
            beds: item.beds || 0,
            baths: item.baths || 0,
            sqft: item.sqft || 0,
          },
          images: Array.isArray(item.property_images)
            ? item.property_images.map((img: any) => img.url)
            : ["/placeholder.svg?height=300&width=400"],
          owner_id: item.owner_id,
          status: item.status || "pending",
        }))

        setProperties(transformedProperties)
        setUsingMockData(false)
      } catch (fetchError) {
        // Network error or timeout - fall back to mock data
        console.warn("Error fetching from Supabase, using mock data instead:", fetchError)
        setProperties(MOCK_PROPERTIES)
        setUsingMockData(true)

        // Don't throw here, we're handling it gracefully with mock data
      }
    } catch (err) {
      console.error("Error in fetchProperties:", err)
      setError(err instanceof Error ? err : new Error("An error occurred"))

      // Use mock data as fallback when there's an error
      console.warn("Error fetching properties. Using mock data instead.")
      setProperties(MOCK_PROPERTIES)
      setUsingMockData(true)
    } finally {
      setLoading(false)
    }
  }

  async function addProperty(property: Omit<Property, "id">) {
    try {
      // If using mock data, simulate adding a property
      if (usingMockData || !isSupabaseConfigured()) {
        const newProperty = {
          ...property,
          id: `mock-${Date.now()}`,
        }
        setProperties((prev) => [...prev, newProperty as Property])
        return newProperty
      }

      // Extract specs for database insertion
      const { specs, images, ...propertyData } = property

      // Insert the property
      try {
        const { data, error } = await supabase
          .from("properties")
          .insert({
            ...propertyData,
            beds: specs.beds,
            baths: specs.baths,
            sqft: specs.sqft,
          })
          .select()
          .single()

        if (error) throw error

        // Upload images if provided
        if (images && images.length > 0) {
          for (let i = 0; i < images.length; i++) {
            const imageUrl = images[i]

            // For real image uploads, you would upload to Supabase storage
            // For now, we'll just insert the URL
            const { error: imgError } = await supabase.from("property_images").insert({
              property_id: data.id,
              url: imageUrl,
              is_primary: i === 0, // First image is primary
            })

            if (imgError) throw imgError
          }
        }

        return data
      } catch (supabaseError) {
        console.error("Supabase error adding property:", supabaseError)

        // Fall back to mock data
        const newProperty = {
          ...property,
          id: `mock-${Date.now()}`,
        }
        setProperties((prev) => [...prev, newProperty as Property])
        setUsingMockData(true)
        return newProperty
      }
    } catch (error) {
      console.error("Error adding property:", error)
      throw error
    }
  }

  return {
    properties,
    loading,
    error,
    fetchProperties,
    addProperty,
    usingMockData,
  }
}
