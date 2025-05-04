import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, SafeAreaView, Image, Dimensions, ScrollView, Alert, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { StatusBar } from 'expo-status-bar';

const { width } = Dimensions.get('window');

export default function SignupScreen() {
  const router = useRouter();
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  
  // State untuk error message
  const [fullNameError, setFullNameError] = useState('');
  const [emailError, setEmailError] = useState('');
  const [phoneError, setPhoneError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [confirmPasswordError, setConfirmPasswordError] = useState('');
  const [apiError, setApiError] = useState('');

  // Fungsi untuk kembali ke welcome screen
  const handleBackToWelcome = () => {
    router.push('/welcome');
  };

  // Validasi nama lengkap
  const validateFullName = (name: string) => {
    if (!name) {
      setFullNameError('Full name cannot be empty');
      return false;
    } else if (name.length < 3) {
      setFullNameError('Full name should be at least 3 characters');
      return false;
    }
    setFullNameError('');
    return true;
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

  // Validasi phone
  const validatePhone = (phone: string) => {
    const phoneRegex = /^[0-9]{10,13}$/;
    if (!phone) {
      setPhoneError('Phone number cannot be empty');
      return false;
    } else if (!phoneRegex.test(phone)) {
      setPhoneError('Phone should be 10-13 digits');
      return false;
    }
    setPhoneError('');
    return true;
  };

  // Validasi password
  const validatePassword = (password: string) => {
    if (!password) {
      setPasswordError('Password cannot be empty');
      return false;
    } else if (password.length < 6) {
      setPasswordError('Password should be at least 6 characters');
      return false;
    }
    setPasswordError('');
    return true;
  };

  // Validasi konfirmasi password
  const validateConfirmPassword = (confirmPwd: string) => {
    if (!confirmPwd) {
      setConfirmPasswordError('Confirm password cannot be empty');
      return false;
    } else if (confirmPwd !== password) {
      setConfirmPasswordError('Passwords do not match');
      return false;
    }
    setConfirmPasswordError('');
    return true;
  };

  // Handle signup dengan API dan auto login
  const handleSignup = async () => {
    // Reset API error
    setApiError('');
    
    // Validate all fields
    const isFullNameValid = validateFullName(fullName);
    const isEmailValid = validateEmail(email);
    const isPhoneValid = validatePhone(phone);
    const isPasswordValid = validatePassword(password);
    const isConfirmPasswordValid = validateConfirmPassword(confirmPassword);

    // If all validations pass, proceed with signup
    if (isFullNameValid && isEmailValid && isPhoneValid && isPasswordValid && isConfirmPasswordValid) {
      try {
        setLoading(true);
        
        // Prepare request body
        const requestBody = {
          full_name: fullName,
          email: email,
          mobile_phone: phone,
          password: password,
          confirmation_password: confirmPassword
        };
        
        // Call Register API
        const registerResponse = await fetch('https://kelompok3.serverku.org/api/v1/users/auth/register', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(requestBody),
        });
        
        const registerData = await registerResponse.json();
        console.log('Register response:', registerData);
        
        if (registerResponse.ok) {
          // Registrasi berhasil, lakukan login otomatis
          const loginResponse = await fetch('https://kelompok3.serverku.org/api/v1/users/auth/login', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              email: email,
              password: password
            }),
          });
          
          const loginData = await loginResponse.json();
          console.log('Auto login response:', loginData);
          
          if (loginResponse.ok && loginData.token) {
            // Login berhasil, arahkan ke pembuatan PIN
            Alert.alert(
              "Success",
              "Account created successfully! Let's set up your PIN.",
              [
                { 
                  text: "OK", 
                  onPress: () => {
                    router.push({
                      pathname: '/create-pin',
                      params: { token: loginData.token }
                    });
                  }
                }
              ]
            );
          } else {
            // Login gagal, arahkan ke halaman login
            Alert.alert(
              "Success",
              "Account created successfully! Please login to continue.",
              [
                { 
                  text: "OK", 
                  onPress: () => router.push('/login')
                }
              ]
            );
          }
        } else {
          // Registrasi gagal
          setApiError(registerData.message || 'Failed to register. Please try again.');
        }
      } catch (error) {
        console.error('Error during registration:', error);
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
            <Text className="text-3xl font-bold text-primary">Let's get</Text>
            <Text className="text-3xl font-bold text-primary">started</Text>
          </View>

          {/* API Error Message */}
          {apiError ? (
            <View className="mb-4 px-2">
              <Text className="text-red-500 text-sm">{apiError}</Text>
            </View>
          ) : null}

          {/* Form */}
          <View className="space-y-3 px-2">
            {/* Full Name Input */}
            <View>
              <View className="bg-white rounded-3xl px-4 py-3 flex-row items-center border border-gray-200">
                <Ionicons name="person-outline" size={18} color="#AEB5BB" />
                <TextInput
                  className="flex-1 ml-2 text-primary text-base"
                  placeholder="Enter your full name"
                  placeholderTextColor="#AEB5BB"
                  value={fullName}
                  onChangeText={(text) => {
                    setFullName(text);
                    if (fullNameError) validateFullName(text);
                  }}
                  onBlur={() => validateFullName(fullName)}
                />
              </View>
              {fullNameError ? (
                <Text className="text-red-500 text-xs ml-4 mt-1">{fullNameError}</Text>
              ) : null}
            </View>

            {/* Email Input */}
            <View>
              <View className="bg-white rounded-3xl px-4 py-3 flex-row items-center border border-gray-200 mt-2">
                <Ionicons name="mail-outline" size={18} color="#AEB5BB" />
                <TextInput
                  className="flex-1 ml-2 text-primary text-base"
                  placeholder="Enter your email"
                  placeholderTextColor="#AEB5BB"
                  keyboardType="email-address"
                  value={email}
                  onChangeText={(text) => {
                    setEmail(text);
                    if (emailError) validateEmail(text);
                  }}
                  onBlur={() => validateEmail(email)}
                />
              </View>
              {emailError ? (
                <Text className="text-red-500 text-xs ml-4 mt-1">{emailError}</Text>
              ) : null}
            </View>

            {/* Phone Input */}
            <View>
              <View className="bg-white rounded-3xl px-4 py-3 flex-row items-center border border-gray-200 mt-2">
                <Ionicons name="phone-portrait-outline" size={18} color="#AEB5BB" />
                <TextInput
                  className="flex-1 ml-2 text-primary text-base"
                  placeholder="Enter your phone no"
                  placeholderTextColor="#AEB5BB"
                  keyboardType="phone-pad"
                  value={phone}
                  onChangeText={(text) => {
                    setPhone(text);
                    if (phoneError) validatePhone(text);
                  }}
                  onBlur={() => validatePhone(phone)}
                />
              </View>
              {phoneError ? (
                <Text className="text-red-500 text-xs ml-4 mt-1">{phoneError}</Text>
              ) : null}
            </View>

            {/* Password Input */}
            <View>
              <View className="bg-white rounded-3xl px-4 py-3 flex-row items-center border border-gray-200 mt-2">
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
                    // Revalidate confirm password if it's not empty
                    if (confirmPassword) validateConfirmPassword(confirmPassword);
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

            {/* Confirm Password Input */}
            <View>
              <View className="bg-white rounded-3xl px-4 py-3 flex-row items-center border border-gray-200 mt-2">
                <Ionicons name="lock-closed-outline" size={18} color="#AEB5BB" />
                <TextInput
                  className="flex-1 ml-2 text-primary text-base"
                  placeholder="Confirm your password"
                  placeholderTextColor="#AEB5BB"
                  secureTextEntry={!showConfirmPassword}
                  value={confirmPassword}
                  onChangeText={(text) => {
                    setConfirmPassword(text);
                    if (confirmPasswordError) validateConfirmPassword(text);
                  }}
                  onBlur={() => validateConfirmPassword(confirmPassword)}
                />
                <TouchableOpacity onPress={() => setShowConfirmPassword(!showConfirmPassword)}>
                  <Ionicons 
                    name={showConfirmPassword ? "eye-off-outline" : "eye-outline"} 
                    size={18} 
                    color="#AEB5BB" 
                  />
                </TouchableOpacity>
              </View>
              {confirmPasswordError ? (
                <Text className="text-red-500 text-xs ml-4 mt-1">{confirmPasswordError}</Text>
              ) : null}
            </View>

            {/* Sign Up Button */}
            <TouchableOpacity 
              className={`bg-primary rounded-full py-3 items-center mt-4 ${loading ? 'opacity-70' : ''}`}
              onPress={handleSignup}
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator color="white" size="small" />
              ) : (
                <Text className="text-white font-semibold text-base">Sign up</Text>
              )}
            </TouchableOpacity>

            {/* Divider */}
            <View className="flex-row items-center my-4">
              <View className="flex-1 h-px bg-gray" />
              <Text className="mx-4 text-secondary text-sm">or continue with</Text>
              <View className="flex-1 h-px bg-gray" />
            </View>

            {/* Google Sign Up Button */}
            <TouchableOpacity className="bg-white rounded-3xl py-3 flex-row justify-center items-center border border-gray-200">
              <Image 
                source={require('../../assets/google-icon.png')} 
                style={{ width: 18, height: 18, marginRight: 8 }}
                resizeMode="contain"
              />
              <Text className="text-primary font-medium">Google</Text>
            </TouchableOpacity>
          </View>

          {/* Login Link */}
          <View className="flex-row justify-center mt-6 mb-4">
            <Text className="text-secondary">Already have an account? </Text>
            <TouchableOpacity onPress={() => router.push('/login')}>
              <Text className="text-primary font-semibold">Login</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}