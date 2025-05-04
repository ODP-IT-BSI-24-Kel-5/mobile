// app/home.tsx - Updated with WalletCarousel and Improved Financial Summary
import React, { useState, useEffect, useCallback } from 'react';
import { 
  View, 
  Text, 
  SafeAreaView, 
  ScrollView, 
  Image, 
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  BackHandler
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { useRouter } from 'expo-router';
import { Ionicons, FontAwesome5 } from '@expo/vector-icons';
import { StatusBar } from 'expo-status-bar';
import AsyncStorage from '@react-native-async-storage/async-storage';
import FinancialSummary from '../components/FinancialSummary';
import WalletCarousel, { Wallet } from '../components/WalletCarousel';
import AddWalletModal from '../components/AddWalletModal';
import CategoryStyling from '../utils/category-styling';

// Get styling functions
const { getCategoryIcon, getCategoryColor, getCategoryIconType, getCategoryBgColor } = CategoryStyling;

// Define transaction interface
interface Transaction {
  id: string;
  transaction_number: string;
  amount: number;
  created_at: string;
  wallet: string;
  wallet_name: string;
  associate_wallet: string | null;
  associate_name: string | null;
  type: string; // "TOPUP" | "TRANSFER" | etc.
  notes: string | null;
  description: string;
  category: string | null;
  method: string | null;
  image_receipt: string | null;
}

// Define financial summary interface
interface FinancialSummaryData {
  income: number;
  expense: number;
}

export default function HomeScreen() {
  useFocusEffect(
    useCallback(() => {
      const onBackPress = () => {
        return true;
      };
      BackHandler.addEventListener('hardwareBackPress', onBackPress);

      return () =>
        BackHandler.removeEventListener('hardwareBackPress', onBackPress);
    }, [])
  );
  
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [financialSummary, setFinancialSummary] = useState<FinancialSummaryData>({
    income: 0,
    expense: 0
  });
  const [wallets, setWallets] = useState<Wallet[]>([]);
  const [selectedWallet, setSelectedWallet] = useState<Wallet | null>(null);
  const [selectedFinancialWallet, setSelectedFinancialWallet] = useState<Wallet | null>(null);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [recentTransactions, setRecentTransactions] = useState<Transaction[]>([]);
  const [userToken, setUserToken] = useState<string | null>(null);
  const [userName, setUserName] = useState('User');
  const [userAvatar, setUserAvatar] = useState('');
  const [loadingActivities, setLoadingActivities] = useState(false);
  const [showAddWalletModal, setShowAddWalletModal] = useState(false);
  const [addingWallet, setAddingWallet] = useState(false);

  // Tambahkan useEffect ini untuk mencatat perubahan selectedFinancialWallet untuk debugging
  useEffect(() => {
    if (selectedFinancialWallet) {
      console.log('Financial wallet state changed:', {
        name: selectedFinancialWallet.name,
        number: selectedFinancialWallet.number,
        id: selectedFinancialWallet.id,
        isMain: selectedFinancialWallet.isMain
      });
    }
  }, [selectedFinancialWallet]);

  // Fetch user data on component mount
  useEffect(() => {
    checkAuth();
  }, []);

  // Fetch wallets when token is available
  useEffect(() => {
    if (userToken) {
      fetchWallets();
    }
  }, [userToken]);

  // Fetch transactions when selected wallet changes
  useEffect(() => {
    if (userToken && selectedWallet && selectedWallet.number) {
      fetchTransactions(selectedWallet.number, userToken);
    }
  }, [selectedWallet, userToken]);

  // Disable this to prevent automatic update of financial wallet
  // Update financial wallet when normal wallet changes
  // useEffect(() => {
  //   if (selectedWallet) {
  //     setSelectedFinancialWallet(selectedWallet);
  //   }
  // }, [selectedWallet]);

  // Fetch financial summary when financial wallet changes
  useEffect(() => {
    if (userToken && selectedFinancialWallet) {
      const walletIdentifier = selectedFinancialWallet.number || selectedFinancialWallet.id;
      fetchFinancialSummary(walletIdentifier, userToken);
    }
  }, [selectedFinancialWallet, userToken]);

  // Set recent transactions when transactions change
  useEffect(() => {
    // Get the 3 most recent transactions
    const recent = [...transactions].sort((a, b) => {
      const dateA = new Date(a.created_at);
      const dateB = new Date(b.created_at);
      return dateB.getTime() - dateA.getTime();
    }).slice(0, 3);
    
    setRecentTransactions(recent);
  }, [transactions]);

  // Check if user is authenticated
  const checkAuth = async () => {
    try {
      const token = await AsyncStorage.getItem('userToken');
      if (!token) {
        router.replace('/welcome');
        return;
      }
      
      setUserToken(token);
      
      // Fetch user profile data
      try {
        const response = await fetch('https://kelompok3.serverku.org/api/v1/users/profile', {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });
        
        const data = await response.json();
        
        if (data.status === 'success' && data.users) {
          // Set user name from API response
          setUserName(data.users.full_name);
          
          // Save profile data to AsyncStorage for easy access elsewhere
          await AsyncStorage.setItem('userName', data.users.full_name);
          await AsyncStorage.setItem('userEmail', data.users.email);
          await AsyncStorage.setItem('userPhone', data.users.mobile_phone);
          
          if (data.users.image_url) {
            setUserAvatar(data.users.image_url);
            await AsyncStorage.setItem('userAvatar', data.users.image_url);
          }
        }
      } catch (profileError) {
        console.error('Error fetching profile:', profileError);
        
        // Fallback to AsyncStorage if profile fetch fails
        const name = await AsyncStorage.getItem('userName');
        if (name) {
          setUserName(name);
        }
        
        const avatar = await AsyncStorage.getItem('userAvatar');
        if (avatar) {
          setUserAvatar(avatar);
        }
      }
    } catch (error) {
      console.error('Error checking auth:', error);
      router.replace('/welcome');
    }
  };

  // Fetch all wallets from API
  const fetchWallets = async () => {
    try {
      console.log('Fetching all wallets...');
      setLoading(true);
      
      const response = await fetch('https://kelompok3.serverku.org/api/v1/users/wallets', {
        headers: {
          'Authorization': `Bearer ${userToken}`,
          'Content-Type': 'application/json'
        }
      });
      
      console.log('Wallets API status:', response.status);
      
      const data = await response.json();
      console.log('Wallets API response:', JSON.stringify(data));
      
      if (data.status === 'success' && data.wallets) {
        // Map API wallets to our wallet format
        const mappedWallets = data.wallets.map((wallet: any, index: number) => ({
          id: wallet.number || index.toString(),
          name: wallet.name,
          balance: wallet.balance,
          currency: 'IDR',
          number: wallet.number,
          isMain: wallet.is_main
        }));
        
        console.log('Mapped wallets from API:', mappedWallets);
        setWallets(mappedWallets);
        
        // Select the main wallet by default
        const mainWallet = mappedWallets.find((w: Wallet) => w.isMain === true);
        if (mainWallet) {
          setSelectedWallet(mainWallet);
          setSelectedFinancialWallet(mainWallet);
          
          console.log('Setting initial main wallet:', {
            name: mainWallet.name, 
            number: mainWallet.number,
            isMain: mainWallet.isMain
          });
          
          if (userToken && mainWallet.number) {
            // Fetch transactions for main wallet
            fetchTransactions(mainWallet.number, userToken);
            fetchFinancialSummary(mainWallet.number, userToken);
          }
        } else if (mappedWallets.length > 0) {
          // If no main wallet, select the first one
          setSelectedWallet(mappedWallets[0]);
          setSelectedFinancialWallet(mappedWallets[0]);
          
          console.log('No main wallet, using first wallet:', {
            name: mappedWallets[0].name, 
            number: mappedWallets[0].number
          });
          
          if (userToken && mappedWallets[0].number) {
            // Fetch transactions for first wallet
            fetchTransactions(mappedWallets[0].number, userToken);
            fetchFinancialSummary(mappedWallets[0].number, userToken);
          }
        }
      } else {
        console.log('No wallets data or API error');
      }
    } catch (error) {
      console.error('Error fetching wallets:', error);
      Alert.alert('Error', 'Failed to fetch wallets. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Fetch transactions for a specific wallet
  const fetchTransactions = async (walletNumber: string, token: string) => {
    try {
      setLoadingActivities(true);
      console.log(`Fetching transactions for wallet: ${walletNumber}`);
      const response = await fetch(`https://kelompok3.serverku.org/api/v1/users/transactions/${walletNumber}?page=1&size=10`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      console.log('Transactions API status:', response.status);
      
      const data = await response.json();
      console.log('Transactions API response length:', data.data ? data.data.length : 0);
      
      if (data.data) {
        // Display sample transaction for debugging
        if (data.data.length > 0) {
          console.log('Sample transaction:', data.data[0]);
        }
        
        setTransactions(data.data);
      } else {
        console.log('No transaction data received');
        setTransactions([]);
      }
    } catch (error) {
      console.error('Error fetching transactions:', error);
      Alert.alert('Error', 'Failed to fetch transactions. Please try again.');
    } finally {
      setLoadingActivities(false);
    }
  };

  // Fetch financial summary for a specific wallet
  const fetchFinancialSummary = async (walletIdentifier: string, token: string) => {
    try {
      console.log(`Fetching financial summary for wallet: ${walletIdentifier}`);
      
      // In a real app, you might want to fetch summary from a specific endpoint
      // For now, we'll use the transactions to calculate it
      const response = await fetch(`https://kelompok3.serverku.org/api/v1/users/transactions/${walletIdentifier}?page=1&size=50`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      const data = await response.json();
      
      if (data.data) {
        console.log(`Received ${data.data.length} transactions for financial summary calculation`);
        
        // Pastikan kita hanya menggunakan transaksi untuk wallet yang terpilih
        // PENTING: Log beberapa sampel transaksi untuk debug format data
        if (data.data.length > 0) {
          console.log('Sample transaction:', {
            wallet: data.data[0].wallet,
            amount: data.data[0].amount,
            type: data.data[0].type
          });
        }
        
        // Gunakan calculateFinancialSummary yang sudah diperbaiki
        calculateFinancialSummary(data.data);
      } else {
        console.log('No transaction data received for financial summary');
        setFinancialSummary({ income: 0, expense: 0 });
      }
    } catch (error) {
      console.error('Error fetching financial summary:', error);
      // Don't show alert here to prevent multiple alerts
      setFinancialSummary({ income: 0, expense: 0 });
    }
  };

  // Calculate financial summary from transactions
  const calculateFinancialSummary = (txns: Transaction[]) => {
    let totalIncome = 0;
    let totalExpense = 0;
    
    // Jika ada wallet yang dipilih, filter transaksi hanya untuk wallet tersebut
    if (selectedFinancialWallet && selectedFinancialWallet.number) {
      // Debugging untuk melihat wallet yang dipilih
      console.log(`Selected wallet for financial summary: ${selectedFinancialWallet.name} (${selectedFinancialWallet.number})`);
      
      // Filter transaksi hanya untuk wallet yang dipilih
      const filteredTxns = txns.filter(transaction => {
        const isWalletMatch = transaction.wallet === selectedFinancialWallet.number;
        
        // Log untuk debugging
        if (!isWalletMatch) {
          console.log(`Transaction wallet mismatch: ${transaction.wallet} vs ${selectedFinancialWallet.number}`);
        }
        
        return isWalletMatch;
      });
      
      console.log(`Calculating summary for ${filteredTxns.length} filtered transactions from wallet ${selectedFinancialWallet.name}`);
      
      // Hitung income dan expense dari transaksi yang difilter
      filteredTxns.forEach(transaction => {
        if (transaction.type === 'TOPUP' || 
            (transaction.type === 'TRANSFER' && transaction.description.includes('received'))) {
          totalIncome += transaction.amount;
        } else if (transaction.type === 'TRANSFER' && !transaction.description.includes('received')) {
          totalExpense += Math.abs(transaction.amount);
        }
      });
    } else {
      // Jika tidak ada wallet yang dipilih, tampilkan warning
      console.warn('No wallet selected for financial summary!');
      
      // Tetap hitung semua transaksi (fallback)
      txns.forEach(transaction => {
        if (transaction.type === 'TOPUP' || 
            (transaction.type === 'TRANSFER' && transaction.description.includes('received'))) {
          totalIncome += transaction.amount;
        } else if (transaction.type === 'TRANSFER' && !transaction.description.includes('received')) {
          totalExpense += Math.abs(transaction.amount);
        }
      });
    }
    
    console.log(`Calculated summary: Income=${totalIncome}, Expense=${totalExpense}`);
    
    setFinancialSummary({
      income: totalIncome,
      expense: totalExpense
    });
  };

  // Handle wallet selection from carousel
  const handleSelectWallet = (wallet: Wallet) => {
    setSelectedWallet(wallet);
    if (userToken && wallet.number) {
      fetchTransactions(wallet.number, userToken);
    }
  };

  // Handle financial wallet selection
  const handleSelectFinancialWallet = (wallet: Wallet) => {
    console.log('Financial wallet selection changed to:', wallet.name, wallet.number);
    setSelectedFinancialWallet(wallet);
    
    if (userToken) {
      // Gunakan wallet.number untuk API call
      const walletIdentifier = wallet.number || wallet.id;
      
      // Log untuk debugging
      console.log(`Using wallet identifier for API: ${walletIdentifier}`);
      
      fetchFinancialSummary(walletIdentifier, userToken);
    }
  };

  // Create a new wallet
  const handleAddWallet = async (walletName: string) => {
    try {
      setAddingWallet(true);
      
      if (!userToken) {
        Alert.alert('Error', 'User session expired. Please login again.');
        setShowAddWalletModal(false);
        router.replace('/welcome');
        return;
      }
      
      // API call to create a new wallet
      const response = await fetch('https://kelompok3.serverku.org/api/v1/users/wallets', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${userToken}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          name: walletName,
          is_main: wallets.length === 0 // Make it main wallet if it's the first one
        })
      });
      
      const data = await response.json();
      
      if (data.status === 'success') {
        // Close modal and refresh wallets list
        setShowAddWalletModal(false);
        await fetchWallets();
        Alert.alert('Success', 'Wallet created successfully!');
      } else {
        Alert.alert('Error', data.message || 'Failed to create wallet. Please try again.');
      }
    } catch (error) {
      console.error('Error creating wallet:', error);
      Alert.alert('Error', 'Network error. Please try again.');
    } finally {
      setAddingWallet(false);
    }
  };

  // Format currency
  const formatCurrency = (value: number) => {
    return value.toLocaleString('id-ID');
  };

  // Format relative time (e.g., "2 hours ago")
  const formatRelativeTime = (dateTimeStr: string) => {
    const now = new Date();
    const transactionDate = new Date(dateTimeStr);
    const diffInSeconds = Math.floor((now.getTime() - transactionDate.getTime()) / 1000);
    
    if (diffInSeconds < 60) {
      return 'Just now';
    } else if (diffInSeconds < 3600) {
      const minutes = Math.floor(diffInSeconds / 60);
      return `${minutes} ${minutes === 1 ? 'minute' : 'minutes'} ago`;
    } else if (diffInSeconds < 86400) {
      const hours = Math.floor(diffInSeconds / 3600);
      return `${hours} ${hours === 1 ? 'hour' : 'hours'} ago`;
    } else {
      const days = Math.floor(diffInSeconds / 86400);
      return `${days} ${days === 1 ? 'day' : 'days'} ago`;
    }
  };

  // Get transaction icon and color based on type and category
  const getTransactionIconAndColor = (transaction: Transaction) => {
    if (transaction.type === 'TOPUP') {
      return {
        icon: 'add-circle-outline',
        iconType: 'ionicons' as const,
        color: '#4CAF50',
        bgColor: '#E8F5E9'
      };
    } 
    
    if (transaction.type === 'TRANSFER') {
      if (transaction.description.includes('received')) {
        return {
          icon: 'arrow-down-outline',
          iconType: 'ionicons' as const,
          color: '#2196F3',
          bgColor: '#E3F2FD'
        };
      } else {
        // For outgoing transfers, use category styling if available
        if (transaction.category) {
          // Try to get category styling - first check if it's a number (ID reference)
          if (!isNaN(Number(transaction.category))) {
            // Default transfer out styling
            return {
              icon: 'arrow-up-outline',
              iconType: 'ionicons' as const,
              color: '#F44336',
              bgColor: '#FFEBEE'
            };
          } else {
            // It's a category name string
            return {
              icon: getCategoryIcon(transaction.category),
              iconType: getCategoryIconType(transaction.category),
              color: getCategoryColor(transaction.category),
              bgColor: getCategoryBgColor(transaction.category)
            };
          }
        } else {
          // Default transfer out styling
          return {
            icon: 'arrow-up-outline',
            iconType: 'ionicons' as const,
            color: '#F44336',
            bgColor: '#FFEBEE'
          };
        }
      }
    }
    
    // Default for unknown transaction types
    return {
      icon: 'ellipsis-horizontal-outline',
      iconType: 'ionicons' as const,
      color: '#757575',
      bgColor: '#F5F5F5'
    };
  };

  // Render the transaction icon
  const renderTransactionIcon = (transaction: Transaction) => {
    const { icon, iconType, color } = getTransactionIconAndColor(transaction);
    
    if (iconType === 'ionicons') {
      return <Ionicons name={icon as any} size={20} color={color} />;
    } else {
      return <FontAwesome5 name={icon} size={18} color={color} />;
    }
  };

  // Get transaction title based on type and description
  const getTransactionTitle = (transaction: Transaction) => {
    if (transaction.type === 'TOPUP') {
      return `Top up via ${transaction.method || 'bank transfer'}`;
    } 
    
    if (transaction.type === 'TRANSFER') {
      if (transaction.description.includes('received')) {
        return `Received from ${transaction.associate_name || 'someone'}`;
      } else {
        // For outgoing transfers with a category
        if (transaction.category && isNaN(Number(transaction.category))) {
          return transaction.category; // Use category name as title
        } else {
          return `Sent to ${transaction.associate_name || 'someone'}`;
        }
      }
    }
    
    return transaction.description || 'Transaction';
  };

  // Handle the "View All" button click for recent activities
  const handleViewAllActivitiesFinancialSummary = () => {
    router.push('/financial-summary');
  };

  // Handle the "View All" button click for recent activities
  const handleViewAllActivitiesRecentActivities = () => {
    router.push('/history');
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      <StatusBar style="light" />
      
      {/* Header Section */}
      <View className="bg-primary pt-12 pb-4 px-4 rounded-b-3xl">
        <View className="flex-row justify-between items-center">
          <View>
            <Text className="text-white text-lg">Welcome back,</Text>
            <Text className="text-white text-xl font-bold">{userName}</Text>
          </View>
          
          {/* User Avatar */}
          <TouchableOpacity onPress={() => router.push('./profile')}>
            {userAvatar ? (
              <Image
                source={{ uri: userAvatar }}
                className="w-12 h-12 rounded-full"
              />
            ) : (
              <View className="w-12 h-12 rounded-full bg-white/20 items-center justify-center">
                <Ionicons name="person" size={24} color="white" />
              </View>
            )}
          </TouchableOpacity>
        </View>
      </View>
      
      {loading ? (
        <View className="flex-1 justify-center items-center">
          <ActivityIndicator size="large" color="#3E9E8F" />
          <Text className="mt-4 text-gray-600">Loading your data...</Text>
        </View>
      ) : (
        <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
          {/* Wallet Carousel */}
          <View className="bg-white pb-2">
            <WalletCarousel 
              wallets={wallets} 
              onAddWallet={() => setShowAddWalletModal(true)} 
              onSelectWallet={handleSelectWallet}
            />
          </View>
          
          {/* Quick Action Buttons */}
          <View className="flex-row justify-between px-4 py-5 mb-2">
            <TouchableOpacity 
              className="items-center"
              onPress={() => router.push('/topup')}
            >
              <View className="w-12 h-12 rounded-full bg-[#E3F2FD] items-center justify-center mb-1">
                <Ionicons name="add-outline" size={24} color="#2196F3" />
              </View>
              <Text className="text-gray-800">Top Up</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              className="items-center"
              onPress={() => router.push('/transfer-same-app')}
            >
              <View className="w-12 h-12 rounded-full bg-[#E8F5E9] items-center justify-center mb-1">
                <Ionicons name="arrow-up-outline" size={24} color="#4CAF50" />
              </View>
              <Text className="text-gray-800">Transfer</Text>
            </TouchableOpacity>

            {/* <TouchableOpacity 
              className="items-center"
              onPress={() => router.push('/qrscan')}
            >
              <View className="w-12 h-12 rounded-full bg-[#F5F5F5] items-center justify-center mb-1">
                <Ionicons name="qr-code-outline" size={24} color="#757575" />
              </View>
              <Text className="text-gray-800">QRIS</Text>
            </TouchableOpacity> */}
            
            <TouchableOpacity 
              className="items-center"
              // onPress={() => router.push('/financial-summary')}
            >
              <View className="w-12 h-12 rounded-full bg-[#FFF8E1] items-center justify-center mb-1">
                <Ionicons name="wallet-outline" size={24} color="#FFC107" />
              </View>
              <Text className="text-gray-800">Pay</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              className="items-center"
              onPress={() => router.push('/history')}
            >
              <View className="w-12 h-12 rounded-full bg-[#E57373]/20 items-center justify-center mb-1">
                <Ionicons name="newspaper-outline" size={24} color="#E57373" />
              </View>
              <Text className="text-gray-800">History</Text>
            </TouchableOpacity>
          </View>
          
          {/* Financial Summary Section */}
          <View className="px-4 mb-5">
            <View className="flex-row justify-between items-center mb-3">
                <Text className="text-gray-800 text-xl font-bold">Financial Summary</Text>
                <TouchableOpacity onPress={handleViewAllActivitiesFinancialSummary}>
                  <Text className="text-[#3E9E8F] font-bold">View All</Text>
                </TouchableOpacity>
            </View>
            <FinancialSummary
              period={`This Month`}
              income={financialSummary.income}
              expense={financialSummary.expense}
              onViewDetails={() => router.push('/financial-summary')}
              wallets={wallets}
              selectedWallet={selectedFinancialWallet}
              onWalletSelect={handleSelectFinancialWallet}
            />
          </View>
          
          {/* Recent Activities Section */}
          <View className="px-4 mb-5">
            <View className="flex-row justify-between items-center mb-3">
              <Text className="text-gray-800 text-xl font-bold">Recent Activities</Text>
              <TouchableOpacity onPress={handleViewAllActivitiesRecentActivities}>
                <Text className="text-[#3E9E8F] font-bold">View All</Text>
              </TouchableOpacity>
            </View>
            
            {loadingActivities ? (
              <View className="py-6 flex items-center justify-center">
                <ActivityIndicator size="small" color="#3E9E8F" />
                <Text className="text-gray-500 mt-2">Loading activities...</Text>
              </View>
            ) : recentTransactions.length > 0 ? (
              recentTransactions.map((transaction) => {
                const { bgColor } = getTransactionIconAndColor(transaction);
                
                return (
                  <View key={transaction.id} className="bg-white rounded-xl p-4 mb-3 shadow-sm border border-gray-100">
                    <View className="flex-row items-center">
                      <View 
                        className="w-10 h-10 rounded-full items-center justify-center mr-3"
                        style={{ backgroundColor: bgColor }}
                      >
                        {renderTransactionIcon(transaction)}
                      </View>
                      <View className="flex-1">
                        <Text className="text-gray-800 font-medium">
                          {getTransactionTitle(transaction)}
                        </Text>
                        <Text className="text-gray-500 text-xs">
                          Wallet: {transaction.wallet || `Wallet ${transaction.wallet.slice(-4)}`}
                        </Text>
                      </View>
                      <Text 
                        className={`font-bold ${
                          transaction.amount >= 0 ? 'text-[#4CAF50]' : 'text-[#F44336]'
                        }`}
                      >
                        {transaction.amount >= 0 ? '+' : '-'}
                        Rp{formatCurrency(Math.abs(transaction.amount))}
                      </Text>
                    </View>
                  </View>
                );
              })
            ) : (
              <View className="bg-white rounded-xl p-6 flex items-center justify-center border border-gray-100">
                <Ionicons name="document-text-outline" size={48} color="#AEB5BB" />
                <Text className="text-gray-500 mt-3 text-center">No recent transactions</Text>
              </View>
            )}
          </View>
        </ScrollView>
      )}
      
      {/* Add Wallet Modal */}
      <AddWalletModal
        visible={showAddWalletModal}
        onClose={() => setShowAddWalletModal(false)}
        onAdd={handleAddWallet}
      />
    </SafeAreaView>
  );
}