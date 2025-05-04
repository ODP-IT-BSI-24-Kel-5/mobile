import React, { useState } from 'react';
import { View, Text, TouchableOpacity, SafeAreaView, ScrollView, Image } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons, FontAwesome5 } from '@expo/vector-icons';
import { StatusBar } from 'expo-status-bar';

export default function TransferScreen() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('new'); // 'new' or 'favorite'

  // Sample last transaction data
  const lastTransactions = [
    {
      id: '1',
      name: 'Sdr M FACHREZA A SUKMA',
      bank: 'BANK BNI',
      accountNumber: '1173922929',
    }
  ];

  // Handle back button press
  const handleBackPress = () => {
    router.back();
  };

  // Handle tab change
  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
  };

  // Handle transfer option selection
  const handleTransferOption = (option: string) => {
    if (option === 'same-app') {
      router.push('/transfer-same-app');
    } else if (option === 'bank') {
      // Navigate to bank transfer
      console.log('Navigate to bank transfer');
      // router.push('/transfer-bank');
    } else {
      // Handle last transaction selection
      console.log(`Selected last transaction: ${option}`);
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-gray-100">
      <StatusBar style="light" />
      
      {/* Header */}
      <View className="bg-primary pt-10 pb-0">
        <View className="flex-row items-center px-4 mt-4">
          <TouchableOpacity onPress={handleBackPress}>
            <Ionicons name="arrow-back" size={24} color="white" />
          </TouchableOpacity>
          <Text className="text-white text-xl font-bold ml-8">TRANSFER</Text>
        </View>
        
        {/* Tabs */}
        <View className="flex-row mt-4">
          <TouchableOpacity 
            className={`flex-1 py-3 ${activeTab === 'new' ? 'border-b-4 border-white' : 'opacity-70'}`} 
            onPress={() => handleTabChange('new')}
          >
            <Text className="text-white text-center">Penerima Baru</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            className={`flex-1 py-3 ${activeTab === 'favorite' ? 'border-b-4 border-white' : 'opacity-70'}`}
            onPress={() => handleTabChange('favorite')}
          >
            <Text className="text-white text-center">Favorit</Text>
          </TouchableOpacity>
        </View>
      </View>
      
      {/* Transfer Options */}
      <ScrollView className="flex-1 p-4">
        {activeTab === 'new' ? (
          <View className="space-y-4">
            {/* Transfer to Same App */}
            <TouchableOpacity 
              className="bg-white p-4 rounded-lg flex-row items-center justify-between"
              onPress={() => handleTransferOption('same-app')}
            >
              <View className="flex-row items-center">
                <View className="w-10 h-10 rounded-lg bg-teal-100 items-center justify-center">
                  <Ionicons name="person" size={24} color="#009688" />
                </View>
                <Text className="ml-3 text-lg font-medium text-gray-800">Ke Sesama Walled</Text>
              </View>
              <Ionicons name="chevron-forward" size={20} color="#9e9e9e" />
            </TouchableOpacity>
            
            {/* Transfer to Bank */}
            <TouchableOpacity 
              className="bg-white p-4 rounded-lg flex-row items-center justify-between mt-2"
              onPress={() => handleTransferOption('bank')}
            >
              <View className="flex-row items-center">
                <View className="w-10 h-10 rounded-lg bg-blue-100 items-center justify-center">
                  <FontAwesome5 name="university" size={20} color="#1976D2" />
                </View>
                <Text className="ml-3 text-lg font-medium text-gray-800">Ke Rekening Bank</Text>
              </View>
              <Ionicons name="chevron-forward" size={20} color="#9e9e9e" />
            </TouchableOpacity>
          </View>
        ) : (
          <View className="bg-white p-4 rounded-lg">
            <Text className="text-gray-500 text-center">Belum ada daftar favorit</Text>
          </View>
        )}
        
        {/* Recent Transactions */}
        <View className="mt-8">
          <Text className="text-lg font-bold text-gray-800 mb-4">Transaksi Terakhir</Text>
          
          {lastTransactions.map(transaction => (
            <TouchableOpacity 
              key={transaction.id}
              className="bg-white p-4 rounded-lg flex-row items-center mb-2"
              onPress={() => handleTransferOption(`last-${transaction.id}`)}
            >
              <View className="w-12 h-12 rounded-full bg-gray-200 items-center justify-center">
                <FontAwesome5 name="university" size={20} color="#757575" />
              </View>
              <View className="ml-4 flex-1">
                <Text className="text-lg font-semibold text-gray-800">{transaction.name}</Text>
                <Text className="text-gray-500">{transaction.bank} - {transaction.accountNumber}</Text>
              </View>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}