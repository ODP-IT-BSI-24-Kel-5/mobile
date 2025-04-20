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
import { COLORS, SIZES, FONTS } from '../constants/theme';

const RegisterScreen = ({ navigation }) => {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [agreeToTerms, setAgreeToTerms] = useState(false);

  const [isLoading, setIsLoading] = useState(false);

  const handleRegister = () => {
    // Validasi form
    if (!fullName || !email || !password || !phoneNumber || !agreeToTerms) {
      console.log('Mohon lengkapi semua field dan setujui syarat & ketentuan');
      return;
    }

    // Simulasi proses pendaftaran
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      // Logic untuk pendaftaran akan ditambahkan nanti
      console.log('Register with:', { fullName, email, password, phoneNumber });
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

          {/* Register Header */}
          <Text style={styles.title}>Register</Text>
          <View style={styles.subtitleContainer}>
            <Text style={styles.subtitle}>
              Please fill in the fields below to register a new account. Already have an account?{' '}
            </Text>
            <TouchableOpacity onPress={() => navigation.navigate('Login')}>
              <Text style={styles.loginLink}>Sign In Here</Text>
            </TouchableOpacity>
          </View>

          {/* Full Name Input */}
          <FormInput 
            label="Full Name"
            placeholder="Enter your full name"
            value={fullName}
            onChangeText={setFullName}
            icon="👤"
          />

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
            placeholder="Type your password"
            value={password}
            onChangeText={setPassword}
            isPassword={true}
            showPassword={showPassword}
            setShowPassword={setShowPassword}
            icon="🔒"
          />

          {/* Phone Number Input */}
          <FormInput 
            label="Phone Number"
            placeholder="Enter your phone number"
            value={phoneNumber}
            onChangeText={setPhoneNumber}
            keyboardType="phone-pad"
            icon="📱"
          />

          {/* Terms & Conditions Checkbox */}
          <View style={styles.termsContainer}>
            <Checkbox 
              checked={agreeToTerms} 
              onPress={() => setAgreeToTerms(!agreeToTerms)}
            />
            <View style={styles.termsTextContainer}>
              <Text style={styles.termsText}>By registering, you agree to our </Text>
              <TouchableOpacity onPress={() => navigation.navigate('PrivacyPolicy')}>
                <Text style={styles.termsLink}>Privacy Policy</Text>
              </TouchableOpacity>
              <Text style={styles.termsText}> and </Text>
              <TouchableOpacity onPress={() => navigation.navigate('TermsConditions')}>
                <Text style={styles.termsLink}>Terms & Conditions</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Register Button */}
          <Button 
            title="Register" 
            onPress={handleRegister}
            disabled={!fullName || !email || !password || !phoneNumber || !agreeToTerms || isLoading}
            loading={isLoading}
          />
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
  subtitleContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 30,
  },
  subtitle: {
    ...FONTS.regular,
    fontSize: SIZES.medium,
    color: COLORS.text.secondary,
  },
  loginLink: {
    ...FONTS.medium,
    fontSize: SIZES.medium,
    color: COLORS.primary,
  },
  termsContainer: {
    flexDirection: 'row',
    marginBottom: 30,
    alignItems: 'flex-start',
  },
  termsTextContainer: {
    flex: 1,
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginLeft: 8,
  },
  termsText: {
    ...FONTS.regular,
    fontSize: SIZES.font,
    color: COLORS.text.primary,
  },
  termsLink: {
    ...FONTS.medium,
    fontSize: SIZES.font,
    color: COLORS.primary,
  },
});

export default RegisterScreen;