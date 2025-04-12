"use client"

import { useState, useEffect } from "react"
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from "react-native"
import { SafeAreaView } from "react-native-safe-area-context"
import { Ionicons } from "@expo/vector-icons"
import { useNavigation } from "@react-navigation/native"
import { COLORS } from "../constants/colors"
import Card from "../components/ui/Card"
import Button from "../components/ui/Button"
import ProgressCircle from "../components/ProgressCircle"
import api from "../api"

// Compliance data state
const ComplianceDashboardScreen = () => {
  const navigation = useNavigation()
  const [activeTab, setActiveTab] = useState("overview")
  const [complianceData, setComplianceData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchComplianceData = async () => {
      try {
        setLoading(true)
        const response = await api.get("/compliance")
        setComplianceData(response.data)
      } catch (err) {
        setError("Failed to fetch compliance data")
      } finally {
        setLoading(false)
      }
    }

    fetchComplianceData()
  }, [])

  // Format date
  const formatDate = (dateString) => {
    const options = { year: "numeric", month: "short", day: "numeric" }
    return new Date(dateString).toLocaleDateString(undefined, options)
  }

  // Get status color
  const getStatusColor = (status) => {
    switch (status) {
      case "completed":
        return COLORS.success
      case "upcoming":
        return COLORS.warning
      case "overdue":
        return COLORS.error
      default:
        return COLORS.gray
    }
  }

  // Get impact color
  const getImpactColor = (impact) => {
    switch (impact) {
      case "high":
        return COLORS.error
      case "medium":
        return COLORS.warning
      case "low":
        return COLORS.success
      default:
        return COLORS.gray
    }
  }

  // Render overview tab
  const renderOverviewTab = () => (
    <>
      <Card title="Compliance Summary" elevated>
        <View style={styles.summaryContainer}>
          <View style={styles.summaryChart}>
            <ProgressCircle
              percentage={complianceData.summary.completionRate}
              radius={70}
              strokeWidth={12}
              color={COLORS.primary}
              textColor={COLORS.darkGray}
            />
          </View>
          <View style={styles.summaryStats}>
            <View style={styles.statItem}>
              <View style={[styles.statIndicator, { backgroundColor: COLORS.success }]} />
              <Text style={styles.statLabel}>Completed</Text>
              <Text style={styles.statValue}>{complianceData.summary.completed}</Text>
            </View>
            <View style={styles.statItem}>
              <View style={[styles.statIndicator, { backgroundColor: COLORS.warning }]} />
              <Text style={styles.statLabel}>Upcoming</Text>
              <Text style={styles.statValue}>{complianceData.summary.upcoming}</Text>
            </View>
            <View style={styles.statItem}>
              <View style={[styles.statIndicator, { backgroundColor: COLORS.error }]} />
              <Text style={styles.statLabel}>Overdue</Text>
              <Text style={styles.statValue}>{complianceData.summary.overdue}</Text>
            </View>
            <View style={styles.statItem}>
              <View style={[styles.statIndicator, { backgroundColor: COLORS.gray }]} />
              <Text style={styles.statLabel}>Total</Text>
              <Text style={styles.statValue}>{complianceData.summary.total}</Text>
            </View>
          </View>
        </View>
      </Card>

      <Card
        title="Upcoming Deadlines"
        headerRight={
          <Button
            title="View All"
            onPress={() => navigation.navigate("ComplianceCalendar" as never)}
            type="link"
            size="small"
          />
        }
        elevated
      >
        {complianceData.upcomingDeadlines.slice(0, 3).map((item) => (
          <TouchableOpacity
            key={item.id}
            style={styles.deadlineItem}
            onPress={() => navigation.navigate("ComplianceDetail" as never, { itemId: item.id })}
          >
            <View style={styles.deadlineHeader}>
              <Text style={styles.deadlineTitle}>{item.title}</Text>
              <View style={[styles.deadlineStatus, { backgroundColor: getStatusColor(item.status) }]}>
                <Text style={styles.deadlineStatusText}>{item.daysRemaining} days</Text>
              </View>
            </View>
            <Text style={styles.deadlineProperty}>{item.property}</Text>
            <View style={styles.deadlineFooter}>
              <Text style={styles.deadlineCategory}>{item.category}</Text>
              <Text style={styles.deadlineDate}>Due: {formatDate(item.dueDate)}</Text>
            </View>
          </TouchableOpacity>
        ))}
        {complianceData.overdueItems.length > 0 && (
          <View style={styles.overdueSection}>
            <Text style={styles.overdueSectionTitle}>Overdue Items</Text>
            {complianceData.overdueItems.map((item) => (
              <TouchableOpacity
                key={item.id}
                style={styles.deadlineItem}
                onPress={() => navigation.navigate("ComplianceDetail" as never, { itemId: item.id })}
              >
                <View style={styles.deadlineHeader}>
                  <Text style={styles.deadlineTitle}>{item.title}</Text>
                  <View style={[styles.deadlineStatus, { backgroundColor: getStatusColor(item.status) }]}>
                    <Text style={styles.deadlineStatusText}>{item.daysOverdue} days overdue</Text>
                  </View>
                </View>
                <Text style={styles.deadlineProperty}>{item.property}</Text>
                <View style={styles.deadlineFooter}>
                  <Text style={styles.deadlineCategory}>{item.category}</Text>
                  <Text style={styles.deadlineDate}>Due: {formatDate(item.dueDate)}</Text>
                </View>
              </TouchableOpacity>
            ))}
          </View>
        )}
      </Card>

      <Card
        title="Regulatory Updates"
        headerRight={
          <Button
            title="View All"
            onPress={() => navigation.navigate("RegulatoryUpdates" as never)}
            type="link"
            size="small"
          />
        }
        elevated
      >
        {complianceData.regulatoryUpdates.slice(0, 2).map((update) => (
          <TouchableOpacity
            key={update.id}
            style={styles.updateItem}
            onPress={() => navigation.navigate("RegulatoryUpdateDetail" as never, { updateId: update.id })}
          >
            <View style={styles.updateHeader}>
              <Text style={styles.updateTitle}>{update.title}</Text>
              <View style={[styles.impactBadge, { backgroundColor: getImpactColor(update.impact) }]}>
                <Text style={styles.impactText}>{update.impact.toUpperCase()} IMPACT</Text>
              </View>
            </View>
            <Text style={styles.updateDescription} numberOfLines={2}>
              {update.description}
            </Text>
            <View style={styles.updateFooter}>
              <Text style={styles.updateSource}>{update.source}</Text>
              <Text style={styles.updateDate}>{formatDate(update.date)}</Text>
            </View>
          </TouchableOpacity>
        ))}
      </Card>

      <Card
        title="Recent Activity"
        headerRight={
          <Button
            title="View All"
            onPress={() => navigation.navigate("ComplianceAuditTrail" as never)}
            type="link"
            size="small"
          />
        }
        elevated
      >
        {complianceData.recentActivity.slice(0, 3).map((activity) => (
          <View key={activity.id} style={styles.activityItem}>
            <View style={styles.activityIconContainer}>
              {activity.action === "Completed" && <Ionicons name="checkmark-circle" size={24} color={COLORS.success} />}
              {activity.action === "Uploaded" && <Ionicons name="cloud-upload" size={24} color={COLORS.primary} />}
              {activity.action === "Scheduled" && <Ionicons name="calendar" size={24} color={COLORS.warning} />}
              {activity.action === "Updated" && <Ionicons name="refresh-circle" size={24} color={COLORS.info} />}
            </View>
            <View style={styles.activityContent}>
              <Text style={styles.activityAction}>{activity.action}</Text>
              <Text style={styles.activityTitle}>{activity.title}</Text>
              <View style={styles.activityFooter}>
                <Text style={styles.activityProperty}>{activity.property}</Text>
                <Text style={styles.activityDate}>{formatDate(activity.date)}</Text>
              </View>
            </View>
          </View>
        ))}
      </Card>
    </>
  )

  // Render categories tab
  const renderCategoriesTab = () => (
    <Card title="Compliance Categories" elevated>
      {complianceData.categories.map((category) => (
        <TouchableOpacity
          key={category.id}
          style={styles.categoryItem}
          onPress={() => navigation.navigate("ComplianceCategoryDetail" as never, { categoryId: category.id })}
        >
          <View style={styles.categoryHeader}>
            <Text style={styles.categoryName}>{category.name}</Text>
            <View style={styles.categoryStats}>
              <Text style={styles.categoryStatText}>
                {category.completed}/{category.total}
              </Text>
            </View>
          </View>
          <View style={styles.progressBarContainer}>
            <View style={[styles.progressBar, { width: `${(category.completed / category.total) * 100}%` }]} />
          </View>
          <View style={styles.categoryFooter}>
            {category.overdue > 0 && (
              <View style={styles.categoryAlert}>
                <Ionicons name="alert-circle" size={16} color={COLORS.error} />
                <Text style={[styles.categoryAlertText, { color: COLORS.error }]}>{category.overdue} overdue</Text>
              </View>
            )}
            {category.upcoming > 0 && (
              <View style={styles.categoryAlert}>
                <Ionicons name="time" size={16} color={COLORS.warning} />
                <Text style={[styles.categoryAlertText, { color: COLORS.warning }]}>{category.upcoming} upcoming</Text>
              </View>
            )}
          </View>
        </TouchableOpacity>
      ))}
    </Card>
  )

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Compliance Management</Text>
        <TouchableOpacity style={styles.addButton} onPress={() => navigation.navigate("AddComplianceItem" as never)}>
          <Ionicons name="add" size={24} color={COLORS.white} />
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
          style={[styles.tab, activeTab === "categories" && styles.activeTab]}
          onPress={() => setActiveTab("categories")}
        >
          <Text style={[styles.tabText, activeTab === "categories" && styles.activeTabText]}>Categories</Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content}>
        {loading ? (
          <Text>Loading...</Text>
        ) : error ? (
          <Text>{error}</Text>
        ) : activeTab === "overview" ? (
          renderOverviewTab()
        ) : (
          renderCategoriesTab()
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
  addButton: {
    backgroundColor: COLORS.primary,
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: "center",
    alignItems: "center",
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
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 8,
  },
  summaryChart: {
    alignItems: "center",
    justifyContent: "center",
    width: "40%",
  },
  summaryStats: {
    width: "55%",
  },
  statItem: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  statIndicator: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 8,
  },
  statLabel: {
    flex: 1,
    fontSize: 14,
    color: COLORS.darkGray,
  },
  statValue: {
    fontSize: 16,
    fontWeight: "bold",
    color: COLORS.darkGray,
  },
  deadlineItem: {
    backgroundColor: COLORS.white,
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
    borderLeftWidth: 4,
    borderLeftColor: COLORS.warning,
  },
  deadlineHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 4,
  },
  deadlineTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: COLORS.darkGray,
    flex: 1,
  },
  deadlineStatus: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  deadlineStatusText: {
    fontSize: 12,
    color: COLORS.white,
    fontWeight: "bold",
  },
  deadlineProperty: {
    fontSize: 14,
    color: COLORS.darkGray,
    marginBottom: 4,
  },
  deadlineFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  deadlineCategory: {
    fontSize: 12,
    color: COLORS.gray,
  },
  deadlineDate: {
    fontSize: 12,
    color: COLORS.gray,
  },
  overdueSection: {
    marginTop: 8,
  },
  overdueSectionTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: COLORS.error,
    marginBottom: 8,
  },
  updateItem: {
    backgroundColor: COLORS.white,
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
    borderLeftWidth: 4,
    borderLeftColor: COLORS.info,
  },
  updateHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 4,
  },
  updateTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: COLORS.darkGray,
    flex: 1,
  },
  impactBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  impactText: {
    fontSize: 10,
    color: COLORS.white,
    fontWeight: "bold",
  },
  updateDescription: {
    fontSize: 14,
    color: COLORS.darkGray,
    marginBottom: 8,
  },
  updateFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  updateSource: {
    fontSize: 12,
    color: COLORS.gray,
  },
  updateDate: {
    fontSize: 12,
    color: COLORS.gray,
  },
  activityItem: {
    flexDirection: "row",
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.lightGray,
  },
  activityIconContainer: {
    marginRight: 12,
  },
  activityContent: {
    flex: 1,
  },
  activityAction: {
    fontSize: 12,
    color: COLORS.primary,
    fontWeight: "bold",
  },
  activityTitle: {
    fontSize: 14,
    fontWeight: "500",
    color: COLORS.darkGray,
    marginBottom: 4,
  },
  activityFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  activityProperty: {
    fontSize: 12,
    color: COLORS.gray,
  },
  activityDate: {
    fontSize: 12,
    color: COLORS.gray,
  },
  categoryItem: {
    backgroundColor: COLORS.white,
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
  },
  categoryHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  categoryName: {
    fontSize: 16,
    fontWeight: "bold",
    color: COLORS.darkGray,
  },
  categoryStats: {
    backgroundColor: COLORS.lightGray,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  categoryStatText: {
    fontSize: 12,
    fontWeight: "bold",
    color: COLORS.darkGray,
  },
  progressBarContainer: {
    height: 8,
    backgroundColor: COLORS.lightGray,
    borderRadius: 4,
    marginBottom: 8,
    overflow: "hidden",
  },
  progressBar: {
    height: "100%",
    backgroundColor: COLORS.primary,
    borderRadius: 4,
  },
  categoryFooter: {
    flexDirection: "row",
  },
  categoryAlert: {
    flexDirection: "row",
    alignItems: "center",
    marginRight: 16,
  },
  categoryAlertText: {
    fontSize: 12,
    marginLeft: 4,
  },
})

export default ComplianceDashboardScreen
