import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import './global.css'

export default function Layout() {
  return (
    <>
      <StatusBar style="dark" />
      <Stack
        screenOptions={{
          headerShown: false,
          animation: 'slide_from_right',
        }}
      />
    </>
  );
}