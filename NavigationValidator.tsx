"use client"

import { useState } from "react"
import { View, Text, StyleSheet, ScrollView } from "react-native"
import { SafeAreaView } from "react-native-safe-area-context"
import { COLORS } from "../constants/colors"
import { Ionicons } from "@expo/vector-icons"
import { useNavigation } from "@react-navigation/native"
import AccessibleTouchable from "../components/AccessibleTouchable"

// Define all expected navigation paths
const expectedNavigationPaths = [
  {
    from: "HomeScreen",
    to: "SmartBuildingDashboard",
    params: { propertyId: "prop1" },
    description: "Home to Smart Building Dashboard",
  },
  {
    from: "PropertyDetailScreen",
    to: "SmartBuildingDashboard",
    params: { propertyId: "1" },
    description: "Property Detail to Smart Building Dashboard",
  },
  {
    from: "TenantPortalScreen",
    to: "SmartHome",
    params: {},
    description: "Tenant Portal to Smart Home Controls",
  },
  {
    from: "SmartBuildingDashboard",
    to: "EnergyManagement",
    params: { propertyId: "prop1" },
    description: "Dashboard to Energy Management",
  },
  {
    from: "SmartBuildingDashboard",
    to: "AccessControl",
    params: { propertyId: "prop1" },
    description: "Dashboard to Access Control",
  },
  {
    from: "SmartBuildingDashboard",
    to: "SmartBuildingAlerts",
    params: { propertyId: "prop1" },
    description: "Dashboard to Alerts",
  },
  {
    from: "SmartBuildingDashboard",
    to: "AddSmartDevice",
    params: { propertyId: "prop1" },
    description: "Dashboard to Add Device",
  },
  {
    from: "SmartBuildingDashboard",
    to: "SmartDeviceDetail",
    params: { deviceId: "dev1" },
    description: "Dashboard to Device Detail",
  },
]

const NavigationValidator = () => {
  const navigation = useNavigation()
  const [results, setResults] = useState<Array<{ path: string; status: "success" | "failure"; error?: string }>>([])
  const [testing, setTesting] = useState(false)

  const testNavigation = async () => {
    setTesting(true)
    setResults([])

    // Test each navigation path
    for (const path of expectedNavigationPaths) {
      try {
        // Attempt navigation
        navigation.navigate(path.to as never, path.params as never)

        // Wait a moment to see if navigation succeeds
        await new Promise((resolve) => setTimeout(resolve, 500))

        // Record success
        setResults((prev) => [
          ...prev,
          {
            path: path.description,
            status: "success",
          },
        ])

        // Navigate back
        navigation.goBack()

        // Wait before next test
        await new Promise((resolve) => setTimeout(resolve, 300))
      } catch (error) {
        // Record failure
        setResults((prev) => [
          ...prev,
          {
            path: path.description,
            status: "failure",
            error: error instanceof Error ? error.message : String(error),
          },
        ])
      }
    }

    setTesting(false)
  }

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      <View style={styles.header}>
        <AccessibleTouchable
          onPress={() => navigation.goBack()}
          style={styles.backButton}
          accessibilityLabel="Go back"
          accessibilityRole="button"
        >
          <Ionicons name="arrow-back" size={24} color={COLORS.darkGray} />
        </AccessibleTouchable>
        <Text style={styles.headerTitle}>Navigation Validator</Text>
      </View>

      <View style={styles.content}>
        <Text style={styles.description}>
          This tool tests all navigation paths in the Smart Building Integration to ensure they work correctly.
        </Text>

        <AccessibleTouchable
          style={[styles.testButton, testing && styles.testingButton]}
          onPress={testNavigation}
          disabled={testing}
          accessibilityLabel={testing ? "Testing navigation paths" : "Test all navigation paths"}
          accessibilityHint="Validates that all screen transitions work correctly"
          accessibilityRole="button"
        >
          <Text style={styles.testButtonText}>{testing ? "Testing Navigation..." : "Test All Navigation Paths"}</Text>
        </AccessibleTouchable>

        <ScrollView style={styles.resultsContainer} accessibilityLabel="Navigation test results">
          {results.map((result, index) => (
            <View
              key={index}
              style={[styles.resultItem, result.status === "success" ? styles.successItem : styles.failureItem]}
              accessible={true}
              accessibilityLabel={`${result.path}: ${result.status === "success" ? "Success" : "Failed"}`}
            >
              <View style={styles.resultHeader}>
                <Ionicons
                  name={result.status === "success" ? "checkmark-circle" : "alert-circle"}
                  size={20}
                  color={result.status === "success" ? COLORS.success : COLORS.error}
                />
                <Text style={styles.resultPath}>{result.path}</Text>
              </View>

              {result.error && <Text style={styles.errorText}>{result.error}</Text>}
            </View>
          ))}

          {results.length > 0 && (
            <View style={styles.summary}>
              <Text style={styles.summaryText}>
                {results.filter((r) => r.status === "success").length} of {results.length} paths successful
              </Text>
            </View>
          )}
        </ScrollView>
      </View>
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
    borderBottomWidth: 1,
    borderBottomColor: COLORS.lightGray,
    backgroundColor: COLORS.white,
  },
  backButton: {
    marginRight: 16,
    padding: 8, // Increased touch target
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
  description: {
    fontSize: 16,
    color: COLORS.darkGray,
    marginBottom: 20,
    lineHeight: 22,
  },
  testButton: {
    backgroundColor: COLORS.primary,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: "center",
    marginBottom: 20,
    minHeight: 48, // Ensure minimum touch target size
  },
  testingButton: {
    backgroundColor: COLORS.gray,
  },
  testButtonText: {
    color: COLORS.white,
    fontSize: 16,
    fontWeight: "bold",
  },
  resultsContainer: {
    flex: 1,
  },
  resultItem: {
    padding: 12,
    borderRadius: 8,
    marginBottom: 8,
  },
  successItem: {
    backgroundColor: "rgba(76, 175, 80, 0.1)",
    borderLeftWidth: 4,
    borderLeftColor: COLORS.success,
  },
  failureItem: {
    backgroundColor: "rgba(244, 67, 54, 0.1)",
    borderLeftWidth: 4,
    borderLeftColor: COLORS.error,
  },
  resultHeader: {
    flexDirection: "row",
    alignItems: "center",
  },
  resultPath: {
    fontSize: 14,
    fontWeight: "500",
    marginLeft: 8,
    color: COLORS.darkGray,
  },
  errorText: {
    fontSize: 12,
    color: COLORS.error,
    marginTop: 4,
    marginLeft: 28,
  },
  summary: {
    marginTop: 16,
    padding: 16,
    backgroundColor: COLORS.white,
    borderRadius: 8,
    alignItems: "center",
  },
  summaryText: {
    fontSize: 16,
    fontWeight: "bold",
    color: COLORS.darkGray,
  },
})

export default NavigationValidator

