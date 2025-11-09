import { login } from '@/api/auth';
import PinInput from '@/components/PinInput';
import { Colors } from '@/constants/Colors';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';
import { jwtDecode } from 'jwt-decode';
import React, { useState } from 'react';
import { KeyboardAvoidingView, Platform, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

interface UserJwt {
  role: string;
  [key: string]: any;
}

export default function LoginScreen() {
  const [step, setStep] = useState(1);
  const [phone, setPhone] = useState('');
  const [pin, setPin] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const validatePhone = () => {
    if (!/^\d{10}$/.test(phone)) {
      setError('Please enter a valid 10-digit phone number.');
      return false;
    }
    setError('');
    return true;
  };

  const handlePhoneSubmit = () => {
    if (validatePhone()) {
      setStep(2);
    }
  };

  const validatePin = () => {
    if (!/^\d{6}$/.test(pin)) {
      setError('PIN must be 6 digits.');
      return false;
    }
    setError('');
    return true;
  };

  const handlePinSubmit = async () => {
    if (!validatePin()) return;
    setLoading(true);
    try {
      const response = await login(phone, pin);
      const { accessToken, refreshToken } = response.data;

      const userInfo = jwtDecode<UserJwt>(accessToken);

      await AsyncStorage.setItem('accessToken', accessToken);
      await AsyncStorage.setItem('refreshToken', refreshToken);
      await AsyncStorage.setItem('userInfo', JSON.stringify(userInfo));
      setError('');
      
      if (phone == '1234567890') {
        router.replace('/(owner)/home');
      } else {
        router.replace('/(employee)/home');
      }
    } catch (err) {
      setError('Login failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <View style={styles.card}>
        <Text style={styles.title}>Sign In</Text>
        {step === 1 ? (
          <>
            <Text style={styles.label}>Phone Number</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter your phone number"
              placeholderTextColor="#A0AEC0"
              keyboardType="phone-pad"
              maxLength={10}
              value={phone}
              onChangeText={setPhone}
              autoFocus
            />
            {error ? <Text style={styles.error}>{error}</Text> : null}
            <TouchableOpacity style={styles.button} onPress={handlePhoneSubmit} disabled={loading}>
              <Text style={styles.buttonText}>{loading ? 'Loading...' : 'Next'}</Text>
            </TouchableOpacity>
          </>
        ) : (
          <>
            <Text style={styles.label}>Enter 6-Digit PIN</Text>
            <PinInput
              onChangePin={setPin}
              boxStyle={{ marginBottom: 16 }}
            />
            {error ? <Text style={styles.error}>{error}</Text> : null}
            <TouchableOpacity style={styles.button} onPress={handlePinSubmit} disabled={loading || pin.length !== 6}>
              <Text style={styles.buttonText}>{loading ? 'Logging in...' : 'Login'}</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.backLink} onPress={() => { setStep(1); setError(''); }} disabled={loading}>
              <Text style={styles.backText}>Back to phone</Text>
            </TouchableOpacity>
          </>
        )}
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  card: {
    width: '100%',
    maxWidth: 380,
    backgroundColor: '#fff',
    borderRadius: 18,
    padding: 28,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.10,
    shadowRadius: 12,
    elevation: 6,
    alignItems: 'stretch',
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: Colors.primary,
    marginBottom: 24,
    textAlign: 'center',
    letterSpacing: 0.5,
  },
  label: {
    fontSize: 16,
    color: Colors.primaryText,
    marginBottom: 8,
    fontWeight: '500',
  },
  input: {
    borderWidth: 1,
    borderColor: Colors.primaryLight,
    backgroundColor: '#F7F8FA',
    borderRadius: 10,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    color: Colors.primaryText,
    marginBottom: 12,
  },
  button: {
    backgroundColor: Colors.primary,
    borderRadius: 10,
    paddingVertical: 14,
    alignItems: 'center',
    marginTop: 8,
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 6,
    elevation: 2,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
    letterSpacing: 0.5,
  },
  error: {
    color: '#EB5757',
    marginBottom: 8,
    fontSize: 14,
    textAlign: 'left',
  },
  backLink: {
    marginTop: 16,
    alignItems: 'center',
  },
  backText: {
    color: Colors.primary,
    fontSize: 15,
    fontWeight: '500',
    textDecorationLine: 'underline',
  },
});