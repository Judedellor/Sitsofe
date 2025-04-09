"use client"

import { useState, useEffect } from "react"
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from "react-native"
import { SafeAreaView } from "react-native-safe-area-context"
import { Ionicons } from "@expo/vector-icons"
import { useNavigation, useRoute } from "@react-navigation/native"
import { COLORS } from "../constants/colors"
import Card from "../components/ui/Card"
import Button from "../components/ui/Button"

// Mock compliance item data
const complianceItemData = {
  "1": {
    id: "1",
    title: "Annual Fire Inspection",
    description:
      "Comprehensive inspection of all fire safety systems including alarms, sprinklers, extinguishers, and evacuation routes.",
    property: "Modern Luxury Apartment",
    category: "Fire Safety",
    dueDate: "2024-04-15",
    status: "upcoming",
    daysRemaining: 7,
    assignedTo: "John Smith",
    frequency: "Annual",
    lastCompleted: "2023-04-12",
    documents: [
      {
        id: "doc1",
        name: "Previous Fire Inspection Report.pdf",
        type: "PDF",
        size: "2.4 MB",
        uploadDate: "2023-04-15",
      },
      {
        id: "doc2",
        name: "Fire Safety Checklist.docx",
        type: "DOCX",
        size: "1.2 MB",
        uploadDate: "2023-04-15",
      },
    ],
    notes: [
      {
        id: "note1",
        text: "Scheduled with City Fire Department for April 15, 2024 at 10:00 AM",
        date: "2024-03-20",
        user: "Sarah Johnson",
      },
      {
        id: "note2",
        text: "Reminder: Need to ensure all fire extinguishers are properly tagged and up to date",
        date: "2024-03-25",
        user: "John Smith",
      },
    ],
    history: [
      {
        id: "hist1",
        action: "Created",
        date: "2023-01-15",
        user: "Sarah Johnson",
      },
      {
        id: "hist2",
        action: "Completed",
        date: "2023-04-12",
        user: "John Smith",
      },
      {
        id: "hist3",
        action: "Scheduled",
        date: "2024-03-20",
        user: "Sarah Johnson",
      },
    ],
    requirements: [
      "All fire extinguishers must be properly tagged and inspected",
      "Sprinkler system must be fully operational",
      "Fire alarm system must be tested and functional",
      "Emergency lighting must be operational",
      "Evacuation routes must be clear and properly marked",
    ],
  },
  "6": {
    id: "6",
    title: "ADA Compliance Audit",
    description:
      "Comprehensive audit of property accessibility features to ensure compliance with Americans with Disabilities Act requirements.",
    property: "Modern Luxury Apartment",
    category: "Accessibility",
    dueDate: "2024-03-30",
    status: "overdue",
    daysOverdue: 8,
    assignedTo: "Michael Brown",
    frequency: "Annual",
    lastCompleted: "2023-03-25",
    documents: [
      {
        id: "doc1",
        name: "Previous ADA Audit Report.pdf",
        type: "PDF",
        size: "3.1 MB",
        uploadDate: "2023-03-28",
      },
      {
        id: "doc2",
        name: "ADA Compliance Checklist.docx",
        type: "DOCX",
        size: "1.5 MB",
        uploadDate: "2023-03-28",
      },
    ],
    notes: [
      {
        id: "note1",
        text: "Need to schedule with ADA compliance consultant",
        date: "2024-02-15",
        user: "Sarah Johnson",
      },
      {
        id: "note2",
        text: "Attempted to contact consultant, waiting for response",
        date: "2024-03-01",
        user: "Michael Brown",
      },
      {
        id: "note3",
        text: "Consultant unavailable until April 10, need to request extension",
        date: "2024-03-15",
        user: "Michael Brown",
      },
    ],
    history: [
      {
        id: "hist1",
        action: "Created",
        date: "2023-01-10",
        user: "Sarah Johnson",
      },
      {
        id: "hist2",
        action: "Completed",
        date: "2023-03-25",
        user: "Michael Brown",
      },
      {
        id: "hist3",
        action: "Scheduled",
        date: "2024-02-15",
        user: "Sarah Johnson",
      },
    ],
    requirements: [
      "Accessible entrances and exits",
      "Proper door width and threshold heights",
      "Accessible parking spaces with proper signage",
      "Accessible routes throughout common areas",
      "Accessible bathrooms in common areas",
      "Proper signage with braille",
    ],
  },
}

const ComplianceDetailScreen = () => {
  const navigation = useNavigation()
  const route = useRoute()
  const { itemId } = route.params || {}
  const [item, setItem] = useState(null)
  const [activeTab, setActiveTab] = useState("details")

  useEffect(() => {
    if (itemId && complianceItemData[itemId]) {
      setItem(complianceItemData[itemId])
    }
  }, [itemId])

  if (!item) {
    return (
      <SafeAreaView style={styles.container} edges={["top"]}>
        <View style={styles.header}>
          <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
            <Ionicons name="arrow-back" size={24} color={COLORS.darkGray} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Compliance Detail</Text>
          <View style={{ width: 40 }} />
        </View>
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>Loading...</Text>
        </View>
      </SafeAreaView>
    )
  }

  // Format date
  const formatDate = (dateString) => {
    const options = { year: "numeric", month: "short", day: "numeric" }
    return new Date(dateString).toLocaleDateString(undefined, options)
  }

  // Get status color
  const getStatusColor = (status) => {
    switch (status) {
      case "completed":
        return COLORS.success
      case "upcoming":
        return COLORS.warning
      case "overdue":
        return COLORS.error
      default:
        return COLORS.gray
    }
  }

  // Get document icon
  const getDocumentIcon = (type) => {
    switch (type) {
      case "PDF":
        return "document-text"
      case "DOCX":
        return "document"
      case "XLSX":
        return "grid"
      case "JPG":
      case "PNG":
        return "image"
      default:
        return "document"
    }
  }

  // Render details tab
  const renderDetailsTab = () => (
    <>
      <Card title="General Information" elevated>
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Property:</Text>
          <Text style={styles.infoValue}>{item.property}</Text>
        </View>
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Category:</Text>
          <Text style={styles.infoValue}>{item.category}</Text>
        </View>
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Due Date:</Text>
          <Text style={styles.infoValue}>{formatDate(item.dueDate)}</Text>
        </View>
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Status:</Text>
          <View style={[styles.statusBadge, { backgroundColor: getStatusColor(item.status) }]}>
            <Text style={styles.statusText}>
              {item.status === "overdue"
                ? `Overdue (${item.daysOverdue} days)`
                : item.status === "upcoming"
                  ? `Due in ${item.daysRemaining} days`
                  : "Completed"}
            </Text>
          </View>
        </View>
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Assigned To:</Text>
          <Text style={styles.infoValue}>{item.assignedTo}</Text>
        </View>
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Frequency:</Text>
          <Text style={styles.infoValue}>{item.frequency}</Text>
        </View>
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Last Completed:</Text>
          <Text style={styles.infoValue}>{formatDate(item.lastCompleted)}</Text>
        </View>
      </Card>

      <Card title="Description" elevated>
        <Text style={styles.description}>{item.description}</Text>
      </Card>

      <Card title="Requirements" elevated>
        {item.requirements.map((requirement, index) => (
          <View key={index} style={styles.requirementItem}>
            <View style={styles.bulletPoint} />
            <Text style={styles.requirementText}>{requirement}</Text>
          </View>
        ))}
      </Card>

      <View style={styles.actionButtons}>
        {item.status === "overdue" || item.status === "upcoming" ? (
          <Button
            title="Mark as Completed"
            onPress={() => navigation.navigate("CompleteComplianceItem" as never, { itemId: item.id })}
            type="primary"
            style={styles.actionButton}
          />
        ) : (
          <Button
            title="View Completion Details"
            onPress={() => navigation.navigate("ComplianceCompletionDetails" as never, { itemId: item.id })}
            type="outline"
            style={styles.actionButton}
          />
        )}
        <Button
          title="Edit"
          onPress={() => navigation.navigate("EditComplianceItem" as never, { itemId: item.id })}
          type="secondary"
          style={styles.actionButton}
        />
      </View>
    </>
  )

  // Render documents tab
  const renderDocumentsTab = () => (
    <>
      <Card title="Documents" elevated>
        {item.documents.length === 0 ? (
          <Text style={styles.noContentText}>No documents available</Text>
        ) : (
          item.documents.map((doc) => (
            <TouchableOpacity key={doc.id} style={styles.documentItem}>
              <View style={styles.documentIcon}>
                <Ionicons name={getDocumentIcon(doc.type)} size={24} color={COLORS.primary} />
              </View>
              <View style={styles.documentInfo}>
                <Text style={styles.documentName}>{doc.name}</Text>
                <Text style={styles.documentMeta}>
                  {doc.type} • {doc.size}
                </Text>
                <Text style={styles.documentDate}>Uploaded: {formatDate(doc.uploadDate)}</Text>
              </View>
              <TouchableOpacity style={styles.documentDownload}>
                <Ionicons name="download-outline" size={24} color={COLORS.primary} />
              </TouchableOpacity>
            </TouchableOpacity>
          ))
        )}
      </Card>

      <Button
        title="Upload Document"
        onPress={() => navigation.navigate("UploadComplianceDocument" as never, { itemId: item.id })}
        type="primary"
        icon={<Ionicons name="cloud-upload-outline" size={20} color={COLORS.white} />}
        style={styles.uploadButton}
      />
    </>
  )

  // Render notes tab
  const renderNotesTab = () => (
    <>
      <Card title="Notes" elevated>
        {item.notes.length === 0 ? (
          <Text style={styles.noContentText}>No notes available</Text>
        ) : (
          item.notes.map((note) => (
            <View key={note.id} style={styles.noteItem}>
              <Text style={styles.noteText}>{note.text}</Text>
              <View style={styles.noteMeta}>
                <Text style={styles.noteUser}>{note.user}</Text>
                <Text style={styles.noteDate}>{formatDate(note.date)}</Text>
              </View>
            </View>
          ))
        )}
      </Card>

      <Button
        title="Add Note"
        onPress={() => navigation.navigate("AddComplianceNote" as never, { itemId: item.id })}
        type="primary"
        icon={<Ionicons name="add-circle-outline" size={20} color={COLORS.white} />}
        style={styles.addNoteButton}
      />
    </>
  )

  // Render history tab
  const renderHistoryTab = () => (
    <Card title="Audit Trail" elevated>
      {item.history.length === 0 ? (
        <Text style={styles.noContentText}>No history available</Text>
      ) : (
        <View style={styles.timelineContainer}>
          {item.history.map((event, index) => (
            <View key={event.id} style={styles.timelineItem}>
              <View style={styles.timelineLine} />
              <View style={styles.timelineDot} />
              <View style={styles.timelineContent}>
                <Text style={styles.timelineAction}>{event.action}</Text>
                <Text style={styles.timelineDate}>{formatDate(event.date)}</Text>
                <Text style={styles.timelineUser}>{event.user}</Text>
              </View>
            </View>
          ))}
        </View>
      )}
    </Card>
  )

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color={COLORS.darkGray} />
        </TouchableOpacity>
        <Text style={styles.headerTitle} numberOfLines={1}>
          {item.title}
        </Text>
        <TouchableOpacity style={styles.moreButton}>
          <Ionicons name="ellipsis-vertical" size={24} color={COLORS.darkGray} />
        </TouchableOpacity>
      </View>

      <View style={styles.tabsContainer}>
        <TouchableOpacity
          style={[styles.tab, activeTab === "details" && styles.activeTab]}
          onPress={() => setActiveTab("details")}
        >
          <Text style={[styles.tabText, activeTab === "details" && styles.activeTabText]}>Details</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, activeTab === "documents" && styles.activeTab]}
          onPress={() => setActiveTab("documents")}
        >
          <Text style={[styles.tabText, activeTab === "documents" && styles.activeTabText]}>Documents</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, activeTab === "notes" && styles.activeTab]}
          onPress={() => setActiveTab("notes")}
        >
          <Text style={[styles.tabText, activeTab === "notes" && styles.activeTabText]}>Notes</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, activeTab === "history" && styles.activeTab]}
          onPress={() => setActiveTab("history")}
        >
          <Text style={[styles.tabText, activeTab === "history" && styles.activeTabText]}>History</Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content}>
        {activeTab === "details" && renderDetailsTab()}
        {activeTab === "documents" && renderDocumentsTab()}
        {activeTab === "notes" && renderNotesTab()}
        {activeTab === "history" && renderHistoryTab()}
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
  backButton: {
    padding: 4,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: COLORS.darkGray,
    flex: 1,
    textAlign: "center",
  },
  moreButton: {
    padding: 4,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    fontSize: 16,
    color: COLORS.gray,
  },
  tabsContainer: {
    flexDirection: "row",
    backgroundColor: COLORS.white,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.lightGray,
  },
  tab: {
    flex: 1,
    paddingVertical: 12,
    alignItems: "center",
  },
  activeTab: {
    borderBottomWidth: 2,
    borderBottomColor: COLORS.primary,
  },
  tabText: {
    fontSize: 14,
    color: COLORS.gray,
  },
  activeTabText: {
    color: COLORS.primary,
    fontWeight: "bold",
  },
  content: {
    flex: 1,
    padding: 16,
  },
  infoRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.lightGray,
  },
  infoLabel: {
    fontSize: 14,
    color: COLORS.gray,
    flex: 1,
  },
  infoValue: {
    fontSize: 14,
    color: COLORS.darkGray,
    fontWeight: "500",
    flex: 2,
    textAlign: "right",
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  statusText: {
    fontSize: 12,
    color: COLORS.white,
    fontWeight: "bold",
  },
  description: {
    fontSize: 14,
    color: COLORS.darkGray,
    lineHeight: 20,
  },
  requirementItem: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: 8,
  },
  bulletPoint: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: COLORS.primary,
    marginTop: 6,
    marginRight: 8,
  },
  requirementText: {
    fontSize: 14,
    color: COLORS.darkGray,
    flex: 1,
    lineHeight: 20,
  },
  actionButtons: {
    marginTop: 16,
    marginBottom: 24,
  },
  actionButton: {
    marginBottom: 12,
  },
  documentItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.lightGray,
  },
  documentIcon: {
    width: 40,
    height: 40,
    borderRadius: 4,
    backgroundColor: COLORS.primaryLight,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  documentInfo: {
    flex: 1,
  },
  documentName: {
    fontSize: 14,
    fontWeight: "500",
    color: COLORS.darkGray,
    marginBottom: 2,
  },
  documentMeta: {
    fontSize: 12,
    color: COLORS.gray,
    marginBottom: 2,
  },
  documentDate: {
    fontSize: 12,
    color: COLORS.gray,
  },
  documentDownload: {
    padding: 8,
  },
  uploadButton: {
    marginTop: 16,
    marginBottom: 24,
  },
  noContentText: {
    fontSize: 14,
    color: COLORS.gray,
    fontStyle: "italic",
    textAlign: "center",
    paddingVertical: 16,
  },
  noteItem: {
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.lightGray,
  },
  noteText: {
    fontSize: 14,
    color: COLORS.darkGray,
    marginBottom: 8,
    lineHeight: 20,
  },
  noteMeta: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  noteUser: {
    fontSize: 12,
    color: COLORS.primary,
    fontWeight: "500",
  },
  noteDate: {
    fontSize: 12,
    color: COLORS.gray,
  },
  addNoteButton: {
    marginTop: 16,
    marginBottom: 24,
  },
  timelineContainer: {
    paddingVertical: 8,
  },
  timelineItem: {
    flexDirection: "row",
    paddingBottom: 16,
    position: "relative",
  },
  timelineLine: {
    position: "absolute",
    left: 4,
    top: 12,
    bottom: 0,
    width: 2,
    backgroundColor: COLORS.lightGray,
  },
  timelineDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: COLORS.primary,
    marginRight: 12,
    marginTop: 6,
    zIndex: 1,
  },
  timelineContent: {
    flex: 1,
  },
  timelineAction: {
    fontSize: 14,
    fontWeight: "500",
    color: COLORS.darkGray,
    marginBottom: 4,
  },
  timelineDate: {
    fontSize: 12,
    color: COLORS.gray,
    marginBottom: 2,
  },
  timelineUser: {
    fontSize: 12,
    color: COLORS.primary,
  },
})

export default ComplianceDetailScreen

