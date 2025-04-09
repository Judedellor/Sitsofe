"use client"

import { useState, useEffect } from "react"
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, ActivityIndicator, Alert, Share } from "react-native"
import { SafeAreaView } from "react-native-safe-area-context"
import { COLORS } from "../constants/colors"
import { Ionicons } from "@expo/vector-icons"
import { useNavigation, useRoute } from "@react-navigation/native"
import { useAuth } from "../context/AuthContext"
import * as WebBrowser from "expo-web-browser"

// Document types and statuses (same as in DocumentsScreen)
const DOCUMENT_TYPES = {
  LEASE: "lease",
  ADDENDUM: "addendum",
  INSPECTION: "inspection",
  NOTICE: "notice",
  RECEIPT: "receipt",
  OTHER: "other",
}

const DOCUMENT_STATUSES = {
  DRAFT: "draft",
  PENDING_SIGNATURE: "pending_signature",
  SIGNED: "signed",
  EXPIRED: "expired",
  ARCHIVED: "archived",
}

// Mock document data (same as in DocumentsScreen)
const mockDocuments = [
  {
    id: "1",
    title: "Lease Agreement - Sunset Villa",
    type: DOCUMENT_TYPES.LEASE,
    status: DOCUMENT_STATUSES.SIGNED,
    createdAt: "2023-05-15T10:30:00Z",
    updatedAt: "2023-05-20T14:45:00Z",
    expiresAt: "2024-05-14T23:59:59Z",
    propertyId: "1",
    propertyName: "Sunset Villa",
    tenantId: "1",
    tenantName: "John Doe",
    fileUrl: "https://example.com/documents/lease-1.pdf",
    fileSize: 2.4, // MB
    signedByOwner: true,
    signedByTenant: true,
    description:
      "Standard lease agreement for Sunset Villa property. Includes terms for rent, security deposit, maintenance responsibilities, and other standard clauses.",
    signingHistory: [
      {
        id: "1",
        userId: "owner1",
        userName: "Property Owner",
        action: "created",
        timestamp: "2023-05-15T10:30:00Z",
      },
      {
        id: "2",
        userId: "owner1",
        userName: "Property Owner",
        action: "signed",
        timestamp: "2023-05-15T10:35:00Z",
      },
      {
        id: "3",
        userId: "1",
        userName: "John Doe",
        action: "viewed",
        timestamp: "2023-05-18T09:20:00Z",
      },
      {
        id: "4",
        userId: "1",
        userName: "John Doe",
        action: "signed",
        timestamp: "2023-05-20T14:45:00Z",
      },
    ],
  },
  // ... other documents from the previous screen
]

const DocumentDetailScreen = () => {
  const navigation = useNavigation()
  const route = useRoute()
  const { documentId } = route.params || {}
  const { user, hasPermission } = useAuth()

  const [document, setDocument] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isDownloading, setIsDownloading] = useState(false)

  // Load document details
  useEffect(() => {
    const loadDocument = async () => {
      try {
        // In a real app, you would fetch from your API
        await new Promise((resolve) => setTimeout(resolve, 800)) // Simulate API call

        const foundDocument = mockDocuments.find((doc) => doc.id === documentId)

        if (!foundDocument) {
          Alert.alert("Error", "Document not found")
          navigation.goBack()
          return
        }

        setDocument(foundDocument)
      } catch (error) {
        console.error("Error loading document:", error)
        Alert.alert("Error", "Failed to load document details. Please try again.")
      } finally {
        setIsLoading(false)
      }
    }

    loadDocument()
  }, [documentId, navigation])

  // Get document type icon
  const getDocumentTypeIcon = (type) => {
    switch (type) {
      case DOCUMENT_TYPES.LEASE:
        return "document-text"
      case DOCUMENT_TYPES.ADDENDUM:
        return "add-circle"
      case DOCUMENT_TYPES.INSPECTION:
        return "checkmark-circle"
      case DOCUMENT_TYPES.NOTICE:
        return "alert-circle"
      case DOCUMENT_TYPES.RECEIPT:
        return "receipt"
      default:
        return "document"
    }
  }

  // Get document status color
  const getStatusColor = (status) => {
    switch (status) {
      case DOCUMENT_STATUSES.SIGNED:
        return COLORS.success
      case DOCUMENT_STATUSES.PENDING_SIGNATURE:
        return COLORS.warning
      case DOCUMENT_STATUSES.DRAFT:
        return COLORS.gray
      case DOCUMENT_STATUSES.EXPIRED:
        return COLORS.error
      case DOCUMENT_STATUSES.ARCHIVED:
        return COLORS.darkGray
      default:
        return COLORS.gray
    }
  }

  // Format date
  const formatDate = (dateString) => {
    if (!dateString) return "N/A"

    const date = new Date(dateString)
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  // Handle document download
  const handleDownload = async () => {
    if (!document?.fileUrl) {
      Alert.alert("Error", "Document URL not available")
      return
    }

    try {
      setIsDownloading(true)

      // In a real app, you would download the file from the actual URL
      // For this example, we'll simulate a download
      await new Promise((resolve) => setTimeout(resolve, 1500)) // Simulate download

      Alert.alert("Success", "Document downloaded successfully")
    } catch (error) {
      console.error("Error downloading document:", error)
      Alert.alert("Error", "Failed to download document. Please try again.")
    } finally {
      setIsDownloading(false)
    }
  }

  // Handle document sharing
  const handleShare = async () => {
    try {
      const result = await Share.share({
        title: document.title,
        message: `Check out this document: ${document.title}`,
        url: document.fileUrl, // Only works on iOS
      })

      if (result.action === Share.sharedAction) {
        if (result.activityType) {
          // Shared with activity type of result.activityType
          console.log(`Shared with ${result.activityType}`)
        } else {
          // Shared
          console.log("Shared successfully")
        }
      } else if (result.action === Share.dismissedAction) {
        // Dismissed
        console.log("Share dismissed")
      }
    } catch (error) {
      console.error("Error sharing document:", error)
      Alert.alert("Error", "Failed to share document. Please try again.")
    }
  }

  // Handle document viewing
  const handleViewDocument = async () => {
    try {
      // In a real app, you would open the actual document URL
      await WebBrowser.openBrowserAsync(document.fileUrl)
    } catch (error) {
      console.error("Error opening document:", error)
      Alert.alert("Error", "Failed to open document. Please try again.")
    }
  }

  // Handle document signing
  const handleSignDocument = () => {
    // In a real app, you would navigate to a signing screen or initiate a signing process
    navigation.navigate("SignDocument", { documentId: document.id })
  }

  // Check if user can sign the document
  const canSignDocument = () => {
    if (!document || document.status !== DOCUMENT_STATUSES.PENDING_SIGNATURE) {
      return false
    }

    if (user?.role === "tenant" && document.tenantId === user.id && !document.signedByTenant) {
      return true
    }

    if ((user?.role === "property_manager" || user?.role === "admin") && !document.signedByOwner) {
      return true
    }

    return false
  }

  if (isLoading) {
    return (
      <SafeAreaView style={styles.container} edges={["top"]}>
        <View style={styles.header}>
          <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
            <Ionicons name="arrow-back" size={24} color={COLORS.darkGray} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Document Details</Text>
          <View style={styles.placeholder} />
        </View>

        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={COLORS.primary} />
          <Text style={styles.loadingText}>Loading document details...</Text>
        </View>
      </SafeAreaView>
    )
  }

  if (!document) {
    return (
      <SafeAreaView style={styles.container} edges={["top"]}>
        <View style={styles.header}>
          <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
            <Ionicons name="arrow-back" size={24} color={COLORS.darkGray} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Document Details</Text>
          <View style={styles.placeholder} />
        </View>

        <View style={styles.errorContainer}>
          <Ionicons name="alert-circle-outline" size={64} color={COLORS.error} />
          <Text style={styles.errorTitle}>Document Not Found</Text>
          <Text style={styles.errorText}>The document you're looking for doesn't exist or has been removed.</Text>
        </View>
      </SafeAreaView>
    )
  }

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color={COLORS.darkGray} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Document Details</Text>

        <TouchableOpacity style={styles.headerButton} onPress={handleShare}>
          <Ionicons name="share-outline" size={24} color={COLORS.primary} />
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content}>
        <View style={styles.documentHeader}>
          <View style={styles.documentTypeContainer}>
            <View style={[styles.documentTypeIcon, { backgroundColor: COLORS.primaryLight }]}>
              <Ionicons name={getDocumentTypeIcon(document.type)} size={24} color={COLORS.primary} />
            </View>
            <View style={styles.documentInfo}>
              <Text style={styles.documentTitle}>{document.title}</Text>
              <View style={styles.documentMeta}>
                <Text style={styles.documentProperty}>{document.propertyName}</Text>
                <Text style={styles.documentDot}>•</Text>
                <Text style={styles.documentTenant}>{document.tenantName}</Text>
              </View>
            </View>
          </View>

          <View style={[styles.statusBadge, { backgroundColor: getStatusColor(document.status) }]}>
            <Text style={styles.statusText}>
              {document.status.replace("_", " ").replace(/\b\w/g, (l) => l.toUpperCase())}
            </Text>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Document Information</Text>

          <View style={styles.infoItem}>
            <Text style={styles.infoLabel}>Document Type:</Text>
            <Text style={styles.infoValue}>{document.type.charAt(0).toUpperCase() + document.type.slice(1)}</Text>
          </View>

          <View style={styles.infoItem}>
            <Text style={styles.infoLabel}>Created:</Text>
            <Text style={styles.infoValue}>{formatDate(document.createdAt)}</Text>
          </View>

          <View style={styles.infoItem}>
            <Text style={styles.infoLabel}>Last Updated:</Text>
            <Text style={styles.infoValue}>{formatDate(document.updatedAt)}</Text>
          </View>

          {document.expiresAt && (
            <View style={styles.infoItem}>
              <Text style={styles.infoLabel}>Expires:</Text>
              <Text style={styles.infoValue}>{formatDate(document.expiresAt)}</Text>
            </View>
          )}

          <View style={styles.infoItem}>
            <Text style={styles.infoLabel}>File Size:</Text>
            <Text style={styles.infoValue}>{document.fileSize} MB</Text>
          </View>
        </View>

        {document.description && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Description</Text>
            <Text style={styles.descriptionText}>{document.description}</Text>
          </View>
        )}

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Signatures</Text>

          <View style={styles.signatureContainer}>
            <View style={styles.signatureItem}>
              <View style={styles.signatureStatus}>
                {document.signedByOwner ? (
                  <Ionicons name="checkmark-circle" size={24} color={COLORS.success} />
                ) : (
                  <Ionicons name="ellipse-outline" size={24} color={COLORS.gray} />
                )}
              </View>
              <View style={styles.signatureInfo}>
                <Text style={styles.signatureName}>Property Owner</Text>
                <Text style={styles.signatureDate}>
                  {document.signedByOwner
                    ? `Signed on ${formatDate(document.signingHistory.find((h) => h.action === "signed" && h.userId === "owner1")?.timestamp)}`
                    : "Not signed yet"}
                </Text>
              </View>
            </View>

            <View style={styles.signatureItem}>
              <View style={styles.signatureStatus}>
                {document.signedByTenant ? (
                  <Ionicons name="checkmark-circle" size={24} color={COLORS.success} />
                ) : (
                  <Ionicons name="ellipse-outline" size={24} color={COLORS.gray} />
                )}
              </View>
              <View style={styles.signatureInfo}>
                <Text style={styles.signatureName}>{document.tenantName}</Text>
                <Text style={styles.signatureDate}>
                  {document.signedByTenant
                    ? `Signed on ${formatDate(document.signingHistory.find((h) => h.action === "signed" && h.userId === document.tenantId)?.timestamp)}`
                    : "Not signed yet"}
                </Text>
              </View>
            </View>
          </View>
        </View>

        {document.signingHistory && document.signingHistory.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Activity History</Text>

            {document.signingHistory.map((activity, index) => (
              <View key={activity.id} style={styles.activityItem}>
                <View style={styles.activityDot} />
                <View style={styles.activityInfo}>
                  <Text style={styles.activityText}>
                    <Text style={styles.activityName}>{activity.userName}</Text>{" "}
                    {activity.action === "created" && "created this document"}
                    {activity.action === "signed" && "signed this document"}
                    {activity.action === "viewed" && "viewed this document"}
                  </Text>
                  <Text style={styles.activityDate}>{formatDate(activity.timestamp)}</Text>
                </View>
              </View>
            ))}
          </View>
        )}

        <View style={styles.actionButtons}>
          <TouchableOpacity style={[styles.actionButton, styles.viewButton]} onPress={handleViewDocument}>
            <Ionicons name="eye-outline" size={20} color={COLORS.white} />
            <Text style={styles.actionButtonText}>View</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.actionButton, styles.downloadButton, isDownloading && styles.disabledButton]}
            onPress={handleDownload}
            disabled={isDownloading}
          >
            {isDownloading ? (
              <ActivityIndicator size="small" color={COLORS.white} />
            ) : (
              <>
                <Ionicons name="download-outline" size={20} color={COLORS.white} />
                <Text style={styles.actionButtonText}>Download</Text>
              </>
            )}
          </TouchableOpacity>

          {canSignDocument() && (
            <TouchableOpacity style={[styles.actionButton, styles.signButton]} onPress={handleSignDocument}>
              <Ionicons name="create-outline" size={20} color={COLORS.white} />
              <Text style={styles.actionButtonText}>Sign</Text>
            </TouchableOpacity>
          )}
        </View>
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
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: COLORS.white,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.lightGray,
  },
  backButton: {
    padding: 4,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: COLORS.darkGray,
  },
  headerButton: {
    padding: 4,
  },
  placeholder: {
    width: 32,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: COLORS.gray,
  },
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 24,
  },
  errorTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: COLORS.darkGray,
    marginTop: 16,
    marginBottom: 8,
  },
  errorText: {
    fontSize: 16,
    color: COLORS.gray,
    textAlign: "center",
  },
  content: {
    flex: 1,
    padding: 16,
  },
  documentHeader: {
    backgroundColor: COLORS.white,
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  documentTypeContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  documentTypeIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 16,
  },
  documentInfo: {
    flex: 1,
  },
  documentTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: COLORS.darkGray,
    marginBottom: 4,
  },
  documentMeta: {
    flexDirection: "row",
    alignItems: "center",
  },
  documentProperty: {
    fontSize: 14,
    color: COLORS.gray,
  },
  documentDot: {
    fontSize: 14,
    color: COLORS.gray,
    marginHorizontal: 4,
  },
  documentTenant: {
    fontSize: 14,
    color: COLORS.gray,
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 4,
    alignSelf: "flex-start",
  },
  statusText: {
    fontSize: 12,
    color: COLORS.white,
    fontWeight: "500",
  },
  section: {
    backgroundColor: COLORS.white,
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
    fontSize: 16,
    fontWeight: "bold",
    color: COLORS.darkGray,
    marginBottom: 12,
  },
  infoItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  infoLabel: {
    fontSize: 14,
    color: COLORS.gray,
  },
  infoValue: {
    fontSize: 14,
    fontWeight: "500",
    color: COLORS.darkGray,
    textAlign: "right",
    flex: 1,
    marginLeft: 16,
  },
  descriptionText: {
    fontSize: 14,
    color: COLORS.darkGray,
    lineHeight: 20,
  },
  signatureContainer: {
    marginTop: 8,
  },
  signatureItem: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
  },
  signatureStatus: {
    marginRight: 16,
  },
  signatureInfo: {
    flex: 1,
  },
  signatureName: {
    fontSize: 16,
    fontWeight: "500",
    color: COLORS.darkGray,
    marginBottom: 2,
  },
  signatureDate: {
    fontSize: 14,
    color: COLORS.gray,
  },
  activityItem: {
    flexDirection: "row",
    marginBottom: 16,
  },
  activityDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: COLORS.primary,
    marginRight: 12,
    marginTop: 4,
  },
  activityInfo: {
    flex: 1,
  },
  activityText: {
    fontSize: 14,
    color: COLORS.darkGray,
    marginBottom: 2,
  },
  activityName: {
    fontWeight: "500",
  },
  activityDate: {
    fontSize: 12,
    color: COLORS.gray,
  },
  actionButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 24,
  },
  actionButton: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 12,
    borderRadius: 8,
    marginHorizontal: 4,
  },
  viewButton: {
    backgroundColor: COLORS.primary,
  },
  downloadButton: {
    backgroundColor: COLORS.success,
  },
  signButton: {
    backgroundColor: COLORS.warning,
  },
  disabledButton: {
    opacity: 0.7,
  },
  actionButtonText: {
    color: COLORS.white,
    fontWeight: "600",
    marginLeft: 8,
  },
})

export default DocumentDetailScreen

