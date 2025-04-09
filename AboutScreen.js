import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Linking } from "react-native"
import { Ionicons } from "@expo/vector-icons"

const AboutScreen = ({ navigation }) => {
  const handleOpenLink = (url) => {
    Linking.openURL(url)
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color="#333" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>About</Text>
      </View>

      <ScrollView style={styles.content}>
        <View style={styles.section}>
          <View style={styles.appInfo}>
            <View style={styles.appIcon}>
              <Text style={styles.appIconText}>PMS</Text>
            </View>
            <Text style={styles.appName}>Property Management System</Text>
            <Text style={styles.appVersion}>Version 1.0.0</Text>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Company Information</Text>
          <View style={styles.infoItem}>
            <Ionicons name="business" size={24} color="#2196F3" />
            <Text style={styles.infoText}>Property Management Solutions Inc.</Text>
          </View>
          <View style={styles.infoItem}>
            <Ionicons name="mail" size={24} color="#2196F3" />
            <Text style={styles.infoText}>contact@pms.com</Text>
          </View>
          <View style={styles.infoItem}>
            <Ionicons name="call" size={24} color="#2196F3" />
            <Text style={styles.infoText}>+1 (555) 123-4567</Text>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Connect With Us</Text>
          <TouchableOpacity style={styles.socialButton} onPress={() => handleOpenLink("https://twitter.com/pms")}>
            <Ionicons name="logo-twitter" size={24} color="#1DA1F2" />
            <Text style={styles.socialButtonText}>Follow us on Twitter</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.socialButton} onPress={() => handleOpenLink("https://facebook.com/pms")}>
            <Ionicons name="logo-facebook" size={24} color="#4267B2" />
            <Text style={styles.socialButtonText}>Like us on Facebook</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.socialButton}
            onPress={() => handleOpenLink("https://linkedin.com/company/pms")}
          >
            <Ionicons name="logo-linkedin" size={24} color="#0077B5" />
            <Text style={styles.socialButtonText}>Connect on LinkedIn</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Legal</Text>
          <TouchableOpacity style={styles.legalButton}>
            <Text style={styles.legalButtonText}>Terms of Service</Text>
            <Ionicons name="chevron-forward" size={20} color="#999" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.legalButton}>
            <Text style={styles.legalButtonText}>Privacy Policy</Text>
            <Ionicons name="chevron-forward" size={20} color="#999" />
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    padding: 10,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginLeft: 10,
  },
  content: {
    padding: 10,
  },
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
  },
  appInfo: {
    flexDirection: "row",
    alignItems: "center",
  },
  appIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#2196F3",
    justifyContent: "center",
    alignItems: "center",
  },
  appIconText: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#fff",
  },
  appName: {
    fontSize: 16,
    fontWeight: "bold",
    marginLeft: 10,
  },
  appVersion: {
    fontSize: 14,
    color: "#999",
  },
  infoItem: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 5,
  },
  infoText: {
    fontSize: 16,
    marginLeft: 10,
  },
  socialButton: {
    flexDirection: "row",
    alignItems: "center",
    padding: 10,
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 5,
    marginBottom: 5,
  },
  socialButtonText: {
    fontSize: 16,
    marginLeft: 10,
  },
  legalButton: {
    flexDirection: "row",
    alignItems: "center",
    padding: 10,
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 5,
    marginBottom: 5,
  },
  legalButtonText: {
    fontSize: 16,
    marginLeft: 10,
  },
})

export default AboutScreen

