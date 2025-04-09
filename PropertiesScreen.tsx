"use client"

import { useState } from "react"
import { View, Text, StyleSheet, FlatList, TouchableOpacity, TextInput } from "react-native"
import { useSafeAreaInsets } from "react-native-safe-area-context"
import { useNavigation } from "@react-navigation/native"

// Mock data for properties
const MOCK_PROPERTIES = [
  {
    id: "1",
    name: "Sunset Villa",
    address: "123 Ocean Drive, Malibu, CA",
    type: "Single Family",
    status: "Occupied",
    rent: 3500,
  },
  {
    id: "2",
    name: "Downtown Loft",
    address: "456 Main St, Los Angeles, CA",
    type: "Apartment",
    status: "Vacant",
    rent: 2800,
  },
  {
    id: "3",
    name: "Lakeside Cottage",
    address: "789 Lake Rd, Lake Tahoe, CA",
    type: "Vacation",
    status: "Occupied",
    rent: 4200,
  },
  {
    id: "4",
    name: "City Heights Condo",
    address: "101 Heights Blvd, San Francisco, CA",
    type: "Condo",
    status: "Vacant",
    rent: 3200,
  },
]

const PropertiesScreen = () => {
  const navigation = useNavigation()
  const insets = useSafeAreaInsets()
  const [searchQuery, setSearchQuery] = useState("")
  const [properties, setProperties] = useState(MOCK_PROPERTIES)

  const filteredProperties = properties.filter(
    (property) =>
      property.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      property.address.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  const renderPropertyItem = ({ item }) => (
    <TouchableOpacity
      style={styles.propertyCard}
      onPress={() => navigation.navigate("PropertyDetail", { propertyId: item.id } as never)}
    >
      <View style={styles.propertyHeader}>
        <Text style={styles.propertyName}>{item.name}</Text>
        <View style={[styles.statusBadge, { backgroundColor: item.status === "Occupied" ? "#4caf50" : "#ff9800" }]}>
          <Text style={styles.statusText}>{item.status}</Text>
        </View>
      </View>
      <Text style={styles.propertyAddress}>{item.address}</Text>
      <View style={styles.propertyDetails}>
        <Text style={styles.propertyType}>{item.type}</Text>
        <Text style={styles.propertyRent}>${item.rent}/month</Text>
      </View>
    </TouchableOpacity>
  )

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
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <Text style={styles.backButtonText}>← Back</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>My Properties</Text>
      </View>

      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder="Search properties..."
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
      </View>

      <FlatList
        data={filteredProperties}
        renderItem={renderPropertyItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContainer}
      />

      <TouchableOpacity style={styles.addButton} onPress={() => navigation.navigate("AddProperty" as never)}>
        <Text style={styles.addButtonText}>+ Add Property</Text>
      </TouchableOpacity>
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
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#e0e0e0",
    backgroundColor: "white",
  },
  backButton: {
    marginRight: 16,
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
  searchContainer: {
    padding: 16,
    backgroundColor: "white",
    borderBottomWidth: 1,
    borderBottomColor: "#e0e0e0",
  },
  searchInput: {
    backgroundColor: "#f0f0f0",
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 10,
    fontSize: 16,
  },
  listContainer: {
    padding: 16,
  },
  propertyCard: {
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
  propertyHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  propertyName: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  statusText: {
    color: "white",
    fontSize: 12,
    fontWeight: "bold",
  },
  propertyAddress: {
    fontSize: 14,
    color: "#666",
    marginBottom: 8,
  },
  propertyDetails: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 8,
  },
  propertyType: {
    fontSize: 14,
    color: "#666",
  },
  propertyRent: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#2196F3",
  },
  addButton: {
    backgroundColor: "#2196F3",
    borderRadius: 8,
    padding: 16,
    margin: 16,
    alignItems: "center",
  },
  addButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
})

export default PropertiesScreen

