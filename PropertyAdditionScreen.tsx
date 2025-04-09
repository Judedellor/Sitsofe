"use client"

import { useState } from "react"
import { View, Text, StyleSheet, ScrollView, TextInput, TouchableOpacity, Image, Alert } from "react-native"
import { MaterialIcons } from "@expo/vector-icons"
import { toast } from "sonner-native"
import HamburgerMenu from "../../components/HamburgerMenu"

const PropertyAdditionScreen = ({ navigation }) => {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    price: "",
    location: "",
    bedrooms: "",
    bathrooms: "",
    sqft: "",
    propertyType: "apartment",
    images: [],
    amenities: [],
    rules: [],
    availability: {
      immediate: true,
      dateRange: null,
    },
    verificationStatus: "pending",
    documents: [],
    pricing: {
      basePrice: "",
      utilities: "",
      deposit: "",
      cleaningFee: "",
      minimumStay: "1",
    },
    features: {
      parking: false,
      pool: false,
      gym: false,
      security: false,
      petsAllowed: false,
      furnished: false,
    },
    verification: {
      identityVerified: false,
      documentsSubmitted: false,
      inspectionScheduled: false,
      insuranceValid: false,
    },
  })

  const [uploadProgress, setUploadProgress] = useState(0)
  const [verificationSteps, setVerificationSteps] = useState({
    basicInfo: false,
    images: false,
    documents: false,
    verification: false,
  })

  const amenitiesList = [
    { id: "wifi", label: "WiFi", icon: "wifi" },
    { id: "parking", label: "Parking", icon: "local-parking" },
    { id: "pool", label: "Pool", icon: "pool" },
    { id: "gym", label: "Gym", icon: "fitness-center" },
    { id: "ac", label: "Air Conditioning", icon: "ac-unit" },
    { id: "pets", label: "Pet Friendly", icon: "pets" },
  ]

  const handleImageUpload = async (image) => {
    try {
      setUploadProgress(0)
      // Simulate upload progress
      const interval = setInterval(() => {
        setUploadProgress((prev) => {
          if (prev >= 100) {
            clearInterval(interval)
            return 100
          }
          return prev + 10
        })
      }, 500)

      // Add image to state
      setFormData((prev) => ({
        ...prev,
        images: [...prev.images, image],
      }))

      toast.success("Image uploaded successfully!")
    } catch (error) {
      toast.error("Failed to upload image")
    }
  }

  const verifyProperty = async () => {
    try {
      // Verification logic here
      setFormData((prev) => ({
        ...prev,
        verificationStatus: "verified",
      }))
      toast.success("Property verified successfully!")
    } catch (error) {
      toast.error("Verification failed")
    }
  }

  const propertyTypes = [
    { id: "apartment", label: "Apartment" },
    { id: "house", label: "House" },
    { id: "villa", label: "Villa" },
    { id: "studio", label: "Studio" },
  ]

  const addImage = () => {
    // In a real app, this would open image picker
    const newImage = `https://api.a0.dev/assets/image?text=modern%20${formData.propertyType}%20interior&aspect=16:9`
    setFormData((prev) => ({
      ...prev,
      images: [...prev.images, newImage],
    }))
  }

  const handleSubmit = () => {
    // Validate form
    if (!formData.title || !formData.price || !formData.location) {
      Alert.alert("Error", "Please fill in all required fields")
      return
    }

    // In a real app, this would make an API call
    console.log("Submitting property:", formData)
    navigation.navigate("OwnerDashboard")
  }
  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <View style={styles.headerTop}>
          <HamburgerMenu />
          <Text style={styles.headerTitle}>Add New Property</Text>
          <TouchableOpacity style={styles.closeButton} onPress={() => navigation.goBack()}>
            <MaterialIcons name="close" size={24} color="#333" />
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.content}>
        {/* Images Section */}
        <View style={styles.imagesSection}>
          <Text style={styles.sectionTitle}>Property Images</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.imageScroll}>
            {formData.images.map((image, index) => (
              <View key={index} style={styles.imageContainer}>
                <Image source={{ uri: image }} style={styles.propertyImage} />
                <TouchableOpacity
                  style={styles.removeImageButton}
                  onPress={() => {
                    setFormData((prev) => ({
                      ...prev,
                      images: prev.images.filter((_, i) => i !== index),
                    }))
                  }}
                >
                  <MaterialIcons name="close" size={20} color="white" />
                </TouchableOpacity>
              </View>
            ))}
            <TouchableOpacity style={styles.addImageButton} onPress={addImage}>
              <MaterialIcons name="add-photo-alternate" size={32} color="#2196F3" />
              <Text style={styles.addImageText}>Add Image</Text>
            </TouchableOpacity>
          </ScrollView>
        </View>

        {/* Basic Information */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Basic Information</Text>

          <TextInput
            style={styles.input}
            placeholder="Property Title*"
            value={formData.title}
            onChangeText={(text) => setFormData((prev) => ({ ...prev, title: text }))}
          />

          <TextInput
            style={[styles.input, styles.textArea]}
            placeholder="Description"
            multiline
            numberOfLines={4}
            value={formData.description}
            onChangeText={(text) => setFormData((prev) => ({ ...prev, description: text }))}
          />

          <TextInput
            style={styles.input}
            placeholder="Monthly Price*"
            keyboardType="numeric"
            value={formData.price}
            onChangeText={(text) => setFormData((prev) => ({ ...prev, price: text }))}
          />

          <TextInput
            style={styles.input}
            placeholder="Location*"
            value={formData.location}
            onChangeText={(text) => setFormData((prev) => ({ ...prev, location: text }))}
          />
        </View>

        {/* Property Type */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Property Type</Text>
          <View style={styles.propertyTypeContainer}>
            {propertyTypes.map((type) => (
              <TouchableOpacity
                key={type.id}
                style={[styles.propertyTypeButton, formData.propertyType === type.id && styles.selectedPropertyType]}
                onPress={() => setFormData((prev) => ({ ...prev, propertyType: type.id }))}
              >
                <Text
                  style={[
                    styles.propertyTypeText,
                    formData.propertyType === type.id && styles.selectedPropertyTypeText,
                  ]}
                >
                  {type.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Details */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Property Details</Text>
          <View style={styles.detailsGrid}>
            <View style={styles.detailInput}>
              <MaterialIcons name="king-bed" size={20} color="#666" />
              <TextInput
                style={styles.detailTextInput}
                placeholder="Bedrooms"
                keyboardType="numeric"
                value={formData.bedrooms}
                onChangeText={(text) => setFormData((prev) => ({ ...prev, bedrooms: text }))}
              />
            </View>
            <View style={styles.detailInput}>
              <MaterialIcons name="bathroom" size={20} color="#666" />
              <TextInput
                style={styles.detailTextInput}
                placeholder="Bathrooms"
                keyboardType="numeric"
                value={formData.bathrooms}
                onChangeText={(text) => setFormData((prev) => ({ ...prev, bathrooms: text }))}
              />
            </View>
            <View style={styles.detailInput}>
              <MaterialIcons name="square-foot" size={20} color="#666" />
              <TextInput
                style={styles.detailTextInput}
                placeholder="Square Feet"
                keyboardType="numeric"
                value={formData.sqft}
                onChangeText={(text) => setFormData((prev) => ({ ...prev, sqft: text }))}
              />
            </View>
          </View>
        </View>

        {/* Submit Button */}
        <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
          <MaterialIcons name="add-home" size={24} color="white" />
          <Text style={styles.submitButtonText}>List Property</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
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
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#333",
  },
  closeButton: {
    padding: 8,
  },
  content: {
    padding: 16,
  },
  imagesSection: {
    marginBottom: 24,
  },
  imageScroll: {
    flexGrow: 0,
    marginTop: 12,
  },
  imageContainer: {
    marginRight: 12,
    borderRadius: 12,
    overflow: "hidden",
    position: "relative",
  },
  propertyImage: {
    width: 200,
    height: 150,
    borderRadius: 12,
  },
  removeImageButton: {
    position: "absolute",
    top: 8,
    right: 8,
    backgroundColor: "rgba(0,0,0,0.5)",
    borderRadius: 15,
    padding: 6,
  },
  addImageButton: {
    width: 200,
    height: 150,
    backgroundColor: "#f0f7ff",
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 2,
    borderColor: "#2196F3",
    borderStyle: "dashed",
  },
  addImageText: {
    color: "#2196F3",
    marginTop: 8,
    fontWeight: "600",
  },
  section: {
    backgroundColor: "white",
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 16,
  },
  input: {
    backgroundColor: "#f8f8f8",
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
    fontSize: 16,
    color: "#333",
  },
  textArea: {
    height: 100,
    textAlignVertical: "top",
  },
  propertyTypeContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginHorizontal: -4,
  },
  propertyTypeButton: {
    flex: 1,
    minWidth: "45%",
    margin: 4,
    padding: 12,
    borderRadius: 8,
    backgroundColor: "#f8f8f8",
    alignItems: "center",
  },
  selectedPropertyType: {
    backgroundColor: "#2196F3",
  },
  propertyTypeText: {
    color: "#666",
    fontSize: 14,
    fontWeight: "600",
  },
  selectedPropertyTypeText: {
    color: "white",
  },
  detailsGrid: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  detailInput: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f8f8f8",
    borderRadius: 8,
    padding: 12,
    marginHorizontal: 4,
  },
  detailTextInput: {
    marginLeft: 8,
    flex: 1,
    fontSize: 16,
    color: "#333",
  },
  submitButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#2196F3",
    padding: 16,
    borderRadius: 12,
    marginTop: 24,
  },
  submitButtonText: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
    marginLeft: 8,
  },
})

export default PropertyAdditionScreen

