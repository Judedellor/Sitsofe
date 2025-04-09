"use client"

import { useState } from "react"
import { View, Text, StyleSheet, FlatList, TouchableOpacity, TextInput } from "react-native"
import { useSafeAreaInsets } from "react-native-safe-area-context"

// Mock data for maintenance requests
const mockRequests = [
  {
    id: "1",
    title: "Leaking Faucet",
    property: "Sunny Apartments 301",
    tenant: "John Smith",
    date: "2023-12-05",
    priority: "Medium",
    status: "Pending",
    description: "The kitchen faucet has been leaking for two days and is getting worse.",
  },
  {
    id: "2",
    title: "Broken AC",
    property: "Ocean View 205",
    tenant: "Sarah Johnson",
    date: "2023-12-01",
    priority: "High",
    status: "In Progress",
    description: "The air conditioning unit stopped working. The apartment is very hot.",
  },
  {
    id: "3",
    title: "Light Fixture Broken",
    property: "Highland Gardens 102",
    tenant: "Michael Davis",
    date: "2023-12-07",
    priority: "Low",
    status: "Completed",
    description: "Living room ceiling light fixture is not working, needs replacement.",
  },
  {
    id: "4",
    title: "Bathroom Mold",
    property: "City Lofts 407",
    tenant: "Jessica Williams",
    date: "2023-12-04",
    priority: "High",
    status: "Pending",
    description: "Black mold spotted in the bathroom ceiling near the shower.",
  },
  {
    id: "5",
    title: "Entry Door Lock",
    property: "Park Residences 201",
    tenant: "Robert Brown",
    date: "2023-12-08",
    priority: "Medium",
    status: "Scheduled",
    description: "Front door lock is difficult to open and close. May need replacement.",
  },
]

const MaintenanceScreen = ({ navigation }) => {
  const insets = useSafeAreaInsets()
  const [searchQuery, setSearchQuery] = useState("")
  const [requests, setRequests] = useState(mockRequests)

  // Filter requests based on search query
  const filteredRequests = requests.filter((request) => {
    const query = searchQuery.toLowerCase()
    return (
      request.title.toLowerCase().includes(query) ||
      request.property.toLowerCase().includes(query) ||
      request.tenant.toLowerCase().includes(query) ||
      request.status.toLowerCase().includes(query) ||
      request.priority.toLowerCase().includes(query)
    )
  })

  // Function to get priority color
  const getPriorityColor = (priority) => {
    switch (priority.toLowerCase()) {
      case "high":
        return "#F44336" // Red
      case "medium":
        return "#FF9800" // Orange
      case "low":
        return "#4CAF50" // Green
      default:
        return "#757575" // Grey
    }
  }

  // Function to get status color
  const getStatusColor = (status) => {
    switch (status.toLowerCase()) {
      case "completed":
        return "#4CAF50" // Green
      case "in progress":
        return "#2196F3" // Blue
      case "pending":
        return "#FF9800" // Orange
      case "scheduled":
        return "#9C27B0" // Purple
      default:
        return "#757575" // Grey
    }
  }

  // Render request item
  const renderRequestItem = ({ item }) => (
    <TouchableOpacity
      style={styles.requestCard}
      onPress={() => {
        // Navigate to request details screen
        navigation.navigate("MaintenanceDetail", { requestId: item.id })
      }}
    >
      <View style={styles.requestHeader}>
        <Text style={styles.requestTitle}>{item.title}</Text>
        <View style={[styles.priorityBadge, { backgroundColor: getPriorityColor(item.priority) }]}>
          <Text style={styles.priorityText}>{item.priority}</Text>
        </View>
      </View>

      <Text style={styles.propertyText}>{item.property}</Text>
      <Text style={styles.tenantText}>Tenant: {item.tenant}</Text>

      <View style={styles.requestDetails}>
        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>Date:</Text>
          <Text style={styles.detailValue}>{item.date}</Text>
        </View>
        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>Status:</Text>
          <View style={[styles.statusBadge, { backgroundColor: getStatusColor(item.status) }]}>
            <Text style={styles.statusText}>{item.status}</Text>
          </View>
        </View>
      </View>

      <Text style={styles.descriptionLabel}>Description:</Text>
      <Text style={styles.descriptionText} numberOfLines={2}>
        {item.description}
      </Text>

      <View style={styles.actionButtons}>
        <TouchableOpacity
          style={styles.actionButton}
          onPress={() => {
            // Handle update status action
          }}
        >
          <Text style={styles.actionButtonText}>Update Status</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.actionButton}
          onPress={() => {
            // Handle assign technician action
          }}
        >
          <Text style={styles.actionButtonText}>Assign</Text>
        </TouchableOpacity>
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
          <Text style={styles.backButtonText}>Back</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Maintenance</Text>
        <View style={styles.placeholder} />
      </View>

      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder="Search maintenance requests..."
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
      </View>

      <FlatList
        data={filteredRequests}
        renderItem={renderRequestItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.requestsList}
      />

      <TouchableOpacity
        style={styles.addButton}
        onPress={() => {
          // Navigate to add request screen
          navigation.navigate("AddMaintenanceRequest")
        }}
      >
        <Text style={styles.addButtonText}>Add Maintenance Request</Text>
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
    justifyContent: "space-between",
    paddingVertical: 16,
    paddingHorizontal: 16,
    backgroundColor: "#2196F3",
  },
  backButton: {
    padding: 8,
  },
  backButtonText: {
    color: "white",
    fontWeight: "bold",
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "white",
  },
  placeholder: {
    width: 40,
  },
  searchContainer: {
    paddingHorizontal: 16,
    paddingVertical: 12,
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
  requestsList: {
    padding: 16,
  },
  requestCard: {
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
  requestHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  requestTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
    flex: 1,
  },
  priorityBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
    marginLeft: 8,
  },
  priorityText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 12,
  },
  propertyText: {
    fontSize: 16,
    color: "#333",
    marginBottom: 4,
  },
  tenantText: {
    fontSize: 14,
    color: "#666",
    marginBottom: 8,
  },
  requestDetails: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 12,
  },
  detailRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  detailLabel: {
    fontSize: 14,
    color: "#666",
    marginRight: 4,
  },
  detailValue: {
    fontSize: 14,
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
    fontWeight: "bold",
    fontSize: 12,
  },
  descriptionLabel: {
    fontSize: 14,
    color: "#666",
    marginBottom: 4,
  },
  descriptionText: {
    fontSize: 14,
    color: "#333",
    marginBottom: 12,
  },
  actionButtons: {
    flexDirection: "row",
    justifyContent: "flex-end",
  },
  actionButton: {
    backgroundColor: "#e0e0e0",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 4,
    marginLeft: 8,
  },
  actionButtonText: {
    fontSize: 12,
    color: "#333",
  },
  addButton: {
    backgroundColor: "#2196F3",
    paddingVertical: 16,
    borderRadius: 8,
    margin: 16,
    alignItems: "center",
  },
  addButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
})

export default MaintenanceScreen

