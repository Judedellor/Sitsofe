"use client"

import { useState } from "react"
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, ActivityIndicator } from "react-native"
import { SafeAreaView } from "react-native-safe-area-context"
import { COLORS } from "../constants/colors"
import { Ionicons } from "@expo/vector-icons"
import { useNavigation } from "@react-navigation/native"
import Card from "../components/ui/Card"
import { BarChart, LineChart } from "react-native-chart-kit"
import { Dimensions } from "react-native"

const { width } = Dimensions.get("window")

// Benchmark categories
type BenchmarkCategory = "financial" | "operational" | "tenant" | "maintenance"

// Sample benchmark data
const benchmarkData = {
  financial: {
    metrics: [
      {
        name: "Rent per Square Foot",
        propertyValue: 2.15,
        marketAverage: 1.95,
        topPerformers: 2.35,
        unit: "$/sqft",
        percentile: 75,
      },
      {
        name: "Operating Expense Ratio",
        propertyValue: 42,
        marketAverage: 45,
        topPerformers: 38,
        unit: "%",
        percentile: 60,
      },
      {
        name: "Net Operating Income",
        propertyValue: 12500,
        marketAverage: 11200,
        topPerformers: 14800,
        unit: "$",
        percentile: 65,
      },
      {
        name: "Cap Rate",
        propertyValue: 5.8,
        marketAverage: 5.2,
        topPerformers: 6.5,
        unit: "%",
        percentile: 70,
      },
    ],
    chartData: {
      labels: ["Your Portfolio", "Market Average", "Top Performers"],
      datasets: [
        {
          data: [5.8, 5.2, 6.5],
        },
      ],
    },
  },
  operational: {
    metrics: [
      {
        name: "Occupancy Rate",
        propertyValue: 94,
        marketAverage: 91,
        topPerformers: 97,
        unit: "%",
        percentile: 80,
      },
      {
        name: "Tenant Turnover",
        propertyValue: 18,
        marketAverage: 22,
        topPerformers: 15,
        unit: "%",
        percentile: 75,
      },
      {
        name: "Lease Renewal Rate",
        propertyValue: 76,
        marketAverage: 70,
        topPerformers: 85,
        unit: "%",
        percentile: 65,
      },
      {
        name: "Days to Lease",
        propertyValue: 24,
        marketAverage: 32,
        topPerformers: 18,
        unit: "days",
        percentile: 70,
      },
    ],
    chartData: {
      labels: ["Occupancy", "Turnover", "Renewal", "Days to Lease"],
      datasets: [
        {
          data: [94, 18, 76, 24],
          color: (opacity = 1) => `rgba(71, 136, 255, ${opacity})`,
          strokeWidth: 2,
        },
        {
          data: [91, 22, 70, 32],
          color: (opacity = 1) => `rgba(150, 150, 150, ${opacity})`,
          strokeWidth: 2,
        },
        {
          data: [97, 15, 85, 18],
          color: (opacity = 1) => `rgba(46, 204, 113, ${opacity})`,
          strokeWidth: 2,
        },
      ],
      legend: ["Your Portfolio", "Market Average", "Top Performers"],
    },
  },
  tenant: {
    metrics: [
      {
        name: "Tenant Satisfaction",
        propertyValue: 4.2,
        marketAverage: 3.8,
        topPerformers: 4.7,
        unit: "/5",
        percentile: 75,
      },
      {
        name: "Response Time",
        propertyValue: 1.2,
        marketAverage: 2.5,
        topPerformers: 0.8,
        unit: "days",
        percentile: 85,
      },
      {
        name: "Maintenance Satisfaction",
        propertyValue: 3.9,
        marketAverage: 3.6,
        topPerformers: 4.5,
        unit: "/5",
        percentile: 65,
      },
      {
        name: "Tenant Referrals",
        propertyValue: 15,
        marketAverage: 10,
        topPerformers: 25,
        unit: "%",
        percentile: 60,
      },
    ],
    chartData: {
      labels: ["Satisfaction", "Response", "Maintenance", "Referrals"],
      datasets: [
        {
          data: [4.2, 1.2, 3.9, 15],
        },
      ],
    },
  },
  maintenance: {
    metrics: [
      {
        name: "Maintenance Cost per Unit",
        propertyValue: 850,
        marketAverage: 1200,
        topPerformers: 750,
        unit: "$",
        percentile: 80,
      },
      {
        name: "Preventive Maintenance",
        propertyValue: 65,
        marketAverage: 45,
        topPerformers: 75,
        unit: "%",
        percentile: 75,
      },
      {
        name: "Work Order Completion",
        propertyValue: 3.5,
        marketAverage: 5.2,
        topPerformers: 2.1,
        unit: "days",
        percentile: 70,
      },
      {
        name: "Emergency Response",
        propertyValue: 2.5,
        marketAverage: 4.0,
        topPerformers: 1.5,
        unit: "hours",
        percentile: 65,
      },
    ],
    chartData: {
      labels: ["Cost/Unit", "Preventive", "Completion", "Emergency"],
      datasets: [
        {
          data: [850, 65, 3.5, 2.5],
        },
      ],
    },
  },
}

const PerformanceBenchmarkingScreen = () => {
  const navigation = useNavigation()
  const [selectedCategory, setSelectedCategory] = useState<BenchmarkCategory>("financial")
  const [isLoading, setIsLoading] = useState(false)
  const [showingTrends, setShowingTrends] = useState(false)

  // Chart configuration
  const chartConfig = {
    backgroundGradientFrom: "#ffffff",
    backgroundGradientTo: "#ffffff",
    color: (opacity = 1) => `rgba(33, 150, 243, ${opacity})`,
    strokeWidth: 2,
    barPercentage: 0.5,
    useShadowColorFromDataset: false,
    decimalPlaces: 1,
  }

  // Get percentile color
  const getPercentileColor = (percentile: number) => {
    if (percentile >= 80) return COLORS.success
    if (percentile >= 60) return COLORS.primary
    if (percentile >= 40) return COLORS.warning
    return COLORS.error
  }

  // Get comparison indicator
  const getComparisonIndicator = (value: number, benchmark: number, isLowerBetter = false) => {
    const percentage = ((value - benchmark) / benchmark) * 100
    const isPositive = isLowerBetter ? percentage < 0 : percentage > 0

    return (
      <View style={styles.comparisonContainer}>
        <Ionicons
          name={isPositive ? "arrow-up" : "arrow-down"}
          size={16}
          color={isPositive ? COLORS.success : COLORS.error}
        />
        <Text style={[styles.comparisonText, { color: isPositive ? COLORS.success : COLORS.error }]}>
          {Math.abs(percentage).toFixed(1)}%
        </Text>
      </View>
    )
  }

  // Toggle trends view
  const toggleTrends = () => {
    setIsLoading(true)
    setTimeout(() => {
      setShowingTrends(!showingTrends)
      setIsLoading(false)
    }, 1000)
  }

  // Trend data (sample)
  const trendData = {
    labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
    datasets: [
      {
        data: [91, 92, 93, 94, 93, 94],
        color: (opacity = 1) => `rgba(71, 136, 255, ${opacity})`,
        strokeWidth: 2,
      },
      {
        data: [89, 90, 90, 91, 91, 91],
        color: (opacity = 1) => `rgba(150, 150, 150, ${opacity})`,
        strokeWidth: 2,
      },
    ],
    legend: ["Your Portfolio", "Market Average"],
  }

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color={COLORS.darkGray} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Performance Benchmarking</Text>
        <TouchableOpacity style={styles.actionButton} onPress={toggleTrends}>
          <Ionicons name={showingTrends ? "stats-chart" : "trending-up"} size={24} color={COLORS.primary} />
        </TouchableOpacity>
      </View>

      <View style={styles.tabsContainer}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          <TouchableOpacity
            style={[styles.tab, selectedCategory === "financial" && styles.selectedTab]}
            onPress={() => setSelectedCategory("financial")}
          >
            <Text style={[styles.tabText, selectedCategory === "financial" && styles.selectedTabText]}>Financial</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.tab, selectedCategory === "operational" && styles.selectedTab]}
            onPress={() => setSelectedCategory("operational")}
          >
            <Text style={[styles.tabText, selectedCategory === "operational" && styles.selectedTabText]}>
              Operational
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.tab, selectedCategory === "tenant" && styles.selectedTab]}
            onPress={() => setSelectedCategory("tenant")}
          >
            <Text style={[styles.tabText, selectedCategory === "tenant" && styles.selectedTabText]}>Tenant</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.tab, selectedCategory === "maintenance" && styles.selectedTab]}
            onPress={() => setSelectedCategory("maintenance")}
          >
            <Text style={[styles.tabText, selectedCategory === "maintenance" && styles.selectedTabText]}>
              Maintenance
            </Text>
          </TouchableOpacity>
        </ScrollView>
      </View>

      {isLoading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={COLORS.primary} />
          <Text style={styles.loadingText}>Loading benchmark data...</Text>
        </View>
      ) : (
        <ScrollView style={styles.content}>
          {!showingTrends ? (
            <>
              {/* Metrics Cards */}
              {benchmarkData[selectedCategory].metrics.map((metric, index) => (
                <Card key={index} elevated>
                  <View style={styles.metricHeader}>
                    <Text style={styles.metricName}>{metric.name}</Text>
                    <View style={styles.percentileContainer}>
                      <View
                        style={[styles.percentileBadge, { backgroundColor: getPercentileColor(metric.percentile) }]}
                      >
                        <Text style={styles.percentileText}>{metric.percentile}th</Text>
                      </View>
                      <Text style={styles.percentileLabel}>percentile</Text>
                    </View>
                  </View>

                  <View style={styles.metricContent}>
                    <View style={styles.metricValueContainer}>
                      <Text style={styles.metricValueLabel}>Your Portfolio</Text>
                      <Text style={styles.metricValue}>
                        {metric.propertyValue}
                        <Text style={styles.metricUnit}>{metric.unit}</Text>
                      </Text>
                    </View>

                    <View style={styles.benchmarkContainer}>
                      <View style={styles.benchmarkItem}>
                        <Text style={styles.benchmarkLabel}>Market Average</Text>
                        <Text style={styles.benchmarkValue}>
                          {metric.marketAverage}
                          <Text style={styles.benchmarkUnit}>{metric.unit}</Text>
                        </Text>
                        {getComparisonIndicator(
                          metric.propertyValue,
                          metric.marketAverage,
                          metric.name.includes("Expense") ||
                            metric.name.includes("Cost") ||
                            metric.name.includes("Days") ||
                            metric.name.includes("Turnover") ||
                            metric.name.includes("Response"),
                        )}
                      </View>

                      <View style={styles.benchmarkItem}>
                        <Text style={styles.benchmarkLabel}>Top Performers</Text>
                        <Text style={styles.benchmarkValue}>
                          {metric.topPerformers}
                          <Text style={styles.benchmarkUnit}>{metric.unit}</Text>
                        </Text>
                      </View>
                    </View>
                  </View>
                </Card>
              ))}

              {/* Chart */}
              <Card title="Comparative Analysis" elevated>
                {selectedCategory === "operational" ? (
                  <LineChart
                    data={benchmarkData[selectedCategory].chartData}
                    width={width - 48}
                    height={220}
                    chartConfig={chartConfig}
                    bezier
                    style={styles.chart}
                    fromZero
                  />
                ) : (
                  <BarChart
                    data={benchmarkData[selectedCategory].chartData}
                    width={width - 48}
                    height={220}
                    chartConfig={chartConfig}
                    style={styles.chart}
                    fromZero
                  />
                )}
              </Card>

              {/* Insights */}
              <Card title="Insights & Recommendations" elevated>
                <View style={styles.insightItem}>
                  <View style={styles.insightIcon}>
                    <Ionicons name="trending-up" size={20} color={COLORS.success} />
                  </View>
                  <View style={styles.insightContent}>
                    <Text style={styles.insightText}>
                      Your{" "}
                      {selectedCategory === "financial"
                        ? "rent per square foot"
                        : selectedCategory === "operational"
                          ? "occupancy rate"
                          : selectedCategory === "tenant"
                            ? "tenant satisfaction"
                            : "maintenance cost per unit"}{" "}
                      is performing above market average.
                    </Text>
                  </View>
                </View>

                <View style={styles.insightItem}>
                  <View style={styles.insightIcon}>
                    <Ionicons name="trending-down" size={20} color={COLORS.error} />
                  </View>
                  <View style={styles.insightContent}>
                    <Text style={styles.insightText}>
                      Your{" "}
                      {selectedCategory === "financial"
                        ? "net operating income"
                        : selectedCategory === "operational"
                          ? "lease renewal rate"
                          : selectedCategory === "tenant"
                            ? "tenant referrals"
                            : "emergency response time"}{" "}
                      is below top performers in your market.
                    </Text>
                  </View>
                </View>

                <View style={styles.insightItem}>
                  <View style={styles.insightIcon}>
                    <Ionicons name="bulb" size={20} color={COLORS.warning} />
                  </View>
                  <View style={styles.insightContent}>
                    <Text style={styles.insightText}>
                      Recommendation:{" "}
                      {selectedCategory === "financial"
                        ? "Consider reviewing your pricing strategy to optimize revenue."
                        : selectedCategory === "operational"
                          ? "Implement tenant retention programs to improve renewal rates."
                          : selectedCategory === "tenant"
                            ? "Enhance your referral program to increase tenant referrals."
                            : "Invest in preventive maintenance to reduce emergency response needs."}
                    </Text>
                  </View>
                </View>
              </Card>
            </>
          ) : (
            <>
              {/* Trend Analysis */}
              <Card title="6-Month Trend Analysis" elevated>
                <LineChart
                  data={trendData}
                  width={width - 48}
                  height={220}
                  chartConfig={chartConfig}
                  bezier
                  style={styles.chart}
                />
                <Text style={styles.chartCaption}>
                  {selectedCategory === "financial"
                    ? "Cap Rate"
                    : selectedCategory === "operational"
                      ? "Occupancy Rate (%)"
                      : selectedCategory === "tenant"
                        ? "Tenant Satisfaction"
                        : "Preventive Maintenance (%)"}
                </Text>
              </Card>

              <Card title="Trend Insights" elevated>
                <View style={styles.insightItem}>
                  <View style={styles.insightIcon}>
                    <Ionicons name="analytics" size={20} color={COLORS.primary} />
                  </View>
                  <View style={styles.insightContent}>
                    <Text style={styles.insightText}>
                      Your{" "}
                      {selectedCategory === "financial"
                        ? "financial metrics"
                        : selectedCategory === "operational"
                          ? "occupancy rates"
                          : selectedCategory === "tenant"
                            ? "tenant satisfaction scores"
                            : "maintenance efficiency"}{" "}
                      have shown consistent improvement over the past 6 months.
                    </Text>
                  </View>
                </View>

                <View style={styles.insightItem}>
                  <View style={styles.insightIcon}>
                    <Ionicons name="trending-up" size={20} color={COLORS.success} />
                  </View>
                  <View style={styles.insightContent}>
                    <Text style={styles.insightText}>
                      You're outpacing market growth by{" "}
                      {selectedCategory === "financial"
                        ? "2.5%"
                        : selectedCategory === "operational"
                          ? "3.2%"
                          : selectedCategory === "tenant"
                            ? "4.1%"
                            : "5.3%"}{" "}
                      in this category.
                    </Text>
                  </View>
                </View>

                <View style={styles.insightItem}>
                  <View style={styles.insightIcon}>
                    <Ionicons name="calendar" size={20} color={COLORS.warning} />
                  </View>
                  <View style={styles.insightContent}>
                    <Text style={styles.insightText}>
                      Seasonal trends indicate that{" "}
                      {selectedCategory === "financial"
                        ? "Q3 and Q4"
                        : selectedCategory === "operational"
                          ? "summer months"
                          : selectedCategory === "tenant"
                            ? "spring and fall"
                            : "winter months"}{" "}
                      typically show the strongest performance in this category.
                    </Text>
                  </View>
                </View>
              </Card>

              <Card title="Market Comparison" elevated>
                <View style={styles.marketComparisonContainer}>
                  <View style={styles.marketComparisonItem}>
                    <Text style={styles.marketComparisonLabel}>Your Growth Rate</Text>
                    <Text style={styles.marketComparisonValue}>+3.2%</Text>
                  </View>
                  <View style={styles.marketComparisonItem}>
                    <Text style={styles.marketComparisonLabel}>Market Average</Text>
                    <Text style={styles.marketComparisonValue}>+2.1%</Text>
                  </View>
                  <View style={styles.marketComparisonItem}>
                    <Text style={styles.marketComparisonLabel}>Top Performers</Text>
                    <Text style={styles.marketComparisonValue}>+5.7%</Text>
                  </View>
                </View>
                <View style={styles.marketPositionContainer}>
                  <Text style={styles.marketPositionLabel}>Your Market Position:</Text>
                  <Text style={styles.marketPositionValue}>Top 25%</Text>
                </View>
              </Card>
            </>
          )}
        </ScrollView>
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
    borderBottomColor: COLORS.lightGray,
  },
  backButton: {
    padding: 4,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: COLORS.darkGray,
  },
  actionButton: {
    padding: 4,
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
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: COLORS.gray,
  },
  metricHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  metricName: {
    fontSize: 18,
    fontWeight: "bold",
    color: COLORS.darkGray,
  },
  percentileContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  percentileBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    marginRight: 4,
  },
  percentileText: {
    color: COLORS.white,
    fontWeight: "bold",
    fontSize: 12,
  },
  percentileLabel: {
    fontSize: 12,
    color: COLORS.gray,
  },
  metricContent: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  metricValueContainer: {
    flex: 1,
    borderRightWidth: 1,
    borderRightColor: COLORS.lightGray,
    paddingRight: 16,
  },
  metricValueLabel: {
    fontSize: 14,
    color: COLORS.gray,
    marginBottom: 4,
  },
  metricValue: {
    fontSize: 24,
    fontWeight: "bold",
    color: COLORS.primary,
  },
  metricUnit: {
    fontSize: 14,
    color: COLORS.gray,
    fontWeight: "normal",
  },
  benchmarkContainer: {
    flex: 2,
    paddingLeft: 16,
  },
  benchmarkItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  benchmarkLabel: {
    fontSize: 14,
    color: COLORS.gray,
  },
  benchmarkValue: {
    fontSize: 16,
    fontWeight: "500",
    color: COLORS.darkGray,
  },
  benchmarkUnit: {
    fontSize: 12,
    color: COLORS.gray,
    fontWeight: "normal",
  },
  comparisonContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginLeft: 8,
  },
  comparisonText: {
    fontSize: 12,
    fontWeight: "500",
    marginLeft: 2,
  },
  chart: {
    marginVertical: 8,
    borderRadius: 8,
  },
  chartCaption: {
    textAlign: "center",
    fontSize: 14,
    color: COLORS.gray,
    marginTop: 8,
  },
  insightItem: {
    flexDirection: "row",
    marginBottom: 16,
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
  marketComparisonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 16,
  },
  marketComparisonItem: {
    alignItems: "center",
  },
  marketComparisonLabel: {
    fontSize: 14,
    color: COLORS.gray,
    marginBottom: 4,
  },
  marketComparisonValue: {
    fontSize: 18,
    fontWeight: "bold",
    color: COLORS.darkGray,
  },
  marketPositionContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: COLORS.primaryLight,
    paddingVertical: 8,
    borderRadius: 4,
  },
  marketPositionLabel: {
    fontSize: 14,
    color: COLORS.darkGray,
    marginRight: 4,
  },
  marketPositionValue: {
    fontSize: 16,
    fontWeight: "bold",
    color: COLORS.primary,
  },
})

export default PerformanceBenchmarkingScreen

