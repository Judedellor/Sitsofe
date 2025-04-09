"use client"

import { useState, useEffect } from "react"
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  TextInput,
  ActivityIndicator,
  ScrollView,
  Platform,
} from "react-native"
import { SafeAreaView } from "react-native-safe-area-context"
import { COLORS } from "./constants/colors"
import { Ionicons } from "@expo/vector-icons"
import { useNavigation } from "@react-navigation/native"
import Card from "./components/ui/Card"

// Payment types
const PAYMENT_TYPES = {
  RENT: "rent",
  DEPOSIT: "deposit",
  FEE: "fee",
  UTILITY: "utility",
  MAINTENANCE: "maintenance",
}

// Payment statuses
const PAYMENT_STATUSES = {
  PENDING: "pending",
  COMPLETED: "completed",
  FAILED: "failed",
  OVERDUE: "overdue",
}

// Mock payments data
const MOCK_PAYMENTS = [
  {
    id: "payment-1",
    date: "2023-05-01",
    dueDate: "2023-05-01",
    amount: 1500,
    type: PAYMENT_TYPES.RENT,
    status: PAYMENT_STATUSES.COMPLETED,
    property: {
      id: "property-1",
      name: "Sunset Villa",
      address: "123 Ocean Drive",
    },
    tenant: {
      id: "tenant-1",
      name: "John Doe",
    },
    description: "May 2023 Rent",
    paymentMethod: "Credit Card",
    transactionId: "txn_123456789",
  },
  {
    id: "payment-2",
    date: "2023-04-01",
    dueDate: "2023-04-01",
    amount: 1500,
    type: PAYMENT_TYPES.RENT,
    status: PAYMENT_STATUSES.COMPLETED,
    property: {
      id: "property-1",
      name: "Sunset Villa",
      address: "123 Ocean Drive",
    },
    tenant: {
      id: "tenant-1",
      name: "John Doe",
    },
    description: "April 2023 Rent",
    paymentMethod: "Bank Transfer",
    transactionId: "txn_987654321",
  },
  {
    id: "payment-3",
    date: null,
    dueDate: "2023-06-01",
    amount: 1500,
    type: PAYMENT_TYPES.RENT,
    status: PAYMENT_STATUSES.PENDING,
    property: {
      id: "property-1",
      name: "Sunset Villa",
      address: "123 Ocean Drive",
    },
    tenant: {
      id: "tenant-1",
      name: "John Doe",
    },
    description: "June 2023 Rent",
    paymentMethod: null,
    transactionId: null,
  },
  {
    id: "payment-4",
    date: null,
    dueDate: "2023-03-15",
    amount: 200,
    type: PAYMENT_TYPES.UTILITY,
    status: PAYMENT_STATUSES.OVERDUE,
    property: {
      id: "property-2",
      name: "Downtown Loft",
      address: "456 Main St",
    },
    tenant: {
      id: "tenant-2",
      name: "Jane Smith",
    },
    description: "March 2023 Utilities",
    paymentMethod: null,
    transactionId: null,
  },
  {
    id: "payment-5",
    date: "2023-02-28",
    dueDate: "2023-03-01",
    amount: 1800,
    type: PAYMENT_TYPES.RENT,
    status: PAYMENT_STATUSES.COMPLETED,
    property: {
      id: "property-2",
      name: "Downtown Loft",
      address: "456 Main St",
    },
    tenant: {
      id: "tenant-2",
      name: "Jane Smith",
    },
    description: "March 2023 Rent",
    paymentMethod: "Credit Card",
    transactionId: "txn_456789123",
  },
  {
    id: "payment-6",
    date: "2023-01-15",
    dueDate: "2023-01-15",
    amount: 2000,
    type: PAYMENT_TYPES.DEPOSIT,
    status: PAYMENT_STATUSES.COMPLETED,
    property: {
      id: "property-2",
      name: "Downtown Loft",
      address: "456 Main St",
    },
    tenant: {
      id: "tenant-2",
      name: "Jane Smith",
    },
    description: "Security Deposit",
    paymentMethod: "Bank Transfer",
    transactionId: "txn_789123456",
  },
  {
    id: "payment-7",
    date: "2023-03-10",
    dueDate: "2023-03-15",
    amount: 150,
    type: PAYMENT_TYPES.FEE,
    status: PAYMENT_STATUSES.COMPLETED,
    property: {
      id: "property-1",
      name: "Sunset Villa",
      address: "123 Ocean Drive",
    },
    tenant: {
      id: "tenant-1",
      name: "John Doe",
    },
    description: "Late Fee - February Rent",
    paymentMethod: "Cash",
    transactionId: "txn_321654987",
  },
  {
    id: "payment-8",
    date: "2023-04-05",
    dueDate: "2023-04-10",
    amount: 350,
    type: PAYMENT_TYPES.MAINTENANCE,
    status: PAYMENT_STATUSES.COMPLETED,
    property: {
      id: "property-1",
      name: "Sunset Villa",
      address: "123 Ocean Drive",
    },
    tenant: null,
    description: "Plumbing Repair",
    paymentMethod: "Credit Card",
    transactionId: "txn_654987321",
  },
]

const PaymentsScreen = () => {
  const navigation = useNavigation()

  const [isLoading, setIsLoading] = useState(true)
  const [payments, setPayments] = useState([])
  const [searchQuery, setSearchQuery] = useState("")
  const [filterType, setFilterType] = useState("all")
  const [filterStatus, setFilterStatus] = useState("all")
  const [showFilters, setShowFilters] = useState(false)

  // Load payments
  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      setPayments(MOCK_PAYMENTS)
      setIsLoading(false)
    }, 1000)
  }, [])

  // Filter payments
  const filteredPayments = payments.filter((payment) => {
    // Search query filter
    const matchesSearch =
      payment.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      payment.property.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (payment.tenant && payment.tenant.name.toLowerCase().includes(searchQuery.toLowerCase()))

    // Type filter
    const matchesType = filterType === "all" || payment.type === filterType

    // Status filter
    const matchesStatus = filterStatus === "all" || payment.status === filterStatus

    return matchesSearch && matchesType && matchesStatus
  })

  // Sort payments by due date (most recent first)
  const sortedPayments = [...filteredPayments].sort((a, b) => {
    return new Date(b.dueDate) - new Date(a.dueDate)
  })

  // Format date
  const formatDate = (dateString) => {
    if (!dateString) return "Not Paid"

    const date = new Date(dateString)
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    })
  }

  // Format currency
  const formatCurrency = (amount) => {
    return `$${amount.toLocaleString()}`
  }

  // Get status color
  const getStatusColor = (status) => {
    switch (status) {
      case PAYMENT_STATUSES.COMPLETED:
        return COLORS.success
      case PAYMENT_STATUSES.PENDING:
        return COLORS.warning
      case PAYMENT_STATUSES.FAILED:
        return COLORS.error
      case PAYMENT_STATUSES.OVERDUE:
        return COLORS.error
      default:
        return COLORS.gray
    }
  }

  // Get payment type icon
  const getPaymentTypeIcon = (type) => {
    switch (type) {
      case PAYMENT_TYPES.RENT:
        return "home"
      case PAYMENT_TYPES.DEPOSIT:
        return "wallet"
      case PAYMENT_TYPES.FEE:
        return "cash"
      case PAYMENT_TYPES.UTILITY:
        return "flash"
      case PAYMENT_TYPES.MAINTENANCE:
        return "construct"
      default:
        return "cash"
    }
  }

  // Calculate total payments
  const calculateTotalPayments = () => {
    return sortedPayments.reduce((total, payment) => {
      if (payment.status === PAYMENT_STATUSES.COMPLETED) {
        return total + payment.amount
      }
      return total
    }, 0)
  }

  // Calculate pending payments
  const calculatePendingPayments = () => {
    return sortedPayments.reduce((total, payment) => {
      if (payment.status === PAYMENT_STATUSES.PENDING || payment.status === PAYMENT_STATUSES.OVERDUE) {
        return total + payment.amount
      }
      return total
    }, 0)
  }

  // Render payment item
  const renderPaymentItem = ({ item }) => (
    <TouchableOpacity
      style={styles.paymentCard}
      onPress={() => navigation.navigate("PaymentDetail", { paymentId: item.id } as never)}
    >
      <View style={styles.paymentHeader}>
        <View style={styles.paymentTypeContainer}>
          <View style={[styles.paymentTypeIcon, { backgroundColor: getStatusColor(item.status) }]}>
            <Ionicons name={getPaymentTypeIcon(item.type)} size={20} color={COLORS.white} />
          </View>
          <View style={styles.paymentInfo}>
            <Text style={styles.paymentDescription}>{item.description}</Text>
            <Text style={styles.paymentProperty}>{item.property.name}</Text>
          </View>
        </View>
        <View style={styles.paymentAmountContainer}>
          <Text style={styles.paymentAmount}>{formatCurrency(item.amount)}</Text>
          <View style={[styles.statusBadge, { backgroundColor: getStatusColor(item.status) }]}>
            <Text style={styles.statusText}>{item.status}</Text>
          </View>
        </View>
      </View>

      <View style={styles.paymentDetails}>
        <View style={styles.paymentDetail}>
          <Text style={styles.paymentDetailLabel}>Due Date:</Text>
          <Text style={styles.paymentDetailValue}>{formatDate(item.dueDate)}</Text>
        </View>

        <View style={styles.paymentDetail}>
          <Text style={styles.paymentDetailLabel}>Payment Date:</Text>
          <Text style={styles.paymentDetailValue}>{formatDate(item.date)}</Text>
        </View>

        <View style={styles.paymentDetail}>
          <Text style={styles.paymentDetailLabel}>Tenant:</Text>
          <Text style={styles.paymentDetailValue}>{item.tenant ? item.tenant.name : "N/A"}</Text>
        </View>
      </View>
    </TouchableOpacity>
  )

  // Render list header
  const renderListHeader = () => (
    <View style={styles.listHeader}>
      <View style={styles.summaryCards}>
        <Card style={styles.summaryCard}>
          <Text style={styles.summaryLabel}>Total Received</Text>
          <Text style={styles.summaryValue}>{formatCurrency(calculateTotalPayments())}</Text>
        </Card>

        <Card style={styles.summaryCard}>
          <Text style={styles.summaryLabel}>Pending</Text>
          <Text style={[styles.summaryValue, { color: COLORS.warning }]}>
            {formatCurrency(calculatePendingPayments())}
          </Text>
        </Card>
      </View>

      {showFilters && (
        <View style={styles.filtersContainer}>
          <Text style={styles.filterTitle}>Filter by Type</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.filterOptions}>
            <TouchableOpacity
              style={[styles.filterOption, filterType === "all" && styles.filterOptionActive]}
              onPress={() => setFilterType("all")}
            >
              <Text style={[styles.filterOptionText, filterType === "all" && styles.filterOptionTextActive]}>All</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.filterOption, filterType === PAYMENT_TYPES.RENT && styles.filterOptionActive]}
              onPress={() => setFilterType(PAYMENT_TYPES.RENT)}
            >
              <Ionicons
                name="home"
                size={16}
                color={filterType === PAYMENT_TYPES.RENT ? COLORS.white : COLORS.gray}
                style={styles.filterOptionIcon}
              />
              <Text
                style={[styles.filterOptionText, filterType === PAYMENT_TYPES.RENT && styles.filterOptionTextActive]}
              >
                Rent
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.filterOption, filterType === PAYMENT_TYPES.DEPOSIT && styles.filterOptionActive]}
              onPress={() => setFilterType(PAYMENT_TYPES.DEPOSIT)}
            >
              <Ionicons
                name="wallet"
                size={16}
                color={filterType === PAYMENT_TYPES.DEPOSIT ? COLORS.white : COLORS.gray}
                style={styles.filterOptionIcon}
              />
              <Text
                style={[styles.filterOptionText, filterType === PAYMENT_TYPES.DEPOSIT && styles.filterOptionTextActive]}
              >
                Deposit
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.filterOption, filterType === PAYMENT_TYPES.FEE && styles.filterOptionActive]}
              onPress={() => setFilterType(PAYMENT_TYPES.FEE)}
            >
              <Ionicons
                name="cash"
                size={16}
                color={filterType === PAYMENT_TYPES.FEE ? COLORS.white : COLORS.gray}
                style={styles.filterOptionIcon}
              />
              <Text
                style={[styles.filterOptionText, filterType === PAYMENT_TYPES.FEE && styles.filterOptionTextActive]}
              >
                Fee
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.filterOption, filterType === PAYMENT_TYPES.UTILITY && styles.filterOptionActive]}
              onPress={() => setFilterType(PAYMENT_TYPES.UTILITY)}
            >
              <Ionicons
                name="flash"
                size={16}
                color={filterType === PAYMENT_TYPES.UTILITY ? COLORS.white : COLORS.gray}
                style={styles.filterOptionIcon}
              />
              <Text
                style={[styles.filterOptionText, filterType === PAYMENT_TYPES.UTILITY && styles.filterOptionTextActive]}
              >
                Utility
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.filterOption, filterType === PAYMENT_TYPES.MAINTENANCE && styles.filterOptionActive]}
              onPress={() => setFilterType(PAYMENT_TYPES.MAINTENANCE)}
            >
              <Ionicons
                name="construct"
                size={16}
                color={filterType === PAYMENT_TYPES.MAINTENANCE ? COLORS.white : COLORS.gray}
                style={styles.filterOptionIcon}
              />
              <Text
                style={[
                  styles.filterOptionText,
                  filterType === PAYMENT_TYPES.MAINTENANCE && styles.filterOptionTextActive,
                ]}
              >
                Maintenance
              </Text>
            </TouchableOpacity>
          </ScrollView>

          <Text style={styles.filterTitle}>Filter by Status</Text>
          <View style={styles.filterOptions}>
            <TouchableOpacity
              style={[styles.filterOption, filterStatus === "all" && styles.filterOptionActive]}
              onPress={() => setFilterStatus("all")}
            >
              <Text style={[styles.filterOptionText, filterStatus === "all" && styles.filterOptionTextActive]}>
                All
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.filterOption, filterStatus === PAYMENT_STATUSES.COMPLETED && styles.filterOptionActive]}
              onPress={() => setFilterStatus(PAYMENT_STATUSES.COMPLETED)}
            >
              <Text
                style={[
                  styles.filterOptionText,
                  filterStatus === PAYMENT_STATUSES.COMPLETED && styles.filterOptionTextActive,
                ]}
              >
                Completed
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.filterOption, filterStatus === PAYMENT_STATUSES.PENDING && styles.filterOptionActive]}
              onPress={() => setFilterStatus(PAYMENT_STATUSES.PENDING)}
            >
              <Text
                style={[
                  styles.filterOptionText,
                  filterStatus === PAYMENT_STATUSES.PENDING && styles.filterOptionTextActive,
                ]}
              >
                Pending
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.filterOption, filterStatus === PAYMENT_STATUSES.OVERDUE && styles.filterOptionActive]}
              onPress={() => setFilterStatus(PAYMENT_STATUSES.OVERDUE)}
            >
              <Text
                style={[
                  styles.filterOptionText,
                  filterStatus === PAYMENT_STATUSES.OVERDUE && styles.filterOptionTextActive,
                ]}
              >
                Overdue
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.filterOption, filterStatus === PAYMENT_STATUSES.FAILED && styles.filterOptionActive]}
              onPress={() => setFilterStatus(PAYMENT_STATUSES.FAILED)}
            >
              <Text
                style={[
                  styles.filterOptionText,
                  filterStatus === PAYMENT_STATUSES.FAILED && styles.filterOptionTextActive,
                ]}
              >
                Failed
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      )}
    </View>
  )

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color={COLORS.darkGray} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Payments</Text>
        <TouchableOpacity style={styles.filterButton} onPress={() => setShowFilters(!showFilters)}>
          <Ionicons name="filter" size={24} color={COLORS.primary} />
        </TouchableOpacity>
      </View>

      <View style={styles.searchContainer}>
        <Ionicons name="search" size={20} color={COLORS.gray} style={styles.searchIcon} />
        <TextInput
          style={styles.searchInput}
          placeholder="Search payments..."
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
        {searchQuery ? (
          <TouchableOpacity style={styles.clearButton} onPress={() => setSearchQuery("")}>
            <Ionicons name="close-circle" size={20} color={COLORS.gray} />
          </TouchableOpacity>
        ) : null}
      </View>

      {isLoading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={COLORS.primary} />
          <Text style={styles.loadingText}>Loading payments...</Text>
        </View>
      ) : (
        <FlatList
          data={sortedPayments}
          renderItem={renderPaymentItem}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContainer}
          ListHeaderComponent={renderListHeader}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Ionicons name="cash" size={64} color={COLORS.lightGray} />
              <Text style={styles.emptyText}>No payments found</Text>
            </View>
          }
        />
      )}

      <TouchableOpacity style={styles.addButton} onPress={() => navigation.navigate("AddPayment" as never)}>
        <Ionicons name="add" size={24} color={COLORS.white} />
      </TouchableOpacity>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: COLORS.white,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.lightGray,
  },
  backButton: {
    padding: 4,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: COLORS.darkGray,
  },
  filterButton: {
    padding: 4,
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: COLORS.white,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.lightGray,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: COLORS.darkGray,
  },
  clearButton: {
    padding: 4,
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
  listContainer: {
    padding: 16,
    paddingBottom: 80,
  },
  listHeader: {
    marginBottom: 16,
  },
  summaryCards: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 16,
  },
  summaryCard: {
    width: "48%",
    padding: 16,
  },
  summaryLabel: {
    fontSize: 14,
    color: COLORS.gray,
    marginBottom: 8,
  },
  summaryValue: {
    fontSize: 20,
    fontWeight: "bold",
    color: COLORS.darkGray,
  },
  filtersContainer: {
    backgroundColor: COLORS.white,
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
  },
  filterTitle: {
    fontSize: 16,
    fontWeight: "500",
    color: COLORS.darkGray,
    marginBottom: 12,
  },
  filterOptions: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginBottom: 16,
  },
  filterOption: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: COLORS.background,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 8,
    marginBottom: 8,
  },
  filterOptionActive: {
    backgroundColor: COLORS.primary,
  },
  filterOptionIcon: {
    marginRight: 4,
  },
  filterOptionText: {
    fontSize: 14,
    color: COLORS.darkGray,
  },
  filterOptionTextActive: {
    color: COLORS.white,
  },
  paymentCard: {
    backgroundColor: COLORS.white,
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
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
  paymentHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 16,
  },
  paymentTypeContainer: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  paymentTypeIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  paymentInfo: {
    flex: 1,
  },
  paymentDescription: {
    fontSize: 16,
    fontWeight: "500",
    color: COLORS.darkGray,
    marginBottom: 4,
  },
  paymentProperty: {
    fontSize: 14,
    color: COLORS.gray,
  },
  paymentAmountContainer: {
    alignItems: "flex-end",
  },
  paymentAmount: {
    fontSize: 18,
    fontWeight: "bold",
    color: COLORS.darkGray,
    marginBottom: 4,
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  statusText: {
    fontSize: 12,
    color: COLORS.white,
  },
  paymentDetails: {
    marginTop: 8,
  },
  paymentDetail: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 4,
  },
  paymentDetailLabel: {
    fontSize: 14,
    color: COLORS.gray,
  },
  paymentDetailValue: {
    fontSize: 14,
    fontWeight: "500",
    color: COLORS.darkGray,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 32,
  },
  emptyText: {
    fontSize: 18,
    color: COLORS.lightGray,
    marginTop: 16,
    textAlign: "center",
  },
  addButton: {
    position: "absolute",
    bottom: 24,
    right: 24,
    backgroundColor: COLORS.primary,
    borderRadius: 28,
    width: 56,
    height: 56,
    justifyContent: "center",
    alignItems: "center",
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
      },
      android: {
        elevation: 5,
      },
    }),
  },
})

export default PaymentsScreen

