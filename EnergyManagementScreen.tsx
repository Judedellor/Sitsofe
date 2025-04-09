"use client"

import { useState, useEffect } from "react"
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Switch } from "react-native"
import { SafeAreaView } from "react-native-safe-area-context"
import { COLORS } from "../constants/colors"
import Card from "../components/ui/Card"
import Button from "../components/ui/Button"
import { Ionicons } from "@expo/vector-icons"
import { LineChart, PieChart } from "react-native-chart-kit"
import { Dimensions } from "react-native"
import { useNavigation, useRoute } from "@react-navigation/native"

// Types for energy data
interface EnergyData {
  date: string
  usage: number
  cost: number
}

// Types for energy breakdown
interface EnergyBreakdown {
  category: string
  usage: number
  percentage: number
  color: string
}

// Types for unit energy data
interface UnitEnergyData {
  unitId: string
  unitName: string
  usage: number
  change: number
  cost: number
}

// Types for energy optimization suggestions
interface EnergySuggestion {
  id: string
  title: string
  description: string
  potentialSavings: number
  difficulty: "easy" | "medium" | "hard"
  implemented: boolean
}

// Mock data for daily energy usage
const mockDailyEnergyData: EnergyData[] = [
  { date: "Mon", usage: 420, cost: 63 },
  { date: "Tue", usage: 430, cost: 64.5 },
  { date: "Wed", usage: 425, cost: 63.75 },
  { date: "Thu", usage: 440, cost: 66 },
  { date: "Fri", usage: 450, cost: 67.5 },
  { date: "Sat", usage: 470, cost: 70.5 },
  { date: "Sun", usage: 427, cost: 64.05 },
]

// Mock data for monthly energy usage
const mockMonthlyEnergyData: EnergyData[] = [
  { date: "Jan", usage: 12500, cost: 1875 },
  { date: "Feb", usage: 11800, cost: 1770 },
  { date: "Mar", usage: 12200, cost: 1830 },
  { date: "Apr", usage: 13100, cost: 1965 },
  { date: "May", usage: 14500, cost: 2175 },
  { date: "Jun", usage: 15800, cost: 2370 },
  { date: "Jul", usage: 16200, cost: 2430 },
  { date: "Aug", usage: 15900, cost: 2385 },
  { date: "Sep", usage: 14700, cost: 2205 },
  { date: "Oct", usage: 13500, cost: 2025 },
  { date: "Nov", usage: 12800, cost: 1920 },
  { date: "Dec", usage: 13200, cost: 1980 },
]

// Mock data for energy breakdown
const mockEnergyBreakdown: EnergyBreakdown[] = [
  { category: "HVAC", usage: 180, percentage: 42, color: "#FF6384" },
  { category: "Lighting", usage: 85, percentage: 20, color: "#36A2EB" },
  { category: "Appliances", usage: 65, percentage: 15, color: "#FFCE56" },
  { category: "Water Heating", usage: 55, percentage: 13, color: "#4BC0C0" },
  { category: "Other", usage: 42, percentage: 10, color: "#9966FF" },
]

// Mock data for unit energy usage
const mockUnitEnergyData: UnitEnergyData[] = [
  { unitId: "unit101", unitName: "Unit 101", usage: 85, change: 5, cost: 12.75 },
  { unitId: "unit102", unitName: "Unit 102", usage: 92, change: -3, cost: 13.8 },
  { unitId: "unit103", unitName: "Unit 103", usage: 110, change: 12, cost: 16.5 },
  { unitId: "unit104", unitName: "Unit 104", usage: 78, change: -8, cost: 11.7 },
  { unitId: "unit105", unitName: "Unit 105", usage: 95, change: 2, cost: 14.25 },
  { unitId: "common", unitName: "Common Areas", usage: 65, change: -5, cost: 9.75 },
]

// Mock data for energy optimization suggestions
const mockEnergySuggestions: EnergySuggestion[] = [
  {
    id: "sug1",
    title: "Adjust HVAC Schedule",
    description: "Optimize HVAC operation times based on occupancy patterns to reduce unnecessary heating/cooling.",
    potentialSavings: 120,
    difficulty: "easy",
    implemented: false,
  },
  {
    id: "sug2",
    title: "Install LED Lighting",
    description: "Replace remaining traditional bulbs with energy-efficient LED lighting throughout the property.",
    potentialSavings: 85,
    difficulty: "medium",
    implemented: true,
  },
  {
    id: "sug3",
    title: "Smart Thermostat Programming",
    description: "Implement advanced scheduling and occupancy-based temperature adjustments.",
    potentialSavings: 95,
    difficulty: "easy",
    implemented: false,
  },
  {
    id: "sug4",
    title: "Upgrade Insulation",
    description: "Improve building envelope insulation to reduce heating and cooling losses.",
    potentialSavings: 150,
    difficulty: "hard",
    implemented: false,
  },
  {
    id: "sug5",
    title: "Install Motion Sensors",
    description: "Add motion sensors to control lighting in common areas and reduce unnecessary usage.",
    potentialSavings: 65,
    difficulty: "medium",
    implemented: true,
  },
]

const EnergyManagementScreen = () => {
  const navigation = useNavigation()
  const route = useRoute()
  const { propertyId } = route.params as { propertyId: string }

  const [timeFrame, setTimeFrame] = useState<"daily" | "monthly">("daily")
  const [energyData, setEnergyData] = useState<EnergyData[]>(mockDailyEnergyData)
  const [energyBreakdown, setEnergyBreakdown] = useState<EnergyBreakdown[]>(mockEnergyBreakdown)
  const [unitEnergyData, setUnitEnergyData] = useState<UnitEnergyData[]>(mockUnitEnergyData)
  const [suggestions, setSuggestions] = useState<EnergySuggestion[]>(mockEnergySuggestions)
  const [autoOptimize, setAutoOptimize] = useState<boolean>(true)

  // Update energy data when timeframe changes
  useEffect(() => {
    setEnergyData(timeFrame === "daily" ? mockDailyEnergyData : mockMonthlyEnergyData)
  }, [timeFrame])

  // Handle implementing a suggestion
  const handleImplementSuggestion = (suggestionId: string) => {
    setSuggestions(
      suggestions.map((suggestion) =>
        suggestion.id === suggestionId ? { ...suggestion, implemented: !suggestion.implemented } : suggestion,
      ),
    )
  }

  // Calculate total energy usage
  const totalEnergyUsage = energyData.reduce((sum, data) => sum + data.usage, 0)

  // Calculate total energy cost
  const totalEnergyCost = energyData.reduce((sum, data) => sum + data.cost, 0)

  // Calculate potential savings
  const potentialSavings = suggestions
    .filter((suggestion) => !suggestion.implemented)
    .reduce((sum, suggestion) => sum + suggestion.potentialSavings, 0)

  // Format currency
  const formatCurrency = (amount: number) => {
    return `$${amount.toFixed(2)}`
  }

  // Get color for energy change
  const getChangeColor = (change: number) => {
    return change < 0 ? COLORS.success : change > 0 ? COLORS.error : COLORS.gray
  }

  // Get icon for energy change
  const getChangeIcon = (change: number) => {
    return change < 0 ? "arrow-down" : change > 0 ? "arrow-up" : "remove"
  }

  // Get color for difficulty
  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "easy":
        return COLORS.success
      case "medium":
        return COLORS.warning
      case "hard":
        return COLORS.error
      default:
        return COLORS.gray
    }
  }

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color={COLORS.darkGray} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Energy Management</Text>
      </View>

      <ScrollView style={styles.content}>
        {/* Energy Overview */}
        <Card title="Energy Overview" elevated>
          <View style={styles.timeFrameSelector}>
            <TouchableOpacity
              style={[styles.timeFrameButton, timeFrame === "daily" && styles.activeTimeFrame]}
              onPress={() => setTimeFrame("daily")}
            >
              <Text style={[styles.timeFrameText, timeFrame === "daily" && styles.activeTimeFrameText]}>Daily</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.timeFrameButton, timeFrame === "monthly" && styles.activeTimeFrame]}
              onPress={() => setTimeFrame("monthly")}
            >
              <Text style={[styles.timeFrameText, timeFrame === "monthly" && styles.activeTimeFrameText]}>Monthly</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.statsContainer}>
            <View style={styles.statItem}>
              <Text style={styles.statLabel}>Total Usage</Text>
              <Text style={styles.statValue}>
                {totalEnergyUsage} {timeFrame === "daily" ? "kWh" : "kWh"}
              </Text>
            </View>

            <View style={styles.statItem}>
              <Text style={styles.statLabel}>Total Cost</Text>
              <Text style={styles.statValue}>{formatCurrency(totalEnergyCost)}</Text>
            </View>

            <View style={styles.statItem}>
              <Text style={styles.statLabel}>Avg. {timeFrame === "daily" ? "Daily" : "Monthly"}</Text>
              <Text style={styles.statValue}>{Math.round(totalEnergyUsage / energyData.length)} kWh</Text>
            </View>
          </View>

          <LineChart
            data={{
              labels: energyData.map((data) => data.date),
              datasets: [
                {
                  data: energyData.map((data) => data.usage),
                },
              ],
            }}
            width={Dimensions.get("window").width - 64}
            height={200}
            chartConfig={{
              backgroundColor: COLORS.white,
              backgroundGradientFrom: COLORS.white,
              backgroundGradientTo: COLORS.white,
              decimalPlaces: 0,
              color: (opacity = 1) => `rgba(0, 122, 255, ${opacity})`,
              labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
              style: {
                borderRadius: 16,
              },
              propsForDots: {
                r: "4",
                strokeWidth: "2",
                stroke: COLORS.primary,
              },
            }}
            bezier
            style={styles.chart}
          />
          <Text style={styles.chartCaption}>{timeFrame === "daily" ? "Daily" : "Monthly"} Energy Usage (kWh)</Text>
        </Card>

        {/* Energy Breakdown */}
        <Card title="Energy Breakdown" elevated>
          <View style={styles.breakdownContainer}>
            <View style={styles.pieChartContainer}>
              <PieChart
                data={energyBreakdown.map((item) => ({
                  name: item.category,
                  population: item.usage,
                  color: item.color,
                  legendFontColor: COLORS.darkGray,
                  legendFontSize: 12,
                }))}
                width={180}
                height={180}
                chartConfig={{
                  backgroundColor: COLORS.white,
                  backgroundGradientFrom: COLORS.white,
                  backgroundGradientTo: COLORS.white,
                  color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
                }}
                accessor="population"
                backgroundColor="transparent"
                paddingLeft="0"
                absolute
              />
            </View>

            <View style={styles.breakdownLegend}>
              {energyBreakdown.map((item) => (
                <View key={item.category} style={styles.legendItem}>
                  <View style={[styles.legendColor, { backgroundColor: item.color }]} />
                  <Text style={styles.legendCategory}>{item.category}</Text>
                  <Text style={styles.legendPercentage}>{item.percentage}%</Text>
                </View>
              ))}
            </View>
          </View>
        </Card>

        {/* Unit Energy Usage */}
        <Card title="Unit Energy Usage" elevated>
          {unitEnergyData.map((unit) => (
            <View key={unit.unitId} style={styles.unitItem}>
              <View style={styles.unitInfo}>
                <Text style={styles.unitName}>{unit.unitName}</Text>
                <View style={styles.unitChange}>
                  <Ionicons name={getChangeIcon(unit.change)} size={14} color={getChangeColor(unit.change)} />
                  <Text style={[styles.unitChangeText, { color: getChangeColor(unit.change) }]}>
                    {Math.abs(unit.change)}%
                  </Text>
                </View>
              </View>

              <View style={styles.unitUsage}>
                <Text style={styles.unitUsageValue}>{unit.usage} kWh</Text>
                <Text style={styles.unitCost}>{formatCurrency(unit.cost)}</Text>
              </View>
            </View>
          ))}
        </Card>

        {/* Auto-Optimization */}
        <Card title="Auto-Optimization" elevated>
          <View style={styles.optimizationHeader}>
            <View>
              <Text style={styles.optimizationTitle}>Smart Energy Optimization</Text>
              <Text style={styles.optimizationDescription}>
                Automatically adjust settings to optimize energy usage based on occupancy and weather patterns.
              </Text>
            </View>
            <Switch
              value={autoOptimize}
              onValueChange={setAutoOptimize}
              trackColor={{ false: COLORS.lightGray, true: COLORS.primaryLight }}
              thumbColor={autoOptimize ? COLORS.primary : COLORS.white}
            />
          </View>

          <View style={styles.optimizationStats}>
            <View style={styles.optimizationStat}>
              <Text style={styles.optimizationStatLabel}>Potential Savings</Text>
              <Text style={styles.optimizationStatValue}>{formatCurrency(potentialSavings)} / month</Text>
            </View>

            <View style={styles.optimizationStat}>
              <Text style={styles.optimizationStatLabel}>Implemented</Text>
              <Text style={styles.optimizationStatValue}>
                {suggestions.filter((s) => s.implemented).length} / {suggestions.length}
              </Text>
            </View>
          </View>
        </Card>

        {/* Energy Saving Suggestions */}
        <Card title="Energy Saving Suggestions" elevated>
          {suggestions.map((suggestion) => (
            <View key={suggestion.id} style={styles.suggestionItem}>
              <View style={styles.suggestionHeader}>
                <Text style={styles.suggestionTitle}>{suggestion.title}</Text>
                <View style={[styles.difficultyBadge, { backgroundColor: getDifficultyColor(suggestion.difficulty) }]}>
                  <Text style={styles.difficultyText}>
                    {suggestion.difficulty.charAt(0).toUpperCase() + suggestion.difficulty.slice(1)}
                  </Text>
                </View>
              </View>

              <Text style={styles.suggestionDescription}>{suggestion.description}</Text>

              <View style={styles.suggestionFooter}>
                <Text style={styles.savingsText}>
                  Potential Savings: {formatCurrency(suggestion.potentialSavings)} / month
                </Text>

                <Button
                  title={suggestion.implemented ? "Implemented" : "Implement"}
                  type={suggestion.implemented ? "success" : "outline"}
                  size="small"
                  onPress={() => handleImplementSuggestion(suggestion.id)}
                  icon={
                    suggestion.implemented ? (
                      <Ionicons name="checkmark-circle" size={16} color={COLORS.white} style={styles.buttonIcon} />
                    ) : (
                      <Ionicons name="add-circle-outline" size={16} color={COLORS.primary} style={styles.buttonIcon} />
                    )
                  }
                />
              </View>
            </View>
          ))}
        </Card>

        <View style={styles.spacer} />
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
    borderBottomWidth: 1,
    borderBottomColor: COLORS.lightGray,
    backgroundColor: COLORS.white,
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
  timeFrameSelector: {
    flexDirection: "row",
    marginBottom: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: COLORS.lightGray,
    alignSelf: "center",
    overflow: "hidden",
  },
  timeFrameButton: {
    paddingHorizontal: 24,
    paddingVertical: 8,
  },
  activeTimeFrame: {
    backgroundColor: COLORS.primary,
  },
  timeFrameText: {
    fontSize: 14,
    color: COLORS.darkGray,
  },
  activeTimeFrameText: {
    color: COLORS.white,
    fontWeight: "500",
  },
  statsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 16,
  },
  statItem: {
    alignItems: "center",
    flex: 1,
  },
  statLabel: {
    fontSize: 12,
    color: COLORS.gray,
    marginBottom: 4,
  },
  statValue: {
    fontSize: 16,
    fontWeight: "bold",
    color: COLORS.darkGray,
  },
  chart: {
    marginVertical: 8,
    borderRadius: 16,
  },
  chartCaption: {
    textAlign: "center",
    fontSize: 12,
    color: COLORS.gray,
  },
  breakdownContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  pieChartContainer: {
    flex: 1,
    alignItems: "center",
  },
  breakdownLegend: {
    flex: 1,
    paddingLeft: 16,
  },
  legendItem: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  legendColor: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 8,
  },
  legendCategory: {
    flex: 1,
    fontSize: 14,
    color: COLORS.darkGray,
  },
  legendPercentage: {
    fontSize: 14,
    fontWeight: "500",
    color: COLORS.darkGray,
  },
  unitItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.lightGray,
  },
  unitInfo: {
    flex: 1,
  },
  unitName: {
    fontSize: 14,
    fontWeight: "500",
    color: COLORS.darkGray,
    marginBottom: 4,
  },
  unitChange: {
    flexDirection: "row",
    alignItems: "center",
  },
  unitChangeText: {
    fontSize: 12,
    marginLeft: 4,
  },
  unitUsage: {
    alignItems: "flex-end",
  },
  unitUsageValue: {
    fontSize: 14,
    fontWeight: "500",
    color: COLORS.darkGray,
    marginBottom: 2,
  },
  unitCost: {
    fontSize: 12,
    color: COLORS.gray,
  },
  optimizationHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  optimizationTitle: {
    fontSize: 16,
    fontWeight: "500",
    color: COLORS.darkGray,
    marginBottom: 4,
  },
  optimizationDescription: {
    fontSize: 12,
    color: COLORS.gray,
    maxWidth: "80%",
  },
  optimizationStats: {
    flexDirection: "row",
    justifyContent: "space-around",
    backgroundColor: COLORS.lightGray,
    borderRadius: 8,
    padding: 16,
  },
  optimizationStat: {
    alignItems: "center",
  },
  optimizationStatLabel: {
    fontSize: 12,
    color: COLORS.gray,
    marginBottom: 4,
  },
  optimizationStatValue: {
    fontSize: 16,
    fontWeight: "bold",
    color: COLORS.darkGray,
  },
  suggestionItem: {
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.lightGray,
  },
  suggestionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  suggestionTitle: {
    fontSize: 16,
    fontWeight: "500",
    color: COLORS.darkGray,
    flex: 1,
  },
  difficultyBadge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 12,
  },
  difficultyText: {
    fontSize: 10,
    fontWeight: "500",
    color: COLORS.white,
  },
  suggestionDescription: {
    fontSize: 14,
    color: COLORS.gray,
    marginBottom: 12,
  },
  suggestionFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  savingsText: {
    fontSize: 14,
    fontWeight: "500",
    color: COLORS.success,
  },
  buttonIcon: {
    marginRight: 4,
  },
  spacer: {
    height: 40,
  },
})

export default EnergyManagementScreen

