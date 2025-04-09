import React from 'react';
import { View, StatusBar, StyleSheet, ViewStyle } from 'react-native';
import { colors } from '../constants/colors';

interface SafeAreaWrapperProps {
  children: React.ReactNode;
  style?: ViewStyle;
}

const SafeAreaWrapper: React.FC<SafeAreaWrapperProps> = ({ children, style }) => {
  return (
    <View style={[styles.container, style]}>
      <StatusBar
        barStyle="dark-content"
        backgroundColor={colors.white}
      />
      <View style={styles.content}>
        {children}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
    paddingTop: StatusBar.currentHeight || 0,
  },
  content: {
    flex: 1,
  },
});

export default SafeAreaWrapper; 