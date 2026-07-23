import React, { useState, useEffect, useCallback, useRef } from 'react';
import {
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ActivityIndicator,
  Dimensions,
  Platform,
  Animated,
} from 'react-native';
import { Avatar } from '@/components/Avatar';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'expo-router';
import { Bell, Calendar, ChevronLeft, ChevronRight, Clock, LogIn, LogOut, Timer, CalendarDays } from 'lucide-react-native';
import { getEmployeeDetailsById } from '@/services/api/employees';
import { getEmployeeStats, getEmployeeAttendanceHistory } from '@/services/api/attendance';
import { SafeAreaView } from 'react-native-safe-area-context';
import EmployeeDetailsIllustration from '@/components/illustrations/EmployeeDetailsIllustration';
import { LinearGradient } from 'expo-linear-gradient';
import { StatusBar } from 'expo-status-bar';

const { width } = Dimensions.get('window');

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

const statusColors: Record<string, { bg: string; color: string; border: string }> = {
  Present: { bg: '#ECFDF5', color: '#10B981', border: '#10B981' },
  Absent: { bg: '#FEF2F2', color: '#EF4444', border: '#EF4444' },
  Late: { bg: '#FFFBEB', color: '#F59E0B', border: '#F59E0B' },
  Leave: { bg: '#EFF6FF', color: '#3B82F6', border: '#3B82F6' },
  Holiday: { bg: '#F5F3FF', color: '#8B5CF6', border: '#8B5CF6' },
};

interface Props {
  employeeId: string;
}

export default function EmployeeDetailsScreen({ employeeId }: Props) {
  const router = useRouter();
  const [currentDate, setCurrentDate] = useState(new Date());
  const [employee, setEmployee] = useState<any>(null);
  const [attendanceList, setAttendanceList] = useState<DailyAttendance[]>([]);
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const { userDetails } = useAuth();
  
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(15)).current;

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
  }, [loading, attendanceList]);

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

  const renderAttendanceCard = (attendance: DailyAttendance, index: number) => {
    let dateObj: Date;
    if (typeof attendance.date === 'string' && attendance.date.includes('-')) {
      const [y, m, d] = attendance.date.split('T')[0].split('-').map(Number);
      dateObj = new Date(y, m - 1, d);
    } else {
      dateObj = new Date(attendance.date);
    }

    const dayName = dateObj.toLocaleDateString('en-US', { weekday: 'short' });
    const dayDate = dateObj.getDate().toString().padStart(2, '0');
    const status = attendance.status || 'Absent';
    const colors = statusColors[status] || statusColors.Absent;

    return (
      <View key={`${attendance.date}-${index}`} style={[styles.attendanceCard, { borderLeftColor: colors.color }]}>
        <View style={styles.cardMain}>
          {/* Calendar visual pill */}
          <View style={styles.dateBlock}>
            <View style={[styles.dateNumberContainer, { backgroundColor: colors.bg }]}>
              <Text style={[styles.dateNumberText, { color: colors.color }]}>{dayDate}</Text>
            </View>
            <Text style={styles.dayLabelText}>{dayName}</Text>
          </View>

          {/* Details Column */}
          <View style={styles.detailsColumn}>
            <View style={styles.timeRows}>
              <View style={styles.timeCell}>
                <LogIn size={13} color="#10B981" />
                <Text style={styles.timeLabel}>In:</Text>
                <Text style={styles.timeValue}>{attendance.punchIn || '--'}</Text>
              </View>
              <View style={styles.timeCell}>
                <LogOut size={13} color="#EF4444" />
                <Text style={styles.timeLabel}>Out:</Text>
                <Text style={styles.timeValue}>{attendance.punchOut || '--'}</Text>
              </View>
            </View>
            
            <View style={styles.workedHoursRow}>
              <Clock size={13} color="#6366f1" />
              <Text style={styles.workedHoursLabel}>Worked:</Text>
              <Text style={styles.workedHoursValue}>{attendance.workedHours || '0h 0m'}</Text>
            </View>
          </View>

          {/* Status Label on Right */}
          <View style={styles.statusBadgeWrapper}>
            <View style={[styles.statusBadge, { backgroundColor: colors.bg }]}>
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
    <SafeAreaView style={styles.safeContainer}>
      <StatusBar style="dark" />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}
          hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
        >
          <ChevronLeft size={22} color="#1E293B" />
        </TouchableOpacity>
        <View style={styles.headerTitleContainer}>
          <Text style={styles.headerTitle}>Employee Profile</Text>
        </View>
      </View>

      {loading && !employee ? (
        <View style={styles.loaderWrapper}>
          <ActivityIndicator size="large" color="#6366f1" />
          <Text style={styles.loaderText}>Loading details...</Text>
        </View>
      ) : (
        <ScrollView
          style={styles.container}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          {/* Welcome Card & Illustration */}
          <View style={styles.welcomeCard}>
            <LinearGradient
              colors={['#EEF2FF', '#F5F3FF']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.welcomeGradient}
            >
              <View style={styles.welcomeTextContainer}>
                <Text style={styles.welcomeQuote}>Workspace Directory</Text>
                <Text style={styles.ownerName}>Profile Details</Text>
                <Text style={styles.welcomeDesc}>
                  Review profile designation, monthly attendance statistics, and hours summary metrics.
                </Text>
              </View>
              <View style={styles.illustrationWrapper}>
                <EmployeeDetailsIllustration width={110} height={90} />
              </View>
            </LinearGradient>
          </View>

          {/* Profile Card */}
          <View style={styles.profileCard}>
            {employee?.avatar ? (
              <Image source={{ uri: employee.avatar }} style={styles.profileAvatar} />
            ) : (
              <View style={styles.profileAvatarPlaceholder}>
                <Avatar fullName={displayName} size={64} />
              </View>
            )}
            <View style={styles.profileDetails}>
              <Text style={styles.profileName} numberOfLines={1}>{displayName}</Text>
              <View style={styles.designationBadge}>
                <Text style={styles.designationText}>{displayDesignation}</Text>
              </View>
            </View>
          </View>

          {/* Monthly Summary */}
          <Text style={styles.sectionTitle}>Monthly Summary</Text>
          <View style={styles.summaryGrid}>
            <View style={styles.summaryCard}>
              <View style={[styles.summaryIconWrapper, { backgroundColor: '#EFF6FF' }]}>
                <Timer size={20} color="#3B82F6" />
              </View>
              <Text style={styles.summaryValue} numberOfLines={1}>{avgPunchInTime}</Text>
              <Text style={styles.summaryLabel}>Avg Punch In</Text>
            </View>

            <View style={styles.summaryCard}>
              <View style={[styles.summaryIconWrapper, { backgroundColor: '#FEF2F2' }]}>
                <LogOut size={20} color="#EF4444" />
              </View>
              <Text style={styles.summaryValue} numberOfLines={1}>{avgPunchOutTime}</Text>
              <Text style={styles.summaryLabel}>Avg Punch Out</Text>
            </View>

            <View style={styles.summaryCard}>
              <View style={[styles.summaryIconWrapper, { backgroundColor: '#F5F3FF' }]}>
                <Clock size={20} color="#8B5CF6" />
              </View>
              <Text style={styles.summaryValue} numberOfLines={1}>{avgWorkingHours}</Text>
              <Text style={styles.summaryLabel}>Avg Hours</Text>
            </View>
          </View>

          {/* Month Navigator */}
          <View style={styles.monthSelector}>
            <TouchableOpacity onPress={() => navigateMonth('prev')} style={styles.monthNavBtn}>
              <ChevronLeft size={18} color="#64748B" />
            </TouchableOpacity>
            <Text style={styles.monthSelectorText}>
              {months[currentDate.getMonth()]} {currentDate.getFullYear()}
            </Text>
            <TouchableOpacity onPress={() => navigateMonth('next')} style={styles.monthNavBtn}>
              <ChevronRight size={18} color="#64748B" />
            </TouchableOpacity>
          </View>

          {/* Attendance Section */}
          <Animated.View style={[styles.attendanceSection, { opacity: fadeAnim, transform: [{ translateY: slideAnim }] }]}>
            {loading ? (
              <ActivityIndicator size="small" color="#6366f1" style={{ marginVertical: 30 }} />
            ) : attendanceList.length === 0 ? (
              <View style={styles.emptyState}>
                <CalendarDays size={32} color="#94A3B8" style={{ marginBottom: 10 }} />
                <Text style={styles.emptyText}>No attendance logs found.</Text>
              </View>
            ) : (
              attendanceList.map(renderAttendanceCard)
            )}
          </Animated.View>
        </ScrollView>
      )}
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
    paddingTop: 16,
    paddingBottom: 40,
  },

  // --- Header ---
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: Platform.OS === 'ios' ? 4 : 10,
    paddingBottom: 12,
  },
  backButton: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: '#F1F5F9',
  },
  headerTitleContainer: {
    flex: 1,
    marginLeft: 14,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: '#1E1B4B',
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

  // --- Profile Card ---
  profileCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 22,
    padding: 20,
    borderWidth: 1,
    borderColor: '#F1F5F9',
    shadowColor: '#6366f1',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.03,
    shadowRadius: 16,
    elevation: 3,
    marginBottom: 20,
  },
  profileAvatar: {
    width: 64,
    height: 64,
    borderRadius: 20,
    borderWidth: 2,
    borderColor: '#EEF2FF',
  },
  profileAvatarPlaceholder: {
    width: 64,
    height: 64,
    borderRadius: 20,
    overflow: 'hidden',
  },
  profileDetails: {
    flex: 1,
    marginLeft: 16,
  },
  profileName: {
    fontSize: 18,
    fontWeight: '800',
    color: '#1E293B',
    marginBottom: 4,
  },
  designationBadge: {
    alignSelf: 'flex-start',
    backgroundColor: '#EEF2FF',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
  },
  designationText: {
    fontSize: 11,
    color: '#6366f1',
    fontWeight: '700',
  },

  // --- Section Title ---
  sectionTitle: {
    fontSize: 12,
    fontWeight: '700',
    color: '#64748B',
    textTransform: 'uppercase',
    letterSpacing: 0.8,
    marginBottom: 12,
    paddingHorizontal: 2,
  },

  // --- Summary Grid ---
  summaryGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 24,
    gap: 10,
  },
  summaryCard: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 14,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#F1F5F9',
    shadowColor: '#6366f1',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.02,
    shadowRadius: 10,
    elevation: 2,
  },
  summaryIconWrapper: {
    width: 38,
    height: 38,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
  },
  summaryValue: {
    fontSize: 13,
    fontWeight: '800',
    color: '#1E293B',
    marginBottom: 2,
  },
  summaryLabel: {
    fontSize: 10,
    color: '#64748B',
    fontWeight: '600',
  },

  // --- Month Selector ---
  monthSelector: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderWidth: 1,
    borderColor: '#F1F5F9',
    marginBottom: 16,
    shadowColor: '#6366f1',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.02,
    shadowRadius: 10,
    elevation: 2,
  },
  monthNavBtn: {
    width: 28,
    height: 28,
    borderRadius: 8,
    backgroundColor: '#F8FAFC',
    justifyContent: 'center',
    alignItems: 'center',
  },
  monthSelectorText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#1E293B',
  },

  // --- Attendance Section ---
  attendanceSection: {
    gap: 12,
  },
  attendanceCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    borderLeftWidth: 4,
    borderWidth: 1,
    borderColor: '#F1F5F9',
    shadowColor: '#6366f1',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.02,
    shadowRadius: 10,
    elevation: 2,
  },
  cardMain: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 14,
  },
  dateBlock: {
    alignItems: 'center',
    justifyContent: 'center',
    width: 44,
  },
  dateNumberContainer: {
    width: 32,
    height: 32,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 4,
  },
  dateNumberText: {
    fontSize: 14,
    fontWeight: '800',
  },
  dayLabelText: {
    fontSize: 10,
    color: '#94A3B8',
    fontWeight: '700',
    textTransform: 'uppercase',
  },
  detailsColumn: {
    flex: 1.5,
    marginLeft: 16,
    gap: 6,
  },
  timeRows: {
    flexDirection: 'row',
    gap: 12,
  },
  timeCell: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  timeLabel: {
    fontSize: 10,
    color: '#94A3B8',
    fontWeight: '700',
  },
  timeValue: {
    fontSize: 11,
    color: '#1E293B',
    fontWeight: '700',
  },
  workedHoursRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  workedHoursLabel: {
    fontSize: 10,
    color: '#94A3B8',
    fontWeight: '700',
  },
  workedHoursValue: {
    fontSize: 11,
    color: '#1E293B',
    fontWeight: '700',
  },
  statusBadgeWrapper: {
    flex: 0.8,
    alignItems: 'flex-end',
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  statusText: {
    fontSize: 10,
    fontWeight: '800',
    textTransform: 'uppercase',
  },

  // --- Loader ---
  loaderWrapper: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 80,
    gap: 8,
  },
  loaderText: {
    fontSize: 13,
    color: '#64748B',
    fontWeight: '500',
  },

  // --- Empty State ---
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 40,
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#F1F5F9',
  },
  emptyText: {
    color: '#64748B',
    fontSize: 12,
    fontWeight: '600',
  },
});