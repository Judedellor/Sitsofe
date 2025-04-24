import { createClient as supabaseCreateClient } from "@supabase/supabase-js"

// Get Supabase URL and anon key from environment variables
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ""
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ""

// Check if the required environment variables are available
const hasValidConfig =
  supabaseUrl && supabaseAnonKey && supabaseUrl !== "YOUR_SUPABASE_URL" && supabaseAnonKey !== "YOUR_SUPABASE_ANON_KEY"

// Create a mock Supabase client for development/preview environments
const createMockClient = () => {
  return {
    auth: {
      getSession: () => Promise.resolve({ data: { session: null }, error: null }),
      onAuthStateChange: () => ({
        data: {
          subscription: {
            unsubscribe: () => {},
          },
        },
      }),
      signInWithPassword: () => Promise.resolve({ data: { user: null }, error: new Error("Mock auth client") }),
      signUp: () => Promise.resolve({ data: { user: null }, error: new Error("Mock auth client") }),
      signOut: () => Promise.resolve({ error: null }),
      resetPasswordForEmail: () => Promise.resolve({ error: null }),
      updateUser: () => Promise.resolve({ error: null }),
      getUser: () => Promise.resolve({ data: { user: null }, error: null }),
    },
    from: () => ({
      select: () => ({
        eq: () => ({
          single: () => Promise.resolve({ data: null, error: null }),
          order: () => Promise.resolve({ data: null, error: null }),
        }),
        single: () => Promise.resolve({ data: null, error: null }),
        order: () => Promise.resolve({ data: null, error: null }),
      }),
      insert: () => ({
        select: () => ({
          single: () => Promise.resolve({ data: null, error: null }),
        }),
      }),
      update: () => ({
        eq: () => Promise.resolve({ data: null, error: null }),
      }),
    }),
    channel: () => ({
      on: () => ({
        subscribe: () => ({
          unsubscribe: () => {},
        }),
      }),
    }),
    storage: {
      from: () => ({
        upload: () => Promise.resolve({ data: null, error: null }),
        getPublicUrl: () => Promise.resolve({ data: { publicUrl: "" }, error: null }),
      }),
    },
  }
}

// Create the Supabase client with error handling
let supabaseClient
try {
  if (hasValidConfig) {
    supabaseClient = supabaseCreateClient(supabaseUrl, supabaseAnonKey)
  } else {
    // Create a mock client that will gracefully fail
    supabaseClient = createMockClient()
    console.warn("Supabase is not properly configured. Using mock client.")
  }
} catch (error) {
  console.error("Failed to initialize Supabase client:", error)
  // Fallback to mock client
  supabaseClient = createMockClient()
}

export const supabase = supabaseClient

// Export a helper function to check if Supabase is properly configured
export function isSupabaseConfigured(): boolean {
  // Safe check for server-side rendering
  if (typeof window === "undefined") {
    return !!process.env.NEXT_PUBLIC_SUPABASE_URL && !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  }

  // Client-side check
  return !!process.env.NEXT_PUBLIC_SUPABASE_URL && !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
}

// Log configuration status for debugging
if (typeof window !== "undefined" && process.env.NODE_ENV === "development") {
  console.log(`Supabase configuration status: ${isSupabaseConfigured() ? "Valid" : "Invalid"}`)
  if (!isSupabaseConfigured()) {
    console.warn(
      "Supabase is not properly configured. Make sure NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY are set correctly.",
    )
  }
}

export const createClient = supabaseCreateClient
