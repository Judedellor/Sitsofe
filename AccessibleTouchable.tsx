import React from 'react';
import { TouchableOpacity, TouchableNativeFeedback, Platform, View } from 'react-native';

interface AccessibleTouchableProps {
  children: React.ReactNode;
  onPress?: () => void;
  style?: any;
  disabled?: boolean;
  accessibilityLabel?: string;
  accessibilityHint?: string;
  accessibilityRole?: string;
  accessibilityState?: any;
  testID?: string;
}

/**
 * A cross-platform touchable component that handles accessibility properties consistently.
 * Uses TouchableNativeFeedback on Android for ripple effect, and TouchableOpacity on iOS.
 * 
 * @param children - The content to be rendered inside the touchable component
 * @param onPress - The function to be called when the component is pressed
 * @param style - Optional styles to apply to the component
 * @param disabled - Whether the component is disabled
 * @param accessibilityLabel - A short description of the component for screen readers
 * @param accessibilityHint - A more detailed description of the component for screen readers
 * @param accessibilityRole - The semantic role of the component for screen readers (e.g., 'button', 'link')
 * @param accessibilityState - The state of the component for screen readers (e.g., { selected: true })
 * @param testID - Optional test ID for testing
 */
export const AccessibleTouchable: React.FC<AccessibleTouchableProps> = ({
  children,
  onPress,
  style,
  disabled,
  accessibilityLabel,
  accessibilityHint,
  accessibilityRole,
  accessibilityState,
  testID,
}) => {
  if (Platform.OS === 'android') {
    return (
      <TouchableNativeFeedback
        onPress={onPress}
        disabled={disabled}
        accessibilityLabel={accessibilityLabel}
        accessibilityHint={accessibilityHint}
        accessibilityRole={accessibilityRole}
        accessibilityState={accessibilityState}
        testID={testID}
        background={TouchableNativeFeedback.SelectableBackground()}
      >
        <View style={style}>{children}</View>
      </TouchableNativeFeedback>
    );
  } else {
    return (
      <TouchableOpacity
        onPress={onPress}
        style={style}
        disabled={disabled}
        accessibilityLabel={accessibilityLabel}
        accessibilityHint={accessibilityHint}
        accessibilityRole={accessibilityRole}
        accessibilityState={accessibilityState}
        testID={testID}
      >
        {children}
      </TouchableOpacity>
    );
  }
};
