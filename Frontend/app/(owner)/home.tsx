import { Colors } from '@/constants/Colors';
import { useAuth } from '@/context/AuthContext';
import { useMasterDataContext } from '@/context/MasterDataContext';
import { ownerHomeScreenStyles } from '@/styles/ownerHomeScreenStyles';
import { HeaderAvatar } from '@/components/HeaderAvatar';
import DateTimePicker from '@react-native-community/datetimepicker';
import { router } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { ArrowUp, Bell, CalendarDays, ChartLine, ClipboardCheck, Dot, MailPlus, Users } from 'lucide-react-native';
import React, { useCallback, useEffect, useState } from 'react';
import {
  ActivityIndicator,
  ScrollView,
  Text,
  TouchableOpacity,
  View
} from 'react-native';
import { PieChart } from 'react-native-gifted-charts';
import { getDailyAttendanceSummary } from '@/services/api/attendance';
import { getPendingLeavesCount } from '@/services/api/leaves';
import { DailySummary } from '@/services/types/attendance';
import { SafeAreaView } from 'react-native-safe-area-context';

const Status = ({ label, value, trend, iconColor }: {
  label: string;
  value: string | number;
  trend?: string;
  iconColor: string;
}) => (
  <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-start', height: 40, width: '50%' }}>
    <Dot size={60} color={iconColor} />
    <Text>{label}: </Text>
    <Text>{value} {trend && <ArrowUp size={15} color={'green'} />}<Text style={{ fontSize: 10, color: 'green', fontWeight: '700', lineHeight: 11 }}>{trend}</Text></Text>
  </View>
);

export default function HomePage() {
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
  const styles = ownerHomeScreenStyles();

  const fetchSummary = useCallback(async (date: string) => {
    if (!userDetails?.companyId) return;
    setLoading(true);
    try {
      const [summaryData, pendingData] = await Promise.all([
        getDailyAttendanceSummary(date, userDetails.companyId),
        getPendingLeavesCount(userDetails.companyId)
      ]);
      setSummary(summaryData);
      setPendingCount(pendingData.count);
    } catch (err) {
      console.error('Failed to load owner home data:', err);
    } finally {
      setLoading(false);
    }
  }, [userDetails?.companyId]);

  useEffect(() => {
    fetchSummary(selectedDate);
  }, [selectedDate, fetchSummary]);

  const handleLogout = async () => {
    await logout();
    router.replace('/login');
  };

  const getDisplayDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  // Build chart data from real summary; fall back to zeros when loading
  const total = summary ? (summary.present + summary.absent + summary.onLeave + summary.lateCheckIns) || 1 : 1;
  const chartData = summary
    ? [
      { value: Math.max(summary.lateCheckIns, 0.001), color: '#F59E0B' },
      { value: Math.max(summary.absent, 0.001), color: '#EF4444' },
      { value: Math.max(summary.onLeave, 0.001), color: Colors.primary },
      { value: Math.max(summary.present, 0.001), color: '#10B981' },
    ]
    : [
      { value: 1, color: '#F59E0B' },
      { value: 1, color: '#EF4444' },
      { value: 1, color: Colors.primary },
      { value: 1, color: '#10B981' },
    ];

  const QuickActionCard = ({ icon: Icon, title, onPress, iconColor = Colors.primary, badgeCount }: {
    icon: any;
    title: string;
    onPress: () => void;
    iconColor?: string;
    badgeCount?: number;
  }) => (
    <TouchableOpacity style={styles.quickActionCard} onPress={onPress}>
      <View style={[styles.quickActionIcon, { backgroundColor: iconColor + '20' }]}>
        <Icon size={24} color={iconColor} />
      </View>
      {badgeCount !== undefined && badgeCount > 0 && (
        <View style={{
          position: 'absolute',
          top: 10,
          right: 15,
          backgroundColor: '#EF4444',
          borderRadius: 10,
          minWidth: 20,
          height: 20,
          paddingHorizontal: 4,
          justifyContent: 'center',
          alignItems: 'center',
          borderWidth: 2,
          borderColor: '#FFFFFF',
        }}>
          <Text style={{ color: 'white', fontSize: 10, fontWeight: '700' }}>{badgeCount}</Text>
        </View>
      )}
      <Text style={styles.quickActionTitle}>{title}</Text>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.companyName}>{companyDetails?.name || 'Loading...'}</Text>
        <View style={styles.headerActions}>
          <TouchableOpacity onPress={() => router.push('/notifications')}>
            <Bell size={24} color="#6B7280" />
          </TouchableOpacity>
          <HeaderAvatar size={40} />
        </View>
      </View>
      <ScrollView contentContainerStyle={{ flex: 1 }}>
        {/* Date Picker Button */}
        <TouchableOpacity
          style={{
            backgroundColor: '#FFFFFF', marginHorizontal: 0, minWidth: '55%',
            justifyContent: 'center', alignItems: 'center', alignSelf: 'center',
            borderRadius: 10, marginTop: 5, padding: 6,
            boxShadow: '0px 0px 1px #171a1f12, 0px 0px 2px #171a1f1F',
            borderColor: '#EBEBEAFF', borderWidth: 1, flexDirection: 'row', gap: 4, marginBottom: 20
          } as any}
          onPress={() => setShowDatePicker(true)}
        >
          <CalendarDays size={24} color="#6B7280" />
          <Text>{getDisplayDate(selectedDate)}</Text>
        </TouchableOpacity>

        {showDatePicker && (
          <DateTimePicker
            value={new Date(selectedDate)}
            mode="date"
            style={{ height: 100, width: '50%' }}
            display="default"
            onChange={(event, date) => {
              setShowDatePicker(false);
              if (date) {
                setSelectedDate(date.toISOString().slice(0, 10));
              }
            }}
          />
        )}

        {/* Pie Chart */}
        <View style={{ marginTop: 5, alignItems: 'center' }}>
          {loading ? (
            <View style={{ height: 240, justifyContent: 'center', alignItems: 'center' }}>
              <ActivityIndicator size="large" color={Colors.primary} />
            </View>
          ) : (
            <PieChart
              data={chartData}
              donut
              showText
              textColor="white"
              radius={120}
              innerRadius={80}
              textSize={12}
              centerLabelComponent={() => (
                <View style={{ alignItems: 'center' }}>
                  <Text style={{ fontSize: 32, fontWeight: '700', color: '#111827' }}>
                    {summary ? summary.avgWorkingHours.toFixed(1) : '--'}{' '}
                    <Text style={{ fontSize: 18, fontWeight: '500', color: '#6B7280' }}>hrs</Text>
                  </Text>
                  <Text style={{ fontSize: 13, fontWeight: '500', color: '#6B7280', marginTop: 4 }}>
                    Avg. Working Hours
                  </Text>
                </View>
              )}
            />
          )}
        </View>

        {/* Stats row */}
        <View style={{ flex: 1, justifyContent: 'flex-start', width: '80%', alignSelf: 'flex-start', marginLeft: 20 }}>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
            <Status label='Present' value={loading ? '...' : (summary?.present ?? '--')} iconColor='#10B981' />
            <Status label='Absent' value={loading ? '...' : (summary?.absent ?? '--')} iconColor='#EF4444' />
          </View>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
            <Status label='On leave' value={loading ? '...' : (summary?.onLeave ?? '--')} iconColor={Colors.primary} />
            <Status label='Late Check-ins' value={loading ? '...' : (summary?.lateCheckIns ?? '--')} iconColor='#F59E0B' />
          </View>
        </View>

        {/* Quick Actions */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Quick Actions</Text>
          <View style={styles.quickActionsGrid}>
            <QuickActionCard
              icon={MailPlus}
              title="Leave Approval"
              onPress={() => router.push('/leave-approval')}
              iconColor="#EF4444"
              badgeCount={pendingCount}
            />
            <QuickActionCard
              icon={ClipboardCheck}
              title="View Attendance"
              onPress={() => router.push('/(owner)/attendance')}
              iconColor={Colors.primary}
            />
            <QuickActionCard
              icon={Users}
              title="Manage Employees"
              onPress={() => router.push('/(owner)/employees')}
              iconColor="#06B6D4"
            />
            <QuickActionCard
              icon={ChartLine}
              title="Reports"
              onPress={() => router.push('/(owner)/reports')}
              iconColor="#10B981"
            />
          </View>
        </View>
      </ScrollView>
      <StatusBar style="dark" />
    </SafeAreaView>
  );
}