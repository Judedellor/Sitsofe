"use client"

import { useState, useEffect } from "react"
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  Platform,
} from "react-native"
import { useSafeAreaInsets } from "react-native-safe-area-context"
import DateTimePicker from "@react-native-community/datetimepicker"

// Mock tenants data for dropdown
const mockTenants = [
  { id: "1", name: "John Smith", propertyName: "Sunny Apartments 301", rentAmount: 1500 },
  { id: "2", name: "Sarah Johnson", propertyName: "Ocean View 205", rentAmount: 1800 },
  { id: "3", name: "Michael Davis", propertyName: "Highland Gardens 102", rentAmount: 1200 },
  { id: "4", name: "Jessica Williams", propertyName: "City Lofts 407", rentAmount: 2100 },
]

// Payment methods
const paymentMethods = ["Bank Transfer", "Credit Card", "Cash", "Check", "PayPal", "Venmo", "Other"]

// Define the type for form errors
interface FormErrors {
  tenantId?: string
  amount?: string
  date?: string
  method?: string
  reference?: string
}

const AddPaymentScreen = ({ route, navigation }) => {
  const insets = useSafeAreaInsets()
  const { tenantId, propertyId } = route.params || {}

  // Form state
  const [selectedTenantId, setSelectedTenantId] = useState(tenantId || "")
  const [amount, setAmount] = useState("")
  const [date, setDate] = useState(new Date())
  const [dueDate, setDueDate] = useState(new Date())
  const [method, setMethod] = useState("")
  const [reference, setReference] = useState("")
  const [notes, setNotes] = useState("")
  const [status, setStatus] = useState("Paid")

  // UI state
  const [showTenantDropdown, setShowTenantDropdown] = useState(false)
  const [showMethodDropdown, setShowMethodDropdown] = useState(false)
  const [showDatePicker, setShowDatePicker] = useState(false)
  const [showDueDatePicker, setShowDueDatePicker] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [errors, setErrors] = useState<FormErrors>({})

  // Tenants data
  const [tenants, setTenants] = useState(mockTenants)

  // Set amount based on selected tenant's rent amount
  useEffect(() => {
    if (selectedTenantId) {
      const tenant = tenants.find((t) => t.id === selectedTenantId)
      if (tenant) {
        setAmount(tenant.rentAmount.toString())
      }
    }
  }, [selectedTenantId])

  // Get selected tenant name
  const getSelectedTenantName = () => {
    const tenant = tenants.find((t) => t.id === selectedTenantId)
    return tenant ? `${tenant.name} (${tenant.propertyName})` : "Select Tenant"
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
  const onDateChange = (event, selectedDate) => {
    const currentDate = selectedDate || date
    setShowDatePicker(Platform.OS === "ios")
    setDate(currentDate)
  }

  const onDueDateChange = (event, selectedDate) => {
    const currentDate = selectedDate || dueDate
    setShowDueDatePicker(Platform.OS === "ios")
    setDueDate(currentDate)
  }

  // Validate form
  const validateForm = () => {
    const formErrors: FormErrors = {}

    if (!selectedTenantId) formErrors.tenantId = "Tenant selection is required"

    if (!amount.trim()) formErrors.amount = "Amount is required"
    else if (isNaN(Number(amount)) || Number(amount) <= 0) {
      formErrors.amount = "Amount must be a positive number"
    }

    if (!method) formErrors.method = "Payment method is required"

    if (method === "Check" || method === "Bank Transfer") {
      if (!reference.trim()) formErrors.reference = "Reference number is required for this payment method"
    }

    setErrors(formErrors)
    return Object.keys(formErrors).length === 0
  }

  // Handle form submission
  const handleSubmit = async () => {
    if (validateForm()) {
      setIsLoading(true)

      try {
        // In a real app, you would call an API to create the payment
        await new Promise((resolve) => setTimeout(resolve, 1000)) // Simulate API call

        const tenant = tenants.find((t) => t.id === selectedTenantId)

        const paymentData = {
          tenantId: selectedTenantId,
          tenantName: tenant?.name,
          propertyName: tenant?.propertyName,
          amount: Number(amount),
          date: date.toISOString(),
          dueDate: dueDate.toISOString(),
          status,
          method,
          reference: reference || "N/A",
          notes,
          createdAt: new Date().toISOString(),
        }

        console.log("New payment data:", paymentData)

        Alert.alert("Success", "Payment added successfully!", [
          {
            text: "OK",
            onPress: () => navigation.goBack(),
          },
        ])
      } catch (error) {
        Alert.alert("Error", "Failed to add payment. Please try again.")
        console.error("Error adding payment:", error)
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
        <Text style={styles.headerTitle}>Add New Payment</Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView style={styles.formContainer}>
        <View style={styles.formSection}>
          <Text style={styles.sectionTitle}>Payment Details</Text>

          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Tenant*</Text>
            <TouchableOpacity
              style={[styles.dropdownButton, errors.tenantId && styles.inputError, isLoading && styles.disabledInput]}
              onPress={() => !isLoading && setShowTenantDropdown(!showTenantDropdown)}
            >
              <Text style={styles.dropdownButtonText}>{getSelectedTenantName()}</Text>
              <Text style={styles.dropdownIcon}>▼</Text>
            </TouchableOpacity>
            {errors.tenantId && <Text style={styles.errorText}>{errors.tenantId}</Text>}

            {showTenantDropdown && (
              <View style={styles.dropdownList}>
                {tenants.map((tenant) => (
                  <TouchableOpacity
                    key={tenant.id}
                    style={styles.dropdownItem}
                    onPress={() => {
                      setSelectedTenantId(tenant.id)
                      setShowTenantDropdown(false)
                    }}
                  >
                    <Text style={styles.dropdownItemText}>{tenant.name}</Text>
                    <Text style={styles.dropdownItemSubtext}>
                      {tenant.propertyName} - ${tenant.rentAmount}/month
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            )}
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Amount*</Text>
            <TextInput
              style={[styles.textInput, errors.amount && styles.inputError]}
              value={amount}
              onChangeText={setAmount}
              placeholder="0.00"
              keyboardType="numeric"
              editable={!isLoading}
            />
            {errors.amount && <Text style={styles.errorText}>{errors.amount}</Text>}
          </View>

          <View style={styles.rowInputs}>
            <View style={[styles.inputGroup, { flex: 1, marginRight: 8 }]}>
              <Text style={styles.inputLabel}>Payment Date*</Text>
              <TouchableOpacity
                style={[styles.dateButton, isLoading && styles.disabledInput]}
                onPress={() => !isLoading && setShowDatePicker(true)}
              >
                <Text style={styles.dateButtonText}>{formatDate(date)}</Text>
              </TouchableOpacity>
              {showDatePicker && <DateTimePicker value={date} mode="date" display="default" onChange={onDateChange} />}
            </View>

            <View style={[styles.inputGroup, { flex: 1 }]}>
              <Text style={styles.inputLabel}>Due Date</Text>
              <TouchableOpacity
                style={[styles.dateButton, isLoading && styles.disabledInput]}
                onPress={() => !isLoading && setShowDueDatePicker(true)}
              >
                <Text style={styles.dateButtonText}>{formatDate(dueDate)}</Text>
              </TouchableOpacity>
              {showDueDatePicker && (
                <DateTimePicker value={dueDate} mode="date" display="default" onChange={onDueDateChange} />
              )}
            </View>
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Payment Method*</Text>
            <TouchableOpacity
              style={[styles.dropdownButton, errors.method && styles.inputError, isLoading && styles.disabledInput]}
              onPress={() => !isLoading && setShowMethodDropdown(!showMethodDropdown)}
            >
              <Text style={styles.dropdownButtonText}>{method || "Select Payment Method"}</Text>
              <Text style={styles.dropdownIcon}>▼</Text>
            </TouchableOpacity>
            {errors.method && <Text style={styles.errorText}>{errors.method}</Text>}

            {showMethodDropdown && (
              <View style={styles.dropdownList}>
                {paymentMethods.map((paymentMethod) => (
                  <TouchableOpacity
                    key={paymentMethod}
                    style={styles.dropdownItem}
                    onPress={() => {
                      setMethod(paymentMethod)
                      setShowMethodDropdown(false)
                    }}
                  >
                    <Text style={styles.dropdownItemText}>{paymentMethod}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            )}
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>
              Reference Number {(method === "Check" || method === "Bank Transfer") && "*"}
            </Text>
            <TextInput
              style={[styles.textInput, errors.reference && styles.inputError]}
              value={reference}
              onChangeText={setReference}
              placeholder="Check #, Transaction ID, etc."
              editable={!isLoading}
            />
            {errors.reference && <Text style={styles.errorText}>{errors.reference}</Text>}
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Status</Text>
            <View style={styles.statusButtons}>
              {["Paid", "Pending", "Overdue"].map((statusOption) => (
                <TouchableOpacity
                  key={statusOption}
                  style={[
                    styles.statusButton,
                    status === statusOption && styles.activeStatusButton,
                    isLoading && styles.disabledInput,
                  ]}
                  onPress={() => !isLoading && setStatus(statusOption)}
                >
                  <Text style={[styles.statusButtonText, status === statusOption && styles.activeStatusButtonText]}>
                    {statusOption}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        </View>

        <View style={styles.formSection}>
          <Text style={styles.sectionTitle}>Notes</Text>

          <View style={styles.inputGroup}>
            <TextInput
              style={styles.textArea}
              value={notes}
              onChangeText={setNotes}
              placeholder="Enter any additional notes about this payment"
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
            {isLoading ? <ActivityIndicator color="white" /> : <Text style={styles.submitButtonText}>Add Payment</Text>}
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
    zIndex: 1000,
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
  statusButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  statusButton: {
    flex: 1,
    backgroundColor: "#f9f9f9",
    borderWidth: 1,
    borderColor: "#e0e0e0",
    borderRadius: 4,
    paddingVertical: 10,
    alignItems: "center",
    marginHorizontal: 4,
  },
  activeStatusButton: {
    backgroundColor: "#2196F3",
    borderColor: "#2196F3",
  },
  statusButtonText: {
    fontSize: 14,
    color: "#333",
  },
  activeStatusButtonText: {
    color: "white",
    fontWeight: "bold",
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

export default AddPaymentScreen

