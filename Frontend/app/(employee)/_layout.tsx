import { Tabs } from 'expo-router';
import React from 'react';
import { Platform, Pressable } from 'react-native';

import { Colors } from '@/constants/Colors';
import { useAuth } from '@/context/AuthContext';
import { CalendarClock, CalendarDays, ChartLine, Home } from 'lucide-react-native';

export default function TabLayout() {
  const { user } = useAuth();

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: Platform.select({
          ios: {
            position: 'absolute',
            backgroundColor: '#ffffff',
          },
          android: {
            backgroundColor: '#ffffff',
            height: 60,
          },
          default: {
            backgroundColor: '#ffffff',
            height: 90,
            borderTopWidth: 0,
          },
        }),
        tabBarActiveTintColor: Colors.primary,
        tabBarInactiveTintColor: '#565E6CFF',
        tabBarButton: (props) => (
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
            tabBarIcon: ({ color }) => <Home size={28} color={color} />,
          }}
        />
        <Tabs.Screen
          name="attendance"
          options={{
            title: 'Attendance',
            tabBarIcon: ({ color }) => <CalendarDays size={28} color={color} />,
          }}
        />
        <Tabs.Screen
          name="leave"
          options={{
            title: 'Leave',
            tabBarIcon: ({ color }) => <CalendarClock size={28} color={color} />,
          }}
        />
        <Tabs.Screen
          name="reports"
          options={{
            title: 'Reports',
            tabBarIcon: ({ color }) => <ChartLine size={28} color={color} />,
          }}
        />
    </Tabs>
  );
}
