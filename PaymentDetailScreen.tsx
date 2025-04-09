"use client"

import { useState, useEffect } from "react"
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Share, Alert } from "react-native"
import { useSafeAreaInsets } from "react-native-safe-area-context"

// Mock payment data
const mockPaymentDetails = {
  id: "1",
  tenantId: "1",
  tenantName: "John Smith",
  propertyId: "1",
  propertyName: "Sunny Apartments 301",
  propertyAddress: "123 Main St, Apt 301, Cityville, CA 90210",
  amount: 1500,
  date: "2023-12-01",
  dueDate: "2023-12-01",
  status: "Paid",
  method: "Bank Transfer",
  reference: "REF123456789",
  notes: "December 2023 rent payment",
  receiptUrl: "https://example.com/receipts/123456789.pdf",
  createdAt: "2023-12-01T10:15:30Z",
  updatedAt: "2023-12-01T10:15:30Z",
}

const PaymentDetailScreen = ({ route, navigation }) => {
  const insets = useSafeAreaInsets()
  const { paymentId } = route.params || { paymentId: "1" }
  const [payment, setPayment] = useState(null)

  // Fetch payment data (simulated)
  useEffect(() => {
    // In a real app, you would fetch data from an API or database
    setPayment(mockPaymentDetails)
  }, [paymentId])

  if (!payment) {
    return (
      <View style={styles.loadingContainer}>
        <Text>Loading payment details...</Text>
      </View>
    )
  }

  // Function to get status color
  const getStatusColor = (status) => {
    switch (status.toLowerCase()) {
      case "paid":
        return "#4CAF50" // Green
      case "pending":
        return "#FF9800" // Orange
      case "overdue":
        return "#F44336" // Red
      case "upcoming":
        return "#2196F3" // Blue
      default:
        return "#757575" // Grey
    }
  }

  // Format date for display
  const formatDate = (dateString) => {
    const options: Intl.DateTimeFormatOptions = {
      year: "numeric",
      month: "long",
      day: "numeric",
    }
    return new Date(dateString).toLocaleDateString(undefined, options)
  }

  // Share receipt
  const shareReceipt = async () => {
    try {
      await Share.share({
        message: `Payment receipt for ${payment.propertyName} - $${payment.amount} - ${formatDate(payment.date)}`,
        url: payment.receiptUrl,
      })
    } catch (error) {
      Alert.alert("Error", "Could not share the receipt")
    }
  }

  // Download receipt
  const downloadReceipt = () => {
    Alert.alert("Download Receipt", "Receipt download started")
    // In a real app, you would implement actual file download functionality
  }

  // Send receipt by email
  const emailReceipt = () => {
    Alert.alert("Email Receipt", `Receipt will be emailed to ${payment.tenantName}`)
    // In a real app, you would implement actual email sending functionality
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
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <Text style={styles.backButtonText}>← Back</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Payment Details</Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView style={styles.content}>
        <View style={styles.paymentHeader}>
          <Text style={styles.paymentAmount}>${payment.amount.toFixed(2)}</Text>
          <View style={[styles.statusBadge, { backgroundColor: getStatusColor(payment.status) }]}>
            <Text style={styles.statusText}>{payment.status}</Text>
          </View>
        </View>

        <View style={styles.detailSection}>
          <Text style={styles.sectionTitle}>Payment Information</Text>

          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Date:</Text>
            <Text style={styles.infoValue}>{formatDate(payment.date)}</Text>
          </View>

          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Due Date:</Text>
            <Text style={styles.infoValue}>{formatDate(payment.dueDate)}</Text>
          </View>

          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Method:</Text>
            <Text style={styles.infoValue}>{payment.method}</Text>
          </View>

          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Reference:</Text>
            <Text style={styles.infoValue}>{payment.reference}</Text>
          </View>
        </View>

        <View style={styles.detailSection}>
          <Text style={styles.sectionTitle}>Property & Tenant</Text>

          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Property:</Text>
            <TouchableOpacity onPress={() => navigation.navigate("PropertyDetail", { propertyId: payment.propertyId })}>
              <Text style={styles.infoValueLink}>{payment.propertyName}</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Address:</Text>
            <Text style={styles.infoValue}>{payment.propertyAddress}</Text>
          </View>

          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Tenant:</Text>
            <TouchableOpacity onPress={() => navigation.navigate("TenantDetail", { tenantId: payment.tenantId })}>
              <Text style={styles.infoValueLink}>{payment.tenantName}</Text>
            </TouchableOpacity>
          </View>
        </View>

        {payment.notes && (
          <View style={styles.detailSection}>
            <Text style={styles.sectionTitle}>Notes</Text>
            <Text style={styles.notesText}>{payment.notes}</Text>
          </View>
        )}

        <View style={styles.receiptActions}>
          <TouchableOpacity style={styles.receiptButton} onPress={downloadReceipt}>
            <Text style={styles.receiptButtonText}>Download</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.receiptButton} onPress={emailReceipt}>
            <Text style={styles.receiptButtonText}>Email</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.receiptButton} onPress={shareReceipt}>
            <Text style={styles.receiptButtonText}>Share</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.actionButtons}>
          <TouchableOpacity
            style={styles.actionButton}
            onPress={() => navigation.navigate("EditPayment", { paymentId: payment.id })}
          >
            <Text style={styles.actionButtonText}>Edit Payment</Text>
          </TouchableOpacity>

          {payment.status !== "Paid" && (
            <TouchableOpacity
              style={[styles.actionButton, styles.markPaidButton]}
              onPress={() => Alert.alert("Mark as Paid", "Payment status updated to Paid")}
            >
              <Text style={styles.actionButtonText}>Mark as Paid</Text>
            </TouchableOpacity>
          )}
        </View>

        <View style={styles.metaInfo}>
          <Text style={styles.metaText}>Created: {formatDate(payment.createdAt)}</Text>
          <Text style={styles.metaText}>Last Updated: {formatDate(payment.updatedAt)}</Text>
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
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
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
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
  },
  placeholder: {
    width: 40,
  },
  content: {
    flex: 1,
    padding: 16,
  },
  paymentHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
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
  paymentAmount: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#333",
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 4,
  },
  statusText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 14,
  },
  detailSection: {
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
    marginBottom: 12,
  },
  infoRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  infoLabel: {
    fontSize: 14,
    color: "#666",
  },
  infoValue: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#333",
    maxWidth: "60%",
    textAlign: "right",
  },
  infoValueLink: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#2196F3",
  },
  notesText: {
    fontSize: 14,
    color: "#333",
    lineHeight: 20,
  },
  receiptActions: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 16,
  },
  receiptButton: {
    flex: 1,
    backgroundColor: "#f0f0f0",
    borderRadius: 8,
    paddingVertical: 12,
    alignItems: "center",
    marginHorizontal: 4,
  },
  receiptButtonText: {
    color: "#333",
    fontWeight: "bold",
    fontSize: 14,
  },
  actionButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 16,
  },
  actionButton: {
    flex: 1,
    backgroundColor: "#2196F3",
    borderRadius: 8,
    paddingVertical: 12,
    alignItems: "center",
    marginHorizontal: 4,
  },
  markPaidButton: {
    backgroundColor: "#4CAF50",
  },
  actionButtonText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 14,
  },
  metaInfo: {
    padding: 16,
    alignItems: "center",
  },
  metaText: {
    fontSize: 12,
    color: "#999",
    marginBottom: 4,
  },
})

export default PaymentDetailScreen

