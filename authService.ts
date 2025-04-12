import { supabase } from './supabase';

interface LoginCredentials {
  email: string;
  password: string;
}

interface SignUpData {
  email: string;
  password: string;
  name: string;
  role: 'landlord' | 'tenant' | 'admin';
}

export const authService = {
  login: async (credentials: LoginCredentials) => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: credentials.email,
        password: credentials.password,
      });

      if (error) throw error;
      if (!data.user) throw new Error('No user data returned');

      // Get additional user data from profiles table
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', data.user.id)
        .single();

      if (profileError) throw profileError;

      return {
        user: {
          id: data.user.id,
          email: data.user.email,
          name: profile.name,
          role: profile.role,
        },
        token: data.session?.access_token,
      };
    } catch (error) {
      throw error;
    }
  },

  signup: async (data: SignUpData) => {
    try {
      // Create auth user
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: data.email,
        password: data.password,
      });

      if (authError) throw authError;
      if (!authData.user) throw new Error('No user data returned');

      // Create profile
      const { error: profileError } = await supabase
        .from('profiles')
        .insert([
          {
            id: authData.user.id,
            name: data.name,
            role: data.role,
          },
        ]);

      if (profileError) throw profileError;

      return {
        user: {
          id: authData.user.id,
          email: authData.user.email,
          name: data.name,
          role: data.role,
        },
        token: authData.session?.access_token,
      };
    } catch (error) {
      throw error;
    }
  },

  logout: async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
    } catch (error) {
      throw error;
    }
  },

  getCurrentUser: async () => {
    try {
      const { data: { user }, error } = await supabase.auth.getUser();
      if (error) throw error;
      if (!user) return null;

      // Get profile data
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();

      if (profileError) throw profileError;

      return {
        id: user.id,
        email: user.email,
        name: profile.name,
        role: profile.role,
      };
    } catch (error) {
      throw error;
    }
  },

  // Additional Supabase-specific methods
  resetPassword: async (email: string) => {
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email);
      if (error) throw error;
    } catch (error) {
      throw error;
    }
  },

  updatePassword: async (newPassword: string) => {
    try {
      const { error } = await supabase.auth.updateUser({
        password: newPassword,
      });
      if (error) throw error;
    } catch (error) {
      throw error;
    }
  },

  verifyEmail: async (code: string) => {
    try {
      const { error } = await supabase.auth.verifyOTP({
        email: code,
        type: 'signup',
      });
      if (error) throw error;
      return true;
    } catch (error) {
      throw error;
    }
  },

  sendVerificationEmail: async (email: string) => {
    try {
      const { error } = await supabase.auth.api.sendMagicLinkEmail(email);
      if (error) throw error;
      return true;
    } catch (error) {
      throw error;
    }
  },

  requestPasswordReset: async (email: string) => {
    try {
      const { error } = await supabase.auth.api.resetPasswordForEmail(email);
      if (error) throw error;
      return true;
    } catch (error) {
      throw error;
    }
  },

  setUserRole: async (userId: string, role: 'landlord' | 'tenant' | 'admin') => {
    try {
      const { error } = await supabase
        .from('profiles')
        .update({ role })
        .eq('id', userId);
      if (error) throw error;
      return true;
    } catch (error) {
      throw error;
    }
  },
};
