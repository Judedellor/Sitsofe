"use client"

import { useState } from "react"
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  ImageStyle,
} from "react-native"
import { SafeAreaView } from "react-native-safe-area-context"
import { colors } from "../constants/colors"
import FormInput from "../components/ui/FormInput"
import Button from "../components/ui/Button"
import { useAuth } from "../context/AuthContext"
import { useNavigation } from "@react-navigation/native"

const LoginScreen = () => {
  const navigation = useNavigation()
  const { login } = useAuth()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [rememberMe, setRememberMe] = useState(false)

  const handleLogin = async () => {
    if (!email || !password) {
      alert("Please fill in all fields")
      return
    }

    setIsLoading(true)

    try {
      // In a real app, you would validate credentials with an API
      // For demo purposes, we'll just simulate a delay and log in
      setTimeout(() => {
        login({ id: "1", email, name: "Demo User" })
        setIsLoading(false)
      }, 1000)
    } catch (error) {
      setIsLoading(false)
      alert("Login failed. Please check your credentials.")
    }
  }

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} style={styles.keyboardAvoidingView}>
        <ScrollView contentContainerStyle={styles.scrollContent}>
          <View style={styles.logoContainer}>
            <Image
              source={{ uri: "https://api.a0.dev/assets/image?text=PropertyManager&width=200&height=200" }}
              style={styles.logo}
            />
            <Text style={styles.appName}>Property Manager</Text>
            <Text style={styles.tagline}>Manage your properties with ease</Text>
          </View>

          <View style={styles.formContainer}>
            <Text style={styles.welcomeText}>Welcome Back</Text>
            <Text style={styles.subtitle}>Sign in to continue</Text>

            <FormInput
              label="Email"
              value={email}
              onChangeText={setEmail}
              placeholder="Enter your email"
              keyboardType="email-address"
              autoCapitalize="none"
              required
            />

            <FormInput
              label="Password"
              value={password}
              onChangeText={setPassword}
              placeholder="Enter your password"
              secureTextEntry
              required
            />

            <View style={styles.forgotPasswordContainer}>
              <TouchableOpacity style={styles.rememberMeContainer} onPress={() => setRememberMe(!rememberMe)}>
                <View style={[styles.checkbox, rememberMe && styles.checkboxChecked]}>
                  {rememberMe && <Text style={styles.checkmark}>✓</Text>}
                </View>
                <Text style={styles.rememberMeText}>Remember me</Text>
              </TouchableOpacity>

              <TouchableOpacity onPress={() => navigation.navigate("ForgotPassword" as never)}>
                <Text style={styles.forgotPasswordText}>Forgot Password?</Text>
              </TouchableOpacity>
            </View>

            <Button
              title={isLoading ? "Signing in..." : "Sign In"}
              onPress={handleLogin}
              type="primary"
              style={styles.loginButton}
              disabled={isLoading}
              icon={isLoading ? <ActivityIndicator size="small" color={colors.white} /> : null}
            />

            <View style={styles.signupContainer}>
              <Text style={styles.signupText}>Don't have an account? </Text>
              <TouchableOpacity onPress={() => navigation.navigate("SignUp" as never)}>
                <Text style={styles.signupLink}>Sign Up</Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
  },
  keyboardAvoidingView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingBottom: 24,
  },
  logoContainer: {
    alignItems: "center",
    marginTop: 48,
    marginBottom: 32,
  },
  logo: {
    width: 100,
    height: 100,
    borderRadius: 20,
  } as ImageStyle,
  appName: {
    fontSize: 24,
    fontWeight: "bold",
    color: colors.primary,
    marginTop: 16,
  },
  tagline: {
    fontSize: 16,
    color: colors.gray[600],
    marginTop: 8,
  },
  formContainer: {
    paddingHorizontal: 24,
  },
  welcomeText: {
    fontSize: 28,
    fontWeight: "bold",
    color: colors.gray[900],
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: colors.gray[600],
    marginBottom: 32,
  },
  forgotPasswordContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 8,
    marginBottom: 24,
  },
  rememberMeContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  checkbox: {
    width: 20,
    height: 20,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: colors.gray[400],
    marginRight: 8,
    justifyContent: "center",
    alignItems: "center",
  },
  checkboxChecked: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  checkmark: {
    color: colors.white,
    fontSize: 12,
    fontWeight: "bold",
  },
  rememberMeText: {
    fontSize: 14,
    color: colors.gray[600],
  },
  forgotPasswordText: {
    fontSize: 14,
    color: colors.primary,
    fontWeight: "500",
  },
  loginButton: {
    marginBottom: 24,
  },
  signupContainer: {
    flexDirection: "row",
    justifyContent: "center",
  },
  signupText: {
    fontSize: 16,
    color: colors.gray[600],
  },
  signupLink: {
    fontSize: 16,
    color: colors.primary,
    fontWeight: "500",
  },
})

export default LoginScreen

