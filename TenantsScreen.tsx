"use client"

import { useState } from "react"
import { View, Text, StyleSheet, FlatList, TouchableOpacity, TextInput, Image } from "react-native"
import { useSafeAreaInsets } from "react-native-safe-area-context"
import { NavigationProp } from "@react-navigation/native"

// Mock data for tenants
const MOCK_TENANTS = [
  {
    id: "1",
    name: "John Doe",
    email: "john.doe@example.com",
    phone: "(555) 123-4567",
    property: "Sunset Villa",
    leaseEnd: "12/31/2023",
    rentStatus: "Paid",
    avatarUrl: "https://i.pravatar.cc/150?img=1",
  },
  {
    id: "2",
    name: "Jane Smith",
    email: "jane.smith@example.com",
    phone: "(555) 987-6543",
    property: "Downtown Loft",
    leaseEnd: "03/15/2024",
    rentStatus: "Overdue",
    avatarUrl: "https://i.pravatar.cc/150?img=5",
  },
  {
    id: "3",
    name: "Mike Johnson",
    email: "mike.johnson@example.com",
    phone: "(555) 456-7890",
    property: "Lakeside Cottage",
    leaseEnd: "08/01/2024",
    rentStatus: "Paid",
    avatarUrl: "https://i.pravatar.cc/150?img=3",
  },
  {
    id: "4",
    name: "Sarah Williams",
    email: "sarah.williams@example.com",
    phone: "(555) 789-0123",
    property: "City Heights Condo",
    leaseEnd: "05/20/2024",
    rentStatus: "Pending",
    avatarUrl: "https://i.pravatar.cc/150?img=10",
  },
]

const TenantsScreen = ({ navigation }: { navigation: NavigationProp<any> }) => {
  const insets = useSafeAreaInsets()
  const [searchQuery, setSearchQuery] = useState("")
  const [tenants, setTenants] = useState(MOCK_TENANTS)

  const filteredTenants = tenants.filter(
    (tenant) =>
      tenant.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tenant.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tenant.property.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  const getRentStatusColor = (status: string) => {
    switch (status) {
      case "Paid":
        return "#4caf50"
      case "Pending":
        return "#ff9800"
      case "Overdue":
        return "#f44336"
      default:
        return "#757575"
    }
  }

  const renderTenantItem = ({ item }: { item: typeof MOCK_TENANTS[0] }) => (
    <TouchableOpacity
      style={styles.tenantCard}
      onPress={() => navigation?.navigate?.("TenantDetail", { tenantId: item.id })}
    >
      <View style={styles.tenantHeader}>
        <View style={styles.tenantInfo}>
          <Image source={{ uri: item.avatarUrl }} style={styles.avatar} />
          <View>
            <Text style={styles.tenantName}>{item.name}</Text>
            <Text style={styles.tenantEmail}>{item.email}</Text>
          </View>
        </View>
        <View style={[styles.statusBadge, { backgroundColor: getRentStatusColor(item.rentStatus) }]}>
          <Text style={styles.statusText}>{item.rentStatus}</Text>
        </View>
      </View>

      <View style={styles.tenantDetails}>
        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>Property:</Text>
          <Text style={styles.detailValue}>{item.property}</Text>
        </View>
        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>Lease Ends:</Text>
          <Text style={styles.detailValue}>{item.leaseEnd}</Text>
        </View>
        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>Phone:</Text>
          <Text style={styles.detailValue}>{item.phone}</Text>
        </View>
      </View>

      <View style={styles.actionButtons}>
        <TouchableOpacity style={[styles.actionButton, styles.messageButton]}>
          <Text style={styles.actionButtonText}>Message</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.actionButton, styles.documentButton]}>
          <Text style={styles.actionButtonText}>Documents</Text>
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
        <TouchableOpacity style={styles.backButton} onPress={() => navigation?.goBack?.()}>
          <Text style={styles.backButtonText}>← Back</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>My Tenants</Text>
      </View>

      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder="Search tenants..."
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
      </View>

      <FlatList
        data={filteredTenants}
        renderItem={renderTenantItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContainer}
      />

      <TouchableOpacity style={styles.addButton} onPress={() => navigation?.navigate?.("AddTenant")}>
        <Text style={styles.addButtonText}>+ Add Tenant</Text>
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
  tenantCard: {
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
  tenantHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  tenantInfo: {
    flexDirection: "row",
    alignItems: "center",
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 12,
  },
  tenantName: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
  },
  tenantEmail: {
    fontSize: 14,
    color: "#666",
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
  tenantDetails: {
    backgroundColor: "#f9f9f9",
    borderRadius: 4,
    padding: 12,
    marginBottom: 12,
  },
  detailRow: {
    flexDirection: "row",
    marginBottom: 4,
  },
  detailLabel: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#666",
    width: 100,
  },
  detailValue: {
    fontSize: 14,
    color: "#333",
    flex: 1,
  },
  actionButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  actionButton: {
    flex: 1,
    paddingVertical: 8,
    borderRadius: 4,
    alignItems: "center",
    marginHorizontal: 4,
  },
  messageButton: {
    backgroundColor: "#2196F3",
  },
  documentButton: {
    backgroundColor: "#757575",
  },
  actionButtonText: {
    color: "white",
    fontWeight: "bold",
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

export default TenantsScreen

