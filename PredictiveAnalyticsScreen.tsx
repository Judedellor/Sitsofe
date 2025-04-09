"use client"

import { useState } from "react"
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, ActivityIndicator } from "react-native"
import { SafeAreaView } from "react-native-safe-area-context"
import { COLORS } from "../constants/colors"
import { Ionicons } from "@expo/vector-icons"
import { useNavigation } from "@react-navigation/native"
import Card from "../components/ui/Card"
import { LineChart } from "react-native-chart-kit"
import { Dimensions } from "react-native"

const { width } = Dimensions.get("window")

// Forecast types
type ForecastType = "occupancy" | "revenue" | "maintenance" | "property-value"

// Sample forecast data
const forecastData = {
  occupancy: {
    current: 94,
    forecast: [94, 95, 96, 97, 96, 95],
    labels: ["Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
    confidence: 85,
    factors: [
      { name: "Seasonal Demand", impact: "High", direction: "positive" },
      { name: "Local Job Growth", impact: "Medium", direction: "positive" },
      { name: "New Developments", impact: "Low", direction: "negative" },
    ],
    recommendations: [
      "Prepare for increased demand in September-October",
      "Consider slight rent increases for new leases in high-demand months",
      "Plan maintenance activities during lower occupancy periods",
    ],
  },
  revenue: {
    current: 42500,
    forecast: [42500, 43200, 44800, 46500, 45800, 44200],
    labels: ["Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
    confidence: 80,
    factors: [
      { name: "Occupancy Trends", impact: "High", direction: "positive" },
      { name: "Seasonal Pricing", impact: "Medium", direction: "positive" },
      { name: "Local Market Conditions", impact: "Medium", direction: "positive" },
    ],
    recommendations: [
      "Implement dynamic pricing strategy for peak months",
      "Consider offering incentives for longer lease terms",
      "Review additional revenue opportunities (parking, storage, etc.)",
    ],
  },
  maintenance: {
    current: 8500,
    forecast: [8500, 7800, 9200, 10500, 12000, 9500],
    labels: ["Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
    confidence: 75,
    factors: [
      { name: "Seasonal Weather", impact: "High", direction: "negative" },
      { name: "Property Age", impact: "Medium", direction: "negative" },
      { name: "Recent Renovations", impact: "Medium", direction: "positive" },
    ],
    recommendations: [
      "Schedule preventive maintenance before November peak",
      "Budget for 15% higher maintenance costs in Q4",
      "Consider HVAC system upgrades to reduce winter maintenance",
    ],
  },
  "property-value": {
    current: 1450000,
    forecast: [1450000, 1465000, 1480000, 1495000, 1510000, 1525000],
    labels: ["Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
    confidence: 70,
    factors: [
      { name: "Local Market Growth", impact: "High", direction: "positive" },
      { name: "Interest Rates", impact: "Medium", direction: "negative" },
      { name: "Neighborhood Development", impact: "Medium", direction: "positive" },
    ],
    recommendations: [
      "Consider refinancing options in the next 3-6 months",
      "Evaluate potential property improvements for maximum value increase",
      "Monitor comparable property sales in the area",
    ],
  },
}

// Scenario data
const scenarioData = {
  optimistic: [94, 96, 98, 99, 98, 97],
  baseline: [94, 95, 96, 97, 96, 95],
  conservative: [94, 93, 94, 95, 94, 93],
}

const PredictiveAnalyticsScreen = () => {
  const navigation = useNavigation()
  const [selectedForecast, setSelectedForecast] = useState<ForecastType>("occupancy")
  const [isLoading, setIsLoading] = useState(false)
  const [showingScenarios, setShowingScenarios] = useState(false)
  const [timeframe, setTimeframe] = useState("6m")

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

  // Format currency
  const formatCurrency = (amount: number): string => {
    return `$${amount.toFixed(0).replace(/\d(?=(\d{3})+$)/g, "$&,")}`
  }

  // Get impact color
  const getImpactColor = (impact: string, direction: string) => {
    if (impact === "High" && direction === "positive") return COLORS.success
    if (impact === "High" && direction === "negative") return COLORS.error
    if (impact === "Medium" && direction === "positive") return COLORS.primary
    if (impact === "Medium" && direction === "negative") return COLORS.warning
    return COLORS.gray
  }

  // Toggle scenarios view
  const toggleScenarios = () => {
    setIsLoading(true)
    setTimeout(() => {
      setShowingScenarios(!showingScenarios)
      setIsLoading(false)
    }, 1000)
  }

  // Prepare chart data
  const getChartData = () => {
    const forecast = forecastData[selectedForecast]

    if (showingScenarios) {
      return {
        labels: forecast.labels,
        datasets: [
          {
            data: scenarioData.optimistic,
            color: (opacity = 1) => `rgba(46, 204, 113, ${opacity})`,
            strokeWidth: 2,
          },
          {
            data: scenarioData.baseline,
            color: (opacity = 1) => `rgba(33, 150, 243, ${opacity})`,
            strokeWidth: 2,
          },
          {
            data: scenarioData.conservative,
            color: (opacity = 1) => `rgba(231, 76, 60, ${opacity})`,
            strokeWidth: 2,
          },
        ],
        legend: ["Optimistic", "Baseline", "Conservative"],
      }
    } else {
      return {
        labels: forecast.labels,
        datasets: [
          {
            data: forecast.forecast,
            color: (opacity = 1) => `rgba(33, 150, 243, ${opacity})`,
            strokeWidth: 2,
          },
        ],
      }
    }
  }

  // Get forecast title
  const getForecastTitle = () => {
    switch (selectedForecast) {
      case "occupancy":
        return "Occupancy Rate Forecast"
      case "revenue":
        return "Revenue Forecast"
      case "maintenance":
        return "Maintenance Cost Forecast"
      case "property-value":
        return "Property Value Forecast"
      default:
        return "Forecast"
    }
  }

  // Get forecast unit
  const getForecastUnit = () => {
    switch (selectedForecast) {
      case "occupancy":
        return "%"
      case "revenue":
      case "maintenance":
      case "property-value":
        return "$"
      default:
        return ""
    }
  }

  // Format forecast value
  const formatForecastValue = (value: number) => {
    if (selectedForecast === "occupancy") {
      return `${value}%`
    } else if (selectedForecast === "property-value") {
      return formatCurrency(value)
    } else {
      return formatCurrency(value)
    }
  }

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color={COLORS.darkGray} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Predictive Analytics</Text>
        <TouchableOpacity style={styles.actionButton} onPress={toggleScenarios}>
          <Ionicons name={showingScenarios ? "analytics" : "git-branch"} size={24} color={COLORS.primary} />
        </TouchableOpacity>
      </View>

      <View style={styles.tabsContainer}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          <TouchableOpacity
            style={[styles.tab, selectedForecast === "occupancy" && styles.selectedTab]}
            onPress={() => setSelectedForecast("occupancy")}
          >
            <Text style={[styles.tabText, selectedForecast === "occupancy" && styles.selectedTabText]}>Occupancy</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.tab, selectedForecast === "revenue" && styles.selectedTab]}
            onPress={() => setSelectedForecast("revenue")}
          >
            <Text style={[styles.tabText, selectedForecast === "revenue" && styles.selectedTabText]}>Revenue</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.tab, selectedForecast === "maintenance" && styles.selectedTab]}
            onPress={() => setSelectedForecast("maintenance")}
          >
            <Text style={[styles.tabText, selectedForecast === "maintenance" && styles.selectedTabText]}>
              Maintenance
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.tab, selectedForecast === "property-value" && styles.selectedTab]}
            onPress={() => setSelectedForecast("property-value")}
          >
            <Text style={[styles.tabText, selectedForecast === "property-value" && styles.selectedTabText]}>
              Property Value
            </Text>
          </TouchableOpacity>
        </ScrollView>
      </View>

      <View style={styles.timeframeContainer}>
        <TouchableOpacity
          style={[styles.timeframeButton, timeframe === "6m" && styles.selectedTimeframe]}
          onPress={() => setTimeframe("6m")}
        >
          <Text style={[styles.timeframeText, timeframe === "6m" && styles.selectedTimeframeText]}>6 Months</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.timeframeButton, timeframe === "1y" && styles.selectedTimeframe]}
          onPress={() => setTimeframe("1y")}
        >
          <Text style={[styles.timeframeText, timeframe === "1y" && styles.selectedTimeframeText]}>1 Year</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.timeframeButton, timeframe === "3y" && styles.selectedTimeframe]}
          onPress={() => setTimeframe("3y")}
        >
          <Text style={[styles.timeframeText, timeframe === "3y" && styles.selectedTimeframeText]}>3 Years</Text>
        </TouchableOpacity>
      </View>

      {isLoading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={COLORS.primary} />
          <Text style={styles.loadingText}>Generating forecast...</Text>
        </View>
      ) : (
        <ScrollView style={styles.content}>
          {/* Current Value */}
          <Card elevated>
            <View style={styles.currentValueContainer}>
              <View>
                <Text style={styles.currentValueLabel}>
                  Current{" "}
                  {selectedForecast === "occupancy"
                    ? "Occupancy Rate"
                    : selectedForecast === "revenue"
                      ? "Monthly Revenue"
                      : selectedForecast === "maintenance"
                        ? "Monthly Maintenance Cost"
                        : "Property Value"}
                </Text>
                <Text style={styles.currentValue}>{formatForecastValue(forecastData[selectedForecast].current)}</Text>
              </View>
              <View style={styles.forecastSummaryContainer}>
                <Text style={styles.forecastSummaryLabel}>6-Month Forecast</Text>
                <View style={styles.forecastTrendContainer}>
                  <Ionicons
                    name={
                      forecastData[selectedForecast].forecast[5] > forecastData[selectedForecast].current
                        ? "trending-up"
                        : "trending-down"
                    }
                    size={20}
                    color={
                      forecastData[selectedForecast].forecast[5] > forecastData[selectedForecast].current
                        ? COLORS.success
                        : COLORS.error
                    }
                  />
                  <Text
                    style={[
                      styles.forecastTrendValue,
                      {
                        color:
                          forecastData[selectedForecast].forecast[5] > forecastData[selectedForecast].current
                            ? COLORS.success
                            : COLORS.error,
                      },
                    ]}
                  >
                    {Math.abs(
                      ((forecastData[selectedForecast].forecast[5] - forecastData[selectedForecast].current) /
                        forecastData[selectedForecast].current) *
                        100,
                    ).toFixed(1)}
                    %
                  </Text>
                </View>
              </View>
            </View>
          </Card>

          {/* Forecast Chart */}
          <Card title={showingScenarios ? "Forecast Scenarios" : getForecastTitle()} elevated>
            <LineChart
              data={getChartData()}
              width={width - 48}
              height={220}
              chartConfig={chartConfig}
              bezier
              style={styles.chart}
              withDots={!showingScenarios}
              withShadow={false}
              withInnerLines={false}
              yAxisSuffix={getForecastUnit()}
            />
            <View style={styles.confidenceContainer}>
              <Text style={styles.confidenceLabel}>Confidence Level:</Text>
              <View style={styles.confidenceBadge}>
                <Text style={styles.confidenceValue}>{forecastData[selectedForecast].confidence}%</Text>
              </View>
            </View>
          </Card>

          {/* Influencing Factors */}
          <Card title="Key Influencing Factors" elevated>
            {forecastData[selectedForecast].factors.map((factor, index) => (
              <View key={index} style={styles.factorItem}>
                <View style={styles.factorNameContainer}>
                  <View
                    style={[
                      styles.factorImpactIndicator,
                      { backgroundColor: getImpactColor(factor.impact, factor.direction) },
                    ]}
                  />
                  <Text style={styles.factorName}>{factor.name}</Text>
                </View>
                <View style={styles.factorDetailsContainer}>
                  <Text style={styles.factorImpact}>{factor.impact} Impact</Text>
                  <View style={styles.factorDirectionContainer}>
                    <Ionicons
                      name={factor.direction === "positive" ? "arrow-up" : "arrow-down"}
                      size={16}
                      color={factor.direction === "positive" ? COLORS.success : COLORS.error}
                    />
                  </View>
                </View>
              </View>
            ))}
          </Card>

          {/* Recommendations */}
          <Card title="Recommendations" elevated>
            {forecastData[selectedForecast].recommendations.map((recommendation, index) => (
              <View key={index} style={styles.recommendationItem}>
                <View style={styles.recommendationIcon}>
                  <Ionicons name="bulb" size={20} color={COLORS.primary} />
                </View>
                <Text style={styles.recommendationText}>{recommendation}</Text>
              </View>
            ))}
          </Card>

          {/* Methodology */}
          <Card title="Forecast Methodology" elevated>
            <Text style={styles.methodologyText}>
              This forecast is generated using machine learning algorithms that analyze historical data, market trends,
              and property-specific factors. The model is trained on data from similar properties in your market and
              updated monthly with new information.
            </Text>
            <TouchableOpacity style={styles.methodologyButton}>
              <Text style={styles.methodologyButtonText}>Learn More About Our Methodology</Text>
            </TouchableOpacity>
          </Card>
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
  currentValueContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  currentValueLabel: {
    fontSize: 14,
    color: COLORS.gray,
    marginBottom: 4,
  },
  currentValue: {
    fontSize: 28,
    fontWeight: "bold",
    color: COLORS.darkGray,
  },
  forecastSummaryContainer: {
    alignItems: "flex-end",
  },
  forecastSummaryLabel: {
    fontSize: 14,
    color: COLORS.gray,
    marginBottom: 4,
  },
  forecastTrendContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  forecastTrendValue: {
    fontSize: 16,
    fontWeight: "bold",
    marginLeft: 4,
  },
  chart: {
    marginVertical: 8,
    borderRadius: 8,
  },
  confidenceContainer: {
    flexDirection: "row",
    justifyContent: "flex-end",
    alignItems: "center",
    marginTop: 8,
  },
  confidenceLabel: {
    fontSize: 14,
    color: COLORS.gray,
    marginRight: 8,
  },
  confidenceBadge: {
    backgroundColor: COLORS.primaryLight,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  confidenceValue: {
    fontSize: 12,
    fontWeight: "bold",
    color: COLORS.primary,
  },
  factorItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.lightGray,
  },
  factorNameContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  factorImpactIndicator: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 8,
  },
  factorName: {
    fontSize: 16,
    color: COLORS.darkGray,
  },
  factorDetailsContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  factorImpact: {
    fontSize: 14,
    color: COLORS.gray,
    marginRight: 8,
  },
  factorDirectionContainer: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: COLORS.lightGray,
    justifyContent: "center",
    alignItems: "center",
  },
  recommendationItem: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: 16,
  },
  recommendationIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: COLORS.primaryLight,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  recommendationText: {
    flex: 1,
    fontSize: 14,
    color: COLORS.darkGray,
    lineHeight: 20,
  },
  methodologyText: {
    fontSize: 14,
    color: COLORS.darkGray,
    lineHeight: 20,
    marginBottom: 16,
  },
  methodologyButton: {
    alignItems: "center",
  },
  methodologyButtonText: {
    fontSize: 14,
    color: COLORS.primary,
    fontWeight: "500",
  },
})

export default PredictiveAnalyticsScreen

