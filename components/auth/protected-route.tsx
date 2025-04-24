"use client"

import type React from "react"

import { useAuth } from "@/contexts/auth-context"
import { useRouter, usePathname } from "next/navigation"
import { useEffect } from "react"
import { Loader2 } from "lucide-react"

interface ProtectedRouteProps {
  children: React.ReactNode
  allowedRoles?: ("owner" | "renter" | "admin")[]
}

export function ProtectedRoute({ children, allowedRoles }: ProtectedRouteProps) {
  const { loading, user, profile, isDevelopmentMode } = useAuth()
  const router = useRouter()
  const pathname = usePathname()

  useEffect(() => {
    if (!loading) {
      if (!user) {
        console.log("No user found, redirecting to login")
        // Store the URL they were trying to access
        sessionStorage.setItem("redirectAfterLogin", pathname)
        router.push("/login")
      } else if (allowedRoles && profile && !allowedRoles.includes(profile.role)) {
        console.log("User doesn't have permission, redirecting to their dashboard")
        // Redirect to the correct dashboard if they don't have permission
        router.push(`/dashboard/${profile.role}`)
      }
    }
  }, [loading, user, profile, allowedRoles, router, pathname])

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  if (!user) {
    // This prevents a flash of protected content before redirect
    return null
  }

  if (allowedRoles && profile && !allowedRoles.includes(profile.role)) {
    // This prevents a flash of protected content before redirect
    return null
  }

  return <>{children}</>
}
