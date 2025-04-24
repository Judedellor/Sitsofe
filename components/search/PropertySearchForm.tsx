"use client"

import type React from "react"

import { useState } from "react"
import { usePropertySearch } from "../../hooks/usePropertySearch"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Slider } from "@/components/ui/slider"
import { Card, CardContent } from "@/components/ui/card"

export function PropertySearchForm() {
  const { searchQuery, setSearchQuery, updateFilters, clearFilters } = usePropertySearch()
  const [priceRange, setPriceRange] = useState([0, 10000])
  const [location, setLocation] = useState("")
  const [propertyType, setPropertyType] = useState("")
  const [bedrooms, setBedrooms] = useState<string>("")
  const [bathrooms, setBathrooms] = useState<string>("")

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    updateFilters({
      type: propertyType || undefined,
      priceRange: {
        min: priceRange[0],
        max: priceRange[1],
      },
      location: location || undefined,
      bedrooms: bedrooms ? Number.parseInt(bedrooms) : undefined,
      bathrooms: bathrooms ? Number.parseInt(bathrooms) : undefined,
    })
  }

  const handleClear = () => {
    setSearchQuery("")
    setPriceRange([0, 10000])
    setLocation("")
    setPropertyType("")
    setBedrooms("")
    setBathrooms("")
    clearFilters()
  }

  return (
    <Card>
      <CardContent className="p-6">
        <form onSubmit={handleSearch} className="space-y-6">
          <div>
            <Label htmlFor="search">Search</Label>
            <Input
              id="search"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by location, title, or description"
              className="mt-1"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="location">Location</Label>
              <Input
                id="location"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="City, neighborhood, etc."
                className="mt-1"
              />
            </div>

            <div>
              <Label htmlFor="property-type">Property Type</Label>
              <Select value={propertyType} onValueChange={setPropertyType}>
                <SelectTrigger id="property-type" className="mt-1">
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="apartment">Apartment</SelectItem>
                  <SelectItem value="house">House</SelectItem>
                  <SelectItem value="condo">Condo</SelectItem>
                  <SelectItem value="townhouse">Townhouse</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div>
            <div className="flex justify-between mb-2">
              <Label>Price Range</Label>
              <span className="text-sm">
                ${priceRange[0]} - ${priceRange[1]}
              </span>
            </div>
            <Slider
              defaultValue={[0, 10000]}
              max={10000}
              step={100}
              value={priceRange}
              onValueChange={setPriceRange}
              className="mt-1"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="bedrooms">Bedrooms</Label>
              <Select value={bedrooms} onValueChange={setBedrooms}>
                <SelectTrigger id="bedrooms" className="mt-1">
                  <SelectValue placeholder="Any" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1">1+</SelectItem>
                  <SelectItem value="2">2+</SelectItem>
                  <SelectItem value="3">3+</SelectItem>
                  <SelectItem value="4">4+</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="bathrooms">Bathrooms</Label>
              <Select value={bathrooms} onValueChange={setBathrooms}>
                <SelectTrigger id="bathrooms" className="mt-1">
                  <SelectValue placeholder="Any" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1">1+</SelectItem>
                  <SelectItem value="2">2+</SelectItem>
                  <SelectItem value="3">3+</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="flex space-x-2">
            <Button type="submit" className="flex-1">
              Search
            </Button>
            <Button type="button" variant="outline" onClick={handleClear}>
              Clear
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
