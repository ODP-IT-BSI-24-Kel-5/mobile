// app/transfer-receipt.tsx
import React, { useEffect, useCallback } from 'react';
import { View, Text, TouchableOpacity, SafeAreaView, ScrollView, BackHandler } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { StatusBar } from 'expo-status-bar';
import { useFocusEffect } from '@react-navigation/native';

export default function TransferReceiptScreen() {
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
  const senderName = params.senderName || 'User';
  const senderPhone = params.senderPhone || '0000000000';
  const recipientName = params.recipientName || 'Recipient';
  const recipientPhone = params.recipientPhone || '0000000000';
  const transactionId = params.transactionId || 'TR' + Date.now();
  
  // Format amount to currency
  const formattedAmount = parseInt(amount, 10).toLocaleString('id-ID');
  
  // Reset transfer stack when navigating to home
  useEffect(() => {
    return () => {
      // This will run when component unmounts
    };
  }, []);
  
  const handleClose = () => {
    // Navigate back to home and reset navigation stack
    router.push('/home');
  };
  
  const handleAddToFavorite = () => {
    // In a real app, this would save the recipient to favorites
    console.log('Add to favorites');
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
        <TouchableOpacity onPress={handleAddToFavorite}>
          <Ionicons name="star-outline" size={28} color="white" />
        </TouchableOpacity>
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
          
          {/* Sender Info */}
          <View className="w-full px-6 mb-4">
            <Text className="text-gray-600 mb-2">From</Text>
            <View className="flex-row items-center">
              <View className="w-12 h-12 rounded-full bg-gray-200 items-center justify-center mr-3">
                <Ionicons name="person" size={24} color="#757575" />
              </View>
              <View>
                <Text className="text-gray-800 font-bold">{senderName}</Text>
                <Text className="text-gray-600">WALLED - {senderPhone}</Text>
              </View>
            </View>
          </View>
          
          {/* Recipient Info */}
          <View className="w-full px-6 mb-10">
            <Text className="text-gray-600 mb-2">Beneficiary</Text>
            <View className="flex-row items-center">
              <View className="w-12 h-12 rounded-full bg-gray-200 items-center justify-center mr-3">
                <Ionicons name="person" size={24} color="#757575" />
              </View>
              <View>
                <Text className="text-gray-800 font-bold">{recipientName}</Text>
                <Text className="text-gray-600">WALLED - {recipientPhone}</Text>
              </View>
            </View>
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