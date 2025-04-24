"use client"

import { useState, useEffect } from "react"
import { supabase } from "../lib/supabase/client"
import type { User } from "@supabase/supabase-js"

// Simplified Profile type
interface Profile {
  id: string
  username: string
  full_name: string
  avatar_url: string
  role: "owner" | "renter" | "admin"
}

export function useAuth() {
  const [user, setUser] = useState<User | null>(null)
  const [profile, setProfile] = useState<Profile | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null)
      if (session?.user) {
        getProfile(session.user.id)
      } else {
        setLoading(false)
      }
    })

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null)
      if (session?.user) {
        getProfile(session.user.id)
      } else {
        setProfile(null)
        setLoading(false)
      }
    })

    return () => {
      subscription.unsubscribe()
    }
  }, [])

  async function getProfile(userId: string) {
    try {
      setLoading(true)

      // Remove mock data and uncomment Supabase code
      const { data, error } = await supabase.from("profiles").select("*").eq("id", userId).single()

      if (error) throw error

      // If profile doesn't exist yet, create one with basic info
      if (!data) {
        const user = await supabase.auth.getUser()
        const newProfile = {
          id: userId,
          username: user.data.user?.email?.split("@")[0] || `user_${Date.now()}`,
          full_name: user.data.user?.user_metadata?.full_name || "",
          avatar_url: `https://api.dicebear.com/7.x/avatars/svg?seed=${userId}`,
          role: "renter",
        }

        const { data: insertedProfile, error: insertError } = await supabase
          .from("profiles")
          .insert(newProfile)
          .select()
          .single()

        if (insertError) throw insertError
        setProfile(insertedProfile)
      } else {
        setProfile(data)
      }
    } catch (error) {
      console.error("Error loading profile:", error)
      // Create a minimal profile object to prevent UI errors
      setProfile({
        id: userId,
        username: "user",
        full_name: "User",
        avatar_url: `https://api.dicebear.com/7.x/avatars/svg?seed=${userId}`,
        role: "renter",
      })
    } finally {
      setLoading(false)
    }
  }

  async function signIn(email: string, password: string) {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })
    if (error) throw error
  }

  async function signUp(email: string, password: string, userData: Partial<Profile>) {
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: userData,
      },
    })
    if (error) throw error
  }

  async function signOut() {
    const { error } = await supabase.auth.signOut()
    if (error) throw error
  }

  return {
    user,
    profile,
    loading,
    signIn,
    signUp,
    signOut,
  }
}
