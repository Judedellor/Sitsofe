import * as React from 'react';
import { View, Text, StyleSheet, ScrollView, SafeAreaView, TouchableOpacity, Linking } from 'react-native';
import { colors } from '../constants/colors';

const HelpSupportScreen = () => {
  const handleEmailPress = () => {
    Linking.openURL('mailto:support@example.com');
  };

  const handlePhonePress = () => {
    Linking.openURL('tel:+1234567890');
  };

  const handleWebsitePress = () => {
    Linking.openURL('https://example.com/support');
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.content}>
        <View style={styles.header}>
          <Text style={styles.title}>Help & Support</Text>
          <Text style={styles.subtitle}>
            We're here to help you with any questions or issues you may have.
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Frequently Asked Questions</Text>
          
          <View style={styles.faqItem}>
            <Text style={styles.faqQuestion}>How do I reset my password?</Text>
            <Text style={styles.faqAnswer}>
              You can reset your password by going to Settings > Change Password. If you've forgotten your password, use the "Forgot Password" option on the login screen.
            </Text>
          </View>

          <View style={styles.faqItem}>
            <Text style={styles.faqQuestion}>How do I update my profile information?</Text>
            <Text style={styles.faqAnswer}>
              Navigate to your Profile screen and tap the edit button. You can update your information and save the changes.
            </Text>
          </View>

          <View style={styles.faqItem}>
            <Text style={styles.faqQuestion}>Is my data secure?</Text>
            <Text style={styles.faqAnswer}>
              Yes, we take data security seriously. All your information is encrypted and protected using industry-standard security measures.
            </Text>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Contact Us</Text>
          
          <TouchableOpacity
            style={styles.contactItem}
            onPress={handleEmailPress}
          >
            <Text style={styles.contactLabel}>Email Support</Text>
            <Text style={styles.contactValue}>support@example.com</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.contactItem}
            onPress={handlePhonePress}
          >
            <Text style={styles.contactLabel}>Phone Support</Text>
            <Text style={styles.contactValue}>+1 (234) 567-890</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.contactItem}
            onPress={handleWebsitePress}
          >
            <Text style={styles.contactLabel}>Visit Support Website</Text>
            <Text style={styles.contactValue}>example.com/support</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Business Hours</Text>
          <Text style={styles.text}>
            Our support team is available:
          </Text>
          <Text style={styles.listItem}>• Monday - Friday: 9:00 AM - 6:00 PM EST</Text>
          <Text style={styles.listItem}>• Saturday: 10:00 AM - 4:00 PM EST</Text>
          <Text style={styles.listItem}>• Sunday: Closed</Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
  },
  content: {
    flex: 1,
  },
  header: {
    padding: 24,
    borderBottomWidth: 1,
    borderBottomColor: colors.gray[200],
  },
  title: {
    fontSize: 24,
    fontWeight: '600',
    color: colors.gray[900],
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: colors.gray[600],
  },
  section: {
    padding: 24,
    borderBottomWidth: 1,
    borderBottomColor: colors.gray[200],
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.gray[900],
    marginBottom: 16,
  },
  faqItem: {
    marginBottom: 24,
  },
  faqQuestion: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.gray[900],
    marginBottom: 8,
  },
  faqAnswer: {
    fontSize: 16,
    color: colors.gray[800],
    lineHeight: 24,
  },
  contactItem: {
    marginBottom: 16,
  },
  contactLabel: {
    fontSize: 16,
    color: colors.gray[600],
    marginBottom: 4,
  },
  contactValue: {
    fontSize: 16,
    color: colors.primary,
  },
  text: {
    fontSize: 16,
    color: colors.gray[800],
    marginBottom: 16,
    lineHeight: 24,
  },
  listItem: {
    fontSize: 16,
    color: colors.gray[800],
    marginLeft: 16,
    marginBottom: 8,
    lineHeight: 24,
  },
});

export default HelpSupportScreen; 