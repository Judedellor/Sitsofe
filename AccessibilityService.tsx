"use client"

import { useEffect, useState } from "react"
import { AccessibilityInfo, Platform, StyleSheet, type TextStyle } from "react-native"
import AsyncStorage from "@react-native-async-storage/async-storage"

// Accessibility preferences type
export type AccessibilityPreferences = {
  reduceMotion: boolean
  increaseContrast: boolean
  boldText: boolean
  largerText: boolean
  screenReader: boolean
  fontScale: number
}

// Font size scales
export enum FontSize {
  SMALL = 0.85,
  NORMAL = 1,
  LARGE = 1.15,
  EXTRA_LARGE = 1.3,
  HUGE = 1.5,
}

// Main accessibility service
export class AccessibilityService {
  private static instance: AccessibilityService
  private preferences: AccessibilityPreferences = {
    reduceMotion: false,
    increaseContrast: false,
    boldText: false,
    largerText: false,
    screenReader: false,
    fontScale: FontSize.NORMAL,
  }
  private listeners: Array<(prefs: AccessibilityPreferences) => void> = []
  private isInitialized = false

  // Singleton pattern
  public static getInstance(): AccessibilityService {
    if (!AccessibilityService.instance) {
      AccessibilityService.instance = new AccessibilityService()
    }
    return AccessibilityService.instance
  }

  constructor() {
    this.initialize()
  }

  // Initialize the accessibility service
  private async initialize() {
    if (this.isInitialized) return

    try {
      // Load stored preferences
      const prefsData = await AsyncStorage.getItem("@accessibilityPrefs")
      if (prefsData) {
        this.preferences = { ...this.preferences, ...JSON.parse(prefsData) }
      }

      // Get system accessibility settings
      this.updateSystemAccessibilitySettings()

      // Set up listeners for system accessibility changes
      this.setupSystemListeners()

      this.isInitialized = true

      // Notify listeners of initial preferences
      this.notifyListeners()
    } catch (error) {
      console.error("Error initializing accessibility service:", error)
    }
  }

  // Update preferences from system settings
  private async updateSystemAccessibilitySettings() {
    try {
      // Check if screen reader is enabled
      const screenReaderEnabled = await AccessibilityInfo.isScreenReaderEnabled()

      // Check if reduce motion is enabled
      const reduceMotionEnabled = await AccessibilityInfo.isReduceMotionEnabled()

      // Get font scale - using a fallback since the API doesn't provide this directly
      const fontScale = 1.0 // Default to normal scale

      // Update preferences
      const updatedPrefs = {
        ...this.preferences,
        screenReader: screenReaderEnabled,
        reduceMotion: reduceMotionEnabled,
      }

      // Only update font scale if it's a valid number
      if (fontScale && !isNaN(fontScale) && fontScale > 0) {
        updatedPrefs.fontScale = fontScale
        updatedPrefs.largerText = fontScale > FontSize.NORMAL
      }

      // Check if bold text is enabled (iOS only)
      if (Platform.OS === "ios") {
        const boldTextEnabled = await AccessibilityInfo.isBoldTextEnabled()
        updatedPrefs.boldText = boldTextEnabled
      }

      this.preferences = updatedPrefs

      // Save preferences
      await this.savePreferences()

      // Notify listeners
      this.notifyListeners()
    } catch (error) {
      console.error("Error updating system accessibility settings:", error)
    }
  }

  // Set up listeners for system accessibility changes
  private setupSystemListeners() {
    // Screen reader
    AccessibilityInfo.addEventListener("screenReaderChanged", (isEnabled) => {
      this.preferences.screenReader = isEnabled
      this.savePreferences()
      this.notifyListeners()
    })

    // Reduce motion
    AccessibilityInfo.addEventListener("reduceMotionChanged", (isEnabled) => {
      this.preferences.reduceMotion = isEnabled
      this.savePreferences()
      this.notifyListeners()
    })

    // Font scale
    if (AccessibilityInfo.addEventListener) {
      AccessibilityInfo.addEventListener("boldTextChanged", (isEnabled) => {
        this.preferences.boldText = isEnabled
        this.savePreferences()
        this.notifyListeners()
      })
    }
  }

  // Get current accessibility preferences
  public getPreferences(): AccessibilityPreferences {
    return { ...this.preferences }
  }

  // Update accessibility preferences
  public async updatePreferences(prefs: Partial<AccessibilityPreferences>): Promise<void> {
    await this.ensureInitialized()

    this.preferences = {
      ...this.preferences,
      ...prefs,
    }

    await this.savePreferences()
    this.notifyListeners()
  }

  // Save preferences to storage
  private async savePreferences(): Promise<void> {
    try {
      await AsyncStorage.setItem("@accessibilityPrefs", JSON.stringify(this.preferences))
    } catch (error) {
      console.error("Error saving accessibility preferences:", error)
    }
  }

  // Add a listener for preference changes
  public addListener(listener: (prefs: AccessibilityPreferences) => void): () => void {
    this.listeners.push(listener)
    // Immediately notify with current preferences
    listener(this.getPreferences())

    return () => {
      this.listeners = this.listeners.filter((l) => l !== listener)
    }
  }

  // Notify all listeners of preference changes
  private notifyListeners() {
    const prefs = this.getPreferences()
    this.listeners.forEach((listener) => listener(prefs))
  }

  // Ensure the service is initialized
  private async ensureInitialized(): Promise<void> {
    if (!this.isInitialized) {
      await this.initialize()
    }
  }

  // Get font styles based on accessibility preferences
  public getFontStyle(baseStyle?: TextStyle): TextStyle {
    const style: TextStyle = { ...baseStyle }

    // Apply font scale
    if (style.fontSize && this.preferences.fontScale !== FontSize.NORMAL) {
      style.fontSize = style.fontSize * this.preferences.fontScale
    }

    // Apply bold text
    if (this.preferences.boldText) {
      style.fontWeight = "bold"
    }

    return style
  }

  // Get high contrast colors if needed
  public getAccessibleColors(regularColors: {
    text: string
    background: string
    primary: string
    secondary: string
    accent: string
  }) {
    if (!this.preferences.increaseContrast) {
      return regularColors
    }

    // Return high contrast versions of the colors
    return {
      text: "#000000", // Black text
      background: "#FFFFFF", // White background
      primary: "#0000CC", // Dark blue
      secondary: "#006600", // Dark green
      accent: "#CC0000", // Dark red
    }
  }

  // Check if an element should animate based on reduce motion preference
  public shouldAnimate(): boolean {
    return !this.preferences.reduceMotion
  }

  // Get accessibility props for a component
  public getAccessibilityProps(label: string, hint?: string, role?: string): Record<string, any> {
    const props: Record<string, any> = {
      accessible: true,
      accessibilityLabel: label,
    }

    if (hint) {
      props.accessibilityHint = hint
    }

    if (role) {
      props.accessibilityRole = role
    }

    return props
  }
}

// Hook for using the accessibility service
export function useAccessibility() {
  const [preferences, setPreferences] = useState<AccessibilityPreferences>({
    reduceMotion: false,
    increaseContrast: false,
    boldText: false,
    largerText: false,
    screenReader: false,
    fontScale: FontSize.NORMAL,
  })

  useEffect(() => {
    const accessibilityService = AccessibilityService.getInstance()

    // Set initial preferences
    setPreferences(accessibilityService.getPreferences())

    // Set up listener
    const unsubscribe = accessibilityService.addListener((prefs) => {
      setPreferences(prefs)
    })

    return () => {
      unsubscribe()
    }
  }, [])

  const accessibilityService = AccessibilityService.getInstance()

  return {
    preferences,
    updatePreferences: (prefs: Partial<AccessibilityPreferences>) => accessibilityService.updatePreferences(prefs),
    getFontStyle: (baseStyle?: TextStyle) => accessibilityService.getFontStyle(baseStyle),
    getAccessibleColors: (regularColors: {
      text: string
      background: string
      primary: string
      secondary: string
      accent: string
    }) => accessibilityService.getAccessibleColors(regularColors),
    shouldAnimate: () => accessibilityService.shouldAnimate(),
    getAccessibilityProps: (label: string, hint?: string, role?: string) =>
      accessibilityService.getAccessibilityProps(label, hint, role),
    isScreenReaderEnabled: () => preferences.screenReader,
  }
}

// Utility to create accessible styles
export function createAccessibleStyles(baseStyles: Record<string, any>) {
  const accessibilityService = AccessibilityService.getInstance()
  const preferences = accessibilityService.getPreferences()

  const accessibleStyles: Record<string, any> = {}

  // Process each style
  Object.entries(baseStyles).forEach(([key, style]) => {
    if (typeof style === "object") {
      const newStyle = { ...style }

      // Apply font scaling to fontSize properties
      if ("fontSize" in newStyle && preferences.fontScale !== FontSize.NORMAL) {
        newStyle.fontSize = newStyle.fontSize * preferences.fontScale
      }

      // Apply bold text
      if (preferences.boldText && "fontWeight" in newStyle) {
        newStyle.fontWeight = "bold"
      }

      // Apply high contrast colors
      if (preferences.increaseContrast) {
        if ("color" in newStyle && typeof newStyle.color === "string") {
          // Make text either black or white for maximum contrast
          const isLight = isLightColor(newStyle.color)
          newStyle.color = isLight ? "#000000" : "#FFFFFF"
        }

        if ("backgroundColor" in newStyle && typeof newStyle.backgroundColor === "string") {
          // Make backgrounds either white or black for maximum contrast
          const isLight = isLightColor(newStyle.backgroundColor)
          newStyle.backgroundColor = isLight ? "#FFFFFF" : "#000000"
        }
      }

      accessibleStyles[key] = newStyle
    } else {
      accessibleStyles[key] = style
    }
  })

  return StyleSheet.create(accessibleStyles)
}

// Helper to determine if a color is light or dark
function isLightColor(color: string): boolean {
  // Simple implementation - in a real app, you would use a proper color library
  if (color.startsWith("#")) {
    const hex = color.replace("#", "")
    const r = Number.parseInt(hex.substr(0, 2), 16)
    const g = Number.parseInt(hex.substr(2, 2), 16)
    const b = Number.parseInt(hex.substr(4, 2), 16)

    // Calculate perceived brightness
    const brightness = (r * 299 + g * 587 + b * 114) / 1000

    return brightness > 128
  }

  return true // Default to assuming it's light
}

