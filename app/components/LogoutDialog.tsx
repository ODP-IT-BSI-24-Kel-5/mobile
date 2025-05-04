import React from 'react';
import { View, Text, TouchableOpacity, Modal, Dimensions } from 'react-native';

interface LogoutDialogProps {
  visible: boolean;
  onCancel: () => void;
  onLogout: () => void;
}

const { width } = Dimensions.get('window');

const LogoutDialog: React.FC<LogoutDialogProps> = ({ visible, onCancel, onLogout }) => {
  if (!visible) return null;
  
  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="fade"
      onRequestClose={onCancel}
    >
      <View className="flex-1 bg-black/50 justify-center items-center">
        <View 
          className="bg-white rounded-3xl overflow-hidden shadow-lg"
          style={{ width: width * 0.85 }}
        >
          <View className="p-6">
            <Text className="text-2xl font-bold text-[#1D1E2C] mb-2">Logout</Text>
            <Text className="text-base text-[#45484A] mb-6">Are you sure you want to logout?</Text>
            
            <View className="flex-row justify-end mt-2">
              <TouchableOpacity
                className="py-2 px-4 rounded"
                onPress={onCancel}
              >
                <Text className="text-base font-semibold text-[#45484A]">CANCEL</Text>
              </TouchableOpacity>
              
              <TouchableOpacity
                className="py-2 px-4 rounded ml-4"
                onPress={onLogout}
              >
                <Text className="text-base font-semibold text-[#FF4D67]">LOGOUT</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </View>
    </Modal>
  );
};

export default LogoutDialog;