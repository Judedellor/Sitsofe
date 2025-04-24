"use client"

import { useState, useEffect } from "react"
import { supabase } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Loader2, CheckCircle, XCircle, RefreshCw } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"

export function ConnectionTest({ onSuccess }: { onSuccess: () => void }) {
  const [status, setStatus] = useState<"idle" | "testing" | "success" | "error">("idle")
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  const testConnection = async () => {
    try {
      setStatus("testing")
      setErrorMessage(null)

      // Instead of querying a specific table, just check if we can connect to Supabase
      // by getting the current session (which doesn't require any specific table)
      const { data, error } = await supabase.auth.getSession()

      if (error) {
        throw error
      }

      // If we get here, connection is successful
      setStatus("success")

      // After a short delay, call onSuccess to proceed
      setTimeout(() => {
        onSuccess()
      }, 1500)
    } catch (error) {
      console.error("Connection test failed:", error)
      setStatus("error")
      setErrorMessage(
        error instanceof Error
          ? error.message
          : "Failed to connect to the server. Please check your internet connection.",
      )
    }
  }

  // Add a skip function to allow users to bypass the connection test
  const skipConnectionTest = () => {
    console.log("Connection test skipped by user")
    onSuccess()
  }

  // Automatically test connection when component mounts
  useEffect(() => {
    testConnection()
  }, [])

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle>Connecting to HomeHub</CardTitle>
        <CardDescription>Testing connection to our servers...</CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col items-center justify-center py-6">
        {status === "idle" && <Button onClick={testConnection}>Test Connection</Button>}

        {status === "testing" && (
          <div className="flex flex-col items-center">
            <Loader2 className="h-12 w-12 animate-spin text-primary mb-4" />
            <p className="text-center text-muted-foreground">Testing connection...</p>
          </div>
        )}

        {status === "success" && (
          <div className="flex flex-col items-center">
            <CheckCircle className="h-12 w-12 text-success mb-4" />
            <p className="text-center text-success font-medium">Connection successful!</p>
            <p className="text-center text-muted-foreground mt-2">Redirecting to login...</p>
          </div>
        )}

        {status === "error" && (
          <div className="flex flex-col items-center">
            <XCircle className="h-12 w-12 text-destructive mb-4" />
            <p className="text-center text-destructive font-medium">Connection failed</p>
            {errorMessage && (
              <Alert variant="destructive" className="mt-4">
                <AlertDescription>{errorMessage}</AlertDescription>
              </Alert>
            )}
          </div>
        )}
      </CardContent>

      {status === "error" && (
        <CardFooter className="flex justify-between">
          <Button onClick={testConnection} className="flex items-center gap-2">
            <RefreshCw className="h-4 w-4" />
            Retry Connection
          </Button>
          <Button variant="outline" onClick={skipConnectionTest}>
            Skip Check
          </Button>
        </CardFooter>
      )}
    </Card>
  )
}
