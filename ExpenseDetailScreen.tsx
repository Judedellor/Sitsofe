"use client"

import { useState } from "react"
import { Alert, Share } from "react-native"
import { useNavigation, useRoute } from "@react-navigation/native"

// Mock data for properties
const MOCK_PROPERTIES = [
  { id: "prop1", name: "123 Main St" },
  { id: "prop2", name: "456 Oak Ave" },
  { id: "prop3", name: "789 Pine Blvd" },
]

const ExpenseDetailScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { expense } = route.params;
  const [isLoading, setIsLoading] = useState(false);
  const [isImageFullscreen, setIsImageFullscreen] = useState(false);

  const getPropertyName = (propertyId) => {
    const property = MOCK_PROPERTIES.find(p => p.id === propertyId);
    return property ? property.name : 'Unknown Property';
  };

  const handleEdit = () => {
    navigation.navigate('EditExpense', { expense });
  };

  const handleDelete = () => {
    Alert.alert(
      'Confirm Delete',
      'Are you sure you want to delete this expense? This action cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Delete', 
          style: 'destructive',
          onPress: () => {
            setIsLoading(true);
            // Simulate API call
            setTimeout(() => {
              setIsLoading(false);
              navigation.goBack();
            }, 1000);
          }
        },
      ]
    );
  };

  const handleShare = async () => {
    try {
      const result = await Share.share({
        message: `Expense:
I'll implement these features step by step, starting with the most fundamental ones. Let's begin with authentication improvements and work our way through the list.

## Phase 1: Authentication and User Management

Let's start by implementing password reset functionality and enhancing the user profile management.

First, let's create a ForgotPasswordScreen:

