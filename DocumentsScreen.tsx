"use client"

import { useState } from "react"
import { View, Text, StyleSheet, FlatList, TouchableOpacity, TextInput, Alert, Modal } from "react-native"
import { SafeAreaView } from "react-native-safe-area-context"
import { COLORS } from "../constants/colors"
import { Ionicons } from "@expo/vector-icons"
import Button from "../components/ui/Button"
import SearchBar from "../components/ui/SearchBar"
import Dropdown, { type DropdownItem } from "../components/ui/Dropdown"
import type { Document } from "../data/mockData"

// Mock documents
const mockDocuments: Document[] = [
  {
    id: "doc-1",
    name: "Lease Agreement - Sunset Apartments #201",
    type: "lease",
    url: "https://example.com/lease-agreement.pdf",
    uploadDate: "2023-03-15T10:00:00Z",
    expiryDate: "2024-03-15T10:00:00Z",
    category: "Lease",
  },
  {
    id: "doc-2",
    name: "Inspection Report - Riverfront Property",
    type: "other",
    url: "https://example.com/inspection-report.pdf",
    uploadDate: "2023-02-10T11:30:00Z",
    category: "Inspection",
  },
  {
    id: "doc-3",
    name: "Rent Receipt - January 2023",
    type: "receipt",
    url: "https://example.com/receipt.pdf",
    uploadDate: "2023-01-05T09:15:00Z",
    category: "Payment",
  },
  {
    id: "doc-4",
    name: "Lease Addendum - Pet Policy",
    type: "addendum",
    url: "https://example.com/pet-policy.pdf",
    uploadDate: "2023-03-20T14:45:00Z",
    category: "Lease",
  },
  {
    id: "doc-5",
    name: "Maintenance Request Form",
    type: "other",
    url: "https://example.com/maintenance-form.pdf",
    uploadDate: "2023-01-22T16:30:00Z",
    category: "Maintenance",
  },
  {
    id: "doc-6",
    name: "Notice of Entry",
    type: "notice",
    url: "https://example.com/entry-notice.pdf",
    uploadDate: "2023-02-28T13:20:00Z",
    category: "Notice",
  },
  {
    id: "doc-7",
    name: "Property Insurance Policy",
    type: "other",
    url: "https://example.com/insurance-policy.pdf",
    uploadDate: "2023-01-10T10:25:00Z",
    category: "Insurance",
  },
]

// Document categories
const documentCategories: DropdownItem[] = [
  { id: "all", label: "All Categories", value: "all" },
  { id: "lease", label: "Lease", value: "Lease" },
  { id: "payment", label: "Payment", value: "Payment" },
  { id: "maintenance", label: "Maintenance", value: "Maintenance" },
  { id: "inspection", label: "Inspection", value: "Inspection" },
  { id: "notice", label: "Notice", value: "Notice" },
  { id: "insurance", label: "Insurance", value: "Insurance" },
]

// Document types
const documentTypes: DropdownItem[] = [
  { id: "all", label: "All Types", value: "all" },
  { id: "lease", label: "Lease Agreement", value: "lease" },
  { id: "addendum", label: "Addendum", value: "addendum" },
  { id: "notice", label: "Notice", value: "notice" },
  { id: "receipt", label: "Receipt", value: "receipt" },
  { id: "other", label: "Other", value: "other" },
]

const DocumentsScreen = () => {
  const [documents, setDocuments] = useState<Document[]>(mockDocuments)
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState<string>("all")
  const [selectedType, setSelectedType] = useState<string>("all")
  const [selectedDocument, setSelectedDocument] = useState<Document | null>(null)
  const [showDocumentModal, setShowDocumentModal] = useState(false)
  const [showShareModal, setShowShareModal] = useState(false)
  const [shareEmail, setShareEmail] = useState("")

  // Filter documents based on search query, category, and type
  const filteredDocuments = documents.filter((document) => {
    const matchesSearch = document.name.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesCategory = selectedCategory === "all" || document.category === selectedCategory
    const matchesType = selectedType === "all" || document.type === selectedType

    return matchesSearch && matchesCategory && matchesType
  })

  // Handle document press
  const handleDocumentPress = (document: Document) => {
    setSelectedDocument(document)
    setShowDocumentModal(true)
  }

  // Handle document share
  const handleSharePress = () => {
    if (!selectedDocument) return

    setShowShareModal(true)
  }

  // Handle document download
  const handleDownloadPress = () => {
    if (!selectedDocument) return

    Alert.alert("Download", `Downloading ${selectedDocument.name}...`)
    // In a real app, this would download the document
    setTimeout(() => {
      Alert.alert("Success", "Document downloaded successfully")
    }, 1500)
  }

  // Handle document delete
  const handleDeletePress = () => {
    if (!selectedDocument) return

    Alert.alert("Delete Document", `Are you sure you want to delete "${selectedDocument.name}"?`, [
      {
        text: "Cancel",
        style: "cancel",
      },
      {
        text: "Delete",
        style: "destructive",
        onPress: () => {
          setDocuments((prevDocs) => prevDocs.filter((doc) => doc.id !== selectedDocument.id))
          setShowDocumentModal(false)
          setSelectedDocument(null)
          Alert.alert("Success", "Document deleted successfully")
        },
      },
    ])
  }

  // Handle document share submit
  const handleShareSubmit = () => {
    if (!selectedDocument) return

    if (!shareEmail.trim()) {
      Alert.alert("Error", "Please enter an email address")
      return
    }

    // Validate email (simple validation)
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(shareEmail)) {
      Alert.alert("Error", "Please enter a valid email address")
      return
    }

    // In a real app, this would share the document
    Alert.alert("Sharing", `Sharing ${selectedDocument.name} with ${shareEmail}...`)

    setTimeout(() => {
      Alert.alert("Success", "Document shared successfully")
      setShowShareModal(false)
      setShareEmail("")
    }, 1500)
  }

  // Format date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  }

  // Get icon for document type
  const getDocumentIcon = (type: string) => {
    switch (type) {
      case "lease":
        return "document-text"
      case "addendum":
        return "document-attach"
      case "notice":
        return "alert-circle"
      case "receipt":
        return "receipt"
      default:
        return "document"
    }
  }

  // Get color for document type
  const getDocumentColor = (type: string) => {
    switch (type) {
      case "lease":
        return COLORS.primary
      case "addendum":
        return COLORS.secondary
      case "notice":
        return COLORS.warning
      case "receipt":
        return COLORS.success
      default:
        return COLORS.info
    }
  }

  // Render document item
  const renderDocumentItem = ({ item }: { item: Document }) => (
    <TouchableOpacity style={styles.documentItem} onPress={() => handleDocumentPress(item)}>
      <View style={styles.documentIcon}>
        <Ionicons name={getDocumentIcon(item.type)} size={24} color={getDocumentColor(item.type)} />
      </View>
      <View style={styles.documentInfo}>
        <Text style={styles.documentName}>{item.name}</Text>
        <View style={styles.documentMeta}>
          <Text style={styles.documentCategory}>{item.category}</Text>
          <Text style={styles.documentDate}>Uploaded: {formatDate(item.uploadDate)}</Text>
          {item.expiryDate && <Text style={styles.documentDate}>Expires: {formatDate(item.expiryDate)}</Text>}
        </View>
      </View>
    </TouchableOpacity>
  )

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Documents</Text>
        <Button
          title="Upload"
          type="primary"
          size="small"
          icon={<Ionicons name="cloud-upload" size={16} color={COLORS.white} style={styles.buttonIcon} />}
          onPress={() => Alert.alert("Upload", "This would open a document picker in a real app")}
        />
      </View>

      <View style={styles.filtersContainer}>
        <SearchBar value={searchQuery} onChangeText={setSearchQuery} placeholder="Search documents..." />

        <View style={styles.dropdownRow}>
          <View style={styles.dropdown}>
            <Dropdown
              label="Category"
              items={documentCategories}
              selectedValue={selectedCategory}
              onSelect={(item) => setSelectedCategory(item.value)}
              placeholder="Select category"
            />
          </View>

          <View style={styles.dropdown}>
            <Dropdown
              label="Type"
              items={documentTypes}
              selectedValue={selectedType}
              onSelect={(item) => setSelectedType(item.value)}
              placeholder="Select type"
            />
          </View>
        </View>
      </View>

      <FlatList
        data={filteredDocuments}
        renderItem={renderDocumentItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Ionicons name="document" size={48} color={COLORS.gray} />
            <Text style={styles.emptyText}>No documents found</Text>
          </View>
        }
      />

      {/* Document Details Modal */}
      <Modal
        visible={showDocumentModal}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setShowDocumentModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Document Details</Text>
              <TouchableOpacity
                onPress={() => setShowDocumentModal(false)}
                hitSlop={{ top: 10, right: 10, bottom: 10, left: 10 }}
              >
                <Ionicons name="close" size={24} color={COLORS.gray} />
              </TouchableOpacity>
            </View>

            {selectedDocument && (
              <View style={styles.modalBody}>
                <View style={styles.documentDetails}>
                  <Text style={styles.documentDetailTitle}>Name</Text>
                  <Text style={styles.documentDetailText}>{selectedDocument.name}</Text>
                </View>

                <View style={styles.documentDetails}>
                  <Text style={styles.documentDetailTitle}>Category</Text>
                  <Text style={styles.documentDetailText}>{selectedDocument.category}</Text>
                </View>

                <View style={styles.documentDetails}>
                  <Text style={styles.documentDetailTitle}>Type</Text>
                  <Text style={styles.documentDetailText}>
                    {documentTypes.find((t) => t.value === selectedDocument.type)?.label || selectedDocument.type}
                  </Text>
                </View>

                <View style={styles.documentDetails}>
                  <Text style={styles.documentDetailTitle}>Upload Date</Text>
                  <Text style={styles.documentDetailText}>{formatDate(selectedDocument.uploadDate)}</Text>
                </View>

                {selectedDocument.expiryDate && (
                  <View style={styles.documentDetails}>
                    <Text style={styles.documentDetailTitle}>Expiry Date</Text>
                    <Text style={styles.documentDetailText}>{formatDate(selectedDocument.expiryDate)}</Text>
                  </View>
                )}

                <View style={styles.documentActions}>
                  <Button
                    title="View"
                    type="primary"
                    onPress={() => Alert.alert("View", `Viewing ${selectedDocument.name}`)}
                    icon={<Ionicons name="eye" size={18} color={COLORS.white} style={styles.buttonIcon} />}
                    style={styles.actionButton}
                  />

                  <Button
                    title="Download"
                    type="outline"
                    onPress={handleDownloadPress}
                    icon={<Ionicons name="download" size={18} color={COLORS.primary} style={styles.buttonIcon} />}
                    style={styles.actionButton}
                  />

                  <Button
                    title="Share"
                    type="outline"
                    onPress={handleSharePress}
                    icon={<Ionicons name="share" size={18} color={COLORS.primary} style={styles.buttonIcon} />}
                    style={styles.actionButton}
                  />

                  <Button
                    title="Delete"
                    type="danger"
                    onPress={handleDeletePress}
                    icon={<Ionicons name="trash" size={18} color={COLORS.white} style={styles.buttonIcon} />}
                    style={styles.actionButton}
                  />
                </View>
              </View>
            )}
          </View>
        </View>
      </Modal>

      {/* Share Modal */}
      <Modal
        visible={showShareModal}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setShowShareModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContent, styles.shareModalContent]}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Share Document</Text>
              <TouchableOpacity
                onPress={() => setShowShareModal(false)}
                hitSlop={{ top: 10, right: 10, bottom: 10, left: 10 }}
              >
                <Ionicons name="close" size={24} color={COLORS.gray} />
              </TouchableOpacity>
            </View>

            <View style={styles.modalBody}>
              <Text style={styles.shareText}>Enter email address to share "{selectedDocument?.name}"</Text>

              <TextInput
                style={styles.shareInput}
                value={shareEmail}
                onChangeText={setShareEmail}
                placeholder="Email address"
                keyboardType="email-address"
                autoCapitalize="none"
              />

              <View style={styles.shareActions}>
                <Button
                  title="Cancel"
                  type="outline"
                  onPress={() => setShowShareModal(false)}
                  style={styles.shareButton}
                />

                <Button title="Share" type="primary" onPress={handleShareSubmit} style={styles.shareButton} />
              </View>
            </View>
          </View>
        </View>
      </Modal>
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
    borderBottomWidth: 1,
    borderBottomColor: COLORS.lightGray,
    backgroundColor: COLORS.white,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: COLORS.darkGray,
  },
  buttonIcon: {
    marginRight: 8,
  },
  filtersContainer: {
    padding: 16,
    backgroundColor: COLORS.white,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.lightGray,
  },
  dropdownRow: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  dropdown: {
    width: "48%",
  },
  listContent: {
    padding: 16,
  },
  documentItem: {
    flexDirection: "row",
    backgroundColor: COLORS.white,
    borderRadius: 8,
    padding: 16,
    marginBottom: 12,
    elevation: 2,
    shadowColor: COLORS.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  documentIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: COLORS.lightGray,
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
    color: COLORS.darkGray,
    marginBottom: 4,
  },
  documentMeta: {
    flexDirection: "column",
  },
  documentCategory: {
    fontSize: 14,
    color: COLORS.primary,
    marginBottom: 2,
  },
  documentDate: {
    fontSize: 12,
    color: COLORS.gray,
  },
  emptyContainer: {
    alignItems: "center",
    justifyContent: "center",
    padding: 40,
  },
  emptyText: {
    fontSize: 16,
    color: COLORS.gray,
    marginTop: 12,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    width: "90%",
    maxHeight: "80%",
    backgroundColor: COLORS.white,
    borderRadius: 12,
    overflow: "hidden",
  },
  shareModalContent: {
    height: 240,
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.lightGray,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: COLORS.darkGray,
  },
  modalBody: {
    padding: 16,
  },
  documentDetails: {
    marginBottom: 16,
  },
  documentDetailTitle: {
    fontSize: 14,
    color: COLORS.gray,
    marginBottom: 4,
  },
  documentDetailText: {
    fontSize: 16,
    color: COLORS.darkGray,
  },
  documentActions: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    marginTop: 16,
  },
  actionButton: {
    width: "48%",
    marginBottom: 12,
  },
  shareText: {
    fontSize: 16,
    color: COLORS.darkGray,
    marginBottom: 16,
  },
  shareInput: {
    borderWidth: 1,
    borderColor: COLORS.gray,
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    marginBottom: 16,
  },
  shareActions: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  shareButton: {
    width: "48%",
  },
})

export default DocumentsScreen

