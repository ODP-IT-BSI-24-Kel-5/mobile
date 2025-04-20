import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

// Definisi warna dan ukuran
const COLORS = {
  primary: '#4CAF50',
  background: '#FFFFFF',
  text: {
    primary: '#333333',
  },
  border: '#DDDDDD',
};

const SIZES = {
  font: 14,
};

const FONTS = {
  regular: {
    fontWeight: 'normal',
  },
};

const Checkbox = ({ checked, onPress, label }) => {
  return (
    <TouchableOpacity style={styles.container} onPress={onPress}>
      <View style={[styles.checkbox, checked && styles.checkboxChecked]}>
        {checked && <Text style={styles.checkmark}>✓</Text>}
      </View>
      {label && <Text style={styles.label}>{label}</Text>}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  checkbox: {
    width: 20,
    height: 20,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 4,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 8,
  },
  checkboxChecked: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  checkmark: {
    color: COLORS.background,
    fontSize: 14,
  },
  label: {
    ...FONTS.regular,
    fontSize: SIZES.font,
    color: COLORS.text.primary,
  },
});

export default Checkbox;