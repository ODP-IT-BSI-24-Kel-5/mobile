import React from 'react';
import { View, Text, Image, TouchableOpacity, SafeAreaView, Dimensions, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { Feather } from '@expo/vector-icons';

const { width, height } = Dimensions.get('window');

export default function WelcomeScreen() {
  const router = useRouter();

  return (
    <SafeAreaView className="flex-1 bg-white">
      <StatusBar style="dark" />
      <ScrollView 
        contentContainerStyle={{ flexGrow: 1 }} 
        showsVerticalScrollIndicator={false}
      >
        <View className="flex-1 justify-between px-4 mt-8">
          {/* Logo - Centered with icon */}
          <View className="mt-6 items-center flex-row justify-center">
            <Feather name="aperture" size={25} color="#45484A" />
            <Text className="text-3xl font-bold text-primary ml-2">Walled</Text>
          </View>

          {/* Center Content Container */}
          <View className="flex-1 justify-center items-center">
            {/* Illustration */}
            <View className="items-center justify-center">
              <Image 
                source={require('../../assets/illustration.png')} 
                style={{
                  width: width * 0.9,
                  height: width * 0.7,
                  maxWidth: 900,
                  maxHeight: 700
                }}
                resizeMode="contain"
              />
            </View>

            {/* Text Content */}
            <View className="mt-10 mb-2 items-center">
              <Text className="text-4xl mt-6 font-bold text-primary text-center">
                The Best E-Wallet Application
              </Text>
              <Text className="text-xl text-secondary text-center mt-10 px-10 max-w-sm">
              Let our app handle your bills while you focus on things that matter the most
              </Text>
            </View>
          </View>

          {/* Bottom Buttons - Always at bottom */}
          <View className="mb-10 mt-auto">
            <View className="bg-[#D8ECE1] rounded-3xl flex-row overflow-hidden">
              <TouchableOpacity 
                className="bg-primary py-3 px-4 flex-1 items-center"
                onPress={() => router.push('/login')}
              >
                <Text className="text-lg text-white font-semibold text-base">Login</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                className="py-3 px-4 flex-1 items-center"
                onPress={() => router.push('/signup')}
              >
                <Text className="text-lg text-primary font-semibold text-base">Sign-up</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}