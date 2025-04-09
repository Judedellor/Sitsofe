import { View, Text, StyleSheet, FlatList } from "react-native"

const properties = [
  { id: "1", name: "Sunset Apartments", address: "123 Sunset Blvd, Los Angeles", units: 12 },
  { id: "2", name: "Ocean View Condos", address: "456 Beach Road, Miami", units: 8 },
  { id: "3", name: "Mountain Retreat", address: "789 Alpine Way, Denver", units: 5 },
  { id: "4", name: "City Center Lofts", address: "101 Downtown Ave, New York", units: 20 },
]

const SimplePropertiesScreen = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Properties</Text>

      <FlatList
        data={properties}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.propertyCard}>
            <Text style={styles.propertyName}>{item.name}</Text>
            <Text style={styles.propertyAddress}>{item.address}</Text>
            <Text style={styles.propertyUnits}>Units: {item.units}</Text>
          </View>
        )}
        contentContainerStyle={styles.listContent}
      />

      <Text style={styles.message}>This is a simplified Properties Screen with mock data.</Text>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#2196F3",
    marginBottom: 20,
    textAlign: "center",
  },
  listContent: {
    paddingBottom: 20,
  },
  propertyCard: {
    backgroundColor: "white",
    borderRadius: 10,
    padding: 15,
    marginBottom: 15,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  propertyName: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 5,
    color: "#333",
  },
  propertyAddress: {
    fontSize: 16,
    color: "#666",
    marginBottom: 5,
  },
  propertyUnits: {
    fontSize: 14,
    color: "#888",
  },
  message: {
    fontSize: 16,
    textAlign: "center",
    color: "#333",
    backgroundColor: "#e3f2fd",
    padding: 15,
    borderRadius: 10,
    marginTop: 20,
  },
})

export default SimplePropertiesScreen

