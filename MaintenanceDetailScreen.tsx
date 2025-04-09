"use client"

import { useState, useEffect } from "react"
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image, Alert } from "react-native"
import { useSafeAreaInsets } from "react-native-safe-area-context"

// Mock maintenance request data
const mockMaintenanceDetails = {
  id: "1",
  title: "Leaking Faucet in Kitchen",
  description:
    "The kitchen sink faucet has been leaking steadily for the past two days. Water is pooling under the sink and causing damage to the cabinet.",
  status: "In Progress",
  priority: "Medium",
  category: "Plumbing",
  propertyId: "1",
  propertyName: "Sunset Villa",
  propertyAddress: "123 Ocean Drive, Malibu, CA",
  tenantId: "1",
  tenantName: "John Doe",
  tenantPhone: "(555) 123-4567",
  dateReported: "2023-12-05T09:30:00Z",
  scheduledDate: "2023-12-07T14:00:00Z",
  completedDate: null,
  assignedTo: "Mike Johnson",
  estimatedCost: 150,
  actualCost: null,
  images: [
    "https://images.unsplash.com/photo-1585704032915-c3400ca199e7?w=500",
    "https://images.unsplash.com/photo-1573103617254-5f240196ae4d?w=500",
  ],
  updates: [
    {
      id: "1",
      date: "2023-12-05T10:15:00Z",
      author: "Admin",
      text: "Maintenance request received and assigned to Mike Johnson.",
    },
    {
      id: "2",
      date: "2023-12-06T14:30:00Z",
      author: "Mike Johnson",
      text: "Scheduled for tomorrow at 2:00 PM. Will need to replace the faucet washer and possibly the entire fixture depending on the extent of damage.",
    },
  ],
}

const MaintenanceDetailScreen = ({ route, navigation }) => {
  const insets = useSafeAreaInsets()
  const { requestId } = route.params || { requestId: "1" }
  const [request, setRequest] = useState(null)

  // Fetch maintenance request data (simulated)
  useEffect(() => {
    // In a real app, you would fetch data from an API or database
    setRequest(mockMaintenanceDetails)
  }, [requestId])

  if (!request) {
    return (
      <View style={styles.loadingContainer}>
        <Text>Loading maintenance request details...</Text>
      </View>
    )
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
      case "cancelled":
        return "#F44336" // Red
      default:
        return "#757575" // Grey
    }
  }

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

  // Format date for display
  const formatDate = (dateString) => {
    if (!dateString) return "Not set"

    const options: Intl.DateTimeFormatOptions = {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }
    return new Date(dateString).toLocaleDateString(undefined, options)
  }

  // Update status
  const updateStatus = (newStatus) => {
    Alert.alert("Update Status", `Are you sure you want to mark this request as ${newStatus}?`, [
      { text: "Cancel", style: "cancel" },
      {
        text: "Confirm",
        onPress: () => {
          // In a real app, you would call an API to update the status
          Alert.alert("Success", `Status updated to ${newStatus}`)
        },
      },
    ])
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
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <Text style={styles.backButtonText}>← Back</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Maintenance Request</Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView style={styles.content}>
        <View style={styles.titleSection}>
          <Text style={styles.requestTitle}>{request.title}</Text>
          <View style={styles.statusRow}>
            <View style={[styles.statusBadge, { backgroundColor: getStatusColor(request.status) }]}>
              <Text style={styles.statusText}>{request.status}</Text>
            </View>
            <View style={[styles.priorityBadge, { backgroundColor: getPriorityColor(request.priority) }]}>
              <Text style={styles.priorityText}>{request.priority} Priority</Text>
            </View>
          </View>
        </View>

        <View style={styles.detailSection}>
          <Text style={styles.sectionTitle}>Request Details</Text>

          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Category:</Text>
            <Text style={styles.infoValue}>{request.category}</Text>
          </View>

          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Reported:</Text>
            <Text style={styles.infoValue}>{formatDate(request.dateReported)}</Text>
          </View>

          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Scheduled:</Text>
            <Text style={styles.infoValue}>{formatDate(request.scheduledDate)}</Text>
          </View>

          {request.completedDate && (
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Completed:</Text>
              <Text style={styles.infoValue}>{formatDate(request.completedDate)}</Text>
            </View>
          )}

          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Assigned To:</Text>
            <Text style={styles.infoValue}>{request.assignedTo || "Not assigned"}</Text>
          </View>

          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Est. Cost:</Text>
            <Text style={styles.infoValue}>
              {request.estimatedCost ? `$${request.estimatedCost}` : "Not estimated"}
            </Text>
          </View>

          {request.actualCost && (
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Actual Cost:</Text>
              <Text style={styles.infoValue}>${request.actualCost}</Text>
            </View>
          )}
        </View>

        <View style={styles.detailSection}>
          <Text style={styles.sectionTitle}>Description</Text>
          <Text style={styles.descriptionText}>{request.description}</Text>
        </View>

        <View style={styles.detailSection}>
          <Text style={styles.sectionTitle}>Property & Tenant</Text>

          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Property:</Text>
            <TouchableOpacity onPress={() => navigation.navigate("PropertyDetail", { propertyId: request.propertyId })}>
              <Text style={styles.infoValueLink}>{request.propertyName}</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Address:</Text>
            <Text style={styles.infoValue}>{request.propertyAddress}</Text>
          </View>

          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Tenant:</Text>
            <TouchableOpacity onPress={() => navigation.navigate("TenantDetail", { tenantId: request.tenantId })}>
              <Text style={styles.infoValueLink}>{request.tenantName}</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Phone:</Text>
            <TouchableOpacity onPress={() => Alert.alert("Call Tenant", `Calling ${request.tenantPhone}`)}>
              <Text style={styles.infoValueLink}>{request.tenantPhone}</Text>
            </TouchableOpacity>
          </View>
        </View>

        {request.images && request.images.length > 0 && (
          <View style={styles.detailSection}>
            <Text style={styles.sectionTitle}>Images</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.imagesContainer}>
              {request.images.map((image, index) => (
                <TouchableOpacity key={index} onPress={() => Alert.alert("View Image", "Opening full-size image")}>
                  <Image source={{ uri: image }} style={styles.requestImage} />
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        )}

        <View style={styles.detailSection}>
          <Text style={styles.sectionTitle}>Updates</Text>
          {request.updates && request.updates.length > 0 ? (
            request.updates.map((update) => (
              <View key={update.id} style={styles.updateItem}>
                <View style={styles.updateHeader}>
                  <Text style={styles.updateAuthor}>{update.author}</Text>
                  <Text style={styles.updateDate}>{formatDate(update.date)}</Text>
                </View>
                <Text style={styles.updateText}>{update.text}</Text>
              </View>
            ))
          ) : (
            <Text style={styles.emptyText}>No updates yet</Text>
          )}

          <TouchableOpacity
            style={styles.addButton}
            onPress={() => navigation.navigate("AddMaintenanceUpdate", { requestId: request.id })}
          >
            <Text style={styles.addButtonText}>+ Add Update</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.actionButtons}>
          <TouchableOpacity
            style={styles.actionButton}
            onPress={() => navigation.navigate("EditMaintenanceRequest", { requestId: request.id })}
          >
            <Text style={styles.actionButtonText}>Edit Request</Text>
          </TouchableOpacity>

          {request.status !== "Completed" && (
            <TouchableOpacity
              style={[styles.actionButton, styles.completeButton]}
              onPress={() => updateStatus("Completed")}
            >
              <Text style={styles.actionButtonText}>Mark Completed</Text>
            </TouchableOpacity>
          )}
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
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
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
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
  },
  placeholder: {
    width: 40,
  },
  content: {
    flex: 1,
    padding: 16,
  },
  titleSection: {
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
  requestTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 12,
  },
  statusRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 4,
    marginRight: 8,
  },
  statusText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 12,
  },
  priorityBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 4,
  },
  priorityText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 12,
  },
  detailSection: {
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
    marginBottom: 12,
  },
  infoRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  infoLabel: {
    fontSize: 14,
    color: "#666",
  },
  infoValue: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#333",
    maxWidth: "60%",
    textAlign: "right",
  },
  infoValueLink: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#2196F3",
  },
  descriptionText: {
    fontSize: 14,
    color: "#333",
    lineHeight: 20,
  },
  imagesContainer: {
    flexDirection: "row",
    marginTop: 8,
  },
  requestImage: {
    width: 150,
    height: 150,
    borderRadius: 8,
    marginRight: 8,
  },
  updateItem: {
    backgroundColor: "#f9f9f9",
    borderRadius: 8,
    padding: 12,
    marginBottom: 8,
  },
  updateHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  updateAuthor: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#333",
  },
  updateDate: {
    fontSize: 12,
    color: "#666",
  },
  updateText: {
    fontSize: 14,
    color: "#333",
    lineHeight: 20,
  },
  emptyText: {
    fontSize: 14,
    color: "#666",
    fontStyle: "italic",
    textAlign: "center",
    marginVertical: 16,
  },
  addButton: {
    backgroundColor: "#2196F3",
    borderRadius: 8,
    padding: 12,
    alignItems: "center",
    marginTop: 8,
  },
  addButtonText: {
    color: "white",
    fontSize: 14,
    fontWeight: "bold",
  },
  actionButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 16,
  },
  actionButton: {
    flex: 1,
    backgroundColor: "#2196F3",
    borderRadius: 8,
    paddingVertical: 12,
    alignItems: "center",
    marginHorizontal: 4,
  },
  completeButton: {
    backgroundColor: "#4CAF50",
  },
  actionButtonText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 14,
  },
})

export default MaintenanceDetailScreen

