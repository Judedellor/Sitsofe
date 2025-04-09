import * as LocalAuthentication from "expo-local-authentication"
import AsyncStorage from "@react-native-async-storage/async-storage"
import { Alert, Platform } from "react-native"

export type BiometricType = "fingerprint" | "facial" | "iris"

export class BiometricAuthService {
  // Check if device has biometric hardware
  static async isBiometricAvailable(): Promise<boolean> {
    try {
      const compatible = await LocalAuthentication.hasHardwareAsync()
      return compatible
    } catch (error) {
      console.error("Error checking biometric availability:", error)
      return false
    }
  }

  // Get available biometric types
  static async getAvailableBiometricTypes(): Promise<BiometricType[]> {
    try {
      const types = await LocalAuthentication.supportedAuthenticationTypesAsync()

      const biometricTypes: BiometricType[] = []

      types.forEach((type: LocalAuthentication.AuthenticationType) => {
        if (type === LocalAuthentication.AuthenticationType.FINGERPRINT) {
          biometricTypes.push("fingerprint")
        } else if (type === LocalAuthentication.AuthenticationType.FACIAL_RECOGNITION) {
          biometricTypes.push("facial")
        } else if (type === LocalAuthentication.AuthenticationType.IRIS) {
          biometricTypes.push("iris")
        }
      })

      return biometricTypes
    } catch (error) {
      console.error("Error getting biometric types:", error)
      return []
    }
  }

  // Check if biometrics are enrolled
  static async isBiometricEnrolled(): Promise<boolean> {
    try {
      const enrolled = await LocalAuthentication.isEnrolledAsync()
      return enrolled
    } catch (error) {
      console.error("Error checking biometric enrollment:", error)
      return false
    }
  }

  // Authenticate with biometrics
  static async authenticate(
    promptMessage = "Authenticate to continue",
    fallbackLabel = "Use Passcode",
  ): Promise<boolean> {
    try {
      const available = await this.isBiometricAvailable()

      if (!available) {
        console.log("Biometric authentication not available on this device")
        return false
      }

      const enrolled = await this.isBiometricEnrolled()

      if (!enrolled) {
        Alert.alert(
          "Biometric Setup Required",
          Platform.OS === "ios"
            ? "Please set up Face ID or Touch ID in your device settings to use this feature."
            : "Please set up fingerprint or face recognition in your device settings to use this feature.",
        )
        return false
      }

      const result = await LocalAuthentication.authenticateAsync({
        promptMessage,
        fallbackLabel,
        disableDeviceFallback: false,
      })

      return result.success
    } catch (error) {
      console.error("Error during biometric authentication:", error)
      return false
    }
  }

  // Enable biometric login for a user
  static async enableBiometricLogin(userId: string): Promise<boolean> {
    try {
      // Store a flag indicating biometric login is enabled for this user
      await AsyncStorage.setItem(`@biometric_enabled_${userId}`, "true")
      return true
    } catch (error) {
      console.error("Error enabling biometric login:", error)
      return false
    }
  }

  // Disable biometric login for a user
  static async disableBiometricLogin(userId: string): Promise<boolean> {
    try {
      await AsyncStorage.removeItem(`@biometric_enabled_${userId}`)
      return true
    } catch (error) {
      console.error("Error disabling biometric login:", error)
      return false
    }
  }

  // Check if biometric login is enabled for a user
  static async isBiometricLoginEnabled(userId: string): Promise<boolean> {
    try {
      const enabled = await AsyncStorage.getItem(`@biometric_enabled_${userId}`)
      return enabled === "true"
    } catch (error) {
      console.error("Error checking if biometric login is enabled:", error)
      return false
    }
  }

  // Get biometric authentication type name for display
  static getBiometricTypeName(): string {
    if (Platform.OS === "ios") {
      return parseInt(Platform.Version as string, 10) >= 13 ? "Face ID" : "Touch ID"
    } else {
      return "Biometric Authentication"
    }
  }
}

