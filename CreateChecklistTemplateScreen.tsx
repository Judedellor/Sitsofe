"use client"

import { useState } from "react"
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  TextInput,
  Switch,
  Alert,
  ActivityIndicator,
} from "react-native"
import { SafeAreaView } from "react-native-safe-area-context"
import { Ionicons } from "@expo/vector-icons"
import { useNavigation } from "@react-navigation/native"
import { COLORS } from "../constants/colors"

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

// Sample checklist items by category
const SAMPLE_ITEMS = {
  exterior: [
    "Roof condition",
    "Exterior walls",
    "Windows and screens",
    "Doors and locks",
    "Gutters and downspouts",
    "Driveway/walkways",
    "Landscaping",
    "Exterior lighting",
  ],
  interior: [
    "Walls and ceilings",
    "Flooring",
    "Windows operation",
    "Doors and locks",
    "Light fixtures",
    "Smoke/CO detectors",
  ],
  kitchen: [
    "Sink and faucet",
    "Countertops",
    "Cabinets",
    "Refrigerator",
    "Stove/oven",
    "Dishwasher",
    "Garbage disposal",
    "Microwave",
  ],
  bathroom: ["Sink and faucet", "Toilet", "Shower/bathtub", "Exhaust fan", "Flooring", "Walls/ceiling"],
  electrical: ["Outlets and switches", "Circuit breaker panel", "GFCI operation", "Light fixtures"],
  plumbing: ["Water pressure", "Leaks", "Drains", "Water heater", "Shut-off valves"],
  hvac: ["Heating system", "Cooling system", "Thermostat", "Air filters", "Vents and returns"],
  appliances: ["Washer", "Dryer", "Refrigerator", "Stove/oven", "Dishwasher", "Microwave"],
  safety: ["Smoke detectors", "Carbon monoxide detectors", "Fire extinguishers", "Emergency exits", "Handrails"],
  other: ["Pest evidence", "Odors", "General cleanliness"],
}

const CreateChecklistTemplateScreen = () => {
  const navigation = useNavigation()

  const [templateName, setTemplateName] = useState("")
  const [templateDescription, setTemplateDescription] = useState("")
  const [selectedCategories, setSelectedCategories] = useState([])
  const [checklistItems, setChecklistItems] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const [currentCategory, setCurrentCategory] = useState(null)
  const [newItemText, setNewItemText] = useState("")
  const [isRequired, setIsRequired] = useState(true)
  const [includePhotos, setIncludePhotos] = useState(true)
  const [includeNotes, setIncludeNotes] = useState(true)

  const toggleCategory = (categoryId) => {
    if (selectedCategories.includes(categoryId)) {
      setSelectedCategories(selectedCategories.filter((id) => id !== categoryId))

      // Remove items from this category
      setChecklistItems(checklistItems.filter((item) => item.category !== categoryId))
    } else {
      setSelectedCategories([...selectedCategories, categoryId])

      // Add default items for this category
      const newItems = SAMPLE_ITEMS[categoryId].map((text, index) => ({
        id: `${categoryId}-${index}`,
        text,
        category: categoryId,
        required: true,
        includePhotos: true,
        includeNotes: true,
        order: checklistItems.length + index,
      }))

      setChecklistItems([...checklistItems, ...newItems])
    }
  }

  const handleAddItem = () => {
    if (!newItemText.trim() || !currentCategory) return

    const newItem = {
      id: `${currentCategory}-${Date.now()}`,
      text: newItemText.trim(),
      category: currentCategory,
      required: isRequired,
      includePhotos,
      includeNotes,
      order: checklistItems.length,
    }

    setChecklistItems([...checklistItems, newItem])
    setNewItemText("")
  }

  const handleRemoveItem = (itemId) => {
    setChecklistItems(checklistItems.filter((item) => item.id !== itemId))
  }

  const handleSaveTemplate = async () => {
    if (!templateName.trim()) {
      Alert.alert("Error", "Please enter a template name")
      return
    }

    if (selectedCategories.length === 0) {
      Alert.alert("Error", "Please select at least one category")
      return
    }

    if (checklistItems.length === 0) {
      Alert.alert("Error", "Please add at least one checklist item")
      return
    }

    try {
      setIsLoading(true)

      // In a real app, you would save this to your API
      await new Promise((resolve) => setTimeout(resolve, 1500)) // Simulate API call

      Alert.alert("Success", "Inspection checklist template saved successfully", [
        { text: "OK", onPress: () => navigation.goBack() },
      ])
    } catch (error) {
      console.error("Error saving template:", error)
      Alert.alert("Error", "Failed to save template. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  const onDragRelease = (data) => {
    setChecklistItems(data)
  }

  const renderCategoryItem = (category) => (
    <TouchableOpacity
      key={category.id}
      style={[styles.categoryItem, selectedCategories.includes(category.id) && styles.categoryItemSelected]}
      onPress={() => toggleCategory(category.id)}
    >
      <View style={[styles.categoryIcon, selectedCategories.includes(category.id) && styles.categoryIconSelected]}>
        <Ionicons
          name={category.icon}
          size={24}
          color={selectedCategories.includes(category.id) ? COLORS.white : COLORS.primary}
        />
      </View>
      <Text style={[styles.categoryLabel, selectedCategories.includes(category.id) && styles.categoryLabelSelected]}>
        {category.label}
      </Text>
    </TouchableOpacity>
  )

  const renderChecklistItem = (item, index) => {
    const category = INSPECTION_CATEGORIES.find((c) => c.id === item.category)

    return (
      <View key={item.id} style={styles.checklistItem}>
        <View style={styles.checklistItemHeader}>
          <View style={styles.checklistItemCategory}>
            <Ionicons name={category?.icon || "document"} size={16} color={COLORS.primary} />
            <Text style={styles.checklistItemCategoryText}>{category?.label || "Other"}</Text>
          </View>

          <TouchableOpacity style={styles.removeItemButton} onPress={() => handleRemoveItem(item.id)}>
            <Ionicons name="close-circle" size={20} color={COLORS.error} />
          </TouchableOpacity>
        </View>

        <Text style={styles.checklistItemText}>{item.text}</Text>

        <View style={styles.checklistItemOptions}>
          <View style={styles.optionItem}>
            <Text style={styles.optionLabel}>Required</Text>
            <Switch
              value={item.required}
              onValueChange={(value) => {
                const updatedItems = [...checklistItems]
                const itemIndex = updatedItems.findIndex((i) => i.id === item.id)
                updatedItems[itemIndex] = { ...updatedItems[itemIndex], required: value }
                setChecklistItems(updatedItems)
              }}
              trackColor={{ false: COLORS.lightGray, true: COLORS.primaryLight }}
              thumbColor={item.required ? COLORS.primary : COLORS.gray}
            />
          </View>

          <View style={styles.optionItem}>
            <Text style={styles.optionLabel}>Photos</Text>
            <Switch
              value={item.includePhotos}
              onValueChange={(value) => {
                const updatedItems = [...checklistItems]
                const itemIndex = updatedItems.findIndex((i) => i.id === item.id)
                updatedItems[itemIndex] = { ...updatedItems[itemIndex], includePhotos: value }
                setChecklistItems(updatedItems)
              }}
              trackColor={{ false: COLORS.lightGray, true: COLORS.primaryLight }}
              thumbColor={item.includePhotos ? COLORS.primary : COLORS.gray}
            />
          </View>

          <View style={styles.optionItem}>
            <Text style={styles.optionLabel}>Notes</Text>
            <Switch
              value={item.includeNotes}
              onValueChange={(value) => {
                const updatedItems = [...checklistItems]
                const itemIndex = updatedItems.findIndex((i) => i.id === item.id)
                updatedItems[itemIndex] = { ...updatedItems[itemIndex], includeNotes: value }
                setChecklistItems(updatedItems)
              }}
              trackColor={{ false: COLORS.lightGray, true: COLORS.primaryLight }}
              thumbColor={item.includeNotes ? COLORS.primary : COLORS.gray}
            />
          </View>
        </View>

        <View style={styles.dragHandle}>
          <Ionicons name="reorder-three" size={24} color={COLORS.gray} />
        </View>
      </View>
    )
  }

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color={COLORS.darkGray} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Create Inspection Template</Text>

        <TouchableOpacity
          style={[styles.saveButton, (!templateName.trim() || isLoading) && styles.saveButtonDisabled]}
          onPress={handleSaveTemplate}
          disabled={!templateName.trim() || isLoading}
        >
          {isLoading ? (
            <ActivityIndicator size="small" color={COLORS.white} />
          ) : (
            <Text style={styles.saveButtonText}>Save</Text>
          )}
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content}>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Template Information</Text>

          <Text style={styles.inputLabel}>Template Name</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter template name"
            value={templateName}
            onChangeText={setTemplateName}
          />

          <Text style={styles.inputLabel}>Description</Text>
          <TextInput
            style={[styles.input, styles.textArea]}
            placeholder="Enter template description"
            multiline
            value={templateDescription}
            onChangeText={setTemplateDescription}
          />
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Select Categories</Text>
          <Text style={styles.sectionDescription}>Select the categories to include in this inspection template</Text>

          <View style={styles.categoriesGrid}>{INSPECTION_CATEGORIES.map(renderCategoryItem)}</View>
        </View>

        {selectedCategories.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Add Checklist Items</Text>

            <View style={styles.addItemForm}>
              <View style={styles.categorySelector}>
                <Text style={styles.inputLabel}>Category</Text>
                <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.categorySelectorScroll}>
                  {selectedCategories.map((categoryId) => {
                    const category = INSPECTION_CATEGORIES.find((c) => c.id === categoryId)
                    return (
                      <TouchableOpacity
                        key={categoryId}
                        style={[
                          styles.categorySelectorItem,
                          currentCategory === categoryId && styles.categorySelectorItemSelected,
                        ]}
                        onPress={() => setCurrentCategory(categoryId)}
                      >
                        <Ionicons
                          name={category?.icon || "document"}
                          size={16}
                          color={currentCategory === categoryId ? COLORS.white : COLORS.primary}
                        />
                        <Text
                          style={[
                            styles.categorySelectorText,
                            currentCategory === categoryId && styles.categorySelectorTextSelected,
                          ]}
                        >
                          {category?.label || "Other"}
                        </Text>
                      </TouchableOpacity>
                    )
                  })}
                </ScrollView>
              </View>

              <Text style={styles.inputLabel}>Item Description</Text>
              <TextInput
                style={styles.input}
                placeholder="Enter checklist item"
                value={newItemText}
                onChangeText={setNewItemText}
              />

              <View style={styles.itemOptions}>
                <View style={styles.optionItem}>
                  <Text style={styles.optionLabel}>Required</Text>
                  <Switch
                    value={isRequired}
                    onValueChange={setIsRequired}
                    trackColor={{ false: COLORS.lightGray, true: COLORS.primaryLight }}
                    thumbColor={isRequired ? COLORS.primary : COLORS.gray}
                  />
                </View>

                <View style={styles.optionItem}>
                  <Text style={styles.optionLabel}>Photos</Text>
                  <Switch
                    value={includePhotos}
                    onValueChange={setIncludePhotos}
                    trackColor={{ false: COLORS.lightGray, true: COLORS.primaryLight }}
                    thumbColor={includePhotos ? COLORS.primary : COLORS.gray}
                  />
                </View>

                <View style={styles.optionItem}>
                  <Text style={styles.optionLabel}>Notes</Text>
                  <Switch
                    value={includeNotes}
                    onValueChange={setIncludeNotes}
                    trackColor={{ false: COLORS.lightGray, true: COLORS.primaryLight }}
                    thumbColor={includeNotes ? COLORS.primary : COLORS.gray}
                  />
                </View>
              </View>

              <TouchableOpacity
                style={[
                  styles.addItemButton,
                  (!newItemText.trim() || !currentCategory) && styles.addItemButtonDisabled,
                ]}
                onPress={handleAddItem}
                disabled={!newItemText.trim() || !currentCategory}
              >
                <Ionicons name="add" size={20} color={COLORS.white} />
                <Text style={styles.addItemButtonText}>Add Item</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}

        {checklistItems.length > 0 && (
          <View style={styles.section}>
            <View style={styles.checklistHeader}>
              <Text style={styles.sectionTitle}>Checklist Items</Text>
              <Text style={styles.itemCount}>{checklistItems.length} items</Text>
            </View>
            <Text style={styles.sectionDescription}>Drag to reorder items. Tap to edit.</Text>

            <View style={styles.checklistContainer}>{checklistItems.map(renderChecklistItem)}</View>
          </View>
        )}
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
  saveButtonDisabled: {
    backgroundColor: COLORS.gray,
  },
  saveButtonText: {
    color: COLORS.white,
    fontWeight: "bold",
  },
  content: {
    flex: 1,
    padding: 16,
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
    minHeight: 80,
    textAlignVertical: "top",
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
  categoryItemSelected: {
    backgroundColor: COLORS.primaryLight,
    borderRadius: 8,
    padding: 8,
  },
  categoryIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: COLORS.primaryLight,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 8,
  },
  categoryIconSelected: {
    backgroundColor: COLORS.primary,
  },
  categoryLabel: {
    fontSize: 14,
    color: COLORS.darkGray,
    textAlign: "center",
  },
  categoryLabelSelected: {
    color: COLORS.primary,
    fontWeight: "bold",
  },
  addItemForm: {
    marginBottom: 16,
  },
  categorySelector: {
    marginBottom: 16,
  },
  categorySelectorScroll: {
    flexDirection: "row",
  },
  categorySelectorItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 16,
    backgroundColor: COLORS.background,
    marginRight: 8,
    borderWidth: 1,
    borderColor: COLORS.lightGray,
  },
  categorySelectorItemSelected: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  categorySelectorText: {
    fontSize: 14,
    color: COLORS.darkGray,
    marginLeft: 4,
  },
  categorySelectorTextSelected: {
    color: COLORS.white,
  },
  itemOptions: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 16,
  },
  optionItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    width: "30%",
  },
  optionLabel: {
    fontSize: 14,
    color: COLORS.darkGray,
  },
  addItemButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: COLORS.primary,
    padding: 12,
    borderRadius: 8,
  },
  addItemButtonDisabled: {
    backgroundColor: COLORS.gray,
  },
  addItemButtonText: {
    fontSize: 14,
    fontWeight: "bold",
    color: COLORS.white,
    marginLeft: 8,
  },
  checklistHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  itemCount: {
    fontSize: 14,
    color: COLORS.gray,
  },
  checklistContainer: {
    marginTop: 8,
  },
  checklistItem: {
    borderWidth: 1,
    borderColor: COLORS.lightGray,
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
    backgroundColor: COLORS.white,
  },
  checklistItemHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  checklistItemCategory: {
    flexDirection: "row",
    alignItems: "center",
  },
  checklistItemCategoryText: {
    fontSize: 12,
    color: COLORS.primary,
    marginLeft: 4,
  },
  removeItemButton: {
    padding: 4,
  },
  checklistItemText: {
    fontSize: 16,
    color: COLORS.darkGray,
    marginBottom: 12,
  },
  checklistItemOptions: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  dragHandle: {
    alignItems: "center",
    marginTop: 8,
  },
})

export default CreateChecklistTemplateScreen

