// app/topup.tsx
import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, SafeAreaView, ScrollView, Alert, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons, FontAwesome5 } from '@expo/vector-icons';
import { StatusBar } from 'expo-status-bar';
import WalletSelectionModal, { Wallet } from '../components/WalletSelectionModal';
import TopupConfirmationModal from '../components/TopupConfirmationModal';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Define payment method interface
interface PaymentMethod {
  id: number;
  name: string;
  icon: string;
  iconType: 'ionicons' | 'fontawesome';
  iconColor: string;
  bgColor: string;
}

export default function TopupScreen() {
  const router = useRouter();
  const [amount, setAmount] = useState('0');
  const [loading, setLoading] = useState(false);
  const [wallets, setWallets] = useState<Wallet[]>([]);
  const [selectedWallet, setSelectedWallet] = useState<Wallet | null>(null);
  const [userToken, setUserToken] = useState<string | null>(null);
  const [showWalletDropdown, setShowWalletDropdown] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [selectedMethod, setSelectedMethod] = useState<PaymentMethod | null>(null);
  
  // Preset amounts
  const presetAmounts = [
    { label: 'Rp10.000', value: 10000 },
    { label: 'Rp20.000', value: 20000 },
    { label: 'Rp50.000', value: 50000 },
    { label: 'Rp100.000', value: 100000 },
    { label: 'Rp250.000', value: 250000 },
    { label: 'Rp500.000', value: 500000 }
  ];
  
  // Payment methods with custom icons and colors
  const paymentMethods: PaymentMethod[] = [
    { 
      id: 1, 
      name: 'Gopay', 
      icon: 'wallet', 
      iconType: 'ionicons', 
      iconColor: '#00ACEA', 
      bgColor: '#E6F7FF'
    },
    { 
      id: 2, 
      name: 'BCA', 
      icon: 'cash-outline', 
      iconType: 'ionicons', 
      iconColor: '#0066AE', 
      bgColor: '#E6F0FF'
    },
    { 
      id: 3, 
      name: 'BRI', 
      icon: 'credit-card', 
      iconType: 'fontawesome', 
      iconColor: '#0B2D87', 
      bgColor: '#CED5E7'
    },
    { 
      id: 4, 
      name: 'BSI', 
      icon: 'money-bill-wave', 
      iconType: 'fontawesome', 
      iconColor: '#00A39D', 
      bgColor: '#CCEDEB'
    },
    { 
      id: 5, 
      name: 'BNI', 
      icon: 'building', 
      iconType: 'fontawesome', 
      iconColor: '#FF6F00', 
      bgColor: '#FFF3E6'
    },
    { 
      id: 6, 
      name: 'Jago', 
      icon: 'piggy-bank', 
      iconType: 'fontawesome', 
      iconColor: '#F9A618', 
      bgColor: '#FEEDD1'
    },
    { 
      id: 7, 
      name: 'Bank DKI', 
      icon: 'landmark', 
      iconType: 'fontawesome', 
      iconColor: '#E41B23', 
      bgColor: '#FAD1D3'
    },
    { 
      id: 8, 
      name: 'OCBC', 
      icon: 'briefcase', 
      iconType: 'ionicons', 
      iconColor: '#D9214E', 
      bgColor: '#FFECF0'
    },
  ];
  
  // Fetch user wallets on screen load
  useEffect(() => {
    const fetchWallets = async () => {
      try {
        const token = await AsyncStorage.getItem('userToken');
        if (!token) {
          Alert.alert('Error', 'User session expired. Please login again.');
          router.replace('/welcome');
          return;
        }
        
        setUserToken(token);
        setLoading(true);
        
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
        Alert.alert('Error', 'Network error. Please try again.');
      } finally {
        setLoading(false);
      }
    };
    
    fetchWallets();
  }, []);
  
  // Handle back button press
  const handleBackPress = () => {
    router.back();
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
  
  // Set preset amount
  const setPresetAmount = (value: number) => {
    setAmount(value.toString());
  };
  
  // Select payment method
  const selectPaymentMethod = (method: PaymentMethod) => {
    setSelectedMethod(method);
  };
  
  // Render payment method icon
  const renderMethodIcon = (method: PaymentMethod) => {
    if (method.iconType === 'ionicons') {
      return (
        <Ionicons name={method.icon as any} size={24} color={method.iconColor} />
      );
    } else {
      return (
        <FontAwesome5 name={method.icon} size={20} color={method.iconColor} />
      );
    }
  };
  
  // Handle continue button press
  const handleContinue = () => {
    // Validate input before proceeding
    if (!selectedWallet) {
      Alert.alert('Error', 'Harap pilih wallet tujuan');
      return;
    }
    
    if (!amount || parseInt(amount, 10) <= 0) {
      Alert.alert('Error', 'Harap masukkan jumlah topup');
      return;
    }
    
    if (!selectedMethod) {
      Alert.alert('Error', 'Harap pilih metode pembayaran');
      return;
    }
    
    // Show confirmation modal
    setShowConfirmation(true);
  };
  
  // Handle confirm topup (from confirmation modal)
  const handleConfirmTopup = () => {
    // Close confirmation modal
    setShowConfirmation(false);
    
    // Navigate to PIN verification screen
    if (selectedWallet && selectedMethod) {
      router.push({
        pathname: '/topup-pin',
        params: {
          amount: amount,
          walletName: selectedWallet.name,
          walletNumber: selectedWallet.number,
          methodName: selectedMethod.name,
          methodId: selectedMethod.id.toString()
        }
      });
    }
  };
  
  // Handle cancel topup (from confirmation modal)
  const handleCancelTopup = () => {
    setShowConfirmation(false);
  };
  
  return (
    <SafeAreaView className="flex-1 bg-white">
      <StatusBar style="light" />
      
      {/* Header */}
      <View className="bg-primary pt-10 pb-4">
        <View className="flex-row items-center px-4 mt-4">
          <TouchableOpacity onPress={handleBackPress}>
            <Ionicons name="arrow-back" size={24} color="white" />
          </TouchableOpacity>
          <Text className="text-white text-xl font-bold ml-8">TOP UP</Text>
        </View>
      </View>
      
      {loading ? (
        <View className="flex-1 justify-center items-center">
          <ActivityIndicator size="large" color="#3E9E8F" />
          <Text className="mt-4 text-gray-600">Loading wallets...</Text>
        </View>
      ) : (
        <ScrollView className="flex-1 px-4 pt-6">
          {/* Destination Wallet */}
          <Text className="text-gray-800 font-medium mb-2">Beneficiary Wallet</Text>
          <TouchableOpacity 
            className="bg-white border border-[#A6A6A6] rounded-lg p-4 mb-4"
            onPress={toggleWalletDropdown}
            disabled={wallets.length <= 1}
          >
            <View className="flex-row items-center">
              <View className="w-8 h-8 rounded-full bg-[#2E8B57]/20 items-center justify-center mr-2">
                <Ionicons name="wallet-outline" size={16} color="#2E8B57" />
              </View>
              <View className="ml-3 flex-1">
                <Text className="text-gray-800 font-semibold text-lg">
                  {selectedWallet ? selectedWallet.name : 'No wallet available'}
                </Text>
                <Text className="text-gray-600 items-center">
                  Balance Rp{selectedWallet ? formatCurrency(selectedWallet.balance) : '0'}
                </Text>
              </View>
              {wallets.length > 1 && (
                <Ionicons name="chevron-down" size={24} color="#757575" />
              )}
            </View>
          </TouchableOpacity>
          
          {/* Topup Amount */}
          <View className="mb-4 bg-[#F2F2F2] p-4 rounded-xl">
            <Text className="text-gray-600">Top Up Amount</Text>
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
          
          {/* Preset Amounts - Row 1 */}
          <View className="flex-row justify-between mb-3">
            <TouchableOpacity
              className="border border-[#A6A6A6] rounded-lg py-3 w-[31%]"
              onPress={() => setPresetAmount(presetAmounts[0].value)}
            >
              <Text className="text-gray-800 text-center">{presetAmounts[0].label}</Text>
            </TouchableOpacity>
            <TouchableOpacity
              className="border border-[#A6A6A6] rounded-lg py-3 w-[31%]"
              onPress={() => setPresetAmount(presetAmounts[1].value)}
            >
              <Text className="text-gray-800 text-center">{presetAmounts[1].label}</Text>
            </TouchableOpacity>
            <TouchableOpacity
              className="border border-[#A6A6A6] rounded-lg py-3 w-[31%]"
              onPress={() => setPresetAmount(presetAmounts[2].value)}
            >
              <Text className="text-gray-800 text-center">{presetAmounts[2].label}</Text>
            </TouchableOpacity>
          </View>
          
          {/* Preset Amounts - Row 2 */}
          <View className="flex-row justify-between mb-3">
            <TouchableOpacity
              className="border border-[#A6A6A6] rounded-lg py-3 w-[31%]"
              onPress={() => setPresetAmount(presetAmounts[3].value)}
            >
              <Text className="text-gray-800 text-center">{presetAmounts[3].label}</Text>
            </TouchableOpacity>
            <TouchableOpacity
              className="border border-[#A6A6A6] rounded-lg py-3 w-[31%]"
              onPress={() => setPresetAmount(presetAmounts[4].value)}
            >
              <Text className="text-gray-800 text-center">{presetAmounts[4].label}</Text>
            </TouchableOpacity>
            <TouchableOpacity
              className="border border-[#A6A6A6] rounded-lg py-3 w-[31%]"
              onPress={() => setPresetAmount(presetAmounts[5].value)}
            >
              <Text className="text-gray-800 text-center">{presetAmounts[5].label}</Text>
            </TouchableOpacity>
          </View>
          
          {/* Payment Methods */}
          <Text className="text-gray-800 font-medium mt-4 mb-2">Payment Method</Text>
          <View className="flex-col mb-6">
            {paymentMethods.map((method) => (
              <TouchableOpacity
                key={method.id}
                className={`border border-[#A6A6A6] rounded-lg p-4 mb-2 flex-row items-center ${
                  selectedMethod?.id === method.id ? 'border-[#3E9E8F] border-2' : ''
                }`}
                onPress={() => selectPaymentMethod(method)}
              >
                <View 
                  className="w-12 h-12 rounded-full items-center justify-center mr-3"
                  style={{ backgroundColor: method.bgColor }}
                >
                  {renderMethodIcon(method)}
                </View>
                <Text className="text-gray-800 text-lg font-medium">{method.name}</Text>
                {selectedMethod?.id === method.id && (
                  <View className="ml-auto">
                    <Ionicons name="checkmark-circle" size={24} color="#3E9E8F" />
                  </View>
                )}
              </TouchableOpacity>
            ))}
          </View>
        </ScrollView>
      )}
      
      {/* Continue Button */}
      <View className="p-4">
        <TouchableOpacity 
          className={`bg-[#3E9E8F] py-4 rounded-full items-center ${
            loading || !amount || !selectedMethod || parseInt(amount, 10) < 10000 ? 'opacity-50' : ''
          }`}
          onPress={handleContinue}
          disabled={loading || !amount || !selectedMethod || parseInt(amount, 10) < 10000}
        >
          <Text className="text-white font-semibold text-lg">CONTINUE</Text>
        </TouchableOpacity>
      </View>
      
      {/* Wallet Selection Modal */}
      <WalletSelectionModal
        visible={showWalletDropdown}
        onClose={() => setShowWalletDropdown(false)}
        wallets={wallets}
        selectedWallet={selectedWallet}
        onSelectWallet={selectWallet}
      />
      
      {/* Topup Confirmation Modal */}
      <TopupConfirmationModal
        visible={showConfirmation}
        onClose={handleCancelTopup}
        onConfirm={handleConfirmTopup}
        walletName={selectedWallet?.name || ''}
        walletNumber={selectedWallet?.number || ''}
        amount={amount}
        methodName={selectedMethod?.name || ''}
      />
    </SafeAreaView>
  );
}