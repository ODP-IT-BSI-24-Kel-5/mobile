import React from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Share,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Button from '../components/Button';
import { COLORS, SIZES, FONTS } from '../constants/theme';

const TransferSuccessScreen = ({ navigation, route }) => {
  const { recipient, amount, transactionId } = route.params || {};
  
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
  
  const handleShare = async () => {
    try {
      await Share.share({
        message: `I just transferred ${amount} to ${recipient.name}. Transaction ID: ${transactionId}`,
        title: 'Transfer Successful',
      });
    } catch (error) {
      console.log('Error sharing transfer:', error.message);
    }
  };
  
  const handleBackToHome = () => {
    navigation.navigate('Home');
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollView}>
        {/* Success Icon */}
        <View style={styles.successIconContainer}>
          <Text style={styles.successIcon}>✅</Text>
        </View>
        
        {/* Success Messages */}
        <Text style={styles.successTitle}>Transfer Successful!</Text>
        <Text style={styles.successMessage}>
          Your money has been successfully transferred to {recipient.name}
        </Text>
        
        {/* Transfer Details Card */}
        <View style={styles.detailsCard}>
          <Text style={styles.cardTitle}>Transfer Details</Text>
          
          {/* Amount */}
          <View style={styles.detailItem}>
            <Text style={styles.detailLabel}>Amount</Text>
            <Text style={styles.amountText}>{amount}</Text>
          </View>
          
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
          
          {/* Date & Time */}
          <View style={styles.detailItem}>
            <Text style={styles.detailLabel}>Date & Time</Text>
            <Text style={styles.dateTimeText}>{dateString} at {timeString}</Text>
          </View>
          
          {/* Transaction ID */}
          <View style={styles.detailItem}>
            <Text style={styles.detailLabel}>Transaction ID</Text>
            <Text style={styles.transactionIdText}>{transactionId}</Text>
          </View>
        </View>
        
        {/* Action Buttons */}
        <View style={styles.buttonContainer}>
          <Button
            title="Back to Home"
            onPress={handleBackToHome}
            style={styles.homeButton}
          />
          <Button
            title="Share Receipt"
            onPress={handleShare}
            style={styles.shareButton}
            textStyle={styles.shareButtonText}
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
    alignItems: 'center',
  },
  successIconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'rgba(76, 175, 80, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
    marginTop: 20,
  },
  successIcon: {
    fontSize: 40,
  },
  successTitle: {
    ...FONTS.bold,
    fontSize: SIZES.xl,
    color: COLORS.text.primary,
    marginBottom: 10,
    textAlign: 'center',
  },
  successMessage: {
    ...FONTS.regular,
    fontSize: SIZES.medium,
    color: COLORS.text.secondary,
    textAlign: 'center',
    marginBottom: 30,
    paddingHorizontal: 20,
  },
  detailsCard: {
    backgroundColor: COLORS.background,
    borderRadius: SIZES.radius,
    padding: 20,
    marginBottom: 30,
    borderWidth: 1,
    borderColor: COLORS.border,
    width: '100%',
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
  amountText: {
    ...FONTS.bold,
    fontSize: SIZES.xl,
    color: COLORS.primary,
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
  dateTimeText: {
    ...FONTS.medium,
    fontSize: SIZES.medium,
    color: COLORS.text.primary,
  },
  transactionIdText: {
    ...FONTS.medium,
    fontSize: SIZES.medium,
    color: COLORS.text.primary,
  },
  buttonContainer: {
    width: '100%',
  },
  homeButton: {
    marginBottom: 10,
  },
  shareButton: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: COLORS.primary,
  },
  shareButtonText: {
    color: COLORS.primary,
  },
});

export default TransferSuccessScreen;