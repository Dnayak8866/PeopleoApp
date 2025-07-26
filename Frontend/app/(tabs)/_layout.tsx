import { Tabs } from 'expo-router';
import React from 'react';
import { Platform, Pressable } from 'react-native';

import { Colors } from '@/constants/Colors';
import { CalendarCheck, Home, Users } from 'lucide-react-native';

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
        name="employees"
        options={{
          title: 'Employees',
          tabBarIcon: ({ color }) => <Users size={28} color={color} />,
        }}
      />
      <Tabs.Screen
        name="attendance"
        options={{
          title: 'Attendance',
          tabBarIcon: ({ color }) => <CalendarCheck size={28} color={color} />,
        }}
      />
      <Tabs.Screen
        name="employee-home"
        options={{
          title: 'Employee Home',
          tabBarIcon: ({ color }) => <Users size={28} color={color} />,
        }}
      />
    </Tabs> 
  );
}
