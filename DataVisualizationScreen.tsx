"use client"

import { useState } from "react"
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Dimensions } from "react-native"
import { SafeAreaView } from "react-native-safe-area-context"
import { COLORS } from "../constants/colors"
import { Ionicons } from "@expo/vector-icons"
import { useNavigation } from "@react-navigation/native"
import Card from "../components/ui/Card"
import { LineChart, BarChart, PieChart } from "react-native-chart-kit"

const { width } = Dimensions.get("window")

// Dashboard types
type DashboardType = "financial" | "operational" | "tenant" | "maintenance"

// Sample data
const dashboardData = {
  financial: {
    summary: {
      revenue: 125000,
      expenses: 78500,
      netIncome: 46500,
      yearOverYear: 8.5,
    },
    revenueByProperty: {
      labels: ["Prop A", "Prop B", "Prop C", "Prop D", "Prop E"],
      data: [35000, 28000, 22000, 18000, 22000],
    },
    expenseCategories: [
      { name: "Maintenance", value: 32000, color: "#FF6384", legendFontColor: "#7F7F7F", legendFontSize: 12 },
      { name: "Property Tax", value: 18500, color: "#36A2EB", legendFontColor: "#7F7F7F", legendFontSize: 12 },
      { name: "Insurance", value: 9500, color: "#FFCE56", legendFontColor: "#7F7F7F", legendFontSize: 12 },
      { name: "Utilities", value: 12500, color: "#4BC0C0", legendFontColor: "#7F7F7F", legendFontSize: 12 },
      { name: "Management", value: 6000, color: "#9966FF", legendFontColor: "#7F7F7F", legendFontSize: 12 },
    ],
    monthlyTrend: {
      labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
      datasets: [
        {
          data: [38000, 42000, 35000, 40000, 45000, 48000],
          color: (opacity = 1) => `rgba(46, 204, 113, ${opacity})`,
          strokeWidth: 2,
        },
        {
          data: [25000, 28000, 22000, 26000, 28000, 30000],
          color: (opacity = 1) => `rgba(231, 76, 60, ${opacity})`,
          strokeWidth: 2,
        },
      ],
      legend: ["Revenue", "Expenses"],
    },
  },
  operational: {
    summary: {
      occupancyRate: 94.2,
      turnoverRate: 18.5,
      avgDaysVacant: 12,
      yearOverYear: 2.3,
    },
    occupancyByProperty: {
      labels: ["Prop A", "Prop B", "Prop C", "Prop D", "Prop E"],
      data: [98, 92, 95, 90, 96],
    },
    leaseStatus: [
      { name: "Active", value: 85, color: "#4BC0C0", legendFontColor: "#7F7F7F", legendFontSize: 12 },
      { name: "Expiring <30d", value: 8, color: "#FFCE56", legendFontColor: "#7F7F7F", legendFontSize: 12 },
      { name: "Vacant", value: 5, color: "#FF6384", legendFontColor: "#7F7F7F", legendFontSize: 12 },
      { name: "In Renewal", value: 2, color: "#36A2EB", legendFontColor: "#7F7F7F", legendFontSize: 12 },
    ],
    occupancyTrend: {
      labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
      datasets: [
        {
          data: [92, 93, 93.5, 94, 94.5, 94.2],
          color: (opacity = 1) => `rgba(33, 150, 243, ${opacity})`,
          strokeWidth: 2,
        },
      ],
    },
  },
  tenant: {
    summary: {
      totalTenants: 128,
      newTenants: 12,
      avgTenureMonths: 22,
      satisfactionScore: 4.2,
    },
    tenantsByProperty: {
      labels: ["Prop A", "Prop B", "Prop C", "Prop D", "Prop E"],
      data: [42, 35, 22, 18, 11],
    },
    tenantTypes: [
      { name: "Families", value: 45, color: "#4BC0C0", legendFontColor: "#7F7F7F", legendFontSize: 12 },
      { name: "Singles", value: 30, color: "#FFCE56", legendFontColor: "#7F7F7F", legendFontSize: 12 },
      { name: "Couples", value: 20, color: "#FF6384", legendFontColor: "#7F7F7F", legendFontSize: 12 },
      { name: "Roommates", value: 5, color: "#36A2EB", legendFontColor: "#7F7F7F", legendFontSize: 12 },
    ],
    satisfactionTrend: {
      labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
      datasets: [
        {
          data: [3.8, 3.9, 4.0, 4.1, 4.2, 4.2],
          color: (opacity = 1) => `rgba(155, 89, 182, ${opacity})`,
          strokeWidth: 2,
        },
      ],
    },
  },
  maintenance: {
    summary: {
      totalRequests: 87,
      openRequests: 12,
      avgResolutionDays: 2.5,
      preventiveMaintenance: 65,
    },
    requestsByProperty: {
      labels: ["Prop A", "Prop B", "Prop C", "Prop D", "Prop E"],
      data: [28, 22, 15, 12, 10],
    },
    requestTypes: [
      { name: "Plumbing", value: 35, color: "#36A2EB", legendFontColor: "#7F7F7F", legendFontSize: 12 },
      { name: "HVAC", value: 25, color: "#FF6384", legendFontColor: "#7F7F7F", legendFontSize: 12 },
      { name: "Electrical", value: 15, color: "#FFCE56", legendFontColor: "#7F7F7F", legendFontSize: 12 },
      { name: "Appliance", value: 15, color: "#4BC0C0", legendFontColor: "#7F7F7F", legendFontSize: 12 },
      { name: "Other", value: 10, color: "#9966FF", legendFontColor: "#7F7F7F", legendFontSize: 12 },
    ],
    requestsTrend: {
      labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
      datasets: [
        {
          data: [18, 15, 12, 20, 22, 12],
          color: (opacity = 1) => `rgba(231, 76, 60, ${opacity})`,
          strokeWidth: 2,
        },
      ],
    },
  },
}

const DataVisualizationScreen = () => {
  const navigation = useNavigation()
  const [selectedDashboard, setSelectedDashboard] = useState<DashboardType>("financial")
  const [drilldownView, setDrilldownView] = useState<string | null>(null)

  // Chart configuration
  const chartConfig = {
    backgroundGradientFrom: "#ffffff",
    backgroundGradientTo: "#ffffff",
    color: (opacity = 1) => `rgba(33, 150, 243, ${opacity})`,
    strokeWidth: 2,
    barPercentage: 0.5,
    useShadowColorFromDataset: true,
    decimalPlaces: 0,
  }

  // Format currency
  const formatCurrency = (amount: number): string => {
    return `$${amount.toFixed(0).replace(/\d(?=(\d{3})+$)/g, "$&,")}`
  }

  // Handle drill down
  const handleDrillDown = (view: string) => {
    setDrilldownView(view)
  }

  // Handle back from drill down
  const handleBackFromDrillDown = () => {
    setDrilldownView(null)
  }

  // Get dashboard title
  const getDashboardTitle = () => {
    switch (selectedDashboard) {
      case "financial":
        return "Financial Dashboard"
      case "operational":
        return "Operational Dashboard"
      case "tenant":
        return "Tenant Dashboard"
      case "maintenance":
        return "Maintenance Dashboard"
      default:
        return "Dashboard"
    }
  }

  // Render drill down view
  const renderDrillDownView = () => {
    if (!drilldownView) return null

    switch (drilldownView) {
      case "revenue":
        return (
          <>
            <View style={styles.drilldownHeader}>
              <TouchableOpacity style={styles.drilldownBackButton} onPress={handleBackFromDrillDown}>
                <Ionicons name="arrow-back" size={20} color={COLORS.primary} />
                <Text style={styles.drilldownBackText}>Back to Dashboard</Text>
              </TouchableOpacity>
              <Text style={styles.drilldownTitle}>Revenue Analysis</Text>
            </View>

            <Card title="Monthly Revenue Trend (Last 12 Months)" elevated>
              <LineChart
                data={{
                  labels: ["Jul", "Aug", "Sep", "Oct", "Nov", "Dec", "Jan", "Feb", "Mar", "Apr", "May", "Jun"],
                  datasets: [
                    {
                      data: [36000, 38000, 42000, 45000, 48000, 52000, 38000, 42000, 35000, 40000, 45000, 48000],
                      color: (opacity = 1) => `rgba(46, 204, 113, ${opacity})`,
                      strokeWidth: 2,
                    },
                  ],
                }}
                width={width - 48}
                height={220}
                chartConfig={chartConfig}
                bezier
                style={styles.chart}
                yAxisSuffix="$"
              />
            </Card>

            <Card title="Revenue by Property Type" elevated>
              <PieChart
                data={[
                  { name: "Apartments", value: 65, color: "#FF6384", legendFontColor: "#7F7F7F", legendFontSize: 12 },
                  {
                    name: "Single Family",
                    value: 20,
                    color: "#36A2EB",
                    legendFontColor: "#7F7F7F",
                    legendFontSize: 12,
                  },
                  { name: "Condos", value: 15, color: "#FFCE56", legendFontColor: "#7F7F7F", legendFontSize: 12 },
                ]}
                width={width - 48}
                height={220}
                chartConfig={chartConfig}
                accessor="value"
                backgroundColor="transparent"
                paddingLeft="15"
                absolute
              />
            </Card>

            <Card title="Revenue by Source" elevated>
              <BarChart
                data={{
                  labels: ["Rent", "Late Fees", "Amenities", "Other"],
                  datasets: [
                    {
                      data: [92, 3, 4, 1],
                    },
                  ],
                }}
                width={width - 48}
                height={220}
                chartConfig={chartConfig}
                style={styles.chart}
                yAxisSuffix="%"
                fromZero
              />
            </Card>

            <Card title="Revenue Insights" elevated>
              <View style={styles.insightItem}>
                <View style={styles.insightIcon}>
                  <Ionicons name="trending-up" size={20} color={COLORS.success} />
                </View>
                <View style={styles.insightContent}>
                  <Text style={styles.insightText}>
                    Revenue has increased by 8.5% compared to the same period last year.
                  </Text>
                </View>
              </View>

              <View style={styles.insightItem}>
                <View style={styles.insightIcon}>
                  <Ionicons name="analytics" size={20} color={COLORS.primary} />
                </View>
                <View style={styles.insightContent}>
                  <Text style={styles.insightText}>
                    Property A generates the highest revenue per square foot at $2.15/sqft.
                  </Text>
                </View>
              </View>

              <View style={styles.insightItem}>
                <View style={styles.insightIcon}>
                  <Ionicons name="calendar" size={20} color={COLORS.warning} />
                </View>
                <View style={styles.insightContent}>
                  <Text style={styles.insightText}>
                    December had the highest revenue month due to seasonal rent increases and high occupancy.
                  </Text>
                </View>
              </View>
            </Card>
          </>
        )

      case "expenses":
        return (
          <>
            <View style={styles.drilldownHeader}>
              <TouchableOpacity style={styles.drilldownBackButton} onPress={handleBackFromDrillDown}>
                <Ionicons name="arrow-back" size={20} color={COLORS.primary} />
                <Text style={styles.drilldownBackText}>Back to Dashboard</Text>
              </TouchableOpacity>
              <Text style={styles.drilldownTitle}>Expense Analysis</Text>
            </View>

            <Card title="Monthly Expense Trend (Last 12 Months)" elevated>
              <LineChart
                data={{
                  labels: ["Jul", "Aug", "Sep", "Oct", "Nov", "Dec", "Jan", "Feb", "Mar", "Apr", "May", "Jun"],
                  datasets: [
                    {
                      data: [24000, 26000, 28000, 30000, 32000, 35000, 25000, 28000, 22000, 26000, 28000, 30000],
                      color: (opacity = 1) => `rgba(231, 76, 60, ${opacity})`,
                      strokeWidth: 2,
                    },
                  ],
                }}
                width={width - 48}
                height={220}
                chartConfig={chartConfig}
                bezier
                style={styles.chart}
                yAxisSuffix="$"
              />
            </Card>

            <Card title="Expense by Property" elevated>
              <BarChart
                data={{
                  labels: ["Prop A", "Prop B", "Prop C", "Prop D", "Prop E"],
                  datasets: [
                    {
                      data: [22000, 18000, 15000, 12000, 11500],
                    },
                  ],
                }}
                width={width - 48}
                height={220}
                chartConfig={chartConfig}
                style={styles.chart}
                yAxisSuffix="$"
                fromZero
              />
            </Card>

            <Card title="Expense Categories (Detailed)" elevated>
              <PieChart
                data={[
                  { name: "Repairs", value: 18000, color: "#FF6384", legendFontColor: "#7F7F7F", legendFontSize: 12 },
                  {
                    name: "Preventive",
                    value: 14000,
                    color: "#FF9F40",
                    legendFontColor: "#7F7F7F",
                    legendFontSize: 12,
                  },
                  {
                    name: "Property Tax",
                    value: 18500,
                    color: "#36A2EB",
                    legendFontColor: "#7F7F7F",
                    legendFontSize: 12,
                  },
                  { name: "Insurance", value: 9500, color: "#FFCE56", legendFontColor: "#7F7F7F", legendFontSize: 12 },
                  { name: "Utilities", value: 12500, color: "#4BC0C0", legendFontColor: "#7F7F7F", legendFontSize: 12 },
                  { name: "Management", value: 6000, color: "#9966FF", legendFontColor: "#7F7F7F", legendFontSize: 12 },
                ]}
                width={width - 48}
                height={220}
                chartConfig={chartConfig}
                accessor="value"
                backgroundColor="transparent"
                paddingLeft="15"
                absolute
              />
            </Card>

            <Card title="Expense Insights" elevated>
              <View style={styles.insightItem}>
                <View style={styles.insightIcon}>
                  <Ionicons name="trending-down" size={20} color={COLORS.success} />
                </View>
                <View style={styles.insightContent}>
                  <Text style={styles.insightText}>
                    Maintenance expenses decreased by 5% after implementing preventive maintenance program.
                  </Text>
                </View>
              </View>

              <View style={styles.insightItem}>
                <View style={styles.insightIcon}>
                  <Ionicons name="warning" size={20} color={COLORS.warning} />
                </View>
                <View style={styles.insightContent}>
                  <Text style={styles.insightText}>
                    Property B has the highest expense-to-revenue ratio at 68%, above the portfolio average of 62%.
                  </Text>
                </View>
              </View>

              <View style={styles.insightItem}>
                <View style={styles.insightIcon}>
                  <Ionicons name="bulb" size={20} color={COLORS.primary} />
                </View>
                <View style={styles.insightContent}>
                  <Text style={styles.insightText}>
                    Utility expenses could be reduced by approximately 15% by implementing energy-efficient upgrades.
                  </Text>
                </View>
              </View>
            </Card>
          </>
        )

      case "occupancy":
        return (
          <>
            <View style={styles.drilldownHeader}>
              <TouchableOpacity style={styles.drilldownBackButton} onPress={handleBackFromDrillDown}>
                <Ionicons name="arrow-back" size={20} color={COLORS.primary} />
                <Text style={styles.drilldownBackText}>Back to Dashboard</Text>
              </TouchableOpacity>
              <Text style={styles.drilldownTitle}>Occupancy Analysis</Text>
            </View>

            <Card title="Occupancy Rate Trend (Last 24 Months)" elevated>
              <LineChart
                data={{
                  labels: ["Q3 '22", "Q4 '22", "Q1 '23", "Q2 '23", "Q3 '23", "Q4 '23", "Q1 '24", "Q2 '24"],
                  datasets: [
                    {
                      data: [90, 91, 92, 93, 93.5, 94, 94.5, 94.2],
                      color: (opacity = 1) => `rgba(33, 150, 243, ${opacity})`,
                      strokeWidth: 2,
                    },
                  ],
                }}
                width={width - 48}
                height={220}
                chartConfig={chartConfig}
                bezier
                style={styles.chart}
                yAxisSuffix="%"
              />
            </Card>

            <Card title="Occupancy by Unit Type" elevated>
              <BarChart
                data={{
                  labels: ["Studio", "1BR", "2BR", "3BR", "4BR+"],
                  datasets: [
                    {
                      data: [96, 95, 94, 92, 90],
                    },
                  ],
                }}
                width={width - 48}
                height={220}
                chartConfig={chartConfig}
                style={styles.chart}
                yAxisSuffix="%"
                fromZero
              />
            </Card>

            <Card title="Vacancy Reasons" elevated>
              <PieChart
                data={[
                  {
                    name: "Between Tenants",
                    value: 60,
                    color: "#36A2EB",
                    legendFontColor: "#7F7F7F",
                    legendFontSize: 12,
                  },
                  { name: "Renovation", value: 25, color: "#FFCE56", legendFontColor: "#7F7F7F", legendFontSize: 12 },
                  { name: "New Listing", value: 10, color: "#4BC0C0", legendFontColor: "#7F7F7F", legendFontSize: 12 },
                  { name: "Other", value: 5, color: "#FF6384", legendFontColor: "#7F7F7F", legendFontSize: 12 },
                ]}
                width={width - 48}
                height={220}
                chartConfig={chartConfig}
                accessor="value"
                backgroundColor="transparent"
                paddingLeft="15"
                absolute
              />
            </Card>

            <Card title="Occupancy Insights" elevated>
              <View style={styles.insightItem}>
                <View style={styles.insightIcon}>
                  <Ionicons name="trending-up" size={20} color={COLORS.success} />
                </View>
                <View style={styles.insightContent}>
                  <Text style={styles.insightText}>
                    Overall occupancy has increased by 2.3% year-over-year, outperforming the market average of 1.5%.
                  </Text>
                </View>
              </View>

              <View style={styles.insightItem}>
                <View style={styles.insightIcon}>
                  <Ionicons name="analytics" size={20} color={COLORS.primary} />
                </View>
                <View style={styles.insightContent}>
                  <Text style={styles.insightText}>
                    Studio and 1-bedroom units have the highest occupancy rates and shortest vacancy periods.
                  </Text>
                </View>
              </View>

              <View style={styles.insightItem}>
                <View style={styles.insightIcon}>
                  <Ionicons name="calendar" size={20} color={COLORS.warning} />
                </View>
                <View style={styles.insightContent}>
                  <Text style={styles.insightText}>
                    Seasonal trends show higher vacancy rates in winter months, with peak occupancy in summer.
                  </Text>
                </View>
              </View>
            </Card>
          </>
        )

      default:
        return null
    }
  }

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color={COLORS.darkGray} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Interactive Dashboards</Text>
      </View>

      {!drilldownView && (
        <View style={styles.tabsContainer}>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            <TouchableOpacity
              style={[styles.tab, selectedDashboard === "financial" && styles.selectedTab]}
              onPress={() => setSelectedDashboard("financial")}
            >
              <Text style={[styles.tabText, selectedDashboard === "financial" && styles.selectedTabText]}>
                Financial
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.tab, selectedDashboard === "operational" && styles.selectedTab]}
              onPress={() => setSelectedDashboard("operational")}
            >
              <Text style={[styles.tabText, selectedDashboard === "operational" && styles.selectedTabText]}>
                Operational
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.tab, selectedDashboard === "tenant" && styles.selectedTab]}
              onPress={() => setSelectedDashboard("tenant")}
            >
              <Text style={[styles.tabText, selectedDashboard === "tenant" && styles.selectedTabText]}>Tenant</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.tab, selectedDashboard === "maintenance" && styles.selectedTab]}
              onPress={() => setSelectedDashboard("maintenance")}
            >
              <Text style={[styles.tabText, selectedDashboard === "maintenance" && styles.selectedTabText]}>
                Maintenance
              </Text>
            </TouchableOpacity>
          </ScrollView>
        </View>
      )}

      <ScrollView style={styles.content}>
        {drilldownView ? (
          renderDrillDownView()
        ) : (
          <>
            <Card title={getDashboardTitle()} elevated>
              {selectedDashboard === "financial" && (
                <View style={styles.summaryContainer}>
                  <View style={styles.summaryItem}>
                    <Text style={styles.summaryLabel}>Revenue</Text>
                    <Text style={styles.summaryValue}>{formatCurrency(dashboardData.financial.summary.revenue)}</Text>
                  </View>
                  <View style={styles.summaryItem}>
                    <Text style={styles.summaryLabel}>Expenses</Text>
                    <Text style={styles.summaryValue}>{formatCurrency(dashboardData.financial.summary.expenses)}</Text>
                  </View>
                  <View style={styles.summaryItem}>
                    <Text style={styles.summaryLabel}>Net Income</Text>
                    <Text style={styles.summaryValue}>{formatCurrency(dashboardData.financial.summary.netIncome)}</Text>
                  </View>
                  <View style={styles.summaryItem}>
                    <Text style={styles.summaryLabel}>YoY Growth</Text>
                    <View style={styles.growthContainer}>
                      <Ionicons name="trending-up" size={16} color={COLORS.success} />
                      <Text style={[styles.summaryValue, { color: COLORS.success }]}>
                        {dashboardData.financial.summary.yearOverYear}%
                      </Text>
                    </View>
                  </View>
                </View>
              )}

              {selectedDashboard === "operational" && (
                <View style={styles.summaryContainer}>
                  <View style={styles.summaryItem}>
                    <Text style={styles.summaryLabel}>Occupancy</Text>
                    <Text style={styles.summaryValue}>{dashboardData.operational.summary.occupancyRate}%</Text>
                  </View>
                  <View style={styles.summaryItem}>
                    <Text style={styles.summaryLabel}>Turnover</Text>
                    <Text style={styles.summaryValue}>{dashboardData.operational.summary.turnoverRate}%</Text>
                  </View>
                  <View style={styles.summaryItem}>
                    <Text style={styles.summaryLabel}>Avg Days Vacant</Text>
                    <Text style={styles.summaryValue}>{dashboardData.operational.summary.avgDaysVacant}</Text>
                  </View>
                  <View style={styles.summaryItem}>
                    <Text style={styles.summaryLabel}>YoY Change</Text>
                    <View style={styles.growthContainer}>
                      <Ionicons name="trending-up" size={16} color={COLORS.success} />
                      <Text style={[styles.summaryValue, { color: COLORS.success }]}>
                        {dashboardData.operational.summary.yearOverYear}%
                      </Text>
                    </View>
                  </View>
                </View>
              )}

              {selectedDashboard === "tenant" && (
                <View style={styles.summaryContainer}>
                  <View style={styles.summaryItem}>
                    <Text style={styles.summaryLabel}>Total Tenants</Text>
                    <Text style={styles.summaryValue}>{dashboardData.tenant.summary.totalTenants}</Text>
                  </View>
                  <View style={styles.summaryItem}>
                    <Text style={styles.summaryLabel}>New (30d)</Text>
                    <Text style={styles.summaryValue}>{dashboardData.tenant.summary.newTenants}</Text>
                  </View>
                  <View style={styles.summaryItem}>
                    <Text style={styles.summaryLabel}>Avg Tenure</Text>
                    <Text style={styles.summaryValue}>{dashboardData.tenant.summary.avgTenureMonths} mo</Text>
                  </View>
                  <View style={styles.summaryItem}>
                    <Text style={styles.summaryLabel}>Satisfaction</Text>
                    <View style={styles.ratingContainer}>
                      <Text style={styles.summaryValue}>{dashboardData.tenant.summary.satisfactionScore}</Text>
                      <Ionicons name="star" size={16} color={COLORS.warning} />
                    </View>
                  </View>
                </View>
              )}

              {selectedDashboard === "maintenance" && (
                <View style={styles.summaryContainer}>
                  <View style={styles.summaryItem}>
                    <Text style={styles.summaryLabel}>Total Requests</Text>
                    <Text style={styles.summaryValue}>{dashboardData.maintenance.summary.totalRequests}</Text>
                  </View>
                  <View style={styles.summaryItem}>
                    <Text style={styles.summaryLabel}>Open</Text>
                    <Text style={styles.summaryValue}>{dashboardData.maintenance.summary.openRequests}</Text>
                  </View>
                  <View style={styles.summaryItem}>
                    <Text style={styles.summaryLabel}>Avg Resolution</Text>
                    <Text style={styles.summaryValue}>{dashboardData.maintenance.summary.avgResolutionDays}d</Text>
                  </View>
                  <View style={styles.summaryItem}>
                    <Text style={styles.summaryLabel}>Preventive</Text>
                    <Text style={styles.summaryValue}>{dashboardData.maintenance.summary.preventiveMaintenance}%</Text>
                  </View>
                </View>
              )}
            </Card>

            {selectedDashboard === "financial" && (
              <>
                <View style={styles.chartRow}>
                  <TouchableOpacity style={styles.chartCard} onPress={() => handleDrillDown("revenue")}>
                    <Card title="Revenue by Property" elevated>
                      <BarChart
                        data={{
                          labels: dashboardData.financial.revenueByProperty.labels,
                          datasets: [
                            {
                              data: dashboardData.financial.revenueByProperty.data,
                            },
                          ],
                        }}
                        width={(width - 48) / 2 - 8}
                        height={180}
                        chartConfig={chartConfig}
                        style={styles.chart}
                        yAxisSuffix="$"
                        fromZero
                      />
                    </Card>
                  </TouchableOpacity>

                  <TouchableOpacity style={styles.chartCard} onPress={() => handleDrillDown("expenses")}>
                    <Card title="Expense Categories" elevated>
                      <PieChart
                        data={dashboardData.financial.expenseCategories}
                        width={(width - 48) / 2 - 8}
                        height={180}
                        chartConfig={chartConfig}
                        accessor="value"
                        backgroundColor="transparent"
                        paddingLeft="15"
                        absolute
                      />
                    </Card>
                  </TouchableOpacity>
                </View>

                <Card title="Revenue vs Expenses (6 Months)" elevated>
                  <LineChart
                    data={dashboardData.financial.monthlyTrend}
                    width={width - 48}
                    height={220}
                    chartConfig={chartConfig}
                    bezier
                    style={styles.chart}
                    yAxisSuffix="$"
                  />
                </Card>
              </>
            )}

            {selectedDashboard === "operational" && (
              <>
                <TouchableOpacity style={styles.fullWidthCard} onPress={() => handleDrillDown("occupancy")}>
                  <Card title="Occupancy by Property" elevated>
                    <BarChart
                      data={{
                        labels: dashboardData.operational.occupancyByProperty.labels,
                        datasets: [
                          {
                            data: dashboardData.operational.occupancyByProperty.data,
                          },
                        ],
                      }}
                      width={width - 48}
                      height={220}
                      chartConfig={chartConfig}
                      style={styles.chart}
                      yAxisSuffix="%"
                      fromZero
                    />
                  </Card>
                </TouchableOpacity>

                <View style={styles.chartRow}>
                  <View style={styles.chartCard}>
                    <Card title="Lease Status" elevated>
                      <PieChart
                        data={dashboardData.operational.leaseStatus}
                        width={(width - 48) / 2 - 8}
                        height={180}
                        chartConfig={chartConfig}
                        accessor="value"
                        backgroundColor="transparent"
                        paddingLeft="15"
                        absolute
                      />
                    </Card>
                  </View>

                  <View style={styles.chartCard}>
                    <Card title="Occupancy Trend" elevated>
                      <LineChart
                        data={dashboardData.operational.occupancyTrend}
                        width={(width - 48) / 2 - 8}
                        height={180}
                        chartConfig={chartConfig}
                        bezier
                        style={styles.chart}
                        yAxisSuffix="%"
                      />
                    </Card>
                  </View>
                </View>
              </>
            )}

            {selectedDashboard === "tenant" && (
              <>
                <View style={styles.chartRow}>
                  <View style={styles.chartCard}>
                    <Card title="Tenants by Property" elevated>
                      <BarChart
                        data={{
                          labels: dashboardData.tenant.tenantsByProperty.labels,
                          datasets: [
                            {
                              data: dashboardData.tenant.tenantsByProperty.data,
                            },
                          ],
                        }}
                        width={(width - 48) / 2 - 8}
                        height={180}
                        chartConfig={chartConfig}
                        style={styles.chart}
                        fromZero
                      />
                    </Card>
                  </View>

                  <View style={styles.chartCard}>
                    <Card title="Tenant Types" elevated>
                      <PieChart
                        data={dashboardData.tenant.tenantTypes}
                        width={(width - 48) / 2 - 8}
                        height={180}
                        chartConfig={chartConfig}
                        accessor="value"
                        backgroundColor="transparent"
                        paddingLeft="15"
                        absolute
                      />
                    </Card>
                  </View>
                </View>

                <Card title="Satisfaction Trend (6 Months)" elevated>
                  <LineChart
                    data={dashboardData.tenant.satisfactionTrend}
                    width={width - 48}
                    height={220}
                    chartConfig={{
                      ...chartConfig,
                      color: (opacity = 1) => `rgba(155, 89, 182, ${opacity})`,
                    }}
                    bezier
                    style={styles.chart}
                    yAxisSuffix="/5"
                  />
                </Card>
              </>
            )}

            {selectedDashboard === "maintenance" && (
              <>
                <View style={styles.chartRow}>
                  <View style={styles.chartCard}>
                    <Card title="Requests by Property" elevated>
                      <BarChart
                        data={{
                          labels: dashboardData.maintenance.requestsByProperty.labels,
                          datasets: [
                            {
                              data: dashboardData.maintenance.requestsByProperty.data,
                            },
                          ],
                        }}
                        width={(width - 48) / 2 - 8}
                        height={180}
                        chartConfig={chartConfig}
                        style={styles.chart}
                        fromZero
                      />
                    </Card>
                  </View>

                  <View style={styles.chartCard}>
                    <Card title="Request Types" elevated>
                      <PieChart
                        data={dashboardData.maintenance.requestTypes}
                        width={(width - 48) / 2 - 8}
                        height={180}
                        chartConfig={chartConfig}
                        accessor="value"
                        backgroundColor="transparent"
                        paddingLeft="15"
                        absolute
                      />
                    </Card>
                  </View>
                </View>

                <Card title="Maintenance Requests (6 Months)" elevated>
                  <LineChart
                    data={dashboardData.maintenance.requestsTrend}
                    width={width - 48}
                    height={220}
                    chartConfig={{
                      ...chartConfig,
                      color: (opacity = 1) => `rgba(231, 76, 60, ${opacity})`,
                    }}
                    bezier
                    style={styles.chart}
                  />
                </Card>
              </>
            )}

            <Card title="Data Export Options" elevated>
              <View style={styles.exportOptionsContainer}>
                <TouchableOpacity style={styles.exportOption}>
                  <View style={styles.exportIconContainer}>
                    <Ionicons name="document-text" size={24} color={COLORS.primary} />
                  </View>
                  <Text style={styles.exportOptionText}>Export as PDF</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.exportOption}>
                  <View style={styles.exportIconContainer}>
                    <Ionicons name="calculator" size={24} color={COLORS.primary} />
                  </View>
                  <Text style={styles.exportOptionText}>Export as Excel</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.exportOption}>
                  <View style={styles.exportIconContainer}>
                    <Ionicons name="share" size={24} color={COLORS.primary} />
                  </View>
                  <Text style={styles.exportOptionText}>Share Dashboard</Text>
                </TouchableOpacity>
              </View>
            </Card>
          </>
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
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: COLORS.white,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.lightGray,
  },
  backButton: {
    padding: 4,
    marginRight: 16,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: COLORS.darkGray,
  },
  tabsContainer: {
    backgroundColor: COLORS.white,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.lightGray,
  },
  tab: {
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderBottomWidth: 3,
    borderBottomColor: "transparent",
  },
  selectedTab: {
    borderBottomColor: COLORS.primary,
  },
  tabText: {
    fontSize: 16,
    color: COLORS.gray,
  },
  selectedTabText: {
    fontWeight: "bold",
    color: COLORS.primary,
  },
  content: {
    flex: 1,
    padding: 16,
  },
  summaryContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  summaryItem: {
    width: "48%",
    backgroundColor: COLORS.white,
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  summaryLabel: {
    fontSize: 12,
    color: COLORS.gray,
    marginBottom: 4,
  },
  summaryValue: {
    fontSize: 18,
    fontWeight: "bold",
    color: COLORS.darkGray,
  },
  growthContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  ratingContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  chartRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 16,
  },
  chartCard: {
    width: "48%",
  },
  fullWidthCard: {
    width: "100%",
    marginBottom: 16,
  },
  chart: {
    marginVertical: 8,
    borderRadius: 8,
  },
  drilldownHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
  },
  drilldownBackButton: {
    flexDirection: "row",
    alignItems: "center",
    marginRight: 16,
  },
  drilldownBackText: {
    fontSize: 14,
    color: COLORS.primary,
    marginLeft: 4,
  },
  drilldownTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: COLORS.darkGray,
  },
  insightItem: {
    flexDirection: "row",
    marginBottom: 12,
  },
  insightIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: COLORS.lightGray,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  insightContent: {
    flex: 1,
  },
  insightText: {
    fontSize: 14,
    color: COLORS.darkGray,
    lineHeight: 20,
  },
  exportOptionsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 8,
  },
  exportOption: {
    alignItems: "center",
    padding: 12,
  },
  exportIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: COLORS.primaryLight,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 8,
  },
  exportOptionText: {
    fontSize: 12,
    color: COLORS.darkGray,
    textAlign: "center",
  },
})

export default DataVisualizationScreen

