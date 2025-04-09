"use client"

import React, { useState, useEffect } from "react"
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  ActivityIndicator,
  Alert,
  Image,
  Platform,
} from "react-native"
import { SafeAreaView } from "react-native-safe-area-context"
import { Ionicons } from "@expo/vector-icons"
import { useNavigation, useRoute, RouteProp } from "@react-navigation/native"
import { useAuth } from "../context/AuthContext"
import { COLORS } from "../constants/colors"
import { NativeStackNavigationProp } from "@react-navigation/native-stack"
import * as ImagePicker from "expo-image-picker"

// Define types
type WorkOrderStatus = typeof WORK_ORDER_STATUSES[keyof typeof WORK_ORDER_STATUSES];
type WorkOrderPriority = typeof WORK_ORDER_PRIORITIES[keyof typeof WORK_ORDER_PRIORITIES];

interface WorkOrder {
  id: string;
  title: string;
  description: string;
  status: WorkOrderStatus;
  priority: WorkOrderPriority;
  category: string;
  location: string;
  assignedTo?: string;
  createdAt: string;
  updatedAt: string;
  completedAt?: string;
  images: string[];
  notes: WorkOrderNote[];
}

interface WorkOrderNote {
  id: string;
  text: string;
  createdAt: string;
  createdBy: string;
  type: "update" | "comment";
}

interface Material {
  id: string;
  name: string;
  quantity: number;
  unit: string;
  cost: number;
}

interface Note {
  id: string;
  userId: string;
  userName: string;
  text: string;
  timestamp: string;
}

interface StaffMember {
  id: string;
  name: string;
  role: string;
}

interface RouteParams {
  orderId: string;
}

// Add UserRole type
type UserRole = "admin" | "property_manager" | "maintenance_staff" | "hvac_technician" | "electrician" | "tenant";

// Add User interface
interface User {
  id: string;
  name: string;
  role: UserRole;
}

// Add RootStackParamList type
type RootStackParamList = {
  WorkOrderDetail: {
    orderId: string;
  };
  EditWorkOrder: {
    orderId: string;
  };
};

// Constants
const WORK_ORDER_STATUSES = {
  NEW: "open" as const,
  IN_PROGRESS: "in_progress" as const,
  COMPLETED: "completed" as const,
  CANCELLED: "cancelled" as const,
} as const;

const WORK_ORDER_PRIORITIES = {
  LOW: "low" as const,
  MEDIUM: "medium" as const,
  HIGH: "high" as const,
  URGENT: "urgent" as const,
} as const;

// Mock staff members
const mockStaffMembers: StaffMember[] = [
  { id: "1", name: "John Smith", role: "maintenance_staff" },
  { id: "2", name: "Sarah Johnson", role: "hvac_technician" },
  { id: "3", name: "Michael Brown", role: "maintenance_staff" },
]

type NavigationProp = NativeStackNavigationProp<RootStackParamList, 'WorkOrderDetail'>;
type RouteProps = RouteProp<RootStackParamList, 'WorkOrderDetail'>;

const WorkOrderDetailScreen = () => {
  const navigation = useNavigation<NavigationProp>();
  const route = useRoute<RouteProps>();
  const { orderId } = route.params;
  const { user, hasPermission } = useAuth()

  const [workOrder, setWorkOrder] = useState<WorkOrder | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isUpdating, setIsUpdating] = useState(false)
  const [showStatusPicker, setShowStatusPicker] = useState(false)
  const [showAssignPicker, setShowAssignPicker] = useState(false)
  const [newNote, setNewNote] = useState("")
  const [isAddingNote, setIsAddingNote] = useState(false)

  // Load work order
  useEffect(() => {
    const loadWorkOrder = async () => {
      try {
        setIsLoading(true)
        // Simulate API call
        await new Promise((resolve) => setTimeout(resolve, 1000))

        setWorkOrder({
          id: orderId,
          title: "Leaking Bathroom Faucet",
          description: "The bathroom sink faucet is leaking and causing water damage to the cabinet below.",
          status: WORK_ORDER_STATUSES.NEW,
          priority: WORK_ORDER_PRIORITIES.HIGH,
          category: "Plumbing",
          location: "Building A - Unit 101",
          assignedTo: undefined,
          createdAt: "2023-06-15T10:30:00Z",
          updatedAt: "2023-06-15T14:45:00Z",
          completedAt: undefined,
          images: [
            "https://example.com/image1.jpg",
            "https://example.com/image2.jpg"
          ],
          notes: [
            {
              id: "1",
              text: "Please fix this as soon as possible. The leak is getting worse.",
              createdAt: "2023-06-15T10:30:00Z",
              createdBy: "John Doe",
              type: "comment" as const,
            },
            {
              id: "2",
              text: "I'll be there on Monday to fix the faucet.",
              createdAt: "2023-06-15T14:45:00Z",
              createdBy: "Michael Brown",
              type: "update" as const,
            },
          ],
        })
      } catch (error) {
        console.error("Error loading work order:", error)
        Alert.alert("Error", "Failed to load work order details. Please try again.")
      } finally {
        setIsLoading(false)
      }
    }

    loadWorkOrder()
  }, [orderId])

  // Get status color
  const getStatusColor = (status: WorkOrder["status"]) => {
    switch (status) {
      case WORK_ORDER_STATUSES.NEW:
        return COLORS.info;
      case WORK_ORDER_STATUSES.IN_PROGRESS:
        return COLORS.warning;
      case WORK_ORDER_STATUSES.COMPLETED:
        return COLORS.success;
      case WORK_ORDER_STATUSES.CANCELLED:
        return COLORS.gray[500];
      default:
        return COLORS.gray[500];
    }
  };

  // Get priority color
  const getPriorityColor = (priority: WorkOrder["priority"]) => {
    switch (priority) {
      case WORK_ORDER_PRIORITIES.LOW:
        return COLORS.success;
      case WORK_ORDER_PRIORITIES.MEDIUM:
        return COLORS.warning;
      case WORK_ORDER_PRIORITIES.HIGH:
        return COLORS.error;
      case WORK_ORDER_PRIORITIES.URGENT:
        return COLORS.error;
      default:
        return COLORS.gray[500];
    }
  };

  // Format date
  const formatDate = (date: string | undefined | null): string => {
    if (!date) return "Not set";
    return new Date(date).toLocaleDateString();
  }

  // Format currency
  const formatCurrency = (amount: number | null): string => {
    if (amount === null || amount === undefined) return "N/A"
    return `$${amount.toFixed(2)}`
  }

  // Update work order status
  const updateStatus = async (newStatus: string) => {
    try {
      setIsUpdating(true)
      // In a real app, you would update via API
      await new Promise((resolve) => setTimeout(resolve, 1000)) // Simulate API call

      // Update local state
      if (workOrder) {
        setWorkOrder({
          ...workOrder,
          status: newStatus,
          updatedAt: new Date().toISOString(),
        })
      }
      setShowStatusPicker(false)
    } catch (error) {
      console.error("Error updating status:", error)
      Alert.alert("Error", "Failed to update work order status. Please try again.")
    } finally {
      setIsUpdating(false)
    }
  }

  // Assign work order to staff
  const assignWorkOrder = async (staffMember: StaffMember | null) => {
    try {
      setIsUpdating(true)
      // In a real app, you would update via API
      await new Promise((resolve) => setTimeout(resolve, 1000)) // Simulate API call

      // Update local state
      if (workOrder) {
        setWorkOrder({
          ...workOrder,
          assignedTo: staffMember?.id,
          status: workOrder.status === WORK_ORDER_STATUSES.NEW ? WORK_ORDER_STATUSES.IN_PROGRESS : workOrder.status,
          updatedAt: new Date().toISOString(),
        })
      }
      setShowAssignPicker(false)
    } catch (error) {
      console.error("Error assigning work order:", error)
      Alert.alert("Error", "Failed to assign work order. Please try again.")
    } finally {
      setIsUpdating(false)
    }
  }

  // Add note to work order
  const addNote = () => {
    if (!newNote.trim() || !workOrder || !user?.name) return;

    const note: WorkOrderNote = {
      id: Date.now().toString(),
      text: newNote.trim(),
      createdAt: new Date().toISOString(),
      createdBy: user.name,
      type: "comment" as const,
    };

    setWorkOrder({
      ...workOrder,
      notes: [...workOrder.notes, note],
      updatedAt: new Date().toISOString(),
    });
    setNewNote("");
  };

  // Mark work order as complete
  const markAsComplete = async () => {
    try {
      setIsUpdating(true)
      // In a real app, you would update via API
      await new Promise((resolve) => setTimeout(resolve, 1000)) // Simulate API call

      // Update local state
      if (workOrder) {
        setWorkOrder({
          ...workOrder,
          status: WORK_ORDER_STATUSES.COMPLETED,
          completedAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        })
      }
    } catch (error) {
      console.error("Error completing work order:", error)
      Alert.alert("Error", "Failed to complete work order. Please try again.")
    } finally {
      setIsUpdating(false)
    }
  }

  // Check if user can edit work order
  const canEditWorkOrder = (): boolean => {
    if (!user) return false
    return !!(
      hasPermission("manage_work_orders") ||
      (user.role && user.role === "maintenance_staff" && workOrder?.assignedTo === user.id) ||
      (user.role && (user.role as string) === "hvac_technician" && workOrder?.assignedTo === user.id)
    )
  }

  if (isLoading) {
    return (
      <SafeAreaView style={styles.container} edges={["top"]}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={COLORS.primary} />
          <Text style={styles.loadingText}>Loading work order details...</Text>
        </View>
      </SafeAreaView>
    )
  }

  if (!workOrder) {
    return (
      <SafeAreaView style={styles.container} edges={["top"]}>
        <View style={styles.errorContainer}>
          <Ionicons name="alert-circle-outline" size={64} color={COLORS.error} />
          <Text style={styles.errorText}>Work order not found</Text>
          <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
            <Text style={styles.backButtonText}>Go Back</Text>
          </TouchableOpacity>
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
        <Text style={styles.headerTitle}>Work Order #{orderId}</Text>

        {canEditWorkOrder() && (
          <TouchableOpacity
            style={styles.headerButton}
            onPress={() => navigation.navigate("EditWorkOrder", { orderId })}
          >
            <Ionicons name="create-outline" size={24} color={COLORS.primary} />
          </TouchableOpacity>
        )}
      </View>

      <ScrollView style={styles.content}>
        {/* Work Order Details Section */}
        <View style={styles.section}>
          <View style={styles.workOrderHeader}>
            <Text style={styles.workOrderTitle}>{workOrder.title}</Text>

            <View style={[styles.statusBadge, { backgroundColor: getStatusColor(workOrder.status) }]}>
              <Text style={styles.statusText}>
                {workOrder.status.replace(/_/g, " ").replace(/\b\w/g, (l: string) => l.toUpperCase())}
              </Text>
            </View>
          </View>

          <View style={styles.workOrderMeta}>
            <View style={styles.metaItem}>
              <Ionicons name="business-outline" size={16} color={COLORS.gray[500]} style={styles.metaIcon} />
              <Text style={styles.metaText}>
                {workOrder.location}
              </Text>
            </View>

            <View style={styles.metaItem}>
              <Ionicons name="person-outline" size={16} color={COLORS.gray[500]} style={styles.metaIcon} />
              <Text style={styles.metaText}>{workOrder.notes[0].createdBy}</Text>
            </View>

            <View style={styles.metaItem}>
              <Ionicons
                name="alert-circle-outline"
                size={16}
                color={getPriorityColor(workOrder.priority)}
                style={styles.metaIcon}
              />
              <Text style={[styles.metaText, { color: getPriorityColor(workOrder.priority) }]}>
                {workOrder.priority.charAt(0).toUpperCase() + workOrder.priority.slice(1)} Priority
              </Text>
            </View>
          </View>

          <Text style={styles.descriptionTitle}>Description</Text>
          <Text style={styles.descriptionText}>{workOrder.description}</Text>
        </View>

        {/* Status & Assignment Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Status & Assignment</Text>

          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Status:</Text>
            <View style={styles.infoValueContainer}>
              {canEditWorkOrder() ? (
                <TouchableOpacity
                  style={[styles.statusButton, { backgroundColor: getStatusColor(workOrder.status) }]}
                  onPress={() => setShowStatusPicker(!showStatusPicker)}
                  disabled={isUpdating}
                >
                  <Text style={styles.statusButtonText}>
                    {workOrder.status.replace(/_/g, " ").replace(/\b\w/g, (l: string) => l.toUpperCase())}
                  </Text>
                  <Ionicons name="chevron-down" size={16} color={COLORS.white} />
                </TouchableOpacity>
              ) : (
                <View style={[styles.statusBadge, { backgroundColor: getStatusColor(workOrder.status) }]}>
                  <Text style={styles.statusText}>
                    {workOrder.status.replace(/_/g, " ").replace(/\b\w/g, (l: string) => l.toUpperCase())}
                  </Text>
                </View>
              )}
            </View>
          </View>

          {showStatusPicker && (
            <View style={styles.pickerContainer}>
              {Object.values(WORK_ORDER_STATUSES).map((status) => (
                <TouchableOpacity
                  key={status}
                  style={[
                    styles.pickerItem,
                    workOrder.status === status && styles.pickerItemActive,
                    { borderLeftColor: getStatusColor(status), borderLeftWidth: 4 },
                  ]}
                  onPress={() => updateStatus(status)}
                  disabled={isUpdating}
                >
                  {isUpdating && workOrder.status !== status ? (
                    <ActivityIndicator size="small" color={COLORS.primary} />
                  ) : (
                    <Text style={[styles.pickerItemText, workOrder.status === status && styles.pickerItemTextActive]}>
                      {status.replace(/_/g, " ").replace(/\b\w/g, (l: string) => l.toUpperCase())}
                    </Text>
                  )}
                </TouchableOpacity>
              ))}
            </View>
          )}

          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Assigned To:</Text>
            <View style={styles.infoValueContainer}>
              {canEditWorkOrder() ? (
                <TouchableOpacity
                  style={styles.assignButton}
                  onPress={() => setShowAssignPicker(!showAssignPicker)}
                  disabled={isUpdating}
                >
                  <Text style={styles.assignButtonText}>
                    {workOrder.assignedTo ? "Assigned" : "Unassigned"}
                  </Text>
                  <Ionicons name="chevron-down" size={16} color={COLORS.primary} />
                </TouchableOpacity>
              ) : (
                <Text style={styles.infoValue}>{workOrder.assignedTo ? "Assigned" : "Unassigned"}</Text>
              )}
            </View>
          </View>

          {showAssignPicker && (
            <View style={styles.pickerContainer}>
              <TouchableOpacity
                style={[styles.pickerItem, !workOrder.assignedTo && styles.pickerItemActive]}
                onPress={() => assignWorkOrder(null)}
                disabled={isUpdating}
              >
                {isUpdating && workOrder.assignedTo ? (
                  <ActivityIndicator size="small" color={COLORS.primary} />
                ) : (
                  <Text style={[styles.pickerItemText, !workOrder.assignedTo && styles.pickerItemTextActive]}>
                    Unassigned
                  </Text>
                )}
              </TouchableOpacity>

              {mockStaffMembers.map((staff) => (
                <TouchableOpacity
                  key={staff.id}
                  style={[
                    styles.pickerItem,
                    workOrder.assignedTo === staff.id && styles.pickerItemActive,
                  ]}
                  onPress={() => assignWorkOrder(staff)}
                  disabled={isUpdating}
                >
                  {isUpdating && workOrder.assignedTo !== staff.id ? (
                    <ActivityIndicator size="small" color={COLORS.primary} />
                  ) : (
                    <>
                      <Text
                        style={[
                          styles.pickerItemText,
                          workOrder.assignedTo === staff.id && styles.pickerItemTextActive,
                        ]}
                      >
                        {staff.name}
                      </Text>
                      <Text
                        style={[
                          styles.pickerItemSubtext,
                          workOrder.assignedTo === staff.id && styles.pickerItemTextActive,
                        ]}
                      >
                        {staff.role.replace(/_/g, " ").replace(/\b\w/g, (l: string) => l.toUpperCase())}
                      </Text>
                    </>
                  )}
                </TouchableOpacity>
              ))}
            </View>
          )}
        </View>

        {/* Dates Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Dates</Text>

          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Created:</Text>
            <Text style={styles.infoValue}>{formatDate(workOrder.createdAt)}</Text>
          </View>

          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Last Updated:</Text>
            <Text style={styles.infoValue}>{formatDate(workOrder.updatedAt)}</Text>
          </View>

          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Completed Date:</Text>
            <Text style={styles.infoValue}>{formatDate(workOrder.completedAt)}</Text>
          </View>
        </View>

        {/* Photos Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Photos</Text>

          {workOrder.images && workOrder.images.length > 0 ? (
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.photoList}>
              {workOrder.images.map((image, index) => (
                <View key={index} style={styles.photoItem}>
                  <Image
                    source={{ uri: image }}
                    style={styles.photo}
                    defaultSource={require("../assets/placeholder-image.png")}
                  />
                </View>
              ))}
            </ScrollView>
          ) : (
            <View style={styles.emptyContainer}>
              <Ionicons name="images-outline" size={48} color={COLORS.gray[400]} />
              <Text style={styles.emptyText}>No photos available</Text>
            </View>
          )}
        </View>

        {/* Notes Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Notes</Text>

          {workOrder.notes && workOrder.notes.length > 0 ? (
            <View style={styles.notesList}>
              {workOrder.notes.map((note) => (
                <View key={note.id} style={styles.noteItem}>
                  <View style={styles.noteHeader}>
                    <Text style={styles.noteName}>{note.createdBy}</Text>
                    <Text style={styles.noteDate}>{formatDate(note.createdAt)}</Text>
                  </View>
                  <Text style={styles.noteText}>{note.text}</Text>
                </View>
              ))}
            </View>
          ) : (
            <View style={styles.emptyContainer}>
              <Ionicons name="chatbubble-outline" size={48} color={COLORS.gray[400]} />
              <Text style={styles.emptyText}>No notes yet</Text>
            </View>
          )}

          {canEditWorkOrder() && (
            <View style={styles.addNoteContainer}>
              <TextInput
                style={styles.addNoteInput}
                value={newNote}
                onChangeText={setNewNote}
                placeholder="Add a note..."
                multiline
                numberOfLines={3}
                editable={!isAddingNote}
              />

              <TouchableOpacity
                style={[styles.addNoteButton, isAddingNote && styles.disabledButton]}
                onPress={addNote}
                disabled={!newNote.trim() || isAddingNote}
              >
                {isAddingNote ? (
                  <ActivityIndicator size="small" color={COLORS.white} />
                ) : (
                  <>
                    <Ionicons name="send-outline" size={20} color={COLORS.white} />
                    <Text style={styles.addNoteButtonText}>Add Note</Text>
                  </>
                )}
              </TouchableOpacity>
            </View>
          )}
        </View>

        {/* Complete Work Order Button */}
        {canEditWorkOrder() &&
          workOrder.status !== WORK_ORDER_STATUSES.COMPLETED &&
          workOrder.status !== WORK_ORDER_STATUSES.CANCELLED && (
            <TouchableOpacity
              style={[styles.completeButton, isUpdating && styles.disabledButton]}
              onPress={markAsComplete}
              disabled={isUpdating}
            >
              {isUpdating ? (
                <ActivityIndicator size="small" color={COLORS.white} />
              ) : (
                <>
                  <Ionicons name="checkmark-circle-outline" size={20} color={COLORS.white} />
                  <Text style={styles.completeButtonText}>Mark as Complete</Text>
                </>
              )}
            </TouchableOpacity>
          )}
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
    borderBottomColor: COLORS.gray[200],
  },
  backButton: {
    padding: 4,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: COLORS.darkGray,
  },
  headerButton: {
    padding: 4,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: COLORS.gray[500],
  },
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 24,
  },
  errorText: {
    fontSize: 16,
    color: COLORS.gray[500],
    textAlign: "center",
    marginTop: 16,
    marginBottom: 24,
  },
  backButtonText: {
    fontSize: 16,
    color: COLORS.primary,
    fontWeight: "500",
  },
  content: {
    flex: 1,
  },
  section: {
    backgroundColor: COLORS.white,
    borderRadius: 8,
    marginHorizontal: 16,
    marginTop: 16,
    padding: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: COLORS.darkGray,
    marginBottom: 16,
  },
  workOrderHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 12,
  },
  workOrderTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: COLORS.darkGray,
    flex: 1,
    marginRight: 12,
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  statusText: {
    fontSize: 12,
    color: COLORS.white,
    fontWeight: "500",
  },
  workOrderMeta: {
    marginBottom: 16,
  },
  metaItem: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  metaIcon: {
    marginRight: 8,
  },
  metaText: {
    fontSize: 14,
    color: COLORS.gray[500],
  },
  descriptionTitle: {
    fontSize: 16,
    fontWeight: "500",
    color: COLORS.darkGray,
    marginBottom: 8,
  },
  descriptionText: {
    fontSize: 14,
    color: COLORS.darkGray,
    lineHeight: 20,
  },
  infoRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  infoLabel: {
    fontSize: 14,
    color: COLORS.gray[500],
    flex: 1,
  },
  infoValue: {
    fontSize: 14,
    color: COLORS.darkGray,
    flex: 2,
  },
  infoValueContainer: {
    flex: 2,
  },
  statusButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 4,
  },
  statusButtonText: {
    fontSize: 14,
    color: COLORS.white,
    fontWeight: "500",
    marginRight: 8,
  },
  assignButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: COLORS.primary,
  },
  assignButtonText: {
    fontSize: 14,
    color: COLORS.primary,
    fontWeight: "500",
    marginRight: 8,
  },
  pickerContainer: {
    marginTop: 8,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: COLORS.gray[200],
    borderRadius: 8,
    backgroundColor: COLORS.white,
  },
  pickerItem: {
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.gray[200],
  },
  pickerItemActive: {
    backgroundColor: COLORS.gray[100],
  },
  pickerItemText: {
    fontSize: 14,
    color: COLORS.darkGray,
  },
  pickerItemTextActive: {
    fontWeight: "500",
  },
  pickerItemSubtext: {
    fontSize: 12,
    color: COLORS.gray[500],
    marginTop: 2,
  },
  materialsHeader: {
    flexDirection: "row",
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.gray[200],
    marginBottom: 8,
  },
  materialHeaderText: {
    fontSize: 14,
    fontWeight: "500",
    color: COLORS.darkGray,
  },
  materialItem: {
    flexDirection: "row",
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.gray[200],
  },
  materialText: {
    fontSize: 14,
    color: COLORS.darkGray,
  },
  costSummary: {
    marginTop: 16,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: COLORS.gray[200],
  },
  costRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  costLabel: {
    fontSize: 14,
    fontWeight: "500",
    color: COLORS.darkGray,
  },
  costValue: {
    fontSize: 14,
    color: COLORS.darkGray,
  },
  photoList: {
    flexDirection: "row",
  },
  photoItem: {
    marginRight: 12,
  },
  photo: {
    width: 120,
    height: 120,
    borderRadius: 8,
    backgroundColor: COLORS.gray[200],
  },
  emptyContainer: {
    alignItems: "center",
    justifyContent: "center",
    padding: 24,
  },
  emptyText: {
    fontSize: 14,
    color: COLORS.gray[500],
    fontStyle: "italic",
    textAlign: "center",
    paddingVertical: 16,
  },
  notesList: {
    marginBottom: 16,
  },
  noteItem: {
    marginBottom: 16,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.gray[200],
  },
  noteHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  noteName: {
    fontSize: 14,
    fontWeight: "500",
    color: COLORS.darkGray,
  },
  noteDate: {
    fontSize: 12,
    color: COLORS.gray[500],
  },
  noteText: {
    fontSize: 14,
    color: COLORS.darkGray,
    lineHeight: 20,
  },
  addNoteContainer: {
    marginTop: 16,
  },
  addNoteInput: {
    borderWidth: 1,
    borderColor: COLORS.gray[200],
    borderRadius: 8,
    padding: 12,
    fontSize: 14,
    color: COLORS.darkGray,
    minHeight: 80,
    textAlignVertical: "top",
  },
  addNoteButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: COLORS.primary,
    borderRadius: 8,
    paddingVertical: 12,
    marginTop: 12,
  },
  addNoteButtonText: {
    fontSize: 16,
    fontWeight: "500",
    color: COLORS.white,
    marginLeft: 8,
  },
  completeButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: COLORS.success,
    borderRadius: 8,
    paddingVertical: 12,
    marginHorizontal: 16,
    marginTop: 16,
    marginBottom: 24,
  },
  completeButtonText: {
    fontSize: 16,
    fontWeight: "500",
    color: COLORS.white,
    marginLeft: 8,
  },
  disabledButton: {
    opacity: 0.7,
  },
})

export default WorkOrderDetailScreen

