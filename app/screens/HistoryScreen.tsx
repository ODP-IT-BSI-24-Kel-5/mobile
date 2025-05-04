// app/history.tsx
import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  SafeAreaView, 
  ScrollView, 
  TouchableOpacity, 
  ActivityIndicator,
  Image,
  Alert,
  Modal,
  FlatList
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons, FontAwesome5 } from '@expo/vector-icons';
import { StatusBar } from 'expo-status-bar';
import AsyncStorage from '@react-native-async-storage/async-storage';
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

// Define wallet interface
interface Wallet {
  id: string;
  name: string;
  balance: number;
  currency: string;
  number: string;
  isMain: boolean;
}

// Interface untuk filter kategori
interface CategoryFilter {
  id: number;
  name: string;
}

export default function HistoryScreen() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [wallets, setWallets] = useState<Wallet[]>([]);
  const [selectedWallet, setSelectedWallet] = useState<Wallet | null>(null);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [userToken, setUserToken] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [showWalletModal, setShowWalletModal] = useState(false);
  
  // State untuk expanded transaction details
  const [expandedTransactions, setExpandedTransactions] = useState<Record<string, boolean>>({});
  
  // State untuk filter
  const [showFilterModal, setShowFilterModal] = useState(false);
  const [categories, setCategories] = useState<CategoryFilter[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<CategoryFilter | null>(null);
  const [originalTransactions, setOriginalTransactions] = useState<Transaction[]>([]);
  const [selectedMonth, setSelectedMonth] = useState<number | null>(null);
  const [selectedYear, setSelectedYear] = useState<number>(new Date().getFullYear());
  const [isFilterActive, setIsFilterActive] = useState(false);

  // State untuk membantu filter bulan
  const monthLabels = [
    "January", "February", "March", "April", "May", "June", 
    "July", "August", "September", "October", "November", "Desember"
  ];

  // Fetch user data on component mount
  useEffect(() => {
    checkAuth();
  }, []);

  // Fetch wallets when token is available
  useEffect(() => {
    if (userToken) {
      fetchWallets();
      fetchCategories();
    }
  }, [userToken]);

  // Fetch transactions when selected wallet changes
  useEffect(() => {
    if (userToken && selectedWallet?.number) {
      setPage(1);
      setTransactions([]);
      fetchTransactions(selectedWallet.number, 1);
    }
  }, [selectedWallet, userToken]);

  // Check if user is authenticated
  const checkAuth = async () => {
    try {
      const token = await AsyncStorage.getItem('userToken');
      if (!token) {
        router.replace('/welcome');
        return;
      }
      setUserToken(token);
    } catch (error) {
      console.error('Error checking auth:', error);
      router.replace('/welcome');
    }
  };

  // Fetch all wallets from API
  const fetchWallets = async () => {
    try {
      setLoading(true);
      
      const response = await fetch('https://kelompok3.serverku.org/api/v1/users/wallets', {
        headers: {
          'Authorization': `Bearer ${userToken}`,
          'Content-Type': 'application/json'
        }
      });
      
      const data = await response.json();
      
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
        
        setWallets(mappedWallets);
        
        // Select the main wallet by default
        const mainWallet = mappedWallets.find((w: Wallet) => w.isMain === true);
        if (mainWallet) {
          setSelectedWallet(mainWallet);
        } else if (mappedWallets.length > 0) {
          // If no main wallet, select the first one
          setSelectedWallet(mappedWallets[0]);
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

  // Tambahkan fungsi untuk mengambil kategori dari API
  const fetchCategories = async () => {
    try {
      const token = await AsyncStorage.getItem('userToken');
      if (!token) return;

      const response = await fetch('https://kelompok3.serverku.org/api/v1/users/transactions/categories', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      const data = await response.json();
      
      if (data.status === 'success' && data.transaction_categories) {
        // Cari kategori "Expenses" (Pengeluaran) untuk mendapatkan sub-kategorinya
        const expensesCategory = data.transaction_categories.find(
          (cat: any) => cat.name === 'Expenses'
        );
        
        if (expensesCategory && expensesCategory.sub_categories) {
          // Map sub-kategori ke format CategoryFilter
          const mappedCategories = expensesCategory.sub_categories.map((subCat: any) => ({
            id: subCat.id,
            name: subCat.name
          }));
          
          setCategories(mappedCategories);
        }
      }
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  // Fetch transactions for a specific wallet
  const fetchTransactions = async (walletNumber: string, pageNum: number) => {
    try {
      if (pageNum === 1) {
        setLoading(true);
      } else {
        setLoadingMore(true);
      }
      
      console.log(`Fetching transactions for wallet: ${walletNumber}, page: ${pageNum}`);
      
      const response = await fetch(`https://kelompok3.serverku.org/api/v1/users/transactions/${walletNumber}?page=${pageNum}&size=20`, {
        headers: {
          'Authorization': `Bearer ${userToken}`,
          'Content-Type': 'application/json'
        }
      });
      
      const data = await response.json();
      
      if (data.data) {
        // Filter transaksi hanya untuk wallet yang dipilih
        const filteredTransactions = data.data.filter((transaction: Transaction) => 
          transaction.wallet === walletNumber
        );
        
        console.log(`Received ${data.data.length} transactions, filtered to ${filteredTransactions.length} for wallet ${walletNumber}`);
        
        if (pageNum === 1) {
          setTransactions(filteredTransactions);
          setOriginalTransactions(filteredTransactions); // Simpan juga di originalTransactions
          setIsFilterActive(false); // Reset filter saat load data baru
          setSelectedCategory(null);
          setSelectedMonth(null);
        } else {
          setTransactions(prev => [...prev, ...filteredTransactions]);
          setOriginalTransactions(prev => [...prev, ...filteredTransactions]); // Simpan juga di originalTransactions
        }
        
        // Check if there's more data to load
        setHasMore(data.data.length === 20); // Jika ada tepat 20 transaksi, kemungkinan ada halaman berikutnya
        setPage(pageNum);
      } else {
        console.log('No transaction data received');
        if (pageNum === 1) {
          setTransactions([]);
          setOriginalTransactions([]);
        }
        setHasMore(false);
      }
    } catch (error) {
      console.error('Error fetching transactions:', error);
      Alert.alert('Error', 'Failed to fetch transactions. Please try again.');
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  };

  // Load more transactions
  const loadMoreTransactions = () => {
    if (hasMore && !loadingMore && selectedWallet?.number && !isFilterActive) {
      fetchTransactions(selectedWallet.number, page + 1);
    }
  };

  // Format currency
  const formatCurrency = (value: number) => {
    return value.toLocaleString('id-ID');
  };

  // Format date
  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear();
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    
    return `${day}/${month}/${year} ${hours}:${minutes}`;
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
  
    // Toggle transaction details expansion
    const toggleTransactionDetails = (transactionId: string) => {
      setExpandedTransactions(prev => ({
        ...prev,
        [transactionId]: !prev[transactionId]
      }));
    };
  
    // Select a wallet
    const handleSelectWallet = (wallet: Wallet) => {
      setSelectedWallet(wallet);
      setShowWalletModal(false);
    };
  
    // Apply filters to transactions
    const applyFilters = () => {
      // Start with original transactions
      let filtered = [...originalTransactions];
      
      // Filter by category if selected
      if (selectedCategory) {
        filtered = filtered.filter(transaction => {
          // Periksa jika category adalah ID (dalam bentuk string) atau nama kategori
          if (!transaction.category) return false;
          
          if (!isNaN(Number(transaction.category))) {
            // Jika category adalah ID (string)
            return Number(transaction.category) === selectedCategory.id;
          } else {
            // Jika category adalah nama
            return transaction.category === selectedCategory.name;
          }
        });
      }
      
      // Filter by month if selected
      if (selectedMonth !== null) {
        filtered = filtered.filter(transaction => {
          const transactionDate = new Date(transaction.created_at);
          return transactionDate.getMonth() === selectedMonth && 
                 transactionDate.getFullYear() === selectedYear;
        });
      }
      
      // Set filtered transactions and update filter status
      setTransactions(filtered);
      setIsFilterActive(!!selectedCategory || selectedMonth !== null);
      setShowFilterModal(false);
    };
  
    // Reset filters
    const resetFilters = () => {
      setSelectedCategory(null);
      setSelectedMonth(null);
      setSelectedYear(new Date().getFullYear());
      setTransactions(originalTransactions);
      setIsFilterActive(false);
      setShowFilterModal(false);
    };
  
    // Render item for FlatList
    const renderItem = ({ item: transaction }: { item: Transaction }) => {
      const { bgColor } = getTransactionIconAndColor(transaction);
      const isExpanded = expandedTransactions[transaction.id] || false;
      
      return (
        <View className="bg-white rounded-xl p-4 mb-3 shadow-sm border border-gray-100">
          {/* Header Transaksi - dapat diklik untuk membuka/menutup detail */}
          <TouchableOpacity 
            onPress={() => toggleTransactionDetails(transaction.id)}
            className="flex-row items-center"
          >
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
              <View className="flex-row justify-between mt-1">
                <Text className="text-gray-500 text-xs">
                  {`Via: ${transaction.wallet_name || `Wallet ${transaction.wallet.slice(-4)}`}`}
                </Text>
                <Text className="text-gray-500 text-xs">
                  {formatDate(transaction.created_at)}
                </Text>
              </View>
            </View>
            <View>
              <Text 
                className={`font-bold ${
                  transaction.amount >= 0 ? 'text-[#4CAF50]' : 'text-[#F44336]'
                }`}
              >
                {`${transaction.amount >= 0 ? '+' : '-'}Rp${formatCurrency(Math.abs(transaction.amount))}`}
              </Text>
              <View className="items-end mt-1">
                <Ionicons 
                  name={isExpanded ? "chevron-up" : "chevron-down"} 
                  size={16} 
                  color="#757575" 
                />
              </View>
            </View>
          </TouchableOpacity>
          
          {/* Detail Tambahan Transaksi - Hanya ditampilkan jika expanded */}
          {isExpanded && (
            <View className="mt-3 pt-3 border-t border-gray-100">
              {/* Transaction Number */}
              <View className="flex-row mb-1">
                <Text className="text-gray-600 text-xs font-medium w-28">Transaction ID:</Text>
                <Text className="text-gray-600 text-xs flex-1">{transaction.transaction_number}</Text>
              </View>
              
              {/* Wallet Number */}
              <View className="flex-row mb-1">
                <Text className="text-gray-600 text-xs font-medium w-28">Wallet Number:</Text>
                <Text className="text-gray-600 text-xs flex-1">
                  {`${transaction.wallet.slice(0, 4)}...${transaction.wallet.slice(-4)}`}
                </Text>
              </View>
              
              {/* Transaction Type */}
              <View className="flex-row mb-1">
                <Text className="text-gray-600 text-xs font-medium w-28">Type:</Text>
                <Text className="text-gray-600 text-xs flex-1">{transaction.type}</Text>
              </View>
              
              {/* Associate Wallet (if not null) */}
              {transaction.associate_wallet && (
                <View className="flex-row mb-1">
                  <Text className="text-gray-600 text-xs font-medium w-28">Associate Wallet:</Text>
                  <Text className="text-gray-600 text-xs flex-1">
                    {`${transaction.associate_wallet.slice(0, 4)}...${transaction.associate_wallet.slice(-4)}`}
                  </Text>
                </View>
              )}
              
              {/* Associate Name (if not null) */}
              {transaction.associate_name && (
                <View className="flex-row mb-1">
                  <Text className="text-gray-600 text-xs font-medium w-28">Associate Name:</Text>
                  <Text className="text-gray-600 text-xs flex-1">{transaction.associate_name}</Text>
                </View>
              )}
              
              {/* Description (if not null) */}
              {transaction.description && (
                <View className="flex-row mb-1">
                  <Text className="text-gray-600 text-xs font-medium w-28">Description:</Text>
                  <Text className="text-gray-600 text-xs flex-1">{transaction.description}</Text>
                </View>
              )}
              
              {/* Category (if not null) */}
              {transaction.category && (
                <View className="flex-row mb-1">
                  <Text className="text-gray-600 text-xs font-medium w-28">Category:</Text>
                  <Text className="text-gray-600 text-xs flex-1">{transaction.category}</Text>
                </View>
              )}
              
              {/* Notes (if not null) */}
              {transaction.notes && (
                <View className="flex-row">
                  <Text className="text-gray-600 text-xs font-medium w-28">Notes:</Text>
                  <Text className="text-gray-600 text-xs flex-1">{transaction.notes}</Text>
                </View>
              )}
              
              {/* Receipt Image (if available) */}
              {transaction.image_receipt && (
                <TouchableOpacity 
                  className="mt-2 py-2 bg-[#E3F2FD] rounded-lg items-center"
                  onPress={() => {
                    // Tambahkan navigasi ke tampilan gambar atau buka browser
                    // router.push({
                    //   pathname: '/receipt-viewer',
                    //   params: { url: transaction.image_receipt }
                    // });
                    Alert.alert('Receipt Image', 'View receipt at: ' + transaction.image_receipt);
                  }}
                >
                  <Text className="text-[#0288D1] font-medium">View Receipt</Text>
                </TouchableOpacity>
              )}
            </View>
          )}
        </View>
      );
    };
  
    // Render footer for FlatList
    const renderFooter = () => {
      if (!loadingMore) return null;
      
      return (
        <View className="py-4 items-center">
          <ActivityIndicator size="small" color="#3E9E8F" />
          <Text className="text-gray-500 mt-2">Loading more...</Text>
        </View>
      );
    };
  
    return (
      <SafeAreaView className="flex-1 bg-white">
        <StatusBar style="light" />
        
        {/* Header Section */}
        <View className="bg-primary pt-12 pb-4 px-4">
          <View className="flex-row justify-between items-center">
            <TouchableOpacity onPress={() => router.back()}>
              <Ionicons name="arrow-back" size={24} color="white" />
            </TouchableOpacity>
            <Text className="text-white text-xl font-bold">Transaction History</Text>
            <View style={{ width: 24 }}></View> {/* Empty View for spacing */}
          </View>
        </View>
        
        {/* Wallet Selector */}
        <TouchableOpacity 
          className="mx-4 my-3 p-4 bg-white rounded-xl shadow-sm border border-gray-200 flex-row justify-between items-center"
          onPress={() => setShowWalletModal(true)}
        >
          <View className="flex-row items-center">
            <View className="w-10 h-10 rounded-full bg-[#2E8B57]/20 items-center justify-center mr-3">
              <Ionicons name="wallet-outline" size={20} color="#2E8B57" />
            </View>
            <View>
              <Text className="text-gray-500 text-xs">Selected Wallet</Text>
              <Text className="text-gray-800 font-medium">{selectedWallet?.name || 'Select Wallet'}</Text>
            </View>
          </View>
          <Ionicons name="chevron-down" size={20} color="#757575" />
        </TouchableOpacity>
        
        {/* Filter Controls */}
        <View className="flex-row mx-4 mb-2">
          <TouchableOpacity 
            className={`flex-1 mr-2 p-3 rounded-xl shadow-sm flex-row items-center justify-center ${isFilterActive ? 'bg-[#3E9E8F]' : 'bg-white border border-gray-200'}`}
            onPress={() => setShowFilterModal(true)}
          >
            <Ionicons 
              name="filter" 
              size={18} 
              color={isFilterActive ? 'white' : '#757575'} 
            />
            <Text className={`ml-2 font-medium ${isFilterActive ? 'text-white' : 'text-gray-800'}`}>
              {isFilterActive ? 'Filter Aktif' : 'Filter'}
            </Text>
          </TouchableOpacity>
          
          {isFilterActive && (
            <TouchableOpacity 
              className="flex-1 ml-2 p-3 bg-white rounded-xl shadow-sm border border-gray-200 flex-row items-center justify-center"
              onPress={resetFilters}
            >
              <Ionicons name="close-circle-outline" size={18} color="#F44336" />
              <Text className="ml-2 font-medium text-[#F44336]">Reset</Text>
            </TouchableOpacity>
          )}
        </View>
        
        {/* Active Filter Indicators */}
        {isFilterActive && (
          <View className="mx-4 mb-3 p-2 bg-[#3E9E8F]/10 rounded-lg">
            <View className="flex-row flex-wrap items-center">
              <Text className="text-[#3E9E8F] text-xs font-medium mr-2">Filter:</Text>
              
              {/* Indikator kategori */}
              {selectedCategory && (
                <View className="bg-[#3E9E8F] rounded-full px-2 py-1 mr-2 mb-1 flex-row items-center">
                  <Text className="text-white text-xs">{selectedCategory.name}</Text>
                  <TouchableOpacity
                    className="ml-1"
                    onPress={() => {
                      setSelectedCategory(null);
                      applyFilters();
                    }}
                  >
                    <Ionicons name="close-circle" size={14} color="white" />
                  </TouchableOpacity>
                </View>
              )}
              
              {/* Indikator bulan */}
              {selectedMonth !== null && (
                <View className="bg-[#3E9E8F] rounded-full px-2 py-1 mr-2 mb-1 flex-row items-center">
                  <Text className="text-white text-xs">{monthLabels[selectedMonth]} {selectedYear}</Text>
                  <TouchableOpacity
                    className="ml-1"
                    onPress={() => {
                      setSelectedMonth(null);
                      applyFilters();
                    }}
                  >
                    <Ionicons name="close-circle" size={14} color="white" />
                  </TouchableOpacity>
                </View>
              )}
            </View>
            
            {/* Tampilkan jumlah transaksi yang difilter */}
            <Text className="text-gray-500 text-xs mt-1">
              Menampilkan {transactions.length} dari {originalTransactions.length} transaksi
            </Text>
          </View>
        )}
        
        {loading ? (
          <View className="flex-1 justify-center items-center">
            <ActivityIndicator size="large" color="#3E9E8F" />
            <Text className="mt-4 text-gray-600">Loading transactions...</Text>
          </View>
        ) : (
          <FlatList
            data={transactions}
            renderItem={renderItem}
            keyExtractor={item => item.id}
            contentContainerStyle={{ padding: 16 }}
            onEndReached={loadMoreTransactions}
            onEndReachedThreshold={0.5}
            ListFooterComponent={renderFooter}
            ListEmptyComponent={
              <View className="bg-white rounded-xl p-8 items-center justify-center">
                <Ionicons name="document-text-outline" size={64} color="#AEB5BB" />
                <Text className="text-gray-500 mt-4 text-center">
                  No transactions found
                </Text>
              </View>
            }
          />
        )}
        
        {/* Wallet Selection Modal */}
        <Modal
          visible={showWalletModal}
          transparent={true}
          animationType="fade"
          onRequestClose={() => setShowWalletModal(false)}
        >
          <View className="flex-1 bg-black/50 justify-center items-center p-4">
            <View className="bg-white rounded-xl w-full max-w-md p-4">
              <View className="flex-row justify-between items-center mb-4">
                <Text className="text-lg font-bold">Select Wallet</Text>
                <TouchableOpacity onPress={() => setShowWalletModal(false)}>
                  <Ionicons name="close" size={24} color="#757575" />
                </TouchableOpacity>
              </View>
              
              <ScrollView className="max-h-60">
                {wallets.map((wallet) => (
                  <TouchableOpacity 
                    key={wallet.id}
                    className="flex-row items-center p-3 border-b border-gray-100"
                    onPress={() => handleSelectWallet(wallet)}
                  >
                    <View className="w-10 h-10 rounded-full bg-[#2E8B57]/20 items-center justify-center mr-3">
                      <Ionicons name="wallet-outline" size={20} color="#2E8B57" />
                    </View>
                    <View className="flex-1">
                      <Text className="text-gray-800 font-medium">{wallet.name}</Text>
                      <Text className="text-gray-500 text-xs">
                        {`Balance: Rp${formatCurrency(wallet.balance)}`}
                      </Text>
                    </View>
                    {selectedWallet?.number === wallet.number && (
                      <Ionicons name="checkmark-circle" size={24} color="#3E9E8F" />
                    )}
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>
          </View>
        </Modal>
        
        {/* Filter Modal */}
        <Modal
          visible={showFilterModal}
          transparent={true}
          animationType="fade"
          onRequestClose={() => setShowFilterModal(false)}
        >
          <View className="flex-1 bg-black/50 justify-center items-center p-4">
            <View className="bg-white rounded-xl w-full max-w-md p-4">
              <View className="flex-row justify-between items-center mb-4">
                <Text className="text-lg font-bold">Transaction Filter</Text>
                <TouchableOpacity onPress={() => setShowFilterModal(false)}>
                  <Ionicons name="close" size={24} color="#757575" />
                </TouchableOpacity>
              </View>
              
              {/* Filter by Category */}
              <View className="mb-4">
                <Text className="text-gray-800 font-medium mb-2">Category</Text>
                <ScrollView 
                  horizontal 
                  showsHorizontalScrollIndicator={false}
                  className="mb-2"
                >
                  <TouchableOpacity
                    className={`mr-2 px-4 py-2 rounded-full border ${selectedCategory === null ? 'bg-[#3E9E8F] border-[#3E9E8F]' : 'bg-white border-gray-300'}`}
                    onPress={() => setSelectedCategory(null)}
                  >
                    <Text className={selectedCategory === null ? 'text-white' : 'text-gray-800'}>
                      All
                    </Text>
                  </TouchableOpacity>
                  
                  {categories.map((category) => (
                    <TouchableOpacity
                      key={category.id}
                      className={`mr-2 px-4 py-2 rounded-full border ${
                        selectedCategory?.id === category.id 
                          ? 'bg-[#3E9E8F] border-[#3E9E8F]' 
                          : 'bg-white border-gray-300'
                      }`}
                      onPress={() => setSelectedCategory(category)}
                    >
                      <Text className={
                        selectedCategory?.id === category.id 
                          ? 'text-white' 
                          : 'text-gray-800'
                      }>
                        {category.name}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </ScrollView>
              </View>
              
              {/* Filter by Month */}
              <View className="mb-4">
                <Text className="text-gray-800 font-medium mb-2">Month</Text>
                
                {/* Year selector */}
                <View className="flex-row justify-between items-center mb-2">
                  <TouchableOpacity
                    onPress={() => setSelectedYear(selectedYear - 1)}
                  >
                    <Ionicons name="chevron-back" size={24} color="#757575" />
                  </TouchableOpacity>
                  <Text className="text-gray-800 font-medium">{selectedYear}</Text>
                  <TouchableOpacity
                    onPress={() => setSelectedYear(selectedYear + 1)}
                  >
                    <Ionicons name="chevron-forward" size={24} color="#757575" />
                  </TouchableOpacity>
                </View>
                
                {/* Month grid */}
                <View className="flex-row flex-wrap">
                  <TouchableOpacity
                    className={`w-1/4 p-2 ${selectedMonth === null ? 'bg-[#3E9E8F]/10' : ''}`}
                    onPress={() => setSelectedMonth(null)}
                  >
                    <View className={`p-2 rounded-lg items-center ${
                      selectedMonth === null ? 'bg-[#3E9E8F]' : 'bg-gray-100'
                    }`}>
                      <Text className={selectedMonth === null ? 'text-white' : 'text-gray-800'}>
                        All
                      </Text>
                    </View>
                  </TouchableOpacity>
                  
                  {monthLabels.map((month, index) => (
                    <TouchableOpacity
                      key={index}
                      className={`w-1/4 p-2 ${selectedMonth === index ? 'bg-[#3E9E8F]/10' : ''}`}
                      onPress={() => setSelectedMonth(index)}
                    >
                      <View className={`p-2 rounded-lg items-center ${
                        selectedMonth === index ? 'bg-[#3E9E8F]' : 'bg-gray-100'
                      }`}>
                        <Text className={selectedMonth === index ? 'text-white' : 'text-gray-800'}>
                          {month.substring(0, 3)}
                        </Text>
                      </View>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>
              
              {/* Action Buttons */}
              <View className="flex-row mt-2">
                <TouchableOpacity
                  className="flex-1 p-3 bg-gray-100 rounded-xl mr-2"
                  onPress={resetFilters}
                >
                  <Text className="text-center font-medium text-gray-800">Reset</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  className="flex-1 p-3 bg-[#3E9E8F] rounded-xl ml-2"
                  onPress={applyFilters}
                >
                  <Text className="text-center font-medium text-white">Apply</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>
      </SafeAreaView>
    );
}