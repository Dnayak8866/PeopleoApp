import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { Bell, LocateFixed } from 'lucide-react-native';
import React, { useRef } from 'react';
import {
    Animated,
    SafeAreaView,
    Text,
    TouchableOpacity,
    View
} from 'react-native';

import Hand from '@/assets/images/icons/hand';
import { useAuth } from '@/context/AuthContext';
import { homeScreenStyles } from '@/styles/employeeHomeScreenStyles';

export default function ClockInScreen() {
  const router = useRouter();
  const { logout } = useAuth();
  const styles = homeScreenStyles()

  const now = new Date();
  const timeString = now.toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
  });
  const dateString = now.toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'short',
    day: 'numeric',
  });

  const scaleAnim = useRef(new Animated.Value(1)).current;
  const pulseAnim = useRef(new Animated.Value(0)).current;

  const handlePressIn = () => {
    Animated.spring(scaleAnim, {
      toValue: 0.92,
      useNativeDriver: true,
    }).start();
  };

  const handlePressOut = () => {
    Animated.spring(scaleAnim, {
      toValue: 1,
      useNativeDriver: true,
    }).start();

    pulseAnim.setValue(0);
    Animated.sequence([
      Animated.timing(pulseAnim, {
        toValue: 1,
        duration: 500,
        useNativeDriver: true,
      }),
      Animated.timing(pulseAnim, {
        toValue: 0,
        duration: 0,
        useNativeDriver: true,
      }),
    ]).start();
  };

  const handleLogout = async () => {
    await logout();
    router.replace('/login');
  };

  const StatCard = ({ label, value, borderColor }: { label: string; value: string; borderColor: string }) => (
    <View style={styles.statCard}>
      <View style={styles.progressRing}>
        <View style={[styles.progressCircle, { borderColor }]}>
          <Text style={styles.statNumber}>{value}</Text>
        </View>
      </View>
      <Text style={styles.statLabel}>{label}</Text>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.greeting}>Hello, John Doe!</Text>
        <View style={styles.headerIcons}>
          <TouchableOpacity style={styles.iconButton} onPress={handleLogout}>
            <Bell size={24} color="#666" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.avatar} onPress={() => router.push('/reports')}>
            <Text style={styles.avatarText}>JD</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Time & Date */}
      <View style={styles.timeSection}>
        <Text style={styles.timeText}>{timeString}</Text>
        <Text style={styles.dateText}>{dateString}</Text>
      </View>

      {/* Punch Button */}
      <View style={styles.punchSection}>
        <TouchableOpacity
          activeOpacity={1}
          onPressIn={handlePressIn}
          onPressOut={handlePressOut}
          style={styles.punchButton}>
          <Animated.View style={[styles.punchButton, { transform: [{ scale: scaleAnim }] }]}>
            <View style={styles.pulseWrapper}>
              <Animated.View
                style={[
                  styles.pulseCircle,
                  {
                    opacity: pulseAnim.interpolate({
                      inputRange: [0, 1],
                      outputRange: [0.4, 0],
                    }),
                    transform: [
                      {
                        scale: pulseAnim.interpolate({
                          inputRange: [0, 1],
                          outputRange: [1, 2],
                        }),
                      },
                    ],
                  },
                ]}
              />
              <LinearGradient
                colors={['#1CC8A5', '#2563EB']}
                style={styles.gradientButton}
                start={{ x: 0.5, y: 0 }}
                end={{ x: 0.5, y: 1 }}>
                <Hand width={130} height={120} color="white" />
              </LinearGradient>
            </View>
          </Animated.View>
        </TouchableOpacity>
        <Text style={styles.punchText}>Punch In</Text>
      </View>

      {/* Location */}
      <View style={styles.locationSection}>
        <LocateFixed size={24} color="#888" />
        <Text style={styles.locationText}>
          <Text style={{ fontWeight: 'bold' }}>Location:</Text> You are not in office reach
        </Text>
      </View>

      {/* Stats */}
      <View style={styles.statsSection}>
        <StatCard label="Attendance" value="72%" borderColor="#3B82F6" />
        <View style={styles.divider} />
        <StatCard label="Leave Taken" value="03" borderColor="#8B5CF6" />
        <View style={styles.divider} />
        <StatCard label="Salary Countdown" value="05" borderColor="#EC4899" />
      </View>
    </SafeAreaView>
  );
}