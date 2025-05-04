// components/FinancialSummary.tsx
import React, { useState } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import WalletSelectionForFinancialSummary from './WalletSelectionForFinancialSummary';
import { Wallet } from './WalletCarousel';

interface FinancialSummaryProps {
  period: string;
  income: number;
  expense: number;
  onViewDetails: () => void;
  wallets: Wallet[];
  selectedWallet: Wallet | null;
  onWalletSelect: (wallet: Wallet) => void;
}

const FinancialSummary: React.FC<FinancialSummaryProps> = ({
  period,
  income,
  expense,
  onViewDetails,
  wallets,
  selectedWallet,
  onWalletSelect
}) => {
  // State untuk menentukan filter yang aktif (pemasukan atau pengeluaran)
  const [activeFilter, setActiveFilter] = useState<'income' | 'expense'>('expense');
  
  // Calculate balance
  const balance = income - expense;
  const isPositiveBalance = balance >= 0;
  
  // Format currency
  const formatCurrency = (value: number) => {
    return value.toLocaleString('id-ID');
  };
  
  // Calculate max height for chart visualization (max height is 100px)
  const maxValue = Math.max(income, expense);
  const incomeHeight = Math.min(maxValue > 0 ? (income / maxValue) * 100 : 0, 100);
  const expenseHeight = Math.min(maxValue > 0 ? (expense / maxValue) * 100 : 0, 100);
  
  // Calculate percentage for expense and income (relative to each other)
  const expensePercentage = income > 0 ? Math.round((expense / income) * 100) : 0;
  const incomePercentage = expense > 0 ? Math.round((income / expense) * 100) : 0;
  
  // Toggle filter
  const toggleFilter = (filter: 'income' | 'expense') => {
    setActiveFilter(filter);
  };
  
  return (
    <View className="bg-white rounded-xl p-4 shadow-sm border border-gray-200">
      {/* Period */}
      <Text className="text-gray-600 text-sm mb-3">{period} Period</Text>
      
      {/* Wallet Selector - New Component */}
      <WalletSelectionForFinancialSummary
        wallets={wallets}
        selectedWallet={selectedWallet}
        onSelectWallet={onWalletSelect}
      />
      
      {/* Income/Expense Labels with Indicators */}
      <View className="flex-row mb-1 justify-between px-2">
        <View className="flex-row items-center">
          <View className="w-3 h-3 rounded-full bg-[#3E9E8F] mr-1" />
          <Text className="text-gray-600 text-xs">Income</Text>
        </View>
        <View className="flex-row items-center">
          <View className="w-3 h-3 rounded-full bg-[#E57373] mr-1" />
          <Text className="text-gray-600 text-xs">Expense</Text>
        </View>
      </View>
      
      {/* Income/Expense Amounts */}
      <View className="flex-row justify-between mb-2 px-2">
        <Text className="text-gray-800 font-bold">Rp{formatCurrency(income)}</Text>
        <Text className="text-gray-800 font-bold">Rp{formatCurrency(expense)}</Text>
      </View>
      
      {/* Balance/Selisih */}
      <View className="mb-8 px-2 items-center">
        {/* <Text className="text-gray-600 text-sm">
          Selisih <Text className={isPositiveBalance ? "text-[#3E9E8F]" : "text-[#E57373]"}>
            {isPositiveBalance ? "+" : "-"}Rp{formatCurrency(Math.abs(balance))}
          </Text>
        </Text> */}
      </View>
      
      {/* Chart Visualization - Centered and with proper proportions */}
      <View className="flex-row items-end justify-center mb-4 h-28 mx-auto w-full">
        <View className="items-center mx-6">
          <View 
            style={{ 
              height: incomeHeight, 
              width: 50, 
              backgroundColor: '#3E9E8F',
              borderTopLeftRadius: 8,
              borderTopRightRadius: 8
            }} 
          />
          <Text className="text-xs text-gray-600 mt-1">Income</Text>
        </View>
        <View className="items-center mx-6">
          <View 
            style={{ 
              height: expenseHeight, 
              width: 50, 
              backgroundColor: '#E57373',
              borderTopLeftRadius: 8,
              borderTopRightRadius: 8
            }} 
          />
          <Text className="text-xs text-gray-600 mt-1">Expense</Text>
        </View>
      </View>
      
      {/* Quick Filter Buttons */}
      <View className="flex-row justify-center mb-4">
        <TouchableOpacity 
          className={`rounded-full py-2 px-4 mr-3 w-32 items-center ${activeFilter === 'income' ? 'bg-[#3E9E8F]/20' : 'bg-gray-200'}`}
          onPress={() => toggleFilter('income')}
        >
          <Text className={`${activeFilter === 'income' ? 'text-[#3E9E8F] font-medium' : 'text-gray-700'}`}>
            Income
          </Text>
        </TouchableOpacity>
        <TouchableOpacity 
          className={`rounded-full py-2 px-4 w-32 items-center ${activeFilter === 'expense' ? 'bg-[#E57373]/20' : 'bg-gray-200'}`}
          onPress={() => toggleFilter('expense')}
        >
          <Text className={`${activeFilter === 'expense' ? 'text-[#E57373] font-medium' : 'text-gray-700'}`}>
            Expense
          </Text>
        </TouchableOpacity>
      </View>
      
      {/* Conditional Detail based on active filter */}
      {activeFilter === 'expense' ? (
        // Expense Detail
        <TouchableOpacity 
          className="flex-row items-center justify-between"
          onPress={onViewDetails}
        >
          <View className="flex-row items-center">
            <View className="w-10 h-10 rounded-full bg-[#E57373]/20 items-center justify-center mr-3">
              <Ionicons name="arrow-up-outline" size={18} color="#E57373" />
            </View>
            <View>
              <Text className="text-gray-800 font-medium">Transaction Out</Text>
              <Text className="text-gray-800">Rp{formatCurrency(expense)}</Text>
            </View>
          </View>
          <View className="flex-row items-center">
            <Text className="text-gray-600 mr-1">
              {/* {expensePercentage}% */}
            </Text>
            <Ionicons name="chevron-forward" size={18} color="#757575" />
          </View>
        </TouchableOpacity>
      ) : (
        // Income Detail
        <TouchableOpacity 
          className="flex-row items-center justify-between"
          onPress={onViewDetails}
        >
          <View className="flex-row items-center">
            <View className="w-10 h-10 rounded-full bg-[#3E9E8F]/20 items-center justify-center mr-3">
              <Ionicons name="arrow-down-outline" size={18} color="#3E9E8F" />
            </View>
            <View>
              <Text className="text-gray-800 font-medium">Transaction In</Text>
              <Text className="text-gray-800">Rp{formatCurrency(income)}</Text>
            </View>
          </View>
          <View className="flex-row items-center">
            <Text className="text-gray-600 mr-1">
              {/* {incomePercentage > 100 ? 100 : incomePercentage}% */}
            </Text>
            <Ionicons name="chevron-forward" size={18} color="#757575" />
          </View>
        </TouchableOpacity>
      )}
    </View>
  );
};

export default FinancialSummary;