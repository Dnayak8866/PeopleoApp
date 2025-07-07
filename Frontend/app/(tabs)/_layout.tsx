import { Tabs } from 'expo-router';
import React from 'react';
import { Platform } from 'react-native';

import { Home, Users } from 'lucide-react-native';

export default function TabLayout() {

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
        tabBarActiveTintColor: '#8B5CF6',
        tabBarInactiveTintColor: '#000000',
      }}>
      <Tabs.Screen
        name="home"
        options={{
          title: 'Home',
          tabBarIcon: ({ color }) => <Home size={28} color={color} />,
        }}
      />
      <Tabs.Screen
        name="employees"
        options={{
          title: 'Employees',
          tabBarIcon: ({ color }) => <Users size={28} color={color} />,
        }}
      />
    </Tabs> 
  );
}
