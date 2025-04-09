"use client"

import { useState } from "react"
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, FlatList } from "react-native"
import { SafeAreaView } from "react-native-safe-area-context"
import { Ionicons } from "@expo/vector-icons"
import { useNavigation } from "@react-navigation/native"
import { COLORS } from "../constants/colors"
import Card from "../components/ui/Card"
import ProgressCircle from "../components/ProgressCircle"

// Mock data for predictive maintenance
const maintenanceData = {
  summary: {
    totalComponents: 48,
    healthyComponents: 35,
    warningComponents: 10,
    criticalComponents: 3,
    upcomingMaintenance: 8,
    preventiveRatio: 72,
  },
  componentHealth: [
    {
      id: "1",
      name: "HVAC System",
      property: "Modern Luxury Apartment",
      healthScore: 85,
      status: "healthy",
      lastMaintenance: "2024-01-15",
      nextMaintenance: "2024-07-15",
      estimatedLifespan: "10 years",
      installationDate: "2020-03-10",
      maintenanceHistory: [
        { date: "2024-01-15", type: "Preventive", description: "Filter replacement and system cleaning" },
        { date: "2023-07-20", type: "Preventive", description: "Annual inspection and maintenance" },
        { date: "2022-12-05", type: "Repair", description: "Thermostat replacement" },
      ],
    },
    {
      id: "2",
      name: "Water Heater",
      property: "Downtown Penthouse",
      healthScore: 65,
      status: "warning",
      lastMaintenance: "2023-11-10",
      nextMaintenance: "2024-05-10",
      estimatedLifespan: "8 years",
      installationDate: "2018-06-15",
      maintenanceHistory: [
        { date: "2023-11-10", type: "Preventive", description: "Anode rod replacement" },
        { date: "2023-05-22", type: "Preventive", description: "Flush and inspection" },
        { date: "2022-08-14", type: "Repair", description: "Pressure relief valve replacement" },
      ],
    },
    {
      id: "3",
      name: "Elevator",
      property: "Downtown Penthouse",
      healthScore: 35,
      status: "critical",
      lastMaintenance: "2023-09-05",
      nextMaintenance: "2024-04-15",
      estimatedLifespan: "15 years",
      installationDate: "2015-02-20",
      maintenanceHistory: [
        { date: "2023-09-05", type: "Repair", description: "Motor replacement" },
        { date: "2023-04-18", type: "Preventive", description: "Annual inspection and maintenance" },
        { date: "2022-11-30", type: "Repair", description: "Door sensor replacement" },
      ],
    },
    {
      id: "4",
      name: "Roof",
      property: "Suburban Family Home",
      healthScore: 75,
      status: "warning",
      lastMaintenance: "2023-08-12",
      nextMaintenance: "2024-08-12",
      estimatedLifespan: "20 years",
      installationDate: "2012-05-10",
      maintenanceHistory: [
        { date: "2023-08-12", type: "Preventive", description: "Inspection and minor repairs" },
        { date: "2022-07-25", type: "Repair", description: "Shingle replacement (partial)" },
        { date: "2021-09-15", type: "Preventive", description: "Gutter cleaning and inspection" },
      ],
    },
    {
      id: "5",
      name: "Plumbing System",
      property: "Cozy Studio Loft",
      healthScore: 90,
      status: "healthy",
      lastMaintenance: "2024-02-20",
      nextMaintenance: "2024-08-20",
      estimatedLifespan: "25 years",
      installationDate: "2019-11-05",
      maintenanceHistory: [
        { date: "2024-02-20", type: "Preventive", description: "Inspection and leak check" },
        { date: "2023-08-15", type: "Preventive", description: "Water pressure test" },
        { date: "2022-12-10", type: "Repair", description: "Faucet replacement" },
      ],
    },
  ],
  upcomingMaintenance: [
    {
      id: "1",
      component: "Elevator",
      property: "Downtown Penthouse",
      dueDate: "2024-04-15",
      maintenanceType: "Preventive",
      estimatedCost: 1200,
      priority: "high",
      healthScore: 35,
    },
    {
      id: "2",
      component: "Water Heater",
      property: "Downtown Penthouse",
      dueDate: "2024-05-10",
      maintenanceType: "Preventive",
      estimatedCost: 350,
      priority: "medium",
      healthScore: 65,
    },
    {
      id: "3",
      component: "Fire Alarm System",
      property: "Modern Luxury Apartment",
      dueDate: "2024-05-15",
      maintenanceType: "Preventive",
      estimatedCost: 500,
      priority: "medium",
      healthScore: 80,
    },
    {
      id: "4",
      component: "Pool Equipment",
      property: "Beachfront Villa",
      dueDate: "2024-05-20",
      maintenanceType: "Preventive",
      estimatedCost: 450,
      priority: "low",
      healthScore: 75,
    },
    {
      id: "5",
      component: "Garage Door",
      property: "Suburban Family Home",
      dueDate: "2024-06-01",
      maintenanceType: "Preventive",
      estimatedCost: 200,
      priority: "low",
      healthScore: 85,
    },
  ],
  recentAlerts: [
    {
      id: "1",
      component: "Elevator",
      property: "Downtown Penthouse",
      date: "2024-04-02",
      description: "Unusual noise detected during operation",
      severity: "high",
      status: "open",
    },
    {
      id: "2",
      component: "Water Heater",
      property: "Downtown Penthouse",
      date: "2024-03-28",
      description: "Pressure fluctuations detected",
      severity: "medium",
      status: "open",
    },
    {
      id: "3",
      component: "HVAC System",
      property: "Cozy Studio Loft",
      date: "2024-03-25",
      description: "Efficiency decrease detected",
      severity: "low",
      status: "resolved",
    },
    {
      id: "4",
      component: "Roof",
      property: "Suburban Family Home",
      date: "2024-03-20",
      description: "Potential leak detected after heavy rain",
      severity: "medium",
      status: "in_progress",
    },
  ],
}

const PredictiveMaintenanceScreen = () => {
  const navigation = useNavigation()
  const [activeTab, setActiveTab] = useState("overview")
  const [selectedStatus, setSelectedStatus] = useState("all")

  // Format date
  const formatDate = (dateString) => {
    const options = { year: "numeric", month: "short", day: "numeric" }
    return new Date(dateString).toLocaleDateString(undefined, options)
  }

  // Get status color
  const getStatusColor = (status) => {
    switch (status) {
      case "healthy":
        return COLORS.success
      case "warning":
        return COLORS.warning
      case "critical":
        return COLORS.error
      default:
        return COLORS.gray
    }
  }

  // Get priority color
  const getPriorityColor = (priority) => {
    switch (priority) {
      case "high":
        return COLORS.error
      case "medium":
        return COLORS.warning
      case "low":
        return COLORS.success
      default:
        return COLORS.gray
    }
  }

  // Get severity color
  const getSeverityColor = (severity) => {
    switch (severity) {
      case "high":
        return COLORS.error
      case "medium":
        return COLORS.warning
      case "low":
        return COLORS.success
      default:
        return COLORS.gray
    }
  }

  // Get alert status color
  const getAlertStatusColor = (status) => {
    switch (status) {
      case "open":
        return COLORS.error
      case "in_progress":
        return COLORS.warning
      case "resolved":
        return COLORS.success
      default:
        return COLORS.gray
    }
  }

  // Filter components by status
  const filteredComponents =
    selectedStatus === "all"
      ? maintenanceData.componentHealth
      : maintenanceData.componentHealth.filter((component) => component.status === selectedStatus)

  // Render overview tab
  const renderOverviewTab = () => (
    <>
      <Card title="Maintenance Health Summary" elevated>
        <View style={styles.summaryContainer}>
          <View style={styles.summaryChart}>
            <ProgressCircle
              percentage={maintenanceData.summary.preventiveRatio}
              radius={70}
              strokeWidth={12}
              color={COLORS.primary}
              textColor={COLORS.darkGray}
            />
            <Text style={styles.summaryChartLabel}>Preventive Ratio</Text>
          </View>
          <View style={styles.summaryStats}>
            <View style={styles.statItem}>
              <View style={[styles.statIndicator, { backgroundColor: COLORS.success }]} />
              <Text style={styles.statLabel}>Healthy</Text>
              <Text style={styles.statValue}>{maintenanceData.summary.healthyComponents}</Text>
            </View>
            <View style={styles.statItem}>
              <View style={[styles.statIndicator, { backgroundColor: COLORS.warning }]} />
              <Text style={styles.statLabel}>Warning</Text>
              <Text style={styles.statValue}>{maintenanceData.summary.warningComponents}</Text>
            </View>
            <View style={styles.statItem}>
              <View style={[styles.statIndicator, { backgroundColor: COLORS.error }]} />
              <Text style={styles.statLabel}>Critical</Text>
              <Text style={styles.statValue}>{maintenanceData.summary.criticalComponents}</Text>
            </View>
            <View style={styles.statItem}>
              <View style={[styles.statIndicator, { backgroundColor: COLORS.primary }]} />
              <Text style={styles.statLabel}>Upcoming</Text>
              <Text style={styles.statValue}>{maintenanceData.summary.upcomingMaintenance}</Text>
            </View>
          </View>
        </View>
      </Card>

      <Card
        title="Critical Components"
        headerRight={
          <TouchableOpacity
            onPress={() => {
              setActiveTab("components")
              setSelectedStatus("critical")
            }}
          >
            <Text style={styles.viewMoreText}>View All</Text>
          </TouchableOpacity>
        }
        elevated
      >
        {maintenanceData.componentHealth
          .filter((component) => component.status === "critical")
          .map((component) => (
            <TouchableOpacity
              key={component.id}
              style={styles.componentItem}
              onPress={() => navigation.navigate("ComponentDetail" as never, { componentId: component.id })}
            >
              <View style={styles.componentHeader}>
                <Text style={styles.componentName}>{component.name}</Text>
                <View style={[styles.componentStatus, { backgroundColor: getStatusColor(component.status) }]}>
                  <Text style={styles.componentStatusText}>{component.status.toUpperCase()}</Text>
                </View>
              </View>
              <Text style={styles.componentProperty}>{component.property}</Text>
              <View style={styles.componentHealthContainer}>
                <Text style={styles.componentHealthLabel}>Health Score:</Text>
                <View style={styles.componentHealthBar}>
                  <View
                    style={[
                      styles.componentHealthFill,
                      {
                        width: `${component.healthScore}%`,
                        backgroundColor: getStatusColor(component.status),
                      },
                    ]}
                  />
                </View>
                <Text style={styles.componentHealthScore}>{component.healthScore}%</Text>
              </View>
              <View style={styles.componentFooter}>
                <Text style={styles.componentMaintenance}>
                  Next Maintenance: {formatDate(component.nextMaintenance)}
                </Text>
              </View>
            </TouchableOpacity>
          ))}
      </Card>

      <Card
        title="Upcoming Maintenance"
        headerRight={
          <TouchableOpacity onPress={() => navigation.navigate("MaintenanceSchedule" as never)}>
            <Text style={styles.viewMoreText}>View All</Text>
          </TouchableOpacity>
        }
        elevated
      >
        {maintenanceData.upcomingMaintenance.slice(0, 3).map((maintenance) => (
          <TouchableOpacity
            key={maintenance.id}
            style={styles.maintenanceItem}
            onPress={() => navigation.navigate("MaintenanceDetail" as never, { maintenanceId: maintenance.id })}
          >
            <View style={styles.maintenanceHeader}>
              <Text style={styles.maintenanceComponent}>{maintenance.component}</Text>
              <View style={[styles.priorityBadge, { backgroundColor: getPriorityColor(maintenance.priority) }]}>
                <Text style={styles.priorityText}>{maintenance.priority.toUpperCase()}</Text>
              </View>
            </View>
            <Text style={styles.maintenanceProperty}>{maintenance.property}</Text>
            <View style={styles.maintenanceDetails}>
              <View style={styles.maintenanceDetail}>
                <Text style={styles.maintenanceDetailLabel}>Due Date:</Text>
                <Text style={styles.maintenanceDetailValue}>{formatDate(maintenance.dueDate)}</Text>
              </View>
              <View style={styles.maintenanceDetail}>
                <Text style={styles.maintenanceDetailLabel}>Type:</Text>
                <Text style={styles.maintenanceDetailValue}>{maintenance.maintenanceType}</Text>
              </View>
              <View style={styles.maintenanceDetail}>
                <Text style={styles.maintenanceDetailLabel}>Est. Cost:</Text>
                <Text style={styles.maintenanceDetailValue}>${maintenance.estimatedCost}</Text>
              </View>
            </View>
          </TouchableOpacity>
        ))}
      </Card>

      <Card
        title="Recent Alerts"
        headerRight={
          <TouchableOpacity onPress={() => navigation.navigate("MaintenanceAlerts" as never)}>
            <Text style={styles.viewMoreText}>View All</Text>
          </TouchableOpacity>
        }
        elevated
      >
        {maintenanceData.recentAlerts.slice(0, 3).map((alert) => (
          <TouchableOpacity
            key={alert.id}
            style={styles.alertItem}
            onPress={() => navigation.navigate("AlertDetail" as never, { alertId: alert.id })}
          >
            <View style={styles.alertHeader}>
              <View style={styles.alertSeverity}>
                <Ionicons
                  name={
                    alert.severity === "high"
                      ? "warning"
                      : alert.severity === "medium"
                        ? "alert-circle"
                        : "information-circle"
                  }
                  size={20}
                  color={getSeverityColor(alert.severity)}
                />
                <Text style={[styles.alertSeverityText, { color: getSeverityColor(alert.severity) }]}>
                  {alert.severity.toUpperCase()}
                </Text>
              </View>
              <View style={[styles.alertStatus, { backgroundColor: getAlertStatusColor(alert.status) }]}>
                <Text style={styles.alertStatusText}>
                  {alert.status === "in_progress" ? "IN PROGRESS" : alert.status.toUpperCase()}
                </Text>
              </View>
            </View>
            <Text style={styles.alertComponent}>
              {alert.component} - {alert.property}
            </Text>
            <Text style={styles.alertDescription}>{alert.description}</Text>
            <Text style={styles.alertDate}>Detected: {formatDate(alert.date)}</Text>
          </TouchableOpacity>
        ))}
      </Card>

      <View style={styles.actionButtons}>
        <TouchableOpacity
          style={styles.actionButton}
          onPress={() => navigation.navigate("ScheduleMaintenance" as never)}
        >
          <View style={styles.actionButtonIcon}>
            <Ionicons name="calendar" size={24} color={COLORS.white} />
          </View>
          <Text style={styles.actionButtonText}>Schedule</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.actionButton} onPress={() => navigation.navigate("AddComponent" as never)}>
          <View style={styles.actionButtonIcon}>
            <Ionicons name="add-circle" size={24} color={COLORS.white} />
          </View>
          <Text style={styles.actionButtonText}>Add Component</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.actionButton}
          onPress={() => navigation.navigate("MaintenanceReports" as never)}
        >
          <View style={styles.actionButtonIcon}>
            <Ionicons name="document-text" size={24} color={COLORS.white} />
          </View>
          <Text style={styles.actionButtonText}>Reports</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.actionButton}
          onPress={() => navigation.navigate("MaintenanceSettings" as never)}
        >
          <View style={styles.actionButtonIcon}>
            <Ionicons name="settings" size={24} color={COLORS.white} />
          </View>
          <Text style={styles.actionButtonText}>Settings</Text>
        </TouchableOpacity>
      </View>
    </>
  )

  // Render components tab
  const renderComponentsTab = () => (
    <>
      <View style={styles.filterContainer}>
        <TouchableOpacity
          style={[styles.filterButton, selectedStatus === "all" && styles.activeFilter]}
          onPress={() => setSelectedStatus("all")}
        >
          <Text style={[styles.filterText, selectedStatus === "all" && styles.activeFilterText]}>All</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.filterButton, selectedStatus === "healthy" && styles.activeFilter]}
          onPress={() => setSelectedStatus("healthy")}
        >
          <Text style={[styles.filterText, selectedStatus === "healthy" && styles.activeFilterText]}>Healthy</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.filterButton, selectedStatus === "warning" && styles.activeFilter]}
          onPress={() => setSelectedStatus("warning")}
        >
          <Text style={[styles.filterText, selectedStatus === "warning" && styles.activeFilterText]}>Warning</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.filterButton, selectedStatus === "critical" && styles.activeFilter]}
          onPress={() => setSelectedStatus("critical")}
        >
          <Text style={[styles.filterText, selectedStatus === "critical" && styles.activeFilterText]}>Critical</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={filteredComponents}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.componentCard}
            onPress={() => navigation.navigate("ComponentDetail" as never, { componentId: item.id })}
          >
            <View style={styles.componentHeader}>
              <Text style={styles.componentName}>{item.name}</Text>
              <View style={[styles.componentStatus, { backgroundColor: getStatusColor(item.status) }]}>
                <Text style={styles.componentStatusText}>{item.status.toUpperCase()}</Text>
              </View>
            </View>
            <Text style={styles.componentProperty}>{item.property}</Text>
            <View style={styles.componentHealthContainer}>
              <Text style={styles.componentHealthLabel}>Health Score:</Text>
              <View style={styles.componentHealthBar}>
                <View
                  style={[
                    styles.componentHealthFill,
                    {
                      width: `${item.healthScore}%`,
                      backgroundColor: getStatusColor(item.status),
                    },
                  ]}
                />
              </View>
              <Text style={styles.componentHealthScore}>{item.healthScore}%</Text>
            </View>
            <View style={styles.componentDetails}>
              <View style={styles.componentDetail}>
                <Text style={styles.componentDetailLabel}>Last Maintenance:</Text>
                <Text style={styles.componentDetailValue}>{formatDate(item.lastMaintenance)}</Text>
              </View>
              <View style={styles.componentDetail}>
                <Text style={styles.componentDetailLabel}>Next Maintenance:</Text>
                <Text style={styles.componentDetailValue}>{formatDate(item.nextMaintenance)}</Text>
              </View>
              <View style={styles.componentDetail}>
                <Text style={styles.componentDetailLabel}>Installation Date:</Text>
                <Text style={styles.componentDetailValue}>{formatDate(item.installationDate)}</Text>
              </View>
              <View style={styles.componentDetail}>
                <Text style={styles.componentDetailLabel}>Estimated Lifespan:</Text>
                <Text style={styles.componentDetailValue}>{item.estimatedLifespan}</Text>
              </View>
            </View>
          </TouchableOpacity>
        )}
        contentContainerStyle={styles.componentsList}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Ionicons name="construct-outline" size={64} color={COLORS.lightGray} />
            <Text style={styles.emptyText}>No components found</Text>
          </View>
        }
      />
    </>
  )

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Predictive Maintenance</Text>
        <TouchableOpacity
          style={styles.headerButton}
          onPress={() => navigation.navigate("MaintenanceSettings" as never)}
        >
          <Ionicons name="settings-outline" size={24} color={COLORS.darkGray} />
        </TouchableOpacity>
      </View>

      <View style={styles.tabsContainer}>
        <TouchableOpacity
          style={[styles.tab, activeTab === "overview" && styles.activeTab]}
          onPress={() => setActiveTab("overview")}
        >
          <Text style={[styles.tabText, activeTab === "overview" && styles.activeTabText]}>Overview</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, activeTab === "components" && styles.activeTab]}
          onPress={() => setActiveTab("components")}
        >
          <Text style={[styles.tabText, activeTab === "components" && styles.activeTabText]}>Components</Text>
        </TouchableOpacity>
      </View>

      {activeTab === "overview" ? (
        <ScrollView style={styles.content}>{renderOverviewTab()}</ScrollView>
      ) : (
        <View style={styles.content}>{renderComponentsTab()}</View>
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
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: COLORS.white,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.lightGray,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: COLORS.darkGray,
  },
  headerButton: {
    padding: 4,
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
  summaryContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 8,
  },
  summaryChart: {
    alignItems: "center",
    justifyContent: "center",
    width: "40%",
  },
  summaryChartLabel: {
    fontSize: 14,
    color: COLORS.darkGray,
    marginTop: 8,
  },
  summaryStats: {
    width: "55%",
  },
  statItem: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  statIndicator: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 8,
  },
  statLabel: {
    flex: 1,
    fontSize: 14,
    color: COLORS.darkGray,
  },
  statValue: {
    fontSize: 16,
    fontWeight: "bold",
    color: COLORS.darkGray,
  },
  viewMoreText: {
    fontSize: 14,
    color: COLORS.primary,
    fontWeight: "500",
  },
  componentItem: {
    backgroundColor: COLORS.white,
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
    borderLeftWidth: 4,
    borderLeftColor: COLORS.error,
  },
  componentHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 4,
  },
  componentName: {
    fontSize: 16,
    fontWeight: "bold",
    color: COLORS.darkGray,
    flex: 1,
  },
  componentStatus: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  componentStatusText: {
    fontSize: 10,
    color: COLORS.white,
    fontWeight: "bold",
  },
  componentProperty: {
    fontSize: 14,
    color: COLORS.darkGray,
    marginBottom: 8,
  },
  componentHealthContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  componentHealthLabel: {
    fontSize: 12,
    color: COLORS.gray,
    marginRight: 8,
  },
  componentHealthBar: {
    flex: 1,
    height: 8,
    backgroundColor: COLORS.lightGray,
    borderRadius: 4,
    overflow: "hidden",
    marginRight: 8,
  },
  componentHealthFill: {
    height: "100%",
    borderRadius: 4,
  },
  componentHealthScore: {
    fontSize: 12,
    fontWeight: "bold",
    color: COLORS.darkGray,
  },
  componentFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  componentMaintenance: {
    fontSize: 12,
    color: COLORS.gray,
  },
  maintenanceItem: {
    backgroundColor: COLORS.white,
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
    borderLeftWidth: 4,
    borderLeftColor: COLORS.primary,
  },
  maintenanceHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 4,
  },
  maintenanceComponent: {
    fontSize: 16,
    fontWeight: "bold",
    color: COLORS.darkGray,
    flex: 1,
  },
  priorityBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  priorityText: {
    fontSize: 10,
    color: COLORS.white,
    fontWeight: "bold",
  },
  maintenanceProperty: {
    fontSize: 14,
    color: COLORS.darkGray,
    marginBottom: 8,
  },
  maintenanceDetails: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  maintenanceDetail: {
    flex: 1,
  },
  maintenanceDetailLabel: {
    fontSize: 12,
    color: COLORS.gray,
    marginBottom: 2,
  },
  maintenanceDetailValue: {
    fontSize: 12,
    fontWeight: "500",
    color: COLORS.darkGray,
  },
  alertItem: {
    backgroundColor: COLORS.white,
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
    borderLeftWidth: 4,
    borderLeftColor: COLORS.warning,
  },
  alertHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  alertSeverity: {
    flexDirection: "row",
    alignItems: "center",
  },
  alertSeverityText: {
    fontSize: 12,
    fontWeight: "bold",
    marginLeft: 4,
  },
  alertStatus: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  alertStatusText: {
    fontSize: 10,
    color: COLORS.white,
    fontWeight: "bold",
  },
  alertComponent: {
    fontSize: 14,
    fontWeight: "bold",
    color: COLORS.darkGray,
    marginBottom: 4,
  },
  alertDescription: {
    fontSize: 14,
    color: COLORS.darkGray,
    marginBottom: 8,
  },
  alertDate: {
    fontSize: 12,
    color: COLORS.gray,
  },
  actionButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 24,
  },
  actionButton: {
    alignItems: "center",
  },
  actionButtonIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: COLORS.primary,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 8,
  },
  actionButtonText: {
    fontSize: 12,
    color: COLORS.darkGray,
    textAlign: "center",
  },
  filterContainer: {
    flexDirection: "row",
    marginBottom: 16,
  },
  filterButton: {
    flex: 1,
    paddingVertical: 8,
    alignItems: "center",
    backgroundColor: COLORS.lightGray,
    marginHorizontal: 4,
    borderRadius: 4,
  },
  activeFilter: {
    backgroundColor: COLORS.primary,
  },
  filterText: {
    fontSize: 14,
    color: COLORS.darkGray,
  },
  activeFilterText: {
    color: COLORS.white,
    fontWeight: "bold",
  },
  componentsList: {
    paddingBottom: 16,
  },
  componentCard: {
    backgroundColor: COLORS.white,
    borderRadius: 8,
    padding: 16,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  componentDetails: {
    marginTop: 8,
  },
  componentDetail: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 4,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.lightGray,
  },
  componentDetailLabel: {
    fontSize: 14,
    color: COLORS.gray,
  },
  componentDetailValue: {
    fontSize: 14,
    color: COLORS.darkGray,
    fontWeight: "500",
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 24,
  },
  emptyText: {
    fontSize: 16,
    color: COLORS.gray,
    marginTop: 16,
  },
})

export default PredictiveMaintenanceScreen

