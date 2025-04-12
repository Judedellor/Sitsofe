"use client"

import * as React from 'react';
import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import AsyncStorage from "@react-native-async-storage/async-storage"
import * as SecureStore from "expo-secure-store"
import { Platform } from "react-native"
import { authService } from './authService';

// Define user type with roles
export type UserRole = "admin" | "property_manager" | "tenant" | "maintenance_staff"

// Define user type
export interface User {
  id: string
  email: string
  name: string
  firstName?: string
  lastName?: string
  phone?: string
  avatar?: string
  role?: UserRole
  permissions?: string[]
  properties?: string[] // IDs of properties the user has access to
  verified?: boolean
  createdAt?: string
  lastLogin?: string
}

// Define context type
interface AuthContextType {
  user: User | null
  loading: boolean
  error: string | null
  isLoading: boolean
  login: (email: string, password: string) => Promise<void>
  logout: () => Promise<void>
  register: (firstName: string, email: string, password: string, role?: UserRole) => Promise<boolean>
  updateUser: (userData: Partial<User>) => Promise<void>
  isAuthenticated: boolean
  verifyEmail: (code: string) => Promise<boolean>
  sendVerificationEmail: (email: string) => Promise<boolean>
  resetPassword: (email: string, code: string, newPassword: string) => Promise<boolean>
  requestPasswordReset: (email: string) => Promise<boolean>
  hasPermission: (permission: string) => boolean
  setUserRole: (userId: string, role: UserRole) => Promise<boolean>
  updateProfile: (userData: Partial<User>) => Promise<void>
}

// Create context
const AuthContext = createContext<AuthContextType | undefined>(undefined)

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isAuthenticated, setIsAuthenticated] = useState(false)

  useEffect(() => {
    // Check if user is already logged in
    const checkAuth = async () => {
      try {
        setLoading(true);
        const storedUser = await AsyncStorage.getItem('user');
        if (storedUser) {
          const parsedUser: User = JSON.parse(storedUser);
          setUser(parsedUser);
          setIsAuthenticated(true);
        }
      } catch (err) {
        setError('Failed to check authentication status');
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  const login = async (email: string, password: string) => {
    try {
      setLoading(true);
      setError(null);
      const userData = await authService.login({ email, password });
      if (userData) {
        await AsyncStorage.setItem('user', JSON.stringify(userData));
        setUser(userData);
        setIsAuthenticated(true);
      } else {
        setError('Invalid email or password');
      }
    } catch (err) {
      setError('Failed to login');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      setLoading(true);
      setError(null);
      await authService.logout();
      await AsyncStorage.removeItem('user');
      setUser(null);
      setIsAuthenticated(false);
    } catch (err) {
      setError('Failed to logout');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Register function
  const register = async (firstName: string, email: string, password: string, role?: UserRole): Promise<boolean> => {
    try {
      setLoading(true);
      setError(null);
      const success = await authService.signup({ email, password, name: firstName, role });
      return success;
    } catch (error) {
      setError('Error registering');
      return false;
    } finally {
      setLoading(false);
    }
  };

  // Update user function
  const updateUser = async (userData: Partial<User>) => {
    try {
      setLoading(true);
      setError(null);
      if (!user) {
        throw new Error("No user logged in")
      }

      const updatedUser = { ...user, ...userData }
      await AsyncStorage.setItem("@user", JSON.stringify(updatedUser))
      setUser(updatedUser)
    } catch (err) {
      setError('Failed to update user');
      throw err;
    } finally {
      setLoading(false);
    }
  }

  // Verify email function
  const verifyEmail = async (code: string): Promise<boolean> => {
    try {
      setLoading(true);
      setError(null);
      return await authService.verifyEmail(code);
    } catch (error) {
      setError('Error verifying email');
      return false;
    } finally {
      setLoading(false);
    }
  };

  // Send verification email function
  const sendVerificationEmail = async (email: string): Promise<boolean> => {
    try {
      setLoading(true);
      setError(null);
      return await authService.sendVerificationEmail(email);
    } catch (error) {
      setError('Error sending verification email');
      return false;
    } finally {
      setLoading(false);
    }
  };

  // Reset password function
  const resetPassword = async (email: string, code: string, newPassword: string): Promise<boolean> => {
    try {
      setLoading(true);
      setError(null);
      return await authService.resetPassword(email, code, newPassword);
    } catch (error) {
      setError('Error resetting password');
      return false;
    } finally {
      setLoading(false);
    }
  };

  // Request password reset function
  const requestPasswordReset = async (email: string): Promise<boolean> => {
    try {
      setLoading(true);
      setError(null);
      return await authService.requestPasswordReset(email);
    } catch (error) {
      setError('Error requesting password reset');
      return false;
    } finally {
      setLoading(false);
    }
  };

  // Check if user has a specific permission
  const hasPermission = (permission: string): boolean => {
    return user?.permissions?.includes(permission) ?? false;
  };

  // Set user role (admin only)
  const setUserRole = async (userId: string, role: UserRole): Promise<boolean> => {
    try {
      setLoading(true);
      setError(null);
      return await authService.setUserRole(userId, role);
    } catch (error) {
      setError('Error setting user role');
      return false;
    } finally {
      setLoading(false);
    }
  };

  // Update profile function
  const updateProfile = async (userData: Partial<User>) => {
    try {
      setLoading(true);
      setError(null);
      if (!user) {
        throw new Error("No user logged in")
      }

      const updatedUser = { ...user, ...userData }
      await authService.updateProfile(updatedUser)
      await AsyncStorage.setItem("@user", JSON.stringify(updatedUser))
      setUser(updatedUser)
    } catch (err) {
      setError('Failed to update profile');
      throw err;
    } finally {
      setLoading(false);
    }
  }

  const value: AuthContextType = {
    user,
    loading,
    error,
    isLoading: loading,
    isAuthenticated,
    login,
    logout,
    register,
    verifyEmail,
    sendVerificationEmail,
    resetPassword,
    requestPasswordReset,
    hasPermission,
    setUserRole,
    updateUser,
    updateProfile,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}

// Custom hook to use the auth context
export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}

