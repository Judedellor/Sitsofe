"use client"

import { useState, useEffect } from "react"
import {
  StyleSheet,
  View,
  Text,
  Switch,
  TouchableOpacity,
  FlatList,
  TextInput,
  Alert,
  SafeAreaView,
  Modal,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from "react-native"
import { Ionicons } from "@expo/vector-icons"
import { AUTOMATED_NOTIFICATIONS, ACTIVE_AUTOMATIONS } from "./GroupMessagesData"

// Automation Item component for the list
const AutomationItem = ({ automation, onToggle, onEdit }) => {
  const notificationTemplate = AUTOMATED_NOTIFICATIONS.find((n) => n.type === automation.type)

  const getStatusColor = () => {
    if (!automation.enabled) return "#8E8E93" // Gray for disabled
    switch (automation.type) {
      case "rent-reminder":
        return "#4CD964" // Green
      case "lease-expiration":
        return "#FF9500" // Orange
      case "maintenance-completion":
        return "#007AFF" // Blue
      case "emergency":
        return "#FF3B30" // Red
      default:
        return "#8E8E93"
    }
  }

  const getIconName = () => {
    switch (automation.type) {
      case "rent-reminder":
        return "cash-outline"
      case "lease-expiration":
        return "calendar-outline"
      case "maintenance-completion":
        return "checkmark-circle-outline"
      case "emergency":
        return "warning-outline"
      default:
        return "notifications-outline"
    }
  }

  const getScheduleText = () => {
    if (automation.type === "maintenance-completion") {
      return "Sends upon completion"
    } else if (automation.type === "emergency") {
      return "Sends immediately"
    } else {
      return `Sends ${automation.scheduleDaysBefore} days before due date`
    }
  }

  return (
    <View style={styles.automationItem}>
      <View style={[styles.iconContainer, { backgroundColor: getStatusColor() }]}>
        <Ionicons name={getIconName()} size={24} color="#FFFFFF" />
      </View>

      <View style={styles.automationContent}>
        <View style={styles.automationHeader}>
          <Text style={styles.automationTitle}>{notificationTemplate?.title}</Text>
          <Switch
            value={automation.enabled}
            onValueChange={() => onToggle(automation.id)}
            trackColor={{ false: "#E5E5EA", true: "#4CD964" }}
            ios_backgroundColor="#E5E5EA"
          />
        </View>

        <Text style={styles.automationDescription} numberOfLines={2}>
          {automation.customText || notificationTemplate?.text}
        </Text>

        <View style={styles.automationFooter}>
          <Text style={styles.automationSchedule}>{getScheduleText()}</Text>

          <Text style={styles.automationTarget}>
            {automation.properties.includes("all") ? "All Properties" : `${automation.properties.length} Properties`}
          </Text>
        </View>

        <TouchableOpacity style={styles.editButton} onPress={() => onEdit(automation)}>
          <Text style={styles.editButtonText}>Edit</Text>
        </TouchableOpacity>
      </View>
    </View>
  )
}

// Edit Automation modal
const EditAutomationModal = ({ visible, automation, onClose, onSave }) => {
  const [enabled, setEnabled] = useState(automation?.enabled || false)
  const [customText, setCustomText] = useState(automation?.customText || "")
  const [scheduleDays, setScheduleDays] = useState(automation?.scheduleDaysBefore?.toString() || "")
  const [selectedProperties, setSelectedProperties] = useState(automation?.properties || [])

  const notificationTemplate = automation ? AUTOMATED_NOTIFICATIONS.find((n) => n.type === automation.type) : null

  const propertyOptions = [
    { id: "all", name: "All Properties" },
    { id: "p1", name: "Sunset Apartments" },
    { id: "p2", name: "Oakwood Heights" },
    { id: "p3", name: "Parkview Residences" },
  ]

  useEffect(() => {
    if (automation) {
      setEnabled(automation.enabled)
      setCustomText(automation.customText || "")
      setScheduleDays(automation.scheduleDaysBefore?.toString() || "")
      setSelectedProperties(automation.properties || [])
    }
  }, [automation])

  const toggleProperty = (propertyId) => {
    if (propertyId === "all") {
      // If "All Properties" is selected, select only it
      setSelectedProperties(["all"])
    } else {
      // If selecting a specific property, remove "All Properties"
      const newSelection = selectedProperties.includes(propertyId)
        ? selectedProperties.filter((id) => id !== propertyId)
        : [...selectedProperties.filter((id) => id !== "all"), propertyId]

      setSelectedProperties(newSelection)
    }
  }

  const handleSave = () => {
    if (selectedProperties.length === 0) {
      Alert.alert("Error", "Please select at least one property")
      return
    }

    // For notifications that require scheduling
    if (["rent-reminder", "lease-expiration"].includes(automation.type)) {
      if (!scheduleDays || isNaN(Number.parseInt(scheduleDays))) {
        Alert.alert("Error", "Please enter a valid number of days")
        return
      }
    }

    const updatedAutomation = {
      ...automation,
      enabled,
      customText: customText.trim() === "" ? null : customText,
      scheduleDaysBefore: ["rent-reminder", "lease-expiration"].includes(automation.type)
        ? Number.parseInt(scheduleDays)
        : null,
      properties: selectedProperties,
    }

    onSave(updatedAutomation)
  }

  if (!automation) return null

  return (
    <Modal animationType="slide" transparent={true} visible={visible} onRequestClose={onClose}>
      <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === "ios" ? "padding" : undefined}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <View style={styles.modalHeader}>
              <TouchableOpacity onPress={onClose}>
                <Text style={styles.cancelButton}>Cancel</Text>
              </TouchableOpacity>
              <Text style={styles.modalTitle}>Edit Notification</Text>
              <TouchableOpacity onPress={handleSave}>
                <Text style={styles.saveButton}>Save</Text>
              </TouchableOpacity>
            </View>

            <ScrollView style={styles.modalContent}>
              <View style={styles.modalSection}>
                <Text style={styles.sectionTitle}>{notificationTemplate?.title}</Text>
                <View style={styles.enabledRow}>
                  <Text style={styles.enabledText}>Enabled</Text>
                  <Switch
                    value={enabled}
                    onValueChange={setEnabled}
                    trackColor={{ false: "#E5E5EA", true: "#4CD964" }}
                    ios_backgroundColor="#E5E5EA"
                  />
                </View>
              </View>

              <View style={styles.modalSection}>
                <Text style={styles.sectionTitle}>Message</Text>
                <Text style={styles.defaultText}>Default: {notificationTemplate?.text}</Text>
                <TextInput
                  style={styles.textInput}
                  placeholder="Custom message (optional)"
                  placeholderTextColor="#8E8E93"
                  value={customText}
                  onChangeText={setCustomText}
                  multiline
                  numberOfLines={4}
                />
                <Text style={styles.helperText}>
                  Use [TENANT_NAME], [PROPERTY_NAME], [UNIT_NUMBER], etc. as placeholders
                </Text>
              </View>

              {["rent-reminder", "lease-expiration"].includes(automation.type) && (
                <View style={styles.modalSection}>
                  <Text style={styles.sectionTitle}>Schedule</Text>
                  <Text style={styles.scheduleText}>Send notification</Text>
                  <View style={styles.daysInputContainer}>
                    <TextInput
                      style={styles.daysInput}
                      keyboardType="number-pad"
                      value={scheduleDays}
                      onChangeText={setScheduleDays}
                    />
                    <Text style={styles.daysText}>
                      days before {automation.type === "rent-reminder" ? "due date" : "expiration"}
                    </Text>
                  </View>
                </View>
              )}

              <View style={styles.modalSection}>
                <Text style={styles.sectionTitle}>Target Properties</Text>
                <View style={styles.propertiesContainer}>
                  {propertyOptions.map((property) => (
                    <TouchableOpacity
                      key={property.id}
                      style={[
                        styles.propertyOption,
                        selectedProperties.includes(property.id) && styles.selectedProperty,
                      ]}
                      onPress={() => toggleProperty(property.id)}
                    >
                      <Text
                        style={[
                          styles.propertyText,
                          selectedProperties.includes(property.id) && styles.selectedPropertyText,
                        ]}
                      >
                        {property.name}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>
            </ScrollView>
          </View>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  )
}

// Create New Automation modal
const CreateAutomationModal = ({ visible, onClose, onSave }) => {
  const [selectedType, setSelectedType] = useState(null)

  const handleSelectType = (type) => {
    setSelectedType(type)

    // Create a new automation with default values
    const newAutomation = {
      id: `new-${Date.now()}`,
      type,
      enabled: true,
      customText: null,
      properties: ["all"],
      scheduleDaysBefore: type === "rent-reminder" ? 5 : type === "lease-expiration" ? 30 : null,
    }

    onSave(newAutomation)
  }

  return (
    <Modal animationType="slide" transparent={true} visible={visible} onRequestClose={onClose}>
      <View style={styles.modalOverlay}>
        <View style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>New Automated Notification</Text>
            <TouchableOpacity onPress={onClose}>
              <Ionicons name="close" size={24} color="#8E8E93" />
            </TouchableOpacity>
          </View>

          <View style={styles.typeList}>
            {AUTOMATED_NOTIFICATIONS.map((notification) => (
              <TouchableOpacity
                key={notification.id}
                style={styles.typeItem}
                onPress={() => handleSelectType(notification.type)}
              >
                <View style={styles.typeIconContainer}>
                  <Ionicons
                    name={
                      notification.type === "rent-reminder"
                        ? "cash-outline"
                        : notification.type === "lease-expiration"
                          ? "calendar-outline"
                          : notification.type === "maintenance-completion"
                            ? "checkmark-circle-outline"
                            : "warning-outline"
                    }
                    size={28}
                    color="#FFFFFF"
                  />
                </View>
                <View style={styles.typeContent}>
                  <Text style={styles.typeTitle}>{notification.title}</Text>
                  <Text style={styles.typeDescription} numberOfLines={2}>
                    {notification.text}
                  </Text>
                </View>
                <Ionicons name="chevron-forward" size={20} color="#C7C7CC" />
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </View>
    </Modal>
  )
}

// Main AutomatedNotificationsScreen component
const AutomatedNotificationsScreen = ({ navigation }) => {
  const [automations, setAutomations] = useState([])
  const [loading, setLoading] = useState(true)
  const [showEditModal, setShowEditModal] = useState(false)
  const [currentAutomation, setCurrentAutomation] = useState(null)
  const [showCreateModal, setShowCreateModal] = useState(false)

  useEffect(() => {
    // Simulate loading data
    setTimeout(() => {
      setAutomations(ACTIVE_AUTOMATIONS)
      setLoading(false)
    }, 500)
  }, [])

  const handleToggleAutomation = (id) => {
    setAutomations((prev) => prev.map((item) => (item.id === id ? { ...item, enabled: !item.enabled } : item)))
  }

  const handleEditAutomation = (automation) => {
    setCurrentAutomation(automation)
    setShowEditModal(true)
  }

  const handleSaveAutomation = (updatedAutomation) => {
    setAutomations((prev) => prev.map((item) => (item.id === updatedAutomation.id ? updatedAutomation : item)))
    setShowEditModal(false)
  }

  const handleCreateAutomation = (newAutomation) => {
    setAutomations((prev) => [...prev, newAutomation])
    setShowCreateModal(false)

    // Open edit modal for the new automation
    setCurrentAutomation(newAutomation)
    setShowEditModal(true)
  }

  const handleDeleteAutomation = (id) => {
    Alert.alert("Delete Automation", "Are you sure you want to delete this automated notification?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Delete",
        style: "destructive",
        onPress: () => {
          setAutomations((prev) => prev.filter((item) => item.id !== id))
          setShowEditModal(false)
        },
      },
    ])
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <Ionicons name="chevron-back" size={28} color="#007AFF" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Automated Notifications</Text>
        <TouchableOpacity style={styles.addButton} onPress={() => setShowCreateModal(true)}>
          <Ionicons name="add" size={28} color="#007AFF" />
        </TouchableOpacity>
      </View>

      <View style={styles.content}>
        <Text style={styles.description}>
          Automate common notifications to tenants and staff. Notifications are sent at scheduled times or triggered by
          events.
        </Text>

        {loading ? (
          <View style={styles.loadingContainer}>
            <Text>Loading...</Text>
          </View>
        ) : automations.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Ionicons name="notifications-off-outline" size={64} color="#C7C7CC" />
            <Text style={styles.emptyText}>No Automated Notifications</Text>
            <Text style={styles.emptySubtext}>Tap the + button to create your first automated notification</Text>
          </View>
        ) : (
          <FlatList
            data={automations}
            renderItem={({ item }) => (
              <AutomationItem automation={item} onToggle={handleToggleAutomation} onEdit={handleEditAutomation} />
            )}
            keyExtractor={(item) => item.id}
            contentContainerStyle={styles.list}
          />
        )}
      </View>

      <EditAutomationModal
        visible={showEditModal}
        automation={currentAutomation}
        onClose={() => setShowEditModal(false)}
        onSave={handleSaveAutomation}
        onDelete={handleDeleteAutomation}
      />

      <CreateAutomationModal
        visible={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        onSave={handleCreateAutomation}
      />
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F2F2F7",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: "#FFFFFF",
    borderBottomWidth: 1,
    borderBottomColor: "#E5E5EA",
  },
  backButton: {
    width: 40,
    height: 40,
    justifyContent: "center",
    alignItems: "center",
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#000000",
  },
  addButton: {
    width: 40,
    height: 40,
    justifyContent: "center",
    alignItems: "center",
  },
  content: {
    flex: 1,
    padding: 16,
  },
  description: {
    fontSize: 14,
    color: "#8E8E93",
    marginBottom: 16,
    textAlign: "center",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: "600",
    color: "#000000",
    marginTop: 16,
  },
  emptySubtext: {
    fontSize: 14,
    color: "#8E8E93",
    textAlign: "center",
    marginTop: 8,
  },
  list: {
    paddingBottom: 20,
  },

  // Automation Item styles
  automationItem: {
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    marginBottom: 16,
    flexDirection: "row",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  iconContainer: {
    width: 60,
    borderTopLeftRadius: 12,
    borderBottomLeftRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  automationContent: {
    flex: 1,
    padding: 12,
    position: "relative",
  },
  automationHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  automationTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#000000",
  },
  automationDescription: {
    fontSize: 14,
    color: "#3C3C43",
    marginBottom: 8,
  },
  automationFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  automationSchedule: {
    fontSize: 12,
    color: "#8E8E93",
  },
  automationTarget: {
    fontSize: 12,
    color: "#8E8E93",
  },
  editButton: {
    position: "absolute",
    right: 12,
    bottom: 10,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    backgroundColor: "#F2F2F7",
  },
  editButtonText: {
    fontSize: 12,
    color: "#007AFF",
  },

  // Modal styles
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "flex-end",
  },
  modalContainer: {
    backgroundColor: "#FFFFFF",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: "90%",
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#E5E5EA",
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#000000",
    textAlign: "center",
    flex: 1,
  },
  cancelButton: {
    fontSize: 16,
    color: "#8E8E93",
  },
  saveButton: {
    fontSize: 16,
    color: "#007AFF",
    fontWeight: "600",
  },
  modalContent: {
    padding: 16,
  },
  modalSection: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#000000",
    marginBottom: 12,
  },
  enabledRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  enabledText: {
    fontSize: 16,
    color: "#000000",
  },
  defaultText: {
    fontSize: 14,
    color: "#8E8E93",
    marginBottom: 8,
    fontStyle: "italic",
  },
  textInput: {
    borderWidth: 1,
    borderColor: "#E5E5EA",
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    backgroundColor: "#FFFFFF",
    height: 100,
    textAlignVertical: "top",
  },
  helperText: {
    fontSize: 12,
    color: "#8E8E93",
    marginTop: 8,
  },
  scheduleText: {
    fontSize: 16,
    color: "#000000",
    marginBottom: 8,
  },
  daysInputContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  daysInput: {
    borderWidth: 1,
    borderColor: "#E5E5EA",
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    width: 80,
    marginRight: 8,
    textAlign: "center",
  },
  daysText: {
    fontSize: 16,
    color: "#000000",
  },
  propertiesContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
  },
  propertyOption: {
    borderWidth: 1,
    borderColor: "#E5E5EA",
    borderRadius: 16,
    paddingHorizontal: 12,
    paddingVertical: 6,
    margin: 4,
  },
  selectedProperty: {
    backgroundColor: "#007AFF",
    borderColor: "#007AFF",
  },
  propertyText: {
    fontSize: 14,
    color: "#000000",
  },
  selectedPropertyText: {
    color: "#FFFFFF",
  },

  // Create Automation modal styles
  typeList: {
    padding: 16,
  },
  typeItem: {
    flexDirection: "row",
    alignItems: "center",
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#E5E5EA",
  },
  typeIconContainer: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: "#007AFF",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 16,
  },
  typeContent: {
    flex: 1,
  },
  typeTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#000000",
    marginBottom: 4,
  },
  typeDescription: {
    fontSize: 14,
    color: "#8E8E93",
  },
})

export default AutomatedNotificationsScreen

