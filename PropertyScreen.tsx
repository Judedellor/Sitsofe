import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, FlatList, TouchableOpacity, TextInput, Image, ActivityIndicator } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { COLORS } from "../constants/colors";

// Define types
type RootStackParamList = {
  PropertyDetails: {
    propertyId: string;
  };
  AddProperty: undefined;
};

type NavigationProp = NativeStackNavigationProp<RootStackParamList, 'PropertyDetails'>;

interface Property {
  id: string;
  name: string;
  address: string;
  type: string;
  units: number;
  occupancyRate: string;
  monthlyRevenue: string;
  image: string;
  status: "active" | "maintenance";
}

interface FilterChipProps {
  label: string;
  selected: boolean;
  onPress: () => void;
}

interface PropertyCardProps {
  property: Property;
  onPress: (property: Property) => void;
}

// Mock data for properties
const PROPERTIES_DATA: Property[] = [
  {
    id: "1",
    name: "Sunset Apartments",
    address: "123 Ocean Ave, Malibu, CA 90210",
    type: "Apartment Complex",
    units: 24,
    occupancyRate: "95%",
    monthlyRevenue: "$32,400",
    image: "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80",
    status: "active",
  },
  {
    id: "2",
    name: "Ocean View Condos",
    address: "456 Coastal Highway, Newport Beach, CA 92660",
    type: "Condominium",
    units: 12,
    occupancyRate: "92%",
    monthlyRevenue: "$24,600",
    image: "https://images.unsplash.com/photo-1460317442991-0ec209397118?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80",
    status: "active",
  },
  {
    id: "3",
    name: "Mountain Retreat",
    address: "789 Alpine Road, Big Bear, CA 92315",
    type: "Vacation Rentals",
    units: 5,
    occupancyRate: "68%",
    monthlyRevenue: "$8,500",
    image: "https://images.unsplash.com/photo-1449158743715-0a90ebb6d2d8?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80",
    status: "active",
  },
  {
    id: "4",
    name: "Downtown Lofts",
    address: "101 Main Street, Los Angeles, CA 90012",
    type: "Loft Building",
    units: 16,
    occupancyRate: "87%",
    monthlyRevenue: "$18,600",
    image: "https://images.unsplash.com/photo-1515263487990-61b07816b324?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80",
    status: "active",
  },
  {
    id: "5",
    name: "Riverside Apartments",
    address: "222 River Road, San Diego, CA 92101",
    type: "Apartment Complex",
    units: 18,
    occupancyRate: "94%",
    monthlyRevenue: "$22,800",
    image: "https://images.unsplash.com/photo-1469022563428-aa04fef9f5a2?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80",
    status: "maintenance",
  },
  {
    id: "6",
    name: "Parkside Residences",
    address: "333 Park Avenue, Irvine, CA 92602",
    type: "Townhouse Complex",
    units: 10,
    occupancyRate: "90%",
    monthlyRevenue: "$16,500",
    image: "https://images.unsplash.com/photo-1486325212027-8081e485255e?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80",
    status: "active",
  },
];

// Filter Chip component
const FilterChip: React.FC<FilterChipProps> = ({ label, selected, onPress }) => (
  <TouchableOpacity style={[styles.filterChip, selected && styles.filterChipSelected]} onPress={onPress}>
    <Text style={[styles.filterChipText, selected && styles.filterChipTextSelected]}>{label}</Text>
  </TouchableOpacity>
);

// Property Card component
const PropertyCard: React.FC<PropertyCardProps> = ({ property, onPress }) => {
  const getStatusColor = (status: Property["status"]): string => {
    switch (status) {
      case "active":
        return COLORS.success;
      case "maintenance":
        return COLORS.warning;
      default:
        return COLORS.gray[500];
    }
  };

  const statusColor = getStatusColor(property.status);

  return (
    <TouchableOpacity style={styles.propertyCard} onPress={() => onPress(property)}>
      <View style={styles.cardImageContainer}>
        <Image source={{ uri: property.image }} style={styles.cardImage} resizeMode="cover" />
        <View style={[styles.statusBadge, { backgroundColor: statusColor }]}>
          <Text style={styles.statusText}>{property.status === "active" ? "Active" : "Maintenance"}</Text>
        </View>
      </View>

      <View style={styles.cardContent}>
        <Text style={styles.propertyName}>{property.name}</Text>
        <Text style={styles.propertyAddress}>{property.address}</Text>

        <View style={styles.propertyMeta}>
          <View style={styles.metaItem}>
            <Ionicons name="home" size={16} color={COLORS.gray[600]} />
            <Text style={styles.metaText}>{property.type}</Text>
          </View>
          <View style={styles.metaItem}>
            <Ionicons name="business" size={16} color={COLORS.gray[600]} />
            <Text style={styles.metaText}>{property.units} Units</Text>
          </View>
        </View>

        <View style={styles.propertyStats}>
          <View style={styles.statItem}>
            <Text style={styles.statLabel}>Occupancy</Text>
            <Text style={styles.statValue}>{property.occupancyRate}</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statLabel}>Revenue</Text>
            <Text style={styles.statValue}>{property.monthlyRevenue}</Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const PropertyScreen: React.FC = () => {
  const navigation = useNavigation<NavigationProp>();
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [properties, setProperties] = useState<Property[]>([]);
  const [filteredProperties, setFilteredProperties] = useState<Property[]>([]);
  const [activeFilter, setActiveFilter] = useState("All");

  useEffect(() => {
    // Simulate API call to fetch properties
    const fetchProperties = (): Promise<Property[]> => {
      return new Promise((resolve) => {
        setTimeout(() => {
          resolve(PROPERTIES_DATA);
        }, 1500);
      });
    };

    fetchProperties().then((data) => {
      setProperties(data);
      setFilteredProperties(data);
      setLoading(false);
    });
  }, []);

  useEffect(() => {
    filterProperties(searchQuery, activeFilter);
  }, [searchQuery, activeFilter, properties]);

  const filterProperties = (query: string, filter: string): void => {
    let results = properties;

    // Apply search query filter
    if (query) {
      results = results.filter(
        (property) =>
          property.name.toLowerCase().includes(query.toLowerCase()) ||
          property.address.toLowerCase().includes(query.toLowerCase()) ||
          property.type.toLowerCase().includes(query.toLowerCase()),
      );
    }

    // Apply type filter
    if (filter !== "All") {
      if (filter === "Apartments") {
        results = results.filter((property) => property.type.includes("Apartment"));
      } else if (filter === "Maintenance") {
        results = results.filter((property) => property.status === "maintenance");
      }
    }

    setFilteredProperties(results);
  };

  const handlePropertyPress = (property: Property): void => {
    navigation.navigate("PropertyDetails", { propertyId: property.id });
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={COLORS.primary} />
        <Text style={styles.loadingText}>Loading properties...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Properties</Text>
        <TouchableOpacity 
          style={styles.addButton}
          onPress={() => navigation.navigate("AddProperty")}
        >
          <Ionicons name="add" size={24} color={COLORS.white} />
        </TouchableOpacity>
      </View>

      <View style={styles.searchContainer}>
        <View style={styles.searchInput}>
          <Ionicons name="search" size={20} color={COLORS.gray[600]} style={styles.searchIcon} />
          <TextInput
            placeholder="Search properties..."
            value={searchQuery}
            onChangeText={setSearchQuery}
            style={styles.input}
            clearButtonMode="while-editing"
          />
        </View>
      </View>

      <View style={styles.filtersContainer}>
        <FilterChip label="All" selected={activeFilter === "All"} onPress={() => setActiveFilter("All")} />
        <FilterChip
          label="Apartments"
          selected={activeFilter === "Apartments"}
          onPress={() => setActiveFilter("Apartments")}
        />
        <FilterChip
          label="Maintenance"
          selected={activeFilter === "Maintenance"}
          onPress={() => setActiveFilter("Maintenance")}
        />
      </View>

      <FlatList
        data={filteredProperties}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <PropertyCard property={item} onPress={handlePropertyPress} />}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
      />
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
  headerTitle: {
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
    padding: 16,
  },
  searchInput: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: COLORS.white,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: COLORS.gray[200],
    paddingHorizontal: 12,
  },
  searchIcon: {
    marginRight: 8,
  },
  input: {
    flex: 1,
    height: 40,
    fontSize: 16,
    color: COLORS.darkGray,
  },
  filtersContainer: {
    flexDirection: "row",
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
  listContent: {
    padding: 16,
  },
  propertyCard: {
    backgroundColor: COLORS.white,
    borderRadius: 12,
    marginBottom: 16,
    shadowColor: COLORS.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  cardImageContainer: {
    position: "relative",
    height: 200,
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
    overflow: "hidden",
  },
  cardImage: {
    width: "100%",
    height: "100%",
  },
  statusBadge: {
    position: "absolute",
    top: 12,
    right: 12,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  statusText: {
    color: COLORS.white,
    fontSize: 12,
    fontWeight: "600",
  },
  cardContent: {
    padding: 16,
  },
  propertyName: {
    fontSize: 18,
    fontWeight: "600",
    color: COLORS.darkGray,
    marginBottom: 4,
  },
  propertyAddress: {
    fontSize: 14,
    color: COLORS.gray[600],
    marginBottom: 12,
  },
  propertyMeta: {
    flexDirection: "row",
    marginBottom: 12,
  },
  metaItem: {
    flexDirection: "row",
    alignItems: "center",
    marginRight: 16,
  },
  metaText: {
    fontSize: 14,
    color: COLORS.gray[600],
    marginLeft: 4,
  },
  propertyStats: {
    flexDirection: "row",
    borderTopWidth: 1,
    borderTopColor: COLORS.gray[200],
    paddingTop: 12,
  },
  statItem: {
    flex: 1,
  },
  statLabel: {
    fontSize: 12,
    color: COLORS.gray[500],
    marginBottom: 4,
  },
  statValue: {
    fontSize: 16,
    fontWeight: "600",
    color: COLORS.darkGray,
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
});

export default PropertyScreen; 