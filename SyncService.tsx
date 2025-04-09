"use client"

import AsyncStorage from "@react-native-async-storage/async-storage"
import NetInfo from "@react-native-community/netinfo"
import { useState, useEffect } from "react"

// Types for sync operations
export type SyncOperation = {
  id: string
  entity: string
  operation: "create" | "update" | "delete"
  data: any
  timestamp: number
  retryCount: number
}

// Main sync service class
export class SyncService {
  private static instance: SyncService
  private syncQueue: SyncOperation[] = []
  private isSyncing = false
  private listeners: Array<(status: boolean) => void> = []
  private networkListenerUnsubscribe: (() => void) | null = null

  // Singleton pattern
  public static getInstance(): SyncService {
    if (!SyncService.instance) {
      SyncService.instance = new SyncService()
    }
    return SyncService.instance
  }

  constructor() {
    this.initialize()
  }

  // Initialize the sync service
  private async initialize() {
    try {
      // Load pending operations from storage
      const queueData = await AsyncStorage.getItem("@syncQueue")
      if (queueData) {
        this.syncQueue = JSON.parse(queueData)
      }

      // Set up network listener
      this.networkListenerUnsubscribe = NetInfo.addEventListener((state) => {
        if (state.isConnected && this.syncQueue.length > 0) {
          this.processSyncQueue()
        }

        // Notify listeners of network status change
        this.notifyListeners(!!state.isConnected)
      })
    } catch (error) {
      console.error("Error initializing sync service:", error)
    }
  }

  // Add a sync operation to the queue
  public async addToSyncQueue(operation: Omit<SyncOperation, "id" | "timestamp" | "retryCount">): Promise<string> {
    try {
      const id = `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
      const syncOp: SyncOperation = {
        ...operation,
        id,
        timestamp: Date.now(),
        retryCount: 0,
      }

      this.syncQueue.push(syncOp)
      await this.saveSyncQueue()

      // Try to process the queue if we're online
      const netInfo = await NetInfo.fetch()
      if (netInfo.isConnected) {
        this.processSyncQueue()
      }

      return id
    } catch (error) {
      console.error("Error adding to sync queue:", error)
      throw error
    }
  }

  // Process the sync queue
  private async processSyncQueue() {
    if (this.isSyncing || this.syncQueue.length === 0) {
      return
    }

    this.isSyncing = true

    try {
      // Process each operation in order
      const operations = [...this.syncQueue]
      for (const operation of operations) {
        try {
          await this.processOperation(operation)

          // Remove from queue if successful
          this.syncQueue = this.syncQueue.filter((op) => op.id !== operation.id)
          await this.saveSyncQueue()
        } catch (error) {
          console.error(`Error processing operation ${operation.id}:`, error)

          // Increment retry count
          const opIndex = this.syncQueue.findIndex((op) => op.id === operation.id)
          if (opIndex >= 0) {
            this.syncQueue[opIndex].retryCount += 1

            // If we've retried too many times, remove it
            if (this.syncQueue[opIndex].retryCount > 5) {
              this.syncQueue = this.syncQueue.filter((op) => op.id !== operation.id)
            }

            await this.saveSyncQueue()
          }

          // Stop processing on error
          break
        }
      }
    } finally {
      this.isSyncing = false
    }
  }

  // Process a single operation
  private async processOperation(operation: SyncOperation): Promise<void> {
    // This would be replaced with actual API calls in a real app
    switch (operation.entity) {
      case "property":
        return this.syncProperty(operation)
      case "tenant":
        return this.syncTenant(operation)
      case "maintenance":
        return this.syncMaintenance(operation)
      case "payment":
        return this.syncPayment(operation)
      default:
        throw new Error(`Unknown entity type: ${operation.entity}`)
    }
  }

  // Sync property data
  private async syncProperty(operation: SyncOperation): Promise<void> {
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 500))

    // In a real app, this would make an API request
    console.log(`Syncing property: ${operation.operation}`, operation.data)

    // Handle conflict resolution if needed
    if (operation.operation === "update") {
      // Check for conflicts with server version
      const serverTimestamp = await this.getServerTimestamp("property", operation.data.id)
      if (serverTimestamp > operation.timestamp) {
        // Handle conflict - in this case we're using "client wins" strategy
        console.log("Conflict detected, using client data")
      }
    }
  }

  // Sync tenant data
  private async syncTenant(operation: SyncOperation): Promise<void> {
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 500))

    // In a real app, this would make an API request
    console.log(`Syncing tenant: ${operation.operation}`, operation.data)
  }

  // Sync maintenance data
  private async syncMaintenance(operation: SyncOperation): Promise<void> {
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 500))

    // In a real app, this would make an API request
    console.log(`Syncing maintenance: ${operation.operation}`, operation.data)
  }

  // Sync payment data
  private async syncPayment(operation: SyncOperation): Promise<void> {
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 500))

    // In a real app, this would make an API request
    console.log(`Syncing payment: ${operation.operation}`, operation.data)
  }

  // Get the server timestamp for an entity
  private async getServerTimestamp(entity: string, id: string): Promise<number> {
    // In a real app, this would make an API request to get the last modified time
    // For now, just return a random timestamp
    return Date.now() - Math.floor(Math.random() * 1000000)
  }

  // Save the sync queue to storage
  private async saveSyncQueue(): Promise<void> {
    try {
      await AsyncStorage.setItem("@syncQueue", JSON.stringify(this.syncQueue))
    } catch (error) {
      console.error("Error saving sync queue:", error)
    }
  }

  // Add a listener for sync status changes
  public addListener(listener: (status: boolean) => void): () => void {
    this.listeners.push(listener)
    return () => {
      this.listeners = this.listeners.filter((l) => l !== listener)
    }
  }

  // Notify all listeners of a status change
  private notifyListeners(isOnline: boolean) {
    this.listeners.forEach((listener) => listener(isOnline))
  }

  // Clean up resources
  public destroy() {
    if (this.networkListenerUnsubscribe) {
      this.networkListenerUnsubscribe()
    }
    this.listeners = []
  }

  // Get the current sync queue (for debugging)
  public getSyncQueue(): SyncOperation[] {
    return [...this.syncQueue]
  }

  // Force a sync attempt
  public async forceSyncNow(): Promise<boolean> {
    const netInfo = await NetInfo.fetch()
    if (netInfo.isConnected) {
      await this.processSyncQueue()
      return true
    }
    return false
  }
}

// Hook for using the sync service
export function useSyncService() {
  const [isOnline, setIsOnline] = useState(true)
  const [syncPending, setSyncPending] = useState(0)

  useEffect(() => {
    const syncService = SyncService.getInstance()

    // Update sync pending count
    const updateSyncPending = () => {
      setSyncPending(syncService.getSyncQueue().length)
    }

    // Initial update
    updateSyncPending()

    // Set up listeners
    const unsubscribe = syncService.addListener((online) => {
      setIsOnline(online)
      updateSyncPending()
    })

    // Check network status
    NetInfo.fetch().then((state) => {
      setIsOnline(!!state.isConnected)
    })

    // Set up interval to update sync pending count
    const interval = setInterval(updateSyncPending, 5000)

    return () => {
      unsubscribe()
      clearInterval(interval)
    }
  }, [])

  return {
    isOnline,
    syncPending,
    addToSyncQueue: (operation: Omit<SyncOperation, "id" | "timestamp" | "retryCount">) =>
      SyncService.getInstance().addToSyncQueue(operation),
    forceSyncNow: () => SyncService.getInstance().forceSyncNow(),
  }
}

