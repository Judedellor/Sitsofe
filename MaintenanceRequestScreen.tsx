"use client"

import { Switch } from "@/components/ui/switch"

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
import * as ImagePicker from "expo-image-picker"
import DateTimePicker from "@react-native-community/datetimepicker"

// Priority levels
const PRIORITY_LEVELS = [
  { id: "low", label: "Low", color: COLORS.success },
  { id: "medium", label: "Medium", color: COLORS.warning },
  { id: "high", label: "High", color: COLORS.error },
]

// Mock properties data
const mockProperties = [
  { id: "1", name: "Sunset Villa", address: "123 Ocean Drive, Malibu, CA" },
  { id: "2", name: "Downtown Loft", address: "456 Main St, Los Angeles, CA" },
  { id: "3", name: "Mountain Retreat", address: "789 Pine Rd, Big Bear, CA" },
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

const MaintenanceRequestScreen = () => {
  const navigation = useNavigation()
  const route = useRoute()
  const { propertyId } = route.params || {}
  const { user } = useAuth()

  const [isLoading, setIsLoading] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Form state
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [category, setCategory] = useState("")
  const [priority, setPriority] = useState("medium")
  const [property, setProperty] = useState(propertyId || "")
  const [location, setLocation] = useState("")
  const [preferredDate, setPreferredDate] = useState(new Date())
  const [showDatePicker, setShowDatePicker] = useState(false)
  const [permissionToEnter, setPermissionToEnter] = useState(true)
  const [petInHome, setPetInHome] = useState(false)
  const [petDetails, setPetDetails] = useState("")
  const [photos, setPhotos] = useState([])

  // Properties state
  const [properties, setProperties] = useState([])
  const [showPropertyPicker, setShowPropertyPicker] = useState(false)

  // Load properties
  useEffect(() => {
    const loadProperties = async () => {
      try {
        setIsLoading(true)

        // In a real app, you would fetch from your API
        await new Promise((resolve) => setTimeout(resolve, 800)) // Simulate API call

        // Filter properties based on user role
        let userProperties = [...mockProperties]

        if (user?.role === "tenant" && user?.properties) {
          userProperties = mockProperties.filter((prop) => user.properties.includes(prop.id))
        }

        setProperties(userProperties)

        // If propertyId is provided and valid, set it
        if (propertyId && userProperties.some((p) => p.id === propertyId)) {
          setProperty(propertyId)
        } else if (userProperties.length === 1) {
          // If user has only one property, select it automatically
          setProperty(userProperties[0].id)
        }
      } catch (error) {
        console.error("Error loading properties:", error)
        Alert.alert("Error", "Failed to load properties. Please try again.")
      } finally {
        setIsLoading(false)
      }
    }

    loadProperties()
  }, [propertyId, user])

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
    const currentDate = selectedDate || preferredDate
    setShowDatePicker(Platform.OS === "ios")
    setPreferredDate(currentDate)
  }

  // Get property name by id
  const getPropertyName = (id) => {
    const prop = properties.find((p) => p.id === id)
    return prop ? prop.name : "Unknown Property"
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
      Alert.alert("Missing Information", "Please enter a title for your maintenance request.")
      return false
    }

    if (!description.trim()) {
      Alert.alert("Missing Information", "Please describe the issue in detail.")
      return false
    }

    if (!category) {
      Alert.alert("Missing Information", "Please select a category for your maintenance request.")
      return false
    }

    if (!property) {
      Alert.alert("Missing Information", "Please select a property for your maintenance request.")
      return false
    }

    if (petInHome && !petDetails.trim()) {
      Alert.alert("Missing Information", "Please provide details about your pets.")
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

      Alert.alert(
        "Request Submitted",
        "Your maintenance request has been submitted successfully. We will review it and get back to you soon.",
        [
          {
            text: "OK",
            onPress: () => navigation.goBack(),
          },
        ],
      )
    } catch (error) {
      console.error("Error submitting maintenance request:", error)
      Alert.alert("Error", "Failed to submit maintenance request. Please try again.")
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
          <Text style={styles.headerTitle}>Maintenance Request</Text>
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
        <Text style={styles.headerTitle}>Maintenance Request</Text>
      </View>

      <ScrollView style={styles.content}>
        <View style={styles.formSection}>
          <Text style={styles.sectionTitle}>Request Details</Text>

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
              {PRIORITY_LEVELS.map((level) => (
                <TouchableOpacity
                  key={level.id}
                  style={[styles.priorityItem, priority === level.id && { backgroundColor: level.color }]}
                  onPress={() => setPriority(level.id)}
                  disabled={isSubmitting}
                >
                  <Text style={[styles.priorityText, priority === level.id && styles.priorityTextActive]}>
                    {level.label}
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
            <Text style={styles.inputLabel}>Specific Location</Text>
            <TextInput
              style={styles.input}
              value={location}
              onChangeText={setLocation}
              placeholder="e.g., Kitchen, Bathroom, Bedroom"
              editable={!isSubmitting}
            />
          </View>
        </View>

        <View style={styles.formSection}>
          <Text style={styles.sectionTitle}>Access Information</Text>

          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Preferred Date (Optional)</Text>
            <TouchableOpacity style={styles.dateInput} onPress={() => setShowDatePicker(true)} disabled={isSubmitting}>
              <Text style={styles.dateInputText}>{formatDate(preferredDate)}</Text>
              <Ionicons name="calendar-outline" size={20} color={COLORS.gray} />
            </TouchableOpacity>
            {showDatePicker && (
              <DateTimePicker
                value={preferredDate}
                mode="date"
                display="default"
                onChange={onDateChange}
                minimumDate={new Date()}
              />
            )}
          </View>

          <View style={styles.switchGroup}>
            <Text style={styles.switchLabel}>Permission to enter if not home</Text>
            <Switch
              value={permissionToEnter}
              onValueChange={setPermissionToEnter}
              trackColor={{ false: COLORS.lightGray, true: COLORS.primaryLight }}
              thumbColor={permissionToEnter ? COLORS.primary : COLORS.gray}
              disabled={isSubmitting}
            />
          </View>

          <View style={styles.switchGroup}>
            <Text style={styles.switchLabel}>Pets in home</Text>
            <Switch
              value={petInHome}
              onValueChange={setPetInHome}
              trackColor={{ false: COLORS.lightGray, true: COLORS.primaryLight }}
              thumbColor={petInHome ? COLORS.primary : COLORS.gray}
              disabled={isSubmitting}
            />
          </View>

          {petInHome && (
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Pet Details</Text>
              <TextInput
                style={styles.input}
                value={petDetails}
                onChangeText={setPetDetails}
                placeholder="Type, breed, and temperament of pets"
                editable={!isSubmitting}
              />
            </View>
          )}
        </View>

        <View style={styles.formSection}>
          <Text style={styles.sectionTitle}>Photos</Text>
          <Text style={styles.photoHelperText}>Add up to 5 photos to help us understand the issue better.</Text>

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
            <Text style={styles.submitButtonText}>Submit Request</Text>
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
  switchGroup: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  switchLabel: {
    fontSize: 16,
    color: COLORS.darkGray,
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

export default MaintenanceRequestScreen

