import { createClient } from '@supabase/supabase-js';
import AsyncStorage from '@react-native-async-storage/async-storage';

// TODO: Replace these with your actual Supabase project credentials
// You can find these in your Supabase project settings under Project Settings > API
const supabaseUrl = 'https://mrkxyzhfuidbamggraxz.supabase.co'; // e.g., 'https://your-project-id.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1ya3h5emhmdWlkYmFtZ2dyYXh6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDM2ODYwODksImV4cCI6MjA1OTI2MjA4OX0.987IIgtR9diKS7-6AeGaG29yu_Hxee4MLNJqOrav6U0'; // e.g., 'your-anon-key'

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: AsyncStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
}); 