import { Stack, useRouter, useSegments } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import 'react-native-reanimated';
import '@/global.css';
import { AuthProvider, useAuth } from '@/context/AuthContext';
import SplashScreen from '@/screens/SplashScreen';
import * as ExpoSplashScreen from 'expo-splash-screen';
import { useEffect, useState } from 'react';
import { MasterDataProvider } from '@/context/MasterDataContext';
import { ActivityIndicator, StyleSheet, View } from 'react-native';
import { Colors } from '@/constants/Colors';
import Toast from 'react-native-toast-message';

import { ThemeProvider, useTheme } from '@/context/ThemeContext';

// Prevent Expo's native splash screen from auto-hiding before JS component mounts
ExpoSplashScreen.preventAutoHideAsync();

let splashShown = false;

export default function RootLayout() {
  const [showSplash, setShowSplash] = useState(!splashShown);

  useEffect(() => {
    // Hide the OS native splash screen as soon as React component tree mounts
    ExpoSplashScreen.hideAsync();
  }, []);

  const handleSplashComplete = () => {
    splashShown = true;
    setShowSplash(false);
  };

  return (
    <ThemeProvider>
      <AuthProvider>
        <MasterDataProvider>
          <AppNavigator showSplash={showSplash} onSplashComplete={handleSplashComplete} />
        </MasterDataProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}

function AppNavigator({ showSplash, onSplashComplete }: { showSplash: boolean; onSplashComplete: () => void }) {
  const { userId, loading } = useAuth();
  const { isDarkMode, colors } = useTheme();
  const segments = useSegments();
  const router = useRouter();

  useEffect(() => {
    if (loading) return;

    const inAuthGroup = segments[0] === '(auth)';
    const hasTargetSegment = segments.length > 0 && segments[0] !== undefined;

    if (!userId && !inAuthGroup) {
      // User is not authenticated and not in auth group, redirect to login
      router.replace('/(auth)/login');
    } else if (userId && (!hasTargetSegment || inAuthGroup)) {
      // User is authenticated but at root or in auth group, redirect to loader
      router.replace('/loader');
    }
  }, [userId, loading, segments]);

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <Stack screenOptions={{ headerShown: false, contentStyle: { backgroundColor: colors.background } }} />
      <StatusBar style={isDarkMode ? 'light' : 'dark'} />

      {/* Overlay SplashScreen over Stack so background routing redirects seamlessly without flash */}
      {showSplash && (
        <View style={StyleSheet.absoluteFill}>
          <SplashScreen onAnimationComplete={onSplashComplete} />
        </View>
      )}

      {/* Show loader if splash has finished but auth state is loading */}
      {!showSplash && loading && (
        <View style={[StyleSheet.absoluteFill, styles.loadingOverlay, { backgroundColor: colors.background }]}>
          <ActivityIndicator size="large" color={colors.primary} />
        </View>
      )}

      {/* Global Toast Component */}
      <Toast />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  loadingOverlay: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
});