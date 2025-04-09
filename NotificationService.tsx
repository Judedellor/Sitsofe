import * as Notifications from "expo-notifications"
import * as Device from "expo-device"
import { Platform } from "react-native"
import AsyncStorage from "@react-native-async-storage/async-storage"

// Configure notifications
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
  }),
})

// Notification types
export type NotificationData = {
  type: "payment" | "maintenance" | "lease" | "message" | "system"
  title: string
  body: string
  data?: Record<string, any>
}

export class NotificationService {
  // Register for push notifications
  static async registerForPushNotifications() {
    if (!Device.isDevice) {
      console.log("Push Notifications are not available on emulators/simulators")
      return null
    }

    // Check if we already have permission
    const { status: existingStatus } = await Notifications.getPermissionsAsync()
    let finalStatus = existingStatus

    // If we don't have permission, ask for it
    if (existingStatus !== "granted") {
      const { status } = await Notifications.requestPermissionsAsync()
      finalStatus = status
    }

    // If we still don't have permission, exit
    if (finalStatus !== "granted") {
      console.log("Failed to get push token for push notification!")
      return null
    }

    try {
      // Get the token
      const token = (await Notifications.getExpoPushTokenAsync({
        projectId: process.env.EXPO_PROJECT_ID, // Add your Expo project ID here
      })).data

      // Store the token
      await AsyncStorage.setItem("@pushToken", token)

      // Configure for Android
      if (Platform.OS === "android") {
        await Notifications.setNotificationChannelAsync("default", {
          name: "default",
          importance: Notifications.AndroidImportance.MAX,
          vibrationPattern: [0, 250, 250, 250],
          lightColor: "#FF231F7C",
        })
      }

      return token
    } catch (error) {
      console.error("Error getting push token:", error)
      return null
    }
  }

  // Schedule a local notification
  static async scheduleLocalNotification(
    notification: NotificationData,
    trigger?: Notifications.NotificationTriggerInput,
  ) {
    try {
      const notificationId = await Notifications.scheduleNotificationAsync({
        content: {
          title: notification.title,
          body: notification.body,
          data: { ...notification.data, type: notification.type },
          sound: true,
          badge: 1,
        },
        trigger: trigger || null,
      })

      return notificationId
    } catch (error) {
      console.error("Error scheduling notification:", error)
      return null
    }
  }

  // Send an immediate local notification
  static async sendLocalNotification(notification: NotificationData) {
    return this.scheduleLocalNotification(notification)
  }

  // Cancel a scheduled notification
  static async cancelScheduledNotification(notificationId: string) {
    try {
      await Notifications.cancelScheduledNotificationAsync(notificationId)
      return true
    } catch (error) {
      console.error("Error canceling notification:", error)
      return false
    }
  }

  // Cancel all scheduled notifications
  static async cancelAllScheduledNotifications() {
    try {
      await Notifications.cancelAllScheduledNotificationsAsync()
      return true
    } catch (error) {
      console.error("Error canceling all notifications:", error)
      return false
    }
  }

  // Get all scheduled notifications
  static async getAllScheduledNotifications() {
    try {
      return await Notifications.getAllScheduledNotificationsAsync()
    } catch (error) {
      console.error("Error getting scheduled notifications:", error)
      return []
    }
  }

  // Set badge count
  static async setBadgeCount(count: number) {
    try {
      await Notifications.setBadgeCountAsync(count)
      return true
    } catch (error) {
      console.error("Error setting badge count:", error)
      return false
    }
  }

  // Add notification listener
  static addNotificationReceivedListener(
    listener: (notification: Notifications.Notification) => void
  ): Notifications.Subscription {
    return Notifications.addNotificationReceivedListener(listener)
  }

  // Add notification response listener
  static addNotificationResponseReceivedListener(
    listener: (response: Notifications.NotificationResponse) => void
  ): Notifications.Subscription {
    return Notifications.addNotificationResponseReceivedListener(listener)
  }

  // Remove notification listeners
  static removeNotificationSubscription(subscription: Notifications.Subscription) {
    Notifications.removeNotificationSubscription(subscription)
  }
}

