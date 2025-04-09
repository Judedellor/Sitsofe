import * as React from 'react';
import { View, Text, TextInput, StyleSheet, TextInputProps } from 'react-native';
import { colors } from '../../constants/colors';

interface FormInputProps extends TextInputProps {
  label: string;
  required?: boolean;
}

const FormInput: React.FC<FormInputProps> = ({
  label,
  required = false,
  ...props
}) => {
  return (
    <View style={styles.container}>
      <Text style={styles.label}>
        {label}
        {required && <Text style={styles.required}> *</Text>}
      </Text>
      <TextInput
        style={styles.input}
        placeholderTextColor={colors.gray[400]}
        {...props}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    color: colors.text,
    marginBottom: 8,
    fontWeight: '500',
  },
  required: {
    color: colors.error,
  },
  input: {
    height: 48,
    borderWidth: 1,
    borderColor: colors.gray[300],
    borderRadius: 8,
    paddingHorizontal: 16,
    fontSize: 16,
    color: colors.text,
    backgroundColor: colors.white,
  },
});

export default FormInput;
