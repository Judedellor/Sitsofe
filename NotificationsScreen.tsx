"use client"

import { useState } from "react"
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Switch, Alert } from "react-native"
import { SafeAreaView } from "react-native-safe-area-context"
import { COLORS } from "../constants/colors"
import { Ionicons } from "@expo/vector-icons"
import Card from "../components/ui/Card"
import Button from "../components/ui/Button"
import { useNavigation } from "@react-navigation/native"

// Notification types
type NotificationType = "payment" | "maintenance" | "lease" | "message" | "system"

// Notification interface
interface Notification {
  id: string
  title: string
  message: string
  type: NotificationType
  timestamp: string
  read: boolean
  actionable: boolean
  actionLabel?: string
  actionRoute?: string
  actionParams?: any
}

// Mock notifications
const mockNotifications: Notification[] = [
  {
    id: "notif-1",
    title: "Payment Due",
    message: "Your rent payment of $1,500 is due in 3 days.",
    type: "payment",
    timestamp: "2023-04-28T09:30:00Z",
    read: false,
    actionable: true,
    actionLabel: "Pay Now",
    actionRoute: "AddPayment",
  },
  {
    id: "notif-2",
    title: "Maintenance Request Updated",
    message: 'Your maintenance request for "Broken Dishwasher" has been marked as completed.',
    type: "maintenance",
    timestamp: "2023-04-27T14:45:00Z",
    read: true,
    actionable: true,
    actionLabel: "View Request",
    actionRoute: "MaintenanceDetail",
    actionParams: { requestId: "maint-123" },
  },
  {
    id: "notif-3",
    title: "New Message",
    message: 'You have a new message from Property Manager: "We will be performing routine inspections next week."',
    type: "message",
    timestamp: "2023-04-26T11:20:00Z",
    read: false,
    actionable: true,
    actionLabel: "View Message",
    actionRoute: "Chat",
    actionParams: { chatId: "chat-abc123" },
  },
  {
    id: "notif-4",
    title: "Lease Renewal",
    message: "Your lease is expiring in 30 days. Please review the renewal terms.",
    type: "lease",
    timestamp: "2023-04-25T16:15:00Z",
    read: true,
    actionable: true,
    actionLabel: "Review Lease",
    actionRoute: "DocumentsScreen",
  },
  {
    id: "notif-5",
    title: "System Maintenance",
    message: "The property management system will be undergoing maintenance tonight from 12am-2am.",
    type: "system",
    timestamp: "2023-04-24T10:00:00Z",
    read: true,
    actionable: false,
  },
  {
    id: "notif-6",
    title: "Property Inspection",
    message: "Annual property inspection scheduled for May 15th from 9am-12pm.",
    type: "system",
    timestamp: "2023-04-23T08:30:00Z",
    read: false,
    actionable: true,
    actionLabel: "Add to Calendar",
    actionRoute: "CalendarScreen",
  },
  {
    id: "notif-7",
    title: "Rent Increase Notice",
    message: "Starting with your next lease term, rent will increase by 3% to $1,545.",
    type: "payment",
    timestamp: "2023-04-22T13:40:00Z",
    read: true,
    actionable: false,
  },
]

const NotificationsScreen = () => {
  const navigation = useNavigation()
  const [notifications, setNotifications] = useState<Notification[]>(mockNotifications)
  const [showRead, setShowRead] = useState(true)

  // Notification preferences
  const [allowNotifications, setAllowNotifications] = useState(true)
  const [paymentNotifications, setPaymentNotifications] = useState(true)
  const [maintenanceNotifications, setMaintenanceNotifications] = useState(true)
  const [leaseNotifications, setLeaseNotifications] = useState(true)
  const [messageNotifications, setMessageNotifications] = useState(true)
  const [systemNotifications, setSystemNotifications] = useState(true)

  // Filter notifications
  const filteredNotifications = notifications.filter((notification) => (showRead ? true : !notification.read))

  // Clear all notifications
  const handleClearAll = () => {
    Alert.alert("Clear All Notifications", "Are you sure you want to clear all notifications?", [
      {
        text: "Cancel",
        style: "cancel",
      },
      {
        text: "Clear All",
        style: "destructive",
        onPress: () => setNotifications([]),
      },
    ])
  }

  // Mark notification as read
  const handleMarkAsRead = (id: string) => {
    setNotifications((prevNotifications) =>
      prevNotifications.map((notification) =>
        notification.id === id ? { ...notification, read: true } : notification,
      ),
    )
  }

  // Format timestamp
  const formatTimestamp = (timestamp: string): string => {
    const now = new Date()
    const notificationDate = new Date(timestamp)
    const diffTime = Math.abs(now.getTime() - notificationDate.getTime())
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24))

    if (diffDays === 0) {
      // Today, show time
      return `Today at ${notificationDate.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}`
    } else if (diffDays === 1) {
      // Yesterday
      return "Yesterday"
    } else if (diffDays < 7) {
      // This week
      return notificationDate.toLocaleDateString([], { weekday: "long" })
    } else {
      // Older
      return notificationDate.toLocaleDateString([], { month: "short", day: "numeric" })
    }
  }

  // Get icon for notification type
  const getNotificationIcon = (type: NotificationType): any => {
    switch (type) {
      case "payment":
        return "cash"
      case "maintenance":
        return "construct"
      case "lease":
        return "document-text"
      case "message":
        return "chatbubble"
      case "system":
        return "information-circle"
      default:
        return "notifications"
    }
  }

  // Get color for notification type
  const getNotificationColor = (type: NotificationType): string => {
    switch (type) {
      case "payment":
        return COLORS.primary
      case "maintenance":
        return COLORS.warning
      case "lease":
        return COLORS.success
      case "message":
        return COLORS.secondary
      case "system":
        return COLORS.info
      default:
        return COLORS.gray
    }
  }

  // Handle notification action
  const handleNotificationAction = (notification: Notification) => {
    if (notification.actionable && notification.actionRoute) {
      // Mark as read
      handleMarkAsRead(notification.id)

      // Navigate to action route
      // @ts-ignore - Navigation typing will be fixed with proper navigation types
      navigation.navigate(notification.actionRoute, notification.actionParams)
    }
  }

  // Render notification item
  const renderNotificationItem = ({ item }: { item: Notification }) => (
    <TouchableOpacity
      style={[styles.notificationItem, item.read ? styles.readNotification : styles.unreadNotification]}
      onPress={() => handleMarkAsRead(item.id)}
    >
      <View style={[styles.notificationIcon, { backgroundColor: getNotificationColor(item.type) }]}>
        <Ionicons name={getNotificationIcon(item.type)} size={20} color={COLORS.white} />
      </View>

      <View style={styles.notificationContent}>
        <View style={styles.notificationHeader}>
          <Text style={styles.notificationTitle}>{item.title}</Text>
          <Text style={styles.notificationTime}>{formatTimestamp(item.timestamp)}</Text>
        </View>

        <Text style={styles.notificationMessage}>{item.message}</Text>

        {item.actionable && (
          <View style={styles.notificationActions}>
            <Button
              title={item.actionLabel || "View"}
              type="link"
              size="small"
              onPress={() => handleNotificationAction(item)}
            />
          </View>
        )}
      </View>
    </TouchableOpacity>
  )

  // Render empty state
  const renderEmptyState = () => (
    <View style={styles.emptyContainer}>
      <Ionicons name="notifications-off" size={48} color={COLORS.gray} />
      <Text style={styles.emptyText}>No notifications</Text>
    </View>
  )

  // Render header component
  const renderHeader = () => (
    <View style={styles.listHeader}>
      <View style={styles.filterRow}>
        <Text style={styles.filterText}>Show Read Notifications</Text>
        <Switch
          value={showRead}
          onValueChange={setShowRead}
          trackColor={{ false: COLORS.lightGray, true: COLORS.primaryLight }}
          thumbColor={showRead ? COLORS.primary : COLORS.white}
        />
      </View>

      {notifications.length > 0 && (
        <Button title="Clear All" type="outline" size="small" onPress={handleClearAll} style={styles.clearButton} />
      )}
    </View>
  )

  // Render preferences section
  const renderPreferences = () => (
    <Card title="Notification Preferences" elevated>
      <View style={styles.preferenceItem}>
        <Text style={styles.preferenceText}>Allow Notifications</Text>
        <Switch
          value={allowNotifications}
          onValueChange={setAllowNotifications}
          trackColor={{ false: COLORS.lightGray, true: COLORS.primaryLight }}
          thumbColor={allowNotifications ? COLORS.primary : COLORS.white}
        />
      </View>

      <View style={styles.preferenceItem}>
        <Text style={styles.preferenceText}>Payment Notifications</Text>
        <Switch
          value={paymentNotifications}
          onValueChange={setPaymentNotifications}
          trackColor={{ false: COLORS.lightGray, true: COLORS.primaryLight }}
          thumbColor={paymentNotifications ? COLORS.primary : COLORS.white}
          disabled={!allowNotifications}
        />
      </View>

      <View style={styles.preferenceItem}>
        <Text style={styles.preferenceText}>Maintenance Notifications</Text>
        <Switch
          value={maintenanceNotifications}
          onValueChange={setMaintenanceNotifications}
          trackColor={{ false: COLORS.lightGray, true: COLORS.primaryLight }}
          thumbColor={maintenanceNotifications ? COLORS.primary : COLORS.white}
          disabled={!allowNotifications}
        />
      </View>

      <View style={styles.preferenceItem}>
        <Text style={styles.preferenceText}>Lease Notifications</Text>
        <Switch
          value={leaseNotifications}
          onValueChange={setLeaseNotifications}
          trackColor={{ false: COLORS.lightGray, true: COLORS.primaryLight }}
          thumbColor={leaseNotifications ? COLORS.primary : COLORS.white}
          disabled={!allowNotifications}
        />
      </View>

      <View style={styles.preferenceItem}>
        <Text style={styles.preferenceText}>Message Notifications</Text>
        <Switch
          value={messageNotifications}
          onValueChange={setMessageNotifications}
          trackColor={{ false: COLORS.lightGray, true: COLORS.primaryLight }}
          thumbColor={messageNotifications ? COLORS.primary : COLORS.white}
          disabled={!allowNotifications}
        />
      </View>

      <View style={[styles.preferenceItem, styles.lastPreferenceItem]}>
        <Text style={styles.preferenceText}>System Notifications</Text>
        <Switch
          value={systemNotifications}
          onValueChange={setSystemNotifications}
          trackColor={{ false: COLORS.lightGray, true: COLORS.primaryLight }}
          thumbColor={systemNotifications ? COLORS.primary : COLORS.white}
          disabled={!allowNotifications}
        />
      </View>
    </Card>
  )

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Notifications</Text>
      </View>

      <FlatList
        data={filteredNotifications}
        renderItem={renderNotificationItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        ListHeaderComponent={renderHeader}
        ListEmptyComponent={renderEmptyState}
        ListFooterComponent={renderPreferences}
      />
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  header: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.lightGray,
    backgroundColor: COLORS.white,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: COLORS.darkGray,
  },
  listHeader: {
    backgroundColor: COLORS.white,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.lightGray,
    marginBottom: 12,
  },
  filterRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  filterText: {
    fontSize: 16,
    color: COLORS.darkGray,
  },
  clearButton: {
    alignSelf: "flex-end",
  },
  listContent: {
    padding: 16,
  },
  notificationItem: {
    flexDirection: "row",
    borderRadius: 8,
    marginBottom: 12,
    backgroundColor: COLORS.white,
    elevation: 2,
    shadowColor: COLORS.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    overflow: "hidden",
  },
  unreadNotification: {
    borderLeftWidth: 4,
    borderLeftColor: COLORS.primary,
  },
  readNotification: {
    opacity: 0.8,
  },
  notificationIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    margin: 12,
  },
  notificationContent: {
    flex: 1,
    padding: 12,
    paddingLeft: 0,
  },
  notificationHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 4,
  },
  notificationTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: COLORS.darkGray,
    flex: 1,
  },
  notificationTime: {
    fontSize: 12,
    color: COLORS.gray,
    marginLeft: 8,
  },
  notificationMessage: {
    fontSize: 14,
    color: COLORS.darkGray,
    marginBottom: 8,
  },
  notificationActions: {
    flexDirection: "row",
    justifyContent: "flex-end",
  },
  emptyContainer: {
    alignItems: "center",
    justifyContent: "center",
    padding: 40,
    backgroundColor: COLORS.white,
    borderRadius: 8,
    marginBottom: 16,
  },
  emptyText: {
    fontSize: 16,
    color: COLORS.gray,
    marginTop: 12,
  },
  preferenceItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.lightGray,
  },
  lastPreferenceItem: {
    borderBottomWidth: 0,
  },
  preferenceText: {
    fontSize: 16,
    color: COLORS.darkGray,
  },
})

export default NotificationsScreen

