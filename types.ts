export interface Property {
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

export interface User {
  id: string
  email: string
  name: string
  role: "renter" | "owner" | "admin"
  avatar?: string
  verified: boolean
  createdAt: string
}

export interface Notification {
  id: string
  userId: string
  title: string
  message: string
  type: "info" | "success" | "warning" | "error"
  read: boolean
  createdAt: string
}
