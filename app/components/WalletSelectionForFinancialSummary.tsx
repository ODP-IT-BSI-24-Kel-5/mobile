// components/WalletSelectionForFinancialSummary.tsx
import React, { useState } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import WalletSelectionModal from './WalletSelectionModal';

// Import the Wallet interface from WalletCarousel
import { Wallet } from './WalletCarousel';

interface WalletSelectionForFinancialSummaryProps {
  wallets: Wallet[];
  selectedWallet: Wallet | null;
  onSelectWallet: (wallet: Wallet) => void;
}

const WalletSelectionForFinancialSummary: React.FC<WalletSelectionForFinancialSummaryProps> = ({
  wallets,
  selectedWallet,
  onSelectWallet
}) => {
  const [showWalletModal, setShowWalletModal] = useState(false);

  // Convert to format expected by WalletSelectionModal
  const convertedWallets = wallets.map(wallet => ({
    name: wallet.name,
    number: wallet.number || wallet.id, // Fallback to id if number is undefined
    balance: wallet.balance,
    is_main: wallet.isMain || false // Default to false if isMain is undefined
  }));

  const convertedSelectedWallet = selectedWallet ? {
    name: selectedWallet.name,
    number: selectedWallet.number || selectedWallet.id, // Fallback to id if number is undefined
    balance: selectedWallet.balance,
    is_main: selectedWallet.isMain || false // Default to false if isMain is undefined
  } : null;

  const handleWalletSelection = (wallet: any) => {
    // Find the original wallet object to maintain consistent types
    const originalWallet = wallets.find(w => w.number === wallet.number);
    if (originalWallet) {
      onSelectWallet(originalWallet);
    }
    setShowWalletModal(false);
  };

  return (
    <>
      <TouchableOpacity 
        className="bg-white border border-[#E0E0E0] rounded-xl p-3 flex-row justify-between items-center mb-4"
        onPress={() => setShowWalletModal(true)}
      >
        <View className="flex-row items-center">
          <View className="w-8 h-8 rounded-full bg-[#2E8B57]/20 items-center justify-center mr-2">
            <Ionicons name="wallet-outline" size={16} color="#2E8B57" />
          </View>
          <Text className="text-gray-800 font-medium">{selectedWallet?.name || 'All Wallets'}</Text>
        </View>
        <Ionicons name="chevron-down" size={18} color="#757575" />
      </TouchableOpacity>

      <WalletSelectionModal
        visible={showWalletModal}
        onClose={() => setShowWalletModal(false)}
        wallets={convertedWallets}
        selectedWallet={convertedSelectedWallet}
        onSelectWallet={handleWalletSelection}
      />
    </>
  );
};

export default WalletSelectionForFinancialSummary;