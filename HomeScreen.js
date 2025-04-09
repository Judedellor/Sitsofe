"use client"

import { useState, useEffect } from "react"
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, ActivityIndicator } from "react-native"
import { Ionicons } from "@expo/vector-icons"

// Mock data for dashboard
const DASHBOARD_DATA = {
  totalProperties: 4,
  totalUnits: 45,
  occupancyRate: "91%",
  monthlyRevenue: "$84,100",
  pendingMaintenance: 5,
  upcomingLeases: 3,
  recentActivities: [
    {
      id: "1",
      type: "payment",
      description: "Rent payment received from John Smith",
      property: "Sunset Apartments",
      amount: "$1,200",
      date: "Today, 9:45 AM",
    },
    {
      id: "2",
      type: "maintenance",
      description: "Maintenance request completed: Leaking faucet",
      property: "Ocean View Condos",
      date: "Yesterday, 4:30 PM",
    },
    {
      id: "3",
      type: "lease",
      description: "Lease renewal sent to Jane Doe",
      property: "Downtown Lofts",
      date: "Yesterday, 2:15 PM",
    },
    {
      id: "4",
      type: "payment",
      description: "Rent payment received from Emily Johnson",
      property: "Downtown Lofts",
      amount: "$1,350",
      date: "2 days ago",
    },
    {
      id: "5",
      type: "maintenance",
      description: "New maintenance request: AC not working",
      property: "Sunset Apartments",
      date: "3 days ago",
    },
  ],
  analytics: {
    occupancyTrend: [78, 82, 85, 88, 91],
    revenueByProperty: [
      { name: "Sunset Apartments", value: 32400 },
      { name: "Ocean View Condos", value: 24600 },
      { name: "Mountain Retreat", value: 8500 },
      { name: "Downtown Lofts", value: 18600 },
    ],
  },
}

const InfoCard = ({ title, value, icon, color, subtitle }) => (
  <View style={styles.card}>
    <View style={styles.cardHeader}>
      <Text style={styles.cardTitle}>{title}</Text>
      <View style={[styles.iconContainer, { backgroundColor: color + "20" }]}>
        <Ionicons name={icon} size={24} color={color} />
      </View>
    </View>
    <Text style={styles.cardValue}>{value}</Text>
    {subtitle && <Text style={styles.cardSubtitle}>{subtitle}</Text>}
  </View>
)

const ActivityItem = ({ activity }) => {
  const getActivityIcon = (type) => {
    switch (type) {
      case "payment":
        return { name: "cash-outline", color: "#4CAF50" }
      case "maintenance":
        return { name: "construct-outline", color: "#FF9800" }
      case "lease":
        return { name: "document-text-outline", color: "#2196F3" }
      default:
        return { name: "ellipse", color: "#757575" }
    }
  }

  const icon = getActivityIcon(activity.type)

  return (
    <View style={styles.activityItem}>
      <View style={[styles.activityIconContainer, { backgroundColor: icon.color + "20" }]}>
        <Ionicons name={icon.name} size={20} color={icon.color} />
      </View>
      <View style={styles.activityContent}>
        <Text style={styles.activityDescription}>{activity.description}</Text>
        <Text style={styles.activityProperty}>{activity.property}</Text>
        <View style={styles.activityFooter}>
          {activity.amount && <Text style={styles.activityAmount}>{activity.amount}</Text>}
          <Text style={styles.activityDate}>{activity.date}</Text>
        </View>
      </View>
    </View>
  )
}

const ChartSection = ({ title, children }) => (
  <View style={styles.chartSection}>
    <Text style={styles.sectionTitle}>{title}</Text>
    {children}
  </View>
)

// Simple bar chart component
const BarChart = ({ data }) => {
  const maxValue = Math.max(...data.map((item) => item.value))

  return (
    <View style={styles.barChartContainer}>
      {data.map((item, index) => (
        <View key={index} style={styles.barChartItem}>
          <View style={styles.barLabelContainer}>
            <Text style={styles.barLabel}>{item.name}</Text>
          </View>
          <View style={styles.barContainer}>
            <View
              style={[
                styles.bar,
                {
                  width: `${(item.value / maxValue) * 100}%`,
                  backgroundColor: getRandomColor(index),
                },
              ]}
            />
            <Text style={styles.barValue}>${item.value.toLocaleString()}</Text>
          </View>
        </View>
      ))}
    </View>
  )
}

// Simple line chart component for occupancy trend
const LineChart = ({ data }) => {
  const chartHeight = 100
  const maxValue = Math.max(...data)
  const minValue = Math.min(...data)
  const range = maxValue - minValue

  return (
    <View style={styles.lineChartContainer}>
      <View style={styles.lineChart}>
        {data.map((value, index) => {
          const height = range === 0 ? 50 : ((value - minValue) / range) * chartHeight

          return (
            <View key={index} style={styles.lineChartBar}>
              <View style={[styles.lineChartPoint, { height: height, backgroundColor: "#2196F3" }]} />
              <Text style={styles.lineChartLabel}>{value}%</Text>
            </View>
          )
        })}
      </View>
      <View style={styles.lineChartXAxis}>
        <Text style={styles.lineChartXLabel}>Jan</Text>
        <Text style={styles.lineChartXLabel}>Feb</Text>
        <Text style={styles.lineChartXLabel}>Mar</Text>
        <Text style={styles.lineChartXLabel}>Apr</Text>
        <Text style={styles.lineChartXLabel}>May</Text>
      </View>
    </View>
  )
}

// Helper function to generate colors for the chart
const getRandomColor = (index) => {
  const colors = ["#2196F3", "#4CAF50", "#FFC107", "#9C27B0", "#F44336"]
  return colors[index % colors.length]
}

const HomeScreen = ({ navigation }) => {
  const [loading, setLoading] = useState(true)
  const [dashboardData, setDashboardData] = useState(null)

  useEffect(() => {
    // Simulate API call to fetch dashboard data
    const fetchDashboardData = () => {
      return new Promise((resolve) => {
        setTimeout(() => {
          resolve(DASHBOARD_DATA)
        }, 1500)
      })
    }

    fetchDashboardData().then((data) => {
      setDashboardData(data)
      setLoading(false)
    })
  }, [])

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#2196F3" />
        <Text style={styles.loadingText}>Loading dashboard...</Text>
      </View>
    )
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <View>
          <Text style={styles.greeting}>Hello, Admin</Text>
          <Text style={styles.date}>
            {new Date().toLocaleDateString("en-US", {
              weekday: "long",
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </Text>
        </View>
        <TouchableOpacity style={styles.profileButton}>
          <Ionicons name="person-circle" size={40} color="#2196F3" />
        </TouchableOpacity>
      </View>

      <View style={styles.cardsContainer}>
        <InfoCard title="Properties" value={dashboardData.totalProperties} icon="business" color="#2196F3" />
        <InfoCard title="Units" value={dashboardData.totalUnits} icon="home" color="#4CAF50" />
      </View>

      <View style={styles.cardsContainer}>
        <InfoCard title="Occupancy" value={dashboardData.occupancyRate} icon="people" color="#FF9800" />
        <InfoCard
          title="Revenue"
          value={dashboardData.monthlyRevenue}
          icon="cash"
          color="#9C27B0"
          subtitle="This month"
        />
      </View>

      <View style={styles.cardsContainer}>
        <InfoCard
          title="Maintenance"
          value={dashboardData.pendingMaintenance}
          icon="construct"
          color="#F44336"
          subtitle="Pending requests"
        />
        <InfoCard
          title="Leases"
          value={dashboardData.upcomingLeases}
          icon="document-text"
          color="#009688"
          subtitle="Expiring soon"
        />
      </View>

      <ChartSection title="Occupancy Trend">
        <LineChart data={dashboardData.analytics.occupancyTrend} />
      </ChartSection>

      <ChartSection title="Revenue by Property">
        <BarChart data={dashboardData.analytics.revenueByProperty} />
      </ChartSection>

      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Recent Activities</Text>
          <TouchableOpacity>
            <Text style={styles.viewAllText}>View All</Text>
          </TouchableOpacity>
        </View>

        {dashboardData.recentActivities.map((activity) => (
          <ActivityItem key={activity.id} activity={activity} />
        ))}
      </View>

      <View style={styles.quickActions}>
        <Text style={styles.sectionTitle}>Quick Actions</Text>
        <View style={styles.actionButtonsContainer}>
          <TouchableOpacity style={styles.actionButton}>
            <View style={[styles.actionIcon, { backgroundColor: "#2196F3" }]}>
              <Ionicons name="add-circle" size={24} color="white" />
            </View>
            <Text style={styles.actionText}>Add Property</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.actionButton}>
            <View style={[styles.actionIcon, { backgroundColor: "#4CAF50" }]}>
              <Ionicons name="person-add" size={24} color="white" />
            </View>
            <Text style={styles.actionText}>Add Tenant</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.actionButton}>
            <View style={[styles.actionIcon, { backgroundColor: "#FF9800" }]}>
              <Ionicons name="construct" size={24} color="white" />
            </View>
            <Text style={styles.actionText}>Maintenance</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.actionButton}>
            <View style={[styles.actionIcon, { backgroundColor: "#9C27B0" }]}>
              <Ionicons name="cash" size={24} color="white" />
            </View>
            <Text style={styles.actionText}>Payments</Text>
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.footer}>
        <Text style={styles.footerText}>Property Management System v1.0</Text>
      </View>
    </ScrollView>
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
    paddingHorizontal: 16,
    paddingTop: 50,
    paddingBottom: 16,
    backgroundColor: "white",
  },
  greeting: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#333",
  },
  date: {
    fontSize: 14,
    color: "#666",
    marginTop: 4,
  },
  profileButton: {
    padding: 4,
  },
  cardsContainer: {
    flexDirection: "row",
    paddingHorizontal: 8,
    marginTop: 16,
  },
  card: {
    flex: 1,
    backgroundColor: "white",
    borderRadius: 12,
    padding: 16,
    marginHorizontal: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  cardTitle: {
    fontSize: 14,
    color: "#666",
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  cardValue: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#333",
  },
  cardSubtitle: {
    fontSize: 12,
    color: "#999",
    marginTop: 4,
  },
  section: {
    backgroundColor: "white",
    borderRadius: 12,
    padding: 16,
    margin: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  chartSection: {
    backgroundColor: "white",
    borderRadius: 12,
    padding: 16,
    marginHorizontal: 16,
    marginVertical: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
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
    color: "#333",
    marginBottom: 12,
  },
  viewAllText: {
    fontSize: 14,
    color: "#2196F3",
  },
  activityItem: {
    flexDirection: "row",
    marginBottom: 16,
  },
  activityIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  activityContent: {
    flex: 1,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
    paddingBottom: 16,
  },
  activityDescription: {
    fontSize: 14,
    color: "#333",
    fontWeight: "500",
    marginBottom: 4,
  },
  activityProperty: {
    fontSize: 13,
    color: "#666",
    marginBottom: 4,
  },
  activityFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  activityAmount: {
    fontSize: 12,
    fontWeight: "600",
    color: "#4CAF50",
  },
  activityDate: {
    fontSize: 12,
    color: "#999",
  },
  // Bar chart styles
  barChartContainer: {
    marginTop: 8,
  },
  barChartItem: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  barLabelContainer: {
    width: 100,
  },
  barLabel: {
    fontSize: 12,
    color: "#666",
  },
  barContainer: {
    flex: 1,
    height: 30,
    backgroundColor: "#f0f0f0",
    borderRadius: 4,
    overflow: "hidden",
    flexDirection: "row",
    alignItems: "center",
  },
  bar: {
    height: "100%",
  },
  barValue: {
    fontSize: 12,
    fontWeight: "600",
    color: "#333",
    position: "absolute",
    right: 8,
  },
  // Line chart styles
  lineChartContainer: {
    marginTop: 8,
    height: 150,
  },
  lineChart: {
    flexDirection: "row",
    alignItems: "flex-end",
    height: 100,
    justifyContent: "space-between",
    paddingHorizontal: 16,
  },
  lineChartBar: {
    alignItems: "center",
    justifyContent: "flex-end",
    width: 40,
  },
  lineChartPoint: {
    width: 30,
    borderTopLeftRadius: 4,
    borderTopRightRadius: 4,
  },
  lineChartLabel: {
    fontSize: 12,
    color: "#666",
    marginTop: 4,
  },
  lineChartXAxis: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    marginTop: 8,
  },
  lineChartXLabel: {
    fontSize: 12,
    color: "#999",
    width: 40,
    textAlign: "center",
  },
  quickActions: {
    backgroundColor: "white",
    borderRadius: 12,
    padding: 16,
    margin: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  actionButtonsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  actionButton: {
    width: "48%",
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f5f5f5",
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
  },
  actionIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  actionText: {
    fontSize: 14,
    fontWeight: "500",
    color: "#333",
  },
  footer: {
    padding: 16,
    alignItems: "center",
  },
  footerText: {
    fontSize: 12,
    color: "#999",
  },
})

export default HomeScreen

