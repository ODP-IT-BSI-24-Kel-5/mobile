// app/transfer-pin.tsx
import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, SafeAreaView, ActivityIndicator, Alert, StyleSheet } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { StatusBar } from 'expo-status-bar';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function TransferPinScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  
  // Get params
  const amount = params.amount ? String(params.amount) : '0';
  const recipientName = params.recipientName as string;
  const recipientPhone = params.recipientPhone as string;
  const senderName = params.senderName as string;
  const senderAccount = params.senderAccount as string;
  const acquirerAccount = params.acquirerAccount as string;
  const categoryId = params.categoryId ? parseInt(params.categoryId as string, 10) : undefined;
  
  const [pin, setPin] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Format amount to currency
  const formattedAmount = parseInt(amount, 10).toLocaleString('id-ID');
  
  // Handle back button
  const handleBack = () => {
    router.back();
  };

  // Handle PIN input
  const handlePinInput = (digit: string) => {
    if (pin.length < 6) {
      const newPin = pin + digit;
      setPin(newPin);
      
      // Automatically verify when 6 digits entered
      if (newPin.length === 6) {
        processTransfer(newPin);
      }
    }
  };

  // Handle delete/backspace
  const handleDelete = () => {
    if (pin.length > 0) {
      setPin(pin.slice(0, -1));
    }
  };

  // Process transfer with API
  const processTransfer = async (inputPin: string) => {
    setLoading(true);
    setError('');
    
    try {
      // Get user token
      const token = await AsyncStorage.getItem('userToken');
      
      if (!token) {
        setError('User session expired. Please login again.');
        setLoading(false);
        return;
      }
      
      // Prepare request body
      const requestBody: {
        sender_account: string;
        acquirer_account: string;
        amount: number;
        pin: string;
        category?: number;
      } = {
        sender_account: senderAccount,
        acquirer_account: acquirerAccount,
        amount: parseInt(amount, 10),
        pin: inputPin
      };
      
      // Add category if available
      if (categoryId) {
        requestBody.category = categoryId;
      }
      
      console.log('Transfer request:', requestBody);
      
      // Call transfer API
      const response = await fetch('https://kelompok3.serverku.org/api/v1/users/transactions/transfer', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(requestBody)
      });
      
      const data = await response.json();
      console.log('Transfer API response:', data);
      
      if (response.ok && data.status === 'success') {
        // Transfer successful, navigate to receipt
        router.push({
          pathname: '/transfer-receipt',
          params: {
            amount: amount,
            recipientName: recipientName,
            recipientPhone: acquirerAccount,
            senderName: senderName,
            senderPhone: senderAccount,
            transactionId: data.transaction_id || 'TR' + Date.now(),
            categoryId: categoryId?.toString() || ''
          }
        });
      } else {
        // Transfer failed
        setLoading(false);
        setError(data.message || 'Transfer gagal. Silakan coba lagi.');
        setPin('');
      }
    } catch (error) {
      console.error('Error processing transfer:', error);
      setLoading(false);
      setError('Terjadi kesalahan jaringan. Silakan coba lagi.');
      setPin('');
    }
  };

  // Create PIN indicator dots
  const renderPinDots = () => {
    return (
      <View className="flex-row justify-center space-x-5 my-8">
        {[...Array(6)].map((_, index) => (
          <View 
            key={`dot-${index}`}
            className={`h-4 w-4 m-2 rounded-full ${
              index < pin.length ? 'bg-[#3E9E8F]' : 'bg-[#D9D9D9]'
            }`}
          />
        ))}
      </View>
    );
  };

  // Render numpad button
  const renderNumButton = (num: number | string) => (
    <TouchableOpacity 
      key={`btn-${num}`}
      className="items-center justify-center"
      onPress={() => handlePinInput(num.toString())}
      disabled={loading}
    >
      <View className="w-20 h-20 rounded-full bg-[#F0F0F0] items-center justify-center">
        <Text className="text-2xl font-bold text-[#1D1E2C]">{num}</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView className="flex-1 bg-white">
      <StatusBar style="dark" />
      
      {/* Header */}
      <View className="px-6 pt-4 pb-2 mt-8">
        <TouchableOpacity onPress={handleBack} className="mb-6" disabled={loading}>
          <Ionicons name="arrow-back" size={24} color="#45484A" />
        </TouchableOpacity>
        
        <Text className="text-2xl font-black text-center mt-4">
          Enter WALLED PIN
        </Text>
        <Text className="text-[#1D1E2C] mt-2 text-center">
          Your 6 digit WALLED PIN
        </Text>
        
        {error ? (
          <Text className="text-red-500 mt-2 text-center">{error}</Text>
        ) : null}
      </View>
      
      {/* PIN dots */}
      {renderPinDots()}
      
      {/* PIN pad */}
      <View className="flex-1 justify-center px-10 pb-10 mt-6">
        {loading ? (
          <View className="items-center">
            <ActivityIndicator size="large" color="#3E9E8F" />
            <Text className="mt-4 text-gray-600 text-center">Processing transfer...</Text>
          </View>
        ) : (
          <View>
            {/* Number rows */}
            <View className="flex-row justify-between mb-6">
              {[1, 2, 3].map(num => renderNumButton(num))}
            </View>
            
            <View className="flex-row justify-between mb-6">
              {[4, 5, 6].map(num => renderNumButton(num))}
            </View>
            
            <View className="flex-row justify-between mb-6">
              {[7, 8, 9].map(num => renderNumButton(num))}
            </View>
            
            <View className="flex-row justify-between">
              <View className="w-20 h-20" />
              
              {renderNumButton(0)}
              
              <TouchableOpacity 
                key="btn-delete"
                className="items-center justify-center"
                onPress={handleDelete}
                disabled={loading}
              >
                <View className="w-20 h-20 rounded-full bg-gray-100 items-center justify-center">
                  <Ionicons name="backspace-outline" size={28} color="#1D1E2C" />
                </View>
              </TouchableOpacity>
            </View>
          </View>
        )}
      </View>
    </SafeAreaView>
  );
}