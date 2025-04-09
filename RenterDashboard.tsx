"use client"

import { useState } from "react"
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image } from "react-native"
import { MaterialIcons, Ionicons } from "@expo/vector-icons"
import { LinearGradient } from "expo-linear-gradient"
import HamburgerMenu from "../../components/HamburgerMenu"

const RenterDashboard = () => {
  const [activeTab, setActiveTab] = useState("bookings")

  const bookings = [
    {
      id: "1",
      propertyName: "Modern Luxury Apartment",
      status: "active",
      startDate: "2024-03-01",
      endDate: "2024-03-31",
      amount: 2500,
      image: "modern%20luxury%20apartment%20interior%20with%20city%20view",
    },
    {
      id: "2",
      propertyName: "Cozy Studio Loft",
      status: "upcoming",
      startDate: "2024-04-01",
      endDate: "2024-04-30",
      amount: 1800,
      image: "cozy%20modern%20studio%20loft%20apartment",
    },
  ]

  const favorites = [
    {
      id: "1",
      title: "Beachfront Villa",
      location: "Coastal District",
      price: 3500,
      image: "luxury%20beachfront%20villa%20with%20pool",
    },
    {
      id: "2",
      title: "Downtown Penthouse",
      location: "City Center",
      price: 4200,
      image: "modern%20penthouse%20apartment%20with%20skyline%20view",
    },
  ]
  const renderHeader = () => (
    <View style={styles.header}>
      <View style={styles.headerTop}>
        <HamburgerMenu />
        <Text style={styles.welcomeText}>Welcome back, Sarah!</Text>
        <TouchableOpacity style={styles.notificationButton}>
          <MaterialIcons name="notifications" size={24} color="#333" />
          <View style={styles.notificationBadge}>
            <Text style={styles.notificationCount}>2</Text>
          </View>
        </TouchableOpacity>
      </View>

      <View style={styles.statsContainer}>
        <View style={styles.statCard}>
          <Text style={styles.statNumber}>3</Text>
          <Text style={styles.statLabel}>Active Bookings</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statNumber}>8</Text>
          <Text style={styles.statLabel}>Saved Properties</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statNumber}>12</Text>
          <Text style={styles.statLabel}>Past Stays</Text>
        </View>
      </View>
    </View>
  )

  const renderTabs = () => (
    <View style={styles.tabContainer}>
      <TouchableOpacity
        style={[styles.tab, activeTab === "bookings" && styles.activeTab]}
        onPress={() => setActiveTab("bookings")}
      >
        <MaterialIcons name="book-online" size={24} color={activeTab === "bookings" ? "#2196F3" : "#666"} />
        <Text style={[styles.tabText, activeTab === "bookings" && styles.activeTabText]}>My Bookings</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={[styles.tab, activeTab === "favorites" && styles.activeTab]}
        onPress={() => setActiveTab("favorites")}
      >
        <MaterialIcons name="favorite" size={24} color={activeTab === "favorites" ? "#2196F3" : "#666"} />
        <Text style={[styles.tabText, activeTab === "favorites" && styles.activeTabText]}>Favorites</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={[styles.tab, activeTab === "history" && styles.activeTab]}
        onPress={() => setActiveTab("history")}
      >
        <MaterialIcons name="history" size={24} color={activeTab === "history" ? "#2196F3" : "#666"} />
        <Text style={[styles.tabText, activeTab === "history" && styles.activeTabText]}>History</Text>
      </TouchableOpacity>
    </View>
  )

  const BookingCard = ({ booking }) => (
    <View style={styles.bookingCard}>
      <Image
        source={{ uri: `https://api.a0.dev/assets/image?text=${booking.image}&aspect=16:9` }}
        style={styles.bookingImage}
      />
      <View style={styles.bookingContent}>
        <View style={styles.bookingHeader}>
          <Text style={styles.bookingTitle}>{booking.propertyName}</Text>
          <View style={[styles.statusBadge, { backgroundColor: booking.status === "active" ? "#4CAF50" : "#FFC107" }]}>
            <Text style={styles.statusText}>{booking.status}</Text>
          </View>
        </View>
        <View style={styles.bookingDetails}>
          <View style={styles.detailRow}>
            <MaterialIcons name="date-range" size={16} color="#666" />
            <Text style={styles.detailText}>
              {booking.startDate} - {booking.endDate}
            </Text>
          </View>
          <View style={styles.detailRow}>
            <MaterialIcons name="attach-money" size={16} color="#666" />
            <Text style={styles.detailText}>${booking.amount}/month</Text>
          </View>
        </View>
        <TouchableOpacity style={styles.viewDetailsButton}>
          <Text style={styles.viewDetailsText}>View Details</Text>
          <MaterialIcons name="arrow-forward" size={16} color="#2196F3" />
        </TouchableOpacity>
      </View>
    </View>
  )

  const FavoriteCard = ({ property }) => (
    <View style={styles.favoriteCard}>
      <Image
        source={{ uri: `https://api.a0.dev/assets/image?text=${property.image}&aspect=16:9` }}
        style={styles.favoriteImage}
      />
      <LinearGradient colors={["transparent", "rgba(0,0,0,0.8)"]} style={styles.favoriteGradient} />
      <View style={styles.favoriteContent}>
        <Text style={styles.favoriteTitle}>{property.title}</Text>
        <View style={styles.favoriteLocation}>
          <Ionicons name="location-sharp" size={14} color="white" />
          <Text style={styles.favoriteLocationText}>{property.location}</Text>
        </View>
        <Text style={styles.favoritePrice}>${property.price}/month</Text>
      </View>
      <TouchableOpacity style={styles.favoriteButton}>
        <MaterialIcons name="favorite" size={24} color="#ff4444" />
      </TouchableOpacity>
    </View>
  )

  return (
    <View style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {renderHeader()}
        {renderTabs()}

        <View style={styles.content}>
          {activeTab === "bookings" && (
            <>
              <Text style={styles.sectionTitle}>Current & Upcoming Bookings</Text>
              {bookings.map((booking) => (
                <BookingCard key={booking.id} booking={booking} />
              ))}
            </>
          )}

          {activeTab === "favorites" && (
            <>
              <Text style={styles.sectionTitle}>Saved Properties</Text>
              <View style={styles.favoriteGrid}>
                {favorites.map((property) => (
                  <FavoriteCard key={property.id} property={property} />
                ))}
              </View>
            </>
          )}

          {activeTab === "history" && (
            <Text style={styles.sectionTitle}>Booking History</Text>
            // Add booking history content here
          )}
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
    textAlign: "center",
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
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 16,
  },
  bookingCard: {
    backgroundColor: "white",
    borderRadius: 12,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
    overflow: "hidden",
  },
  bookingImage: {
    width: "100%",
    height: 150,
  },
  bookingContent: {
    padding: 16,
  },
  bookingHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  bookingTitle: {
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
  bookingDetails: {
    marginBottom: 12,
  },
  detailRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  detailText: {
    marginLeft: 8,
    color: "#666",
    fontSize: 14,
  },
  viewDetailsButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-end",
  },
  viewDetailsText: {
    color: "#2196F3",
    marginRight: 4,
    fontWeight: "600",
  },
  favoriteGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  favoriteCard: {
    width: "48%",
    backgroundColor: "white",
    borderRadius: 12,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
    overflow: "hidden",
  },
  favoriteImage: {
    width: "100%",
    height: 150,
  },
  favoriteGradient: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    height: "50%",
  },
  favoriteContent: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    padding: 12,
  },
  favoriteTitle: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 4,
  },
  favoriteLocation: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 4,
  },
  favoriteLocationText: {
    color: "white",
    marginLeft: 4,
    fontSize: 12,
  },
  favoritePrice: {
    color: "white",
    fontSize: 14,
    fontWeight: "600",
  },
  favoriteButton: {
    position: "absolute",
    top: 8,
    right: 8,
    backgroundColor: "rgba(255,255,255,0.9)",
    padding: 8,
    borderRadius: 20,
  },
})

export default RenterDashboard

