"use client"

import { useState, useEffect, useRef } from "react"
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  ScrollView,
  Dimensions,
  Animated,
  PanResponder,
} from "react-native"
import { MaterialIcons } from "@expo/vector-icons"
import { LinearGradient } from "expo-linear-gradient"
import { useNavigation, useRoute } from "@react-navigation/native"
import { toast } from "sonner-native"
import HamburgerMenu from "../components/HamburgerMenu"

const { width: SCREEN_WIDTH } = Dimensions.get("window")

// Types
type ViewMode = "2D" | "3D" | "AR"
type RoomType = "living" | "bedroom" | "kitchen" | "bathroom"
type MaterialType = "paint" | "wallpaper" | "wood" | "stone" | "tile"
type LightingType = "warm" | "cool" | "natural" | "ambient"

interface CustomizationState {
  viewMode: ViewMode
  activeRoom: RoomType
  materials: MaterialType[]
  lighting: {
    type: LightingType
    intensity: number
    color: string
  }
  furniture: string[]
  wallColor: string
  flooring: string
  windows: string
  decor: string[]
  costs: {
    materials: number
    furniture: number
    labor: number
    total: number
  }
}

interface DesignTemplate {
  id: string
  name: string
  description: string
  preview: string
  style: Partial<CustomizationState>
}

const CustomizationScreen = () => {
  const navigation = useNavigation()
  const route = useRoute()
  const { property } = route.params || {}

  // Animation values
  const rotateXAnim = useRef(new Animated.Value(0)).current
  const rotateYAnim = useRef(new Animated.Value(0)).current
  const scaleAnim = useRef(new Animated.Value(1)).current
  const panAnim = useRef(new Animated.ValueXY()).current

  // State
  const [customization, setCustomization] = useState<CustomizationState>({
    viewMode: "2D",
    activeRoom: "living",
    materials: [],
    lighting: {
      type: "natural",
      intensity: 0.5,
      color: "#FFFFFF",
    },
    furniture: [],
    wallColor: "#FFFFFF",
    flooring: "hardwood",
    windows: "standard",
    decor: [],
    costs: {
      materials: 0,
      furniture: 0,
      labor: 0,
      total: 0,
    },
  })

  // Selected items
  const [selectedWallColor, setSelectedWallColor] = useState("#FFFFFF")
  const [selectedFurniture, setSelectedFurniture] = useState<number[]>([])
  const [totalCost, setTotalCost] = useState(0)
  const [isPreviewMode, setIsPreviewMode] = useState(false)
  const [customizationHistory, setCustomizationHistory] = useState<any[]>([])
  const [selectedTemplate, setSelectedTemplate] = useState<any>(null)
  const [selectedMaterials, setSelectedMaterials] = useState<any[]>([])
  const [lightingSettings, setLightingSettings] = useState({
    type: "natural",
    intensity: 0.5,
  })

  // Pan Responder for 3D view
  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onPanResponderMove: (_, gesture) => {
        if (customization.viewMode === "3D") {
          // Use horizontal movement (dx) for rotation around Y axis and vertical (dy) for X axis
          const newRotateY = gesture.dx / 100
          const newRotateX = gesture.dy / 100
          rotateYAnim.setValue(newRotateY)
          rotateXAnim.setValue(newRotateX)
        }
      },
      onPanResponderRelease: () => {
        Animated.spring(panAnim, {
          toValue: { x: 0, y: 0 },
          useNativeDriver: false,
        }).start()
      },
    }),
  ).current

  // Design Templates
  const designTemplates: DesignTemplate[] = [
    {
      id: "modern",
      name: "Modern Minimalist",
      description: "Clean lines and minimal decoration",
      preview: "modern%20minimalist%20interior%20design",
      style: {
        wallColor: "#FFFFFF",
        materials: ["paint"],
        lighting: {
          type: "cool",
          intensity: 0.7,
          color: "#F5F5F5",
        },
      },
    },
    {
      id: "cozy",
      name: "Cozy Traditional",
      description: "Warm and inviting atmosphere",
      preview: "cozy%20traditional%20interior%20design",
      style: {
        wallColor: "#FFF5E1",
        materials: ["wallpaper"],
        lighting: {
          type: "warm",
          intensity: 0.6,
          color: "#FFE4B5",
        },
      },
    },
    {
      id: "industrial",
      name: "Industrial Loft",
      description: "Raw materials and urban style",
      preview: "industrial%20loft%20interior%20design",
      style: {
        wallColor: "#E8E8E8",
        materials: ["stone"],
        lighting: {
          type: "ambient",
          intensity: 0.8,
          color: "#D3D3D3",
        },
      },
    },
  ]

  // Material Options
  const materialOptions = [
    {
      type: "paint",
      name: "Premium Paint",
      price: 35,
      colors: ["#FFFFFF", "#F5F5F5", "#FAFAFA", "#F0F0F0"],
    },
    {
      type: "wallpaper",
      name: "Designer Wallpaper",
      price: 55,
      patterns: ["floral", "geometric", "abstract", "solid"],
    },
    {
      type: "wood",
      name: "Wood Paneling",
      price: 85,
      finishes: ["natural", "dark", "white-wash", "mahogany"],
    },
    {
      type: "stone",
      name: "Stone Veneer",
      price: 120,
      types: ["slate", "marble", "granite", "travertine"],
    },
    {
      type: "tile",
      name: "Ceramic Tile",
      price: 95,
      styles: ["modern", "classic", "mosaic", "subway"],
    },
  ]

  // Furniture Options
  const furnitureOptions = [
    {
      category: "seating",
      items: [
        {
          id: "sofa1",
          name: "Modern Sofa",
          price: 1200,
          image: "modern%20minimalist%20sofa",
          dimensions: '84"W x 38"D x 34"H',
        },
        {
          id: "chair1",
          name: "Accent Chair",
          price: 450,
          image: "modern%20accent%20chair",
          dimensions: '28"W x 32"D x 33"H',
        },
      ],
    },
    {
      category: "tables",
      items: [
        {
          id: "coffee1",
          name: "Coffee Table",
          price: 350,
          image: "modern%20coffee%20table",
          dimensions: '48"W x 24"D x 18"H',
        },
        {
          id: "dining1",
          name: "Dining Table",
          price: 800,
          image: "modern%20dining%20table",
          dimensions: '72"W x 36"D x 30"H',
        },
      ],
    },
  ]

  // Lighting Options
  const lightingOptions = {
    types: [
      { id: "warm", name: "Warm", color: "#FFE4B5" },
      { id: "cool", name: "Cool", color: "#F5F5F5" },
      { id: "natural", name: "Natural", color: "#FFFFFF" },
      { id: "ambient", name: "Ambient", color: "#D3D3D3" },
    ],
    intensities: [
      { level: 0.2, name: "Dim" },
      { level: 0.5, name: "Medium" },
      { level: 0.8, name: "Bright" },
      { level: 1.0, name: "Full" },
    ],
  }

  // Flooring Options
  const flooringOptions = [
    {
      type: "hardwood",
      name: "Hardwood",
      price: 12,
      variants: ["oak", "maple", "walnut", "cherry"],
    },
    {
      type: "tile",
      name: "Ceramic Tile",
      price: 8,
      variants: ["porcelain", "natural stone", "marble", "slate"],
    },
    {
      type: "carpet",
      name: "Carpet",
      price: 5,
      variants: ["plush", "berber", "frieze", "loop"],
    },
    {
      type: "vinyl",
      name: "Luxury Vinyl",
      price: 6,
      variants: ["wood-look", "stone-look", "abstract", "solid"],
    },
  ]

  // Wall Colors
  const wallColors = [
    { color: "#FFFFFF", name: "Classic White", price: 35 },
    { color: "#F5E6E8", name: "Soft Pink", price: 40 },
    { color: "#D7E4C0", name: "Sage Green", price: 45 },
    { color: "#E6E6FA", name: "Lavender", price: 42 },
    { color: "#F5F5DC", name: "Beige", price: 38 },
    { color: "#E8F4F8", name: "Sky Blue", price: 40 },
    { color: "#FFF5E1", name: "Warm Cream", price: 37 },
    { color: "#E8E8E8", name: "Light Gray", price: 35 },
    { color: "#FFE4E1", name: "Misty Rose", price: 43 },
    { color: "#F0FFF0", name: "Honeydew", price: 41 },
  ]

  // Furniture Items
  const furnitureItems = [
    {
      id: 1,
      name: "Modern Sofa",
      price: 899,
      dimensions: '84"W x 38"D x 34"H',
      material: "Premium Fabric",
      colors: ["Gray", "Blue", "Beige"],
      image: "modern%20minimalist%20sofa%20in%20living%20room",
    },
    {
      id: 2,
      name: "Coffee Table",
      price: 299,
      dimensions: '48"W x 24"D x 18"H',
      material: "Solid Wood",
      colors: ["Walnut", "Oak", "Cherry"],
      image: "modern%20coffee%20table%20with%20wooden%20finish",
    },
    {
      id: 3,
      name: "Floor Lamp",
      price: 149,
      dimensions: '15"W x 15"D x 63"H',
      material: "Metal & Fabric",
      colors: ["Black", "Gold", "Silver"],
      image: "contemporary%20floor%20lamp%20with%20warm%20light",
    },
    {
      id: 4,
      name: "Dining Set",
      price: 1299,
      dimensions: 'Table: 72"W x 36"D x 30"H',
      material: "Wood & Metal",
      colors: ["Natural", "Dark", "White"],
      image: "modern%20dining%20table%20set%20with%20chairs",
    },
    {
      id: 5,
      name: "Accent Chair",
      price: 499,
      dimensions: '28"W x 32"D x 33"H',
      material: "Velvet",
      colors: ["Navy", "Emerald", "Rose"],
      image: "luxurious%20accent%20chair%20velvet%20finish",
    },
    {
      id: 6,
      name: "Bookshelf",
      price: 399,
      dimensions: '36"W x 12"D x 72"H',
      material: "Metal & Wood",
      colors: ["Black", "White", "Bronze"],
      image: "modern%20bookshelf%20with%20metal%20frame",
    },
  ]

  // Effects
  useEffect(() => {
    if (!property) {
      toast.error("Property data not found")
      navigation.goBack()
      return
    }

    // Initial animations
    Animated.parallel([
      Animated.spring(scaleAnim, {
        toValue: 1,
        tension: 20,
        friction: 7,
        useNativeDriver: true,
      }),
      Animated.timing(rotateXAnim, {
        toValue: 0,
        duration: 500,
        useNativeDriver: true,
      }),
    ]).start()
  }, [navigation.goBack, rotateXAnim, property, scaleAnim])

  // Update costs whenever customization changes
  useEffect(() => {
    calculateTotalCost()
  }, [customization])

  // Update total cost whenever selections change
  useEffect(() => {
    updateTotalCost()
  }, [selectedMaterials, selectedFurniture, selectedWallColor])

  // Functions
  const calculateTotalCost = () => {
    // Calculate costs from customization object
    const materialsCost = Array.isArray(customization.materials)
      ? customization.materials.reduce((total, material) => {
          const materialOption = materialOptions.find((m) => m.type === material)
          return total + (materialOption?.price || 0)
        }, 0)
      : 0

    const furnitureCost = Array.isArray(customization.furniture)
      ? customization.furniture.reduce((total, furnitureId) => {
          const furniture = furnitureOptions.flatMap((cat) => cat.items).find((item) => item.id === furnitureId)
          return total + (furniture?.price || 0)
        }, 0)
      : 0

    const laborCost = estimateLabor()

    setCustomization((prev) => ({
      ...prev,
      costs: {
        materials: materialsCost,
        furniture: furnitureCost,
        labor: laborCost,
        total: materialsCost + furnitureCost + laborCost,
      },
    }))
  }

  const updateTotalCost = () => {
    const materialsCost = Array.isArray(selectedMaterials)
      ? selectedMaterials.reduce((sum, mat) => sum + (mat.price || 0), 0)
      : 0

    const furnitureCost = Array.isArray(selectedFurniture)
      ? selectedFurniture.reduce((sum, id) => {
          const item = furnitureItems.find((item) => item.id === id)
          return sum + (item ? item.price : 0)
        }, 0)
      : 0

    const wallColor = wallColors.find((color) => color.color === selectedWallColor)
    const wallCost = wallColor ? wallColor.price : 0

    setTotalCost(materialsCost + furnitureCost + wallCost)
  }

  const handleViewModeChange = (mode: ViewMode) => {
    // Reset animations
    Animated.parallel([
      Animated.spring(scaleAnim, {
        toValue: 1,
        tension: 20,
        friction: 7,
        useNativeDriver: true,
      }),
      Animated.timing(rotateXAnim, {
        // Corrected to rotateXAnim
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }),
    ]).start()

    setCustomization((prev) => ({
      ...prev,
      viewMode: mode,
    }))
  }

  const applyTemplate = (template: DesignTemplate) => {
    setCustomization((prev) => ({
      ...prev,
      ...template.style,
    }))

    // Animate changes
    Animated.sequence([
      Animated.timing(scaleAnim, {
        toValue: 0.95,
        duration: 150,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        tension: 20,
        friction: 7,
        useNativeDriver: true,
      }),
    ]).start()

    toast.success(`Applied ${template.name} template`)
  }

  const handleSave = async () => {
    try {
      // Save customization
      const savedDesign = {
        id: Date.now().toString(),
        timestamp: new Date(),
        property: property,
        customization: customization,
        preview: `https://api.a0.dev/assets/image?text=${property?.title || "property"}%20customized%20interior&aspect=16:9`,
      }

      // In a real app, this would save to a backend
      toast.success("Design saved successfully!")
      navigation.goBack()
    } catch (error) {
      toast.error("Failed to save design")
    }
  }

  const handleShare = async () => {
    try {
      const designData = {
        property: property,
        customization: customization,
        timestamp: new Date(),
        preview: `https://api.a0.dev/assets/image?text=${property?.title || "property"}%20customized%20interior&aspect=16:9`,
        wallColor: selectedWallColor,
        furniture: selectedFurniture,
        materials: selectedMaterials || [],
        lighting: lightingSettings,
        totalCost,
        version: "1.0",
        id: Date.now().toString(),
      }

      // Generate unique link
      const uniqueId = Math.random().toString(36).substr(2, 9)
      const shareableLink = `https://yourapp.com/designs/${uniqueId}`

      // Save to history
      setCustomizationHistory((prev) => [
        ...prev,
        {
          ...designData,
          shareableLink,
        },
      ])

      toast.success("Design shared successfully!")
    } catch (error) {
      toast.error("Failed to share design")
    }
  }

  const estimateLabor = () => {
    // Basic labor cost calculation
    const baseLabor = 1000
    const complexityFactor = customization.materials.length * 100
    const furnitureFactor = customization.furniture.length * 50
    return baseLabor + complexityFactor + furnitureFactor
  }

  const handleMaterialSelect = (materialType: string) => {
    const material = materialOptions.find((m) => m.type === materialType)
    if (material) {
      setSelectedMaterials((prev) => [...prev, material])
      updateTotalCost()
    }
  }

  const handlePreview = () => {
    setIsPreviewMode(true)
  }

  const handleSaveCustomization = () => {
    // Save current customization to history
    setCustomizationHistory((prev) => [
      ...prev,
      {
        timestamp: new Date(),
        wallColor: selectedWallColor,
        furniture: selectedFurniture,
        materials: selectedMaterials,
        lighting: lightingSettings,
        totalCost,
      },
    ])

    toast.success("Customization saved successfully!")
    navigation.goBack()
  }

  const handleTemplateSelect = (template) => {
    setSelectedTemplate(template)
    setSelectedWallColor(template.wallColor)
    setSelectedFurniture(template.furniture || [])

    // Save to history
    setCustomizationHistory((prev) => [
      ...prev,
      {
        timestamp: new Date(),
        template: template.name,
        wallColor: template.wallColor,
        furniture: template.furniture || [],
      },
    ])
  }

  const [activeTab, setActiveTab] = useState("walls")

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerTop}>
          <HamburgerMenu />
          <Text style={styles.headerTitle}>Customize Property</Text>
          <TouchableOpacity style={styles.notificationButton}>
            <MaterialIcons name="notifications" size={24} color="#333" />
            <View style={styles.notificationBadge}>
              <Text style={styles.notificationCount}>3</Text>
            </View>
          </TouchableOpacity>
        </View>
      </View>{" "}
      {/* Preview Area */}
      {customization.viewMode === "3D" ? (
        <Animated.View
          style={[
            styles.previewContainer,
            {
              transform: [
                { perspective: 1000 },
                { rotateX: rotateXAnim.interpolate({ inputRange: [-2, 2], outputRange: ["-10deg", "10deg"] }) },
                { rotateY: rotateYAnim.interpolate({ inputRange: [-2, 2], outputRange: ["-10deg", "10deg"] }) },
              ],
            },
          ]}
          {...panResponder.panHandlers} // Added pan responder handlers
        >
          <Image
            source={{
              uri: property?.originalImage || "https://api.a0.dev/assets/image?text=property%20image&aspect=16:9",
            }}
            style={styles.previewImage}
          />
          <LinearGradient colors={["rgba(0,0,0,0.0)", "rgba(0,0,0,0.7)"]} style={styles.previewGradient} />
          <View style={[styles.colorOverlay, { backgroundColor: selectedWallColor + "80" }]} />
        </Animated.View>
      ) : (
        <View style={styles.previewContainer}>
          <Image
            source={{
              uri: property?.originalImage || "https://api.a0.dev/assets/image?text=property%20image&aspect=16:9",
            }}
            style={styles.previewImage}
          />
          <LinearGradient colors={["rgba(0,0,0,0.0)", "rgba(0,0,0,0.7)"]} style={styles.previewGradient} />
          <View style={[styles.colorOverlay, { backgroundColor: selectedWallColor + "80" }]} />
        </View>
      )}
      {/* Customization Controls */}
      <View style={styles.controlsContainer}>
        <View style={styles.tabContainer}>
          <TouchableOpacity
            style={[styles.tab, activeTab === "walls" && styles.activeTab]}
            onPress={() => setActiveTab("walls")}
          >
            <MaterialIcons name="format-paint" size={24} color={activeTab === "walls" ? "#2196F3" : "#666"} />
            <Text style={[styles.tabText, activeTab === "walls" && styles.activeTabText]}>Walls</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.tab, activeTab === "furniture" && styles.activeTab]}
            onPress={() => setActiveTab("furniture")}
          >
            <MaterialIcons name="chair" size={24} color={activeTab === "furniture" ? "#2196F3" : "#666"} />
            <Text style={[styles.tabText, activeTab === "furniture" && styles.activeTabText]}>Furniture</Text>
          </TouchableOpacity>
        </View>

        <ScrollView style={styles.optionsContainer}>
          {activeTab === "walls" ? (
            <View style={styles.colorGrid}>
              {wallColors.map((wallColor) => (
                <TouchableOpacity
                  key={wallColor.color}
                  style={[styles.colorOption, selectedWallColor === wallColor.color && styles.selectedColor]}
                  onPress={() => setSelectedWallColor(wallColor.color)}
                >
                  <View style={[styles.colorSwatch, { backgroundColor: wallColor.color }]} />
                  <Text style={styles.colorName}>{wallColor.name}</Text>
                </TouchableOpacity>
              ))}
            </View>
          ) : (
            <View style={styles.furnitureGrid}>
              {furnitureItems.map((item) => (
                <TouchableOpacity
                  key={item.id}
                  style={[styles.furnitureOption, selectedFurniture.includes(item.id) && styles.selectedFurniture]}
                  onPress={() => {
                    if (selectedFurniture.includes(item.id)) {
                      setSelectedFurniture(selectedFurniture.filter((id) => id !== item.id))
                    } else {
                      setSelectedFurniture([...selectedFurniture, item.id])
                    }
                  }}
                >
                  <Image
                    source={{ uri: `https://api.a0.dev/assets/image?text=${item.image}&aspect=1:1` }}
                    style={styles.furnitureImage}
                  />
                  <View style={styles.furnitureDetails}>
                    <Text style={styles.furnitureName}>{item.name}</Text>
                    <Text style={styles.furniturePrice}>${item.price}</Text>
                  </View>
                  <MaterialIcons
                    name={selectedFurniture.includes(item.id) ? "check-circle" : "add-circle-outline"}
                    size={24}
                    color={selectedFurniture.includes(item.id) ? "#2196F3" : "#666"}
                  />
                </TouchableOpacity>
              ))}
            </View>
          )}
        </ScrollView>

        <TouchableOpacity style={styles.saveButton} onPress={handleSaveCustomization}>
          <MaterialIcons name="save" size={24} color="white" />
          <Text style={styles.saveButtonText}>Save Changes</Text>
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
  headerTitle: {
    fontSize: 20,
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
  previewContainer: {
    height: "40%",
    position: "relative",
  },
  previewImage: {
    width: "100%",
    height: "100%",
  },
  previewGradient: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    height: "50%",
  },
  colorOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  controlsContainer: {
    flex: 1,
    backgroundColor: "white",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    marginTop: -20,
    padding: 16,
  },
  tabContainer: {
    flexDirection: "row",
    marginBottom: 16,
    borderRadius: 12,
    backgroundColor: "#f5f5f5",
    padding: 4,
  },
  tab: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 12,
    borderRadius: 8,
  },
  activeTab: {
    backgroundColor: "white",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  tabText: {
    marginLeft: 8,
    fontSize: 16,
    color: "#666",
  },
  activeTabText: {
    color: "#2196F3",
    fontWeight: "600",
  },
  optionsContainer: {
    flex: 1,
  },
  colorGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    padding: 8,
  },
  colorOption: {
    width: "30%",
    alignItems: "center",
    marginBottom: 16,
    padding: 8,
    borderRadius: 8,
    backgroundColor: "white",
  },
  selectedColor: {
    borderWidth: 2,
    borderColor: "#2196F3",
  },
  colorSwatch: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: "#eee",
  },
  colorName: {
    fontSize: 12,
    color: "#666",
    textAlign: "center",
  },
  furnitureGrid: {
    padding: 8,
  },
  furnitureOption: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "white",
    padding: 12,
    borderRadius: 12,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  selectedFurniture: {
    borderWidth: 2,
    borderColor: "#2196F3",
  },
  furnitureImage: {
    width: 80,
    height: 80,
    borderRadius: 8,
    marginRight: 12,
  },
  furnitureDetails: {
    flex: 1,
  },
  furnitureName: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
    marginBottom: 4,
  },
  furniturePrice: {
    fontSize: 14,
    color: "#2196F3",
    fontWeight: "600",
  },
  saveButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#2196F3",
    padding: 16,
    borderRadius: 12,
    marginTop: 16,
  },
  saveButtonText: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
    marginLeft: 8,
  },
})

export default CustomizationScreen

