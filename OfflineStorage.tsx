"use client"

import AsyncStorage from "@react-native-async-storage/async-storage"
import { useState, useEffect } from "react"
import NetInfo, { NetInfoState } from "@react-native-community/netinfo"

// Types for offline storage
export type StorageEntity = "properties" | "tenants" | "maintenance" | "payments" | "settings"

// Main offline storage service
export class OfflineStorage {
  private static instance: OfflineStorage
  private cacheTimestamps: Record<string, number> = {}
  private listeners: Array<(status: boolean) => void> = []
  private networkListenerUnsubscribe: (() => void) | null = null
  private isOnline = true

  // Singleton pattern
  public static getInstance(): OfflineStorage {
    if (!OfflineStorage.instance) {
      OfflineStorage.instance = new OfflineStorage()
    }
    return OfflineStorage.instance
  }

  constructor() {
    this.initialize()
  }

  // Initialize the offline storage
  private async initialize() {
    try {
      // Load cache timestamps
      const timestampsData = await AsyncStorage.getItem("@cacheTimestamps")
      if (timestampsData) {
        this.cacheTimestamps = JSON.parse(timestampsData)
      }

      // Set up network listener
      this.networkListenerUnsubscribe = NetInfo.addEventListener((state: NetInfoState) => {
        const wasOnline = this.isOnline
        this.isOnline = !!state.isConnected

        // If we just came back online, notify listeners
        if (!wasOnline && this.isOnline) {
          this.notifyListeners(true)
        } else if (wasOnline && !this.isOnline) {
          this.notifyListeners(false)
        }
      })

      // Initial network check
      const netInfo = await NetInfo.fetch()
      this.isOnline = !!netInfo.isConnected
    } catch (error) {
      console.error("Error initializing offline storage:", error)
    }
  }

  // Store data for offline use
  public async storeData<T>(entity: StorageEntity, data: T): Promise<void> {
    try {
      await AsyncStorage.setItem(`@offline_${entity}`, JSON.stringify(data))

      // Update cache timestamp
      this.cacheTimestamps[entity] = Date.now()
      await this.saveCacheTimestamps()
    } catch (error) {
      console.error(`Error storing offline data for ${entity}:`, error)
      throw error
    }
  }

  // Get data from offline storage
  public async getData<T>(entity: StorageEntity): Promise<T | null> {
    try {
      const data = await AsyncStorage.getItem(`@offline_${entity}`)
      return data ? JSON.parse(data) : null
    } catch (error) {
      console.error(`Error getting offline data for ${entity}:`, error)
      return null
    }
  }

  // Check if we have cached data for an entity
  public async hasCachedData(entity: StorageEntity): Promise<boolean> {
    try {
      const data = await AsyncStorage.getItem(`@offline_${entity}`)
      return !!data
    } catch (error) {
      console.error(`Error checking cached data for ${entity}:`, error)
      return false
    }
  }

  // Get the timestamp for when data was last cached
  public getCacheTimestamp(entity: StorageEntity): number {
    return this.cacheTimestamps[entity] || 0
  }

  // Check if cached data is stale (older than maxAge in milliseconds)
  public isCacheStale(entity: StorageEntity, maxAge: number): boolean {
    const timestamp = this.getCacheTimestamp(entity)
    return Date.now() - timestamp > maxAge
  }

  // Clear cached data for an entity
  public async clearCache(entity: StorageEntity): Promise<void> {
    try {
      await AsyncStorage.removeItem(`@offline_${entity}`)

      // Update cache timestamp
      delete this.cacheTimestamps[entity]
      await this.saveCacheTimestamps()
    } catch (error) {
      console.error(`Error clearing cache for ${entity}:`, error)
      throw error
    }
  }

  // Clear all cached data
  public async clearAllCache(): Promise<void> {
    try {
      const keys = await AsyncStorage.getAllKeys()
      const offlineKeys = keys.filter((key) => key.startsWith("@offline_"))
      await AsyncStorage.multiRemove(offlineKeys)

      // Clear cache timestamps
      this.cacheTimestamps = {}
      await this.saveCacheTimestamps()
    } catch (error) {
      console.error("Error clearing all cache:", error)
      throw error
    }
  }

  // Save cache timestamps
  private async saveCacheTimestamps(): Promise<void> {
    try {
      await AsyncStorage.setItem("@cacheTimestamps", JSON.stringify(this.cacheTimestamps))
    } catch (error) {
      console.error("Error saving cache timestamps:", error)
    }
  }

  // Add a listener for network status changes
  public addListener(listener: (status: boolean) => void): () => void {
    this.listeners.push(listener)
    // Immediately notify with current status
    listener(this.isOnline)

    return () => {
      this.listeners = this.listeners.filter((l) => l !== listener)
    }
  }

  // Notify all listeners of a status change
  private notifyListeners(isOnline: boolean) {
    this.listeners.forEach((listener) => listener(isOnline))
  }

  // Check if we're currently online
  public isNetworkAvailable(): boolean {
    return this.isOnline
  }

  // Clean up resources
  public destroy() {
    if (this.networkListenerUnsubscribe) {
      this.networkListenerUnsubscribe()
    }
    this.listeners = []
  }
}

// Hook for using offline storage
export function useOfflineStorage() {
  const [isOnline, setIsOnline] = useState(true)

  useEffect(() => {
    const offlineStorage = OfflineStorage.getInstance()

    // Set up listener
    const unsubscribe = offlineStorage.addListener((online) => {
      setIsOnline(online)
    })

    return () => {
      unsubscribe()
    }
  }, [])

  const offlineStorage = OfflineStorage.getInstance()

  return {
    isOnline,
    storeData: <T,>(entity: StorageEntity, data: T) => offlineStorage.storeData(entity, data),
    getData: <T,>(entity: StorageEntity) => offlineStorage.getData<T>(entity),
    hasCachedData: (entity: StorageEntity) => offlineStorage.hasCachedData(entity),
    getCacheTimestamp: (entity: StorageEntity) => offlineStorage.getCacheTimestamp(entity),
    isCacheStale: (entity: StorageEntity, maxAge: number) => offlineStorage.isCacheStale(entity, maxAge),
    clearCache: (entity: StorageEntity) => offlineStorage.clearCache(entity),
    clearAllCache: () => offlineStorage.clearAllCache(),
  }
}

