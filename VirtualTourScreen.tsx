"use client"

import { useState, useRef } from "react"
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  Dimensions,
  ActivityIndicator,
  ScrollView,
} from "react-native"
import { SafeAreaView } from "react-native-safe-area-context"
import { Ionicons } from "@expo/vector-icons"
import { useNavigation, useRoute } from "@react-navigation/native"
import { WebView } from "react-native-webview"

const { width, height } = Dimensions.get("window")

// Define route params interface
interface RouteParams {
  propertyId: string;
}

// Mock property data
const mockProperty = {
  id: "property-1",
  name: "Sunset Villa",
  address: "123 Ocean Drive, Malibu, CA 90210",
  virtualTourUrl: "https://my.matterport.com/show/?m=zEWsxhZpGba",
  panoramicImages: [
    {
      id: "pano-1",
      name: "Living Room",
      url: "https://api.a0.dev/assets/image?text=Living%20Room%20360&width=800&height=400",
    },
    {
      id: "pano-2",
      name: "Kitchen",
      url: "https://api.a0.dev/assets/image?text=Kitchen%20360&width=800&height=400",
    },
    {
      id: "pano-3",
      name: "Master Bedroom",
      url: "https://api.a0.dev/assets/image?text=Master%20Bedroom%20360&width=800&height=400",
    },
    {
      id: "pano-4",
      name: "Bathroom",
      url: "https://api.a0.dev/assets/image?text=Bathroom%20360&width=800&height=400",
    },
    {
      id: "pano-5",
      name: "Backyard",
      url: "https://api.a0.dev/assets/image?text=Backyard%20360&width=800&height=400",
    },
  ],
  floorPlanImage: "https://api.a0.dev/assets/image?text=Floor%20Plan&width=800&height=600",
}

const VirtualTourScreen = () => {
  const navigation = useNavigation()
  const route = useRoute()
  const { propertyId } = (route.params as RouteParams) || { propertyId: "property-1" }

  // In a real app, you would fetch property data based on propertyId
  const property = mockProperty

  const [isLoading, setIsLoading] = useState(true)
  const [activeTab, setActiveTab] = useState("3d")
  const [selectedPanorama, setSelectedPanorama] = useState(property.panoramicImages[0])
  const webViewRef = useRef(null)

  // Handle web view load end
  const handleLoadEnd = () => {
    setIsLoading(false)
  }

  // Render 3D Tour tab
  const render3DTour = () => (
    <View style={styles.tourContainer}>
      {isLoading && (
        <View style={styles.loadingOverlay}>
          <ActivityIndicator size="large" color="#007AFF" />
          <Text style={styles.loadingText}>Loading 3D Tour...</Text>
        </View>
      )}

      <WebView
        ref={webViewRef}
        source={{ uri: property.virtualTourUrl }}
        style={styles.webView}
        onLoadEnd={handleLoadEnd}
        javaScriptEnabled={true}
        domStorageEnabled={true}
      />
    </View>
  )

  // Render Panoramic Images tab
  const renderPanoramicImages = () => (
    <View style={styles.panoramicContainer}>
      <View style={styles.panoramaViewer}>
        <Image source={{ uri: selectedPanorama.url }} style={styles.panoramaImage} />
        <View style={styles.panoramaOverlay}>
          <Text style={styles.panoramaName}>{selectedPanorama.name}</Text>
          <Text style={styles.panoramaInstructions}>Swipe to look around</Text>
        </View>
      </View>

      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.panoramaList}>
        {property.panoramicImages.map((panorama) => (
          <TouchableOpacity
            key={panorama.id}
            style={[styles.panoramaItem, selectedPanorama.id === panorama.id && styles.panoramaItemActive]}
            onPress={() => setSelectedPanorama(panorama)}
          >
            <Image source={{ uri: panorama.url }} style={styles.panoramaThumb} />
            <Text style={styles.panoramaItemText}>{panorama.name}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  )

  // Render Floor Plan tab
  const renderFloorPlan = () => (
    <View style={styles.floorPlanContainer}>
      <Image source={{ uri: property.floorPlanImage }} style={styles.floorPlanImage} resizeMode="contain" />
    </View>
  )

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color="#8E8E93" />
        </TouchableOpacity>
        <Text style={styles.title}>{property.name} Tour</Text>
      </View>

      <View style={styles.tabsContainer}>
        <TouchableOpacity
          style={[styles.tab, activeTab === "3d" && styles.activeTab]}
          onPress={() => setActiveTab("3d")}
        >
          <Ionicons name="cube" size={20} color={activeTab === "3d" ? "#007AFF" : "#8E8E93"} />
          <Text style={[styles.tabText, activeTab === "3d" && styles.activeTabText]}>3D Tour</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.tab, activeTab === "panoramic" && styles.activeTab]}
          onPress={() => setActiveTab("panoramic")}
        >
          <Ionicons name="image" size={20} color={activeTab === "panoramic" ? "#007AFF" : "#8E8E93"} />
          <Text style={[styles.tabText, activeTab === "panoramic" && styles.activeTabText]}>Panoramic</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.tab, activeTab === "floorplan" && styles.activeTab]}
          onPress={() => setActiveTab("floorplan")}
        >
          <Ionicons name="grid" size={20} color={activeTab === "floorplan" ? "#007AFF" : "#8E8E93"} />
          <Text style={[styles.tabText, activeTab === "floorplan" && styles.activeTabText]}>Floor Plan</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.content}>
        {activeTab === "3d" && render3DTour()}
        {activeTab === "panoramic" && renderPanoramicImages()}
        {activeTab === "floorplan" && renderFloorPlan()}
      </View>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#C7C7CC",
  },
  backButton: {
    marginRight: 16,
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#000000",
  },
  content: {
    flex: 1,
  },
  imageContainer: {
    height: 300,
    width: "100%",
  },
  image: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
  },
  infoContainer: {
    padding: 16,
  },
  propertyName: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#000000",
    marginBottom: 8,
  },
  propertyAddress: {
    fontSize: 16,
    color: "#8E8E93",
    marginBottom: 16,
  },
  tabsContainer: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderBottomColor: "#C7C7CC",
  },
  tab: {
    flex: 1,
    paddingVertical: 12,
    alignItems: "center",
  },
  activeTab: {
    borderBottomWidth: 2,
    borderBottomColor: "#007AFF",
  },
  tabText: {
    fontSize: 16,
    color: "#8E8E93",
    marginLeft: 8,
  },
  activeTabText: {
    color: "#007AFF",
    fontWeight: "bold",
  },
  tabContent: {
    flex: 1,
    padding: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#000000",
    marginBottom: 16,
  },
  description: {
    fontSize: 16,
    color: "#000000",
    lineHeight: 24,
    marginBottom: 24,
  },
  featuresContainer: {
    marginBottom: 24,
  },
  featureItem: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  featureText: {
    fontSize: 16,
    color: "#000000",
    marginLeft: 8,
  },
  floorPlanContainer: {
    marginTop: 16,
  },
  floorPlanImage: {
    width: "100%",
    height: 200,
    resizeMode: "contain",
    marginTop: 16,
  },
  tourContainer: {
    flex: 1,
    position: "relative",
  },
  loadingOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(255, 255, 255, 0.8)",
    zIndex: 10,
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: "#8E8E93",
  },
  webView: {
    flex: 1,
  },
  panoramicContainer: {
    flex: 1,
  },
  panoramaViewer: {
    height: height * 0.5,
    position: "relative",
  },
  panoramaImage: {
    width: "100%",
    height: "100%",
  },
  panoramaOverlay: {
    position: "absolute",
    bottom: 16,
    left: 16,
    right: 16,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    borderRadius: 8,
    padding: 12,
  },
  panoramaName: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#FFFFFF",
    marginBottom: 4,
  },
  panoramaInstructions: {
    fontSize: 14,
    color: "#FFFFFF",
  },
  panoramaList: {
    padding: 16,
  },
  panoramaItem: {
    width: 120,
    marginRight: 12,
    borderRadius: 8,
    overflow: "hidden",
    borderWidth: 2,
    borderColor: "transparent",
  },
  panoramaItemActive: {
    borderColor: "#007AFF",
  },
  panoramaThumb: {
    width: "100%",
    height: 80,
  },
  panoramaItemText: {
    fontSize: 12,
    color: "#000000",
    padding: 8,
    textAlign: "center",
  },
})

export default VirtualTourScreen
