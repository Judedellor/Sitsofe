import type React from "react"
import { View, Text, StyleSheet } from "react-native"
import { COLORS } from "../constants/colors"
import { Ionicons } from "@expo/vector-icons"
import AccessibleTouchable from "./AccessibleTouchable"

interface ErrorStateProps {
  message?: string
  technicalDetails?: string
  onRetry?: () => void
  fullScreen?: boolean
}

const ErrorState: React.FC<ErrorStateProps> = ({
  message = "Something went wrong",
  technicalDetails,
  onRetry,
  fullScreen = false,
}) => {
  const containerStyle = fullScreen ? styles.fullScreenContainer : styles.container

  return (
    <View style={containerStyle} accessible={true} accessibilityLabel={`Error: ${message}`} accessibilityRole="alert">
      <View style={styles.errorContent}>
        <Ionicons name="alert-circle" size={40} color={COLORS.error} />
        <Text style={styles.errorMessage}>{message}</Text>

        {technicalDetails && (
          <AccessibleTouchable
            style={styles.detailsContainer}
            onPress={() => {
              // In a real app, you might log this or show a modal with details
              console.log(technicalDetails)
            }}
            accessibilityLabel="View technical error details"
            accessibilityRole="button"
          >
            <Text style={styles.detailsText}>View Technical Details</Text>
          </AccessibleTouchable>
        )}

        {onRetry && (
          <AccessibleTouchable
            style={styles.retryButton}
            onPress={onRetry}
            accessibilityLabel="Try again"
            accessibilityHint="Attempts to reload the data"
            accessibilityRole="button"
          >
            <Ionicons name="refresh" size={16} color={COLORS.white} />
            <Text style={styles.retryText}>Try Again</Text>
          </AccessibleTouchable>
        )}
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: "rgba(244, 67, 54, 0.05)",
    borderRadius: 8,
    margin: 16,
  },
  fullScreenContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  errorContent: {
    alignItems: "center",
  },
  errorMessage: {
    fontSize: 16,
    color: COLORS.darkGray,
    textAlign: "center",
    marginTop: 12,
    marginBottom: 16,
  },
  detailsContainer: {
    marginBottom: 16,
    padding: 8, // Increased touch target
  },
  detailsText: {
    fontSize: 14,
    color: COLORS.primary,
    textDecorationLine: "underline",
  },
  retryButton: {
    flexDirection: "row",
    backgroundColor: COLORS.primary,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 4,
    alignItems: "center",
    minHeight: 44, // Ensure minimum touch target size
    minWidth: 100,
  },
  retryText: {
    color: COLORS.white,
    marginLeft: 8,
    fontWeight: "500",
  },
})

export default ErrorState

