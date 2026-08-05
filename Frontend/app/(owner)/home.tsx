import { Colors } from '@/constants/Colors';
import { useAuth } from '@/context/AuthContext';
import { useMasterDataContext } from '@/context/MasterDataContext';
import { HeaderAvatar } from '@/components/HeaderAvatar';
import OwnerHomeIllustration from '@/components/illustrations/OwnerHomeIllustration';
import DateTimePicker from '@react-native-community/datetimepicker';
import { router } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import {
  Bell,
  Calendar,
  ChevronRight,
  ClipboardList,
  FileBarChart2,
  Clock,
  UserCheck,
  UserMinus,
  UserX,
  Users2,
} from 'lucide-react-native';
import React, { useCallback, useEffect, useState, useRef } from 'react';
import {
  ActivityIndicator,
  Animated,
  Dimensions,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { PieChart } from 'react-native-gifted-charts';
import { getDailyAttendanceSummary } from '@/services/api/attendance';
import { getPendingLeavesCount } from '@/services/api/leaves';
import { DailySummary } from '@/services/types/attendance';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '@/context/ThemeContext';
import { LinearGradient } from 'expo-linear-gradient';

const { width } = Dimensions.get('window');

export default function HomePage() {
  const { isDarkMode, colors } = useTheme();
  const getToday = () => {
    const d = new Date();
    return d.toISOString().slice(0, 10);
  };

  const [selectedDate, setSelectedDate] = useState(getToday());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [summary, setSummary] = useState<DailySummary | null>(null);
  const [loading, setLoading] = useState(false);
  const [pendingCount, setPendingCount] = useState(0);

  const { logout, userDetails } = useAuth();
  const { companyDetails } = useMasterDataContext();

  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(20)).current;

  const fetchSummary = useCallback(
    async (date: string) => {
      if (!userDetails?.companyId) return;
      setLoading(true);
      try {
        const [summaryData, pendingData] = await Promise.all([
          getDailyAttendanceSummary(date, userDetails.companyId),
          getPendingLeavesCount(userDetails.companyId),
        ]);
        setSummary(summaryData);
        setPendingCount(pendingData.count);
      } catch (err) {
        console.error('Failed to load owner home data:', err);
      } finally {
        setLoading(false);
      }
    },
    [userDetails?.companyId]
  );

  useEffect(() => {
    fetchSummary(selectedDate);
  }, [selectedDate, fetchSummary]);

  useEffect(() => {
    // Reset animations and trigger fade-in
    fadeAnim.setValue(0);
    slideAnim.setValue(20);
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 500,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 500,
        useNativeDriver: true,
      }),
    ]).start();
  }, [selectedDate]);

  const getDisplayDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
    });
  };

  // Build chart data from real summary; fall back to default values when loading/empty
  const hasData =
    !!(summary &&
    (summary.present > 0 ||
      summary.absent > 0 ||
      summary.onLeave > 0 ||
      summary.lateCheckIns > 0));

  const chartData = hasData && summary
    ? [
        { value: Math.max(summary.present, 0.001), color: '#10B981'},
        { value: Math.max(summary.lateCheckIns, 0.001), color: '#F59E0B'},
        { value: Math.max(summary.onLeave, 0.001), color: '#8B5CF6'},
        { value: Math.max(summary.absent, 0.001), color: '#EF4444'},
      ]
    : [
        { value: 1, color: '#E2E8F0' }, // Placeholder gray circle
      ];

  const QuickActionCard = ({
    icon: Icon,
    title,
    subtitle,
    onPress,
    gradientColors,
    badgeCount,
  }: {
    icon: any;
    title: string;
    subtitle: string;
    onPress: () => void;
    gradientColors: string[];
    badgeCount?: number;
  }) => (
    <TouchableOpacity
      style={[styles.quickActionCard, { backgroundColor: colors.card, borderColor: colors.border }]}
      onPress={onPress}
      activeOpacity={0.85}
    >
      <LinearGradient
        colors={gradientColors as [string, string, ...string[]]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.quickActionIconContainer}
      >
        <Icon size={22} color="#FFFFFF" />
      </LinearGradient>
      
      <View style={styles.quickActionTextContainer}>
        <Text style={[styles.quickActionTitle, { color: colors.textPrimary }]}>{title}</Text>
        <Text style={[styles.quickActionSubtitle, { color: colors.textSecondary }]}>{subtitle}</Text>
      </View>

      {badgeCount !== undefined && badgeCount > 0 && (
        <View style={styles.badgeContainer}>
          <Text style={styles.badgeText}>{badgeCount}</Text>
        </View>
      )}

      <ChevronRight size={18} color={colors.textMuted} style={styles.chevron} />
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <StatusBar style={isDarkMode ? 'light' : 'dark'} />

      {/* Top Header */}
      <View style={[styles.header, { backgroundColor: colors.background }]}>
        <View style={styles.logoContainer}>
          <Text style={[styles.appName, { color: colors.primary }]}>Peopleo</Text>
          <Text style={[styles.companyName, { color: colors.textSecondary }]}>
            {companyDetails?.name || 'Dashboard'}
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
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Welcome Section with Illustration */}
        <View style={[styles.welcomeCard, { borderColor: isDarkMode ? 'rgba(129, 140, 248, 0.2)' : 'rgba(99, 102, 241, 0.08)' }]}>
          <LinearGradient
            colors={isDarkMode ? ['#151D30', '#1E1B4B'] : ['#EEF2FF', '#F5F3FF']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.welcomeGradient}
          >
            <View style={styles.welcomeTextContainer}>
              <Text style={[styles.welcomeGreeting, { color: colors.primary }]}>Welcome Back,</Text>
              <Text style={[styles.ownerName, { color: colors.textPrimary }]}>
                {userDetails?.fullName?.split(' ')[0] || 'Manager'}
              </Text>
              <Text style={[styles.welcomeQuote, { color: colors.textSecondary }]}>
                Here is your team's overview for today.
              </Text>

              {/* Date Selector Button */}
              <TouchableOpacity
                style={[styles.dateSelector, { backgroundColor: colors.card, borderColor: colors.border }]}
                onPress={() => setShowDatePicker(true)}
                activeOpacity={0.7}
              >
                <Calendar size={14} color={colors.primary} />
                <Text style={[styles.dateSelectorText, { color: colors.textPrimary }]}>
                  {getDisplayDate(selectedDate)}
                </Text>
              </TouchableOpacity>
            </View>

            <View style={styles.illustrationContainer}>
              <OwnerHomeIllustration width={120} height={100} />
            </View>
          </LinearGradient>
        </View>

        {showDatePicker && (
          <DateTimePicker
            value={new Date(selectedDate)}
            mode="date"
            display="default"
            onChange={(event, date) => {
              setShowDatePicker(false);
              if (date) {
                setSelectedDate(date.toISOString().slice(0, 10));
              }
            }}
          />
        )}

        {/* Attendance Dashboard Card */}
        <Animated.View
          style={[
            styles.dashboardCard,
            {
              backgroundColor: colors.card,
              borderColor: colors.border,
              opacity: fadeAnim,
              transform: [{ translateY: slideAnim }],
            },
          ]}
        >
          <Text style={[styles.cardTitle, { color: colors.textPrimary }]}>Today's Snapshot</Text>

          {loading ? (
            <View style={styles.loaderContainer}>
              <ActivityIndicator size="large" color={colors.primary} />
              <Text style={[styles.loaderText, { color: colors.textSecondary }]}>Syncing records...</Text>
            </View>
          ) : (
            <View style={styles.dashboardBody}>
              {/* Donut Chart Container */}
              <View style={styles.chartWrapper}>
                <PieChart
                  data={chartData}
                  donut
                  innerCircleColor={colors.card}
                  showText={hasData}
                  textColor="white"
                  radius={80}
                  innerRadius={56}
                  textSize={10}
                  focusOnPress
                  centerLabelComponent={() => (
                    <View style={styles.chartCenter}>
                      <Text style={[styles.chartCenterHours, { color: colors.textPrimary }]}>
                        {summary ? summary.avgWorkingHours.toFixed(1) : '0.0'}
                      </Text>
                      <Text style={[styles.chartCenterLabel, { color: colors.textSecondary }]}>Avg Hrs</Text>
                    </View>
                  )}
                />
              </View>

              {/* Stats badges */}
              <View style={styles.statsColumn}>
                {/* Present */}
                <View style={styles.statBadgeRow}>
                  <View style={[styles.statDot, { backgroundColor: '#10B981' }]} />
                  <View style={styles.statInfo}>
                    <Text style={[styles.statLabel, { color: colors.textSecondary }]}>Present</Text>
                    <Text style={[styles.statCount, { color: colors.textPrimary }]}>
                      {summary?.present ?? 0}
                    </Text>
                  </View>
                </View>

                {/* Late Check-ins */}
                <View style={styles.statBadgeRow}>
                  <View style={[styles.statDot, { backgroundColor: '#F59E0B' }]} />
                  <View style={styles.statInfo}>
                    <Text style={[styles.statLabel, { color: colors.textSecondary }]}>Late In</Text>
                    <Text style={[styles.statCount, { color: colors.textPrimary }]}>
                      {summary?.lateCheckIns ?? 0}
                    </Text>
                  </View>
                </View>

                {/* On Leave */}
                <View style={styles.statBadgeRow}>
                  <View style={[styles.statDot, { backgroundColor: '#8B5CF6' }]} />
                  <View style={styles.statInfo}>
                    <Text style={[styles.statLabel, { color: colors.textSecondary }]}>On Leave</Text>
                    <Text style={[styles.statCount, { color: colors.textPrimary }]}>
                      {summary?.onLeave ?? 0}
                    </Text>
                  </View>
                </View>

                {/* Absent */}
                <View style={styles.statBadgeRow}>
                  <View style={[styles.statDot, { backgroundColor: '#EF4444' }]} />
                  <View style={styles.statInfo}>
                    <Text style={[styles.statLabel, { color: colors.textSecondary }]}>Absent</Text>
                    <Text style={[styles.statCount, { color: colors.textPrimary }]}>
                      {summary?.absent ?? 0}
                    </Text>
                  </View>
                </View>
              </View>
            </View>
          )}
        </Animated.View>

        {/* Quick Management Section */}
        <View style={styles.quickActionsSection}>
          <Text style={[styles.sectionTitle, { color: colors.textPrimary }]}>Quick Management</Text>
          <View style={styles.quickActionsList}>
            <QuickActionCard
              icon={UserCheck}
              title="Leave Approvals"
              subtitle="Review pending leave requests"
              onPress={() => router.push('/leave-approval')}
              gradientColors={['#EF4444', '#F87171']}
              badgeCount={pendingCount}
            />

            <QuickActionCard
              icon={ClipboardList}
              title="View Attendance"
              subtitle="Check in/out logs & timesheets"
              onPress={() => router.push('/(owner)/attendance')}
              gradientColors={['#6366f1', '#818cf8']}
            />

            <QuickActionCard
              icon={Users2}
              title="Manage Employees"
              subtitle="View directory & worker status"
              onPress={() => router.push('/(owner)/employees')}
              gradientColors={['#06B6D4', '#22D3EE']}
            />

            <QuickActionCard
              icon={FileBarChart2}
              title="Reports & Analytics"
              subtitle="Generate monthly insight reports"
              onPress={() => router.push('/(owner)/reports')}
              gradientColors={['#10B981', '#34D399']}
            />
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FAFBFF',
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingBottom: 40,
  },

  // --- Header ---
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: Platform.OS === 'ios' ? 4 : 12,
    paddingBottom: 16,
    backgroundColor: '#FAFBFF',
  },
  logoContainer: {
    flex: 1,
  },
  appName: {
    fontSize: 22,
    fontWeight: '900',
    color: '#6366f1',
    letterSpacing: -0.5,
  },
  companyName: {
    fontSize: 13,
    fontWeight: '600',
    color: '#64748B',
    marginTop: 2,
  },
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  bellButton: {
    width: 38,
    height: 38,
    borderRadius: 12,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: '#F1F5F9',
  },
  bellBadge: {
    position: 'absolute',
    top: 10,
    right: 10,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#EF4444',
    borderWidth: 1.5,
    borderColor: '#FFFFFF',
  },

  // --- Welcome Card & Illustration ---
  welcomeCard: {
    borderRadius: 20,
    overflow: 'hidden',
    marginBottom: 20,
    borderWidth: 1,
    borderColor: 'rgba(99, 102, 241, 0.08)',
  },
  welcomeGradient: {
    flexDirection: 'row',
    padding: 20,
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  welcomeTextContainer: {
    flex: 1.2,
    paddingRight: 10,
  },
  welcomeGreeting: {
    fontSize: 14,
    color: '#6366f1',
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  ownerName: {
    fontSize: 24,
    fontWeight: '800',
    color: '#1E1B4B',
    marginVertical: 2,
  },
  welcomeQuote: {
    fontSize: 12,
    color: '#64748B',
    marginBottom: 14,
    lineHeight: 16,
  },
  dateSelector: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 12,
    gap: 6,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    shadowColor: '#6366f1',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 6,
    elevation: 2,
  },
  dateSelectorText: {
    fontSize: 12,
    color: '#1E293B',
    fontWeight: '700',
  },
  illustrationContainer: {
    flex: 0.8,
    alignItems: 'center',
    justifyContent: 'center',
  },

  // --- Dashboard Card ---
  dashboardCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    padding: 20,
    marginBottom: 24,
    shadowColor: '#6366f1',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.06,
    shadowRadius: 20,
    elevation: 6,
    borderWidth: 1,
    borderColor: 'rgba(99, 102, 241, 0.04)',
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1e1b4b',
    marginBottom: 16,
  },
  loaderContainer: {
    height: 180,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
  },
  loaderText: {
    fontSize: 13,
    color: '#64748B',
    fontWeight: '500',
  },
  dashboardBody: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  chartWrapper: {
    flex: 1.1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  chartCenter: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  chartCenterHours: {
    fontSize: 24,
    fontWeight: '800',
    color: '#1e1b4b',
    letterSpacing: -0.5,
  },
  chartCenterLabel: {
    fontSize: 10,
    color: '#64748B',
    fontWeight: '600',
    marginTop: 2,
  },
  statsColumn: {
    flex: 0.9,
    gap: 12,
    paddingLeft: 10,
  },
  statBadgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  statDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  statInfo: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  statLabel: {
    fontSize: 13,
    color: '#64748B',
    fontWeight: '500',
  },
  statCount: {
    fontSize: 14,
    color: '#1E293B',
    fontWeight: '700',
  },

  // --- Quick Actions Grid ---
  quickActionsSection: {
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1e1b4b',
    marginBottom: 16,
  },
  quickActionsList: {
    gap: 12,
  },
  quickActionCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    padding: 14,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: '#F1F5F9',
    shadowColor: '#6366f1',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.03,
    shadowRadius: 12,
    elevation: 3,
  },
  quickActionIconContainer: {
    width: 44,
    height: 44,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
  },
  quickActionTextContainer: {
    flex: 1,
    marginLeft: 14,
  },
  quickActionTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#1E293B',
  },
  quickActionSubtitle: {
    fontSize: 12,
    color: '#64748B',
    marginTop: 2,
    fontWeight: '500',
  },
  chevron: {
    marginRight: 4,
  },
  badgeContainer: {
    backgroundColor: '#EF4444',
    borderRadius: 10,
    minWidth: 20,
    height: 20,
    paddingHorizontal: 6,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 4,
  },
  badgeText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: '800',
  },
});