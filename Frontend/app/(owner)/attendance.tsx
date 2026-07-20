import { Avatar } from '@/components/Avatar';
import { Colors } from '@/constants/Colors';
import { useAuth } from '@/context/AuthContext';
import AttendanceIllustration from '@/components/illustrations/AttendanceIllustration';
import DateTimePicker from '@react-native-community/datetimepicker';
import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { LinearGradient } from 'expo-linear-gradient';
import {
  CalendarDays,
  Clock,
  Filter,
  Hourglass,
  Search,
  Timer,
  ChevronRight,
  ArrowRight,
  LogIn,
  LogOut,
} from 'lucide-react-native';
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  ActivityIndicator,
  Animated,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  Dimensions,
  Platform,
} from 'react-native';
import { getAttendanceByDate } from '@/services/api/attendance';
import { AttendanceEmployee } from '@/services/types/attendance';
import { SafeAreaView } from 'react-native-safe-area-context';

const { width } = Dimensions.get('window');

type AttendanceStatus = 'Present' | 'Absent' | 'Late' | 'Leave';

const statusStyles: Record<AttendanceStatus, { background: string; color: string; dot: string }> = {
  Present: { background: '#ECFDF5', color: '#10B981', dot: '#10B981' },
  Absent: { background: '#FEF2F2', color: '#EF4444', dot: '#EF4444' },
  Late: { background: '#FFFBEB', color: '#F59E0B', dot: '#F59E0B' },
  Leave: { background: '#EFF6FF', color: '#3B82F6', dot: '#3B82F6' },
};

function getToday() {
  return new Date().toISOString().slice(0, 10);
}

export default function AttendanceScreen() {
  const router = useRouter();
  const [selectedDate, setSelectedDate] = useState(getToday());
  const [searchQuery, setSearchQuery] = useState('');
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [employees, setEmployees] = useState<AttendanceEmployee[]>([]);
  const [loading, setLoading] = useState(false);
  
  const { userDetails } = useAuth();
  const scrollRef = useRef<ScrollView>(null);
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(15)).current;

  const fetchAttendance = useCallback(
    async (date: string) => {
      if (!userDetails?.companyId) return;
      setLoading(true);
      try {
        const data = await getAttendanceByDate(date, userDetails.companyId);
        setEmployees(data);
      } catch (err) {
        console.error('Failed to load attendance by date:', err);
      } finally {
        setLoading(false);
      }
    },
    [userDetails?.companyId]
  );

  useEffect(() => {
    fetchAttendance(selectedDate);
  }, [selectedDate, fetchAttendance]);

  useEffect(() => {
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
  }, [selectedDate, employees]);

  const getDisplayDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const getMonthDays = (dateString: string) => {
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = date.getMonth();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    return Array.from({ length: daysInMonth }, (_, i) => i + 1);
  };

  const handleDateSelect = (day: number) => {
    const date = new Date(selectedDate);
    date.setDate(day);
    setSelectedDate(date.toISOString().slice(0, 10));
  };

  const filteredEmployees = useMemo(() => {
    return employees.filter(
      employee =>
        employee.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        employee.designation.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [searchQuery, employees]);

  const averagePunchInTime = useMemo(() => {
    const withPunchIn = employees.filter(emp => emp.entryTime);
    if (withPunchIn.length === 0) return 'N/A';
    const totalMinutes = withPunchIn.reduce((acc, emp) => {
      if (!emp.entryTime) return acc;
      const [time, period] = emp.entryTime.split(' ');
      const [h, m] = time.split(':').map(Number);
      let hours = h;
      if (period === 'PM' && h !== 12) hours += 12;
      if (period === 'AM' && h === 12) hours = 0;
      return acc + (hours * 60 + m);
    }, 0);
    const avgMins = Math.round(totalMinutes / withPunchIn.length);
    const h = Math.floor(avgMins / 60);
    const m = avgMins % 60;
    const period = h >= 12 ? 'PM' : 'AM';
    const displayH = h > 12 ? h - 12 : h === 0 ? 12 : h;
    return `${displayH.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')} ${period}`;
  }, [employees]);

  const scrollToSelectedDate = () => {
    const selectedDay = new Date(selectedDate).getDate();
    const daysInMonth = getMonthDays(selectedDate);
    const selectedIndex = daysInMonth.indexOf(selectedDay);
    if (selectedIndex !== -1) {
      const itemWidth = 48; // width + margin
      const scrollPosition = selectedIndex * itemWidth - 60;
      setTimeout(() => {
        scrollRef.current?.scrollTo({ x: Math.max(0, scrollPosition), animated: true });
      }, 100);
    }
  };

  useEffect(() => {
    scrollToSelectedDate();
  }, [selectedDate]);

  const renderEmployeeCard = (employee: AttendanceEmployee) => {
    const stylesCard = statusStyles[employee.status] || { background: '#F3F4F6', color: '#374151', dot: '#9CA3AF' };
    return (
      <View key={employee.id} style={styles.employeeCard}>
        {/* Top Info Area */}
        <View style={styles.employeeHeader}>
          <View style={styles.employeeInfo}>
            {employee.avatar ? (
              <Image source={{ uri: employee.avatar }} style={styles.avatar} />
            ) : (
              <Avatar fullName={employee.name} size={42} style={styles.avatarPlaceholder} />
            )}
            <View style={styles.employeeDetails}>
              <Text style={styles.employeeName} numberOfLines={1}>
                {employee.name}
              </Text>
              <View style={styles.designationBadge}>
                <Text style={styles.designationText} numberOfLines={1}>
                  {employee.designation || 'Employee'}
                </Text>
              </View>
            </View>
          </View>
          <View style={[styles.statusBadge, { backgroundColor: stylesCard.background }]}>
            <View style={[styles.statusDot, { backgroundColor: stylesCard.dot }]} />
            <Text style={[styles.statusText, { color: stylesCard.color }]}>
              {employee.status}
            </Text>
          </View>
        </View>

        {/* Timings Card Grid */}
        <View style={styles.attendanceDetailsGrid}>
          <View style={styles.timeGridItem}>
            <View style={styles.timeIconCircle}>
              <LogIn size={13} color="#10B981" />
            </View>
            <View>
              <Text style={styles.timeGridLabel}>Entry Time</Text>
              <Text style={styles.timeGridValue}>{employee.entryTime || '——'}</Text>
            </View>
          </View>

          <View style={styles.timeGridItem}>
            <View style={styles.timeIconCircle}>
              <LogOut size={13} color="#EF4444" />
            </View>
            <View>
              <Text style={styles.timeGridLabel}>Exit Time</Text>
              <Text style={styles.timeGridValue}>{employee.exitTime || '——'}</Text>
            </View>
          </View>

          <View style={[styles.timeGridItem, { borderRightWidth: 0, flex: 1.2 }]}>
            <View style={styles.timeIconCircle}>
              <Hourglass size={13} color="#6366f1" />
            </View>
            <View>
              <Text style={styles.timeGridLabel}>Total Duration</Text>
              <Text style={styles.timeGridValue}>{employee.duration || '0 hrs'}</Text>
            </View>
          </View>
        </View>

        {/* Action footer link */}
        <TouchableOpacity
          style={styles.cardFooter}
          onPress={() => router.push(`/employee/${employee.id}`)}
          activeOpacity={0.7}
        >
          <Text style={styles.viewDetailsText}>View Full Attendance History</Text>
          <ArrowRight size={14} color="#6366f1" />
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.safeContainer}>
      <StatusBar style="dark" />

      {/* Top Header */}
      <View style={styles.header}>
        <View style={styles.headerTitleContainer}>
          <Text style={styles.welcomeText}>Attendance Logging</Text>
          <Text style={styles.headerTitle}>Daily Logs</Text>
        </View>
        <Avatar
          fullName={userDetails?.fullName || 'User'}
          size={38}
          uri={userDetails?.avatar}
        />
      </View>

      <ScrollView style={styles.container} showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        {/* Date Strips Panel */}
        <View style={styles.dateSelectorCard}>
          <View style={styles.dateSelectorHeader}>
            <View style={styles.dateHeaderLeft}>
              <CalendarDays size={18} color="#6366f1" />
              <Text style={styles.selectedDateLabel}>{getDisplayDate(selectedDate)}</Text>
            </View>
            <TouchableOpacity
              style={styles.pickerButton}
              onPress={() => setShowDatePicker(true)}
              activeOpacity={0.75}
            >
              <Text style={styles.pickerButtonText}>Pick Date</Text>
            </TouchableOpacity>
          </View>

          {/* Date list view */}
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            ref={scrollRef}
            style={styles.dateStripsScroll}
            contentContainerStyle={styles.dateStripsContent}
          >
            {getMonthDays(selectedDate).map(day => {
              const date = new Date(selectedDate);
              date.setDate(day);
              const dateString = date.toISOString().slice(0, 10);
              const isToday = dateString === getToday();
              const isSelected = dateString === selectedDate;

              return (
                <TouchableOpacity
                  key={day}
                  onPress={() => handleDateSelect(day)}
                  style={[
                    styles.dayItem,
                    isSelected && styles.dayItemSelect,
                  ]}
                  activeOpacity={0.8}
                >
                  <Text style={[styles.dayNumberText, isSelected && styles.dayNumberTextSelect]}>
                    {day}
                  </Text>
                  {isToday && (
                    <View style={[styles.todayIndicator, isSelected && styles.todayIndicatorSelect]} />
                  )}
                </TouchableOpacity>
              );
            })}
          </ScrollView>
        </View>

        {showDatePicker && (
          <DateTimePicker
            value={new Date(selectedDate)}
            mode="date"
            display="default"
            onChange={(event, date) => {
              setShowDatePicker(false);
              if (date) setSelectedDate(date.toISOString().slice(0, 10));
            }}
            maximumDate={new Date()}
          />
        )}

        {/* Analytics Card */}
        <View style={styles.analyticsCard}>
          <LinearGradient
            colors={['#EEF2FF', '#F5F3FF']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.analyticsGradient}
          >
            <View style={styles.analyticsLeft}>
              <View style={styles.avgTimeBadge}>
                <Clock size={12} color="#6366f1" />
                <Text style={styles.avgTimeBadgeText}>PUNCTUALITY INSIGHT</Text>
              </View>
              <Text style={styles.avgTimeValue}>
                {loading ? '——' : averagePunchInTime}
              </Text>
              <Text style={styles.avgTimeLabel}>Average Punch-In</Text>
              <Text style={styles.avgTimeSub}>
                Based on {employees.filter(e => e.entryTime).length} check-ins recorded today.
              </Text>
            </View>
            <View style={styles.illustrationWrapper}>
              <AttendanceIllustration width={100} height={80} />
            </View>
          </LinearGradient>
        </View>

        {/* Search bar & Filter */}
        <View style={styles.searchWrapper}>
          <View style={styles.searchBarContainer}>
            <Search size={18} color="#94A3B8" />
            <TextInput
              style={styles.searchInput}
              placeholder="Search by name or designation..."
              placeholderTextColor="#94A3B8"
              value={searchQuery}
              onChangeText={setSearchQuery}
            />
          </View>
          <TouchableOpacity style={styles.filterButton} activeOpacity={0.7}>
            <Filter size={16} color="#475569" />
          </TouchableOpacity>
        </View>

        {/* Employee Logs list */}
        <View style={styles.logsSection}>
          <Text style={styles.logsSectionTitle}>Employee Check-in Logs</Text>
          
          <Animated.View style={{ opacity: fadeAnim, transform: [{ translateY: slideAnim }] }}>
            {loading ? (
              <View style={styles.loaderWrapper}>
                <ActivityIndicator size="large" color="#6366f1" />
                <Text style={styles.loaderText}>Syncing records...</Text>
              </View>
            ) : filteredEmployees.length === 0 ? (
              <View style={styles.emptyLogsCard}>
                <Text style={styles.emptyLogsText}>
                  {searchQuery ? 'No match found for this criteria.' : 'No logs recorded for this date.'}
                </Text>
              </View>
            ) : (
              filteredEmployees.map(renderEmployeeCard)
            )}
          </Animated.View>
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
  scrollContent: {
    paddingHorizontal: 20,
    paddingBottom: 40,
  },
  container: {
    flex: 1,
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

  // --- Date Selector ---
  dateSelectorCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 16,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#F1F5F9',
    shadowColor: '#6366f1',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.02,
    shadowRadius: 10,
    elevation: 2,
  },
  dateSelectorHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 14,
    paddingHorizontal: 4,
  },
  dateHeaderLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  selectedDateLabel: {
    fontSize: 14,
    color: '#1E293B',
    fontWeight: '700',
  },
  pickerButton: {
    backgroundColor: '#EEF2FF',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  pickerButtonText: {
    fontSize: 11,
    color: '#6366f1',
    fontWeight: '700',
  },
  dateStripsScroll: {
    marginHorizontal: -4,
  },
  dateStripsContent: {
    paddingHorizontal: 4,
    gap: 8,
  },
  dayItem: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: '#F8FAFC',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: '#E2E8F0',
  },
  dayItemSelect: {
    backgroundColor: '#6366f1',
    borderColor: '#6366f1',
  },
  dayNumberText: {
    fontSize: 13,
    color: '#475569',
    fontWeight: '700',
  },
  dayNumberTextSelect: {
    color: '#FFFFFF',
  },
  todayIndicator: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#6366f1',
    position: 'absolute',
    bottom: 4,
  },
  todayIndicatorSelect: {
    backgroundColor: '#FFFFFF',
  },

  // --- Analytics Card ---
  analyticsCard: {
    borderRadius: 22,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(99, 102, 241, 0.08)',
    marginBottom: 20,
  },
  analyticsGradient: {
    flexDirection: 'row',
    padding: 20,
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  analyticsLeft: {
    flex: 1.2,
  },
  avgTimeBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    backgroundColor: '#E0E7FF',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
    gap: 4,
    marginBottom: 10,
  },
  avgTimeBadgeText: {
    fontSize: 9,
    color: '#6366f1',
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  avgTimeValue: {
    fontSize: 32,
    fontWeight: '800',
    color: '#1E1B4B',
    letterSpacing: -0.5,
  },
  avgTimeLabel: {
    fontSize: 13,
    color: '#475569',
    fontWeight: '700',
    marginTop: 2,
  },
  avgTimeSub: {
    fontSize: 11,
    color: '#64748B',
    marginTop: 6,
    lineHeight: 15,
  },
  illustrationWrapper: {
    flex: 0.8,
    alignItems: 'center',
    justifyContent: 'center',
  },

  // --- Search & Filter ---
  searchWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 24,
  },
  searchBarContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    paddingHorizontal: 12,
    borderWidth: 1.5,
    borderColor: '#E2E8F0',
  },
  searchInput: {
    flex: 1,
    height: 42,
    fontSize: 13,
    color: '#1E293B',
    fontWeight: '500',
    paddingLeft: 8,
  },
  filterButton: {
    width: 42,
    height: 42,
    borderRadius: 12,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: '#E2E8F0',
  },

  // --- Logs Section ---
  logsSection: {
    flex: 1,
  },
  logsSectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1e1b4b',
    marginBottom: 14,
  },
  loaderWrapper: {
    paddingVertical: 60,
    alignItems: 'center',
    gap: 8,
  },
  loaderText: {
    fontSize: 13,
    color: '#64748B',
    fontWeight: '500',
  },
  emptyLogsCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 24,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#F1F5F9',
  },
  emptyLogsText: {
    fontSize: 13,
    color: '#64748B',
    fontWeight: '500',
    textAlign: 'center',
  },

  // --- Employee Card ---
  employeeCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 16,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: '#F1F5F9',
    shadowColor: '#6366f1',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.03,
    shadowRadius: 12,
    elevation: 3,
  },
  employeeHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  employeeInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    paddingRight: 8,
  },
  avatar: {
    width: 42,
    height: 42,
    borderRadius: 12,
  },
  avatarPlaceholder: {
    width: 42,
    height: 42,
    borderRadius: 12,
  },
  employeeDetails: {
    marginLeft: 12,
    flex: 1,
  },
  employeeName: {
    fontSize: 15,
    fontWeight: '700',
    color: '#1E293B',
  },
  designationBadge: {
    alignSelf: 'flex-start',
    backgroundColor: '#F8FAFC',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 5,
    marginTop: 3,
  },
  designationText: {
    fontSize: 10,
    color: '#64748B',
    fontWeight: '700',
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 10,
    gap: 5,
  },
  statusDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  statusText: {
    fontSize: 11,
    fontWeight: '800',
    textTransform: 'uppercase',
  },

  // --- Attendance Grid ---
  attendanceDetailsGrid: {
    flexDirection: 'row',
    backgroundColor: '#F8FAFC',
    borderRadius: 14,
    paddingVertical: 12,
    paddingHorizontal: 8,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#F1F5F9',
  },
  timeGridItem: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    borderRightWidth: 1.5,
    borderRightColor: '#E2E8F0',
    paddingHorizontal: 8,
  },
  timeIconCircle: {
    width: 24,
    height: 24,
    borderRadius: 8,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  timeGridLabel: {
    fontSize: 9,
    color: '#64748B',
    fontWeight: '700',
    textTransform: 'uppercase',
  },
  timeGridValue: {
    fontSize: 12,
    color: '#1E293B',
    fontWeight: '700',
    marginTop: 1,
  },

  // --- Card Footer ---
  cardFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 8,
    gap: 6,
  },
  viewDetailsText: {
    fontSize: 12,
    color: '#6366f1',
    fontWeight: '700',
  },
});