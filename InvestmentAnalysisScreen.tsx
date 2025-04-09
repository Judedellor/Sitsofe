"use client"

import React, { useState, useEffect } from "react"
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, Dimensions, ColorValue } from "react-native"
import { SafeAreaView } from "react-native-safe-area-context"
import { COLORS } from "../constants/colors"
import { Ionicons } from "@expo/vector-icons"
import { useNavigation, useRoute, RouteProp } from "@react-navigation/native"
import Card from "../components/ui/Card"
import { PieChart, LineChart } from "react-native-chart-kit"

const { width } = Dimensions.get("window")

// Property types
interface Property {
  id: string
  name: string
  address: string
  purchasePrice: number
  currentValue: number
  monthlyRent: number
  monthlyExpenses: number
  occupancyRate: number
  capRate: number
  cashOnCash: number
  roi: number
  appreciationRate: number
}

// Define route params type
type InvestmentAnalysisRouteParams = {
  propertyId: string
}

// Sample property data
const properties: Property[] = [
  {
    id: "prop1",
    name: "Modern Luxury Apartment",
    address: "123 Main St, Anytown, USA",
    purchasePrice: 1200000,
    currentValue: 1450000,
    monthlyRent: 9500,
    monthlyExpenses: 3200,
    occupancyRate: 94,
    capRate: 6.3,
    cashOnCash: 8.2,
    roi: 12.5,
    appreciationRate: 4.2,
  },
  {
    id: "prop2",
    name: "Cozy Studio Loft",
    address: "456 Oak Ave, Anytown, USA",
    purchasePrice: 750000,
    currentValue: 820000,
    monthlyRent: 5200,
    monthlyExpenses: 1800,
    occupancyRate: 92,
    capRate: 5.4,
    cashOnCash: 7.1,
    roi: 9.3,
    appreciationRate: 3.8,
  },
  {
    id: "prop3",
    name: "Downtown Penthouse",
    address: "789 Center Blvd, Anytown, USA",
    purchasePrice: 1800000,
    currentValue: 2100000,
    monthlyRent: 12000,
    monthlyExpenses: 4500,
    occupancyRate: 96,
    capRate: 5.0,
    cashOnCash: 6.8,
    roi: 16.7,
    appreciationRate: 5.5,
  },
]

const InvestmentAnalysisScreen = () => {
  const navigation = useNavigation()
  const route = useRoute<RouteProp<Record<string, InvestmentAnalysisRouteParams>, string>>()
  const { propertyId } = route.params || { propertyId: "prop1" }

  // State
  const [selectedProperty, setSelectedProperty] = useState<Property | null>(null)
  const [purchasePrice, setPurchasePrice] = useState("")
  const [downPayment, setDownPayment] = useState("")
  const [interestRate, setInterestRate] = useState("")
  const [loanTerm, setLoanTerm] = useState("")
  const [monthlyRent, setMonthlyRent] = useState("")
  const [monthlyExpenses, setMonthlyExpenses] = useState("")
  const [appreciationRate, setAppreciationRate] = useState("")
  const [vacancyRate, setVacancyRate] = useState("")
  const [showingCalculator, setShowingCalculator] = useState(false)

  // Load property data
  useEffect(() => {
    const property = properties.find((p) => p.id === propertyId)
    if (property) {
      setSelectedProperty(property)
      // Initialize calculator with property data
      setPurchasePrice(property.purchasePrice.toString())
      setDownPayment((property.purchasePrice * 0.2).toString())
      setInterestRate("4.5")
      setLoanTerm("30")
      setMonthlyRent(property.monthlyRent.toString())
      setMonthlyExpenses(property.monthlyExpenses.toString())
      setAppreciationRate(property.appreciationRate.toString())
      setVacancyRate((100 - property.occupancyRate).toString())
    }
  }, [propertyId])

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

  // Format currency
  const formatCurrency = (amount: number): string => {
    return `$${amount.toFixed(0).replace(/\d(?=(\d{3})+$)/g, "$&,")}`
  }

  // Calculate investment metrics
  const calculateMetrics = () => {
    const price = Number.parseFloat(purchasePrice) || 0
    const down = Number.parseFloat(downPayment) || 0
    const rate = Number.parseFloat(interestRate) || 0
    const term = Number.parseFloat(loanTerm) || 30
    const rent = Number.parseFloat(monthlyRent) || 0
    const expenses = Number.parseFloat(monthlyExpenses) || 0
    const appreciation = Number.parseFloat(appreciationRate) || 0
    const vacancy = Number.parseFloat(vacancyRate) || 0

    // Calculate loan amount
    const loanAmount = price - down

    // Calculate monthly mortgage payment
    const monthlyRate = rate / 100 / 12
    const payments = term * 12
    const x = Math.pow(1 + monthlyRate, payments)
    const monthlyPayment = (loanAmount * x * monthlyRate) / (x - 1)

    // Calculate effective gross income
    const effectiveRent = rent * (1 - vacancy / 100)
    const annualRent = effectiveRent * 12

    // Calculate net operating income
    const annualExpenses = expenses * 12
    const noi = annualRent - annualExpenses

    // Calculate cash flow
    const annualMortgage = monthlyPayment * 12
    const cashFlow = noi - annualMortgage

    // Calculate cap rate
    const capRate = (noi / price) * 100

    // Calculate cash on cash return
    const cashOnCash = (cashFlow / down) * 100

    // Calculate ROI (1-year)
    const valueAppreciation = price * (appreciation / 100)
    const equityGain = annualMortgage * 0.3 // Assuming 30% of mortgage payment goes to principal
    const totalReturn = cashFlow + valueAppreciation + equityGain
    const roi = (totalReturn / down) * 100

    return {
      monthlyPayment,
      cashFlow: cashFlow / 12,
      capRate,
      cashOnCash,
      roi,
      breakEven: price / cashFlow,
    }
  }

  // Prepare cash flow chart data
  const getCashFlowData = () => {
    const metrics = calculateMetrics()
    const monthlyCashFlow = metrics.cashFlow

    return {
      labels: ["Year 1", "Year 2", "Year 3", "Year 4", "Year 5"],
      datasets: [
        {
          data: [
            monthlyCashFlow * 12,
            monthlyCashFlow * 12 * 1.03,
            monthlyCashFlow * 12 * 1.06,
            monthlyCashFlow * 12 * 1.09,
            monthlyCashFlow * 12 * 1.12,
          ],
        },
      ],
    }
  }

  // Prepare ROI chart data
  const getROIData = () => {
    const metrics = calculateMetrics()
    const downPaymentAmount = Number.parseFloat(downPayment) || 0
    const appreciationRateValue = Number.parseFloat(appreciationRate) || 0

    // Calculate cumulative ROI over 5 years
    const yearlyROI = []
    let cumulativeReturn = 0

    for (let year = 1; year <= 5; year++) {
      // Annual cash flow
      const annualCashFlow = metrics.cashFlow * 12 * Math.pow(1.03, year - 1)

      // Property appreciation
      const propertyValue = Number.parseFloat(purchasePrice) * Math.pow(1 + appreciationRateValue / 100, year)
      const totalAppreciation = propertyValue - Number.parseFloat(purchasePrice)

      // Equity buildup (simplified)
      const equityBuildup = metrics.monthlyPayment * 0.3 * 12 * year

      // Total return
      cumulativeReturn = annualCashFlow * year + totalAppreciation + equityBuildup

      // ROI
      yearlyROI.push((cumulativeReturn / downPaymentAmount) * 100)
    }

    return {
      labels: ["Year 1", "Year 2", "Year 3", "Year 4", "Year 5"],
      datasets: [
        {
          data: yearlyROI,
        },
      ],
    }
  }

  // Prepare expense breakdown data
  const getExpenseBreakdownData = () => {
    // Sample expense breakdown
    return [
      {
        name: "Mortgage",
        value: 65,
        color: "#FF6384",
        legendFontColor: "#7F7F7F",
        legendFontSize: 12,
      },
      {
        name: "Property Tax",
        value: 15,
        color: "#36A2EB",
        legendFontColor: "#7F7F7F",
        legendFontSize: 12,
      },
      {
        name: "Insurance",
        value: 5,
        color: "#FFCE56",
        legendFontColor: "#7F7F7F",
        legendFontSize: 12,
      },
      {
        name: "Maintenance",
        value: 10,
        color: "#4BC0C0",
        legendFontColor: "#7F7F7F",
        legendFontSize: 12,
      },
      {
        name: "Management",
        value: 5,
        color: "#9966FF",
        legendFontColor: "#7F7F7F",
        legendFontSize: 12,
      },
    ]
  }

  if (!selectedProperty) {
    return (
      <SafeAreaView style={styles.container} edges={["top"]}>
        <View style={styles.header}>
          <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
            <Ionicons name="arrow-back" size={24} color={COLORS.darkGray} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Investment Analysis</Text>
        </View>
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>Loading property data...</Text>
        </View>
      </SafeAreaView>
    )
  }

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color={COLORS.darkGray} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Investment Analysis</Text>
        <TouchableOpacity style={styles.actionButton} onPress={() => setShowingCalculator(!showingCalculator)}>
          <Ionicons name={showingCalculator ? "analytics" : "calculator"} size={24} color={COLORS.primary} />
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content}>
        {!showingCalculator ? (
          <>
            {/* Property Overview */}
            <Card elevated>
              <Text style={styles.propertyName}>{selectedProperty.name}</Text>
              <Text style={styles.propertyAddress}>{selectedProperty.address}</Text>
              <View style={styles.propertyStatsContainer}>
                <View style={styles.propertyStat}>
                  <Text style={styles.propertyStatLabel}>Purchase Price</Text>
                  <Text style={styles.propertyStatValue}>{formatCurrency(selectedProperty.purchasePrice)}</Text>
                </View>
                <View style={styles.propertyStat}>
                  <Text style={styles.propertyStatLabel}>Current Value</Text>
                  <Text style={styles.propertyStatValue}>{formatCurrency(selectedProperty.currentValue)}</Text>
                </View>
                <View style={styles.propertyStat}>
                  <Text style={styles.propertyStatLabel}>Monthly Rent</Text>
                  <Text style={styles.propertyStatValue}>{formatCurrency(selectedProperty.monthlyRent)}</Text>
                </View>
              </View>
            </Card>

            {/* Key Metrics */}
            <Card title="Key Investment Metrics" elevated>
              <View style={styles.metricsContainer}>
                <View style={styles.metricItem}>
                  <Text style={styles.metricValue}>{selectedProperty.capRate.toFixed(1)}%</Text>
                  <Text style={styles.metricLabel}>Cap Rate</Text>
                </View>
                <View style={styles.metricItem}>
                  <Text style={styles.metricValue}>{selectedProperty.cashOnCash.toFixed(1)}%</Text>
                  <Text style={styles.metricLabel}>Cash on Cash</Text>
                </View>
                <View style={styles.metricItem}>
                  <Text style={styles.metricValue}>{selectedProperty.roi.toFixed(1)}%</Text>
                  <Text style={styles.metricLabel}>ROI</Text>
                </View>
              </View>
              <View style={styles.metricsContainer}>
                <View style={styles.metricItem}>
                  <Text style={styles.metricValue}>
                    {formatCurrency(selectedProperty.monthlyRent - selectedProperty.monthlyExpenses)}
                  </Text>
                  <Text style={styles.metricLabel}>Monthly NOI</Text>
                </View>
                <View style={styles.metricItem}>
                  <Text style={styles.metricValue}>{selectedProperty.occupancyRate}%</Text>
                  <Text style={styles.metricLabel}>Occupancy</Text>
                </View>
                <View style={styles.metricItem}>
                  <Text style={styles.metricValue}>{selectedProperty.appreciationRate}%</Text>
                  <Text style={styles.metricLabel}>Appreciation</Text>
                </View>
              </View>
            </Card>

            {/* Cash Flow Analysis */}
            <Card title="Cash Flow Analysis" elevated>
              <LineChart
                data={getCashFlowData()}
                width={width - 48}
                height={220}
                chartConfig={chartConfig}
                bezier
                style={styles.chart}
                yAxisSuffix="$"
              />
              <View style={styles.cashFlowBreakdown}>
                <View style={styles.cashFlowItem}>
                  <Text style={styles.cashFlowLabel}>Monthly Income</Text>
                  <Text style={styles.cashFlowValue}>{formatCurrency(selectedProperty.monthlyRent)}</Text>
                </View>
                <View style={styles.cashFlowItem}>
                  <Text style={styles.cashFlowLabel}>Monthly Expenses</Text>
                  <Text style={styles.cashFlowValue}>-{formatCurrency(selectedProperty.monthlyExpenses)}</Text>
                </View>
                <View style={styles.cashFlowItem}>
                  <Text style={styles.cashFlowLabel}>Mortgage Payment</Text>
                  <Text style={styles.cashFlowValue}>-{formatCurrency(calculateMetrics().monthlyPayment)}</Text>
                </View>
                <View style={[styles.cashFlowItem, styles.cashFlowTotal]}>
                  <Text style={styles.cashFlowTotalLabel}>Monthly Cash Flow</Text>
                  <Text
                    style={[
                      styles.cashFlowTotalValue,
                      { color: calculateMetrics().cashFlow >= 0 ? COLORS.success : COLORS.error },
                    ]}
                  >
                    {calculateMetrics().cashFlow >= 0 ? "+" : ""}
                    {formatCurrency(calculateMetrics().cashFlow)}
                  </Text>
                </View>
              </View>
            </Card>

            {/* ROI Projection */}
            <Card title="5-Year ROI Projection" elevated>
              <LineChart
                data={getROIData()}
                width={width - 48}
                height={220}
                chartConfig={{
                  ...chartConfig,
                  color: (opacity = 1) => `rgba(46, 204, 113, ${opacity})`,
                }}
                bezier
                style={styles.chart}
                yAxisSuffix="%"
              />
              <View style={styles.roiBreakdown}>
                <View style={styles.roiComponent}>
                  <View style={styles.roiComponentIcon}>
                    <Ionicons name="cash-outline" size={20} color={COLORS.white} />
                  </View>
                  <View style={styles.roiComponentContent}>
                    <Text style={styles.roiComponentLabel}>Cash Flow</Text>
                    <Text style={styles.roiComponentValue}>
                      {formatCurrency(calculateMetrics().cashFlow * 12)} / year
                    </Text>
                  </View>
                </View>
                <View style={styles.roiComponent}>
                  <View style={[styles.roiComponentIcon, { backgroundColor: COLORS.success }]}>
                    <Ionicons name="trending-up" size={20} color={COLORS.white} />
                  </View>
                  <View style={styles.roiComponentContent}>
                    <Text style={styles.roiComponentLabel}>Appreciation</Text>
                    <Text style={styles.roiComponentValue}>{selectedProperty.appreciationRate}% / year</Text>
                  </View>
                </View>
                <View style={styles.roiComponent}>
                  <View style={[styles.roiComponentIcon, { backgroundColor: COLORS.warning }]}>
                    <Ionicons name="home" size={20} color={COLORS.white} />
                  </View>
                  <View style={styles.roiComponentContent}>
                    <Text style={styles.roiComponentLabel}>Equity Buildup</Text>
                    <Text style={styles.roiComponentValue}>
                      ~{formatCurrency(calculateMetrics().monthlyPayment * 0.3 * 12)} / year
                    </Text>
                  </View>
                </View>
              </View>
            </Card>

            {/* Expense Breakdown */}
            <Card title="Expense Breakdown" elevated>
              <PieChart
                data={getExpenseBreakdownData()}
                width={width - 48}
                height={220}
                chartConfig={chartConfig}
                accessor="value"
                backgroundColor="transparent"
                paddingLeft="15"
                absolute
              />
            </Card>

            {/* Investment Summary */}
            <Card title="Investment Summary" elevated>
              <View style={styles.summaryItem}>
                <Text style={styles.summaryLabel}>Break-even Point</Text>
                <Text style={styles.summaryValue}>{Math.round(calculateMetrics().breakEven)} months</Text>
              </View>
              <View style={styles.summaryItem}>
                <Text style={styles.summaryLabel}>5-Year Projected Value</Text>
                <Text style={styles.summaryValue}>
                  {formatCurrency(
                    selectedProperty.currentValue * Math.pow(1 + selectedProperty.appreciationRate / 100, 5),
                  )}
                </Text>
              </View>
              <View style={styles.summaryItem}>
                <Text style={styles.summaryLabel}>5-Year Total Return</Text>
                <Text style={styles.summaryValue}>
                  {formatCurrency(
                    calculateMetrics().cashFlow * 12 * 5 +
                      (selectedProperty.currentValue * Math.pow(1 + selectedProperty.appreciationRate / 100, 5) -
                        selectedProperty.currentValue),
                  )}
                </Text>
              </View>
              <View style={styles.summaryItem}>
                <Text style={styles.summaryLabel}>Investment Rating</Text>
                <View style={styles.ratingContainer}>
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Ionicons
                      key={star}
                      name="star"
                      size={20}
                      color={star <= Math.round(selectedProperty.roi / 3) ? COLORS.warning : "#E0E0E0"}
                    />
                  ))}
                </View>
              </View>
            </Card>
          </>
        ) : (
          // Investment Calculator
          <Card title="Investment Calculator" elevated>
            <View style={styles.calculatorField}>
              <Text style={styles.calculatorLabel}>Purchase Price</Text>
              <TextInput
                style={styles.calculatorInput}
                value={purchasePrice}
                onChangeText={setPurchasePrice}
                keyboardType="numeric"
                placeholder="Enter purchase price"
              />
            </View>
            <View style={styles.calculatorField}>
              <Text style={styles.calculatorLabel}>Down Payment</Text>
              <TextInput
                style={styles.calculatorInput}
                value={downPayment}
                onChangeText={setDownPayment}
                keyboardType="numeric"
                placeholder="Enter down payment"
              />
            </View>
            <View style={styles.calculatorRow}>
              <View style={[styles.calculatorField, { flex: 1, marginRight: 8 }]}>
                <Text style={styles.calculatorLabel}>Interest Rate (%)</Text>
                <TextInput
                  style={styles.calculatorInput}
                  value={interestRate}
                  onChangeText={setInterestRate}
                  keyboardType="numeric"
                  placeholder="Enter rate"
                />
              </View>
              <View style={[styles.calculatorField, { flex: 1, marginLeft: 8 }]}>
                <Text style={styles.calculatorLabel}>Loan Term (years)</Text>
                <TextInput
                  style={styles.calculatorInput}
                  value={loanTerm}
                  onChangeText={setLoanTerm}
                  keyboardType="numeric"
                  placeholder="Enter term"
                />
              </View>
            </View>
            <View style={styles.calculatorField}>
              <Text style={styles.calculatorLabel}>Monthly Rent</Text>
              <TextInput
                style={styles.calculatorInput}
                value={monthlyRent}
                onChangeText={setMonthlyRent}
                keyboardType="numeric"
                placeholder="Enter monthly rent"
              />
            </View>
            <View style={styles.calculatorField}>
              <Text style={styles.calculatorLabel}>Monthly Expenses</Text>
              <TextInput
                style={styles.calculatorInput}
                value={monthlyExpenses}
                onChangeText={setMonthlyExpenses}
                keyboardType="numeric"
                placeholder="Enter monthly expenses"
              />
            </View>
            <View style={styles.calculatorRow}>
              <View style={[styles.calculatorField, { flex: 1, marginRight: 8 }]}>
                <Text style={styles.calculatorLabel}>Appreciation Rate (%)</Text>
                <TextInput
                  style={styles.calculatorInput}
                  value={appreciationRate}
                  onChangeText={setAppreciationRate}
                  keyboardType="numeric"
                  placeholder="Enter rate"
                />
              </View>
              <View style={[styles.calculatorField, { flex: 1, marginLeft: 8 }]}>
                <Text style={styles.calculatorLabel}>Vacancy Rate (%)</Text>
                <TextInput
                  style={styles.calculatorInput}
                  value={vacancyRate}
                  onChangeText={setVacancyRate}
                  keyboardType="numeric"
                  placeholder="Enter rate"
                />
              </View>
            </View>

            <View style={styles.calculatorResults}>
              <Text style={styles.calculatorResultsTitle}>Results</Text>
              <View style={styles.calculatorResultItem}>
                <Text style={styles.calculatorResultLabel}>Monthly Mortgage Payment</Text>
                <Text style={styles.calculatorResultValue}>{formatCurrency(calculateMetrics().monthlyPayment)}</Text>
              </View>
              <View style={styles.calculatorResultItem}>
                <Text style={styles.calculatorResultLabel}>Monthly Cash Flow</Text>
                <Text
                  style={[
                    styles.calculatorResultValue,
                    { color: calculateMetrics().cashFlow >= 0 ? COLORS.success : COLORS.error },
                  ]}
                >
                  {calculateMetrics().cashFlow >= 0 ? "+" : ""}
                  {formatCurrency(calculateMetrics().cashFlow)}
                </Text>
              </View>
              <View style={styles.calculatorResultItem}>
                <Text style={styles.calculatorResultLabel}>Cap Rate</Text>
                <Text style={styles.calculatorResultValue}>{calculateMetrics().capRate.toFixed(2)}%</Text>
              </View>
              <View style={styles.calculatorResultItem}>
                <Text style={styles.calculatorResultLabel}>Cash on Cash Return</Text>
                <Text style={styles.calculatorResultValue}>{calculateMetrics().cashOnCash.toFixed(2)}%</Text>
              </View>
              <View style={styles.calculatorResultItem}>
                <Text style={styles.calculatorResultLabel}>Total ROI (Year 1)</Text>
                <Text style={styles.calculatorResultValue}>{calculateMetrics().roi.toFixed(2)}%</Text>
              </View>
            </View>

            <TouchableOpacity style={styles.saveButton} onPress={() => setShowingCalculator(false)}>
              <Text style={styles.saveButtonText}>Save & View Analysis</Text>
            </TouchableOpacity>
          </Card>
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
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: COLORS.white,
    borderBottomWidth: 1,
    borderBottomColor: "#E0E0E0",
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
    fontSize: 16,
    color: COLORS.gray[500],
  },
  propertyName: {
    fontSize: 20,
    fontWeight: "bold",
    color: COLORS.darkGray,
    marginBottom: 4,
  },
  propertyAddress: {
    fontSize: 14,
    color: COLORS.gray[500],
    marginBottom: 16,
  },
  propertyStatsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  propertyStat: {
    alignItems: "center",
  },
  propertyStatLabel: {
    fontSize: 12,
    color: COLORS.gray[500],
    marginBottom: 4,
  },
  propertyStatValue: {
    fontSize: 16,
    fontWeight: "bold",
    color: COLORS.darkGray,
  },
  metricsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 16,
  },
  metricItem: {
    alignItems: "center",
    flex: 1,
  },
  metricValue: {
    fontSize: 20,
    fontWeight: "bold",
    color: COLORS.primary,
    marginBottom: 4,
  },
  metricLabel: {
    fontSize: 12,
    color: COLORS.gray[500],
  },
  chart: {
    marginVertical: 8,
    borderRadius: 8,
  },
  cashFlowBreakdown: {
    marginTop: 16,
  },
  cashFlowItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: "#E0E0E0",
  },
  cashFlowLabel: {
    fontSize: 14,
    color: COLORS.darkGray,
  },
  cashFlowValue: {
    fontSize: 14,
    fontWeight: "500",
    color: COLORS.darkGray,
  },
  cashFlowTotal: {
    borderBottomWidth: 0,
    marginTop: 8,
  },
  cashFlowTotalLabel: {
    fontSize: 16,
    fontWeight: "bold",
    color: COLORS.darkGray,
  },
  cashFlowTotalValue: {
    fontSize: 16,
    fontWeight: "bold",
  },
  roiBreakdown: {
    marginTop: 16,
  },
  roiComponent: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  roiComponentIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: COLORS.primary,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  roiComponentContent: {
    flex: 1,
  },
  roiComponentLabel: {
    fontSize: 14,
    color: COLORS.gray[500],
    marginBottom: 2,
  },
  roiComponentValue: {
    fontSize: 16,
    fontWeight: "500",
    color: COLORS.darkGray,
  },
  summaryItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#E0E0E0",
  },
  summaryLabel: {
    fontSize: 14,
    color: COLORS.darkGray,
  },
  summaryValue: {
    fontSize: 14,
    fontWeight: "500",
    color: COLORS.darkGray,
  },
  ratingContainer: {
    flexDirection: "row",
  },
  calculatorField: {
    marginBottom: 16,
  },
  calculatorRow: {
    flexDirection: "row",
    marginBottom: 16,
  },
  calculatorLabel: {
    fontSize: 14,
    color: COLORS.darkGray,
    marginBottom: 8,
  },
  calculatorInput: {
    backgroundColor: COLORS.white,
    borderWidth: 1,
    borderColor: "#E0E0E0",
    borderRadius: 6,
    padding: 12,
    fontSize: 16,
  },
  calculatorResults: {
    backgroundColor: "#E3F2FD",
    borderRadius: 8,
    padding: 16,
    marginTop: 16,
    marginBottom: 16,
  },
  calculatorResultsTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: COLORS.darkGray,
    marginBottom: 12,
  },
  calculatorResultItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  calculatorResultLabel: {
    fontSize: 14,
    color: COLORS.darkGray,
  },
  calculatorResultValue: {
    fontSize: 14,
    fontWeight: "bold",
    color: COLORS.darkGray,
  },
  saveButton: {
    backgroundColor: COLORS.primary,
    paddingVertical: 12,
    borderRadius: 6,
    alignItems: "center",
  },
  saveButtonText: {
    color: COLORS.white,
    fontWeight: "500",
    fontSize: 16,
  },
})

export default InvestmentAnalysisScreen

