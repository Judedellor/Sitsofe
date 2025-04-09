import { captureException } from "@sentry/react-native"
import AsyncStorage from "@react-native-async-storage/async-storage"

// Error types
export type AppError = {
  id: string
  message: string
  code?: string
  stack?: string
  componentStack?: string
  timestamp: number
  metadata?: Record<string, any>
  handled: boolean
}

// Error severity levels
export enum ErrorSeverity {
  LOW = "low",
  MEDIUM = "medium",
  HIGH = "high",
  CRITICAL = "critical",
}

// Main error handling service
export class ErrorHandlingService {
  private static instance: ErrorHandlingService
  private errors: AppError[] = []
  private maxStoredErrors = 100
  private isInitialized = false

  // Singleton pattern
  public static getInstance(): ErrorHandlingService {
    if (!ErrorHandlingService.instance) {
      ErrorHandlingService.instance = new ErrorHandlingService()
    }
    return ErrorHandlingService.instance
  }

  constructor() {
    this.initialize()
  }

  // Initialize the error handling service
  private async initialize() {
    if (this.isInitialized) return

    try {
      // Load stored errors
      const errorsData = await AsyncStorage.getItem("@storedErrors")
      if (errorsData) {
        this.errors = JSON.parse(errorsData)
      }

      this.isInitialized = true
    } catch (error) {
      console.error("Error initializing error handling service:", error)
    }
  }

  // Log an error
  public async logError(
    error: Error | string,
    metadata?: Record<string, any>,
    severity: ErrorSeverity = ErrorSeverity.MEDIUM,
    handled = true,
  ): Promise<string> {
    await this.ensureInitialized()

    const errorMessage = typeof error === "string" ? error : error.message
    const errorStack = typeof error === "string" ? undefined : error.stack

    const appError: AppError = {
      id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      message: errorMessage,
      stack: errorStack,
      timestamp: Date.now(),
      metadata,
      handled,
    }

    // Add to local errors
    this.errors.unshift(appError)

    // Trim errors list if it gets too long
    if (this.errors.length > this.maxStoredErrors) {
      this.errors = this.errors.slice(0, this.maxStoredErrors)
    }

    // Save errors to storage
    await this.saveErrors()

    // Report to monitoring service if it's a serious error
    if (severity === ErrorSeverity.HIGH || severity === ErrorSeverity.CRITICAL || !handled) {
      this.reportToMonitoringService(appError, severity)
    }

    return appError.id
  }

  // Report error to monitoring service (e.g., Sentry)
  private reportToMonitoringService(error: AppError, severity: ErrorSeverity) {
    try {
      // Set up context for the error
      if (error.metadata) {
        // In a real app, you would set context for your monitoring service
        // Sentry.setContext('metadata', error.metadata)
      }

      // Create an Error object to capture
      const errorObj = new Error(error.message)
      if (error.stack) {
        errorObj.stack = error.stack
      }

      // Capture the exception
      captureException(errorObj)
    } catch (reportingError) {
      console.error("Error reporting to monitoring service:", reportingError)
    }
  }

  // Get all stored errors
  public async getErrors(): Promise<AppError[]> {
    await this.ensureInitialized()
    return [...this.errors]
  }

  // Clear all stored errors
  public async clearErrors(): Promise<void> {
    await this.ensureInitialized()
    this.errors = []
    await this.saveErrors()
  }

  // Save errors to storage
  private async saveErrors(): Promise<void> {
    try {
      await AsyncStorage.setItem("@storedErrors", JSON.stringify(this.errors))
    } catch (error) {
      console.error("Error saving errors:", error)
    }
  }

  // Ensure the service is initialized
  private async ensureInitialized(): Promise<void> {
    if (!this.isInitialized) {
      await this.initialize()
    }
  }

  // Create a user-friendly error message
  public getUserFriendlyMessage(error: Error | string | AppError): string {
    if (typeof error === "string") {
      return this.sanitizeErrorMessage(error)
    }

    if ("message" in error) {
      return this.sanitizeErrorMessage(error.message)
    }

    return "An unexpected error occurred. Please try again."
  }

  // Sanitize error messages to be user-friendly
  private sanitizeErrorMessage(message: string): string {
    // Remove technical details that wouldn't make sense to users
    const sanitized = message
      .replace(/Error: /g, "")
      .replace(/TypeError: /g, "")
      .replace(/ReferenceError: /g, "")
      .replace(/SyntaxError: /g, "")

    // Check if it's a network error
    if (
      message.includes("Network request failed") ||
      message.includes("Failed to fetch") ||
      message.includes("Network error")
    ) {
      return "Unable to connect to the server. Please check your internet connection and try again."
    }

    // Check if it's an authentication error
    if (
      message.includes("Unauthorized") ||
      message.includes("Invalid token") ||
      message.includes("Authentication failed")
    ) {
      return "Your session has expired. Please log in again."
    }

    // If the message is too technical or cryptic, provide a generic message
    if (
      message.includes("undefined is not an object") ||
      message.includes("null is not an object") ||
      message.includes("cannot read property") ||
      sanitized.length > 100
    ) {
      return "Something went wrong. Please try again later."
    }

    return sanitized
  }
}

// React error boundary component
import { Component, type ErrorInfo, type ReactNode } from "react"
import { View, Text, StyleSheet, TouchableOpacity } from "react-native"

interface ErrorBoundaryProps {
  children: ReactNode
  fallback?: ReactNode
  onError?: (error: Error, errorInfo: ErrorInfo) => void
}

interface ErrorBoundaryState {
  hasError: boolean
  error: Error | null
}

export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props)
    this.state = { hasError: false, error: null }
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error }
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    // Log the error
    const errorService = ErrorHandlingService.getInstance()
    errorService.logError(error, { componentStack: errorInfo.componentStack }, ErrorSeverity.HIGH, true)

    // Call onError prop if provided
    if (this.props.onError) {
      this.props.onError(error, errorInfo)
    }
  }

  resetError = () => {
    this.setState({ hasError: false, error: null })
  }

  render() {
    if (this.state.hasError) {
      // Use custom fallback if provided
      if (this.props.fallback) {
        return this.props.fallback
      }

      // Default fallback UI
      return (
        <View style={styles.errorContainer}>
          <Text style={styles.errorTitle}>Something went wrong</Text>
          <Text style={styles.errorMessage}>
            {ErrorHandlingService.getInstance().getUserFriendlyMessage(this.state.error || "Unknown error")}
          </Text>
          <TouchableOpacity style={styles.resetButton} onPress={this.resetError}>
            <Text style={styles.resetButtonText}>Try Again</Text>
          </TouchableOpacity>
        </View>
      )
    }

    return this.props.children
  }
}

const styles = StyleSheet.create({
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
    backgroundColor: "#f8f9fa",
  },
  errorTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 10,
    color: "#dc3545",
  },
  errorMessage: {
    fontSize: 16,
    textAlign: "center",
    marginBottom: 20,
    color: "#343a40",
  },
  resetButton: {
    backgroundColor: "#007bff",
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 5,
  },
  resetButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "500",
  },
})

// Hook for using the error handling service
export function useErrorHandling() {
  const errorService = ErrorHandlingService.getInstance()

  return {
    logError: (
      error: Error | string,
      metadata?: Record<string, any>,
      severity: ErrorSeverity = ErrorSeverity.MEDIUM,
      handled = true,
    ) => errorService.logError(error, metadata, severity, handled),
    getErrors: () => errorService.getErrors(),
    clearErrors: () => errorService.clearErrors(),
    getUserFriendlyMessage: (error: Error | string | AppError) => errorService.getUserFriendlyMessage(error),
  }
}

