"use client"

import { useState, useRef } from "react"
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  Dimensions,
  Animated,
  FlatList,
  Share,
  Platform,
  StatusBar,
} from "react-native"
import { MaterialIcons, Ionicons } from "@expo/vector-icons"
import { LinearGradient } from "expo-linear-gradient"
import { useNavigation, useRoute } from "@react-navigation/native"
import { toast } from "sonner-native"
import HamburgerMenu from "../../components/HamburgerMenu"

const { width, height } = Dimensions.get("window")

// Type definitions
interface PropertyReview {
  id: string
  user: {
    name: string
    image: string
    verified: boolean
  }
  rating: number
  date: string
  comment: string
}

interface PropertyAmenity {
  id: string
  name: string
  icon: string
  category: "essential" | "comfort" | "safety" | "extra"
}

interface PropertyRule {
  id: string
  title: string
  description: string
  icon: string
}

interface PropertyOwner {
  id: string
  name: string
  image: string
  responseRate: number
  responseTime: string
  joined: string
  verified: boolean
}

interface PropertyLocation {
  address: string
  neighborhood: string
  city: string
  coordinates: {
    lat: number
    lng: number
  }
  walkScore: number
  transitScore: number
  nearbyPlaces: {
    category: string
    places: { name: string; distance: string; rating: number }[]
  }[]
}

interface PropertyAvailability {
  available: boolean
  availableFrom: string
  minimumStay: number
  maximumStay: number
  bookingLeadTime: number
  instantBooking: boolean
  calendar: {
    [key: string]: "available" | "booked" | "pending"
  }
}

interface PropertyImage {
  id: string
  url: string
  caption?: string
  roomType?: "living" | "bedroom" | "kitchen" | "bathroom" | "exterior" | "other"
}

const PropertyDetailScreen = () => {
  const navigation = useNavigation()
  const route = useRoute()
  const { propertyId } = route.params || { propertyId: "1" }

  // Animation values
  const scrollY = useRef(new Animated.Value(0)).current
  const headerOpacity = scrollY.interpolate({
    inputRange: [0, 200],
    outputRange: [0, 1],
    extrapolate: "clamp",
  })

  // State
  const [isFavorite, setIsFavorite] = useState(false)
  const [showAllAmenities, setShowAllAmenities] = useState(false)
  const [showAllRules, setShowAllRules] = useState(false)
  const [showAllReviews, setShowAllReviews] = useState(false)
  const [activeImageIndex, setActiveImageIndex] = useState(0)

  // Fetch property data (mocked for now)
  const property = {
    id: propertyId,
    title: "Modern Luxury Apartment with Skyline View",
    description:
      "Experience urban living at its finest in this beautifully designed apartment featuring floor-to-ceiling windows with breathtaking city views. This spacious 2-bedroom, 2-bathroom unit offers an open-concept living area perfect for entertaining, a gourmet kitchen with premium appliances, and a private balcony.",
    price: 2500,
    type: "Apartment",
    shortDescription: "Stunning modern apartment with premium amenities in the heart of downtown.",
    specs: {
      beds: 2,
      baths: 2,
      sqft: 1200,
      built: 2019,
      floors: 1,
      parking: 1,
      furnished: true,
    },
    rating: 4.8,
    reviews: 24,
    location: {
      address: "432 Urban Avenue",
      neighborhood: "Downtown Financial District",
      city: "Metropolis",
      coordinates: {
        lat: 34.0522,
        lng: -118.2437,
      },
      walkScore: 92,
      transitScore: 86,
      nearbyPlaces: [
        {
          category: "Restaurants",
          places: [
            { name: "Urban Bistro", distance: "0.2 miles", rating: 4.7 },
            { name: "City Café", distance: "0.3 miles", rating: 4.5 },
            { name: "Skyline Restaurant", distance: "0.4 miles", rating: 4.8 },
          ],
        },
        {
          category: "Shopping",
          places: [
            { name: "Metro Mall", distance: "0.5 miles", rating: 4.3 },
            { name: "City Center Shops", distance: "0.7 miles", rating: 4.6 },
          ],
        },
      ],
    },
    images: [
      {
        id: "1",
        url: "https://api.a0.dev/assets/image?text=modern%20luxury%20apartment%20living%20room%20with%20city%20view&aspect=16:9",
        caption: "Spacious living room with floor-to-ceiling windows",
        roomType: "living",
      },
      {
        id: "2",
        url: "https://api.a0.dev/assets/image?text=modern%20luxury%20kitchen%20with%20island%20and%20stainless%20steel%20appliances&aspect=16:9",
        caption: "Gourmet kitchen with premium appliances",
        roomType: "kitchen",
      },
      {
        id: "3",
        url: "https://api.a0.dev/assets/image?text=modern%20master%20bedroom%20with%20king%20size%20bed%20and%20city%20view&aspect=16:9",
        caption: "Master bedroom with king-size bed",
        roomType: "bedroom",
      },
      {
        id: "4",
        url: "https://api.a0.dev/assets/image?text=luxury%20bathroom%20with%20walk-in%20shower%20and%20double%20vanity&aspect=16:9",
        caption: "Modern bathroom with walk-in shower",
        roomType: "bathroom",
      },
      {
        id: "5",
        url: "https://api.a0.dev/assets/image?text=apartment%20balcony%20with%20city%20skyline%20view&aspect=16:9",
        caption: "Private balcony with city views",
        roomType: "exterior",
      },
    ],
    amenities: [
      { id: "1", name: "Wi-Fi", icon: "wifi", category: "essential" },
      { id: "2", name: "Air Conditioning", icon: "ac-unit", category: "comfort" },
      { id: "3", name: "Heating", icon: "whatshot", category: "comfort" },
      { id: "4", name: "Kitchen", icon: "kitchen", category: "essential" },
      { id: "5", name: "TV", icon: "tv", category: "comfort" },
      { id: "6", name: "Washing Machine", icon: "local-laundry-service", category: "comfort" },
      { id: "7", name: "Free Parking", icon: "local-parking", category: "extra" },
      { id: "8", name: "Pool", icon: "pool", category: "extra" },
      { id: "9", name: "Gym", icon: "fitness-center", category: "extra" },
      { id: "10", name: "Elevator", icon: "elevator", category: "essential" },
      { id: "11", name: "Security System", icon: "security", category: "safety" },
      { id: "12", name: "Smoke Alarm", icon: "smoke-detector", category: "safety" },
    ],
    rules: [
      { id: "1", title: "No Smoking", description: "Smoking is not allowed inside the property.", icon: "smoke-free" },
      { id: "2", title: "No Pets", description: "Sorry, pets are not permitted.", icon: "pets" },
      { id: "3", title: "No Parties", description: "Parties or events are not allowed.", icon: "celebration" },
      { id: "4", title: "Check-in Time", description: "Check-in is after 3:00 PM.", icon: "login" },
      { id: "5", title: "Check-out Time", description: "Check-out is before 11:00 AM.", icon: "logout" },
    ],
    owner: {
      id: "1",
      name: "John Wilson",
      image:
        "https://api.a0.dev/assets/image?text=professional%20headshot%20of%20middle-aged%20man%20in%20business%20attire&aspect=1:1",
      responseRate: 98,
      responseTime: "within an hour",
      joined: "January 2020",
      verified: true,
    },
    reviews: [
      {
        id: "1",
        user: {
          name: "Sarah Johnson",
          image:
            "https://api.a0.dev/assets/image?text=headshot%20of%20young%20professional%20woman%20smiling&aspect=1:1",
          verified: true,
        },
        rating: 5,
        date: "2 weeks ago",
        comment:
          "Absolutely stunning apartment with amazing views! Everything was spotless and the amenities were top-notch. The location couldn't be more perfect - walking distance to great restaurants and shops. John was a fantastic host, very responsive and accommodating. Would definitely stay here again!",
      },
      {
        id: "2",
        user: {
          name: "Michael Chen",
          image:
            "https://api.a0.dev/assets/image?text=professional%20headshot%20of%20asian%20man%20in%20casual%20business%20attire&aspect=1:1",
          verified: true,
        },
        rating: 4,
        date: "1 month ago",
        comment:
          "Great place in an excellent location. Clean, modern, and comfortable. The kitchen is well equipped and the bed was very comfortable. The building amenities are also nice. Only reason for 4 stars instead of 5 is that the AC was a bit noisy at night.",
      },
      {
        id: "3",
        user: {
          name: "Emma Wilson",
          image: "https://api.a0.dev/assets/image?text=headshot%20of%20blonde%20woman%20with%20glasses&aspect=1:1",
          verified: false,
        },
        rating: 5,
        date: "2 months ago",
        comment:
          "This apartment exceeded all my expectations! The views are even better than in the photos. Very clean and modern with everything you need. The building staff were also very helpful. Would highly recommend!",
      },
    ],
    availability: {
      available: true,
      availableFrom: "2024-03-01",
      minimumStay: 30,
      maximumStay: 365,
      bookingLeadTime: 2,
      instantBooking: true,
      calendar: {
        "2024-03-01": "available",
        "2024-03-02": "available",
        "2024-03-03": "available",
        "2024-04-01": "booked",
        "2024-04-02": "booked",
        "2024-04-03": "booked",
      },
    },
  }

  // Calculate average rating
  const calculateAverageRating = (reviews) => {
    if (!reviews || reviews.length === 0) return 0
    const sum = reviews.reduce((total, review) => total + review.rating, 0)
    return (sum / reviews.length).toFixed(1)
  }

  // Generate stars based on rating
  const renderRatingStars = (rating) => {
    const stars = []
    const fullStars = Math.floor(rating)
    const halfStar = rating % 1 >= 0.5

    for (let i = 1; i <= 5; i++) {
      if (i <= fullStars) {
        stars.push(<MaterialIcons key={i} name="star" size={18} color="#FFD700" />)
      } else if (i === fullStars + 1 && halfStar) {
        stars.push(<MaterialIcons key={i} name="star-half" size={18} color="#FFD700" />)
      } else {
        stars.push(<MaterialIcons key={i} name="star-border" size={18} color="#FFD700" />)
      }
    }

    return stars
  }

  // Share property
  const shareProperty = async () => {
    try {
      await Share.share({
        message: `Check out this amazing property: ${property.title} - ${property.shortDescription}. View it here: [App Link]`,
        url: property.images[0].url, // This will only work on iOS
      })
    } catch (error) {
      console.log("Error sharing property:", error)
    }
  }

  // Favorite handling
  const toggleFavorite = () => {
    setIsFavorite(!isFavorite)
    toast.success(isFavorite ? "Removed from favorites" : "Added to favorites")
  }

  // Booking handling
  const handleBooking = () => {
    // In a real app, this would navigate to a booking screen or open a booking modal
    toast.success("Booking feature would open here")
  }

  // Contact owner
  const contactOwner = () => {
    // In a real app, this would open a chat screen or contact form
    toast.success("Contact feature would open here")
  }

  // Customize property
  const customizeProperty = () => {
    navigation.navigate("Customize", { property })
  }

  // Render image gallery item
  const renderGalleryItem = ({ item, index }) => (
    <TouchableOpacity
      style={[styles.galleryThumbnail, activeImageIndex === index && styles.activeGalleryThumbnail]}
      onPress={() => setActiveImageIndex(index)}
    >
      <Image source={{ uri: item.url }} style={styles.thumbnailImage} />
      {activeImageIndex === index && <View style={styles.activeThumbnailIndicator} />}
    </TouchableOpacity>
  )

  // Render header with animations
  const renderAnimatedHeader = () => (
    <Animated.View
      style={[
        styles.animatedHeader,
        {
          opacity: headerOpacity,
          transform: [
            {
              translateY: scrollY.interpolate({
                inputRange: [0, 200],
                outputRange: [-100, 0],
                extrapolate: "clamp",
              }),
            },
          ],
        },
      ]}
    >
      <View style={styles.headerContent}>
        <HamburgerMenu />
        <Text style={styles.headerTitle} numberOfLines={1}>
          {property.title}
        </Text>
        <TouchableOpacity onPress={shareProperty}>
          <MaterialIcons name="share" size={24} color="#333" />
        </TouchableOpacity>
      </View>
    </Animated.View>
  )

  return (
    <View style={styles.container}>
      {renderAnimatedHeader()}

      <Animated.ScrollView
        showsVerticalScrollIndicator={false}
        onScroll={Animated.event([{ nativeEvent: { contentOffset: { y: scrollY } } }], { useNativeDriver: true })}
        scrollEventThrottle={16}
      >
        {/* Main Image */}
        <View style={styles.mainImageContainer}>
          <Image source={{ uri: property.images[activeImageIndex].url }} style={styles.mainImage} />
          <LinearGradient
            colors={["rgba(0,0,0,0.7)", "transparent", "transparent", "rgba(0,0,0,0.7)"]}
            style={styles.mainImageGradient}
          />

          <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
            <MaterialIcons name="arrow-back" size={24} color="white" />
          </TouchableOpacity>

          <TouchableOpacity style={styles.favoriteButton} onPress={toggleFavorite}>
            <MaterialIcons
              name={isFavorite ? "favorite" : "favorite-border"}
              size={24}
              color={isFavorite ? "#ff4444" : "white"}
            />
          </TouchableOpacity>

          <TouchableOpacity style={styles.shareButton} onPress={shareProperty}>
            <MaterialIcons name="share" size={24} color="white" />
          </TouchableOpacity>

          <View style={styles.imageCount}>
            <Text style={styles.imageCountText}>
              {activeImageIndex + 1}/{property.images.length}
            </Text>
          </View>

          <View style={styles.priceBadge}>
            <Text style={styles.price}>${property.price}</Text>
            <Text style={styles.priceSubtext}>/month</Text>
          </View>
        </View>

        {/* Image Gallery */}
        <View style={styles.galleryContainer}>
          <FlatList
            horizontal
            data={property.images}
            renderItem={renderGalleryItem}
            keyExtractor={(item) => item.id}
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.galleryList}
          />
        </View>

        {/* Content */}
        <View style={styles.contentContainer}>
          {/* Property Title & Type */}
          <View style={styles.titleContainer}>
            <Text style={styles.propertyTitle}>{property.title}</Text>
            <View style={styles.propertyTypeBadge}>
              <Text style={styles.propertyType}>{property.type}</Text>
            </View>
          </View>

          {/* Location */}
          <View style={styles.locationContainer}>
            <Ionicons name="location-sharp" size={16} color="#666" />
            <Text style={styles.locationText}>
              {property.location.neighborhood}, {property.location.city}
            </Text>
          </View>

          {/* Ratings */}
          <View style={styles.ratingContainer}>
            <View style={styles.starsContainer}>{renderRatingStars(property.rating)}</View>
            <Text style={styles.ratingNumber}>{property.rating}</Text>
            <Text style={styles.reviewCount}>({property.reviews.length} reviews)</Text>
          </View>

          {/* Property Features */}
          <View style={styles.featuresContainer}>
            <View style={styles.featureItem}>
              <MaterialIcons name="king-bed" size={22} color="#333" />
              <Text style={styles.featureText}>{property.specs.beds} Beds</Text>
            </View>
            <View style={styles.featureItem}>
              <MaterialIcons name="bathroom" size={22} color="#333" />
              <Text style={styles.featureText}>{property.specs.baths} Baths</Text>
            </View>
            <View style={styles.featureItem}>
              <MaterialIcons name="square-foot" size={22} color="#333" />
              <Text style={styles.featureText}>{property.specs.sqft} sqft</Text>
            </View>
            <View style={styles.featureItem}>
              <MaterialIcons name="local-parking" size={22} color="#333" />
              <Text style={styles.featureText}>{property.specs.parking} Parking</Text>
            </View>
          </View>

          {/* Description */}
          <View style={styles.descriptionContainer}>
            <Text style={styles.sectionTitle}>Description</Text>
            <Text style={styles.description}>{property.description}</Text>
          </View>

          {/* Walk & Transit Score */}
          <View style={styles.scoreCardsContainer}>
            <View style={styles.scoreCard}>
              <View style={styles.scoreCircle}>
                <Text style={styles.scoreNumber}>{property.location.walkScore}</Text>
              </View>
              <Text style={styles.scoreLabel}>Walk Score</Text>
              <Text style={styles.scoreDescription}>Very Walkable</Text>
            </View>
            <View style={styles.scoreCard}>
              <View style={styles.scoreCircle}>
                <Text style={styles.scoreNumber}>{property.location.transitScore}</Text>
              </View>
              <Text style={styles.scoreLabel}>Transit Score</Text>
              <Text style={styles.scoreDescription}>Excellent Transit</Text>
            </View>
          </View>

          {/* Amenities */}
          <View style={styles.amenitiesContainer}>
            <Text style={styles.sectionTitle}>Amenities</Text>
            <View style={styles.amenitiesGrid}>
              {property.amenities.slice(0, showAllAmenities ? property.amenities.length : 6).map((amenity) => (
                <View key={amenity.id} style={styles.amenityItem}>
                  <MaterialIcons name={amenity.icon} size={22} color="#666" />
                  <Text style={styles.amenityText}>{amenity.name}</Text>
                </View>
              ))}
            </View>
            {property.amenities.length > 6 && (
              <TouchableOpacity style={styles.showMoreButton} onPress={() => setShowAllAmenities(!showAllAmenities)}>
                <Text style={styles.showMoreText}>
                  {showAllAmenities ? "Show Less" : `Show All (${property.amenities.length})`}
                </Text>
                <MaterialIcons
                  name={showAllAmenities ? "keyboard-arrow-up" : "keyboard-arrow-down"}
                  size={20}
                  color="#2196F3"
                />
              </TouchableOpacity>
            )}
          </View>

          {/* House Rules */}
          <View style={styles.rulesContainer}>
            <Text style={styles.sectionTitle}>House Rules</Text>
            <View style={styles.rulesList}>
              {property.rules.slice(0, showAllRules ? property.rules.length : 3).map((rule) => (
                <View key={rule.id} style={styles.ruleItem}>
                  <MaterialIcons name={rule.icon} size={22} color="#666" />
                  <View style={styles.ruleContent}>
                    <Text style={styles.ruleTitle}>{rule.title}</Text>
                    <Text style={styles.ruleDescription}>{rule.description}</Text>
                  </View>
                </View>
              ))}
            </View>
            {property.rules.length > 3 && (
              <TouchableOpacity style={styles.showMoreButton} onPress={() => setShowAllRules(!showAllRules)}>
                <Text style={styles.showMoreText}>
                  {showAllRules ? "Show Less" : `Show All (${property.rules.length})`}
                </Text>
                <MaterialIcons
                  name={showAllRules ? "keyboard-arrow-up" : "keyboard-arrow-down"}
                  size={20}
                  color="#2196F3"
                />
              </TouchableOpacity>
            )}
          </View>

          {/* Host Information */}
          <View style={styles.hostContainer}>
            <Text style={styles.sectionTitle}>Meet Your Host</Text>
            <View style={styles.hostContent}>
              <View style={styles.hostImageContainer}>
                <Image source={{ uri: property.owner.image }} style={styles.hostImage} />
                {property.owner.verified && (
                  <View style={styles.hostVerifiedBadge}>
                    <MaterialIcons name="verified-user" size={12} color="white" />
                  </View>
                )}
              </View>
              <View style={styles.hostInfo}>
                <Text style={styles.hostName}>{property.owner.name}</Text>
                <Text style={styles.hostJoined}>Host since {property.owner.joined}</Text>
                <View style={styles.hostStatsContainer}>
                  <View style={styles.hostStat}>
                    <Text style={styles.hostStatValue}>{property.owner.responseRate}%</Text>
                    <Text style={styles.hostStatLabel}>Response Rate</Text>
                  </View>
                  <View style={styles.hostStat}>
                    <Text style={styles.hostStatValue}>{property.owner.responseTime}</Text>
                    <Text style={styles.hostStatLabel}>Response Time</Text>
                  </View>
                </View>
              </View>
            </View>
            <TouchableOpacity style={styles.contactHostButton} onPress={contactOwner}>
              <MaterialIcons name="chat" size={20} color="#2196F3" />
              <Text style={styles.contactHostText}>Contact Host</Text>
            </TouchableOpacity>
          </View>

          {/* Location */}
          <View style={styles.mapContainer}>
            <Text style={styles.sectionTitle}>Location</Text>
            <View style={styles.mapPlaceholder}>
              <MaterialIcons name="map" size={48} color="#ccc" />
              <Text style={styles.mapPlaceholderText}>Map View</Text>
            </View>
            <Text style={styles.locationDetail}>
              {property.location.neighborhood}, {property.location.city}
            </Text>

            {/* Nearby Places */}
            <View style={styles.nearbyPlacesContainer}>
              <Text style={styles.nearbyPlacesTitle}>Nearby Places</Text>
              {property.location.nearbyPlaces.map((category, index) => (
                <View key={index} style={styles.nearbyCategory}>
                  <Text style={styles.nearbyCategoryTitle}>{category.category}</Text>
                  {category.places.map((place, placeIndex) => (
                    <View key={placeIndex} style={styles.nearbyPlace}>
                      <View style={styles.nearbyPlaceInfo}>
                        <Text style={styles.nearbyPlaceName}>{place.name}</Text>
                        <Text style={styles.nearbyPlaceDistance}>{place.distance}</Text>
                      </View>
                      <View style={styles.nearbyPlaceRating}>
                        <MaterialIcons name="star" size={14} color="#FFD700" />
                        <Text style={styles.nearbyPlaceRatingText}>{place.rating}</Text>
                      </View>
                    </View>
                  ))}
                </View>
              ))}
            </View>
          </View>

          {/* Reviews */}
          <View style={styles.reviewsContainer}>
            <Text style={styles.sectionTitle}>Reviews</Text>
            <View style={styles.reviewsSummary}>
              <View style={styles.reviewsRating}>
                <Text style={styles.reviewsRatingNumber}>{property.rating}</Text>
                <View style={styles.reviewsStarsContainer}>{renderRatingStars(property.rating)}</View>
              </View>
              <Text style={styles.reviewsCount}>{property.reviews.length} reviews</Text>
            </View>

            <View style={styles.reviewsList}>
              {property.reviews.slice(0, showAllReviews ? property.reviews.length : 2).map((review) => (
                <View key={review.id} style={styles.reviewItem}>
                  <View style={styles.reviewHeader}>
                    <View style={styles.reviewUser}>
                      <Image source={{ uri: review.user.image }} style={styles.reviewUserImage} />
                      <View style={styles.reviewUserInfo}>
                        <Text style={styles.reviewUserName}>{review.user.name}</Text>
                        <Text style={styles.reviewDate}>{review.date}</Text>
                      </View>
                    </View>
                    <View style={styles.reviewRating}>
                      <MaterialIcons name="star" size={16} color="#FFD700" />
                      <Text style={styles.reviewRatingText}>{review.rating}</Text>
                    </View>
                  </View>{" "}
                  <Text style={styles.reviewComment}>{review.comment}</Text>
                </View>
              ))}
            </View>
            {property.reviews.length > 2 && (
              <TouchableOpacity style={styles.showMoreButton} onPress={() => setShowAllReviews(!showAllReviews)}>
                <Text style={styles.showMoreText}>
                  {showAllReviews ? "Show Less" : `Show All Reviews (${property.reviews.length})`}
                </Text>
                <MaterialIcons
                  name={showAllReviews ? "keyboard-arrow-up" : "keyboard-arrow-down"}
                  size={20}
                  color="#2196F3"
                />
              </TouchableOpacity>
            )}
          </View>
        </View>
      </Animated.ScrollView>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
  },
  animatedHeader: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    height: 60,
    backgroundColor: "white",
    zIndex: 1000,
    elevation: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  headerContent: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
    flex: 1,
    marginHorizontal: 16,
  },
  mainImageContainer: {
    height: 300,
    position: "relative",
  },
  mainImage: {
    width: "100%",
    height: "100%",
  },
  mainImageGradient: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  backButton: {
    position: "absolute",
    top: 12,
    left: 12,
    backgroundColor: "rgba(0,0,0,0.5)",
    padding: 8,
    borderRadius: 20,
  },
  favoriteButton: {
    position: "absolute",
    top: 12,
    right: 50,
    backgroundColor: "rgba(0,0,0,0.5)",
    padding: 8,
    borderRadius: 20,
  },
  shareButton: {
    position: "absolute",
    top: 12,
    right: 12,
    backgroundColor: "rgba(0,0,0,0.5)",
    padding: 8,
    borderRadius: 20,
  },
  imageCount: {
    position: "absolute",
    bottom: 16,
    right: 16,
    backgroundColor: "rgba(0,0,0,0.7)",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 15,
  },
  imageCountText: {
    color: "white",
    fontSize: 12,
    fontWeight: "bold",
  },
  priceBadge: {
    position: "absolute",
    bottom: 16,
    left: 16,
    flexDirection: "row",
    alignItems: "baseline",
  },
  price: {
    color: "white",
    fontSize: 24,
    fontWeight: "bold",
  },
  priceSubtext: {
    color: "white",
    fontSize: 14,
    marginLeft: 4,
  },
  galleryContainer: {
    backgroundColor: "white",
    paddingVertical: 12,
  },
  galleryList: {
    paddingHorizontal: 16,
  },
  galleryThumbnail: {
    width: 60,
    height: 60,
    borderRadius: 8,
    marginRight: 8,
    overflow: "hidden",
    borderWidth: 2,
    borderColor: "transparent",
  },
  activeGalleryThumbnail: {
    borderColor: "#2196F3",
  },
  thumbnailImage: {
    width: "100%",
    height: "100%",
  },
  activeThumbnailIndicator: {
    position: "absolute",
    bottom: -2,
    left: 0,
    right: 0,
    height: 4,
    backgroundColor: "#2196F3",
    borderRadius: 2,
  },
  contentContainer: {
    backgroundColor: "white",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    marginTop: -20,
    paddingHorizontal: 16,
    paddingTop: 20,
  },
  titleContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 12,
  },
  propertyTitle: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#333",
    flex: 1,
    marginRight: 12,
  },
  propertyTypeBadge: {
    backgroundColor: "#f0f7ff",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 15,
  },
  propertyType: {
    color: "#2196F3",
  propertyTypeBadge: {
    backgroundColor: "#f0f7ff",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 15,
  },
  propertyType: {
    color: "#2196F3",
    fontSize: 14,
    fontWeight: "600",
  },
  locationContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  locationText: {
    fontSize: 14,
    color: "#666",
    marginLeft: 4,
  },
  ratingContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
  },
  starsContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  ratingNumber: {
    marginLeft: 8,
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
  },
  reviewCount: {
    marginLeft: 4,
    fontSize: 14,
    color: "#666",
  },
  featuresContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    backgroundColor: "#f8f8f8",
    borderRadius: 12,
    padding: 16,
    marginBottom: 24,
  },
  featureItem: {
    alignItems: "center",
  },
  featureText: {
    fontSize: 14,
    color: "#666",
    marginTop: 4,
  },
  descriptionContainer: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 12,
  },
  description: {
    fontSize: 16,
    color: "#555",
    lineHeight: 24,
  },
  scoreCardsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 24,
  },
  scoreCard: {
    flex: 1,
    backgroundColor: "#f8f8f8",
    borderRadius: 12,
    padding: 16,
    alignItems: "center",
    marginHorizontal: 4,
  },
  scoreCircle: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: "#2196F3",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 8,
  },
  scoreNumber: {
    fontSize: 24,
    fontWeight: "bold",
    color: "white",
  },
  scoreLabel: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
    marginBottom: 4,
  },
  scoreDescription: {
    fontSize: 12,
    color: "#666",
    textAlign: "center",
  },
  amenitiesContainer: {
    marginBottom: 24,
  },
  amenitiesGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
  },
  amenityItem: {
    flexDirection: "row",
    alignItems: "center",
    width: "50%",
    paddingVertical: 8,
  },
  amenityText: {
    marginLeft: 8,
    fontSize: 14,
    color: "#555",
  },
  showMoreButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 8,
  },
  showMoreText: {
    color: "#2196F3",
    fontSize: 14,
    fontWeight: "600",
    marginRight: 4,
  },
  rulesContainer: {
    marginBottom: 24,
  },
  rulesList: {
    backgroundColor: "#f8f8f8",
    borderRadius: 12,
    padding: 16,
  },
  ruleItem: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: 12,
  },
  ruleContent: {
    marginLeft: 12,
    flex: 1,
  },
  ruleTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
    marginBottom: 4,
  },
  ruleDescription: {
    fontSize: 14,
    color: "#666",
  },
  hostContainer: {
    marginBottom: 24,
  },
  hostContent: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f8f8f8",
    borderRadius: 12,
    padding: 16,
  },
  hostImageContainer: {
    position: "relative",
    marginRight: 16,
  },
  hostImage: {
    width: 70,
    height: 70,
    borderRadius: 35,
  },
  hostVerifiedBadge: {
    position: "absolute",
    bottom: 0,
    right: 0,
    backgroundColor: "#4caf50",
    borderRadius: 10,
    width: 20,
    height: 20,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 2,
    borderColor: "white",
  },
  hostInfo: {
    flex: 1,
  },
  hostName: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 4,
  },
  hostJoined: {
    fontSize: 14,
    color: "#666",
    marginBottom: 8,
  },
  hostStatsContainer: {
    flexDirection: "row",
  },
  hostStat: {
    marginRight: 16,
  },
  hostStatValue: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#2196F3",
  },
  hostStatLabel: {
    fontSize: 12,
    color: "#666",
  },
  contactHostButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#f0f7ff",
    paddingVertical: 12,
    borderRadius: 8,
    marginTop: 12,
  },
  contactHostText: {
    color: "#2196F3",
    fontWeight: "600",
    marginLeft: 8,
  },
  mapContainer: {
    marginBottom: 24,
  },
  mapPlaceholder: {
    height: 200,
    backgroundColor: "#f8f8f8",
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 12,
  },
  mapPlaceholderText: {
    marginTop: 8,
    color: "#999",
  },
  locationDetail: {
    fontSize: 16,
    color: "#666",
    marginBottom: 16,
  },
  nearbyPlacesContainer: {
    backgroundColor: "#f8f8f8",
    borderRadius: 12,
    padding: 16,
  },
  nearbyPlacesTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 12,
  },
  nearbyCategory: {
    marginBottom: 16,
  },
  nearbyCategoryTitle: {
    fontSize: 14,
    fontWeight: "600",
    color: "#333",
    marginBottom: 8,
  },
  nearbyPlace: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  nearbyPlaceInfo: {
    flex: 1,
  },
  nearbyPlaceName: {
    fontSize: 14,
    color: "#333",
  },
  nearbyPlaceDistance: {
    fontSize: 12,
    color: "#666",
  },
  nearbyPlaceRating: {
    flexDirection: "row",
    alignItems: "center",
  },
  nearbyPlaceRatingText: {
    marginLeft: 4,
    fontSize: 12,
    fontWeight: "bold",
    color: "#333",
  },
  reviewsContainer: {
    marginBottom: 24,
  },
  reviewsSummary: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
  },
  reviewsRating: {
    flexDirection: "row",
    alignItems: "baseline",
    marginRight: 12,
  },
  reviewsRatingNumber: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#333",
    marginRight: 8,
  },
  reviewsStarsContainer: {
    flexDirection: "row",
  },
  reviewsCount: {
    fontSize: 14,
    color: "#666",
  },
  reviewsList: {
    marginBottom: 8,
  },
  reviewItem: {
    backgroundColor: "#f8f8f8",
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
  },
  reviewHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  reviewUser: {
    flexDirection: "row",
    alignItems: "center",
  },
  reviewUserImage: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 12,
  },
  reviewUserInfo: {
    flex: 1,
  },
  reviewUserName: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
    marginBottom: 2,
  },
  reviewDate: {
    fontSize: 12,
    color: "#666",
  },
  reviewRating: {
    flexDirection: "row",
    alignItems: "center",
  },
  reviewRatingText: {
    marginLeft: 4,
    fontWeight: "bold",
    color: "#333",
  },
  reviewComment: {
    fontSize: 14,
    color: "#555",
    lineHeight: 22,
  },\
})

export default PropertyDetailScreen

