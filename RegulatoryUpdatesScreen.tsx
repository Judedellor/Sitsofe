"use client"

import { useState } from "react"
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from "react-native"
import { SafeAreaView } from "react-native-safe-area-context"
import { Ionicons } from "@expo/vector-icons"
import { useNavigation } from "@react-navigation/native"
import { COLORS } from "../constants/colors"

// Mock regulatory updates data
const regulatoryUpdates = [
  {
    id: "1",
    title: "New Fire Safety Regulations",
    description:
      "Updated fire safety requirements for multi-family buildings effective June 1, 2024. Changes include increased frequency of fire alarm testing, additional requirements for sprinkler systems, and new evacuation plan standards.",
    date: "2024-04-01",
    source: "City Fire Department",
    impact: "high",
    properties: ["Modern Luxury Apartment", "Downtown Penthouse", "Cozy Studio Loft"],
    url: "https://example.com/fire-safety-regulations",
    category: "Fire Safety",
  },
  {
    id: "2",
    title: "Property Tax Filing Deadline Extension",
    description:
      "The deadline for property tax filings has been extended to April 30, 2024. This extension applies to all residential and commercial properties within the county.",
    date: "2024-03-25",
    source: "County Tax Assessor",
    impact: "medium",
    properties: ["All Properties"],
    url: "https://example.com/tax-deadline-extension",
    category: "Taxes",
  },
  {
    id: "3",
    title: "Updated Accessibility Requirements",
    description:
      "New accessibility standards for common areas in residential buildings. These standards include updated requirements for ramps, doorways, and bathroom facilities in common areas.",
    date: "2024-03-15",
    source: "Department of Housing",
    impact: "medium",
    properties: ["Modern Luxury Apartment", "Downtown Penthouse", "Cozy Studio Loft"],
    url: "https://example.com/accessibility-requirements",
    category: "Accessibility",
  },
  {
    id: "4",
    title: "New Water Conservation Requirements",
    description:
      "New water conservation requirements for all residential properties. Includes mandatory installation of low-flow fixtures and restrictions on outdoor water usage during summer months.",
    date: "2024-03-10",
    source: "Water Resources Department",
    impact: "medium",
    properties: ["All Properties"],
    url: "https://example.com/water-conservation",
    category: "Environmental",
  },
  {
    id: "5",
    title: "Rental License Fee Increase",
    description:
      "Annual rental license fees will increase by 5% effective July 1, 2024. All property owners must renew licenses by the effective date to avoid penalties.",
    date: "2024-03-05",
    source: "City Housing Authority",
    impact: "low",
    properties: ["All Properties"],
    url: "https://example.com/license-fee-increase",
    category: "Licensing",
  },
  {
    id: "6",
    title: "Lead Paint Disclosure Requirements Update",
    description:
      "Updated requirements for lead paint disclosures in pre-1978 buildings. New forms must be used for all leases signed after May 1, 2024.",
    date: "2024-02-28",
    source: "Environmental Protection Agency",
    impact: "high",
    properties: ["Suburban Family Home", "Beachfront Villa"],
    url: "https://example.com/lead-paint-requirements",
    category: "Health & Safety",
  },
]

const RegulatoryUpdatesScreen = () => {
  const navigation = useNavigation()
  const [selectedCategory, setSelectedCategory] = useState("All")

  // Format date
  const formatDate = (dateString) => {
    const options = { year: "numeric", month: "short", day: "numeric" }
    return new Date(dateString).toLocaleDateString(undefined, options)
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

  // Get unique categories
  const categories = ["All", ...new Set(regulatoryUpdates.map((update) => update.category))]

  // Filter updates by category
  const filteredUpdates =
    selectedCategory === "All"
      ? regulatoryUpdates
      : regulatoryUpdates.filter((update) => update.category === selectedCategory)

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color={COLORS.darkGray} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Regulatory Updates</Text>
        <View style={{ width: 40 }} />
      </View>

      <View style={styles.categoriesContainer}>
        <FlatList
          data={categories}
          keyExtractor={(item) => item}
          horizontal
          showsHorizontalScrollIndicator={false}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={[styles.categoryButton, selectedCategory === item && styles.selectedCategoryButton]}
              onPress={() => setSelectedCategory(item)}
            >
              <Text style={[styles.categoryButtonText, selectedCategory === item && styles.selectedCategoryButtonText]}>
                {item}
              </Text>
            </TouchableOpacity>
          )}
          contentContainerStyle={styles.categoriesList}
        />
      </View>

      <FlatList
        data={filteredUpdates}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.updateCard}
            onPress={() => navigation.navigate("RegulatoryUpdateDetail" as never, { updateId: item.id })}
          >
            <View style={styles.updateHeader}>
              <Text style={styles.updateTitle}>{item.title}</Text>
              <View style={[styles.impactBadge, { backgroundColor: getImpactColor(item.impact) }]}>
                <Text style={styles.impactText}>{item.impact.toUpperCase()} IMPACT</Text>
              </View>
            </View>
            <Text style={styles.updateDescription} numberOfLines={2}>
              {item.description}
            </Text>
            <View style={styles.updateMeta}>
              <Text style={styles.updateCategory}>{item.category}</Text>
              <Text style={styles.updateDate}>{formatDate(item.date)}</Text>
            </View>
            <View style={styles.updateFooter}>
              <Text style={styles.updateSource}>{item.source}</Text>
              <Text style={styles.updatePropertiesCount}>
                Affects{" "}
                {item.properties.length === 1 && item.properties[0] === "All Properties"
                  ? "all properties"
                  : `${item.properties.length} properties`}
              </Text>
            </View>
          </TouchableOpacity>
        )}
        contentContainerStyle={styles.updatesList}
      />
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
  backButton: {
    padding: 4,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: COLORS.darkGray,
  },
  categoriesContainer: {
    backgroundColor: COLORS.white,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.lightGray,
  },
  categoriesList: {
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  categoryButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: COLORS.lightGray,
    marginRight: 8,
  },
  selectedCategoryButton: {
    backgroundColor: COLORS.primary,
  },
  categoryButtonText: {
    fontSize: 14,
    color: COLORS.darkGray,
  },
  selectedCategoryButtonText: {
    color: COLORS.white,
    fontWeight: "500",
  },
  updatesList: {
    padding: 16,
  },
  updateCard: {
    backgroundColor: COLORS.white,
    borderRadius: 8,
    padding: 16,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  updateHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 8,
  },
  updateTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: COLORS.darkGray,
    flex: 1,
    marginRight: 8,
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
    marginBottom: 12,
    lineHeight: 20,
  },
  updateMeta: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  updateCategory: {
    fontSize: 12,
    color: COLORS.primary,
    fontWeight: "500",
  },
  updateDate: {
    fontSize: 12,
    color: COLORS.gray,
  },
  updateFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  updateSource: {
    fontSize: 12,
    color: COLORS.darkGray,
  },
  updatePropertiesCount: {
    fontSize: 12,
    color: COLORS.gray,
  },
})

export default RegulatoryUpdatesScreen

