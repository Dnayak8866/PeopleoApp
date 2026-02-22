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
import {
  CalendarDays,
  ChevronLeft,
  ChevronRight,
  Users,
  UserCheck,
  UserX,
  Clock,
  Briefcase,
  TrendingUp
} from 'lucide-react-native';
import { useAuth } from '@/context/AuthContext';
import { Colors } from '@/constants/Colors';
import { getCompanyStats } from '@/services/api/attendance';
import { LineChart, BarChart } from 'react-native-gifted-charts';
import { HeaderAvatar } from '@/components/HeaderAvatar';

const { width } = Dimensions.get('window');

export default function OwnerReportsScreen() {
  const { companyId } = useAuth();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<any>(null);
  const [currentDate, setCurrentDate] = useState(new Date());

  const fetchData = useCallback(async () => {
    if (!companyId) return;
    setLoading(true);
    try {
      const month = currentDate.getMonth() + 1;
      const year = currentDate.getFullYear();
      const data = await getCompanyStats(companyId, month, year);
      setStats(data);
    } catch (error) {
      console.error('Failed to fetch company reports:', error);
    } finally {
      setLoading(false);
    }
  }, [companyId, currentDate]);

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

  // Process Trend Data for Chart
  const lineData = stats?.trendData?.map((item: any) => ({
    value: item.present,
    dataPointText: item.present.toString(),
    label: new Date(item.date).getDate().toString(),
  })) || [];

  const barData = stats?.trendData?.slice(-7).map((item: any) => ({
    value: item.late,
    label: new Date(item.date).getDate().toString(),
    frontColor: '#F59E0B',
  })) || [];

  const MetricCard = ({ label, value, icon: Icon, color, subValue }: any) => (
    <View style={styles.metricCard}>
      <View style={[styles.iconBox, { backgroundColor: color + '15' }]}>
        <Icon size={22} color={color} />
      </View>
      <View style={styles.metricContent}>
        <Text style={styles.metricLabel}>{label}</Text>
        <Text style={styles.metricValue}>{value}</Text>
        {subValue && <Text style={styles.metricSubValue}>{subValue}</Text>}
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <View>
          <Text style={styles.headerSubtitle}>Overview</Text>
          <Text style={styles.headerTitle}>Company Reports</Text>
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

        {/* Key Metrics Grid */}
        <View style={styles.metricsGrid}>
          <MetricCard
            label="Avg. Attendance"
            value={`${stats?.companySummary?.avgAttendance || 0}%`}
            icon={TrendingUp}
            color="#10B981"
            subValue="Monthly Average"
          />
          <MetricCard
            label="Total Present"
            value={stats?.companySummary?.totalPresent || 0}
            icon={UserCheck}
            color={Colors.primary}
            subValue="Man-days this month"
          />
          <MetricCard
            label="Late Check-ins"
            value={stats?.companySummary?.totalLate || 0}
            icon={Clock}
            color="#F59E0B"
            subValue="Requires Attention"
          />
          <MetricCard
            label="Avg. Work Hours"
            value={`${stats?.companySummary?.avgWorkingHours || 0}h`}
            icon={Briefcase}
            color="#8B5CF6"
            subValue="Per day average"
          />
        </View>

        {/* Attendance Trend Line Chart */}
        <View style={styles.chartSection}>
          <Text style={styles.sectionTitle}>Daily Attendance Trend</Text>
          <View style={styles.chartContainer}>
            {lineData.length > 0 ? (
              <LineChart
                data={lineData}
                thickness={3}
                color={Colors.primary}
                noOfSections={4}
                areaChart
                startFillColor={Colors.primary}
                startOpacity={0.2}
                endOpacity={0.05}
                spacing={Math.max(30, (width - 100) / lineData.length)}
                initialSpacing={10}
                yAxisColor="#F3F4F6"
                xAxisColor="#F3F4F6"
                yAxisTextStyle={{ color: '#9CA3AF', fontSize: 10 }}
                xAxisLabelTextStyle={{ color: '#6B7280', fontSize: 10 }}
                hideDataPoints={lineData.length > 15}
                dataPointsColor={Colors.primary}
              />
            ) : (
              <Text style={styles.noData}>No data for this period</Text>
            )}
          </View>
        </View>

        {/* Late Check-ins Bar Chart */}
        <View style={styles.chartSection}>
          <Text style={styles.sectionTitle}>Late Check-ins (Last 7 Days)</Text>
          <View style={styles.chartContainer}>
            {barData.length > 0 ? (
              <BarChart
                data={barData}
                barWidth={22}
                spacing={15}
                roundedTop
                hideRules
                yAxisThickness={0}
                xAxisThickness={0}
                yAxisTextStyle={{ color: '#9CA3AF', fontSize: 10 }}
                xAxisLabelTextStyle={{ color: '#6B7280', fontSize: 10 }}
                noOfSections={3}
              />
            ) : (
              <Text style={styles.noData}>No late records found</Text>
            )}
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
  metricsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: 14,
    paddingBottom: 20,
  },
  metricCard: {
    width: (width - 48) / 2,
    backgroundColor: '#FFFFFF',
    margin: 6,
    padding: 16,
    borderRadius: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 2,
  },
  iconBox: {
    width: 44,
    height: 44,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  metricContent: {
    gap: 2,
  },
  metricLabel: {
    fontSize: 12,
    color: '#6B7280',
    fontWeight: '600',
  },
  metricValue: {
    fontSize: 20,
    fontWeight: '800',
    color: '#111827',
  },
  metricSubValue: {
    fontSize: 10,
    color: '#9CA3AF',
    marginTop: 2,
  },
  chartSection: {
    backgroundColor: '#FFFFFF',
    marginHorizontal: 20,
    padding: 24,
    borderRadius: 32,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 20,
    elevation: 4,
  },
  sectionTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 20,
  },
  chartContainer: {
    alignItems: 'center',
    marginLeft: -20, // Adjust for chart left padding
  },
  noData: {
    textAlign: 'center',
    color: '#9CA3AF',
    paddingVertical: 30,
    fontSize: 14,
  },
});