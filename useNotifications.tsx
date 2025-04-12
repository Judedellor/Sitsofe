"use client"

import { useEffect, useState, useRef, useCallback } from "react"
import type * as Notifications from "expo-notifications"
import { NotificationService, type NotificationData } from "../services/NotificationService"
import { useNavigation } from "@react-navigation/native"

export const useNotifications = () => {
  const [expoPushToken, setExpoPushToken] = useState<string | null>(null)
  const [notification, setNotification] = useState<Notifications.Notification | null>(null)
  const notificationListener = useRef<Notifications.Subscription>()
  const responseListener = useRef<Notifications.Subscription>()
  const navigation = useNavigation()

  useEffect(() => {
    // Register for push notifications
    registerForPushNotifications()

    // Set up notification listeners
    notificationListener.current = NotificationService.addNotificationReceivedListener((notification) => {
      setNotification(notification)
    })

    // Handle notification responses (when user taps on notification)
    responseListener.current = NotificationService.addNotificationResponseReceivedListener(handleNotificationResponse)

    // Clean up listeners on unmount
    return () => {
      if (notificationListener.current) {
        NotificationService.removeNotificationSubscription(notificationListener.current)
      }
      if (responseListener.current) {
        NotificationService.removeNotificationSubscription(responseListener.current)
      }
    }
  }, [])

  // Register for push notifications
  const registerForPushNotifications = async () => {
    const token = await NotificationService.registerForPushNotifications()
    setExpoPushToken(token)
  }

  // Handle notification response (when user taps on notification)
  const handleNotificationResponse = useCallback(
    (response: Notifications.NotificationResponse) => {
      const data = response.notification.request.content.data

      // Navigate based on notification type
      if (data?.type) {
        switch (data.type) {
          case "payment":
            if (data.paymentId) {
              navigation.navigate("PaymentDetail", { paymentId: data.paymentId })
            } else {
              navigation.navigate("Payments")
            }
            break
          case "maintenance":
            if (data.requestId) {
              navigation.navigate("MaintenanceDetail", { requestId: data.requestId })
            } else {
              navigation.navigate("Maintenance")
            }
            break
          case "lease":
            if (data.documentId) {
              navigation.navigate("DocumentDetail", { documentId: data.documentId })
            } else {
              navigation.navigate("Documents")
            }
            break
          case "message":
            if (data.chatId) {
              navigation.navigate("Chat", { chatId: data.chatId })
            } else {
              navigation.navigate("Messages")
            }
            break
          default:
            navigation.navigate("NotificationsScreen")
        }
      }
    },
    [navigation],
  )

  // Send a local notification
  const sendLocalNotification = async (notificationData: NotificationData) => {
    return NotificationService.sendLocalNotification(notificationData)
  }

  // Schedule a notification
  const scheduleNotification = async (
    notificationData: NotificationData,
    trigger: Notifications.NotificationTriggerInput,
  ) => {
    return NotificationService.scheduleLocalNotification(notificationData, trigger)
  }

  // Cancel a scheduled notification
  const cancelNotification = async (notificationId: string) => {
    return NotificationService.cancelScheduledNotification(notificationId)
  }

  // Get all scheduled notifications
  const getScheduledNotifications = async () => {
    return NotificationService.getAllScheduledNotifications()
  }

  return {
    expoPushToken,
    notification,
    sendLocalNotification,
    scheduleNotification,
    cancelNotification,
    getScheduledNotifications,
  }
}
