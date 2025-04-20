import React from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Platform } from 'react-native';

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
  isAmount = false,
  textAlign = 'left',
}) => {
  // Debugging
  console.log("Input value:", value);
  
  return (
    <View style={styles.inputContainer}>
      {label && <Text style={styles.inputLabel}>{label}</Text>}
      <View style={styles.inputWrapper}>
        {/* Input with fixed styling */}
        <TextInput
          style={[
            styles.input, 
            { textAlign: isAmount ? 'right' : textAlign }
          ]}
          placeholder={placeholder}
          value={value}
          onChangeText={onChangeText}
          secureTextEntry={isPassword && !showPassword}
          keyboardType={isAmount ? 'number-pad' : (keyboardType || 'default')}
          autoCapitalize={autoCapitalize || 'sentences'}
        />
        
        {/* Icon on the right side */}
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
    minHeight: 50,
    position: 'relative',
  },
  input: {
    flex: 1,
    paddingVertical: 15,
    paddingLeft: 15,
    paddingRight: 50, // Space for icon
    fontSize: SIZES.medium,
    color: COLORS.text.primary,
    height: 50,
  },
  inputIcon: {
    position: 'absolute',
    right: 15,
    justifyContent: 'center',
    alignItems: 'center',
    height: 50,
    width: 30,
  },
});

export default FormInput;