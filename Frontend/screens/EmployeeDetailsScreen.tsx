import React, { useState, useEffect, useCallback } from 'react';
import {
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ActivityIndicator,
} from 'react-native';
import { Avatar } from '@/components/Avatar';
import { useAuth } from '@/context/AuthContext';
import { employeeDetailsScreenStyles } from '@/styles/employeeDetailsScreenStyles';
import { useRouter } from 'expo-router';
import { Bell, Calendar, ChevronLeft, ChevronRight, Clock, LogIn, LogOut, Timer } from 'lucide-react-native';
import { getEmployeeDetailsById } from '@/services/api/employees';
import { getEmployeeStats, getEmployeeAttendanceHistory } from '@/services/api/attendance';
import { SafeAreaView } from 'react-native-safe-area-context';

type AttendanceStatus = 'Present' | 'Absent' | 'Late' | 'Leave' | 'Holiday';

interface DailyAttendance {
  date: string;
  punchIn: string | null;
  punchOut: string | null;
  workedHours: string;
  status: string;
  leaveType: string | null;
}

const months = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
];

const statusColors: Record<string, { background: string; color: string }> = {
  Present: { background: '#E6F8EDFF', color: '#4CAF50FF' },
  Absent: { background: '#FEF4F4FF', color: '#EB5757FF' },
  Late: { background: '#FFFBEBFF', color: '#F7B500FF' },
  Leave: { background: '#DBEAFEFF', color: '#1D4ED8FF' },
  Holiday: { background: '#F3F4F6FF', color: '#636AE8FF' },
};

export default function EmployeeDetailsScreen(employeeId: string) {
  const router = useRouter();
  const [currentDate, setCurrentDate] = useState(new Date());
  const [employee, setEmployee] = useState<any>(null);
  const [attendanceList, setAttendanceList] = useState<DailyAttendance[]>([]);
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const styles = employeeDetailsScreenStyles();
  const { userDetails } = useAuth();

  const loadData = useCallback(async () => {
    if (!employeeId) return;
    setLoading(true);
    try {
      const month = currentDate.getMonth() + 1;
      const year = currentDate.getFullYear();
      const empIdNum = parseInt(employeeId, 10);

      const [empData, statsData, historyData] = await Promise.all([
        getEmployeeDetailsById(empIdNum),
        getEmployeeStats(empIdNum, month, year),
        getEmployeeAttendanceHistory(empIdNum, month, year),
      ]);

      setEmployee(empData);
      setStats(statsData);
      setAttendanceList(historyData || []);
    } catch (err) {
      console.error('Failed to load employee details data:', err);
    } finally {
      setLoading(false);
    }
  }, [employeeId, currentDate]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const navigateMonth = (direction: 'prev' | 'next') => {
    const newDate = new Date(currentDate);
    newDate.setMonth(newDate.getMonth() + (direction === 'next' ? 1 : -1));
    setCurrentDate(newDate);
  };

  const parseTimeToMinutes = (timeStr: string | null) => {
    if (!timeStr) return null;
    try {
      const [time, period] = timeStr.split(' ');
      const [h, m] = time.split(':').map(Number);
      let hours = h;
      if (period === 'PM' && h !== 12) hours += 12;
      if (period === 'AM' && h === 12) hours = 0;
      return hours * 60 + m;
    } catch (e) {
      return null;
    }
  };

  const formatMinutesToTime = (totalMinutes: number) => {
    const h = Math.floor(totalMinutes / 60);
    const m = totalMinutes % 60;
    const period = h >= 12 ? 'PM' : 'AM';
    const displayH = h > 12 ? h - 12 : h === 0 ? 12 : h;
    return `${displayH.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')} ${period}`;
  };

  // derived metrics
  const avgPunchInTime = (() => {
    const withPunchIn = attendanceList
      .map(h => parseTimeToMinutes(h.punchIn))
      .filter((m): m is number => m !== null);
    if (withPunchIn.length === 0) return 'N/A';
    const sum = withPunchIn.reduce((acc, m) => acc + m, 0);
    return formatMinutesToTime(Math.round(sum / withPunchIn.length));
  })();

  const avgPunchOutTime = (() => {
    const withPunchOut = attendanceList
      .map(h => parseTimeToMinutes(h.punchOut))
      .filter((m): m is number => m !== null);
    if (withPunchOut.length === 0) return 'N/A';
    const sum = withPunchOut.reduce((acc, m) => acc + m, 0);
    return formatMinutesToTime(Math.round(sum / withPunchOut.length));
  })();

  const avgWorkingHours = stats?.monthlySummary?.avgWorkingHours
    ? `${stats.monthlySummary.avgWorkingHours} hrs`
    : '0 hrs';

  const renderAttendanceCard = (attendance: DailyAttendance) => {
    const dateObj = new Date(attendance.date);
    const dayName = dateObj.toLocaleDateString('en-US', { weekday: 'long' });
    const dayDate = dateObj.getDate().toString().padStart(2, '0');
    const status = attendance.status || 'Absent';
    const colors = statusColors[status] || statusColors.Absent;

    return (
      <View key={attendance.date} style={[styles.attendanceCard, { borderLeftColor: colors.color }]}>
        <View style={styles.dateSection}>
          <View style={{ position: 'relative', marginRight: 12 }}>
            <Calendar size={50} color={colors.color} />
            <View style={{ position: 'absolute', top: 20, left: 15 }}>
              <Text style={[styles.dateText, { color: colors.color }]}>{dayDate}</Text>
            </View>
            <Text style={styles.dayText}>{dayName.slice(0, 3)}</Text>
          </View>
          <View style={styles.timeSection}>
            <View style={styles.timeRow}>
              <View style={styles.timeItem}>
                <LogIn size={16} color="#1D4ED8FF" />
                <Text style={[styles.timeLabel, { marginLeft: 8 }]}>In:</Text>
                <Text style={styles.timeValue}>{attendance.punchIn || 'N/A'}</Text>
              </View>
              <View style={styles.timeItem}>
                <LogOut size={16} color="#FF5724FF" />
                <Text style={[styles.timeLabel, { marginLeft: 8 }]}>Out:</Text>
                <Text style={styles.timeValue}>{attendance.punchOut || 'N/A'}</Text>
              </View>
              <View style={styles.workingHoursRow}>
                <Clock size={16} color="#FFA75AFF" />
                <Text style={styles.workingHoursText}>Working Hours: </Text>
                <Text style={styles.timeValue}>{attendance.workedHours || 'N/A'}</Text>
              </View>
            </View>
          </View>
          <View style={styles.dayInfo}>
            <View style={[styles.statusBadge, { backgroundColor: colors.background }]}>
              <Text style={[styles.statusText, { color: colors.color }]}>{status}</Text>
            </View>
          </View>
        </View>
      </View>
    );
  };

  const displayName = employee?.full_name || employee?.fullName || 'Employee';
  const displayDesignation = employee?.designation?.name || employee?.designationName || 'Staff';

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={{ padding: 4 }} onPress={() => router.back()}>
          <ChevronLeft size={24} color="#374151" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Employee Profile</Text>
        <View style={{ width: 32 }} />
      </View>

      {loading && !employee ? (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <ActivityIndicator size="large" color="#007AFF" />
          <Text style={{ marginTop: 10, color: '#6B7280' }}>Loading employee details...</Text>
        </View>
      ) : (
        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          <View style={styles.employeeSection}>
            {employee?.avatar ? (
              <Image source={{ uri: employee.avatar }} style={styles.employeeAvatar} />
            ) : (
              <Avatar fullName={displayName} size={80} />
            )}
            <View style={styles.employeeInfo}>
              <Text style={styles.employeeName}>{displayName}</Text>
              <Text style={styles.employeeDesignation}>{displayDesignation}</Text>
            </View>
          </View>

          <View style={styles.summarySection}>
            <Text style={styles.sectionTitle}>Monthly Summary</Text>
            <View style={styles.summaryGrid}>
              <View style={styles.summaryCard}>
                <View style={styles.summaryIcon}>
                  <Timer size={30} color="#FF5724FF" />
                </View>
                <Text style={styles.summaryValue}>{avgPunchInTime}</Text>
                <Text style={styles.summaryLabel}>Avg Punch In</Text>
              </View>
              <View style={styles.summaryCard}>
                <View style={styles.summaryIcon}>
                  <LogOut size={30} color="#FF5724FF" />
                </View>
                <Text style={styles.summaryValue}>{avgPunchOutTime}</Text>
                <Text style={styles.summaryLabel}>Avg Punch Out</Text>
              </View>
              <View style={styles.summaryCard}>
                <View style={styles.summaryIcon}>
                  <Clock size={30} color="#FF5724FF" />
                </View>
                <Text style={styles.summaryValue}>{avgWorkingHours}</Text>
                <Text style={styles.summaryLabel}>Avg Working Hours</Text>
              </View>
            </View>
          </View>

          <View style={styles.monthSection}>
            <View style={styles.monthHeader}>
              <TouchableOpacity onPress={() => navigateMonth('prev')}>
                <ChevronLeft size={24} color="#6b7280" />
              </TouchableOpacity>
              <Text style={styles.monthText}>
                {months[currentDate.getMonth()]} {currentDate.getFullYear()}
              </Text>
              <TouchableOpacity onPress={() => navigateMonth('next')}>
                <ChevronRight size={24} color="#6b7280" />
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.attendanceSection}>
            {loading ? (
              <ActivityIndicator size="small" color="#007AFF" style={{ marginVertical: 20 }} />
            ) : attendanceList.length === 0 ? (
              <Text style={{ color: '#8E8E93', textAlign: 'center', marginVertical: 30 }}>
                No attendance logs found for this period.
              </Text>
            ) : (
              attendanceList.map(renderAttendanceCard)
            )}
          </View>
        </ScrollView>
      )}
    </SafeAreaView>
  );
}