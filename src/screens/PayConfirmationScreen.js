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

const PayConfirmationScreen = ({ route, navigation }) => {
  const { service, accountNumber, amount } = route.params || {};
  const [isLoading, setIsLoading] = useState(false);
  
  // Format currency
  const formattedAmount = new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
  }).format(amount || 0);

  // Handle confirm button
  const handleConfirm = () => {
    setIsLoading(true);
    
    // Simulate confirmation process
    setTimeout(() => {
      setIsLoading(false);
      navigation.navigate('PaySuccess', {
        service,
        accountNumber,
        amount,
        transactionId: 'PAY' + Math.floor(Math.random() * 10000000000),
      });
    }, 1500);
  };

  // Handle cancel button
  const handleCancel = () => {
    Alert.alert(
      'Batalkan Pembayaran',
      'Apakah Anda yakin ingin membatalkan pembayaran ini?',
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

  // Check if we have all required data
  if (!service || !accountNumber || !amount) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>Data pembayaran tidak lengkap</Text>
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
          <Text style={styles.headerTitle}>Konfirmasi Pembayaran</Text>
          <View style={{ width: 24 }} />
        </View>

        {/* Service Info */}
        <View style={styles.serviceInfoContainer}>
          <View style={styles.serviceIconContainer}>
            <Text style={styles.serviceIcon}>{service?.icon || '📄'}</Text>
          </View>
          <Text style={styles.serviceName}>{service?.name || 'Layanan'}</Text>
        </View>

        {/* Payment Details */}
        <View style={styles.detailsCard}>
          <Text style={styles.cardTitle}>Detail Pembayaran</Text>
          
          {/* Account Number */}
          <View style={styles.detailItem}>
            <Text style={styles.detailLabel}>Nomor Pelanggan/Akun</Text>
            <Text style={styles.detailValue}>{accountNumber}</Text>
          </View>
          
          {/* Payment Amount */}
          <View style={styles.detailItem}>
            <Text style={styles.detailLabel}>Nominal Pembayaran</Text>
            <Text style={styles.amountText}>{formattedAmount}</Text>
          </View>
          
          {/* Admin Fee */}
          <View style={styles.detailItem}>
            <Text style={styles.detailLabel}>Biaya Admin</Text>
            <Text style={styles.feeText}>Rp 1,500</Text>
          </View>
          
          {/* Total */}
          <View style={[styles.detailItem, styles.totalItem]}>
            <Text style={styles.totalLabel}>Total</Text>
            <Text style={styles.totalAmount}>
              {new Intl.NumberFormat('id-ID', {
                style: 'currency',
                currency: 'IDR',
                minimumFractionDigits: 0,
              }).format(amount + 1500)}
            </Text>
          </View>
        </View>

        {/* Payment Method */}
        <View style={styles.paymentMethodContainer}>
          <Text style={styles.paymentMethodTitle}>Metode Pembayaran</Text>
          <View style={styles.paymentMethodItem}>
            <View style={styles.walletIconContainer}>
              <Text style={styles.walletIcon}>💰</Text>
            </View>
            <View style={styles.walletInfo}>
              <Text style={styles.walletName}>Walled Balance</Text>
              <Text style={styles.walletBalance}>Rp 2,500,000</Text>
            </View>
            <View style={styles.selectedIndicator} />
          </View>
        </View>

        {/* Action Buttons */}
        <View style={styles.buttonContainer}>
          <Button
            title="Konfirmasi Pembayaran"
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
  serviceInfoContainer: {
    alignItems: 'center',
    marginBottom: 24,
  },
  serviceIconContainer: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: 'rgba(76, 175, 80, 0.1)',
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
  detailValue: {
    ...FONTS.medium,
    fontSize: SIZES.medium,
    color: COLORS.text.primary,
  },
  amountText: {
    ...FONTS.bold,
    fontSize: SIZES.large,
    color: COLORS.text.primary,
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
  paymentMethodContainer: {
    backgroundColor: COLORS.background,
    borderRadius: SIZES.radius,
    padding: 20,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  paymentMethodTitle: {
    ...FONTS.bold,
    fontSize: SIZES.large,
    color: COLORS.text.primary,
    marginBottom: 16,
  },
  paymentMethodItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
  },
  walletIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(76, 175, 80, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  walletIcon: {
    fontSize: 20,
  },
  walletInfo: {
    flex: 1,
  },
  walletName: {
    ...FONTS.medium,
    fontSize: SIZES.medium,
    color: COLORS.text.primary,
    marginBottom: 4,
  },
  walletBalance: {
    ...FONTS.regular,
    fontSize: SIZES.font,
    color: COLORS.text.secondary,
  },
  selectedIndicator: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: COLORS.primary,
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

export default PayConfirmationScreen;