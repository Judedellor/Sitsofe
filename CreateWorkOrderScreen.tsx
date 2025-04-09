"use client"

import { useState, useEffect } from "react"
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  Platform,
  Image,
} from "react-native"
import { SafeAreaView } from "react-native-safe-area-context"
import { COLORS } from "../constants/colors"
import { Ionicons } from "@expo/vector-icons"
import { useNavigation, useRoute } from "@react-navigation/native"
import { useAuth } from "../context/AuthContext"
import DateTimePicker from "@react-native-community/datetimepicker"
import * as ImagePicker from "expo-image-picker"

// Work order priorities
const WORK_ORDER_PRIORITIES = {
  LOW: "low",
  MEDIUM: "medium",
  HIGH: "high",
  EMERGENCY: "emergency",
}

// Mock properties data
const mockProperties = [
  {
    id: "1",
    name: "Sunset Villa",
    address: "123 Ocean Drive, Malibu, CA",
    units: [
      { id: "101", number: "101", tenantId: "1", tenantName: "John Doe" },
      { id: "102", number: "102", tenantId: "2", tenantName: "Jane Smith" },
    ],
  },
  {
    id: "2",
    name: "Downtown Loft",
    address: "456 Main St, Los Angeles, CA",
    units: [
      { id: "201", number: "201", tenantId: "3", tenantName: "Bob Johnson" },
      { id: "202", number: "202", tenantId: "4", tenantName: "Alice Williams" },
    ],
  },
]

// Mock staff data
const mockStaff = [
  { id: "3", name: "Mike Johnson", role: "maintenance_staff", phone: "555-123-4567" },
  { id: "4", name: "Sarah Williams", role: "hvac_technician", phone: "555-987-6543" },
  { id: "5", name: "David Lee", role: "maintenance_staff", phone: "555-456-7890" },
  { id: "6", name: "Emily Chen", role: "electrician", phone: "555-789-0123" },
]

// Maintenance categories
const MAINTENANCE_CATEGORIES = [
  { id: "plumbing", label: "Plumbing", icon: "water" },
  { id: "electrical", label: "Electrical", icon: "flash" },
  { id: "hvac", label: "HVAC", icon: "thermometer" },
  { id: "appliance", label: "Appliance", icon: "restaurant" },
  { id: "structural", label: "Structural", icon: "home" },
  { id: "pest", label: "Pest Control", icon: "bug" },
  { id: "other", label: "Other", icon: "construct" },
]

const CreateWorkOrderScreen = () => {
  const navigation = useNavigation()
  const route = useRoute()
  const { propertyId, unitId, maintenanceRequestId } = route.params || {}
  const { user } = useAuth()

  const [isLoading, setIsLoading] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Form state
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [category, setCategory] = useState("")
  const [priority, setPriority] = useState(WORK_ORDER_PRIORITIES.MEDIUM)
  const [property, setProperty] = useState(propertyId || "")
  const [unit, setUnit] = useState(unitId || "")
  const [scheduledDate, setScheduledDate] = useState(new Date())
  const [showDatePicker, setShowDatePicker] = useState(false)
  const [assignedTo, setAssignedTo] = useState(null)
  const [estimatedCost, setEstimatedCost] = useState("")
  const [notes, setNotes] = useState("")
  const [photos, setPhotos] = useState([])

  // UI state
  const [properties, setProperties] = useState([])
  const [units, setUnits] = useState([])
  const [showPropertyPicker, setShowPropertyPicker] = useState(false)
  const [showUnitPicker, setShowUnitPicker] = useState(false)
  const [showStaffPicker, setShowStaffPicker] = useState(false)

  // Load properties and staff
  useEffect(() => {
    const loadData = async () => {
      try {
        setIsLoading(true)

        // In a real app, you would fetch from your API
        await new Promise((resolve) => setTimeout(resolve, 800)) // Simulate API call

        // Filter properties based on user role
        let userProperties = [...mockProperties]

        if (user?.role === "property_manager" && user?.properties) {
          userProperties = mockProperties.filter((prop) => user.properties.includes(prop.id))
        }

        setProperties(userProperties)

        // If propertyId is provided and valid, set it and load units
        if (propertyId && userProperties.some((p) => p.id === propertyId)) {
          setProperty(propertyId)
          const selectedProperty = userProperties.find((p) => p.id === propertyId)
          if (selectedProperty) {
            setUnits(selectedProperty.units)

            // If unitId is provided and valid, set it
            if (unitId && selectedProperty.units.some((u) => u.id === unitId)) {
              setUnit(unitId)
            }
          }
        } else if (userProperties.length === 1) {
          // If user has only one property, select it automatically
          setProperty(userProperties[0].id)
          setUnits(userProperties[0].units)
        }

        // If this is created from a maintenance request, load the request data
        if (maintenanceRequestId) {
          // In a real app, you would fetch the maintenance request from your API
          // For this example, we'll just set some dummy data
          setTitle("Fix Leaking Bathroom Faucet")
          setDescription("The bathroom sink faucet is leaking and causing water damage to the cabinet below.")
          setCategory("plumbing")
          setPriority(WORK_ORDER_PRIORITIES.MEDIUM)
        }
      } catch (error) {
        console.error("Error loading data:", error)
        Alert.alert("Error", "Failed to load data. Please try again.")
      } finally {
        setIsLoading(false)
      }
    }

    loadData()
  }, [propertyId, unitId, maintenanceRequestId, user])

  // Update units when property changes
  useEffect(() => {
    if (property) {
      const selectedProperty = properties.find((p) => p.id === property)
      if (selectedProperty) {
        setUnits(selectedProperty.units)
        setUnit("") // Reset unit when property changes
      }
    } else {
      setUnits([])
      setUnit("")
    }
  }, [property, properties])

  // Format date for display
  const formatDate = (date) => {
    return date.toLocaleDateString("en-US", {
      weekday: "short",
      month: "short",
      day: "numeric",
      year: "numeric",
    })
  }

  // Handle date change
  const onDateChange = (event, selectedDate) => {
    const currentDate = selectedDate || scheduledDate
    setShowDatePicker(Platform.OS === "ios")
    setScheduledDate(currentDate)
  }

  // Get property name by id
  const getPropertyName = (id) => {
    const prop = properties.find((p) => p.id === id)
    return prop ? prop.name : "Select Property"
  }

  // Get unit number by id
  const getUnitNumber = (id) => {
    const unitObj = units.find((u) => u.id === id)
    return unitObj ? `Unit ${unitObj.number}` : "Select Unit"
  }

  // Get staff name by id
  const getStaffName = (staff) => {
    return staff ? staff.name : "Select Staff"
  }

  // Pick image
  const pickImage = async () => {
    if (photos.length >= 5) {
      Alert.alert("Limit Reached", "You can only add up to 5 photos.")
      return
    }

    try {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync()

      if (status !== "granted") {
        Alert.alert("Permission Required", "Please grant camera roll permissions to upload photos.")
        return
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 0.8,
      })

      if (!result.canceled && result.assets && result.assets.length > 0) {
        setPhotos([...photos, result.assets[0].uri])
      }
    } catch (error) {
      console.error("Error picking image:", error)
      Alert.alert("Error", "Failed to pick image. Please try again.")
    }
  }

  // Take photo
  const takePhoto = async () => {
    if (photos.length >= 5) {
      Alert.alert("Limit Reached", "You can only add up to 5 photos.")
      return
    }

    try {
      const { status } = await ImagePicker.requestCameraPermissionsAsync()

      if (status !== "granted") {
        Alert.alert("Permission Required", "Please grant camera permissions to take photos.")
        return
      }

      const result = await ImagePicker.launchCameraAsync({
        allowsEditing: true,
        aspect: [4, 3],
        quality: 0.8,
      })

      if (!result.canceled && result.assets && result.assets.length > 0) {
        setPhotos([...photos, result.assets[0].uri])
      }
    } catch (error) {
      console.error("Error taking photo:", error)
      Alert.alert("Error", "Failed to take photo. Please try again.")
    }
  }

  // Remove photo
  const removePhoto = (index) => {
    const newPhotos = [...photos]
    newPhotos.splice(index, 1)
    setPhotos(newPhotos)
  }

  // Validate form
  const validateForm = () => {
    if (!title.trim()) {
      Alert.alert("Missing Information", "Please enter a title for the work order.")
      return false
    }

    if (!description.trim()) {
      Alert.alert("Missing Information", "Please provide a description of the work order.")
      return false
    }

    if (!category) {
      Alert.alert("Missing Information", "Please select a category for the work order.")
      return false
    }

    if (!property) {
      Alert.alert("Missing Information", "Please select a property for the work order.")
      return false
    }

    return true
  }

  // Handle form submission
  const handleSubmit = async () => {
    if (!validateForm()) return

    try {
      setIsSubmitting(true)

      // In a real app, you would submit the form data to your API
      await new Promise((resolve) => setTimeout(resolve, 1500)) // Simulate API call

      Alert.alert("Work Order Created", "The work order has been created successfully.", [
        {
          text: "OK",
          onPress: () => navigation.navigate("WorkOrders"),
        },
      ])
    } catch (error) {
      console.error("Error creating work order:", error)
      Alert.alert("Error", "Failed to create work order. Please try again.")
    } finally {
      setIsSubmitting(false)
    }
  }

  if (isLoading) {
    return (
      <SafeAreaView style={styles.container} edges={["top"]}>
        <View style={styles.header}>
          <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
            <Ionicons name="arrow-back" size={24} color={COLORS.darkGray} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Create Work Order</Text>
        </View>

        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={COLORS.primary} />
          <Text style={styles.loadingText}>Loading...</Text>
        </View>
      </SafeAreaView>
    )
  }

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()} disabled={isSubmitting}>
          <Ionicons name="arrow-back" size={24} color={COLORS.darkGray} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Create Work Order</Text>
      </View>

      <ScrollView style={styles.content}>
        <View style={styles.formSection}>
          <Text style={styles.sectionTitle}>Work Order Details</Text>

          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Title *</Text>
            <TextInput
              style={styles.input}
              value={title}
              onChangeText={setTitle}
              placeholder="Brief title of the issue"
              editable={!isSubmitting}
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Description *</Text>
            <TextInput
              style={[styles.input, styles.textArea]}
              value={description}
              onChangeText={setDescription}
              placeholder="Describe the issue in detail"
              multiline
              numberOfLines={4}
              editable={!isSubmitting}
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Category *</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.categoryContainer}>
              {MAINTENANCE_CATEGORIES.map((cat) => (
                <TouchableOpacity
                  key={cat.id}
                  style={[styles.categoryItem, category === cat.id && styles.categoryItemActive]}
                  onPress={() => setCategory(cat.id)}
                  disabled={isSubmitting}
                >
                  <Ionicons name={cat.icon} size={24} color={category === cat.id ? COLORS.white : COLORS.primary} />
                  <Text style={[styles.categoryText, category === cat.id && styles.categoryTextActive]}>
                    {cat.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Priority *</Text>
            <View style={styles.priorityContainer}>
              {Object.entries(WORK_ORDER_PRIORITIES).map(([key, value]) => (
                <TouchableOpacity
                  key={value}
                  style={[
                    styles.priorityItem,
                    priority === value && {
                      backgroundColor:
                        value === WORK_ORDER_PRIORITIES.LOW
                          ? COLORS.success
                          : value === WORK_ORDER_PRIORITIES.MEDIUM
                            ? COLORS.warning
                            : value === WORK_ORDER_PRIORITIES.HIGH
                              ? COLORS.error
                              : "#FF0000", // Emergency
                    },
                  ]}
                  onPress={() => setPriority(value)}
                  disabled={isSubmitting}
                >
                  <Text style={[styles.priorityText, priority === value && styles.priorityTextActive]}>
                    {key.charAt(0) + key.slice(1).toLowerCase()}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        </View>

        <View style={styles.formSection}>
          <Text style={styles.sectionTitle}>Location</Text>

          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Property *</Text>
            <TouchableOpacity
              style={styles.selectInput}
              onPress={() => setShowPropertyPicker(!showPropertyPicker)}
              disabled={isSubmitting || properties.length <= 1}
            >
              <Text style={styles.selectInputText}>{property ? getPropertyName(property) : "Select Property"}</Text>
              {properties.length > 1 && <Ionicons name="chevron-down" size={20} color={COLORS.gray} />}
            </TouchableOpacity>

            {showPropertyPicker && (
              <View style={styles.pickerContainer}>
                {properties.map((prop) => (
                  <TouchableOpacity
                    key={prop.id}
                    style={[styles.pickerItem, property === prop.id && styles.pickerItemActive]}
                    onPress={() => {
                      setProperty(prop.id)
                      setShowPropertyPicker(false)
                    }}
                  >
                    <Text style={[styles.pickerItemText, property === prop.id && styles.pickerItemTextActive]}>
                      {prop.name}
                    </Text>
                    <Text style={styles.pickerItemSubtext}>{prop.address}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            )}
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Unit</Text>
            <TouchableOpacity
              style={styles.selectInput}
              onPress={() => setShowUnitPicker(!showUnitPicker)}
              disabled={isSubmitting || !property || units.length === 0}
            >
              <Text style={styles.selectInputText}>{unit ? getUnitNumber(unit) : "Select Unit"}</Text>
              {property && units.length > 0 && <Ionicons name="chevron-down" size={20} color={COLORS.gray} />}
            </TouchableOpacity>

            {showUnitPicker && (
              <View style={styles.pickerContainer}>
                {units.map((unitObj) => (
                  <TouchableOpacity
                    key={unitObj.id}
                    style={[styles.pickerItem, unit === unitObj.id && styles.pickerItemActive]}
                    onPress={() => {
                      setUnit(unitObj.id)
                      setShowUnitPicker(false)
                    }}
                  >
                    <Text style={[styles.pickerItemText, unit === unitObj.id && styles.pickerItemTextActive]}>
                      Unit {unitObj.number}
                    </Text>
                    <Text style={styles.pickerItemSubtext}>Tenant: {unitObj.tenantName}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            )}
          </View>
        </View>

        <View style={styles.formSection}>
          <Text style={styles.sectionTitle}>Assignment & Scheduling</Text>

          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Assign To</Text>
            <TouchableOpacity
              style={styles.selectInput}
              onPress={() => setShowStaffPicker(!showStaffPicker)}
              disabled={isSubmitting}
            >
              <Text style={styles.selectInputText}>
                {assignedTo ? getStaffName(assignedTo) : "Select Staff Member"}
              </Text>
              <Ionicons name="chevron-down" size={20} color={COLORS.gray} />
            </TouchableOpacity>

            {showStaffPicker && (
              <View style={styles.pickerContainer}>
                <TouchableOpacity
                  style={[styles.pickerItem, !assignedTo && styles.pickerItemActive]}
                  onPress={() => {
                    setAssignedTo(null)
                    setShowStaffPicker(false)
                  }}
                >
                  <Text style={[styles.pickerItemText, !assignedTo && styles.pickerItemTextActive]}>Unassigned</Text>
                </TouchableOpacity>

                {mockStaff.map((staff) => (
                  <TouchableOpacity
                    key={staff.id}
                    style={[styles.pickerItem, assignedTo && assignedTo.id === staff.id && styles.pickerItemActive]}
                    onPress={() => {
                      setAssignedTo(staff)
                      setShowStaffPicker(false)
                    }}
                  >
                    <Text
                      style={[
                        styles.pickerItemText,
                        assignedTo && assignedTo.id === staff.id && styles.pickerItemTextActive,
                      ]}
                    >
                      {staff.name}
                    </Text>
                    <Text style={styles.pickerItemSubtext}>
                      {staff.role.replace(/_/g, " ")} • {staff.phone}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            )}
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Scheduled Date</Text>
            <TouchableOpacity style={styles.dateInput} onPress={() => setShowDatePicker(true)} disabled={isSubmitting}>
              <Text style={styles.dateInputText}>{formatDate(scheduledDate)}</Text>
              <Ionicons name="calendar-outline" size={20} color={COLORS.gray} />
            </TouchableOpacity>
            {showDatePicker && (
              <DateTimePicker
                value={scheduledDate}
                mode="date"
                display="default"
                onChange={onDateChange}
                minimumDate={new Date()}
              />
            )}
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Estimated Cost ($)</Text>
            <TextInput
              style={styles.input}
              value={estimatedCost}
              onChangeText={setEstimatedCost}
              placeholder="Enter estimated cost"
              keyboardType="numeric"
              editable={!isSubmitting}
            />
          </View>
        </View>

        <View style={styles.formSection}>
          <Text style={styles.sectionTitle}>Additional Information</Text>

          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Notes</Text>
            <TextInput
              style={[styles.input, styles.textArea]}
              value={notes}
              onChangeText={setNotes}
              placeholder="Add any additional notes or instructions"
              multiline
              numberOfLines={4}
              editable={!isSubmitting}
            />
          </View>

          <Text style={styles.photoSectionTitle}>Photos</Text>
          <Text style={styles.photoHelperText}>Add up to 5 photos to help document the issue.</Text>

          <View style={styles.photoButtons}>
            <TouchableOpacity
              style={styles.photoButton}
              onPress={takePhoto}
              disabled={isSubmitting || photos.length >= 5}
            >
              <Ionicons name="camera-outline" size={24} color={COLORS.primary} />
              <Text style={styles.photoButtonText}>Take Photo</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.photoButton}
              onPress={pickImage}
              disabled={isSubmitting || photos.length >= 5}
            >
              <Ionicons name="images-outline" size={24} color={COLORS.primary} />
              <Text style={styles.photoButtonText}>Upload Photo</Text>
            </TouchableOpacity>
          </View>

          {photos.length > 0 && (
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.photoList}>
              {photos.map((photo, index) => (
                <View key={index} style={styles.photoItem}>
                  <Image source={{ uri: photo }} style={styles.photo} />
                  <TouchableOpacity
                    style={styles.removePhotoButton}
                    onPress={() => removePhoto(index)}
                    disabled={isSubmitting}
                  >
                    <Ionicons name="close-circle" size={24} color={COLORS.error} />
                  </TouchableOpacity>
                </View>
              ))}
            </ScrollView>
          )}
        </View>

        <TouchableOpacity
          style={[styles.submitButton, isSubmitting && styles.disabledButton]}
          onPress={handleSubmit}
          disabled={isSubmitting}
        >
          {isSubmitting ? (
            <ActivityIndicator size="small" color={COLORS.white} />
          ) : (
            <Text style={styles.submitButtonText}>Create Work Order</Text>
          )}
        </TouchableOpacity>
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
    backgroundColor: COLORS.white,
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
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: COLORS.gray,
  },
  content: {
    flex: 1,
    padding: 16,
  },
  formSection: {
    backgroundColor: COLORS.white,
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: COLORS.darkGray,
    marginBottom: 16,
  },
  inputGroup: {
    marginBottom: 16,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: "500",
    color: COLORS.darkGray,
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: COLORS.lightGray,
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    backgroundColor: COLORS.white,
  },
  textArea: {
    height: 120,
    textAlignVertical: "top",
  },
  categoryContainer: {
    flexDirection: "row",
    marginBottom: 8,
  },
  categoryItem: {
    alignItems: "center",
    justifyContent: "center",
    padding: 12,
    borderRadius: 8,
    marginRight: 12,
    backgroundColor: COLORS.primaryLight,
    minWidth: 80,
  },
  categoryItemActive: {
    backgroundColor: COLORS.primary,
  },
  categoryText: {
    marginTop: 4,
    fontSize: 12,
    color: COLORS.primary,
    fontWeight: "500",
  },
  categoryTextActive: {
    color: COLORS.white,
  },
  priorityContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  priorityItem: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 12,
    borderRadius: 8,
    marginHorizontal: 4,
    backgroundColor: COLORS.background,
    borderWidth: 1,
    borderColor: COLORS.lightGray,
  },
  priorityText: {
    fontSize: 14,
    fontWeight: "500",
    color: COLORS.darkGray,
  },
  priorityTextActive: {
    color: COLORS.white,
    fontWeight: "bold",
  },
  selectInput: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderWidth: 1,
    borderColor: COLORS.lightGray,
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: COLORS.white,
  },
  selectInputText: {
    fontSize: 16,
    color: COLORS.darkGray,
  },
  pickerContainer: {
    marginTop: 4,
    borderWidth: 1,
    borderColor: COLORS.lightGray,
    borderRadius: 8,
    backgroundColor: COLORS.white,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    zIndex: 1000,
  },
  pickerItem: {
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.lightGray,
  },
  pickerItemActive: {
    backgroundColor: COLORS.primaryLight,
  },
  pickerItemText: {
    fontSize: 16,
    color: COLORS.darkGray,
    marginBottom: 4,
  },
  pickerItemTextActive: {
    color: COLORS.primary,
    fontWeight: "bold",
  },
  pickerItemSubtext: {
    fontSize: 12,
    color: COLORS.gray,
  },
  dateInput: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderWidth: 1,
    borderColor: COLORS.lightGray,
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: COLORS.white,
  },
  dateInputText: {
    fontSize: 16,
    color: COLORS.darkGray,
  },
  photoSectionTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: COLORS.darkGray,
    marginTop: 16,
    marginBottom: 8,
  },
  photoHelperText: {
    fontSize: 14,
    color: COLORS.gray,
    marginBottom: 16,
  },
  photoButtons: {
    flexDirection: "row",
    marginBottom: 16,
  },
  photoButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: COLORS.primaryLight,
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 8,
    marginRight: 12,
  },
  photoButtonText: {
    color: COLORS.primary,
    fontWeight: "500",
    marginLeft: 8,
  },
  photoList: {
    flexDirection: "row",
    marginBottom: 8,
  },
  photoItem: {
    marginRight: 12,
    position: "relative",
  },
  photo: {
    width: 100,
    height: 100,
    borderRadius: 8,
  },
  removePhotoButton: {
    position: "absolute",
    top: -8,
    right: -8,
    backgroundColor: COLORS.white,
    borderRadius: 12,
  },
  submitButton: {
    backgroundColor: COLORS.primary,
    paddingVertical: 16,
    borderRadius: 8,
    alignItems: "center",
    marginBottom: 32,
  },
  disabledButton: {
    opacity: 0.7,
  },
  submitButtonText: {
    color: COLORS.white,
    fontSize: 16,
    fontWeight: "bold",
  },
})

export default CreateWorkOrderScreen

