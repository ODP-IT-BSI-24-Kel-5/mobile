// app/profile.tsx
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  SafeAreaView,
  ScrollView,
  Image,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  Switch,
  StyleSheet
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { StatusBar } from 'expo-status-bar';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface UserProfile {
  full_name: string;
  email: string;
  mobile_phone: string;
  image_url: string | null;
  have_pin: boolean;
  joinDate?: string; // We'll add a placeholder for this
}

export default function ProfileScreen() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [userToken, setUserToken] = useState<string | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfile>({
    full_name: 'User',
    email: '',
    mobile_phone: '',
    image_url: null,
    have_pin: false,
    joinDate: '',
  });
  
  // App settings
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [biometricsEnabled, setBiometricsEnabled] = useState(false);
  const [darkModeEnabled, setDarkModeEnabled] = useState(false);
  
  // Fetch user data on component mount
  useEffect(() => {
    checkAuth();
  }, []);

  // Check if user is authenticated and fetch profile data
  const checkAuth = async () => {
    try {
      setLoading(true);
      const token = await AsyncStorage.getItem('userToken');
      if (!token) {
        router.replace('/welcome');
        return;
      }
      
      setUserToken(token);
      
      // Fetch user profile data from API
      await fetchUserProfile(token);
      
      // Load user settings from AsyncStorage
      await loadUserSettings();
    } catch (error) {
      console.error('Error checking auth:', error);
      Alert.alert('Error', 'Failed to authenticate. Please login again.');
      router.replace('/welcome');
    } finally {
      setLoading(false);
    }
  };

  // Fetch user profile from API
  const fetchUserProfile = async (token: string) => {
    try {
      console.log('Fetching user profile from API...');
      
      const response = await fetch('https://kelompok3.serverku.org/api/v1/users/profile', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      console.log('Profile API status:', response.status);
      
      const data = await response.json();
      console.log('Profile API response:', JSON.stringify(data));
      
      if (data.status === 'success' && data.users) {
        // Save profile data to AsyncStorage for easy access elsewhere in the app
        await AsyncStorage.setItem('userName', data.users.full_name);
        await AsyncStorage.setItem('userEmail', data.users.email);
        await AsyncStorage.setItem('userPhone', data.users.mobile_phone);
        
        if (data.users.image_url) {
          await AsyncStorage.setItem('userAvatar', data.users.image_url);
        }
        
        // Get join date from storage or set placeholder (API doesn't provide this)
        const joinDate = await AsyncStorage.getItem('userJoinDate');
        
        // Update user profile state
        setUserProfile({
          ...data.users,
          joinDate: joinDate || new Date().toISOString().split('T')[0] // Today as fallback
        });
      } else {
        throw new Error(data.message || 'Failed to fetch profile');
      }
    } catch (error) {
      console.error('Error fetching user profile:', error);
      Alert.alert('Error', 'Failed to fetch user profile. Please try again.');
      
      // Use cached data as fallback
      const name = await AsyncStorage.getItem('userName');
      const email = await AsyncStorage.getItem('userEmail');
      const phone = await AsyncStorage.getItem('userPhone');
      const avatar = await AsyncStorage.getItem('userAvatar');
      const joinDate = await AsyncStorage.getItem('userJoinDate');
      
      if (name) {
        setUserProfile({
          full_name: name || 'User',
          email: email || '',
          mobile_phone: phone || '',
          image_url: avatar,
          have_pin: true, // Assume true since they're logged in
          joinDate: joinDate || new Date().toISOString().split('T')[0]
        });
      }
    }
  };

  // Load user settings from AsyncStorage
  const loadUserSettings = async () => {
    try {
      const notificationsValue = await AsyncStorage.getItem('notificationsEnabled');
      if (notificationsValue !== null) {
        setNotificationsEnabled(notificationsValue === 'true');
      }
      
      const biometricsValue = await AsyncStorage.getItem('biometricsEnabled');
      if (biometricsValue !== null) {
        setBiometricsEnabled(biometricsValue === 'true');
      }
      
      const darkModeValue = await AsyncStorage.getItem('darkModeEnabled');
      if (darkModeValue !== null) {
        setDarkModeEnabled(darkModeValue === 'true');
      }
    } catch (error) {
      console.error('Error loading user settings:', error);
    }
  };

  // Save settings to AsyncStorage
  const saveSettings = async (key: string, value: boolean) => {
    try {
      await AsyncStorage.setItem(key, value.toString());
    } catch (error) {
      console.error(`Error saving ${key}:`, error);
    }
  };

  // Toggle notifications
  const toggleNotifications = (value: boolean) => {
    setNotificationsEnabled(value);
    saveSettings('notificationsEnabled', value);
  };

  // Toggle biometrics
  const toggleBiometrics = (value: boolean) => {
    setBiometricsEnabled(value);
    saveSettings('biometricsEnabled', value);
  };

  // Toggle dark mode
  const toggleDarkMode = (value: boolean) => {
    setDarkModeEnabled(value);
    saveSettings('darkModeEnabled', value);
  };

  // Handle back button press
  const handleBackPress = () => {
    router.back();
  };

  // Format join date
  const formatJoinDate = (dateString: string) => {
    if (!dateString) return 'Today';
    
    const date = new Date(dateString);
    return date.toLocaleDateString('id-ID', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  // Handle logout
  const handleLogout = async () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Logout',
          style: 'destructive',
          onPress: async () => {
            try {
              // Clear user token and other user data
              await AsyncStorage.multiRemove([
                'userToken',
                'userName',
                'userEmail',
                'userPhone',
                'userAvatar'
              ]);
              // Keep settings data for a better UX when user logs back in
              
              // Redirect to welcome/login screen
              router.replace('/welcome');
            } catch (error) {
              console.error('Error during logout:', error);
              Alert.alert('Error', 'Failed to logout. Please try again.');
            }
          },
        },
      ],
      { cancelable: true }
    );
  };

  // Handle edit profile
  const handleEditProfile = () => {
    // Navigate to edit profile screen
    // router.push('/edit-profile');
    Alert.alert('Coming Soon', 'Edit profile feature will be available soon.');
  };

  // Handle help & support
  const handleHelpSupport = () => {
    // Navigate to help & support screen
    // router.push('/help-support');
    Alert.alert('Coming Soon', 'Help & Support will be available soon.');
  };

  // Handle privacy policy
  const handlePrivacyPolicy = () => {
    // Navigate to privacy policy screen
    // router.push('/privacy-policy');
    Alert.alert('Coming Soon', 'Privacy Policy will be available soon.');
  };

  // Handle terms & conditions
  const handleTermsConditions = () => {
    // Navigate to terms & conditions screen
    // router.push('/terms-conditions');
    Alert.alert('Coming Soon', 'Terms & Conditions will be available soon.');
  };

  // Format phone number for display (e.g., add spaces or dashes)
  const formatPhoneNumber = (phone: string) => {
    if (!phone) return '';
    
    // Remove country code prefix if present
    let formattedPhone = phone;
    if (phone.startsWith('62')) {
      formattedPhone = '0' + phone.substring(2);
    }
    
    // Add spaces for readability
    if (formattedPhone.length > 7) {
      formattedPhone = `${formattedPhone.substring(0, 4)} ${formattedPhone.substring(4, 8)} ${formattedPhone.substring(8)}`;
    }
    
    return formattedPhone;
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
          <Text className="text-white text-xl font-bold ml-8">PROFILE</Text>
        </View>
      </View>
      
      {loading ? (
        <View className="flex-1 justify-center items-center">
          <ActivityIndicator size="large" color="#3E9E8F" />
          <Text className="mt-4 text-gray-600">Loading profile...</Text>
        </View>
      ) : (
        <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
          {/* User Profile Card */}
          <View className="p-4">
            <View className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 mb-5">
              <View className="flex-row items-center">
                {userProfile.image_url ? (
                  <Image
                    source={{ uri: userProfile.image_url }}
                    className="w-16 h-16 rounded-full"
                  />
                ) : (
                  <View className="w-16 h-16 rounded-full bg-[#3E9E8F]/20 items-center justify-center">
                    <Text className="text-[#3E9E8F] text-xl font-bold">
                      {userProfile.full_name.charAt(0).toUpperCase()}
                    </Text>
                  </View>
                )}
                <View className="ml-4 flex-1">
                  <Text className="text-xl font-bold text-gray-800">{userProfile.full_name}</Text>
                  <Text className="text-gray-600">{userProfile.email}</Text>
                  <Text className="text-gray-600">{formatPhoneNumber(userProfile.mobile_phone)}</Text>
                </View>
                <TouchableOpacity
                  className="p-2 bg-[#3E9E8F]/10 rounded-full"
                  onPress={handleEditProfile}
                >
                  <Ionicons name="pencil" size={20} color="#3E9E8F" />
                </TouchableOpacity>
              </View>
              <View className="mt-4 pt-4 border-t border-gray-100">
                <Text className="text-gray-500">
                  Member since {formatJoinDate(userProfile.joinDate || '')}
                </Text>
              </View>
            </View>
            
            {/* PIN Status */}
            <View className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 mb-5">
              <View className="flex-row items-center">
                <View className="w-8 h-8 rounded-full bg-[#FFF8E1] items-center justify-center">
                  <Ionicons name="lock-closed-outline" size={18} color="#FFC107" />
                </View>
                <Text className="ml-3 flex-1 text-gray-800">Security PIN</Text>
                <View className={`px-3 py-1 rounded-full ${userProfile.have_pin ? 'bg-green-100' : 'bg-red-100'}`}>
                  <Text className={`text-sm font-medium ${userProfile.have_pin ? 'text-green-600' : 'text-red-600'}`}>
                    {userProfile.have_pin ? 'SET' : 'NOT SET'}
                  </Text>
                </View>
              </View>
              {!userProfile.have_pin && (
                <TouchableOpacity 
                  className="mt-3 bg-[#3E9E8F] py-2 px-4 rounded-full self-start"
                  onPress={() => Alert.alert('Coming Soon', 'PIN setup feature will be available soon.')}
                >
                  <Text className="text-white font-medium">Set PIN</Text>
                </TouchableOpacity>
              )}
            </View>
            
            {/* Settings Section */}
            <View className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 mb-5">
              <Text className="text-lg font-bold text-gray-800 mb-4">Settings</Text>
              
              {/* Notifications */}
              <View className="flex-row justify-between items-center mb-4">
                <View className="flex-row items-center">
                  <View className="w-8 h-8 rounded-full bg-[#E3F2FD] items-center justify-center">
                    <Ionicons name="notifications-outline" size={18} color="#2196F3" />
                  </View>
                  <Text className="ml-3 text-gray-800">Notifications</Text>
                </View>
                <Switch
                  value={notificationsEnabled}
                  onValueChange={toggleNotifications}
                  trackColor={{ false: '#D1D1D1', true: '#3E9E8F' }}
                  thumbColor={notificationsEnabled ? '#FFFFFF' : '#F5F5F5'}
                />
              </View>
              
              {/* Biometric Authentication */}
              <View className="flex-row justify-between items-center mb-4">
                <View className="flex-row items-center">
                  <View className="w-8 h-8 rounded-full bg-[#E8F5E9] items-center justify-center">
                    <Ionicons name="finger-print-outline" size={18} color="#4CAF50" />
                  </View>
                  <Text className="ml-3 text-gray-800">Biometric Authentication</Text>
                </View>
                <Switch
                  value={biometricsEnabled}
                  onValueChange={toggleBiometrics}
                  trackColor={{ false: '#D1D1D1', true: '#3E9E8F' }}
                  thumbColor={biometricsEnabled ? '#FFFFFF' : '#F5F5F5'}
                />
              </View>
              
              {/* Dark Mode */}
              <View className="flex-row justify-between items-center">
                <View className="flex-row items-center">
                  <View className="w-8 h-8 rounded-full bg-[#EFEBE9] items-center justify-center">
                    <Ionicons name="moon-outline" size={18} color="#795548" />
                  </View>
                  <Text className="ml-3 text-gray-800">Dark Mode</Text>
                </View>
                <Switch
                  value={darkModeEnabled}
                  onValueChange={toggleDarkMode}
                  trackColor={{ false: '#D1D1D1', true: '#3E9E8F' }}
                  thumbColor={darkModeEnabled ? '#FFFFFF' : '#F5F5F5'}
                />
              </View>
            </View>
            
            {/* Support Section */}
            <View className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 mb-5">
              <Text className="text-lg font-bold text-gray-800 mb-4">Support</Text>
              
              {/* Help & Support */}
              <TouchableOpacity 
                className="flex-row items-center mb-4"
                onPress={handleHelpSupport}
              >
                <View className="w-8 h-8 rounded-full bg-[#E3F2FD] items-center justify-center">
                  <Ionicons name="help-circle-outline" size={18} color="#2196F3" />
                </View>
                <Text className="ml-3 flex-1 text-gray-800">Help & Support</Text>
                <Ionicons name="chevron-forward" size={20} color="#BDBDBD" />
              </TouchableOpacity>
              
              {/* Privacy Policy */}
              <TouchableOpacity 
                className="flex-row items-center mb-4"
                onPress={handlePrivacyPolicy}
              >
                <View className="w-8 h-8 rounded-full bg-[#F3E5F5] items-center justify-center">
                  <Ionicons name="shield-outline" size={18} color="#9C27B0" />
                </View>
                <Text className="ml-3 flex-1 text-gray-800">Privacy Policy</Text>
                <Ionicons name="chevron-forward" size={20} color="#BDBDBD" />
              </TouchableOpacity>
              
              {/* Terms & Conditions */}
              <TouchableOpacity 
                className="flex-row items-center"
                onPress={handleTermsConditions}
              >
                <View className="w-8 h-8 rounded-full bg-[#E8F5E9] items-center justify-center">
                  <Ionicons name="document-text-outline" size={18} color="#4CAF50" />
                </View>
                <Text className="ml-3 flex-1 text-gray-800">Terms & Conditions</Text>
                <Ionicons name="chevron-forward" size={20} color="#BDBDBD" />
              </TouchableOpacity>
            </View>
            
            {/* Logout Button */}
            <TouchableOpacity 
              className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 mb-5 flex-row items-center justify-center"
              onPress={handleLogout}
            >
              <Ionicons name="log-out-outline" size={20} color="#F44336" />
              <Text className="ml-2 text-[#F44336] font-semibold">LOGOUT</Text>
            </TouchableOpacity>
            
            {/* App Version */}
            <View className="items-center mb-6">
              <Text className="text-gray-400 text-sm">Version 1.0.0</Text>
            </View>
          </View>
        </ScrollView>
      )}
    </SafeAreaView>
  );
}