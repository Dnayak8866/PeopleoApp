import { LinearGradient } from 'expo-linear-gradient';
import { useRouter, useFocusEffect } from 'expo-router';
import { Bell, LocateFixed, LogOut, MapPin, Hand, ShieldAlert, Award, Clock, CalendarX } from 'lucide-react-native';
import React, { useRef, useState, useCallback } from 'react';
import {
  Animated,
  Text,
  TouchableOpacity,
  View,
  Alert,
  StyleSheet,
  Dimensions,
  Platform,
  ScrollView,
} from 'react-native';
import EmployeeHomeIllustration from '@/components/illustrations/EmployeeHomeIllustration';
import { useAuth } from '@/context/AuthContext';
import { showSuccessToast, showErrorToast } from '@/services/toast';
import { Avatar } from '@/components/Avatar';
import { useMasterDataContext } from '@/context/MasterDataContext';
import { punchIn, punchOut, getTodaySessionStatus, getEmployeeAttendancePercentage } from '@/services/api/attendance';
import { getEmployeeLeavesCount } from '@/services/api/leaves';
import { getSalaryCountdown } from '@/services/api/salary';
import { StatusBar } from 'expo-status-bar';
import { HeaderAvatar } from '@/components/HeaderAvatar';
import { SafeAreaView } from 'react-native-safe-area-context';

import { useTheme } from '@/context/ThemeContext';

const { width } = Dimensions.get('window');

export default function HomeScreen() {
  const router = useRouter();
  const { isDarkMode, colors } = useTheme();
  const { logout } = useAuth();
  const { userDetails } = useAuth();
  const { companyDetails } = useMasterDataContext();
  const [isLoading, setIsLoading] = useState(false);
  const [isPunchedIn, setIsPunchedIn] = useState(false);
  const [punchInTime, setPunchInTime] = useState<Date | null>(null);

  // Stats state
  const [attendancePercent, setAttendancePercent] = useState<string>('--');
  const [leavesTaken, setLeavesTaken] = useState<string>('--');
  const [salaryDays, setSalaryDays] = useState<string>('--');

  const now = new Date();
  const timeString = now.toLocaleTimeString('en-US', {
    hour: '2-digit', minute: '2-digit', hour12: true,
  });
  const dateString = now.toLocaleDateString('en-US', {
    weekday: 'long', month: 'short', day: 'numeric',
  });

  const scaleAnim = useRef(new Animated.Value(1)).current;
  const pulseAnim = useRef(new Animated.Value(0)).current;

  // Check session status and fetch stats on screen focus
  useFocusEffect(
    useCallback(() => {
      if (userDetails?.id) {
        checkTodaySessionStatus();
        fetchStats();
      }
    }, [userDetails?.id])
  );

  const fetchStats = async () => {
    if (!userDetails?.id) return;
    try {
      const now = new Date();

      // 1. Attendance % for current month
      const attData = await getEmployeeAttendancePercentage(
        userDetails.id,
        now.getMonth() + 1,
        now.getFullYear(),
        userDetails.companyId
      );
      setAttendancePercent(`${Math.round(attData.percentage)}%`);

      // 2. Leave count
      const leaveData = await getEmployeeLeavesCount(userDetails.id);
      setLeavesTaken(String(leaveData.total_leaves_taken).padStart(2, '0'));

      // 3. Salary Countdown (defaulting to 1st of month)
      const salaryData = await getSalaryCountdown(1);
      setSalaryDays(String(salaryData.daysRemaining).padStart(2, '0'));

    } catch (error) {
      console.error('Failed to fetch employee stats:', error);
    }
  };

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
        showErrorToast('Error', 'User information not available');
        return;
      }

      const attendanceData = {
        employee_id: userDetails.id,
        attendance_date: new Date(),
      };

      await punchIn(attendanceData);

      setIsPunchedIn(true);
      setPunchInTime(new Date());

      showSuccessToast('Success', 'Punched in successfully!');
    } catch (error: any) {
      console.error('Punch in error:', error);
      const errorMessage = error?.response?.data?.message || error.message || 'Failed to punch in';
      showErrorToast('Error', errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const handlePunchOut = async () => {
    if (isLoading) return;

    try {
      setIsLoading(true);

      if (!userDetails?.id) {
        showErrorToast('Error', 'User information not available');
        return;
      }

      const attendanceData = {
        employee_id: userDetails.id,
        attendance_date: new Date(),
      };

      await punchOut(attendanceData);

      setIsPunchedIn(false);

      showSuccessToast('Success', 'Punched out successfully!');
    } catch (error: any) {
      console.error('Punch out error:', error);
      const errorMessage = error?.response?.data?.message || error.message || 'Failed to punch out';
      showErrorToast('Error', errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const StatCard = ({ label, value, color, icon: Icon }: { label: string; value: string; color: string; icon: any }) => (
    <View style={[styles.statCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
      <View style={[styles.progressCircle, { borderColor: color + '20', borderTopColor: color }]}>
        <View style={[styles.innerCircle, { backgroundColor: color + '08' }]}>
          <Icon size={16} color={color} />
          <Text style={[styles.statNumber, { color: colors.textPrimary }]}>{value}</Text>
        </View>
      </View>
      <Text style={[styles.statLabel, { color: colors.textSecondary }]}>{label}</Text>
    </View>
  );

  return (
    <SafeAreaView style={[styles.safeContainer, { backgroundColor: colors.background }]}>
      <StatusBar style={isDarkMode ? 'light' : 'dark'} />

      {/* Top Header */}
      <View style={[styles.header, { backgroundColor: colors.background }]}>
        <View style={styles.headerTitleContainer}>
          <Text style={[styles.greeting, { color: colors.primary }]}>Hello,</Text>
          <Text style={[styles.employeeName, { color: colors.textPrimary }]}>
            {userDetails?.fullName?.split(' ')[0] || 'Employee'}
          </Text>
        </View>
        <View style={styles.headerActions}>
          <TouchableOpacity
            style={[styles.bellButton, { backgroundColor: colors.card, borderColor: colors.border }]}
            onPress={() => router.push('/notifications')}
            hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
          >
            <Bell size={22} color={colors.textPrimary} />
            <View style={styles.bellBadge} />
          </TouchableOpacity>
          <HeaderAvatar size={38} />
        </View>
      </View>

      <ScrollView
        style={styles.container}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Welcome Gradient & Illustration */}
        <View style={[styles.welcomeCard, { borderColor: isDarkMode ? 'rgba(129, 140, 248, 0.2)' : 'rgba(99, 102, 241, 0.08)' }]}>
          <LinearGradient
            colors={isDarkMode ? ['#151D30', '#1E1B4B'] : ['#EEF2FF', '#F5F3FF']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.welcomeGradient}
          >
            <View style={styles.welcomeTextContainer}>
              <Text style={[styles.timeLabel, { color: colors.primary }]}>CURRENT TIME</Text>
              <Text style={[styles.timeText, { color: colors.textPrimary }]}>{timeString}</Text>
              <Text style={[styles.dateText, { color: colors.textSecondary }]}>{dateString}</Text>
              <View style={styles.companyBadge}>
                <Text style={styles.companyBadgeText} numberOfLines={1}>
                  {companyDetails?.name || 'Workspace'}
                </Text>
              </View>
            </View>
            <View style={styles.illustrationWrapper}>
              <EmployeeHomeIllustration width={120} height={95} />
            </View>
          </LinearGradient>
        </View>

        {/* Location Section */}
        <View style={styles.locationSection}>
          <View style={[styles.locationBadge, { backgroundColor: isDarkMode ? '#1E293B' : '#FFFBEB', borderColor: isDarkMode ? '#334155' : '#FEF3C7' }]}>
            <View style={styles.locationIconWrapper}>
              <ShieldAlert size={16} color="#F59E0B" />
            </View>
            <Text style={[styles.locationText, { color: colors.textSecondary }]}>
              <Text style={styles.locationBold}>Out of Range:</Text> You are not within office limits
            </Text>
          </View>
        </View>

        {/* Punch Button Section */}
        <View style={styles.punchSection}>
          <TouchableOpacity
            activeOpacity={1}
            disabled={isLoading}
            onPressIn={handlePressIn}
            onPressOut={handlePressOut}
            style={styles.punchButtonTouchable}
          >
            <Animated.View style={[styles.punchButtonOuter, { transform: [{ scale: scaleAnim }] }]}>
              {/* Outer pulsing shadow ring */}
              <Animated.View
                style={[
                  styles.pulseCircle,
                  {
                    borderColor: isPunchedIn ? '#EF4444' : colors.primary,
                    opacity: pulseAnim.interpolate({
                      inputRange: [0, 1],
                      outputRange: [0.3, 0],
                    }),
                    transform: [
                      {
                        scale: pulseAnim.interpolate({
                          inputRange: [0, 1],
                          outputRange: [1, 1.4],
                        }),
                      },
                    ],
                  },
                ]}
              />

              {/* Main Gradient Button */}
              <LinearGradient
                colors={isPunchedIn ? ['#EF4444', '#DC2626'] : ['#6366f1', '#4F46E5']}
                style={styles.gradientButton}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
              >
                <View style={styles.punchIconCircle}>
                  {isPunchedIn ? (
                    <LogOut size={42} color="#FFFFFF" style={styles.punchIcon} />
                  ) : (
                    <Hand size={42} color="#FFFFFF" style={styles.punchIcon} />
                  )}
                </View>
                <Text style={styles.punchLabel}>
                  {isPunchedIn ? 'Punch Out' : 'Punch In'}
                </Text>
              </LinearGradient>
            </Animated.View>
          </TouchableOpacity>

          <Text style={[styles.statusDescription, { color: colors.textSecondary }]}>
            {isLoading ? 'Processing check-in...' : isPunchedIn ? 'Logged In' : 'Not Punched In'}
          </Text>

          {isPunchedIn && punchInTime && (
            <View style={[styles.timeBadge, { backgroundColor: colors.card, borderColor: colors.border }]}>
              <Clock size={12} color={colors.textSecondary} />
              <Text style={[styles.timeBadgeText, { color: colors.textSecondary }]}>
                Active since {punchInTime.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}
              </Text>
            </View>
          )}
        </View>

        {/* Stats Row */}
        <View style={[styles.statsSection, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <StatCard
            label="Attendance"
            value={attendancePercent}
            color="#3B82F6"
            icon={Award}
          />
          <View style={[styles.divider, { backgroundColor: colors.border }]} />
          <StatCard
            label="Leave Taken"
            value={leavesTaken}
            color="#8B5CF6"
            icon={CalendarX}
          />
          <View style={[styles.divider, { backgroundColor: colors.border }]} />
          <StatCard
            label="Salary Count"
            value={salaryDays}
            color="#EC4899"
            icon={Clock}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeContainer: {
    flex: 1,
    backgroundColor: '#FAFBFF',
  },
  container: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingBottom: 110,
  },

  // --- Header ---
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: Platform.OS === 'ios' ? 4 : 10,
    paddingBottom: 16,
  },
  headerTitleContainer: {
    flex: 1,
  },
  greeting: {
    fontSize: 13,
    color: '#6366f1',
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  employeeName: {
    fontSize: 22,
    fontWeight: '800',
    color: '#1E1B4B',
    marginTop: 2,
  },
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
  },
  bellButton: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: '#F1F5F9',
  },
  bellBadge: {
    position: 'absolute',
    top: 9,
    right: 9,
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#EF4444',
  },

  // --- Welcome Banner ---
  welcomeCard: {
    borderRadius: 22,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(99, 102, 241, 0.08)',
    marginBottom: 20,
  },
  welcomeGradient: {
    flexDirection: 'row',
    padding: 20,
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  welcomeTextContainer: {
    flex: 1.2,
    paddingRight: 10,
  },
  timeLabel: {
    fontSize: 9,
    color: '#6366f1',
    fontWeight: '800',
    letterSpacing: 1,
  },
  timeText: {
    fontSize: 28,
    fontWeight: '800',
    color: '#1E1B4B',
    marginVertical: 2,
    letterSpacing: -0.5,
  },
  dateText: {
    fontSize: 13,
    color: '#64748B',
    fontWeight: '500',
  },
  companyBadge: {
    alignSelf: 'flex-start',
    backgroundColor: '#EEF2FF',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
    marginTop: 10,
  },
  companyBadgeText: {
    fontSize: 10,
    color: '#6366f1',
    fontWeight: '800',
  },
  illustrationWrapper: {
    flex: 0.8,
    alignItems: 'center',
    justifyContent: 'center',
  },

  // --- Location Section ---
  locationSection: {
    marginBottom: 20,
  },
  locationBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFBEB',
    borderWidth: 1,
    borderColor: '#FEF3C7',
    borderRadius: 14,
    padding: 10,
    gap: 10,
  },
  locationIconWrapper: {
    width: 28,
    height: 28,
    borderRadius: 8,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  locationText: {
    flex: 1,
    fontSize: 12,
    color: '#D97706',
    fontWeight: '500',
    lineHeight: 16,
  },
  locationBold: {
    fontWeight: '700',
  },

  // --- Punch Button Section ---
  punchSection: {
    alignItems: 'center',
    paddingVertical: 24,
    marginBottom: 24,
  },
  punchButtonTouchable: {
    borderRadius: 95,
  },
  punchButtonOuter: {
    width: 190,
    height: 190,
    borderRadius: 95,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  pulseCircle: {
    position: 'absolute',
    top: -6,
    left: -6,
    right: -6,
    bottom: -6,
    borderRadius: 105,
    borderWidth: 6,
  },
  gradientButton: {
    width: 170,
    height: 170,
    borderRadius: 85,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#6366f1',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.25,
    shadowRadius: 18,
    elevation: 8,
  },
  punchIconCircle: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  punchIcon: {
    marginLeft: 0,
  },
  punchLabel: {
    fontSize: 16,
    fontWeight: '800',
    color: '#FFFFFF',
    letterSpacing: 0.5,
  },
  statusDescription: {
    fontSize: 15,
    fontWeight: '700',
    color: '#1E293B',
    marginTop: 16,
  },
  timeBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: 6,
    backgroundColor: '#F1F5F9',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  timeBadgeText: {
    fontSize: 11,
    color: '#64748B',
    fontWeight: '600',
  },

  // --- Stats Section ---
  statsSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    padding: 16,
    borderWidth: 1,
    borderColor: '#F1F5F9',
    shadowColor: '#6366f1',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.04,
    shadowRadius: 16,
    elevation: 4,
  },
  statCard: {
    flex: 1,
    alignItems: 'center',
  },
  progressCircle: {
    width: 76,
    height: 76,
    borderRadius: 38,
    borderWidth: 5.5,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  innerCircle: {
    width: 62,
    height: 62,
    borderRadius: 31,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 2,
  },
  statNumber: {
    fontSize: 13,
    fontWeight: '800',
    color: '#1E293B',
  },
  statLabel: {
    fontSize: 11,
    color: '#64748B',
    fontWeight: '600',
    textAlign: 'center',
  },
  divider: {
    width: 1.5,
    height: 70,
    backgroundColor: '#F1F5F9',
    alignSelf: 'center',
  },
});