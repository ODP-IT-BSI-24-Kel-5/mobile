import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, SafeAreaView, Image, Dimensions, ScrollView, Alert, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { StatusBar } from 'expo-status-bar';
import AsyncStorage from '@react-native-async-storage/async-storage';

const { width } = Dimensions.get('window');

export default function LoginScreen() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [apiError, setApiError] = useState('');
  const [loading, setLoading] = useState(false);

  // Efek untuk menghilangkan pesan error API setelah beberapa detik
  useEffect(() => {
    if (apiError) {
      const timer = setTimeout(() => {
        setApiError('');
      }, 3000); // Pesan error menghilang setelah 3 detik
      
      return () => clearTimeout(timer);
    }
  }, [apiError]);
  
  // Fungsi untuk kembali ke welcome screen
  const handleBackToWelcome = () => {
    router.push('/welcome');
  };

  // Validasi email
  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email) {
      setEmailError('Email cannot be empty');
      return false;
    } else if (!emailRegex.test(email)) {
      setEmailError('Invalid email format');
      return false;
    }
    setEmailError('');
    return true;
  };

  // Validasi password
  const validatePassword = (password: string) => {
    if (!password) {
      setPasswordError('Password cannot be empty');
      return false;
    }

    setPasswordError('');
    return true;
  };

  // Reset semua error dan status loading
  const resetErrors = () => {
    setEmailError('');
    setPasswordError('');
    setApiError('');
  };

  // Handle login dengan API
  const handleLogin = async () => {
    // Reset API error
    setApiError('');
    
    // Validate all fields
    const isEmailValid = validateEmail(email);
    const isPasswordValid = validatePassword(password);

    // If all validations pass, proceed with login
    if (isEmailValid && isPasswordValid) {
      try {
        setLoading(true);
        
        // Prepare request body
        const requestBody = {
          email: email,
          password: password
        };
        
        // Call API
        const response = await fetch('https://kelompok3.serverku.org/api/v1/users/auth/login', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(requestBody),
        });
        
        const data = await response.json();
        
        // Check if request was successful
        if (response.ok && data.status === 'success') {
          // Save token to AsyncStorage
          await AsyncStorage.setItem('userToken', data.token);
          
          // Navigate to home screen
          router.push('/home');
        } else {
          // Handle API error
          setApiError(data.message || 'Invalid credentials. Please try again.');
        }
      } catch (error) {
        console.error('Error during login:', error);
        setApiError('Network error. Please check your connection and try again.');
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      <StatusBar style="dark" />
      <ScrollView contentContainerStyle={{ flexGrow: 1 }} showsVerticalScrollIndicator={false}>
        <View className="flex-1 px-4 py-4 w-full mt-8">
          {/* Back Button */}
          <TouchableOpacity 
            className="mt-2 mb-4" 
            onPress={handleBackToWelcome}
          >
            <Ionicons name="arrow-back" size={24} color="#45484A" />
          </TouchableOpacity>

          {/* Header */}
          <View className="mb-8 px-2">
            <Text className="text-3xl font-bold text-primary">Hey,</Text>
            <Text className="text-3xl font-bold text-primary">Welcome</Text>
            <Text className="text-3xl font-bold text-primary">Back</Text>
          </View>

          {/* API Error Message */}
          {apiError ? (
            <View className="mb-4 px-2">
              <Text className="text-red-500 text-sm">{apiError}</Text>
            </View>
          ) : null}

          {/* Form */}
          <View className="space-y-3 px-2">
            {/* Email Input */}
            <View>
              <View className={`bg-white rounded-3xl px-4 py-3 flex-row items-center border ${apiError ? 'border-red-500' : 'border-gray-200'}`}>
                <Ionicons name="mail-outline" size={18} color={apiError ? "#FF3B30" : "#AEB5BB"} />
                <TextInput
                  className="flex-1 ml-2 text-primary text-base"
                  placeholder="Enter your email"
                  placeholderTextColor="#AEB5BB"
                  keyboardType="email-address"
                  value={email}
                  onChangeText={(text) => {
                    setEmail(text);
                    if (apiError) setApiError('');
                    if (emailError) validateEmail(text);
                  }}
                  onBlur={() => validateEmail(email)}
                />
              </View>
              {emailError ? (
                <Text className="text-red-500 text-xs ml-4 mt-1">{emailError}</Text>
              ) : null}
            </View>

            {/* Password Input */}
            <View>
              <View className="bg-white rounded-3xl px-4 py-3 flex-row items-center border border-gray-200 mt-4">
                <Ionicons name="lock-closed-outline" size={18} color="#AEB5BB" />
                <TextInput
                  className="flex-1 ml-2 text-primary text-base"
                  placeholder="Enter your password"
                  placeholderTextColor="#AEB5BB"
                  secureTextEntry={!showPassword}
                  value={password}
                  onChangeText={(text) => {
                    setPassword(text);
                    if (passwordError) validatePassword(text);
                  }}
                  onBlur={() => validatePassword(password)}
                />
                <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
                  <Ionicons 
                    name={showPassword ? "eye-off-outline" : "eye-outline"} 
                    size={18} 
                    color="#AEB5BB" 
                  />
                </TouchableOpacity>
              </View>
              {passwordError ? (
                <Text className="text-red-500 text-xs ml-4 mt-1">{passwordError}</Text>
              ) : null}
            </View>

            {/* API Error Message - Strategically placed between form and login button */}
            {/* {apiError ? (
              <View className="py-2 px-4 bg-red-100 rounded-lg">
                <Text className="text-red-500 text-center font-medium">{apiError}</Text>
              </View>
            ) : null} */}

            {/* Forgot Password */}
            <TouchableOpacity className="items-end mt-4">
              <Text className="text-primary text-sm">Forgot Password?</Text>
            </TouchableOpacity>

            {/* Login Button */}
            <TouchableOpacity 
              className={`bg-primary rounded-full py-3 items-center mt-4 ${loading ? 'opacity-70' : ''}`}
              onPress={handleLogin}
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator color="white" size="small" />
              ) : (
                <Text className="text-white font-semibold text-base">Login</Text>
              )}
            </TouchableOpacity>

            {/* Divider */}
            <View className="flex-row items-center my-4">
              <View className="flex-1 h-px bg-gray" />
              <Text className="mx-4 text-secondary text-sm">or continue with</Text>
              <View className="flex-1 h-px bg-gray" />
            </View>

            {/* Google Login Button */}
            <TouchableOpacity className="bg-white rounded-3xl py-3 flex-row justify-center items-center border border-gray-200">
              <Image 
                source={require('../../assets/google-icon.png')} 
                style={{ width: 18, height: 18, marginRight: 8 }}
                resizeMode="contain"
              />
              <Text className="text-primary font-medium">Google</Text>
            </TouchableOpacity>
          </View>

          {/* Sign Up Link */}
          <View className="flex-row justify-center mt-6 mb-4">
            <Text className="text-secondary">Don't have an account? </Text>
            <TouchableOpacity onPress={() => router.push('/signup')}>
              <Text className="text-primary font-semibold">Sign up</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}