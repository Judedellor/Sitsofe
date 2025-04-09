"use client"

import { useState, useEffect } from "react"
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  Alert,
  ActivityIndicator,
  ScrollView,
  Platform,
} from "react-native"
import { SafeAreaView } from "react-native-safe-area-context"
import { COLORS } from "./constants/colors"
import { Ionicons } from "@expo/vector-icons"
import { useNavigation, useRoute } from "@react-navigation/native"
import MapView, { Marker, PROVIDER_GOOGLE } from "react-native-maps"

const { width, height } = Dimensions.get("window")

// Mock property data
const mockProperty = {
  id: "property-1",
  name: "Sunset Villa",
  address: "123 Ocean Drive, Malibu, CA 90210",
  latitude: 34.0259,
  longitude: -118.7798,
  rentAmount: 5500,
}

// Mock nearby places
const mockNearbyPlaces = [
  {
    id: "place-1",
    name: "Malibu Pier",
    type: "attraction",
    latitude: 34.0384,
    longitude: -118.674,
    distance: "2.3 miles",
  },
  {
    id: "place-2",
    name: "Nobu Malibu",
    type: "restaurant",
    latitude: 34.0365,
    longitude: -118.6771,
    distance: "2.1 miles",
  },
  {
    id: "place-3",
    name: "Malibu Country Mart",
    type: "shopping",
    latitude: 34.0333,
    longitude: -118.6868,
    distance: "1.8 miles",
  },
  {
    id: "place-4",
    name: "Zuma Beach",
    type: "beach",
    latitude: 34.0218,
    longitude: -118.8253,
    distance: "3.5 miles",
  },
]

const PropertyMapScreen = () => {
  const navigation = useNavigation()
  const route = useRoute()
  const { propertyId } = route.params || { propertyId: "property-1" }

  // In a real app, you would fetch property data based on propertyId
  const property = mockProperty

  const [isLoading, setIsLoading] = useState(true)
  const [selectedFilter, setSelectedFilter] = useState("all")
  const [showNearbyPlaces, setShowNearbyPlaces] = useState(true)

  // Simulate loading
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false)
    }, 1000)

    return () => clearTimeout(timer)
  }, [])

  // Filter options
  const filterOptions = [
    { id: "all", label: "All" },
    { id: "restaurant", label: "Restaurants" },
    { id: "shopping", label: "Shopping" },
    { id: "attraction", label: "Attractions" },
    { id: "beach", label: "Beaches" },
  ]

  // Filtered places
  const filteredPlaces =
    selectedFilter === "all" ? mockNearbyPlaces : mockNearbyPlaces.filter((place) => place.type === selectedFilter)

  // Get marker color based on place type
  const getMarkerColor = (type) => {
    switch (type) {
      case "restaurant":
        return "#FF5722"
      case "shopping":
        return "#9C27B0"
      case "attraction":
        return "#2196F3"
      case "beach":
        return "#00BCD4"
      default:
        return COLORS.primary
    }
  }

  // Handle get directions
  const handleGetDirections = () => {
    Alert.alert("Get Directions", "This would open the maps app with directions to the property", [
      {
        text: "Cancel",
        style: "cancel",
      },
      {
        text: "Open Maps",
        onPress: () => {
          // Would open maps app in a real app
          Alert.alert("Maps", "This would open the maps app in a real app")
        },
      },
    ])
  }

  if (isLoading) {
    return (
      <SafeAreaView style={styles.loadingContainer} edges={["top"]}>
        <ActivityIndicator size="large" color={COLORS.primary} />
        <Text style={styles.loadingText}>Loading map...</Text>
      </SafeAreaView>
    )
  }

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color={COLORS.darkGray} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{property.name} Location</Text>
      </View>

      <View style={styles.mapContainer}>
        <MapView
          provider={PROVIDER_GOOGLE}
          style={styles.map}
          initialRegion={{
            latitude: property.latitude,
            longitude: property.longitude,
            latitudeDelta: 0.05,
            longitudeDelta: 0.05,
          }}
        >
          {/* Property Marker */}
          <Marker
            coordinate={{
              latitude: property.latitude,
              longitude: property.longitude,
            }}
            title={property.name}
            description={property.address}
            pinColor={COLORS.primary}
          />

          {/* Nearby Places Markers */}
          {showNearbyPlaces &&
            filteredPlaces.map((place) => (
              <Marker
                key={place.id}
                coordinate={{
                  latitude: place.latitude,
                  longitude: place.longitude,
                }}
                title={place.name}
                description={`${place.distance} away - ${place.type}`}
                pinColor={getMarkerColor(place.type)}
              />
            ))}
        </MapView>

        <View style={styles.mapOverlay}>
          <View style={styles.propertyInfoCard}>
            <Text style={styles.propertyName}>{property.name}</Text>
            <Text style={styles.propertyAddress}>{property.address}</Text>
            <Text style={styles.propertyPrice}>${property.rentAmount}/month</Text>

            <TouchableOpacity style={styles.directionsButton} onPress={handleGetDirections}>
              <Ionicons name="navigate" size={18} color={COLORS.white} />
              <Text style={styles.directionsButtonText}>Get Directions</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.filterContainer}>
            <TouchableOpacity style={styles.toggleButton} onPress={() => setShowNearbyPlaces(!showNearbyPlaces)}>
              <Ionicons name={showNearbyPlaces ? "eye" : "eye-off"} size={20} color={COLORS.darkGray} />
              <Text style={styles.toggleButtonText}>{showNearbyPlaces ? "Hide Nearby" : "Show Nearby"}</Text>
            </TouchableOpacity>

            {showNearbyPlaces && (
              <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.filterScroll}>
                {filterOptions.map((option) => (
                  <TouchableOpacity
                    key={option.id}
                    style={[styles.filterOption, selectedFilter === option.id && styles.filterOptionActive]}
                    onPress={() => setSelectedFilter(option.id)}
                  >
                    <Text
                      style={[styles.filterOptionText, selectedFilter === option.id && styles.filterOptionTextActive]}
                    >
                      {option.label}
                    </Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            )}
          </View>
        </View>
      </View>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.white,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: COLORS.white,
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: COLORS.gray,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.lightGray,
  },
  backButton: {
    marginRight: 16,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: COLORS.darkGray,
  },
  mapContainer: {
    flex: 1,
    position: "relative",
  },
  map: {
    width: "100%",
    height: "100%",
  },
  mapOverlay: {
    position: "absolute",
    bottom: 16,
    left: 16,
    right: 16,
  },
  propertyInfoCard: {
    backgroundColor: COLORS.white,
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
      },
      android: {
        elevation: 3,
      },
    }),
  },
  propertyName: {
    fontSize: 18,
    fontWeight: "bold",
    color: COLORS.darkGray,
    marginBottom: 4,
  },
  propertyAddress: {
    fontSize: 14,
    color: COLORS.gray,
    marginBottom: 8,
  },
  propertyPrice: {
    fontSize: 16,
    fontWeight: "bold",
    color: COLORS.primary,
    marginBottom: 12,
  },
  directionsButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: COLORS.primary,
    borderRadius: 4,
    paddingVertical: 8,
    paddingHorizontal: 12,
  },
  directionsButtonText: {
    color: COLORS.white,
    fontSize: 14,
    fontWeight: "500",
    marginLeft: 8,
  },
  filterContainer: {
    backgroundColor: COLORS.white,
    borderRadius: 8,
    padding: 12,
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
      },
      android: {
        elevation: 3,
      },
    }),
  },
  toggleButton: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: showNearbyPlaces ? 12 : 0,
  },
  toggleButtonText: {
    fontSize: 14,
    color: COLORS.darkGray,
    marginLeft: 8,
  },
  filterScroll: {
    paddingVertical: 4,
  },
  filterOption: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    backgroundColor: COLORS.background,
    marginRight: 8,
  },
  filterOptionActive: {
    backgroundColor: COLORS.primary,
  },
  filterOptionText: {
    fontSize: 14,
    color: COLORS.darkGray,
  },
  filterOptionTextActive: {
    color: COLORS.white,
  },
})

export default PropertyMapScreen

