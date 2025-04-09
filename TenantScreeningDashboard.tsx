"use client"

import { useState, useEffect } from "react"
import { View, Text, StyleSheet, FlatList, TouchableOpacity, ActivityIndicator, Alert } from "react-native"
import { SafeAreaView } from "react-native-safe-area-context"
import { Ionicons } from "@expo/vector-icons"

// Mock data for applicants
const mockApplicants = [
  {
    id: "1",
    name: "John Smith",
    email: "john.smith@example.com",
    phone: "(555) 123-4567",
    propertyId: "1",
    propertyName: "Sunset Villa",
    applicationDate: "2023-10-15",
    status: "pending",
    riskScore: null,
    backgroundCheck: null,
    creditScore: null,
  },
  {
    id: "2",
    name: "Maria Garcia",
    email: "maria.garcia@example.com",
    phone: "(555) 234-5678",
    propertyId: "2",
    propertyName: "Ocean View Apartments",
    applicationDate: "2023-10-14",
    status: "screening",
    riskScore: 72,
    backgroundCheck: "in_progress",
    creditScore: 680,
  },
  {
    id: "3",
    name: "Robert Johnson",
    email: "robert.johnson@example.com",
    phone: "(555) 345-6789",
    propertyId: "1",
    propertyName: "Sunset Villa",
    applicationDate: "2023-10-12",
    status: "approved",
    riskScore: 85,
    backgroundCheck: "passed",
    creditScore: 720,
  },
  {
    id: "4",
    name: "Sarah Williams",
    email: "sarah.williams@example.com",
    phone: "(555) 456-7890",
    propertyId: "3",
    propertyName: "Downtown Lofts",
    applicationDate: "2023-10-10",
    status: "rejected",
    riskScore: 45,
    backgroundCheck: "failed",
    creditScore: 580,
  },
]

const TenantScreeningDashboard = ({ navigation }) => {
  const [applicants, setApplicants] = useState([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState("pending")

  useEffect(() => {
    // Simulate API call to fetch applicants
    setTimeout(() => {
      setApplicants(mockApplicants)
      setLoading(false)
    }, 1000)
  }, [])

  const filteredApplicants = applicants.filter((applicant) => {
    if (activeTab === "pending") return applicant.status === "pending"
    if (activeTab === "screening") return applicant.status === "screening"
    if (activeTab === "approved") return applicant.status === "approved"
    if (activeTab === "rejected") return applicant.status === "rejected"
    return true
  })

  const startScreening = (applicantId) => {
    Alert.alert(
      "Start Screening",
      "This will initiate the AI-powered screening process for this applicant. Continue?",
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Start",
          onPress: () => {
            // Update applicant status
            const updatedApplicants = applicants.map((applicant) => {
              if (applicant.id === applicantId) {
                return {
                  ...applicant,
                  status: "screening",
                  backgroundCheck: "in_progress",
                }
              }
              return applicant
            })
            setApplicants(updatedApplicants)

            // Simulate API call for screening process
            Alert.alert("Screening Started", "The AI-powered screening process has been initiated.")
          },
        },
      ],
    )
  }

  const viewDetails = (applicantId) => {
    navigation.navigate("ApplicantDetails", { applicantId })
  }

  const getStatusColor = (status) => {
    switch (status) {
      case "pending":
        return "#FFA500" // Orange
      case "screening":
        return "#3498DB" // Blue
      case "approved":
        return "#2ECC71" // Green
      case "rejected":
        return "#E74C3C" // Red
      default:
        return "#95A5A6" // Gray
    }
  }

  const getRiskScoreColor = (score) => {
    if (score === null) return "#95A5A6" // Gray
    if (score >= 80) return "#2ECC71" // Green
    if (score >= 60) return "#FFA500" // Orange
    return "#E74C3C" // Red
  }

  const renderApplicantItem = ({ item }) => (
    <TouchableOpacity style={styles.applicantCard} onPress={() => viewDetails(item.id)}>
      <View style={styles.applicantHeader}>
        <Text style={styles.applicantName}>{item.name}</Text>
        <View style={[styles.statusBadge, { backgroundColor: getStatusColor(item.status) }]}>
          <Text style={styles.statusText}>{item.status.charAt(0).toUpperCase() + item.status.slice(1)}</Text>
        </View>
      </View>

      <Text style={styles.propertyName}>{item.propertyName}</Text>
      <Text style={styles.applicationDate}>Applied: {item.applicationDate}</Text>

      {item.riskScore !== null && (
        <View style={styles.scoreContainer}>
          <Text style={styles.scoreLabel}>Risk Score:</Text>
          <View style={[styles.scoreBadge, { backgroundColor: getRiskScoreColor(item.riskScore) }]}>
            <Text style={styles.scoreText}>{item.riskScore}</Text>
          </View>
        </View>
      )}

      <View style={styles.actionButtons}>
        {item.status === "pending" && (
          <TouchableOpacity style={styles.screenButton} onPress={() => startScreening(item.id)}>
            <Text style={styles.screenButtonText}>Start Screening</Text>
          </TouchableOpacity>
        )}

        <TouchableOpacity style={styles.detailsButton} onPress={() => viewDetails(item.id)}>
          <Text style={styles.detailsButtonText}>View Details</Text>
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  )

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color="#333" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Tenant Screening</Text>
        <TouchableOpacity
          style={styles.helpButton}
          onPress={() =>
            Alert.alert(
              "AI Screening Help",
              "This dashboard shows applicants in various stages of the AI-powered screening process.",
            )
          }
        >
          <Ionicons name="help-circle-outline" size={24} color="#333" />
        </TouchableOpacity>
      </View>

      <View style={styles.tabsContainer}>
        <TouchableOpacity
          style={[styles.tab, activeTab === "pending" && styles.activeTab]}
          onPress={() => setActiveTab("pending")}
        >
          <Text style={[styles.tabText, activeTab === "pending" && styles.activeTabText]}>Pending</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, activeTab === "screening" && styles.activeTab]}
          onPress={() => setActiveTab("screening")}
        >
          <Text style={[styles.tabText, activeTab === "screening" && styles.activeTabText]}>Screening</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, activeTab === "approved" && styles.activeTab]}
          onPress={() => setActiveTab("approved")}
        >
          <Text style={[styles.tabText, activeTab === "approved" && styles.activeTabText]}>Approved</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, activeTab === "rejected" && styles.activeTab]}
          onPress={() => setActiveTab("rejected")}
        >
          <Text style={[styles.tabText, activeTab === "rejected" && styles.activeTabText]}>Rejected</Text>
        </TouchableOpacity>
      </View>

      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#3498DB" />
          <Text style={styles.loadingText}>Loading applicants...</Text>
        </View>
      ) : filteredApplicants.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Ionicons name="document-text-outline" size={64} color="#95A5A6" />
          <Text style={styles.emptyText}>No {activeTab} applications</Text>
        </View>
      ) : (
        <FlatList
          data={filteredApplicants}
          renderItem={renderApplicantItem}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContainer}
        />
      )}
    </SafeAreaView>
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
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: "#FFFFFF",
    borderBottomWidth: 1,
    borderBottomColor: "#E0E0E0",
  },
  backButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333333",
  },
  helpButton: {
    padding: 8,
  },
  tabsContainer: {
    flexDirection: "row",
    backgroundColor: "#FFFFFF",
    borderBottomWidth: 1,
    borderBottomColor: "#E0E0E0",
  },
  tab: {
    flex: 1,
    paddingVertical: 12,
    alignItems: "center",
  },
  activeTab: {
    borderBottomWidth: 2,
    borderBottomColor: "#3498DB",
  },
  tabText: {
    fontSize: 14,
    color: "#95A5A6",
  },
  activeTabText: {
    color: "#3498DB",
    fontWeight: "bold",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
    color: "#95A5A6",
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 24,
  },
  emptyText: {
    marginTop: 16,
    fontSize: 16,
    color: "#95A5A6",
  },
  listContainer: {
    padding: 16,
  },
  applicantCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  applicantHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  applicantName: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333333",
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  statusText: {
    fontSize: 12,
    fontWeight: "bold",
    color: "#FFFFFF",
  },
  propertyName: {
    fontSize: 16,
    color: "#666666",
    marginBottom: 4,
  },
  applicationDate: {
    fontSize: 14,
    color: "#95A5A6",
    marginBottom: 12,
  },
  scoreContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
  },
  scoreLabel: {
    fontSize: 14,
    color: "#666666",
    marginRight: 8,
  },
  scoreBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  scoreText: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#FFFFFF",
  },
  actionButtons: {
    flexDirection: "row",
    justifyContent: "flex-end",
  },
  screenButton: {
    backgroundColor: "#3498DB",
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 4,
    marginRight: 8,
  },
  screenButtonText: {
    color: "#FFFFFF",
    fontWeight: "bold",
    fontSize: 14,
  },
  detailsButton: {
    backgroundColor: "#EEEEEE",
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 4,
  },
  detailsButtonText: {
    color: "#666666",
    fontWeight: "bold",
    fontSize: 14,
  },
})

export default TenantScreeningDashboard

