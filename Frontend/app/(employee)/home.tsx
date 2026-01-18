import { LinearGradient } from 'expo-linear-gradient';
import { useRouter, useFocusEffect } from 'expo-router';
import { Bell, LocateFixed, LogOut } from 'lucide-react-native';
import React, { useRef, useState, useCallback, use } from 'react';
import {
  Animated,
  SafeAreaView,
  Text,
  TouchableOpacity,
  View,
  Alert
} from 'react-native';

import Hand from '@/assets/images/icons/hand';
import { useAuth } from '@/context/AuthContext';
import { homeScreenStyles } from '@/styles/employeeHomeScreenStyles';
import { Avatar } from '@/components/Avatar';
import { useMasterDataContext } from '@/context/MasterDataContext';
import { punchIn, punchOut, getTodaySessionStatus } from '@/services/api/attendace';
import { StatusBar } from 'expo-status-bar';
import { HeaderAvatar } from '@/components/HeaderAvatar';

export default function HomeScreen() {
  const router = useRouter();
  const { logout } = useAuth();
  const styles = homeScreenStyles();
  const { userDetails } = useAuth();
  const { companyDetails } = useMasterDataContext();
  const [isLoading, setIsLoading] = useState(false);
  const [isPunchedIn, setIsPunchedIn] = useState(false);
  const [punchInTime, setPunchInTime] = useState<Date | null>(null);

  console.log("userDetails:", userDetails);

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

  // Check session status on screen focus
  useFocusEffect(
    useCallback(() => {
      if (userDetails?.id) {
        checkTodaySessionStatus();
      }
    }, [userDetails?.id])
  );

  const checkTodaySessionStatus = async () => {
    try {
      if (!userDetails?.id) return;

      const status = await getTodaySessionStatus(userDetails.id);
      setIsPunchedIn(status.hasActivePunch);
      if (status.punchIn) {
        setPunchInTime(new Date(status.punchIn));
      }
    } catch (error) {
      console.error('Failed to check session status:', error);
      // Silently fail - not critical
    }
  };

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

    // Call appropriate punch API
    if (isPunchedIn) {
      handlePunchOut();
    } else {
      handlePunchIn();
    }
  };

  const handlePunchIn = async () => {
    if (isLoading) return;

    try {
      setIsLoading(true);

      if (!userDetails?.id) {
        Alert.alert('Error', 'User information not available');
        return;
      }

      const attendanceData = {
        employee_id: userDetails.id,
        attendance_date: new Date(),
      };

      await punchIn(attendanceData);

      setIsPunchedIn(true);
      setPunchInTime(new Date());

      Alert.alert('Success', 'Punched in successfully!', [
        { text: 'OK' }
      ]);
    } catch (error: any) {
      console.error('Punch in error:', error);
      const errorMessage = error?.response?.data?.message || error.message || 'Failed to punch in';
      Alert.alert('Error', errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const handlePunchOut = async () => {
    if (isLoading) return;

    try {
      setIsLoading(true);

      if (!userDetails?.id) {
        Alert.alert('Error', 'User information not available');
        return;
      }

      const attendanceData = {
        employee_id: userDetails.id,
        attendance_date: new Date(),
      };

      await punchOut(attendanceData);

      setIsPunchedIn(false);

      Alert.alert('Success', 'Punched out successfully!', [
        { text: 'OK' }
      ]);
    } catch (error: any) {
      console.error('Punch out error:', error);
      const errorMessage = error?.response?.data?.message || error.message || 'Failed to punch out';
      Alert.alert('Error', errorMessage);
    } finally {
      setIsLoading(false);
    }
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
        <Text style={styles.greeting}>Hello, {userDetails?.fullName}</Text>
        <View style={styles.headerIcons}>
          <TouchableOpacity style={styles.iconButton} onPress={() => { }}>
            <Bell size={24} color="#666" />
          </TouchableOpacity>
          <HeaderAvatar size={40} />
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
          disabled={isLoading}
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
                colors={isPunchedIn ? ['#EF4444', '#DC2626'] : ['#1CC8A5', '#2563EB']}
                style={styles.gradientButton}
                start={{ x: 0.5, y: 0 }}
                end={{ x: 0.5, y: 1 }}>
                {isPunchedIn ? (
                  <LogOut width={130} height={120} color="white" />
                ) : (
                  <Hand width={130} height={120} color="white" />
                )}
              </LinearGradient>
            </View>
          </Animated.View>
        </TouchableOpacity>
        <Text style={styles.punchText}>
          {isLoading ? 'Processing...' : isPunchedIn ? 'Punch Out' : 'Punch In'}
        </Text>
        {isPunchedIn && punchInTime && (
          <Text style={[styles.punchText, { fontSize: 12, color: '#666' }]}>
            In at {punchInTime.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}
          </Text>
        )}
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
      <StatusBar style="dark" />
    </SafeAreaView>
  );
}