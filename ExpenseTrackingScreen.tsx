"use client"

import { useState, useEffect } from "react"
import { View, Text, StyleSheet, FlatList, TouchableOpacity, ActivityIndicator } from "react-native"
import { Ionicons } from "@expo/vector-icons"
import { useNavigation } from "@react-navigation/native"
import { format } from "date-fns"

// Mock data for expenses
const MOCK_EXPENSES = [
  {
    id: "1",
    propertyId: "prop1",
    category: "Maintenance",
    amount: 250.0,
    date: new Date(2023, 3, 15),
    description: "Plumbing repair",
    receipt: "receipt1.jpg",
  },
  {
    id: "2",
    propertyId: "prop1",
    category: "Utilities",
    amount: 120.5,
    date: new Date(2023, 3, 10),
    description: "Electricity bill",
    receipt: "receipt2.jpg",
  },
  {
    id: "3",
    propertyId: "prop2",
    category: "Taxes",
    amount: 1200.0,
    date: new Date(2023, 2, 28),
    description: "Property tax Q1",
    receipt: "receipt3.jpg",
  },
  {
    id: "4",
    propertyId: "prop3",
    category: "Insurance",
    amount: 450.0,
    date: new Date(2023, 2, 15),
    description: "Annual insurance premium",
    receipt: "receipt4.jpg",
  },
  {
    id: "5",
    propertyId: "prop2",
    category: "Maintenance",
    amount: 75.0,
    date: new Date(2023, 2, 5),
    description: "Lawn care",
    receipt: "receipt5.jpg",
  },
]

// Mock data for properties
const MOCK_PROPERTIES = [
  { id: "prop1", name: "123 Main St" },
  { id: "prop2", name: "456 Oak Ave" },
  { id: "prop3", name: "789 Pine Blvd" },
]

const ExpenseTrackingScreen = () => {
  const navigation = useNavigation()
  const [expenses, setExpenses] = useState([])
  const [loading, setLoading] = useState(true)
  const [selectedProperty, setSelectedProperty] = useState(null)
  const [selectedCategory, setSelectedCategory] = useState(null)
  const [sortOrder, setSortOrder] = useState("desc") // 'asc' or 'desc'

  // Categories for filtering
  const categories = ["All", "Maintenance", "Utilities", "Taxes", "Insurance", "Other"]

  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      setExpenses(MOCK_EXPENSES)
      setLoading(false)
    }, 1000)
  }, [])

  const handleAddExpense = () => {
    navigation.navigate("AddExpense")
  }

  const handleExpensePress = (expense) => {
    navigation.navigate("ExpenseDetail", { expense })
  }

  const getPropertyName = (propertyId) => {
    const property = MOCK_PROPERTIES.find((p) => p.id === propertyId)
    return property ? property.name : "Unknown Property"
  }

  const filterExpenses = () => {
    let filtered = [...expenses]

    if (selectedProperty) {
      filtered = filtered.filter((expense) => expense.propertyId === selectedProperty)
    }

    if (selectedCategory && selectedCategory !== "All") {
      filtered = filtered.filter((expense) => expense.category === selectedCategory)
    }

    // Sort by date
    filtered.sort((a, b) => {
      if (sortOrder === "asc") {
        return a.date - b.date
      } else {
        return b.date - a.date
      }
    })

    return filtered
  }

  const toggleSortOrder = () => {
    setSortOrder(sortOrder === "asc" ? "desc" : "asc")
  }

  const renderExpenseItem = ({ item }) => (
    <TouchableOpacity style={styles.expenseItem} onPress={() => handleExpensePress(item)}>
      <View style={styles.expenseHeader}>
        <Text style={styles.expenseCategory}>{item.category}</Text>
        <Text style={styles.expenseAmount}>${item.amount.toFixed(2)}</Text>
      </View>
      <Text style={styles.expenseProperty}>{getPropertyName(item.propertyId)}</Text>
      <Text style={styles.expenseDescription}>{item.description}</Text>
      <Text style={styles.expenseDate}>{format(item.date, "MMM d, yyyy")}</Text>
    </TouchableOpacity>
  )

  const renderPropertyFilter = () => (
    <View style={styles.filterContainer}>
      <Text style={styles.filterLabel}>Property:</Text>
      <FlatList
        horizontal
        data={[{ id: null, name: "All" }, ...MOCK_PROPERTIES]}
        keyExtractor={(item) => item.id || "all"}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={[styles.filterButton, selectedProperty === item.id && styles.filterButtonSelected]}
            onPress={() => setSelectedProperty(item.id)}
          >
            <Text style={[styles.filterButtonText, selectedProperty === item.id && styles.filterButtonTextSelected]}>
              {item.name}
            </Text>
          </TouchableOpacity>
        )}
        showsHorizontalScrollIndicator={false}
      />
    </View>
  )

  const renderCategoryFilter = () => (
    <View style={styles.filterContainer}>
      <Text style={styles.filterLabel}>Category:</Text>
      <FlatList
        horizontal
        data={categories}
        keyExtractor={(item) => item}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={[styles.filterButton, selectedCategory === item && styles.filterButtonSelected]}
            onPress={() => setSelectedCategory(item === "All" ? null : item)}
          >
            <Text style={[styles.filterButtonText, selectedCategory === item && styles.filterButtonTextSelected]}>
              {item}
            </Text>
          </TouchableOpacity>
        )}
        showsHorizontalScrollIndicator={false}
      />
    </View>
  )

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#0066cc" />
        <Text style={styles.loadingText}>Loading expenses...</Text>
      </View>
    )
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Expense Tracking</Text>
        <TouchableOpacity style={styles.addButton} onPress={handleAddExpense}>
          <Ionicons name="add-circle" size={24} color="#0066cc" />
          <Text style={styles.addButtonText}>Add Expense</Text>
        </TouchableOpacity>
      </View>

      {renderPropertyFilter()}
      {renderCategoryFilter()}

      <View style={styles.sortContainer}>
        <Text style={styles.sortLabel}>Sort by date:</Text>
        <TouchableOpacity style={styles.sortButton} onPress={toggleSortOrder}>
          <Text style={styles.sortButtonText}>{sortOrder === "asc" ? "Oldest first" : "Newest first"}</Text>
          <Ionicons name={sortOrder === "asc" ? "arrow-up" : "arrow-down"} size={16} color="#0066cc" />
        </TouchableOpacity>
      </View>

      <FlatList
        data={filterExpenses()}
        keyExtractor={(item) => item.id}
        renderItem={renderExpenseItem}
        contentContainerStyle={styles.expensesList}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Ionicons name="document-text-outline" size={64} color="#cccccc" />
            <Text style={styles.emptyText}>No expenses found</Text>
            <Text style={styles.emptySubtext}>Try changing your filters or add a new expense</Text>
          </View>
        }
      />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8f9fa",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 16,
    backgroundColor: "#ffffff",
    borderBottomWidth: 1,
    borderBottomColor: "#e1e4e8",
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#333333",
  },
  addButton: {
    flexDirection: "row",
    alignItems: "center",
  },
  addButtonText: {
    marginLeft: 4,
    color: "#0066cc",
    fontWeight: "600",
  },
  filterContainer: {
    padding: 12,
    backgroundColor: "#ffffff",
    borderBottomWidth: 1,
    borderBottomColor: "#e1e4e8",
  },
  filterLabel: {
    fontSize: 14,
    fontWeight: "600",
    marginBottom: 8,
    color: "#555555",
  },
  filterButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    backgroundColor: "#f0f0f0",
    marginRight: 8,
  },
  filterButtonSelected: {
    backgroundColor: "#0066cc",
  },
  filterButtonText: {
    fontSize: 14,
    color: "#555555",
  },
  filterButtonTextSelected: {
    color: "#ffffff",
  },
  sortContainer: {
    flexDirection: "row",
    alignItems: "center",
    padding: 12,
    backgroundColor: "#ffffff",
    borderBottomWidth: 1,
    borderBottomColor: "#e1e4e8",
  },
  sortLabel: {
    fontSize: 14,
    fontWeight: "600",
    color: "#555555",
    marginRight: 8,
  },
  sortButton: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    backgroundColor: "#f0f0f0",
  },
  sortButtonText: {
    fontSize: 14,
    color: "#0066cc",
    marginRight: 4,
  },
  expensesList: {
    padding: 12,
  },
  expenseItem: {
    backgroundColor: "#ffffff",
    borderRadius: 8,
    padding: 16,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  expenseHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  expenseCategory: {
    fontSize: 14,
    fontWeight: "600",
    color: "#0066cc",
    backgroundColor: "#e6f0ff",
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
  },
  expenseAmount: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333333",
  },
  expenseProperty: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333333",
    marginBottom: 4,
  },
  expenseDescription: {
    fontSize: 14,
    color: "#555555",
    marginBottom: 8,
  },
  expenseDate: {
    fontSize: 12,
    color: "#888888",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f8f9fa",
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
    color: "#555555",
  },
  emptyContainer: {
    alignItems: "center",
    justifyContent: "center",
    padding: 32,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: "600",
    color: "#555555",
    marginTop: 16,
  },
  emptySubtext: {
    fontSize: 14,
    color: "#888888",
    textAlign: "center",
    marginTop: 8,
  },
})

export default ExpenseTrackingScreen

