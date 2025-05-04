// components/WalletSelectionModal.tsx
import React from 'react';
import { View, Text, Modal, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

// Define wallet type
export interface Wallet {
  name: string;
  number: string;
  balance: number;
  is_main: boolean | null;
}

interface WalletSelectionModalProps {
  visible: boolean;
  onClose: () => void;
  wallets: Wallet[];
  selectedWallet: Wallet | null;
  onSelectWallet: (wallet: Wallet) => void;
}

const WalletSelectionModal: React.FC<WalletSelectionModalProps> = ({
  visible,
  onClose,
  wallets,
  selectedWallet,
  onSelectWallet
}) => {
  // Format currency
  const formatCurrency = (value: number) => {
    return value.toLocaleString('id-ID');
  };

  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="fade"
      onRequestClose={onClose}
    >
      <TouchableOpacity 
        activeOpacity={1}
        onPress={onClose}
        className="flex-1 bg-black/50 justify-end"
      >
        <View className="bg-white rounded-t-xl px-4 pt-4 pb-8">
          <View className="flex-row justify-between items-center mb-4">
            <Text className="text-xl font-bold text-gray-800">Choose Wallet</Text>
            <TouchableOpacity onPress={onClose}>
              <Ionicons name="close" size={24} color="#333" />
            </TouchableOpacity>
          </View>
          
          {wallets.map((wallet) => (
            <TouchableOpacity
              key={wallet.number}
              className={`mb-3 p-4 rounded-lg border ${
                selectedWallet?.number === wallet.number 
                  ? 'border-[#3E9E8F] bg-[#E8F5F3]' 
                  : 'border-[#A6A6A6]'
              }`}
              onPress={() => onSelectWallet(wallet)}
            >
              <View className="flex-row items-center">
                <View className="w-8 h-8 rounded-full bg-[#2E8B57]/20 items-center justify-center mr-2">
                  <Ionicons name="wallet-outline" size={16} color="#2E8B57" />
                </View>
                <View className="ml-3 flex-1">
                  <View className="flex-row items-center">
                    <Text className="text-gray-800 font-semibold">{wallet.name}</Text>
                    {wallet.is_main && (
                      <View className="ml-2 px-2 py-0.5 bg-[#3E9E8F] rounded">
                        <Text className="text-white text-xs">Main</Text>
                      </View>
                    )}
                  </View>
                  <Text className="text-gray-500 text-sm">{wallet.number}</Text>
                  <Text className="text-gray-800 font-medium mt-1">
                    Rp{formatCurrency(wallet.balance)}
                  </Text>
                </View>
                {selectedWallet?.number === wallet.number && (
                  <Ionicons name="checkmark-circle" size={24} color="#3E9E8F" />
                )}
              </View>
            </TouchableOpacity>
          ))}
        </View>
      </TouchableOpacity>
    </Modal>
  );
};

export default WalletSelectionModal;