"use client"

import { useState, useRef } from "react"
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  Dimensions,
  FlatList,
  Animated,
  Alert,
} from "react-native"
import { SafeAreaView } from "react-native-safe-area-context"
import { COLORS } from "./constants/colors"
import { Ionicons, MaterialIcons } from "@expo/vector-icons"
import { useNavigation, useRoute } from "@react-navigation/native"
import Button from "./components/ui/Button"

const { width } = Dimensions.get("window")

// Mock property data
const mockProperty = {
  id: "property-1",
  name: "Sunset Villa",
  address: "123 Ocean Drive",
  city: "Malibu",
  state: "CA",
  zipCode: "90210",
  type: "Single Family Home",
  bedrooms: 4,
  bathrooms: 3,
  squareFeet: 2800,
  yearBuilt: 2015,
  description:
    "Beautiful beachfront property with stunning ocean views. This spacious home features an open floor plan, gourmet kitchen, and a large deck perfect for entertaining. Walking distance to shops and restaurants.",
  rentAmount: 5500,
  depositAmount: 8000,
  isAvailable: true,
  status: "Occupied",
  images: [
    "https://api.a0.dev/assets/image?text=Sunset%20Villa%20Exterior&width=800&height=600",
    "https://api.a0.dev/assets/image?text=Sunset%20Villa%20Living%20Room&width=800&height=600",
    "https://api.a0.dev/assets/image?text=Sunset%20Villa%20Kitchen&width=800&height=600",
    "https://api.a0.dev/assets/image?text=Sunset%20Villa%20Master%20Bedroom&width=800&height=600",
    "https://api.a0.dev/assets/image?text=Sunset%20Villa%20Bathroom&width=800&height=600",
  ],
  features: [
    "Central Air Conditioning",
    "In-unit Washer/Dryer",
    "Hardwood Floors",
    "Stainless Steel Appliances",
    "Granite Countertops",
    "Walk-in Closets",
    "Fireplace",
    "Deck/Patio",
    "Garage Parking",
    "Swimming Pool",
  ],
  tenant: {
    id: "tenant-1",
    name: "John Doe",
    email: "john.doe@example.com",
    phone: "555-123-4567",
    leaseStart: "2023-01-01",
    leaseEnd: "2024-01-01",
  },
}

const PropertyDetailsScreen = () => {
  const navigation = useNavigation()
  const route = useRoute()
  const { propertyId } = route.params || { propertyId: "property-1" }

  // In a real app, you would fetch property data based on propertyId
  const property = mockProperty

  const [activeImageIndex, setActiveImageIndex] = useState(0)
  const scrollX = useRef(new Animated.Value(0)).current
  const [showFullDescription, setShowFullDescription] = useState(false)

  // Handle edit property
  const handleEditProperty = () => {
    // Navigate to edit property screen
    Alert.alert("Edit Property", "This would navigate to the edit property screen")
  }

  // Handle delete property
  const handleDeleteProperty = () => {
    Alert.alert("Delete Property", "Are you sure you want to delete this property? This action cannot be undone.", [
      {
        text: "Cancel",
        style: "cancel",
      },
      {
        text: "Delete",
        style: "destructive",
        onPress: () => {
          // Would delete property in a real app
          Alert.alert("Success", "Property deleted successfully")
          navigation.goBack()
        },
      },
    ])
  }

  // Handle view tenant
  const handleViewTenant = () => {
    if (property.tenant) {
      navigation.navigate("TenantDetail", { tenantId: property.tenant.id } as never)
    }
  }

  // Handle add tenant
  const handleAddTenant = () => {
    navigation.navigate("AddTenant", { propertyId: property.id } as never)
  }

  // Handle view on map
  const handleViewOnMap = () => {
    navigation.navigate("PropertyMap", { propertyId: property.id } as never)
  }

  // Handle view analytics
  const handleViewAnalytics = () => {
    navigation.navigate("PropertyAnalytics", { propertyId: property.id } as never)
  }

  // Handle virtual tour
  const handleVirtualTour = () => {
    navigation.navigate("VirtualTour", { propertyId: property.id } as never)
  }

  // Render image item
  const renderImageItem = ({ item, index }) => (
    <TouchableOpacity style={styles.imageItem} onPress={() => setActiveImageIndex(index)}>
      <Image source={{ uri: item }} style={styles.image} />
    </TouchableOpacity>
  )

  // Render feature item
  const renderFeatureItem = ({ item }) => (
    <View style={styles.featureItem}>
      <Ionicons name="checkmark-circle" size={20} color={COLORS.primary} style={styles.featureIcon} />
      <Text style={styles.featureText}>{item}</Text>
    </View>
  )

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color={COLORS.darkGray} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{property.name}</Text>
        <TouchableOpacity
          style={styles.moreButton}
          onPress={() => {
            Alert.alert("Property Options", "Choose an action", [
              {
                text: "Edit Property",
                onPress: handleEditProperty,
              },
              {
                text: "Delete Property",
                onPress: handleDeleteProperty,
                style: "destructive",
              },
              {
                text: "Cancel",
                style: "cancel",
              },
            ])
          }}
        >
          <Ionicons name="ellipsis-vertical" size={24} color={COLORS.darkGray} />
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content}>
        {/* Property Images */}
        <View style={styles.imageContainer}>
          <Animated.FlatList
            data={property.images}
            keyExtractor={(_, index) => index.toString()}
            renderItem={({ item }) => (
              <View style={styles.imageSlide}>
                <Image source={{ uri: item }} style={styles.mainImage} />
              </View>
            )}
            horizontal
            pagingEnabled
            showsHorizontalScrollIndicator={false}
            onScroll={Animated.event([{ nativeEvent: { contentOffset: { x: scrollX } } }], { useNativeDriver: false })}
            onMomentumScrollEnd={(event) => {
              const index = Math.round(event.nativeEvent.contentOffset.x / width)
              setActiveImageIndex(index)
            }}
          />

          <View style={styles.pagination}>
            {property.images.map((_, index) => (
              <View
                key={index}
                style={[styles.paginationDot, index === activeImageIndex && styles.paginationDotActive]}
              />
            ))}
          </View>

          <View style={styles.imageActions}>
            <TouchableOpacity style={styles.imageActionButton} onPress={handleVirtualTour}>
              <Ionicons name="cube" size={20} color={COLORS.white} />
              <Text style={styles.imageActionText}>3D Tour</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.imageActionButton} onPress={handleViewOnMap}>
              <Ionicons name="location" size={20} color={COLORS.white} />
              <Text style={styles.imageActionText}>Map</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Property Thumbnails */}
        <View style={styles.thumbnailsContainer}>
          <FlatList
            data={property.images}
            keyExtractor={(_, index) => `thumb-${index}`}
            renderItem={renderImageItem}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.thumbnailsList}
          />
        </View>

        {/* Property Info */}
        <View style={styles.infoContainer}>
          <View style={styles.titleContainer}>
            <Text style={styles.propertyName}>{property.name}</Text>
            <View
              style={[styles.statusBadge, { backgroundColor: property.isAvailable ? COLORS.success : COLORS.warning }]}
            >
              <Text style={styles.statusText}>{property.status}</Text>
            </View>
          </View>

          <Text style={styles.address}>
            {property.address}, {property.city}, {property.state} {property.zipCode}
          </Text>

          <View style={styles.priceContainer}>
            <Text style={styles.price}>${property.rentAmount}</Text>
            <Text style={styles.priceLabel}>/month</Text>
          </View>

          <View style={styles.specsContainer}>
            <View style={styles.specItem}>
              <MaterialIcons name="king-bed" size={24} color={COLORS.primary} />
              <Text style={styles.specValue}>{property.bedrooms}</Text>
              <Text style={styles.specLabel}>Beds</Text>
            </View>

            <View style={styles.specItem}>
              <MaterialIcons name="bathroom" size={24} color={COLORS.primary} />
              <Text style={styles.specValue}>{property.bathrooms}</Text>
              <Text style={styles.specLabel}>Baths</Text>
            </View>

            <View style={styles.specItem}>
              <MaterialIcons name="square-foot" size={24} color={COLORS.primary} />
              <Text style={styles.specValue}>{property.squareFeet}</Text>
              <Text style={styles.specLabel}>Sq Ft</Text>
            </View>

            <View style={styles.specItem}>
              <Ionicons name="calendar" size={24} color={COLORS.primary} />
              <Text style={styles.specValue}>{property.yearBuilt}</Text>
              <Text style={styles.specLabel}>Year</Text>
            </View>
          </View>
        </View>

        {/* Description */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Description</Text>
          <Text style={styles.description} numberOfLines={showFullDescription ? undefined : 3}>
            {property.description}
          </Text>
          {property.description.length > 120 && (
            <TouchableOpacity
              onPress={() => setShowFullDescription(!showFullDescription)}
              style={styles.readMoreButton}
            >
              <Text style={styles.readMoreText}>{showFullDescription ? "Read Less" : "Read More"}</Text>
            </TouchableOpacity>
          )}
        </View>

        {/* Features */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Features</Text>
          <FlatList
            data={property.features}
            keyExtractor={(item) => item}
            renderItem={renderFeatureItem}
            scrollEnabled={false}
            numColumns={2}
          />
        </View>

        {/* Tenant Information */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Tenant Information</Text>

          {property.tenant ? (
            <View style={styles.tenantContainer}>
              <View style={styles.tenantInfo}>
                <Text style={styles.tenantName}>{property.tenant.name}</Text>
                <Text style={styles.tenantDetail}>{property.tenant.email}</Text>
                <Text style={styles.tenantDetail}>{property.tenant.phone}</Text>
                <View style={styles.leaseInfo}>
                  <Text style={styles.leaseLabel}>Lease: </Text>
                  <Text style={styles.leaseDate}>
                    {new Date(property.tenant.leaseStart).toLocaleDateString()} -{" "}
                    {new Date(property.tenant.leaseEnd).toLocaleDateString()}
                  </Text>
                </View>
              </View>

              <Button title="View Tenant" onPress={handleViewTenant} type="outline" size="small" />
            </View>
          ) : (
            <View style={styles.noTenantContainer}>
              <Text style={styles.noTenantText}>No tenant assigned to this property</Text>
              <Button
                title="Add Tenant"
                onPress={handleAddTenant}
                type="outline"
                size="small"
                icon={<Ionicons name="person-add" size={18} color={COLORS.primary} style={styles.buttonIcon} />}
              />
            </View>
          )}
        </View>

        {/* Actions */}
        <View style={styles.actionsContainer}>
          <Button
            title="View Analytics"
            onPress={handleViewAnalytics}
            type="primary"
            style={styles.actionButton}
            icon={<Ionicons name="analytics" size={18} color={COLORS.white} style={styles.buttonIcon} />}
          />

          <Button
            title="Edit Property"
            onPress={handleEditProperty}
            type="outline"
            style={styles.actionButton}
            icon={<Ionicons name="create" size={18} color={COLORS.primary} style={styles.buttonIcon} />}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.white,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.lightGray,
  },
  backButton: {
    padding: 4,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: COLORS.darkGray,
    flex: 1,
    textAlign: "center",
  },
  moreButton: {
    padding: 4,
  },
  content: {
    flex: 1,
  },
  imageContainer: {
    position: "relative",
    height: 250,
  },
  imageSlide: {
    width,
    height: 250,
  },
  mainImage: {
    width: "100%",
    height: "100%",
  },
  pagination: {
    position: "absolute",
    bottom: 16,
    left: 0,
    right: 0,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  paginationDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "rgba(255, 255, 255, 0.5)",
    marginHorizontal: 4,
  },
  paginationDotActive: {
    backgroundColor: COLORS.white,
    width: 12,
    height: 12,
    borderRadius: 6,
  },
  imageActions: {
    position: "absolute",
    bottom: 16,
    right: 16,
    flexDirection: "row",
  },
  imageActionButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    marginLeft: 8,
  },
  imageActionText: {
    color: COLORS.white,
    fontSize: 12,
    marginLeft: 4,
  },
  thumbnailsContainer: {
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.lightGray,
  },
  thumbnailsList: {
    paddingHorizontal: 16,
  },
  imageItem: {
    width: 80,
    height: 80,
    borderRadius: 8,
    marginRight: 8,
    overflow: "hidden",
  },
  image: {
    width: "100%",
    height: "100%",
  },
  infoContainer: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.lightGray,
  },
  titleContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  propertyName: {
    fontSize: 24,
    fontWeight: "bold",
    color: COLORS.darkGray,
    flex: 1,
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  statusText: {
    color: COLORS.white,
    fontSize: 12,
    fontWeight: "bold",
  },
  address: {
    fontSize: 16,
    color: COLORS.gray,
    marginBottom: 16,
  },
  priceContainer: {
    flexDirection: "row",
    alignItems: "baseline",
    marginBottom: 16,
  },
  price: {
    fontSize: 24,
    fontWeight: "bold",
    color: COLORS.primary,
  },
  priceLabel: {
    fontSize: 16,
    color: COLORS.gray,
    marginLeft: 4,
  },
  specsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  specItem: {
    alignItems: "center",
  },
  specValue: {
    fontSize: 16,
    fontWeight: "bold",
    color: COLORS.darkGray,
    marginTop: 4,
  },
  specLabel: {
    fontSize: 12,
    color: COLORS.gray,
  },
  section: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.lightGray,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: COLORS.darkGray,
    marginBottom: 12,
  },
  description: {
    fontSize: 16,
    color: COLORS.gray,
    lineHeight: 24,
  },
  readMoreButton: {
    marginTop: 8,
  },
  readMoreText: {
    fontSize: 14,
    color: COLORS.primary,
    fontWeight: "500",
  },
  featureItem: {
    flexDirection: "row",
    alignItems: "center",
    width: "50%",
    marginBottom: 12,
  },
  featureIcon: {
    marginRight: 8,
  },
  featureText: {
    fontSize: 14,
    color: COLORS.darkGray,
  },
  tenantContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: COLORS.background,
    borderRadius: 8,
    padding: 16,
  },
  tenantInfo: {
    flex: 1,
  },
  tenantName: {
    fontSize: 16,
    fontWeight: "bold",
    color: COLORS.darkGray,
    marginBottom: 4,
  },
  tenantDetail: {
    fontSize: 14,
    color: COLORS.gray,
    marginBottom: 2,
  },
  leaseInfo: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 4,
  },
  leaseLabel: {
    fontSize: 14,
    color: COLORS.darkGray,
    fontWeight: "500",
  },
  leaseDate: {
    fontSize: 14,
    color: COLORS.gray,
  },
  noTenantContainer: {
    alignItems: "center",
    backgroundColor: COLORS.background,
    borderRadius: 8,
    padding: 16,
  },
  noTenantText: {
    fontSize: 16,
    color: COLORS.gray,
    marginBottom: 16,
  },
  actionsContainer: {
    padding: 16,
    marginBottom: 24,
  },
  actionButton: {
    marginBottom: 12,
  },
  buttonIcon: {
    marginRight: 8,
  },
})

export default PropertyDetailsScreen

