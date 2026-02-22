import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Dimensions,
} from 'react-native';
import { CalendarDays, ChevronLeft, ChevronRight, BriefcaseBusiness, Clock, PieChart as PieIcon, BarChart as BarIcon } from 'lucide-react-native';
import { useRouter } from 'expo-router';
import { useAuth } from '@/context/AuthContext';
import { Colors } from '@/constants/Colors';
import { getEmployeeStats } from '@/services/api/attendance';
import { getLeaveBalances } from '@/services/api/leaves';
import { PieChart, BarChart } from 'react-native-gifted-charts';
import { HeaderAvatar } from '@/components/HeaderAvatar';

const { width } = Dimensions.get('window');

export default function EmployeeReportsScreen() {
  const router = useRouter();
  const { userDetails, userId, companyId } = useAuth();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<any>(null);
  const [balances, setBalances] = useState<any[]>([]);

  // Month/Year navigation
  const [currentDate, setCurrentDate] = useState(new Date());

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

  const changeMonth = (delta: number) => {
    const newDate = new Date(currentDate);
    newDate.setMonth(newDate.getMonth() + delta);
    setCurrentDate(newDate);
  };

  const monthNames = ["January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];

  if (loading && !stats) {
    return (
      <View style={styles.loaderContainer}>
        <ActivityIndicator size="large" color={Colors.primary} />
      </View>
    );
  }

  // Prepare Pie Chart Data
  const pieData = stats?.monthlySummary ? [
    { value: stats.monthlySummary.presentDays, color: '#10B981', text: 'P' },
    { value: stats.monthlySummary.absentDays, color: '#EF4444', text: 'A' },
    { value: stats.monthlySummary.onLeaveDays, color: Colors.primary, text: 'L' },
  ] : [];

  // Prepare Bar Chart Data (Last 7 days or all records)
  const barData = stats?.chartData?.slice(-7).map((item: any) => ({
    value: item.hours,
    label: new Date(item.date).getDate().toString(),
    frontColor: Colors.primary,
  })) || [];

  const StatCard = ({ label, value, subLabel, icon: Icon, color }: any) => (
    <View style={styles.statCard}>
      <View style={[styles.iconBox, { backgroundColor: color + '15' }]}>
        <Icon size={20} color={color} />
      </View>
      <View>
        <Text style={styles.statValue}>{value}</Text>
        <Text style={styles.statLabel}>{label}</Text>
        {subLabel && <Text style={styles.statSubLabel}>{subLabel}</Text>}
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <View>
          <Text style={styles.headerSubtitle}>Personal</Text>
          <Text style={styles.headerTitle}>My Reports</Text>
        </View>
        <HeaderAvatar />
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Month Selector */}
        <View style={styles.monthSelector}>
          <TouchableOpacity style={styles.navButton} onPress={() => changeMonth(-1)}>
            <ChevronLeft size={24} color="#374151" />
          </TouchableOpacity>
          <View style={styles.dateDisplay}>
            <CalendarDays size={20} color={Colors.primary} />
            <Text style={styles.dateText}>
              {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
            </Text>
          </View>
          <TouchableOpacity style={styles.navButton} onPress={() => changeMonth(1)}>
            <ChevronRight size={24} color="#374151" />
          </TouchableOpacity>
        </View>

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
            value={`${stats?.monthlySummary?.avgWorkingHours || 0}`}
            subLabel="Hours per day"
            icon={Clock}
            color="#F59E0B"
          />
        </View>

        {/* Attendance Distribution Chart */}
        <View style={styles.chartSection}>
          <Text style={styles.sectionTitle}>Attendance Distribution</Text>
          <View style={styles.pieContainer}>
            {pieData.length > 0 ? (
              <PieChart
                data={pieData}
                donut
                radius={80}
                innerRadius={55}
                centerLabelComponent={() => (
                  <View style={{ alignItems: 'center' }}>
                    <Text style={{ fontSize: 20, fontWeight: '700', color: '#111827' }}>
                      {stats?.monthlySummary?.totalDays || 0}
                    </Text>
                    <Text style={{ fontSize: 10, color: '#6B7280' }}>Working Days</Text>
                  </View>
                )}
              />
            ) : (
              <Text style={styles.noData}>No data available for this month</Text>
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
                <View style={[styles.dot, { backgroundColor: Colors.primary }]} />
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
                barWidth={22}
                spacing={15}
                roundedTop
                roundedBottom
                hideRules
                yAxisThickness={0}
                xAxisThickness={0}
                yAxisTextStyle={{ color: '#9CA3AF', fontSize: 10 }}
                xAxisLabelTextStyle={{ color: '#6B7280', fontSize: 10 }}
                noOfSections={3}
              />
            ) : (
              <Text style={styles.noData}>Not enough data for chart</Text>
            )}
          </View>
        </View>

        {/* Leave Balances Section */}
        <View style={styles.chartSection}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Leave Balance</Text>
            <TouchableOpacity onPress={() => router.push('/employee/apply-leave')}>
              <Text style={styles.actionText}>Apply Leave</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.balanceList}>
            {balances.map((item, index) => (
              <View key={index} style={styles.balanceItem}>
                <View style={styles.balanceInfo}>
                  <Text style={styles.balanceName}>{item.type_name}</Text>
                  <Text style={styles.balanceUsed}>Used: {item.used} / {item.total_allowed}</Text>
                </View>
                <View style={styles.balanceTrack}>
                  <View
                    style={[
                      styles.balanceFill,
                      { width: `${(item.remaining / item.total_allowed) * 100}%` }
                    ]}
                  />
                  <Text style={styles.balanceRemaining}>{item.remaining} Left</Text>
                </View>
              </View>
            ))}
          </View>
        </View>

        <View style={{ height: 40 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  loaderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: '#FFFFFF',
  },
  headerSubtitle: {
    fontSize: 12,
    fontWeight: '600',
    color: '#6B7280',
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: '800',
    color: '#111827',
  },
  content: {
    flex: 1,
  },
  monthSelector: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 20,
    backgroundColor: '#FFFFFF',
    marginBottom: 10,
  },
  navButton: {
    padding: 5,
    marginHorizontal: 15,
  },
  dateDisplay: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F3F4F6',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    gap: 8,
  },
  dateText: {
    fontSize: 15,
    fontWeight: '700',
    color: '#374151',
  },
  statsGrid: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    gap: 12,
    marginBottom: 20,
  },
  statCard: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderRadius: 20,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 2,
  },
  iconBox: {
    width: 40,
    height: 40,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  statValue: {
    fontSize: 18,
    fontWeight: '800',
    color: '#111827',
  },
  statLabel: {
    fontSize: 11,
    color: '#6B7280',
    fontWeight: '500',
  },
  statSubLabel: {
    fontSize: 9,
    color: '#9CA3AF',
    marginTop: 2,
  },
  chartSection: {
    backgroundColor: '#FFFFFF',
    marginHorizontal: 20,
    padding: 20,
    borderRadius: 24,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 15,
    elevation: 3,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 15,
  },
  actionText: {
    fontSize: 13,
    color: Colors.primary,
    fontWeight: '600',
  },
  pieContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
  },
  legend: {
    gap: 8,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  legendText: {
    fontSize: 12,
    color: '#4B5563',
  },
  barContainer: {
    alignItems: 'center',
    paddingTop: 10,
  },
  noData: {
    textAlign: 'center',
    color: '#9CA3AF',
    paddingVertical: 20,
    fontSize: 13,
  },
  balanceList: {
    gap: 15,
  },
  balanceItem: {
    gap: 8,
  },
  balanceInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  balanceName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
  },
  balanceUsed: {
    fontSize: 12,
    color: '#6B7280',
  },
  balanceTrack: {
    height: 24,
    backgroundColor: '#F3F4F6',
    borderRadius: 12,
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
    backgroundColor: Colors.primary + '30',
    borderRadius: 12,
  },
  balanceRemaining: {
    fontSize: 11,
    fontWeight: '700',
    color: Colors.primary,
  },
});