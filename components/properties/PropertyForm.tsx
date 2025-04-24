"use client"

import type React from "react"

import { useState } from "react"
import { useProperties } from "../../hooks/useProperties"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { useRouter } from "next/navigation"
import { Upload, X } from "lucide-react"

interface PropertyFormProps {
  editMode?: boolean
  propertyData?: any
}

export function PropertyForm({ editMode = false, propertyData }: PropertyFormProps) {
  const { addProperty } = useProperties()
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [images, setImages] = useState<string[]>(propertyData?.images || [])
  const [formData, setFormData] = useState({
    title: propertyData?.title || "",
    description: propertyData?.description || "",
    price: propertyData?.price || "",
    location: propertyData?.location || "",
    type: propertyData?.type || "",
    beds: propertyData?.specs?.beds || "",
    baths: propertyData?.specs?.baths || "",
    sqft: propertyData?.specs?.sqft || "",
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }

  const handleSelectChange = (name: string, value: string) => {
    setFormData({
      ...formData,
      [name]: value,
    })
  }

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return

    // In a real implementation, you would upload to Supabase storage
    // For now, we'll use placeholder images
    const newImages = [...images]
    for (let i = 0; i < e.target.files.length; i++) {
      const file = e.target.files[i]
      const randomId = Math.random().toString(36).substring(2, 15)
      newImages.push(`https://api.dicebear.com/7.x/shapes/svg?seed=${randomId}`)
    }
    setImages(newImages)
  }

  const removeImage = (index: number) => {
    const newImages = [...images]
    newImages.splice(index, 1)
    setImages(newImages)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const propertyData = {
        title: formData.title,
        description: formData.description,
        price: Number.parseFloat(formData.price),
        location: formData.location,
        type: formData.type,
        specs: {
          beds: Number.parseInt(formData.beds),
          baths: Number.parseInt(formData.baths),
          sqft: Number.parseInt(formData.sqft),
        },
        images,
        owner_id: "user1", // This would be the actual user ID in production
        status: "active",
      }

      await addProperty(propertyData)
      router.push("/properties")
    } catch (error) {
      console.error("Error adding property:", error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle>{editMode ? "Edit Property" : "Add New Property"}</CardTitle>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="title">Property Title</Label>
            <Input
              id="title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="e.g. Modern Downtown Apartment"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Describe your property..."
              rows={5}
              required
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="price">Monthly Rent ($)</Label>
              <Input
                id="price"
                name="price"
                type="number"
                value={formData.price}
                onChange={handleChange}
                placeholder="e.g. 1500"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="location">Location</Label>
              <Input
                id="location"
                name="location"
                value={formData.location}
                onChange={handleChange}
                placeholder="e.g. Downtown"
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="type">Property Type</Label>
            <Select value={formData.type} onValueChange={(value) => handleSelectChange("type", value)}>
              <SelectTrigger id="type">
                <SelectValue placeholder="Select property type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="apartment">Apartment</SelectItem>
                <SelectItem value="house">House</SelectItem>
                <SelectItem value="condo">Condo</SelectItem>
                <SelectItem value="townhouse">Townhouse</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="beds">Bedrooms</Label>
              <Input
                id="beds"
                name="beds"
                type="number"
                value={formData.beds}
                onChange={handleChange}
                min="0"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="baths">Bathrooms</Label>
              <Input
                id="baths"
                name="baths"
                type="number"
                value={formData.baths}
                onChange={handleChange}
                min="0"
                step="0.5"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="sqft">Square Feet</Label>
              <Input
                id="sqft"
                name="sqft"
                type="number"
                value={formData.sqft}
                onChange={handleChange}
                min="0"
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label>Property Images</Label>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-2">
              {images.map((image, index) => (
                <div key={index} className="relative h-24 bg-muted rounded-md overflow-hidden">
                  <img
                    src={image || "/placeholder.svg"}
                    alt={`Property ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                  <button
                    type="button"
                    onClick={() => removeImage(index)}
                    className="absolute top-1 right-1 bg-background rounded-full p-1"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              ))}
              <label className="flex flex-col items-center justify-center h-24 border-2 border-dashed border-muted-foreground/25 rounded-md cursor-pointer hover:bg-muted/50 transition-colors">
                <Upload className="h-6 w-6 mb-2 text-muted-foreground" />
                <span className="text-xs text-muted-foreground">Upload Image</span>
                <input type="file" accept="image/*" multiple onChange={handleImageUpload} className="hidden" />
              </label>
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button type="button" variant="outline" onClick={() => router.back()}>
            Cancel
          </Button>
          <Button type="submit" disabled={isLoading}>
            {isLoading ? "Saving..." : editMode ? "Update Property" : "Add Property"}
          </Button>
        </CardFooter>
      </form>
    </Card>
  )
}
