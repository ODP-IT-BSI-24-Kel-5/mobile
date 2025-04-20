import React, { useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Alert,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Button from '../components/Button';
import { COLORS, SIZES, FONTS } from '../constants/theme';

const TransferConfirmationScreen = ({ navigation, route }) => {
  const [isLoading, setIsLoading] = useState(false);
  
  // Mendapatkan data dari parameter rute
  const { recipient, amount, note } = route.params || {};
  
  // Format jumlah menjadi format mata uang
  const formattedAmount = new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
  }).format(parseInt(amount));

  const handleTransfer = () => {
    setIsLoading(true);
    
    // Simulasi proses transfer
    setTimeout(() => {
      setIsLoading(false);
      
      // Navigasi ke halaman sukses
      navigation.navigate('TransferSuccess', {
        recipient,
        amount: formattedAmount,
        transactionId: 'TRX' + Math.floor(Math.random() * 1000000000)
      });
    }, 2000);
  };

  const handleCancel = () => {
    Alert.alert(
      'Cancel Transfer',
      'Are you sure you want to cancel this transfer?',
      [
        {
          text: 'No',
          style: 'cancel',
        },
        {
          text: 'Yes',
          onPress: () => navigation.goBack(),
        },
      ]
    );
  };

  if (!recipient || !amount) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>Invalid transfer data</Text>
          <Button 
            title="Go Back" 
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
          <Text style={styles.headerTitle}>Confirm Transfer</Text>
          <View style={{ width: 24 }} />
        </View>

        {/* Transfer Details Card */}
        <View style={styles.detailsCard}>
          <Text style={styles.cardTitle}>Transfer Details</Text>
          
          {/* Recipient */}
          <View style={styles.detailItem}>
            <Text style={styles.detailLabel}>Recipient</Text>
            <View style={styles.recipientContainer}>
              <View style={styles.avatarContainer}>
                <Text style={styles.avatar}>{recipient.avatar}</Text>
              </View>
              <View style={styles.recipientInfo}>
                <Text style={styles.recipientName}>{recipient.name}</Text>
                <Text style={styles.accountNumber}>{recipient.accountNumber}</Text>
              </View>
            </View>
          </View>
          
          {/* Amount */}
          <View style={styles.detailItem}>
            <Text style={styles.detailLabel}>Amount</Text>
            <Text style={styles.amountText}>{formattedAmount}</Text>
          </View>
          
          {/* Note */}
          {note && (
            <View style={styles.detailItem}>
              <Text style={styles.detailLabel}>Note</Text>
              <Text style={styles.noteText}>{note}</Text>
            </View>
          )}
          
          {/* Admin Fee */}
          <View style={styles.detailItem}>
            <Text style={styles.detailLabel}>Admin Fee</Text>
            <Text style={styles.feeText}>Rp 0</Text>
          </View>

          {/* Total */}
          <View style={[styles.detailItem, styles.totalItem]}>
            <Text style={styles.totalLabel}>Total</Text>
            <Text style={styles.totalAmount}>{formattedAmount}</Text>
          </View>
        </View>

        {/* Transfer & Cancel Buttons */}
        <View style={styles.buttonContainer}>
          <Button
            title="Transfer Now"
            onPress={handleTransfer}
            loading={isLoading}
            disabled={isLoading}
          />
          <Button
            title="Cancel"
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
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: SIZES.padding,
  },
  errorText: {
    ...FONTS.medium,
    fontSize: SIZES.large,
    color: COLORS.error,
    textAlign: 'center',
  },
  detailsCard: {
    backgroundColor: COLORS.background,
    borderRadius: SIZES.radius,
    padding: 20,
    marginBottom: 30,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  cardTitle: {
    ...FONTS.bold,
    fontSize: SIZES.large,
    color: COLORS.text.primary,
    marginBottom: 20,
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
  recipientContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatarContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(76, 175, 80, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  avatar: {
    fontSize: SIZES.large,
  },
  recipientInfo: {
    flex: 1,
  },
  recipientName: {
    ...FONTS.medium,
    fontSize: SIZES.medium,
    color: COLORS.text.primary,
  },
  accountNumber: {
    ...FONTS.regular,
    fontSize: SIZES.small,
    color: COLORS.text.secondary,
  },
  amountText: {
    ...FONTS.bold,
    fontSize: SIZES.xl,
    color: COLORS.text.primary,
  },
  noteText: {
    ...FONTS.regular,
    fontSize: SIZES.medium,
    color: COLORS.text.primary,
  },
  feeText: {
    ...FONTS.medium,
    fontSize: SIZES.medium,
    color: COLORS.text.primary,
  },
  totalItem: {
    marginTop: 10,
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
  buttonContainer: {
    marginTop: 20,
  },
  cancelButton: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: COLORS.primary,
    marginTop: 10,
  },
  cancelButtonText: {
    color: COLORS.primary,
  },
});

export default TransferConfirmationScreen;