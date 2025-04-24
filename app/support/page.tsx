"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Search, MessageSquare, HelpCircle, Phone, Mail, AlertCircle, Loader2 } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"

export default function SupportPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [contactForm, setContactForm] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  })
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value)
  }

  const handleContactChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setContactForm({
      ...contactForm,
      [e.target.name]: e.target.value,
    })
  }

  const handleContactSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    // Simulate API call
    setTimeout(() => {
      setLoading(false)
      setSuccess(true)
      setContactForm({
        name: "",
        email: "",
        subject: "",
        message: "",
      })

      // Reset success message after 5 seconds
      setTimeout(() => {
        setSuccess(false)
      }, 5000)
    }, 1500)
  }

  // FAQ data
  const faqs = [
    {
      question: "How do I create an account?",
      answer:
        "To create an account, click on the 'Sign up' button in the top right corner of the homepage. Fill in your details, choose your account type (renter or property owner), and follow the instructions to complete your registration.",
    },
    {
      question: "How do I list my property?",
      answer:
        "After signing in as a property owner, navigate to your dashboard and click on 'List Property'. Fill in the property details, upload photos, set your price, and submit the listing for review.",
    },
    {
      question: "How do I contact a property owner?",
      answer:
        "When viewing a property listing, click on the 'Contact Owner' button. You can send a message directly through our platform, and the owner will receive a notification to respond to your inquiry.",
    },
    {
      question: "What are the fees for using HomeHub?",
      answer:
        "HomeHub is free for renters to browse and contact property owners. Property owners pay a small fee for each listing, with various subscription plans available for those with multiple properties.",
    },
    {
      question: "How do I reset my password?",
      answer:
        "On the login page, click 'Forgot password?' and enter your email address. We'll send you a link to reset your password. Follow the instructions in the email to create a new password.",
    },
    {
      question: "Is my personal information secure?",
      answer:
        "Yes, we take security seriously. We use industry-standard encryption to protect your data, and we never share your personal information with third parties without your consent. You can review our Privacy Policy for more details.",
    },
    {
      question: "How do I report a problem with a listing?",
      answer:
        "If you encounter an issue with a listing, click the 'Report' button on the property page. Fill out the form with details about the problem, and our team will investigate promptly.",
    },
    {
      question: "Can I save my favorite properties?",
      answer:
        "Yes, you can save properties to your favorites by clicking the heart icon on any property listing. View all your saved properties in the 'Favorites' section of your dashboard.",
    },
  ]

  // Filter FAQs based on search query
  const filteredFaqs = faqs.filter(
    (faq) =>
      faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      faq.answer.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-8">Help & Support</h1>

      <Tabs defaultValue="faq">
        <TabsList className="mb-8">
          <TabsTrigger value="faq">FAQ</TabsTrigger>
          <TabsTrigger value="contact">Contact Us</TabsTrigger>
          <TabsTrigger value="resources">Resources</TabsTrigger>
        </TabsList>

        <TabsContent value="faq">
          <Card>
            <CardHeader>
              <CardTitle>Frequently Asked Questions</CardTitle>
              <CardDescription>Find answers to common questions about using HomeHub</CardDescription>
              <div className="relative mt-4">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <Input
                  placeholder="Search FAQs..."
                  className="pl-10"
                  value={searchQuery}
                  onChange={handleSearchChange}
                />
              </div>
            </CardHeader>
            <CardContent>
              {filteredFaqs.length === 0 ? (
                <div className="text-center py-8">
                  <HelpCircle className="mx-auto h-12 w-12 text-muted-foreground opacity-50" />
                  <h3 className="mt-4 text-lg font-medium">No results found</h3>
                  <p className="text-muted-foreground mt-2">Try adjusting your search query or browse all FAQs</p>
                </div>
              ) : (
                <Accordion type="single" collapsible className="w-full">
                  {filteredFaqs.map((faq, index) => (
                    <AccordionItem key={index} value={`item-${index}`}>
                      <AccordionTrigger>{faq.question}</AccordionTrigger>
                      <AccordionContent>{faq.answer}</AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="contact">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="md:col-span-2">
              <CardHeader>
                <CardTitle>Contact Us</CardTitle>
                <CardDescription>Send us a message and we'll get back to you as soon as possible</CardDescription>
              </CardHeader>
              <CardContent>
                {success && (
                  <Alert className="mb-6 bg-success/20 text-success border-success">
                    <AlertDescription>
                      Your message has been sent successfully! We'll get back to you soon.
                    </AlertDescription>
                  </Alert>
                )}

                {error && (
                  <Alert variant="destructive" className="mb-6">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>{error}</AlertDescription>
                  </Alert>
                )}

                <form onSubmit={handleContactSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="name">Name</Label>
                      <Input
                        id="name"
                        name="name"
                        value={contactForm.name}
                        onChange={handleContactChange}
                        required
                        placeholder="Your name"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        value={contactForm.email}
                        onChange={handleContactChange}
                        required
                        placeholder="your@email.com"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="subject">Subject</Label>
                    <Input
                      id="subject"
                      name="subject"
                      value={contactForm.subject}
                      onChange={handleContactChange}
                      required
                      placeholder="How can we help you?"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="message">Message</Label>
                    <Textarea
                      id="message"
                      name="message"
                      value={contactForm.message}
                      onChange={handleContactChange}
                      required
                      placeholder="Please describe your issue or question in detail..."
                      rows={6}
                    />
                  </div>

                  <Button type="submit" className="w-full" disabled={loading}>
                    {loading ? (
                      <span className="flex items-center">
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Sending...
                      </span>
                    ) : (
                      <span className="flex items-center">
                        <MessageSquare className="mr-2 h-4 w-4" />
                        Send Message
                      </span>
                    )}
                  </Button>
                </form>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Contact Information</CardTitle>
                <CardDescription>Other ways to reach our support team</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <h3 className="font-medium flex items-center">
                    <Phone className="h-4 w-4 mr-2" />
                    Phone Support
                  </h3>
                  <p className="text-muted-foreground mt-1">Available Monday-Friday, 9am-5pm</p>
                  <p className="mt-1">+1 (555) 123-4567</p>
                </div>

                <div>
                  <h3 className="font-medium flex items-center">
                    <Mail className="h-4 w-4 mr-2" />
                    Email Support
                  </h3>
                  <p className="text-muted-foreground mt-1">We'll respond within 24 hours</p>
                  <p className="mt-1">support@homehub.com</p>
                </div>

                <div>
                  <h3 className="font-medium">Office Address</h3>
                  <p className="text-muted-foreground mt-1">
                    123 Main Street
                    <br />
                    Suite 456
                    <br />
                    San Francisco, CA 94105
                    <br />
                    United States
                  </p>
                </div>

                <div>
                  <h3 className="font-medium">Business Hours</h3>
                  <p className="text-muted-foreground mt-1">
                    Monday-Friday: 9am-5pm PST
                    <br />
                    Saturday: 10am-2pm PST
                    <br />
                    Sunday: Closed
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="resources">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>User Guides</CardTitle>
                <CardDescription>Step-by-step guides to help you use HomeHub</CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  <li>
                    <a href="#" className="text-primary hover:underline flex items-center">
                      <HelpCircle className="h-4 w-4 mr-2" />
                      Getting Started Guide
                    </a>
                  </li>
                  <li>
                    <a href="#" className="text-primary hover:underline flex items-center">
                      <HelpCircle className="h-4 w-4 mr-2" />
                      How to List a Property
                    </a>
                  </li>
                  <li>
                    <a href="#" className="text-primary hover:underline flex items-center">
                      <HelpCircle className="h-4 w-4 mr-2" />
                      Finding the Perfect Rental
                    </a>
                  </li>
                  <li>
                    <a href="#" className="text-primary hover:underline flex items-center">
                      <HelpCircle className="h-4 w-4 mr-2" />
                      Messaging and Communication
                    </a>
                  </li>
                  <li>
                    <a href="#" className="text-primary hover:underline flex items-center">
                      <HelpCircle className="h-4 w-4 mr-2" />
                      Account Management
                    </a>
                  </li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Video Tutorials</CardTitle>
                <CardDescription>Watch our video tutorials to learn how to use HomeHub</CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  <li>
                    <a href="#" className="text-primary hover:underline flex items-center">
                      <HelpCircle className="h-4 w-4 mr-2" />
                      Creating Your Account
                    </a>
                  </li>
                  <li>
                    <a href="#" className="text-primary hover:underline flex items-center">
                      <HelpCircle className="h-4 w-4 mr-2" />
                      Navigating the Dashboard
                    </a>
                  </li>
                  <li>
                    <a href="#" className="text-primary hover:underline flex items-center">
                      <HelpCircle className="h-4 w-4 mr-2" />
                      Advanced Search Features
                    </a>
                  </li>
                  <li>
                    <a href="#" className="text-primary hover:underline flex items-center">
                      <HelpCircle className="h-4 w-4 mr-2" />
                      Managing Your Listings
                    </a>
                  </li>
                  <li>
                    <a href="#" className="text-primary hover:underline flex items-center">
                      <HelpCircle className="h-4 w-4 mr-2" />
                      Using the Mobile App
                    </a>
                  </li>
                </ul>
              </CardContent>
            </Card>

            <Card className="md:col-span-2">
              <CardHeader>
                <CardTitle>Downloadable Resources</CardTitle>
                <CardDescription>Download helpful resources for using HomeHub</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Button variant="outline" className="h-auto py-4 flex flex-col">
                    <span className="text-lg mb-1">User Manual</span>
                    <span className="text-xs text-muted-foreground">PDF, 2.5MB</span>
                  </Button>

                  <Button variant="outline" className="h-auto py-4 flex flex-col">
                    <span className="text-lg mb-1">Property Checklist</span>
                    <span className="text-xs text-muted-foreground">PDF, 1.2MB</span>
                  </Button>

                  <Button variant="outline" className="h-auto py-4 flex flex-col">
                    <span className="text-lg mb-1">Photo Guidelines</span>
                    <span className="text-xs text-muted-foreground">PDF, 3.7MB</span>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
