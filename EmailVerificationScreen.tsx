"use client"

import { useState, useEffect, useRef } from "react"
import { View, Text, StyleSheet, TouchableOpacity, TextInput, ActivityIndicator, Alert, Keyboard } from "react-native"
import { SafeAreaView } from "react-native-safe-area-context"
import { COLORS } from "../constants/colors"
import { Ionicons } from "@expo/vector-icons"
import { useNavigation, useRoute } from "@react-navigation/native"
import { useAuth } from "../context/AuthContext"

const EmailVerificationScreen = () => {
  const navigation = useNavigation()
  const route = useRoute()
  const { email } = route.params || {}
  const { verifyEmail, sendVerificationEmail, isLoading } = useAuth()

  const [code, setCode] = useState(["", "", "", "", "", ""])
  const [isResending, setIsResending] = useState(false)
  const [countdown, setCountdown] = useState(0)

  const inputRefs = useRef<Array<TextInput | null>>([])

  // Start countdown when resending code
  useEffect(() => {
    let timer: NodeJS.Timeout

    if (countdown > 0) {
      timer = setTimeout(() => setCountdown(countdown - 1), 1000)
    }

    return () => {
      if (timer) clearTimeout(timer)
    }
  }, [countdown])

  // Handle code input change
  const handleCodeChange = (text: string, index: number) => {
    if (text.length > 1) {
      text = text[0] // Only take the first character
    }

    const newCode = [...code]
    newCode[index] = text
    setCode(newCode)

    // Auto-advance to next input
    if (text && index < 5) {
      inputRefs.current[index + 1]?.focus()
    }
  }

  // Handle backspace key
  const handleKeyPress = (e: any, index: number) => {
    if (e.nativeEvent.key === "Backspace" && !code[index] && index > 0) {
      inputRefs.current[index - 1]?.focus()
    }
  }

  // Handle code verification
  const handleVerify = async () => {
    Keyboard.dismiss()

    const verificationCode = code.join("")
    if (verificationCode.length !== 6) {
      Alert.alert("Invalid Code", "Please enter the 6-digit verification code.")
      return
    }

    const success = await verifyEmail(verificationCode)

    if (success) {
      Alert.alert("Success", "Your email has been verified successfully!", [
        {
          text: "Continue",
          onPress: () => navigation.navigate("Main" as never),
        },
      ])
    } else {
      Alert.alert("Verification Failed", "The code you entered is incorrect. Please try again.")
    }
  }

  // Handle resend code
  const handleResend = async () => {
    if (countdown > 0) return

    setIsResending(true)

    const success = await sendVerificationEmail(email)

    setIsResending(false)

    if (success) {
      setCountdown(60) // 60 seconds cooldown
      Alert.alert("Code Sent", "A new verification code has been sent to your email.")
    } else {
      Alert.alert("Error", "Failed to send verification code. Please try again later.")
    }
  }

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()} disabled={isLoading}>
          <Ionicons name="arrow-back" size={24} color={COLORS.darkGray} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Verify Your Email</Text>
      </View>

      <View style={styles.content}>
        <View style={styles.iconContainer}>
          <Ionicons name="mail" size={64} color={COLORS.primary} />
        </View>

        <Text style={styles.title}>Check Your Email</Text>
        <Text style={styles.subtitle}>
          We've sent a 6-digit verification code to {email}. Enter the code below to verify your email address.
        </Text>

        <View style={styles.codeContainer}>
          {code.map((digit, index) => (
            <TextInput
              key={index}
              ref={(ref) => (inputRefs.current[index] = ref)}
              style={styles.codeInput}
              value={digit}
              onChangeText={(text) => handleCodeChange(text, index)}
              onKeyPress={(e) => handleKeyPress(e, index)}
              keyboardType="number-pad"
              maxLength={1}
              selectTextOnFocus
              editable={!isLoading}
            />
          ))}
        </View>

        <TouchableOpacity
          style={[styles.verifyButton, isLoading && styles.disabledButton]}
          onPress={handleVerify}
          disabled={isLoading || code.join("").length !== 6}
        >
          {isLoading ? (
            <ActivityIndicator color={COLORS.white} />
          ) : (
            <Text style={styles.verifyButtonText}>Verify Email</Text>
          )}
        </TouchableOpacity>

        <View style={styles.resendContainer}>
          <Text style={styles.resendText}>Didn't receive the code? </Text>
          <TouchableOpacity onPress={handleResend} disabled={isResending || countdown > 0}>
            <Text style={[styles.resendLink, (isResending || countdown > 0) && styles.disabledText]}>
              {isResending ? "Sending..." : countdown > 0 ? `Resend in ${countdown}s` : "Resend Code"}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.white,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 12,
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
  content: {
    flex: 1,
    padding: 24,
    alignItems: "center",
    justifyContent: "center",
  },
  iconContainer: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: COLORS.primaryLight,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 24,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: COLORS.darkGray,
    marginBottom: 16,
    textAlign: "center",
  },
  subtitle: {
    fontSize: 16,
    color: COLORS.gray,
    textAlign: "center",
    marginBottom: 32,
    lineHeight: 22,
  },
  codeContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    marginBottom: 32,
  },
  codeInput: {
    width: 48,
    height: 56,
    borderWidth: 1,
    borderColor: COLORS.lightGray,
    borderRadius: 8,
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
  },
  verifyButton: {
    backgroundColor: COLORS.primary,
    borderRadius: 8,
    paddingVertical: 16,
    paddingHorizontal: 24,
    width: "100%",
    alignItems: "center",
    marginBottom: 24,
  },
  disabledButton: {
    backgroundColor: COLORS.lightGray,
  },
  verifyButtonText: {
    color: COLORS.white,
    fontSize: 16,
    fontWeight: "bold",
  },
  resendContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  resendText: {
    fontSize: 14,
    color: COLORS.gray,
  },
  resendLink: {
    fontSize: 14,
    color: COLORS.primary,
    fontWeight: "bold",
  },
  disabledText: {
    color: COLORS.gray,
  },
})

export default EmailVerificationScreen

