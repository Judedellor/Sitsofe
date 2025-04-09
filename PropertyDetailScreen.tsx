"use client"

import React, { useState } from "react"
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image, FlatList } from "react-native"
import { useSafeAreaInsets } from "react-native-safe-area-context"
import { Ionicons } from "@expo/vector-icons"
import { useNavigation, useRoute, RouteProp } from "@react-navigation/native"
import { NativeStackNavigationProp } from "@react-navigation/native-stack"
import { COLORS } from "../constants/colors"

// Define types
type RootStackParamList = {
  PropertyDetails: {
    property: Property
  }
  AddUnit: {
    propertyId: string
  }
  AddMaintenanceIssue: {
    propertyId: string
  }
}

type NavigationProp = NativeStackNavigationProp<RootStackParamList, 'PropertyDetails'>
type PropertyDetailsRouteProp = RouteProp<RootStackParamList, 'PropertyDetails'>

interface Property {
  id: string
  name: string
  address: string
  type: string
  units: number
  occupancy: string
  income: string
  image: string
  status: "active" | "maintenance"
}

interface Unit {
  id: string
  number: string
  status: "Occupied" | "Vacant" | "Maintenance"
  tenant: string
  rent: string
  nextPayment: string
}

interface MaintenanceIssue {
  id: string
  unit: string
  description: string
  priority: "High" | "Medium" | "Low"
  status: "Pending" | "In Progress" | "Completed"
  reportedDate: string
}

// Mock data for unit details
const mockUnits: Unit[] = [
  { id: "1", number: "A101", status: "Occupied", tenant: "John Smith", rent: "$1,200", nextPayment: "May 15, 2024" },
  { id: "2", number: "A102", status: "Vacant", tenant: "-", rent: "$1,150", nextPayment: "-" },
  { id: "3", number: "A103", status: "Occupied", tenant: "Jane Doe", rent: "$1,250", nextPayment: "May 18, 2024" },
  {
    id: "4",
    number: "A104",
    status: "Occupied",
    tenant: "Robert Johnson",
    rent: "$1,300",
    nextPayment: "May 20, 2024",
  },
  { id: "5", number: "B101", status: "Maintenance", tenant: "-", rent: "$1,100", nextPayment: "-" },
  {
    id: "6",
    number: "B102",
    status: "Occupied",
    tenant: "Sarah Williams",
    rent: "$1,200",
    nextPayment: "May 12, 2024",
  },
]

// Mock data for maintenance issues
const mockIssues: MaintenanceIssue[] = [
  {
    id: "1",
    unit: "A103",
    description: "Leaking faucet in bathroom",
    priority: "Medium",
    status: "In Progress",
    reportedDate: "Apr 28, 2024",
  },
  {
    id: "2",
    unit: "B101",
    description: "AC not working",
    priority: "High",
    status: "In Progress",
    reportedDate: "Apr 25, 2024",
  },
  {
    id: "3",
    unit: "A101",
    description: "Broken kitchen cabinet door",
    priority: "Low",
    status: "Pending",
    reportedDate: "May 1, 2024",
  },
]

type TabType = "overview" | "units" | "maintenance" | "financials"

const PropertyDetailScreen: React.FC = () => {
  const navigation = useNavigation<NavigationProp>()
  const route = useRoute<PropertyDetailsRouteProp>()
  const { property } = route.params
  const [activeTab, setActiveTab] = useState<TabType>("overview")

  const getStatusColor = (status: Unit["status"]): string => {
    switch (status) {
      case "Occupied":
        return COLORS.success
      case "Vacant":
        return COLORS.warning
      case "Maintenance":
        return COLORS.error
      default:
        return COLORS.gray[500]
    }
  }

  const renderOverviewTab = () => (
    <View style={styles.tabContent}>
      <View style={styles.statsRow}>
        <View style={styles.statItem}>
          <Text style={styles.statValue}>{property.units}</Text>
          <Text style={styles.statLabel}>Units</Text>
        </View>
        <View style={styles.statItem}>
          <Text style={styles.statValue}>{property.occupancy}</Text>
          <Text style={styles.statLabel}>Occupancy</Text>
        </View>
        <View style={styles.statItem}>
          <Text style={styles.statValue}>{property.income}</Text>
          <Text style={styles.statLabel}>Income</Text>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Property Details</Text>
        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>Type</Text>
          <Text style={styles.detailValue}>{property.type}</Text>
        </View>
        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>Address</Text>
          <Text style={styles.detailValue}>{property.address}</Text>
        </View>
        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>Total Units</Text>
          <Text style={styles.detailValue}>{property.units}</Text>
        </View>
        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>Year Built</Text>
          <Text style={styles.detailValue}>2005</Text>
        </View>
        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>Last Renovation</Text>
          <Text style={styles.detailValue}>2021</Text>
        </View>
        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>Property Manager</Text>
          <Text style={styles.detailValue}>Michael Johnson</Text>
        </View>
      </View>

      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Recent Activities</Text>
          <TouchableOpacity>
            <Text style={styles.viewAllText}>View All</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.activityItem}>
          <View style={styles.activityDot} />
          <View>
            <Text style={styles.activityText}>Rent collected from Unit A103</Text>
            <Text style={styles.activityTime}>2 days ago</Text>
          </View>
        </View>

        <View style={styles.activityItem}>
          <View style={styles.activityDot} />
          <View>
            <Text style={styles.activityText}>Maintenance request submitted for Unit B101</Text>
            <Text style={styles.activityTime}>5 days ago</Text>
          </View>
        </View>

        <View style={styles.activityItem}>
          <View style={styles.activityDot} />
          <View>
            <Text style={styles.activityText}>New tenant moved into Unit A102</Text>
            <Text style={styles.activityTime}>1 week ago</Text>
          </View>
        </View>
      </View>
    </View>
  )

  const renderUnitsTab = () => (
    <View style={styles.tabContent}>
      <View style={styles.filterRow}>
        <TouchableOpacity style={[styles.filterButton, styles.activeFilter]}>
          <Text style={styles.activeFilterText}>All</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.filterButton}>
          <Text style={styles.filterText}>Occupied</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.filterButton}>
          <Text style={styles.filterText}>Vacant</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.filterButton}>
          <Text style={styles.filterText}>Maintenance</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.tableHeader}>
        <Text style={[styles.tableHeaderText, { flex: 0.8 }]}>Unit</Text>
        <Text style={[styles.tableHeaderText, { flex: 1 }]}>Status</Text>
        <Text style={[styles.tableHeaderText, { flex: 1.5 }]}>Tenant</Text>
        <Text style={[styles.tableHeaderText, { flex: 1 }]}>Rent</Text>
      </View>

      {mockUnits.map((unit) => (
        <TouchableOpacity key={unit.id} style={styles.unitRow}>
          <Text style={[styles.unitText, { flex: 0.8 }]}>{unit.number}</Text>
          <View style={[styles.statusContainer, { flex: 1 }]}>
            <View style={[styles.statusDot, { backgroundColor: getStatusColor(unit.status) }]} />
            <Text style={styles.unitText}>{unit.status}</Text>
          </View>
          <Text style={[styles.unitText, { flex: 1.5 }]}>{unit.tenant}</Text>
          <Text style={[styles.unitText, { flex: 1 }]}>{unit.rent}</Text>
        </TouchableOpacity>
      ))}

      <TouchableOpacity 
        style={styles.addButton}
        onPress={() => navigation.navigate("AddUnit", { propertyId: property.id })}
      >
        <Ionicons name="add" size={20} color={COLORS.white} />
        <Text style={styles.addButtonText}>Add Unit</Text>
      </TouchableOpacity>
    </View>
  )

  const renderMaintenanceTab = () => (
    <View style={styles.tabContent}>
      <View style={styles.filterRow}>
        <TouchableOpacity style={[styles.filterButton, styles.activeFilter]}>
          <Text style={styles.activeFilterText}>All</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.filterButton}>
          <Text style={styles.filterText}>Pending</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.filterButton}>
          <Text style={styles.filterText}>In Progress</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.filterButton}>
          <Text style={styles.filterText}>Completed</Text>
        </TouchableOpacity>
      </View>

      {mockIssues.map((issue) => (
        <TouchableOpacity key={issue.id} style={styles.issueCard}>
          <View style={styles.issueHeader}>
            <Text style={styles.issueTitle}>Unit {issue.unit}</Text>
            <View
              style={[
                styles.priorityBadge,
                {
                  backgroundColor:
                    issue.priority === "High" ? COLORS.error : 
                    issue.priority === "Medium" ? COLORS.warning : 
                    COLORS.success,
                },
              ]}
            >
              <Text style={styles.priorityText}>{issue.priority}</Text>
            </View>
          </View>

          <Text style={styles.issueDescription}>{issue.description}</Text>

          <View style={styles.issueFooter}>
            <Text style={styles.issueStatus}>Status: {issue.status}</Text>
            <Text style={styles.issueDate}>Reported: {issue.reportedDate}</Text>
          </View>
        </TouchableOpacity>
      ))}

      <TouchableOpacity 
        style={styles.addButton}
        onPress={() => navigation.navigate("AddMaintenanceIssue", { propertyId: property.id })}
      >
        <Ionicons name="add" size={20} color={COLORS.white} />
        <Text style={styles.addButtonText}>Add Maintenance Issue</Text>
      </TouchableOpacity>
    </View>
  )

  const renderFinancialsTab = () => (
    <View style={styles.tabContent}>
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Financial Overview</Text>
        <View style={styles.financialStats}>
          <View style={styles.financialStat}>
            <Text style={styles.financialLabel}>Monthly Revenue</Text>
            <Text style={styles.financialValue}>$32,400</Text>
          </View>
          <View style={styles.financialStat}>
            <Text style={styles.financialLabel}>Expenses</Text>
            <Text style={styles.financialValue}>$8,500</Text>
          </View>
          <View style={styles.financialStat}>
            <Text style={styles.financialLabel}>Net Income</Text>
            <Text style={styles.financialValue}>$23,900</Text>
          </View>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Recent Transactions</Text>
        <View style={styles.transactionList}>
          <View style={styles.transactionItem}>
            <View style={styles.transactionInfo}>
              <Text style={styles.transactionTitle}>Rent Payment - Unit A103</Text>
              <Text style={styles.transactionDate}>May 1, 2024</Text>
            </View>
            <Text style={[styles.transactionAmount, { color: COLORS.success }]}>+$1,250</Text>
          </View>
          <View style={styles.transactionItem}>
            <View style={styles.transactionInfo}>
              <Text style={styles.transactionTitle}>Maintenance - Unit B101</Text>
              <Text style={styles.transactionDate}>Apr 28, 2024</Text>
            </View>
            <Text style={[styles.transactionAmount, { color: COLORS.error }]}>-$500</Text>
          </View>
          <View style={styles.transactionItem}>
            <View style={styles.transactionInfo}>
              <Text style={styles.transactionTitle}>Utilities</Text>
              <Text style={styles.transactionDate}>Apr 25, 2024</Text>
            </View>
            <Text style={[styles.transactionAmount, { color: COLORS.error }]}>-$1,200</Text>
          </View>
        </View>
      </View>
    </View>
  )

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>{property.name}</Text>
        <TouchableOpacity style={styles.editButton}>
          <Ionicons name="pencil" size={20} color={COLORS.primary} />
        </TouchableOpacity>
      </View>

      <View style={styles.tabBar}>
        <TouchableOpacity
          style={[styles.tab, activeTab === "overview" && styles.activeTab]}
          onPress={() => setActiveTab("overview")}
        >
          <Text style={[styles.tabText, activeTab === "overview" && styles.activeTabText]}>Overview</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, activeTab === "units" && styles.activeTab]}
          onPress={() => setActiveTab("units")}
        >
          <Text style={[styles.tabText, activeTab === "units" && styles.activeTabText]}>Units</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, activeTab === "maintenance" && styles.activeTab]}
          onPress={() => setActiveTab("maintenance")}
        >
          <Text style={[styles.tabText, activeTab === "maintenance" && styles.activeTabText]}>Maintenance</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, activeTab === "financials" && styles.activeTab]}
          onPress={() => setActiveTab("financials")}
        >
          <Text style={[styles.tabText, activeTab === "financials" && styles.activeTabText]}>Financials</Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content}>
        {activeTab === "overview" && renderOverviewTab()}
        {activeTab === "units" && renderUnitsTab()}
        {activeTab === "maintenance" && renderMaintenanceTab()}
        {activeTab === "financials" && renderFinancialsTab()}
      </ScrollView>
    </View>
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
    borderBottomColor: COLORS.gray[200],
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: COLORS.darkGray,
  },
  editButton: {
    padding: 8,
  },
  tabBar: {
    flexDirection: "row",
    backgroundColor: COLORS.white,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.gray[200],
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
    color: COLORS.gray[600],
  },
  activeTabText: {
    color: COLORS.primary,
    fontWeight: "600",
  },
  content: {
    flex: 1,
  },
  tabContent: {
    padding: 16,
  },
  statsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 24,
  },
  statItem: {
    flex: 1,
    alignItems: "center",
    backgroundColor: COLORS.white,
    padding: 16,
    borderRadius: 8,
    marginHorizontal: 4,
    shadowColor: COLORS.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  statValue: {
    fontSize: 20,
    fontWeight: "bold",
    color: COLORS.darkGray,
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: COLORS.gray[600],
  },
  section: {
    backgroundColor: COLORS.white,
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
    shadowColor: COLORS.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: COLORS.darkGray,
    marginBottom: 16,
  },
  viewAllText: {
    color: COLORS.primary,
    fontSize: 14,
  },
  detailRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 12,
  },
  detailLabel: {
    fontSize: 14,
    color: COLORS.gray[600],
  },
  detailValue: {
    fontSize: 14,
    color: COLORS.darkGray,
    fontWeight: "500",
  },
  activityItem: {
    flexDirection: "row",
    marginBottom: 16,
  },
  activityDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: COLORS.primary,
    marginRight: 12,
    marginTop: 6,
  },
  activityText: {
    fontSize: 14,
    color: COLORS.darkGray,
    marginBottom: 4,
  },
  activityTime: {
    fontSize: 12,
    color: COLORS.gray[500],
  },
  filterRow: {
    flexDirection: "row",
    marginBottom: 16,
  },
  filterButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 16,
    backgroundColor: COLORS.gray[100],
    marginRight: 8,
  },
  activeFilter: {
    backgroundColor: COLORS.primary,
  },
  filterText: {
    fontSize: 14,
    color: COLORS.gray[600],
  },
  activeFilterText: {
    fontSize: 14,
    color: COLORS.white,
    fontWeight: "500",
  },
  tableHeader: {
    flexDirection: "row",
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.gray[200],
    marginBottom: 8,
  },
  tableHeaderText: {
    fontSize: 14,
    fontWeight: "600",
    color: COLORS.gray[600],
  },
  unitRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.gray[100],
  },
  unitText: {
    fontSize: 14,
    color: COLORS.darkGray,
  },
  statusContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 8,
  },
  issueCard: {
    backgroundColor: COLORS.white,
    borderRadius: 8,
    padding: 16,
    marginBottom: 12,
    shadowColor: COLORS.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  issueHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  issueTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: COLORS.darkGray,
  },
  priorityBadge: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  priorityText: {
    fontSize: 12,
    color: COLORS.white,
    fontWeight: "500",
  },
  issueDescription: {
    fontSize: 14,
    color: COLORS.gray[700],
    marginBottom: 12,
  },
  issueFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  issueStatus: {
    fontSize: 12,
    color: COLORS.gray[600],
  },
  issueDate: {
    fontSize: 12,
    color: COLORS.gray[600],
  },
  addButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: COLORS.primary,
    padding: 12,
    borderRadius: 8,
    marginTop: 16,
  },
  addButtonText: {
    color: COLORS.white,
    fontSize: 16,
    fontWeight: "600",
    marginLeft: 8,
  },
  financialStats: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 24,
  },
  financialStat: {
    flex: 1,
    alignItems: "center",
  },
  financialLabel: {
    fontSize: 12,
    color: COLORS.gray[600],
    marginBottom: 4,
  },
  financialValue: {
    fontSize: 18,
    fontWeight: "600",
    color: COLORS.darkGray,
  },
  transactionList: {
    marginTop: 16,
  },
  transactionItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.gray[100],
  },
  transactionInfo: {
    flex: 1,
  },
  transactionTitle: {
    fontSize: 14,
    color: COLORS.darkGray,
    marginBottom: 4,
  },
  transactionDate: {
    fontSize: 12,
    color: COLORS.gray[500],
  },
  transactionAmount: {
    fontSize: 16,
    fontWeight: "600",
  },
})

export default PropertyDetailScreen

