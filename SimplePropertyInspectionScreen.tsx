"use client"

import React from "react"
import { useState } from "react"
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, TextInput } from "react-native"
import { Ionicons } from "@expo/vector-icons"
import { useNavigation, useRoute, RouteProp } from "@react-navigation/native"
import { NativeStackNavigationProp } from "@react-navigation/native-stack"

// Types
type RootStackParamList = {
  SimplePropertyInspection: {
    propertyId: string;
    propertyName: string;
  };
};

type NavigationProp = NativeStackNavigationProp<RootStackParamList, 'SimplePropertyInspection'>;
type RouteProps = RouteProp<RootStackParamList, 'SimplePropertyInspection'>;

interface Props {
  navigation: NavigationProp;
  route: RouteProps;
}

// Types for inspection items
interface InspectionItem {
  id: string;
  category: string;
  note: string;
  condition: string;
  timestamp: string;
}

interface Category {
  id: string;
  label: string;
  icon: "home" | "bed" | "restaurant" | "water" | "shield-checkmark";
}

interface Condition {
  value: string;
  label: string;
  color: string;
}

type IconName = Category["icon"] | "document";

// Basic inspection categories
const CATEGORIES: Category[] = [
  { id: "exterior", label: "Exterior", icon: "home" },
  { id: "interior", label: "Interior", icon: "bed" },
  { id: "kitchen", label: "Kitchen", icon: "restaurant" },
  { id: "bathroom", label: "Bathroom", icon: "water" },
  { id: "safety", label: "Safety", icon: "shield-checkmark" },
];

// Simplified condition options
const CONDITIONS: Condition[] = [
  { value: "good", label: "Good", color: "#4CAF50" },
  { value: "fair", label: "Fair", color: "#FFC107" },
  { value: "poor", label: "Poor", color: "#F44336" },
];

const SimplePropertyInspectionScreen = () => {
  const navigation = useNavigation<NavigationProp>();
  const route = useRoute<RouteProps>();
  const { propertyId = "1", propertyName = "Sample Property" } = route.params || {};

  const [inspectionItems, setInspectionItems] = useState<InspectionItem[]>([]);
  const [currentCategory, setCurrentCategory] = useState<string | null>(null);
  const [itemNote, setItemNote] = useState("");
  const [itemCondition, setItemCondition] = useState("good");
  const [showAddItem, setShowAddItem] = useState(false);

  const addInspectionItem = () => {
    if (!currentCategory || !itemNote.trim()) return;

    const newItem: InspectionItem = {
      id: Date.now().toString(),
      category: currentCategory,
      note: itemNote,
      condition: itemCondition,
      timestamp: new Date().toISOString(),
    };

    setInspectionItems([...inspectionItems, newItem]);
    setItemNote("");
    setItemCondition("good");
    setShowAddItem(false);
  };

  const startItemEntry = (categoryId: string) => {
    setCurrentCategory(categoryId);
    setShowAddItem(true);
  };

  const getCategoryIcon = (categoryId: string): IconName => {
    const category = CATEGORIES.find((c) => c.id === categoryId);
    return category ? category.icon : "document";
  };

  const getCategoryLabel = (categoryId: string): string => {
    const category = CATEGORIES.find((c) => c.id === categoryId);
    return category ? category.label : "Other";
  };

  const getConditionColor = (condition: string): string => {
    const conditionObj = CONDITIONS.find((c) => c.value === condition);
    return conditionObj ? conditionObj.color : "#757575";
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color="#333" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Inspect: {propertyName}</Text>
      </View>

      <ScrollView style={styles.content}>
        {!showAddItem ? (
          <>
            <View style={styles.categoriesContainer}>
              <Text style={styles.sectionTitle}>Select Category</Text>
              <View style={styles.categoriesGrid}>
                {CATEGORIES.map((category) => (
                  <TouchableOpacity
                    key={category.id}
                    style={styles.categoryItem}
                    onPress={() => startItemEntry(category.id)}
                  >
                    <View style={styles.categoryIcon}>
                      <Ionicons name={category.icon} size={24} color="#4361EE" />
                    </View>
                    <Text style={styles.categoryLabel}>{category.label}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            {inspectionItems.length > 0 && (
              <View style={styles.itemsContainer}>
                <Text style={styles.sectionTitle}>Inspection Items</Text>
                {inspectionItems.map((item) => (
                  <View key={item.id} style={styles.inspectionItem}>
                    <View style={styles.itemHeader}>
                      <View style={styles.categoryTag}>
                        <Ionicons name={getCategoryIcon(item.category)} size={16} color="#4361EE" />
                        <Text style={styles.categoryTagText}>{getCategoryLabel(item.category)}</Text>
                      </View>
                      <View style={[styles.conditionTag, { backgroundColor: getConditionColor(item.condition) }]}>
                        <Text style={styles.conditionTagText}>{item.condition}</Text>
                      </View>
                    </View>
                    <Text style={styles.itemNote}>{item.note}</Text>
                    <Text style={styles.itemTimestamp}>{new Date(item.timestamp).toLocaleString()}</Text>
                  </View>
                ))}
              </View>
            )}
          </>
        ) : (
          <View style={styles.addItemContainer}>
            <Text style={styles.sectionTitle}>Add {getCategoryLabel(currentCategory as string)} Item</Text>

            <Text style={styles.inputLabel}>Notes</Text>
            <TextInput
              style={styles.noteInput}
              multiline
              placeholder="Enter inspection notes..."
              value={itemNote}
              onChangeText={setItemNote}
            />

            <Text style={styles.inputLabel}>Condition</Text>
            <View style={styles.conditionOptions}>
              {CONDITIONS.map((condition) => (
                <TouchableOpacity
                  key={condition.value}
                  style={[
                    styles.conditionOption,
                    itemCondition === condition.value && {
                      borderColor: condition.color,
                      backgroundColor: `${condition.color}20`,
                    },
                  ]}
                  onPress={() => setItemCondition(condition.value)}
                >
                  <Text
                    style={[
                      styles.conditionOptionText,
                      itemCondition === condition.value && {
                        color: condition.color,
                        fontWeight: "bold",
                      },
                    ]}
                  >
                    {condition.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            <View style={styles.buttonRow}>
              <TouchableOpacity style={styles.cancelButton} onPress={() => setShowAddItem(false)}>
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.addButton, !itemNote.trim() && styles.addButtonDisabled]}
                onPress={addInspectionItem}
                disabled={!itemNote.trim()}
              >
                <Text style={styles.addButtonText}>Add Item</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      </ScrollView>

      {!showAddItem && (
        <TouchableOpacity
          style={styles.completeButton}
          onPress={() => {
            alert(`Inspection completed with ${inspectionItems.length} items`)
            navigation.goBack()
          }}
        >
          <Text style={styles.completeButtonText}>Complete Inspection</Text>
        </TouchableOpacity>
      )}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5F7FA",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    backgroundColor: "#FFF",
    borderBottomWidth: 1,
    borderBottomColor: "#E0E0E0",
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginLeft: 16,
    color: "#333",
  },
  content: {
    flex: 1,
    padding: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 16,
    color: "#333",
  },
  categoriesContainer: {
    backgroundColor: "#FFF",
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
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
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: "#E8F0FE",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 8,
  },
  categoryLabel: {
    fontSize: 14,
    color: "#333",
    textAlign: "center",
  },
  itemsContainer: {
    backgroundColor: "#FFF",
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
    borderColor: "#E0E0E0",
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
  },
  itemHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  categoryTag: {
    flexDirection: "row",
    alignItems: "center",
  },
  categoryTagText: {
    fontSize: 14,
    color: "#4361EE",
    marginLeft: 4,
  },
  conditionTag: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  conditionTagText: {
    fontSize: 12,
    color: "#FFF",
    fontWeight: "bold",
  },
  itemNote: {
    fontSize: 16,
    color: "#333",
    marginBottom: 8,
  },
  itemTimestamp: {
    fontSize: 12,
    color: "#757575",
  },
  addItemContainer: {
    backgroundColor: "#FFF",
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  inputLabel: {
    fontSize: 16,
    fontWeight: "500",
    marginBottom: 8,
    color: "#333",
  },
  noteInput: {
    borderWidth: 1,
    borderColor: "#E0E0E0",
    borderRadius: 8,
    padding: 12,
    minHeight: 100,
    marginBottom: 16,
    textAlignVertical: "top",
  },
  conditionOptions: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 24,
  },
  conditionOption: {
    flex: 1,
    paddingVertical: 12,
    borderWidth: 1,
    borderColor: "#E0E0E0",
    borderRadius: 8,
    marginHorizontal: 4,
    alignItems: "center",
  },
  conditionOptionText: {
    fontSize: 14,
    color: "#333",
  },
  buttonRow: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  cancelButton: {
    flex: 1,
    padding: 12,
    borderWidth: 1,
    borderColor: "#E0E0E0",
    borderRadius: 8,
    marginRight: 8,
    alignItems: "center",
  },
  cancelButtonText: {
    fontSize: 16,
    color: "#333",
  },
  addButton: {
    flex: 2,
    padding: 12,
    backgroundColor: "#4361EE",
    borderRadius: 8,
    marginLeft: 8,
    alignItems: "center",
  },
  addButtonDisabled: {
    backgroundColor: "#A0A0A0",
  },
  addButtonText: {
    fontSize: 16,
    color: "#FFF",
    fontWeight: "bold",
  },
  completeButton: {
    backgroundColor: "#4361EE",
    padding: 16,
    alignItems: "center",
    margin: 16,
    borderRadius: 8,
  },
  completeButtonText: {
    fontSize: 16,
    color: "#FFF",
    fontWeight: "bold",
  },
})

export default SimplePropertyInspectionScreen

