"use client"

import { useState } from "react"
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, ActivityIndicator } from "react-native"
import { SafeAreaView } from "react-native-safe-area-context"
import { COLORS } from "../constants/colors"
import Card from "../components/ui/Card"
import { useProperties, usePayments, useTenants } from "../hooks/useApi"

// Report types
type ReportType = "financial" | "occupancy" | "maintenance" | "tenant"

const ReportsScreen = () => {
  const [selectedReport, setSelectedReport] = useState<ReportType>("financial")
  const [timeframe, setTimeframe] = useState<"month" | "quarter" | "year">("month")

  // API hooks
  const { data: properties, loading: loadingProperties } = useProperties()
  const { data: payments, loading: loadingPayments } = usePayments()
  const { data: tenants, loading: loadingTenants } = useTenants()

  // Calculate financial metrics
  const calculateFinancialMetrics = () => {
    if (!payments) return null

    // Get current date
    const now = new Date()
    const currentMonth = now.getMonth()
    const currentYear = now.getFullYear()

    // Filter payments based on timeframe
    const filteredPayments = payments.filter((payment) => {
      const paymentDate = new Date(payment.date)

      if (timeframe === "month") {
        return paymentDate.getMonth() === currentMonth && paymentDate.getFullYear() === currentYear
      } else if (timeframe === "quarter") {
        const paymentQuarter = Math.floor(paymentDate.getMonth() / 3)
        const currentQuarter = Math.floor(currentMonth / 3)
        return paymentQuarter === currentQuarter && paymentDate.getFullYear() === currentYear
      } else {
        return paymentDate.getFullYear() === currentYear
      }
    })

    // Calculate total revenue
    const totalRevenue = filteredPayments.reduce((sum, payment) => {
      if (payment.status === "paid" || payment.status === "partial") {
        return sum + payment.amount
      }
      return sum
    }, 0)

    // Calculate outstanding amount
    const outstandingAmount = filteredPayments.reduce((sum, payment) => {
      if (payment.status === "pending" || payment.status === "overdue") {
        return sum + payment.amount
      }
      return sum
    }, 0)

    // Calculate payment stats
    const paidCount = filteredPayments.filter((p) => p.status === "paid").length
    const pendingCount = filteredPayments.filter((p) => p.status === "pending").length
    const overdueCount = filteredPayments.filter((p) => p.status === "overdue").length
    const totalCount = filteredPayments.length

    // Calculate payment completion rate
    const completionRate = totalCount > 0 ? (paidCount / totalCount) * 100 : 0

    return {
      totalRevenue,
      outstandingAmount,
      paidCount,
      pendingCount,
      overdueCount,
      totalCount,
      completionRate,
    }
  }

  // Calculate occupancy metrics
  const calculateOccupancyMetrics = () => {
    if (!properties) return null

    // Count properties by status
    const totalProperties = properties.length
    const vacantCount = properties.filter((p) => p.status === "vacant").length
    const occupiedCount = properties.filter((p) => p.status === "occupied").length
    const maintenanceCount = properties.filter((p) => p.status === "maintenance").length
    const listedCount = properties.filter((p) => p.status === "listed").length

    // Calculate occupancy rate
    const occupancyRate = totalProperties > 0 ? (occupiedCount / totalProperties) * 100 : 0

    // Calculate potential monthly revenue
    const potentialRevenue = properties.reduce((sum, property) => sum + property.rent, 0)

    // Calculate actual monthly revenue from occupied properties
    const actualRevenue = properties
      .filter((p) => p.status === "occupied")
      .reduce((sum, property) => sum + property.rent, 0)

    // Calculate revenue efficiency
    const revenueEfficiency = potentialRevenue > 0 ? (actualRevenue / potentialRevenue) * 100 : 0

    return {
      totalProperties,
      vacantCount,
      occupiedCount,
      maintenanceCount,
      listedCount,
      occupancyRate,
      potentialRevenue,
      actualRevenue,
      revenueEfficiency,
    }
  }

  // Format currency
  const formatCurrency = (amount: number): string => {
    return `$${amount.toFixed(2).replace(/\d(?=(\d{3})+\.)/g, "$&,")}`
  }

  // Format percentage
  const formatPercentage = (value: number): string => {
    return `${value.toFixed(1)}%`
  }

  // Loading state
  const isLoading = loadingProperties || loadingPayments || loadingTenants

  // Metrics based on selected report
  const financialMetrics = calculateFinancialMetrics()
  const occupancyMetrics = calculateOccupancyMetrics()

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Reports & Analytics</Text>
      </View>

      <View style={styles.tabsContainer}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          <TouchableOpacity
            style={[styles.tab, selectedReport === "financial" && styles.selectedTab]}
            onPress={() => setSelectedReport("financial")}
          >
            <Text style={[styles.tabText, selectedReport === "financial" && styles.selectedTabText]}>Financial</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.tab, selectedReport === "occupancy" && styles.selectedTab]}
            onPress={() => setSelectedReport("occupancy")}
          >
            <Text style={[styles.tabText, selectedReport === "occupancy" && styles.selectedTabText]}>Occupancy</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.tab, selectedReport === "maintenance" && styles.selectedTab]}
            onPress={() => setSelectedReport("maintenance")}
          >
            <Text style={[styles.tabText, selectedReport === "maintenance" && styles.selectedTabText]}>
              Maintenance
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.tab, selectedReport === "tenant" && styles.selectedTab]}
            onPress={() => setSelectedReport("tenant")}
          >
            <Text style={[styles.tabText, selectedReport === "tenant" && styles.selectedTabText]}>Tenant</Text>
          </TouchableOpacity>
        </ScrollView>
      </View>

      <View style={styles.timeframeContainer}>
        <TouchableOpacity
          style={[styles.timeframeButton, timeframe === "month" && styles.selectedTimeframe]}
          onPress={() => setTimeframe("month")}
        >
          <Text style={[styles.timeframeText, timeframe === "month" && styles.selectedTimeframeText]}>Month</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.timeframeButton, timeframe === "quarter" && styles.selectedTimeframe]}
          onPress={() => setTimeframe("quarter")}
        >
          <Text style={[styles.timeframeText, timeframe === "quarter" && styles.selectedTimeframeText]}>Quarter</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.timeframeButton, timeframe === "year" && styles.selectedTimeframe]}
          onPress={() => setTimeframe("year")}
        >
          <Text style={[styles.timeframeText, timeframe === "year" && styles.selectedTimeframeText]}>Year</Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.contentContainer}>
        {isLoading ? (
          <ActivityIndicator size="large" color={COLORS.primary} style={styles.loader} />
        ) : (
          <>
            {selectedReport === "financial" && financialMetrics && (
              <View>
                <Card title="Revenue Summary" elevated>
                  <View style={styles.metricsRow}>
                    <View style={styles.metricItem}>
                      <Text style={styles.metricValue}>{formatCurrency(financialMetrics.totalRevenue)}</Text>
                      <Text style={styles.metricLabel}>Total Revenue</Text>
                    </View>
                    <View style={styles.metricItem}>
                      <Text style={styles.metricValue}>{formatCurrency(financialMetrics.outstandingAmount)}</Text>
                      <Text style={styles.metricLabel}>Outstanding</Text>
                    </View>
                  </View>
                </Card>

                <Card title="Payment Stats" elevated>
                  <View style={styles.metricsRow}>
                    <View style={styles.metricItem}>
                      <Text style={styles.metricValue}>{financialMetrics.paidCount}</Text>
                      <Text style={styles.metricLabel}>Paid</Text>
                    </View>
                    <View style={styles.metricItem}>
                      <Text style={styles.metricValue}>{financialMetrics.pendingCount}</Text>
                      <Text style={styles.metricLabel}>Pending</Text>
                    </View>
                    <View style={styles.metricItem}>
                      <Text style={styles.metricValue}>{financialMetrics.overdueCount}</Text>
                      <Text style={styles.metricLabel}>Overdue</Text>
                    </View>
                  </View>
                  <View style={styles.completionContainer}>
                    <Text style={styles.completionLabel}>Payment Completion Rate</Text>
                    <View style={styles.progressBarContainer}>
                      <View style={[styles.progressBar, { width: `${financialMetrics.completionRate}%` }]} />
                    </View>
                    <Text style={styles.completionValue}>{formatPercentage(financialMetrics.completionRate)}</Text>
                  </View>
                </Card>
              </View>
            )}

            {selectedReport === "occupancy" && occupancyMetrics && (
              <View>
                <Card title="Property Overview" elevated>
                  <View style={styles.metricsRow}>
                    <View style={styles.metricItem}>
                      <Text style={styles.metricValue}>{occupancyMetrics.totalProperties}</Text>
                      <Text style={styles.metricLabel}>Total</Text>
                    </View>
                    <View style={styles.metricItem}>
                      <Text style={styles.metricValue}>{occupancyMetrics.occupiedCount}</Text>
                      <Text style={styles.metricLabel}>Occupied</Text>
                    </View>
                    <View style={styles.metricItem}>
                      <Text style={styles.metricValue}>{occupancyMetrics.vacantCount}</Text>
                      <Text style={styles.metricLabel}>Vacant</Text>
                    </View>
                  </View>
                </Card>

                <Card title="Occupancy Rate" elevated>
                  <View style={styles.completionContainer}>
                    <View style={styles.progressBarContainer}>
                      <View style={[styles.progressBar, { width: `${occupancyMetrics.occupancyRate}%` }]} />
                    </View>
                    <Text style={styles.completionValue}>{formatPercentage(occupancyMetrics.occupancyRate)}</Text>
                  </View>
                </Card>

                <Card title="Revenue Efficiency" elevated>
                  <View style={styles.metricsRow}>
                    <View style={styles.metricItem}>
                      <Text style={styles.metricValue}>{formatCurrency(occupancyMetrics.potentialRevenue)}</Text>
                      <Text style={styles.metricLabel}>Potential</Text>
                    </View>
                    <View style={styles.metricItem}>
                      <Text style={styles.metricValue}>{formatCurrency(occupancyMetrics.actualRevenue)}</Text>
                      <Text style={styles.metricLabel}>Actual</Text>
                    </View>
                  </View>
                  <View style={styles.completionContainer}>
                    <View style={styles.progressBarContainer}>
                      <View style={[styles.progressBar, { width: `${occupancyMetrics.revenueEfficiency}%` }]} />
                    </View>
                    <Text style={styles.completionValue}>{formatPercentage(occupancyMetrics.revenueEfficiency)}</Text>
                  </View>
                </Card>
              </View>
            )}

            {selectedReport === "maintenance" && (
              <View style={styles.comingSoonContainer}>
                <Text style={styles.comingSoonText}>Maintenance reports coming soon</Text>
              </View>
            )}

            {selectedReport === "tenant" && (
              <View style={styles.comingSoonContainer}>
                <Text style={styles.comingSoonText}>Tenant reports coming soon</Text>
              </View>
            )}
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
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.lightGray,
    backgroundColor: COLORS.white,
  },
  headerTitle: {
    fontSize: 20,
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
  timeframeContainer: {
    flexDirection: "row",
    backgroundColor: COLORS.white,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.lightGray,
  },
  timeframeButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    marginRight: 8,
    backgroundColor: COLORS.lightGray,
  },
  selectedTimeframe: {
    backgroundColor: COLORS.primaryLight,
  },
  timeframeText: {
    fontSize: 14,
    color: COLORS.darkGray,
  },
  selectedTimeframeText: {
    color: COLORS.white,
    fontWeight: "500",
  },
  contentContainer: {
    flex: 1,
    padding: 16,
  },
  loader: {
    marginTop: 40,
  },
  metricsRow: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginBottom: 16,
  },
  metricItem: {
    alignItems: "center",
  },
  metricValue: {
    fontSize: 20,
    fontWeight: "bold",
    color: COLORS.darkGray,
    marginBottom: 4,
  },
  metricLabel: {
    fontSize: 14,
    color: COLORS.gray,
  },
  completionContainer: {
    marginTop: 8,
  },
  completionLabel: {
    fontSize: 14,
    color: COLORS.darkGray,
    marginBottom: 4,
  },
  progressBarContainer: {
    height: 8,
    backgroundColor: COLORS.lightGray,
    borderRadius: 4,
    overflow: "hidden",
    marginBottom: 4,
  },
  progressBar: {
    height: 8,
    backgroundColor: COLORS.success,
    borderRadius: 4,
  },
  completionValue: {
    fontSize: 14,
    fontWeight: "500",
    color: COLORS.darkGray,
    textAlign: "right",
  },
  comingSoonContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 40,
  },
  comingSoonText: {
    fontSize: 18,
    color: COLORS.gray,
    textAlign: "center",
  },
})

export default ReportsScreen

