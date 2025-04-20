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

// Konstanta
const COLORS = {
  primary: '#4CAF50',
  secondary: '#FFA000',
  background: '#FFFFFF',
  text: {
    primary: '#333333',
    secondary: '#666666',
    light: '#999999',
  },
  border: '#DDDDDD',
  success: '#28a745',
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

// Simulasi data bank/metode pembayaran
const bankAccounts = {
  '1': { // Bank Transfer
    name: 'Virtual Account BCA',
    number: '8810 1234 5678 9012',
  },
  '2': { // Kartu Kredit
    name: 'Kartu Kredit / Debit',
    number: 'Masukkan detail kartu Anda',
  },
  '3': { // Minimarket
    name: 'Kode Pembayaran',
    number: '8800 1234 5678 9012',
  },
  '4': { // E-Wallet lain
    name: 'QRIS Code',
    number: 'Pindai kode QR',
  }
};

const TopUpConfirmationScreen = ({ route, navigation }) => {
  const { method, amount } = route.params || {};
  const [isLoading, setIsLoading] = useState(false);
  
  // Format jumlah uang
  const formattedAmount = new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
  }).format(amount || 0);

  // Handle tombol konfirmasi
  const handleConfirm = () => {
    setIsLoading(true);
    
    // Simulasi proses konfirmasi
    setTimeout(() => {
      setIsLoading(false);
      navigation.navigate('TopUpSuccess', {
        method,
        amount,
        transactionId: 'TU' + Math.floor(Math.random() * 10000000000),
        accountInfo: bankAccounts[method.id]
      });
    }, 1500);
  };

  // Handle tombol kembali
  const handleCancel = () => {
    Alert.alert(
      'Batalkan Top Up',
      'Apakah Anda yakin ingin membatalkan top up ini?',
      [
        {
          text: 'Tidak',
          style: 'cancel',
        },
        {
          text: 'Ya',
          onPress: () => navigation.goBack(),
          style: 'destructive',
        },
      ]
    );
  };

  if (!method || !amount) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>Data top up tidak lengkap</Text>
          <Button 
            title="Kembali" 
            onPress={() => navigation.goBack()} 
            style={{ marginTop: 20 }}
          />
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollView}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Text style={styles.backButton}>←</Text>
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Konfirmasi Top Up</Text>
          <View style={{ width: 24 }} />
        </View>

        {/* Amount Display */}
        <View style={styles.amountContainer}>
          <Text style={styles.amountLabel}>Jumlah Top Up</Text>
          <Text style={styles.amountValue}>{formattedAmount}</Text>
        </View>

        {/* Payment details */}
        <View style={styles.detailsCard}>
          <Text style={styles.cardTitle}>Detail Pembayaran</Text>
          
          {/* Payment Method */}
          <View style={styles.detailItem}>
            <Text style={styles.detailLabel}>Metode Pembayaran</Text>
            <View style={styles.methodContainer}>
              <View style={styles.methodIconContainer}>
                <Text style={styles.methodIcon}>{method.icon}</Text>
              </View>
              <View style={styles.methodInfo}>
                <Text style={styles.methodName}>{method.name}</Text>
                <Text style={styles.methodDescription}>{method.description}</Text>
              </View>
            </View>
          </View>
          
          {/* Account Details */}
          <View style={styles.detailItem}>
            <Text style={styles.detailLabel}>{bankAccounts[method.id].name}</Text>
            <Text style={styles.accountNumberText}>{bankAccounts[method.id].number}</Text>
          </View>
          
          {/* Fee */}
          <View style={styles.detailItem}>
            <Text style={styles.detailLabel}>Biaya Admin</Text>
            <Text style={styles.feeText}>Rp 0</Text>
          </View>
          
          {/* Total */}
          <View style={[styles.detailItem, styles.totalItem]}>
            <Text style={styles.totalLabel}>Total</Text>
            <Text style={styles.totalAmount}>{formattedAmount}</Text>
          </View>
        </View>

        {/* Instructions */}
        <View style={styles.instructionContainer}>
          <Text style={styles.instructionTitle}>Instruksi Pembayaran</Text>
          <Text style={styles.instructionText}>
            1. Lakukan pembayaran dalam 24 jam setelah konfirmasi.
          </Text>
          <Text style={styles.instructionText}>
            2. Saldo akan otomatis ditambahkan setelah pembayaran berhasil.
          </Text>
          <Text style={styles.instructionText}>
            3. Simpan bukti pembayaran Anda sampai proses selesai.
          </Text>
        </View>

        {/* Action Buttons */}
        <View style={styles.buttonContainer}>
          <Button
            title="Konfirmasi"
            onPress={handleConfirm}
            loading={isLoading}
            disabled={isLoading}
            style={{ marginBottom: 12 }}
          />
          <Button
            title="Batalkan"
            onPress={handleCancel}
            style={styles.cancelButton}
            textStyle={styles.cancelButtonText}
            disabled={isLoading}
          />
        </View>
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
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: SIZES.padding,
  },
  errorText: {
    ...FONTS.medium,
    fontSize: SIZES.medium,
    color: 'red',
    textAlign: 'center',
  },
  amountContainer: {
    alignItems: 'center',
    marginBottom: 24,
    padding: 20,
    backgroundColor: COLORS.primary,
    borderRadius: SIZES.radius,
  },
  amountLabel: {
    ...FONTS.medium,
    fontSize: SIZES.medium,
    color: 'rgba(255, 255, 255, 0.8)',
    marginBottom: 8,
  },
  amountValue: {
    ...FONTS.bold,
    fontSize: SIZES.xxl,
    color: COLORS.background,
  },
  detailsCard: {
    backgroundColor: COLORS.background,
    borderRadius: SIZES.radius,
    padding: 20,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  cardTitle: {
    ...FONTS.bold,
    fontSize: SIZES.large,
    color: COLORS.text.primary,
    marginBottom: 16,
  },
  detailItem: {
    marginBottom: 16,
  },
  detailLabel: {
    ...FONTS.regular,
    fontSize: SIZES.font,
    color: COLORS.text.secondary,
    marginBottom: 8,
  },
  methodContainer: {
    flexDirection: 'row',
    alignItems: 'center',
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
  },
  methodDescription: {
    ...FONTS.regular,
    fontSize: SIZES.small,
    color: COLORS.text.secondary,
  },
  accountNumberText: {
    ...FONTS.bold,
    fontSize: SIZES.medium,
    color: COLORS.primary,
    letterSpacing: 1,
  },
  feeText: {
    ...FONTS.medium,
    fontSize: SIZES.medium,
    color: COLORS.text.primary,
  },
  totalItem: {
    marginTop: 8,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
  },
  totalLabel: {
    ...FONTS.bold,
    fontSize: SIZES.medium,
    color: COLORS.text.primary,
    marginBottom: 8,
  },
  totalAmount: {
    ...FONTS.bold,
    fontSize: SIZES.xl,
    color: COLORS.primary,
  },
  instructionContainer: {
    backgroundColor: 'rgba(76, 175, 80, 0.1)',
    borderRadius: SIZES.radius,
    padding: 16,
    marginBottom: 24,
  },
  instructionTitle: {
    ...FONTS.bold,
    fontSize: SIZES.medium,
    color: COLORS.text.primary,
    marginBottom: 12,
  },
  instructionText: {
    ...FONTS.regular,
    fontSize: SIZES.font,
    color: COLORS.text.primary,
    marginBottom: 8,
  },
  buttonContainer: {
    marginBottom: 20,
  },
  cancelButton: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: COLORS.primary,
  },
  cancelButtonText: {
    color: COLORS.primary,
  },
});

export default TopUpConfirmationScreen;