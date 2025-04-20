import React, { useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  FlatList,
  TextInput,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

// Konstanta untuk tema
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

// Data kategori pembayaran
const paymentCategories = [
  {
    id: '1',
    name: 'Tagihan',
    icon: '📃',
    services: [
      { id: '101', name: 'Listrik', icon: '⚡️', code: 'PLN' },
      { id: '102', name: 'Air', icon: '💧', code: 'PDAM' },
      { id: '103', name: 'Internet', icon: '🌐', code: 'NET' },
      { id: '104', name: 'TV Kabel', icon: '📺', code: 'TV' },
    ]
  },
  {
    id: '2',
    name: 'Pulsa & Paket Data',
    icon: '📱',
    services: [
      { id: '201', name: 'Telkomsel', icon: '📱', code: 'TSEL' },
      { id: '202', name: 'Indosat', icon: '📱', code: 'ISAT' },
      { id: '203', name: 'XL', icon: '📱', code: 'XL' },
      { id: '204', name: 'Smartfren', icon: '📱', code: 'SMRT' },
    ]
  },
  {
    id: '3',
    name: 'Belanja',
    icon: '🛒',
    services: [
      { id: '301', name: 'Supermarket', icon: '🏪', code: 'MRKT' },
      { id: '302', name: 'E-Commerce', icon: '🛍️', code: 'ECOM' },
      { id: '303', name: 'Makanan', icon: '🍔', code: 'FOOD' },
      { id: '304', name: 'Fashion', icon: '👕', code: 'FASH' },
    ]
  },
  {
    id: '4',
    name: 'Transportasi',
    icon: '🚗',
    services: [
      { id: '401', name: 'Gojek', icon: '🏍️', code: 'GJEK' },
      { id: '402', name: 'Grab', icon: '🚕', code: 'GRAB' },
      { id: '403', name: 'Tiket KAI', icon: '🚆', code: 'TKAI' },
      { id: '404', name: 'Tiket Pesawat', icon: '✈️', code: 'TAIR' },
    ]
  },
  {
    id: '5',
    name: 'Pendidikan',
    icon: '🎓',
    services: [
      { id: '501', name: 'SPP', icon: '🏫', code: 'SPP' },
      { id: '502', name: 'Kursus', icon: '📚', code: 'CRSE' },
      { id: '503', name: 'Buku', icon: '📖', code: 'BOOK' },
      { id: '504', name: 'Beasiswa', icon: '🎯', code: 'SCHP' },
    ]
  },
  {
    id: '6',
    name: 'Hiburan',
    icon: '🎬',
    services: [
      { id: '601', name: 'Streaming', icon: '📺', code: 'STRM' },
      { id: '602', name: 'Game', icon: '🎮', code: 'GAME' },
      { id: '603', name: 'Musik', icon: '🎵', code: 'MUSC' },
      { id: '604', name: 'Tiket Event', icon: '🎟️', code: 'TCKT' },
    ]
  },
];

// Data riwayat pembayaran terbaru
const recentPayments = [
  { id: '1', name: 'Listrik', amount: 'Rp 250,000', date: '20 Mar 2025', icon: '⚡️', no: '1234567890' },
  { id: '2', name: 'Pulsa Telkomsel', amount: 'Rp 100,000', date: '18 Mar 2025', icon: '📱', no: '081234567890' },
  { id: '3', name: 'Netflix', amount: 'Rp 159,000', date: '15 Mar 2025', icon: '📺', no: 'user@example.com' },
  { id: '4', name: 'Spotify', amount: 'Rp 59,000', date: '10 Mar 2025', icon: '🎵', no: 'user@example.com' },
];

const PayScreen = ({ navigation }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState(null);

  // Fungsi pencarian
  const filteredCategories = searchQuery
    ? paymentCategories.filter(category => 
        category.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        category.services.some(service => 
          service.name.toLowerCase().includes(searchQuery.toLowerCase())
        )
      )
    : paymentCategories;

  // Render item kategori pembayaran
  const renderCategoryItem = ({ item }) => (
    <TouchableOpacity
      style={[
        styles.categoryItem,
        selectedCategory?.id === item.id && styles.selectedCategoryItem
      ]}
      onPress={() => setSelectedCategory(item)}
    >
      <View style={styles.categoryIconContainer}>
        <Text style={styles.categoryIcon}>{item.icon}</Text>
      </View>
      <Text style={styles.categoryName}>{item.name}</Text>
    </TouchableOpacity>
  );

  // Render item riwayat pembayaran
  const renderRecentItem = ({ item }) => (
    <TouchableOpacity
      style={styles.recentItem}
      onPress={() => navigation.navigate('PayDetail', { service: item })}
    >
      <View style={styles.recentItemIconContainer}>
        <Text style={styles.recentItemIcon}>{item.icon}</Text>
      </View>
      <View style={styles.recentItemInfo}>
        <Text style={styles.recentItemName}>{item.name}</Text>
        <Text style={styles.recentItemDetail}>{item.no}</Text>
      </View>
      <View style={styles.recentItemAmount}>
        <Text style={styles.recentItemAmountText}>{item.amount}</Text>
        <Text style={styles.recentItemDate}>{item.date}</Text>
      </View>
    </TouchableOpacity>
  );

  // Render item layanan untuk kategori yang dipilih
  const renderServiceItem = ({ item }) => (
    <TouchableOpacity
      style={styles.serviceItem}
      onPress={() => navigation.navigate('PayDetail', { service: item })}
    >
      <View style={styles.serviceIconContainer}>
        <Text style={styles.serviceIcon}>{item.icon}</Text>
      </View>
      <Text style={styles.serviceName}>{item.name}</Text>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.backButton}>←</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Pembayaran</Text>
        <View style={{ width: 24 }} />
      </View>

      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <View style={styles.searchBar}>
          <Text style={styles.searchIcon}>🔍</Text>
          <TextInput
            style={styles.searchInput}
            placeholder="Cari layanan..."
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity onPress={() => setSearchQuery('')}>
              <Text style={styles.clearIcon}>✕</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.scrollView}>
        {/* Categories */}
        <View style={styles.categoriesSection}>
          <Text style={styles.sectionTitle}>Kategori</Text>
          <FlatList
            data={filteredCategories}
            renderItem={renderCategoryItem}
            keyExtractor={item => item.id}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.categoriesList}
          />
        </View>

        {/* Selected Category Services */}
        {selectedCategory && (
          <View style={styles.servicesSection}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>{selectedCategory.name}</Text>
              <TouchableOpacity onPress={() => setSelectedCategory(null)}>
                <Text style={styles.viewAllText}>Tutup</Text>
              </TouchableOpacity>
            </View>
            <View style={styles.servicesGrid}>
              {selectedCategory.services.map(service => (
                <TouchableOpacity
                  key={service.id}
                  style={styles.serviceItem}
                  onPress={() => navigation.navigate('PayDetail', { service })}
                >
                  <View style={styles.serviceIconContainer}>
                    <Text style={styles.serviceIcon}>{service.icon}</Text>
                  </View>
                  <Text style={styles.serviceName}>{service.name}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        )}

        {/* Recent Payments */}
        <View style={styles.recentSection}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Pembayaran Terakhir</Text>
            <TouchableOpacity onPress={() => navigation.navigate('PayHistory')}>
              <Text style={styles.viewAllText}>Lihat Semua</Text>
            </TouchableOpacity>
          </View>
          {recentPayments.map(payment => (
            <TouchableOpacity
              key={payment.id}
              style={styles.recentItem}
              onPress={() => navigation.navigate('PayDetail', { service: payment })}
            >
              <View style={styles.recentItemIconContainer}>
                <Text style={styles.recentItemIcon}>{payment.icon}</Text>
              </View>
              <View style={styles.recentItemInfo}>
                <Text style={styles.recentItemName}>{payment.name}</Text>
                <Text style={styles.recentItemDetail}>{payment.no}</Text>
              </View>
              <View style={styles.recentItemAmount}>
                <Text style={styles.recentItemAmountText}>{payment.amount}</Text>
                <Text style={styles.recentItemDate}>{payment.date}</Text>
              </View>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: SIZES.padding,
    paddingBottom: 10,
  },
  backButton: {
    fontSize: 28,
    color: COLORS.text.primary,
  },
  headerTitle: {
    ...FONTS.bold,
    fontSize: SIZES.large,
    color: COLORS.text.primary,
  },
  searchContainer: {
    paddingHorizontal: SIZES.padding,
    paddingBottom: SIZES.padding,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F5F5F5',
    borderRadius: SIZES.radius,
    paddingHorizontal: 12,
  },
  searchIcon: {
    fontSize: 16,
    color: COLORS.text.secondary,
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    height: 44,
    fontSize: SIZES.medium,
  },
  clearIcon: {
    fontSize: 16,
    color: COLORS.text.secondary,
    padding: 4,
  },
  scrollView: {
    flexGrow: 1,
    paddingBottom: 30,
  },
  categoriesSection: {
    marginBottom: 24,
  },
  sectionTitle: {
    ...FONTS.bold,
    fontSize: SIZES.medium,
    color: COLORS.text.primary,
    paddingHorizontal: SIZES.padding,
    marginBottom: 16,
  },
  categoriesList: {
    paddingLeft: SIZES.padding,
    paddingRight: 8,
  },
  categoryItem: {
    alignItems: 'center',
    marginRight: 12,
    width: 80,
  },
  selectedCategoryItem: {
    opacity: 0.8,
  },
  categoryIconContainer: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: 'rgba(76, 175, 80, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  categoryIcon: {
    fontSize: 24,
  },
  categoryName: {
    ...FONTS.medium,
    fontSize: SIZES.small,
    color: COLORS.text.primary,
    textAlign: 'center',
  },
  servicesSection: {
    marginBottom: 24,
    backgroundColor: 'rgba(76, 175, 80, 0.05)',
    paddingVertical: 16,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: SIZES.padding,
    marginBottom: 16,
  },
  viewAllText: {
    ...FONTS.medium,
    fontSize: SIZES.font,
    color: COLORS.primary,
  },
  servicesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: SIZES.padding,
  },
  serviceItem: {
    width: '25%',
    alignItems: 'center',
    marginBottom: 16,
  },
  serviceIconContainer: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: 'rgba(76, 175, 80, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  serviceIcon: {
    fontSize: 20,
  },
  serviceName: {
    ...FONTS.medium,
    fontSize: SIZES.small,
    color: COLORS.text.primary,
    textAlign: 'center',
  },
  recentSection: {
    marginBottom: 24,
  },
  recentItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: SIZES.padding,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0, 0, 0, 0.05)',
  },
  recentItemIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(76, 175, 80, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  recentItemIcon: {
    fontSize: 18,
  },
  recentItemInfo: {
    flex: 1,
  },
  recentItemName: {
    ...FONTS.medium,
    fontSize: SIZES.medium,
    color: COLORS.text.primary,
    marginBottom: 4,
  },
  recentItemDetail: {
    ...FONTS.regular,
    fontSize: SIZES.small,
    color: COLORS.text.secondary,
  },
  recentItemAmount: {
    alignItems: 'flex-end',
  },
  recentItemAmountText: {
    ...FONTS.bold,
    fontSize: SIZES.medium,
    color: COLORS.text.primary,
    marginBottom: 4,
  },
  recentItemDate: {
    ...FONTS.regular,
    fontSize: SIZES.small,
    color: COLORS.text.secondary,
  },
});

export default PayScreen;