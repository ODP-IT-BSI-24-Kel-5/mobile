import React, { useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Logo from '../components/Logo';
import FormInput from '../components/FormInput';
import Button from '../components/Button';
import { COLORS, SIZES, FONTS } from '../constants/theme';

const ForgotPasswordScreen = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleResetPassword = () => {
    if (!email) {
      Alert.alert('Error', 'Please enter your email address');
      return;
    }

    // Simulasi proses pengiriman email reset password
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      Alert.alert(
        'Success',
        'If an account exists with that email, we\'ve sent password reset instructions.',
        [
          {
            text: 'OK',
            onPress: () => navigation.navigate('Login'),
          },
        ]
      );
    }, 2000);
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

          {/* Header */}
          <Text style={styles.title}>Forgot Password</Text>
          <Text style={styles.subtitle}>
            Please enter your email address. We'll send you instructions to reset your password.
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

          {/* Reset Password Button */}
          <Button
            title="Reset Password"
            onPress={handleResetPassword}
            loading={isLoading}
            disabled={!email || isLoading}
            style={{ marginTop: 20 }}
          />

          {/* Back to Login */}
          <TouchableOpacity 
            style={styles.backToLoginButton} 
            onPress={() => navigation.navigate('Login')}
          >
            <Text style={styles.backToLoginText}>Back to Login</Text>
          </TouchableOpacity>
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
  backToLoginButton: {
    marginTop: 20,
    alignItems: 'center',
  },
  backToLoginText: {
    ...FONTS.medium,
    color: COLORS.primary,
    fontSize: SIZES.medium,
  },
});

export default ForgotPasswordScreen;