"use client"

import { useState } from "react"
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  Image,
  Platform,
} from "react-native"
import { useSafeAreaInsets } from "react-native-safe-area-context"
import DateTimePicker from "@react-native-community/datetimepicker"
import * as ImagePicker from "expo-image-picker"

// Mock properties data for dropdown
const mockProperties = [
  { id: "1", name: "Sunny Apartments 301", address: "123 Main St, Anytown, CA" },
  { id: "2", name: "Ocean View 205", address: "456 Beach Rd, Seaside, FL" },
  { id: "3", name: "Highland Gardens 102", address: "789 Mountain Ave, Highland, CO" },
  { id: "4", name: "City Lofts 407", address: "101 Urban St, Metro, NY" },
]

// Mock tenants data for dropdown
const mockTenants = [
  { id: "1", name: "John Smith", propertyId: "1", phone: "555-123-4567" },
  { id: "2", name: "Sarah Johnson", propertyId: "2", phone: "555-234-5678" },
  { id: "3", name: "Michael Davis", propertyId: "3", phone: "555-345-6789" },
  { id: "4", name: "Jessica Williams", propertyId: "4", phone: "555-456-7890" },
]

// Categories for maintenance requests
const categories = ["Plumbing", "Electrical", "HVAC", "Appliance", "Structural", "Pest Control", "Landscaping", "Other"]

// Priority levels
const priorities = ["Low", "Medium", "High", "Emergency"]

// Define the type for form errors
interface FormErrors {
  title?: string
  description?: string
  propertyId?: string
  tenantId?: string
  category?: string
  priority?: string
}

const AddMaintenanceRequestScreen = ({ route, navigation }) => {
  const insets = useSafeAreaInsets()
  const { propertyId, tenantId } = route.params || {}

  // Form state
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [selectedPropertyId, setSelectedPropertyId] = useState(propertyId || "")
  const [selectedTenantId, setSelectedTenantId] = useState(tenantId || "")
  const [category, setCategory] = useState("")
  const [priority, setPriority] = useState("Medium")
  const [scheduledDate, setScheduledDate] = useState(new Date())
  const [estimatedCost, setEstimatedCost] = useState("")
  const [assignedTo, setAssignedTo] = useState("")
  const [images, setImages] = useState<string[]>([])

  // UI state
  const [showPropertyDropdown, setShowPropertyDropdown] = useState(false)
  const [showTenantDropdown, setShowTenantDropdown] = useState(false)
  const [showCategoryDropdown, setShowCategoryDropdown] = useState(false)
  const [showDatePicker, setShowDatePicker] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [errors, setErrors] = useState<FormErrors>({})

  // Properties and tenants data
  const [properties, setProperties] = useState(mockProperties)
  const [tenants, setTenants] = useState(mockTenants)

  // Filter tenants based on selected property
  const filteredTenants = selectedPropertyId
    ? tenants.filter((tenant) => tenant.propertyId === selectedPropertyId)
    : tenants

  // Get selected property name
  const getSelectedPropertyName = () => {
    const property = properties.find((p) => p.id === selectedPropertyId)
    return property ? property.name : "Select Property"
  }

  // Get selected tenant name
  const getSelectedTenantName = () => {
    const tenant = tenants.find((t) => t.id === selectedTenantId)
    return tenant ? tenant.name : "Select Tenant"
  }

  // Format date for display
  const formatDate = (date: Date) => {
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  }

  // Handle date change
  const onDateChange = (event, selectedDate) => {
    const currentDate = selectedDate || scheduledDate
    setShowDatePicker(Platform.OS === "ios")
    setScheduledDate(currentDate)
  }

  // Handle image picking
  const pickImage = async () => {
    // Request permission
    if (Platform.OS !== "web") {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync()
      if (status !== "granted") {
        Alert.alert("Permission Denied", "Sorry, we need camera roll permissions to upload images.")
        return
      }
    }

    // Launch image picker
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.8,
    })

    if (!result.canceled && result.assets && result.assets.length > 0) {
      setImages([...images, result.assets[0].uri])
    }
  }

  // Handle camera
  const takePhoto = async () => {
    // Request permission
    if (Platform.OS !== "web") {
      const { status } = await ImagePicker.requestCameraPermissionsAsync()
      if (status !== "granted") {
        Alert.alert("Permission Denied", "Sorry, we need camera permissions to take photos.")
        return
      }
    }

    // Launch camera
    const result = await ImagePicker.launchCameraAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.8,
    })

    if (!result.canceled && result.assets && result.assets.length > 0) {
      setImages([...images, result.assets[0].uri])
    }
  }

  // Remove image
  const removeImage = (index: number) => {
    const newImages = [...images]
    newImages.splice(index, 1)
    setImages(newImages)
  }

  // Validate form
  const validateForm = () => {
    const formErrors: FormErrors = {}

    if (!title.trim()) formErrors.title = "Title is required"
    if (!description.trim()) formErrors.description = "Description is required"
    if (!selectedPropertyId) formErrors.propertyId = "Property selection is required"
    if (!selectedTenantId) formErrors.tenantId = "Tenant selection is required"
    if (!category) formErrors.category = "Category is required"
    if (!priority) formErrors.priority = "Priority is required"

    setErrors(formErrors)
    return Object.keys(formErrors).length === 0
  }

  // Handle form submission
  const handleSubmit = async () => {
    if (validateForm()) {
      setIsLoading(true)

      try {
        // In a real app, you would call an API to create the maintenance request
        await new Promise((resolve) => setTimeout(resolve, 1000)) // Simulate API call

        const property = properties.find((p) => p.id === selectedPropertyId)
        const tenant = tenants.find((t) => t.id === selectedTenantId)

        const maintenanceData = {
          title,
          description,
          status: "Open",
          priority,
          category,
          propertyId: selectedPropertyId,
          propertyName: property?.name,
          propertyAddress: property?.address,
          tenantId: selectedTenantId,
          tenantName: tenant?.name,
          tenantPhone: tenant?.phone,
          dateReported: new Date().toISOString(),
          scheduledDate: scheduledDate.toISOString(),
          assignedTo: assignedTo || "Unassigned",
          estimatedCost: estimatedCost ? Number(estimatedCost) : 0,
          images,
          updates: [
            {
              date: new Date().toISOString(),
              author: "System",
              content: "Maintenance request created",
            },
          ],
          createdAt: new Date().toISOString(),
        }

        console.log("New maintenance request data:", maintenanceData)

        Alert.alert("Success", "Maintenance request submitted successfully!", [
          {
            text: "OK",
            onPress: () => navigation.goBack(),
          },
        ])
      } catch (error) {
        Alert.alert("Error", "Failed to submit maintenance request. Please try again.")
        console.error("Error submitting maintenance request:", error)
      } finally {
        setIsLoading(false)
      }
    }
  }

  return (
    <View
      style={[
        styles.container,
        {
          paddingTop: insets.top,
          paddingBottom: insets.bottom,
          paddingLeft: insets.left,
          paddingRight: insets.right,
        },
      ]}
    >
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()} disabled={isLoading}>
          <Text style={styles.backButtonText}>← Back</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>New Maintenance Request</Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView style={styles.formContainer}>
        <View style={styles.formSection}>
          <Text style={styles.sectionTitle}>Request Details</Text>

          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Title*</Text>
            <TextInput
              style={[styles.textInput, errors.title && styles.inputError]}
              value={title}
              onChangeText={setTitle}
              placeholder="Brief description of the issue"
              editable={!isLoading}
            />
            {errors.title && <Text style={styles.errorText}>{errors.title}</Text>}
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Description*</Text>
            <TextInput
              style={[styles.textArea, errors.description && styles.inputError]}
              value={description}
              onChangeText={setDescription}
              placeholder="Detailed description of the maintenance issue"
              multiline
              numberOfLines={4}
              textAlignVertical="top"
              editable={!isLoading}
            />
            {errors.description && <Text style={styles.errorText}>{errors.description}</Text>}
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Property*</Text>
            <TouchableOpacity
              style={[styles.dropdownButton, errors.propertyId && styles.inputError, isLoading && styles.disabledInput]}
              onPress={() => !isLoading && setShowPropertyDropdown(!showPropertyDropdown)}
            >
              <Text style={styles.dropdownButtonText}>{getSelectedPropertyName()}</Text>
              <Text style={styles.dropdownIcon}>▼</Text>
            </TouchableOpacity>
            {errors.propertyId && <Text style={styles.errorText}>{errors.propertyId}</Text>}

            {showPropertyDropdown && (
              <View style={styles.dropdownList}>
                {properties.map((property) => (
                  <TouchableOpacity
                    key={property.id}
                    style={styles.dropdownItem}
                    onPress={() => {
                      setSelectedPropertyId(property.id)
                      // Clear tenant selection if property changes
                      if (selectedTenantId) {
                        const tenant = tenants.find((t) => t.id === selectedTenantId)
                        if (tenant && tenant.propertyId !== property.id) {
                          setSelectedTenantId("")
                        }
                      }
                      setShowPropertyDropdown(false)
                    }}
                  >
                    <Text style={styles.dropdownItemText}>{property.name}</Text>
                    <Text style={styles.dropdownItemSubtext}>{property.address}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            )}
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Tenant*</Text>
            <TouchableOpacity
              style={[
                styles.dropdownButton,
                errors.tenantId && styles.inputError,
                isLoading && styles.disabledInput,
                !selectedPropertyId && styles.disabledInput,
              ]}
              onPress={() => !isLoading && selectedPropertyId && setShowTenantDropdown(!showTenantDropdown)}
            >
              <Text style={styles.dropdownButtonText}>
                {!selectedPropertyId ? "Select a property first" : getSelectedTenantName()}
              </Text>
              <Text style={styles.dropdownIcon}>▼</Text>
            </TouchableOpacity>
            {errors.tenantId && <Text style={styles.errorText}>{errors.tenantId}</Text>}

            {showTenantDropdown && (
              <View style={styles.dropdownList}>
                {filteredTenants.map((tenant) => (
                  <TouchableOpacity
                    key={tenant.id}
                    style={styles.dropdownItem}
                    onPress={() => {
                      setSelectedTenantId(tenant.id)
                      setShowTenantDropdown(false)
                    }}
                  >
                    <Text style={styles.dropdownItemText}>{tenant.name}</Text>
                    <Text style={styles.dropdownItemSubtext}>Phone: {tenant.phone}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            )}
          </View>

          <View style={styles.rowInputs}>
            <View style={[styles.inputGroup, { flex: 1, marginRight: 8 }]}>
              <Text style={styles.inputLabel}>Category*</Text>
              <TouchableOpacity
                style={[styles.dropdownButton, errors.category && styles.inputError, isLoading && styles.disabledInput]}
                onPress={() => !isLoading && setShowCategoryDropdown(!showCategoryDropdown)}
              >
                <Text style={styles.dropdownButtonText}>{category || "Select Category"}</Text>
                <Text style={styles.dropdownIcon}>▼</Text>
              </TouchableOpacity>
              {errors.category && <Text style={styles.errorText}>{errors.category}</Text>}

              {showCategoryDropdown && (
                <View style={styles.dropdownList}>
                  {categories.map((cat) => (
                    <TouchableOpacity
                      key={cat}
                      style={styles.dropdownItem}
                      onPress={() => {
                        setCategory(cat)
                        setShowCategoryDropdown(false)
                      }}
                    >
                      <Text style={styles.dropdownItemText}>{cat}</Text>
                    </TouchableOpacity>
                  ))}
                </View>
              )}
            </View>

            <View style={[styles.inputGroup, { flex: 1 }]}>
              <Text style={styles.inputLabel}>Priority*</Text>
              <View style={styles.priorityButtons}>
                {priorities.map((p) => (
                  <TouchableOpacity
                    key={p}
                    style={[
                      styles.priorityButton,
                      priority === p && styles.activePriorityButton(p),
                      isLoading && styles.disabledInput,
                    ]}
                    onPress={() => !isLoading && setPriority(p)}
                  >
                    <Text style={[styles.priorityButtonText, priority === p && styles.activePriorityButtonText]}>
                      {p}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
              {errors.priority && <Text style={styles.errorText}>{errors.priority}</Text>}
            </View>
          </View>
        </View>

        <View style={styles.formSection}>
          <Text style={styles.sectionTitle}>Additional Details</Text>

          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Scheduled Date</Text>
            <TouchableOpacity
              style={[styles.dateButton, isLoading && styles.disabledInput]}
              onPress={() => !isLoading && setShowDatePicker(true)}
            >
              <Text style={styles.dateButtonText}>{formatDate(scheduledDate)}</Text>
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
            <Text style={styles.inputLabel}>Estimated Cost</Text>
            <TextInput
              style={styles.textInput}
              value={estimatedCost}
              onChangeText={setEstimatedCost}
              placeholder="0.00"
              keyboardType="numeric"
              editable={!isLoading}
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Assign To</Text>
            <TextInput
              style={styles.textInput}
              value={assignedTo}
              onChangeText={setAssignedTo}
              placeholder="Name of maintenance person or contractor"
              editable={!isLoading}
            />
          </View>
        </View>

        <View style={styles.formSection}>
          <Text style={styles.sectionTitle}>Photos</Text>

          <View style={styles.imageButtons}>
            <TouchableOpacity
              style={[styles.imageButton, isLoading && styles.disabledInput]}
              onPress={pickImage}
              disabled={isLoading}
            >
              <Text style={styles.imageButtonText}>Upload Photo</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.imageButton, isLoading && styles.disabledInput]}
              onPress={takePhoto}
              disabled={isLoading}
            >
              <Text style={styles.imageButtonText}>Take Photo</Text>
            </TouchableOpacity>
          </View>

          {images.length > 0 && (
            <View style={styles.imagePreviewContainer}>
              {images.map((image, index) => (
                <View key={index} style={styles.imagePreview}>
                  <Image source={{ uri: image }} style={styles.previewImage} />
                  <TouchableOpacity
                    style={styles.removeImageButton}
                    onPress={() => removeImage(index)}
                    disabled={isLoading}
                  >
                    <Text style={styles.removeImageButtonText}>✕</Text>
                  </TouchableOpacity>
                </View>
              ))}
            </View>
          )}
        </View>

        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.cancelButton} onPress={() => navigation.goBack()} disabled={isLoading}>
            <Text style={styles.cancelButtonText}>Cancel</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.submitButton, isLoading && styles.submitButtonDisabled]}
            onPress={handleSubmit}
            disabled={isLoading}
          >
            {isLoading ? (
              <ActivityIndicator color="white" />
            ) : (
              <Text style={styles.submitButtonText}>Submit Request</Text>
            )}
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: "white",
    borderBottomWidth: 1,
    borderBottomColor: "#e0e0e0",
  },
  backButton: {
    padding: 8,
  },
  backButtonText: {
    fontSize: 16,
    color: "#2196F3",
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#333",
  },
  placeholder: {
    width: 40,
  },
  formContainer: {
    flex: 1,
    padding: 16,
  },
  formSection: {
    backgroundColor: "white",
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
    color: "#333",
    marginBottom: 16,
  },
  inputGroup: {
    marginBottom: 16,
  },
  inputLabel: {
    fontSize: 14,
    color: "#666",
    marginBottom: 8,
  },
  textInput: {
    backgroundColor: "#f9f9f9",
    borderWidth: 1,
    borderColor: "#e0e0e0",
    borderRadius: 4,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 16,
  },
  textArea: {
    backgroundColor: "#f9f9f9",
    borderWidth: 1,
    borderColor: "#e0e0e0",
    borderRadius: 4,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 16,
    minHeight: 100,
  },
  inputError: {
    borderColor: "#f44336",
  },
  errorText: {
    color: "#f44336",
    fontSize: 12,
    marginTop: 4,
  },
  rowInputs: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  dropdownButton: {
    backgroundColor: "#f9f9f9",
    borderWidth: 1,
    borderColor: "#e0e0e0",
    borderRadius: 4,
    paddingHorizontal: 12,
    paddingVertical: 10,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  dropdownButtonText: {
    fontSize: 16,
    color: "#333",
  },
  dropdownIcon: {
    fontSize: 12,
    color: "#666",
  },
  dropdownList: {
    backgroundColor: "white",
    borderWidth: 1,
    borderColor: "#e0e0e0",
    borderRadius: 4,
    marginTop: 4,
    maxHeight: 200,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    zIndex: 1000,
  },
  dropdownItem: {
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  dropdownItemText: {
    fontSize: 16,
    color: "#333",
  },
  dropdownItemSubtext: {
    fontSize: 12,
    color: "#666",
    marginTop: 2,
  },
  dateButton: {
    backgroundColor: "#f9f9f9",
    borderWidth: 1,
    borderColor: "#e0e0e0",
    borderRadius: 4,
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
  dateButtonText: {
    fontSize: 16,
    color: "#333",
  },
  priorityButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  priorityButton: {
    flex: 1,
    backgroundColor: "#f9f9f9",
    borderWidth: 1,
    borderColor: "#e0e0e0",
    borderRadius: 4,
    paddingVertical: 10,
    alignItems: "center",
    marginHorizontal: 2,
  },
  activePriorityButton: (priority) => ({
    backgroundColor:
      priority === "Low" ? "#4CAF50" : priority === "Medium" ? "#FFC107" : priority === "High" ? "#FF9800" : "#F44336", // Emergency
    borderColor:
      priority === "Low" ? "#4CAF50" : priority === "Medium" ? "#FFC107" : priority === "High" ? "#FF9800" : "#F44336", // Emergency
  }),
  priorityButtonText: {
    fontSize: 12,
    color: "#333",
  },
  activePriorityButtonText: {
    color: "white",
    fontWeight: "bold",
  },
  disabledInput: {
    opacity: 0.7,
  },
  imageButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 16,
  },
  imageButton: {
    flex: 1,
    backgroundColor: "#f0f0f0",
    paddingVertical: 12,
    borderRadius: 4,
    alignItems: "center",
    marginHorizontal: 4,
  },
  imageButtonText: {
    fontSize: 14,
    color: "#333",
    fontWeight: "500",
  },
  imagePreviewContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginTop: 8,
  },
  imagePreview: {
    width: 100,
    height: 100,
    margin: 4,
    position: "relative",
  },
  previewImage: {
    width: "100%",
    height: "100%",
    borderRadius: 4,
  },
  removeImageButton: {
    position: "absolute",
    top: -8,
    right: -8,
    backgroundColor: "#f44336",
    width: 24,
    height: 24,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
  },
  removeImageButtonText: {
    color: "white",
    fontSize: 12,
    fontWeight: "bold",
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 32,
  },
  cancelButton: {
    flex: 1,
    backgroundColor: "#e0e0e0",
    paddingVertical: 16,
    borderRadius: 8,
    marginRight: 8,
    alignItems: "center",
  },
  cancelButtonText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
  },
  submitButton: {
    flex: 2,
    backgroundColor: "#2196F3",
    paddingVertical: 16,
    borderRadius: 8,
    alignItems: "center",
  },
  submitButtonDisabled: {
    backgroundColor: "#90CAF9",
  },
  submitButtonText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "white",
  },
})

export default AddMaintenanceRequestScreen

