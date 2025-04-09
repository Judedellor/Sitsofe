"use client"

import React, { useState, useEffect } from "react"
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, FlatList, ActivityIndicator, Alert, RefreshControl } from "react-native"
import { SafeAreaView } from "react-native-safe-area-context"
import { Ionicons } from "@expo/vector-icons"
import { useNavigation, useRoute, RouteProp } from "@react-navigation/native"
import { NativeStackNavigationProp } from "@react-navigation/native-stack"
import { useAuth } from "../context/AuthContext"
import { COLORS } from "../constants/colors"

// Define types
type RootStackParamList = {
  ScreeningComplianceDashboard: {
    propertyId: string;
  };
  ScreeningDetails: {
    screeningId: string;
  };
  AddScreening: {
    propertyId: string;
  };
};

type NavigationProp = NativeStackNavigationProp<RootStackParamList, 'ScreeningComplianceDashboard'>;
type RouteProps = RouteProp<RootStackParamList, 'ScreeningComplianceDashboard'>;

interface Screening {
  id: string;
  tenantName: string;
  propertyName: string;
  unitNumber: string;
  status: "pending" | "approved" | "rejected" | "in_progress";
  submittedDate: string;
  completedDate?: string;
  score?: number;
  notes?: string;
}

const ScreeningComplianceDashboard = () => {
  const navigation = useNavigation<NavigationProp>();
  const route = useRoute<RouteProps>();
  const { propertyId } = route.params;
  const { user, hasPermission } = useAuth();

  const [screenings, setScreenings] = useState<Screening[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [filter, setFilter] = useState<"all" | "pending" | "approved" | "rejected" | "in_progress">("all");

  // Load screenings
  useEffect(() => {
    loadScreenings();
  }, [propertyId]);

  const loadScreenings = async () => {
    try {
      setIsLoading(true);
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Mock data
      const mockScreenings: Screening[] = [
        {
          id: "1",
          tenantName: "John Doe",
          propertyName: "Sunset Villa",
          unitNumber: "101",
          status: "approved",
          submittedDate: "2023-06-10T14:30:00Z",
          completedDate: "2023-06-12T09:15:00Z",
          score: 85,
          notes: "Good credit history, stable employment",
        },
        {
          id: "2",
          tenantName: "Jane Smith",
          propertyName: "Sunset Villa",
          unitNumber: "203",
          status: "pending",
          submittedDate: "2023-06-15T11:20:00Z",
        },
        {
          id: "3",
          tenantName: "Robert Johnson",
          propertyName: "Sunset Villa",
          unitNumber: "305",
          status: "rejected",
          submittedDate: "2023-06-05T16:45:00Z",
          completedDate: "2023-06-07T10:30:00Z",
          score: 45,
          notes: "Poor credit history, unstable employment",
        },
        {
          id: "4",
          tenantName: "Emily Davis",
          propertyName: "Sunset Villa",
          unitNumber: "402",
          status: "in_progress",
          submittedDate: "2023-06-18T09:10:00Z",
        },
      ];

      setScreenings(mockScreenings);
    } catch (error) {
      console.error("Error loading screenings:", error);
      Alert.alert("Error", "Failed to load screenings. Please try again.");
    } finally {
      setIsLoading(false);
      setRefreshing(false);
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    loadScreenings();
  };

  const getStatusColor = (status: Screening["status"]) => {
    switch (status) {
      case "approved":
        return COLORS.success;
      case "rejected":
        return COLORS.error;
      case "in_progress":
        return COLORS.warning;
      case "pending":
      default:
        return COLORS.gray[500];
    }
  };

  const getStatusText = (status: Screening["status"]) => {
    switch (status) {
      case "approved":
        return "Approved";
      case "rejected":
        return "Rejected";
      case "in_progress":
        return "In Progress";
      case "pending":
      default:
        return "Pending";
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const filteredScreenings = screenings.filter(screening => 
    filter === "all" || screening.status === filter
  );

  const canAddScreening = hasPermission("manage_screenings");

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color={COLORS.darkGray} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Screening Compliance</Text>
        {canAddScreening && (
          <TouchableOpacity 
            style={styles.addButton}
            onPress={() => navigation.navigate("AddScreening", { propertyId })}
          >
            <Ionicons name="add" size={24} color={COLORS.primary} />
          </TouchableOpacity>
        )}
      </View>

      <View style={styles.filterContainer}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          <TouchableOpacity 
            style={[styles.filterButton, filter === "all" && styles.activeFilterButton]}
            onPress={() => setFilter("all")}
          >
            <Text style={[styles.filterText, filter === "all" && styles.activeFilterText]}>All</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={[styles.filterButton, filter === "pending" && styles.activeFilterButton]}
            onPress={() => setFilter("pending")}
          >
            <Text style={[styles.filterText, filter === "pending" && styles.activeFilterText]}>Pending</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={[styles.filterButton, filter === "in_progress" && styles.activeFilterButton]}
            onPress={() => setFilter("in_progress")}
          >
            <Text style={[styles.filterText, filter === "in_progress" && styles.activeFilterText]}>In Progress</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={[styles.filterButton, filter === "approved" && styles.activeFilterButton]}
            onPress={() => setFilter("approved")}
          >
            <Text style={[styles.filterText, filter === "approved" && styles.activeFilterText]}>Approved</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={[styles.filterButton, filter === "rejected" && styles.activeFilterButton]}
            onPress={() => setFilter("rejected")}
          >
            <Text style={[styles.filterText, filter === "rejected" && styles.activeFilterText]}>Rejected</Text>
          </TouchableOpacity>
        </ScrollView>
      </View>

      {isLoading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={COLORS.primary} />
          <Text style={styles.loadingText}>Loading screenings...</Text>
        </View>
      ) : (
        <ScrollView 
          style={styles.content}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
        >
          {filteredScreenings.length > 0 ? (
            filteredScreenings.map(screening => (
              <TouchableOpacity 
                key={screening.id}
                style={styles.screeningCard}
                onPress={() => navigation.navigate("ScreeningDetails", { screeningId: screening.id })}
              >
                <View style={styles.screeningHeader}>
                  <Text style={styles.tenantName}>{screening.tenantName}</Text>
                  <View style={[styles.statusBadge, { backgroundColor: getStatusColor(screening.status) }]}>
                    <Text style={styles.statusText}>{getStatusText(screening.status)}</Text>
                  </View>
                </View>
                
                <View style={styles.screeningDetails}>
                  <View style={styles.detailRow}>
                    <Ionicons name="business-outline" size={16} color={COLORS.gray[500]} style={styles.detailIcon} />
                    <Text style={styles.detailText}>
                      {screening.propertyName} {screening.unitNumber ? `#${screening.unitNumber}` : ""}
                    </Text>
                  </View>
                  
                  <View style={styles.detailRow}>
                    <Ionicons name="calendar-outline" size={16} color={COLORS.gray[500]} style={styles.detailIcon} />
                    <Text style={styles.detailText}>
                      Submitted: {formatDate(screening.submittedDate)}
                    </Text>
                  </View>
                  
                  {screening.completedDate && (
                    <View style={styles.detailRow}>
                      <Ionicons name="checkmark-circle-outline" size={16} color={COLORS.gray[500]} style={styles.detailIcon} />
                      <Text style={styles.detailText}>
                        Completed: {formatDate(screening.completedDate)}
                      </Text>
                    </View>
                  )}
                  
                  {screening.score !== undefined && (
                    <View style={styles.detailRow}>
                      <Ionicons name="star-outline" size={16} color={COLORS.gray[500]} style={styles.detailIcon} />
                      <Text style={styles.detailText}>
                        Score: {screening.score}/100
                      </Text>
                    </View>
                  )}
                </View>
              </TouchableOpacity>
            ))
          ) : (
            <View style={styles.emptyContainer}>
              <Ionicons name="document-text-outline" size={64} color={COLORS.gray[400]} />
              <Text style={styles.emptyText}>No screenings found</Text>
            </View>
          )}
        </ScrollView>
      )}
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: COLORS.white,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.gray[200],
  },
  backButton: {
    padding: 4,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: COLORS.darkGray,
  },
  addButton: {
    padding: 4,
  },
  filterContainer: {
    backgroundColor: COLORS.white,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.gray[200],
  },
  filterButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginHorizontal: 4,
    borderRadius: 20,
    backgroundColor: COLORS.gray[100],
  },
  activeFilterButton: {
    backgroundColor: COLORS.primary,
  },
  filterText: {
    fontSize: 14,
    color: COLORS.gray[500],
  },
  activeFilterText: {
    color: COLORS.white,
    fontWeight: "500",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: COLORS.gray[500],
  },
  content: {
    flex: 1,
    padding: 16,
  },
  screeningCard: {
    backgroundColor: COLORS.white,
    borderRadius: 8,
    marginBottom: 16,
    padding: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  screeningHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  tenantName: {
    fontSize: 16,
    fontWeight: "bold",
    color: COLORS.darkGray,
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  statusText: {
    fontSize: 12,
    color: COLORS.white,
    fontWeight: "500",
  },
  screeningDetails: {
    marginTop: 8,
  },
  detailRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  detailIcon: {
    marginRight: 8,
  },
  detailText: {
    fontSize: 14,
    color: COLORS.gray[500],
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 24,
  },
  emptyText: {
    fontSize: 16,
    color: COLORS.gray[500],
    fontStyle: "italic",
    textAlign: "center",
    marginTop: 16,
  },
})

export default ScreeningComplianceDashboard

