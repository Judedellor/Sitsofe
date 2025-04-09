import React, { ReactNode } from 'react';
import { View, Text, StyleSheet, ViewStyle } from 'react-native';
import { COLORS } from '../../constants/colors';

interface CardProps {
  children: ReactNode;
  title?: string;
  subtitle?: string;
  headerRight?: ReactNode;
  footer?: ReactNode;
  style?: ViewStyle;
  elevated?: boolean;
}

const Card: React.FC<CardProps> = ({
  children,
  title,
  subtitle,
  headerRight,
  footer,
  style,
  elevated = false,
}) => {
  return (
    <View style={[
      styles.card, 
      elevated && styles.elevated,
      style
    ]}>
      {(title || headerRight) && (
        <View style={styles.header}>
          <View style={styles.headerLeft}>
            {title && <Text style={styles.title}>{title}</Text>}
            {subtitle && <Text style={styles.subtitle}>{subtitle}</Text>}
          </View>
          {headerRight && <View>{headerRight}</View>}
        </View>
      )}
      
      <View style={styles.content}>
        {children}
      </View>
      
      {footer && (
        <View style={styles.footer}>
          {footer}
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: COLORS.white,
    borderRadius: 12,
    marginBottom: 16,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  elevated: {
    shadowColor: COLORS.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  headerLeft: {
    flex: 1,
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    color: COLORS.text,
  },
  subtitle: {
    fontSize: 14,
    color: COLORS.gray,
    marginTop: 4,
  },
  content: {
    padding: 16,
  },
  footer: {
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
  },
});

export default Card;
