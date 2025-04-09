import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from "react-native"
import { Ionicons } from "@expo/vector-icons"

const HelpCenterScreen = ({ navigation }) => {
  const categories = [
    {
      title: "Getting Started",
      items: [
        { title: "Account Setup", icon: "person-add" },
        { title: "Property Management", icon: "home" },
        { title: "Tenant Management", icon: "people" },
      ],
    },
    {
      title: "Features",
      items: [
        { title: "Messaging System", icon: "chatbubbles" },
        { title: "Payment Processing", icon: "card" },
        { title: "Maintenance Requests", icon: "construct" },
      ],
    },
    {
      title: "Troubleshooting",
      items: [
        { title: "Common Issues", icon: "warning" },
        { title: "FAQ", icon: "help-circle" },
        { title: "Technical Support", icon: "hardware-chip" },
      ],
    },
  ]

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color="#333" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Help Center</Text>
      </View>

      <ScrollView style={styles.content}>
        {categories.map((category, index) => (
          <View key={index} style={styles.category}>
            <Text style={styles.categoryTitle}>{category.title}</Text>
            {category.items.map((item, itemIndex) => (
              <TouchableOpacity key={itemIndex} style={styles.item}>
                <View style={styles.itemIcon}>
                  <Ionicons name={item.icon} size={24} color="#2196F3" />
                </View>
                <Text style={styles.itemTitle}>{item.title}</Text>
                <Ionicons name="chevron-forward" size={20} color="#999" />
              </TouchableOpacity>
            ))}
          </View>
        ))}
      </ScrollView>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    backgroundColor: "white",
    borderBottomWidth: 1,
    borderBottomColor: "#e0e0e0",
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "600",
    marginLeft: 16,
    color: "#333",
  },
  content: {
    flex: 1,
    padding: 16,
  },
  category: {
    marginBottom: 24,
  },
  categoryTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#333",
    marginBottom: 12,
  },
  item: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "white",
    borderRadius: 12,
    padding: 16,
    marginBottom: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  itemIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#E3F2FD",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 16,
  },
  itemTitle: {
    flex: 1,
    fontSize: 16,
    color: "#333",
  },
})

export default HelpCenterScreen

