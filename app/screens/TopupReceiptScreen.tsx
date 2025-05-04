// app/topup-receipt.tsx
import React, { useCallback } from 'react';
import { View, Text, TouchableOpacity, SafeAreaView, ScrollView, BackHandler } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { StatusBar } from 'expo-status-bar';
import { useFocusEffect } from '@react-navigation/native';

export default function TopupReceiptScreen() {
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
  const params = useLocalSearchParams();
  
  // Get current date and time for the receipt
  const now = new Date();
  const formattedDate = `${now.getDate()} ${getMonthName(now.getMonth())} ${now.getFullYear()}, ${formatTime(now)}`;
  
  // Get params or use defaults
  const amount = params.amount ? String(params.amount) : '0';
  const walletName = params.walletName ? String(params.walletName) : 'My Wallet';
  const walletNumber = params.walletNumber ? String(params.walletNumber) : '0000000000';
  const methodName = params.methodName ? String(params.methodName) : 'Unknown';
  const transactionId = params.transactionId ? String(params.transactionId) : 'TOP' + Date.now();
  
  // Format amount to currency
  const formattedAmount = parseInt(amount, 10).toLocaleString('id-ID');
  
  const handleClose = () => {
    // Navigate back to home
    router.push('/home');
  };
  
  return (
    <SafeAreaView className="flex-1 bg-white">
      <StatusBar style="dark" />
      
      {/* Header */}
      <View className="bg-primary pt-14 pb-4 px-4 flex-row justify-between items-center">
        <TouchableOpacity onPress={handleClose}>
          <Ionicons name="close" size={28} color="white" />
        </TouchableOpacity>
        <Text className="text-white text-2xl font-bold">WALLED</Text>
        <View style={{ width: 28 }} />
      </View>
      
      <ScrollView className="flex-1">
        <View className="items-center mt-10">
          {/* Success Icon */}
          <View className="w-20 h-20 rounded-full bg-[#3E9E8F] items-center justify-center mb-4">
            <Ionicons name="checkmark" size={50} color="white" />
          </View>
          
          {/* Success Text */}
          <Text className="text-[#3E9E8F] text-3xl font-bold mb-6">Success</Text>
          
          {/* Date and Time */}
          <Text className="text-gray-600 mb-4">{formattedDate}</Text>
          
          {/* Transaction ID */}
          <Text className="text-gray-600 mb-4">ID: {transactionId}</Text>
          
          {/* Amount */}
          <View className="flex-row items-center mb-8">
            <Text className="text-gray-800 text-lg font-semibold">Rp</Text>
            <Text className="text-gray-800 text-5xl font-bold">{formattedAmount}</Text>
          </View>
          
          {/* Wallet Info */}
          <View className="w-full px-6 mb-4">
            <Text className="text-gray-600 mb-2">Wallet</Text>
            <View className="flex-row items-center">
              <View className="w-12 h-12 rounded-full bg-[#3E9E8F] items-center justify-center mr-3">
                <Text className="text-white font-bold text-lg">W</Text>
              </View>
              <View>
                <Text className="text-gray-800 font-bold">{walletName}</Text>
                <Text className="text-gray-600">WALLED - {walletNumber}</Text>
              </View>
            </View>
          </View>
          
          {/* Payment Method */}
          <View className="w-full px-6 mb-10">
            <Text className="text-gray-600 mb-2">Payment Method</Text>
            <Text className="text-gray-800 font-bold">{methodName}</Text>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

// Helper functions for date formatting
function getMonthName(monthIndex: number): string {
  const months = [
    'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
    'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Des'
  ];
  return months[monthIndex];
}

function formatTime(date: Date): string {
  const hours = date.getHours().toString().padStart(2, '0');
  const minutes = date.getMinutes().toString().padStart(2, '0');
  return `${hours}:${minutes}`;
}