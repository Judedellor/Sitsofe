"use client"

import { useState } from "react"
import { View, Text, StyleSheet, TextInput, TouchableOpacity, ScrollView, Alert, Image, Platform } from "react-native"
import { Ionicons } from "@expo/vector-icons"
import { useNavigation } from "@react-navigation/native"
import DateTimePicker from "@react-native-community/datetimepicker"
import * as ImagePicker from "expo-image-picker"
import { Picker } from "@react-native-picker/picker"
import { format } from "date-fns"

// Mock data for properties
const MOCK_PROPERTIES = [
  { id: "prop1", name: "123 Main St" },
  { id: "prop2", name: "456 Oak Ave" },
  { id: "prop3", name: "789 Pine Blvd" },
]

// Expense categories
const EXPENSE_CATEGORIES = [
  "Maintenance",
  "Utilities",
  "Taxes",
  "Insurance",
  "Mortgage",
  "HOA Fees",
  "Property Management",
  "Legal",
  "Advertising",
  "Other",
]

const AddExpenseScreen = () => {
  const navigation = useNavigation()
  const [property, setProperty] = useState("")
  const [category, setCategory] = useState("")
  const [amount, setAmount] = useState("")
  const [description, setDescription] = useState("")
  const [date, setDate] = useState(new Date())
  const [showDatePicker, setShowDatePicker] = useState(false)
  const [receiptImage, setReceiptImage] = useState(null)
  const [vendor, setVendor] = useState("")
  const [paymentMethod, setPaymentMethod] = useState("")
  const [isRecurring, setIsRecurring] = useState(false)
  const [notes, setNotes] = useState("")

  const handleSave = () => {
    // Validate inputs
    if (!property) {
      Alert.alert("Error", "Please select a property")
      return
    }

    if (!category) {
      Alert.alert("Error", "Please select a category")
      return
    }

    if (!amount || isNaN(Number.parseFloat(amount))) {
      Alert.alert("Error", "Please enter a valid amount")
      return
    }

    if (!description) {
      Alert.alert("Error", "Please enter a description")
      return
    }

    // Create expense object
    const expense = {
      id: Date.now().toString(),
      propertyId: property,
      category,
      amount: Number.parseFloat(amount),
      description,
      date,
      vendor,
      paymentMethod,
      isRecurring,
      notes,
      receipt: receiptImage,
    }

    // In a real app, you would save this to your backend
    console.log("Saving expense:", expense)

    // Show success message and navigate back
    Alert.alert("Success", "Expense saved successfully", [{ text: "OK", onPress: () => navigation.goBack() }])
  }

  const handleCancel = () => {
    navigation.goBack()
  }

  const handleDateChange = (event, selectedDate) => {
    const currentDate = selectedDate || date
    setShowDatePicker(Platform.OS === "ios")
    setDate(currentDate)
  }

  const pickImage = async () => {
    // Request permissions
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync()

    if (status !== "granted") {
      Alert.alert("Permission Denied", "We need camera roll permissions to upload receipts")
      return
    }

    // Launch image picker
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.8,
    })

    if (!result.canceled) {
      setReceiptImage(result.assets[0].uri)
    }
  }

  const takePicture = async () => {
    // Request permissions
    const { status } = await ImagePicker.requestCameraPermissionsAsync()

    if (status !== "granted") {
      Alert.alert("Permission Denied", "We need camera permissions to take pictures")
      return
    }

    // Launch camera
    const result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.8,
    })

    if (!result.canceled) {
      setReceiptImage(result.assets[0].uri)
    }
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Add New Expense</Text>
      </View>

      <View style={styles.formContainer}>
        {/* Property Selection */}
        <View style={styles.formGroup}>
          <Text style={styles.label}>Property *</Text>
          <View style={styles.pickerContainer}>
            <Picker
              selectedValue={property}
              onValueChange={(itemValue) => setProperty(itemValue)}
              style={styles.picker}
            >
              <Picker.Item label="Select a property" value="" />
              {MOCK_PROPERTIES.map((prop) => (
                <Picker.Item key={prop.id} label={prop.name} value={prop.id} />
              ))}
            </Picker>
          </View>
        </View>

        {/* Category Selection */}
        <View style={styles.formGroup}>
          <Text style={styles.label}>Category *</Text>
          <View style={styles.pickerContainer}>
            <Picker
              selectedValue={category}
              onValueChange={(itemValue) => setCategory(itemValue)}
              style={styles.picker}
            >
              <Picker.Item label="Select a category" value="" />
              {EXPENSE_CATEGORIES.map((cat) => (
                <Picker.Item key={cat} label={cat} value={cat} />
              ))}
            </Picker>
          </View>
        </View>

        {/* Amount */}
        <View style={styles.formGroup}>
          <Text style={styles.label}>Amount ($) *</Text>
          <TextInput
            style={styles.input}
            value={amount}
            onChangeText={setAmount}
            placeholder="0.00"
            keyboardType="decimal-pad"
          />
        </View>

        {/* Description */}
        <View style={styles.formGroup}>
          <Text style={styles.label}>Description *</Text>
          <TextInput
            style={styles.input}
            value={description}
            onChangeText={setDescription}
            placeholder="Brief description of expense"
          />
        </View>

        {/* Date */}
        <View style={styles.formGroup}>
          <Text style={styles.label}>Date *</Text>
          <TouchableOpacity style={styles.datePickerButton} onPress={() => setShowDatePicker(true)}>
            <Text style={styles.dateText}>{format(date, "MMMM d, yyyy")}</Text>
            <Ionicons name="calendar" size={20} color="#0066cc" />
          </TouchableOpacity>
          {showDatePicker && <DateTimePicker value={date} mode="date" display="default" onChange={handleDateChange} />}
        </View>

        {/* Vendor */}
        <View style={styles.formGroup}>
          <Text style={styles.label}>Vendor/Payee</Text>
          <TextInput
            style={styles.input}
            value={vendor}
            onChangeText={setVendor}
            placeholder="Name of vendor or payee"
          />
        </View>

        {/* Payment Method */}
        <View style={styles.formGroup}>
          <Text style={styles.label}>Payment Method</Text>
          <View style={styles.pickerContainer}>
            <Picker
              selectedValue={paymentMethod}
              onValueChange={(itemValue) => setPaymentMethod(itemValue)}
              style={styles.picker}
            >
              <Picker.Item label="Select payment method" value="" />
              <Picker.Item label="Credit Card" value="Credit Card" />
              <Picker.Item label="Debit Card" value="Debit Card" />
              <Picker.Item label="Cash" value="Cash" />
              <Picker.Item label="Check" value="Check" />
              <Picker.Item label="Bank Transfer" value="Bank Transfer" />
              <Picker.Item label="Other" value="Other" />
            </Picker>
          </View>
        </View>

        {/* Recurring Expense */}
        <View style={styles.formGroup}>
          <Text style={styles.label}>Recurring Expense</Text>
          <View style={styles.switchContainer}>
            <TouchableOpacity
              style={[styles.switchOption, !isRecurring && styles.switchOptionSelected]}
              onPress={() => setIsRecurring(false)}
            >
              <Text style={[styles.switchOptionText, !isRecurring && styles.switchOptionTextSelected]}>No</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.switchOption, isRecurring && styles.switchOptionSelected]}
              onPress={() => setIsRecurring(true)}
            >
              <Text style={[styles.switchOptionText, isRecurring && styles.switchOptionTextSelected]}>Yes</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Receipt Image */}
        <View style={styles.formGroup}>
          <Text style={styles.label}>Receipt Image</Text>
          <View style={styles.receiptContainer}>
            {receiptImage ? (
              <View style={styles.receiptImageContainer}>
                <Image source={{ uri: receiptImage }} style={styles.receiptImage} />
                <TouchableOpacity style={styles.removeImageButton} onPress={() => setReceiptImage(null)}>
                  <Ionicons name="close-circle" size={24} color="#ff3b30" />
                </TouchableOpacity>
              </View>
            ) : (
              <View style={styles.receiptButtonsContainer}>
                <TouchableOpacity style={styles.receiptButton} onPress={takePicture}>
                  <Ionicons name="camera" size={24} color="#0066cc" />
                  <Text style={styles.receiptButtonText}>Take Photo</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.receiptButton} onPress={pickImage}>
                  <Ionicons name="images" size={24} color="#0066cc" />
                  <Text style={styles.receiptButtonText}>Upload</Text>
                </TouchableOpacity>
              </View>
            )}
          </View>
        </View>

        {/* Notes */}
        <View style={styles.formGroup}>
          <Text style={styles.label}>Additional Notes</Text>
          <TextInput
            style={[styles.input, styles.textArea]}
            value={notes}
            onChangeText={setNotes}
            placeholder="Any additional details about this expense"
            multiline
            numberOfLines={4}
            textAlignVertical="top"
          />
        </View>

        {/* Action Buttons */}
        <View style={styles.actionButtons}>
          <TouchableOpacity style={styles.cancelButton} onPress={handleCancel}>
            <Text style={styles.cancelButtonText}>Cancel</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
            <Text style={styles.saveButtonText}>Save Expense</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8f9fa",
  },
  header: {
    padding: 16,
    backgroundColor: "#ffffff",
    borderBottomWidth: 1,
    borderBottomColor: "#e1e4e8",
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#333333",
  },
  formContainer: {
    padding: 16,
  },
  formGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 8,
    color: "#333333",
  },
  input: {
    backgroundColor: "#ffffff",
    borderWidth: 1,
    borderColor: "#cccccc",
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
  },
  textArea: {
    height: 100,
  },
  pickerContainer: {
    backgroundColor: "#ffffff",
    borderWidth: 1,
    borderColor: "#cccccc",
    borderRadius: 8,
    overflow: "hidden",
  },
  picker: {
    height: 50,
    width: "100%",
  },
  datePickerButton: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#ffffff",
    borderWidth: 1,
    borderColor: "#cccccc",
    borderRadius: 8,
    padding: 12,
  },
  dateText: {
    fontSize: 16,
    color: "#333333",
  },
  switchContainer: {
    flexDirection: "row",
    backgroundColor: "#f0f0f0",
    borderRadius: 8,
    overflow: "hidden",
  },
  switchOption: {
    flex: 1,
    paddingVertical: 12,
    alignItems: "center",
  },
  switchOptionSelected: {
    backgroundColor: "#0066cc",
  },
  switchOptionText: {
    fontSize: 16,
    color: "#555555",
  },
  switchOptionTextSelected: {
    color: "#ffffff",
    fontWeight: "600",
  },
  receiptContainer: {
    backgroundColor: "#ffffff",
    borderWidth: 1,
    borderColor: "#cccccc",
    borderRadius: 8,
    padding: 16,
    minHeight: 120,
    justifyContent: "center",
    alignItems: "center",
  },
  receiptButtonsContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    width: "100%",
  },
  receiptButton: {
    alignItems: "center",
    padding: 12,
  },
  receiptButtonText: {
    marginTop: 8,
    color: "#0066cc",
    fontSize: 14,
  },
  receiptImageContainer: {
    width: "100%",
    position: "relative",
  },
  receiptImage: {
    width: "100%",
    height: 200,
    borderRadius: 8,
    resizeMode: "cover",
  },
  removeImageButton: {
    position: "absolute",
    top: 8,
    right: 8,
    backgroundColor: "#ffffff",
    borderRadius: 12,
  },
  actionButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 20,
  },
  cancelButton: {
    flex: 1,
    backgroundColor: "#f0f0f0",
    borderRadius: 8,
    padding: 16,
    alignItems: "center",
    marginRight: 8,
  },
  cancelButtonText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#555555",
  },
  saveButton: {
    flex: 2,
    backgroundColor: "#0066cc",
    borderRadius: 8,
    padding: 16,
    alignItems: "center",
    marginLeft: 8,
  },
  saveButtonText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#ffffff",
  },
})

export default AddExpenseScreen

