"use client"

import type React from "react"

import { useState } from "react"
import { useAuth } from "@/contexts/auth-context"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { AlertCircle, Loader2, Eye, EyeOff, CheckCircle, XCircle, Trash2 } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { useTheme } from "next-themes"
import { ProtectedRoute } from "@/components/auth/protected-route"

export default function SettingsPage() {
  const { profile, resetPassword } = useAuth()
  const { theme, setTheme } = useTheme()

  const [currentPassword, setCurrentPassword] = useState("")
  const [newPassword, setNewPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [showCurrentPassword, setShowCurrentPassword] = useState(false)
  const [showNewPassword, setShowNewPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)

  // Notification settings
  const [emailNotifications, setEmailNotifications] = useState(true)
  const [pushNotifications, setPushNotifications] = useState(true)
  const [messageNotifications, setMessageNotifications] = useState(true)
  const [propertyUpdates, setPropertyUpdates] = useState(true)

  // App settings
  const [language, setLanguage] = useState("en")
  const [cacheSize, setCacheSize] = useState("100MB")

  // Password validation
  const passwordHasMinLength = newPassword.length >= 8
  const passwordHasUppercase = /[A-Z]/.test(newPassword)
  const passwordHasLowercase = /[a-z]/.test(newPassword)
  const passwordHasNumber = /[0-9]/.test(newPassword)
  const passwordHasSpecial = /[^A-Za-z0-9]/.test(newPassword)
  const passwordsMatch = newPassword === confirmPassword && newPassword !== ""

  const passwordStrength = [
    passwordHasMinLength,
    passwordHasUppercase,
    passwordHasLowercase,
    passwordHasNumber,
    passwordHasSpecial,
  ].filter(Boolean).length

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    setSuccess(null)

    // Validate password
    if (newPassword !== confirmPassword) {
      setError("New passwords do not match")
      setLoading(false)
      return
    }

    if (passwordStrength < 3) {
      setError("Password is too weak. Please follow the password requirements.")
      setLoading(false)
      return
    }

    try {
      // In a real app, we would verify the current password first
      await resetPassword(newPassword)
      setSuccess("Password changed successfully")
      setCurrentPassword("")
      setNewPassword("")
      setConfirmPassword("")
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to change password")
    } finally {
      setLoading(false)
    }
  }

  const handleClearCache = () => {
    // In a real app, this would clear the cache
    setSuccess("Cache cleared successfully")
    setTimeout(() => setSuccess(null), 3000)
  }

  const handleDeleteAccount = () => {
    // In a real app, this would show a confirmation dialog and then delete the account
    alert("This would delete your account in a real app")
  }

  return (
    <ProtectedRoute>
      <div className="container mx-auto py-8">
        <h1 className="text-3xl font-bold mb-8">Settings</h1>

        <Tabs defaultValue="account">
          <TabsList className="mb-8">
            <TabsTrigger value="account">Account Settings</TabsTrigger>
            <TabsTrigger value="notifications">Notifications</TabsTrigger>
            <TabsTrigger value="app">App Settings</TabsTrigger>
            <TabsTrigger value="privacy">Privacy & Security</TabsTrigger>
          </TabsList>

          <TabsContent value="account">
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Change Password</CardTitle>
                  <CardDescription>Update your password to keep your account secure</CardDescription>
                </CardHeader>
                <CardContent>
                  {error && (
                    <Alert variant="destructive" className="mb-4">
                      <AlertCircle className="h-4 w-4" />
                      <AlertDescription>{error}</AlertDescription>
                    </Alert>
                  )}

                  {success && (
                    <Alert className="mb-4 bg-success/20 text-success border-success">
                      <AlertDescription>{success}</AlertDescription>
                    </Alert>
                  )}

                  <form onSubmit={handleChangePassword} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="current-password">Current Password</Label>
                      <div className="relative">
                        <Input
                          id="current-password"
                          type={showCurrentPassword ? "text" : "password"}
                          value={currentPassword}
                          onChange={(e) => setCurrentPassword(e.target.value)}
                          required
                          placeholder="••••••••"
                        />
                        <button
                          type="button"
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                          onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                        >
                          {showCurrentPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </button>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="new-password">New Password</Label>
                      <div className="relative">
                        <Input
                          id="new-password"
                          type={showNewPassword ? "text" : "password"}
                          value={newPassword}
                          onChange={(e) => setNewPassword(e.target.value)}
                          required
                          placeholder="••••••••"
                        />
                        <button
                          type="button"
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                          onClick={() => setShowNewPassword(!showNewPassword)}
                        >
                          {showNewPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </button>
                      </div>

                      {/* Password strength indicator */}
                      {newPassword && (
                        <div className="mt-2">
                          <div className="flex justify-between items-center mb-1">
                            <span className="text-xs">Password strength:</span>
                            <span className="text-xs font-medium">
                              {passwordStrength <= 2 ? "Weak" : passwordStrength <= 4 ? "Medium" : "Strong"}
                            </span>
                          </div>
                          <div className="h-1 w-full bg-muted rounded-full overflow-hidden">
                            <div
                              className={`h-full ${
                                passwordStrength <= 2
                                  ? "bg-destructive"
                                  : passwordStrength <= 4
                                    ? "bg-warning"
                                    : "bg-success"
                              }`}
                              style={{ width: `${(passwordStrength / 5) * 100}%` }}
                            ></div>
                          </div>

                          <ul className="mt-2 space-y-1">
                            <li className="flex items-center text-xs">
                              {passwordHasMinLength ? (
                                <CheckCircle className="h-3 w-3 text-success mr-1" />
                              ) : (
                                <XCircle className="h-3 w-3 text-muted-foreground mr-1" />
                              )}
                              At least 8 characters
                            </li>
                            <li className="flex items-center text-xs">
                              {passwordHasUppercase ? (
                                <CheckCircle className="h-3 w-3 text-success mr-1" />
                              ) : (
                                <XCircle className="h-3 w-3 text-muted-foreground mr-1" />
                              )}
                              At least one uppercase letter
                            </li>
                            <li className="flex items-center text-xs">
                              {passwordHasLowercase ? (
                                <CheckCircle className="h-3 w-3 text-success mr-1" />
                              ) : (
                                <XCircle className="h-3 w-3 text-muted-foreground mr-1" />
                              )}
                              At least one lowercase letter
                            </li>
                            <li className="flex items-center text-xs">
                              {passwordHasNumber ? (
                                <CheckCircle className="h-3 w-3 text-success mr-1" />
                              ) : (
                                <XCircle className="h-3 w-3 text-muted-foreground mr-1" />
                              )}
                              At least one number
                            </li>
                            <li className="flex items-center text-xs">
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
                      <Label htmlFor="confirm-password">Confirm New Password</Label>
                      <div className="relative">
                        <Input
                          id="confirm-password"
                          type={showConfirmPassword ? "text" : "password"}
                          value={confirmPassword}
                          onChange={(e) => setConfirmPassword(e.target.value)}
                          required
                          placeholder="••••••••"
                        />
                        <button
                          type="button"
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                          onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        >
                          {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </button>
                      </div>

                      {confirmPassword && (
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

                    <Button type="submit" disabled={loading}>
                      {loading ? (
                        <span className="flex items-center">
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Updating Password...
                        </span>
                      ) : (
                        "Update Password"
                      )}
                    </Button>
                  </form>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Account Deletion</CardTitle>
                  <CardDescription>Permanently delete your account and all associated data</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground mb-4">
                    Once you delete your account, there is no going back. This action cannot be undone.
                  </p>
                  <Button variant="destructive" onClick={handleDeleteAccount} className="flex items-center">
                    <Trash2 className="mr-2 h-4 w-4" />
                    Delete Account
                  </Button>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="notifications">
            <Card>
              <CardHeader>
                <CardTitle>Notification Preferences</CardTitle>
                <CardDescription>Manage how and when you receive notifications</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="email-notifications">Email Notifications</Label>
                    <p className="text-sm text-muted-foreground">Receive notifications via email</p>
                  </div>
                  <Switch
                    id="email-notifications"
                    checked={emailNotifications}
                    onCheckedChange={setEmailNotifications}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="push-notifications">Push Notifications</Label>
                    <p className="text-sm text-muted-foreground">Receive push notifications on your device</p>
                  </div>
                  <Switch id="push-notifications" checked={pushNotifications} onCheckedChange={setPushNotifications} />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="message-notifications">Message Notifications</Label>
                    <p className="text-sm text-muted-foreground">Receive notifications for new messages</p>
                  </div>
                  <Switch
                    id="message-notifications"
                    checked={messageNotifications}
                    onCheckedChange={setMessageNotifications}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="property-updates">Property Updates</Label>
                    <p className="text-sm text-muted-foreground">Receive notifications for property updates</p>
                  </div>
                  <Switch id="property-updates" checked={propertyUpdates} onCheckedChange={setPropertyUpdates} />
                </div>

                <Button className="mt-4">Save Preferences</Button>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="app">
            <Card>
              <CardHeader>
                <CardTitle>App Settings</CardTitle>
                <CardDescription>Customize your app experience</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="language">Language</Label>
                  <Select value={language} onValueChange={setLanguage}>
                    <SelectTrigger id="language">
                      <SelectValue placeholder="Select language" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="en">English</SelectItem>
                      <SelectItem value="es">Spanish</SelectItem>
                      <SelectItem value="fr">French</SelectItem>
                      <SelectItem value="de">German</SelectItem>
                      <SelectItem value="zh">Chinese</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="theme">Theme</Label>
                  <Select value={theme || "system"} onValueChange={setTheme}>
                    <SelectTrigger id="theme">
                      <SelectValue placeholder="Select theme" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="light">Light</SelectItem>
                      <SelectItem value="dark">Dark</SelectItem>
                      <SelectItem value="system">System</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="cache">Cache Size</Label>
                    <span className="text-sm text-muted-foreground">{cacheSize}</span>
                  </div>
                  <Button variant="outline" onClick={handleClearCache} className="w-full">
                    Clear Cache
                  </Button>
                </div>

                <div className="space-y-2">
                  <Label>App Version</Label>
                  <p className="text-sm text-muted-foreground">1.0.0</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="privacy">
            <Card>
              <CardHeader>
                <CardTitle>Privacy & Security</CardTitle>
                <CardDescription>Manage your privacy and security settings</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="data-collection">Data Collection</Label>
                    <p className="text-sm text-muted-foreground">
                      Allow us to collect usage data to improve your experience
                    </p>
                  </div>
                  <Switch id="data-collection" defaultChecked={true} />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="marketing">Marketing Communications</Label>
                    <p className="text-sm text-muted-foreground">Receive marketing emails and communications</p>
                  </div>
                  <Switch id="marketing" defaultChecked={false} />
                </div>

                <div className="space-y-2">
                  <Label>Privacy Policy</Label>
                  <p className="text-sm text-muted-foreground">
                    Read our privacy policy to understand how we collect, use, and protect your data.
                  </p>
                  <Button variant="link" className="p-0">
                    View Privacy Policy
                  </Button>
                </div>

                <div className="space-y-2">
                  <Label>Terms of Service</Label>
                  <p className="text-sm text-muted-foreground">
                    Read our terms of service to understand the rules and guidelines for using our platform.
                  </p>
                  <Button variant="link" className="p-0">
                    View Terms of Service
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </ProtectedRoute>
  )
}
