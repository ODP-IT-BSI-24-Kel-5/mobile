import React from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Share,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Button from '../components/Button';

// Konstanta
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

const TopUpSuccessScreen = ({ route, navigation }) => {
  const { method, amount, transactionId, accountInfo } = route.params || {};
  
  // Format jumlah uang
  const formattedAmount = new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
  }).format(amount || 0);
  
  // Mendapatkan waktu dan tanggal saat ini
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
  
  // Fungsi berbagi detail top up
  const handleShare = async () => {
    try {
      await Share.share({
        message: `Saya baru saja melakukan top up saldo sebesar ${formattedAmount} melalui ${method?.name || 'metode pembayaran'}. ID Transaksi: ${transactionId}`,
        title: 'Detail Top Up',
      });
    } catch (error) {
      console.log('Error sharing:', error.message);
    }
  };
  
  // Fungsi kembali ke beranda
  const handleBackToHome = () => {
    navigation.navigate('Home');
  };

  // Fungsi melihat detail pembayaran
  const handleSeeDetails = () => {
    // Idealnya, ini akan membuka halaman detail pembayaran
    // Untuk saat ini, kita hanya perlihatkan alert
    Alert.alert(
      'Detail Pembayaran',
      `ID Transaksi: ${transactionId}\nMetode: ${method?.name}\nJumlah: ${formattedAmount}\nWaktu: ${dateString} ${timeString}`
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollView}>
        {/* Success Header */}
        <View style={styles.successContainer}>
          <View style={styles.successIconContainer}>
            <Text style={styles.successIcon}>✅</Text>
          </View>
          <Text style={styles.successTitle}>Permintaan Top Up Berhasil!</Text>
          <Text style={styles.successMessage}>
            Top up sebesar {formattedAmount} sedang dalam proses
          </Text>
        </View>
        
        {/* Top Up Details */}
        <View style={styles.detailsCard}>
          <Text style={styles.cardTitle}>Detail Top Up</Text>
          
          {/* Method */}
          <View style={styles.detailItem}>
            <Text style={styles.detailLabel}>Metode Pembayaran</Text>
            <View style={styles.methodContainer}>
              <View style={styles.methodIconContainer}>
                <Text style={styles.methodIcon}>{method?.icon || '🏦'}</Text>
              </View>
              <Text style={styles.methodName}>{method?.name || 'Metode Pembayaran'}</Text>
            </View>
          </View>
          
          {/* Amount */}
          <View style={styles.detailItem}>
            <Text style={styles.detailLabel}>Jumlah</Text>
            <Text style={styles.amountText}>{formattedAmount}</Text>
          </View>
          
          {/* Account Details */}
          {accountInfo && (
            <View style={styles.detailItem}>
              <Text style={styles.detailLabel}>{accountInfo.name}</Text>
              <Text style={styles.accountNumberText}>{accountInfo.number}</Text>
            </View>
          )}
          
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
        
        {/* Payment Instruction */}
        <View style={styles.instructionContainer}>
          <Text style={styles.instructionTitle}>Instruksi Pembayaran</Text>
          <Text style={styles.instructionText}>
            1. Lakukan pembayaran sebelum {timeString}, {new Date(now.getTime() + 24 * 60 * 60 * 1000).toLocaleDateString('id-ID', {day: 'numeric', month: 'long', year: 'numeric'})}.
          </Text>
          <Text style={styles.instructionText}>
            2. Saldo akan otomatis ditambahkan dalam 5-10 menit setelah pembayaran.
          </Text>
          <Text style={styles.instructionText}>
            3. Simpan ID transaksi sebagai referensi pembayaran Anda.
          </Text>
        </View>
        
        {/* Action Buttons */}
        <View style={styles.buttonContainer}>
          <Button
            title="Kembali ke Beranda"
            onPress={handleBackToHome}
            style={{ marginBottom: 12 }}
          />
          <Button
            title="Simpan Bukti Top Up"
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
  methodName: {
    ...FONTS.medium,
    fontSize: SIZES.medium,
    color: COLORS.text.primary,
  },
  amountText: {
    ...FONTS.bold,
    fontSize: SIZES.xl,
    color: COLORS.primary,
  },
  accountNumberText: {
    ...FONTS.bold,
    fontSize: SIZES.medium,
    color: COLORS.primary,
    letterSpacing: 1,
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
  secondaryButton: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: COLORS.primary,
  },
  secondaryButtonText: {
    color: COLORS.primary,
  },
});

export default TopUpSuccessScreen;