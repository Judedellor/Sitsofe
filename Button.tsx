import * as React from 'react';
import { 
  TouchableOpacity, 
  Text, 
  StyleSheet, 
  ActivityIndicator,
  ViewStyle,
  TextStyle,
  View
} from 'react-native';
import { colors } from '../../constants/colors';

interface ButtonProps {
  title: string;
  onPress: () => void;
  type?: 'primary' | 'secondary' | 'outline' | 'link' | 'danger';
  size?: 'small' | 'medium' | 'large';
  disabled?: boolean;
  loading?: boolean;
  icon?: React.ReactNode;
  style?: ViewStyle;
  textStyle?: TextStyle;
  fullWidth?: boolean;
}

const Button: React.FC<ButtonProps> = ({
  title,
  onPress,
  type = 'primary',
  size = 'medium',
  disabled = false,
  loading = false,
  icon,
  style,
  textStyle,
  fullWidth = false,
}) => {
  // Determine button styles based on type
  const getButtonStyle = () => {
    switch (type) {
      case 'primary':
        return {
          backgroundColor: disabled ? colors.gray[300] : colors.primary,
          borderWidth: 0,
        };
      case 'secondary':
        return {
          backgroundColor: disabled ? colors.gray[300] : colors.secondary,
          borderWidth: 0,
        };
      case 'outline':
        return {
          backgroundColor: 'transparent',
          borderWidth: 1,
          borderColor: disabled ? colors.gray[300] : colors.primary,
        };
      case 'link':
        return styles.linkButton;
      case 'danger':
        return styles.dangerButton;
      default:
        return {
          backgroundColor: disabled ? colors.gray[300] : colors.primary,
          borderWidth: 0,
        };
    }
  };

  // Determine text styles based on type
  const getTextStyle = () => {
    switch (type) {
      case 'outline':
        return {
          color: disabled ? colors.gray[300] : colors.primary,
        };
      case 'primary':
        return styles.primaryText;
      case 'secondary':
        return styles.secondaryText;
      case 'link':
        return styles.linkText;
      case 'danger':
        return styles.dangerText;
      default:
        return {
          color: colors.white,
        };
    }
  };

  // Determine size styles
  const getSizeStyle = () => {
    switch (size) {
      case 'small':
        return styles.smallButton;
      case 'medium':
        return styles.mediumButton;
      case 'large':
        return styles.largeButton;
      default:
        return styles.mediumButton;
    }
  };

  // Determine text size styles
  const getTextSizeStyle = () => {
    switch (size) {
      case 'small':
        return styles.smallText;
      case 'medium':
        return styles.mediumText;
      case 'large':
        return styles.largeText;
      default:
        return styles.mediumText;
    }
  };

  return (
    <TouchableOpacity
      style={[
        styles.button,
        getButtonStyle(),
        getSizeStyle(),
        disabled && styles.disabledButton,
        fullWidth && styles.fullWidth,
        style,
      ]}
      onPress={onPress}
      disabled={disabled || loading}
      activeOpacity={0.7}
    >
      {loading ? (
        <ActivityIndicator 
          color={type === 'outline' || type === 'link' ? colors.primary : colors.white} 
          size={size === 'small' ? 'small' : 'small'} 
        />
      ) : (
        <View style={styles.buttonContent}>
          {icon && <View style={styles.iconContainer}>{icon}</View>}
          <Text
            style={[
              getTextStyle(),
              getTextSizeStyle(),
              disabled && styles.disabledText,
              textStyle,
            ]}
          >
            {title}
          </Text>
        </View>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconContainer: {
    marginRight: 8,
  },
  // Type styles
  primaryButton: {
    backgroundColor: colors.primary,
  },
  secondaryButton: {
    backgroundColor: colors.secondary,
  },
  outlineButton: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: colors.primary,
  },
  linkButton: {
    backgroundColor: 'transparent',
  },
  dangerButton: {
    backgroundColor: colors.error,
  },
  // Text styles
  primaryText: {
    color: colors.white,
    fontWeight: '600',
  },
  secondaryText: {
    color: colors.white,
    fontWeight: '600',
  },
  outlineText: {
    color: colors.primary,
    fontWeight: '600',
  },
  linkText: {
    color: colors.primary,
    fontWeight: '600',
  },
  dangerText: {
    color: colors.white,
    fontWeight: '600',
  },
  // Size styles
  smallButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
  },
  mediumButton: {
    paddingVertical: 12,
    paddingHorizontal: 24,
  },
  largeButton: {
    paddingVertical: 16,
    paddingHorizontal: 32,
  },
  // Text size styles
  smallText: {
    fontSize: 12,
  },
  mediumText: {
    fontSize: 14,
  },
  largeText: {
    fontSize: 16,
  },
  // Disabled styles
  disabledButton: {
    backgroundColor: colors.gray[300],
    borderColor: colors.gray[300],
  },
  disabledText: {
    color: colors.gray[600],
  },
  // Full width
  fullWidth: {
    width: '100%',
  },
});

export default Button;
