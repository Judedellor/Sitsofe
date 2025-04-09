"use client"

import { useState } from "react"
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  TextInput,
  Alert,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
} from "react-native"
import { SafeAreaView } from "react-native-safe-area-context"
import { COLORS } from "../constants/colors"
import { Ionicons } from "@expo/vector-icons"
import { useNavigation } from "@react-navigation/native"

// Payment method types
const PAYMENT_TYPES = {
  CARD: "card",
  BANK: "bank_account",
}

const AddPaymentMethodScreen = () => {
  const navigation = useNavigation()
  const [isLoading, setIsLoading] = useState(false)
  const [paymentType, setPaymentType] = useState(PAYMENT_TYPES.CARD)

  // Credit card form state
  const [cardNumber, setCardNumber] = useState("")
  const [cardholderName, setCardholderName] = useState("")
  const [expiryDate, setExpiryDate] = useState("")
  const [cvv, setCvv] = useState("")
  const [saveAsDefault, setSaveAsDefault] = useState(true)

  // Bank account form state
  const [accountHolderName, setAccountHolderName] = useState("")
  const [routingNumber, setRoutingNumber] = useState("")
  const [accountNumber, setAccountNumber] = useState("")
  const [confirmAccountNumber, setConfirmAccountNumber] = useState("")
  const [accountType, setAccountType] = useState("checking")

  // Format card number with spaces
  const formatCardNumber = (text) => {
    const cleaned = text.replace(/\s+/g, "").replace(/[^0-9]/gi, "")
    const chunks = []

    for (let i = 0; i < cleaned.length; i += 4) {
      chunks.push(cleaned.substr(i, 4))
    }

    return chunks.join(" ").substr(0, 19) // 16 digits + 3 spaces
  }

  // Format expiry date (MM/YY)
  const formatExpiryDate = (text) => {
    const cleaned = text.replace(/[^0-9]/gi, "")

    if (cleaned.length >= 3) {
      return `${cleaned.substr(0, 2)}/${cleaned.substr(2, 2)}`
    } else if (cleaned.length === 2) {
      return `${cleaned}/`
    }

    return cleaned
  }

  // Validate credit card form
  const validateCardForm = () => {
    if (!cardNumber.trim() || cardNumber.replace(/\s+/g, "").length < 16) {
      Alert.alert("Invalid Card Number", "Please enter a valid card number.")
      return false
    }

    if (!cardholderName.trim()) {
      Alert.alert("Missing Information", "Please enter the cardholder name.")
      return false
    }

    if (!expiryDate.trim() || expiryDate.length < 5) {
      Alert.alert("Invalid Expiry Date", "Please enter a valid expiry date (MM/YY).")
      return false
    }

    const [month, year] = expiryDate.split("/")
    const currentYear = new Date().getFullYear() % 100 // Get last 2 digits of year
    const currentMonth = new Date().getMonth() + 1 // Months are 0-indexed

    if (
      Number.parseInt(year) < currentYear ||
      (Number.parseInt(year) === currentYear && Number.parseInt(month) < currentMonth)
    ) {
      Alert.alert("Expired Card", "The card expiration date has passed.")
      return false
    }

    if (!cvv.trim() || cvv.length < 3) {
      Alert.alert("Invalid CVV", "Please enter a valid CVV code.")
      return false
    }

    return true
  }

  // Validate bank account form
  const validateBankForm = () => {
    if (!accountHolderName.trim()) {
      Alert.alert("Missing Information", "Please enter the account holder name.")
      return false
    }

    if (!routingNumber.trim() || routingNumber.length !== 9) {
      Alert.alert("Invalid Routing Number", "Please enter a valid 9-digit routing number.")
      return false
    }

    if (!accountNumber.trim() || accountNumber.length < 4) {
      Alert.alert("Invalid Account Number", "Please enter a valid account number.")
      return false
    }

    if (accountNumber !== confirmAccountNumber) {
      Alert.alert("Account Numbers Do Not Match", "Please make sure your account numbers match.")
      return false
    }

    return true
  }

  // Handle form submission
  const handleSubmit = async () => {
    // Validate form based on payment type
    const isValid = paymentType === PAYMENT_TYPES.CARD ? validateCardForm() : validateBankForm()

    if (!isValid) return

    setIsLoading(true)

    try {
      // In a real app, you would call your API to save the payment method
      // For example, using Stripe or another payment processor
      await new Promise((resolve) => setTimeout(resolve, 1500)) // Simulate API call

      Alert.alert("Success", "Your payment method has been added successfully!", [
        {
          text: "OK",
          onPress: () => navigation.goBack(),
        },
      ])
    } catch (error) {
      console.error("Error adding payment method:", error)
      Alert.alert("Error", "Failed to add payment method. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} style={styles.keyboardAvoidingView}>
        <View style={styles.header}>
          <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()} disabled={isLoading}>
            <Ionicons name="arrow-back" size={24} color={COLORS.darkGray} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Add Payment Method</Text>
        </View>

        <ScrollView style={styles.content}>
          <View style={styles.paymentTypeSelector}>
            <TouchableOpacity
              style={[styles.paymentTypeButton, paymentType === PAYMENT_TYPES.CARD && styles.activePaymentTypeButton]}
              onPress={() => setPaymentType(PAYMENT_TYPES.CARD)}
              disabled={isLoading}
            >
              <Ionicons
                name="card-outline"
                size={24}
                color={paymentType === PAYMENT_TYPES.CARD ? COLORS.primary : COLORS.gray}
              />
              <Text
                style={[styles.paymentTypeText, paymentType === PAYMENT_TYPES.CARD && styles.activePaymentTypeText]}
              >
                Credit Card
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.paymentTypeButton, paymentType === PAYMENT_TYPES.BANK && styles.activePaymentTypeButton]}
              onPress={() => setPaymentType(PAYMENT_TYPES.BANK)}
              disabled={isLoading}
            >
              <Ionicons
                name="business-outline"
                size={24}
                color={paymentType === PAYMENT_TYPES.BANK ? COLORS.primary : COLORS.gray}
              />
              <Text
                style={[styles.paymentTypeText, paymentType === PAYMENT_TYPES.BANK && styles.activePaymentTypeText]}
              >
                Bank Account
              </Text>
            </TouchableOpacity>
          </View>

          {paymentType === PAYMENT_TYPES.CARD ? (
            <View style={styles.formContainer}>
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Card Number</Text>
                <TextInput
                  style={styles.input}
                  value={cardNumber}
                  onChangeText={(text) => setCardNumber(formatCardNumber(text))}
                  placeholder="1234 5678 9012 3456"
                  keyboardType="number-pad"
                  maxLength={19} // 16 digits + 3 spaces
                  editable={!isLoading}
                />
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Cardholder Name</Text>
                <TextInput
                  style={styles.input}
                  value={cardholderName}
                  onChangeText={setCardholderName}
                  placeholder="John Doe"
                  editable={!isLoading}
                />
              </View>

              <View style={styles.row}>
                <View style={[styles.inputGroup, { flex: 1, marginRight: 12 }]}>
                  <Text style={styles.inputLabel}>Expiry Date</Text>
                  <TextInput
                    style={styles.input}
                    value={expiryDate}
                    onChangeText={(text) => setExpiryDate(formatExpiryDate(text))}
                    placeholder="MM/YY"
                    keyboardType="number-pad"
                    maxLength={5} // MM/YY
                    editable={!isLoading}
                  />
                </View>

                <View style={[styles.inputGroup, { flex: 1 }]}>
                  <Text style={styles.inputLabel}>CVV</Text>
                  <TextInput
                    style={styles.input}
                    value={cvv}
                    onChangeText={setCvv}
                    placeholder="123"
                    keyboardType="number-pad"
                    maxLength={4} // Some cards have 4-digit CVV
                    secureTextEntry
                    editable={!isLoading}
                  />
                </View>
              </View>

              <TouchableOpacity
                style={styles.checkboxContainer}
                onPress={() => setSaveAsDefault(!saveAsDefault)}
                disabled={isLoading}
              >
                <View style={[styles.checkbox, saveAsDefault && styles.checkboxChecked]}>
                  {saveAsDefault && <Ionicons name="checkmark" size={16} color={COLORS.white} />}
                </View>
                <Text style={styles.checkboxLabel}>Set as default payment method</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <View style={styles.formContainer}>
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Account Holder Name</Text>
                <TextInput
                  style={styles.input}
                  value={accountHolderName}
                  onChangeText={setAccountHolderName}
                  placeholder="John Doe"
                  editable={!isLoading}
                />
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Routing Number</Text>
                <TextInput
                  style={styles.input}
                  value={routingNumber}
                  onChangeText={setRoutingNumber}
                  placeholder="123456789"
                  keyboardType="number-pad"
                  maxLength={9}
                  editable={!isLoading}
                />
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Account Number</Text>
                <TextInput
                  style={styles.input}
                  value={accountNumber}
                  onChangeText={setAccountNumber}
                  placeholder="12345678"
                  keyboardType="number-pad"
                  secureTextEntry
                  editable={!isLoading}
                />
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Confirm Account Number</Text>
                <TextInput
                  style={styles.input}
                  value={confirmAccountNumber}
                  onChangeText={setConfirmAccountNumber}
                  placeholder="12345678"
                  keyboardType="number-pad"
                  secureTextEntry
                  editable={!isLoading}
                />
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Account Type</Text>
                <View style={styles.accountTypeContainer}>
                  <TouchableOpacity
                    style={[styles.accountTypeButton, accountType === "checking" && styles.activeAccountTypeButton]}
                    onPress={() => setAccountType("checking")}
                    disabled={isLoading}
                  >
                    <Text style={[styles.accountTypeText, accountType === "checking" && styles.activeAccountTypeText]}>
                      Checking
                    </Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={[styles.accountTypeButton, accountType === "savings" && styles.activeAccountTypeButton]}
                    onPress={() => setAccountType("savings")}
                    disabled={isLoading}
                  >
                    <Text style={[styles.accountTypeText, accountType === "savings" && styles.activeAccountTypeText]}>
                      Savings
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>

              <TouchableOpacity
                style={styles.checkboxContainer}
                onPress={() => setSaveAsDefault(!saveAsDefault)}
                disabled={isLoading}
              >
                <View style={[styles.checkbox, saveAsDefault && styles.checkboxChecked]}>
                  {saveAsDefault && <Ionicons name="checkmark" size={16} color={COLORS.white} />}
                </View>
                <Text style={styles.checkboxLabel}>Set as default payment method</Text>
              </TouchableOpacity>
            </View>
          )}

          <View style={styles.securityNote}>
            <Ionicons name="shield-checkmark-outline" size={24} color={COLORS.success} style={styles.securityIcon} />
            <Text style={styles.securityText}>
              Your payment information is encrypted and secure. We use industry-standard security measures to protect
              your data.
            </Text>
          </View>
        </ScrollView>

        <View style={styles.footer}>
          <TouchableOpacity
            style={[styles.submitButton, isLoading && styles.disabledButton]}
            onPress={handleSubmit}
            disabled={isLoading}
          >
            {isLoading ? (
              <ActivityIndicator color={COLORS.white} />
            ) : (
              <Text style={styles.submitButtonText}>Add Payment Method</Text>
            )}
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.white,
  },
  keyboardAvoidingView: {
    flex: 1,
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
  paymentTypeSelector: {
    flexDirection: "row",
    marginBottom: 24,
  },
  paymentTypeButton: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 12,
    borderWidth: 1,
    borderColor: COLORS.lightGray,
    borderRadius: 8,
    marginHorizontal: 4,
  },
  activePaymentTypeButton: {
    borderColor: COLORS.primary,
    backgroundColor: COLORS.primaryLight,
  },
  paymentTypeText: {
    marginLeft: 8,
    fontSize: 16,
    color: COLORS.gray,
  },
  activePaymentTypeText: {
    color: COLORS.primary,
    fontWeight: "600",
  },
  formContainer: {
    marginBottom: 24,
  },
  inputGroup: {
    marginBottom: 16,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: "500",
    color: COLORS.darkGray,
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: COLORS.lightGray,
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
  },
  row: {
    flexDirection: "row",
  },
  checkboxContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 8,
  },
  checkbox: {
    width: 20,
    height: 20,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: COLORS.gray,
    marginRight: 8,
    justifyContent: "center",
    alignItems: "center",
  },
  checkboxChecked: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  checkboxLabel: {
    fontSize: 14,
    color: COLORS.darkGray,
  },
  accountTypeContainer: {
    flexDirection: "row",
  },
  accountTypeButton: {
    flex: 1,
    paddingVertical: 12,
    alignItems: "center",
    borderWidth: 1,
    borderColor: COLORS.lightGray,
    marginHorizontal: 4,
    borderRadius: 8,
  },
  activeAccountTypeButton: {
    borderColor: COLORS.primary,
    backgroundColor: COLORS.primaryLight,
  },
  accountTypeText: {
    fontSize: 16,
    color: COLORS.gray,
  },
  activeAccountTypeText: {
    color: COLORS.primary,
    fontWeight: "600",
  },
  securityNote: {
    flexDirection: "row",
    backgroundColor: COLORS.background,
    padding: 16,
    borderRadius: 8,
    marginBottom: 24,
  },
  securityIcon: {
    marginRight: 12,
  },
  securityText: {
    flex: 1,
    fontSize: 14,
    color: COLORS.darkGray,
    lineHeight: 20,
  },
  footer: {
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: COLORS.lightGray,
  },
  submitButton: {
    backgroundColor: COLORS.primary,
    borderRadius: 8,
    paddingVertical: 16,
    alignItems: "center",
  },
  disabledButton: {
    backgroundColor: COLORS.lightGray,
  },
  submitButtonText: {
    fontSize: 16,
    fontWeight: "bold",
    color: COLORS.white,
  },
})

export default AddPaymentMethodScreen

