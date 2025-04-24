import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { PropertyList } from "@/components/properties/PropertyList"
import { PropertySearchForm } from "@/components/search/PropertySearchForm"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Home, MapPin, Building, Users, MessageSquare, Shield } from "lucide-react"

export default function HomePage() {
  return (
    <div>
      {/* Hero Section */}
      <section className="relative">
        <div className="absolute inset-0 bg-gradient-to-r from-primary/90 to-primary/70 z-10" />
        <div className="relative h-[600px]">
          <Image
            src="/placeholder.svg?height=1200&width=2000"
            alt="Modern home interior"
            fill
            className="object-cover"
            priority
          />
        </div>
        <div className="absolute inset-0 flex items-center z-20">
          <div className="container mx-auto px-4">
            <div className="max-w-2xl">
              <Badge className="mb-4 bg-white/20 text-white hover:bg-white/30">Find Your Dream Home</Badge>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6">
                Discover Your Perfect Place to Live
              </h1>
              <p className="text-xl text-white/90 mb-8">
                Browse thousands of properties, connect with owners, and find the perfect home that matches your
                lifestyle and budget.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link href="/properties">
                  <Button size="lg" className="w-full sm:w-auto">
                    Browse Properties
                  </Button>
                </Link>
                <Link href="/signup">
                  <Button
                    size="lg"
                    variant="outline"
                    className="w-full sm:w-auto bg-white/10 text-white border-white/20 hover:bg-white/20"
                  >
                    Create Account
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Search Section */}
      <section className="container mx-auto px-4 py-8 -mt-16 relative z-30">
        <Card className="shadow-lg">
          <CardContent className="p-6">
            <PropertySearchForm />
          </CardContent>
        </Card>
      </section>

      {/* Featured Properties */}
      <section className="container mx-auto px-4 py-16">
        <div className="flex justify-between items-center mb-8">
          <div>
            <Badge className="mb-2">Featured Listings</Badge>
            <h2 className="text-3xl font-bold">Discover Our Top Properties</h2>
          </div>
          <Link href="/properties" className="text-primary hover:underline">
            View all properties
          </Link>
        </div>
        <PropertyList />
      </section>

      {/* Features Section */}
      <section className="bg-muted py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <Badge className="mb-2">Why Choose Us</Badge>
            <h2 className="text-3xl font-bold mb-4">The Smarter Way to Find a Home</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Our platform offers a comprehensive solution for all your real estate needs, making the process of finding
              or listing properties simple and efficient.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Card>
              <CardContent className="p-6 flex flex-col items-center text-center">
                <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                  <Building className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Extensive Property Listings</h3>
                <p className="text-muted-foreground">
                  Browse thousands of verified properties across different locations, types, and price ranges.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6 flex flex-col items-center text-center">
                <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                  <MapPin className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Location-Based Search</h3>
                <p className="text-muted-foreground">
                  Find properties in your preferred neighborhoods with our advanced location-based search.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6 flex flex-col items-center text-center">
                <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                  <MessageSquare className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Direct Communication</h3>
                <p className="text-muted-foreground">
                  Connect directly with property owners or renters through our integrated messaging system.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6 flex flex-col items-center text-center">
                <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                  <Users className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Verified Users</h3>
                <p className="text-muted-foreground">
                  All users on our platform are verified, ensuring a safe and trustworthy experience.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6 flex flex-col items-center text-center">
                <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                  <Home className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Easy Property Listing</h3>
                <p className="text-muted-foreground">
                  Property owners can easily list their properties with our user-friendly interface.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6 flex flex-col items-center text-center">
                <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                  <Shield className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Secure Transactions</h3>
                <p className="text-muted-foreground">
                  Our platform ensures secure transactions and protects your personal information.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="container mx-auto px-4 py-16">
        <div className="bg-primary rounded-lg p-8 md:p-12">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl font-bold text-white mb-4">Ready to Find Your Dream Home?</h2>
            <p className="text-white/90 text-lg mb-8">
              Join thousands of satisfied users who found their perfect property through our platform.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Link href="/properties">
                <Button size="lg" variant="secondary" className="w-full sm:w-auto">
                  Browse Properties
                </Button>
              </Link>
              <Link href="/signup">
                <Button
                  size="lg"
                  variant="outline"
                  className="w-full sm:w-auto bg-transparent text-white border-white hover:bg-white/10"
                >
                  Create Account
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="bg-muted/50 py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <Badge className="mb-2">Testimonials</Badge>
            <h2 className="text-3xl font-bold mb-4">What Our Users Say</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Hear from our satisfied users who found their perfect properties through our platform.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center mb-4">
                  <div className="mr-4">
                    <Image
                      src="/placeholder.svg?height=100&width=100"
                      alt="User"
                      width={50}
                      height={50}
                      className="rounded-full"
                    />
                  </div>
                  <div>
                    <h4 className="font-semibold">Sarah Johnson</h4>
                    <p className="text-sm text-muted-foreground">Renter</p>
                  </div>
                </div>
                <p className="text-muted-foreground">
                  "I found my dream apartment in just a week using HomeHub. The search filters made it easy to find
                  exactly what I was looking for, and the direct messaging feature allowed me to communicate with the
                  owner instantly."
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center mb-4">
                  <div className="mr-4">
                    <Image
                      src="/placeholder.svg?height=100&width=100"
                      alt="User"
                      width={50}
                      height={50}
                      className="rounded-full"
                    />
                  </div>
                  <div>
                    <h4 className="font-semibold">Michael Brown</h4>
                    <p className="text-sm text-muted-foreground">Property Owner</p>
                  </div>
                </div>
                <p className="text-muted-foreground">
                  "As a property owner, I've tried several platforms to list my properties. HomeHub has been the most
                  effective by far. I received multiple inquiries within days and found reliable tenants quickly."
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center mb-4">
                  <div className="mr-4">
                    <Image
                      src="/placeholder.svg?height=100&width=100"
                      alt="User"
                      width={50}
                      height={50}
                      className="rounded-full"
                    />
                  </div>
                  <div>
                    <h4 className="font-semibold">Emily Chen</h4>
                    <p className="text-sm text-muted-foreground">Renter</p>
                  </div>
                </div>
                <p className="text-muted-foreground">
                  "The virtual tours feature saved me so much time. I was able to view multiple properties from the
                  comfort of my home before scheduling in-person visits for my top choices."
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
    </div>
  )
}
