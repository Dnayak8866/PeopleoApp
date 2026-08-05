import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { useAuth } from '@/context/AuthContext';
import { resetPassword as resetPasswordApi } from '@/services/api/auth';
import { showSuccessToast, showErrorToast } from '@/services/toast';
import { ChevronLeft, Lock, Eye, EyeOff } from 'lucide-react-native';
import ResetPasswordIllustration from '@/components/illustrations/ResetPasswordIllustration';
import { LinearGradient } from 'expo-linear-gradient';
import { StatusBar } from 'expo-status-bar';

import { useTheme } from '@/context/ThemeContext';

export default function ResetPasswordScreen() {
  const router = useRouter();
  const { isDarkMode, colors } = useTheme();
  const { userId } = useAuth();
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleReset = async () => {
    if (!currentPassword.trim() || !newPassword.trim() || !confirmPassword.trim()) {
      showErrorToast('Error', 'Please fill all password fields');
      return;
    }

    if (newPassword.length < 6) {
      showErrorToast('Error', 'New password must be at least 6 characters');
      return;
    }

    if (newPassword !== confirmPassword) {
      showErrorToast('Error', 'New passwords do not match');
      return;
    }

    if (!userId) {
      showErrorToast('Error', 'User is not authenticated.');
      return;
    }

    try {
      setIsSubmitting(true);
      await resetPasswordApi(userId, currentPassword, newPassword);
      showSuccessToast('Success', 'Password has been reset successfully!');
      router.back();
    } catch (error: any) {
      console.error('Failed to reset password:', error);
      const errorMessage = error.response?.data?.message || 'Failed to reset password. Please try again.';
      showErrorToast('Error', errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderPasswordInput = (
    value: string,
    setValue: (v: string) => void,
    placeholder: string,
    show: boolean,
    setShow: (s: boolean) => void
  ) => (
    <View style={styles.inputContainer}>
      <View style={[styles.inputWrapper, { backgroundColor: colors.card, borderColor: colors.border }]}>
        <Lock size={18} color={colors.primary} />
        <TextInput
          style={[styles.input, { color: colors.textPrimary }]}
          placeholder={placeholder}
          placeholderTextColor={colors.textMuted}
          value={value}
          onChangeText={setValue}
          secureTextEntry={!show}
        />
        <TouchableOpacity onPress={() => setShow(!show)} activeOpacity={0.7}>
          {show ? <EyeOff size={18} color={colors.textMuted} /> : <Eye size={18} color={colors.textMuted} />}
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={[styles.safeContainer, { backgroundColor: colors.background }]}>
      <StatusBar style={isDarkMode ? 'light' : 'dark'} />
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        {/* Header */}
        <View style={[styles.header, { backgroundColor: colors.background }]}>
          <TouchableOpacity
            style={[styles.backButton, { backgroundColor: colors.card, borderColor: colors.border }]}
            onPress={() => router.back()}
            hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
          >
            <ChevronLeft size={22} color={colors.textPrimary} />
          </TouchableOpacity>
          <View style={styles.headerTitleContainer}>
            <Text style={[styles.headerTitle, { color: colors.textPrimary }]}>Reset Password</Text>
          </View>
        </View>

        <ScrollView
          style={styles.container}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          {/* Welcome Card & Illustration */}
          <View style={[styles.welcomeCard, { borderColor: isDarkMode ? 'rgba(129, 140, 248, 0.2)' : 'rgba(99, 102, 241, 0.08)' }]}>
            <LinearGradient
              colors={isDarkMode ? ['#151D30', '#1E1B4B'] : ['#EEF2FF', '#F5F3FF']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.welcomeGradient}
            >
              <View style={styles.welcomeTextContainer}>
                <Text style={[styles.welcomeQuote, { color: colors.primary }]}>Security First</Text>
                <Text style={[styles.ownerName, { color: colors.textPrimary }]}>New Keys</Text>
                <Text style={[styles.welcomeDesc, { color: colors.textSecondary }]}>
                  Enter your current credentials and select a strong, secure new password.
                </Text>
              </View>
              <View style={styles.illustrationWrapper}>
                <ResetPasswordIllustration width={110} height={90} />
              </View>
            </LinearGradient>
          </View>

          {/* Form Card */}
          <View style={[styles.formCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
            <Text style={[styles.inputLabel, { color: colors.textSecondary }]}>Current Password</Text>
            {renderPasswordInput(currentPassword, setCurrentPassword, 'Enter current password', showCurrent, setShowCurrent)}

            <Text style={[styles.inputLabel, { color: colors.textSecondary, marginTop: 8 }]}>New Password</Text>
            {renderPasswordInput(newPassword, setNewPassword, 'Enter new password (min. 6 chars)', showNew, setShowNew)}

            <Text style={[styles.inputLabel, { color: colors.textSecondary, marginTop: 8 }]}>Confirm New Password</Text>
            {renderPasswordInput(confirmPassword, setConfirmPassword, 'Re-enter new password', showConfirm, setShowConfirm)}

            <TouchableOpacity
              style={[styles.submitButton, isSubmitting && { opacity: 0.75 }]}
              onPress={handleReset}
              disabled={isSubmitting}
              activeOpacity={0.85}
            >
              <LinearGradient
                colors={['#6366f1', '#7c3aed']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.submitButtonGradient}
              >
                {isSubmitting ? (
                  <ActivityIndicator color="white" />
                ) : (
                  <Text style={styles.submitButtonText}>Reset Password</Text>
                )}
              </LinearGradient>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeContainer: {
    flex: 1,
    backgroundColor: '#FAFBFF',
  },
  container: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingBottom: 40,
  },

  // --- Header ---
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: Platform.OS === 'ios' ? 4 : 10,
    paddingBottom: 12,
  },
  backButton: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: '#F1F5F9',
  },
  headerTitleContainer: {
    flex: 1,
    marginLeft: 14,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: '#1E1B4B',
  },

  // --- Welcome Card ---
  welcomeCard: {
    borderRadius: 22,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(99, 102, 241, 0.08)',
    marginBottom: 20,
  },
  welcomeGradient: {
    flexDirection: 'row',
    padding: 20,
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  welcomeTextContainer: {
    flex: 1.2,
    paddingRight: 8,
  },
  welcomeQuote: {
    fontSize: 12,
    color: '#6366f1',
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  ownerName: {
    fontSize: 24,
    fontWeight: '800',
    color: '#1E1B4B',
    marginVertical: 2,
  },
  welcomeDesc: {
    fontSize: 11,
    color: '#64748B',
    lineHeight: 16,
  },
  illustrationWrapper: {
    flex: 0.8,
    alignItems: 'center',
    justifyContent: 'center',
  },

  // --- Form ---
  formCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 22,
    padding: 20,
    borderWidth: 1,
    borderColor: '#F1F5F9',
    shadowColor: '#6366f1',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.04,
    shadowRadius: 16,
    elevation: 3,
    gap: 10,
  },
  inputLabel: {
    fontSize: 13,
    fontWeight: '700',
    color: '#334155',
    letterSpacing: 0.3,
    marginBottom: 2,
    paddingHorizontal: 2,
  },
  inputContainer: {
    width: '100%',
    marginBottom: 8,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8FAFC',
    borderRadius: 12,
    height: 48,
    borderWidth: 1.5,
    borderColor: '#E2E8F0',
    paddingHorizontal: 12,
    gap: 10,
  },
  input: {
    flex: 1,
    fontSize: 13,
    color: '#1E293B',
    fontWeight: '600',
  },

  // --- Submit Button ---
  submitButton: {
    borderRadius: 12,
    overflow: 'hidden',
    marginTop: 14,
  },
  submitButtonGradient: {
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#6366f1',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.25,
    shadowRadius: 12,
    elevation: 4,
  },
  submitButtonText: {
    fontSize: 15,
    fontWeight: '700',
    color: '#ffffff',
    letterSpacing: 0.5,
  },
});
