"use client"

import React, { useState } from "react"
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, Alert } from "react-native"
import { SafeAreaView } from "react-native-safe-area-context"
import { COLORS } from "../constants/colors"
import Card from "../components/ui/Card"
import Button from "../components/ui/Button"
import { Ionicons } from "@expo/vector-icons"
import { useNavigation, useRoute, RouteProp } from "@react-navigation/native"
import { NativeStackNavigationProp } from "@react-navigation/native-stack"

type RootStackParamList = {
  SmartBuildingAlerts: {
    propertyId: string;
  };
};

type NavigationProp = NativeStackNavigationProp<RootStackParamList, 'SmartBuildingAlerts'>;
type RouteProps = RouteProp<RootStackParamList, 'SmartBuildingAlerts'>;

// Types for alerts
interface SmartAlert {
  id: string;
  type: "security" | "maintenance" | "energy" | "access";
  message: string;
  timestamp: string;
  priority: "low" | "medium" | "high";
  propertyId: string;
  deviceId?: string;
  unitId?: string;
  resolved: boolean;
  notes?: string;
  assignedTo?: string;
}

// Mock alerts
const mockAlerts: SmartAlert[] = [
  {
    id: "alert1",
    type: "security",
    message: "Unauthorized access attempt at Unit 105",
    timestamp: "2023-04-15T13:45:00Z",
    priority: "high",
    propertyId: "prop1",
    deviceId: "dev2",
    unitId: "unit105",
    resolved: false,
  },
  {
    id: "alert2",
    type: "maintenance",
    message: "Low battery on Bedroom Thermostat in Unit 102",
    timestamp: "2023-04-15T12:30:00Z",
    priority: "medium",
    propertyId: "prop1",
    deviceId: "dev5",
    unitId: "unit102",
    resolved: false,
  },
  {
    id: "alert3",
    type: "energy",
    message: "Unusual energy consumption in Unit 103",
    timestamp: "2023-04-15T10:15:00Z",
    priority: "low",
    propertyId: "prop1",
    unitId: "unit103",
    resolved: true,
    notes: "Tenant was running multiple appliances simultaneously. Provided energy saving tips.",
    assignedTo: "John Smith",
  },
  {
    id: "alert4",
    type: "access",
    message: "Maintenance access granted to Unit 101",
    timestamp: "2023-04-15T09:00:00Z",
    priority: "low",
    propertyId: "prop1",
    unitId: "unit101",
    resolved: true,
    notes: "Scheduled maintenance completed successfully.",
    assignedTo: "Mike Johnson",
  },
  {
    id: "alert5",
    type: "security",
    message: "Motion detected in Unit 104 during away mode",
    timestamp: "2023-04-14T22:30:00Z",
    priority: "high",
    propertyId: "prop1",
    unitId: "unit104",
    resolved: true,
    notes: "False alarm. Tenant returned early from trip.",
    assignedTo: "Sarah Williams",
  },
  {
    id: "alert6",
    type: "maintenance",
    message: "Water leak detected in Unit 106 bathroom",
    timestamp: "2023-04-14T18:15:00Z",
    priority: "high",
    propertyId: "prop1",
    unitId: "unit106",
    deviceId: "dev12",
    resolved: false,
  },
  {
    id: "alert7",
    type: "energy",
    message: "HVAC system running continuously in Unit 107",
    timestamp: "2023-04-14T14:45:00Z",
    priority: "medium",
    propertyId: "prop1",
    unitId: "unit107",
    deviceId: "dev15",
    resolved: false,
  },
]

const SmartBuildingAlertsScreen = () => {
  const navigation = useNavigation<NavigationProp>();
  const route = useRoute<RouteProps>();
  const { propertyId } = route.params;

  const [alerts, setAlerts] = useState<SmartAlert[]>(mockAlerts);
  const [filterStatus, setFilterStatus] = useState<"all" | "active" | "resolved">("all");
  const [filterType, setFilterType] = useState<SmartAlert["type"] | "all">("all");
  const [filterPriority, setFilterPriority] = useState<SmartAlert["priority"] | "all">("all");
  const [searchText, setSearchText] = useState("");
  const [selectedAlert, setSelectedAlert] = useState<SmartAlert | null>(null);
  const [resolveNotes, setResolveNotes] = useState("");
  const [assignTo, setAssignTo] = useState("");

  // Filter alerts based on filters and search text
  const filteredAlerts = alerts
    .filter((alert) => alert.propertyId === propertyId)
    .filter(
      (alert) =>
        filterStatus === "all" ||
        (filterStatus === "active" && !alert.resolved) ||
        (filterStatus === "resolved" && alert.resolved),
    )
    .filter((alert) => filterType === "all" || alert.type === filterType)
    .filter((alert) => filterPriority === "all" || alert.priority === filterPriority)
    .filter(
      (alert) =>
        alert.message.toLowerCase().includes(searchText.toLowerCase()) ||
        (alert.notes && alert.notes.toLowerCase().includes(searchText.toLowerCase())) ||
        (alert.assignedTo && alert.assignedTo.toLowerCase().includes(searchText.toLowerCase())),
    )

  // Sort alerts by priority and timestamp
  const sortedAlerts = [...filteredAlerts].sort((a, b) => {
    // First sort by resolved status
    if (a.resolved !== b.resolved) {
      return a.resolved ? 1 : -1
    }

    // Then sort by priority
    const priorityOrder = { high: 0, medium: 1, low: 2 }
    if (a.priority !== b.priority) {
      return priorityOrder[a.priority] - priorityOrder[b.priority]
    }

    // Finally sort by timestamp (newest first)
    return new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
  })

  // Handle alert resolution
  const handleResolveAlert = () => {
    if (!selectedAlert) return

    if (!resolveNotes) {
      Alert.alert("Error", "Please enter resolution notes")
      return
    }

    setAlerts(
      alerts.map((alert) =>
        alert.id === selectedAlert.id
          ? {
              ...alert,
              resolved: true,
              notes: resolveNotes,
              assignedTo: assignTo || undefined,
            }
          : alert,
      ),
    )

    setSelectedAlert(null)
    setResolveNotes("")
    setAssignTo("")

    Alert.alert("Success", "Alert has been resolved")
  }

  // Format date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString()
  }

  // Format time
  const formatTime = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
  }

  // Format date and time
  const formatDateTime = (dateString: string) => {
    return `${formatDate(dateString)} ${formatTime(dateString)}`
  }

  // Get color for alert priority
  const getStatusIcon = (status: SmartAlert["priority"]): string => {
    switch (status) {
      case "high":
        return COLORS.error as string;
      case "medium":
        return COLORS.warning as string;
      case "low":
        return COLORS.info as string;
      default:
        return COLORS.gray[500];
    }
  }

  // Get icon for alert type
  const getAlertIcon = (type: string) => {
    switch (type) {
      case "security":
        return "shield-outline"
      case "maintenance":
        return "construct-outline"
      case "energy":
        return "flash-outline"
      case "access":
        return "key-outline"
      default:
        return "alert-circle-outline"
    }
  }

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color={COLORS.darkGray} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Alerts & Notifications</Text>
      </View>

      <View style={styles.searchContainer}>
        <Ionicons name="search-outline" size={20} color={COLORS.gray[500]} style={styles.searchIcon} />
        <TextInput
          style={styles.searchInput}
          placeholder="Search alerts..."
          value={searchText}
          onChangeText={setSearchText}
        />
        {searchText.length > 0 && (
          <TouchableOpacity onPress={() => setSearchText("")} style={styles.clearButton}>
            <Ionicons name="close-circle" size={20} color={COLORS.gray[500]} />
          </TouchableOpacity>
        )}
      </View>

      <View style={styles.filtersContainer}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          <View style={styles.filterGroup}>
            <Text style={styles.filterLabel}>Status:</Text>
            <TouchableOpacity
              style={[styles.filterButton, filterStatus === "all" && styles.activeFilter]}
              onPress={() => setFilterStatus("all")}
            >
              <Text style={[styles.filterText, filterStatus === "all" && styles.activeFilterText]}>All</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.filterButton, filterStatus === "active" && styles.activeFilter]}
              onPress={() => setFilterStatus("active")}
            >
              <Text style={[styles.filterText, filterStatus === "active" && styles.activeFilterText]}>Active</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.filterButton, filterStatus === "resolved" && styles.activeFilter]}
              onPress={() => setFilterStatus("resolved")}
            >
              <Text style={[styles.filterText, filterStatus === "resolved" && styles.activeFilterText]}>Resolved</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.filterDivider} />

          <View style={styles.filterGroup}>
            <Text style={styles.filterLabel}>Type:</Text>
            <TouchableOpacity
              style={[styles.filterButton, filterType === "all" && styles.activeFilter]}
              onPress={() => setFilterType("all")}
            >
              <Text style={[styles.filterText, filterType === "all" && styles.activeFilterText]}>All</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.filterButton, filterType === "security" && styles.activeFilter]}
              onPress={() => setFilterType("security")}
            >
              <Text style={[styles.filterText, filterType === "security" && styles.activeFilterText]}>Security</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.filterButton, filterType === "maintenance" && styles.activeFilter]}
              onPress={() => setFilterType("maintenance")}
            >
              <Text style={[styles.filterText, filterType === "maintenance" && styles.activeFilterText]}>
                Maintenance
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.filterButton, filterType === "energy" && styles.activeFilter]}
              onPress={() => setFilterType("energy")}
            >
              <Text style={[styles.filterText, filterType === "energy" && styles.activeFilterText]}>Energy</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.filterButton, filterType === "access" && styles.activeFilter]}
              onPress={() => setFilterType("access")}
            >
              <Text style={[styles.filterText, filterType === "access" && styles.activeFilterText]}>Access</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.filterDivider} />

          <View style={styles.filterGroup}>
            <Text style={styles.filterLabel}>Priority:</Text>
            <TouchableOpacity
              style={[styles.filterButton, filterPriority === "all" && styles.activeFilter]}
              onPress={() => setFilterPriority("all")}
            >
              <Text style={[styles.filterText, filterPriority === "all" && styles.activeFilterText]}>All</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.filterButton, filterPriority === "high" && styles.activeFilter]}
              onPress={() => setFilterPriority("high")}
            >
              <Text style={[styles.filterText, filterPriority === "high" && styles.activeFilterText]}>High</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.filterButton, filterPriority === "medium" && styles.activeFilter]}
              onPress={() => setFilterPriority("medium")}
            >
              <Text style={[styles.filterText, filterPriority === "medium" && styles.activeFilterText]}>Medium</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.filterButton, filterPriority === "low" && styles.activeFilter]}
              onPress={() => setFilterPriority("low")}
            >
              <Text style={[styles.filterText, filterPriority === "low" && styles.activeFilterText]}>Low</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </View>

      <ScrollView style={styles.content}>
        {sortedAlerts.length === 0 ? (
          <View style={styles.emptyState}>
            <Ionicons name="notifications-off-outline" size={64} color={COLORS.gray[500]} />
            <Text style={styles.emptyText}>No alerts found</Text>
            <Text style={styles.emptySubtext}>Try adjusting your filters</Text>
          </View>
        ) : (
          sortedAlerts.map((alert) => (
            <Card key={alert.id} elevated style={alert.resolved ? styles.resolvedCard : undefined}>
              <View style={styles.alertHeader}>
                <View style={styles.alertTypeContainer}>
                  <View style={[styles.alertIconContainer, { backgroundColor: getStatusIcon(alert.priority) as string }]}>
                    <Ionicons name={getAlertIcon(alert.type)} size={20} color={COLORS.white} />
                  </View>
                  <View>
                    <View style={styles.alertMeta}>
                      <Text style={styles.alertType}>{alert.type.charAt(0).toUpperCase() + alert.type.slice(1)}</Text>
                      <View style={[styles.priorityBadge, { backgroundColor: getStatusIcon(alert.priority) as string }]}>
                        <Text style={styles.priorityText}>
                          {alert.priority.charAt(0).toUpperCase() + alert.priority.slice(1)}
                        </Text>
                      </View>
                    </View>
                    <Text style={styles.alertTimestamp}>{formatDateTime(alert.timestamp)}</Text>
                  </View>
                </View>

                {!alert.resolved && (
                  <TouchableOpacity style={styles.resolveButton} onPress={() => setSelectedAlert(alert)}>
                    <Text style={styles.resolveText}>Resolve</Text>
                  </TouchableOpacity>
                )}
              </View>

              <Text style={styles.alertMessage}>{alert.message}</Text>

              {alert.unitId && (
                <View style={styles.alertDetail}>
                  <Text style={styles.alertDetailLabel}>Location:</Text>
                  <Text style={styles.alertDetailValue}>{alert.unitId}</Text>
                </View>
              )}

              {alert.resolved && (
                <>
                  <View style={styles.alertDetail}>
                    <Text style={styles.alertDetailLabel}>Status:</Text>
                    <View style={styles.resolvedBadge}>
                      <Text style={styles.resolvedText}>Resolved</Text>
                    </View>
                  </View>

                  {alert.assignedTo && (
                    <View style={styles.alertDetail}>
                      <Text style={styles.alertDetailLabel}>Resolved by:</Text>
                      <Text style={styles.alertDetailValue}>{alert.assignedTo}</Text>
                    </View>
                  )}

                  {alert.notes && (
                    <View style={styles.alertNotes}>
                      <Text style={styles.alertNotesLabel}>Resolution Notes:</Text>
                      <Text style={styles.alertNotesText}>{alert.notes}</Text>
                    </View>
                  )}
                </>
              )}
            </Card>
          ))
        )}

        <View style={styles.spacer} />
      </ScrollView>

      {/* Resolve Alert Modal */}
      {selectedAlert && (
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Resolve Alert</Text>
              <TouchableOpacity
                style={styles.modalCloseButton}
                onPress={() => {
                  setSelectedAlert(null)
                  setResolveNotes("")
                  setAssignTo("")
                }}
              >
                <Ionicons name="close" size={24} color={COLORS.darkGray} />
              </TouchableOpacity>
            </View>

            <Text style={styles.modalAlertMessage}>{selectedAlert.message}</Text>

            <View style={styles.formGroup}>
              <Text style={styles.formLabel}>Resolution Notes *</Text>
              <TextInput
                style={[styles.formInput, styles.textArea]}
                value={resolveNotes}
                onChangeText={setResolveNotes}
                placeholder="Enter resolution details"
                multiline
                numberOfLines={4}
              />
            </View>

            <View style={styles.formGroup}>
              <Text style={styles.formLabel}>Assign To (Optional)</Text>
              <TextInput
                style={styles.formInput}
                value={assignTo}
                onChangeText={setAssignTo}
                placeholder="Enter name of resolver"
              />
            </View>

            <View style={styles.modalButtons}>
              <Button
                title="Cancel"
                type="outline"
                onPress={() => {
                  setSelectedAlert(null)
                  setResolveNotes("")
                  setAssignTo("")
                }}
                style={styles.modalButton}
              />
              <Button title="Resolve Alert" type="primary" onPress={handleResolveAlert} style={styles.modalButton} />
            </View>
          </View>
        </View>
      )}
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
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.lightGray,
    backgroundColor: COLORS.white,
  },
  backButton: {
    marginRight: 16,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: COLORS.darkGray,
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: COLORS.white,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.lightGray,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    height: 40,
    fontSize: 16,
  },
  clearButton: {
    padding: 4,
  },
  filtersContainer: {
    backgroundColor: COLORS.white,
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.lightGray,
  },
  filterGroup: {
    flexDirection: "row",
    alignItems: "center",
  },
  filterLabel: {
    fontSize: 14,
    fontWeight: "500",
    color: COLORS.darkGray,
    marginRight: 8,
  },
  filterButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    marginRight: 8,
    backgroundColor: COLORS.lightGray,
  },
  activeFilter: {
    backgroundColor: COLORS.primary,
  },
  filterText: {
    fontSize: 12,
    color: COLORS.darkGray,
  },
  activeFilterText: {
    color: COLORS.white,
    fontWeight: "500",
  },
  filterDivider: {
    width: 1,
    height: "80%",
    backgroundColor: COLORS.lightGray,
    marginHorizontal: 8,
  },
  content: {
    flex: 1,
    padding: 16,
  },
  resolvedCard: {
    opacity: 0.7,
  },
  alertHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 12,
  },
  alertTypeContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  alertIconContainer: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  alertMeta: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 4,
  },
  alertType: {
    fontSize: 14,
    fontWeight: "500",
    color: COLORS.darkGray,
    marginRight: 8,
  },
  priorityBadge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 12,
  },
  priorityText: {
    fontSize: 10,
    fontWeight: "500",
    color: COLORS.white,
  },
  alertTimestamp: {
    fontSize: 12,
    color: COLORS.gray[500],
  },
  resolveButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 4,
    backgroundColor: COLORS.primaryLight,
  },
  resolveText: {
    fontSize: 12,
    color: COLORS.primary,
    fontWeight: "500",
  },
  alertMessage: {
    fontSize: 16,
    color: COLORS.darkGray,
    marginBottom: 12,
  },
  alertDetail: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  alertDetailLabel: {
    fontSize: 14,
    color: COLORS.gray[500],
    marginRight: 8,
    width: 80,
  },
  alertDetailValue: {
    fontSize: 14,
    color: COLORS.darkGray,
  },
  resolvedBadge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 12,
    backgroundColor: COLORS.success,
  },
  resolvedText: {
    fontSize: 10,
    fontWeight: "500",
    color: COLORS.white,
  },
  alertNotes: {
    marginTop: 8,
  },
  alertNotesLabel: {
    fontSize: 14,
    color: COLORS.gray[500],
    marginBottom: 4,
  },
  alertNotesText: {
    fontSize: 14,
    color: COLORS.darkGray,
    fontStyle: "italic",
  },
  emptyState: {
    alignItems: "center",
    justifyContent: "center",
    padding: 40,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: "bold",
    color: COLORS.darkGray,
    marginTop: 16,
  },
  emptySubtext: {
    fontSize: 14,
    color: COLORS.gray[500],
    marginTop: 8,
  },
  modalOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContainer: {
    width: "90%",
    backgroundColor: COLORS.white,
    borderRadius: 8,
    padding: 16,
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: COLORS.darkGray,
  },
  modalCloseButton: {
    padding: 4,
  },
  modalAlertMessage: {
    fontSize: 16,
    color: COLORS.darkGray,
    marginBottom: 16,
  },
  formGroup: {
    marginBottom: 16,
  },
  formLabel: {
    fontSize: 14,
    fontWeight: "500",
    color: COLORS.darkGray,
    marginBottom: 8,
  },
  formInput: {
    borderWidth: 1,
    borderColor: COLORS.lightGray,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    fontSize: 14,
  },
  textArea: {
    height: 100,
    textAlignVertical: "top",
  },
  modalButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  modalButton: {
    flex: 1,
    marginHorizontal: 4,
  },
  spacer: {
    height: 40,
  },
  subtitle: {
    fontSize: 16,
    color: COLORS.gray[500],
    marginBottom: 24,
    lineHeight: 22,
  },
  requirementText: {
    fontSize: 14,
    color: COLORS.gray[500],
    marginLeft: 8,
  },
  successText: {
    fontSize: 16,
    color: COLORS.gray[500],
    textAlign: "center",
    marginBottom: 32,
    lineHeight: 22,
  },
})

export default SmartBuildingAlertsScreen

