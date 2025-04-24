"use client"

import { useState, useRef, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Loader2, Maximize2, Minimize2, RotateCw, ZoomIn, ZoomOut, Pause, Play } from "lucide-react"

interface VirtualTourScreenProps {
  propertyId: string
  tourImages: string[]
  title: string
}

export function VirtualTourScreen({ propertyId, tourImages, title }: VirtualTourScreenProps) {
  const [loading, setLoading] = useState(true)
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [isPlaying, setIsPlaying] = useState(false)
  const [zoomLevel, setZoomLevel] = useState(1)
  const containerRef = useRef<HTMLDivElement>(null)
  const imageRef = useRef<HTMLImageElement>(null)

  // Handle image loading
  const handleImageLoad = () => {
    setLoading(false)
  }

  // Handle fullscreen toggle
  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      containerRef.current?.requestFullscreen().catch((err) => {
        console.error(`Error attempting to enable fullscreen: ${err.message}`)
      })
    } else {
      document.exitFullscreen()
    }
  }

  // Listen for fullscreen change
  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement)
    }

    document.addEventListener("fullscreenchange", handleFullscreenChange)
    return () => {
      document.removeEventListener("fullscreenchange", handleFullscreenChange)
    }
  }, [])

  // Auto-play functionality
  useEffect(() => {
    let interval: NodeJS.Timeout

    if (isPlaying) {
      interval = setInterval(() => {
        setCurrentImageIndex((prev) => (prev + 1) % tourImages.length)
      }, 3000)
    }

    return () => {
      clearInterval(interval)
    }
  }, [isPlaying, tourImages.length])

  // Handle zoom
  const handleZoomIn = () => {
    setZoomLevel((prev) => Math.min(prev + 0.2, 3))
  }

  const handleZoomOut = () => {
    setZoomLevel((prev) => Math.max(prev - 0.2, 0.5))
  }

  // Handle rotation
  const handleRotate = () => {
    if (imageRef.current) {
      const currentRotation = imageRef.current.style.transform
      const rotationMatch = currentRotation.match(/rotate$$(\d+)deg$$/)
      const currentDegrees = rotationMatch ? Number.parseInt(rotationMatch[1], 10) : 0
      const newDegrees = (currentDegrees + 90) % 360
      imageRef.current.style.transform = `rotate(${newDegrees}deg) scale(${zoomLevel})`
    }
  }

  // Navigate to next/previous image
  const goToNextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % tourImages.length)
  }

  const goToPrevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + tourImages.length) % tourImages.length)
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Virtual Tour</CardTitle>
        <CardDescription>Explore {title} with our interactive virtual tour</CardDescription>
      </CardHeader>
      <CardContent>
        <div
          ref={containerRef}
          className={`relative overflow-hidden rounded-md ${
            isFullscreen ? "h-screen w-screen" : "h-[400px] md:h-[500px]"
          }`}
        >
          {loading && (
            <div className="absolute inset-0 flex items-center justify-center bg-muted/50">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          )}

          <img
            ref={imageRef}
            src={tourImages[currentImageIndex] || "/placeholder.svg"}
            alt={`Virtual tour image ${currentImageIndex + 1} of ${title}`}
            className="w-full h-full object-contain transition-transform duration-300"
            style={{ transform: `scale(${zoomLevel})` }}
            onLoad={handleImageLoad}
          />

          {/* Navigation dots */}
          <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
            {tourImages.map((_, index) => (
              <button
                key={index}
                className={`w-2 h-2 rounded-full ${index === currentImageIndex ? "bg-primary" : "bg-muted"}`}
                onClick={() => setCurrentImageIndex(index)}
                aria-label={`View image ${index + 1}`}
              />
            ))}
          </div>

          {/* Controls */}
          <div className="absolute bottom-12 left-1/2 transform -translate-x-1/2 flex space-x-2 bg-background/80 backdrop-blur-sm rounded-full p-2">
            <Button
              size="icon"
              variant="ghost"
              onClick={() => setIsPlaying(!isPlaying)}
              aria-label={isPlaying ? "Pause tour" : "Play tour"}
            >
              {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
            </Button>

            <Button size="icon" variant="ghost" onClick={handleZoomIn} aria-label="Zoom in">
              <ZoomIn className="h-4 w-4" />
            </Button>

            <Button size="icon" variant="ghost" onClick={handleZoomOut} aria-label="Zoom out">
              <ZoomOut className="h-4 w-4" />
            </Button>

            <Button size="icon" variant="ghost" onClick={handleRotate} aria-label="Rotate image">
              <RotateCw className="h-4 w-4" />
            </Button>

            <Button
              size="icon"
              variant="ghost"
              onClick={toggleFullscreen}
              aria-label={isFullscreen ? "Exit fullscreen" : "Enter fullscreen"}
            >
              {isFullscreen ? <Minimize2 className="h-4 w-4" /> : <Maximize2 className="h-4 w-4" />}
            </Button>
          </div>

          {/* Left/Right navigation arrows */}
          <Button
            className="absolute left-4 top-1/2 transform -translate-y-1/2 rounded-full p-2 bg-background/80 backdrop-blur-sm"
            size="icon"
            variant="ghost"
            onClick={goToPrevImage}
            aria-label="Previous image"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="h-4 w-4"
            >
              <path d="m15 18-6-6 6-6" />
            </svg>
          </Button>

          <Button
            className="absolute right-4 top-1/2 transform -translate-y-1/2 rounded-full p-2 bg-background/80 backdrop-blur-sm"
            size="icon"
            variant="ghost"
            onClick={goToNextImage}
            aria-label="Next image"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="h-4 w-4"
            >
              <path d="m9 18 6-6-6-6" />
            </svg>
          </Button>
        </div>

        <div className="mt-4 text-sm text-muted-foreground">
          <p>
            Image {currentImageIndex + 1} of {tourImages.length}. Use the controls to navigate through the virtual tour.
          </p>
        </div>
      </CardContent>
    </Card>
  )
}
