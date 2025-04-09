"use client"

import React from "react"
import { useState } from "react"
import { View, Text, StyleSheet, TouchableOpacity, Alert, ActivityIndicator } from "react-native"
import { SafeAreaView } from "react-native-safe-area-context"
import { COLORS } from "../constants/colors"
import FormInput from "../components/ui/FormInput"
import Button from "../components/ui/Button"
import { Ionicons } from "@expo/vector-icons"
import { useNavigation, useRoute, RouteProp } from "@react-navigation/native"
import { NativeStackNavigationProp } from "@react-navigation/native-stack"

// Add types
type RootStackParamList = {
  Login: undefined;
  ResetPassword: {
    token: string;
  };
};

type NavigationProp = NativeStackNavigationProp<RootStackParamList, 'ResetPassword'>;
type RouteProps = RouteProp<RootStackParamList, 'ResetPassword'>;

const ResetPasswordScreen = () => {
  const navigation = useNavigation<NavigationProp>()
  const route = useRoute<RouteProps>()
  const { token } = route.params || { token: "mock-token" }

  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [resetComplete, setResetComplete] = useState(false)

  const handleResetPassword = async () => {
    if (!password || !confirmPassword) {
      Alert.alert("Error", "Please fill in all fields")
      return
    }

    if (password !== confirmPassword) {
      Alert.alert("Error", "Passwords do not match")
      return
    }

    if (password.length < 8) {
      Alert.alert("Error", "Password must be at least 8 characters long")
      return
    }

    setIsLoading(true)

    // Simulate API call
    setTimeout(() => {
      setIsLoading(false)
      setResetComplete(true)
      // In a real app, you would call an API to reset the password
    }, 1500)
  }

  if (resetComplete) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.content}>
          <View style={styles.successContainer}>
            <View style={styles.iconContainer}>
              <Ionicons name="checkmark-circle" size={64} color={COLORS.success} />
            </View>
            <Text style={styles.successTitle}>Password Reset Successful</Text>
            <Text style={styles.successText}>
              Your password has been reset successfully. You can now log in with your new password.
            </Text>
            <Button
              title="Login"
              onPress={() => navigation.navigate("Login" as never)}
              type="primary"
              style={styles.button}
            />
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
        <Text style={styles.headerTitle}>Create New Password</Text>
      </View>

      <View style={styles.content}>
        <Text style={styles.subtitle}>Your new password must be different from previously used passwords.</Text>

        <FormInput
          label="New Password"
          value={password}
          onChangeText={setPassword}
          placeholder="Enter new password"
          secureTextEntry
          required
        />

        <FormInput
          label="Confirm Password"
          value={confirmPassword}
          onChangeText={setConfirmPassword}
          placeholder="Confirm new password"
          secureTextEntry
          required
        />

        <View style={styles.passwordRequirements}>
          <Text style={styles.requirementsTitle}>Password Requirements:</Text>
          <View style={styles.requirementItem}>
            <Ionicons
              name={password.length >= 8 ? "checkmark-circle" : "ellipse-outline"}
              size={16}
              color={password.length >= 8 ? COLORS.success as string : COLORS.gray[500]}
            />
            <Text style={styles.requirementText}>At least 8 characters</Text>
          </View>
          <View style={styles.requirementItem}>
            <Ionicons
              name={/[A-Z]/.test(password) ? "checkmark-circle" : "ellipse-outline"}
              size={16}
              color={/[A-Z]/.test(password) ? COLORS.success as string : COLORS.gray[500]}
            />
            <Text style={styles.requirementText}>At least one uppercase letter</Text>
          </View>
          <View style={styles.requirementItem}>
            <Ionicons
              name={/[0-9]/.test(password) ? "checkmark-circle" : "ellipse-outline"}
              size={16}
              color={/[0-9]/.test(password) ? COLORS.success as string : COLORS.gray[500]}
            />
            <Text style={styles.requirementText}>At least one number</Text>
          </View>
        </View>

        <Button
          title={isLoading ? "Resetting..." : "Reset Password"}
          onPress={handleResetPassword}
          type="primary"
          style={styles.button}
          disabled={isLoading}
          icon={isLoading ? <ActivityIndicator size="small" color={COLORS.white} /> : null}
        />
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
    color: COLORS.gray[500],
    marginBottom: 24,
    lineHeight: 22,
  },
  passwordRequirements: {
    marginTop: 16,
    marginBottom: 24,
  },
  requirementsTitle: {
    fontSize: 14,
    fontWeight: "600",
    color: COLORS.darkGray,
    marginBottom: 8,
  },
  requirementItem: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  requirementText: {
    fontSize: 14,
    color: COLORS.gray[500],
    marginLeft: 8,
  },
  button: {
    marginTop: 16,
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
    backgroundColor: "rgba(76, 175, 80, 0.1)",
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
    color: COLORS.gray[500],
    textAlign: "center",
    marginBottom: 32,
    lineHeight: 22,
  },
})

export default ResetPasswordScreen

