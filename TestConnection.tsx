import React, { useState, useEffect } from 'react';
import { View, Text, Button, StyleSheet, ActivityIndicator } from 'react-native';
import { supabase } from '../services/supabase';

export const TestConnection: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [user, setUser] = useState<any>(null);
  const [properties, setProperties] = useState<any[]>([]);

  useEffect(() => {
    checkConnection();
  }, []);

  const checkConnection = async () => {
    try {
      // Check authentication
      const { data: { user: authUser }, error: authError } = await supabase.auth.getUser();
      if (authError) throw authError;
      setUser(authUser);

      // Check database access
      const { data, error: dbError } = await supabase
        .from('properties')
        .select('*')
        .limit(1);
      
      if (dbError) throw dbError;
      setProperties(data || []);

      setError(null);
    } catch (err: any) {
      setError(err?.message || 'An unknown error occurred');
    } finally {
      setLoading(false);
    }
  };

  const testSignUp = async () => {
    try {
      const { data, error } = await supabase.auth.signUp({
        email: 'test@example.com',
        password: 'password123',
      });
      
      if (error) throw error;
      setUser(data.user);
      setError(null);
    } catch (err: any) {
      setError(err?.message || 'An unknown error occurred');
    }
  };

  const testStorage = async () => {
    try {
      const { data, error } = await supabase.storage
        .from('documents')
        .list();
      
      if (error) throw error;
      console.log('Storage test successful:', data);
      setError(null);
    } catch (err: any) {
      setError(err?.message || 'An unknown error occurred');
    }
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#0000ff" />
        <Text style={styles.text}>Testing connection...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Supabase Connection Test</Text>
      
      {error ? (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>Error: {error}</Text>
        </View>
      ) : (
        <View style={styles.successContainer}>
          <Text style={styles.successText}>✓ Connection successful!</Text>
          <Text style={styles.text}>User: {user ? 'Logged in' : 'Not logged in'}</Text>
          <Text style={styles.text}>Properties found: {properties.length}</Text>
        </View>
      )}

      <View style={styles.buttonContainer}>
        <Button title="Test Sign Up" onPress={testSignUp} />
        <Button title="Test Storage" onPress={testStorage} />
        <Button title="Recheck Connection" onPress={checkConnection} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  text: {
    fontSize: 16,
    marginVertical: 10,
  },
  errorContainer: {
    backgroundColor: '#ffebee',
    padding: 15,
    borderRadius: 5,
    marginVertical: 10,
  },
  errorText: {
    color: '#c62828',
    fontSize: 16,
  },
  successContainer: {
    backgroundColor: '#e8f5e9',
    padding: 15,
    borderRadius: 5,
    marginVertical: 10,
  },
  successText: {
    color: '#2e7d32',
    fontSize: 16,
    fontWeight: 'bold',
  },
  buttonContainer: {
    marginTop: 20,
    width: '100%',
    gap: 10,
  },
}); 