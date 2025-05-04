// app/transfer-same-app.tsx
import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, SafeAreaView, ScrollView, Alert, ActivityIndicator, Modal } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons, FontAwesome5 } from '@expo/vector-icons';
import { StatusBar } from 'expo-status-bar';
import TransferConfirmationModal from '../components/TransferConfirmationModal';
import WalletSelectionModal, { Wallet } from '../components/WalletSelectionModal';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Define category interface
interface Category {
  id: number;
  name: string;
  icon: string | null;
  sub_categories: SubCategory[];
  category: boolean;
  sub_category: boolean;
}

interface SubCategory {
  id: number;
  name: string;
  icon: string | null;
  sub_categories: any[];
  category: boolean;
  sub_category: boolean;
}

export default function TransferSameAppScreen() {
  const router = useRouter();
  const [recipient, setRecipient] = useState('');
  const [recipientName, setRecipientName] = useState('');
  const [amount, setAmount] = useState('0');
  const [message, setMessage] = useState('');
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [loading, setLoading] = useState(false);
  const [wallets, setWallets] = useState<Wallet[]>([]);
  const [selectedWallet, setSelectedWallet] = useState<Wallet | null>(null);
  const [userToken, setUserToken] = useState<string | null>(null);
  const [showWalletDropdown, setShowWalletDropdown] = useState(false);
  
  // States for category selection
  const [categories, setCategories] = useState<Category[]>([]);
  const [expensesCategory, setExpensesCategory] = useState<Category | null>(null);
  const [subCategories, setSubCategories] = useState<SubCategory[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<SubCategory | null>(null);
  const [showCategoryModal, setShowCategoryModal] = useState(false);
  const [loadingCategories, setLoadingCategories] = useState(false);

  // State Validasi Nomor Wallet
  const [recipientValid, setRecipientValid] = useState(false);
  const [validatingRecipient, setValidatingRecipient] = useState(false);
  const [recipientError, setRecipientError] = useState('');
  
  // Fetch user wallets and categories on screen load
  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        const token = await AsyncStorage.getItem('userToken');
        if (!token) {
          Alert.alert('Error', 'User session expired. Please login again.');
          router.replace('/welcome');
          return;
        }
        
        setUserToken(token);
        setLoading(true);
        
        // Fetch wallets
        await fetchWallets(token);
        
        // Fetch categories
        await fetchCategories(token);
        
      } catch (error) {
        console.error('Error fetching initial data:', error);
        Alert.alert('Error', 'Network error. Please try again.');
      } finally {
        setLoading(false);
      }
    };
    
    fetchInitialData();
  }, []);
  
  // Extract Expenses category and subcategories when categories are loaded
  useEffect(() => {
    if (categories.length > 0) {
      // Find the Expenses category
      const expenses = categories.find(cat => cat.name === 'Expenses');
      if (expenses) {
        setExpensesCategory(expenses);
        setSubCategories(expenses.sub_categories);
      }
    }
  }, [categories]);
  
  // Fetch user wallets
  const fetchWallets = async (token: string) => {
    try {
      const response = await fetch('https://kelompok3.serverku.org/api/v1/users/wallets', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      const data = await response.json();
      
      if (data.status === 'success' && data.wallets) {
        setWallets(data.wallets);
        
        // Select main wallet by default
        const mainWallet = data.wallets.find((w: Wallet) => w.is_main === true);
        if (mainWallet) {
          setSelectedWallet(mainWallet);
        } else if (data.wallets.length > 0) {
          setSelectedWallet(data.wallets[0]);
        }
      } else {
        Alert.alert('Error', 'Failed to fetch wallets');
      }
    } catch (error) {
      console.error('Error fetching wallets:', error);
      throw error;
    }
  };
  
  // Fetch transaction categories
  const fetchCategories = async (token: string) => {
    try {
      setLoadingCategories(true);
      
      const response = await fetch('https://kelompok3.serverku.org/api/v1/users/transactions/categories', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      const data = await response.json();
      
      if (data.status === 'success' && data.transaction_categories) {
        setCategories(data.transaction_categories);
      } else {
        console.warn('Failed to fetch categories');
      }
    } catch (error) {
      console.error('Error fetching categories:', error);
      throw error;
    } finally {
      setLoadingCategories(false);
    }
  };
  
  // Handle back button press
  const handleBackPress = () => {
    router.back();
  };
  
  // Handle continue button press
  const handleContinue = () => {
    // Validate input before proceeding
    if (!recipient) {
      Alert.alert('Error', 'Please enter recipient wallet number');
      return;
    }
    
    if (!recipientValid) {
      // If wallet hasn't been validated yet, validate it now
      if (!validatingRecipient && recipient.length >= 5) {
        validateWalletNumber(recipient).then(() => {
          // After validation, check if valid and continue if it is
          if (recipientValid) {
            proceedToNextStep();
          } else {
            Alert.alert('Error', recipientError || 'Invalid wallet number');
          }
        });
      } else {
        Alert.alert('Error', recipientError || 'Invalid wallet number');
      }
      return;
    }
    
    proceedToNextStep();
  };
  
  // Helper function to handle the remaining validation and proceed to confirmation
  const proceedToNextStep = () => {
    if (amount === '0' || !amount) {
      Alert.alert('Error', 'Please enter transfer amount');
      return;
    }
    
    if (!selectedWallet) {
      Alert.alert('Error', 'Please select source wallet');
      return;
    }
    
    if (!selectedCategory) {
      Alert.alert('Error', 'Please select transfer category');
      return;
    }
    
    const amountNum = parseInt(amount, 10);
    if (amountNum > selectedWallet.balance) {
      Alert.alert('Error', 'Insufficient balance for this transfer');
      return;
    }
    
    // Show confirmation modal
    setShowConfirmation(true);
  };

  // Function to validate wallet number
  const validateWalletNumber = async (walletNumber: string) => {
    if (!walletNumber || walletNumber.length < 5) {
      setRecipientValid(false);
      setRecipientError('');
      return;
    }
    
    try {
      setValidatingRecipient(true);
      setRecipientError('');
      
      const response = await fetch(`https://kelompok3.serverku.org/api/v1/users/wallets/${walletNumber}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${userToken}`,
          'Content-Type': 'application/json'
        }
      });
      
      const data = await response.json();
      
      if (data.status === 'success') {
        // If API returns success, wallet exists
        setRecipientValid(true);
        
        // Set recipient name from API data if available
        if (data.wallet && data.wallet.name) {
          setRecipientName(data.wallet.name);
        } else {
          // Fallback to showing last 4 digits
          setRecipientName('Wallet ' + walletNumber.substring(walletNumber.length - 4));
        }
      } else {
        // API returned failed status
        setRecipientValid(false);
        setRecipientError(data.error || 'Wallet not found');
      }
    } catch (error) {
      console.error('Error validating wallet:', error);
      setRecipientValid(false);
      setRecipientError('Unable to validate wallet');
    } finally {
      setValidatingRecipient(false);
    }
  };

  // Add debounced wallet validation
  useEffect(() => {
    // Clear validation state when recipient changes
    setRecipientValid(false);
    setRecipientError('');
    
    // Don't validate empty inputs
    if (!recipient || recipient.length < 5 || !userToken) {
      return;
    }
    
    // Setup debounce timer
    const timer = setTimeout(() => {
      validateWalletNumber(recipient);
    }, 600); // 600ms debounce time
    
    return () => clearTimeout(timer);
  }, [recipient, userToken]);

  // Handle confirm transfer (from confirmation modal)
  const handleConfirmTransfer = () => {
    // Close confirmation modal
    setShowConfirmation(false);
    
    // Navigate to PIN verification screen
    if (selectedWallet && selectedCategory) {
      router.push({
        pathname: '/transfer-pin',
        params: {
          amount: amount,
          recipientName: recipientName,
          recipientPhone: recipient,
          senderName: selectedWallet.name,
          senderAccount: selectedWallet.number,
          acquirerAccount: recipient,
          categoryId: selectedCategory.id.toString()
        }
      });
    }
  };

  // Handle cancel transfer (from confirmation modal)
  const handleCancelTransfer = () => {
    setShowConfirmation(false);
  };
  
  // Format currency
  const formatCurrency = (value: number) => {
    return value.toLocaleString('id-ID');
  };
  
  // Toggle wallet dropdown
  const toggleWalletDropdown = () => {
    setShowWalletDropdown(!showWalletDropdown);
  };
  
  // Select wallet from dropdown
  const selectWallet = (wallet: Wallet) => {
    setSelectedWallet(wallet);
    setShowWalletDropdown(false);
  };
  
  // Toggle category modal
  const toggleCategoryModal = () => {
    setShowCategoryModal(!showCategoryModal);
  };
  
  // Select category and close modal
  const selectCategory = (category: SubCategory) => {
    setSelectedCategory(category);
    setShowCategoryModal(false);
  };
  
  // Get icon for category
  const getCategoryIcon = (categoryName: string) => {
    const lowerCaseName = categoryName.toLowerCase();
    
    if (lowerCaseName.includes('rent')) return 'home';
    if (lowerCaseName.includes('utilities')) return 'flash';
    if (lowerCaseName.includes('groceries')) return 'cart';
    if (lowerCaseName.includes('transport')) return 'car';
    if (lowerCaseName.includes('health')) return 'medkit';
    if (lowerCaseName.includes('education')) return 'school';
    if (lowerCaseName.includes('entertainment')) return 'film';
    if (lowerCaseName.includes('shopping')) return 'shirt';
    if (lowerCaseName.includes('food')) return 'restaurant';
    if (lowerCaseName.includes('travel')) return 'airplane';
    
    return 'cash';
  };
  
  // Get color for category
  const getCategoryColor = (categoryName: string) => {
    const lowerCaseName = categoryName.toLowerCase();
    
    if (lowerCaseName.includes('rent')) return '#FF9800';
    if (lowerCaseName.includes('utilities')) return '#00BCD4';
    if (lowerCaseName.includes('groceries')) return '#8BC34A';
    if (lowerCaseName.includes('transport')) return '#03A9F4';
    if (lowerCaseName.includes('health')) return '#F44336';
    if (lowerCaseName.includes('education')) return '#9C27B0';
    if (lowerCaseName.includes('entertainment')) return '#673AB7';
    if (lowerCaseName.includes('shopping')) return '#E91E63';
    if (lowerCaseName.includes('food')) return '#FF5722';
    if (lowerCaseName.includes('travel')) return '#607D8B';
    
    return '#3E9E8F';
  };
  
  // Get background color for category icon
  const getCategoryBgColor = (categoryName: string) => {
    const color = getCategoryColor(categoryName);
    return `${color}20`; // 20% opacity
  };
  
  return (
    <SafeAreaView className="flex-1 bg-white rounded-t-2xl">
      <StatusBar style="light" />
      
      {/* Header */}
      <View className="bg-primary pt-10 pb-4">
        <View className="flex-row items-center px-4 mt-4">
          <TouchableOpacity onPress={handleBackPress}>
            <Ionicons name="arrow-back" size={24} color="white" />
          </TouchableOpacity>
          <Text className="text-white text-xl font-bold ml-8">TRANSFER</Text>
        </View>
      </View>
      
      {loading ? (
        <View className="flex-1 justify-center items-center">
          <ActivityIndicator size="large" color="#3E9E8F" />
          <Text className="mt-4 text-gray-600">Loading wallets...</Text>
        </View>
      ) : (
        <ScrollView className="flex-1 px-6">
          {/* Recipient Field */}
          <View className="mt-6">
            <Text className="text-gray-600 mb-2">Beneficiary Wallet</Text>
            <View className="flex-row items-center border-b border-gray-300">
              <TextInput
                className={`pb-2 text-gray-800 text-lg flex-1 ${recipientError ? 'text-red-500' : ''}`}
                placeholder="Enter wallet number"
                placeholderTextColor="#9e9e9e"
                value={recipient}
                onChangeText={setRecipient}
                keyboardType="numeric"
              />
              {validatingRecipient && (
                <ActivityIndicator size="small" color="#2E8B57" style={{ marginLeft: 8 }} />
              )}
              {!validatingRecipient && recipient.length >= 5 && (
                recipientValid ? (
                  <Ionicons name="checkmark-circle" size={24} color="#4CAF50" style={{ marginLeft: 8 }} />
                ) : (
                  <Ionicons name="close-circle" size={24} color="#F44336" style={{ marginLeft: 8 }} />
                )
              )}
            </View>
            {recipientError ? (
              <Text className="text-red-500 text-sm mt-1">{recipientError}</Text>
            ) : recipientValid && recipient.length > 0 ? (
              <Text className="text-green-600 text-sm mt-1">Valid wallet: {recipientName}</Text>
            ) : null}
          </View>
          
          {/* Source of Funds */}
          <View className="mt-8">
            <Text className="text-gray-600 mb-2">Source of Funds</Text>
            <TouchableOpacity 
              className="bg-white border border-[#A6A6A6] rounded-lg p-4"
              onPress={toggleWalletDropdown}
              disabled={wallets.length <= 1}
            >
              <View className="flex-row items-center">
              <View className="w-10 h-10 rounded-full bg-[#2E8B57]/20 items-center justify-center mr-3">
                <Ionicons name="wallet-outline" size={20} color="#2E8B57" />
              </View>
                <View className="ml-3 flex-1">
                  <Text className="text-gray-800 font-semibold">
                    {selectedWallet ? selectedWallet.name : 'No wallet available'}
                  </Text>
                  <Text className="text-gray-600">
                    {selectedWallet ? `Balance Rp${formatCurrency(selectedWallet.balance)}` : 'Rp0'}
                  </Text>
                </View>
                {wallets.length > 1 && (
                  <Ionicons name="chevron-down" size={20} color="#757575" />
                )}
              </View>
            </TouchableOpacity>
          </View>
          
          {/* Transfer Category */}
          <View className="mt-8">
            <Text className="text-gray-600 mb-2">Transfer Category</Text>
            <TouchableOpacity 
              className="bg-white border border-[#A6A6A6] rounded-lg p-4"
              onPress={toggleCategoryModal}
              disabled={loadingCategories || subCategories.length === 0}
            >
              <View className="flex-row items-center">
                {selectedCategory ? (
                  <>
                    <View 
                      className="w-8 h-8 rounded-full items-center justify-center"
                      style={{ backgroundColor: getCategoryBgColor(selectedCategory.name) }}
                    >
                      <Ionicons 
                        name={getCategoryIcon(selectedCategory.name) as any} 
                        size={18} 
                        color={getCategoryColor(selectedCategory.name)} 
                      />
                    </View>
                    <Text className="text-gray-800 font-semibold ml-3">{selectedCategory.name}</Text>
                  </>
                ) : (
                  <>
                    <View className="w-8 h-8 rounded-full bg-gray-200 items-center justify-center">
                      <Ionicons name="list" size={18} color="#757575" />
                    </View>
                    <Text className="text-gray-600 ml-3">
                      {loadingCategories ? 'Loading categories...' : 'Select Category'}
                    </Text>
                  </>
                )}
                <Ionicons name="chevron-down" size={20} color="#757575" className="ml-auto" />
              </View>
            </TouchableOpacity>
          </View>
          
          {/* Transfer Amount */}
          <View className="mt-6 bg-[#F2F2F2] p-4 rounded-xl">
            <Text className="text-gray-600">Transfer Amount</Text>
            <View className="flex-row items-center mt-1">
              <Text className="text-[#3E9E69] text-3xl font-bold">Rp</Text>
              <TextInput
                className="text-[#3E9E69] text-3xl font-bold ml-1 flex-1"
                keyboardType="numeric"
                value={amount}
                onChangeText={setAmount}
                onFocus={() => {
                  if (amount === '0') setAmount('');
                }}
                onBlur={() => {
                  if (amount === '') setAmount('0');
                }}
              />
            </View>
          </View>
          
          {/* Message Field */}
          <View className="mt-6">
            <View className="flex-row justify-between items-center">
              <Text className="text-gray-600">Description (optional)</Text>
              <Text className="text-gray-500 text-sm">{message.length}/25</Text>
            </View>
            <TextInput
              className="mt-1 pb-2 text-gray-800 border-b border-gray-300"
              placeholder="Add description"
              placeholderTextColor="#9e9e9e"
              value={message}
              onChangeText={(text) => {
                // Limit message to 25 characters
                if (text.length <= 25) {
                  setMessage(text);
                }
              }}
              maxLength={25}
            />
          </View>
        </ScrollView>
      )}
      
      {/* Continue Button */}
      <View className="p-4">
        <TouchableOpacity 
          className={`bg-[#2E8B57] py-4 px-6 rounded-full items-center mb-2 ${
            loading || !amount || !selectedCategory || parseInt(amount, 10) < 10000 || !recipientValid || validatingRecipient ? 'opacity-50' : ''
          }`}
          onPress={handleContinue}
          disabled={loading || !amount || !selectedCategory || parseInt(amount, 10) < 10000 || !recipientValid || validatingRecipient}
        >
          <Text className="text-white font-semibold text-lg">CONTINUE</Text>
        </TouchableOpacity>
      </View>

      {/* Confirmation Modal */}
      <TransferConfirmationModal
        visible={showConfirmation}
        onClose={handleCancelTransfer}
        onConfirm={handleConfirmTransfer}
        recipientName={recipientName}
        recipientPhone={recipient}
        amount={amount}
      />
      
      {/* Wallet Selection Modal */}
      <WalletSelectionModal
        visible={showWalletDropdown}
        onClose={() => setShowWalletDropdown(false)}
        wallets={wallets}
        selectedWallet={selectedWallet}
        onSelectWallet={selectWallet}
      />
      
      {/* Category Selection Modal */}
      <Modal
        visible={showCategoryModal}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setShowCategoryModal(false)}
      >
        <View className="flex-1 bg-black/50 justify-center items-center p-4">
          <View className="bg-white rounded-xl w-full max-w-md p-4">
            <View className="flex-row justify-between items-center mb-4">
              <Text className="text-lg font-bold">Select Category</Text>
              <TouchableOpacity onPress={() => setShowCategoryModal(false)}>
                <Ionicons name="close" size={24} color="#757575" />
              </TouchableOpacity>
            </View>
            
            <ScrollView className="max-h-60">
              {subCategories.map((category) => (
                <TouchableOpacity 
                  key={category.id}
                  className="flex-row items-center p-3 border-b border-gray-100"
                  onPress={() => selectCategory(category)}
                >
                  <View 
                    className="w-10 h-10 rounded-full items-center justify-center mr-4"
                    style={{ backgroundColor: getCategoryBgColor(category.name) }}
                  >
                    <Ionicons 
                      name={getCategoryIcon(category.name) as any} 
                      size={18} 
                      color={getCategoryColor(category.name)} 
                    />
                  </View>
                  <View className="flex-1">
                    <Text className="text-gray-800 font-medium">{category.name}</Text>
                  </View>
                  {selectedCategory?.id === category.id && (
                    <Ionicons name="checkmark-circle" size={24} color="#3E9E8F" />
                  )}
                </TouchableOpacity>
              ))}
              
              {subCategories.length === 0 && !loadingCategories && (
                <View className="py-4 items-center">
                  <Text className="text-gray-500">No categories available</Text>
                </View>
              )}
              
              {loadingCategories && (
                <View className="py-4 items-center">
                  <ActivityIndicator size="small" color="#3E9E8F" />
                  <Text className="mt-2 text-gray-500">Loading categories...</Text>
                </View>
              )}
            </ScrollView>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}