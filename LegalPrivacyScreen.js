import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from "react-native"
import { Ionicons } from "@expo/vector-icons"

const LegalPrivacyScreen = ({ navigation }) => {
  const sections = [
    {
      title: "Privacy Policy",
      description: "Learn how we collect, use, and protect your data",
      icon: "shield-checkmark",
      color: "#2196F3",
    },
    {
      title: "Terms of Service",
      description: "Read our terms and conditions of use",
      icon: "document-text",
      color: "#4CAF50",
    },
    {
      title: "Data Protection",
      description: "Information about your data rights and GDPR compliance",
      icon: "lock-closed",
      color: "#FF9800",
    },
    {
      title: "Cookie Policy",
      description: "How we use cookies and similar technologies",
      icon: "cafe",
      color: "#9C27B0",
    },
  ]

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color="#333" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Legal & Privacy</Text>
      </View>

      <ScrollView style={styles.content}>
        {sections.map((section, index) => (
          <TouchableOpacity key={index} style={styles.section}>
            <View style={[styles.iconContainer, { backgroundColor: section.color }]}>
              <Ionicons name={section.icon} size={24} color="white" />
            </View>
            <View style={styles.sectionContent}>
              <Text style={styles.sectionTitle}>{section.title}</Text>
              <Text style={styles.sectionDescription}>{section.description}</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color="#999" />
          </TouchableOpacity>
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
  section: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "white",
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 16,
  },
  sectionContent: {
    flex: 1,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
    marginBottom: 4,
  },
  sectionDescription: {
    fontSize: 14,
    color: "#666",
  },
})

export default LegalPrivacyScreen

