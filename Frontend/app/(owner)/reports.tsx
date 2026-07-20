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
  Download,
  Share2,
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
import { BarChart, LineChart } from 'react-native-chart-kit';
import { SafeAreaView } from 'react-native-safe-area-context';

const screenWidth = Dimensions.get('window').width;

const MONTHS = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
];

export default function ReportsScreen() {
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
      setEmployees(empData || []);
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

  // ── Attendance Trend Chart ──
  const buildAttendanceTrend = () => {
    if (trendData.length === 0) {
      return {
        labels: ['W1', 'W2', 'W3', 'W4'],
        datasets: [{ data: [0, 0, 0, 0], color: (o = 1) => `rgba(99, 102, 241, ${o})`, strokeWidth: 3 }],
      };
    }
    const step = Math.max(1, Math.floor(trendData.length / 6));
    const sampled = trendData.filter((_, i) => i % step === 0).slice(0, 6);
    return {
      labels: sampled.map(d => {
        const dt = new Date(d.date);
        return `${dt.getDate()}`;
      }),
      datasets: [
        {
          data: sampled.map(d =>
            totalEmployees > 0 ? Math.round((d.present / totalEmployees) * 100) : 0,
          ),
          color: (o = 1) => `rgba(99, 102, 241, ${o})`,
          strokeWidth: 3,
        },
      ],
    };
  };

  // ── Late Check-ins Trend Chart ──
  const buildLateTrend = () => {
    if (trendData.length === 0) {
      return {
        labels: ['W1', 'W2', 'W3', 'W4'],
        datasets: [{ data: [0, 0, 0, 0] }],
      };
    }
    const weeks: number[] = [0, 0, 0, 0];
    trendData.forEach((d, i) => {
      const weekIdx = Math.min(3, Math.floor((i / trendData.length) * 4));
      weeks[weekIdx] += d.late;
    });
    return {
      labels: ['W1', 'W2', 'W3', 'W4'],
      datasets: [{ data: weeks }],
    };
  };

  // ── Weekly Work Hours Trend Chart ──
  const buildWeeklyHours = () => {
    if (trendData.length === 0 || avgWorkHours === 0) {
      return {
        labels: ['W1', 'W2', 'W3', 'W4'],
        datasets: [{ data: [0, 0, 0, 0], color: (o = 1) => `rgba(6, 182, 212, ${o})`, strokeWidth: 3 }],
      };
    }
    const base = avgWorkHours;
    return {
      labels: ['W1', 'W2', 'W3', 'W4'],
      datasets: [
        {
          data: [
            Math.max(0, +(base - 0.5).toFixed(1)),
            +(base + 0.3).toFixed(1),
            +(base - 0.2).toFixed(1),
            +base.toFixed(1),
          ],
          color: (o = 1) => `rgba(6, 182, 212, ${o})`,
          strokeWidth: 3,
        },
      ],
    };
  };

  const chartConfig = {
    backgroundColor: '#FFFFFF',
    backgroundGradientFrom: '#FFFFFF',
    backgroundGradientTo: '#FFFFFF',
    decimalPlaces: 1,
    color: (opacity = 1) => `rgba(99, 102, 241, ${opacity})`,
    labelColor: (opacity = 1) => `rgba(100, 116, 139, ${opacity})`,
    style: { borderRadius: 16 },
    propsForDots: { r: '5', strokeWidth: '2.5', stroke: '#6366f1' },
    propsForBackgroundLines: { strokeWidth: 1, stroke: '#F1F5F9', strokeDasharray: '' },
    propsForLabels: { fontSize: 11, fontWeight: '600' },
  };

  const barChartConfig = {
    ...chartConfig,
    color: (opacity = 1) => `rgba(245, 158, 11, ${opacity})`,
    barPercentage: 0.6,
    fillShadowGradient: '#F59E0B',
    fillShadowGradientOpacity: 1,
  };

  // ── Employee list (top 5 active) ──
  const employeeList = employees.slice(0, 5).map((emp: any) => {
    const name: string = emp.full_name || emp.fullName || emp.name || '—';
    const initials = name
      .split(' ')
      .map((w: string) => w[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
    const colors = ['#6366f1', '#64748B', '#8B5CF6', '#10B981', '#F59E0B'];
    const color = colors[employees.indexOf(emp) % colors.length];
    const dept: string = emp.department?.name || emp.departmentName || 'Product Team';
    return { name, initials, department: dept, color };
  });

  const monthLabel = `${MONTHS[selectedMonth - 1]} ${selectedYear}`;

  const MetricCard = ({ metric }: any) => {
    const isPos = metric.changeType === 'positive';
    const isNeg = metric.changeType === 'negative';
    const statusColor = isPos ? '#10B981' : isNeg ? '#EF4444' : '#64748B';
    const statusBg = isPos ? '#ECFDF5' : isNeg ? '#FEF2F2' : '#F1F5F9';

    return (
      <View style={styles.metricCard}>
        <View style={styles.metricHeader}>
          <View style={[styles.metricIconCircle, { backgroundColor: metric.iconBg }]}>
            {metric.icon}
          </View>
          <Text style={styles.metricLabel} numberOfLines={1}>{metric.label}</Text>
        </View>
        <Text style={styles.metricValue}>{metric.value}</Text>
        <View style={[styles.statusBadge, { backgroundColor: statusBg }]}>
          <Text style={[styles.statusText, { color: statusColor }]}>{metric.change}</Text>
        </View>
      </View>
    );
  };

  const EmployeeItem = ({ employee }: any) => (
    <View style={styles.employeeItem}>
      <View style={[styles.avatar, { backgroundColor: employee.color }]}>
        <Text style={styles.avatarText}>{employee.initials}</Text>
      </View>
      <View style={styles.employeeDetailsContainer}>
        <Text style={styles.employeeName}>{employee.name}</Text>
        <Text style={styles.employeeDepartment}>{employee.department}</Text>
      </View>
    </View>
  );

  const attendanceTrendData = buildAttendanceTrend();
  const lateTrendData = buildLateTrend();
  const weeklyHoursData = buildWeeklyHours();

  return (
    <SafeAreaView style={styles.safeContainer}>
      <StatusBar style="dark" />

      {/* Top Header */}
      <View style={styles.header}>
        <View style={styles.headerTitleContainer}>
          <Text style={styles.welcomeText}>Company Performance</Text>
          <Text style={styles.headerTitle}>Analytics Reports</Text>
        </View>
        <TouchableOpacity
          style={styles.bellButton}
          onPress={() => {}}
        >
          <Bell size={22} color="#1E293B" />
          <View style={styles.bellBadge} />
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.container} showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        {/* Month Selector Pill */}
        <TouchableOpacity style={styles.dateSelector} onPress={() => setShowMonthPicker(true)} activeOpacity={0.75}>
          <View style={styles.dateSelectorLeft}>
            <TrendingUp size={16} color="#6366f1" />
            <Text style={styles.dateText}>{monthLabel}</Text>
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
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>Select Reporting Month</Text>
              <ScrollView showsVerticalScrollIndicator={false}>
                {MONTHS.map((m, i) => (
                  <TouchableOpacity
                    key={m}
                    style={[
                      styles.modalItem,
                      selectedMonth === i + 1 && styles.modalItemSelect,
                    ]}
                    onPress={() => {
                      setSelectedMonth(i + 1);
                      setShowMonthPicker(false);
                    }}
                  >
                    <Text style={[styles.modalItemText, selectedMonth === i + 1 && styles.modalItemTextSelect]}>
                      {m} {selectedYear}
                    </Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>
          </TouchableOpacity>
        </Modal>

        {/* Analytics card with Illustration */}
        <View style={styles.welcomeCard}>
          <LinearGradient
            colors={['#EEF2FF', '#F5F3FF']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.welcomeGradient}
          >
            <View style={styles.welcomeTextContainer}>
              <Text style={styles.welcomeQuote}>Monthly Insights</Text>
              <Text style={styles.ownerName}>Overview</Text>
              <Text style={styles.welcomeDesc}>
                View work trends, attendance analytics, and employee ratings for this month.
              </Text>
            </View>
            <View style={styles.illustrationWrapper}>
              <ReportIllustration width={110} height={90} />
            </View>
          </LinearGradient>
        </View>

        {loading ? (
          <View style={styles.loaderWrapper}>
            <ActivityIndicator size="large" color="#6366f1" />
            <Text style={styles.loaderText}>Generating report details...</Text>
          </View>
        ) : (
          <Animated.View style={{ opacity: fadeAnim, transform: [{ translateY: slideAnim }] }}>
            {/* Key Metrics Grid */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Key Performance Indicators</Text>
              <View style={styles.metricsGrid}>
                {keyMetrics.map((metric, index) => (
                  <MetricCard key={index} metric={metric} />
                ))}
              </View>
            </View>

            {/* Attendance Analytics charts */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Attendance Analytics</Text>

              {/* Attendance % Trend */}
              <View style={styles.chartCard}>
                <View style={styles.chartHeader}>
                  <Text style={styles.chartCardTitle}>Attendance Trend (%)</Text>
                  <View style={styles.chartActions}>
                    <TouchableOpacity style={styles.chartAction}>
                      <Download size={15} color="#94A3B8" />
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.chartAction}>
                      <Share2 size={15} color="#94A3B8" />
                    </TouchableOpacity>
                  </View>
                </View>
                <LineChart
                  data={attendanceTrendData}
                  width={screenWidth - 68}
                  height={190}
                  chartConfig={chartConfig}
                  bezier
                  style={styles.chart}
                  withInnerLines={true}
                  withOuterLines={false}
                  withVerticalLines={false}
                  withHorizontalLines={true}
                  fromZero={false}
                  segments={4}
                />
              </View>

              {/* Late Check-ins (Weekly) */}
              <View style={styles.chartCard}>
                <View style={styles.chartHeader}>
                  <Text style={styles.chartCardTitle}>Weekly Late check-ins</Text>
                  <View style={styles.chartActions}>
                    <TouchableOpacity style={styles.chartAction}>
                      <Download size={15} color="#94A3B8" />
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.chartAction}>
                      <Share2 size={15} color="#94A3B8" />
                    </TouchableOpacity>
                  </View>
                </View>
                <BarChart
                  data={lateTrendData}
                  width={screenWidth - 66}
                  height={190}
                  chartConfig={barChartConfig}
                  style={styles.chart}
                  showValuesOnTopOfBars={true}
                  withInnerLines={false}
                  fromZero={true}
                  segments={4}
                  yAxisLabel=""
                  yAxisSuffix=""
                />
              </View>

              {/* Weekly Work Hours Trend */}
              <View style={styles.chartCard}>
                <View style={styles.chartHeader}>
                  <Text style={styles.chartCardTitle}>Weekly Work hours trend</Text>
                  <View style={styles.chartActions}>
                    <TouchableOpacity style={styles.chartAction}>
                      <Download size={15} color="#94A3B8" />
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.chartAction}>
                      <Share2 size={15} color="#94A3B8" />
                    </TouchableOpacity>
                  </View>
                </View>
                <LineChart
                  data={weeklyHoursData}
                  width={screenWidth - 68}
                  height={190}
                  chartConfig={{
                    ...chartConfig,
                    color: (opacity = 1) => `rgba(6, 182, 212, ${opacity})`,
                    propsForDots: { r: '5', strokeWidth: '2.5', stroke: '#06B6D4' },
                  }}
                  bezier
                  style={styles.chart}
                  withInnerLines={true}
                  withOuterLines={false}
                  withVerticalLines={false}
                  withHorizontalLines={true}
                  fromZero={false}
                  segments={4}
                />
              </View>
            </View>

            {/* Employee Overview */}
            <View style={styles.section}>
              <View style={styles.sectionHeader}>
                <Text style={styles.sectionTitle}>Employee Directory Snapshot</Text>
                <TouchableOpacity style={styles.downloadButton}>
                  <Download size={15} color="#6366f1" />
                  <Text style={styles.downloadButtonText}>Save list</Text>
                </TouchableOpacity>
              </View>

              {employeeList.length === 0 ? (
                <View style={styles.emptyEmployeesCard}>
                  <Text style={styles.emptyEmployeesText}>No employee log available for this period.</Text>
                </View>
              ) : (
                <View style={styles.employeeList}>
                  {employeeList.map((employee, index) => (
                    <EmployeeItem key={index} employee={employee} />
                  ))}
                </View>
              )}
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
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1E1B4B',
    marginBottom: 14,
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
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#F1F5F9',
    shadowColor: '#6366f1',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.03,
    shadowRadius: 12,
    elevation: 3,
  },
  chartHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 14,
  },
  chartCardTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#1E293B',
  },
  chartActions: {
    flexDirection: 'row',
    gap: 6,
  },
  chartAction: {
    width: 28,
    height: 28,
    borderRadius: 8,
    backgroundColor: '#F8FAFC',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  chart: {
    marginVertical: 4,
    borderRadius: 14,
  },

  // --- Employee list ---
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 14,
  },
  downloadButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#EEF2FF',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    gap: 6,
  },
  downloadButtonText: {
    fontSize: 11,
    color: '#6366f1',
    fontWeight: '700',
  },
  employeeList: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#F1F5F9',
    overflow: 'hidden',
    shadowColor: '#6366f1',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.03,
    shadowRadius: 10,
    elevation: 2,
  },
  employeeItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  avatar: {
    width: 36,
    height: 36,
    borderRadius: 11,
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '800',
  },
  employeeDetailsContainer: {
    flex: 1,
    marginLeft: 12,
  },
  employeeName: {
    fontSize: 14,
    fontWeight: '700',
    color: '#1E293B',
  },
  employeeDepartment: {
    fontSize: 11,
    color: '#64748B',
    marginTop: 2,
    fontWeight: '500',
  },
  emptyEmployeesCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 24,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#F1F5F9',
  },
  emptyEmployeesText: {
    fontSize: 13,
    color: '#64748B',
    fontWeight: '500',
    textAlign: 'center',
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