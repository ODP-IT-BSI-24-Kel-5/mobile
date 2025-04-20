import React, { useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  FlatList,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import FormInput from '../components/FormInput';
import Button from '../components/Button';
import AmountInput from '../components/AmountInput';
import { COLORS, SIZES, FONTS } from '../constants/theme';

// Data dummy untuk kontak/penerima
const recentContacts = [
  { id: '1', name: 'John Doe', accountNumber: '1234567890', avatar: '👨' },
  { id: '2', name: 'Jane Smith', accountNumber: '0987654321', avatar: '👩' },
  { id: '3', name: 'Bob Johnson', accountNumber: '1122334455', avatar: '👨‍🦰' },
  { id: '4', name: 'Alice Williams', accountNumber: '5566778899', avatar: '👱‍♀️' },
];

const TransferScreen = ({ navigation }) => {
  const [selectedContact, setSelectedContact] = useState(null);
  const [amount, setAmount] = useState('');
  const [note, setNote] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSelectContact = (contact) => {
    setSelectedContact(contact);
  };

  const handleContinue = () => {
    if (!selectedContact) {
      Alert.alert('Error', 'Please select a recipient');
      return;
    }

    if (!amount || parseFloat(amount) <= 0) {
      Alert.alert('Error', 'Please enter a valid amount');
      return;
    }

    // Simulasi proses transfer
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      // Navigate to confirmation screen
      navigation.navigate('TransferConfirmation', {
        recipient: selectedContact,
        amount,
        note,
      });
    }, 1000);
  };

  const renderContactItem = ({ item }) => (
    <TouchableOpacity
      style={[
        styles.contactItem,
        selectedContact?.id === item.id && styles.selectedContactItem,
      ]}
      onPress={() => handleSelectContact(item)}
    >
      <View style={styles.avatarContainer}>
        <Text style={styles.avatar}>{item.avatar}</Text>
      </View>
      <View style={styles.contactInfo}>
        <Text style={styles.contactName}>{item.name}</Text>
        <Text style={styles.accountNumber}>{item.accountNumber}</Text>
      </View>
    </TouchableOpacity>
  );

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
            <Text style={styles.headerTitle}>Transfer Money</Text>
            <View style={{ width: 24 }} />
          </View>

          {/* Recent Recipients */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Recent Recipients</Text>
            <FlatList
              data={recentContacts}
              keyExtractor={(item) => item.id}
              renderItem={renderContactItem}
              horizontal={false}
              showsVerticalScrollIndicator={false}
              contentContainerStyle={styles.contactsList}
            />
          </View>

          {/* Selected Recipient */}
          {selectedContact && (
            <View style={styles.selectedContactContainer}>
              <Text style={styles.selectedContactLabel}>Sending to:</Text>
              <View style={styles.selectedContactContent}>
                <View style={styles.avatarContainer}>
                  <Text style={styles.avatar}>{selectedContact.avatar}</Text>
                </View>
                <View style={styles.contactInfo}>
                  <Text style={styles.contactName}>{selectedContact.name}</Text>
                  <Text style={styles.accountNumber}>{selectedContact.accountNumber}</Text>
                </View>
                <TouchableOpacity onPress={() => setSelectedContact(null)}>
                  <Text style={styles.changeButton}>Change</Text>
                </TouchableOpacity>
              </View>
            </View>
          )}

          {/* Amount Input */}
          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>Amount</Text>
            <View style={styles.amountInputContainer}>
              <Text style={styles.currencySymbol}>Rp</Text>
              <FormInput
                placeholder="0"
                value={amount}
                onChangeText={(text) => {
                  // Filter hanya angka
                  const filteredText = text.replace(/[^0-9]/g, '');
                  setAmount(filteredText);
                }}
                keyboardType="numeric"
                icon="💰"
                isAmount={true}
                textAlign="right"
              />
            </View>
          </View>

          {/* Note Input */}
          <FormInput
            label="Note (Optional)"
            placeholder="What's this for?"
            value={note}
            onChangeText={setNote}
            icon="📝"
          />

          {/* Continue Button */}
          <Button
            title="Continue"
            onPress={handleContinue}
            disabled={!selectedContact || !amount || isLoading}
            loading={isLoading}
            style={{ marginTop: 30 }}
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
    marginBottom: 20,
  },
  sectionTitle: {
    ...FONTS.bold,
    fontSize: SIZES.medium,
    color: COLORS.text.primary,
    marginBottom: 16,
  },
  contactsList: {
    paddingBottom: 10,
  },
  contactItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: SIZES.radius,
    marginBottom: 8,
  },
  selectedContactItem: {
    borderColor: COLORS.primary,
    backgroundColor: 'rgba(76, 175, 80, 0.05)',
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
  contactInfo: {
    flex: 1,
  },
  contactName: {
    ...FONTS.medium,
    fontSize: SIZES.medium,
    color: COLORS.text.primary,
    marginBottom: 4,
  },
  accountNumber: {
    ...FONTS.regular,
    fontSize: SIZES.small,
    color: COLORS.text.secondary,
  },
  selectedContactContainer: {
    marginBottom: 20,
  },
  selectedContactLabel: {
    ...FONTS.medium,
    fontSize: SIZES.medium,
    color: COLORS.text.primary,
    marginBottom: 8,
  },
  selectedContactContent: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    backgroundColor: 'rgba(76, 175, 80, 0.05)',
    borderWidth: 1,
    borderColor: COLORS.primary,
    borderRadius: SIZES.radius,
  },
  changeButton: {
    ...FONTS.medium,
    fontSize: SIZES.font,
    color: COLORS.primary,
  },
  inputContainer: {
    marginBottom: 20,
  },
  inputLabel: {
    ...FONTS.medium,
    fontSize: SIZES.medium,
    color: COLORS.text.primary,
    marginBottom: 8,
  },
  amountInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  currencySymbol: {
    ...FONTS.bold,
    fontSize: SIZES.medium,
    color: COLORS.text.primary,
    marginRight: 8,
  },
});

export default TransferScreen;