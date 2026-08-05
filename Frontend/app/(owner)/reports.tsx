import { useAuth } from '@/context/AuthContext';
import { useMasterDataContext } from '@/context/MasterDataContext';
import ReportIllustration from '@/components/illustrations/ReportIllustration';
import { getCompanyStats } from '@/services/api/attendance';
import { getEmployees } from '@/services/api/employees';
import { StatusBar } from 'expo-status-bar';
import { LinearGradient } from 'expo-linear-gradient';
import {
  Bell,
  Briefcase,
  CalendarX,
  ChevronDown,
  Clock,
  UserCheck,
  Users,
  UserX,
  TrendingUp,
} from 'lucide-react-native';
import React, { useCallback, useEffect, useState, useRef } from 'react';
import {
  ActivityIndicator,
  Animated,
  Dimensions,
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Platform,
} from 'react-native';
import { PieChart } from 'react-native-gifted-charts';
import { SafeAreaView } from 'react-native-safe-area-context';

const screenWidth = Dimensions.get('window').width;

const MONTHS = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
];

import { useRouter } from 'expo-router';

import { useTheme } from '@/context/ThemeContext';

export default function ReportsScreen() {
  const router = useRouter();
  const { isDarkMode, colors } = useTheme();
  const { userDetails } = useAuth();
  const { companyDetails } = useMasterDataContext();

  const now = new Date();
  const [selectedMonth, setSelectedMonth] = useState(now.getMonth() + 1); // 1-12
  const [selectedYear, setSelectedYear] = useState(now.getFullYear());
  const [showMonthPicker, setShowMonthPicker] = useState(false);

  const [companyStats, setCompanyStats] = useState<any>(null);
  const [employees, setEmployees] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(15)).current;

  const fetchData = useCallback(async () => {
    if (!userDetails?.companyId) return;
    setLoading(true);
    try {
      const [statsData, empData] = await Promise.all([
        getCompanyStats(userDetails.companyId, selectedMonth, selectedYear),
        getEmployees(),
      ]);
      setCompanyStats(statsData);
      setEmployees(Array.isArray(empData) ? empData : []);
    } catch (err) {
      console.error('Failed to load reports data:', err);
    } finally {
      setLoading(false);
    }
  }, [userDetails?.companyId, selectedMonth, selectedYear]);

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
  }, [loading, companyStats]);

  // ── Derived key metrics ──
  const summary = companyStats?.companySummary;
  const trendData: { date: string; present: number; late: number }[] =
    companyStats?.trendData ?? [];

  const totalEmployees = employees.length;
  const attendancePct = summary?.avgAttendance ?? 0;
  const latePct =
    summary && summary.totalPresent > 0
      ? Math.round((summary.totalLate / summary.totalPresent) * 100)
      : 0;
  const avgWorkHours = summary?.avgWorkingHours ?? 0;

  const daysWithData = trendData.length || 1;
  const avgPresent = summary ? Math.round(summary.totalPresent / daysWithData) : 0;
  const absentPct =
    totalEmployees > 0 ? Math.round(((totalEmployees - avgPresent) / totalEmployees) * 100) : 0;

  const keyMetrics = [
    {
      label: 'Attendance Ratio',
      value: `${attendancePct}%`,
      change: 'Avg Attendance',
      changeType: 'positive',
      icon: <UserCheck size={20} color={'#10B981'} />,
      iconBg: '#ECFDF5',
    },
    {
      label: 'Total Active',
      value: `${totalEmployees}`,
      change: 'Employees count',
      changeType: 'neutral',
      icon: <Users size={20} color={'#6366f1'} />,
      iconBg: '#EEF2FF',
    },
    {
      label: 'Absent Rate',
      value: `${absentPct}%`,
      change: 'Avg Absence',
      changeType: 'neutral',
      icon: <UserX size={20} color={'#EF4444'} />,
      iconBg: '#FEF2F2',
    },
    {
      label: 'Late Check-ins',
      value: `${latePct}%`,
      change: 'Punctuality issue',
      changeType: latePct > 15 ? 'negative' : 'neutral',
      icon: <Clock size={20} color={'#F59E0B'} />,
      iconBg: '#FFFBEB',
    },
    {
      label: 'Working Hours',
      value: `${avgWorkHours} hrs`,
      change: 'Avg per working day',
      changeType: 'positive',
      icon: <Briefcase size={20} color={'#06B6D4'} />,
      iconBg: '#ECFDF5',
    },
    {
      label: 'Total Late Days',
      value: `${summary?.totalLate ?? 0}`,
      change: 'Accumulated logs',
      changeType: (summary?.totalLate ?? 0) > 10 ? 'negative' : 'neutral',
      icon: <CalendarX size={20} color={'#8B5CF6'} />,
      iconBg: '#EFF6FF',
    },
  ];

  // ── Monthly Present vs Absent Pie Chart Data for All Employees ──
  const avgPresentEmployees = summary && daysWithData > 0 ? Math.round(summary.totalPresent / daysWithData) : 0;
  const avgAbsentEmployees = Math.max(0, totalEmployees - avgPresentEmployees);

  const presentPercentage = totalEmployees > 0 ? Math.min(100, Math.max(0, Math.round((avgPresentEmployees / totalEmployees) * 100))) : (summary?.avgAttendance ?? 0);
  const absentPercentage = Math.max(0, 100 - presentPercentage);

  const totalPresentCount = summary?.totalPresent || 0;
  const totalExpectedLogs = totalEmployees * daysWithData;
  const totalAbsentCount = Math.max(0, totalExpectedLogs - totalPresentCount);

  const pieData = [
    ...(presentPercentage > 0 ? [{
      value: presentPercentage,
      color: '#10B981',
      text: `${presentPercentage}%`,
      textColor: '#FFFFFF',
      textSize: 14,
      fontWeight: 'bold',
    }] : []),
    ...(absentPercentage > 0 ? [{
      value: absentPercentage,
      color: '#EF4444',
      text: `${absentPercentage}%`,
      textColor: '#FFFFFF',
      textSize: 14,
      fontWeight: 'bold',
    }] : []),
  ];

  if (pieData.length === 0) {
    pieData.push({
      value: 100,
      color: '#CBD5E1',
      text: '0%',
      textColor: '#FFFFFF',
      textSize: 13,
      fontWeight: 'bold',
    });
  }

  const monthLabel = `${MONTHS[selectedMonth - 1]} ${selectedYear}`;

  const MetricCard = ({ metric }: any) => {
    const isPos = metric.changeType === 'positive';
    const isNeg = metric.changeType === 'negative';
    const statusColor = isPos ? '#10B981' : isNeg ? '#EF4444' : colors.textSecondary;
    const statusBg = isPos ? (isDarkMode ? '#064E3B' : '#ECFDF5') : isNeg ? (isDarkMode ? '#7F1D1D' : '#FEF2F2') : (isDarkMode ? '#1E293B' : '#F1F5F9');

    return (
      <View style={[styles.metricCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
        <View style={styles.metricHeader}>
          <View style={[styles.metricIconCircle, { backgroundColor: isDarkMode ? '#1E1B4B' : metric.iconBg }]}>
            {metric.icon}
          </View>
          <Text style={[styles.metricLabel, { color: colors.textSecondary }]} numberOfLines={1}>{metric.label}</Text>
        </View>
        <Text style={[styles.metricValue, { color: colors.textPrimary }]}>{metric.value}</Text>
        <View style={[styles.statusBadge, { backgroundColor: statusBg }]}>
          <Text style={[styles.statusText, { color: statusColor }]}>{metric.change}</Text>
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView style={[styles.safeContainer, { backgroundColor: colors.background }]}>
      <StatusBar style={isDarkMode ? 'light' : 'dark'} />

      {/* Top Header */}
      <View style={[styles.header, { backgroundColor: colors.background }]}>
        <View style={styles.headerTitleContainer}>
          <Text style={[styles.welcomeText, { color: colors.primary }]}>Company Performance</Text>
          <Text style={[styles.headerTitle, { color: colors.textPrimary }]}>Analytics Reports</Text>
        </View>
        <TouchableOpacity
          style={[styles.bellButton, { backgroundColor: colors.card, borderColor: colors.border }]}
          onPress={() => router.push('/notifications')}
        >
          <Bell size={22} color={colors.textPrimary} />
          <View style={styles.bellBadge} />
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.container} showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        {/* Month Selector Pill */}
        <TouchableOpacity style={[styles.dateSelector, { backgroundColor: colors.card, borderColor: colors.border }]} onPress={() => setShowMonthPicker(true)} activeOpacity={0.75}>
          <View style={styles.dateSelectorLeft}>
            <TrendingUp size={16} color={colors.primary} />
            <Text style={[styles.dateText, { color: colors.primary }]}>{monthLabel}</Text>
          </View>
          <ChevronDown size={18} color="#6366f1" />
        </TouchableOpacity>

        {/* Month Picker Modal */}
        <Modal visible={showMonthPicker} transparent animationType="fade">
          <TouchableOpacity
            style={styles.modalOverlay}
            activeOpacity={1}
            onPress={() => setShowMonthPicker(false)}
          >
            <View style={[styles.modalContent, { backgroundColor: colors.card, borderColor: colors.border }]}>
              <Text style={[styles.modalTitle, { color: colors.textPrimary }]}>Select Reporting Month</Text>
              <ScrollView showsVerticalScrollIndicator={false}>
                {MONTHS.map((m, i) => (
                  <TouchableOpacity
                    key={m}
                    style={[
                      styles.modalItem,
                      { backgroundColor: isDarkMode ? '#1E293B' : '#F8FAFC' },
                      selectedMonth === i + 1 && [styles.modalItemSelect, { backgroundColor: isDarkMode ? '#2E1065' : '#EEF2FF' }],
                    ]}
                    onPress={() => {
                      setSelectedMonth(i + 1);
                      setShowMonthPicker(false);
                    }}
                  >
                    <Text style={[styles.modalItemText, { color: colors.textSecondary }, selectedMonth === i + 1 && [styles.modalItemTextSelect, { color: colors.primary }]]}>
                      {m} {selectedYear}
                    </Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>
          </TouchableOpacity>
        </Modal>

        {/* Analytics card with Illustration */}
        <View style={[styles.welcomeCard, { borderColor: isDarkMode ? 'rgba(129, 140, 248, 0.2)' : 'rgba(99, 102, 241, 0.08)' }]}>
          <LinearGradient
            colors={isDarkMode ? ['#151D30', '#1E1B4B'] : ['#EEF2FF', '#F5F3FF']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.welcomeGradient}
          >
            <View style={styles.welcomeTextContainer}>
              <Text style={[styles.welcomeQuote, { color: colors.primary }]}>Monthly Insights</Text>
              <Text style={[styles.ownerName, { color: colors.textPrimary }]}>Overview</Text>
              <Text style={[styles.welcomeDesc, { color: colors.textSecondary }]}>
                View key performance indicators and overall metrics for this month.
              </Text>
            </View>
            <View style={styles.illustrationWrapper}>
              <ReportIllustration width={110} height={90} isDarkMode={isDarkMode} />
            </View>
          </LinearGradient>
        </View>

        {loading ? (
          <View style={styles.loaderWrapper}>
            <ActivityIndicator size="large" color={colors.primary} />
            <Text style={[styles.loaderText, { color: colors.textSecondary }]}>Generating report details...</Text>
          </View>
        ) : (
          <Animated.View style={{ opacity: fadeAnim, transform: [{ translateY: slideAnim }] }}>
            {/* Key Metrics Grid */}
            <View style={styles.section}>
              <Text style={[styles.sectionTitle, { color: colors.textPrimary }]}>Key Performance Indicators</Text>
              <View style={styles.metricsGrid}>
                {keyMetrics.map((metric, index) => (
                  <MetricCard key={index} metric={metric} />
                ))}
              </View>
            </View>

            {/* All Employees Monthly Present & Absent Pie Chart */}
            <View style={styles.section}>
              <View style={styles.sectionHeaderTitle}>
                <Text style={[styles.sectionTitle, { color: colors.textPrimary }]}>All Employees Monthly Attendance</Text>
                <Text style={[styles.sectionSubtitle, { color: colors.textSecondary }]}>
                  {totalEmployees} active employees • {daysWithData} working days recorded
                </Text>
              </View>

              <View style={[styles.chartCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
                <View style={styles.pieContent}>
                  <View style={styles.pieWrapper}>
                    <PieChart
                      data={pieData}
                      showText
                      textColor="#FFFFFF"
                      textSize={14}
                      radius={76}
                      focusOnPress
                    />
                  </View>
                  <View style={styles.legendWrapper}>
                    <View style={styles.legendItem}>
                      <View style={[styles.legendDot, { backgroundColor: '#10B981' }]} />
                      <View>
                        <Text style={[styles.legendTitle, { color: colors.textPrimary }]}>Present ({presentPercentage}%)</Text>
                        <Text style={[styles.legendSubtitle, { color: colors.textSecondary }]}>
                          ~{avgPresentEmployees} employees / day
                        </Text>
                        <Text style={[styles.legendDetail, { color: colors.textMuted }]}>
                          {totalPresentCount} total present logs
                        </Text>
                      </View>
                    </View>
                    <View style={styles.legendItem}>
                      <View style={[styles.legendDot, { backgroundColor: '#EF4444' }]} />
                      <View>
                        <Text style={[styles.legendTitle, { color: colors.textPrimary }]}>Absent ({absentPercentage}%)</Text>
                        <Text style={[styles.legendSubtitle, { color: colors.textSecondary }]}>
                          ~{avgAbsentEmployees} employees / day
                        </Text>
                        <Text style={[styles.legendDetail, { color: colors.textMuted }]}>
                          {totalAbsentCount} missed logs
                        </Text>
                      </View>
                    </View>
                  </View>
                </View>
              </View>
            </View>
          </Animated.View>
        )}
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
    paddingBottom: 40,
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

  // --- Month Selector ---
  dateSelector: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 14,
    borderWidth: 1.5,
    borderColor: '#E2E8F0',
    marginBottom: 20,
    shadowColor: '#6366f1',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.02,
    shadowRadius: 6,
    elevation: 1,
  },
  dateSelectorLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  dateText: {
    fontSize: 14,
    color: '#6366f1',
    fontWeight: '700',
  },

  // --- Welcome Banner ---
  welcomeCard: {
    borderRadius: 22,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(99, 102, 241, 0.08)',
    marginBottom: 24,
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

  // --- Metrics ---
  section: {
    marginBottom: 24,
  },
  sectionHeaderTitle: {
    marginBottom: 14,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1E1B4B',
    marginBottom: 4,
  },
  sectionSubtitle: {
    fontSize: 12,
    color: '#64748B',
    fontWeight: '500',
  },
  metricsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: 12,
  },
  metricCard: {
    width: (screenWidth - 52) / 2,
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 14,
    borderWidth: 1,
    borderColor: '#F1F5F9',
    shadowColor: '#6366f1',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.03,
    shadowRadius: 10,
    elevation: 3,
  },
  metricHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 10,
  },
  metricIconCircle: {
    width: 32,
    height: 32,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  metricLabel: {
    flex: 1,
    fontSize: 11,
    color: '#64748B',
    fontWeight: '600',
  },
  metricValue: {
    fontSize: 20,
    fontWeight: '800',
    color: '#1E293B',
    marginBottom: 8,
  },
  statusBadge: {
    alignSelf: 'flex-start',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  statusText: {
    fontSize: 10,
    fontWeight: '700',
  },

  // --- Chart Card ---
  chartCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 20,
    borderWidth: 1,
    borderColor: '#F1F5F9',
    shadowColor: '#6366f1',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.03,
    shadowRadius: 10,
    elevation: 3,
  },
  pieContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
  },
  pieWrapper: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  pieCenterLabel: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  pieCenterValue: {
    fontSize: 20,
    fontWeight: '800',
    color: '#1E1B4B',
  },
  pieCenterSubtitle: {
    fontSize: 10,
    fontWeight: '700',
    color: '#10B981',
    textTransform: 'uppercase',
  },
  legendWrapper: {
    gap: 16,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  legendDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
  },
  legendTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: '#1E293B',
  },
  legendSubtitle: {
    fontSize: 11,
    fontWeight: '500',
    color: '#64748B',
    marginTop: 1,
  },
  legendDetail: {
    fontSize: 10,
    fontWeight: '500',
    color: '#94A3B8',
    marginTop: 1,
  },

  // --- Loader ---
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

  // --- Modal styles ---
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(30, 27, 75, 0.4)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    padding: 20,
    width: screenWidth - 64,
    maxHeight: 380,
    borderWidth: 1,
    borderColor: 'rgba(99, 102, 241, 0.1)',
    shadowColor: '#6366f1',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.15,
    shadowRadius: 24,
    elevation: 10,
  },
  modalTitle: {
    fontWeight: '800',
    fontSize: 16,
    color: '#1E1B4B',
    marginBottom: 16,
    textAlign: 'center',
  },
  modalItem: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 10,
    marginBottom: 6,
    backgroundColor: '#F8FAFC',
  },
  modalItemSelect: {
    backgroundColor: '#EEF2FF',
  },
  modalItemText: {
    color: '#475569',
    fontWeight: '600',
    fontSize: 14,
    textAlign: 'center',
  },
  modalItemTextSelect: {
    color: '#6366f1',
    fontWeight: '800',
  },
});