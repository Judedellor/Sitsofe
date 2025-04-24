"use client"

import type React from "react"

import { useState, useEffect, useCallback, useRef } from "react"
import { useAuth } from "@/contexts/auth-context"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { AlertCircle, Loader2, Eye, EyeOff, Info } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Checkbox } from "@/components/ui/checkbox"
import { ConnectionTest } from "./ConnectionTest"
import { isSupabaseConfigured } from "@/lib/supabase/client"

interface LoginFormProps {
  signupSuccess?: boolean
}

export function LoginForm({ signupSuccess = false }: LoginFormProps) {
  const { signIn, requestPasswordReset, useDevAuth } = useAuth()
  const router = useRouter()

  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [rememberMe, setRememberMe] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [resetMode, setResetMode] = useState(false)
  const [resetSent, setResetSent] = useState(false)
  const [testingConnection, setTestingConnection] = useState(false)
  const [showDevMode, setShowDevMode] = useState(false)
  const [devLoginRole, setDevLoginRole] = useState<"owner" | "renter" | "admin" | null>(null)
  const [autoDevMode, setAutoDevMode] = useState(false)

  // Ref to prevent useEffect running on initial render
  const firstRender = useRef(true)

  // Initialize client-side only state
  useEffect(() => {
    // Set dev mode flag based on environment
    setShowDevMode(process.env.NODE_ENV === "development" || window.location.hostname.includes("vercel.app"))

    // Check if we should auto-enable dev mode
    const isPreview = window.location.hostname.includes("vercel.app")
    const isLocalhost = window.location.hostname === "localhost"

    if ((isPreview || isLocalhost) && !isSupabaseConfigured()) {
      setAutoDevMode(true)
    }

    // Load saved email if available
    const savedEmail = localStorage.getItem("rememberedEmail")
    if (savedEmail) {
      setEmail(savedEmail)
      setRememberMe(true)
    }
  }, [])

  // Handle dev mode login after render
  useEffect(() => {
    if (firstRender.current) {
      firstRender.current = false
      return
    }

    if (devLoginRole) {
      try {
        useDevAuth(devLoginRole)
        // Wait a moment to ensure the auth context is updated
        setTimeout(() => {
          router.push("/dashboard")
        }, 100)
      } catch (err) {
        console.error("Error using dev auth:", err)
        setError("Failed to use development authentication")
      } finally {
        setDevLoginRole(null) // Reset after use
      }
    }
  }, [devLoginRole, useDevAuth, router])

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      if (resetMode) {
        await requestPasswordReset(email)
        setResetSent(true)
      } else {
        // If we're in a preview environment and Supabase is not configured, use dev auth
        if (autoDevMode) {
          useDevAuth("renter")

          // Save email if remember me is checked
          if (rememberMe) {
            localStorage.setItem("rememberedEmail", email)
          } else {
            localStorage.removeItem("rememberedEmail")
          }

          // Wait a moment to ensure the auth context is updated
          setTimeout(() => {
            // Check if there's a redirect URL stored
            const redirectUrl = sessionStorage.getItem("redirectAfterLogin")
            if (redirectUrl) {
              sessionStorage.removeItem("redirectAfterLogin")
              router.push(redirectUrl)
            } else {
              router.push("/dashboard")
            }
          }, 100)

          return
        }

        await signIn(email, password)

        // Save email if remember me is checked
        if (rememberMe) {
          localStorage.setItem("rememberedEmail", email)
        } else {
          localStorage.removeItem("rememberedEmail")
        }

        // Check if there's a redirect URL stored
        const redirectUrl = sessionStorage.getItem("redirectAfterLogin")
        if (redirectUrl) {
          sessionStorage.removeItem("redirectAfterLogin")
          router.push(redirectUrl)
        } else {
          router.push("/dashboard")
        }
      }
    } catch (err) {
      console.error("Authentication error:", err)
      setError(
        err instanceof Error ? err.message : "Authentication failed. Please check your credentials and try again.",
      )

      // If authentication fails, offer to use dev mode
      if (!isSupabaseConfigured()) {
        setAutoDevMode(true)
      }
    } finally {
      setLoading(false)
    }
  }

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword)
  }

  const handleConnectionSuccess = () => {
    setTestingConnection(false)
  }

  // Functions to handle dev mode login
  const loginAsRole = useCallback((role: "owner" | "renter" | "admin") => {
    setDevLoginRole(role)
  }, [])

  // Check if Supabase is configured
  const supabaseConfigured = isSupabaseConfigured()

  // Call useDevAuth conditionally in useEffect
  useEffect(() => {
    if (autoDevMode) {
      useDevAuth("renter")
      // Save email if remember me is checked
      if (rememberMe) {
        localStorage.setItem("rememberedEmail", email)
      } else {
        localStorage.removeItem("rememberedEmail")
      }

      // Wait a moment to ensure the auth context is updated
      setTimeout(() => {
        // Check if there's a redirect URL stored
        const redirectUrl = sessionStorage.getItem("redirectAfterLogin")
        if (redirectUrl) {
          sessionStorage.removeItem("redirectAfterLogin")
          router.push(redirectUrl)
        } else {
          router.push("/dashboard")
        }
      }, 100)
    }
  }, [autoDevMode, rememberMe, email, useDevAuth, router])

  if (testingConnection) {
    return <ConnectionTest onSuccess={handleConnectionSuccess} />
  }

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle>{resetMode ? "Reset Password" : "Sign In"}</CardTitle>
        <CardDescription>
          {resetMode
            ? "Enter your email to receive a password reset link"
            : "Enter your credentials to access your account"}
        </CardDescription>
      </CardHeader>
      <CardContent>
        {!supabaseConfigured && (
          <Alert className="mb-4">
            <Info className="h-4 w-4" />
            <AlertDescription>
              {autoDevMode
                ? "Using development mode for authentication. No real authentication will be performed."
                : "Supabase is not configured. Authentication may not work properly."}
            </AlertDescription>
          </Alert>
        )}

        {signupSuccess && !error && !resetMode && (
          <Alert className="mb-4 bg-success/20 text-success border-success">
            <AlertDescription>Account created successfully! Please sign in with your credentials.</AlertDescription>
          </Alert>
        )}

        {error && (
          <Alert variant="destructive" className="mb-4">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {resetSent && (
          <Alert className="mb-4">
            <AlertDescription>
              Password reset link has been sent to your email. Please check your inbox.
            </AlertDescription>
          </Alert>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="your@email.com"
              disabled={loading}
              autoComplete="email"
            />
          </div>

          {!resetMode && (
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="password">Password</Label>
                <button
                  type="button"
                  onClick={() => setResetMode(true)}
                  className="text-xs text-primary hover:underline"
                >
                  Forgot password?
                </button>
              </div>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required={!autoDevMode}
                  placeholder="••••••••"
                  disabled={loading}
                  autoComplete="current-password"
                />
                <button
                  type="button"
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  onClick={togglePasswordVisibility}
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>
          )}

          {!resetMode && (
            <div className="flex items-center space-x-2">
              <Checkbox
                id="remember"
                checked={rememberMe}
                onCheckedChange={(checked) => setRememberMe(checked === true)}
              />
              <Label htmlFor="remember" className="text-sm cursor-pointer">
                Remember me
              </Label>
            </div>
          )}

          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? (
              <span className="flex items-center">
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                {resetMode ? "Sending..." : "Signing in..."}
              </span>
            ) : resetMode ? (
              "Send Reset Link"
            ) : (
              "Sign In"
            )}
          </Button>

          {resetMode && !resetSent && (
            <Button
              type="button"
              variant="outline"
              className="w-full mt-2"
              onClick={() => setResetMode(false)}
              disabled={loading}
            >
              Back to Login
            </Button>
          )}
        </form>

        {/* Development Mode Section */}
        {showDevMode && (
          <div className="mt-6 pt-4 border-t">
            <h3 className="text-sm font-medium mb-2">Development Mode</h3>
            <p className="text-xs text-muted-foreground mb-3">
              Use these options to bypass authentication during development.
            </p>
            <div className="flex flex-wrap gap-2">
              <Button size="sm" variant="outline" onClick={() => loginAsRole("renter")} className="text-xs">
                Login as Renter
              </Button>
              <Button size="sm" variant="outline" onClick={() => loginAsRole("owner")} className="text-xs">
                Login as Owner
              </Button>
              <Button size="sm" variant="outline" onClick={() => loginAsRole("admin")} className="text-xs">
                Login as Admin
              </Button>
            </div>
          </div>
        )}
      </CardContent>
      <CardFooter className="flex justify-center">
        <p className="text-sm text-muted-foreground">
          Don't have an account?{" "}
          <Link href="/signup" className="text-primary hover:underline">
            Sign up
          </Link>
        </p>
      </CardFooter>
    </Card>
  )
}
