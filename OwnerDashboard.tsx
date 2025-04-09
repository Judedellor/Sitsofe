"use client"

import { useState } from "react"
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image } from "react-native"
import { MaterialIcons, Ionicons } from "@expo/vector-icons"
import { useNavigation } from "@react-navigation/native"
import HamburgerMenu from "../../components/HamburgerMenu"

const OwnerDashboard = () => {
  const navigation = useNavigation()
  const [activeTab, setActiveTab] = useState("properties")

  const properties = [
    {
      id: "1",
      title: "Modern Luxury Apartment",
      location: "Downtown Financial District",
      status: "active",
      views: 245,
      inquiries: 12,
      bookings: 3,
      image: "modern%20luxury%20apartment%20interior%20with%20large%20windows%20and%20city%20view",
    },
    {
      id: "2",
      title: "Cozy Studio Loft",
      location: "Arts District",
      status: "pending",
      views: 178,
      inquiries: 8,
      bookings: 1,
      image: "cozy%20modern%20studio%20loft%20with%20brick%20walls",
    },
  ]
  const renderHeader = () => (
    <View style={styles.header}>
      <View style={styles.headerTop}>
        <HamburgerMenu />
        <Text style={styles.welcomeText}>Welcome back, John!</Text>
        <TouchableOpacity style={styles.notificationButton}>
          <MaterialIcons name="notifications" size={24} color="#333" />
          <View style={styles.notificationBadge}>
            <Text style={styles.notificationCount}>3</Text>
          </View>
        </TouchableOpacity>
      </View>
      <View style={styles.statsContainer}>
        <View style={styles.statCard}>
          <Text style={styles.statNumber}>12</Text>
          <Text style={styles.statLabel}>Active Listings</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statNumber}>45</Text>
          <Text style={styles.statLabel}>Total Views</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statNumber}>8</Text>
          <Text style={styles.statLabel}>Bookings</Text>
        </View>
      </View>
    </View>
  )

  const renderTabs = () => (
    <View style={styles.tabContainer}>
      <TouchableOpacity
        style={[styles.tab, activeTab === "properties" && styles.activeTab]}
        onPress={() => setActiveTab("properties")}
      >
        <MaterialIcons name="apartment" size={24} color={activeTab === "properties" ? "#2196F3" : "#666"} />
        <Text style={[styles.tabText, activeTab === "properties" && styles.activeTabText]}>Properties</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={[styles.tab, activeTab === "bookings" && styles.activeTab]}
        onPress={() => setActiveTab("bookings")}
      >
        <MaterialIcons name="book-online" size={24} color={activeTab === "bookings" ? "#2196F3" : "#666"} />
        <Text style={[styles.tabText, activeTab === "bookings" && styles.activeTabText]}>Bookings</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={[styles.tab, activeTab === "analytics" && styles.activeTab]}
        onPress={() => setActiveTab("analytics")}
      >
        <MaterialIcons name="analytics" size={24} color={activeTab === "analytics" ? "#2196F3" : "#666"} />
        <Text style={[styles.tabText, activeTab === "analytics" && styles.activeTabText]}>Analytics</Text>
      </TouchableOpacity>
    </View>
  )

  const PropertyCard = ({ property }) => (
    <View style={styles.propertyCard}>
      <Image
        source={{ uri: `https://api.a0.dev/assets/image?text=${property.image}&aspect=16:9` }}
        style={styles.propertyImage}
      />
      <View style={styles.propertyContent}>
        <View style={styles.propertyHeader}>
          <Text style={styles.propertyTitle}>{property.title}</Text>
          <View style={[styles.statusBadge, { backgroundColor: property.status === "active" ? "#4CAF50" : "#FFC107" }]}>
            <Text style={styles.statusText}>{property.status}</Text>
          </View>
        </View>
        <View style={styles.locationContainer}>
          <Ionicons name="location-sharp" size={16} color="#666" />
          <Text style={styles.locationText}>{property.location}</Text>
        </View>
        <View style={styles.statsRow}>
          <View style={styles.stat}>
            <MaterialIcons name="visibility" size={16} color="#666" />
            <Text style={styles.statText}>{property.views} views</Text>
          </View>
          <View style={styles.stat}>
            <MaterialIcons name="message" size={16} color="#666" />
            <Text style={styles.statText}>{property.inquiries} inquiries</Text>
          </View>
          <View style={styles.stat}>
            <MaterialIcons name="book-online" size={16} color="#666" />
            <Text style={styles.statText}>{property.bookings} bookings</Text>
          </View>
        </View>
      </View>
    </View>
  )

  return (
    <View style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {renderHeader()}
        {renderTabs()}
        <View style={styles.content}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Your Properties</Text>{" "}
            <TouchableOpacity style={styles.addButton} onPress={() => navigation.navigate("AddProperty")}>
              <MaterialIcons name="add" size={24} color="#2196F3" />
              <Text style={styles.addButtonText}>Add Property</Text>
            </TouchableOpacity>
          </View>
          {properties.map((property) => (
            <PropertyCard key={property.id} property={property} />
          ))}
        </View>
      </ScrollView>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  header: {
    backgroundColor: "white",
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  headerTop: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  welcomeText: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#333",
  },
  notificationButton: {
    position: "relative",
    padding: 8,
  },
  notificationBadge: {
    position: "absolute",
    top: 4,
    right: 4,
    backgroundColor: "#ff4444",
    borderRadius: 10,
    width: 20,
    height: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  notificationCount: {
    color: "white",
    fontSize: 12,
    fontWeight: "bold",
  },
  statsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  statCard: {
    flex: 1,
    backgroundColor: "#f8f8f8",
    padding: 16,
    borderRadius: 12,
    marginHorizontal: 4,
    alignItems: "center",
  },
  statNumber: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#2196F3",
  },
  statLabel: {
    fontSize: 12,
    color: "#666",
    marginTop: 4,
  },
  tabContainer: {
    flexDirection: "row",
    backgroundColor: "white",
    padding: 8,
    marginTop: 16,
  },
  tab: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    padding: 12,
    borderRadius: 8,
  },
  activeTab: {
    backgroundColor: "#f0f7ff",
  },
  tabText: {
    marginLeft: 8,
    color: "#666",
    fontSize: 14,
  },
  activeTabText: {
    color: "#2196F3",
    fontWeight: "600",
  },
  content: {
    padding: 16,
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
  },
  addButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f0f7ff",
    padding: 8,
    borderRadius: 8,
  },
  addButtonText: {
    color: "#2196F3",
    marginLeft: 4,
    fontWeight: "600",
  },
  propertyCard: {
    backgroundColor: "white",
    borderRadius: 12,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  propertyImage: {
    width: "100%",
    height: 200,
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
  },
  propertyContent: {
    padding: 16,
  },
  propertyHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  propertyTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
    flex: 1,
    marginRight: 8,
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: {
    color: "white",
    fontSize: 12,
    fontWeight: "600",
    textTransform: "capitalize",
  },
  locationContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  locationText: {
    color: "#666",
    marginLeft: 4,
  },
  statsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  stat: {
    flexDirection: "row",
    alignItems: "center",
  },
  statText: {
    color: "#666",
    marginLeft: 4,
    fontSize: 12,
  },
})

export default OwnerDashboard

