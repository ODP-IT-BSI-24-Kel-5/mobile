import React, { useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import FormInput from '../components/FormInput';
import Button from '../components/Button';
import AmountInput from '../components/AmountInput';

// Karena mungkin file tema belum dibuat
const COLORS = {
  primary: '#4CAF50',
  background: '#FFFFFF',
  text: {
    primary: '#333333',
    secondary: '#666666',
    light: '#999999',
  },
  border: '#DDDDDD',
};

const SIZES = {
  base: 8,
  small: 12,
  font: 14,
  medium: 16,
  large: 18,
  xl: 24,
  xxl: 32,
  padding: 20,
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

// Data metode pembayaran
const paymentMethods = [
  {
    id: '1',
    name: 'Bank Transfer',
    icon: '🏦',
    description: 'Transfer dari rekening bank Anda'
  },
  {
    id: '2',
    name: 'Kartu Kredit/Debit',
    icon: '💳',
    description: 'Gunakan kartu kredit atau debit Anda'
  },
  {
    id: '3',
    name: 'Minimarket',
    icon: '🏪',
    description: 'Bayar di Alfamart, Indomaret, dll'
  },
  {
    id: '4',
    name: 'E-Wallet Lain',
    icon: '📱',
    description: 'Transfer dari e-wallet lain'
  }
];

// Pilihan jumlah top up
const quickAmounts = [
  { id: '1', amount: 'Rp 50,000', value: 50000 },
  { id: '2', amount: 'Rp 100,000', value: 100000 },
  { id: '3', amount: 'Rp 250,000', value: 250000 },
  { id: '4', amount: 'Rp 500,000', value: 500000 },
  { id: '5', amount: 'Rp 1,000,000', value: 1000000 },
];

const TopUpScreen = ({ navigation }) => {
  const [selectedMethod, setSelectedMethod] = useState(null);
  const [amount, setAmount] = useState('');
  const [customAmount, setCustomAmount] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSelectMethod = (method) => {
    setSelectedMethod(method);
  };

  const handleSelectAmount = (selectedAmount) => {
    setAmount(selectedAmount.value.toString());
    setCustomAmount(selectedAmount.value.toString());
  };

  const handleContinue = () => {
    const topUpAmount = amount || customAmount;
    
    if (!selectedMethod) {
      Alert.alert('Error', 'Silakan pilih metode pembayaran');
      return;
    }

    if (!topUpAmount || parseInt(topUpAmount) <= 0) {
      Alert.alert('Error', 'Silakan masukkan jumlah yang valid');
      return;
    }

    // Simulasi proses top up
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      // Navigate to confirmation screen
      navigation.navigate('TopUpConfirmation', {
        method: selectedMethod,
        amount: parseInt(topUpAmount),
      });
    }, 1000);
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1 }}
      >
        <ScrollView contentContainerStyle={styles.scrollView}>
          {/* Header */}
          <View style={styles.header}>
            <TouchableOpacity onPress={() => navigation.goBack()}>
              <Text style={styles.backButton}>←</Text>
            </TouchableOpacity>
            <Text style={styles.headerTitle}>Top Up</Text>
            <View style={{ width: 24 }} />
          </View>

          {/* Top Up Amount Section */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Pilih Jumlah</Text>
            <View style={styles.amountGrid}>
              {quickAmounts.map((item) => (
                <TouchableOpacity
                  key={item.id}
                  style={[
                    styles.amountItem,
                    amount === item.value.toString() && styles.selectedAmountItem
                  ]}
                  onPress={() => handleSelectAmount(item)}
                >
                  <Text 
                    style={[
                      styles.amountText,
                      amount === item.value.toString() && styles.selectedAmountText
                    ]}
                  >
                    {item.amount}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            {/* Custom Amount Input */}
            <View style={styles.customAmountContainer}>
              <Text style={styles.customAmountLabel}>Atau masukkan jumlah lain:</Text>
              <View style={styles.inputContainer}>
                <Text style={styles.currencySymbol}>Rp</Text>
                <FormInput
                    placeholder="0"
                    value={customAmount}
                    onChangeText={(text) => {
                    // Filter hanya angka
                    const filteredText = text.replace(/[^0-9]/g, '');
                    setCustomAmount(filteredText);
                    setAmount(''); // Reset selected amount
                    }}
                    keyboardType="numeric"
                    icon="💰"
                    isAmount={true}
                    textAlign="right"
                />
              </View>
            </View>
          </View>

          {/* Payment Method Section */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Metode Pembayaran</Text>
            {paymentMethods.map((method) => (
              <TouchableOpacity
                key={method.id}
                style={[
                  styles.methodItem,
                  selectedMethod?.id === method.id && styles.selectedMethodItem
                ]}
                onPress={() => handleSelectMethod(method)}
              >
                <View style={styles.methodIconContainer}>
                  <Text style={styles.methodIcon}>{method.icon}</Text>
                </View>
                <View style={styles.methodInfo}>
                  <Text style={styles.methodName}>{method.name}</Text>
                  <Text style={styles.methodDescription}>{method.description}</Text>
                </View>
              </TouchableOpacity>
            ))}
          </View>

          {/* Continue Button */}
          <Button
            title="Lanjutkan"
            onPress={handleContinue}
            disabled={!selectedMethod || (!amount && !customAmount) || isLoading}
            loading={isLoading}
            style={{ marginTop: 20, marginBottom: 20 }}
          />
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  scrollView: {
    flexGrow: 1,
    padding: SIZES.padding,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 30,
  },
  backButton: {
    fontSize: 28,
    color: COLORS.text.primary,
  },
  headerTitle: {
    ...FONTS.bold,
    fontSize: SIZES.large,
    color: COLORS.text.primary,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    ...FONTS.bold,
    fontSize: SIZES.medium,
    color: COLORS.text.primary,
    marginBottom: 16,
  },
  amountGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  amountItem: {
    width: '48%',
    padding: 16,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: SIZES.radius,
    marginBottom: 12,
    alignItems: 'center',
  },
  selectedAmountItem: {
    borderColor: COLORS.primary,
    backgroundColor: 'rgba(76, 175, 80, 0.05)',
  },
  amountText: {
    ...FONTS.medium,
    fontSize: SIZES.medium,
    color: COLORS.text.primary,
  },
  selectedAmountText: {
    color: COLORS.primary,
  },
  customAmountContainer: {
    marginTop: 16,
  },
  customAmountLabel: {
    ...FONTS.medium,
    fontSize: SIZES.medium,
    color: COLORS.text.primary,
    marginBottom: 12,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  currencySymbol: {
    ...FONTS.bold,
    fontSize: SIZES.medium,
    color: COLORS.text.primary,
    marginRight: 8,
  },
  methodItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: SIZES.radius,
    marginBottom: 12,
  },
  selectedMethodItem: {
    borderColor: COLORS.primary,
    backgroundColor: 'rgba(76, 175, 80, 0.05)',
  },
  methodIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(76, 175, 80, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  methodIcon: {
    fontSize: SIZES.large,
  },
  methodInfo: {
    flex: 1,
  },
  methodName: {
    ...FONTS.medium,
    fontSize: SIZES.medium,
    color: COLORS.text.primary,
    marginBottom: 4,
  },
  methodDescription: {
    ...FONTS.regular,
    fontSize: SIZES.small,
    color: COLORS.text.secondary,
  },
});

export default TopUpScreen;