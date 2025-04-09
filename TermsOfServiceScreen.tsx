import * as React from 'react';
import { View, Text, StyleSheet, ScrollView, SafeAreaView } from 'react-native';
import { colors } from '../constants/colors';

const TermsOfServiceScreen = () => {
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.content}>
        <View style={styles.header}>
          <Text style={styles.title}>Terms of Service</Text>
          <Text style={styles.lastUpdated}>Last updated: {new Date().toLocaleDateString()}</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>1. Acceptance of Terms</Text>
          <Text style={styles.text}>
            By accessing or using our mobile application, you agree to be bound by these Terms of Service and all applicable laws and regulations.
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>2. User Accounts</Text>
          <Text style={styles.text}>
            To use certain features of the app, you must create an account. You are responsible for maintaining the confidentiality of your account information and for all activities that occur under your account.
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>3. User Conduct</Text>
          <Text style={styles.text}>
            You agree not to:
          </Text>
          <Text style={styles.listItem}>• Violate any laws or regulations</Text>
          <Text style={styles.listItem}>• Infringe upon the rights of others</Text>
          <Text style={styles.listItem}>• Interfere with or disrupt the app's services</Text>
          <Text style={styles.listItem}>• Attempt to gain unauthorized access to the app</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>4. Intellectual Property</Text>
          <Text style={styles.text}>
            The app and its original content, features, and functionality are owned by us and are protected by international copyright, trademark, and other intellectual property laws.
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>5. Limitation of Liability</Text>
          <Text style={styles.text}>
            In no event shall we be liable for any indirect, incidental, special, consequential, or punitive damages arising out of or relating to your use of the app.
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>6. Changes to Terms</Text>
          <Text style={styles.text}>
            We reserve the right to modify these terms at any time. We will notify users of any changes by updating the "Last updated" date at the top of these terms.
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>7. Contact Information</Text>
          <Text style={styles.text}>
            If you have any questions about these Terms of Service, please contact us at:
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

export default TermsOfServiceScreen; 