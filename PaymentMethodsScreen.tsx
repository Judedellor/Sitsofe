"use client"

import { useState, useEffect } from "react"
import { View, Text, StyleSheet, TouchableOpacity, FlatList, Alert, ActivityIndicator, Image } from "react-native"
import { SafeAreaView } from "react-native-safe-area-context"
import { COLORS } from "../constants/colors"
import { Ionicons } from "@expo/vector-icons"
import { useNavigation } from "@react-navigation/native"

// Mock payment methods
const mockPaymentMethods = [
  {
    id: "1",
    type: "card",
    brand: "visa",
    last4: "4242",
    expMonth: 12,
    expYear: 2025,
    isDefault: true,
  },
  {
    id: "2",
    type: "card",
    brand: "mastercard",
    last4: "5555",
    expMonth: 8,
    expYear: 2024,
    isDefault: false,
  },
  {
    id: "3",
    type: "bank_account",
    bankName: "Chase Bank",
    accountLast4: "6789",
    accountType: "checking",
    isDefault: false,
  },
]

const PaymentMethodsScreen = () => {
  const navigation = useNavigation()
  const [paymentMethods, setPaymentMethods] = useState([])
  const [isLoading, setIsLoading] = useState(true)

  // Load payment methods
  useEffect(() => {
    const loadPaymentMethods = async () => {
      try {
        // In a real app, you would fetch from your API
        await new Promise((resolve) => setTimeout(resolve, 1000)) // Simulate API call
        setPaymentMethods(mockPaymentMethods)
      } catch (error) {
        console.error("Error loading payment methods:", error)
        Alert.alert("Error", "Failed to load payment methods. Please try again.")
      } finally {
        setIsLoading(false)
      }
    }

    loadPaymentMethods()
  }, [])

  // Set default payment method
  const setDefaultPaymentMethod = async (id) => {
    try {
      setIsLoading(true)

      // In a real app, you would call your API
      await new Promise((resolve) => setTimeout(resolve, 500)) // Simulate API call

      const updatedMethods = paymentMethods.map((method) => ({
        ...method,
        isDefault: method.id === id,
      }))

      setPaymentMethods(updatedMethods)
      Alert.alert("Success", "Default payment method updated.")
    } catch (error) {
      console.error("Error setting default payment method:", error)
      Alert.alert("Error", "Failed to update default payment method. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  // Delete payment method
  const deletePaymentMethod = async (id) => {
    // Don't allow deleting the default payment method
    const method = paymentMethods.find((m) => m.id === id)
    if (method.isDefault) {
      Alert.alert(
        "Cannot Delete",
        "You cannot delete your default payment method. Please set another method as default first.",
      )
      return
    }

    Alert.alert("Confirm Delete", "Are you sure you want to delete this payment method?", [
      {
        text: "Cancel",
        style: "cancel",
      },
      {
        text: "Delete",
        style: "destructive",
        onPress: async () => {
          try {
            setIsLoading(true)

            // In a real app, you would call your API
            await new Promise((resolve) => setTimeout(resolve, 500)) // Simulate API call

            const updatedMethods = paymentMethods.filter((method) => method.id !== id)
            setPaymentMethods(updatedMethods)
          } catch (error) {
            console.error("Error deleting payment method:", error)
            Alert.alert("Error", "Failed to delete payment method. Please try again.")
          } finally {
            setIsLoading(false)
          }
        },
      },
    ])
  }

  // Get card brand icon
  const getCardBrandIcon = (brand) => {
    switch (brand.toLowerCase()) {
      case "visa":
        return require("../assets/visa.png") // You would need to add these images to your assets
      case "mastercard":
        return require("../assets/mastercard.png")
      case "amex":
        return require("../assets/amex.png")
      case "discover":
        return require("../assets/discover.png")
      default:
        return require("../assets/generic-card.png")
    }
  }

  // Render payment method item
  const renderPaymentMethod = ({ item }) => (
    <View style={styles.paymentMethodItem}>
      <View style={styles.paymentMethodInfo}>
        {item.type === "card" ? (
          <>
            <Image source={getCardBrandIcon(item.brand)} style={styles.cardBrandIcon} />
            <View style={styles.paymentMethodDetails}>
              <Text style={styles.paymentMethodTitle}>
                {item.brand.charAt(0).toUpperCase() + item.brand.slice(1)} •••• {item.last4}
              </Text>
              <Text style={styles.paymentMethodSubtitle}>
                Expires {item.expMonth}/{item.expYear}
              </Text>
            </View>
          </>
        ) : (
          <>
            <Ionicons name="business-outline" size={24} color={COLORS.primary} style={styles.bankIcon} />
            <View style={styles.paymentMethodDetails}>
              <Text style={styles.paymentMethodTitle}>
                {item.bankName} •••• {item.accountLast4}
              </Text>
              <Text style={styles.paymentMethodSubtitle}>
                {item.accountType.charAt(0).toUpperCase() + item.accountType.slice(1)} Account
              </Text>
            </View>
          </>
        )}

        {item.isDefault && (
          <View style={styles.defaultBadge}>
            <Text style={styles.defaultBadgeText}>Default</Text>
          </View>
        )}
      </View>

      <View style={styles.paymentMethodActions}>
        {!item.isDefault && (
          <TouchableOpacity style={styles.actionButton} onPress={() => setDefaultPaymentMethod(item.id)}>
            <Text style={styles.actionButtonText}>Set Default</Text>
          </TouchableOpacity>
        )}

        <TouchableOpacity
          style={[styles.actionButton, styles.deleteButton]}
          onPress={() => deletePaymentMethod(item.id)}
        >
          <Ionicons name="trash-outline" size={16} color={COLORS.error} />
        </TouchableOpacity>
      </View>
    </View>
  )

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color={COLORS.darkGray} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Payment Methods</Text>
      </View>

      {isLoading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={COLORS.primary} />
          <Text style={styles.loadingText}>Loading payment methods...</Text>
        </View>
      ) : (
        <>
          {paymentMethods.length > 0 ? (
            <FlatList
              data={paymentMethods}
              renderItem={renderPaymentMethod}
              keyExtractor={(item) => item.id}
              contentContainerStyle={styles.paymentMethodsList}
            />
          ) : (
            <View style={styles.emptyContainer}>
              <Ionicons name="card-outline" size={64} color={COLORS.lightGray} />
              <Text style={styles.emptyTitle}>No Payment Methods</Text>
              <Text style={styles.emptyText}>
                You haven't added any payment methods yet. Add a payment method to make payments easier.
              </Text>
            </View>
          )}

          <View style={styles.footer}>
            <TouchableOpacity style={styles.addButton} onPress={() => navigation.navigate("AddPaymentMethod" as never)}>
              <Ionicons name="add" size={24} color={COLORS.white} />
              <Text style={styles.addButtonText}>Add Payment Method</Text>
            </TouchableOpacity>
          </View>
        </>
      )}
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
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: COLORS.gray,
  },
  paymentMethodsList: {
    padding: 16,
  },
  paymentMethodItem: {
    backgroundColor: COLORS.white,
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: COLORS.lightGray,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  paymentMethodInfo: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  cardBrandIcon: {
    width: 40,
    height: 24,
    marginRight: 12,
    resizeMode: "contain",
  },
  bankIcon: {
    marginRight: 12,
  },
  paymentMethodDetails: {
    flex: 1,
  },
  paymentMethodTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: COLORS.darkGray,
    marginBottom: 4,
  },
  paymentMethodSubtitle: {
    fontSize: 14,
    color: COLORS.gray,
  },
  defaultBadge: {
    backgroundColor: COLORS.primaryLight,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  defaultBadgeText: {
    fontSize: 12,
    color: COLORS.primary,
    fontWeight: "600",
  },
  paymentMethodActions: {
    flexDirection: "row",
    justifyContent: "flex-end",
    borderTopWidth: 1,
    borderTopColor: COLORS.lightGray,
    paddingTop: 12,
  },
  actionButton: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 4,
    backgroundColor: COLORS.background,
    marginLeft: 8,
  },
  actionButtonText: {
    fontSize: 14,
    color: COLORS.primary,
    fontWeight: "500",
  },
  deleteButton: {
    backgroundColor: COLORS.errorLight,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 24,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: COLORS.darkGray,
    marginTop: 16,
    marginBottom: 8,
  },
  emptyText: {
    fontSize: 16,
    color: COLORS.gray,
    textAlign: "center",
    lineHeight: 22,
  },
  footer: {
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: COLORS.lightGray,
  },
  addButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: COLORS.primary,
    borderRadius: 8,
    paddingVertical: 16,
  },
  addButtonText: {
    fontSize: 16,
    fontWeight: "bold",
    color: COLORS.white,
    marginLeft: 8,
  },
})

export default PaymentMethodsScreen

