"use client"

import type React from "react"
import { ProtectedRoute } from "@/components/auth/protected-route"

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <ProtectedRoute>
      <main className="container mx-auto px-4 py-8">{children}</main>
    </ProtectedRoute>
  )
}
