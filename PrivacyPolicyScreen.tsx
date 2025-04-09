import * as React from 'react';
import { View, Text, StyleSheet, ScrollView, SafeAreaView } from 'react-native';
import { colors } from '../constants/colors';

const PrivacyPolicyScreen = () => {
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.content}>
        <View style={styles.header}>
          <Text style={styles.title}>Privacy Policy</Text>
          <Text style={styles.lastUpdated}>Last updated: {new Date().toLocaleDateString()}</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>1. Introduction</Text>
          <Text style={styles.text}>
            This Privacy Policy describes how we collect, use, and handle your personal information when you use our mobile application.
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>2. Information We Collect</Text>
          <Text style={styles.text}>
            We collect information that you provide directly to us, including:
          </Text>
          <Text style={styles.listItem}>• Account information (name, email, phone number)</Text>
          <Text style={styles.listItem}>• Profile information</Text>
          <Text style={styles.listItem}>• Usage data and preferences</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>3. How We Use Your Information</Text>
          <Text style={styles.text}>
            We use the information we collect to:
          </Text>
          <Text style={styles.listItem}>• Provide and maintain our services</Text>
          <Text style={styles.listItem}>• Improve and personalize your experience</Text>
          <Text style={styles.listItem}>• Communicate with you about updates and changes</Text>
          <Text style={styles.listItem}>• Ensure the security of our services</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>4. Data Security</Text>
          <Text style={styles.text}>
            We implement appropriate security measures to protect your personal information. However, no method of transmission over the internet or electronic storage is 100% secure.
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>5. Your Rights</Text>
          <Text style={styles.text}>
            You have the right to:
          </Text>
          <Text style={styles.listItem}>• Access your personal information</Text>
          <Text style={styles.listItem}>• Correct inaccurate information</Text>
          <Text style={styles.listItem}>• Request deletion of your information</Text>
          <Text style={styles.listItem}>• Object to processing of your information</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>6. Contact Us</Text>
          <Text style={styles.text}>
            If you have any questions about this Privacy Policy, please contact us at:
          </Text>
          <Text style={styles.contact}>support@example.com</Text>
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
  lastUpdated: {
    fontSize: 14,
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
  contact: {
    fontSize: 16,
    color: colors.primary,
    marginTop: 8,
  },
});

export default PrivacyPolicyScreen; 