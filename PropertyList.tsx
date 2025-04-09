import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, Image } from 'react-native';
import { supabase } from '../services/supabase';
import { storageService } from '../services/storageService';
import * as ImagePicker from 'expo-image-picker';

interface Property {
  id: string;
  name: string;
  description: string;
  address: string;
  rent_amount: number;
  image_url?: string;
}

export const PropertyList: React.FC = () => {
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Initial fetch
    fetchProperties();

    // Subscribe to real-time updates
    const subscription = supabase
      .channel('properties')
      .on('postgres_changes', 
        { 
          event: '*', 
          schema: 'public', 
          table: 'properties' 
        }, 
        (payload) => {
          if (payload.eventType === 'INSERT') {
            setProperties(prev => [...prev, payload.new as Property]);
          } else if (payload.eventType === 'UPDATE') {
            setProperties(prev => prev.map(p => 
              p.id === payload.new.id ? payload.new as Property : p
            ));
          } else if (payload.eventType === 'DELETE') {
            setProperties(prev => prev.filter(p => p.id !== payload.old.id));
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(subscription);
    };
  }, []);

  const fetchProperties = async () => {
    try {
      const { data, error } = await supabase
        .from('properties')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setProperties(data || []);
    } catch (error) {
      console.error('Error fetching properties:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddProperty = async () => {
    try {
      // Pick an image
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        quality: 1,
      });

      if (!result.canceled) {
        // Upload image
        const imageUrl = await storageService.uploadFile(
          result.assets[0].uri,
          'property-images',
          `property-${Date.now()}`
        );

        // Create property
        const { data, error } = await supabase
          .from('properties')
          .insert([
            {
              name: 'New Property',
              description: 'Description here',
              address: 'Address here',
              rent_amount: 1000,
              image_url: imageUrl,
            },
          ])
          .select()
          .single();

        if (error) throw error;
      }
    } catch (error) {
      console.error('Error adding property:', error);
    }
  };

  const renderProperty = ({ item }: { item: Property }) => (
    <View style={styles.propertyCard}>
      {item.image_url && (
        <Image 
          source={{ uri: item.image_url }} 
          style={styles.propertyImage}
        />
      )}
      <View style={styles.propertyInfo}>
        <Text style={styles.propertyName}>{item.name}</Text>
        <Text style={styles.propertyAddress}>{item.address}</Text>
        <Text style={styles.propertyRent}>${item.rent_amount}/month</Text>
      </View>
    </View>
  );

  if (loading) {
    return (
      <View style={styles.container}>
        <Text>Loading...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={properties}
        renderItem={renderProperty}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.list}
      />
      <TouchableOpacity 
        style={styles.addButton}
        onPress={handleAddProperty}
      >
        <Text style={styles.addButtonText}>Add Property</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  list: {
    padding: 16,
  },
  propertyCard: {
    backgroundColor: 'white',
    borderRadius: 8,
    marginBottom: 16,
    overflow: 'hidden',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  propertyImage: {
    width: '100%',
    height: 200,
    resizeMode: 'cover',
  },
  propertyInfo: {
    padding: 16,
  },
  propertyName: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  propertyAddress: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
  },
  propertyRent: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2ecc71',
  },
  addButton: {
    position: 'absolute',
    bottom: 16,
    right: 16,
    backgroundColor: '#f4511e',
    padding: 16,
    borderRadius: 30,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  addButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
}); 