"use client"

import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from "react"
import { useRouter, usePathname } from "next/navigation"
import { supabase, isSupabaseConfigured } from "@/lib/supabase/client"
import type { User, Session } from "@supabase/supabase-js"

// Profile type with role
export interface Profile {
  id: string
  username: string
  full_name: string
  avatar_url: string
  role: "owner" | "renter" | "admin"
  email: string
  phone?: string
}

type AuthContextType = {
  user: User | null
  profile: Profile | null
  session: Session | null
  loading: boolean
  signIn: (email: string, password: string) => Promise<void>
  signUp: (email: string, password: string, userData: Partial<Profile>) => Promise<void>
  signOut: () => Promise<void>
  requestPasswordReset: (email: string) => Promise<void>
  resetPassword: (password: string) => Promise<void>
  updateProfile: (data: Partial<Profile>) => Promise<void>
  isDevelopmentMode: boolean
  useDevAuth: (role?: "owner" | "renter" | "admin") => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

// Check if we're in development mode
const isDevelopment = process.env.NODE_ENV === "development"

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [profile, setProfile] = useState<Profile | null>(null)
  const [session, setSession] = useState<Session | null>(null)
  const [loading, setLoading] = useState(true)
  const [isDevelopmentMode, setIsDevelopmentMode] = useState(false)
  const router = useRouter()
  const pathname = usePathname()

  // Initialize auth state
  useEffect(() => {
    const initializeAuth = async () => {
      setLoading(true)

      // Check if Supabase is properly configured
      if (!isSupabaseConfigured()) {
        console.warn("Supabase is not configured. Authentication will not work.")
        setLoading(false)
        return
      }

      try {
        // Get initial session
        const {
          data: { session },
          error: sessionError,
        } = await supabase.auth.getSession()

        if (sessionError) {
          console.error("Error getting session:", sessionError)
          setLoading(false)
          return
        }

        setSession(session)
        setUser(session?.user ?? null)

        if (session?.user) {
          await getProfile(session.user.id)
        } else {
          setLoading(false)
        }

        // Listen for auth changes
        const {
          data: { subscription },
        } = supabase.auth.onAuthStateChange(async (_event, session) => {
          setSession(session)
          setUser(session?.user ?? null)

          if (session?.user) {
            await getProfile(session.user.id)
          } else {
            setProfile(null)
            setLoading(false)
          }
        })

        return () => {
          subscription.unsubscribe()
        }
      } catch (error) {
        console.error("Error initializing auth:", error)
        setLoading(false)
      }
    }

    initializeAuth()
  }, [])

  // Role-based route protection
  useEffect(() => {
    if (loading) return

    // Handle authentication redirects
    const handleAuthRedirects = async () => {
      const isAuthRoute = pathname === "/login" || pathname === "/signup" || pathname === "/reset-password"

      if (!user && !isAuthRoute && pathname !== "/") {
        // Redirect unauthenticated users to login, except from homepage
        router.push("/login")
      } else if (user && isAuthRoute) {
        // Redirect authenticated users to dashboard
        router.push("/dashboard")
      } else if (user && profile && pathname.startsWith("/dashboard")) {
        // For dashboard routes, check if the user has access to the role-specific dashboard
        const urlRole = pathname.split("/")[2] // e.g., /dashboard/admin -> admin
        if (urlRole && urlRole !== profile.role && urlRole !== "default") {
          router.push(`/dashboard/${profile.role}`)
        }
      }
    }

    handleAuthRedirects()
  }, [loading, user, profile, pathname, router])

  async function getProfile(userId: string) {
    try {
      setLoading(true)

      // If we're in development mode with a mock user, create a mock profile
      if (isDevelopmentMode) {
        const mockProfile: Profile = {
          id: userId,
          username: "devuser",
          full_name: "Development User",
          email: "dev@example.com",
          avatar_url: `https://api.dicebear.com/7.x/avatars/svg?seed=${userId}`,
          role: "renter",
        }
        setProfile(mockProfile)
        setLoading(false)
        return
      }

      // Check if Supabase is configured before trying to fetch profile
      if (!isSupabaseConfigured()) {
        throw new Error("Supabase is not configured")
      }

      const { data, error } = await supabase.from("profiles").select("*").eq("id", userId).single()

      if (error) throw error

      // If profile doesn't exist yet, create one with basic info
      if (!data) {
        const userData = await supabase.auth.getUser()
        const newProfile = {
          id: userId,
          username: userData.data.user?.email?.split("@")[0] || `user_${Date.now()}`,
          full_name: userData.data.user?.user_metadata?.full_name || "",
          email: userData.data.user?.email || "",
          avatar_url: `https://api.dicebear.com/7.x/avatars/svg?seed=${userId}`,
          role: "renter", // Default role
        }

        const { data: insertedProfile, error: insertError } = await supabase
          .from("profiles")
          .insert(newProfile)
          .select()
          .single()

        if (insertError) throw insertError

        setProfile({
          ...insertedProfile,
          email: userData.data.user?.email || "",
        })
      } else {
        const userData = await supabase.auth.getUser()
        setProfile({
          ...data,
          email: userData.data.user?.email || "",
        })
      }
    } catch (error) {
      console.error("Error loading profile:", error)

      // Create a minimal profile object to prevent UI errors
      if (user) {
        setProfile({
          id: userId,
          username: "user",
          full_name: "User",
          email: user.email || "",
          avatar_url: `https://api.dicebear.com/7.x/avatars/svg?seed=${userId}`,
          role: "renter",
        })
      }
    } finally {
      setLoading(false)
    }
  }

  async function signIn(email: string, password: string) {
    // If in development mode, create a mock user and session
    if (isDevelopmentMode) {
      const mockUser = {
        id: "dev-user-id",
        email: email,
        app_metadata: {},
        user_metadata: {},
        aud: "authenticated",
        created_at: new Date().toISOString(),
      } as User

      setUser(mockUser)
      return
    }

    // Check if Supabase is configured
    if (!isSupabaseConfigured()) {
      console.warn("Authentication is not configured. Using development mode instead.")
      // Automatically switch to development mode if Supabase is not configured
      useDevAuth("renter")
      return
    }

    try {
      // Validate inputs
      if (!email || !password) {
        throw new Error("Email and password are required")
      }

      // Try to sign in
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (error) {
        console.error("Sign in error:", error)
        throw error
      }

      // Verify we got a user back
      if (!data.user) {
        throw new Error("Authentication failed. No user returned.")
      }
    } catch (error: any) {
      console.error("Sign in error:", error)

      // If we're in development or preview environment, switch to dev mode
      if (process.env.NODE_ENV !== "production" || window.location.hostname.includes("vercel.app")) {
        console.warn("Authentication failed. Switching to development mode.")
        useDevAuth("renter")
        return
      }

      throw error
    }
  }

  async function signUp(email: string, password: string, userData: Partial<Profile>) {
    // Check if Supabase is configured
    if (!isSupabaseConfigured()) {
      console.warn("Authentication is not configured. Using development mode instead.")
      // Automatically switch to development mode if Supabase is not configured
      useDevAuth("renter")
      return
    }

    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: userData,
        },
      })

      if (error) throw error

      // Verify we got a user back
      if (!data.user) {
        throw new Error("Sign up failed. No user created.")
      }
    } catch (error) {
      console.error("Sign up error:", error)

      // If we're in development or preview environment, switch to dev mode
      if (process.env.NODE_ENV !== "production" || window.location.hostname.includes("vercel.app")) {
        console.warn("Authentication failed. Switching to development mode.")
        useDevAuth("renter")
        return
      }

      throw error
    }
  }

  async function signOut() {
    // If in development mode, just clear the user state
    if (isDevelopmentMode) {
      setUser(null)
      setProfile(null)
      setIsDevelopmentMode(false)
      router.push("/")
      return
    }

    try {
      // Check if Supabase is configured
      if (!isSupabaseConfigured()) {
        // Just clear the state if Supabase is not configured
        setUser(null)
        setProfile(null)
        router.push("/")
        return
      }

      const { error } = await supabase.auth.signOut()
      if (error) throw error
      router.push("/")
    } catch (error) {
      console.error("Sign out error:", error)
      // Just clear the state if there's an error
      setUser(null)
      setProfile(null)
      router.push("/")
    }
  }

  async function requestPasswordReset(email: string) {
    // Check if Supabase is configured
    if (!isSupabaseConfigured()) {
      throw new Error("Authentication is not configured. Please check your environment variables.")
    }

    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`,
      })

      if (error) throw error
    } catch (error) {
      console.error("Password reset request error:", error)
      throw error
    }
  }

  async function resetPassword(password: string) {
    // Check if Supabase is configured
    if (!isSupabaseConfigured()) {
      throw new Error("Authentication is not configured. Please check your environment variables.")
    }

    try {
      const { error } = await supabase.auth.updateUser({
        password,
      })

      if (error) throw error

      // After password reset, redirect to login
      router.push("/login")
    } catch (error) {
      console.error("Password reset error:", error)
      throw error
    }
  }

  async function updateProfile(data: Partial<Profile>) {
    if (!user) throw new Error("User not authenticated")

    // If in development mode, just update the local profile state
    if (isDevelopmentMode) {
      setProfile((prev) => (prev ? { ...prev, ...data } : null))
      return
    }

    // Check if Supabase is configured
    if (!isSupabaseConfigured()) {
      throw new Error("Supabase is not configured. Cannot update profile.")
    }

    try {
      const { error } = await supabase
        .from("profiles")
        .update({
          ...data,
        })
        .eq("id", user.id)

      if (error) throw error

      // Refresh profile data
      await getProfile(user.id)
    } catch (error) {
      console.error("Update profile error:", error)
      throw error
    }
  }

  // Function to enable development mode with mock authentication
  const useDevAuth = useCallback((role: "owner" | "renter" | "admin" = "renter") => {
    console.log("Using development authentication with role:", role)

    // Create a mock user
    const mockUser = {
      id: `dev-user-id-${Date.now()}`,
      email: "dev@example.com",
      app_metadata: {},
      user_metadata: {},
      aud: "authenticated",
      created_at: new Date().toISOString(),
    } as User

    // Create a mock profile with the specified role
    const mockProfile: Profile = {
      id: mockUser.id,
      username: `dev_${role}`,
      full_name: `Development ${role.charAt(0).toUpperCase() + role.slice(1)}`,
      email: mockUser.email || "dev@example.com",
      avatar_url: `https://api.dicebear.com/7.x/avatars/svg?seed=${mockUser.id}`,
      role: role,
    }

    // Update state in a single batch to prevent cascading updates
    setIsDevelopmentMode(true)
    setUser(mockUser)
    setProfile(mockProfile)
    setLoading(false)

    console.log("Development authentication complete. User and profile set.")
  }, [])

  const value = {
    user,
    profile,
    session,
    loading,
    signIn,
    signUp,
    signOut,
    requestPasswordReset,
    resetPassword,
    updateProfile,
    isDevelopmentMode,
    useDevAuth,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
