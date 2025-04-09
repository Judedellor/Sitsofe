"use client"

import { useState, useEffect } from "react"
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image, FlatList, Alert } from "react-native"
import { useSafeAreaInsets } from "react-native-safe-area-context"
import { NavigationProp, RouteProp } from "@react-navigation/native"

// Define types
interface Document {
  id: string
  name: string
  date: string
  type: string
}

interface Payment {
  id: string
  date: string
  amount: number
  status: string
  method: string
}

interface Note {
  id: string
  date: string
  text: string
}

interface Tenant {
  id: string
  name: string
  email: string
  phone: string
  leaseStart: string
  leaseEnd: string
  rentStatus: string
  rentAmount: number
  securityDeposit: number
  propertyId: string
  propertyName: string
  propertyAddress: string
  documents: Document[]
  paymentHistory: Payment[]
  notes: Note[]
  avatarUrl: string
}

type RootStackParamList = {
  PropertyDetail: { propertyId: string }
  EditTenant: { tenantId: string }
  Messages: { recipientId: string }
  PaymentDetail: { paymentId: string }
  AddPayment: { tenantId: string }
  AddDocument: { tenantId: string }
  AddNote: { tenantId: string }
}

interface Props {
  route: RouteProp<{ TenantDetail: { tenantId: string } }, 'TenantDetail'>
  navigation: NavigationProp<RootStackParamList>
}

// Mock tenant data
const mockTenantDetails: Tenant = {
  id: "1",
  name: "John Doe",
  email: "john.doe@example.com",
  phone: "(555) 123-4567",
  leaseStart: "01/01/2023",
  leaseEnd: "12/31/2023",
  rentStatus: "Paid",
  rentAmount: 1500,
  securityDeposit: 1500,
  propertyId: "1",
  propertyName: "Sunset Villa",
  propertyAddress: "123 Ocean Drive, Malibu, CA",
  documents: [
    { id: "1", name: "Lease Agreement", date: "01/01/2023", type: "PDF" },
    { id: "2", name: "Background Check", date: "12/15/2022", type: "PDF" },
    { id: "3", name: "Rental Application", date: "12/10/2022", type: "PDF" },
  ],
  paymentHistory: [
    { id: "1", date: "01/01/2023", amount: 1500, status: "Paid", method: "Bank Transfer" },
    { id: "2", date: "02/01/2023", amount: 1500, status: "Paid", method: "Bank Transfer" },
    { id: "3", date: "03/01/2023", amount: 1500, status: "Paid", method: "Credit Card" },
  ],
  notes: [
    {
      id: "1",
      date: "01/15/2023",
      text: "Tenant reported issue with kitchen sink. Maintenance scheduled for tomorrow.",
    },
    {
      id: "2",
      date: "02/10/2023",
      text: "Tenant requested permission to paint living room. Approved with condition to restore original color upon move-out.",
    },
  ],
  avatarUrl: "https://randomuser.me/api/portraits/men/32.jpg",
}

const TenantDetailScreen = ({ route, navigation }: Props) => {
  const insets = useSafeAreaInsets()
  const { tenantId } = route.params || { tenantId: "1" }
  const [tenant, setTenant] = useState<Tenant | null>(null)
  const [activeTab, setActiveTab] = useState<"info" | "payments" | "documents" | "notes">("info")

  // Fetch tenant data (simulated)
  useEffect(() => {
    // In a real app, you would fetch data from an API or database
    setTenant(mockTenantDetails)
  }, [tenantId])

  if (!tenant) {
    return (
      <View style={styles.loadingContainer}>
        <Text>Loading tenant details...</Text>
      </View>
    )
  }

  // Function to get status color
  const getStatusColor = (status: string): string => {
    switch (status.toLowerCase()) {
      case "paid":
        return "#4CAF50" // Green
      case "pending":
        return "#FF9800" // Orange
      case "overdue":
        return "#F44336" // Red
      default:
        return "#757575" // Grey
    }
  }

  // Function to render the info tab
  const renderInfoTab = () => (
    <View style={styles.tabContent}>
      <View style={styles.profileSection}>
        <Image source={{ uri: tenant.avatarUrl }} style={styles.profileImage} />
        <View style={styles.profileInfo}>
          <Text style={styles.tenantName}>{tenant.name}</Text>
          <Text style={styles.tenantEmail}>{tenant.email}</Text>
          <Text style={styles.tenantPhone}>{tenant.phone}</Text>
        </View>
      </View>

      <View style={styles.detailSection}>
        <Text style={styles.sectionTitle}>Lease Information</Text>
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Property:</Text>
          <TouchableOpacity onPress={() => navigation.navigate("PropertyDetail", { propertyId: tenant.propertyId })}>
            <Text style={styles.infoValueLink}>{tenant.propertyName}</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Address:</Text>
          <Text style={styles.infoValue}>{tenant.propertyAddress}</Text>
        </View>
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Lease Start:</Text>
          <Text style={styles.infoValue}>{tenant.leaseStart}</Text>
        </View>
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Lease End:</Text>
          <Text style={styles.infoValue}>{tenant.leaseEnd}</Text>
        </View>
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Rent Amount:</Text>
          <Text style={styles.infoValue}>${tenant.rentAmount}/month</Text>
        </View>
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Security Deposit:</Text>
          <Text style={styles.infoValue}>${tenant.securityDeposit}</Text>
        </View>
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Rent Status:</Text>
          <View style={[styles.statusBadge, { backgroundColor: getStatusColor(tenant.rentStatus) }]}>
            <Text style={styles.statusText}>{tenant.rentStatus}</Text>
          </View>
        </View>
      </View>

      <View style={styles.actionButtons}>
        <TouchableOpacity
          style={styles.actionButton}
          onPress={() => navigation.navigate("EditTenant", { tenantId: tenant.id })}
        >
          <Text style={styles.actionButtonText}>Edit Tenant</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.actionButton, styles.messageButton]}
          onPress={() => navigation.navigate("Messages", { recipientId: tenant.id })}
        >
          <Text style={styles.actionButtonText}>Message</Text>
        </TouchableOpacity>
      </View>
    </View>
  )

  // Function to render the payments tab
  const renderPaymentsTab = () => (
    <View style={styles.tabContent}>
      {tenant.paymentHistory.length > 0 ? (
        <FlatList
          data={tenant.paymentHistory}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={styles.paymentCard}
              onPress={() => navigation.navigate("PaymentDetail", { paymentId: item.id })}
            >
              <View style={styles.paymentHeader}>
                <Text style={styles.paymentDate}>{item.date}</Text>
                <View style={[styles.statusBadge, { backgroundColor: getStatusColor(item.status) }]}>
                  <Text style={styles.statusText}>{item.status}</Text>
                </View>
              </View>
              <View style={styles.paymentDetails}>
                <Text style={styles.paymentAmount}>${item.amount}</Text>
                <Text style={styles.paymentMethod}>Method: {item.method}</Text>
              </View>
            </TouchableOpacity>
          )}
          ListFooterComponent={
            <TouchableOpacity
              style={styles.addButton}
              onPress={() => navigation.navigate("AddPayment", { tenantId: tenant.id })}
            >
              <Text style={styles.addButtonText}>+ Add Payment</Text>
            </TouchableOpacity>
          }
        />
      ) : (
        <View style={styles.emptyState}>
          <Text style={styles.emptyStateText}>No payment history for this tenant</Text>
          <TouchableOpacity
            style={styles.addButton}
            onPress={() => navigation.navigate("AddPayment", { tenantId: tenant.id })}
          >
            <Text style={styles.addButtonText}>+ Add Payment</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  )

  // Function to render the documents tab
  const renderDocumentsTab = () => (
    <View style={styles.tabContent}>
      {tenant.documents.length > 0 ? (
        <FlatList
          data={tenant.documents}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={styles.documentCard}
              onPress={() => Alert.alert("View Document", `Opening ${item.name}`)}
            >
              <View style={styles.documentIcon}>
                <Text style={styles.documentType}>{item.type}</Text>
              </View>
              <View style={styles.documentInfo}>
                <Text style={styles.documentName}>{item.name}</Text>
                <Text style={styles.documentDate}>Added: {item.date}</Text>
              </View>
            </TouchableOpacity>
          )}
          ListFooterComponent={
            <TouchableOpacity
              style={styles.addButton}
              onPress={() => navigation.navigate("AddDocument", { tenantId: tenant.id })}
            >
              <Text style={styles.addButtonText}>+ Add Document</Text>
            </TouchableOpacity>
          }
        />
      ) : (
        <View style={styles.emptyState}>
          <Text style={styles.emptyStateText}>No documents for this tenant</Text>
          <TouchableOpacity
            style={styles.addButton}
            onPress={() => navigation.navigate("AddDocument", { tenantId: tenant.id })}
          >
            <Text style={styles.addButtonText}>+ Add Document</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  )

  // Function to render the notes tab
  const renderNotesTab = () => (
    <View style={styles.tabContent}>
      {tenant.notes.length > 0 ? (
        <FlatList
          data={tenant.notes}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <View style={styles.noteCard}>
              <Text style={styles.noteDate}>{item.date}</Text>
              <Text style={styles.noteText}>{item.text}</Text>
            </View>
          )}
          ListFooterComponent={
            <TouchableOpacity
              style={styles.addButton}
              onPress={() => navigation.navigate("AddNote", { tenantId: tenant.id })}
            >
              <Text style={styles.addButtonText}>+ Add Note</Text>
            </TouchableOpacity>
          }
        />
      ) : (
        <View style={styles.emptyState}>
          <Text style={styles.emptyStateText}>No notes for this tenant</Text>
          <TouchableOpacity
            style={styles.addButton}
            onPress={() => navigation.navigate("AddNote", { tenantId: tenant.id })}
          >
            <Text style={styles.addButtonText}>+ Add Note</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
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
        <Text style={styles.headerTitle}>Tenant Details</Text>
        <View style={styles.placeholder} />
      </View>

      <View style={styles.tabsContainer}>
        <TouchableOpacity
          style={[styles.tabButton, activeTab === "info" && styles.activeTabButton]}
          onPress={() => setActiveTab("info")}
        >
          <Text style={[styles.tabButtonText, activeTab === "info" && styles.activeTabButtonText]}>Info</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tabButton, activeTab === "payments" && styles.activeTabButton]}
          onPress={() => setActiveTab("payments")}
        >
          <Text style={[styles.tabButtonText, activeTab === "payments" && styles.activeTabButtonText]}>Payments</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tabButton, activeTab === "documents" && styles.activeTabButton]}
          onPress={() => setActiveTab("documents")}
        >
          <Text style={[styles.tabButtonText, activeTab === "documents" && styles.activeTabButtonText]}>Documents</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tabButton, activeTab === "notes" && styles.activeTabButton]}
          onPress={() => setActiveTab("notes")}
        >
          <Text style={[styles.tabButtonText, activeTab === "notes" && styles.activeTabButtonText]}>Notes</Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content}>
        {activeTab === "info" && renderInfoTab()}
        {activeTab === "payments" && renderPaymentsTab()}
        {activeTab === "documents" && renderDocumentsTab()}
        {activeTab === "notes" && renderNotesTab()}
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
  tabsContainer: {
    flexDirection: "row",
    backgroundColor: "white",
    borderBottomWidth: 1,
    borderBottomColor: "#e0e0e0",
  },
  tabButton: {
    flex: 1,
    paddingVertical: 12,
    alignItems: "center",
  },
  activeTabButton: {
    borderBottomWidth: 2,
    borderBottomColor: "#2196F3",
  },
  tabButtonText: {
    fontSize: 14,
    color: "#666",
  },
  activeTabButtonText: {
    color: "#2196F3",
    fontWeight: "bold",
  },
  content: {
    flex: 1,
  },
  tabContent: {
    padding: 16,
  },
  profileSection: {
    flexDirection: "row",
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
  profileImage: {
    width: 80,
    height: 80,
    borderRadius: 40,
    marginRight: 16,
  },
  profileInfo: {
    flex: 1,
    justifyContent: "center",
  },
  tenantName: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 4,
  },
  tenantEmail: {
    fontSize: 14,
    color: "#666",
    marginBottom: 4,
  },
  tenantPhone: {
    fontSize: 14,
    color: "#666",
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
  },
  infoValueLink: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#2196F3",
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
    marginRight: 8,
  },
  messageButton: {
    backgroundColor: "#4CAF50",
    marginRight: 0,
    marginLeft: 8,
  },
  actionButtonText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 14,
  },
  paymentCard: {
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
  paymentHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  paymentDate: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
  },
  paymentDetails: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  paymentAmount: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#2196F3",
  },
  paymentMethod: {
    fontSize: 14,
    color: "#666",
  },
  documentCard: {
    backgroundColor: "white",
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
    flexDirection: "row",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  documentIcon: {
    width: 50,
    height: 50,
    borderRadius: 4,
    backgroundColor: "#E3F2FD",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 16,
  },
  documentType: {
    fontSize: 12,
    fontWeight: "bold",
    color: "#2196F3",
  },
  documentInfo: {
    flex: 1,
  },
  documentName: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 4,
  },
  documentDate: {
    fontSize: 14,
    color: "#666",
  },
  noteCard: {
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
  noteDate: {
    fontSize: 14,
    color: "#666",
    marginBottom: 8,
  },
  noteText: {
    fontSize: 16,
    color: "#333",
    lineHeight: 22,
  },
  emptyState: {
    alignItems: "center",
    justifyContent: "center",
    padding: 24,
  },
  emptyStateText: {
    fontSize: 16,
    color: "#666",
    marginBottom: 16,
  },
  addButton: {
    backgroundColor: "#2196F3",
    borderRadius: 8,
    padding: 16,
    alignItems: "center",
    marginTop: 8,
  },
  addButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
})

export default TenantDetailScreen

