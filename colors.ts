import { ColorValue } from 'react-native';

interface Colors {
  primary: ColorValue;
  primaryLight: ColorValue;
  secondary: ColorValue;
  background: ColorValue;
  text: ColorValue;
  textSecondary: ColorValue;
  border: ColorValue;
  error: ColorValue;
  success: ColorValue;
  warning: ColorValue;
  info: ColorValue;
  transparent: ColorValue;
  white: ColorValue;
  black: ColorValue;
  gray: {
    50: string;
    100: string;
    200: string;
    300: string;
    400: string;
    500: string;
    600: string;
    700: string;
    800: string;
    900: string;
  };
  darkGray: ColorValue;
  lightGray: ColorValue;
}

export const colors = {
  primary: '#007AFF',
  primaryLight: '#E6F2FF',
  secondary: '#5856D6',
  background: '#FFFFFF',
  text: '#000000',
  textSecondary: '#8E8E93',
  border: '#C7C7CC',
  error: '#FF3B30',
  success: '#34C759',
  warning: '#FF9500',
  info: '#5AC8FA',
  transparent: 'transparent',
  white: '#FFFFFF',
  black: '#000000',
  darkGray: '#636366',
  lightGray: '#E0E0E0',
  gray: {
    50: '#FAFAFA',
    100: '#F5F5F5',
    200: '#EEEEEE',
    300: '#E0E0E0',
    400: '#BDBDBD',
    500: '#9E9E9E',
    600: '#757575',
    700: '#616161',
    800: '#424242',
    900: '#212121',
  },
} as const;

// Export COLORS as an alias for colors
export const COLORS = colors;

export type GrayScale = keyof typeof colors.gray;
