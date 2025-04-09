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
  ScrollView,
} from "react-native"
import { Ionicons } from "@expo/vector-icons"

// Mock data for maintenance requests
const MAINTENANCE_DATA = [
  {
    id: "1",
    title: "Leaking faucet in bathroom",
    description: "The faucet in unit A101 bathroom is constantly dripping and needs repair.",
    property: "Sunset Apartments",
    unit: "A101",
    tenant: "John Smith",
    priority: "medium",
    status: "open",
    dateCreated: "2024-05-12T10:30:00Z",
    assignedTo: "Mike Johnson",
    category: "plumbing",
  },
  {
    id: "2",
    title: "AC not cooling properly",
    description:
      "The air conditioning in unit A105 is not cooling enough. Tenant reports temperature stays above 78°F even when set to 70°F.",
    property: "Sunset Apartments",
    unit: "A105",
    tenant: "Emily Davis",
    priority: "high",
    status: "in_progress",
    dateCreated: "2024-05-11T14:45:00Z",
    assignedTo: "Mike Johnson",
    category: "hvac",
  },
  {
    id: "3",
    title: "Broken dishwasher",
    description: "Dishwasher in unit B102 is not draining properly and makes loud noise during cycle.",
    property: "Sunset Apartments",
    unit: "B102",
    tenant: "Jennifer Taylor",
    priority: "medium",
    status: "in_progress",
    dateCreated: "2024-05-10T09:15:00Z",
    assignedTo: "Sarah Wilson",
    category: "appliance",
  },
  {
    id: "4",
    title: "Smoke detector battery replacement",
    description: "Smoke detector in unit C203 is beeping intermittently and requires battery replacement.",
    property: "Ocean View Condos",
    unit: "C203",
    tenant: "Robert Brown",
    priority: "low",
    status: "open",
    dateCreated: "2024-05-14T16:20:00Z",
    assignedTo: null,
    category: "electrical",
  },
  {
    id: "5",
    title: "Broken window handle",
    description: "Window handle in the living room of unit D105 is broken and needs replacement.",
    property: "Mountain Retreat",
    unit: "D105",
    tenant: "Lisa Adams",
    priority: "low",
    status: "open",
    dateCreated: "2024-05-13T11:00:00Z",
    assignedTo: null,
    category: "general",
  },
  {
    id: "6",
    title: "Clogged toilet",
    description: "Toilet in unit E202 is clogged and requires immediate attention.",
    property: "Downtown Lofts",
    unit: "E202",
    tenant: "David Wilson",
    priority: "high",
    status: "completed",
    dateCreated: "2024-05-09T08:30:00Z",
    completedDate: "2024-05-09T13:45:00Z",
    assignedTo: "Mike Johnson",
    category: "plumbing",
  },
  {
    id: "7",
    title: "Ceiling water damage",
    description: "Water stain on the ceiling of unit F303 bedroom. Possible leak from upstairs unit.",
    property: "Riverside Apartments",
    unit: "F303",
    tenant: "Karen Martinez",
    priority: "high",
    status: "completed",
    dateCreated: "2024-05-07T15:10:00Z",
    completedDate: "2024-05-08T18:20:00Z",
    assignedTo: "Sarah Wilson",
    category: "structural",
  },
  {
    id: "8",
    title: "Refrigerator not cooling",
    description: "Refrigerator in unit G404 is not maintaining proper temperature. Food is spoiling.",
    property: "Parkside Residences",
    unit: "G404",
    tenant: "Michael Thompson",
    priority: "high",
    status: "completed",
    dateCreated: "2024-05-06T10:15:00Z",
    completedDate: "2024-05-07T14:30:00Z",
    assignedTo: "Mike Johnson",
    category: "appliance",
  },
]

// Filter Chip component
const FilterChip = ({ label, selected, onPress }) => (
  <TouchableOpacity style={[styles.filterChip, selected && styles.filterChipSelected]} onPress={onPress}>
    <Text style={[styles.filterChipText, selected && styles.filterChipTextSelected]}>{label}</Text>
  </TouchableOpacity>
)

// Maintenance Request Card component
const RequestCard = ({ request, onPress }) => {
  const getPriorityColor = (priority) => {
    switch (priority) {
      case "high":
        return "#F44336"
      case "medium":
        return "#FF9800"
      case "low":
        return "#4CAF50"
      default:
        return "#757575"
    }
  }

  const getStatusColor = (status) => {
    switch (status) {
      case "open":
        return "#2196F3"
      case "in_progress":
        return "#FF9800"
      case "completed":
        return "#4CAF50"
      default:
        return "#757575"
    }
  }

  const getStatusText = (status) => {
    switch (status) {
      case "open":
        return "Open"
      case "in_progress":
        return "In Progress"
      case "completed":
        return "Completed"
      default:
        return status
    }
  }

  const getPriorityIcon = (priority) => {
    switch (priority) {
      case "high":
        return "alert-circle"
      case "medium":
        return "alert"
      case "low":
        return "information-circle"
      default:
        return "help-circle"
    }
  }

  const formatDate = (dateString) => {
    const date = new Date(dateString)
    return date.toLocaleDateString("en-US", { month: "short", day: "numeric" })
  }

  const priorityColor = getPriorityColor(request.priority)
  const statusColor = getStatusColor(request.status)

  return (
    <TouchableOpacity style={styles.requestCard} onPress={() => onPress(request)}>
      <View style={styles.cardHeader}>
        <View style={[styles.priorityIndicator, { backgroundColor: priorityColor }]}>
          <Ionicons name={getPriorityIcon(request.priority)} size={16} color="white" />
        </View>
        <Text style={styles.requestTitle} numberOfLines={1}>
          {request.title}
        </Text>
      </View>

      <View style={styles.cardContent}>
        <View style={styles.requestInfo}>
          <View style={styles.infoItem}>
            <Ionicons name="business-outline" size={16} color="#666" />
            <Text style={styles.infoText}>
              {request.property} • {request.unit}
            </Text>
          </View>
          <View style={styles.infoItem}>
            <Ionicons name="person-outline" size={16} color="#666" />
            <Text style={styles.infoText}>{request.tenant}</Text>
          </View>
          {request.assignedTo && (
            <View style={styles.infoItem}>
              <Ionicons name="construct-outline" size={16} color="#666" />
              <Text style={styles.infoText}>Assigned to {request.assignedTo}</Text>
            </View>
          )}
        </View>

        <View style={styles.cardFooter}>
          <View style={[styles.statusBadge, { backgroundColor: statusColor + "20", borderColor: statusColor }]}>
            <Text style={[styles.statusText, { color: statusColor }]}>{getStatusText(request.status)}</Text>
          </View>
          <Text style={styles.dateText}>{formatDate(request.dateCreated)}</Text>
        </View>
      </View>
    </TouchableOpacity>
  )
}

const MaintenanceScreen = ({ navigation }) => {
  const [searchQuery, setSearchQuery] = useState("")
  const [loading, setLoading] = useState(true)
  const [requests, setRequests] = useState([])
  const [filteredRequests, setFilteredRequests] = useState([])
  const [activeStatusFilter, setActiveStatusFilter] = useState("all")
  const [activePriorityFilter, setActivePriorityFilter] = useState("all")

  useEffect(() => {
    // Simulate API call to fetch maintenance requests
    const fetchRequests = () => {
      return new Promise((resolve) => {
        setTimeout(() => {
          resolve(MAINTENANCE_DATA)
        }, 1500)
      })
    }

    fetchRequests().then((data) => {
      setRequests(data)
      setFilteredRequests(data)
      setLoading(false)
    })
  }, [])

  useEffect(() => {
    filterRequests(searchQuery, activeStatusFilter, activePriorityFilter)
  }, [searchQuery, activeStatusFilter, activePriorityFilter, requests])

  const filterRequests = (query, statusFilter, priorityFilter) => {
    let results = requests

    // Apply search query filter
    if (query) {
      results = results.filter(
        (request) =>
          request.title.toLowerCase().includes(query.toLowerCase()) ||
          request.description.toLowerCase().includes(query.toLowerCase()) ||
          request.property.toLowerCase().includes(query.toLowerCase()) ||
          request.unit.toLowerCase().includes(query.toLowerCase()) ||
          request.tenant.toLowerCase().includes(query.toLowerCase()),
      )
    }

    // Apply status filter
    if (statusFilter !== "all") {
      results = results.filter((request) => request.status === statusFilter)
    }

    // Apply priority filter
    if (priorityFilter !== "all") {
      results = results.filter((request) => request.priority === priorityFilter)
    }

    setFilteredRequests(results)
  }

  const handleRequestPress = (request) => {
    // Navigate to request details screen
    alert(`Request selected: ${request.title}`)
    // In a real app, you would navigate to a detailed view:
    // navigation.navigate('MaintenanceDetails', { requestId: request.id });
  }

  const getStatusCounts = () => {
    const counts = {
      open: 0,
      in_progress: 0,
      completed: 0,
    }

    requests.forEach((request) => {
      if (counts[request.status] !== undefined) {
        counts[request.status]++
      }
    })

    return counts
  }

  const statusCounts = getStatusCounts()

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#2196F3" />
        <Text style={styles.loadingText}>Loading maintenance requests...</Text>
      </View>
    )
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Maintenance</Text>
        <TouchableOpacity style={styles.addButton}>
          <Ionicons name="add" size={24} color="white" />
        </TouchableOpacity>
      </View>

      <View style={styles.searchContainer}>
        <View style={styles.searchInput}>
          <Ionicons name="search" size={20} color="#666" style={styles.searchIcon} />
          <TextInput
            placeholder="Search requests..."
            value={searchQuery}
            onChangeText={setSearchQuery}
            style={styles.input}
            clearButtonMode="while-editing"
          />
        </View>
      </View>

      <View style={styles.stats}>
        <View style={styles.statCard}>
          <Text style={styles.statValue}>{statusCounts.open}</Text>
          <Text style={styles.statLabel}>Open</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statValue}>{statusCounts.in_progress}</Text>
          <Text style={styles.statLabel}>In Progress</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statValue}>{statusCounts.completed}</Text>
          <Text style={styles.statLabel}>Completed</Text>
        </View>
      </View>

      <View style={styles.filtersContainer}>
        <Text style={styles.filterTitle}>Status:</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.filtersScroll}>
          <FilterChip
            label="All"
            selected={activeStatusFilter === "all"}
            onPress={() => setActiveStatusFilter("all")}
          />
          <FilterChip
            label="Open"
            selected={activeStatusFilter === "open"}
            onPress={() => setActiveStatusFilter("open")}
          />
          <FilterChip
            label="In Progress"
            selected={activeStatusFilter === "in_progress"}
            onPress={() => setActiveStatusFilter("in_progress")}
          />
          <FilterChip
            label="Completed"
            selected={activeStatusFilter === "completed"}
            onPress={() => setActiveStatusFilter("completed")}
          />
        </ScrollView>
      </View>

      <View style={styles.filtersContainer}>
        <Text style={styles.filterTitle}>Priority:</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.filtersScroll}>
          <FilterChip
            label="All"
            selected={activePriorityFilter === "all"}
            onPress={() => setActivePriorityFilter("all")}
          />
          <FilterChip
            label="High"
            selected={activePriorityFilter === "high"}
            onPress={() => setActivePriorityFilter("high")}
          />
          <FilterChip
            label="Medium"
            selected={activePriorityFilter === "medium"}
            onPress={() => setActivePriorityFilter("medium")}
          />
          <FilterChip
            label="Low"
            selected={activePriorityFilter === "low"}
            onPress={() => setActivePriorityFilter("low")}
          />
        </ScrollView>
      </View>

      <FlatList
        data={filteredRequests}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <RequestCard request={item} onPress={handleRequestPress} />}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Ionicons name="construct-outline" size={60} color="#ccc" />
            <Text style={styles.emptyText}>No maintenance requests found</Text>
            <Text style={styles.emptySubtext}>Try adjusting your search or filters</Text>
          </View>
        }
      />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: "#666",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "white",
    padding: 16,
    paddingTop: 50,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#333",
  },
  addButton: {
    backgroundColor: "#2196F3",
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  searchContainer: {
    padding: 16,
    backgroundColor: "white",
  },
  searchInput: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f5f5f5",
    borderRadius: 8,
    paddingHorizontal: 12,
  },
  searchIcon: {
    marginRight: 8,
  },
  input: {
    flex: 1,
    height: 42,
    fontSize: 16,
    color: "#333",
  },
  stats: {
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 16,
    backgroundColor: "white",
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  statCard: {
    flex: 1,
    alignItems: "center",
    paddingVertical: 8,
  },
  statValue: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: "#666",
  },
  filtersContainer: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: "white",
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  filterTitle: {
    fontSize: 14,
    fontWeight: "600",
    color: "#333",
    marginRight: 8,
    width: 60,
  },
  filtersScroll: {
    flexGrow: 0,
  },
  filterChip: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: "#f0f0f0",
    borderRadius: 16,
    marginRight: 8,
  },
  filterChipSelected: {
    backgroundColor: "#2196F3",
  },
  filterChipText: {
    fontSize: 14,
    color: "#666",
  },
  filterChipTextSelected: {
    color: "white",
    fontWeight: "500",
  },
  listContent: {
    padding: 16,
    paddingBottom: 80, // Extra padding at bottom for better scrolling experience
  },
  requestCard: {
    backgroundColor: "white",
    borderRadius: 12,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
    overflow: "hidden",
  },
  cardHeader: {
    flexDirection: "row",
    alignItems: "center",
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  priorityIndicator: {
    width: 24,
    height: 24,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 8,
  },
  requestTitle: {
    flex: 1,
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
  },
  cardContent: {
    padding: 12,
  },
  requestInfo: {
    marginBottom: 12,
  },
  infoItem: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 6,
  },
  infoText: {
    fontSize: 14,
    color: "#666",
    marginLeft: 6,
  },
  cardFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  statusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 4,
    borderWidth: 1,
  },
  statusText: {
    fontSize: 12,
    fontWeight: "600",
  },
  dateText: {
    fontSize: 12,
    color: "#999",
  },
  emptyContainer: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 48,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: "600",
    color: "#666",
    marginTop: 16,
  },
  emptySubtext: {
    fontSize: 14,
    color: "#999",
    marginTop: 8,
  },
})

export default MaintenanceScreen

