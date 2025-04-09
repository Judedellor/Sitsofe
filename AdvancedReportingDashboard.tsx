"use client"

import { useState } from "react"
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, ActivityIndicator } from "react-native"
import { SafeAreaView } from "react-native-safe-area-context"
import { COLORS } from "../constants/colors"
import { Ionicons } from "@expo/vector-icons"
import Card from "../components/ui/Card"
import { useNavigation } from "@react-navigation/native"

// Report types
type ReportCategory = "financial" | "property" | "tenant" | "maintenance" | "custom"

// Sample report templates
const reportTemplates = [
  {
    id: "fin-1",
    name: "Monthly Revenue Summary",
    category: "financial",
    description: "Overview of revenue streams with month-over-month comparison",
    lastGenerated: "2023-03-15T10:30:00Z",
  },
  {
    id: "fin-2",
    name: "Expense Breakdown",
    category: "financial",
    description: "Detailed analysis of expenses by category and property",
    lastGenerated: "2023-03-10T14:45:00Z",
  },
  {
    id: "prop-1",
    name: "Property Performance",
    category: "property",
    description: "Comparative analysis of property metrics and KPIs",
    lastGenerated: "2023-03-12T09:15:00Z",
  },
  {
    id: "ten-1",
    name: "Tenant Satisfaction",
    category: "tenant",
    description: "Analysis of tenant feedback and satisfaction metrics",
    lastGenerated: "2023-03-05T16:20:00Z",
  },
  {
    id: "maint-1",
    name: "Maintenance Efficiency",
    category: "maintenance",
    description: "Metrics on maintenance request resolution and costs",
    lastGenerated: "2023-03-08T11:30:00Z",
  },
  {
    id: "custom-1",
    name: "Investment ROI Analysis",
    category: "custom",
    description: "Custom report on investment returns across properties",
    lastGenerated: "2023-03-01T15:45:00Z",
  },
]

// Recent reports
const recentReports = [
  {
    id: "rep-1",
    name: "Q1 Financial Summary",
    category: "financial",
    generatedOn: "2023-03-31T17:30:00Z",
    format: "PDF",
  },
  {
    id: "rep-2",
    name: "Property Occupancy Forecast",
    category: "property",
    generatedOn: "2023-03-28T14:15:00Z",
    format: "Excel",
  },
  {
    id: "rep-3",
    name: "Maintenance Cost Analysis",
    category: "maintenance",
    generatedOn: "2023-03-25T10:45:00Z",
    format: "PDF",
  },
]

const AdvancedReportingDashboard = () => {
  const navigation = useNavigation()
  const [selectedCategory, setSelectedCategory] = useState<ReportCategory>("financial")
  const [isLoading, setIsLoading] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")

  // Filter templates by selected category
  const filteredTemplates = reportTemplates.filter(
    (template) => template.category === selectedCategory || selectedCategory === "custom",
  )

  // Handle report generation
  const handleGenerateReport = (reportId: string) => {
    setIsLoading(true)
    // Simulate API call to generate report
    setTimeout(() => {
      setIsLoading(false)
      navigation.navigate("ReportBuilder", { reportId })
    }, 1500)
  }

  // Handle viewing a report
  const handleViewReport = (reportId: string) => {
    navigation.navigate("ReportViewer", { reportId })
  }

  // Format date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    })
  }

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Advanced Reporting</Text>
        <TouchableOpacity
          style={styles.createButton}
          onPress={() => navigation.navigate("ReportBuilder", { reportId: "new" })}
        >
          <Ionicons name="add" size={22} color={COLORS.white} />
          <Text style={styles.createButtonText}>Create Report</Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content}>
        {/* Quick Stats */}
        <View style={styles.statsContainer}>
          <View style={styles.statCard}>
            <Text style={styles.statValue}>24</Text>
            <Text style={styles.statLabel}>Reports Generated</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statValue}>8</Text>
            <Text style={styles.statLabel}>Custom Templates</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statValue}>12</Text>
            <Text style={styles.statLabel}>Scheduled Reports</Text>
          </View>
        </View>

        {/* Recent Reports */}
        <Card title="Recent Reports" elevated>
          {recentReports.map((report) => (
            <TouchableOpacity key={report.id} style={styles.reportItem} onPress={() => handleViewReport(report.id)}>
              <View style={styles.reportItemContent}>
                <View>
                  <Text style={styles.reportName}>{report.name}</Text>
                  <Text style={styles.reportMeta}>
                    {formatDate(report.generatedOn)} • {report.format}
                  </Text>
                </View>
                <View style={styles.reportActions}>
                  <TouchableOpacity style={styles.actionButton}>
                    <Ionicons name="download-outline" size={20} color={COLORS.primary} />
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.actionButton}>
                    <Ionicons name="share-outline" size={20} color={COLORS.primary} />
                  </TouchableOpacity>
                </View>
              </View>
            </TouchableOpacity>
          ))}
          <TouchableOpacity style={styles.viewAllButton}>
            <Text style={styles.viewAllText}>View All Reports</Text>
          </TouchableOpacity>
        </Card>

        {/* Report Templates */}
        <View style={styles.templatesSection}>
          <Text style={styles.sectionTitle}>Report Templates</Text>

          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.categoriesContainer}>
            <TouchableOpacity
              style={[styles.categoryTab, selectedCategory === "financial" && styles.selectedCategoryTab]}
              onPress={() => setSelectedCategory("financial")}
            >
              <Text style={[styles.categoryText, selectedCategory === "financial" && styles.selectedCategoryText]}>
                Financial
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.categoryTab, selectedCategory === "property" && styles.selectedCategoryTab]}
              onPress={() => setSelectedCategory("property")}
            >
              <Text style={[styles.categoryText, selectedCategory === "property" && styles.selectedCategoryText]}>
                Property
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.categoryTab, selectedCategory === "tenant" && styles.selectedCategoryTab]}
              onPress={() => setSelectedCategory("tenant")}
            >
              <Text style={[styles.categoryText, selectedCategory === "tenant" && styles.selectedCategoryText]}>
                Tenant
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.categoryTab, selectedCategory === "maintenance" && styles.selectedCategoryTab]}
              onPress={() => setSelectedCategory("maintenance")}
            >
              <Text style={[styles.categoryText, selectedCategory === "maintenance" && styles.selectedCategoryText]}>
                Maintenance
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.categoryTab, selectedCategory === "custom" && styles.selectedCategoryTab]}
              onPress={() => setSelectedCategory("custom")}
            >
              <Text style={[styles.categoryText, selectedCategory === "custom" && styles.selectedCategoryText]}>
                Custom
              </Text>
            </TouchableOpacity>
          </ScrollView>

          <View style={styles.templatesGrid}>
            {filteredTemplates.map((template) => (
              <TouchableOpacity
                key={template.id}
                style={styles.templateCard}
                onPress={() => handleGenerateReport(template.id)}
              >
                <View style={styles.templateIconContainer}>
                  <Ionicons
                    name={
                      template.category === "financial"
                        ? "stats-chart"
                        : template.category === "property"
                          ? "business"
                          : template.category === "tenant"
                            ? "people"
                            : template.category === "maintenance"
                              ? "construct"
                              : "document-text"
                    }
                    size={24}
                    color={COLORS.primary}
                  />
                </View>
                <Text style={styles.templateName}>{template.name}</Text>
                <Text style={styles.templateDescription} numberOfLines={2}>
                  {template.description}
                </Text>
                <Text style={styles.templateDate}>Last generated: {formatDate(template.lastGenerated)}</Text>
                <TouchableOpacity
                  style={styles.generateButton}
                  onPress={() => handleGenerateReport(template.id)}
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <ActivityIndicator size="small" color={COLORS.white} />
                  ) : (
                    <Text style={styles.generateButtonText}>Generate</Text>
                  )}
                </TouchableOpacity>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Business Intelligence */}
        <Card title="Business Intelligence" elevated>
          <TouchableOpacity style={styles.biItem} onPress={() => navigation.navigate("PerformanceBenchmarking")}>
            <View style={styles.biIconContainer}>
              <Ionicons name="trending-up" size={24} color={COLORS.primary} />
            </View>
            <View style={styles.biContent}>
              <Text style={styles.biTitle}>Performance Benchmarking</Text>
              <Text style={styles.biDescription}>
                Compare your properties against industry standards and identify improvement opportunities
              </Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color={COLORS.gray} />
          </TouchableOpacity>

          <TouchableOpacity style={styles.biItem} onPress={() => navigation.navigate("PredictiveAnalytics")}>
            <View style={styles.biIconContainer}>
              <Ionicons name="analytics" size={24} color={COLORS.primary} />
            </View>
            <View style={styles.biContent}>
              <Text style={styles.biTitle}>Predictive Analytics</Text>
              <Text style={styles.biDescription}>Forecast occupancy rates, rental income, and maintenance costs</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color={COLORS.gray} />
          </TouchableOpacity>

          <TouchableOpacity style={styles.biItem} onPress={() => navigation.navigate("InvestmentAnalysis")}>
            <View style={styles.biIconContainer}>
              <Ionicons name="calculator" size={24} color={COLORS.primary} />
            </View>
            <View style={styles.biContent}>
              <Text style={styles.biTitle}>Investment Analysis</Text>
              <Text style={styles.biDescription}>Evaluate property performance, ROI, and investment opportunities</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color={COLORS.gray} />
          </TouchableOpacity>

          <TouchableOpacity style={styles.biItem} onPress={() => navigation.navigate("DataVisualization")}>
            <View style={styles.biIconContainer}>
              <Ionicons name="pie-chart" size={24} color={COLORS.primary} />
            </View>
            <View style={styles.biContent}>
              <Text style={styles.biTitle}>Interactive Dashboards</Text>
              <Text style={styles.biDescription}>
                Explore your data with interactive visualizations and drill-down capabilities
              </Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color={COLORS.gray} />
          </TouchableOpacity>
        </Card>
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
  createButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: COLORS.primary,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 6,
  },
  createButtonText: {
    color: COLORS.white,
    fontWeight: "500",
    marginLeft: 4,
  },
  content: {
    flex: 1,
    padding: 16,
  },
  statsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 16,
  },
  statCard: {
    flex: 1,
    backgroundColor: COLORS.white,
    borderRadius: 8,
    padding: 16,
    marginHorizontal: 4,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  statValue: {
    fontSize: 24,
    fontWeight: "bold",
    color: COLORS.primary,
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: COLORS.gray,
    textAlign: "center",
  },
  reportItem: {
    borderBottomWidth: 1,
    borderBottomColor: COLORS.lightGray,
    paddingVertical: 12,
  },
  reportItemContent: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  reportName: {
    fontSize: 16,
    fontWeight: "500",
    color: COLORS.darkGray,
    marginBottom: 4,
  },
  reportMeta: {
    fontSize: 12,
    color: COLORS.gray,
  },
  reportActions: {
    flexDirection: "row",
  },
  actionButton: {
    padding: 8,
    marginLeft: 8,
  },
  viewAllButton: {
    alignItems: "center",
    paddingVertical: 12,
    marginTop: 8,
  },
  viewAllText: {
    color: COLORS.primary,
    fontWeight: "500",
  },
  templatesSection: {
    marginTop: 24,
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: COLORS.darkGray,
    marginBottom: 16,
  },
  categoriesContainer: {
    flexDirection: "row",
    marginBottom: 16,
  },
  categoryTab: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginRight: 8,
    borderRadius: 20,
    backgroundColor: COLORS.lightGray,
  },
  selectedCategoryTab: {
    backgroundColor: COLORS.primary,
  },
  categoryText: {
    color: COLORS.darkGray,
  },
  selectedCategoryText: {
    color: COLORS.white,
    fontWeight: "500",
  },
  templatesGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  templateCard: {
    width: "48%",
    backgroundColor: COLORS.white,
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  templateIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: COLORS.primaryLight,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 12,
  },
  templateName: {
    fontSize: 16,
    fontWeight: "500",
    color: COLORS.darkGray,
    marginBottom: 8,
  },
  templateDescription: {
    fontSize: 12,
    color: COLORS.gray,
    marginBottom: 8,
    height: 32,
  },
  templateDate: {
    fontSize: 11,
    color: COLORS.gray,
    marginBottom: 12,
  },
  generateButton: {
    backgroundColor: COLORS.primary,
    paddingVertical: 8,
    borderRadius: 4,
    alignItems: "center",
  },
  generateButtonText: {
    color: COLORS.white,
    fontWeight: "500",
    fontSize: 14,
  },
  biItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.lightGray,
  },
  biIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: COLORS.primaryLight,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  biContent: {
    flex: 1,
  },
  biTitle: {
    fontSize: 16,
    fontWeight: "500",
    color: COLORS.darkGray,
    marginBottom: 4,
  },
  biDescription: {
    fontSize: 12,
    color: COLORS.gray,
  },
})

export default AdvancedReportingDashboard

