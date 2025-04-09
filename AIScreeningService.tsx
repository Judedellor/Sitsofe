"use client"

import { useState, useEffect } from "react"

// Types for the screening service
export type ScreeningStatus = "pending" | "in_progress" | "completed" | "failed"
export type DocumentStatus = "pending" | "verified" | "suspicious" | "rejected"
export type ApplicantStatus = "pending" | "screening" | "approved" | "rejected"

export interface ScreeningResult {
  riskScore: number
  creditScore: number | null
  backgroundCheckStatus: "passed" | "failed" | "in_progress" | null
  incomeVerified: boolean
  identityVerified: boolean
  documentsVerified: boolean
  fraudDetected: boolean
  aiInsights: string[]
  complianceIssues: string[]
}

export interface ScreeningRequest {
  applicantId: string
  propertyId: string
  documents: {
    id: string
    type: string
    url: string
  }[]
}

// Mock API functions
const mockScreeningAPI = {
  initiateScreening: async (request: ScreeningRequest): Promise<{ screeningId: string }> => {
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000))
    return { screeningId: `scr_${Math.random().toString(36).substring(2, 10)}` }
  },

  getScreeningStatus: async (screeningId: string): Promise<{ status: ScreeningStatus; progress: number }> => {
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 500))

    // Randomly determine progress based on screeningId
    const hash = screeningId.split("_")[1]
    const progressSeed = Number.parseInt(hash.substring(0, 2), 36) / 36

    // Progress between 0-100
    const progress = Math.min(100, Math.floor(progressSeed * 120))

    let status: ScreeningStatus = "in_progress"
    if (progress < 10) status = "pending"
    else if (progress >= 100) status = "completed"

    return { status, progress }
  },

  getScreeningResults: async (screeningId: string): Promise<ScreeningResult> => {
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 800))

    // Generate somewhat random but deterministic results based on screeningId
    const hash = screeningId.split("_")[1]
    const scoreSeed = Number.parseInt(hash.substring(0, 2), 36) / 36

    const riskScore = Math.floor(40 + scoreSeed * 60) // 40-100
    const creditScore = Math.floor(500 + scoreSeed * 350) // 500-850

    return {
      riskScore,
      creditScore,
      backgroundCheckStatus: scoreSeed > 0.8 ? "passed" : scoreSeed > 0.3 ? "in_progress" : "failed",
      incomeVerified: scoreSeed > 0.4,
      identityVerified: scoreSeed > 0.3,
      documentsVerified: scoreSeed > 0.5,
      fraudDetected: scoreSeed < 0.2,
      aiInsights: [
        scoreSeed > 0.7
          ? "Applicant has strong financial stability indicators"
          : "Applicant has moderate financial stability",
        scoreSeed > 0.6 ? "Employment history is consistent and verified" : "Some gaps detected in employment history",
        scoreSeed > 0.5 ? "Rental history shows on-time payments" : "Some late payments detected in rental history",
        scoreSeed < 0.3 ? "Possible inconsistency detected in provided documents" : "All documents appear consistent",
        scoreSeed < 0.2 ? "Potential identity verification issues detected" : "Identity successfully verified",
      ],
      complianceIssues: scoreSeed < 0.3 ? ["Income verification does not meet minimum requirements"] : [],
    }
  },

  getDocumentVerificationStatus: async (documentId: string): Promise<DocumentStatus> => {
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 300))

    // Generate somewhat random but deterministic status based on documentId
    const hash = Number.parseInt(documentId, 36) % 100

    if (hash < 10) return "suspicious"
    if (hash < 20) return "rejected"
    if (hash < 30) return "pending"
    return "verified"
  },
}

// Hook for using the AI screening service
export const useAIScreening = () => {
  const [isInitiating, setIsInitiating] = useState(false)
  const [screeningId, setScreeningId] = useState<string | null>(null)
  const [screeningStatus, setScreeningStatus] = useState<ScreeningStatus | null>(null)
  const [screeningProgress, setScreeningProgress] = useState(0)
  const [screeningResults, setScreeningResults] = useState<ScreeningResult | null>(null)
  const [error, setError] = useState<string | null>(null)

  // Initiate a new screening
  const initiateScreening = async (request: ScreeningRequest) => {
    setIsInitiating(true)
    setError(null)

    try {
      const { screeningId } = await mockScreeningAPI.initiateScreening(request)
      setScreeningId(screeningId)
      setScreeningStatus("pending")
      setScreeningProgress(0)
      return screeningId
    } catch (err) {
      setError("Failed to initiate screening")
      console.error("Screening initiation error:", err)
      return null
    } finally {
      setIsInitiating(false)
    }
  }

  // Check screening status
  const checkScreeningStatus = async (id: string) => {
    try {
      const { status, progress } = await mockScreeningAPI.getScreeningStatus(id)
      setScreeningStatus(status)
      setScreeningProgress(progress)

      if (status === "completed") {
        const results = await mockScreeningAPI.getScreeningResults(id)
        setScreeningResults(results)
      }

      return { status, progress }
    } catch (err) {
      setError("Failed to check screening status")
      console.error("Screening status error:", err)
      return null
    }
  }

  // Get document verification status
  const getDocumentStatus = async (documentId: string) => {
    try {
      return await mockScreeningAPI.getDocumentVerificationStatus(documentId)
    } catch (err) {
      console.error("Document verification error:", err)
      return "pending" as DocumentStatus
    }
  }

  // Poll for screening status updates
  useEffect(() => {
    let intervalId: NodeJS.Timeout

    if (screeningId && (screeningStatus === "pending" || screeningStatus === "in_progress")) {
      intervalId = setInterval(async () => {
        const result = await checkScreeningStatus(screeningId)
        if (result?.status === "completed" || result?.status === "failed") {
          clearInterval(intervalId)
        }
      }, 2000)
    }

    return () => {
      if (intervalId) clearInterval(intervalId)
    }
  }, [screeningId, screeningStatus])

  return {
    initiateScreening,
    checkScreeningStatus,
    getDocumentStatus,
    isInitiating,
    screeningId,
    screeningStatus,
    screeningProgress,
    screeningResults,
    error,
  }
}

export default useAIScreening

