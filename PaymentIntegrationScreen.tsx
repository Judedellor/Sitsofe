import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { CardField, useStripe } from '@stripe/stripe-react-native';
import { supabase } from './supabase';

const PaymentIntegrationScreen = ({ navigation }) => {
  const insets = useSafeAreaInsets();
  const { confirmPayment } = useStripe();
  const [paymentMethod, setPaymentMethod] = useState(null);
  const [paymentHistory, setPaymentHistory] = useState([]);

  useEffect(() => {
    fetchPaymentHistory();
  }, []);

  const fetchPaymentHistory = async () => {
    try {
      const { data, error } = await supabase
        .from('payments')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setPaymentHistory(data);
    } catch (error) {
      Alert.alert('Error', 'Failed to fetch payment history');
    }
  };

  const handlePayment = async () => {
    if (!paymentMethod) {
      Alert.alert('Error', 'Please enter your payment details');
      return;
    }

    try {
      const { error, paymentIntent } = await confirmPayment(paymentMethod.id, {
        payment_method: paymentMethod.id,
      });

      if (error) throw error;

      await supabase
        .from('payments')
        .insert([
          {
            amount: paymentIntent.amount,
            status: paymentIntent.status,
            payment_method: paymentMethod.card.brand,
            receipt_url: paymentIntent.charges.data[0].receipt_url,
          },
        ]);

      Alert.alert('Success', 'Payment successful');
      fetchPaymentHistory();
    } catch (error) {
      Alert.alert('Error', 'Payment failed');
    }
  };

  return (
    <View
      style={[
        styles.container,
        {
          paddingTop: insets.top,
          paddingBottom: insets.bottom,
          paddingLeft: insets.left,
          paddingRight: insets.right,
        },
      ]}
    >
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.title}>Payment Integration</Text>

        <CardField
          postalCodeEnabled={true}
          placeholders={{
            number: '4242 4242 4242 4242',
          }}
          cardStyle={styles.card}
          style={styles.cardContainer}
          onCardChange={(cardDetails) => {
            setPaymentMethod(cardDetails);
          }}
        />

        <TouchableOpacity style={styles.payButton} onPress={handlePayment}>
          <Text style={styles.payButtonText}>Pay Now</Text>
        </TouchableOpacity>

        <Text style={styles.historyTitle}>Payment History</Text>
        {paymentHistory.map((payment) => (
          <View key={payment.id} style={styles.historyItem}>
            <Text style={styles.historyText}>Amount: ${payment.amount / 100}</Text>
            <Text style={styles.historyText}>Status: {payment.status}</Text>
            <Text style={styles.historyText}>Method: {payment.payment_method}</Text>
            <TouchableOpacity
              onPress={() => navigation.navigate('Receipt', { receiptUrl: payment.receipt_url })}
            >
              <Text style={styles.receiptLink}>View Receipt</Text>
            </TouchableOpacity>
          </View>
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  content: {
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  card: {
    backgroundColor: '#FFFFFF',
    textColor: '#000000',
    borderColor: '#000000',
    borderWidth: 1,
    borderRadius: 8,
  },
  cardContainer: {
    height: 50,
    marginVertical: 30,
  },
  payButton: {
    backgroundColor: '#2196F3',
    borderRadius: 8,
    paddingVertical: 12,
    alignItems: 'center',
    marginBottom: 16,
  },
  payButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
  historyTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  historyItem: {
    backgroundColor: 'white',
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  historyText: {
    fontSize: 14,
    color: '#333',
    marginBottom: 4,
  },
  receiptLink: {
    fontSize: 14,
    color: '#2196F3',
    textDecorationLine: 'underline',
  },
});

export default PaymentIntegrationScreen;
