"use client"

import { useState, useEffect } from "react"
import { View, Text, StyleSheet, ScrollView, Image, TouchableOpacity, ActivityIndicator, FlatList } from "react-native"
import { Ionicons } from "@expo/vector-icons"

// Mock data for property details
const PROPERTY_DETAILS = {
  id: "1",
  name: "Sunset Apartments",
  address: "123 Ocean Ave, Malibu, CA 90210",
  description:
    "Luxury apartment complex with ocean views, modern amenities, and prime location. Features include swimming pool, fitness center, and rooftop lounge area.",
  type: "Apartment Complex",
  yearBuilt: 2015,
  totalUnits: 24,
  occupiedUnits: 22,
  image: "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80",
  images: [
    "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80",
    "https://images.unsplash.com/photo-1515263487990-61b07816b324?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80",
    "https://images.unsplash.com/photo-1460317442991-0ec209397118?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80",
  ],
  status: "active",
  monthlyRevenue: "$32,400",
  expenses: "$12,800",
  netIncome: "$19,600",
  occupancyRate: "92%",
  maintenanceRequests: 3,
  amenities: ["Swimming Pool", "Fitness Center", "Covered Parking", "Rooftop Lounge", "24/7 Security"],
  units: [
    {
      id: "101",
      number: "A101",
      type: "1 Bedroom",
      status: "occupied",
      tenant: "John Smith",
      rent: "$1,250",
      leaseEnd: "2024-10-15",
    },
    {
      id: "102",
      number: "A102",
      type: "1 Bedroom",
      status: "occupied",
      tenant: "Sarah Johnson",
      rent: "$1,250",
      leaseEnd: "2024-11-30",
    },
    { id: "103", number: "A103", type: "1 Bedroom", status: "vacant", tenant: null, rent: "$1,250", leaseEnd: null },
    {
      id: "104",
      number: "A104",
      type: "2 Bedroom",
      status: "occupied",
      tenant: "Michael Brown",
      rent: "$1,800",
      leaseEnd: "2025-01-15",
    },
    {
      id: "105",
      number: "A105",
      type: "2 Bedroom",
      status: "occupied",
      tenant: "Emily Davis",
      rent: "$1,800",
      leaseEnd: "2024-12-20",
    },
    {
      id: "106",
      number: "A106",
      type: "2 Bedroom",
      status: "maintenance",
      tenant: null,
      rent: "$1,800",
      leaseEnd: null,
    },
    {
      id: "201",
      number: "B101",
      type: "1 Bedroom",
      status: "occupied",
      tenant: "Thomas Wilson",
      rent: "$1,300",
      leaseEnd: "2024-09-30",
    },
    {
      id: "202",
      number: "B102",
      type: "1 Bedroom",
      status: "occupied",
      tenant: "Jennifer Taylor",
      rent: "$1,300",
      leaseEnd: "2024-08-15",
    },
  ],
}

const PropertyDetailsScreen = ({ route, navigation }) => {
  const [loading, setLoading] = useState(true)
  const [property, setProperty] = useState(null)
  const [activeTab, setActiveTab] = useState("overview")
  const [selectedUnitFilter, setSelectedUnitFilter] = useState("all")

  // In a real app, we would get the propertyId from route.params
  // const { propertyId } = route.params;
  const propertyId = "1" // Mock for now

  useEffect(() => {
    // Simulate API call to fetch property details
    const fetchPropertyDetails = () => {
      return new Promise((resolve) => {
        setTimeout(() => {
          resolve(PROPERTY_DETAILS)
        }, 1500)
      })
    }

    fetchPropertyDetails().then((data) => {
      setProperty(data)
      setLoading(false)
    })
  }, [propertyId])

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#2196F3" />
        <Text style={styles.loadingText}>Loading property details...</Text>
      </View>
    )
  }

  const filteredUnits = property.units.filter((unit) => {
    if (selectedUnitFilter === "all") return true
    return unit.status === selectedUnitFilter
  })

  const renderOverviewTab = () => (
    <View style={styles.tabContent}>
      <View style={styles.descriptionSection}>
        <Text style={styles.sectionTitle}>Description</Text>
        <Text style={styles.descriptionText}>{property.description}</Text>
      </View>

      <View style={styles.statsGrid}>
        <View style={styles.statsItem}>
          <Text style={styles.statsValue}>{property.totalUnits}</Text>
          <Text style={styles.statsLabel}>Total Units</Text>
        </View>
        <View style={styles.statsItem}>
          <Text style={styles.statsValue}>{property.occupancyRate}</Text>
          <Text style={styles.statsLabel}>Occupancy</Text>
        </View>
        <View style={styles.statsItem}>
          <Text style={styles.statsValue}>{property.yearBuilt}</Text>
          <Text style={styles.statsLabel}>Year Built</Text>
        </View>
        <View style={styles.statsItem}>
          <Text style={styles.statsValue}>{property.maintenanceRequests}</Text>
          <Text style={styles.statsLabel}>Pending Requests</Text>
        </View>
      </View>

      <View style={styles.financialSection}>
        <Text style={styles.sectionTitle}>Financial Summary</Text>
        <View style={styles.financialItem}>
          <Text style={styles.financialLabel}>Monthly Revenue</Text>
          <Text style={styles.financialValue}>{property.monthlyRevenue}</Text>
        </View>
        <View style={styles.financialItem}>
          <Text style={styles.financialLabel}>Monthly Expenses</Text>
          <Text style={styles.financialValue}>{property.expenses}</Text>
        </View>
        <View style={[styles.financialItem, styles.financialTotal]}>
          <Text style={styles.financialTotalLabel}>Net Income</Text>
          <Text style={styles.financialTotalValue}>{property.netIncome}</Text>
        </View>
      </View>

      <View style={styles.amenitiesSection}>
        <Text style={styles.sectionTitle}>Amenities</Text>
        <View style={styles.amenitiesList}>
          {property.amenities.map((amenity, index) => (
            <View key={index} style={styles.amenityItem}>
              <Ionicons name="checkmark-circle" size={20} color="#4CAF50" />
              <Text style={styles.amenityText}>{amenity}</Text>
            </View>
          ))}
        </View>
      </View>
    </View>
  )

  const renderUnitsTab = () => (
    <View style={styles.tabContent}>
      <View style={styles.unitFilters}>
        <TouchableOpacity
          style={[styles.filterChip, selectedUnitFilter === "all" && styles.filterChipSelected]}
          onPress={() => setSelectedUnitFilter("all")}
        >
          <Text style={[styles.filterChipText, selectedUnitFilter === "all" && styles.filterChipTextSelected]}>
            All ({property.units.length})
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.filterChip, selectedUnitFilter === "occupied" && styles.filterChipSelected]}
          onPress={() => setSelectedUnitFilter("occupied")}
        >
          <Text style={[styles.filterChipText, selectedUnitFilter === "occupied" && styles.filterChipTextSelected]}>
            Occupied
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.filterChip, selectedUnitFilter === "vacant" && styles.filterChipSelected]}
          onPress={() => setSelectedUnitFilter("vacant")}
        >
          <Text style={[styles.filterChipText, selectedUnitFilter === "vacant" && styles.filterChipTextSelected]}>
            Vacant
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.filterChip, selectedUnitFilter === "maintenance" && styles.filterChipSelected]}
          onPress={() => setSelectedUnitFilter("maintenance")}
        >
          <Text style={[styles.filterChipText, selectedUnitFilter === "maintenance" && styles.filterChipTextSelected]}>
            Maintenance
          </Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={filteredUnits}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.unitCard}>
            <View style={styles.unitHeader}>
              <View style={styles.unitInfo}>
                <Text style={styles.unitNumber}>{item.number}</Text>
                <Text style={styles.unitType}>{item.type}</Text>
              </View>
              <View style={[styles.unitStatus, getUnitStatusStyle(item.status)]}>
                <Text style={styles.unitStatusText}>{capitalizeFirstLetter(item.status)}</Text>
              </View>
            </View>

            <View style={styles.unitDetails}>
              {item.tenant ? (
                <View style={styles.tenantInfo}>
                  <Ionicons name="person" size={16} color="#666" />
                  <Text style={styles.tenantName}>{item.tenant}</Text>
                </View>
              ) : (
                <View style={styles.tenantInfo}>
                  <Ionicons name="person-outline" size={16} color="#999" />
                  <Text style={styles.noTenantText}>No tenant</Text>
                </View>
              )}

              <View style={styles.unitMeta}>
                <View style={styles.unitMetaItem}>
                  <Ionicons name="cash-outline" size={16} color="#666" />
                  <Text style={styles.unitMetaText}>{item.rent}/month</Text>
                </View>

                {item.leaseEnd && (
                  <View style={styles.unitMetaItem}>
                    <Ionicons name="calendar-outline" size={16} color="#666" />
                    <Text style={styles.unitMetaText}>Until {formatDate(item.leaseEnd)}</Text>
                  </View>
                )}
              </View>
            </View>

            <View style={styles.unitActions}>
              <TouchableOpacity style={styles.unitAction}>
                <Ionicons name="eye-outline" size={20} color="#2196F3" />
                <Text style={styles.unitActionText}>Details</Text>
              </TouchableOpacity>

              {item.status === "occupied" && (
                <TouchableOpacity style={styles.unitAction}>
                  <Ionicons name="document-text-outline" size={20} color="#FF9800" />
                  <Text style={styles.unitActionText}>Lease</Text>
                </TouchableOpacity>
              )}

              {item.status === "vacant" && (
                <TouchableOpacity style={styles.unitAction}>
                  <Ionicons name="add-circle-outline" size={20} color="#4CAF50" />
                  <Text style={styles.unitActionText}>Add Tenant</Text>
                </TouchableOpacity>
              )}

              {item.status === "maintenance" && (
                <TouchableOpacity style={styles.unitAction}>
                  <Ionicons name="construct-outline" size={20} color="#F44336" />
                  <Text style={styles.unitActionText}>Maintenance</Text>
                </TouchableOpacity>
              )}
            </View>
          </View>
        )}
        contentContainerStyle={styles.unitsList}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Ionicons name="home-outline" size={60} color="#ccc" />
            <Text style={styles.emptyText}>No units match the filter</Text>
          </View>
        }
      />
    </View>
  )

  // Helper functions
  const getUnitStatusStyle = (status) => {
    switch (status) {
      case "occupied":
        return { backgroundColor: "#4CAF5020", borderColor: "#4CAF50" }
      case "vacant":
        return { backgroundColor: "#2196F320", borderColor: "#2196F3" }
      case "maintenance":
        return { backgroundColor: "#F4433620", borderColor: "#F44336" }
      default:
        return { backgroundColor: "#75757520", borderColor: "#757575" }
    }
  }

  const capitalizeFirstLetter = (string) => {
    return string.charAt(0).toUpperCase() + string.slice(1)
  }

  const formatDate = (dateString) => {
    const date = new Date(dateString)
    return date.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })
  }

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContainer} showsVerticalScrollIndicator={false}>
        <View style={styles.imageGallery}>
          <Image source={{ uri: property.image }} style={styles.headerImage} resizeMode="cover" />
          <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
            <Ionicons name="arrow-back" size={24} color="white" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.galleryButton}>
            <Ionicons name="images-outline" size={20} color="white" />
            <Text style={styles.galleryButtonText}>{property.images.length} Photos</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.header}>
          <View style={styles.headerContent}>
            <Text style={styles.propertyName}>{property.name}</Text>
            <Text style={styles.propertyAddress}>{property.address}</Text>
          </View>
          <TouchableOpacity style={styles.editButton}>
            <Ionicons name="create-outline" size={20} color="#2196F3" />
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
            style={[styles.tab, activeTab === "units" && styles.activeTab]}
            onPress={() => setActiveTab("units")}
          >
            <Text style={[styles.tabText, activeTab === "units" && styles.activeTabText]}>Units</Text>
          </TouchableOpacity>
        </View>

        {activeTab === "overview" ? renderOverviewTab() : renderUnitsTab()}
      </ScrollView>

      <View style={styles.bottomBar}>
        <TouchableOpacity style={styles.actionButton}>
          <Ionicons name="construct" size={20} color="white" />
          <Text style={styles.actionButtonText}>Maintenance</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.actionButton}>
          <Ionicons name="stats-chart" size={20} color="white" />
          <Text style={styles.actionButtonText}>Reports</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.actionButton, styles.primaryButton]}>
          <Ionicons name="add-circle" size={20} color="white" />
          <Text style={styles.actionButtonText}>Add Unit</Text>
        </TouchableOpacity>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  scrollContainer: {
    paddingBottom: 80,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: "#666",
  },
  imageGallery: {
    position: "relative",
    height: 250,
  },
  headerImage: {
    width: "100%",
    height: "100%",
  },
  backButton: {
    position: "absolute",
    top: 50,
    left: 16,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "rgba(0,0,0,0.3)",
    justifyContent: "center",
    alignItems: "center",
  },
  galleryButton: {
    position: "absolute",
    bottom: 16,
    right: 16,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.3)",
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 20,
  },
  galleryButtonText: {
    color: "white",
    marginLeft: 4,
    fontWeight: "500",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 16,
    backgroundColor: "white",
  },
  headerContent: {
    flex: 1,
  },
  propertyName: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 4,
  },
  propertyAddress: {
    fontSize: 14,
    color: "#666",
  },
  editButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#f0f0f0",
    justifyContent: "center",
    alignItems: "center",
  },
  tabsContainer: {
    flexDirection: "row",
    backgroundColor: "white",
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  tab: {
    flex: 1,
    paddingVertical: 16,
    alignItems: "center",
  },
  activeTab: {
    borderBottomWidth: 2,
    borderBottomColor: "#2196F3",
  },
  tabText: {
    fontSize: 16,
    fontWeight: "500",
    color: "#999",
  },
  activeTabText: {
    color: "#2196F3",
  },
  tabContent: {
    padding: 16,
  },
  descriptionSection: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#333",
    marginBottom: 12,
  },
  descriptionText: {
    fontSize: 14,
    lineHeight: 22,
    color: "#666",
  },
  statsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginBottom: 20,
  },
  statsItem: {
    width: "50%",
    padding: 12,
    borderWidth: 1,
    borderColor: "#f0f0f0",
    backgroundColor: "white",
  },
  statsValue: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 4,
  },
  statsLabel: {
    fontSize: 12,
    color: "#999",
  },
  financialSection: {
    backgroundColor: "white",
    borderRadius: 8,
    padding: 16,
    marginBottom: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 1,
  },
  financialItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  financialLabel: {
    fontSize: 14,
    color: "#666",
  },
  financialValue: {
    fontSize: 14,
    fontWeight: "600",
    color: "#333",
  },
  financialTotal: {
    borderBottomWidth: 0,
    marginTop: 4,
  },
  financialTotalLabel: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
  },
  financialTotalValue: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#4CAF50",
  },
  amenitiesSection: {
    marginBottom: 20,
  },
  amenitiesList: {
    backgroundColor: "white",
    borderRadius: 8,
    padding: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 1,
  },
  amenityItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  amenityText: {
    marginLeft: 8,
    fontSize: 14,
    color: "#666",
  },
  unitFilters: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginBottom: 16,
  },
  filterChip: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: "#f0f0f0",
    borderRadius: 16,
    marginRight: 8,
    marginBottom: 8,
  },
  filterChipSelected: {
    backgroundColor: "#2196F3",
  },
  filterChipText: {
    fontSize: 14,
    color: "#666",
  },
  filterChipTextSelected: {
    color: "white",
    fontWeight: "500",
  },
  unitsList: {
    paddingBottom: 16,
  },
  unitCard: {
    backgroundColor: "white",
    borderRadius: 8,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 1,
    overflow: "hidden",
  },
  unitHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  unitInfo: {
    flex: 1,
  },
  unitNumber: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 2,
  },
  unitType: {
    fontSize: 12,
    color: "#999",
  },
  unitStatus: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 4,
    borderWidth: 1,
  },
  unitStatusText: {
    fontSize: 12,
    fontWeight: "600",
  },
  unitDetails: {
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  tenantInfo: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  tenantName: {
    fontSize: 14,
    color: "#333",
    marginLeft: 8,
  },
  noTenantText: {
    fontSize: 14,
    color: "#999",
    marginLeft: 8,
    fontStyle: "italic",
  },
  unitMeta: {
    flexDirection: "row",
    flexWrap: "wrap",
  },
  unitMetaItem: {
    flexDirection: "row",
    alignItems: "center",
    marginRight: 16,
    marginBottom: 4,
  },
  unitMetaText: {
    fontSize: 13,
    color: "#666",
    marginLeft: 4,
  },
  unitActions: {
    flexDirection: "row",
    padding: 12,
  },
  unitAction: {
    flexDirection: "row",
    alignItems: "center",
    marginRight: 16,
  },
  unitActionText: {
    fontSize: 13,
    color: "#333",
    marginLeft: 4,
  },
  emptyContainer: {
    padding: 24,
    alignItems: "center",
    justifyContent: "center",
  },
  emptyText: {
    fontSize: 16,
    color: "#999",
    marginTop: 12,
    textAlign: "center",
  },
  bottomBar: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    height: 64,
    backgroundColor: "white",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -3 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 5,
  },
  actionButton: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#757575",
    paddingVertical: 10,
    borderRadius: 4,
    marginHorizontal: 4,
  },
  primaryButton: {
    backgroundColor: "#2196F3",
  },
  actionButtonText: {
    color: "white",
    fontWeight: "600",
    marginLeft: 4,
  },
})

export default PropertyDetailsScreen

