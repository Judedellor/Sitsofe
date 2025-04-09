"use client"

import React, { useState } from "react"
import { View, Text, StyleSheet, Switch, TouchableOpacity, ScrollView, Alert } from "react-native"
import { Ionicons } from "@expo/vector-icons"
import { useNavigation } from "@react-navigation/native"
import { NativeStackNavigationProp } from "@react-navigation/native-stack"
import { COLORS } from "../constants/colors"

// Define types
type RootStackParamList = {
  Settings: undefined
  ChangePassword: undefined
  PaymentMethods: undefined
  LegalPrivacy: undefined
  HelpCenter: undefined
  ContactSupport: undefined
  About: undefined
  Login: undefined
}

type NavigationProp = NativeStackNavigationProp<RootStackParamList, 'Settings'>

interface SettingItemProps {
  icon: {
    name: keyof typeof Ionicons.glyphMap
    backgroundColor: string
  }
  title: string
  subtitle?: string
  type: "switch" | "navigate"
  value?: boolean
  onValueChange?: (value: boolean) => void
  onPress?: () => void
}

interface SectionHeaderProps {
  title: string
}

const SettingItem: React.FC<SettingItemProps> = ({ icon, title, subtitle, type, value, onValueChange, onPress }) => {
  const renderControl = () => {
    if (type === "switch") {
      return (
        <Switch
          value={value}
          onValueChange={onValueChange}
          trackColor={{ false: COLORS.gray[300], true: COLORS.primaryLight }}
          thumbColor={value ? COLORS.primary : COLORS.gray[100]}
        />
      )
    } else if (type === "navigate") {
      return <Ionicons name="chevron-forward" size={20} color={COLORS.gray[400]} />
    }
    return null
  }

  return (
    <TouchableOpacity style={styles.settingItem} disabled={type === "switch"} onPress={onPress}>
      <View style={[styles.iconContainer, { backgroundColor: icon.backgroundColor }]}>
        <Ionicons name={icon.name} size={22} color={COLORS.white} />
      </View>

      <View style={styles.settingInfo}>
        <Text style={styles.settingTitle}>{title}</Text>
        {subtitle && <Text style={styles.settingSubtitle}>{subtitle}</Text>}
      </View>

      <View style={styles.settingControl}>{renderControl()}</View>
    </TouchableOpacity>
  )
}

const SectionHeader: React.FC<SectionHeaderProps> = ({ title }) => (
  <View style={styles.sectionHeader}>
    <Text style={styles.sectionTitle}>{title}</Text>
  </View>
)

const SettingsScreen: React.FC = () => {
  const navigation = useNavigation<NavigationProp>()
  const [notificationsEnabled, setNotificationsEnabled] = useState(true)
  const [darkMode, setDarkMode] = useState(false)
  const [emailAlerts, setEmailAlerts] = useState(true)
  const [autoSync, setAutoSync] = useState(true)

  const handleLogout = () => {
    Alert.alert("Logout", "Are you sure you want to logout?", [
      {
        text: "Cancel",
        style: "cancel",
      },
      {
        text: "Logout",
        style: "destructive",
        onPress: () => {
          // TODO: Implement logout logic
          navigation.reset({
            index: 0,
            routes: [{ name: "Login" }],
          })
        },
      },
    ])
  }

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Settings</Text>
      </View>

      <View style={styles.profileCard}>
        <View style={styles.profileIconContainer}>
          <Text style={styles.profileIcon}>JD</Text>
        </View>
        <View style={styles.profileInfo}>
          <Text style={styles.profileName}>John Doe</Text>
          <Text style={styles.profileEmail}>john.doe@example.com</Text>
        </View>
        <TouchableOpacity style={styles.editButton}>
          <Text style={styles.editButtonText}>Edit</Text>
        </TouchableOpacity>
      </View>

      <SectionHeader title="Preferences" />
      <View style={styles.settingsGroup}>
        <SettingItem
          icon={{ name: "notifications", backgroundColor: COLORS.warning }}
          title="Notifications"
          subtitle="Enable push notifications"
          type="switch"
          value={notificationsEnabled}
          onValueChange={setNotificationsEnabled}
        />
        <SettingItem
          icon={{ name: "moon", backgroundColor: COLORS.purple }}
          title="Dark Mode"
          subtitle="Switch to dark theme"
          type="switch"
          value={darkMode}
          onValueChange={setDarkMode}
        />
        <SettingItem
          icon={{ name: "mail", backgroundColor: COLORS.error }}
          title="Email Alerts"
          subtitle="Receive alerts via email"
          type="switch"
          value={emailAlerts}
          onValueChange={setEmailAlerts}
        />
        <SettingItem
          icon={{ name: "sync", backgroundColor: COLORS.success }}
          title="Auto Sync"
          subtitle="Sync data automatically"
          type="switch"
          value={autoSync}
          onValueChange={setAutoSync}
        />
      </View>

      <SectionHeader title="Account" />
      <View style={styles.settingsGroup}>
        <SettingItem
          icon={{ name: "lock-closed", backgroundColor: COLORS.primary }}
          title="Change Password"
          type="navigate"
          onPress={() => navigation.navigate("ChangePassword")}
        />
        <SettingItem
          icon={{ name: "card", backgroundColor: COLORS.gray[600] }}
          title="Payment Methods"
          type="navigate"
          onPress={() => navigation.navigate("PaymentMethods")}
        />
        <SettingItem
          icon={{ name: "document-text", backgroundColor: COLORS.cyan }}
          title="Legal & Privacy"
          type="navigate"
          onPress={() => navigation.navigate("LegalPrivacy")}
        />
      </View>

      <SectionHeader title="Support" />
      <View style={styles.settingsGroup}>
        <SettingItem
          icon={{ name: "help-circle", backgroundColor: COLORS.orange }}
          title="Help Center"
          type="navigate"
          onPress={() => navigation.navigate("HelpCenter")}
        />
        <SettingItem
          icon={{ name: "chatbubble-ellipses", backgroundColor: COLORS.success }}
          title="Contact Support"
          type="navigate"
          onPress={() => navigation.navigate("ContactSupport")}
        />
        <SettingItem
          icon={{ name: "information-circle", backgroundColor: COLORS.primary }}
          title="About"
          subtitle="Version 1.0.0"
          type="navigate"
          onPress={() => navigation.navigate("About")}
        />
      </View>

      <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
        <Text style={styles.logoutButtonText}>Logout</Text>
      </TouchableOpacity>
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
    padding: 16,
  },
  header: {
    marginBottom: 24,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: "bold",
    color: COLORS.darkGray,
  },
  profileCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: COLORS.white,
    borderRadius: 12,
    padding: 16,
    marginBottom: 24,
    shadowColor: COLORS.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  profileIconContainer: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: COLORS.primary,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 16,
  },
  profileIcon: {
    fontSize: 20,
    fontWeight: "bold",
    color: COLORS.white,
  },
  profileInfo: {
    flex: 1,
  },
  profileName: {
    fontSize: 18,
    fontWeight: "600",
    color: COLORS.darkGray,
    marginBottom: 4,
  },
  profileEmail: {
    fontSize: 14,
    color: COLORS.gray[600],
  },
  editButton: {
    padding: 8,
  },
  editButtonText: {
    fontSize: 14,
    color: COLORS.primary,
    fontWeight: "500",
  },
  sectionHeader: {
    marginVertical: 12,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: COLORS.gray[600],
    marginBottom: 8,
    textTransform: "uppercase",
  },
  settingsGroup: {
    backgroundColor: COLORS.white,
    borderRadius: 12,
    marginBottom: 24,
    shadowColor: COLORS.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  settingItem: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.gray[100],
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 16,
  },
  settingInfo: {
    flex: 1,
  },
  settingTitle: {
    fontSize: 16,
    color: COLORS.darkGray,
    marginBottom: 4,
  },
  settingSubtitle: {
    fontSize: 14,
    color: COLORS.gray[500],
  },
  settingControl: {
    marginLeft: 16,
  },
  logoutButton: {
    backgroundColor: COLORS.error,
    borderRadius: 12,
    padding: 16,
    alignItems: "center",
    marginBottom: 24,
  },
  logoutButtonText: {
    color: COLORS.white,
    fontSize: 16,
    fontWeight: "600",
  },
})

export default SettingsScreen

