import React, { useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Platform,
  FlatList,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

// Karena mungkin file tema belum dibuat
const COLORS = {
  primary: '#4CAF50',
  background: '#FFFFFF',
  text: {
    primary: '#333333',
    secondary: '#666666',
    light: '#999999',
  },
  border: '#DDDDDD',
};

const SIZES = {
  base: 8,
  small: 12,
  font: 14,
  medium: 16,
  large: 18,
  xl: 24,
  xxl: 32,
  padding: 20,
  radius: 8,
};

const FONTS = {
  regular: {
    fontWeight: 'normal',
  },
  medium: {
    fontWeight: '500',
  },
  bold: {
    fontWeight: 'bold',
  },
};

// Simulasi data untuk layar Home
const balanceData = {
  balance: 'Rp 2,500,000',
  income: 'Rp 4,500,000',
  expense: 'Rp 2,000,000',
};

const quickActions = [
  { id: '1', icon: '💸', title: 'Transfer', screen: 'Transfer' },
  { id: '2', icon: '📱', title: 'Top Up', screen: 'TopUp' },
  { id: '3', icon: '💳', title: 'Pay', screen: 'Pay' },
  { id: '4', icon: '📊', title: 'Analytics', screen: 'Analytics' },
];

const recentTransactions = [
  {
    id: '1',
    type: 'expense',
    title: 'Grocery Shopping',
    date: 'Apr 20, 2025',
    amount: 'Rp 350,000',
    icon: '🛒',
  },
  {
    id: '2',
    type: 'income',
    title: 'Salary Deposit',
    date: 'Apr 15, 2025',
    amount: 'Rp 4,500,000',
    icon: '💼',
  },
  {
    id: '3',
    type: 'expense',
    title: 'Restaurant Bill',
    date: 'Apr 18, 2025',
    amount: 'Rp 275,000',
    icon: '🍽️',
  },
  {
    id: '4',
    type: 'expense',
    title: 'Movie Tickets',
    date: 'Apr 19, 2025',
    amount: 'Rp 150,000',
    icon: '🎬',
  },
];

const HomeScreen = ({ navigation }) => {
  // Fungsi untuk menampilkan item transaksi
  const renderTransactionItem = ({ item }) => {
    if (!item) return null;
    
    return (
      <TouchableOpacity
        style={styles.transactionItem}
        onPress={() => navigation.navigate('TransactionDetail', { transaction: item })}
      >
        <View style={styles.transactionIconContainer}>
          <Text style={styles.transactionIcon}>{item.icon}</Text>
        </View>
        <View style={styles.transactionInfo}>
          <Text style={styles.transactionTitle}>{item.title}</Text>
          <Text style={styles.transactionDate}>{item.date}</Text>
        </View>
        <Text
          style={[
            styles.transactionAmount,
            item.type === 'income' ? styles.incomeText : styles.expenseText,
          ]}
        >
          {item.type === 'income' ? '+' : '-'} {item.amount}
        </Text>
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.mainContainer}>
        {/* Header with user greeting and profile */}
        <View style={styles.header}>
          <View>
            <Text style={styles.greeting}>Hello,</Text>
            <Text style={styles.userName}>John Doe</Text>
          </View>
          <TouchableOpacity
            style={styles.profileContainer}
            onPress={() => navigation.navigate('Profile')}
          >
            <Text style={styles.profileIcon}>👤</Text>
          </TouchableOpacity>
        </View>

        {/* Balance Card */}
        <View style={styles.balanceCard}>
          <Text style={styles.balanceTitle}>Total Balance</Text>
          <Text style={styles.balanceAmount}>{balanceData.balance}</Text>
          
          <View style={styles.incomeExpenseContainer}>
            <View style={styles.incomeContainer}>
              <Text style={styles.incomeExpenseTitle}>Income</Text>
              <Text style={[styles.incomeExpenseAmount, styles.incomeText]}>
                {balanceData.income}
              </Text>
            </View>
            <View style={styles.divider}></View>
            <View style={styles.expenseContainer}>
              <Text style={styles.incomeExpenseTitle}>Expense</Text>
              <Text style={[styles.incomeExpenseAmount, styles.expenseText]}>
                {balanceData.expense}
              </Text>
            </View>
          </View>
        </View>

        {/* Quick Actions */}
        <View style={styles.sectionContainer}>
          <Text style={styles.sectionTitle}>Quick Actions</Text>
          <View style={styles.quickActionsContainer}>
            {quickActions.map((item) => (
              <TouchableOpacity
                key={item.id}
                style={styles.quickActionItem}
                onPress={() => navigation.navigate(item.screen)}
              >
                <View style={styles.quickActionIconContainer}>
                  <Text style={styles.quickActionIcon}>{item.icon}</Text>
                </View>
                <Text style={styles.quickActionTitle}>{item.title}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Recent Transactions - Section Header */}
        <View style={styles.sectionHeaderContainer}>
          <Text style={styles.sectionTitle}>Recent Transactions</Text>
          <TouchableOpacity onPress={() => navigation.navigate('Transactions')}>
            <Text style={styles.seeAllText}>See All</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Recent Transactions - FlatList (outside ScrollView) */}
      <FlatList
        data={recentTransactions}
        keyExtractor={(item) => item.id}
        renderItem={renderTransactionItem}
        contentContainerStyle={styles.transactionsList}
        style={styles.transactionsContainer}
      />

      {/* Bottom Tab Bar (will be replaced with a proper tab navigator later) */}
      <View style={styles.bottomTabBar}>
        <TouchableOpacity style={styles.tabItem} onPress={() => {}}>
          <Text style={[styles.tabIcon, styles.activeTabIcon]}>🏠</Text>
          <Text style={[styles.tabText, styles.activeTabText]}>Home</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={styles.tabItem} 
          onPress={() => navigation.navigate('Transactions')}
        >
          <Text style={styles.tabIcon}>📊</Text>
          <Text style={styles.tabText}>History</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={styles.tabItem} 
          onPress={() => navigation.navigate('Cards')}
        >
          <Text style={styles.tabIcon}>💳</Text>
          <Text style={styles.tabText}>Cards</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={styles.tabItem} 
          onPress={() => navigation.navigate('Profile')}
        >
          <Text style={styles.tabIcon}>👤</Text>
          <Text style={styles.tabText}>Profile</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  mainContainer: {
    padding: SIZES.padding,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  greeting: {
    ...FONTS.regular,
    fontSize: SIZES.font,
    color: COLORS.text.secondary,
  },
  userName: {
    ...FONTS.bold,
    fontSize: SIZES.large,
    color: COLORS.text.primary,
  },
  profileContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: COLORS.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  profileIcon: {
    fontSize: SIZES.large,
    color: COLORS.background,
  },
  balanceCard: {
    backgroundColor: COLORS.primary,
    borderRadius: SIZES.radius,
    padding: 20,
    marginBottom: 24,
  },
  balanceTitle: {
    ...FONTS.regular,
    fontSize: SIZES.font,
    color: 'rgba(255, 255, 255, 0.8)',
    marginBottom: 8,
  },
  balanceAmount: {
    ...FONTS.bold,
    fontSize: SIZES.xxl,
    color: COLORS.background,
    marginBottom: 20,
  },
  incomeExpenseContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: SIZES.radius,
    padding: 15,
  },
  incomeContainer: {
    flex: 1,
    alignItems: 'center',
  },
  expenseContainer: {
    flex: 1,
    alignItems: 'center',
  },
  divider: {
    width: 1,
    height: '100%',
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
  },
  incomeExpenseTitle: {
    ...FONTS.regular,
    fontSize: SIZES.small,
    color: 'rgba(255, 255, 255, 0.8)',
    marginBottom: 5,
  },
  incomeExpenseAmount: {
    ...FONTS.bold,
    fontSize: SIZES.medium,
    color: COLORS.background,
  },
  incomeText: {
    color: '#4CD964',
  },
  expenseText: {
    color: '#FF3B30',
  },
  sectionContainer: {
    marginBottom: 24,
  },
  sectionHeaderContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    ...FONTS.bold,
    fontSize: SIZES.large,
    color: COLORS.text.primary,
    marginBottom: 16,
  },
  seeAllText: {
    ...FONTS.medium,
    fontSize: SIZES.font,
    color: COLORS.primary,
  },
  quickActionsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  quickActionItem: {
    alignItems: 'center',
    width: '22%',
  },
  quickActionIconContainer: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: 'rgba(76, 175, 80, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  quickActionIcon: {
    fontSize: SIZES.xl,
  },
  quickActionTitle: {
    ...FONTS.medium,
    fontSize: SIZES.small,
    color: COLORS.text.primary,
  },
  transactionsContainer: {
    flex: 1,
  },
  transactionsList: {
    paddingHorizontal: SIZES.padding,
    paddingBottom: 90, // Ruang untuk bottom tab bar
  },
  transactionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.background,
    borderRadius: SIZES.radius,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: 'rgba(0, 0, 0, 0.05)',
  },
  transactionIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(76, 175, 80, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  transactionIcon: {
    fontSize: SIZES.large,
  },
  transactionInfo: {
    flex: 1,
  },
  transactionTitle: {
    ...FONTS.medium,
    fontSize: SIZES.medium,
    color: COLORS.text.primary,
    marginBottom: 4,
  },
  transactionDate: {
    ...FONTS.regular,
    fontSize: SIZES.small,
    color: COLORS.text.secondary,
  },
  transactionAmount: {
    ...FONTS.bold,
    fontSize: SIZES.medium,
  },
  bottomTabBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 70,
    backgroundColor: COLORS.background,
    borderTopWidth: 1,
    borderTopColor: 'rgba(0, 0, 0, 0.05)',
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingBottom: Platform.OS === 'ios' ? 20 : 0,
  },
  tabItem: {
    alignItems: 'center',
  },
  tabIcon: {
    fontSize: SIZES.xl,
    marginBottom: 4,
    color: COLORS.text.secondary,
  },
  activeTabIcon: {
    color: COLORS.primary,
  },
  tabText: {
    ...FONTS.regular,
    fontSize: SIZES.small,
    color: COLORS.text.secondary,
  },
  activeTabText: {
    ...FONTS.medium,
    color: COLORS.primary,
  },
});

export default HomeScreen;