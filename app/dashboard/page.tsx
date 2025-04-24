"use client"

import { useEffect } from "react"
import { useAuth } from "@/contexts/auth-context"
import { useRouter } from "next/navigation"
import { Loader2 } from "lucide-react"

export default function DashboardPage() {
  const { profile, loading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!loading) {
      if (profile) {
        // Redirect to role-specific dashboard
        console.log("Redirecting to role-specific dashboard:", profile.role)
        router.push(`/dashboard/${profile.role}`)
      } else {
        console.log("No profile found, redirecting to login")
        router.push("/login")
      }
    }
  }, [profile, loading, router])

  return (
    <div className="flex items-center justify-center h-[400px]">
      <Loader2 className="h-8 w-8 animate-spin text-primary" />
    </div>
  )
}
