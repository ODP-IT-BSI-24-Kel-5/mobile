import React from 'react';
import { View, Text, TextInput, StyleSheet, Platform } from 'react-native';

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
  regular: {
    fontWeight: 'normal',
  },
  medium: {
    fontWeight: '500',
  },
  bold: {
    fontWeight: 'bold',
  },
};

const AmountInput = ({
  label,
  value,
  onChangeText,
  currencySymbol = 'Rp',
  placeholder = '0',
}) => {
  // Filter untuk hanya menerima angka
  const handleChangeText = (text) => {
    const filteredText = text.replace(/[^0-9]/g, '');
    onChangeText(filteredText);
  };

  return (
    <View style={styles.container}>
      {label && <Text style={styles.label}>{label}</Text>}
      <View style={styles.inputWrapper}>
        <Text style={styles.currencySymbol}>{currencySymbol}</Text>
        <TextInput
          style={styles.input}
          value={value}
          onChangeText={handleChangeText}
          placeholder={placeholder}
          keyboardType="number-pad"
          textAlign="right"
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 20,
  },
  label: {
    ...FONTS.medium,
    fontSize: SIZES.medium,
    color: COLORS.text.primary,
    marginBottom: 8,
  },
  inputWrapper: {
    flexDirection: 'row',
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: SIZES.radius,
    height: 50,
    alignItems: 'center',
    paddingHorizontal: 15,
  },
  currencySymbol: {
    ...FONTS.bold,
    fontSize: SIZES.medium,
    color: COLORS.text.primary,
    marginRight: 10,
  },
  input: {
    flex: 1,
    height: 50,
    fontSize: SIZES.large,
    color: COLORS.text.primary,
    ...FONTS.medium,
  },
});

export default AmountInput;