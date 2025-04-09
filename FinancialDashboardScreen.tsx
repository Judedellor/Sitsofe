"use client"

import { useState } from "react"
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from "react-native"
import { SafeAreaView } from "react-native-safe-area-context"
import { Ionicons } from "@expo/vector-icons"
import { useNavigation } from "@react-navigation/native"
import { COLORS } from "../constants/colors"
import Card from "../components/ui/Card"
import { LineChart, BarChart, PieChart } from "react-native-chart-kit"
import { Dimensions } from "react-native"

const { width } = Dimensions.get("window")

// Mock financial data
const financialData = {
  summary: {
    totalIncome: 125000,
    totalExpenses: 78500,
    netIncome: 46500,
    budgetVariance: 3.5,
    cashOnHand: 85000,
    pendingPayments: 12500,
  },
  incomeBreakdown: [
    { name: "Rent", value: 110000, color: "#4BC0C0", legendFontColor: "#7F7F7F", legendFontSize: 12 },
    { name: "Late Fees", value: 3500, color: "#FF6384", legendFontColor: "#7F7F7F", legendFontSize: 12 },
    { name: "Amenities", value: 8500, color: "#FFCE56", legendFontColor: "#7F7F7F", legendFontSize: 12 },
    { name: "Other", value: 3000, color: "#36A2EB", legendFontColor: "#7F7F7F", legendFontSize: 12 },
  ],
  expenseBreakdown: [
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
    legend: ["Income", "Expenses"],
  },
  budgetComparison: {
    labels: ["Maintenance", "Utilities", "Insurance", "Taxes", "Management"],
    datasets: [
      {
        data: [32000, 12500, 9500, 18500, 6000],
        color: (opacity = 1) => `rgba(46, 204, 113, ${opacity})`,
        strokeWidth: 2,
      },
      {
        data: [30000, 10000, 10000, 18000, 7000],
        color: (opacity = 1) => `rgba(52, 152, 219, ${opacity})`,
        strokeWidth: 2,
      },
    ],
    legend: ["Actual", "Budget"],
  },
  recentTransactions: [
    {
      id: "1",
      type: "income",
      description: "Rent Payment - Unit 101",
      amount: 1850,
      date: "2024-04-05",
      category: "Rent",
      property: "Modern Luxury Apartment",
    },
    {
      id: "2",
      type: "expense",
      description: "Plumbing Repair",
      amount: 450,
      date: "2024-04-03",
      category: "Maintenance",
      property: "Modern Luxury Apartment",
    },
    {
      id: "3",
      type: "income",
      description: "Rent Payment - Unit 202",
      amount: 1650,
      date: "2024-04-02",
      category: "Rent",
      property: "Downtown Penthouse",
    },
    {
      id: "4",
      type: "expense",
      description: "Quarterly Insurance Premium",
      amount: 2375,
      date: "2024-04-01",
      category: "Insurance",
      property: "All Properties",
    },
    {
      id: "5",
      type: "income",
      description: "Late Fee - Unit 305",
      amount: 75,
      date: "2024-03-28",
      category: "Late Fees",
      property: "Cozy Studio Loft",
    },
  ],
}

const FinancialDashboardScreen = () => {
  const navigation = useNavigation()
  const [activeTab, setActiveTab] = useState("overview")
  const [timeframe, setTimeframe] = useState("month")

  // Format currency
  const formatCurrency = (amount) => {
    return `$${amount.toFixed(0).replace(/\d(?=(\d{3})+$)/g, "$&,")}`
  }

  // Format date
  const formatDate = (dateString) => {
    const options = { year: "numeric", month: "short", day: "numeric" }
    return new Date(dateString).toLocaleDateString(undefined, options)
  }

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

  // Render overview tab
  const renderOverviewTab = () => (
    <>
      <Card title="Financial Summary" elevated>
        <View style={styles.summaryContainer}>
          <View style={styles.summaryRow}>
            <View style={styles.summaryItem}>
              <Text style={styles.summaryLabel}>Total Income</Text>
              <Text style={styles.summaryValue}>{formatCurrency(financialData.summary.totalIncome)}</Text>
            </View>
            <View style={styles.summaryItem}>
              <Text style={styles.summaryLabel}>Total Expenses</Text>
              <Text style={styles.summaryValue}>{formatCurrency(financialData.summary.totalExpenses)}</Text>
            </View>
          </View>
          <View style={styles.summaryRow}>
            <View style={styles.summaryItem}>
              <Text style={styles.summaryLabel}>Net Income</Text>
              <Text style={[styles.summaryValue, { color: COLORS.success }]}>
                {formatCurrency(financialData.summary.netIncome)}
              </Text>
            </View>
            <View style={styles.summaryItem}>
              <Text style={styles.summaryLabel}>Budget Variance</Text>
              <View style={styles.varianceContainer}>
                <Ionicons
                  name={financialData.summary.budgetVariance >= 0 ? "trending-up" : "trending-down"}
                  size={16}
                  color={financialData.summary.budgetVariance >= 0 ? COLORS.success : COLORS.error}
                />
                <Text
                  style={[
                    styles.varianceValue,
                    {
                      color: financialData.summary.budgetVariance >= 0 ? COLORS.success : COLORS.error,
                    },
                  ]}
                >
                  {Math.abs(financialData.summary.budgetVariance)}%
                </Text>
              </View>
            </View>
          </View>
          <View style={styles.summaryRow}>
            <View style={styles.summaryItem}>
              <Text style={styles.summaryLabel}>Cash on Hand</Text>
              <Text style={styles.summaryValue}>{formatCurrency(financialData.summary.cashOnHand)}</Text>
            </View>
            <View style={styles.summaryItem}>
              <Text style={styles.summaryLabel}>Pending Payments</Text>
              <Text style={styles.summaryValue}>{formatCurrency(financialData.summary.pendingPayments)}</Text>
            </View>
          </View>
        </View>
      </Card>

      <View style={styles.timeframeContainer}>
        <TouchableOpacity
          style={[styles.timeframeButton, timeframe === "month" && styles.activeTimeframe]}
          onPress={() => setTimeframe("month")}
        >
          <Text style={[styles.timeframeText, timeframe === "month" && styles.activeTimeframeText]}>Month</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.timeframeButton, timeframe === "quarter" && styles.activeTimeframe]}
          onPress={() => setTimeframe("quarter")}
        >
          <Text style={[styles.timeframeText, timeframe === "quarter" && styles.activeTimeframeText]}>Quarter</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.timeframeButton, timeframe === "year" && styles.activeTimeframe]}
          onPress={() => setTimeframe("year")}
        >
          <Text style={[styles.timeframeText, timeframe === "year" && styles.activeTimeframeText]}>Year</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.timeframeButton, timeframe === "custom" && styles.activeTimeframe]}
          onPress={() => setTimeframe("custom")}
        >
          <Text style={[styles.timeframeText, timeframe === "custom" && styles.activeTimeframeText]}>Custom</Text>
        </TouchableOpacity>
      </View>

      <Card
        title="Income vs Expenses"
        headerRight={
          <TouchableOpacity onPress={() => navigation.navigate("FinancialReports" as never)}>
            <Text style={styles.viewMoreText}>View More</Text>
          </TouchableOpacity>
        }
        elevated
      >
        <LineChart
          data={financialData.monthlyTrend}
          width={width - 48}
          height={220}
          chartConfig={chartConfig}
          bezier
          style={styles.chart}
          yAxisSuffix="$"
        />
      </Card>

      <View style={styles.chartsRow}>
        <Card title="Income Breakdown" style={styles.halfChart} elevated>
          <PieChart
            data={financialData.incomeBreakdown}
            width={width / 2 - 24}
            height={180}
            chartConfig={chartConfig}
            accessor="value"
            backgroundColor="transparent"
            paddingLeft="0"
            absolute={false}
          />
        </Card>

        <Card title="Expense Breakdown" style={styles.halfChart} elevated>
          <PieChart
            data={financialData.expenseBreakdown}
            width={width / 2 - 24}
            height={180}
            chartConfig={chartConfig}
            accessor="value"
            backgroundColor="transparent"
            paddingLeft="0"
            absolute={false}
          />
        </Card>
      </View>

      <Card
        title="Recent Transactions"
        headerRight={
          <TouchableOpacity onPress={() => navigation.navigate("TransactionsList" as never)}>
            <Text style={styles.viewMoreText}>View All</Text>
          </TouchableOpacity>
        }
        elevated
      >
        {financialData.recentTransactions.slice(0, 3).map((transaction) => (
          <TouchableOpacity
            key={transaction.id}
            style={styles.transactionItem}
            onPress={() => navigation.navigate("TransactionDetail" as never, { transactionId: transaction.id })}
          >
            <View style={styles.transactionIconContainer}>
              <Ionicons
                name={transaction.type === "income" ? "arrow-down-circle" : "arrow-up-circle"}
                size={24}
                color={transaction.type === "income" ? COLORS.success : COLORS.error}
              />
            </View>
            <View style={styles.transactionDetails}>
              <Text style={styles.transactionDescription}>{transaction.description}</Text>
              <Text style={styles.transactionMeta}>
                {transaction.category} • {transaction.property}
              </Text>
            </View>
            <View style={styles.transactionAmount}>
              <Text
                style={[
                  styles.transactionAmountText,
                  { color: transaction.type === "income" ? COLORS.success : COLORS.error },
                ]}
              >
                {transaction.type === "income" ? "+" : "-"}
                {formatCurrency(transaction.amount)}
              </Text>
              <Text style={styles.transactionDate}>{formatDate(transaction.date)}</Text>
            </View>
          </TouchableOpacity>
        ))}
      </Card>

      <View style={styles.actionButtons}>
        <TouchableOpacity style={styles.actionButton} onPress={() => navigation.navigate("AddTransaction" as never)}>
          <View style={styles.actionButtonIcon}>
            <Ionicons name="add-circle" size={24} color={COLORS.white} />
          </View>
          <Text style={styles.actionButtonText}>Add Transaction</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.actionButton} onPress={() => navigation.navigate("BudgetManagement" as never)}>
          <View style={styles.actionButtonIcon}>
            <Ionicons name="calculator" size={24} color={COLORS.white} />
          </View>
          <Text style={styles.actionButtonText}>Budget</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.actionButton} onPress={() => navigation.navigate("FinancialReports" as never)}>
          <View style={styles.actionButtonIcon}>
            <Ionicons name="document-text" size={24} color={COLORS.white} />
          </View>
          <Text style={styles.actionButtonText}>Reports</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.actionButton} onPress={() => navigation.navigate("TaxPreparation" as never)}>
          <View style={styles.actionButtonIcon}>
            <Ionicons name="receipt" size={24} color={COLORS.white} />
          </View>
          <Text style={styles.actionButtonText}>Taxes</Text>
        </TouchableOpacity>
      </View>
    </>
  )

  // Render budget tab
  const renderBudgetTab = () => (
    <>
      <Card title="Budget vs Actual" elevated>
        <BarChart
          data={financialData.budgetComparison}
          width={width - 48}
          height={220}
          chartConfig={chartConfig}
          style={styles.chart}
          yAxisSuffix="$"
          fromZero
        />
      </Card>

      <Card title="Budget Variance Analysis" elevated>
        <View style={styles.budgetVarianceContainer}>
          <View style={styles.budgetVarianceHeader}>
            <Text style={styles.budgetVarianceCategory}>Category</Text>
            <Text style={styles.budgetVarianceActual}>Actual</Text>
            <Text style={styles.budgetVarianceBudget}>Budget</Text>
            <Text style={styles.budgetVarianceDiff}>Variance</Text>
          </View>

          <View style={styles.budgetVarianceItem}>
            <Text style={styles.budgetVarianceCategory}>Maintenance</Text>
            <Text style={styles.budgetVarianceActual}>{formatCurrency(32000)}</Text>
            <Text style={styles.budgetVarianceBudget}>{formatCurrency(30000)}</Text>
            <View style={styles.budgetVarianceDiffContainer}>
              <Ionicons name="arrow-up" size={16} color={COLORS.error} />
              <Text style={[styles.budgetVarianceDiff, { color: COLORS.error }]}>6.7%</Text>
            </View>
          </View>

          <View style={styles.budgetVarianceItem}>
            <Text style={styles.budgetVarianceCategory}>Utilities</Text>
            <Text style={styles.budgetVarianceActual}>{formatCurrency(12500)}</Text>
            <Text style={styles.budgetVarianceBudget}>{formatCurrency(10000)}</Text>
            <View style={styles.budgetVarianceDiffContainer}>
              <Ionicons name="arrow-up" size={16} color={COLORS.error} />
              <Text style={[styles.budgetVarianceDiff, { color: COLORS.error }]}>25%</Text>
            </View>
          </View>

          <View style={styles.budgetVarianceItem}>
            <Text style={styles.budgetVarianceCategory}>Insurance</Text>
            <Text style={styles.budgetVarianceActual}>{formatCurrency(9500)}</Text>
            <Text style={styles.budgetVarianceBudget}>{formatCurrency(10000)}</Text>
            <View style={styles.budgetVarianceDiffContainer}>
              <Ionicons name="arrow-down" size={16} color={COLORS.success} />
              <Text style={[styles.budgetVarianceDiff, { color: COLORS.success }]}>5%</Text>
            </View>
          </View>

          <View style={styles.budgetVarianceItem}>
            <Text style={styles.budgetVarianceCategory}>Taxes</Text>
            <Text style={styles.budgetVarianceActual}>{formatCurrency(18500)}</Text>
            <Text style={styles.budgetVarianceBudget}>{formatCurrency(18000)}</Text>
            <View style={styles.budgetVarianceDiffContainer}>
              <Ionicons name="arrow-up" size={16} color={COLORS.error} />
              <Text style={[styles.budgetVarianceDiff, { color: COLORS.error }]}>2.8%</Text>
            </View>
          </View>

          <View style={styles.budgetVarianceItem}>
            <Text style={styles.budgetVarianceCategory}>Management</Text>
            <Text style={styles.budgetVarianceActual}>{formatCurrency(6000)}</Text>
            <Text style={styles.budgetVarianceBudget}>{formatCurrency(7000)}</Text>
            <View style={styles.budgetVarianceDiffContainer}>
              <Ionicons name="arrow-down" size={16} color={COLORS.success} />
              <Text style={[styles.budgetVarianceDiff, { color: COLORS.success }]}>14.3%</Text>
            </View>
          </View>
        </View>
      </Card>

      <TouchableOpacity
        style={styles.editBudgetButton}
        onPress={() => navigation.navigate("BudgetManagement" as never)}
      >
        <Ionicons name="create" size={20} color={COLORS.white} />
        <Text style={styles.editBudgetButtonText}>Edit Budget</Text>
      </TouchableOpacity>
    </>
  )

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Financial Dashboard</Text>
        <TouchableOpacity style={styles.headerButton} onPress={() => navigation.navigate("FinancialSettings" as never)}>
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
          style={[styles.tab, activeTab === "budget" && styles.activeTab]}
          onPress={() => setActiveTab("budget")}
        >
          <Text style={[styles.tabText, activeTab === "budget" && styles.activeTabText]}>Budget</Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content}>
        {activeTab === "overview" ? renderOverviewTab() : renderBudgetTab()}
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
    padding: 8,
  },
  summaryRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 16,
  },
  summaryItem: {
    flex: 1,
    alignItems: "center",
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
  varianceContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  varianceValue: {
    fontSize: 18,
    fontWeight: "bold",
    marginLeft: 4,
  },
  timeframeContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 16,
  },
  timeframeButton: {
    flex: 1,
    paddingVertical: 8,
    alignItems: "center",
    backgroundColor: COLORS.lightGray,
    marginHorizontal: 4,
    borderRadius: 4,
  },
  activeTimeframe: {
    backgroundColor: COLORS.primary,
  },
  timeframeText: {
    fontSize: 14,
    color: COLORS.darkGray,
  },
  activeTimeframeText: {
    color: COLORS.white,
    fontWeight: "bold",
  },
  chart: {
    marginVertical: 8,
    borderRadius: 8,
  },
  viewMoreText: {
    fontSize: 14,
    color: COLORS.primary,
    fontWeight: "500",
  },
  chartsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 16,
  },
  halfChart: {
    width: width / 2 - 24,
  },
  transactionItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.lightGray,
  },
  transactionIconContainer: {
    marginRight: 12,
  },
  transactionDetails: {
    flex: 1,
  },
  transactionDescription: {
    fontSize: 14,
    fontWeight: "500",
    color: COLORS.darkGray,
    marginBottom: 2,
  },
  transactionMeta: {
    fontSize: 12,
    color: COLORS.gray,
  },
  transactionAmount: {
    alignItems: "flex-end",
  },
  transactionAmountText: {
    fontSize: 14,
    fontWeight: "bold",
    marginBottom: 2,
  },
  transactionDate: {
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
    width: width / 4 - 20,
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
  budgetVarianceContainer: {
    paddingVertical: 8,
  },
  budgetVarianceHeader: {
    flexDirection: "row",
    paddingBottom: 8,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.lightGray,
    marginBottom: 8,
  },
  budgetVarianceItem: {
    flexDirection: "row",
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.lightGray,
  },
  budgetVarianceCategory: {
    flex: 2,
    fontSize: 14,
    color: COLORS.darkGray,
  },
  budgetVarianceActual: {
    flex: 1,
    fontSize: 14,
    color: COLORS.darkGray,
    textAlign: "right",
  },
  budgetVarianceBudget: {
    flex: 1,
    fontSize: 14,
    color: COLORS.darkGray,
    textAlign: "right",
  },
  budgetVarianceDiff: {
    fontSize: 14,
    fontWeight: "bold",
  },
  budgetVarianceDiffContainer: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "flex-end",
    alignItems: "center",
  },
  editBudgetButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: COLORS.primary,
    paddingVertical: 12,
    borderRadius: 8,
    marginBottom: 24,
  },
  editBudgetButtonText: {
    fontSize: 16,
    fontWeight: "bold",
    color: COLORS.white,
    marginLeft: 8,
  },
})

export default FinancialDashboardScreen

