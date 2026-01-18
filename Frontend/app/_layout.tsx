import { Stack, useRouter, useSegments } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import 'react-native-reanimated';
import { AuthProvider, useAuth } from '@/context/AuthContext';
import SplashScreen from '@/screens/SplashScreen';
import { useEffect, useState } from 'react';
import { MasterDataProvider } from '@/context/MasterDataContext';
import { ActivityIndicator, View } from 'react-native';
import { Colors } from '@/constants/Colors';

let splashShown = false;

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

function AppNavigator({ showSplash, onSplashComplete }: { showSplash: boolean; onSplashComplete: () => void }) {
  const { userId, loading } = useAuth();
  const segments = useSegments();
  const router = useRouter();
  const [isNavigationReady, setIsNavigationReady] = useState(false);

  useEffect(() => {
    if (showSplash) {
      setIsNavigationReady(false);
      return;
    }

    if (loading) {
      setIsNavigationReady(false);
      return;
    }

    // Auth restoration is complete, now handle routing
    setIsNavigationReady(true);

    const inAuthGroup = segments[0] === '(auth)';

    if (!userId && !inAuthGroup) {
      // User is not authenticated and not in auth group, redirect to login
      router.replace('/(auth)/login');
    } else if (userId && inAuthGroup) {
      // User is authenticated but in auth group, redirect to loader
      router.replace('/loader');
    }
  }, [userId, loading, showSplash, segments]);

  if (showSplash) {
    return <SplashScreen onAnimationComplete={onSplashComplete} />;
  }

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#fff' }}>
        <ActivityIndicator size="large" color={Colors.primary} />
      </View>
    );
  }

  return (
    <>
      <Stack>
        <Stack.Screen name="(auth)" options={{ headerShown: false }} />
        <Stack.Screen name="loader" options={{ headerShown: false }} />
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