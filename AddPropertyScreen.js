"use client"

import { useState } from "react"
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  TouchableOpacity,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from "react-native"
import { Ionicons } from "@expo/vector-icons"

const AddPropertyScreen = ({ navigation }) => {
  const [formData, setFormData] = useState({
    name: "",
    address: "",
    type: "",
    units: "",
    rent: "",
    imageUrl: "https://via.placeholder.com/150",
  })

  const [errors, setErrors] = useState({})

  const handleChange = (field, value) => {
    setFormData({
      ...formData,
      [field]: value,
    })

    // Clear error when user types
    if (errors[field]) {
      setErrors({
        ...errors,
        [field]: null,
      })
    }
  }

  const validateForm = () => {
    const newErrors = {}

    if (!formData.name.trim()) {
      newErrors.name = "Property name is required"
    }

    if (!formData.address.trim()) {
      newErrors.address = "Address is required"
    }

    if (!formData.type.trim()) {
      newErrors.type = "Property type is required"
    }

    if (!formData.units.trim()) {
      newErrors.units = "Number of units is required"
    } else if (isNaN(Number(formData.units)) || Number(formData.units) <= 0) {
      newErrors.units = "Units must be a positive number"
    }

    if (!formData.rent.trim()) {
      newErrors.rent = "Monthly rent is required"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = () => {
    if (validateForm()) {
      // In a real app, we would call an API to save the property
      // For now, we'll just show an alert and navigate back
      Alert.alert("Success", `Property "${formData.name}" has been added successfully!`, [
        {
          text: "OK",
          onPress: () => navigation.goBack(),
        },
      ])
    } else {
      // Scroll to the first error field
      Alert.alert("Error", "Please fill in all required fields correctly")
    }
  }

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      keyboardVerticalOffset={Platform.OS === "ios" ? 64 : 0}
    >
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color="#333" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Add New Property</Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView style={styles.formContainer}>
        <View style={styles.formGroup}>
          <Text style={styles.label}>Property Name</Text>
          <TextInput
            style={[styles.input, errors.name && styles.inputError]}
            placeholder="Enter property name"
            value={formData.name}
            onChangeText={(text) => handleChange("name", text)}
          />
          {errors.name && <Text style={styles.errorText}>{errors.name}</Text>}
        </View>

        <View style={styles.formGroup}>
          <Text style={styles.label}>Address</Text>
          <TextInput
            style={[styles.input, errors.address && styles.inputError]}
            placeholder="Enter property address"
            value={formData.address}
            onChangeText={(text) => handleChange("address", text)}
          />
          {errors.address && <Text style={styles.errorText}>{errors.address}</Text>}
        </View>

        <View style={styles.formGroup}>
          <Text style={styles.label}>Property Type</Text>
          <TextInput
            style={[styles.input, errors.type && styles.inputError]}
            placeholder="e.g. Apartment, Condo, House"
            value={formData.type}
            onChangeText={(text) => handleChange("type", text)}
          />
          {errors.type && <Text style={styles.errorText}>{errors.type}</Text>}
        </View>

        <View style={styles.formRow}>
          <View style={[styles.formGroup, { flex: 1, marginRight: 8 }]}>
            <Text style={styles.label}>Number of Units</Text>
            <TextInput
              style={[styles.input, errors.units && styles.inputError]}
              placeholder="Enter unit count"
              value={formData.units}
              keyboardType="numeric"
              onChangeText={(text) => handleChange("units", text)}
            />
            {errors.units && <Text style={styles.errorText}>{errors.units}</Text>}
          </View>

          <View style={[styles.formGroup, { flex: 1, marginLeft: 8 }]}>
            <Text style={styles.label}>Monthly Rent ($)</Text>
            <TextInput
              style={[styles.input, errors.rent && styles.inputError]}
              placeholder="Enter rent amount"
              value={formData.rent}
              keyboardType="numeric"
              onChangeText={(text) => handleChange("rent", text)}
            />
            {errors.rent && <Text style={styles.errorText}>{errors.rent}</Text>}
          </View>
        </View>

        <View style={styles.formGroup}>
          <Text style={styles.label}>Image URL (Optional)</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter image URL"
            value={formData.imageUrl}
            onChangeText={(text) => handleChange("imageUrl", text)}
          />
        </View>

        <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
          <Text style={styles.submitButtonText}>Add Property</Text>
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: "white",
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
  },
  backButton: {
    padding: 4,
  },
  placeholder: {
    width: 32,
  },
  formContainer: {
    padding: 16,
  },
  formGroup: {
    marginBottom: 20,
  },
  formRow: {
    flexDirection: "row",
    marginBottom: 20,
  },
  label: {
    fontSize: 14,
    fontWeight: "500",
    color: "#333",
    marginBottom: 8,
  },
  input: {
    backgroundColor: "white",
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 16,
  },
  inputError: {
    borderColor: "#F44336",
  },
  errorText: {
    color: "#F44336",
    fontSize: 12,
    marginTop: 4,
  },
  submitButton: {
    backgroundColor: "#2196F3",
    borderRadius: 8,
    paddingVertical: 12,
    alignItems: "center",
    marginTop: 20,
    marginBottom: 40,
  },
  submitButtonText: {
    fontSize: 16,
    fontWeight: "600",
    color: "white",
  },
})

export default AddPropertyScreen

