import React, { useState, useEffect, useCallback, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Dimensions,
  Platform,
  Animated,
} from 'react-native';
import { CalendarDays, ChevronLeft, ChevronRight, BriefcaseBusiness, Clock, PieChart as PieIcon, BarChart as BarIcon, Calendar } from 'lucide-react-native';
import { useRouter } from 'expo-router';
import { useAuth } from '@/context/AuthContext';
import { Colors } from '@/constants/Colors';
import { getEmployeeStats } from '@/services/api/attendance';
import { getLeaveBalances } from '@/services/api/leaves';
import { PieChart, BarChart } from 'react-native-gifted-charts';
import { HeaderAvatar } from '@/components/HeaderAvatar';
import { SafeAreaView } from 'react-native-safe-area-context';
import ReportIllustration from '@/components/illustrations/ReportIllustration';
import { LinearGradient } from 'expo-linear-gradient';
import { StatusBar } from 'expo-status-bar';

const { width } = Dimensions.get('window');

export default function EmployeeReportsScreen() {
  const router = useRouter();
  const { userDetails, userId, companyId } = useAuth();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<any>(null);
  const [balances, setBalances] = useState<any[]>([]);

  // Month/Year navigation
  const [currentDate, setCurrentDate] = useState(new Date());

  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(15)).current;

  const fetchData = useCallback(async () => {
    if (!userId || !companyId) return;
    setLoading(true);
    try {
      const month = currentDate.getMonth() + 1;
      const year = currentDate.getFullYear();

      const [statsData, balanceData] = await Promise.all([
        getEmployeeStats(userId, month, year),
        getLeaveBalances(userId, companyId)
      ]);

      setStats(statsData);
      setBalances(balanceData);
    } catch (error) {
      console.error('Failed to fetch report data:', error);
    } finally {
      setLoading(false);
    }
  }, [userId, companyId, currentDate]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  useEffect(() => {
    if (!loading) {
      fadeAnim.setValue(0);
      slideAnim.setValue(15);
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 400,
          useNativeDriver: true,
        }),
        Animated.timing(slideAnim, {
          toValue: 0,
          duration: 400,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [loading, stats]);

  const changeMonth = (delta: number) => {
    const newDate = new Date(currentDate);
    newDate.setMonth(newDate.getMonth() + delta);
    setCurrentDate(newDate);
  };

  const monthNames = ["January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];

  // Prepare Pie Chart Data
  const summary = stats?.monthlySummary;
  const pieData = summary ? [
    ...(summary.presentDays > 0 ? [{ value: summary.presentDays, color: '#10B981', text: 'P' }] : []),
    ...(summary.absentDays > 0 ? [{ value: summary.absentDays, color: '#EF4444', text: 'A' }] : []),
    ...(summary.onLeaveDays > 0 ? [{ value: summary.onLeaveDays, color: '#6366f1', text: 'L' }] : []),
  ] : [];

  // Prepare Bar Chart Data for Last 7 Days with Weekday labels (Mon, Tues, Wed, Thu, Fri, Sat, Sun)
  const DAY_NAMES = ['Sun', 'Mon', 'Tues', 'Wed', 'Thu', 'Fri', 'Sat'];

  const hoursMap = new Map<string, number>();
  if (stats?.chartData && Array.isArray(stats.chartData)) {
    stats.chartData.forEach((item: any) => {
      let dateKey = '';
      if (typeof item.date === 'string') {
        dateKey = item.date.split('T')[0];
      } else if (item.date instanceof Date) {
        dateKey = `${item.date.getFullYear()}-${String(item.date.getMonth() + 1).padStart(2, '0')}-${String(item.date.getDate()).padStart(2, '0')}`;
      }
      if (dateKey) {
        hoursMap.set(dateKey, item.hours || 0);
      }
    });
  }

  const last7DaysData: any[] = [];
  const baseDate = new Date(currentDate);
  const now = new Date();
  const isCurrentMonth = now.getFullYear() === baseDate.getFullYear() && now.getMonth() === baseDate.getMonth();
  const endDate = isCurrentMonth ? new Date(now) : new Date(baseDate.getFullYear(), baseDate.getMonth() + 1, 0);

  for (let i = 6; i >= 0; i--) {
    const d = new Date(endDate);
    d.setDate(d.getDate() - i);

    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, '0');
    const dayNum = String(d.getDate()).padStart(2, '0');
    const dateStr = `${y}-${m}-${dayNum}`;

    const hours = hoursMap.get(dateStr) || 0;
    const dayLabel = DAY_NAMES[d.getDay()];

    last7DaysData.push({
      value: Math.min(10, Math.max(0, hours)),
      label: dayLabel,
      frontColor: hours > 0 ? '#6366f1' : '#CBD5E1',
    });
  }

  const barData = last7DaysData;

  const StatCard = ({ label, value, subLabel, icon: Icon, color }: any) => (
    <View style={styles.statCard}>
      <View style={[styles.iconBox, { backgroundColor: color + '12' }]}>
        <Icon size={18} color={color} />
      </View>
      <View style={styles.statInfo}>
        <Text style={styles.statValue}>{value}</Text>
        <Text style={styles.statLabel}>{label}</Text>
        {subLabel && <Text style={styles.statSubLabel}>{subLabel}</Text>}
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.safeContainer}>
      <StatusBar style="dark" />

      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerTitleContainer}>
          <Text style={styles.welcomeText}>Personal</Text>
          <Text style={styles.headerTitle}>My Reports</Text>
        </View>
        <HeaderAvatar size={38} />
      </View>

      <ScrollView
        style={styles.container}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Welcome Analytics Card & Illustration */}
        <View style={styles.welcomeCard}>
          <LinearGradient
            colors={['#EEF2FF', '#F5F3FF']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.welcomeGradient}
          >
            <View style={styles.welcomeTextContainer}>
              <Text style={styles.welcomeQuote}>Insights & Logs</Text>
              <Text style={styles.ownerName}>Analytics</Text>
              <Text style={styles.welcomeDesc}>
                Track your attendance metrics, daily worked hours, and remaining leaves.
              </Text>
            </View>
            <View style={styles.illustrationWrapper}>
              <ReportIllustration width={110} height={90} />
            </View>
          </LinearGradient>
        </View>

        {/* Month Selector */}
        <View style={styles.monthSelector}>
          <TouchableOpacity
            style={styles.navButton}
            onPress={() => changeMonth(-1)}
            activeOpacity={0.7}
          >
            <ChevronLeft size={16} color="#475569" />
          </TouchableOpacity>
          <View style={styles.dateDisplay}>
            <CalendarDays size={16} color="#6366f1" />
            <Text style={styles.dateText}>
              {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
            </Text>
          </View>
          <TouchableOpacity
            style={styles.navButton}
            onPress={() => changeMonth(1)}
            activeOpacity={0.7}
          >
            <ChevronRight size={16} color="#475569" />
          </TouchableOpacity>
        </View>

        {loading ? (
          <View style={styles.loaderWrapper}>
            <ActivityIndicator size="large" color="#6366f1" />
            <Text style={styles.loaderText}>Loading analytics...</Text>
          </View>
        ) : (
          <Animated.View style={{ opacity: fadeAnim, transform: [{ translateY: slideAnim }] }}>
            {/* Summary Row */}
            <View style={styles.statsGrid}>
              <StatCard
                label="Attendance"
                value={`${stats?.monthlySummary?.attendancePercentage || 0}%`}
                subLabel={`${stats?.monthlySummary?.presentDays || 0} days present`}
                icon={PieIcon}
                color="#10B981"
              />
              <StatCard
                label="Avg. Hours"
                value={`${stats?.monthlySummary?.avgWorkingHours || 0}h`}
                subLabel="Hours per day"
                icon={Clock}
                color="#F59E0B"
              />
            </View>

            {/* Attendance Distribution Chart */}
            <View style={styles.chartSection}>
              <Text style={styles.sectionTitle}>Attendance Distribution</Text>
              <View style={styles.pieContainer}>
                {pieData.length > 0 && stats?.monthlySummary?.totalDays > 0 ? (
                  <View style={styles.chartAndCenterLabel}>
                    <PieChart
                      data={pieData}
                      donut
                      radius={72}
                      innerRadius={50}
                      centerLabelComponent={() => (
                        <View style={{ alignItems: 'center' }}>
                          <Text style={{ fontSize: 20, fontWeight: '800', color: '#1E1B4B' }}>
                            {stats?.monthlySummary?.totalDays || 0}
                          </Text>
                          <Text style={{ fontSize: 9, color: '#64748B', fontWeight: '700', textTransform: 'uppercase' }}>Days</Text>
                        </View>
                      )}
                    />
                  </View>
                ) : (
                  <View style={styles.emptyChart}>
                    <Text style={styles.noData}>No attendance logs available.</Text>
                  </View>
                )}
                <View style={styles.legend}>
                  <View style={styles.legendItem}>
                    <View style={[styles.dot, { backgroundColor: '#10B981' }]} />
                    <Text style={styles.legendText}>Present ({stats?.monthlySummary?.presentDays || 0})</Text>
                  </View>
                  <View style={styles.legendItem}>
                    <View style={[styles.dot, { backgroundColor: '#EF4444' }]} />
                    <Text style={styles.legendText}>Absent ({stats?.monthlySummary?.absentDays || 0})</Text>
                  </View>
                  <View style={styles.legendItem}>
                    <View style={[styles.dot, { backgroundColor: '#6366f1' }]} />
                    <Text style={styles.legendText}>Leave ({stats?.monthlySummary?.onLeaveDays || 0})</Text>
                  </View>
                </View>
              </View>
            </View>

            {/* Working Hours Bar Chart */}
            <View style={styles.chartSection}>
              <Text style={styles.sectionTitle}>Working Hours (Last 7 Days)</Text>
              <View style={styles.barContainer}>
                {barData.length > 0 ? (
                  <BarChart
                    data={barData}
                    barWidth={18}
                    spacing={16}
                    roundedTop
                    roundedBottom
                    hideRules={false}
                    rulesType="dashed"
                    rulesColor="#F1F5F9"
                    yAxisThickness={0}
                    xAxisThickness={1}
                    xAxisColor="#E2E8F0"
                    yAxisTextStyle={{ color: '#94A3B8', fontSize: 10, fontWeight: '600' }}
                    xAxisLabelTextStyle={{ color: '#64748B', fontSize: 11, fontWeight: '600' }}
                    noOfSections={5}
                    maxValue={10}
                    stepValue={2}
                    yAxisLabelTexts={['0', '2', '4', '6', '8', '10']}
                  />
                ) : (
                  <Text style={styles.noData}>Not enough check-in logs for charts.</Text>
                )}
              </View>
            </View>

            {/* Leave Balances Section */}
            <View style={styles.chartSection}>
              <View style={styles.sectionHeader}>
                <Text style={styles.sectionTitle}>Leave Balance</Text>
                <TouchableOpacity
                  onPress={() => router.push('/employee/apply-leave')}
                  activeOpacity={0.7}
                >
                  <Text style={styles.actionText}>Apply Leave</Text>
                </TouchableOpacity>
              </View>
              <View style={styles.balanceList}>
                {balances.map((item, index) => {
                  const percentage = Math.min(((item.total_allowed - item.remaining) / item.total_allowed) * 100, 100);
                  return (
                    <View key={index} style={styles.balanceItem}>
                      <View style={styles.balanceInfo}>
                        <Text style={styles.balanceName}>{item.type_name}</Text>
                        <Text style={styles.balanceUsed}>Used: {item.used} / {item.total_allowed}</Text>
                      </View>
                      <View style={styles.balanceTrack}>
                        <View
                          style={[
                            styles.balanceFill,
                            { width: `${percentage}%` }
                          ]}
                        />
                        <Text style={styles.balanceRemaining}>{item.remaining} Days Left</Text>
                      </View>
                    </View>
                  );
                })}
              </View>
            </View>
          </Animated.View>
        )}

        <View style={{ height: 20 }} />
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
    paddingBottom: 12,
  },
  headerTitleContainer: {
    flex: 1,
  },
  welcomeText: {
    fontSize: 12,
    color: '#6366f1',
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: '800',
    color: '#1E1B4B',
    marginTop: 2,
  },

  // --- Welcome Card ---
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
    paddingRight: 8,
  },
  welcomeQuote: {
    fontSize: 12,
    color: '#6366f1',
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  ownerName: {
    fontSize: 24,
    fontWeight: '800',
    color: '#1E1B4B',
    marginVertical: 2,
  },
  welcomeDesc: {
    fontSize: 11,
    color: '#64748B',
    lineHeight: 16,
  },
  illustrationWrapper: {
    flex: 0.8,
    alignItems: 'center',
    justifyContent: 'center',
  },

  // --- Month Selector ---
  monthSelector: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderWidth: 1,
    borderColor: '#F1F5F9',
    marginBottom: 20,
    shadowColor: '#6366f1',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.02,
    shadowRadius: 10,
    elevation: 2,
  },
  navButton: {
    width: 32,
    height: 32,
    borderRadius: 10,
    backgroundColor: '#F8FAFC',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  dateDisplay: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  dateText: {
    fontSize: 14,
    fontWeight: '800',
    color: '#1E1B4B',
  },

  // --- Summary Grid ---
  statsGrid: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 20,
  },
  statCard: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    padding: 14,
    borderRadius: 20,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    borderWidth: 1,
    borderColor: '#F1F5F9',
    shadowColor: '#6366f1',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.03,
    shadowRadius: 10,
    elevation: 2,
  },
  iconBox: {
    width: 36,
    height: 36,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  statInfo: {
    flex: 1,
  },
  statValue: {
    fontSize: 18,
    fontWeight: '800',
    color: '#1E293B',
  },
  statLabel: {
    fontSize: 11,
    color: '#64748B',
    fontWeight: '700',
    marginTop: 1,
  },
  statSubLabel: {
    fontSize: 9,
    color: '#94A3B8',
    marginTop: 2,
    fontWeight: '500',
  },

  // --- Chart Sections ---
  chartSection: {
    backgroundColor: '#FFFFFF',
    padding: 20,
    borderRadius: 22,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#F1F5F9',
    shadowColor: '#6366f1',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.03,
    shadowRadius: 12,
    elevation: 3,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  sectionTitle: {
    fontSize: 15,
    fontWeight: '800',
    color: '#1E1B4B',
    marginBottom: 14,
  },
  actionText: {
    fontSize: 12,
    color: '#6366f1',
    fontWeight: '700',
  },
  pieContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    paddingVertical: 10,
  },
  chartAndCenterLabel: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  legend: {
    gap: 10,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  legendText: {
    fontSize: 12,
    color: '#475569',
    fontWeight: '600',
  },
  barContainer: {
    alignItems: 'center',
    paddingTop: 14,
    paddingBottom: 4,
  },
  noData: {
    textAlign: 'center',
    color: '#94A3B8',
    paddingVertical: 20,
    fontSize: 12,
    fontWeight: '600',
  },
  emptyChart: {
    alignItems: 'center',
    justifyContent: 'center',
  },

  // --- Leave Balance ---
  balanceList: {
    gap: 14,
  },
  balanceItem: {
    gap: 6,
  },
  balanceInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  balanceName: {
    fontSize: 13,
    fontWeight: '700',
    color: '#1E293B',
  },
  balanceUsed: {
    fontSize: 11,
    color: '#64748B',
    fontWeight: '600',
  },
  balanceTrack: {
    height: 22,
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 8,
    position: 'relative',
    justifyContent: 'center',
    paddingHorizontal: 10,
    overflow: 'hidden',
  },
  balanceFill: {
    position: 'absolute',
    top: 0,
    left: 0,
    bottom: 0,
    backgroundColor: 'rgba(99, 102, 241, 0.15)',
    borderRadius: 8,
  },
  balanceRemaining: {
    fontSize: 10,
    fontWeight: '800',
    color: '#6366f1',
    textTransform: 'uppercase',
  },

  // --- Loader ---
  loaderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FAFBFF',
  },
  loaderWrapper: {
    paddingVertical: 80,
    alignItems: 'center',
    gap: 8,
  },
  loaderText: {
    fontSize: 13,
    color: '#64748B',
    fontWeight: '500',
  },
});