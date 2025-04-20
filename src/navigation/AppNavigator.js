import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

// Import screens
import LoginScreen from '../screens/LoginScreen';
import RegisterScreen from '../screens/RegisterScreen';
import ForgotPasswordScreen from '../screens/ForgotPasswordScreen';
import HomeScreen from '../screens/HomeScreen';
import TransferScreen from '../screens/TransferScreen';
import TransferConfirmationScreen from '../screens/TransferConfirmationScreen';
import TransferSuccessScreen from '../screens/TransferSuccessScreen';
import TopUpScreen from '../screens/TopUpScreen';
import TopUpConfirmationScreen from '../screens/TopUpConfirmationScreen';
import TopUpSuccessScreen from '../screens/TopUpSuccessScreen';
import PayScreen from '../screens/PayScreen';
import PayDetailScreen from '../screens/PayDetailScreen';
import PayConfirmationScreen from '../screens/PayConfirmationScreen';
import PaySuccessScreen from '../screens/PaySuccessScreen';

const Stack = createStackNavigator();

const AppNavigator = () => {
  // Untuk tujuan demo, kita anggap user belum login
  const isLoggedIn = false;
  
  return (
    <NavigationContainer>
      <Stack.Navigator 
        initialRouteName={isLoggedIn ? "Home" : "Login"} 
        screenOptions={{ headerShown: false }}
      >
        {/* Auth screens */}
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="Register" component={RegisterScreen} />
        <Stack.Screen name="ForgotPassword" component={ForgotPasswordScreen} />
        
        {/* App screens */}
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="Transfer" component={TransferScreen} />
        <Stack.Screen name="TransferConfirmation" component={TransferConfirmationScreen} />
        <Stack.Screen name="TransferSuccess" component={TransferSuccessScreen} />
        <Stack.Screen name="TopUp" component={TopUpScreen} />
        <Stack.Screen name="TopUpConfirmation" component={TopUpConfirmationScreen} />
        <Stack.Screen name="TopUpSuccess" component={TopUpSuccessScreen} />
        <Stack.Screen name="Pay" component={PayScreen} />
        <Stack.Screen name="PayDetail" component={PayDetailScreen} />
        <Stack.Screen name="PayConfirmation" component={PayConfirmationScreen} />
        <Stack.Screen name="PaySuccess" component={PaySuccessScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;