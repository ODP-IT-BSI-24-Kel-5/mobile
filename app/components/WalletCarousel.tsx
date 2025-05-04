// components/WalletCarousel.tsx
import React, { useState, useRef } from 'react';
import { View, Text, TouchableOpacity, Dimensions, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

// Define wallet type
export interface Wallet {
  id: string;
  name: string;
  balance: number;
  currency: string;
  number?: string; // Tambahkan properti number untuk nomor wallet
  isMain?: boolean;
}

interface WalletCarouselProps {
  wallets: Wallet[];
  onAddWallet: () => void;
  onSelectWallet?: (wallet: Wallet) => void;
}

const { width } = Dimensions.get('window');
const CARD_WIDTH = width - 38; // 24px padding on each side

const WalletCarousel: React.FC<WalletCarouselProps> = ({ 
  wallets, 
  onAddWallet, 
  onSelectWallet 
}) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [hideBalance, setHideBalance] = useState(false);
  const scrollViewRef = useRef<ScrollView>(null);

  const handleScroll = (event: any) => {
    const contentOffsetX = event.nativeEvent.contentOffset.x;
    const newIndex = Math.round(contentOffsetX / CARD_WIDTH);
    if (newIndex !== activeIndex) {
      setActiveIndex(newIndex);
      // Call onSelectWallet when a different wallet is scrolled to
      if (onSelectWallet && wallets[newIndex]) {
        onSelectWallet(wallets[newIndex]);
      }
    }
  };

  // Format currency function
  const formatCurrency = (amount: number, currency: string) => {
    return `Rp ${amount.toLocaleString('id-ID', { maximumFractionDigits: 0 })}`;
  };

  // Toggle balance visibility
  const toggleBalanceVisibility = () => {
    setHideBalance(!hideBalance);
  };

  return (
    <View className="mt-4">
      {/* Wallet Cards */}
      <ScrollView
        ref={scrollViewRef}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onScroll={handleScroll}
        scrollEventThrottle={16}
        snapToInterval={CARD_WIDTH + 16} // Card width + gap
        decelerationRate="fast"
        contentContainerStyle={{ paddingHorizontal: 16 }}
      >
        {wallets.map((wallet, index) => (
          <View
            key={wallet.id}
            style={{ width: CARD_WIDTH, marginRight: index === wallets.length - 1 ? 0 : 16 }}
            className="bg-[#1D1E2C] rounded-3xl p-5"
          >
            <View className="flex-row justify-between items-start">
              <View>
                <Text className="text-white text-lg opacity-80">
                  {wallet.name}
                </Text>
                <Text className="text-white text-lg font-semibold mt-1">
                  {wallet.number || wallet.id}
                </Text>
              </View>
              <TouchableOpacity onPress={toggleBalanceVisibility}>
                <Ionicons 
                  name={hideBalance ? "eye-outline" : "eye-off-outline"} 
                  size={22} 
                  color="white" 
                  style={{ opacity: 0.7 }} 
                />
              </TouchableOpacity>
            </View>
            
            <Text className="text-white text-sm opacity-80 mt-4 mb-1">
              Total Balance
            </Text>
            <Text className="text-white text-3xl font-bold">
              {hideBalance ? "Rp •••••" : formatCurrency(wallet.balance, wallet.currency)}
            </Text>
          </View>
        ))}

        {/* Add Wallet Button (if less than 3 wallets) */}
        {wallets.length < 5 && (
          <TouchableOpacity
            style={{ width: CARD_WIDTH, marginRight: 0 }}
            className="bg-[#2A2B3D] rounded-3xl p-5 ml-2 border border-dashed border-gray-500 items-center justify-center"
            onPress={onAddWallet}
          >
            <Ionicons name="add-circle-outline" size={40} color="white" />
            <Text className="text-white mt-2 text-base">Add Wallet</Text>
            <Text className="text-white opacity-60 text-xs mt-1">
              {`${wallets.length}/5 wallets used`}
            </Text>
          </TouchableOpacity>
        )}
      </ScrollView>

      {/* Pagination Indicators */}
      {wallets.length > 1 && (
        <View className="flex-row justify-center mt-4">
          {wallets.map((_, index) => (
            <View
              key={index}
              className={`h-2 rounded-full mx-1 ${
                activeIndex === index ? 'w-4 bg-[#3E9E8F]' : 'w-2 bg-[#BFBFBF]'
              }`}
            />
          ))}
          {wallets.length < 3 && <View className="h-2 w-2 rounded-full mx-1 bg-[#BFBFBF]" />}
        </View>
      )}
    </View>
  );
};

export default WalletCarousel;