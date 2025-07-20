import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import 'react-native-reanimated';

import SplashScreen from '@/screens/SplashScreen';
import { useState } from 'react';

export default function RootLayout() {
  const [showSplash, setShowSplash] = useState(true);

  const handleSplashComplete = () => {
    setShowSplash(false);
  };

  if (showSplash) {
    return <SplashScreen onAnimationComplete={handleSplashComplete} />;
  }

  return (
    <>
      <Stack>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="add-employee" options={{ headerShown: false }} />
        <Stack.Screen name="employee-details" options={{ headerShown: false }} />
        <Stack.Screen name="reports" options={{headerShown: false}} />
        <Stack.Screen name="+not-found" />
      </Stack>
      <StatusBar style="light" />
      </>
  );
}
