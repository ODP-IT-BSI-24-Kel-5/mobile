import React from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Share,
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

const PaySuccessScreen = ({ route, navigation }) => {
  const { service, accountNumber, amount, transactionId } = route.params || {};
  
  // Format currency
  const formattedAmount = new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
  }).format(amount || 0);
  
  // Format total with admin fee
  const formattedTotal = new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
  }).format((amount || 0) + 1500);
  
  // Get current date and time
  const now = new Date();
  const dateString = now.toLocaleDateString('id-ID', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
  const timeString = now.toLocaleTimeString('id-ID', {
    hour: '2-digit',
    minute: '2-digit',
  });
  
  // Share receipt function
  const handleShare = async () => {
    try {
      await Share.share({
        message: `Pembayaran berhasil!\n\nLayanan: ${service?.name || 'Layanan'}\nNomor: ${accountNumber}\nJumlah: ${formattedAmount}\nBiaya Admin: Rp 1,500\nTotal: ${formattedTotal}\nID Transaksi: ${transactionId}\nWaktu: ${dateString} ${timeString}`,
        title: 'Bukti Pembayaran',
      });
    } catch (error) {
      console.log('Error sharing:', error.message);
    }
  };
  
  // Return to home function
  const handleBackToHome = () => {
    navigation.navigate('Home');
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollView}>
        {/* Success Header */}
        <View style={styles.successContainer}>
          <View style={styles.successIconContainer}>
            <Text style={styles.successIcon}>✅</Text>
          </View>
          <Text style={styles.successTitle}>Pembayaran Berhasil!</Text>
          <Text style={styles.successMessage}>
            Pembayaran {service?.name || 'layanan'} sebesar {formattedAmount} telah berhasil
          </Text>
        </View>
        
        {/* Payment Details */}
        <View style={styles.detailsCard}>
          <Text style={styles.cardTitle}>Detail Pembayaran</Text>
          
          {/* Service */}
          <View style={styles.detailItem}>
            <Text style={styles.detailLabel}>Layanan</Text>
            <View style={styles.serviceContainer}>
              <View style={styles.serviceIconContainer}>
                <Text style={styles.serviceIcon}>{service?.icon || '📄'}</Text>
              </View>
              <Text style={styles.serviceName}>{service?.name || 'Layanan'}</Text>
            </View>
          </View>
          
          {/* Account Number */}
          <View style={styles.detailItem}>
            <Text style={styles.detailLabel}>Nomor Pelanggan/Akun</Text>
            <Text style={styles.detailValue}>{accountNumber}</Text>
          </View>
          
          {/* Amount */}
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
            <Text style={styles.totalAmount}>{formattedTotal}</Text>
          </View>
          
          {/* Transaction ID */}
          <View style={styles.detailItem}>
            <Text style={styles.detailLabel}>ID Transaksi</Text>
            <Text style={styles.transactionIdText}>{transactionId}</Text>
          </View>
          
          {/* Date & Time */}
          <View style={styles.detailItem}>
            <Text style={styles.detailLabel}>Tanggal & Waktu</Text>
            <Text style={styles.dateTimeText}>{dateString} pukul {timeString}</Text>
          </View>
        </View>
        
        {/* Action Buttons */}
        <View style={styles.buttonContainer}>
          <Button
            title="Kembali ke Beranda"
            onPress={handleBackToHome}
            style={{ marginBottom: 12 }}
          />
          <Button
            title="Simpan Bukti Pembayaran"
            onPress={handleShare}
            style={styles.secondaryButton}
            textStyle={styles.secondaryButtonText}
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
  successContainer: {
    alignItems: 'center',
    marginBottom: 24,
  },
  successIconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'rgba(76, 175, 80, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  successIcon: {
    fontSize: 40,
  },
  successTitle: {
    ...FONTS.bold,
    fontSize: SIZES.xl,
    color: COLORS.text.primary,
    marginBottom: 8,
    textAlign: 'center',
  },
  successMessage: {
    ...FONTS.regular,
    fontSize: SIZES.medium,
    color: COLORS.text.secondary,
    textAlign: 'center',
    marginBottom: 8,
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
  serviceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  serviceIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(76, 175, 80, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  serviceIcon: {
    fontSize: 18,
  },
  serviceName: {
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
  transactionIdText: {
    ...FONTS.medium,
    fontSize: SIZES.medium,
    color: COLORS.text.primary,
  },
  dateTimeText: {
    ...FONTS.medium,
    fontSize: SIZES.medium,
    color: COLORS.text.primary,
  },
  buttonContainer: {
    marginBottom: 20,
  },
  secondaryButton: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: COLORS.primary,
  },
  secondaryButtonText: {
    color: COLORS.primary,
  },
});

export default PaySuccessScreen;