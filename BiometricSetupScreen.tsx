"use client"

import { useState, useEffect } from "react"
import { View, Text, StyleSheet, TouchableOpacity, Switch, Alert, ScrollView, ActivityIndicator } from "react-native"
import { SafeAreaView } from "react-native-safe-area-context"
import { Ionicons } from "@expo/vector-icons"
import { useNavigation } from "@react-navigation/native"
import { COLORS } from "../constants/colors"
import { BiometricAuthService, type BiometricType } from "../services/BiometricAuthService"
import { useAuth } from "../context/AuthContext"

const BiometricSetupScreen = () => {
  const navigation = useNavigation()
  const { user } = useAuth()

  const [isLoading, setIsLoading] = useState(true)
  const [isBiometricAvailable, setIsBiometricAvailable] = useState(false)
  const [biometricTypes, setBiometricTypes] = useState<BiometricType[]>([])
  const [isBiometricEnabled, setIsBiometricEnabled] = useState(false)
  const [isToggling, setIsToggling] = useState(false)

  useEffect(() => {
    checkBiometricAvailability()
  }, [])

  const checkBiometricAvailability = async () => {
    try {
      setIsLoading(true)

      // Check if biometrics are available on the device
      const available = await BiometricAuthService.isBiometricAvailable()
      setIsBiometricAvailable(available)

      if (available) {
        // Get available biometric types
        const types = await BiometricAuthService.getAvailableBiometricTypes()
        setBiometricTypes(types)

        // Check if biometric login is enabled for the current user
        if (user?.id) {
          const enabled = await BiometricAuthService.isBiometricLoginEnabled(user.id)
          setIsBiometricEnabled(enabled)
        }
      }
    } catch (error) {
      console.error("Error checking biometric availability:", error)
      Alert.alert("Error", "Failed to check biometric availability. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  const toggleBiometricLogin = async () => {
    if (!user?.id) {
      Alert.alert("Error", "You must be logged in to enable biometric authentication.")
      return
    }

    try {
      setIsToggling(true)

      if (isBiometricEnabled) {
        // Disable biometric login
        const success = await BiometricAuthService.disableBiometricLogin(user.id)

        if (success) {
          setIsBiometricEnabled(false)
          Alert.alert("Success", "Biometric login has been disabled.")
        } else {
          Alert.alert("Error", "Failed to disable biometric login. Please try again.")
        }
      } else {
        // Authenticate before enabling
        const authenticated = await BiometricAuthService.authenticate(
          "Authenticate to enable biometric login",
          "Use Password",
        )

        if (authenticated) {
          // Enable biometric login
          const success = await BiometricAuthService.enableBiometricLogin(user.id)

          if (success) {
            setIsBiometricEnabled(true)
            Alert.alert("Success", "Biometric login has been enabled.")
          } else {
            Alert.alert("Error", "Failed to enable biometric login. Please try again.")
          }
        }
      }
    } catch (error) {
      console.error("Error toggling biometric login:", error)
      Alert.alert("Error", "An error occurred. Please try again.")
    } finally {
      setIsToggling(false)
    }
  }

  const testBiometricAuth = async () => {
    try {
      const authenticated = await BiometricAuthService.authenticate("Test biometric authentication", "Use Password")

      if (authenticated) {
        Alert.alert("Success", "Biometric authentication successful!")
      } else {
        Alert.alert("Failed", "Biometric authentication failed.")
      }
    } catch (error) {
      console.error("Error testing biometric auth:", error)
      Alert.alert("Error", "An error occurred during authentication.")
    }
  }

  const getBiometricTypeIcon = (type: BiometricType) => {
    switch (type) {
      case "fingerprint":
        return "finger-print"
      case "facial":
        return "scan-face"
      case "iris":
        return "eye"
      default:
        return "finger-print"
    }
  }

  const getBiometricTypeName = (type: BiometricType) => {
    switch (type) {
      case "fingerprint":
        return "Fingerprint"
      case "facial":
        return "Face Recognition"
      case "iris":
        return "Iris Scan"
      default:
        return "Biometric"
    }
  }

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color={COLORS.darkGray} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Biometric Authentication</Text>
      </View>

      {isLoading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={COLORS.primary} />
          <Text style={styles.loadingText}>Checking biometric capabilities...</Text>
        </View>
      ) : (
        <ScrollView style={styles.content}>
          {!isBiometricAvailable ? (
            <View style={styles.notAvailableContainer}>
              <Ionicons name="alert-circle" size={64} color={COLORS.warning} />
              <Text style={styles.notAvailableTitle}>Biometric Authentication Not Available</Text>
              <Text style={styles.notAvailableText}>
                Your device does not support biometric authentication or it has not been set up in your device settings.
              </Text>
              <TouchableOpacity style={styles.setupButton} onPress={() => navigation.goBack()}>
                <Text style={styles.setupButtonText}>Go Back</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <>
              <View style={styles.infoCard}>
                <Text style={styles.infoTitle}>Available Biometric Methods</Text>
                <View style={styles.biometricTypesList}>
                  {biometricTypes.map((type) => (
                    <View key={type} style={styles.biometricTypeItem}>
                      <Ionicons name={getBiometricTypeIcon(type)} size={32} color={COLORS.primary} />
                      <Text style={styles.biometricTypeName}>{getBiometricTypeName(type)}</Text>
                    </View>
                  ))}
                </View>
              </View>

              <View style={styles.settingCard}>
                <View style={styles.settingRow}>
                  <View style={styles.settingInfo}>
                    <Text style={styles.settingTitle}>Enable Biometric Login</Text>
                    <Text style={styles.settingDescription}>
                      Use {biometricTypes.map((type) => getBiometricTypeName(type)).join(" or ")} to log in to your
                      account
                    </Text>
                  </View>
                  <Switch
                    value={isBiometricEnabled}
                    onValueChange={toggleBiometricLogin}
                    disabled={isToggling}
                    trackColor={{ false: COLORS.lightGray, true: COLORS.primaryLight }}
                    thumbColor={isBiometricEnabled ? COLORS.primary : COLORS.white}
                  />
                </View>
              </View>

              {isBiometricEnabled && (
                <TouchableOpacity style={styles.testButton} onPress={testBiometricAuth}>
                  <Ionicons name="shield-checkmark" size={24} color={COLORS.white} />
                  <Text style={styles.testButtonText}>Test Biometric Authentication</Text>
                </TouchableOpacity>
              )}

              <View style={styles.infoBox}>
                <Ionicons name="information-circle" size={24} color={COLORS.info} style={styles.infoIcon} />
                <Text style={styles.infoText}>
                  Biometric authentication provides a secure and convenient way to access your account without entering
                  your password each time.
                </Text>
              </View>
            </>
          )}
        </ScrollView>
      )}
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: COLORS.white,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.lightGray,
  },
  backButton: {
    marginRight: 16,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: COLORS.darkGray,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: COLORS.gray,
  },
  content: {
    flex: 1,
    padding: 16,
  },
  notAvailableContainer: {
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
    backgroundColor: COLORS.white,
    borderRadius: 8,
    marginVertical: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  notAvailableTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: COLORS.darkGray,
    marginTop: 16,
    marginBottom: 8,
    textAlign: "center",
  },
  notAvailableText: {
    fontSize: 14,
    color: COLORS.gray,
    textAlign: "center",
    marginBottom: 20,
  },
  setupButton: {
    backgroundColor: COLORS.primary,
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
  },
  setupButtonText: {
    color: COLORS.white,
    fontSize: 16,
    fontWeight: "bold",
  },
  infoCard: {
    backgroundColor: COLORS.white,
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  infoTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: COLORS.darkGray,
    marginBottom: 16,
  },
  biometricTypesList: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-around",
  },
  biometricTypeItem: {
    alignItems: "center",
    padding: 16,
    width: "45%",
  },
  biometricTypeName: {
    marginTop: 8,
    fontSize: 14,
    color: COLORS.darkGray,
    textAlign: "center",
  },
  settingCard: {
    backgroundColor: COLORS.white,
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  settingRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  settingInfo: {
    flex: 1,
    marginRight: 16,
  },
  settingTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: COLORS.darkGray,
    marginBottom: 4,
  },
  settingDescription: {
    fontSize: 14,
    color: COLORS.gray,
  },
  testButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: COLORS.primary,
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderRadius: 8,
    marginBottom: 16,
  },
  testButtonText: {
    color: COLORS.white,
    fontSize: 16,
    fontWeight: "bold",
    marginLeft: 8,
  },
  infoBox: {
    flexDirection: "row",
    backgroundColor: COLORS.infoLight,
    borderRadius: 8,
    padding: 16,
    marginBottom: 20,
  },
  infoIcon: {
    marginRight: 12,
  },
  infoText: {
    flex: 1,
    fontSize: 14,
    color: COLORS.darkGray,
    lineHeight: 20,
  },
})

export default BiometricSetupScreen

