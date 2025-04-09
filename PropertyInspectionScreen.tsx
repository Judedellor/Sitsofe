"use client"

import { useState, useEffect } from "react"
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Image,
  Alert,
  ActivityIndicator,
  Modal,
} from "react-native"
import { SafeAreaView } from "react-native-safe-area-context"
import { Ionicons } from "@expo/vector-icons"
import { useNavigation, useRoute } from "@react-navigation/native"
import { COLORS } from "../constants/colors"
import CameraComponent from "../components/CameraComponent"
import { LocationService } from "../services/LocationService"

// Mock property data
const mockProperty = {
  id: "property-1",
  name: "Sunset Villa",
  address: "123 Ocean Drive, Malibu, CA 90210",
  units: [
    { id: "unit-1", number: "101" },
    { id: "unit-2", number: "102" },
  ],
}

// Inspection categories
const INSPECTION_CATEGORIES = [
  { id: "exterior", label: "Exterior", icon: "home" },
  { id: "interior", label: "Interior", icon: "bed" },
  { id: "kitchen", label: "Kitchen", icon: "restaurant" },
  { id: "bathroom", label: "Bathroom", icon: "water" },
  { id: "electrical", label: "Electrical", icon: "flash" },
  { id: "plumbing", label: "Plumbing", icon: "water-outline" },
  { id: "hvac", label: "HVAC", icon: "thermometer" },
  { id: "appliances", label: "Appliances", icon: "cube" },
  { id: "safety", label: "Safety", icon: "shield-checkmark" },
  { id: "other", label: "Other", icon: "ellipsis-horizontal" },
]

// Inspection item interface
interface InspectionItem {
  id: string
  category: string
  photos: string[]
  notes: string
  condition: "excellent" | "good" | "fair" | "poor"
  timestamp: string
  location?: {
    latitude: number
    longitude: number
  }
}

const PropertyInspectionScreen = () => {
  const navigation = useNavigation()
  const route = useRoute()
  const { propertyId, unitId } = route.params || { propertyId: "property-1" }

  const [isLoading, setIsLoading] = useState(true)
  const [property, setProperty] = useState(mockProperty)
  const [selectedUnit, setSelectedUnit] = useState<string | null>(unitId || null)
  const [inspectionItems, setInspectionItems] = useState<InspectionItem[]>([])
  const [showCamera, setShowCamera] = useState(false)
  const [currentCategory, setCurrentCategory] = useState<string | null>(null)
  const [customChecklists, setCustomChecklists] = useState<any[]>([])
  const [selectedChecklist, setSelectedChecklist] = useState<string | null>(null)

  useEffect(() => {
    // Load property data
    const loadData = async () => {
      try {
        setIsLoading(true)
        // In a real app, you would fetch property data from your API
        await new Promise((resolve) => setTimeout(resolve, 1000)) // Simulate API call

        // For demo purposes, we're using mock data
        setProperty(mockProperty)

        // Load custom checklists
        loadCustomChecklists()

        // Load any existing inspection items
        // In a real app, you would fetch these from your API
        setInspectionItems([])
      } catch (error) {
        console.error("Error loading property data:", error)
        Alert.alert("Error", "Failed to load property data. Please try again.")
      } finally {
        setIsLoading(false)
      }
    }

    const loadCustomChecklists = async () => {
      try {
        // In a real app, you would fetch custom checklists from your API
        await new Promise((resolve) => setTimeout(resolve, 500)) // Simulate API call

        // For demo purposes, we're using mock data
        setCustomChecklists([
          {
            id: "checklist-1",
            name: "Move-in Inspection",
            categories: ["exterior", "interior", "kitchen", "bathroom", "safety"],
            items: 45,
          },
          {
            id: "checklist-2",
            name: "Move-out Inspection",
            categories: ["exterior", "interior", "kitchen", "bathroom", "appliances", "safety"],
            items: 48,
          },
          {
            id: "checklist-3",
            name: "Quarterly Inspection",
            categories: ["exterior", "interior", "safety", "plumbing", "hvac"],
            items: 30,
          },
          {
            id: "checklist-4",
            name: "Annual Inspection",
            categories: INSPECTION_CATEGORIES.map((cat) => cat.id),
            items: 65,
          },
        ])
      } catch (error) {
        console.error("Error loading custom checklists:", error)
      }
    }

    loadData()
  }, [propertyId])

  const startInspection = (category: string) => {
    setCurrentCategory(category)
    setShowCamera(true)
  }

  const handleCapturePhoto = async (photoUri: string) => {
    try {
      // Get current location
      const location = await LocationService.getCurrentLocation()

      // Create new inspection item
      const newItem: InspectionItem = {
        id: `inspection-${Date.now()}`,
        category: currentCategory || "other",
        photos: [photoUri],
        notes: "",
        condition: "good",
        timestamp: new Date().toISOString(),
        location: location
          ? {
              latitude: location.latitude,
              longitude: location.longitude,
            }
          : undefined,
      }

      setInspectionItems((prev) => [...prev, newItem])
      setShowCamera(false)

      // Navigate to inspection detail screen
      navigation.navigate("InspectionItemDetail", { item: newItem })
    } catch (error) {
      console.error("Error capturing photo:", error)
      Alert.alert("Error", "Failed to process photo. Please try again.")
    }
  }

  const renderCategoryItem = (category: { id: string; label: string; icon: string }) => (
    <TouchableOpacity key={category.id} style={styles.categoryItem} onPress={() => startInspection(category.id)}>
      <View style={styles.categoryIcon}>
        <Ionicons name={category.icon} size={28} color={COLORS.primary} />
      </View>
      <Text style={styles.categoryLabel}>{category.label}</Text>
    </TouchableOpacity>
  )

  if (isLoading) {
    return (
      <SafeAreaView style={styles.container} edges={["top"]}>
        <View style={styles.header}>
          <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
            <Ionicons name="arrow-back" size={24} color={COLORS.darkGray} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Property Inspection</Text>
        </View>

        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={COLORS.primary} />
          <Text style={styles.loadingText}>Loading property data...</Text>
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
        <Text style={styles.headerTitle}>Property Inspection</Text>
      </View>

      <ScrollView style={styles.content}>
        <View style={styles.propertyCard}>
          <Text style={styles.propertyName}>{property.name}</Text>
          <Text style={styles.propertyAddress}>{property.address}</Text>

          {property.units.length > 0 && (
            <View style={styles.unitSelector}>
              <Text style={styles.unitSelectorLabel}>Select Unit:</Text>
              <View style={styles.unitButtons}>
                <TouchableOpacity
                  style={[styles.unitButton, !selectedUnit && styles.unitButtonActive]}
                  onPress={() => setSelectedUnit(null)}
                >
                  <Text style={[styles.unitButtonText, !selectedUnit && styles.unitButtonTextActive]}>All Units</Text>
                </TouchableOpacity>

                {property.units.map((unit) => (
                  <TouchableOpacity
                    key={unit.id}
                    style={[styles.unitButton, selectedUnit === unit.id && styles.unitButtonActive]}
                    onPress={() => setSelectedUnit(unit.id)}
                  >
                    <Text style={[styles.unitButtonText, selectedUnit === unit.id && styles.unitButtonTextActive]}>
                      Unit {unit.number}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          )}

          {customChecklists.length > 0 && (
            <View style={styles.checklistSelector}>
              <Text style={styles.checklistSelectorLabel}>Select Checklist Template:</Text>
              <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.checklistButtons}>
                {customChecklists.map((checklist) => (
                  <TouchableOpacity
                    key={checklist.id}
                    style={[styles.checklistButton, selectedChecklist === checklist.id && styles.checklistButtonActive]}
                    onPress={() => setSelectedChecklist(checklist.id)}
                  >
                    <Text
                      style={[
                        styles.checklistButtonText,
                        selectedChecklist === checklist.id && styles.checklistButtonTextActive,
                      ]}
                    >
                      {checklist.name}
                    </Text>
                    <Text style={styles.checklistItemCount}>{checklist.items} items</Text>
                  </TouchableOpacity>
                ))}
                <TouchableOpacity
                  style={styles.checklistButton}
                  onPress={() => navigation.navigate("CreateChecklistTemplate")}
                >
                  <Text style={styles.checklistButtonText}>+ Create New</Text>
                </TouchableOpacity>
              </ScrollView>
            </View>
          )}
        </View>

        <View style={styles.inspectionSection}>
          <Text style={styles.sectionTitle}>Start New Inspection</Text>
          <Text style={styles.sectionDescription}>
            Select a category below to start inspecting. Take photos and add notes for each area.
          </Text>

          <View style={styles.categoriesGrid}>{INSPECTION_CATEGORIES.map(renderCategoryItem)}</View>
        </View>

        {inspectionItems.length > 0 && (
          <View style={styles.recentSection}>
            <Text style={styles.sectionTitle}>Recent Inspection Items</Text>

            {inspectionItems.map((item) => {
              const category = INSPECTION_CATEGORIES.find((c) => c.id === item.category)

              return (
                <TouchableOpacity
                  key={item.id}
                  style={styles.inspectionItem}
                  onPress={() => navigation.navigate("InspectionItemDetail", { item })}
                >
                  <View style={styles.inspectionItemHeader}>
                    <View style={styles.inspectionItemCategory}>
                      <Ionicons name={category?.icon || "document"} size={20} color={COLORS.primary} />
                      <Text style={styles.inspectionItemCategoryText}>{category?.label || "Other"}</Text>
                    </View>

                    <View
                      style={[
                        styles.conditionBadge,
                        item.condition === "excellent" && styles.conditionExcellent,
                        item.condition === "good" && styles.conditionGood,
                        item.condition === "fair" && styles.conditionFair,
                        item.condition === "poor" && styles.conditionPoor,
                      ]}
                    >
                      <Text style={styles.conditionText}>
                        {item.condition.charAt(0).toUpperCase() + item.condition.slice(1)}
                      </Text>
                    </View>
                  </View>

                  {item.photos.length > 0 && (
                    <Image source={{ uri: item.photos[0] }} style={styles.inspectionItemImage} />
                  )}

                  <Text style={styles.inspectionItemTimestamp}>{new Date(item.timestamp).toLocaleString()}</Text>
                </TouchableOpacity>
              )
            })}
          </View>
        )}

        <View style={styles.tenantNotificationSection}>
          <Text style={styles.sectionTitle}>Tenant Notifications</Text>
          <View style={styles.notificationOptions}>
            <TouchableOpacity
              style={styles.notificationOption}
              onPress={() => Alert.alert("Success", "Inspection notification sent to tenant")}
            >
              <View style={styles.notificationIcon}>
                <Ionicons name="mail" size={24} color={COLORS.primary} />
              </View>
              <Text style={styles.notificationLabel}>Send Notification</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.notificationOption}
              onPress={() => Alert.alert("Success", "Inspection reminder scheduled")}
            >
              <View style={styles.notificationIcon}>
                <Ionicons name="alarm" size={24} color={COLORS.primary} />
              </View>
              <Text style={styles.notificationLabel}>Schedule Reminder</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.notificationOption}
              onPress={() => Alert.alert("Success", "Results will be shared after completion")}
            >
              <View style={styles.notificationIcon}>
                <Ionicons name="share" size={24} color={COLORS.primary} />
              </View>
              <Text style={styles.notificationLabel}>Share Results</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>

      <Modal visible={showCamera} animationType="slide">
        <CameraComponent
          onCapture={handleCapturePhoto}
          onClose={() => setShowCamera(false)}
          allowGallery={true}
          allowVideo={false}
        />
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
  propertyCard: {
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
  propertyName: {
    fontSize: 18,
    fontWeight: "bold",
    color: COLORS.darkGray,
    marginBottom: 4,
  },
  propertyAddress: {
    fontSize: 14,
    color: COLORS.gray,
    marginBottom: 12,
  },
  unitSelector: {
    marginTop: 8,
  },
  unitSelectorLabel: {
    fontSize: 14,
    fontWeight: "500",
    color: COLORS.darkGray,
    marginBottom: 8,
  },
  unitButtons: {
    flexDirection: "row",
    flexWrap: "wrap",
  },
  unitButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    backgroundColor: COLORS.background,
    marginRight: 8,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: COLORS.lightGray,
  },
  unitButtonActive: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  unitButtonText: {
    fontSize: 14,
    color: COLORS.darkGray,
  },
  unitButtonTextActive: {
    color: COLORS.white,
  },
  inspectionSection: {
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
    marginBottom: 8,
  },
  sectionDescription: {
    fontSize: 14,
    color: COLORS.gray,
    marginBottom: 16,
  },
  categoriesGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  categoryItem: {
    width: "30%",
    alignItems: "center",
    marginBottom: 16,
  },
  categoryIcon: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: COLORS.primaryLight,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 8,
  },
  categoryLabel: {
    fontSize: 14,
    color: COLORS.darkGray,
    textAlign: "center",
  },
  recentSection: {
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
  inspectionItem: {
    borderWidth: 1,
    borderColor: COLORS.lightGray,
    borderRadius: 8,
    marginBottom: 12,
    overflow: "hidden",
  },
  inspectionItemHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.lightGray,
  },
  inspectionItemCategory: {
    flexDirection: "row",
    alignItems: "center",
  },
  inspectionItemCategoryText: {
    fontSize: 14,
    fontWeight: "500",
    color: COLORS.darkGray,
    marginLeft: 8,
  },
  conditionBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    backgroundColor: COLORS.gray,
  },
  conditionExcellent: {
    backgroundColor: COLORS.success,
  },
  conditionGood: {
    backgroundColor: COLORS.info,
  },
  conditionFair: {
    backgroundColor: COLORS.warning,
  },
  conditionPoor: {
    backgroundColor: COLORS.error,
  },
  conditionText: {
    fontSize: 12,
    fontWeight: "bold",
    color: COLORS.white,
  },
  inspectionItemImage: {
    width: "100%",
    height: 150,
    resizeMode: "cover",
  },
  inspectionItemTimestamp: {
    fontSize: 12,
    color: COLORS.gray,
    padding: 12,
  },
  checklistSelector: {
    marginTop: 16,
  },
  checklistSelectorLabel: {
    fontSize: 14,
    fontWeight: "500",
    color: COLORS.darkGray,
    marginBottom: 8,
  },
  checklistButtons: {
    flexDirection: "row",
    marginBottom: 8,
  },
  checklistButton: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 8,
    backgroundColor: COLORS.white,
    marginRight: 12,
    borderWidth: 1,
    borderColor: COLORS.lightGray,
    minWidth: 150,
  },
  checklistButtonActive: {
    backgroundColor: COLORS.primaryLight,
    borderColor: COLORS.primary,
  },
  checklistButtonText: {
    fontSize: 14,
    fontWeight: "500",
    color: COLORS.darkGray,
  },
  checklistButtonTextActive: {
    color: COLORS.primary,
  },
  checklistItemCount: {
    fontSize: 12,
    color: COLORS.gray,
    marginTop: 4,
  },
  tenantNotificationSection: {
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
  notificationOptions: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 12,
  },
  notificationOption: {
    alignItems: "center",
    width: "30%",
  },
  notificationIcon: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: COLORS.primaryLight,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 8,
  },
  notificationLabel: {
    fontSize: 12,
    color: COLORS.darkGray,
    textAlign: "center",
  },
})

export default PropertyInspectionScreen

