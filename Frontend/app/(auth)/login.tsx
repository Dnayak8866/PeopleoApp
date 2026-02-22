import { Colors } from '@/constants/Colors';
import { useAuth } from '@/context/AuthContext';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import React, { useState } from 'react';
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';

export default function LoginScreen() {
  const [number, setNumber] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { login: authLogin } = useAuth();

  const handleLogin = async () => {
    if (!number.trim()) {
      setError('Please enter your phone number.');
      return;
    }
    if (number?.length < 10) {
      setError('Please enter a valid phone number.');
      return;
    }
    if (!password.trim()) {
      setError('Please enter your password.');
      return;
    }
    if (password?.length < 6) {
      setError('Password must be at least 6 characters long.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const success = await authLogin(number, password);
      if (success) {
        setError('');
        router.replace('/loader');
      } else {
        setError('Login failed. Please check your credentials.');
      }
    } catch (err) {
      console.error('Login error:', err);
      setError('Login failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = () => {
    Alert.alert('Forgot Password feature will be available soon.');
  }

  const handleContactSupport = () => {
    Alert.alert('Contact HR Support feature will be available soon.');
  }

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >

        {/* Title Section */}
        <Text style={styles.title}>Peopleo Login</Text>
        <Text style={styles.subtitle}>Welcome back! Please enter your details.</Text>

        {/* Login Card */}
        <View style={styles.card}>
          {/* Employee ID or Email Field */}
          <Text style={styles.label}>Phone Number</Text>
          <View style={styles.inputContainer}>
            <Ionicons name="person-outline" size={20} color="#A0AEC0" style={styles.inputIcon} />
            <TextInput
              style={styles.input}
              placeholder="Enter Phone Number"
              placeholderTextColor="#A0AEC0"
              value={number}
              onChangeText={setNumber}
              autoCapitalize="none"
              autoCorrect={false}
              keyboardType="numeric"
              maxLength={10}
            />
          </View>

          {/* Password Field */}
          <View style={styles.passwordHeader}>
            <Text style={styles.label}>Password</Text>
            <TouchableOpacity onPress={handleForgotPassword}>
              <Text style={styles.forgotPassword}>Forgot Password?</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.inputContainer}>
            <Ionicons name="lock-closed-outline" size={20} color="#A0AEC0" style={styles.inputIcon} />
            <TextInput
              style={styles.input}
              placeholder="••••••••"
              placeholderTextColor="#A0AEC0"
              secureTextEntry={!showPassword}
              value={password}
              onChangeText={setPassword}
              autoCapitalize="none"
              autoCorrect={false}
              maxLength={16}
            />
            <TouchableOpacity
              onPress={() => setShowPassword(!showPassword)}
              style={styles.eyeIcon}
            >
              <Ionicons
                name={showPassword ? 'eye-outline' : 'eye-off-outline'}
                size={22}
                color="#A0AEC0"
              />
            </TouchableOpacity>
          </View>

          {/* Remember Me Checkbox */}
          <TouchableOpacity
            style={styles.rememberContainer}
            onPress={() => setRememberMe(!rememberMe)}
            activeOpacity={0.7}
          >
            <View style={[styles.checkbox, rememberMe && styles.checkboxChecked]}>
              {rememberMe && (
                <Ionicons name="checkmark" size={14} color="#fff" />
              )}
            </View>
            <Text style={styles.rememberText}>Remember me for 30 days</Text>
          </TouchableOpacity>

          {/* Error Message */}
          {error ? <Text style={styles.error}>{error}</Text> : null}

          {/* Login Button */}
          <TouchableOpacity
            style={[styles.loginButton, loading && styles.loginButtonDisabled]}
            onPress={handleLogin}
            disabled={loading}
            activeOpacity={0.8}
          >
            <Text style={styles.loginButtonText}>
              {loading ? 'Logging in...' : 'Login'}
            </Text>
          </TouchableOpacity>
        </View>

        {/* Contact Support Section */}
        <View style={styles.supportContainer}>
          <Text style={styles.supportText}>Having trouble logging in?</Text>
          <TouchableOpacity onPress={handleContactSupport}>
            <Text style={styles.supportLink}>Contact HR Support</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      <StatusBar style="dark" />
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 24,
    paddingTop: 60,
    paddingBottom: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconContainer: {
    marginBottom: 24,
  },
  iconBackground: {
    width: 90,
    height: 90,
    borderRadius: 20,
    backgroundColor: Colors.primaryLight,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: Colors.primaryText,
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 15,
    color: '#6B7280',
    marginBottom: 32,
    textAlign: 'center',
  },
  card: {
    width: '100%',
    maxWidth: 400,
    backgroundColor: '#fff',
    borderRadius: 24,
    padding: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 16,
    elevation: 8,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.primaryText,
    marginBottom: 8,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    backgroundColor: '#FAFAFA',
    borderRadius: 12,
    marginBottom: 20,
    paddingHorizontal: 14,
  },
  inputIcon: {
    marginRight: 10,
  },
  input: {
    flex: 1,
    fontSize: 15,
    color: Colors.primaryText,
    paddingVertical: 14,
  },
  eyeIcon: {
    padding: 4,
  },
  passwordHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  forgotPassword: {
    fontSize: 13,
    color: Colors.primary,
    fontWeight: '500',
  },
  rememberContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  checkbox: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#D1D5DB',
    marginRight: 10,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  checkboxChecked: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  rememberText: {
    fontSize: 14,
    color: '#6B7280',
  },
  error: {
    color: '#EF4444',
    fontSize: 13,
    marginBottom: 12,
    textAlign: 'left',
  },
  loginButton: {
    backgroundColor: Colors.primary,
    borderRadius: 14,
    paddingVertical: 16,
    alignItems: 'center',
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  loginButtonDisabled: {
    opacity: 0.7,
  },
  loginButtonText: {
    color: '#fff',
    fontSize: 17,
    fontWeight: '600',
    letterSpacing: 0.5,
  },
  supportContainer: {
    alignItems: 'center',
    marginTop: 32,
  },
  supportText: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 4,
  },
  supportLink: {
    fontSize: 14,
    color: Colors.primary,
    fontWeight: '600',
  },
  footer: {
    fontSize: 12,
    color: '#D1D5DB',
    marginTop: 40,
    letterSpacing: 1,
  },
  darkModeToggle: {
    position: 'absolute',
    bottom: 24,
    right: 24,
  },
  darkModeButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
});