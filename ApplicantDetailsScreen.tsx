"use client"

import { useState, useEffect } from "react"
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, ActivityIndicator, Alert, Image } from "react-native"
import { SafeAreaView } from "react-native-safe-area-context"
import { Ionicons } from "@expo/vector-icons"

// Mock data for applicant details
const mockApplicantDetails = {
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
  income: 65000,
  rentToComeRatio: 28,
  employmentStatus: "Full-time",
  employer: "Tech Solutions Inc.",
  employmentLength: "3 years",
  previousAddress: "123 Main St, Apt 4B, Springfield, IL",
  previousLandlord: "John Property Management",
  previousRent: 1200,
  evictionHistory: false,
  criminalHistory: false,
  identityVerified: true,
  documents: [
    { id: "1", name: "Application Form", status: "verified", type: "application" },
    { id: "2", name: "ID Document", status: "verified", type: "identification" },
    { id: "3", name: "Proof of Income", status: "suspicious", type: "income" },
    { id: "4", name: "Credit Report", status: "verified", type: "credit" },
    { id: "5", name: "Background Check", status: "pending", type: "background" },
  ],
  aiInsights: [
    "Income verification shows consistent employment history",
    "Credit score indicates moderate financial stability",
    "Rent-to-income ratio is within acceptable range",
    "Possible inconsistency detected in income documentation",
    "No eviction or criminal history found",
  ],
  avatar: "https://randomuser.me/api/portraits/women/44.jpg",
}

const ApplicantDetailsScreen = ({ route, navigation }) => {
  const { applicantId } = route.params
  const [applicant, setApplicant] = useState(null)
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState("overview")

  useEffect(() => {
    // Simulate API call to fetch applicant details
    setTimeout(() => {
      setApplicant(mockApplicantDetails)
      setLoading(false)
    }, 1000)
  }, [applicantId])

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

  const getDocumentStatusIcon = (status) => {
    switch (status) {
      case "verified":
        return <Ionicons name="checkmark-circle" size={20} color="#2ECC71" />
      case "suspicious":
        return <Ionicons name="warning" size={20} color="#FFA500" />
      case "rejected":
        return <Ionicons name="close-circle" size={20} color="#E74C3C" />
      case "pending":
        return <Ionicons name="time" size={20} color="#95A5A6" />
      default:
        return <Ionicons name="document" size={20} color="#95A5A6" />
    }
  }

  const approveApplicant = () => {
    Alert.alert("Approve Applicant", "Are you sure you want to approve this applicant?", [
      {
        text: "Cancel",
        style: "cancel",
      },
      {
        text: "Approve",
        onPress: () => {
          // Update applicant status
          setApplicant({
            ...applicant,
            status: "approved",
          })

          // Simulate API call
          Alert.alert("Applicant Approved", "The applicant has been approved.")
        },
      },
    ])
  }

  const rejectApplicant = () => {
    Alert.alert("Reject Applicant", "Are you sure you want to reject this applicant?", [
      {
        text: "Cancel",
        style: "cancel",
      },
      {
        text: "Reject",
        onPress: () => {
          // Update applicant status
          setApplicant({
            ...applicant,
            status: "rejected",
          })

          // Simulate API call
          Alert.alert("Applicant Rejected", "The applicant has been rejected.")
        },
      },
    ])
  }

  const renderOverviewTab = () => (
    <View style={styles.tabContent}>
      <View style={styles.scoreSection}>
        <View style={styles.scoreCard}>
          <Text style={styles.scoreTitle}>Risk Score</Text>
          <View style={[styles.scoreBadge, { backgroundColor: getRiskScoreColor(applicant.riskScore) }]}>
            <Text style={styles.scoreValue}>{applicant.riskScore}</Text>
          </View>
          <Text style={styles.scoreDescription}>
            {applicant.riskScore >= 80 ? "Low Risk" : applicant.riskScore >= 60 ? "Moderate Risk" : "High Risk"}
          </Text>
        </View>

        <View style={styles.scoreCard}>
          <Text style={styles.scoreTitle}>Credit Score</Text>
          <View
            style={[
              styles.scoreBadge,
              {
                backgroundColor:
                  applicant.creditScore >= 700 ? "#2ECC71" : applicant.creditScore >= 600 ? "#FFA500" : "#E74C3C",
              },
            ]}
          >
            <Text style={styles.scoreValue}>{applicant.creditScore}</Text>
          </View>
          <Text style={styles.scoreDescription}>
            {applicant.creditScore >= 700 ? "Good" : applicant.creditScore >= 600 ? "Fair" : "Poor"}
          </Text>
        </View>

        <View style={styles.scoreCard}>
          <Text style={styles.scoreTitle}>Rent Ratio</Text>
          <View
            style={[
              styles.scoreBadge,
              {
                backgroundColor:
                  applicant.rentToComeRatio <= 30 ? "#2ECC71" : applicant.rentToComeRatio <= 40 ? "#FFA500" : "#E74C3C",
              },
            ]}
          >
            <Text style={styles.scoreValue}>{applicant.rentToComeRatio}%</Text>
          </View>
          <Text style={styles.scoreDescription}>
            {applicant.rentToComeRatio <= 30 ? "Good" : applicant.rentToComeRatio <= 40 ? "Fair" : "High"}
          </Text>
        </View>
      </View>

      <View style={styles.infoSection}>
        <Text style={styles.sectionTitle}>Personal Information</Text>
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Full Name:</Text>
          <Text style={styles.infoValue}>{applicant.name}</Text>
        </View>
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Email:</Text>
          <Text style={styles.infoValue}>{applicant.email}</Text>
        </View>
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Phone:</Text>
          <Text style={styles.infoValue}>{applicant.phone}</Text>
        </View>
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Property:</Text>
          <Text style={styles.infoValue}>{applicant.propertyName}</Text>
        </View>
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Applied On:</Text>
          <Text style={styles.infoValue}>{applicant.applicationDate}</Text>
        </View>
      </View>

      <View style={styles.infoSection}>
        <Text style={styles.sectionTitle}>Employment & Income</Text>
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Employment:</Text>
          <Text style={styles.infoValue}>{applicant.employmentStatus}</Text>
        </View>
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Employer:</Text>
          <Text style={styles.infoValue}>{applicant.employer}</Text>
        </View>
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Length:</Text>
          <Text style={styles.infoValue}>{applicant.employmentLength}</Text>
        </View>
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Annual Income:</Text>
          <Text style={styles.infoValue}>${applicant.income.toLocaleString()}</Text>
        </View>
      </View>

      <View style={styles.infoSection}>
        <Text style={styles.sectionTitle}>Rental History</Text>
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Previous Address:</Text>
          <Text style={styles.infoValue}>{applicant.previousAddress}</Text>
        </View>
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Previous Landlord:</Text>
          <Text style={styles.infoValue}>{applicant.previousLandlord}</Text>
        </View>
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Previous Rent:</Text>
          <Text style={styles.infoValue}>${applicant.previousRent}/month</Text>
        </View>
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Eviction History:</Text>
          <Text style={styles.infoValue}>{applicant.evictionHistory ? "Yes" : "None"}</Text>
        </View>
      </View>

      <View style={styles.infoSection}>
        <Text style={styles.sectionTitle}>Background Check</Text>
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Criminal History:</Text>
          <Text style={styles.infoValue}>{applicant.criminalHistory ? "Yes" : "None"}</Text>
        </View>
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Identity Verified:</Text>
          <Text style={styles.infoValue}>{applicant.identityVerified ? "Yes" : "No"}</Text>
        </View>
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Background Check:</Text>
          <Text
            style={[
              styles.infoValue,
              {
                color:
                  applicant.backgroundCheck === "passed"
                    ? "#2ECC71"
                    : applicant.backgroundCheck === "failed"
                      ? "#E74C3C"
                      : "#FFA500",
              },
            ]}
          >
            {applicant.backgroundCheck === "passed"
              ? "Passed"
              : applicant.backgroundCheck === "failed"
                ? "Failed"
                : "In Progress"}
          </Text>
        </View>
      </View>
    </View>
  )

  const renderDocumentsTab = () => (
    <View style={styles.tabContent}>
      {applicant.documents.map((document) => (
        <TouchableOpacity
          key={document.id}
          style={styles.documentCard}
          onPress={() => Alert.alert("View Document", `Opening ${document.name}`)}
        >
          <View style={styles.documentIcon}>
            {document.type === "application" && <Ionicons name="document-text" size={24} color="#3498DB" />}
            {document.type === "identification" && <Ionicons name="card" size={24} color="#3498DB" />}
            {document.type === "income" && <Ionicons name="cash" size={24} color="#3498DB" />}
            {document.type === "credit" && <Ionicons name="stats-chart" size={24} color="#3498DB" />}
            {document.type === "background" && <Ionicons name="shield-checkmark" size={24} color="#3498DB" />}
          </View>
          <View style={styles.documentInfo}>
            <Text style={styles.documentName}>{document.name}</Text>
            <Text style={styles.documentType}>{document.type.charAt(0).toUpperCase() + document.type.slice(1)}</Text>
          </View>
          <View style={styles.documentStatus}>
            {getDocumentStatusIcon(document.status)}
            <Text
              style={[
                styles.documentStatusText,
                {
                  color:
                    document.status === "verified"
                      ? "#2ECC71"
                      : document.status === "suspicious"
                        ? "#FFA500"
                        : document.status === "rejected"
                          ? "#E74C3C"
                          : "#95A5A6",
                },
              ]}
            >
              {document.status.charAt(0).toUpperCase() + document.status.slice(1)}
            </Text>
          </View>
        </TouchableOpacity>
      ))}
    </View>
  )

  const renderAiInsightsTab = () => (
    <View style={styles.tabContent}>
      <View style={styles.aiHeader}>
        <Ionicons name="analytics" size={24} color="#3498DB" />
        <Text style={styles.aiHeaderText}>AI-Generated Insights</Text>
      </View>

      <View style={styles.insightsList}>
        {applicant.aiInsights.map((insight, index) => (
          <View key={index} style={styles.insightItem}>
            <Ionicons
              name={
                insight.includes("inconsistency") || insight.includes("suspicious") ? "warning" : "checkmark-circle"
              }
              size={20}
              color={insight.includes("inconsistency") || insight.includes("suspicious") ? "#FFA500" : "#2ECC71"}
            />
            <Text style={styles.insightText}>{insight}</Text>
          </View>
        ))}
      </View>

      <View style={styles.aiExplanation}>
        <Text style={styles.aiExplanationTitle}>How AI Screening Works</Text>
        <Text style={styles.aiExplanationText}>
          Our AI-powered screening system analyzes applicant data across multiple dimensions:
        </Text>
        <View style={styles.aiFeatureItem}>
          <Ionicons name="document-text" size={20} color="#3498DB" />
          <Text style={styles.aiFeatureText}>Document verification and fraud detection</Text>
        </View>
        <View style={styles.aiFeatureItem}>
          <Ionicons name="cash" size={20} color="#3498DB" />
          <Text style={styles.aiFeatureText}>Income stability and rent affordability analysis</Text>
        </View>
        <View style={styles.aiFeatureItem}>
          <Ionicons name="home" size={20} color="#3498DB" />
          <Text style={styles.aiFeatureText}>Rental history and previous landlord verification</Text>
        </View>
        <View style={styles.aiFeatureItem}>
          <Ionicons name="shield-checkmark" size={20} color="#3498DB" />
          <Text style={styles.aiFeatureText}>Background check and credit score evaluation</Text>
        </View>
        <View style={styles.aiFeatureItem}>
          <Ionicons name="analytics" size={20} color="#3498DB" />
          <Text style={styles.aiFeatureText}>Comprehensive risk scoring based on all factors</Text>
        </View>
      </View>
    </View>
  )

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
            <Ionicons name="arrow-back" size={24} color="#333" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Applicant Details</Text>
          <View style={styles.placeholder} />
        </View>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#3498DB" />
          <Text style={styles.loadingText}>Loading applicant details...</Text>
        </View>
      </SafeAreaView>
    )
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color="#333" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Applicant Details</Text>
        <View style={styles.placeholder} />
      </View>

      <View style={styles.applicantHeader}>
        <Image source={{ uri: applicant.avatar }} style={styles.avatar} />
        <View style={styles.applicantInfo}>
          <Text style={styles.applicantName}>{applicant.name}</Text>
          <View style={[styles.statusBadge, { backgroundColor: getStatusColor(applicant.status) }]}>
            <Text style={styles.statusText}>
              {applicant.status.charAt(0).toUpperCase() + applicant.status.slice(1)}
            </Text>
          </View>
        </View>
      </View>

      <View style={styles.tabsContainer}>
        <TouchableOpacity
          style={[styles.tab, activeTab === "overview" && styles.activeTab]}
          onPress={() => setActiveTab("overview")}
        >
          <Text style={[styles.tabText, activeTab === "overview" && styles.activeTabText]}>Overview</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, activeTab === "documents" && styles.activeTab]}
          onPress={() => setActiveTab("documents")}
        >
          <Text style={[styles.tabText, activeTab === "documents" && styles.activeTabText]}>Documents</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, activeTab === "ai" && styles.activeTab]}
          onPress={() => setActiveTab("ai")}
        >
          <Text style={[styles.tabText, activeTab === "ai" && styles.activeTabText]}>AI Insights</Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content}>
        {activeTab === "overview" && renderOverviewTab()}
        {activeTab === "documents" && renderDocumentsTab()}
        {activeTab === "ai" && renderAiInsightsTab()}
      </ScrollView>

      {applicant.status === "screening" && (
        <View style={styles.actionButtons}>
          <TouchableOpacity style={styles.rejectButton} onPress={rejectApplicant}>
            <Text style={styles.rejectButtonText}>Reject</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.approveButton} onPress={approveApplicant}>
            <Text style={styles.approveButtonText}>Approve</Text>
          </TouchableOpacity>
        </View>
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
  placeholder: {
    width: 40,
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
  applicantHeader: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    backgroundColor: "#FFFFFF",
    borderBottomWidth: 1,
    borderBottomColor: "#E0E0E0",
  },
  avatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginRight: 16,
  },
  applicantInfo: {
    flex: 1,
  },
  applicantName: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#333333",
    marginBottom: 4,
  },
  statusBadge: {
    alignSelf: "flex-start",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  statusText: {
    fontSize: 12,
    fontWeight: "bold",
    color: "#FFFFFF",
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
  content: {
    flex: 1,
  },
  tabContent: {
    padding: 16,
  },
  scoreSection: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 16,
  },
  scoreCard: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    borderRadius: 8,
    padding: 12,
    alignItems: "center",
    marginHorizontal: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 1,
  },
  scoreTitle: {
    fontSize: 12,
    color: "#95A5A6",
    marginBottom: 8,
  },
  scoreBadge: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 8,
  },
  scoreValue: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#FFFFFF",
  },
  scoreDescription: {
    fontSize: 12,
    color: "#666666",
  },
  infoSection: {
    backgroundColor: "#FFFFFF",
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 1,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333333",
    marginBottom: 12,
  },
  infoRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: "#F0F0F0",
  },
  infoLabel: {
    fontSize: 14,
    color: "#666666",
  },
  infoValue: {
    fontSize: 14,
    fontWeight: "500",
    color: "#333333",
    flex: 1,
    textAlign: "right",
  },
  documentCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    borderRadius: 8,
    padding: 16,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 1,
  },
  documentIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#EBF5FB",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  documentInfo: {
    flex: 1,
  },
  documentName: {
    fontSize: 16,
    fontWeight: "500",
    color: "#333333",
    marginBottom: 4,
  },
  documentType: {
    fontSize: 14,
    color: "#95A5A6",
  },
  documentStatus: {
    flexDirection: "row",
    alignItems: "center",
  },
  documentStatusText: {
    fontSize: 14,
    marginLeft: 4,
  },
  aiHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
  },
  aiHeaderText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333333",
    marginLeft: 8,
  },
  insightsList: {
    backgroundColor: "#FFFFFF",
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 1,
  },
  insightItem: {
    flexDirection: "row",
    alignItems: "flex-start",
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: "#F0F0F0",
  },
  insightText: {
    fontSize: 14,
    color: "#333333",
    marginLeft: 8,
    flex: 1,
  },
  aiExplanation: {
    backgroundColor: "#FFFFFF",
    borderRadius: 8,
    padding: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 1,
  },
  aiExplanationTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333333",
    marginBottom: 8,
  },
  aiExplanationText: {
    fontSize: 14,
    color: "#666666",
    marginBottom: 12,
  },
  aiFeatureItem: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  aiFeatureText: {
    fontSize: 14,
    color: "#333333",
    marginLeft: 8,
  },
  actionButtons: {
    flexDirection: "row",
    padding: 16,
    backgroundColor: "#FFFFFF",
    borderTopWidth: 1,
    borderTopColor: "#E0E0E0",
  },
  rejectButton: {
    flex: 1,
    backgroundColor: "#F5F5F5",
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: "center",
    marginRight: 8,
  },
  rejectButtonText: {
    color: "#E74C3C",
    fontWeight: "bold",
    fontSize: 16,
  },
  approveButton: {
    flex: 1,
    backgroundColor: "#2ECC71",
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: "center",
    marginLeft: 8,
  },
  approveButtonText: {
    color: "#FFFFFF",
    fontWeight: "bold",
    fontSize: 16,
  },
})

export default ApplicantDetailsScreen

