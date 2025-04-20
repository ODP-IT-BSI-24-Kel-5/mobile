import React from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';

// Berhubung kita belum mengimpor tema, kita akan mendefinisikan warna dan ukuran di sini
const COLORS = {
  primary: '#4CAF50',
  background: '#FFFFFF',
  text: {
    primary: '#333333',
    secondary: '#666666',
  },
  border: '#DDDDDD',
};

const SIZES = {
  base: 8,
  small: 12,
  font: 14,
  medium: 16,
  large: 18,
  radius: 8,
};

const FONTS = {
  medium: {
    fontWeight: '500',
  },
};

const FormInput = ({
  label,
  placeholder,
  value,
  onChangeText,
  secureTextEntry,
  keyboardType,
  autoCapitalize,
  icon,
  isPassword = false,
  showPassword,
  setShowPassword,
}) => {
  return (
    <View style={styles.inputContainer}>
      {label && <Text style={styles.inputLabel}>{label}</Text>}
      <View style={styles.inputWrapper}>
        <TextInput
          style={styles.input}
          placeholder={placeholder}
          value={value}
          onChangeText={onChangeText}
          secureTextEntry={isPassword && !showPassword}
          keyboardType={keyboardType || 'default'}
          autoCapitalize={autoCapitalize || 'sentences'}
        />
        {isPassword ? (
          <TouchableOpacity
            style={styles.inputIcon}
            onPress={() => setShowPassword(!showPassword)}
          >
            <Text>{showPassword ? '👁️' : '👁️'}</Text>
          </TouchableOpacity>
        ) : icon ? (
          <View style={styles.inputIcon}>
            <Text>{icon}</Text>
          </View>
        ) : null}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  inputContainer: {
    marginBottom: 20,
  },
  inputLabel: {
    ...FONTS.medium,
    fontSize: SIZES.medium,
    marginBottom: 8,
    color: COLORS.text.primary,
  },
  inputWrapper: {
    flexDirection: 'row',
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: SIZES.radius,
    alignItems: 'center',
  },
  input: {
    flex: 1,
    padding: 15,
    fontSize: SIZES.medium,
  },
  inputIcon: {
    padding: 15,
  },
});

export default FormInput;