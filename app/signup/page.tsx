"use client"

import type React from "react"

import { useState } from "react"
import { useAuth } from "@/contexts/auth-context"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { AlertCircle, Loader2, Eye, EyeOff, CheckCircle, XCircle } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useRouter } from "next/navigation"
import Link from "next/link"

export default function SignupPage() {
  const { signUp } = useAuth()
  const router = useRouter()
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    confirmPassword: "",
    fullName: "",
    role: "renter", // Default role
  })
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [passwordFocus, setPasswordFocus] = useState(false)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }

  const handleRoleChange = (value: string) => {
    setFormData({
      ...formData,
      role: value,
    })
  }

  // Password validation
  const passwordHasMinLength = formData.password.length >= 8
  const passwordHasUppercase = /[A-Z]/.test(formData.password)
  const passwordHasLowercase = /[a-z]/.test(formData.password)
  const passwordHasNumber = /[0-9]/.test(formData.password)
  const passwordHasSpecial = /[^A-Za-z0-9]/.test(formData.password)
  const passwordsMatch = formData.password === formData.confirmPassword && formData.password !== ""

  const passwordStrength = [
    passwordHasMinLength,
    passwordHasUppercase,
    passwordHasLowercase,
    passwordHasNumber,
    passwordHasSpecial,
  ].filter(Boolean).length

  const getPasswordStrengthLabel = () => {
    if (passwordStrength <= 2) return "Weak"
    if (passwordStrength <= 4) return "Medium"
    return "Strong"
  }

  const getPasswordStrengthColor = () => {
    if (passwordStrength <= 2) return "bg-destructive"
    if (passwordStrength <= 4) return "bg-warning"
    return "bg-success"
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError(null)

    // Validate passwords match
    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match")
      setLoading(false)
      return
    }

    // Validate password strength
    if (passwordStrength < 3) {
      setError("Password is too weak. Please follow the password requirements.")
      setLoading(false)
      return
    }

    try {
      await signUp(formData.email, formData.password, {
        full_name: formData.fullName,
        role: formData.role as "owner" | "renter" | "admin",
      })

      // Redirect to login page after successful signup
      router.push("/login?signup=success")
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to sign up")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="container mx-auto py-16">
      <h1 className="text-3xl font-bold text-center mb-8">Create Your Account</h1>

      <Card className="w-full max-w-md mx-auto">
        <CardHeader>
          <CardTitle>Sign Up</CardTitle>
          <CardDescription>Enter your information to create an account</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <div className="space-y-2">
              <Label htmlFor="fullName">Full Name</Label>
              <Input
                id="fullName"
                name="fullName"
                value={formData.fullName}
                onChange={handleChange}
                required
                placeholder="John Doe"
                autoComplete="name"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                required
                placeholder="your@email.com"
                autoComplete="email"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <Input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  value={formData.password}
                  onChange={handleChange}
                  required
                  placeholder="••••••••"
                  autoComplete="new-password"
                  onFocus={() => setPasswordFocus(true)}
                  onBlur={() => setPasswordFocus(false)}
                />
                <button
                  type="button"
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>

              {/* Password strength indicator */}
              {formData.password && (
                <div className="mt-2">
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-xs">Password strength:</span>
                    <span className="text-xs font-medium">{getPasswordStrengthLabel()}</span>
                  </div>
                  <div className="h-1 w-full bg-muted rounded-full overflow-hidden">
                    <div
                      className={`h-full ${getPasswordStrengthColor()}`}
                      style={{ width: `${(passwordStrength / 5) * 100}%` }}
                    ></div>
                  </div>
                </div>
              )}

              {/* Password requirements */}
              {(passwordFocus || formData.password) && (
                <div className="mt-2 space-y-1">
                  <p className="text-xs font-medium">Password requirements:</p>
                  <ul className="text-xs space-y-1">
                    <li className="flex items-center">
                      {passwordHasMinLength ? (
                        <CheckCircle className="h-3 w-3 text-success mr-1" />
                      ) : (
                        <XCircle className="h-3 w-3 text-muted-foreground mr-1" />
                      )}
                      At least 8 characters
                    </li>
                    <li className="flex items-center">
                      {passwordHasUppercase ? (
                        <CheckCircle className="h-3 w-3 text-success mr-1" />
                      ) : (
                        <XCircle className="h-3 w-3 text-muted-foreground mr-1" />
                      )}
                      At least one uppercase letter
                    </li>
                    <li className="flex items-center">
                      {passwordHasLowercase ? (
                        <CheckCircle className="h-3 w-3 text-success mr-1" />
                      ) : (
                        <XCircle className="h-3 w-3 text-muted-foreground mr-1" />
                      )}
                      At least one lowercase letter
                    </li>
                    <li className="flex items-center">
                      {passwordHasNumber ? (
                        <CheckCircle className="h-3 w-3 text-success mr-1" />
                      ) : (
                        <XCircle className="h-3 w-3 text-muted-foreground mr-1" />
                      )}
                      At least one number
                    </li>
                    <li className="flex items-center">
                      {passwordHasSpecial ? (
                        <CheckCircle className="h-3 w-3 text-success mr-1" />
                      ) : (
                        <XCircle className="h-3 w-3 text-muted-foreground mr-1" />
                      )}
                      At least one special character
                    </li>
                  </ul>
                </div>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Confirm Password</Label>
              <div className="relative">
                <Input
                  id="confirmPassword"
                  name="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  required
                  placeholder="••••••••"
                  autoComplete="new-password"
                />
                <button
                  type="button"
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                >
                  {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>

              {formData.confirmPassword && (
                <div className="flex items-center mt-1">
                  {passwordsMatch ? (
                    <>
                      <CheckCircle className="h-3 w-3 text-success mr-1" />
                      <span className="text-xs text-success">Passwords match</span>
                    </>
                  ) : (
                    <>
                      <XCircle className="h-3 w-3 text-destructive mr-1" />
                      <span className="text-xs text-destructive">Passwords do not match</span>
                    </>
                  )}
                </div>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="role">Account Type</Label>
              <Select value={formData.role} onValueChange={handleRoleChange}>
                <SelectTrigger id="role">
                  <SelectValue placeholder="Select account type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="renter">Renter</SelectItem>
                  <SelectItem value="owner">Property Owner</SelectItem>
                </SelectContent>
              </Select>
              <p className="text-xs text-muted-foreground mt-1">
                Select 'Renter' if you're looking for properties, or 'Property Owner' if you want to list properties.
              </p>
            </div>

            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? (
                <span className="flex items-center">
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Creating Account...
                </span>
              ) : (
                "Sign Up"
              )}
            </Button>
          </form>
        </CardContent>
        <CardFooter className="flex justify-center">
          <p className="text-sm text-muted-foreground">
            Already have an account?{" "}
            <Link href="/login" className="text-primary hover:underline">
              Sign in
            </Link>
          </p>
        </CardFooter>
      </Card>
    </div>
  )
}
