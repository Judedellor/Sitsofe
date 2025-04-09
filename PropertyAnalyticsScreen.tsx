"use client"

import { useState, useEffect } from "react"
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Dimensions, ActivityIndicator } from "react-native"
import { SafeAreaView } from "react-native-safe-area-context"
import { COLORS } from "./constants/colors"
import { Ionicons } from "@expo/vector-icons"
import { useNavigation, useRoute } from "@react-navigation/native"
import { LineChart, BarChart, PieChart } from "react-native-chart-kit"

const { width } = Dimensions.get("window")

// Mock property data
const mockProperty = {
  id: "property-1",
  name: "Sunset Villa",
  address: "123 Ocean Drive, Malibu, CA 90210",
  rentAmount: 5500,
  purchasePrice: 1200000,
  currentValue: 1450000,
  monthlyExpenses: 1200,
  occupancyRate: 92,
}

// Mock analytics data
const mockAnalytics = {
  rentalIncome: {
    labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
    datasets: [
      {
        data: [5500, 5500, 5500, 5500, 5500, 5500],
      },
    ],
  },
  expenses: {
    labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
    datasets: [
      {
        data: [1200, 1350, 1100, 1800, 1250, 1200],
      },
    ],
  },
  cashFlow: {
    labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
    datasets: [
      {
        data: [4300, 4150, 4400, 3700, 4250, 4300],
      },
    ],
  },
  expenseBreakdown: [
    {
      name: "Mortgage",
      amount: 3200,
      color: "#FF6384",
      legendFontColor: "#7F7F7F",
      legendFontSize: 12,
    },
    {
      name: "Property Tax",
      amount: 850,
      color: "#36A2EB",
      legendFontColor: "#7F7F7F",
      legendFontSize: 12,
    },
    {
      name: "Insurance",
      amount: 250,
      color: "#FFCE56",
      legendFontColor: "#7F7F7F",
      legendFontSize: 12,
    },
    {
      name: "Maintenance",
      amount: 400,
      color: "#4BC0C0",
      legendFontColor: "#7F7F7F",
      legendFontSize: 12,
    },
    {
      name: "Utilities",
      amount: 300,
      color: "#9966FF",
      legendFontColor: "#7F7F7F",
      legendFontSize: 12,
    },
  ],
  propertyValue: {
    labels: ["2019", "2020", "2021", "2022", "2023"],
    datasets: [
      {
        data: [1200000, 1250000, 1320000, 1380000, 1450000],
      },
    ],
  },
}

const PropertyAnalyticsScreen = () => {
  const navigation = useNavigation()
  const route = useRoute()
  const { propertyId } = route.params || { propertyId: "property-1" }

  // In a real app, you would fetch property data based on propertyId
  const property = mockProperty
  const analytics = mockAnalytics

  const [isLoading, setIsLoading] = useState(true)
  const [timeRange, setTimeRange] = useState("6m")

  // Simulate loading
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false)
    }, 1500)

    return () => clearTimeout(timer)
  }, [])

  // Chart configuration
  const chartConfig = {
    backgroundGradientFrom: "#ffffff",
    backgroundGradientTo: "#ffffff",
    color: (opacity = 1) => `rgba(33, 150, 243, ${opacity})`,
    strokeWidth: 2,
    barPercentage: 0.5,
    useShadowColorFromDataset: false,
    decimalPlaces: 0,
  }

  // Calculate ROI
  const calculateROI = () => {
    const annualIncome = property.rentAmount * 12
    const annualExpenses = property.monthlyExpenses * 12
    const netIncome = annualIncome - annualExpenses
    const roi = (netIncome / property.purchasePrice) * 100
    return roi.toFixed(2)
  }

  // Calculate cap rate
  const calculateCapRate = () => {
    const annualIncome = property.rentAmount * 12
    const annualExpenses = property.monthlyExpenses * 12
    const netOperatingIncome = annualIncome - annualExpenses
    const capRate = (netOperatingIncome / property.currentValue) * 100
    return capRate.toFixed(2)
  }

  // Calculate appreciation
  const calculateAppreciation = () => {
    const appreciation = ((property.currentValue - property.purchasePrice) / property.purchasePrice) * 100
    return appreciation.toFixed(2)
  }

  if (isLoading) {
    return (
      <SafeAreaView style={styles.loadingContainer} edges={["top"]}>
        <ActivityIndicator size="large" color={COLORS.primary} />
        <Text style={styles.loadingText}>Loading analytics...</Text>
      </SafeAreaView>
    )
  }

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color={COLORS.darkGray} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{property.name} Analytics</Text>
      </View>

      <ScrollView style={styles.content}>
        {/* Property Overview */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Property Overview</Text>

          <View style={styles.overviewContainer}>
            <View style={styles.overviewItem}>
              <Text style={styles.overviewLabel}>Current Value</Text>
              <Text style={styles.overviewValue}>${property.currentValue.toLocaleString()}</Text>
            </View>

            <View style={styles.overviewItem}>
              <Text style={styles.overviewLabel}>Monthly Rent</Text>
              <Text style={styles.overviewValue}>${property.rentAmount.toLocaleString()}</Text>
            </View>

            <View style={styles.overviewItem}>
              <Text style={styles.overviewLabel}>Monthly Expenses</Text>
              <Text style={styles.overviewValue}>${property.monthlyExpenses.toLocaleString()}</Text>
            </View>

            <View style={styles.overviewItem}>
              <Text style={styles.overviewLabel}>Occupancy Rate</Text>
              <Text style={styles.overviewValue}>{property.occupancyRate}%</Text>
            </View>
          </View>
        </View>

        {/* Key Metrics */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Key Metrics</Text>

          <View style={styles.metricsContainer}>
            <View style={styles.metricCard}>
              <Text style={styles.metricValue}>{calculateROI()}%</Text>
              <Text style={styles.metricLabel}>Return on Investment</Text>
            </View>

            <View style={styles.metricCard}>
              <Text style={styles.metricValue}>{calculateCapRate()}%</Text>
              <Text style={styles.metricLabel}>Cap Rate</Text>
            </View>

            <View style={styles.metricCard}>
              <Text style={styles.metricValue}>{calculateAppreciation()}%</Text>
              <Text style={styles.metricLabel}>Appreciation</Text>
            </View>
          </View>
        </View>

        {/* Time Range Selector */}
        <View style={styles.timeRangeContainer}>
          <Text style={styles.timeRangeLabel}>Time Range:</Text>
          <View style={styles.timeRangeButtons}>
            <TouchableOpacity
              style={[styles.timeRangeButton, timeRange === "3m" && styles.timeRangeButtonActive]}
              onPress={() => setTimeRange("3m")}
            >
              <Text style={[styles.timeRangeButtonText, timeRange === "3m" && styles.timeRangeButtonTextActive]}>
                3M
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.timeRangeButton, timeRange === "6m" && styles.timeRangeButtonActive]}
              onPress={() => setTimeRange("6m")}
            >
              <Text style={[styles.timeRangeButtonText, timeRange === "6m" && styles.timeRangeButtonTextActive]}>
                6M
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.timeRangeButton, timeRange === "1y" && styles.timeRangeButtonActive]}
              onPress={() => setTimeRange("1y")}
            >
              <Text style={[styles.timeRangeButtonText, timeRange === "1y" && styles.timeRangeButtonTextActive]}>
                1Y
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.timeRangeButton, timeRange === "all" && styles.timeRangeButtonActive]}
              onPress={() => setTimeRange("all")}
            >
              <Text style={[styles.timeRangeButtonText, timeRange === "all" && styles.timeRangeButtonTextActive]}>
                All
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Rental Income Chart */}
        <View style={styles.chartSection}>
          <Text style={styles.chartTitle}>Rental Income</Text>
          <LineChart
            data={analytics.rentalIncome}
            width={width - 32}
            height={220}
            chartConfig={{
              ...chartConfig,
              color: (opacity = 1) => `rgba(46, 204, 113, ${opacity})`,
            }}
            bezier
            style={styles.chart}
          />
        </View>

        {/* Expenses Chart */}
        <View style={styles.chartSection}>
          <Text style={styles.chartTitle}>Expenses</Text>
          <LineChart
            data={analytics.expenses}
            width={width - 32}
            height={220}
            chartConfig={{
              ...chartConfig,
              color: (opacity = 1) => `rgba(231, 76, 60, ${opacity})`,
            }}
            bezier
            style={styles.chart}
          />
        </View>

        {/* Cash Flow Chart */}
        <View style={styles.chartSection}>
          <Text style={styles.chartTitle}>Cash Flow</Text>
          <BarChart
            data={analytics.cashFlow}
            width={width - 32}
            height={220}
            chartConfig={chartConfig}
            style={styles.chart}
            showValuesOnTopOfBars
          />
        </View>

        {/* Expense Breakdown */}
        <View style={styles.chartSection}>
          <Text style={styles.chartTitle}>Expense Breakdown</Text>
          <PieChart
            data={analytics.expenseBreakdown}
            width={width - 32}
            height={220}
            chartConfig={chartConfig}
            accessor="amount"
            backgroundColor="transparent"
            paddingLeft="15"
            absolute
          />
        </View>

        {/* Property Value Chart */}
        <View style={styles.chartSection}>
          <Text style={styles.chartTitle}>Property Value Over Time</Text>
          <LineChart
            data={analytics.propertyValue}
            width={width - 32}
            height={220}
            chartConfig={{
              ...chartConfig,
              color: (opacity = 1) => `rgba(155, 89, 182, ${opacity})`,
            }}
            bezier
            style={styles.chart}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.white,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: COLORS.white,
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: COLORS.gray,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.lightGray,
  },
  backButton: {
    marginRight: 16,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: COLORS.darkGray,
  },
  content: {
    flex: 1,
    padding: 16,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: COLORS.darkGray,
    marginBottom: 16,
  },
  overviewContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  overviewItem: {
    width: "48%",
    backgroundColor: COLORS.background,
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
  },
  overviewLabel: {
    fontSize: 14,
    color: COLORS.gray,
    marginBottom: 8,
  },
  overviewValue: {
    fontSize: 18,
    fontWeight: "bold",
    color: COLORS.darkGray,
  },
  metricsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  metricCard: {
    width: "31%",
    backgroundColor: COLORS.primary,
    borderRadius: 8,
    padding: 16,
    alignItems: "center",
  },
  metricValue: {
    fontSize: 20,
    fontWeight: "bold",
    color: COLORS.white,
    marginBottom: 8,
  },
  metricLabel: {
    fontSize: 12,
    color: COLORS.white,
    textAlign: "center",
  },
  timeRangeContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 24,
  },
  timeRangeLabel: {
    fontSize: 16,
    color: COLORS.darkGray,
    marginRight: 16,
  },
  timeRangeButtons: {
    flexDirection: "row",
  },
  timeRangeButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    backgroundColor: COLORS.background,
    marginRight: 8,
  },
  timeRangeButtonActive: {
    backgroundColor: COLORS.primary,
  },
  timeRangeButtonText: {
    fontSize: 14,
    color: COLORS.darkGray,
  },
  timeRangeButtonTextActive: {
    color: COLORS.white,
  },
  chartSection: {
    marginBottom: 32,
  },
  chartTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: COLORS.darkGray,
    marginBottom: 16,
  },
  chart: {
    borderRadius: 8,
    paddingRight: 16,
  },
})

export default PropertyAnalyticsScreen

