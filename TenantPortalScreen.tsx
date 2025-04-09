"use client"

import { useState } from "react"
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image, Alert, Switch } from "react-native"
import { SafeAreaView } from "react-native-safe-area-context"
import { COLORS } from "./constants/colors"
import { Ionicons } from "@expo/vector-icons"
import Card from "./components/ui/Card"
import Button from "./components/ui/Button"
import { useNavigation } from "@react-navigation/native"

// Tenant information
interface Tenant {
  id: string
  name: string
  email: string
  phone: string
  avatar: string
  unitNumber: string
  propertyName: string
  leaseStart: string
  leaseEnd: string
  monthlyRent: number
  balance: number
  deposit: number
}

// Mock tenant data
const mockTenant: Tenant = {
  id: "tenant-123",
  name: "John Doe",
  email: "john.doe@example.com",
  phone: "555-123-4567",
  avatar: "https://randomuser.me/api/portraits/men/32.jpg",
  unitNumber: "Apt 301",
  propertyName: "Sunset Apartments",
  leaseStart: "2023-01-01",
  leaseEnd: "2024-01-01",
  monthlyRent: 1500,
  balance: 0,
  deposit: 1500,
}

// Payment history
interface Payment {
  id: string
  date: string
  amount: number
  type: "rent" | "deposit" | "fee" | "utility"
  status: "pending" | "completed" | "failed"
  description: string
}

// Mock payment history
const mockPayments: Payment[] = [
  {
    id: "payment-1",
    date: "2023-04-01",
    amount: 1500,
    type: "rent",
    status: "completed",
    description: "April 2023 Rent",
  },
  {
    id: "payment-2",
    date: "2023-03-01",
    amount: 1500,
    type: "rent",
    status: "completed",
    description: "March 2023 Rent",
  },
  {
    id: "payment-3",
    date: "2023-02-01",
    amount: 1500,
    type: "rent",
    status: "completed",
    description: "February 2023 Rent",
  },
  {
    id: "payment-4",
    date: "2023-01-01",
    amount: 1500,
    type: "rent",
    status: "completed",
    description: "January 2023 Rent",
  },
  {
    id: "payment-5",
    date: "2022-12-20",
    amount: 1500,
    type: "deposit",
    status: "completed",
    description: "Security Deposit",
  },
]

// Maintenance request
interface MaintenanceRequest {
  id: string
  title: string
  description: string
  date: string
  status: "open" | "in-progress" | "completed" | "cancelled"
  priority: "low" | "medium" | "high" | "emergency"
  category: string
  images?: string[]
}

// Mock maintenance requests
const mockMaintenanceRequests: MaintenanceRequest[] = [
  {
    id: "req-1",
    title: "Leaky Faucet",
    description: "The kitchen sink faucet is dripping constantly.",
    date: "2023-04-15",
    status: "in-progress",
    priority: "medium",
    category: "Plumbing",
  },
  {
    id: "req-2",
    title: "Broken Dishwasher",
    description: "Dishwasher is not starting. Error code E4 is displayed.",
    date: "2023-03-28",
    status: "completed",
    priority: "high",
    category: "Appliance",
  },
  {
    id: "req-3",
    title: "Light Bulb Replacement",
    description: "The ceiling light in the living room needs to be replaced.",
    date: "2023-04-02",
    status: "completed",
    priority: "low",
    category: "Electrical",
  },
]

// Documents
interface TenantDocument {
  id: string
  name: string
  type: string
  url: string
  uploadDate: string
  category: string
}

// Mock documents
const mockDocuments: TenantDocument[] = [
  {
    id: "doc-1",
    name: "Lease Agreement",
    type: "pdf",
    url: "https://example.com/lease.pdf",
    uploadDate: "2022-12-20",
    category: "Lease",
  },
  {
    id: "doc-2",
    name: "Move-in Inspection",
    type: "pdf",
    url: "https://example.com/inspection.pdf",
    uploadDate: "2022-12-28",
    category: "Inspection",
  },
  {
    id: "doc-3",
    name: "Renter's Insurance",
    type: "pdf",
    url: "https://example.com/insurance.pdf",
    uploadDate: "2022-12-29",
    category: "Insurance",
  },
]

// Amenity booking
interface Amenity {
  id: string
  name: string
  description: string
  image: string
  availableTimes: string[]
}

// Mock amenities
const mockAmenities: Amenity[] = [
  {
    id: "amenity-1",
    name: "Swimming Pool",
    description: "Outdoor pool with lounge area",
    image: "https://images.unsplash.com/photo-1576013551627-0cc20b96c2a7",
    availableTimes: ["9:00 AM - 10:00 PM"],
  },
  {
    id: "amenity-2",
    name: "Fitness Center",
    description: "Fully equipped gym with cardio and strength training equipment",
    image: "https://images.unsplash.com/photo-1534438327276-14e5300c3a48",
    availableTimes: ["5:00 AM - 11:00 PM"],
  },
  {
    id: "amenity-3",
    name: "Community Room",
    description: "Space for events and gatherings",
    image: "https://images.unsplash.com/photo-1497366811353-6870744d04b2",
    availableTimes: ["8:00 AM - 10:00 PM"],
  },
]

const TenantPortalScreen = () => {
  const navigation = useNavigation()
  const [tenant, setTenant] = useState<Tenant>(mockTenant)
  const [payments, setPayments] = useState<Payment[]>(mockPayments)
  const [maintenanceRequests, setMaintenanceRequests] = useState<MaintenanceRequest[]>(mockMaintenanceRequests)
  const [documents, setDocuments] = useState<TenantDocument[]>(mockDocuments)
  const [amenities, setAmenities] = useState<Amenity[]>(mockAmenities)

  // Format date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  }

  // Format currency
  const formatCurrency = (amount: number) => {
    return `$${amount.toLocaleString()}`
  }

  // Get status color
  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return COLORS.success
      case "in-progress":
        return COLORS.warning
      case "open":
        return COLORS.info
      case "cancelled":
        return COLORS.error
      case "pending":
        return COLORS.secondary
      case "failed":
        return COLORS.error
      default:
        return COLORS.gray
    }
  }

  // Get priority icon
  const getPriorityIcon = (priority: string) => {
    switch (priority) {
      case "emergency":
        return "alert-circle"
      case "high":
        return "arrow-up"
      case "medium":
        return "remove"
      case "low":
        return "arrow-down"
      default:
        return "help-circle"
    }
  }

  // Navigation handlers
  const navigateToPayments = () => {
    navigation.navigate("Payments" as never)
  }

  const navigateToMaintenanceRequests = () => {
    navigation.navigate("Maintenance" as never)
  }

  const navigateToDocuments = () => {
    navigation.navigate("DocumentsScreen" as never)
  }

  const navigateToAddMaintenanceRequest = () => {
    navigation.navigate("Maintenance", { screen: "AddMaintenanceRequest" } as never)
  }

  const navigateToMakePayment = () => {
    navigation.navigate("Payments", { screen: "AddPayment" } as never)
  }

  const navigateToPropertyDetail = () => {
    navigation.navigate("Properties", { screen: "PropertyDetail", params: { propertyId: "property-1" } } as never)
  }

  const handleAmenityBooking = (amenity: Amenity) => {
    Alert.alert("Book Amenity", `Would you like to book ${amenity.name}?`, [
      {
        text: "Cancel",
        style: "cancel",
      },
      {
        text: "Book",
        onPress: () => {
          // Would handle amenity booking in a real app
          Alert.alert("Success", `${amenity.name} booked successfully!`)
        },
      },
    ])
  }

  const handleDocumentView = (document: TenantDocument) => {
    Alert.alert("View Document", `Would you like to view ${document.name}?`, [
      {
        text: "Cancel",
        style: "cancel",
      },
      {
        text: "View",
        onPress: () => {
          // Would open document in a real app
          Alert.alert("Success", `Viewing ${document.name}`)
        },
      },
    ])
  }

  // Render sections
  const renderLeaseSection = () => (
    <Card title="Lease Information" elevated>
      <View style={styles.leaseContainer}>
        <View style={styles.propertyInfo}>
          <Text style={styles.propertyName}>{tenant.propertyName}</Text>
          <Text style={styles.unitNumber}>{tenant.unitNumber}</Text>
        </View>

        <View style={styles.leaseDetails}>
          <View style={styles.leaseDetail}>
            <Text style={styles.leaseLabel}>Lease Start</Text>
            <Text style={styles.leaseValue}>{formatDate(tenant.leaseStart)}</Text>
          </View>

          <View style={styles.leaseDetail}>
            <Text style={styles.leaseLabel}>Lease End</Text>
            <Text style={styles.leaseValue}>{formatDate(tenant.leaseEnd)}</Text>
          </View>

          <View style={styles.leaseDetail}>
            <Text style={styles.leaseLabel}>Monthly Rent</Text>
            <Text style={styles.leaseValue}>{formatCurrency(tenant.monthlyRent)}</Text>
          </View>

          <View style={styles.leaseDetail}>
            <Text style={styles.leaseLabel}>Security Deposit</Text>
            <Text style={styles.leaseValue}>{formatCurrency(tenant.deposit)}</Text>
          </View>
        </View>

        <Button
          title="View Property Details"
          type="outline"
          onPress={navigateToPropertyDetail}
          icon={<Ionicons name="home" size={18} color={COLORS.primary} style={styles.buttonIcon} />}
        />
      </View>
    </Card>
  )

  const renderPaymentSection = () => (
    <Card
      title="Payments"
      headerRight={<Button title="View All" type="link" size="small" onPress={navigateToPayments} />}
      elevated
    >
      <View style={styles.balanceContainer}>
        <View style={styles.balanceItem}>
          <Text style={styles.balanceLabel}>Current Balance</Text>
          <Text style={[styles.balanceValue, tenant.balance > 0 ? styles.negativeBalance : styles.positiveBalance]}>
            {formatCurrency(tenant.balance)}
          </Text>
        </View>

        <View style={styles.balanceItem}>
          <Text style={styles.balanceLabel}>Next Payment</Text>
          <Text style={styles.balanceValue}>{formatCurrency(tenant.monthlyRent)}</Text>
        </View>

        <View style={styles.balanceItem}>
          <Text style={styles.balanceLabel}>Due Date</Text>
          <Text style={styles.balanceValue}>May 1, 2023</Text>
        </View>
      </View>

      <Button
        title="Make a Payment"
        type="primary"
        onPress={navigateToMakePayment}
        icon={<Ionicons name="card" size={18} color={COLORS.white} style={styles.buttonIcon} />}
        style={styles.paymentButton}
      />

      <Text style={styles.sectionTitle}>Recent Payments</Text>

      {payments.slice(0, 3).map((payment) => (
        <View key={payment.id} style={styles.paymentItem}>
          <View style={styles.paymentInfo}>
            <Text style={styles.paymentDescription}>{payment.description}</Text>
            <Text style={styles.paymentDate}>{formatDate(payment.date)}</Text>
          </View>

          <View style={styles.paymentAmountContainer}>
            <Text style={styles.paymentAmount}>{formatCurrency(payment.amount)}</Text>
            <View style={[styles.statusBadge, { backgroundColor: getStatusColor(payment.status) }]}>
              <Text style={styles.statusText}>{payment.status}</Text>
            </View>
          </View>
        </View>
      ))}
    </Card>
  )

  const renderMaintenanceSection = () => (
    <Card
      title="Maintenance Requests"
      headerRight={<Button title="View All" type="link" size="small" onPress={navigateToMaintenanceRequests} />}
      elevated
    >
      {maintenanceRequests.length === 0 ? (
        <View style={styles.emptyState}>
          <Ionicons name="construct" size={48} color={COLORS.gray} />
          <Text style={styles.emptyText}>No maintenance requests</Text>
        </View>
      ) : (
        maintenanceRequests.slice(0, 2).map((request) => (
          <View key={request.id} style={styles.maintenanceItem}>
            <View style={styles.maintenanceHeader}>
              <View style={styles.maintenanceTitle}>
                <Ionicons
                  name={getPriorityIcon(request.priority)}
                  size={16}
                  color={getStatusColor(request.status)}
                  style={styles.priorityIcon}
                />
                <Text style={styles.maintenanceText}>{request.title}</Text>
              </View>

              <View style={[styles.statusBadge, { backgroundColor: getStatusColor(request.status) }]}>
                <Text style={styles.statusText}>{request.status}</Text>
              </View>
            </View>

            <Text style={styles.maintenanceDescription}>{request.description}</Text>

            <View style={styles.maintenanceFooter}>
              <Text style={styles.maintenanceCategory}>{request.category}</Text>
              <Text style={styles.maintenanceDate}>{formatDate(request.date)}</Text>
            </View>
          </View>
        ))
      )}

      <Button
        title="Submit New Request"
        type="outline"
        onPress={navigateToAddMaintenanceRequest}
        icon={<Ionicons name="add-circle" size={18} color={COLORS.primary} style={styles.buttonIcon} />}
        style={styles.maintenanceButton}
      />
    </Card>
  )

  const renderDocumentsSection = () => (
    <Card
      title="Documents"
      headerRight={<Button title="View All" type="link" size="small" onPress={navigateToDocuments} />}
      elevated
    >
      {documents.length === 0 ? (
        <View style={styles.emptyState}>
          <Ionicons name="document" size={48} color={COLORS.gray} />
          <Text style={styles.emptyText}>No documents</Text>
        </View>
      ) : (
        documents.map((document) => (
          <TouchableOpacity key={document.id} style={styles.documentItem} onPress={() => handleDocumentView(document)}>
            <Ionicons name="document-text" size={24} color={COLORS.primary} style={styles.documentIcon} />

            <View style={styles.documentInfo}>
              <Text style={styles.documentName}>{document.name}</Text>
              <Text style={styles.documentMeta}>
                {document.category} • Uploaded {formatDate(document.uploadDate)}
              </Text>
            </View>

            <Ionicons name="chevron-forward" size={20} color={COLORS.gray} />
          </TouchableOpacity>
        ))
      )}
    </Card>
  )

  const renderAmenitiesSection = () => (
    <Card title="Amenities" elevated>
      {amenities.map((amenity) => (
        <TouchableOpacity key={amenity.id} style={styles.amenityItem} onPress={() => handleAmenityBooking(amenity)}>
          <Image source={{ uri: amenity.image }} style={styles.amenityImage} />

          <View style={styles.amenityInfo}>
            <Text style={styles.amenityName}>{amenity.name}</Text>
            <Text style={styles.amenityDescription}>{amenity.description}</Text>
            <Text style={styles.amenityHours}>Available: {amenity.availableTimes[0]}</Text>
          </View>
        </TouchableOpacity>
      ))}
    </Card>
  )

  const renderSmartHomeSection = () => (
    <Card title="Smart Home Controls" elevated>
      <View style={styles.smartHomeContainer}>
        {/* Thermostat Control */}
        <View style={styles.smartDeviceItem}>
          <View style={styles.smartDeviceIconContainer}>
            <Ionicons name="thermometer-outline" size={24} color={COLORS.primary} />
          </View>
          <View style={styles.smartDeviceInfo}>
            <Text style={styles.smartDeviceName}>Living Room Thermostat</Text>
            <Text style={styles.smartDeviceValue}>72°F</Text>
          </View>
          <View style={styles.smartDeviceControls}>
            <TouchableOpacity style={styles.smartDeviceButton}>
              <Ionicons name="remove" size={18} color={COLORS.primary} />
            </TouchableOpacity>
            <TouchableOpacity style={styles.smartDeviceButton}>
              <Ionicons name="add" size={18} color={COLORS.primary} />
            </TouchableOpacity>
          </View>
        </View>

        {/* Light Control */}
        <View style={styles.smartDeviceItem}>
          <View style={styles.smartDeviceIconContainer}>
            <Ionicons name="bulb-outline" size={24} color={COLORS.primary} />
          </View>
          <View style={styles.smartDeviceInfo}>
            <Text style={styles.smartDeviceName}>Living Room Lights</Text>
            <Text style={styles.smartDeviceValue}>Off</Text>
          </View>
          <Switch
            value={false}
            onValueChange={() => {}}
            trackColor={{ false: COLORS.lightGray, true: COLORS.primaryLight }}
            thumbColor={COLORS.primary}
          />
        </View>

        {/* Lock Control */}
        <View style={styles.smartDeviceItem}>
          <View style={styles.smartDeviceIconContainer}>
            <Ionicons name="lock-closed-outline" size={24} color={COLORS.primary} />
          </View>
          <View style={styles.smartDeviceInfo}>
            <Text style={styles.smartDeviceName}>Front Door</Text>
            <Text style={styles.smartDeviceValue}>Locked</Text>
          </View>
          <Switch
            value={true}
            onValueChange={() => {}}
            trackColor={{ false: COLORS.lightGray, true: COLORS.primaryLight }}
            thumbColor={COLORS.primary}
          />
        </View>

        <Button
          title="View All Devices"
          type="outline"
          onPress={() => {
            navigation.navigate("SmartHome" as never)
          }}
          icon={<Ionicons name="home-outline" size={18} color={COLORS.primary} style={styles.buttonIcon} />}
          style={styles.smartHomeButton}
        />
      </View>
    </Card>
  )

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      <View style={styles.header}>
        <View style={styles.userInfo}>
          <Image source={{ uri: tenant.avatar }} style={styles.avatar} />
          <View style={styles.userDetails}>
            <Text style={styles.userName}>{tenant.name}</Text>
            <Text style={styles.userEmail}>{tenant.email}</Text>
          </View>
        </View>

        <TouchableOpacity
          style={styles.notificationButton}
          onPress={() => {
            navigation.navigate("NotificationsScreen" as never)
          }}
        >
          <Ionicons name="notifications" size={24} color={COLORS.darkGray} />
          <View style={styles.notificationBadge} />
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content}>
        {renderLeaseSection()}
        {renderPaymentSection()}
        {renderMaintenanceSection()}
        {renderDocumentsSection()}
        {renderSmartHomeSection()}
        {renderAmenitiesSection()}

        <View style={styles.spacer} />
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
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: COLORS.white,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.lightGray,
  },
  userInfo: {
    flexDirection: "row",
    alignItems: "center",
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 12,
  },
  userDetails: {
    justifyContent: "center",
  },
  userName: {
    fontSize: 16,
    fontWeight: "bold",
    color: COLORS.darkGray,
  },
  userEmail: {
    fontSize: 12,
    color: COLORS.gray,
  },
  notificationButton: {
    position: "relative",
    padding: 4,
  },
  notificationBadge: {
    position: "absolute",
    top: 2,
    right: 2,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: COLORS.error,
  },
  content: {
    flex: 1,
    padding: 16,
  },
  leaseContainer: {
    marginBottom: 8,
  },
  propertyInfo: {
    marginBottom: 16,
  },
  propertyName: {
    fontSize: 18,
    fontWeight: "bold",
    color: COLORS.darkGray,
    marginBottom: 4,
  },
  unitNumber: {
    fontSize: 16,
    color: COLORS.gray,
  },
  leaseDetails: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    marginBottom: 16,
  },
  leaseDetail: {
    width: "48%",
    marginBottom: 12,
  },
  leaseLabel: {
    fontSize: 14,
    color: COLORS.gray,
    marginBottom: 4,
  },
  leaseValue: {
    fontSize: 16,
    fontWeight: "500",
    color: COLORS.darkGray,
  },
  balanceContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 16,
  },
  balanceItem: {
    alignItems: "center",
  },
  balanceLabel: {
    fontSize: 14,
    color: COLORS.gray,
    marginBottom: 4,
  },
  balanceValue: {
    fontSize: 18,
    fontWeight: "bold",
    color: COLORS.darkGray,
  },
  positiveBalance: {
    color: COLORS.success,
  },
  negativeBalance: {
    color: COLORS.error,
  },
  paymentButton: {
    marginBottom: 16,
  },
  buttonIcon: {
    marginRight: 8,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: COLORS.darkGray,
    marginBottom: 12,
  },
  paymentItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.lightGray,
  },
  paymentInfo: {
    flex: 1,
  },
  paymentDescription: {
    fontSize: 14,
    fontWeight: "500",
    color: COLORS.darkGray,
    marginBottom: 4,
  },
  paymentDate: {
    fontSize: 12,
    color: COLORS.gray,
  },
  paymentAmountContainer: {
    alignItems: "flex-end",
  },
  paymentAmount: {
    fontSize: 16,
    fontWeight: "bold",
    color: COLORS.darkGray,
    marginBottom: 4,
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 12,
  },
  statusText: {
    fontSize: 10,
    fontWeight: "500",
    color: COLORS.white,
    textTransform: "capitalize",
  },
  maintenanceItem: {
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.lightGray,
  },
  maintenanceHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  maintenanceTitle: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  priorityIcon: {
    marginRight: 8,
  },
  maintenanceText: {
    fontSize: 16,
    fontWeight: "500",
    color: COLORS.darkGray,
    flex: 1,
  },
  maintenanceDescription: {
    fontSize: 14,
    color: COLORS.gray,
    marginBottom: 8,
  },
  maintenanceFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  maintenanceCategory: {
    fontSize: 12,
    color: COLORS.primary,
  },
  maintenanceDate: {
    fontSize: 12,
    color: COLORS.gray,
  },
  maintenanceButton: {
    marginTop: 16,
  },
  documentItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.lightGray,
  },
  documentIcon: {
    marginRight: 12,
  },
  documentInfo: {
    flex: 1,
  },
  documentName: {
    fontSize: 14,
    fontWeight: "500",
    color: COLORS.darkGray,
    marginBottom: 4,
  },
  documentMeta: {
    fontSize: 12,
    color: COLORS.gray,
  },
  amenityItem: {
    flexDirection: "row",
    marginBottom: 16,
  },
  amenityImage: {
    width: 80,
    height: 80,
    borderRadius: 8,
    marginRight: 12,
  },
  amenityInfo: {
    flex: 1,
    justifyContent: "center",
  },
  amenityName: {
    fontSize: 16,
    fontWeight: "500",
    color: COLORS.darkGray,
    marginBottom: 4,
  },
  amenityDescription: {
    fontSize: 14,
    color: COLORS.gray,
    marginBottom: 4,
  },
  amenityHours: {
    fontSize: 12,
    color: COLORS.primary,
  },
  emptyState: {
    alignItems: "center",
    justifyContent: "center",
    padding: 24,
  },
  emptyText: {
    fontSize: 16,
    color: COLORS.gray,
    marginTop: 8,
  },
  spacer: {
    height: 40,
  },
  smartHomeContainer: {
    marginBottom: 8,
  },
  smartDeviceItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.lightGray,
  },
  smartDeviceIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: COLORS.primaryLight,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  smartDeviceInfo: {
    flex: 1,
  },
  smartDeviceName: {
    fontSize: 14,
    fontWeight: "500",
    color: COLORS.darkGray,
    marginBottom: 4,
  },
  smartDeviceValue: {
    fontSize: 12,
    color: COLORS.gray,
  },
  smartDeviceControls: {
    flexDirection: "row",
  },
  smartDeviceButton: {
    width: 30,
    height: 30,
    borderRadius: 15,
    borderWidth: 1,
    borderColor: COLORS.primary,
    justifyContent: "center",
    alignItems: "center",
    marginLeft: 8,
  },
  smartHomeButton: {
    marginTop: 16,
  },
})

export default TenantPortalScreen

