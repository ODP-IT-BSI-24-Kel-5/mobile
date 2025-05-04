import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, Button, TouchableOpacity, Linking } from 'react-native';
// import { BarCodeScanner } from 'expo-barcode-scanner';
// import { useRouter } from 'expo-router';
// import { Ionicons } from '@expo/vector-icons';
// import { StatusBar } from 'expo-status-bar';

export default function QrScanScreen() {
  // const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  // const [scanned, setScanned] = useState(false);
  // const router = useRouter();

  // useEffect(() => {
  //   (async () => {
  //     const { status } = await BarCodeScanner.requestPermissionsAsync();
  //     setHasPermission(status === 'granted');
  //   })();
  // }, []);

  // const handleBarCodeScanned = (result: any) => { // Gunakan tipe any untuk sementara
  //   setScanned(true);
  //   if (result && result.type && result.data) {
  //     // Navigasi kembali ke TransferSameAppScreen dan kirim data nomor wallet
  //     router.push({
  //       pathname: '/transfer-same-app',
  //       params: { walletNumber: result.data },
  //     });
  //   } else {
  //     console.warn('Hasil pemindaian tidak valid:', result);
  //     // Mungkin tambahkan logika untuk memberi tahu pengguna bahwa kode QR tidak valid
  //   }
  // };

  // if (hasPermission === null) {
  //   return <Text className="flex-1 justify-center items-center">Meminta izin kamera...</Text>;
  // }
  // if (hasPermission === false) {
  //   return (
  //     <View className="flex-1 justify-center items-center p-6">
  //       <Text className="text-lg mb-4 text-center">Tidak ada akses ke kamera</Text>
  //       <Button title="Buka Pengaturan" onPress={() => Linking.openSettings()} />
  //     </View>
  //   );
  // }

  // return (
  //   <View className="flex-1 bg-black">
  //     <StatusBar style="light" />
  //     <BarCodeScanner
  //       onBarCodeScanned={scanned ? undefined : handleBarCodeScanned}
  //       style={StyleSheet.absoluteFillObject}
  //     />

  //     <View className="absolute top-12 left-4">
  //       <TouchableOpacity onPress={() => router.back()}>
  //         <Ionicons name="arrow-back" size={32} color="white" />
  //       </TouchableOpacity>
  //     </View>

  //     {scanned && (
  //       <View className="absolute bottom-24 left-0 right-0 items-center">
  //         <TouchableOpacity
  //           className="bg-white/50 rounded-lg py-3 px-6"
  //           onPress={() => setScanned(false)}
  //         >
  //           <Text className="text-white text-lg">Tap untuk memindai lagi</Text>
  //         </TouchableOpacity>
  //       </View>
  //     )}
  //   </View>
  // );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'center',
  },
});