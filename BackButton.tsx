import React from 'react';
import { TouchableOpacity, StyleSheet, View, Text } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { AccessibleTouchable } from './AccessibleTouchable';

interface BackButtonProps {
  onPress?: () => void;
  title?: string;
  color?: string;
  testID?: string;
}

/**
 * A consistent back button component for navigation
 * 
 * @param onPress - Optional custom back action. If not provided, defaults to navigation.goBack()
 * @param title - Optional title to display next to the back arrow
 * @param color - Optional color for the icon and text
 * @param testID - Optional test ID for testing
 */
export const BackButton: React.FC<BackButtonProps> = ({
  onPress,
  title,
  color = '#007AFF',
  testID = 'back-button',
}) => {
  const navigation = useNavigation();

  const handlePress = () => {
    if (onPress) {
      onPress();
    } else {
      navigation.goBack();
    }
  };

  return (
    <AccessibleTouchable
      onPress={handlePress}
      accessibilityLabel="Go back"
      accessibilityHint="Navigates to the previous screen"
      accessibilityRole="button"
      testID={testID}
      style={styles.container}
    >
      <View style={styles.buttonContent}>
        <Ionicons name="chevron-back" size={24} color={color} />
        {title && <Text style={[styles.title, { color }]}>{title}</Text>}
      </View>
    </AccessibleTouchable>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingVertical: 10,
    paddingHorizontal: 16,
  },
  buttonContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  title: {
    fontSize: 16,
    fontWeight: '500',
    marginLeft: 4,
  },
});
