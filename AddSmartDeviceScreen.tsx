"use client"

import { useState } from "react"
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, Alert } from "react-native"
import { SafeAreaView } from "react-native-safe-area-context"
import { COLORS } from "../constants/colors"
import Card from "../components/ui/Card"
import Button from "../components/ui/Button"
import { Ionicons } from "@expo/vector-icons"
import { useNavigation, useRoute } from "@react-navigation/native"
import { Picker } from "@react-native-picker/picker"

// Device types
const deviceTypes = [
  { id: "thermostat", name: "Thermostat", icon: "thermometer-outline" },
  { id: "lock", name: "Smart Lock", icon: "lock-closed-outline" },
  { id: "camera", name: "Security Camera", icon: "videocam-outline" },
  { id: "sensor", name: "Sensor", icon: "radio-outline" },
  { id: "light", name: "Smart Light", icon: "bulb-outline" },
  { id: "outlet", name: "Smart Outlet", icon: "flash-outline" },
]

// Device manufacturers
const deviceManufacturers = [
  { id: "ecosmart", name: "EcoSmart" },
  { id: "securehome", name: "SecureHome" },
  { id: "smartliving", name: "SmartLiving" },
  { id: "intellitech", name: "IntelliTech" },
  { id: "homewise", name: "HomeWise" },
]

// Mock units
const mockUnits = [
  { id: "unit101", name: "Unit 101" },
  { id: "unit102", name: "Unit 102" },
  { id: "unit103", name: "Unit 103" },
  { id: "unit104", name: "Unit 104" },
  { id: "unit105", name: "Unit 105" },
  { id: "common", name: "Common Areas" },
]

// Mock locations for common areas
const commonLocations = [
  { id: "lobby", name: "Lobby" },
  { id: "hallway", name: "Hallway" },
  { id: "parking", name: "Parking Area" },
  { id: "pool", name: "Pool Area" },
  { id: "gym", name: "Fitness Center" },
  { id: "laundry", name: "Laundry Room" },
]

const AddSmartDeviceScreen = () => {
  const navigation = useNavigation()
  const route = useRoute()
  const { propertyId } = route.params as { propertyId: string }

  const [deviceType, setDeviceType] = useState("")
  const [deviceName, setDeviceName] = useState("")
  const [manufacturer, setManufacturer] = useState("")
  const [model, setModel] = useState("")
  const [unitId, setUnitId] = useState("")
  const [location, setLocation] = useState("")
  const [serialNumber, setSerialNumber] = useState("")
  const [macAddress, setMacAddress] = useState("")
  const [notes, setNotes] = useState("")
  const [showQRScanner, setShowQRScanner] = useState(false)

  // Handle form submission
  const handleSubmit = () => {
    // Validate form
    if (!deviceType || !deviceName || !manufacturer || !unitId) {
      Alert.alert("Error", "Please fill in all required fields")
      return
    }

    // In a real app, this would send the data to your backend
    Alert.alert("Success", "Device added successfully", [
      {
        text: "OK",
        onPress: () => navigation.goBack(),
      },
    ])
  }

  // Get locations based on selected unit
  const getLocations = () => {
    if (unitId === "common") {
      return commonLocations
    } else {
      return [
        { id: "livingroom", name: "Living Room" },
        { id: "kitchen", name: "Kitchen" },
        { id: "bedroom", name: "Bedroom" },
        { id: "bathroom", name: "Bathroom" },
        { id: "entrance", name: "Entrance" },
      ]
    }
  }

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color={COLORS.darkGray} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Add Smart Device</Text>
      </View>

      <ScrollView style={styles.content}>
        <Card title="Device Information" elevated>
          {/* Device Type */}
          <View style={styles.formGroup}>
            <Text style={styles.formLabel}>Device Type *</Text>
            <View style={styles.deviceTypesContainer}>
              <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                {deviceTypes.map((type) => (
                  <TouchableOpacity
                    key={type.id}
                    style={[styles.deviceTypeButton, deviceType === type.id && styles.selectedDeviceType]}
                    onPress={() => setDeviceType(type.id)}
                  >
                    <Ionicons
                      name={type.icon as any}
                      size={24}
                      color={deviceType === type.id ? COLORS.white : COLORS.primary}
                    />
                    <Text style={[styles.deviceTypeText, deviceType === type.id && styles.selectedDeviceTypeText]}>
                      {type.name}
                    </Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>
          </View>

          {/* Device Name */}
          <View style={styles.formGroup}>
            <Text style={styles.formLabel}>Device Name *</Text>
            <TextInput
              style={styles.formInput}
              value={deviceName}
              onChangeText={setDeviceName}
              placeholder="Enter device name"
            />
          </View>

          {/* Manufacturer */}
          <View style={styles.formGroup}>
            <Text style={styles.formLabel}>Manufacturer *</Text>
            <View style={styles.pickerContainer}>
              <Picker
                selectedValue={manufacturer}
                onValueChange={(itemValue) => setManufacturer(itemValue)}
                style={styles.picker}
              >
                <Picker.Item label="Select manufacturer" value="" />
                {deviceManufacturers.map((mfg) => (
                  <Picker.Item key={mfg.id} label={mfg.name} value={mfg.id} />
                ))}
              </Picker>
            </View>
          </View>

          {/* Model */}
          <View style={styles.formGroup}>
            <Text style={styles.formLabel}>Model</Text>
            <TextInput
              style={styles.formInput}
              value={model}
              onChangeText={setModel}
              placeholder="Enter model number"
            />
          </View>
        </Card>

        <Card title="Location" elevated>
          {/* Unit */}
          <View style={styles.formGroup}>
            <Text style={styles.formLabel}>Unit *</Text>
            <View style={styles.pickerContainer}>
              <Picker
                selectedValue={unitId}
                onValueChange={(itemValue) => {
                  setUnitId(itemValue)
                  setLocation("") // Reset location when unit changes
                }}
                style={styles.picker}
              >
                <Picker.Item label="Select unit" value="" />
                {mockUnits.map((unit) => (
                  <Picker.Item key={unit.id} label={unit.name} value={unit.id} />
                ))}
              </Picker>
            </View>
          </View>

          {/* Location */}
          {unitId && (
            <View style={styles.formGroup}>
              <Text style={styles.formLabel}>Location *</Text>
              <View style={styles.pickerContainer}>
                <Picker
                  selectedValue={location}
                  onValueChange={(itemValue) => setLocation(itemValue)}
                  style={styles.picker}
                >
                  <Picker.Item label="Select location" value="" />
                  {getLocations().map((loc) => (
                    <Picker.Item key={loc.id} label={loc.name} value={loc.id} />
                  ))}
                </Picker>
              </View>
            </View>
          )}
        </Card>

        <Card title="Device Details" elevated>
          {/* Serial Number */}
          <View style={styles.formGroup}>
            <View style={styles.formLabelContainer}>
              <Text style={styles.formLabel}>Serial Number</Text>
              <TouchableOpacity style={styles.scanButton} onPress={() => setShowQRScanner(true)}>
                <Ionicons name="qr-code-outline" size={16} color={COLORS.primary} />
                <Text style={styles.scanButtonText}>Scan</Text>
              </TouchableOpacity>
            </View>
            <TextInput
              style={styles.formInput}
              value={serialNumber}
              onChangeText={setSerialNumber}
              placeholder="Enter serial number"
            />
          </View>

          {/* MAC Address */}
          <View style={styles.formGroup}>
            <Text style={styles.formLabel}>MAC Address</Text>
            <TextInput
              style={styles.formInput}
              value={macAddress}
              onChangeText={setMacAddress}
              placeholder="Enter MAC address"
            />
          </View>

          {/* Notes */}
          <View style={styles.formGroup}>
            <Text style={styles.formLabel}>Notes</Text>
            <TextInput
              style={[styles.formInput, styles.textArea]}
              value={notes}
              onChangeText={setNotes}
              placeholder="Enter additional notes"
              multiline
              numberOfLines={4}
            />
          </View>
        </Card>

        <View style={styles.buttonContainer}>
          <Button title="Cancel" type="outline" onPress={() => navigation.goBack()} style={styles.button} />
          <Button title="Add Device" type="primary" onPress={handleSubmit} style={styles.button} />
        </View>

        <View style={styles.spacer} />
      </ScrollView>

      {/* QR Scanner Modal (placeholder) */}
      {showQRScanner && (
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Scan QR Code</Text>
              <TouchableOpacity style={styles.modalCloseButton} onPress={() => setShowQRScanner(false)}>
                <Ionicons name="close" size={24} color={COLORS.darkGray} />
              </TouchableOpacity>
            </View>

            <View style={styles.scannerContainer}>
              <Ionicons name="qr-code" size={100} color={COLORS.gray} />
              <Text style={styles.scannerText}>Position the QR code within the frame</Text>
            </View>

            <Button title="Cancel Scan" type="outline" onPress={() => setShowQRScanner(false)} />
          </View>
        </View>
      )}
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
  formGroup: {
    marginBottom: 16,
  },
  formLabelContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  formLabel: {
    fontSize: 14,
    fontWeight: "500",
    color: COLORS.darkGray,
    marginBottom: 8,
  },
  formInput: {
    borderWidth: 1,
    borderColor: COLORS.lightGray,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    fontSize: 14,
  },
  textArea: {
    height: 100,
    textAlignVertical: "top",
  },
  deviceTypesContainer: {
    marginBottom: 8,
  },
  deviceTypeButton: {
    width: 100,
    height: 100,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: COLORS.lightGray,
    borderRadius: 8,
    marginRight: 12,
    padding: 8,
  },
  selectedDeviceType: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  deviceTypeText: {
    marginTop: 8,
    fontSize: 12,
    color: COLORS.darkGray,
    textAlign: "center",
  },
  selectedDeviceTypeText: {
    color: COLORS.white,
  },
  pickerContainer: {
    borderWidth: 1,
    borderColor: COLORS.lightGray,
    borderRadius: 8,
    overflow: "hidden",
  },
  picker: {
    height: 50,
    width: "100%",
  },
  scanButton: {
    flexDirection: "row",
    alignItems: "center",
    padding: 4,
  },
  scanButtonText: {
    fontSize: 12,
    color: COLORS.primary,
    marginLeft: 4,
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 16,
  },
  button: {
    flex: 1,
    marginHorizontal: 4,
  },
  modalOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContainer: {
    width: "90%",
    backgroundColor: COLORS.white,
    borderRadius: 8,
    padding: 16,
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: COLORS.darkGray,
  },
  modalCloseButton: {
    padding: 4,
  },
  scannerContainer: {
    alignItems: "center",
    justifyContent: "center",
    height: 250,
    marginBottom: 16,
  },
  scannerText: {
    marginTop: 16,
    fontSize: 14,
    color: COLORS.gray,
    textAlign: "center",
  },
  spacer: {
    height: 40,
  },
})

export default AddSmartDeviceScreen

