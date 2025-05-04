import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, SafeAreaView, ActivityIndicator, Alert, StyleSheet } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { StatusBar } from 'expo-status-bar';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function CreatePINScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const userToken = params.token as string;
  
  const [pin, setPin] = useState('');
  const [confirmPin, setConfirmPin] = useState('');
  const [step, setStep] = useState(1); // 1: Create PIN, 2: Confirm PIN
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Handle back button
  const handleBack = () => {
    if (step === 2) {
      // Go back to create PIN
      setStep(1);
      setConfirmPin('');
    } else {
      // Go back to signup
      router.back();
    }
  };

  // Handle PIN input
  const handlePinInput = (digit: string) => {
    if (step === 1) {
      if (pin.length < 6) {
        setPin(pin + digit);
      }
      
      // Automatically go to confirm PIN when 6 digits entered
      if (pin.length === 5) {
        setTimeout(() => {
          setStep(2);
        }, 300);
      }
    } else {
      if (confirmPin.length < 6) {
        setConfirmPin(confirmPin + digit);
      }
      
      // Automatically verify when 6 digits entered for confirmation
      if (confirmPin.length === 5) {
        setTimeout(() => {
          verifyAndSavePin(confirmPin + digit);
        }, 300);
      }
    }
  };

  // Handle delete/backspace
  const handleDelete = () => {
    if (step === 1) {
      if (pin.length > 0) {
        setPin(pin.slice(0, -1));
      }
    } else {
      if (confirmPin.length > 0) {
        setConfirmPin(confirmPin.slice(0, -1));
      }
    }
  };

  // Verify PIN and save to server
  const verifyAndSavePin = async (finalConfirmPin: string) => {
    // Check if PINs match
    if (pin !== finalConfirmPin) {
      setError('PINs do not match. Please try again.');
      setTimeout(() => {
        setConfirmPin('');
      }, 500);
      return;
    }
    
    setLoading(true);
    try {
      // Call API to save PIN with corrected URL and request format
      const response = await fetch('https://kelompok3.serverku.org/api/v1/users/auth/pins', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${userToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          pin: pin,
          confirmation_pin: finalConfirmPin
        }),
      });
      
      const data = await response.json();
      console.log('PIN API response:', data);
      
      if (response.ok) {
        // PIN set successfully, redirect to home
        await AsyncStorage.setItem('userToken', userToken);
        router.replace('/home');
      } else {
        setError(data.message || 'Failed to set PIN. Please try again.');
        setConfirmPin('');
      }
    } catch (error) {
      console.error('Error setting PIN:', error);
      setError('Network error. Please try again.');
      setConfirmPin('');
    } finally {
      setLoading(false);
    }
  };

  // Create PIN indicator dots
  const renderPinDots = () => {
    const currentPin = step === 1 ? pin : confirmPin;
    return (
      <View className="flex-row justify-center space-x-5 my-8">
        {[...Array(6)].map((_, index) => (
          <View 
            key={`dot-${index}`}
            className={`h-4 w-4 m-2 rounded-full ${
              index < currentPin.length ? 'bg-[#3E9E8F]' : 'bg-[#D9D9D9]'
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
    >
      <View className="w-20 h-20 rounded-full bg-[#F0F0F0] items-center justify-center">
        <Text className="text-2xl font-black text-[#1D1E2C]">{num}</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView className="flex-1 bg-white">
      <StatusBar style="dark" />
      
      {/* Header */}
      <View className="px-6 pt-4 pb-2 mt-8">
        <TouchableOpacity onPress={handleBack} className="mb-6">
          <Ionicons name="arrow-back" size={24} color="#45484A" />
        </TouchableOpacity>
        
        <Text className="text-2xl font-black text-center mt-4">
          {step === 1 ? 'Create WALLED PIN' : 'WALLED PIN Confirmation'}
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
          <ActivityIndicator size="large" color="#3E9E8F" />
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