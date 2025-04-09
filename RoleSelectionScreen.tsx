"use client"

import React from "react"
import { useState } from "react"
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, ActivityIndicator } from "react-native"
import { SafeAreaView } from "react-native-safe-area-context"
import { COLORS } from "../constants/colors"
import { Ionicons } from "@expo/vector-icons"
import { useNavigation, useRoute, RouteProp } from "@react-navigation/native"
import { NativeStackNavigationProp } from "@react-navigation/native-stack"
import { useAuth, type UserRole } from "../context/AuthContext"

type RootStackParamList = {
  Main: undefined;
  TenantPortal: undefined;
  MaintenanceList: undefined;
  RoleSelection: {
    firstName: string;
    email: string;
    password: string;
  };
};

type NavigationProp = NativeStackNavigationProp<RootStackParamList, 'RoleSelection'>;
type RouteProps = RouteProp<RootStackParamList, 'RoleSelection'>;

type RoleOption = {
  id: UserRole;
  title: string;
  description: string;
  icon: string;
};

const RoleSelectionScreen = () => {
  const navigation = useNavigation<NavigationProp>();
  const route = useRoute<RouteProps>();
  const { register, isLoading } = useAuth();
  const [selectedRole, setSelectedRole] = useState<UserRole | null>(null);

  // Get user data from previous screen
  const { firstName, email, password } = route.params;

  const roleOptions: RoleOption[] = [
    {
      id: "property_manager",
      title: "Property Manager",
      description: "Manage properties, tenants, and maintenance requests.",
      icon: "business",
    },
    {
      id: "tenant",
      title: "Tenant",
      description: "Pay rent, submit maintenance requests, and communicate with your property manager.",
      icon: "home",
    },
    {
      id: "maintenance_staff",
      title: "Maintenance Staff",
      description: "Receive and complete maintenance requests.",
      icon: "construct",
    },
  ]

  const handleContinue = async () => {
    if (!selectedRole || !firstName || !email || !password) {
      return
    }

    const success = await register(firstName, email, password, selectedRole)

    if (success) {
      // Navigate based on role
      if (selectedRole === "property_manager") {
        navigation.reset({
          index: 0,
          routes: [{ name: "Main" as never }],
        })
      } else if (selectedRole === "tenant") {
        navigation.reset({
          index: 0,
          routes: [{ name: "TenantPortal" as never }],
        })
      } else if (selectedRole === "maintenance_staff") {
        navigation.reset({
          index: 0,
          routes: [{ name: "MaintenanceList" as never }],
        })
      }
    }
  }

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()} disabled={isLoading}>
          <Ionicons name="arrow-back" size={24} color={COLORS.darkGray} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Select Your Role</Text>
      </View>

      <ScrollView style={styles.content}>
        <Text style={styles.subtitle}>
          Choose how you'll be using Property Manager. You can change this later in settings.
        </Text>

        <View style={styles.rolesContainer}>
          {roleOptions.map((role) => (
            <TouchableOpacity
              key={role.id}
              style={[styles.roleCard, selectedRole === role.id && styles.selectedRoleCard]}
              onPress={() => setSelectedRole(role.id)}
              disabled={isLoading}
            >
              <View style={[styles.iconContainer, selectedRole === role.id && styles.selectedIconContainer]}>
                <Ionicons
                  name={role.icon as any}
                  size={32}
                  color={selectedRole === role.id ? COLORS.white : COLORS.primary}
                />
              </View>
              <Text style={styles.roleTitle}>{role.title}</Text>
              <Text style={styles.roleDescription}>{role.description}</Text>

              {selectedRole === role.id && (
                <View style={styles.checkmark}>
                  <Ionicons name="checkmark-circle" size={24} color={COLORS.primary} />
                </View>
              )}
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <TouchableOpacity
          style={[styles.continueButton, (!selectedRole || isLoading) && styles.disabledButton]}
          onPress={handleContinue}
          disabled={!selectedRole || isLoading}
        >
          {isLoading ? (
            <ActivityIndicator color={COLORS.white} />
          ) : (
            <Text style={styles.continueButtonText}>Continue</Text>
          )}
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
    padding: 16,
  },
  subtitle: {
    fontSize: 16,
    color: COLORS.gray[500],
    marginBottom: 24,
    lineHeight: 22,
  },
  rolesContainer: {
    marginBottom: 24,
  },
  roleCard: {
    backgroundColor: COLORS.white,
    borderRadius: 12,
    padding: 20,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: COLORS.lightGray,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
    position: "relative",
  },
  selectedRoleCard: {
    borderColor: COLORS.primary,
    borderWidth: 2,
  },
  iconContainer: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: COLORS.background,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 16,
  },
  selectedIconContainer: {
    backgroundColor: COLORS.primary,
  },
  roleTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: COLORS.darkGray,
    marginBottom: 8,
  },
  roleDescription: {
    fontSize: 14,
    color: COLORS.gray[500],
    lineHeight: 20,
  },
  checkmark: {
    position: "absolute",
    top: 16,
    right: 16,
  },
  footer: {
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: COLORS.lightGray,
  },
  continueButton: {
    backgroundColor: COLORS.primary,
    borderRadius: 8,
    paddingVertical: 16,
    alignItems: "center",
  },
  disabledButton: {
    backgroundColor: COLORS.lightGray,
  },
  continueButtonText: {
    color: COLORS.white,
    fontSize: 16,
    fontWeight: "bold",
  },
})

export default RoleSelectionScreen

