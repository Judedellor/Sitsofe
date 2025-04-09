import type React from "react"
import { View, Text, ActivityIndicator, StyleSheet } from "react-native"
import { COLORS } from "../constants/colors"

interface LoadingStateProps {
  message?: string
  fullScreen?: boolean
  transparent?: boolean
}

const LoadingState: React.FC<LoadingStateProps> = ({
  message = "Loading...",
  fullScreen = false,
  transparent = false,
}) => {
  if (fullScreen) {
    return (
      <View
        style={[styles.fullScreenContainer, transparent && styles.transparentBackground]}
        accessible={true}
        accessibilityLabel={message}
        accessibilityRole="progressbar"
      >
        <View style={styles.loadingBox}>
          <ActivityIndicator size="large" color={COLORS.primary} />
          <Text style={styles.loadingText}>{message}</Text>
        </View>
      </View>
    )
  }

  return (
    <View style={styles.container} accessible={true} accessibilityLabel={message} accessibilityRole="progressbar">
      <ActivityIndicator size="small" color={COLORS.primary} />
      <Text style={styles.text}>{message}</Text>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    padding: 16,
  },
  text: {
    marginLeft: 8,
    fontSize: 14,
    color: COLORS.darkGray,
  },
  fullScreenContainer: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(255, 255, 255, 0.9)",
    zIndex: 1000,
  },
  transparentBackground: {
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  loadingBox: {
    backgroundColor: COLORS.white,
    borderRadius: 8,
    padding: 20,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    minWidth: 150,
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
    color: COLORS.darkGray,
    textAlign: "center",
  },
})

export default LoadingState

