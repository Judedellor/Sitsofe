import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  TextInput,
  Image,
  ActivityIndicator,
  ScrollView,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { COLORS } from "../constants/colors";

// Define types
type RootStackParamList = {
  TenantDetail: {
    tenantId: string;
  };
  AddTenant: undefined;
};

type NavigationProp = NativeStackNavigationProp<RootStackParamList, 'TenantDetail'>;

interface Tenant {
  id: string;
  name: string;
  email: string;
  phone: string;
  property: string;
  unit: string;
  leaseStart: string;
  leaseEnd: string;
  rent: string;
  status: "active" | "notice" | "inactive";
  profileImage: string;
  paymentStatus: "paid" | "pending" | "late";
  lastPaymentDate: string | null;
  balance: string;
}

interface FilterChipProps {
  label: string;
  selected: boolean;
  onPress: () => void;
}

interface TenantCardProps {
  tenant: Tenant;
  onPress: (tenant: Tenant) => void;
}

// Mock data for tenants
const TENANTS_DATA: Tenant[] = [
  {
    id: "1",
    name: "John Smith",
    email: "john.smith@example.com",
    phone: "(555) 123-4567",
    property: "Sunset Apartments",
    unit: "A101",
    leaseStart: "2023-10-15",
    leaseEnd: "2024-10-15",
    rent: "$1,250",
    status: "active",
    profileImage: "https://randomuser.me/api/portraits/men/32.jpg",
    paymentStatus: "paid",
    lastPaymentDate: "2024-05-01",
    balance: "$0",
  },
  // ... other tenant data ...
];

// Filter Chip component
const FilterChip: React.FC<FilterChipProps> = ({ label, selected, onPress }) => (
  <TouchableOpacity style={[styles.filterChip, selected && styles.filterChipSelected]} onPress={onPress}>
    <Text style={[styles.filterChipText, selected && styles.filterChipTextSelected]}>{label}</Text>
  </TouchableOpacity>
);

// Tenant Card component
const TenantCard: React.FC<TenantCardProps> = ({ tenant, onPress }) => {
  const getPaymentStatusColor = (status: Tenant["paymentStatus"]): string => {
    switch (status) {
      case "paid":
        return COLORS.success;
      case "pending":
        return COLORS.warning;
      case "late":
        return COLORS.error;
      default:
        return COLORS.gray[500];
    }
  };

  const getStatusColor = (status: Tenant["status"]): string => {
    switch (status) {
      case "active":
        return COLORS.success;
      case "notice":
        return COLORS.warning;
      case "inactive":
        return COLORS.error;
      default:
        return COLORS.gray[500];
    }
  };

  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
  };

  const daysUntilLeaseEnd = (leaseEndDate: string): number => {
    const today = new Date();
    const end = new Date(leaseEndDate);
    const diffTime = end.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const leaseRemainingDays = daysUntilLeaseEnd(tenant.leaseEnd);
  const isLeaseSoonExpiring = leaseRemainingDays > 0 && leaseRemainingDays <= 30;

  return (
    <TouchableOpacity style={styles.tenantCard} onPress={() => onPress(tenant)}>
      <View style={styles.cardHeader}>
        <Image source={{ uri: tenant.profileImage }} style={styles.profileImage} />
        <View style={styles.headerInfo}>
          <Text style={styles.tenantName}>{tenant.name}</Text>
          <View style={styles.propertyInfo}>
            <Text style={styles.propertyText}>
              {tenant.property} • {tenant.unit}
            </Text>
          </View>
        </View>
        <View
          style={[
            styles.statusBadge,
            { backgroundColor: getStatusColor(tenant.status) + "20", borderColor: getStatusColor(tenant.status) },
          ]}
        >
          <Text style={[styles.statusText, { color: getStatusColor(tenant.status) }]}>
            {tenant.status === "notice" ? "Notice" : "Active"}
          </Text>
        </View>
      </View>

      <View style={styles.cardContent}>
        <View style={styles.contactInfo}>
          <View style={styles.infoItem}>
            <Ionicons name="mail-outline" size={16} color={COLORS.gray[600]} />
            <Text style={styles.infoText}>{tenant.email}</Text>
          </View>
          <View style={styles.infoItem}>
            <Ionicons name="call-outline" size={16} color={COLORS.gray[600]} />
            <Text style={styles.infoText}>{tenant.phone}</Text>
          </View>
        </View>

        <View style={styles.leaseDetails}>
          <View style={styles.leaseItem}>
            <Text style={styles.leaseLabel}>Lease End</Text>
            <Text style={styles.leaseValue}>{formatDate(tenant.leaseEnd)}</Text>
            {isLeaseSoonExpiring && (
              <View style={styles.expiringBadge}>
                <Text style={styles.expiringText}>{leaseRemainingDays} days left</Text>
              </View>
            )}
          </View>
          <View style={styles.leaseItem}>
            <Text style={styles.leaseLabel}>Rent</Text>
            <Text style={styles.leaseValue}>{tenant.rent}/mo</Text>
          </View>
        </View>

        <View style={styles.paymentInfo}>
          <View style={styles.paymentStatus}>
            <View
              style={[
                styles.paymentBadge,
                { backgroundColor: getPaymentStatusColor(tenant.paymentStatus) + "20" },
              ]}
            >
              <Text style={[styles.paymentText, { color: getPaymentStatusColor(tenant.paymentStatus) }]}>
                {tenant.paymentStatus.charAt(0).toUpperCase() + tenant.paymentStatus.slice(1)}
              </Text>
            </View>
            {tenant.lastPaymentDate && (
              <Text style={styles.lastPaymentText}>Last paid: {formatDate(tenant.lastPaymentDate)}</Text>
            )}
          </View>
          {tenant.balance !== "$0" && (
            <Text style={styles.balanceText}>Balance: {tenant.balance}</Text>
          )}
        </View>
      </View>
    </TouchableOpacity>
  );
};

const TenantScreen: React.FC = () => {
  const navigation = useNavigation<NavigationProp>();
  const [isLoading, setIsLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [propertyFilter, setPropertyFilter] = useState<string>("all");
  const [tenants, setTenants] = useState<Tenant[]>([]);

  useEffect(() => {
    fetchTenants();
  }, []);

  const fetchTenants = async () => {
    try {
      setIsLoading(true);
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));
      setTenants(TENANTS_DATA);
    } catch (error) {
      console.error("Error fetching tenants:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const filterTenants = (query: string, statusFilter: string, propertyFilter: string): Tenant[] => {
    return tenants.filter((tenant) => {
      const matchesSearch =
        query === "" ||
        tenant.name.toLowerCase().includes(query.toLowerCase()) ||
        tenant.email.toLowerCase().includes(query.toLowerCase()) ||
        tenant.unit.toLowerCase().includes(query.toLowerCase());

      const matchesStatus = statusFilter === "all" || tenant.status === statusFilter;
      const matchesProperty = propertyFilter === "all" || tenant.property === propertyFilter;

      return matchesSearch && matchesStatus && matchesProperty;
    });
  };

  const handleTenantPress = (tenant: Tenant) => {
    navigation.navigate("TenantDetail", { tenantId: tenant.id });
  };

  const getPaymentStatusCounts = () => {
    return tenants.reduce(
      (acc, tenant) => {
        acc[tenant.paymentStatus]++;
        return acc;
      },
      { paid: 0, pending: 0, late: 0 }
    );
  };

  const filteredTenants = filterTenants(searchQuery, statusFilter, propertyFilter);
  const paymentCounts = getPaymentStatusCounts();

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Tenants</Text>
        <TouchableOpacity
          style={styles.addButton}
          onPress={() => navigation.navigate("AddTenant")}
        >
          <Ionicons name="add" size={24} color={COLORS.white} />
        </TouchableOpacity>
      </View>

      <View style={styles.searchContainer}>
        <Ionicons name="search" size={20} color={COLORS.gray[500]} style={styles.searchIcon} />
        <TextInput
          style={styles.searchInput}
          placeholder="Search tenants..."
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
      </View>

      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.filtersContainer}>
        <FilterChip
          label="All"
          selected={statusFilter === "all"}
          onPress={() => setStatusFilter("all")}
        />
        <FilterChip
          label="Active"
          selected={statusFilter === "active"}
          onPress={() => setStatusFilter("active")}
        />
        <FilterChip
          label="Notice"
          selected={statusFilter === "notice"}
          onPress={() => setStatusFilter("notice")}
        />
        <FilterChip
          label="Inactive"
          selected={statusFilter === "inactive"}
          onPress={() => setStatusFilter("inactive")}
        />
      </ScrollView>

      {isLoading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={COLORS.primary} />
        </View>
      ) : (
        <FlatList
          data={filteredTenants}
          renderItem={({ item }) => <TenantCard tenant={item} onPress={handleTenantPress} />}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContainer}
          showsVerticalScrollIndicator={false}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: COLORS.white,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.gray[200],
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: COLORS.darkGray,
  },
  addButton: {
    backgroundColor: COLORS.primary,
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: COLORS.white,
    margin: 16,
    paddingHorizontal: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: COLORS.gray[200],
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    height: 40,
    fontSize: 16,
    color: COLORS.darkGray,
  },
  filtersContainer: {
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  filterChip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 16,
    backgroundColor: COLORS.gray[100],
    marginRight: 8,
  },
  filterChipSelected: {
    backgroundColor: COLORS.primary,
  },
  filterChipText: {
    fontSize: 14,
    color: COLORS.gray[700],
  },
  filterChipTextSelected: {
    color: COLORS.white,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  listContainer: {
    padding: 16,
  },
  tenantCard: {
    backgroundColor: COLORS.white,
    borderRadius: 12,
    marginBottom: 16,
    padding: 16,
    shadowColor: COLORS.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  cardHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  profileImage: {
    width: 48,
    height: 48,
    borderRadius: 24,
    marginRight: 12,
  },
  headerInfo: {
    flex: 1,
  },
  tenantName: {
    fontSize: 18,
    fontWeight: "600",
    color: COLORS.darkGray,
    marginBottom: 4,
  },
  propertyInfo: {
    flexDirection: "row",
    alignItems: "center",
  },
  propertyText: {
    fontSize: 14,
    color: COLORS.gray[600],
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    borderWidth: 1,
  },
  statusText: {
    fontSize: 12,
    fontWeight: "500",
  },
  cardContent: {
    gap: 12,
  },
  contactInfo: {
    gap: 8,
  },
  infoItem: {
    flexDirection: "row",
    alignItems: "center",
  },
  infoText: {
    fontSize: 14,
    color: COLORS.gray[600],
    marginLeft: 8,
  },
  leaseDetails: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 8,
  },
  leaseItem: {
    flex: 1,
  },
  leaseLabel: {
    fontSize: 12,
    color: COLORS.gray[500],
    marginBottom: 4,
  },
  leaseValue: {
    fontSize: 14,
    color: COLORS.darkGray,
    fontWeight: "500",
  },
  expiringBadge: {
    backgroundColor: COLORS.warning + "20",
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
    marginTop: 4,
    alignSelf: "flex-start",
  },
  expiringText: {
    fontSize: 12,
    color: COLORS.warning,
  },
  paymentInfo: {
    marginTop: 8,
  },
  paymentStatus: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 4,
  },
  paymentBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    marginRight: 8,
  },
  paymentText: {
    fontSize: 12,
    fontWeight: "500",
  },
  lastPaymentText: {
    fontSize: 12,
    color: COLORS.gray[500],
  },
  balanceText: {
    fontSize: 14,
    color: COLORS.error,
    fontWeight: "500",
  },
});

export default TenantScreen; 