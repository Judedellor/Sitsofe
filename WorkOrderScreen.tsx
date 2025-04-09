"use client"

import { useState, useEffect } from "react"
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  TextInput,
  ActivityIndicator,
  Alert,
  ScrollView,
  ColorValue,
} from "react-native"
import { SafeAreaView } from "react-native-safe-area-context"
import { COLORS } from "../constants/colors"
import { Ionicons } from "@expo/vector-icons"
import { useNavigation } from "@react-navigation/native"
import { useAuth } from "../context/AuthContext"
import { StackNavigationProp } from "@react-navigation/stack"

// Define navigation types
type RootStackParamList = {
  WorkOrderDetail: { workOrderId: string };
  CreateWorkOrder: undefined;
  Main: undefined;
};

type WorkOrderScreenNavigationProp = StackNavigationProp<RootStackParamList>;

// Work order statuses
const WORK_ORDER_STATUSES = {
  NEW: "new",
  ASSIGNED: "assigned",
  IN_PROGRESS: "in_progress",
  ON_HOLD: "on_hold",
  COMPLETED: "completed",
  CANCELLED: "cancelled",
}

// Work order priorities
const WORK_ORDER_PRIORITIES = {
  LOW: "low",
  MEDIUM: "medium",
  HIGH: "high",
  EMERGENCY: "emergency",
}

// Define work order type
interface WorkOrder {
  id: string;
  title: string;
  description: string;
  status: string;
  priority: string;
  createdAt: string;
  updatedAt: string;
  scheduledDate: string | null;
  propertyId: string;
  propertyName: string;
  unitNumber: string;
  tenantId: string;
  tenantName: string;
  assignedTo: {
    id: string;
    name: string;
    role: string;
  } | null;
}

// Define user type
interface User {
  id: string;
  role?: "admin" | "property_manager" | "tenant" | "maintenance_staff" | "hvac_technician";
  properties?: string[];
}

// Mock work orders data
const mockWorkOrders: WorkOrder[] = [
  {
    id: "1",
    title: "Leaking Bathroom Faucet",
    description: "The bathroom sink faucet is leaking and causing water damage to the cabinet below.",
    status: WORK_ORDER_STATUSES.ASSIGNED,
    priority: WORK_ORDER_PRIORITIES.MEDIUM,
    createdAt: "2023-06-15T10:30:00Z",
    updatedAt: "2023-06-15T14:45:00Z",
    scheduledDate: "2023-06-18T09:00:00Z",
    propertyId: "1",
    propertyName: "Sunset Villa",
    unitNumber: "101",
    tenantId: "1",
    tenantName: "John Doe",
    assignedTo: {
      id: "3",
      name: "Mike Johnson",
      role: "maintenance_staff",
    },
  },
  {
    id: "2",
    title: "AC Not Cooling",
    description: "The air conditioner is running but not cooling the apartment. Temperature inside is 85°F.",
    status: WORK_ORDER_STATUSES.IN_PROGRESS,
    priority: WORK_ORDER_PRIORITIES.HIGH,
    createdAt: "2023-06-14T15:20:00Z",
    updatedAt: "2023-06-16T11:30:00Z",
    scheduledDate: "2023-06-16T13:00:00Z",
    propertyId: "1",
    propertyName: "Sunset Villa",
    unitNumber: "101",
    tenantId: "1",
    tenantName: "John Doe",
    assignedTo: {
      id: "4",
      name: "Sarah Williams",
      role: "hvac_technician",
    },
  },
  {
    id: "3",
    title: "Broken Window",
    description: "The window in the living room is cracked and needs to be replaced.",
    status: WORK_ORDER_STATUSES.NEW,
    priority: WORK_ORDER_PRIORITIES.MEDIUM,
    createdAt: "2023-06-16T09:15:00Z",
    updatedAt: "2023-06-16T09:15:00Z",
    scheduledDate: null,
    propertyId: "1",
    propertyName: "Sunset Villa",
    unitNumber: "101",
    tenantId: "1",
    tenantName: "John Doe",
    assignedTo: null,
  },
  {
    id: "4",
    title: "Garbage Disposal Not Working",
    description: "The garbage disposal in the kitchen sink is not turning on.",
    status: WORK_ORDER_STATUSES.COMPLETED,
    priority: WORK_ORDER_PRIORITIES.LOW,
    createdAt: "2023-06-10T16:45:00Z",
    updatedAt: "2023-06-12T15:30:00Z",
    scheduledDate: "2023-06-12T10:00:00Z",
    propertyId: "1",
    propertyName: "Sunset Villa",
    unitNumber: "101",
    tenantId: "1",
    tenantName: "John Doe",
    assignedTo: {
      id: "3",
      name: "Mike Johnson",
      role: "maintenance_staff",
    },
  },
  {
    id: "5",
    title: "Smoke Detector Beeping",
    description: "The smoke detector in the hallway is beeping intermittently.",
    status: WORK_ORDER_STATUSES.COMPLETED,
    priority: WORK_ORDER_PRIORITIES.MEDIUM,
    createdAt: "2023-06-08T11:20:00Z",
    updatedAt: "2023-06-09T13:15:00Z",
    scheduledDate: "2023-06-09T10:00:00Z",
    propertyId: "2",
    propertyName: "Downtown Loft",
    unitNumber: "205",
    tenantId: "2",
    tenantName: "Jane Smith",
    assignedTo: {
      id: "3",
      name: "Mike Johnson",
      role: "maintenance_staff",
    },
  },
]

const WorkOrderScreen = () => {
  const navigation = useNavigation<WorkOrderScreenNavigationProp>()
  const { user, hasPermission } = useAuth() as { user: User | null, hasPermission: (permission: string) => boolean }

  const [workOrders, setWorkOrders] = useState<WorkOrder[]>([])
  const [filteredWorkOrders, setFilteredWorkOrders] = useState<WorkOrder[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [priorityFilter, setPriorityFilter] = useState("all")

  // Load work orders
  useEffect(() => {
    const loadWorkOrders = async () => {
      try {
        // In a real app, you would fetch from your API
        await new Promise((resolve) => setTimeout(resolve, 1000)) // Simulate API call

        // Filter work orders based on user role
        let userWorkOrders = [...mockWorkOrders]

        if (user?.role === "tenant") {
          userWorkOrders = mockWorkOrders.filter((wo) => wo.tenantId === user.id)
        } else if (user?.role === "maintenance_staff" || user?.role === "hvac_technician") {
          userWorkOrders = mockWorkOrders.filter((wo) => wo.assignedTo?.id === user.id)
        } else if (user?.role === "property_manager" && user?.properties) {
          userWorkOrders = mockWorkOrders.filter((wo) => user.properties?.includes(wo.propertyId))
        }

        setWorkOrders(userWorkOrders)
        setFilteredWorkOrders(userWorkOrders)
      } catch (error) {
        console.error("Error loading work orders:", error)
        Alert.alert("Error", "Failed to load work orders. Please try again.")
      } finally {
        setIsLoading(false)
      }
    }

    loadWorkOrders()
  }, [user])

  // Filter work orders when search query or filters change
  useEffect(() => {
    let filtered = [...workOrders]

    // Apply search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      filtered = filtered.filter(
        (wo) =>
          wo.title.toLowerCase().includes(query) ||
          wo.description.toLowerCase().includes(query) ||
          wo.propertyName.toLowerCase().includes(query) ||
          wo.tenantName.toLowerCase().includes(query),
      )
    }

    // Apply status filter
    if (statusFilter !== "all") {
      filtered = filtered.filter((wo) => wo.status === statusFilter)
    }

    // Apply priority filter
    if (priorityFilter !== "all") {
      filtered = filtered.filter((wo) => wo.priority === priorityFilter)
    }

    setFilteredWorkOrders(filtered)
  }, [searchQuery, statusFilter, priorityFilter, workOrders])

  // Get status color
  const getStatusColor = (status: string): string => {
    switch (status) {
      case WORK_ORDER_STATUSES.NEW:
        return COLORS.info
      case WORK_ORDER_STATUSES.ASSIGNED:
        return COLORS.primary
      case WORK_ORDER_STATUSES.IN_PROGRESS:
        return COLORS.warning
      case WORK_ORDER_STATUSES.ON_HOLD:
        return COLORS.gray[400]
      case WORK_ORDER_STATUSES.COMPLETED:
        return COLORS.success
      case WORK_ORDER_STATUSES.CANCELLED:
        return COLORS.error
      default:
        return COLORS.gray[400]
    }
  }

  // Get priority color
  const getPriorityColor = (priority: string): string => {
    switch (priority) {
      case WORK_ORDER_PRIORITIES.LOW:
        return COLORS.success
      case WORK_ORDER_PRIORITIES.MEDIUM:
        return COLORS.warning
      case WORK_ORDER_PRIORITIES.HIGH:
        return COLORS.error
      case WORK_ORDER_PRIORITIES.EMERGENCY:
        return "#FF0000" // Bright red for emergencies
      default:
        return COLORS.gray[400]
    }
  }

  // Format date
  const formatDate = (dateString: string | null): string => {
    if (!dateString) return "Not scheduled"

    const date = new Date(dateString)
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    })
  }

  // Handle work order press
  const handleWorkOrderPress = (workOrder: WorkOrder) => {
    navigation.navigate("WorkOrderDetail", { workOrderId: workOrder.id })
  }

  // Render work order item
  const renderWorkOrderItem = ({ item }: { item: WorkOrder }) => (
    <TouchableOpacity style={styles.workOrderCard} onPress={() => handleWorkOrderPress(item)}>
      <View style={styles.workOrderHeader}>
        <View style={styles.workOrderInfo}>
          <Text style={styles.workOrderTitle} numberOfLines={1}>
            {item.title}
          </Text>
          <View style={styles.workOrderMeta}>
            <Text style={styles.workOrderProperty} numberOfLines={1}>
              {item.propertyName} {item.unitNumber ? `#${item.unitNumber}` : ""}
            </Text>
            <Text style={styles.workOrderDot}>•</Text>
            <Text style={styles.workOrderTenant}>{item.tenantName}</Text>
          </View>
        </View>

        <View style={[styles.statusBadge, { backgroundColor: getStatusColor(item.status) }]}>
          <Text style={styles.statusText}>
            {item.status.replace(/_/g, " ").replace(/\b\w/g, (l: string) => l.toUpperCase())}
          </Text>
        </View>
      </View>

      <Text style={styles.workOrderDescription} numberOfLines={2}>
        {item.description}
      </Text>

      <View style={styles.workOrderFooter}>
        <View style={styles.workOrderDetail}>
          <Ionicons name="calendar-outline" size={16} color={COLORS.gray[500]} style={styles.workOrderIcon} />
          <Text style={styles.workOrderDetailText}>
            {item.scheduledDate ? formatDate(item.scheduledDate) : "Not scheduled"}
          </Text>
        </View>

        <View style={styles.workOrderDetail}>
          <Ionicons
            name="alert-circle-outline"
            size={16}
            color={getPriorityColor(item.priority)}
            style={styles.workOrderIcon}
          />
          <Text style={[styles.workOrderDetailText, { color: getPriorityColor(item.priority) }]}>
            {item.priority.charAt(0).toUpperCase() + item.priority.slice(1)} Priority
          </Text>
        </View>

        {item.assignedTo ? (
          <View style={styles.workOrderDetail}>
            <Ionicons name="person-outline" size={16} color={COLORS.gray[500]} style={styles.workOrderIcon} />
            <Text style={styles.workOrderDetailText}>{item.assignedTo.name}</Text>
          </View>
        ) : (
          <View style={styles.workOrderDetail}>
            <Ionicons name="person-outline" size={16} color={COLORS.gray[500]} style={styles.workOrderIcon} />
            <Text style={styles.workOrderDetailText}>Unassigned</Text>
          </View>
        )}
      </View>
    </TouchableOpacity>
  )

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color={COLORS.darkGray} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Work Orders</Text>

        {hasPermission("manage_work_orders") && (
          <TouchableOpacity style={styles.headerButton} onPress={() => navigation.navigate("CreateWorkOrder")}>
            <Ionicons name="add" size={24} color={COLORS.primary} />
          </TouchableOpacity>
        )}
      </View>

      <View style={styles.searchContainer}>
        <Ionicons name="search" size={20} color={COLORS.gray[500]} style={styles.searchIcon} />
        <TextInput
          style={styles.searchInput}
          value={searchQuery}
          onChangeText={setSearchQuery}
          placeholder="Search work orders..."
        />
        {searchQuery ? (
          <TouchableOpacity style={styles.clearButton} onPress={() => setSearchQuery("")}>
            <Ionicons name="close-circle" size={20} color={COLORS.gray[500]} />
          </TouchableOpacity>
        ) : null}
      </View>

      <View style={styles.filtersContainer}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          <Text style={styles.filterLabel}>Status:</Text>
          <TouchableOpacity
            style={[styles.filterChip, statusFilter === "all" && styles.activeFilterChip]}
            onPress={() => setStatusFilter("all")}
          >
            <Text style={[styles.filterText, statusFilter === "all" && styles.activeFilterText]}>All</Text>
          </TouchableOpacity>

          {Object.values(WORK_ORDER_STATUSES).map((status) => (
            <TouchableOpacity
              key={status}
              style={[
                styles.filterChip,
                statusFilter === status && styles.activeFilterChip,
                statusFilter === status && { backgroundColor: getStatusColor(status) },
              ]}
              onPress={() => setStatusFilter(status)}
            >
              <Text style={[styles.filterText, statusFilter === status && styles.activeFilterText]}>
                {status.replace(/_/g, " ").replace(/\b\w/g, (l: string) => l.toUpperCase())}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.secondaryFilters}>
          <Text style={styles.filterLabel}>Priority:</Text>
          <TouchableOpacity
            style={[styles.filterChip, priorityFilter === "all" && styles.activeFilterChip]}
            onPress={() => setPriorityFilter("all")}
          >
            <Text style={[styles.filterText, priorityFilter === "all" && styles.activeFilterText]}>All</Text>
          </TouchableOpacity>

          {Object.values(WORK_ORDER_PRIORITIES).map((priority) => (
            <TouchableOpacity
              key={priority}
              style={[
                styles.filterChip,
                priorityFilter === priority && styles.activeFilterChip,
                priorityFilter === priority && { backgroundColor: getPriorityColor(priority) },
              ]}
              onPress={() => setPriorityFilter(priority)}
            >
              <Text style={[styles.filterText, priorityFilter === priority && styles.activeFilterText]}>
                {priority.charAt(0).toUpperCase() + priority.slice(1)}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {isLoading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={COLORS.primary} />
          <Text style={styles.loadingText}>Loading work orders...</Text>
        </View>
      ) : (
        <FlatList
          data={filteredWorkOrders}
          renderItem={renderWorkOrderItem}
          keyExtractor={(item: WorkOrder) => item.id}
          contentContainerStyle={styles.workOrdersList}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Ionicons name="construct-outline" size={64} color={COLORS.gray[300]} />
              <Text style={styles.emptyTitle}>No Work Orders Found</Text>
              <Text style={styles.emptyText}>
                {searchQuery || statusFilter !== "all" || priorityFilter !== "all"
                  ? "No work orders match your search criteria."
                  : "You have no work orders yet."}
              </Text>

              {hasPermission("manage_work_orders") && (
                <TouchableOpacity style={styles.createButton} onPress={() => navigation.navigate("CreateWorkOrder")}>
                  <Text style={styles.createButtonText}>Create Work Order</Text>
                </TouchableOpacity>
              )}
            </View>
          }
        />
      )}

      {hasPermission("manage_work_orders") && !isLoading && filteredWorkOrders.length > 0 && (
        <TouchableOpacity style={styles.floatingButton} onPress={() => navigation.navigate("CreateWorkOrder")}>
          <Ionicons name="add" size={24} color={COLORS.white} />
        </TouchableOpacity>
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
    fontSize: 20,
    fontWeight: "bold",
    color: COLORS.darkGray,
  },
  headerButton: {
    padding: 4,
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: COLORS.white,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.gray[200],
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: COLORS.darkGray,
  },
  clearButton: {
    padding: 4,
  },
  filtersContainer: {
    backgroundColor: COLORS.white,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.gray[200],
  },
  filterLabel: {
    fontSize: 14,
    fontWeight: "500",
    color: COLORS.darkGray,
    marginRight: 8,
    alignSelf: "center",
  },
  filterChip: {
    backgroundColor: COLORS.background,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    marginRight: 8,
  },
  activeFilterChip: {
    backgroundColor: COLORS.primary,
  },
  filterText: {
    fontSize: 14,
    color: COLORS.darkGray,
  },
  activeFilterText: {
    color: COLORS.white,
  },
  secondaryFilters: {
    marginTop: 8,
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
  workOrdersList: {
    padding: 16,
    paddingBottom: 80, // Extra space for floating button
  },
  workOrderCard: {
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
  workOrderHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 8,
  },
  workOrderInfo: {
    flex: 1,
    marginRight: 8,
  },
  workOrderTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: COLORS.darkGray,
    marginBottom: 4,
  },
  workOrderMeta: {
    flexDirection: "row",
    alignItems: "center",
  },
  workOrderProperty: {
    fontSize: 14,
    color: COLORS.gray[500],
  },
  workOrderDot: {
    fontSize: 14,
    color: COLORS.gray[500],
    marginHorizontal: 4,
  },
  workOrderTenant: {
    fontSize: 14,
    color: COLORS.gray[500],
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
  workOrderDescription: {
    fontSize: 14,
    color: COLORS.darkGray,
    marginBottom: 12,
    lineHeight: 20,
  },
  workOrderFooter: {
    flexDirection: "row",
    flexWrap: "wrap",
  },
  workOrderDetail: {
    flexDirection: "row",
    alignItems: "center",
    marginRight: 16,
    marginBottom: 4,
  },
  workOrderIcon: {
    marginRight: 4,
  },
  workOrderDetailText: {
    fontSize: 12,
    color: COLORS.gray[500],
  },
  emptyContainer: {
    alignItems: "center",
    justifyContent: "center",
    padding: 32,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: COLORS.darkGray,
    marginTop: 16,
    marginBottom: 8,
  },
  emptyText: {
    fontSize: 16,
    color: COLORS.gray[500],
    textAlign: "center",
    marginBottom: 24,
  },
  createButton: {
    backgroundColor: COLORS.primary,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 8,
  },
  createButtonText: {
    color: COLORS.white,
    fontSize: 16,
    fontWeight: "600",
  },
  floatingButton: {
    position: "absolute",
    bottom: 24,
    right: 24,
    backgroundColor: COLORS.primary,
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },
})

export default WorkOrderScreen

