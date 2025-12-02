import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import 'react-native-reanimated';

import LoginScreen from '@/app/(auth)/login';
import { AuthProvider, useAuth } from '@/context/AuthContext';
import SplashScreen from '@/screens/SplashScreen';
import { useState } from 'react';
import { MasterDataProvider } from '@/context/MasterDataContext';

let splashShown = false;

type AppNavigatorProps = {
  showSplash: boolean;
  onSplashComplete: () => void;
};

export default function RootLayout() {
  const [showSplash, setShowSplash] = useState(!splashShown);

  const handleSplashComplete = () => {
    splashShown = true;
    setShowSplash(false);
  };

  return (
    <AuthProvider>
      <MasterDataProvider>
        <AppNavigator showSplash={showSplash} onSplashComplete={handleSplashComplete} />
      </MasterDataProvider>
    </AuthProvider>
  );
}

function AppNavigator({ showSplash, onSplashComplete }: AppNavigatorProps) {
  const { user, loading } = useAuth();


  if (showSplash) {
    return <SplashScreen onAnimationComplete={onSplashComplete} />;
  }

  if (loading) {
    return null;
  }

  if (!user) {
    return <LoginScreen />;
  }

  return (
    <>
      <Stack>
        <Stack.Screen name="(employee)" options={{ headerShown: false }} />
        <Stack.Screen name="(owner)" options={{ headerShown: false }} />
        <Stack.Screen name="employee/add" options={{ headerShown: false }} />
        <Stack.Screen name="employee/[id]" options={{ headerShown: false }} />
        <Stack.Screen name="employee/apply-leave" options={{ headerShown: false }} />
        <Stack.Screen name="+not-found" />
      </Stack>
      <StatusBar style="auto" />
    </>
  );
}