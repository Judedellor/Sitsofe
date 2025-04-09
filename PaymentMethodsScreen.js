"use client"

import { useState } from "react"
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from "react-native"
import { Ionicons } from "@expo/vector-icons"

const PaymentMethodCard = ({ type, last4, expiry, isDefault }) => (
  <View style={styles.card}>
    <View style={styles.cardHeader}>
      <View style={styles.cardType}>
        <Ionicons name={type === "Visa" ? "card" : "card-outline"} size={24} color="#2196F3" />
        <Text style={styles.cardTypeText}>{type}</Text>
      </View>
      {isDefault && (
        <View style={styles.defaultBadge}>
          <Text style={styles.defaultBadgeText}>Default</Text>
        </View>
      )}
    </View>
    <Text style={styles.cardNumber}>•••• {last4}</Text>
    <Text style={styles.cardExpiry}>Expires {expiry}</Text>
  </View>
)

const PaymentMethodsScreen = ({ navigation }) => {
  const [paymentMethods] = useState([
    { id: 1, type: "Visa", last4: "4242", expiry: "12/24", isDefault: true },
    { id: 2, type: "Mastercard", last4: "8888", expiry: "06/25", isDefault: false },
  ])

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color="#333" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Payment Methods</Text>
      </View>

      <ScrollView style={styles.content}>
        {paymentMethods.map((method) => (
          <PaymentMethodCard key={method.id} {...method} />
        ))}
      </ScrollView>

      <TouchableOpacity style={styles.addButton}>
        <Ionicons name="add-circle" size={24} color="#2196F3" />
        <Text style={styles.addButtonText}>Add Payment Method</Text>
      </TouchableOpacity>
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
    alignItems: "center",
    padding: 16,
    backgroundColor: "white",
    borderBottomWidth: 1,
    borderBottomColor: "#e0e0e0",
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "600",
    marginLeft: 16,
    color: "#333",
  },
  content: {
    flex: 1,
    padding: 16,
  },
  card: {
    backgroundColor: "white",
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  cardType: {
    flexDirection: "row",
    alignItems: "center",
  },
  cardTypeText: {
    fontSize: 16,
    fontWeight: "600",
    marginLeft: 8,
    color: "#333",
  },
  defaultBadge: {
    backgroundColor: "#E3F2FD",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  defaultBadgeText: {
    fontSize: 12,
    color: "#2196F3",
    fontWeight: "500",
  },
  cardNumber: {
    fontSize: 18,
    color: "#333",
    marginBottom: 4,
  },
  cardExpiry: {
    fontSize: 14,
    color: "#666",
  },
  addButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "white",
    padding: 16,
    margin: 16,
    borderRadius: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  addButtonText: {
    fontSize: 16,
    color: "#2196F3",
    fontWeight: "600",
    marginLeft: 8,
  },
})

export default PaymentMethodsScreen

