import { Colors } from '@/constants/Colors';
import LoginIllustration from '@/components/illustrations/LoginIllustration';
import { useAuth } from '@/context/AuthContext';
import { showInfoToast } from '@/services/toast';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import React, { useRef, useState } from 'react';
import {
  Alert,
  Animated,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  Dimensions,
} from 'react-native';

const { width, height } = Dimensions.get('window');

export default function LoginScreen() {
  const [number, setNumber] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [phoneFocused, setPhoneFocused] = useState(false);
  const [passwordFocused, setPasswordFocused] = useState(false);
  const router = useRouter();
  const { login: authLogin } = useAuth();

  // Animated values for button press
  const buttonScale = useRef(new Animated.Value(1)).current;

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
    showInfoToast('Coming Soon', 'Forgot Password feature will be available soon.');
  };

  const handleContactSupport = () => {
    showInfoToast('Coming Soon', 'Contact HR Support feature will be available soon.');
  };

  const onPressIn = () => {
    Animated.spring(buttonScale, {
      toValue: 0.96,
      useNativeDriver: true,
    }).start();
  };

  const onPressOut = () => {
    Animated.spring(buttonScale, {
      toValue: 1,
      friction: 3,
      tension: 40,
      useNativeDriver: true,
    }).start();
  };

  return (
    <View style={styles.container}>
      <StatusBar style="dark" />
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardView}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 0}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
          bounces={false}
        >
          {/* Top Illustration Area */}
          <View style={styles.illustrationSection}>
            {/* Background gradient blobs */}
            <View style={styles.blobContainer}>
              <LinearGradient
                colors={['#e0e7ff', '#ede9fe', '#f5f3ff']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.blob1}
              />
              <LinearGradient
                colors={['#c7d2fe', '#ddd6fe', '#e9d5ff']}
                start={{ x: 1, y: 0 }}
                end={{ x: 0, y: 1 }}
                style={styles.blob2}
              />
            </View>

            {/* SVG Illustration */}
            <View style={styles.illustrationWrapper}>
              <LoginIllustration width={width * 0.85} height={width * 0.65} />
            </View>
          </View>

          {/* Content Area */}
          <View style={styles.contentSection}>
            {/* Welcome Text */}
            <View style={styles.welcomeContainer}>
              <Text style={styles.welcomeBack}>Welcome back</Text>
              <Text style={styles.appName}>
                Peopleo
                <Text style={styles.appNameDot}>.</Text>
              </Text>
              <Text style={styles.subtitle}>
                Sign in to manage your team effortlessly
              </Text>
            </View>

            {/* Form Card */}
            <View style={styles.formCard}>
              {/* Phone Number Field */}
              <View style={styles.fieldContainer}>
                <Text style={styles.label}>Phone Number</Text>
                <View
                  style={[
                    styles.inputContainer,
                    phoneFocused && styles.inputContainerFocused,
                  ]}
                >
                  <View
                    style={[
                      styles.inputIconWrapper,
                      phoneFocused && styles.inputIconWrapperFocused,
                    ]}
                  >
                    <Ionicons
                      name="phone-portrait-outline"
                      size={18}
                      color={phoneFocused ? '#6366f1' : '#94A3B8'}
                    />
                  </View>
                  <TextInput
                    style={styles.input}
                    placeholder="Enter your phone number"
                    placeholderTextColor="#94A3B8"
                    value={number}
                    onChangeText={setNumber}
                    autoCapitalize="none"
                    autoCorrect={false}
                    keyboardType="numeric"
                    maxLength={10}
                    onFocus={() => setPhoneFocused(true)}
                    onBlur={() => setPhoneFocused(false)}
                  />
                </View>
              </View>

              {/* Password Field */}
              <View style={styles.fieldContainer}>
                <View style={styles.passwordHeader}>
                  <Text style={styles.label}>Password</Text>
                  <TouchableOpacity
                    onPress={handleForgotPassword}
                    hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                  >
                    <Text style={styles.forgotPassword}>Forgot?</Text>
                  </TouchableOpacity>
                </View>
                <View
                  style={[
                    styles.inputContainer,
                    passwordFocused && styles.inputContainerFocused,
                  ]}
                >
                  <View
                    style={[
                      styles.inputIconWrapper,
                      passwordFocused && styles.inputIconWrapperFocused,
                    ]}
                  >
                    <Ionicons
                      name="lock-closed-outline"
                      size={18}
                      color={passwordFocused ? '#6366f1' : '#94A3B8'}
                    />
                  </View>
                  <TextInput
                    style={styles.input}
                    placeholder="••••••••"
                    placeholderTextColor="#94A3B8"
                    secureTextEntry={!showPassword}
                    value={password}
                    onChangeText={setPassword}
                    autoCapitalize="none"
                    autoCorrect={false}
                    maxLength={16}
                    onFocus={() => setPasswordFocused(true)}
                    onBlur={() => setPasswordFocused(false)}
                  />
                  <TouchableOpacity
                    onPress={() => setShowPassword(!showPassword)}
                    style={styles.eyeIcon}
                    hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                  >
                    <Ionicons
                      name={showPassword ? 'eye-outline' : 'eye-off-outline'}
                      size={20}
                      color={passwordFocused ? '#6366f1' : '#94A3B8'}
                    />
                  </TouchableOpacity>
                </View>
              </View>

              {/* Remember Me */}
              <TouchableOpacity
                style={styles.rememberRow}
                onPress={() => setRememberMe(!rememberMe)}
                activeOpacity={0.7}
              >
                <View
                  style={[styles.checkbox, rememberMe && styles.checkboxChecked]}
                >
                  {rememberMe && (
                    <Ionicons name="checkmark" size={11} color="#fff" />
                  )}
                </View>
                <Text style={styles.rememberText}>Remember me for 30 days</Text>
              </TouchableOpacity>

              {/* Error Message */}
              {error ? (
                <View style={styles.errorContainer}>
                  <Ionicons
                    name="alert-circle-outline"
                    size={16}
                    color="#ef4444"
                  />
                  <Text style={styles.errorText}>{error}</Text>
                </View>
              ) : null}

              {/* Login Button */}
              <Animated.View
                style={[
                  styles.buttonWrapper,
                  { transform: [{ scale: buttonScale }] },
                ]}
              >
                <TouchableOpacity
                  onPress={handleLogin}
                  onPressIn={onPressIn}
                  onPressOut={onPressOut}
                  disabled={loading}
                  activeOpacity={1}
                  style={styles.loginButtonTouchable}
                >
                  <LinearGradient
                    colors={
                      loading
                        ? ['#a5b4fc', '#c4b5fd']
                        : ['#6366f1', '#7c3aed']
                    }
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                    style={styles.loginButton}
                  >
                    {loading ? (
                      <View style={styles.loadingRow}>
                        <Ionicons
                          name="sync-outline"
                          size={20}
                          color="#fff"
                        />
                        <Text style={styles.loginButtonText}>
                          Logging in...
                        </Text>
                      </View>
                    ) : (
                      <View style={styles.loginRow}>
                        <Text style={styles.loginButtonText}>Sign In</Text>
                        <View style={styles.arrowCircle}>
                          <Ionicons
                            name="arrow-forward"
                            size={16}
                            color="#6366f1"
                          />
                        </View>
                      </View>
                    )}
                  </LinearGradient>
                </TouchableOpacity>
              </Animated.View>
            </View>

            {/* Footer */}
            {/* <View style={styles.footerContainer}>
              <View style={styles.dividerContainer}>
                <View style={styles.dividerLine} />
                <Text style={styles.dividerText}>Need help?</Text>
                <View style={styles.dividerLine} />
              </View>
              <TouchableOpacity
                onPress={handleContactSupport}
                style={styles.supportButton}
                activeOpacity={0.7}
              >
                <Ionicons
                  name="headset-outline"
                  size={18}
                  color="#6366f1"
                />
                <Text style={styles.supportLink}>Contact HR Support</Text>
              </TouchableOpacity>
            </View> */}
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FAFBFF',
  },
  keyboardView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
  },

  // --- Illustration Section ---
  illustrationSection: {
    alignItems: 'center',
    paddingTop: Platform.OS === 'ios' ? 60 : 48,
    paddingBottom: 10,
    overflow: 'hidden',
  },
  blobContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  blob1: {
    position: 'absolute',
    top: -40,
    left: -60,
    width: 220,
    height: 220,
    borderRadius: 110,
    opacity: 0.7,
  },
  blob2: {
    position: 'absolute',
    top: 20,
    right: -40,
    width: 180,
    height: 180,
    borderRadius: 90,
    opacity: 0.5,
  },
  illustrationWrapper: {
    alignItems: 'center',
    justifyContent: 'center',
  },

  // --- Content Section ---
  contentSection: {
    flex: 1,
    paddingHorizontal: 24,
  },
  welcomeContainer: {
    marginBottom: 24,
    paddingHorizontal: 4,
  },
  welcomeBack: {
    fontSize: 15,
    fontWeight: '600',
    color: '#6366f1',
    letterSpacing: 1.5,
    textTransform: 'uppercase',
    marginBottom: 4,
  },
  appName: {
    fontSize: 36,
    fontWeight: '800',
    color: '#1e1b4b',
    letterSpacing: -1,
    marginBottom: 8,
  },
  appNameDot: {
    color: '#6366f1',
    fontSize: 40,
  },
  subtitle: {
    fontSize: 15,
    color: '#64748B',
    lineHeight: 22,
  },

  // --- Form Card ---
  formCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    padding: 24,
    shadowColor: '#6366f1',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.08,
    shadowRadius: 24,
    elevation: 8,
    borderWidth: 1,
    borderColor: 'rgba(99, 102, 241, 0.06)',
  },
  fieldContainer: {
    marginBottom: 18,
  },
  label: {
    fontSize: 13,
    fontWeight: '700',
    color: '#334155',
    marginBottom: 8,
    letterSpacing: 0.3,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8FAFC',
    borderWidth: 1.5,
    borderColor: '#E2E8F0',
    borderRadius: 14,
    paddingHorizontal: 4,
    shadowColor: '#6366f1',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  inputContainerFocused: {
    borderColor: '#6366f1',
    backgroundColor: '#fafafe',
  },
  inputIconWrapper: {
    width: 40,
    height: 40,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F1F5F9',
    marginRight: 8,
  },
  inputIconWrapperFocused: {
    backgroundColor: '#EEF2FF',
  },
  input: {
    flex: 1,
    height: 50,
    fontSize: 15,
    color: '#1E293B',
  },
  passwordHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  forgotPassword: {
    fontSize: 13,
    color: '#6366f1',
    fontWeight: '700',
  },
  eyeIcon: {
    padding: 10,
  },
  rememberRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
    marginTop: 2,
  },
  checkbox: {
    width: 20,
    height: 20,
    borderRadius: 6,
    borderWidth: 1.5,
    borderColor: '#CBD5E1',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  checkboxChecked: {
    backgroundColor: '#6366f1',
    borderColor: '#6366f1',
  },
  rememberText: {
    fontSize: 13,
    color: '#64748B',
    fontWeight: '500',
  },

  // --- Error ---
  errorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fef2f2',
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 10,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#fecaca',
  },
  errorText: {
    color: '#dc2626',
    fontSize: 13,
    marginLeft: 8,
    fontWeight: '500',
    flex: 1,
  },

  // --- Login Button ---
  buttonWrapper: {
    borderRadius: 14,
    overflow: 'hidden',
  },
  loginButtonTouchable: {
    borderRadius: 14,
    overflow: 'hidden',
  },
  loginButton: {
    height: 54,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#6366f1',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.35,
    shadowRadius: 12,
    elevation: 8,
  },
  loginRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  loadingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  loginButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  arrowCircle: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
  },

  // --- Footer ---
  footerContainer: {
    alignItems: 'center',
    marginTop: 32,
    paddingBottom: 40,
  },
  dividerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
    width: '100%',
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: '#E2E8F0',
  },
  dividerText: {
    fontSize: 12,
    color: '#94A3B8',
    paddingHorizontal: 16,
    fontWeight: '500',
  },
  supportButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#EEF2FF',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 12,
    gap: 8,
  },
  supportLink: {
    fontSize: 14,
    color: '#6366f1',
    fontWeight: '700',
  },
});
