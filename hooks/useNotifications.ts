"use client"

import { useState, useEffect } from "react"
import { supabase } from "../lib/supabase/client"

interface Notification {
  id: string
  user_id: string
  title: string
  content: string
  type: string
  read: boolean
  created_at: string
}

// Mock data
const MOCK_NOTIFICATIONS: Notification[] = [
  {
    id: "1",
    user_id: "user1",
    title: "New Message",
    content: "You have a new message about your property",
    type: "message",
    read: false,
    created_at: new Date().toISOString(),
  },
  // Add more mock notifications
]

export function useNotifications() {
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [unreadCount, setUnreadCount] = useState(0)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchNotifications()

    // Subscribe to new notifications
    const subscription = supabase
      .channel("notifications")
      .on("postgres_changes", { event: "INSERT", schema: "public", table: "notifications" }, (payload) => {
        const newNotification = payload.new as Notification
        setNotifications((prev) => [newNotification, ...prev])
        if (!newNotification.read) {
          setUnreadCount((prev) => prev + 1)
        }
      })
      .subscribe()

    return () => {
      subscription.unsubscribe()
    }
  }, [])

  async function fetchNotifications() {
    try {
      setLoading(true)

      // For development, return mock data
      setNotifications(MOCK_NOTIFICATIONS)
      setUnreadCount(MOCK_NOTIFICATIONS.filter((n) => !n.read).length)

      // When ready for production, uncomment:
      /*
      const { data, error } = await supabase
        .from('notifications')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) throw error
      setNotifications(data)
      setUnreadCount(data.filter(n => !n.read).length)
      */
    } catch (error) {
      console.error("Error fetching notifications:", error)
    } finally {
      setLoading(false)
    }
  }

  async function markAsRead(notificationId: string) {
    // For development, update mock data
    setNotifications((prev) => prev.map((n) => (n.id === notificationId ? { ...n, read: true } : n)))
    setUnreadCount((prev) => Math.max(0, prev - 1))

    // When ready for production, uncomment:
    /*
    const { error } = await supabase
      .from('notifications')
      .update({ read: true })
      .eq('id', notificationId)
    if (error) throw error
    */
  }

  return {
    notifications,
    unreadCount,
    loading,
    markAsRead,
  }
}
