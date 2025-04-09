"use client"

import type React from "react"
import { useCallback, useState } from "react"
import { FlatList, type FlatListProps, ActivityIndicator, View, Text, StyleSheet, RefreshControl } from "react-native"
import { usePerformanceOptimizer } from "../services/PerformanceOptimizer"
import { useAccessibility } from "../services/AccessibilityService"

interface OptimizedFlatListProps<T> extends Omit<FlatListProps<T>, "renderItem"> {
  renderItem: (info: { item: T; index: number }) => React.ReactElement
  emptyText?: string
  loadingText?: string
  errorText?: string
  onRetry?: () => void
  isLoading?: boolean
  isError?: boolean
  onEndReachedThreshold?: number
  initialNumToRender?: number
  maxToRenderPerBatch?: number
  windowSize?: number
  metricName?: string
}

function OptimizedFlatList<T>({
  data,
  renderItem,
  emptyText = "No items found",
  loadingText = "Loading...",
  errorText = "Something went wrong",
  onRetry,
  isLoading = false,
  isError = false,
  onEndReachedThreshold = 0.5,
  initialNumToRender = 10,
  maxToRenderPerBatch = 10,
  windowSize = 21,
  metricName = "flatlist_render",
  ...rest
}: OptimizedFlatListProps<T>) {
  const { startMeasure, stopMeasure } = usePerformanceOptimizer()
  const { getAccessibilityProps } = useAccessibility()
  const [refreshing, setRefreshing] = useState(false)

  // Measure render time for each item
  const measuredRenderItem = useCallback(
    (info: { item: T; index: number }) => {
      const metricId = startMeasure(`${metricName}_item_${info.index}`)
      const result = renderItem(info)
      stopMeasure(metricId)
      return result
    },
    [renderItem, startMeasure, stopMeasure, metricName],
  )

  // Handle refresh
  const handleRefresh = useCallback(async () => {
    if (rest.onRefresh) {
      setRefreshing(true)
      await rest.onRefresh()
      setRefreshing(false)
    }
  }, [rest.onRefresh])

  // Render empty component
  const renderEmptyComponent = useCallback(() => {
    if (isLoading) {
      return (
        <View style={styles.emptyContainer}>
          <ActivityIndicator size="large" color="#2196F3" />
          <Text style={styles.emptyText} {...getAccessibilityProps(loadingText)}>
            {loadingText}
          </Text>
        </View>
      )
    }

    if (isError) {
      return (
        <View style={styles.emptyContainer}>
          <Text style={[styles.emptyText, styles.errorText]} {...getAccessibilityProps(errorText)}>
            {errorText}
          </Text>
          {onRetry && (
            <Text
              style={styles.retryText}
              onPress={onRetry}
              {...getAccessibilityProps("Retry", "Double tap to try again", "button")}
            >
              Tap to retry
            </Text>
          )}
        </View>
      )
    }

    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyText} {...getAccessibilityProps(emptyText)}>
          {emptyText}
        </Text>
      </View>
    )
  }, [isLoading, isError, loadingText, errorText, emptyText, onRetry, getAccessibilityProps])

  return (
    <FlatList
      data={data}
      renderItem={measuredRenderItem}
      ListEmptyComponent={renderEmptyComponent}
      onEndReachedThreshold={onEndReachedThreshold}
      initialNumToRender={initialNumToRender}
      maxToRenderPerBatch={maxToRenderPerBatch}
      windowSize={windowSize}
      removeClippedSubviews={true}
      keyExtractor={(item: any, index) => (item.id || item.key || index).toString()}
      refreshControl={
        rest.onRefresh ? (
          <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} colors={["#2196F3"]} tintColor="#2196F3" />
        ) : undefined
      }
      {...rest}
    />
  )
}

const styles = StyleSheet.create({
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
    minHeight: 200,
  },
  emptyText: {
    fontSize: 16,
    color: "#666",
    textAlign: "center",
    marginTop: 10,
  },
  errorText: {
    color: "#f44336",
  },
  retryText: {
    marginTop: 10,
    color: "#2196F3",
    fontSize: 14,
    fontWeight: "500",
  },
})

export default OptimizedFlatList

