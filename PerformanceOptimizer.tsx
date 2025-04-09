"use client"

import { useCallback, useEffect, useRef, useState } from "react"
import { InteractionManager } from "react-native"
import AsyncStorage from "@react-native-async-storage/async-storage"

// Performance metrics type
export type PerformanceMetric = {
  id: string
  name: string
  startTime: number
  endTime?: number
  duration?: number
  metadata?: Record<string, any>
}

// Main performance optimizer service
export class PerformanceOptimizer {
  private static instance: PerformanceOptimizer
  private metrics: PerformanceMetric[] = []
  private activeMetrics: Record<string, PerformanceMetric> = {}
  private isInitialized = false
  private maxStoredMetrics = 100

  // Singleton pattern
  public static getInstance(): PerformanceOptimizer {
    if (!PerformanceOptimizer.instance) {
      PerformanceOptimizer.instance = new PerformanceOptimizer()
    }
    return PerformanceOptimizer.instance
  }

  constructor() {
    this.initialize()
  }

  // Initialize the performance optimizer
  private async initialize() {
    if (this.isInitialized) return

    try {
      // Load stored metrics
      const metricsData = await AsyncStorage.getItem("@performanceMetrics")
      if (metricsData) {
        this.metrics = JSON.parse(metricsData)
      }

      this.isInitialized = true
    } catch (error) {
      console.error("Error initializing performance optimizer:", error)
    }
  }

  // Start measuring a performance metric
  public startMeasure(name: string, metadata?: Record<string, any>): string {
    const id = `${name}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`

    const metric: PerformanceMetric = {
      id,
      name,
      startTime: performance.now(),
      metadata,
    }

    this.activeMetrics[id] = metric
    return id
  }

  // Stop measuring a performance metric
  public stopMeasure(id: string): PerformanceMetric | null {
    const metric = this.activeMetrics[id]
    if (!metric) {
      console.warn(`No active metric found with id: ${id}`)
      return null
    }

    const endTime = performance.now()
    const duration = endTime - metric.startTime

    const completedMetric: PerformanceMetric = {
      ...metric,
      endTime,
      duration,
    }

    // Remove from active metrics
    delete this.activeMetrics[id]

    // Add to metrics history
    this.metrics.unshift(completedMetric)

    // Trim metrics list if it gets too long
    if (this.metrics.length > this.maxStoredMetrics) {
      this.metrics = this.metrics.slice(0, this.maxStoredMetrics)
    }

    // Save metrics (don't await to avoid blocking)
    this.saveMetrics()

    return completedMetric
  }

  // Get all stored metrics
  public async getMetrics(): Promise<PerformanceMetric[]> {
    await this.ensureInitialized()
    return [...this.metrics]
  }

  // Clear all stored metrics
  public async clearMetrics(): Promise<void> {
    await this.ensureInitialized()
    this.metrics = []
    await this.saveMetrics()
  }

  // Save metrics to storage
  private async saveMetrics(): Promise<void> {
    try {
      await AsyncStorage.setItem("@performanceMetrics", JSON.stringify(this.metrics))
    } catch (error) {
      console.error("Error saving performance metrics:", error)
    }
  }

  // Ensure the service is initialized
  private async ensureInitialized(): Promise<void> {
    if (!this.isInitialized) {
      await this.initialize()
    }
  }

  // Get average duration for a specific metric name
  public getAverageDuration(name: string): number {
    const relevantMetrics = this.metrics.filter((m) => m.name === name && m.duration !== undefined)

    if (relevantMetrics.length === 0) {
      return 0
    }

    const totalDuration = relevantMetrics.reduce((sum, metric) => sum + (metric.duration || 0), 0)
    return totalDuration / relevantMetrics.length
  }

  // Get the slowest metrics
  public getSlowestMetrics(limit = 10): PerformanceMetric[] {
    return [...this.metrics]
      .filter((m) => m.duration !== undefined)
      .sort((a, b) => (b.duration || 0) - (a.duration || 0))
      .slice(0, limit)
  }
}

// Hook for using the performance optimizer
export function usePerformanceOptimizer() {
  const performanceOptimizer = PerformanceOptimizer.getInstance()

  return {
    startMeasure: (name: string, metadata?: Record<string, any>) => performanceOptimizer.startMeasure(name, metadata),
    stopMeasure: (id: string) => performanceOptimizer.stopMeasure(id),
    getMetrics: () => performanceOptimizer.getMetrics(),
    clearMetrics: () => performanceOptimizer.clearMetrics(),
    getAverageDuration: (name: string) => performanceOptimizer.getAverageDuration(name),
    getSlowestMetrics: (limit?: number) => performanceOptimizer.getSlowestMetrics(limit),
  }
}

// Hook for optimized list rendering
export function useOptimizedList<T>(items: T[], pageSize = 20, initialNumToRender = 10) {
  const [data, setData] = useState<T[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [hasMore, setHasMore] = useState(true)
  const pageRef = useRef(0)

  // Load initial data
  useEffect(() => {
    let isMounted = true
    setIsLoading(true)

    // Reset pagination when items change
    pageRef.current = 0

    // Use InteractionManager to avoid blocking the UI
    InteractionManager.runAfterInteractions(() => {
      if (isMounted) {
        const initialData = items.slice(0, initialNumToRender)
        setData(initialData)
        setHasMore(initialData.length < items.length)
        setIsLoading(false)
      }
    })

    return () => {
      isMounted = false
    }
  }, [items, initialNumToRender])

  // Load more data
  const loadMore = useCallback(() => {
    if (isLoading || !hasMore) return

    setIsLoading(true)

    // Use InteractionManager to avoid blocking the UI
    InteractionManager.runAfterInteractions(() => {
      const nextPage = pageRef.current + 1
      const startIndex = initialNumToRender + (nextPage - 1) * pageSize
      const endIndex = startIndex + pageSize

      const newData = [...data, ...items.slice(startIndex, endIndex)]

      setData(newData)
      setHasMore(newData.length < items.length)
      setIsLoading(false)
      pageRef.current = nextPage
    })
  }, [data, hasMore, initialNumToRender, isLoading, items, pageSize])

  return {
    data,
    isLoading,
    hasMore,
    loadMore,
  }
}

// Utility for memoizing expensive calculations
export function memoize<T, R>(fn: (arg: T) => R): (arg: T) => R {
  const cache = new Map<string, R>()

  return (arg: T) => {
    const key = JSON.stringify(arg)

    if (cache.has(key)) {
      return cache.get(key)!
    }

    const result = fn(arg)
    cache.set(key, result)

    return result
  }
}

