"use client"

import { useState, useEffect } from "react"
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, ActivityIndicator } from "react-native"
import { SafeAreaView } from "react-native-safe-area-context"
import { COLORS } from "../constants/colors"
import { Ionicons } from "@expo/vector-icons"
import { useNavigation, useRoute } from "@react-navigation/native"
import Card from "../components/ui/Card"
import { LineChart, BarChart, PieChart } from "react-native-chart-kit"
import { Dimensions } from "react-native"

const { width } = Dimensions.get("window")

const ReportViewerScreen = () => {
  const navigation = useNavigation()
  const route = useRoute()
  const { reportId, reportData } = route.params || { reportId: null, reportData: null }

  const [isLoading, setIsLoading] = useState(true)
  const [report, setReport] = useState(null)

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

  // Load report data
  useEffect(() => {
    // In a real app, this would fetch the report from an API
    setTimeout(() => {
      if (reportData) {
        setReport(reportData)
      } else {
        // Sample report data
        setReport({
          name: "Q1 Financial Summary",
          generatedOn: new Date().toISOString(),
          properties: ["Modern Luxury Apartment", "Cozy Studio Loft", "Downtown Penthouse"],
          metrics: ["Revenue", "Expenses", "Net Income", "Occupancy Rate"],
          period: "Q1 2023",
          data: {
            revenue: {
              labels: ["Jan", "Feb", "Mar"],
              datasets: [
                {
                  data: [42500, 45000, 48000],
                  color: (opacity = 1) => `rgba(46, 204, 113, ${opacity})`,
                  strokeWidth: 2,
                },
              ],
            },
            expenses: {
              labels: ["Jan", "Feb", "Mar"],
              datasets: [
                {
                  data: [28000, 26000, 30000],
                  color: (opacity = 1) => `rgba(231, 76, 60, ${opacity})`,
                  strokeWidth: 2,
                },
              ],
            },
            netIncome: {
              labels: ["Jan", "Feb", "Mar"],
              datasets: [
                {
                  data: [14500, 19000, 18000],
                  color: (opacity = 1) => `rgba(52, 152, 219, ${opacity})`,
                  strokeWidth: 2,
                },
              ],
            },
            occupancy: {
              labels: ["Jan", "Feb", "Mar"],
              datasets: [
                {
                  data: [92, 94, 95],
                  color: (opacity = 1) => `rgba(155, 89, 182, ${opacity})`,
                  strokeWidth: 2,
                },
              ],
            },
            propertyComparison: {
              labels: ["Modern Luxury", "Cozy Studio", "Downtown"],
              datasets: [
                {
                  data: [48000, 22000, 45000],
                },
              ],
            },
            expenseBreakdown: [
              { name: "Maintenance", value: 32000, color: "#FF6384", legendFontColor: "#7F7F7F", legendFontSize: 12 },
              { name: "Property Tax", value: 18500, color: "#36A2EB", legendFontColor: "#7F7F7F", legendFontSize: 12 },
              { name: "Insurance", value: 9500, color: "#FFCE56", legendFontColor: "#7F7F7F", legendFontSize: 12 },
              { name: "Utilities", value: 12500, color: "#4BC0C0", legendFontColor: "#7F7F7F", legendFontSize: 12 },
              { name: "Management", value: 6000, color: "#9966FF", legendFontColor: "#7F7F7F", legendFontSize: 12 },
            ],
          },
          summary: [
            "Total revenue for Q1 2023 was $135,500, a 12% increase from Q4 2022.",
            "Expenses remained stable at $84,000, resulting in a net income of $51,500.",
            "The Modern Luxury Apartment continues to be the highest revenue generator.",
            "Occupancy rates improved throughout the quarter, ending at 95%.",
          ],
          recommendations: [
            "Consider rent increases for the Cozy Studio Loft property, which is below market rates.",
            "Implement the preventive maintenance program to reduce repair costs in Q2.",
            "Review utility expenses, which increased by 8% compared to the previous quarter.",
          ],
        })
      }
      setIsLoading(false)
    }, 1500)
  }, [reportId, reportData])

  // Format date
  const formatDate = (dateString) => {
    const date = new Date(dateString)
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  if (isLoading) {
    return (
      <SafeAreaView style={styles.container} edges={["top"]}>
        <View style={styles.header}>
          <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
            <Ionicons name="arrow-back" size={24} color={COLORS.darkGray} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Report Viewer</Text>
        </View>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={COLORS.primary} />
          <Text style={styles.loadingText}>Generating report...</Text>
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
        <Text style={styles.headerTitle}>Report Viewer</Text>
        <View style={styles.headerActions}>
          <TouchableOpacity style={styles.headerAction}>
            <Ionicons name="download-outline" size={24} color={COLORS.primary} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.headerAction}>
            <Ionicons name="share-social-outline" size={24} color={COLORS.primary} />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView style={styles.content}>
        <Card elevated>
          <Text style={styles.reportTitle}>{report.name}</Text>
          <Text style={styles.reportDate}>Generated on: {formatDate(report.generatedOn)}</Text>

          <View style={styles.reportMeta}>
            <View style={styles.reportMetaItem}>
              <Text style={styles.reportMetaLabel}>Period</Text>
              <Text style={styles.reportMetaValue}>{report.period}</Text>
            </View>
            <View style={styles.reportMetaItem}>
              <Text style={styles.reportMetaLabel}>Properties</Text>
              <Text style={styles.reportMetaValue}>{report.properties.length}</Text>
            </View>
            <View style={styles.reportMetaItem}>
              <Text style={styles.reportMetaLabel}>Metrics</Text>
              <Text style={styles.reportMetaValue}>{report.metrics.length}</Text>
            </View>
          </View>
        </Card>

        <Card title="Revenue Trend" elevated>
          <LineChart
            data={report.data.revenue}
            width={width - 48}
            height={220}
            chartConfig={chartConfig}
            bezier
            style={styles.chart}
            yAxisSuffix="$"
          />
        </Card>

        <Card title="Expenses Trend" elevated>
          <LineChart
            data={report.data.expenses}
            width={width - 48}
            height={220}
            chartConfig={{
              ...chartConfig,
              color: (opacity = 1) => `rgba(231, 76, 60, ${opacity})`,
            }}
            bezier
            style={styles.chart}
            yAxisSuffix="$"
          />
        </Card>

        <Card title="Net Income" elevated>
          <LineChart
            data={report.data.netIncome}
            width={width - 48}
            height={220}
            chartConfig={{
              ...chartConfig,
              color: (opacity = 1) => `rgba(52, 152, 219, ${opacity})`,
            }}
            bezier
            style={styles.chart}
            yAxisSuffix="$"
          />
        </Card>

        <Card title="Occupancy Rate" elevated>
          <LineChart
            data={report.data.occupancy}
            width={width - 48}
            height={220}
            chartConfig={{
              ...chartConfig,
              color: (opacity = 1) => `rgba(155, 89, 182, ${opacity})`,
            }}
            bezier
            style={styles.chart}
            yAxisSuffix="%"
          />
        </Card>

        <Card title="Revenue by Property" elevated>
          <BarChart
            data={report.data.propertyComparison}
            width={width - 48}
            height={220}
            chartConfig={chartConfig}
            style={styles.chart}
            yAxisSuffix="$"
            fromZero
          />
        </Card>

        <Card title="Expense Breakdown" elevated>
          <PieChart
            data={report.data.expenseBreakdown}
            width={width - 48}
            height={220}
            chartConfig={chartConfig}
            accessor="value"
            backgroundColor="transparent"
            paddingLeft="15"
            absolute
          />
        </Card>

        <Card title="Key Findings" elevated>
          {report.summary.map((item, index) => (
            <View key={index} style={styles.findingItem}>
              <View style={styles.findingBullet}>
                <Text style={styles.findingBulletText}>{index + 1}</Text>
              </View>
              <Text style={styles.findingText}>{item}</Text>
            </View>
          ))}
        </Card>

        <Card title="Recommendations" elevated>
          {report.recommendations.map((item, index) => (
            <View key={index} style={styles.recommendationItem}>
              <View style={styles.recommendationIcon}>
                <Ionicons name="bulb" size={20} color={COLORS.white} />
              </View>
              <Text style={styles.recommendationText}>{item}</Text>
            </View>
          ))}
        </Card>

        <View style={styles.footer}>
          <TouchableOpacity style={styles.footerButton}>
            <Ionicons name="download-outline" size={20} color={COLORS.white} />
            <Text style={styles.footerButtonText}>Download PDF</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.footerButton}>
            <Ionicons name="share-social-outline" size={20} color={COLORS.white} />
            <Text style={styles.footerButtonText}>Share Report</Text>
          </TouchableOpacity>
        </View>
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
  headerActions: {
    flexDirection: "row",
  },
  headerAction: {
    padding: 4,
    marginLeft: 16,
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
  reportTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: COLORS.darkGray,
    marginBottom: 8,
  },
  reportDate: {
    fontSize: 14,
    color: COLORS.gray,
    marginBottom: 16,
  },
  reportMeta: {
    flexDirection: "row",
    justifyContent: "space-between",
    borderTopWidth: 1,
    borderTopColor: COLORS.lightGray,
    paddingTop: 16,
  },
  reportMetaItem: {
    alignItems: "center",
  },
  reportMetaLabel: {
    fontSize: 12,
    color: COLORS.gray,
    marginBottom: 4,
  },
  reportMetaValue: {
    fontSize: 16,
    fontWeight: "bold",
    color: COLORS.darkGray,
  },
  chart: {
    marginVertical: 8,
    borderRadius: 8,
  },
  findingItem: {
    flexDirection: "row",
    marginBottom: 12,
  },
  findingBullet: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: COLORS.primary,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  findingBulletText: {
    color: COLORS.white,
    fontWeight: "bold",
    fontSize: 12,
  },
  findingText: {
    flex: 1,
    fontSize: 14,
    color: COLORS.darkGray,
    lineHeight: 20,
  },
  recommendationItem: {
    flexDirection: "row",
    marginBottom: 12,
  },
  recommendationIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: COLORS.warning,
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
  footer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 16,
    marginBottom: 32,
  },
  footerButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: COLORS.primary,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 6,
    flex: 1,
    marginHorizontal: 4,
  },
  footerButtonText: {
    color: COLORS.white,
    fontWeight: "500",
    marginLeft: 8,
  },
})

export default ReportViewerScreen

