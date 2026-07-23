import { Tabs } from 'expo-router';
import React from 'react';
import { Platform, Pressable, StyleSheet, View } from 'react-native';
import { BlurView } from 'expo-blur';
import { Colors } from '@/constants/Colors';
import { useAuth } from '@/context/AuthContext';
import { LayoutDashboard, Fingerprint, CalendarClock, TrendingUp } from 'lucide-react-native';

export default function TabLayout() {
  const { userDetails } = useAuth();

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          position: 'absolute',
          // bottom: Platform.OS === 'ios' ? 24 : 16,
          left: 16,
          right: 16,
          height: 66,
          borderRadius: 22,
          borderWidth: 1,
          borderColor: 'rgba(99, 102, 241, 0.1)',
          backgroundColor: Platform.OS === 'ios' ? 'rgba(255, 255, 255, 0.82)' : '#FFFFFF',
          overflow: 'hidden',
          shadowColor: '#6366f1',
          shadowOffset: { width: 0, height: 8 },
          shadowOpacity: 0.08,
          shadowRadius: 18,
          elevation: 6,
          paddingBottom: Platform.OS === 'ios' ? 12 : 8,
          paddingTop: 8,
        },
        tabBarBackground: () => (
          Platform.OS === 'ios' ? (
            <BlurView intensity={75} style={StyleSheet.absoluteFill} tint="light" />
          ) : null
        ),
        tabBarActiveTintColor: '#6366f1',
        tabBarInactiveTintColor: '#94A3B8',
        tabBarLabelStyle: {
          fontSize: 10,
          fontWeight: '700',
          marginTop: -2,
        },
        tabBarButton: (props: any) => (
          <Pressable
            {...props}
            android_ripple={null}
            style={[
              props.style,
              { backgroundColor: 'transparent' }
            ]}
          />
        )
      }}>
      <Tabs.Screen
        name="home"
        options={{
          title: 'Home',
          tabBarIcon: ({ color, focused }) => (
            <View style={focused ? styles.activeIconWrapper : null}>
              <LayoutDashboard size={22} color={color} />
            </View>
          ),
        }}
      />
      <Tabs.Screen
        name="attendance"
        options={{
          title: 'Attendance',
          tabBarIcon: ({ color, focused }) => (
            <View style={focused ? styles.activeIconWrapper : null}>
              <Fingerprint size={22} color={color} />
            </View>
          ),
        }}
      />
      <Tabs.Screen
        name="leave"
        options={{
          title: 'Leave',
          tabBarIcon: ({ color, focused }) => (
            <View style={focused ? styles.activeIconWrapper : null}>
              <CalendarClock size={22} color={color} />
            </View>
          ),
        }}
      />
      <Tabs.Screen
        name="reports"
        options={{
          title: 'Reports',
          tabBarIcon: ({ color, focused }) => (
            <View style={focused ? styles.activeIconWrapper : null}>
              <TrendingUp size={22} color={color} />
            </View>
          ),
        }}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  activeIconWrapper: {
    transform: [{ scale: 1.05 }],
  },
});