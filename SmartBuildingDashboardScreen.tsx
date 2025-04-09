// Update the SmartBuildingDashboardScreen to include loading states, error handling, and accessibility improvements

"use client"

import React from 'react';
import { useState, useEffect, useRef } from "react"
import { View, Text, StyleSheet, ScrollView, Switch, RefreshControl } from "react-native"
import { SafeAreaView } from "react-native-safe-area-context"
import { COLORS } from "../constants/colors"
import Card from "../components/ui/Card"
import { Ionicons } from "@expo/vector-icons"
import { LineChart } from "react-native-chart-kit"
import { Dimensions } from "react-native"
import { useNavigation, NavigationProp } from "@react-navigation/native"
import LoadingState from "../components/LoadingState"
import ErrorState from "../components/ErrorState"
import { AccessibleTouchable } from "../components/AccessibleTouchable"
import { runAccessibilityAudit } from "../utils/accessibilityAudit"

// Types for IoT devices
interface IoTDevice {
  id: string
  name: string
  type: "thermostat" | "lock" | "camera" | "sensor" | "light" | "outlet"
  status: "online" | "offline" | "maintenance"
  value?: number | boolean
  unit?: string
  location: string
  propertyId: string
  unitId?: string
  lastUpdated: string
  batteryLevel?: number
}

// Types for properties with smart devices
interface SmartProperty {
  id: string
  name: string
  address: string
  deviceCount: number
  onlineCount: number
  energyUsage: number
  securityStatus: "secure" | "alert" | "warning"
}

// Types for energy data
interface EnergyData {
  date: string
  usage: number
}

// Types for alerts
interface Alert {
  id: string
  type: "security" | "maintenance" | "energy" | "access"
  message: string
  timestamp: string
  priority: "low" | "medium" | "high"
  propertyId: string
  deviceId?: string
  unitId?: string
  resolved: boolean
}

// Add navigation type
type RootStackParamList = {
  SmartDeviceDetail: { deviceId: string }
  EnergyManagement: { propertyId: string }
  AccessControl: { propertyId: string }
  SmartBuildingAlerts: { propertyId: string }
  AddSmartDevice: { propertyId: string }
}

type NavigationType = NavigationProp<RootStackParamList>

// Mock data for smart properties
const mockSmartProperties: SmartProperty[] = [
  {
    id: "prop1",
    name: "Sunset Apartments",
    address: "123 Main St, Anytown, USA",
    deviceCount: 48,
    onlineCount: 45,
    energyUsage: 427,
    securityStatus: "secure",
  },
  {
    id: "prop2",
    name: "Riverside Condos",
    address: "456 River Rd, Anytown, USA",
    deviceCount: 36,
    onlineCount: 32,
    energyUsage: 315,
    securityStatus: "warning",
  },
  {
    id: "prop3",
    name: "Mountain View Homes",
    address: "789 Mountain Dr, Anytown, USA",
    deviceCount: 24,
    onlineCount: 22,
    energyUsage: 210,
    securityStatus: "secure",
  },
]

// Mock data for IoT devices
const mockIoTDevices: IoTDevice[] = [
  {
    id: "dev1",
    name: "Living Room Thermostat",
    type: "thermostat",
    status: "online",
    value: 72,
    unit: "°F",
    location: "Unit 101",
    propertyId: "prop1",
    unitId: "unit101",
    lastUpdated: "2023-04-15T14:30:00Z",
    batteryLevel: 85,
  },
  {
    id: "dev2",
    name: "Front Door Lock",
    type: "lock",
    status: "online",
    value: true, // locked
    location: "Unit 101",
    propertyId: "prop1",
    unitId: "unit101",
    lastUpdated: "2023-04-15T14:35:00Z",
    batteryLevel: 90,
  },
  {
    id: "dev3",
    name: "Security Camera",
    type: "camera",
    status: "online",
    location: "Hallway",
    propertyId: "prop1",
    lastUpdated: "2023-04-15T14:32:00Z",
  },
  {
    id: "dev4",
    name: "Water Leak Sensor",
    type: "sensor",
    status: "online",
    value: false, // no leak
    location: "Unit 102 Bathroom",
    propertyId: "prop1",
    unitId: "unit102",
    lastUpdated: "2023-04-15T14:20:00Z",
    batteryLevel: 75,
  },
  {
    id: "dev5",
    name: "Bedroom Thermostat",
    type: "thermostat",
    status: "offline",
    value: 70,
    unit: "°F",
    location: "Unit 102",
    propertyId: "prop1",
    unitId: "unit102",
    lastUpdated: "2023-04-15T10:30:00Z",
    batteryLevel: 15,
  },
  {
    id: "dev6",
    name: "Living Room Lights",
    type: "light",
    status: "online",
    value: false, // off
    location: "Unit 103",
    propertyId: "prop1",
    unitId: "unit103",
    lastUpdated: "2023-04-15T14:40:00Z",
  },
  {
    id: "dev7",
    name: "Smart Outlet",
    type: "outlet",
    status: "online",
    value: true, // on
    location: "Unit 103 Kitchen",
    propertyId: "prop1",
    unitId: "unit103",
    lastUpdated: "2023-04-15T14:38:00Z",
  },
  {
    id: "dev8",
    name: "Motion Sensor",
    type: "sensor",
    status: "online",
    value: false, // no motion
    location: "Lobby",
    propertyId: "prop1",
    lastUpdated: "2023-04-15T14:25:00Z",
    batteryLevel: 95,
  },
]

// Mock energy data for the past week
const mockEnergyData: EnergyData[] = [
  { date: "Mon", usage: 420 },
  { date: "Tue", usage: 430 },
  { date: "Wed", usage: 425 },
  { date: "Thu", usage: 440 },
  { date: "Fri", usage: 450 },
  { date: "Sat", usage: 470 },
  { date: "Sun", usage: 427 },
]

// Mock alerts
const mockAlerts: Alert[] = [
  {
    id: "alert1",
    type: "security",
    message: "Unauthorized access attempt at Unit 105",
    timestamp: "2023-04-15T13:45:00Z",
    priority: "high",
    propertyId: "prop1",
    deviceId: "dev2",
    resolved: false,
  },
  {
    id: "alert2",
    type: "maintenance",
    message: "Low battery on Bedroom Thermostat in Unit 102",
    timestamp: "2023-04-15T12:30:00Z",
    priority: "medium",
    propertyId: "prop1",
    deviceId: "dev5",
    resolved: false,
  },
  {
    id: "alert3",
    type: "energy",
    message: "Unusual energy consumption in Unit 103",
    timestamp: "2023-04-15T10:15:00Z",
    priority: "low",
    propertyId: "prop1",
    unitId: "unit103",
    resolved: true,
  },
  {
    id: "alert4",
    type: "access",
    message: "Maintenance access granted to Unit 101",
    timestamp: "2023-04-15T09:00:00Z",
    priority: "low",
    propertyId: "prop1",
    unitId: "unit101",
    resolved: true,
  },
]

const SmartBuildingDashboardScreen = () => {
  const navigation = useNavigation<NavigationType>()
  const [properties, setProperties] = useState<SmartProperty[]>([])
  const [devices, setDevices] = useState<IoTDevice[]>([])
  const [energyData, setEnergyData] = useState<EnergyData[]>([])
  const [alerts, setAlerts] = useState<Alert[]>([])
  const [selectedProperty, setSelectedProperty] = useState<string>("")
  const [refreshing, setRefreshing] = useState(false)
  const [filterStatus, setFilterStatus] = useState<"all" | "online" | "offline">("all")
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Remove refs since AccessibleTouchable doesn't support them
  const __DEV__ = process.env.NODE_ENV === "development"

  // Filter devices based on selected property and status filter
  const filteredDevices = devices.filter(
    (device) => device.propertyId === selectedProperty && (filterStatus === "all" || device.status === filterStatus),
  )

  // Filter alerts for selected property
  const propertyAlerts = alerts.filter((alert) => alert.propertyId === selectedProperty && !alert.resolved)

  // Get property details
  const selectedPropertyDetails = properties.find((prop) => prop.id === selectedProperty)

  // Fetch data function with error handling
  const fetchData = async () => {
    try {
      setIsLoading(true)
      setError(null)

      // Simulate API call with delay
      await new Promise((resolve) => setTimeout(resolve, 1500))

      // Set mock data (in a real app, this would be API responses)
      setProperties(mockSmartProperties)
      setDevices(mockIoTDevices)
      setEnergyData(mockEnergyData)
      setAlerts(mockAlerts)

      // Set initial selected property if not already set
      if (!selectedProperty && mockSmartProperties.length > 0) {
        setSelectedProperty(mockSmartProperties[0].id)
      }
    } catch (error) {
      console.error("Error fetching smart building data:", error)
      setError("Unable to load smart building data. Please check your connection and try again.")
    } finally {
      setIsLoading(false)
    }
  }

  // Initial data load
  useEffect(() => {
    fetchData()
  }, [])

  // Run accessibility audit in development
  useEffect(() => {
    if (__DEV__) {
      const runAudit = async () => {
        const issues = await runAccessibilityAudit([])
        if (issues.length > 0) {
          console.warn("Accessibility issues found:", issues)
        }
      }

      const timer = setTimeout(() => {
        runAudit()
      }, 2000)

      return () => clearTimeout(timer)
    }
  }, [])

  // Handle refresh
  const onRefresh = () => {
    setRefreshing(true)
    fetchData().finally(() => {
      setRefreshing(false)
    })
  }

  // Handle device toggle
  const handleDeviceToggle = (deviceId: string, newValue: boolean) => {
    try {
      setDevices(
        devices.map((device) =>
          device.id === deviceId ? { ...device, value: newValue, lastUpdated: new Date().toISOString() } : device,
        ),
      )
    } catch (error) {
      console.error("Error toggling device:", error)
      // Show a user-friendly error message
      alert("Unable to control device. Please try again.")
    }
  }

  // Handle alert resolution
  const handleResolveAlert = (alertId: string) => {
    try {
      setAlerts(alerts.map((alert) => (alert.id === alertId ? { ...alert, resolved: true } : alert)))
    } catch (error) {
      console.error("Error resolving alert:", error)
      alert("Unable to resolve alert. Please try again.")
    }
  }

  // Get icon for device type
  const getDeviceIcon = (type: string) => {
    switch (type) {
      case "thermostat":
        return "thermometer-outline"
      case "lock":
        return "lock-closed-outline"
      case "camera":
        return "videocam-outline"
      case "sensor":
        return "radio-outline"
      case "light":
        return "bulb-outline"
      case "outlet":
        return "flash-outline"
      default:
        return "hardware-chip-outline"
    }
  }

  // Get color for alert priority
  const getAlertColor = (priority: string): string => {
    switch (priority) {
      case "high":
        return COLORS.error as string
      case "medium":
        return COLORS.warning as string
      case "low":
        return COLORS.info as string
      default:
        return COLORS.gray[500]
    }
  }

  // Get icon for alert type
  const getAlertIcon = (type: string) => {
    switch (type) {
      case "security":
        return "shield-outline"
      case "maintenance":
        return "construct-outline"
      case "energy":
        return "flash-outline"
      case "access":
        return "key-outline"
      default:
        return "alert-circle-outline"
    }
  }

  // Format timestamp to readable time
  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp)
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
  }

  // Navigation handlers with error handling
  const navigateToDeviceDetail = (deviceId: string) => {
    try {
      navigation.navigate("SmartDeviceDetail", { deviceId })
    } catch (error) {
      console.error("Navigation error:", error)
      alert("Unable to navigate to device details. Please try again.")
    }
  }

  const navigateToEnergyManagement = () => {
    try {
      navigation.navigate("EnergyManagement", { propertyId: selectedProperty })
    } catch (error) {
      console.error("Navigation error:", error)
      alert("Unable to navigate to energy management. Please try again.")
    }
  }

  const navigateToAccessControl = () => {
    try {
      navigation.navigate("AccessControl", { propertyId: selectedProperty })
    } catch (error) {
      console.error("Navigation error:", error)
      alert("Unable to navigate to access control. Please try again.")
    }
  }

  const navigateToAlerts = () => {
    try {
      navigation.navigate("SmartBuildingAlerts", { propertyId: selectedProperty })
    } catch (error) {
      console.error("Navigation error:", error)
      alert("Unable to navigate to alerts. Please try again.")
    }
  }

  const navigateToAddDevice = () => {
    try {
      navigation.navigate("AddSmartDevice", { propertyId: selectedProperty })
    } catch (error) {
      console.error("Navigation error:", error)
      alert("Unable to navigate to add device. Please try again.")
    }
  }

  // Update color usage in components
  const getDeviceIconColor = (status: string): string => {
    return status === "online" ? COLORS.primary as string : COLORS.gray[500]
  }

  const getBackgroundColor = (status: string): string => {
    return status === "online" ? COLORS.primaryLight as string : COLORS.gray[200]
  }

  // If loading, show loading state
  if (isLoading) {
    return <LoadingState fullScreen message="Loading smart building data..." />
  }

  // If error, show error state
  if (error) {
    return <ErrorState message={error} onRetry={fetchData} fullScreen />
  }

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      <View style={styles.header}>
        <Text style={styles.headerTitle} accessibilityRole="header">
          Smart Building Management
        </Text>
      </View>

      <ScrollView
        style={styles.content}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            accessibilityLabel={refreshing ? "Refreshing data" : "Pull to refresh"}
          />
        }
      >
        {/* Property Selector */}
        <Card title="Select Property" elevated>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            style={styles.propertySelector}
            accessibilityLabel="Property selector"
          >
            {properties.map((property) => (
              <AccessibleTouchable
                key={property.id}
                style={[styles.propertyCard, selectedProperty === property.id && styles.selectedPropertyCard]}
                onPress={() => setSelectedProperty(property.id)}
                accessibilityLabel={`${property.name}, ${property.address}, ${property.onlineCount} of ${property.deviceCount} devices online, security status: ${property.securityStatus}`}
                accessibilityRole="button"
                accessibilityState={{ selected: selectedProperty === property.id }}
              >
                <Text style={styles.propertyName}>{property.name}</Text>
                <Text style={styles.propertyAddress} numberOfLines={1}>
                  {property.address}
                </Text>
                <View style={styles.propertyStats}>
                  <Text style={styles.propertyStat}>
                    {property.onlineCount}/{property.deviceCount} devices online
                  </Text>
                  <View
                    style={[
                      styles.securityIndicator,
                      {
                        backgroundColor:
                          property.securityStatus === "secure"
                            ? COLORS.success
                            : property.securityStatus === "warning"
                              ? COLORS.warning
                              : COLORS.error,
                      },
                    ]}
                  />
                </View>
              </AccessibleTouchable>
            ))}
          </ScrollView>
        </Card>

        {selectedPropertyDetails && (
          <>
            {/* Overview Stats */}
            <Card title="Overview" elevated>
              <View style={styles.statsContainer}>
                <View
                  style={styles.statItem}
                  accessible={true}
                  accessibilityLabel={`${selectedPropertyDetails.onlineCount} of ${selectedPropertyDetails.deviceCount} devices online`}
                >
                  <Ionicons name="hardware-chip-outline" size={24} color={COLORS.primary} />
                  <Text style={styles.statValue}>
                    {selectedPropertyDetails.onlineCount}/{selectedPropertyDetails.deviceCount}
                  </Text>
                  <Text style={styles.statLabel}>Devices Online</Text>
                </View>

                <View
                  style={styles.statItem}
                  accessible={true}
                  accessibilityLabel={`Today's energy usage: ${selectedPropertyDetails.energyUsage} kilowatt hours`}
                >
                  <Ionicons name="flash-outline" size={24} color={COLORS.primary} />
                  <Text style={styles.statValue}>{selectedPropertyDetails.energyUsage} kWh</Text>
                  <Text style={styles.statLabel}>Today's Usage</Text>
                </View>

                <View
                  style={styles.statItem}
                  accessible={true}
                  accessibilityLabel={`Security status: ${selectedPropertyDetails.securityStatus}`}
                >
                  <Ionicons
                    name={
                      selectedPropertyDetails.securityStatus === "secure"
                        ? "shield-checkmark-outline"
                        : "shield-outline"
                    }
                    size={24}
                    color={
                      selectedPropertyDetails.securityStatus === "secure"
                        ? COLORS.success
                        : selectedPropertyDetails.securityStatus === "warning"
                          ? COLORS.warning
                          : COLORS.error
                    }
                  />
                  <Text
                    style={[
                      styles.statValue,
                      {
                        color:
                          selectedPropertyDetails.securityStatus === "secure"
                            ? COLORS.success
                            : selectedPropertyDetails.securityStatus === "warning"
                              ? COLORS.warning
                              : COLORS.error,
                      },
                    ]}
                  >
                    {selectedPropertyDetails.securityStatus.charAt(0).toUpperCase() +
                      selectedPropertyDetails.securityStatus.slice(1)}
                  </Text>
                  <Text style={styles.statLabel}>Security Status</Text>
                </View>
              </View>

              <View style={styles.actionButtons}>
                <AccessibleTouchable
                  style={styles.actionButton}
                  onPress={navigateToEnergyManagement}
                  accessibilityLabel="Energy Management"
                  accessibilityHint="Navigate to energy management screen"
                  accessibilityRole="button"
                >
                  <View style={styles.buttonContent}>
                    <Ionicons name="flash-outline" size={18} color={COLORS.primary as string} style={styles.buttonIcon} />
                    <Text style={styles.buttonText}>Energy Management</Text>
                  </View>
                </AccessibleTouchable>

                <AccessibleTouchable
                  style={styles.actionButton}
                  onPress={navigateToAccessControl}
                  accessibilityLabel="Access Control"
                  accessibilityHint="Navigate to access control screen"
                  accessibilityRole="button"
                >
                  <View style={styles.buttonContent}>
                    <Ionicons name="key-outline" size={18} color={COLORS.primary as string} style={styles.buttonIcon} />
                    <Text style={styles.buttonText}>Access Control</Text>
                  </View>
                </AccessibleTouchable>
              </View>
            </Card>

            {/* Energy Usage Chart */}
            <Card
              title="Energy Usage"
              headerRight={
                <AccessibleTouchable
                  onPress={navigateToEnergyManagement}
                  accessibilityLabel="View energy details"
                  accessibilityRole="button"
                >
                  <Text style={{ color: COLORS.primary }}>Details</Text>
                </AccessibleTouchable>
              }
              elevated
            >
              <View
                accessible={true}
                accessibilityLabel={`Weekly energy usage chart showing data from Monday to Sunday. The highest usage was ${Math.max(
                  ...energyData.map((d) => d.usage),
                )} kilowatt hours.`}
              >
                <LineChart
                  data={{
                    labels: energyData.map((data) => data.date),
                    datasets: [
                      {
                        data: energyData.map((data) => data.usage),
                      },
                    ],
                  }}
                  width={Dimensions.get("window").width - 64}
                  height={180}
                  chartConfig={{
                    backgroundColor: COLORS.white,
                    backgroundGradientFrom: COLORS.white,
                    backgroundGradientTo: COLORS.white,
                    decimalPlaces: 0,
                    color: (opacity = 1) => `rgba(0, 122, 255, ${opacity})`,
                    labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
                    style: {
                      borderRadius: 16,
                    },
                    propsForDots: {
                      r: "4",
                      strokeWidth: "2",
                      stroke: COLORS.primary,
                    },
                  }}
                  bezier
                  style={styles.chart}
                />
              </View>
              <Text style={styles.chartCaption}>Weekly Energy Usage (kWh)</Text>
            </Card>

            {/* Active Alerts */}
            <Card
              title="Active Alerts"
              headerRight={
                <AccessibleTouchable
                  onPress={navigateToAlerts}
                  accessibilityLabel="View all alerts"
                  accessibilityRole="button"
                >
                  <Text style={{ color: COLORS.primary }}>View All</Text>
                </AccessibleTouchable>
              }
              elevated
            >
              {propertyAlerts.length === 0 ? (
                <View style={styles.emptyState} accessible={true} accessibilityLabel="No active alerts">
                  <Ionicons name="checkmark-circle-outline" size={48} color={COLORS.success} />
                  <Text style={styles.emptyText}>No active alerts</Text>
                </View>
              ) : (
                propertyAlerts.map((alert) => (
                  <View
                    key={alert.id}
                    style={styles.alertItem}
                    accessible={true}
                    accessibilityLabel={`${alert.priority} priority alert: ${alert.message}, received at ${formatTime(
                      alert.timestamp,
                    )}`}
                  >
                    <View style={styles.alertIconContainer}>
                      <Ionicons name={getAlertIcon(alert.type)} size={24} color={getAlertColor(alert.priority)} />
                    </View>
                    <View style={styles.alertContent}>
                      <Text style={styles.alertMessage}>{alert.message}</Text>
                      <Text style={styles.alertTime}>{formatTime(alert.timestamp)}</Text>
                    </View>
                    <AccessibleTouchable
                      style={styles.resolveButton}
                      onPress={() => handleResolveAlert(alert.id)}
                      accessibilityLabel={`Resolve alert: ${alert.message}`}
                      accessibilityRole="button"
                    >
                      <Text style={styles.resolveText}>Resolve</Text>
                    </AccessibleTouchable>
                  </View>
                ))
              )}
            </Card>

            {/* IoT Devices */}
            <Card
              title="IoT Devices"
              headerRight={
                <View style={styles.deviceFilters}>
                  <AccessibleTouchable
                    style={[styles.filterButton, filterStatus === "all" && styles.activeFilter]}
                    onPress={() => setFilterStatus("all")}
                    accessibilityLabel="Show all devices"
                    accessibilityRole="button"
                    accessibilityState={{ selected: filterStatus === "all" }}
                  >
                    <Text style={[styles.filterText, filterStatus === "all" && styles.activeFilterText]}>All</Text>
                  </AccessibleTouchable>
                  <AccessibleTouchable
                    style={[styles.filterButton, filterStatus === "online" && styles.activeFilter]}
                    onPress={() => setFilterStatus("online")}
                    accessibilityLabel="Show online devices only"
                    accessibilityRole="button"
                    accessibilityState={{ selected: filterStatus === "online" }}
                  >
                    <Text style={[styles.filterText, filterStatus === "online" && styles.activeFilterText]}>
                      Online
                    </Text>
                  </AccessibleTouchable>
                  <AccessibleTouchable
                    style={[styles.filterButton, filterStatus === "offline" && styles.activeFilter]}
                    onPress={() => setFilterStatus("offline")}
                    accessibilityLabel="Show offline devices only"
                    accessibilityRole="button"
                    accessibilityState={{ selected: filterStatus === "offline" }}
                  >
                    <Text style={[styles.filterText, filterStatus === "offline" && styles.activeFilterText]}>
                      Offline
                    </Text>
                  </AccessibleTouchable>
                </View>
              }
              elevated
            >
              {filteredDevices.length === 0 ? (
                <View
                  style={styles.emptyState}
                  accessible={true}
                  accessibilityLabel="No devices found with current filter"
                >
                  <Ionicons name="hardware-chip-outline" size={48} color={COLORS.gray[500]} />
                  <Text style={styles.emptyText}>No devices found</Text>
                </View>
              ) : (
                filteredDevices.map((device) => (
                  <AccessibleTouchable
                    key={device.id}
                    style={styles.deviceItem}
                    onPress={() => navigateToDeviceDetail(device.id)}
                    accessibilityLabel={`${device.name}, ${device.location}, status: ${device.status}${device.batteryLevel ? `, battery: ${device.batteryLevel}%` : ""}`}
                    accessibilityRole="button"
                  >
                    <View
                      style={[
                        styles.deviceIconContainer,
                        {
                          backgroundColor: getBackgroundColor(device.status),
                        },
                      ]}
                    >
                      <Ionicons
                        name={getDeviceIcon(device.type)}
                        size={24}
                        color={getDeviceIconColor(device.status)}
                      />
                      <View
                        style={[
                          styles.statusIndicator,
                          {
                            backgroundColor:
                              device.status === "online"
                                ? COLORS.success
                                : device.status === "maintenance"
                                  ? COLORS.warning
                                  : COLORS.error,
                          },
                        ]}
                      />
                    </View>

                    <View style={styles.deviceInfo}>
                      <Text style={styles.deviceName}>{device.name}</Text>
                      <Text style={styles.deviceLocation}>{device.location}</Text>
                      {device.batteryLevel !== undefined && (
                        <View style={styles.batteryContainer}>
                          <Ionicons
                            name={
                              device.batteryLevel > 80
                                ? "battery-full-outline"
                                : device.batteryLevel > 30
                                  ? "battery-half-outline"
                                  : "battery-dead-outline"
                            }
                            size={14}
                            color={device.batteryLevel > 30 ? COLORS.success : COLORS.error}
                          />
                          <Text
                            style={[
                              styles.batteryText,
                              {
                                color: device.batteryLevel > 30 ? COLORS.success : COLORS.error,
                              },
                            ]}
                          >
                            {device.batteryLevel}%
                          </Text>
                        </View>
                      )}
                    </View>

                    {device.status === "online" && (
                      <View style={styles.deviceControls}>
                        {device.type === "thermostat" && (
                          <View style={styles.thermostatControl}>
                            <Text style={styles.deviceValue}>
                              {device.value}
                              {device.unit}
                            </Text>
                            <View style={styles.thermostatButtons}>
                              <AccessibleTouchable
                                style={styles.thermostatButton}
                                onPress={() =>
                                  setDevices(
                                    devices.map((d) =>
                                      d.id === device.id
                                        ? {
                                            ...d,
                                            value: (d.value as number) - 1,
                                            lastUpdated: new Date().toISOString(),
                                          }
                                        : d,
                                    ),
                                  )
                                }
                                accessibilityLabel={`Decrease temperature, currently ${device.value}${device.unit}`}
                                accessibilityRole="button"
                              >
                                <Ionicons name="remove-outline" size={16} color={COLORS.primary} />
                              </AccessibleTouchable>
                              <AccessibleTouchable
                                style={styles.thermostatButton}
                                onPress={() =>
                                  setDevices(
                                    devices.map((d) =>
                                      d.id === device.id
                                        ? {
                                            ...d,
                                            value: (d.value as number) + 1,
                                            lastUpdated: new Date().toISOString(),
                                          }
                                        : d,
                                    ),
                                  )
                                }
                                accessibilityLabel={`Increase temperature, currently ${device.value}${device.unit}`}
                                accessibilityRole="button"
                              >
                                <Ionicons name="add-outline" size={16} color={COLORS.primary} />
                              </AccessibleTouchable>
                            </View>
                          </View>
                        )}

                        {(device.type === "lock" || device.type === "light" || device.type === "outlet") && (
                          <Switch
                            value={device.value as boolean}
                            onValueChange={(newValue) => handleDeviceToggle(device.id, newValue)}
                            trackColor={{
                              false: COLORS.lightGray,
                              true: COLORS.primaryLight,
                            }}
                            thumbColor={(device.value as boolean) ? COLORS.primary : COLORS.white}
                            accessibilityLabel={`${device.type} toggle, currently ${(device.value as boolean) ? "on" : "off"}`}
                            accessibilityRole="switch"
                          />
                        )}
                      </View>
                    )}
                  </AccessibleTouchable>
                ))
              )}

              <AccessibleTouchable
                style={styles.addDeviceButton}
                onPress={navigateToAddDevice}
                accessibilityLabel="Add new device"
                accessibilityHint="Navigate to add device screen"
                accessibilityRole="button"
              >
                <View style={styles.buttonContent}>
                  <Ionicons name="add-circle-outline" size={18} color={COLORS.primary as string} style={styles.buttonIcon} />
                  <Text style={styles.buttonText}>Add New Device</Text>
                </View>
              </AccessibleTouchable>
            </Card>
          </>
        )}

        <View style={styles.spacer} />
      </ScrollView>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  header: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.gray[200],
    backgroundColor: COLORS.white,
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
  propertySelector: {
    flexDirection: "row",
    marginBottom: 8,
  },
  propertyCard: {
    width: 200,
    padding: 12,
    marginRight: 12,
    borderRadius: 8,
    backgroundColor: COLORS.white,
    borderWidth: 1,
    borderColor: COLORS.gray[200],
    minHeight: 100,
  },
  selectedPropertyCard: {
    borderColor: COLORS.primary,
    backgroundColor: COLORS.primaryLight,
  },
  propertyName: {
    fontSize: 16,
    fontWeight: "bold",
    color: COLORS.darkGray,
    marginBottom: 4,
  },
  propertyAddress: {
    fontSize: 12,
    color: COLORS.gray[500],
    marginBottom: 8,
  },
  propertyStats: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  propertyStat: {
    fontSize: 12,
    color: COLORS.gray[500],
  },
  securityIndicator: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  statsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 16,
  },
  statItem: {
    alignItems: "center",
    flex: 1,
  },
  statValue: {
    fontSize: 18,
    fontWeight: "bold",
    color: COLORS.darkGray,
    marginTop: 4,
    marginBottom: 2,
  },
  statLabel: {
    fontSize: 12,
    color: COLORS.gray[500],
  },
  actionButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  actionButton: {
    flex: 1,
    marginHorizontal: 4,
    borderWidth: 1,
    borderColor: COLORS.primary,
    borderRadius: 4,
    paddingVertical: 8,
    paddingHorizontal: 12,
    minHeight: 44,
  },
  buttonContent: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  buttonText: {
    color: COLORS.primary,
    fontWeight: "500",
  },
  buttonIcon: {
    marginRight: 8,
  },
  chart: {
    marginVertical: 8,
    borderRadius: 16,
  },
  chartCaption: {
    textAlign: "center",
    fontSize: 12,
    color: COLORS.gray[500],
  },
  alertItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.gray[200],
  },
  alertIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: COLORS.gray[100],
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  alertContent: {
    flex: 1,
  },
  alertMessage: {
    fontSize: 14,
    fontWeight: "500",
    color: COLORS.darkGray,
    marginBottom: 4,
  },
  alertTime: {
    fontSize: 12,
    color: COLORS.gray[500],
  },
  resolveButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 4,
    backgroundColor: COLORS.primaryLight,
    minHeight: 44,
    justifyContent: "center",
  },
  resolveText: {
    fontSize: 12,
    color: COLORS.primary,
    fontWeight: "500",
  },
  deviceFilters: {
    flexDirection: "row",
  },
  filterButton: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    marginLeft: 4,
    borderRadius: 4,
    minHeight: 32,
  },
  activeFilter: {
    backgroundColor: COLORS.primaryLight,
  },
  filterText: {
    fontSize: 12,
    color: COLORS.gray[500],
  },
  activeFilterText: {
    color: COLORS.primary,
    fontWeight: "500",
  },
  deviceItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.gray[200],
    minHeight: 60,
  },
  deviceIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
    position: "relative",
    backgroundColor: COLORS.gray[100],
  },
  statusIndicator: {
    width: 10,
    height: 10,
    borderRadius: 5,
    position: "absolute",
    bottom: 0,
    right: 0,
    borderWidth: 1,
    borderColor: COLORS.white,
  },
  deviceInfo: {
    flex: 1,
  },
  deviceName: {
    fontSize: 14,
    fontWeight: "500",
    color: COLORS.darkGray,
    marginBottom: 2,
  },
  deviceLocation: {
    fontSize: 12,
    color: COLORS.gray[500],
    marginBottom: 2,
  },
  batteryContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  batteryText: {
    fontSize: 12,
    marginLeft: 4,
  },
  deviceControls: {
    alignItems: "flex-end",
  },
  deviceValue: {
    fontSize: 16,
    fontWeight: "bold",
    color: COLORS.darkGray,
    marginBottom: 4,
  },
  thermostatControl: {
    alignItems: "center",
  },
  thermostatButtons: {
    flexDirection: "row",
  },
  thermostatButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: COLORS.primary,
    justifyContent: "center",
    alignItems: "center",
    marginHorizontal: 2,
  },
  addDeviceButton: {
    marginTop: 16,
    borderWidth: 1,
    borderColor: COLORS.primary,
    borderRadius: 4,
    paddingVertical: 12,
    paddingHorizontal: 16,
    alignItems: "center",
    minHeight: 48,
  },
  emptyState: {
    alignItems: "center",
    justifyContent: "center",
    padding: 24,
  },
  emptyText: {
    fontSize: 16,
    color: COLORS.gray[500],
    marginTop: 8,
  },
  spacer: {
    height: 40,
  },
})

export default SmartBuildingDashboardScreen

