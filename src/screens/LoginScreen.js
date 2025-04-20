import React, { useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Logo from '../components/Logo';
import FormInput from '../components/FormInput';
import Button from '../components/Button';
import Checkbox from '../components/Checkbox';

// Karena mungkin file tema belum dibuat
const COLORS = {
  primary: '#4CAF50',
  background: '#FFFFFF',
  text: {
    primary: '#333333',
    secondary: '#666666',
  },
};

const SIZES = {
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

const LoginScreen = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = () => {
    // Validasi form
    if (!email || !password) {
      console.log('Email dan password harus diisi');
      return;
    }

    // Simulasi proses login
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      // Logic untuk login akan ditambahkan nanti
      console.log('Login with:', { email, password, rememberMe });
      // Navigate to Home screen
      navigation.navigate('Home');
    }, 1500);
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1 }}
      >
        <ScrollView contentContainerStyle={styles.scrollView}>
          {/* Logo */}
          <View style={styles.logoContainer}>
            <Logo size="medium" />
          </View>

          {/* Sign In Header */}
          <Text style={styles.title}>Sign In</Text>
          <Text style={styles.subtitle}>
            Welcome back! Please log in to your account with registered email and password.
          </Text>

          {/* Email Input */}
          <FormInput 
            label="Email Address"
            placeholder="name@example.com"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
            icon="✉️"
          />

          {/* Password Input */}
          <FormInput 
            label="Password"
            placeholder="Enter your 8 character password"
            value={password}
            onChangeText={setPassword}
            isPassword={true}
            showPassword={showPassword}
            setShowPassword={setShowPassword}
            icon="🔒"
          />

          {/* Remember Me and Forgot Password */}
          <View style={styles.rememberForgotContainer}>
            <Checkbox 
              checked={rememberMe} 
              onPress={() => setRememberMe(!rememberMe)}
              label="Remember me"
            />

            <TouchableOpacity onPress={() => navigation.navigate('ForgotPassword')}>
              <Text style={styles.forgotPasswordText}>Forgot Password</Text>
            </TouchableOpacity>
          </View>

          {/* Sign In Button */}
          <Button 
            title="Sign In" 
            onPress={handleLogin} 
            style={{ marginBottom: 20 }}
            loading={isLoading}
            disabled={isLoading}
          />

          {/* Register Now Section */}
          <View style={styles.registerContainer}>
            <Text style={styles.orText}>Or</Text>
            <View style={styles.registerTextContainer}>
              <Text style={styles.noAccountText}>Don't have an account? </Text>
              <TouchableOpacity onPress={() => navigation.navigate('Register')}>
                <Text style={styles.registerText}>Register Now</Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  scrollView: {
    flexGrow: 1,
    padding: SIZES.padding,
  },
  logoContainer: {
    marginBottom: 30,
  },
  title: {
    ...FONTS.bold,
    fontSize: SIZES.xxl,
    marginBottom: 10,
    color: COLORS.text.primary,
  },
  subtitle: {
    ...FONTS.regular,
    fontSize: SIZES.medium,
    color: COLORS.text.secondary,
    marginBottom: 30,
  },
  rememberForgotContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 30,
  },
  forgotPasswordText: {
    ...FONTS.regular,
    fontSize: SIZES.font,
    color: COLORS.primary,
  },
  registerContainer: {
    alignItems: 'center',
  },
  orText: {
    ...FONTS.regular,
    color: COLORS.text.secondary,
    marginBottom: 10,
  },
  registerTextContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  noAccountText: {
    ...FONTS.regular,
    color: COLORS.text.secondary,
    fontSize: SIZES.font,
  },
  registerText: {
    ...FONTS.medium,
    color: COLORS.primary,
    fontSize: SIZES.font,
  },
});

export default LoginScreen;