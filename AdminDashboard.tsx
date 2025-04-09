"use client"

import { useState } from "react"
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image } from "react-native"
import { MaterialIcons } from "@expo/vector-icons"
import { Dimensions } from "react-native"
import HamburgerMenu from "../../components/HamburgerMenu"
import GraphChart from "../../components/GraphChart"
import { toast } from "sonner-native"

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState("overview")

  const platformStats = {
    totalUsers: 1250,
    activeListings: 486,
    monthlyBookings: 95,
    revenue: 25600,
    verificationQueue: 15,
    reportedProperties: 3,
    activeDisputes: 8,
    systemHealth: 98,
  }

  const verificationQueue = [
    {
      id: "1",
      propertyTitle: "Luxury Beachfront Villa",
      owner: "John Smith",
      submittedDate: "2024-02-15",
      status: "pending",
      documents: ["proof_ownership.pdf", "property_tax.pdf"],
      verificationScore: 85,
    },
    {
      id: "2",
      propertyTitle: "Modern City Apartment",
      owner: "Sarah Johnson",
      submittedDate: "2024-02-14",
      status: "in_review",
      documents: ["deed.pdf", "insurance.pdf"],
      verificationScore: 92,
    },
  ]

  const handleVerification = async (propertyId, action) => {
    try {
      // Verification logic here
      toast.success(`Property ${action === "approve" ? "approved" : "rejected"} successfully!`)
    } catch (error) {
      toast.error("Verification action failed")
    }
  }

  const systemMetrics = {
    apiHealth: 100,
    databaseLatency: 45,
    storageUsage: 78,
    activeUsers: 325,
    errorRate: 0.5,
  }

  const recentProperties = [
    {
      id: "1",
      title: "Luxury Beachfront Villa",
      owner: "John Smith",
      status: "pending",
      submittedDate: "2024-02-15",
      image: "luxury%20beachfront%20villa%20with%20infinity%20pool",
    },
    {
      id: "2",
      title: "Modern City Apartment",
      owner: "Sarah Johnson",
      status: "approved",
      submittedDate: "2024-02-14",
      image: "modern%20city%20apartment%20with%20skyline%20view",
    },
  ]
  const renderHeader = () => (
    <View style={styles.header}>
      <View style={styles.headerTop}>
        <HamburgerMenu />
        <Text style={styles.welcomeText}>Admin Dashboard</Text>
        <TouchableOpacity style={styles.notificationButton}>
          <MaterialIcons name="notifications" size={24} color="#333" />
          <View style={styles.notificationBadge}>
            <Text style={styles.notificationCount}>5</Text>
          </View>
        </TouchableOpacity>
      </View>

      <GraphChart
        data={[20000, 22000, 24000, 26000, 25000, 27000, 29000, 31000, 30000, 32000, 33030, 35000]}
        width={Dimensions.get("window").width * 0.9}
        height={150}
        strokeColor="#2196F3"
      />

      <View style={styles.statsGrid}>
        <View style={styles.statCard}>
          <MaterialIcons name="people" size={24} color="#2196F3" />
          <Text style={styles.statNumber}>{platformStats.totalUsers}</Text>
          <Text style={styles.statLabel}>Total Users</Text>
        </View>
        <View style={styles.statCard}>
          <MaterialIcons name="apartment" size={24} color="#4CAF50" />
          <Text style={styles.statNumber}>{platformStats.activeListings}</Text>
          <Text style={styles.statLabel}>Active Listings</Text>
        </View>
        <View style={styles.statCard}>
          <MaterialIcons name="book-online" size={24} color="#FFC107" />
          <Text style={styles.statNumber}>{platformStats.monthlyBookings}</Text>
          <Text style={styles.statLabel}>Monthly Bookings</Text>
        </View>
        <View style={styles.statCard}>
          <MaterialIcons name="attach-money" size={24} color="#F44336" />
          <Text style={styles.statNumber}>${platformStats.revenue}</Text>
          <Text style={styles.statLabel}>Monthly Revenue</Text>
        </View>
      </View>
    </View>
  )

  const renderTabs = () => (
    <View style={styles.tabContainer}>
      <TouchableOpacity
        style={[styles.tab, activeTab === "overview" && styles.activeTab]}
        onPress={() => setActiveTab("overview")}
      >
        <MaterialIcons name="dashboard" size={24} color={activeTab === "overview" ? "#2196F3" : "#666"} />
        <Text style={[styles.tabText, activeTab === "overview" && styles.activeTabText]}>Overview</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={[styles.tab, activeTab === "properties" && styles.activeTab]}
        onPress={() => setActiveTab("properties")}
      >
        <MaterialIcons name="apartment" size={24} color={activeTab === "properties" ? "#2196F3" : "#666"} />
        <Text style={[styles.tabText, activeTab === "properties" && styles.activeTabText]}>Properties</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={[styles.tab, activeTab === "users" && styles.activeTab]}
        onPress={() => setActiveTab("users")}
      >
        <MaterialIcons name="people" size={24} color={activeTab === "users" ? "#2196F3" : "#666"} />
        <Text style={[styles.tabText, activeTab === "users" && styles.activeTabText]}>Users</Text>
      </TouchableOpacity>
    </View>
  )

  const PropertyCard = ({ property }) => (
    <View style={styles.propertyCard}>
      <Image
        source={{ uri: `https://api.a0.dev/assets/image?text=${property.image}&aspect=16:9` }}
        style={styles.propertyImage}
      />
      <View style={styles.propertyContent}>
        <View style={styles.propertyHeader}>
          <Text style={styles.propertyTitle}>{property.title}</Text>
          <View
            style={[styles.statusBadge, { backgroundColor: property.status === "approved" ? "#4CAF50" : "#FFC107" }]}
          >
            <Text style={styles.statusText}>{property.status}</Text>
          </View>
        </View>
        <View style={styles.propertyDetails}>
          <View style={styles.detailRow}>
            <MaterialIcons name="person" size={16} color="#666" />
            <Text style={styles.detailText}>Owner: {property.owner}</Text>
          </View>
          <View style={styles.detailRow}>
            <MaterialIcons name="date-range" size={16} color="#666" />
            <Text style={styles.detailText}>Submitted: {property.submittedDate}</Text>
          </View>
        </View>
        <View style={styles.actionButtons}>
          <TouchableOpacity
            style={[styles.actionButton, styles.approveButton]}
            onPress={() => {
              handleVerification(property.id, "approve")
            }}
          >
            <MaterialIcons name="check" size={20} color="white" />
            <Text style={styles.actionButtonText}>Approve</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.actionButton, styles.rejectButton]}
            onPress={() => {
              handleVerification(property.id, "reject")
            }}
          >
            <MaterialIcons name="close" size={20} color="white" />
            <Text style={styles.actionButtonText}>Reject</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  )

  return (
    <View style={styles.container}>
      {" "}
      <ScrollView showsVerticalScrollIndicator={false}>
        {renderHeader()}
        {/* Revenue Trend Chart */}
        <View style={styles.chartContainer}>
          <Text style={styles.chartTitle}>Revenue Trend</Text>
          <GraphChart
            data={[20000, 22000, 24000, 26000, 25000, 27000, 29000, 31000, 30000, 32000, 33030, 35000]}
            width={Dimensions.get("window").width * 0.9}
            height={150}
          />
        </View>
        {renderTabs()}
        <View style={styles.content}>
          {activeTab === "overview" && (
            <>
              <Text style={styles.sectionTitle}>Recent Property Submissions</Text>
              {recentProperties.map((property) => (
                <PropertyCard key={property.id} property={property} />
              ))}
            </>
          )}

          {activeTab === "properties" && (
            <Text style={styles.sectionTitle}>Property Management</Text>
            // Add property management content here
          )}

          {activeTab === "users" && (
            <Text style={styles.sectionTitle}>User Management</Text>
            // Add user management content here
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
  header: {
    backgroundColor: "white",
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  headerTop: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  welcomeText: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#333",
  },
  notificationButton: {
    position: "relative",
    padding: 8,
  },
  notificationBadge: {
    position: "absolute",
    top: 4,
    right: 4,
    backgroundColor: "#ff4444",
    borderRadius: 10,
    width: 20,
    height: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  notificationCount: {
    color: "white",
    fontSize: 12,
    fontWeight: "bold",
  },
  statsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginTop: 8,
  },
  statCard: {
    width: "48%",
    backgroundColor: "#f8f8f8",
    padding: 16,
    borderRadius: 12,
    marginHorizontal: "1%",
    marginBottom: 16,
    alignItems: "center",
  },
  statNumber: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#333",
    marginTop: 8,
  },
  statLabel: {
    fontSize: 12,
    color: "#666",
    marginTop: 4,
    textAlign: "center",
  },
  tabContainer: {
    flexDirection: "row",
    backgroundColor: "white",
    padding: 8,
    marginTop: 16,
  },
  tab: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    padding: 12,
    borderRadius: 8,
  },
  activeTab: {
    backgroundColor: "#f0f7ff",
  },
  tabText: {
    marginLeft: 8,
    color: "#666",
    fontSize: 14,
  },
  activeTabText: {
    color: "#2196F3",
    fontWeight: "600",
  },
  content: {
    padding: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 16,
  },
  propertyCard: {
    backgroundColor: "white",
    borderRadius: 12,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
    overflow: "hidden",
  },
  propertyImage: {
    width: "100%",
    height: 150,
  },
  propertyContent: {
    padding: 16,
  },
  propertyHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  propertyTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
    flex: 1,
    marginRight: 8,
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: {
    color: "white",
    fontSize: 12,
    fontWeight: "600",
    textTransform: "capitalize",
  },
  propertyDetails: {
    marginBottom: 12,
  },
  detailRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  detailText: {
    marginLeft: 8,
    color: "#666",
    fontSize: 14,
  },
  actionButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  actionButton: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    padding: 12,
    borderRadius: 8,
    marginHorizontal: 4,
  },
  approveButton: {
    backgroundColor: "#4CAF50",
  },
  rejectButton: {
    backgroundColor: "#F44336",
  },
  actionButtonText: {
    color: "white",
    marginLeft: 8,
    fontWeight: "600",
  },
  chartContainer: {
    padding: 16,
    backgroundColor: "white",
    marginBottom: 16,
  },
  chartTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 8,
  },
})

export default AdminDashboard

