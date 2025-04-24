"use client"

import { useState, useEffect } from "react"
import { supabase } from "../lib/supabase/client"
import { useAuth } from "./useAuth"

interface Message {
  id: string
  conversation_id: string
  sender_id: string
  content: string
  created_at: string
  type: "text" | "image"
}

export function useChat(conversationId: string) {
  const [messages, setMessages] = useState<Message[]>([])
  const [loading, setLoading] = useState(true)
  const { user } = useAuth()

  useEffect(() => {
    fetchMessages()

    // Subscribe to new messages
    const subscription = supabase
      .channel(`chat:${conversationId}`)
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "messages",
          filter: `conversation_id=eq.${conversationId}`,
        },
        (payload) => {
          setMessages((prev) => [...prev, payload.new as Message])
        },
      )
      .subscribe()

    return () => {
      subscription.unsubscribe()
    }
  }, [conversationId])

  async function fetchMessages() {
    try {
      setLoading(true)

      const { data, error } = await supabase
        .from("messages")
        .select("*")
        .eq("conversation_id", conversationId)
        .order("created_at", { ascending: true })

      if (error) throw error
      setMessages(data)
    } catch (error) {
      console.error("Error fetching messages:", error)
    } finally {
      setLoading(false)
    }
  }

  async function sendMessage(content: string, type: Message["type"] = "text") {
    if (!user) {
      throw new Error("You must be logged in to send messages")
    }

    const { data, error } = await supabase
      .from("messages")
      .insert({
        conversation_id: conversationId,
        sender_id: user.id,
        content,
        type,
      })
      .select()
      .single()

    if (error) throw error
    return data
  }

  return {
    messages,
    loading,
    sendMessage,
  }
}
