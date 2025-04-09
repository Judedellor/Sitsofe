"use client"

import { useState } from "react"
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Switch } from "react-native"
import { SafeAreaView } from "react-native-safe-area-context"
import { COLORS } from "../constants/colors"
import Card from "../components/ui/Card"
import { Ionicons } from "@expo/vector-icons"
import { useNavigation } from "@react-navigation/native"

// Types for smart devices
interface SmartDevice {
  id: string
  name: string
  type: "thermostat" | "lock" | "camera" | "sensor" | "light" | "outlet"
  status: "online" | "offline"
  value?: number | boolean
  unit?: string
  location: string
}

// Mock smart devices
const mockSmartDevices: SmartDevice[] = [
  {
    id: "dev1",
    name: "Living Room Thermostat",
    type: "thermostat",
    status: "online",
    value: 72,
    unit: "°F",
    location: "Living Room",
  },
  {
    id: "dev2",
    name: "Front Door Lock",
    type: "lock",
    status: "online",
    value: true, // locked
    location: "Entrance",
  },
  {
    id: "dev3",
    name: "Living Room Lights",
    type: "light",
    status: "online",
    value: false, // off
    location: "Living Room",
  },
  {
    id: "dev4",
    name: "Kitchen Lights",
    type: "light",
    status: "online",
    value: false, // off
    location: "Kitchen",
  },
  {
    id: "dev5",
    name: "Bedroom Thermostat",
    type: "thermostat",
    status: "online",
    value: 70,
    unit: "°F",
    location: "Bedroom",
  },
  {
    id: "dev6",
    name: "Bedroom Lights",
    type: "light",
    status: "online",
    value: false, // off
    location: "Bedroom",
  },
  {
    id: "dev7",
    name: "Smart Outlet",
    type: "outlet",
    status: "online",
    value: true, // on
    location: "Living Room",
  },
  {
    id: "dev8",
    name: "Motion Sensor",
    type: "sensor",
    status: "online",
    value: false, // no motion
    location: "Hallway",
  },
]

// Scenes
interface Scene {
  id: string
  name: string
  icon: string
  devices: {
    deviceId: string
    value: number | boolean
  }[]
}

// Mock scenes
const mockScenes: Scene[] = [
  {
    id: "scene1",
    name: "Good Morning",
    icon: "sunny-outline",
    devices: [
      { deviceId: "dev1", value: 72 },
      { deviceId: "dev3", value: true },
      { deviceId: "dev4", value: true },
    ],
  },
  {
    id: "scene2",
    name: "Good Night",
    icon: "moon-outline",
    devices: [
      { deviceId: "dev1", value: 68 },
      { deviceId: "dev3", value: false },
      { deviceId: "dev4", value: false },
      { deviceId: "dev6", value: false },
      { deviceId: "dev2", value: true },
    ],
  },
  {
    id: "scene3",
    name: "Away",
    icon: "airplane-outline",
    devices: [
      { deviceId: "dev1", value: 65 },
      { deviceId: "dev3", value: false },
      { deviceId: "dev4", value: false },
      { deviceId: "dev6", value: false },
      { deviceId: "dev7", value: false },
      { deviceId: "dev2", value: true },
    ],
  },
  {
    id: "scene4",
    name: "Movie Time",
    icon: "film-outline",
    devices: [
      { deviceId: "dev3", value: false },
      { deviceId: "dev4", value: false },
      { deviceId: "dev7", value: true },
    ],
  },
]

const TenantSmartHomeScreen = () => {
  const navigation = useNavigation()
  const [devices, setDevices] = useState<SmartDevice[]>(mockSmartDevices)
  const [scenes, setScenes] = useState<Scene[]>(mockScenes)
  const [activeTab, setActiveTab] = useState<"all" | "favorites" | "scenes">("all")
  const [favoriteDevices, setFavoriteDevices] = useState<string[]>(["dev1", "dev2", "dev3"])

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

  // Handle device toggle
  const handleDeviceToggle = (deviceId: string, newValue: boolean) => {
    setDevices(devices.map((device) => (device.id === deviceId ? { ...device, value: newValue } : device)))
  }

  // Handle thermostat change
  const handleThermostatChange = (deviceId: string, newValue: number) => {
    setDevices(devices.map((device) => (device.id === deviceId ? { ...device, value: newValue } : device)))
  }

  // Handle scene activation
  const handleActivateScene = (sceneId: string) => {
    const scene = scenes.find((s) => s.id === sceneId)
    if (!scene) return

    // Update device values based on scene
    const updatedDevices = [...devices]
    scene.devices.forEach((sceneDevice) => {
      const deviceIndex = updatedDevices.findIndex((d) => d.id === sceneDevice.deviceId)
      if (deviceIndex >= 0) {
        updatedDevices[deviceIndex] = {
          ...updatedDevices[deviceIndex],
          value: sceneDevice.value,
        }
      }
    })

    setDevices(updatedDevices)
  }

  // Toggle favorite
  const toggleFavorite = (deviceId: string) => {
    if (favoriteDevices.includes(deviceId)) {
      setFavoriteDevices(favoriteDevices.filter((id) => id !== deviceId))
    } else {
      setFavoriteDevices([...favoriteDevices, deviceId])
    }
  }

  // Filter devices based on active tab
  const filteredDevices =
    activeTab === "favorites" ? devices.filter((device) => favoriteDevices.includes(device.id)) : devices

  // Group devices by location
  const devicesByLocation = filteredDevices.reduce(
    (acc, device) => {
      if (!acc[device.location]) {
        acc[device.location] = []
      }
      acc[device.location].push(device)
      return acc
    },
    {} as Record<string, SmartDevice[]>,
  )

  // Render device controls
  const renderDeviceControls = (device: SmartDevice) => {
    if (device.status === "offline") {
      return <Text style={styles.offlineText}>Offline</Text>
    }

    switch (device.type) {
      case "thermostat":
        return (
          <View style={styles.thermostatControls}>
            <Text style={styles.thermostatValue}>
              {device.value}
              {device.unit}
            </Text>
            <View style={styles.thermostatButtons}>
              <TouchableOpacity
                style={styles.thermostatButton}
                onPress={() => handleThermostatChange(device.id, Math.max(65, (device.value as number) - 1))}
              >
                <Ionicons name="remove-outline" size={16} color={COLORS.primary} />
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.thermostatButton}
                onPress={() => handleThermostatChange(device.id, Math.min(85, (device.value as number) + 1))}
              >
                <Ionicons name="add-outline" size={16} color={COLORS.primary} />
              </TouchableOpacity>
            </View>
          </View>
        )
      case "light":
      case "outlet":
        return (
          <Switch
            value={device.value as boolean}
            onValueChange={(newValue) => handleDeviceToggle(device.id, newValue)}
            trackColor={{ false: COLORS.gray[200], true: COLORS.primary }}
            thumbColor={(device.value as boolean) ? COLORS.primary : COLORS.white}
          />
        )
      case "lock":
        return (
          <TouchableOpacity
            style={[styles.lockButton, { backgroundColor: (device.value as boolean) ? COLORS.success : COLORS.error }]}
            onPress={() => handleDeviceToggle(device.id, !(device.value as boolean))}
          >
            <Ionicons name={(device.value as boolean) ? "lock-closed" : "lock-open"} size={16} color={COLORS.white} />
            <Text style={styles.lockButtonText}>{(device.value as boolean) ? "Locked" : "Unlocked"}</Text>
          </TouchableOpacity>
        )
      default:
        return (
          <Text style={styles.deviceStatusText}>
            {typeof device.value === "boolean" ? (device.value ? "Active" : "Inactive") : device.value}
          </Text>
        )
    }
  }

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color={COLORS.darkGray} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Smart Home</Text>
      </View>

      <View style={styles.tabContainer}>
        <TouchableOpacity
          style={[styles.tab, activeTab === "all" && styles.activeTab]}
          onPress={() => setActiveTab("all")}
        >
          <Text style={[styles.tabText, activeTab === "all" && styles.activeTabText]}>All Devices</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, activeTab === "favorites" && styles.activeTab]}
          onPress={() => setActiveTab("favorites")}
        >
          <Text style={[styles.tabText, activeTab === "favorites" && styles.activeTabText]}>Favorites</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, activeTab === "scenes" && styles.activeTab]}
          onPress={() => setActiveTab("scenes")}
        >
          <Text style={[styles.tabText, activeTab === "scenes" && styles.activeTabText]}>Scenes</Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content}>
        {activeTab !== "scenes" ? (
          // Devices view
          Object.entries(devicesByLocation).map(([location, locationDevices]) => (
            <Card key={location} title={location} elevated>
              {locationDevices.map((device) => (
                <View key={device.id} style={styles.deviceItem}>
                  <View
                    style={[
                      styles.deviceIconContainer,
                      {
                        backgroundColor: device.status === "online" ? COLORS.primary : COLORS.gray[200],
                      },
                    ]}
                  >
                    <Ionicons
                      name={getDeviceIcon(device.type)}
                      size={24}
                      color={device.status === "online" ? COLORS.primary : COLORS.gray[500]}
                    />
                    <View
                      style={[
                        styles.statusIndicator,
                        {
                          backgroundColor: device.status === "online" ? COLORS.success : COLORS.error,
                        },
                      ]}
                    />
                  </View>

                  <View style={styles.deviceInfo}>
                    <Text style={styles.deviceName}>{device.name}</Text>
                    <Text style={styles.deviceLocation}>{device.location}</Text>
                  </View>

                  <TouchableOpacity style={styles.favoriteButton} onPress={() => toggleFavorite(device.id)}>
                    <Ionicons
                      name={favoriteDevices.includes(device.id) ? "star" : "star-outline"}
                      size={20}
                      color={favoriteDevices.includes(device.id) ? COLORS.warning : COLORS.gray[500]}
                    />
                  </TouchableOpacity>

                  <View style={styles.deviceControls}>{renderDeviceControls(device)}</View>
                </View>
              ))}
            </Card>
          ))
        ) : (
          // Scenes view
          <Card title="Scenes" elevated>
            <View style={styles.scenesContainer}>
              {scenes.map((scene) => (
                <TouchableOpacity key={scene.id} style={styles.sceneItem} onPress={() => handleActivateScene(scene.id)}>
                  <View style={styles.sceneIconContainer}>
                    <Ionicons name={scene.icon as any} size={32} color={COLORS.white} />
                  </View>
                  <Text style={styles.sceneName}>{scene.name}</Text>
                </TouchableOpacity>
              ))}

              <TouchableOpacity
                style={[styles.sceneItem, styles.addSceneItem]}
                onPress={() => {
                  // In a real app, this would navigate to a scene creation screen
                }}
              >
                <View style={[styles.sceneIconContainer, styles.addSceneIcon]}>
                  <Ionicons name="add" size={32} color={COLORS.primary} />
                </View>
                <Text style={styles.sceneName}>Add Scene</Text>
              </TouchableOpacity>
            </View>
          </Card>
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
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.gray[200],
    backgroundColor: COLORS.white,
  },
  backButton: {
    marginRight: 16,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: COLORS.darkGray,
  },
  tabContainer: {
    flexDirection: "row",
    backgroundColor: COLORS.white,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.gray[200],
  },
  tab: {
    flex: 1,
    paddingVertical: 12,
    alignItems: "center",
  },
  activeTab: {
    borderBottomWidth: 2,
    borderBottomColor: COLORS.primary,
  },
  tabText: {
    fontSize: 14,
    color: COLORS.gray[500],
  },
  activeTabText: {
    color: COLORS.primary,
    fontWeight: "500",
  },
  content: {
    flex: 1,
    padding: 16,
  },
  deviceItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.gray[200],
  },
  deviceIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
    position: "relative",
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
  },
  favoriteButton: {
    padding: 8,
  },
  deviceControls: {
    minWidth: 80,
    alignItems: "flex-end",
  },
  offlineText: {
    fontSize: 12,
    color: COLORS.error,
  },
  deviceStatusText: {
    fontSize: 12,
    color: COLORS.darkGray,
  },
  thermostatControls: {
    alignItems: "center",
  },
  thermostatValue: {
    fontSize: 16,
    fontWeight: "bold",
    color: COLORS.darkGray,
    marginBottom: 4,
  },
  thermostatButtons: {
    flexDirection: "row",
  },
  thermostatButton: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: COLORS.primary,
    justifyContent: "center",
    alignItems: "center",
    marginHorizontal: 2,
  },
  lockButton: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  lockButtonText: {
    fontSize: 12,
    color: COLORS.white,
    marginLeft: 4,
  },
  scenesContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  sceneItem: {
    width: "48%",
    alignItems: "center",
    marginBottom: 16,
  },
  sceneIconContainer: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: COLORS.primary,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 8,
  },
  sceneName: {
    fontSize: 14,
    color: COLORS.darkGray,
  },
  addSceneItem: {
    opacity: 0.7,
  },
  addSceneIcon: {
    backgroundColor: COLORS.white,
    borderWidth: 1,
    borderColor: COLORS.primary,
    borderStyle: "dashed",
  },
  spacer: {
    height: 40,
  },
})

export default TenantSmartHomeScreen

