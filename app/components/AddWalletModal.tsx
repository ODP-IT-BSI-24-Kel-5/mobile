// components/AddWalletModal.tsx
import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Modal, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface AddWalletModalProps {
  visible: boolean;
  onClose: () => void;
  onAdd: (name: string) => void;
}

const AddWalletModal: React.FC<AddWalletModalProps> = ({ visible, onClose, onAdd }) => {
  const [walletName, setWalletName] = useState('');
  const [nameError, setNameError] = useState('');
  const [loading, setLoading] = useState(false);

  // Reset state when modal is opened
  React.useEffect(() => {
    if (visible) {
      setWalletName('');
      setNameError('');
      setLoading(false);
    }
  }, [visible]);

  // Validate wallet name
  const validateWalletName = (name: string): boolean => {
    if (!name.trim()) {
      setNameError('Wallet name cannot be empty');
      return false;
    } else if (name.length < 3) {
      setNameError('Wallet name should be at least 3 characters');
      return false;
    }
    setNameError('');
    return true;
  };

  // Handle adding wallet
  const handleAddWallet = async () => {
    if (validateWalletName(walletName)) {
      setLoading(true);
      try {
        await onAdd(walletName);
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="fade"
      onRequestClose={onClose}
    >
      <View className="flex-1 justify-center items-center bg-black/50">
        <View className="bg-white w-[90%] rounded-3xl p-6">
          <View className="flex-row justify-between items-center mb-4">
            <Text className="text-xl font-[900] text-[#1D1E2C]">Add New Wallet</Text>
            <TouchableOpacity onPress={onClose}>
              <Ionicons name="close" size={24} color="#45484A" />
            </TouchableOpacity>
          </View>

          <View className="mb-6">
            <Text className="mb-2">Wallet Name</Text>
            <TextInput
              className="bg-[#F0F0F0] p-3 rounded-xl text-[#1D1E2C]"
              placeholder="Enter wallet name"
              value={walletName}
              onChangeText={(text) => {
                setWalletName(text);
                if (nameError) validateWalletName(text);
              }}
              onBlur={() => validateWalletName(walletName)}
            />
            {nameError ? (
              <Text className="text-red-500 text-xs mt-1">{nameError}</Text>
            ) : null}
          </View>

          <TouchableOpacity
            className={`bg-primary rounded-full py-3 items-center ${loading || !walletName ? 'opacity-70' : ''}`}
            onPress={handleAddWallet}
            disabled={loading || !walletName}
          >
            {loading ? (
              <ActivityIndicator color="white" size="small" />
            ) : (
              <Text className="text-white font-semibold text-base">Add Wallet</Text>
            )}
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

export default AddWalletModal;