"use client"

import { useState, useEffect } from "react"

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
}

interface SearchFilters {
  type?: string
  priceRange?: {
    min?: number
    max?: number
  }
  location?: string
  bedrooms?: number
  bathrooms?: number
}

// Mock data
const MOCK_PROPERTIES: Property[] = [
  {
    id: "1",
    title: "Modern Luxury Apartment",
    description: "Beautiful apartment in the heart of downtown",
    price: 2500,
    location: "Downtown",
    type: "apartment",
    specs: {
      beds: 2,
      baths: 2,
      sqft: 1200,
    },
  },
  // Add more mock properties
]

export function usePropertySearch() {
  const [results, setResults] = useState<Property[]>([])
  const [loading, setLoading] = useState(false)
  const [filters, setFilters] = useState<SearchFilters>({})
  const [searchQuery, setSearchQuery] = useState("")

  useEffect(() => {
    if (searchQuery || Object.keys(filters).length > 0) {
      searchProperties()
    }
  }, [searchQuery, filters])

  async function searchProperties() {
    try {
      setLoading(true)

      // For development, filter mock data
      let filtered = [...MOCK_PROPERTIES]

      if (searchQuery) {
        const query = searchQuery.toLowerCase()
        filtered = filtered.filter(
          (p) =>
            p.title.toLowerCase().includes(query) ||
            p.description.toLowerCase().includes(query) ||
            p.location.toLowerCase().includes(query),
        )
      }

      if (filters.type) {
        filtered = filtered.filter((p) => p.type === filters.type)
      }

      if (filters.priceRange?.min) {
        filtered = filtered.filter((p) => p.price >= filters.priceRange!.min!)
      }

      if (filters.priceRange?.max) {
        filtered = filtered.filter((p) => p.price <= filters.priceRange!.max!)
      }

      if (filters.bedrooms) {
        filtered = filtered.filter((p) => p.specs.beds === filters.bedrooms)
      }

      if (filters.bathrooms) {
        filtered = filtered.filter((p) => p.specs.baths === filters.bathrooms)
      }

      setResults(filtered)

      // When ready for production, uncomment:
      /*
      let query = supabase
        .from('properties')
        .select('*')
        .eq('status', 'active')

      if (searchQuery) {
        query = query.or(`title.ilike.%${searchQuery}%,description.ilike.%${searchQuery}%`)
      }

      // Apply filters
      if (filters.type) {
        query = query.eq('type', filters.type)
      }

      const { data, error } = await query
      if (error) throw error
      setResults(data)
      */
    } catch (error) {
      console.error("Error searching properties:", error)
      setResults([])
    } finally {
      setLoading(false)
    }
  }

  function updateFilters(newFilters: Partial<SearchFilters>) {
    setFilters((prev) => ({
      ...prev,
      ...newFilters,
    }))
  }

  function clearFilters() {
    setFilters({})
  }

  return {
    results,
    loading,
    filters,
    searchQuery,
    setSearchQuery,
    updateFilters,
    clearFilters,
  }
}
