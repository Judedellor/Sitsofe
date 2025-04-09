"use client"

import type React from "react"
import { useState } from "react"
import { View, Text, StyleSheet, ScrollView, TextInput, Switch, Platform, Image } from "react-native"
import { Ionicons } from "@expo/vector-icons"
import { BackButton } from "../components/BackButton"
import { AccessibleTouchable } from "../components/AccessibleTouchable"

/**
 * A screen to demonstrate and test screen reader functionality
 */
export const ScreenReaderDemoScreen: React.FC = () => {
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [notificationsEnabled, setNotificationsEnabled] = useState(false)
  const [darkModeEnabled, setDarkModeEnabled] = useState(false)
  const [showError, setShowError] = useState(false)

  const handleSubmit = () => {
    if (!name || !email) {
      setShowError(true)
    } else {
      setShowError(false)
      // Handle submission
    }
  }

  return (
    <View style={[styles.container, darkModeEnabled && styles.darkContainer]}>
      <View style={[styles.header, darkModeEnabled && styles.darkHeader]}>
        <BackButton title="Screen Reader Demo" color={darkModeEnabled ? "#FFFFFF" : "#007AFF"} />
      </View>

      <ScrollView style={styles.content}>
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, darkModeEnabled && styles.darkText]} accessibilityRole="header">
            Screen Reader Testing Demo
          </Text>

          <Text style={[styles.description, darkModeEnabled && styles.darkText]}>
            This screen demonstrates proper screen reader implementation. Enable VoiceOver (iOS) or TalkBack (Android)
            to test.
          </Text>
        </View>

        <View style={[styles.card, darkModeEnabled && styles.darkCard]}>
          <View style={styles.imageContainer}>
            <Image
              source={{ uri: "/placeholder.svg?height=100&width=100" }}
              style={styles.image}
              accessibilityLabel="Profile avatar placeholder"
            />
            <View style={styles.imageBadge}>
              <Ionicons name="camera" size={16} color="#FFFFFF" />
            </View>
          </View>

          <Text style={[styles.cardTitle, darkModeEnabled && styles.darkText]}>Profile Information</Text>

          <View style={styles.formGroup}>
            <Text style={[styles.label, darkModeEnabled && styles.darkText]}>Name</Text>
            <TextInput
              style={[styles.input, darkModeEnabled && styles.darkInput]}
              value={name}
              onChangeText={setName}
              placeholder="Enter your name"
              placeholderTextColor={darkModeEnabled ? "#8E8E93" : "#C7C7CC"}
              accessibilityLabel="Name input field"
              accessibilityHint="Enter your full name"
            />
          </View>

          <View style={styles.formGroup}>
            <Text style={[styles.label, darkModeEnabled && styles.darkText]}>Email</Text>
            <TextInput
              style={[styles.input, darkModeEnabled && styles.darkInput]}
              value={email}
              onChangeText={setEmail}
              placeholder="Enter your email"
              placeholderTextColor={darkModeEnabled ? "#8E8E93" : "#C7C7CC"}
              keyboardType="email-address"
              accessibilityLabel="Email input field"
              accessibilityHint="Enter your email address"
            />
          </View>

          {showError && (
            <View style={styles.errorContainer} accessibilityLiveRegion="polite">
              <Ionicons name="alert-circle" size={18} color="#FF3B30" />
              <Text style={styles.errorText}>Please fill in all required fields</Text>
            </View>
          )}
        </View>

        <View style={[styles.card, darkModeEnabled && styles.darkCard]}>
          <Text style={[styles.cardTitle, darkModeEnabled && styles.darkText]}>Preferences</Text>

          <View style={styles.preferenceRow}>
            <View style={styles.preferenceTextContainer}>
              <Text style={[styles.preferenceLabel, darkModeEnabled && styles.darkText]}>Enable Notifications</Text>
              <Text style={[styles.preferenceDescription, darkModeEnabled && styles.darkSecondaryText]}>
                Receive alerts about property updates
              </Text>
            </View>
            <Switch
              value={notificationsEnabled}
              onValueChange={setNotificationsEnabled}
              accessibilityLabel="Enable notifications"
              accessibilityHint={
                notificationsEnabled ? "Double tap to disable notifications" : "Double tap to enable notifications"
              }
              trackColor={{ false: "#D1D1D6", true: "#34C759" }}
              thumbColor={Platform.OS === "ios" ? "#FFFFFF" : notificationsEnabled ? "#FFFFFF" : "#F4F3F4"}
            />
          </View>

          <View style={styles.divider} />

          <View style={styles.preferenceRow}>
            <View style={styles.preferenceTextContainer}>
              <Text style={[styles.preferenceLabel, darkModeEnabled && styles.darkText]}>Dark Mode</Text>
              <Text style={[styles.preferenceDescription, darkModeEnabled && styles.darkSecondaryText]}>
                Switch to dark color theme
              </Text>
            </View>
            <Switch
              value={darkModeEnabled}
              onValueChange={setDarkModeEnabled}
              accessibilityLabel="Enable dark mode"
              accessibilityHint={darkModeEnabled ? "Double tap to disable dark mode" : "Double tap to enable dark mode"}
              trackColor={{ false: "#D1D1D6", true: "#34C759" }}
              thumbColor={Platform.OS === "ios" ? "#FFFFFF" : darkModeEnabled ? "#FFFFFF" : "#F4F3F4"}
            />
          </View>
        </View>

        <View style={styles.buttonContainer}>
          <AccessibleTouchable
            onPress={handleSubmit}
            accessibilityLabel="Save changes"
            accessibilityHint="Save your profile information and preferences"
            accessibilityRole="button"
            style={styles.submitButton}
          >
            <Text style={styles.submitButtonText}>Save Changes</Text>
          </AccessibleTouchable>

          <AccessibleTouchable
            accessibilityLabel="Cancel"
            accessibilityHint="Discard changes and go back"
            accessibilityRole="button"
            style={styles.cancelButton}
          >
            <Text style={styles.cancelButtonText}>Cancel</Text>
          </AccessibleTouchable>
        </View>

        <View style={[styles.card, darkModeEnabled && styles.darkCard]}>
          <Text style={[styles.cardTitle, darkModeEnabled && styles.darkText]}>Screen Reader Tips</Text>

          <View style={styles.tipContainer}>
            <Ionicons
              name="information-circle"
              size={20}
              color={darkModeEnabled ? "#0A84FF" : "#007AFF"}
              style={styles.tipIcon}
            />
            <Text style={[styles.tipText, darkModeEnabled && styles.darkText]}>
              All interactive elements have proper accessibility labels
            </Text>
          </View>

          <View style={styles.tipContainer}>
            <Ionicons
              name="information-circle"
              size={20}
              color={darkModeEnabled ? "#0A84FF" : "#007AFF"}
              style={styles.tipIcon}
            />
            <Text style={[styles.tipText, darkModeEnabled && styles.darkText]}>
              Error messages use accessibilityLiveRegion to announce changes
            </Text>
          </View>

          <View style={styles.tipContainer}>
            <Ionicons
              name="information-circle"
              size={20}
              color={darkModeEnabled ? "#0A84FF" : "#007AFF"}
              style={styles.tipIcon}
            />
            <Text style={[styles.tipText, darkModeEnabled && styles.darkText]}>Images have descriptive alt text</Text>
          </View>

          <View style={styles.tipContainer}>
            <Ionicons
              name="information-circle"
              size={20}
              color={darkModeEnabled ? "#0A84FF" : "#007AFF"}
              style={styles.tipIcon}
            />
            <Text style={[styles.tipText, darkModeEnabled && styles.darkText]}>
              Proper heading structure is used for screen hierarchy
            </Text>
          </View>
        </View>
      </ScrollView>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F2F2F7",
  },
  darkContainer: {
    backgroundColor: "#1C1C1E",
  },
  header: {
    paddingTop: Platform.OS === "ios" ? 50 : 20,
    paddingBottom: 10,
    backgroundColor: "#FFFFFF",
    borderBottomWidth: 1,
    borderBottomColor: "#E0E0E0",
  },
  darkHeader: {
    backgroundColor: "#2C2C2E",
    borderBottomColor: "#38383A",
  },
  content: {
    flex: 1,
    padding: 16,
  },
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: "700",
    marginBottom: 8,
    color: "#000000",
  },
  description: {
    fontSize: 16,
    lineHeight: 22,
    color: "#666666",
  },
  darkText: {
    color: "#FFFFFF",
  },
  darkSecondaryText: {
    color: "#8E8E93",
  },
  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  darkCard: {
    backgroundColor: "#2C2C2E",
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 16,
    color: "#000000",
  },
  imageContainer: {
    alignItems: "center",
    marginBottom: 20,
    position: "relative",
  },
  image: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: "#E0E0E0",
  },
  imageBadge: {
    position: "absolute",
    bottom: 0,
    right: "35%",
    backgroundColor: "#007AFF",
    width: 30,
    height: 30,
    borderRadius: 15,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 2,
    borderColor: "#FFFFFF",
  },
  formGroup: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    fontWeight: "500",
    marginBottom: 8,
    color: "#000000",
  },
  input: {
    borderWidth: 1,
    borderColor: "#E0E0E0",
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    backgroundColor: "#FFFFFF",
    color: "#000000",
  },
  darkInput: {
    borderColor: "#38383A",
    backgroundColor: "#1C1C1E",
    color: "#FFFFFF",
  },
  errorContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFF2F2",
    padding: 12,
    borderRadius: 8,
    marginBottom: 16,
  },
  errorText: {
    color: "#FF3B30",
    marginLeft: 8,
    fontSize: 14,
  },
  preferenceRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 12,
  },
  preferenceTextContainer: {
    flex: 1,
  },
  preferenceLabel: {
    fontSize: 16,
    fontWeight: "500",
    color: "#000000",
  },
  preferenceDescription: {
    fontSize: 14,
    color: "#8E8E93",
    marginTop: 4,
  },
  divider: {
    height: 1,
    backgroundColor: "#E0E0E0",
  },
  buttonContainer: {
    marginBottom: 24,
  },
  submitButton: {
    backgroundColor: "#007AFF",
    borderRadius: 8,
    padding: 16,
    alignItems: "center",
    marginBottom: 12,
  },
  submitButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "600",
  },
  cancelButton: {
    backgroundColor: "#F2F2F7",
    borderRadius: 8,
    padding: 16,
    alignItems: "center",
  },
  cancelButtonText: {
    color: "#007AFF",
    fontSize: 16,
    fontWeight: "600",
  },
  tipContainer: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: 12,
  },
  tipIcon: {
    marginRight: 8,
    marginTop: 2,
  },
  tipText: {
    fontSize: 14,
    lineHeight: 20,
    color: "#666666",
    flex: 1,
  },
})

