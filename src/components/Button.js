import React from 'react';
import { TouchableOpacity, Text, StyleSheet, ActivityIndicator } from 'react-native';

// Berhubung kita belum mengimpor tema, kita akan mendefinisikan warna dan ukuran di sini
const COLORS = {
  primary: '#4CAF50',
  background: '#FFFFFF',
  text: {
    light: '#999999',
  },
};

const SIZES = {
  medium: 16,
  radius: 8,
};

const FONTS = {
  bold: {
    fontWeight: 'bold',
  },
};

const Button = ({
  title,
  onPress,
  disabled = false,
  loading = false,
  style,
  textStyle,
}) => {
  return (
    <TouchableOpacity
      style={[
        styles.button,
        disabled && styles.disabledButton,
        style,
      ]}
      onPress={onPress}
      disabled={disabled || loading}
    >
      {loading ? (
        <ActivityIndicator color={COLORS.background} size="small" />
      ) : (
        <Text style={[styles.buttonText, textStyle]}>{title}</Text>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    backgroundColor: COLORS.primary,
    borderRadius: SIZES.radius,
    padding: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  disabledButton: {
    backgroundColor: COLORS.text.light,
  },
  buttonText: {
    ...FONTS.bold,
    color: COLORS.background,
    fontSize: SIZES.medium,
  },
});

export default Button;