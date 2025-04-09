"use client"

import type React from "react"
import { useEffect, useState } from "react"
import { Text, StyleSheet, Animated, Dimensions } from "react-native"
import NetInfo from "@react-native-community/netinfo"
import { useSafeAreaInsets } from "react-native-safe-area-context"
import { useAccessibility } from "../services/AccessibilityService"

const { width } = Dimensions.get("window")

const OfflineNotice: React.FC = () => {
  const [isOffline, setIsOffline] = useState(false)
  const insets = useSafeAreaInsets()
  const { getAccessibilityProps } = useAccessibility()
  const translateY = new Animated.Value(-100)

  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener((state) => {
      const offline = !state.isConnected
      setIsOffline(offline)

      Animated.timing(translateY, {
        toValue: offline ? 0 : -100,
        duration: 300,
        useNativeDriver: true,
      }).start()
    })

    return () => {
      unsubscribe()
    }
  }, [translateY])

  if (!isOffline) {
    return null
  }

  return (
    <Animated.View
      style={[
        styles.container,
        {
          transform: [{ translateY }],
          paddingTop: insets.top,
        },
      ]}
      {...getAccessibilityProps("You are offline", "Network connection is unavailable", "alert")}
    >
      <Text style={styles.text}>No Internet Connection</Text>
      <Text style={styles.subText}>Some features may be unavailable</Text>
    </Animated.View>
  )
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#f44336",
    padding: 10,
    position: "absolute",
    top: 0,
    width,
    zIndex: 1000,
    alignItems: "center",
  },
  text: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
  subText: {
    color: "white",
    fontSize: 12,
    marginTop: 4,
  },
})

export default OfflineNotice

