import React, { useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Button from '../components/Button';
import FormInput from '../components/FormInput';
import AmountInput from '../components/AmountInput';

// Constants
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

// Dummy data for bill types
const billAmounts = {
  'PLN': [
    { id: '1', amount: 'Rp 50,000', value: 50000 },
    { id: '2', amount: 'Rp 100,000', value: 100000 },
    { id: '3', amount: 'Rp 200,000', value: 200000 },
    { id: '4', amount: 'Rp 500,000', value: 500000 },
    { id: '5', amount: 'Rp 1,000,000', value: 1000000 },
  ],
  'TSEL': [
    { id: '1', amount: 'Rp 25,000', value: 25000 },
    { id: '2', amount: 'Rp 50,000', value: 50000 },
    { id: '3', amount: 'Rp 100,000', value: 100000 },
    { id: '4', amount: 'Rp 200,000', value: 200000 },
  ],
  'STRM': [
    { id: '1', amount: 'Rp 54,000 - Basic Plan', value: 54000 },
    { id: '2', amount: 'Rp 159,000 - Standard Plan', value: 159000 },
    { id: '3', amount: 'Rp 199,000 - Premium Plan', value: 199000 },
  ],
  'default': [
    { id: '1', amount: 'Rp 50,000', value: 50000 },
    { id: '2', amount: 'Rp 100,000', value: 100000 },
    { id: '3', amount: 'Rp 200,000', value: 200000 },
  ]
};

const PayDetailScreen = ({ route, navigation }) => {
  const { service } = route.params || {};
  const [accountNumber, setAccountNumber] = useState(service?.no || '');
  const [selectedAmount, setSelectedAmount] = useState(null);
  const [customAmount, setCustomAmount] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Get appropriate bill amounts based on service code
  const getAmountOptions = () => {
    if (service?.code && billAmounts[service.code]) {
      return billAmounts[service.code];
    }
    return billAmounts.default;
  };

  const handleContinue = () => {
    if (!accountNumber) {
      Alert.alert('Error', 'Mohon masukkan nomor pelanggan/akun');
      return;
    }

    const amount = selectedAmount?.value || parseInt(customAmount);
    if (!amount || amount <= 0) {
      Alert.alert('Error', 'Mohon pilih atau masukkan jumlah pembayaran');
      return;
    }

    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      navigation.navigate('PayConfirmation', {
        service,
        accountNumber,
        amount,
      });
    }, 1000);
  };

  const handleSelectAmount = (amount) => {
    setSelectedAmount(amount);
    setCustomAmount('');
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollView}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Text style={styles.backButton}>←</Text>
          </TouchableOpacity>
          <Text style={styles.headerTitle}>{service?.name || 'Detail Pembayaran'}</Text>
          <View style={{ width: 24 }} />
        </View>

        {/* Service Info */}
        <View style={styles.serviceInfoContainer}>
          <View style={styles.serviceIconContainer}>
            <Text style={styles.serviceIcon}>{service?.icon || '📄'}</Text>
          </View>
          <Text style={styles.serviceName}>{service?.name || 'Layanan'}</Text>
          <Text style={styles.serviceDescription}>
            Masukkan nomor pelanggan/akun dan pilih nominal pembayaran
          </Text>
        </View>

        {/* Account Number Input */}
        <View style={styles.section}>
          <FormInput
            label="Nomor Pelanggan/Akun"
            placeholder="Masukkan nomor pelanggan atau akun"
            value={accountNumber}
            onChangeText={setAccountNumber}
            keyboardType="numeric"
            icon="📋"
          />
        </View>

        {/* Amount Selection */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Pilih Nominal</Text>
          <View style={styles.amountGrid}>
            {getAmountOptions().map((item) => (
              <TouchableOpacity
                key={item.id}
                style={[
                  styles.amountItem,
                  selectedAmount?.id === item.id && styles.selectedAmountItem
                ]}
                onPress={() => handleSelectAmount(item)}
              >
                <Text 
                  style={[
                    styles.amountText,
                    selectedAmount?.id === item.id && styles.selectedAmountText
                  ]}
                >
                  {item.amount}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* Custom Amount Input (for some services) */}
          {service?.code !== 'STRM' && (
            <View style={styles.customAmountContainer}>
              <Text style={styles.customAmountLabel}>Atau masukkan nominal lain:</Text>
              <View style={styles.inputContainer}>
              <Text style={styles.currencySymbol}>Rp</Text>
                <FormInput
                  placeholder="0"
                  value={customAmount}
                  onChangeText={(text) => {
                    // Filter only numbers
                    const filteredText = text.replace(/[^0-9]/g, '');
                    setCustomAmount(filteredText);
                    setSelectedAmount(null); // Reset selected amount
                  }}
                  keyboardType="numeric"
                  icon="💰"
                  isAmount={true}
                  textAlign="right"
                />
              </View>
            </View>
          )}
        </View>

        {/* Fee Info */}
        <View style={styles.feeInfoContainer}>
          <Text style={styles.feeInfoTitle}>Informasi Biaya</Text>
          <View style={styles.feeItem}>
            <Text style={styles.feeLabel}>Biaya Admin</Text>
            <Text style={styles.feeValue}>Rp 1,500</Text>
          </View>
        </View>

        {/* Continue Button */}
        <Button
          title="Lanjutkan"
          onPress={handleContinue}
          disabled={!accountNumber || (!selectedAmount && !customAmount) || isLoading}
          loading={isLoading}
          style={{ marginTop: 20, marginBottom: 20 }}
        />
      </ScrollView>
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
    marginBottom: 24,
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
  serviceInfoContainer: {
    alignItems: 'center',
    marginBottom: 24,
    padding: 20,
    backgroundColor: 'rgba(76, 175, 80, 0.1)',
    borderRadius: SIZES.radius,
  },
  serviceIconContainer: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: COLORS.background,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  serviceIcon: {
    fontSize: 30,
  },
  serviceName: {
    ...FONTS.bold,
    fontSize: SIZES.large,
    color: COLORS.text.primary,
    marginBottom: 8,
  },
  serviceDescription: {
    ...FONTS.regular,
    fontSize: SIZES.medium,
    color: COLORS.text.secondary,
    textAlign: 'center',
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
    textAlign: 'center',
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
  feeInfoContainer: {
    backgroundColor: '#F5F5F5',
    borderRadius: SIZES.radius,
    padding: 16,
    marginBottom: 20,
  },
  feeInfoTitle: {
    ...FONTS.bold,
    fontSize: SIZES.medium,
    color: COLORS.text.primary,
    marginBottom: 12,
  },
  feeItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  feeLabel: {
    ...FONTS.regular,
    fontSize: SIZES.medium,
    color: COLORS.text.secondary,
  },
  feeValue: {
    ...FONTS.medium,
    fontSize: SIZES.medium,
    color: COLORS.text.primary,
  },
});

export default PayDetailScreen;