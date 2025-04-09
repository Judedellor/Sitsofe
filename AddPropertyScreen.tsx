"use client"

import { useState } from "react"
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert, ActivityIndicator, Platform } from "react-native"
import { SafeAreaView } from "react-native-safe-area-context"
import { COLORS } from "./constants/colors"
import FormInput from "./components/ui/FormInput"
import Button from "./components/ui/Button"
import { Ionicons } from "@expo/vector-icons"
import { useNavigation } from "@react-navigation/native"
import MediaPicker, { type MediaItem } from "./components/MediaPicker"

// Property types
const propertyTypes = [
  "Single Family Home",
  "Apartment",
  "Condo",
  "Townhouse",
  "Duplex",
  "Commercial",
  "Vacation",
  "Other",
]

const AddPropertyScreen = () => {
  const navigation = useNavigation()

  // Form state
  const [name, setName] = useState("")
  const [address, setAddress] = useState("")
  const [city, setCity] = useState("")
  const [state, setState] = useState("")
  const [zipCode, setZipCode] = useState("")
  const [propertyType, setPropertyType] = useState("")
  const [bedrooms, setBedrooms] = useState("")
  const [bathrooms, setBathrooms] = useState("")
  const [squareFeet, setSquareFeet] = useState("")
  const [yearBuilt, setYearBuilt] = useState("")
  const [description, setDescription] = useState("")
  const [rentAmount, setRentAmount] = useState("")
  const [depositAmount, setDepositAmount] = useState("")
  const [isAvailable, setIsAvailable] = useState(true)

  // Media state
  const [mediaItems, setMediaItems] = useState<MediaItem[]>([])

  // Loading state
  const [isLoading, setIsLoading] = useState(false)

  // Handle save property
  const handleSaveProperty = () => {
    // Validate required fields
    if (!name || !address || !city || !state || !zipCode || !propertyType) {
      Alert.alert("Error", "Please fill in all required fields")
      return
    }

    setIsLoading(true)

    console.log("Media items:", mediaItems)
    // In a real app, you would upload these files to your server
    // and store the URLs in your database

    // Simulate API call
    setTimeout(() => {
      setIsLoading(false)
      Alert.alert("Success", "Property added successfully", [
        {
          text: "OK",
          onPress: () => navigation.goBack(),
        },
      ])
    }, 1500)
  }

  const [showTypeSelector, setShowTypeSelector] = useState(false)

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color={COLORS.darkGray} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Add New Property</Text>
      </View>

      <ScrollView style={styles.content}>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Property Information</Text>

          <FormInput
            label="Property Name"
            value={name}
            onChangeText={setName}
            placeholder="Enter property name"
            required
          />

          <FormInput
            label="Address"
            value={address}
            onChangeText={setAddress}
            placeholder="Enter street address"
            required
          />

          <View style={styles.row}>
            <View style={styles.halfInput}>
              <FormInput label="City" value={city} onChangeText={setCity} placeholder="Enter city" required />
            </View>

            <View style={styles.halfInput}>
              <FormInput label="State" value={state} onChangeText={setState} placeholder="Enter state" required />
            </View>
          </View>

          <FormInput
            label="Zip Code"
            value={zipCode}
            onChangeText={setZipCode}
            placeholder="Enter zip code"
            keyboardType="numeric"
            required
          />

          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>
              Property Type <Text style={styles.requiredStar}>*</Text>
            </Text>
            <TouchableOpacity style={styles.selector} onPress={() => setShowTypeSelector(!showTypeSelector)}>
              <Text style={[styles.selectorText, !propertyType && styles.placeholderText]}>
                {propertyType || "Select property type"}
              </Text>
              <Ionicons name="chevron-down" size={20} color={COLORS.gray} />
            </TouchableOpacity>

            {showTypeSelector && (
              <View style={styles.optionsContainer}>
                {propertyTypes.map((type) => (
                  <TouchableOpacity
                    key={type}
                    style={styles.optionItem}
                    onPress={() => {
                      setPropertyType(type)
                      setShowTypeSelector(false)
                    }}
                  >
                    <Text style={[styles.optionText, propertyType === type && styles.selectedOptionText]}>{type}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            )}
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Property Details</Text>

          <View style={styles.row}>
            <View style={styles.halfInput}>
              <FormInput
                label="Bedrooms"
                value={bedrooms}
                onChangeText={setBedrooms}
                placeholder="Number of bedrooms"
                keyboardType="numeric"
              />
            </View>

            <View style={styles.halfInput}>
              <FormInput
                label="Bathrooms"
                value={bathrooms}
                onChangeText={setBathrooms}
                placeholder="Number of bathrooms"
                keyboardType="numeric"
              />
            </View>
          </View>

          <View style={styles.row}>
            <View style={styles.halfInput}>
              <FormInput
                label="Square Feet"
                value={squareFeet}
                onChangeText={setSquareFeet}
                placeholder="Property size"
                keyboardType="numeric"
              />
            </View>

            <View style={styles.halfInput}>
              <FormInput
                label="Year Built"
                value={yearBuilt}
                onChangeText={setYearBuilt}
                placeholder="Construction year"
                keyboardType="numeric"
              />
            </View>
          </View>

          <FormInput
            label="Description"
            value={description}
            onChangeText={setDescription}
            placeholder="Enter property description"
            multiline
            numberOfLines={4}
            style={styles.textArea}
          />
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Financial Details</Text>

          <View style={styles.row}>
            <View style={styles.halfInput}>
              <FormInput
                label="Monthly Rent"
                value={rentAmount}
                onChangeText={setRentAmount}
                placeholder="Enter amount"
                keyboardType="numeric"
                prefix="$"
              />
            </View>

            <View style={styles.halfInput}>
              <FormInput
                label="Security Deposit"
                value={depositAmount}
                onChangeText={setDepositAmount}
                placeholder="Enter amount"
                keyboardType="numeric"
                prefix="$"
              />
            </View>
          </View>

          <View style={styles.switchContainer}>
            <Text style={styles.switchLabel}>Available for Rent</Text>
            <TouchableOpacity
              style={[styles.switch, isAvailable && styles.switchActive]}
              onPress={() => setIsAvailable(!isAvailable)}
            >
              <View style={[styles.switchThumb, isAvailable && styles.switchThumbActive]} />
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Property Images & Videos</Text>

          <MediaPicker
            media={mediaItems}
            onMediaChange={setMediaItems}
            maxItems={10}
            allowVideo={true}
            title="Add photos and videos of your property"
          />
        </View>

        <View style={styles.buttonContainer}>
          <Button title="Cancel" onPress={() => navigation.goBack()} type="outline" style={styles.cancelButton} />

          <Button
            title={isLoading ? "Saving..." : "Save Property"}
            onPress={handleSaveProperty}
            type="primary"
            style={styles.saveButton}
            disabled={isLoading}
            icon={isLoading ? <ActivityIndicator size="small" color={COLORS.white} /> : null}
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
  content: {
    flex: 1,
    padding: 16,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: COLORS.darkGray,
    marginBottom: 16,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  halfInput: {
    width: "48%",
  },
  textArea: {
    height: 100,
    textAlignVertical: "top",
  },
  inputContainer: {
    marginBottom: 16,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: "500",
    color: COLORS.darkGray,
    marginBottom: 8,
  },
  requiredStar: {
    color: COLORS.error,
  },
  selector: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderWidth: 1,
    borderColor: COLORS.lightGray,
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: COLORS.white,
  },
  selectorText: {
    fontSize: 16,
    color: COLORS.darkGray,
  },
  placeholderText: {
    color: COLORS.gray,
  },
  optionsContainer: {
    marginTop: 4,
    borderWidth: 1,
    borderColor: COLORS.lightGray,
    borderRadius: 8,
    backgroundColor: COLORS.white,
    position: "absolute",
    top: 80,
    left: 0,
    right: 0,
    zIndex: 10,
    maxHeight: 200,
    overflow: "scroll",
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
  optionItem: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.lightGray,
  },
  optionText: {
    fontSize: 16,
    color: COLORS.darkGray,
  },
  selectedOptionText: {
    color: COLORS.primary,
    fontWeight: "500",
  },
  switchContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 16,
  },
  switchLabel: {
    fontSize: 16,
    color: COLORS.darkGray,
  },
  switch: {
    width: 50,
    height: 28,
    borderRadius: 14,
    backgroundColor: COLORS.lightGray,
    padding: 2,
  },
  switchActive: {
    backgroundColor: COLORS.primaryLight,
  },
  switchThumb: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: COLORS.gray,
  },
  switchThumbActive: {
    backgroundColor: COLORS.primary,
    transform: [{ translateX: 22 }],
  },
  imagesContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
  },
  imageContainer: {
    width: "48%",
    aspectRatio: 1,
    marginBottom: 16,
    marginRight: "4%",
    position: "relative",
  },
  propertyImage: {
    width: "100%",
    height: "100%",
    borderRadius: 8,
  },
  removeImageButton: {
    position: "absolute",
    top: 8,
    right: 8,
    backgroundColor: COLORS.white,
    borderRadius: 12,
  },
  addImageButton: {
    width: "48%",
    aspectRatio: 1,
    borderWidth: 2,
    borderColor: COLORS.lightGray,
    borderStyle: "dashed",
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
  },
  addImageText: {
    marginTop: 8,
    fontSize: 14,
    color: COLORS.primary,
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 16,
    marginBottom: 32,
  },
  cancelButton: {
    flex: 1,
    marginRight: 8,
  },
  saveButton: {
    flex: 1,
    marginLeft: 8,
  },
})

export default AddPropertyScreen

