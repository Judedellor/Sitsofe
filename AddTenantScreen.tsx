"use client"

import { useState } from "react"
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  TouchableOpacity,
  Switch,
  Alert,
  ActivityIndicator,
  Platform,
} from "react-native"
import { useSafeAreaInsets } from "react-native-safe-area-context"
import DateTimePicker from "@react-native-community/datetimepicker"

// Mock properties data for dropdown
const mockProperties = [
  { id: "1", name: "Sunset Villa", address: "123 Ocean Drive, Malibu, CA" },
  { id: "2", name: "Ocean View 205", address: "205 Beach Blvd, Santa Monica, CA" },
  { id: "3", name: "Highland Gardens 102", address: "102 Highland Ave, Hollywood, CA" },
  { id: "4", name: "City Lofts 407", address: "407 Downtown St, Los Angeles, CA" },
]

// Define the type for form errors
interface FormErrors {
  fullName?: string
  email?: string
  phone?: string
  propertyId?: string
  leaseStart?: string
  leaseEnd?: string
  rentAmount?: string
  securityDeposit?: string
}

const AddTenantScreen = ({ route, navigation }) => {
  const insets = useSafeAreaInsets()
  const { propertyId } = route.params || {}

  // Form state
  const [fullName, setFullName] = useState("")
  const [email, setEmail] = useState("")
  const [phone, setPhone] = useState("")
  const [selectedPropertyId, setSelectedPropertyId] = useState(propertyId || "")
  const [leaseStart, setLeaseStart] = useState(new Date())
  const [leaseEnd, setLeaseEnd] = useState(new Date(new Date().setFullYear(new Date().getFullYear() + 1)))
  const [rentAmount, setRentAmount] = useState("")
  const [securityDeposit, setSecurityDeposit] = useState("")
  const [notes, setNotes] = useState("")
  const [isPetAllowed, setIsPetAllowed] = useState(false)

  // UI state
  const [showPropertyDropdown, setShowPropertyDropdown] = useState(false)
  const [showLeaseStartPicker, setShowLeaseStartPicker] = useState(false)
  const [showLeaseEndPicker, setShowLeaseEndPicker] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [errors, setErrors] = useState<FormErrors>({})

  // Properties data
  const [properties, setProperties] = useState(mockProperties)

  // Get selected property name
  const getSelectedPropertyName = () => {
    const property = properties.find((p) => p.id === selectedPropertyId)
    return property ? property.name : "Select Property"
  }

  // Format date for display
  const formatDate = (date: Date) => {
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  }

  // Handle date change
  const onLeaseStartChange = (event, selectedDate) => {
    const currentDate = selectedDate || leaseStart
    setShowLeaseStartPicker(Platform.OS === "ios")
    setLeaseStart(currentDate)

    // If lease start is after lease end, update lease end
    if (currentDate > leaseEnd) {
      setLeaseEnd(currentDate)
    }
  }

  const onLeaseEndChange = (event, selectedDate) => {
    const currentDate = selectedDate || leaseEnd
    setShowLeaseEndPicker(Platform.OS === "ios")
    setLeaseEnd(currentDate)
  }

  // Validate form
  const validateForm = () => {
    const formErrors: FormErrors = {}

    if (!fullName.trim()) formErrors.fullName = "Full name is required"
    if (!email.trim()) formErrors.email = "Email is required"
    else if (!/\S+@\S+\.\S+/.test(email)) formErrors.email = "Email is invalid"

    if (!phone.trim()) formErrors.phone = "Phone number is required"
    if (!selectedPropertyId) formErrors.propertyId = "Property selection is required"

    if (!rentAmount.trim()) formErrors.rentAmount = "Rent amount is required"
    else if (isNaN(Number(rentAmount)) || Number(rentAmount) <= 0) {
      formErrors.rentAmount = "Rent amount must be a positive number"
    }

    if (securityDeposit.trim() && isNaN(Number(securityDeposit))) {
      formErrors.securityDeposit = "Security deposit must be a number"
    }

    if (leaseStart >= leaseEnd) {
      formErrors.leaseEnd = "Lease end date must be after start date"
    }

    setErrors(formErrors)
    return Object.keys(formErrors).length === 0
  }

  // Handle form submission
  const handleSubmit = async () => {
    if (validateForm()) {
      setIsLoading(true)

      try {
        // In a real app, you would call an API to create the tenant
        await new Promise((resolve) => setTimeout(resolve, 1000)) // Simulate API call

        const tenantData = {
          fullName,
          email,
          phone,
          propertyId: selectedPropertyId,
          leaseStart: leaseStart.toISOString(),
          leaseEnd: leaseEnd.toISOString(),
          rentAmount: Number(rentAmount),
          securityDeposit: securityDeposit ? Number(securityDeposit) : 0,
          notes,
          isPetAllowed,
          status: "Active",
          createdAt: new Date().toISOString(),
        }

        console.log("New tenant data:", tenantData)

        Alert.alert("Success", "Tenant added successfully!", [
          {
            text: "OK",
            onPress: () => navigation.goBack(),
          },
        ])
      } catch (error) {
        Alert.alert("Error", "Failed to add tenant. Please try again.")
        console.error("Error adding tenant:", error)
      } finally {
        setIsLoading(false)
      }
    }
  }

  return (
    <View
      style={[
        styles.container,
        {
          paddingTop: insets.top,
          paddingBottom: insets.bottom,
          paddingLeft: insets.left,
          paddingRight: insets.right,
        },
      ]}
    >
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()} disabled={isLoading}>
          <Text style={styles.backButtonText}>← Back</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Add New Tenant</Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView style={styles.formContainer}>
        <View style={styles.formSection}>
          <Text style={styles.sectionTitle}>Tenant Information</Text>

          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Full Name*</Text>
            <TextInput
              style={[styles.textInput, errors.fullName && styles.inputError]}
              value={fullName}
              onChangeText={setFullName}
              placeholder="Enter tenant's full name"
              editable={!isLoading}
            />
            {errors.fullName && <Text style={styles.errorText}>{errors.fullName}</Text>}
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Email*</Text>
            <TextInput
              style={[styles.textInput, errors.email && styles.inputError]}
              value={email}
              onChangeText={setEmail}
              placeholder="Enter tenant's email"
              keyboardType="email-address"
              autoCapitalize="none"
              editable={!isLoading}
            />
            {errors.email && <Text style={styles.errorText}>{errors.email}</Text>}
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Phone Number*</Text>
            <TextInput
              style={[styles.textInput, errors.phone && styles.inputError]}
              value={phone}
              onChangeText={setPhone}
              placeholder="Enter tenant's phone number"
              keyboardType="phone-pad"
              editable={!isLoading}
            />
            {errors.phone && <Text style={styles.errorText}>{errors.phone}</Text>}
          </View>
        </View>

        <View style={styles.formSection}>
          <Text style={styles.sectionTitle}>Property & Lease Details</Text>

          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Property*</Text>
            <TouchableOpacity
              style={[styles.dropdownButton, errors.propertyId && styles.inputError, isLoading && styles.disabledInput]}
              onPress={() => !isLoading && setShowPropertyDropdown(!showPropertyDropdown)}
            >
              <Text style={styles.dropdownButtonText}>{getSelectedPropertyName()}</Text>
              <Text style={styles.dropdownIcon}>▼</Text>
            </TouchableOpacity>
            {errors.propertyId && <Text style={styles.errorText}>{errors.propertyId}</Text>}

            {showPropertyDropdown && (
              <View style={styles.dropdownList}>
                {properties.map((property) => (
                  <TouchableOpacity
                    key={property.id}
                    style={styles.dropdownItem}
                    onPress={() => {
                      setSelectedPropertyId(property.id)
                      setShowPropertyDropdown(false)
                    }}
                  >
                    <Text style={styles.dropdownItemText}>{property.name}</Text>
                    <Text style={styles.dropdownItemSubtext}>{property.address}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            )}
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Lease Start Date*</Text>
            <TouchableOpacity
              style={[styles.dateButton, isLoading && styles.disabledInput]}
              onPress={() => !isLoading && setShowLeaseStartPicker(true)}
            >
              <Text style={styles.dateButtonText}>{formatDate(leaseStart)}</Text>
            </TouchableOpacity>
            {showLeaseStartPicker && (
              <DateTimePicker
                value={leaseStart}
                mode="date"
                display="default"
                onChange={onLeaseStartChange}
                minimumDate={new Date()}
              />
            )}
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Lease End Date*</Text>
            <TouchableOpacity
              style={[styles.dateButton, errors.leaseEnd && styles.inputError, isLoading && styles.disabledInput]}
              onPress={() => !isLoading && setShowLeaseEndPicker(true)}
            >
              <Text style={styles.dateButtonText}>{formatDate(leaseEnd)}</Text>
            </TouchableOpacity>
            {errors.leaseEnd && <Text style={styles.errorText}>{errors.leaseEnd}</Text>}
            {showLeaseEndPicker && (
              <DateTimePicker
                value={leaseEnd}
                mode="date"
                display="default"
                onChange={onLeaseEndChange}
                minimumDate={leaseStart}
              />
            )}
          </View>

          <View style={styles.rowInputs}>
            <View style={[styles.inputGroup, { flex: 1, marginRight: 8 }]}>
              <Text style={styles.inputLabel}>Monthly Rent*</Text>
              <TextInput
                style={[styles.textInput, errors.rentAmount && styles.inputError]}
                value={rentAmount}
                onChangeText={setRentAmount}
                placeholder="0"
                keyboardType="numeric"
                editable={!isLoading}
              />
              {errors.rentAmount && <Text style={styles.errorText}>{errors.rentAmount}</Text>}
            </View>

            <View style={[styles.inputGroup, { flex: 1 }]}>
              <Text style={styles.inputLabel}>Security Deposit</Text>
              <TextInput
                style={[styles.textInput, errors.securityDeposit && styles.inputError]}
                value={securityDeposit}
                onChangeText={setSecurityDeposit}
                placeholder="0"
                keyboardType="numeric"
                editable={!isLoading}
              />
              {errors.securityDeposit && <Text style={styles.errorText}>{errors.securityDeposit}</Text>}
            </View>
          </View>

          <View style={styles.switchContainer}>
            <Text style={styles.switchLabel}>Pets Allowed</Text>
            <Switch
              value={isPetAllowed}
              onValueChange={setIsPetAllowed}
              trackColor={{ false: "#e0e0e0", true: "#2196F3" }}
              thumbColor={isPetAllowed ? "#fff" : "#f4f3f4"}
              disabled={isLoading}
            />
          </View>
        </View>

        <View style={styles.formSection}>
          <Text style={styles.sectionTitle}>Additional Notes</Text>

          <View style={styles.inputGroup}>
            <TextInput
              style={styles.textArea}
              value={notes}
              onChangeText={setNotes}
              placeholder="Enter any additional notes about the tenant"
              multiline
              numberOfLines={4}
              textAlignVertical="top"
              editable={!isLoading}
            />
          </View>
        </View>

        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.cancelButton} onPress={() => navigation.goBack()} disabled={isLoading}>
            <Text style={styles.cancelButtonText}>Cancel</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.submitButton, isLoading && styles.submitButtonDisabled]}
            onPress={handleSubmit}
            disabled={isLoading}
          >
            {isLoading ? <ActivityIndicator color="white" /> : <Text style={styles.submitButtonText}>Add Tenant</Text>}
          </TouchableOpacity>
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
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: "white",
    borderBottomWidth: 1,
    borderBottomColor: "#e0e0e0",
  },
  backButton: {
    padding: 8,
  },
  backButtonText: {
    fontSize: 16,
    color: "#2196F3",
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#333",
  },
  placeholder: {
    width: 40,
  },
  formContainer: {
    flex: 1,
    padding: 16,
  },
  formSection: {
    backgroundColor: "white",
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 16,
  },
  inputGroup: {
    marginBottom: 16,
  },
  inputLabel: {
    fontSize: 14,
    color: "#666",
    marginBottom: 8,
  },
  textInput: {
    backgroundColor: "#f9f9f9",
    borderWidth: 1,
    borderColor: "#e0e0e0",
    borderRadius: 4,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 16,
  },
  textArea: {
    backgroundColor: "#f9f9f9",
    borderWidth: 1,
    borderColor: "#e0e0e0",
    borderRadius: 4,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 16,
    minHeight: 100,
  },
  inputError: {
    borderColor: "#f44336",
  },
  errorText: {
    color: "#f44336",
    fontSize: 12,
    marginTop: 4,
  },
  rowInputs: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  dropdownButton: {
    backgroundColor: "#f9f9f9",
    borderWidth: 1,
    borderColor: "#e0e0e0",
    borderRadius: 4,
    paddingHorizontal: 12,
    paddingVertical: 10,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  dropdownButtonText: {
    fontSize: 16,
    color: "#333",
  },
  dropdownIcon: {
    fontSize: 12,
    color: "#666",
  },
  dropdownList: {
    backgroundColor: "white",
    borderWidth: 1,
    borderColor: "#e0e0e0",
    borderRadius: 4,
    marginTop: 4,
    maxHeight: 200,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  dropdownItem: {
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  dropdownItemText: {
    fontSize: 16,
    color: "#333",
  },
  dropdownItemSubtext: {
    fontSize: 12,
    color: "#666",
    marginTop: 2,
  },
  dateButton: {
    backgroundColor: "#f9f9f9",
    borderWidth: 1,
    borderColor: "#e0e0e0",
    borderRadius: 4,
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
  dateButtonText: {
    fontSize: 16,
    color: "#333",
  },
  switchContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 8,
  },
  switchLabel: {
    fontSize: 16,
    color: "#333",
  },
  disabledInput: {
    opacity: 0.7,
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 32,
  },
  cancelButton: {
    flex: 1,
    backgroundColor: "#e0e0e0",
    paddingVertical: 16,
    borderRadius: 8,
    marginRight: 8,
    alignItems: "center",
  },
  cancelButtonText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
  },
  submitButton: {
    flex: 2,
    backgroundColor: "#2196F3",
    paddingVertical: 16,
    borderRadius: 8,
    alignItems: "center",
  },
  submitButtonDisabled: {
    backgroundColor: "#90CAF9",
  },
  submitButtonText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "white",
  },
})

export default AddTenantScreen

