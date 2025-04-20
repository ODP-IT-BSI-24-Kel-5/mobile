import React from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';

// Karena mungkin kita belum memiliki file tema
const COLORS = {
  primary: '#4CAF50',
};

const Logo = ({ size = 'medium' }) => {
  // Size options for the logo
  const logoSizes = {
    small: { container: 30, logo: 30, text: 16 },
    medium: { container: 40, logo: 40, text: 24 },
    large: { container: 60, logo: 60, text: 32 },
  };
  
  const selectedSize = logoSizes[size] || logoSizes.medium;
  
  return (
    <View style={styles.container}>
      <View 
        style={[
          styles.logoPlaceholder, 
          { width: selectedSize.logo, height: selectedSize.logo }
        ]}
      >
        <Text style={styles.logoText}>W</Text>
      </View>
      <Text style={[styles.text, { fontSize: selectedSize.text }]}>Walled</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  logoPlaceholder: {
    width: 40,
    height: 40,
    backgroundColor: COLORS.primary,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 20,
  },
  text: {
    fontWeight: 'bold',
    marginLeft: 10,
    color: COLORS.primary,
  },
});

export default Logo;