"use client"

import { useState } from "react"
import { View, Text, StyleSheet, TouchableOpacity, Alert, ActivityIndicator } from "react-native"
import { SafeAreaView } from "react-native-safe-area-context"
import { COLORS } from "./constants/colors"
import FormInput from "./components/ui/FormInput"
import Button from "./components/ui/Button"
import { Ionicons } from "@expo/vector-icons"
import { useNavigation } from "@react-navigation/native"

const ForgotPasswordScreen = () => {
  const navigation = useNavigation()
  const [email, setEmail] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [resetSent, setResetSent] = useState(false)

  const handleResetPassword = async () => {
    if (!email) {
      Alert.alert("Error", "Please enter your email address")
      return
    }

    setIsLoading(true)

    // Simulate API call
    setTimeout(() => {
      setIsLoading(false)
      setResetSent(true)
      // In a real app, you would call an API to send a reset email
    }, 1500)
  }

  if (resetSent) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.content}>
          <View style={styles.successContainer}>
            <View style={styles.iconContainer}>
              <Ionicons name="mail" size={64} color={COLORS.primary} />
            </View>
            <Text style={styles.successTitle}>Check Your Email</Text>
            <Text style={styles.successText}>We've sent password reset instructions to {email}</Text>
            <Button
              title="Back to Login"
              onPress={() => navigation.navigate("Login" as never)}
              type="primary"
              style={styles.button}
            />
            <TouchableOpacity onPress={() => setResetSent(false)} style={styles.resendLink}>
              <Text style={styles.resendText}>Didn't receive the email? Resend</Text>
            </TouchableOpacity>
          </View>
        </View>
      </SafeAreaView>
    )
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color={COLORS.darkGray} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Reset Password</Text>
      </View>

      <View style={styles.content}>
        <Text style={styles.subtitle}>
          Enter your email address and we'll send you instructions to reset your password.
        </Text>

        <FormInput
          label="Email Address"
          value={email}
          onChangeText={setEmail}
          placeholder="Enter your email"
          keyboardType="email-address"
          autoCapitalize="none"
          required
        />

        <Button
          title={isLoading ? "Sending..." : "Send Reset Link"}
          onPress={handleResetPassword}
          type="primary"
          style={styles.button}
          disabled={isLoading}
          icon={isLoading ? <ActivityIndicator size="small" color={COLORS.white} /> : null}
        />

        <TouchableOpacity onPress={() => navigation.navigate("Login" as never)} style={styles.loginLink}>
          <Text style={styles.loginText}>Remember your password? Login</Text>
        </TouchableOpacity>
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
  },
  subtitle: {
    fontSize: 16,
    color: COLORS.gray,
    marginBottom: 24,
    lineHeight: 22,
  },
  button: {
    marginTop: 16,
  },
  loginLink: {
    marginTop: 24,
    alignItems: "center",
  },
  loginText: {
    color: COLORS.primary,
    fontSize: 16,
  },
  successContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 24,
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
  successTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: COLORS.darkGray,
    marginBottom: 16,
    textAlign: "center",
  },
  successText: {
    fontSize: 16,
    color: COLORS.gray,
    textAlign: "center",
    marginBottom: 32,
    lineHeight: 22,
  },
  resendLink: {
    marginTop: 24,
  },
  resendText: {
    color: COLORS.primary,
    fontSize: 16,
  },
})

export default ForgotPasswordScreen

