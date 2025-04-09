import React, { useEffect, useRef } from 'react';
import { View, StyleSheet, Animated, ViewStyle, Easing } from 'react-native';

interface SkeletonProps {
  width?: number | string;
  height?: number | string;
  borderRadius?: number;
  style?: ViewStyle;
  shimmerColors?: string[];
}

/**
 * A skeleton loader component for displaying loading states
 * 
 * @param width - Width of the skeleton
 * @param height - Height of the skeleton
 * @param borderRadius - Border radius of the skeleton
 * @param style - Additional styles
 * @param shimmerColors - Colors for the shimmer effect gradient
 */
export const SkeletonLoader: React.FC<SkeletonProps> = ({
  width = '100%',
  height = 20,
  borderRadius = 4,
  style,
  shimmerColors = ['#ebebeb', '#f5f5f5', '#ebebeb'],
}) => {
  const shimmerAnimation = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const shimmer = Animated.loop(
      Animated.timing(shimmerAnimation, {
        toValue: 1,
        duration: 1500,
        easing: Easing.linear,
        useNativeDriver: false,
      })
    );
    
    shimmer.start();
    
    return () => {
      shimmer.stop();
    };
  }, [shimmerAnimation]);

  const shimmerTranslate = shimmerAnimation.interpolate({
    inputRange: [0, 1],
    outputRange: [-width, width],
  });

  return (
    <View
      style={[
        styles.container,
        {
          width,
          height,
          borderRadius,
        },
        style,
      ]}
      accessibilityLabel="Loading content"
      accessibilityRole="none"
    >
      <Animated.View
        style={[
          styles.shimmer,
          {
            transform: [{ translateX: shimmerTranslate }],
            backgroundColor: shimmerColors[0],
          },
        ]}
      />
    </View>
  );
};

/**
 * A card skeleton loader for property cards
 */
export const PropertyCardSkeleton: React.FC = () => {
  return (
    <View style={styles.cardContainer}>
      <SkeletonLoader height={180} borderRadius={8} />
      <View style={styles.cardContent}>
        <SkeletonLoader width="70%" height={24} style={styles.marginBottom} />
        <SkeletonLoader width="50%" height={16} style={styles.marginBottom} />
        <SkeletonLoader width="90%" height={16} style={styles.marginBottom} />
      </View>
    </View>
  );
};

/**
 * A list item skeleton loader for tenant or payment lists
 */
export const ListItemSkeleton: React.FC = () => {
  return (
    <View style={styles.listItemContainer}>
      <SkeletonLoader width={50} height={50} borderRadius={25} style={styles.avatar} />
      <View style={styles.listItemContent}>
        <SkeletonLoader width="60%" height={18} style={styles.marginBottom} />
        <SkeletonLoader width="40%" height={14} />
      </View>
    </View>
  );
};

/**
 * A dashboard skeleton loader for dashboard cards and metrics
 */
export const DashboardSkeleton: React.FC = () => {
  return (
    <View style={styles.dashboardContainer}>
      <View style={styles.metricsRow}>
        <SkeletonLoader width="48%" height={100} borderRadius={8} />
        <SkeletonLoader width="48%" height={100} borderRadius={8} />
      </View>
      <SkeletonLoader height={200} borderRadius={8} style={styles.chart} />
      <View style={styles.listContainer}>
        <SkeletonLoader width="50%" height={24} style={styles.marginBottom} />
        <ListItemSkeleton />
        <ListItemSkeleton />
        <ListItemSkeleton />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#ebebeb',
    overflow: 'hidden',
  },
  shimmer: {
    width: '100%',
    height: '100%',
    opacity: 0.4,
  },
  cardContainer: {
    marginBottom: 16,
    borderRadius: 8,
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
    overflow: 'hidden',
  },
  cardContent: {
    padding: 16,
  },
  marginBottom: {
    marginBottom: 8,
  },
  listItemContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  avatar: {
    marginRight: 12,
  },
  listItemContent: {
    flex: 1,
  },
  dashboardContainer: {
    padding: 16,
  },
  metricsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  chart: {
    marginBottom: 24,
  },
  listContainer: {
    marginTop: 16,
  },
});
