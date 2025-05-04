import React from 'react';
import { View, Text, Modal, TouchableOpacity, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface TransferConfirmationModalProps {
  visible: boolean;
  onClose: () => void;
  onConfirm: () => void;
  recipientName: string;
  recipientPhone: string;
  amount: string;
}

const TransferConfirmationModal: React.FC<TransferConfirmationModalProps> = ({
  visible,
  onClose,
  onConfirm,
  recipientName,
  recipientPhone,
  amount
}) => {
  // Format amount to currency
  const formattedAmount = parseInt(amount, 10).toLocaleString('id-ID');
  
  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="fade"
      onRequestClose={onClose}
    >
      <View className="flex-1 bg-black/50 justify-center items-center p-4">
        <View className="bg-white rounded-lg w-full max-w-md p-6">
          {/* Title */}
          <Text className="text-primary text-2xl font-bold text-center mb-6">
            Transfer Confirmation
          </Text>
          
          {/* Recipient */}
          <Text className="text-gray-600 mb-2">Beneficiary</Text>
          <View className="flex-row items-center mb-6">
            <View className="w-12 h-12 rounded-full bg-gray-200 items-center justify-center mr-3">
              <Ionicons name="person" size={24} color="#757575" />
            </View>
            <View>
              <Text className="text-gray-800 font-semibold">{recipientName}</Text>
              <Text className="text-gray-500">WALLED - {recipientPhone}</Text>
            </View>
          </View>
          
          {/* Source */}
          <Text className="text-gray-600 mb-2">Source of Funds</Text>
          <Text className="text-gray-800 mb-6">WALLED Cash</Text>
          
          {/* Details */}
          <Text className="text-gray-800 font-bold mb-2">Detail</Text>
          <View className="flex-row justify-between mb-1">
            <Text className="text-gray-600">Transfer Amount</Text>
            <Text className="text-gray-800 font-semibold">Rp{formattedAmount}</Text>
          </View>
          <View className="flex-row justify-between mb-4">
            <Text className="text-gray-600">Transaction Fee</Text>
            <Text className="text-gray-800 font-semibold">Rp0</Text>
          </View>
          
          {/* Total */}
          <View className="flex-row justify-between mb-6">
            <Text className="text-gray-800 font-bold">Total</Text>
            <Text className="text-gray-800 font-bold">Rp{formattedAmount}</Text>
          </View>
          
          {/* Warning Message */}
          <View className="bg-[#FFF9E6] p-4 rounded-lg mb-6">
            <View className="flex-row items-start">
              <Ionicons name="warning" size={20} color="#FF9800" className="mt-1" />
              <Text className="text-gray-700 ml-2 flex-1">
                Make sure the beneficiary account is correct and trusted, otherwise your balance cannot be returned
              </Text>
            </View>
          </View>
          
          {/* Action Buttons */}
          <TouchableOpacity
            className="bg-[#3E9E8F] py-3 rounded-full items-center mb-3"
            onPress={onConfirm}
          >
            <Text className="text-white font-semibold text-lg">TRANSFER</Text>
          </TouchableOpacity>
          
          <TouchableOpacity
            className="py-2 items-center"
            onPress={onClose}
          >
            <Text className="text-[#FF4D67] font-semibold">Cancel</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

export default TransferConfirmationModal;