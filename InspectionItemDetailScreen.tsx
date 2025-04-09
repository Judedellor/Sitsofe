"use client"

import { useState } from "react"
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Image,
  TextInput,
  Alert,
  ActivityIndicator,
  Modal,
} from "react-native"
import { SafeAreaView } from "react-native-safe-area-context"
import { Ionicons } from "@expo/vector-icons"
import { useNavigation, useRoute } from "@react-navigation/native"
import { COLORS } from "../constants/colors"
import CameraComponent from "../components/CameraComponent"

// Condition options
const CONDITION_OPTIONS = [
  { value: "excellent", label: "Excellent", color: COLORS.success },
  { value: "good", label: "Good", color: COLORS.info },
  { value: "fair", label: "Fair", color: COLORS.warning },
  { value: "poor", label: "Poor", color: COLORS.error },
]

const InspectionItemDetailScreen = () => {
  const navigation = useNavigation()
  const route = useRoute()
  const { item } = route.params || {}

  const [inspectionItem, setInspectionItem] = useState(
    item || {
      id: "",
      category: "",
      photos: [],
      notes: "",
      condition: "good",
      timestamp: new Date().toISOString(),
    },
  )

  const [notes, setNotes] = useState(inspectionItem.notes || "")
  const [condition, setCondition] = useState(inspectionItem.condition || "good")
  const [photos, setPhotos] = useState(inspectionItem.photos || [])
  const [showCamera, setShowCamera] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [showIssueModal, setShowIssueModal] = useState(false)
  const [issueDetails, setIssueDetails] = useState({
    title: "",
    description: "",
    priority: "medium",
  })

  // Get category label
  const getCategoryLabel = (categoryId) => {
    const categories = {
      exterior: "Exterior",
      interior: "Interior",
      kitchen: "Kitchen",
      bathroom: "Bathroom",
      electrical: "Electrical",
      plumbing: "Plumbing",
      hvac: "HVAC",
      appliances: "Appliances",
      safety: "Safety",
      other: "Other",
    }
    return categories[categoryId] || "Other"
  }

  const handleAddPhoto = async () => {
    setShowCamera(true)
  }

  const handleCapturePhoto = (photoUri) => {
    setPhotos([...photos, photoUri])
    setShowCamera(false)
  }

  const handleRemovePhoto = (index) => {
    const updatedPhotos = [...photos]
    updatedPhotos.splice(index, 1)
    setPhotos(updatedPhotos)
  }

  const handleSave = async () => {
    try {
      setIsLoading(true)

      // Update inspection item
      const updatedItem = {
        ...inspectionItem,
        notes,
        condition,
        photos,
        updatedAt: new Date().toISOString(),
      }

      // In a real app, you would save this to your API
      await new Promise((resolve) => setTimeout(resolve, 1000)) // Simulate API call

      // Update local state
      setInspectionItem(updatedItem)

      Alert.alert("Success", "Inspection item saved successfully", [{ text: "OK", onPress: () => navigation.goBack() }])
    } catch (error) {
      console.error("Error saving inspection item:", error)
      Alert.alert("Error", "Failed to save inspection item. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  const handleCreateIssue = () => {
    setShowIssueModal(true)
  }

  const handleSubmitIssue = async () => {
    try {
      setIsLoading(true)

      // In a real app, you would save this to your API
      await new Promise((resolve) => setTimeout(resolve, 1000)) // Simulate API call

      setShowIssueModal(false)

      Alert.alert("Success", "Maintenance issue created successfully", [{ text: "OK" }])

      // Reset issue details
      setIssueDetails({
        title: "",
        description: "",
        priority: "medium",
      })
    } catch (error) {
      console.error("Error creating maintenance issue:", error)
      Alert.alert("Error", "Failed to create maintenance issue. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  if (!inspectionItem.id) {
    return (
      <SafeAreaView style={styles.container} edges={["top"]}>
        <View style={styles.header}>
          <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
            <Ionicons name="arrow-back" size={24} color={COLORS.darkGray} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Inspection Item</Text>
        </View>

        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={COLORS.primary} />
          <Text style={styles.loadingText}>Loading inspection item...</Text>
        </View>
      </SafeAreaView>
    )
  }

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color={COLORS.darkGray} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Inspection Item</Text>

        <TouchableOpacity style={styles.saveButton} onPress={handleSave} disabled={isLoading}>
          {isLoading ? (
            <ActivityIndicator size="small" color={COLORS.white} />
          ) : (
            <Text style={styles.saveButtonText}>Save</Text>
          )}
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content}>
        <View style={styles.categoryHeader}>
          <View style={styles.categoryIcon}>
            <Ionicons
              name={
                inspectionItem.category === "kitchen"
                  ? "restaurant"
                  : inspectionItem.category === "bathroom"
                    ? "water"
                    : inspectionItem.category === "electrical"
                      ? "flash"
                      : inspectionItem.category === "plumbing"
                        ? "water-outline"
                        : inspectionItem.category === "hvac"
                          ? "thermometer"
                          : inspectionItem.category === "appliances"
                            ? "cube"
                            : inspectionItem.category === "safety"
                              ? "shield-checkmark"
                              : inspectionItem.category === "exterior"
                                ? "home"
                                : inspectionItem.category === "interior"
                                  ? "bed"
                                  : "ellipsis-horizontal"
              }
              size={28}
              color={COLORS.primary}
            />
          </View>
          <Text style={styles.categoryText}>{getCategoryLabel(inspectionItem.category)}</Text>
          <Text style={styles.timestamp}>{new Date(inspectionItem.timestamp).toLocaleString()}</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Condition</Text>
          <View style={styles.conditionOptions}>
            {CONDITION_OPTIONS.map((option) => (
              <TouchableOpacity
                key={option.value}
                style={[
                  styles.conditionOption,
                  condition === option.value && { borderColor: option.color, backgroundColor: `${option.color}20` },
                ]}
                onPress={() => setCondition(option.value)}
              >
                <Text
                  style={[
                    styles.conditionText,
                    condition === option.value && { color: option.color, fontWeight: "bold" },
                  ]}
                >
                  {option.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Photos</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.photosContainer}>
            {photos.map((photo, index) => (
              <View key={index} style={styles.photoWrapper}>
                <Image source={{ uri: photo }} style={styles.photo} />
                <TouchableOpacity style={styles.removePhotoButton} onPress={() => handleRemovePhoto(index)}>
                  <Ionicons name="close-circle" size={24} color={COLORS.error} />
                </TouchableOpacity>
              </View>
            ))}

            <TouchableOpacity style={styles.addPhotoButton} onPress={handleAddPhoto}>
              <Ionicons name="camera" size={32} color={COLORS.primary} />
              <Text style={styles.addPhotoText}>Add Photo</Text>
            </TouchableOpacity>
          </ScrollView>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Notes</Text>
          <TextInput
            style={styles.notesInput}
            multiline
            placeholder="Enter notes about this item..."
            value={notes}
            onChangeText={setNotes}
          />
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Location</Text>
          {inspectionItem.location ? (
            <View style={styles.locationInfo}>
              <Ionicons name="location" size={20} color={COLORS.primary} style={styles.locationIcon} />
              <Text style={styles.locationText}>
                Lat: {inspectionItem.location.latitude.toFixed(6)}, Long: {inspectionItem.location.longitude.toFixed(6)}
              </Text>
            </View>
          ) : (
            <Text style={styles.noLocationText}>No location data available</Text>
          )}
        </View>

        <TouchableOpacity style={styles.createIssueButton} onPress={handleCreateIssue}>
          <Ionicons name="warning" size={24} color={COLORS.white} style={styles.createIssueIcon} />
          <Text style={styles.createIssueText}>Create Maintenance Issue</Text>
        </TouchableOpacity>
      </ScrollView>

      <Modal visible={showCamera} animationType="slide">
        <CameraComponent
          onCapture={handleCapturePhoto}
          onClose={() => setShowCamera(false)}
          allowGallery={true}
          allowVideo={false}
        />
      </Modal>

      <Modal
        visible={showIssueModal}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setShowIssueModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Create Maintenance Issue</Text>
              <TouchableOpacity onPress={() => setShowIssueModal(false)}>
                <Ionicons name="close" size={24} color={COLORS.darkGray} />
              </TouchableOpacity>
            </View>

            <ScrollView style={styles.modalBody}>
              <Text style={styles.inputLabel}>Issue Title</Text>
              <TextInput
                style={styles.input}
                placeholder="Enter issue title"
                value={issueDetails.title}
                onChangeText={(text) => setIssueDetails({ ...issueDetails, title: text })}
              />

              <Text style={styles.inputLabel}>Description</Text>
              <TextInput
                style={[styles.input, styles.textArea]}
                multiline
                placeholder="Describe the issue in detail"
                value={issueDetails.description}
                onChangeText={(text) => setIssueDetails({ ...issueDetails, description: text })}
              />

              <Text style={styles.inputLabel}>Priority</Text>
              <View style={styles.priorityOptions}>
                {["low", "medium", "high", "critical"].map((priority) => (
                  <TouchableOpacity
                    key={priority}
                    style={[
                      styles.priorityOption,
                      issueDetails.priority === priority && styles.priorityOptionSelected,
                      priority === "low" && styles.priorityLow,
                      priority === "medium" && styles.priorityMedium,
                      priority === "high" && styles.priorityHigh,
                      priority === "critical" && styles.priorityCritical,
                      issueDetails.priority === priority && {
                        backgroundColor:
                          priority === "low"
                            ? `${COLORS.success}20`
                            : priority === "medium"
                              ? `${COLORS.info}20`
                              : priority === "high"
                                ? `${COLORS.warning}20`
                                : `${COLORS.error}20`,
                      },
                    ]}
                    onPress={() => setIssueDetails({ ...issueDetails, priority: priority })}
                  >
                    <Text
                      style={[
                        styles.priorityText,
                        issueDetails.priority === priority && styles.priorityTextSelected,
                        issueDetails.priority === priority && {
                          color:
                            priority === "low"
                              ? COLORS.success
                              : priority === "medium"
                                ? COLORS.info
                                : priority === "high"
                                  ? COLORS.warning
                                  : COLORS.error,
                        },
                      ]}
                    >
                      {priority.charAt(0).toUpperCase() + priority.slice(1)}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>

              <Text style={styles.inputLabel}>Attach Photos</Text>
              <View style={styles.photoSelection}>
                {photos.map((photo, index) => (
                  <TouchableOpacity
                    key={index}
                    style={styles.photoSelectItem}
                    onPress={() => {
                      // Toggle photo selection logic would go here
                    }}
                  >
                    <Image source={{ uri: photo }} style={styles.photoSelectImage} />
                    <View style={styles.photoSelectCheckbox}>
                      <Ionicons name="checkmark-circle" size={24} color={COLORS.primary} />
                    </View>
                  </TouchableOpacity>
                ))}
              </View>
            </ScrollView>

            <View style={styles.modalFooter}>
              <TouchableOpacity style={styles.cancelButton} onPress={() => setShowIssueModal(false)}>
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.submitButton}
                onPress={handleSubmitIssue}
                disabled={isLoading || !issueDetails.title}
              >
                {isLoading ? (
                  <ActivityIndicator size="small" color={COLORS.white} />
                ) : (
                  <Text style={styles.submitButtonText}>Create Issue</Text>
                )}
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
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
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: COLORS.white,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.lightGray,
  },
  backButton: {
    padding: 4,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: COLORS.darkGray,
  },
  saveButton: {
    backgroundColor: COLORS.primary,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 4,
  },
  saveButtonText: {
    color: COLORS.white,
    fontWeight: "bold",
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
  categoryHeader: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: COLORS.white,
    padding: 16,
    borderRadius: 8,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  categoryIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: COLORS.primaryLight,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 16,
  },
  categoryText: {
    fontSize: 18,
    fontWeight: "bold",
    color: COLORS.darkGray,
    flex: 1,
  },
  timestamp: {
    fontSize: 12,
    color: COLORS.gray,
  },
  section: {
    backgroundColor: COLORS.white,
    padding: 16,
    borderRadius: 8,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: COLORS.darkGray,
    marginBottom: 12,
  },
  conditionOptions: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  conditionOption: {
    flex: 1,
    paddingVertical: 10,
    paddingHorizontal: 4,
    borderWidth: 1,
    borderColor: COLORS.lightGray,
    borderRadius: 4,
    marginHorizontal: 4,
    alignItems: "center",
  },
  conditionText: {
    fontSize: 14,
    color: COLORS.gray,
  },
  photosContainer: {
    flexDirection: "row",
    marginBottom: 8,
  },
  photoWrapper: {
    position: "relative",
    marginRight: 12,
  },
  photo: {
    width: 120,
    height: 120,
    borderRadius: 8,
  },
  removePhotoButton: {
    position: "absolute",
    top: -8,
    right: -8,
    backgroundColor: COLORS.white,
    borderRadius: 12,
  },
  addPhotoButton: {
    width: 120,
    height: 120,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: COLORS.lightGray,
    borderStyle: "dashed",
    justifyContent: "center",
    alignItems: "center",
  },
  addPhotoText: {
    fontSize: 14,
    color: COLORS.primary,
    marginTop: 8,
  },
  notesInput: {
    borderWidth: 1,
    borderColor: COLORS.lightGray,
    borderRadius: 8,
    padding: 12,
    minHeight: 120,
    textAlignVertical: "top",
  },
  locationInfo: {
    flexDirection: "row",
    alignItems: "center",
  },
  locationIcon: {
    marginRight: 8,
  },
  locationText: {
    fontSize: 14,
    color: COLORS.darkGray,
  },
  noLocationText: {
    fontSize: 14,
    color: COLORS.gray,
    fontStyle: "italic",
  },
  createIssueButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: COLORS.warning,
    padding: 16,
    borderRadius: 8,
    marginBottom: 24,
  },
  createIssueIcon: {
    marginRight: 8,
  },
  createIssueText: {
    fontSize: 16,
    fontWeight: "bold",
    color: COLORS.white,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    width: "90%",
    maxHeight: "80%",
    backgroundColor: COLORS.white,
    borderRadius: 12,
    overflow: "hidden",
  },
  modalHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.lightGray,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: COLORS.darkGray,
  },
  modalBody: {
    padding: 16,
    maxHeight: 400,
  },
  modalFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: COLORS.lightGray,
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
    padding: 12,
    marginBottom: 16,
  },
  textArea: {
    minHeight: 100,
    textAlignVertical: "top",
  },
  priorityOptions: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 16,
  },
  priorityOption: {
    flex: 1,
    paddingVertical: 10,
    paddingHorizontal: 4,
    borderWidth: 1,
    borderColor: COLORS.lightGray,
    borderRadius: 4,
    marginHorizontal: 4,
    alignItems: "center",
  },
  priorityOptionSelected: {
    borderWidth: 2,
  },
  priorityLow: {
    borderColor: COLORS.success,
  },
  priorityMedium: {
    borderColor: COLORS.info,
  },
  priorityHigh: {
    borderColor: COLORS.warning,
  },
  priorityCritical: {
    borderColor: COLORS.error,
  },
  priorityText: {
    fontSize: 12,
    color: COLORS.gray,
  },
  priorityTextSelected: {
    fontWeight: "bold",
  },
  photoSelection: {
    flexDirection: "row",
    flexWrap: "wrap",
  },
  photoSelectItem: {
    position: "relative",
    width: 80,
    height: 80,
    margin: 4,
  },
  photoSelectImage: {
    width: "100%",
    height: "100%",
    borderRadius: 4,
  },
  photoSelectCheckbox: {
    position: "absolute",
    top: -8,
    right: -8,
    backgroundColor: COLORS.white,
    borderRadius: 12,
  },
  cancelButton: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderWidth: 1,
    borderColor: COLORS.lightGray,
    borderRadius: 8,
  },
  cancelButtonText: {
    fontSize: 14,
    color: COLORS.darkGray,
  },
  submitButton: {
    paddingVertical: 12,
    paddingHorizontal: 24,
    backgroundColor: COLORS.primary,
    borderRadius: 8,
  },
  submitButtonText: {
    fontSize: 14,
    fontWeight: "bold",
    color: COLORS.white,
  },
})

export default InspectionItemDetailScreen

