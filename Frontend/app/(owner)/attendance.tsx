import { Avatar } from '@/components/Avatar';
import { Colors } from '@/constants/Colors';
import { useAuth } from '@/context/AuthContext';
import { attendanceScreenStyles } from '@/styles/attendanceScreenStyles';
import DateTimePicker from '@react-native-community/datetimepicker';
import { useRouter } from 'expo-router';
import { CalendarDays, Clock, Filter, Hourglass, Search, Timer } from 'lucide-react-native';
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  ActivityIndicator,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { getAttendanceByDate, getDailyAttendanceSummary } from '@/services/api/attendance';
import { AttendanceEmployee } from '@/services/types/attendance';
import { SafeAreaView } from 'react-native-safe-area-context';

type AttendanceStatus = 'Present' | 'Absent' | 'Late' | 'Leave';

interface DateItem {
  date: string;
  day: string;
  dayName: string;
  month: string;
  year: string;
  isToday: boolean;
  isSelected: boolean;
}

const statusColors: Record<AttendanceStatus, { background: string; color: string }> = {
  Present: { background: '#E6F8EDFF', color: '#4CAF50FF' },
  Absent: { background: '#FEF4F4FF', color: '#EB5757FF' },
  Late: { background: '#FFFBEBFF', color: '#F7B500FF' },
  Leave: { background: '#DBEAFEFF', color: '#1D4ED8FF' },
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
  const styles = attendanceScreenStyles();
  const { userDetails } = useAuth();
  const scrollRef = useRef<ScrollView>(null);

  const fetchAttendance = useCallback(async (date: string) => {
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
  }, [userDetails?.companyId]);

  useEffect(() => {
    fetchAttendance(selectedDate);
  }, [selectedDate, fetchAttendance]);

  const getDisplayDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
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
    return employees.filter(employee =>
      employee.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      employee.designation.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [searchQuery, employees]);

  // Calculate average punch-in time from real data
  const averagePunchInTime = useMemo(() => {
    const withPunchIn = employees.filter(emp => emp.entryTime);
    if (withPunchIn.length === 0) return 'N/A';
    // Parse "09:30 AM" style time to total minutes
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

  const renderEmployeeCard = (employee: AttendanceEmployee) => (
    <View key={employee.id} style={styles.employeeCard}>
      <View style={styles.employeeHeader}>
        <View style={styles.employeeInfo}>
          {employee.avatar ? (
            <Image source={{ uri: employee.avatar }} style={styles.avatar} />
          ) : (
            <Avatar fullName={employee.name} size={42} />
          )}
          <View style={styles.employeeDetails}>
            <Text style={styles.employeeName}>{employee.name}</Text>
            <Text style={styles.employeeDesignation}>{employee.designation || 'Employee'}</Text>
          </View>
        </View>
        <View style={[styles.statusBadge, { backgroundColor: statusColors[employee.status]?.background ?? '#F3F4F6' }]}>
          <Text style={[styles.statusText, { color: statusColors[employee.status]?.color ?? '#374151' }]}>
            {employee.status}
          </Text>
        </View>
      </View>

      <View style={styles.attendanceInfo}>
        <View style={styles.timeRow}>
          <View style={styles.timeItem}>
            <Timer size={15} color="#6b7280" />
            <Text style={[styles.timeLabel, { marginLeft: 4 }]}>Entry:</Text>
            <Text style={styles.timeValue}>{employee.entryTime || 'N/A'}</Text>
          </View>
          <View style={styles.timeItem}>
            <Timer size={15} color="#6b7280" />
            <Text style={[styles.timeLabel, { marginLeft: 4 }]}>Exit:</Text>
            <Text style={styles.timeValue}>{employee.exitTime || 'N/A'}</Text>
          </View>
        </View>
        <View style={styles.durationRow}>
          <Hourglass size={15} color="#6b7280" />
          <Text style={[styles.timeLabel, { marginLeft: 4 }]}>Duration:</Text>
          <Text style={styles.timeValue}>{employee.duration}</Text>
        </View>
      </View>

      <View style={{ flex: 1, borderWidth: 0.5, borderColor: '#F0F0F0FF', height: 0, marginBottom: 4 }} />
      <TouchableOpacity
        style={styles.viewDetailsButton}
        onPress={() => router.push(`/employee/${employee.id}`)}
      >
        <Text style={styles.viewDetailsText}>View Details →</Text>
      </TouchableOpacity>
    </View>
  );

  const scrollToSelectedDate = () => {
    const selectedDay = new Date(selectedDate).getDate();
    const daysInMonth = getMonthDays(selectedDate);
    const selectedIndex = daysInMonth.indexOf(selectedDay);
    if (selectedIndex !== -1) {
      const itemWidth = 44;
      const scrollPosition = selectedIndex * itemWidth - 40;
      setTimeout(() => {
        scrollRef.current?.scrollTo({ x: Math.max(0, scrollPosition), animated: true });
      }, 100);
    }
  };

  useEffect(() => {
    scrollToSelectedDate();
  }, [selectedDate]);

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Daily Attendance</Text>
          <Avatar
            fullName={userDetails?.fullName || 'User'}
            size={40}
          />
        </View>

        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          {/* Date strip */}
          <View style={styles.dateSection}>
            <View style={styles.dateHeader}>
              <TouchableOpacity onPress={() => setShowDatePicker(true)}>
                <CalendarDays size={22} color="#374151" />
              </TouchableOpacity>
              <Text style={{ marginLeft: 4, fontWeight: '600' }}>{getDisplayDate(selectedDate)}</Text>
            </View>

            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              ref={scrollRef}
              style={{ marginVertical: 8 }}
              contentContainerStyle={{ paddingHorizontal: 8 }}
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
                      styles.dayButton,
                      { backgroundColor: isSelected ? Colors.primary : '#F3F4F6' }
                    ]}
                  >
                    <Text style={[styles.dayButtonText, { color: isSelected ? '#FFFFFF' : '#374151' }]}>
                      {day}
                    </Text>
                    {isToday && !isSelected && (
                      <View style={styles.todayIndicator} />
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

          {/* Avg Punch-In */}
          <View style={styles.averageSection}>
            <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 6 }}>
              <Clock size={18} color={Colors.primary} />
              <Text style={styles.averageLabel}>Average Punch-In Time</Text>
            </View>
            <Text style={styles.averageTime}>{loading ? '...' : averagePunchInTime}</Text>
            <Text style={styles.averageSubtext}>
              Calculated across {employees.filter(e => e.entryTime).length} present employees
            </Text>
          </View>

          {/* Search bar */}
          <View style={styles.searchContainer}>
            <View style={styles.searchInputContainer}>
              <Search size={20} color="#9CA3AF" />
              <TextInput
                style={styles.searchInput}
                placeholder="Search employee by name..."
                placeholderTextColor="#9CA3AF"
                value={searchQuery}
                onChangeText={setSearchQuery}
              />
            </View>
            <TouchableOpacity style={styles.filterButton}>
              <Filter size={16} color="#374151" />
            </TouchableOpacity>
          </View>

          {/* Employee cards */}
          <View style={styles.employeeList}>
            {loading ? (
              <View style={{ paddingVertical: 40, alignItems: 'center' }}>
                <ActivityIndicator size="large" color={Colors.primary} />
                <Text style={{ marginTop: 10, color: '#6B7280' }}>Loading attendance...</Text>
              </View>
            ) : filteredEmployees.length === 0 ? (
              <View style={{ paddingVertical: 40, alignItems: 'center' }}>
                <Text style={{ color: '#6B7280', fontSize: 15 }}>
                  {searchQuery ? 'No employees match your search.' : 'No attendance records for this date.'}
                </Text>
              </View>
            ) : (
              filteredEmployees.map(renderEmployeeCard)
            )}
          </View>
        </ScrollView>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({});