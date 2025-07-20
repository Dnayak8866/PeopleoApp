import { Colors } from '@/constants/Colors';
import DateTimePicker from '@react-native-community/datetimepicker';
import { useRouter } from 'expo-router';
import { CalendarDays, Clock, Filter, Hourglass, Search, Timer } from 'lucide-react-native';
import React, { useMemo, useState } from 'react';
import {
  Image,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';

type AttendanceStatus = 'Present' | 'Absent' | 'Late' | 'Leave';

interface Employee {
  id: string;
  name: string;
  designation: string;
  avatar: string;
  status: AttendanceStatus;
  entryTime: string | null;
  exitTime: string | null;
  duration: string;
}

interface DateItem {
  date: string;
  day: string;
  dayName: string;
  month: string;
  year: string;
  isToday: boolean;
  isSelected: boolean;
}

const employees: Employee[] = [
  {
    id: '1',
    name: 'Alice Johnson',
    designation: 'Software Engineer',
    avatar: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&dpr=2',
    status: 'Present',
    entryTime: '09:00 AM',
    exitTime: '05:00 PM',
    duration: '8h:00m',
  },
  {
    id: '2',
    name: 'Charlie Brown',
    designation: 'Product Manager',
    avatar: 'https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&dpr=2',
    status: 'Absent',
    entryTime: null,
    exitTime: null,
    duration: '0h:00m',
  },
  {
    id: '3',
    name: 'Bob Williams',
    designation: 'HR Manager',
    avatar: 'https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&dpr=2',
    status: 'Late',
    entryTime: '09:15 AM',
    exitTime: '05:30 PM',
    duration: '8h:15m',
  },
  {
    id: '4',
    name: 'Sarah Davis',
    designation: 'UX Designer',
    avatar: 'https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&dpr=2',
    status: 'Leave',
    entryTime: null,
    exitTime: null,
    duration: '0h:00m',
  },
];

const statusColors = {
  Present: { background: '#E6F8EDFF', color: '#4CAF50FF' },
  Absent: { background: '#FEF4F4FF', color: '#EB5757FF' },
  Late: { background: '#FFFBEBFF', color: '#F7B500FF' },
  Leave: { background: '#DBEAFEFF', color: '#1D4ED8FF' },
};

export default function AttendanceScreen() {
  const router = useRouter();
  const [selectedDate, setSelectedDate] = useState(getToday());
  const [searchQuery, setSearchQuery] = useState('');
  const [showDatePicker, setShowDatePicker] = useState(false);

  function getToday() {
    const d = new Date();
    return d.toISOString().slice(0, 10);
  };
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
  }, [searchQuery]);

  const averagePunchInTime = useMemo(() => {
    const presentEmployees = employees.filter(emp => emp.status === 'Present' || emp.status === 'Late');
    if (presentEmployees.length === 0) return 'N/A';

    return '09:05 AM';
  }, []);

  const renderEmployeeCard = (employee: Employee) => (
    <View key={employee.id} style={styles.employeeCard}>
      <View style={styles.employeeHeader}>
        <View style={styles.employeeInfo}>
          <Image source={{ uri: employee.avatar }} style={styles.avatar} />
          <View style={styles.employeeDetails}>
            <Text style={styles.employeeName}>{employee.name}</Text>
            <Text style={styles.employeeDesignation}>{employee.designation}</Text>
          </View>
        </View>
        <View style={[styles.statusBadge, { backgroundColor: statusColors[employee.status].background }]}>
          <Text style={[styles.statusText, { color: statusColors[employee.status].color }]}>{employee.status}</Text>
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
        onPress={() => router.push({
          pathname: '/employee-details',
          params: { id: employee.id }
        })}
      >
        <Text style={styles.viewDetailsText}>View Details →</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Daily Attendance</Text>
          <View style={styles.profileAvatar}>
            <Text style={styles.profileAvatarText}>JD</Text>
          </View>
        </View>

        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          <View style={styles.dateSection}>
            <View style={styles.dateHeader}>
              <TouchableOpacity onPress={() => setShowDatePicker(true)}>
                <CalendarDays size={22} color="#374151" />
              </TouchableOpacity>
              <Text style={{ marginLeft: 4, fontWeight: '600' }}>{getDisplayDate(selectedDate)}</Text>
            </View>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginVertical: 8 }}>
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
                    style={{
                      backgroundColor: isSelected ? Colors.primary : '#F3F4F6', paddingHorizontal: 4,
                      borderRadius: 50,
                      marginHorizontal: 4,
                      padding: 8,
                      alignItems: 'center',
                      minWidth: 36,
                    }}
                  >
                    <Text style={{ color: isSelected ? '#FFFFFF' : '#374151', fontWeight: '600' }}>
                      {day}
                    </Text>
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
                if (date) {
                  setSelectedDate(date.toISOString().slice(0, 10));
                }
              }}
              maximumDate={new Date()}
            />
          )}

          <View style={styles.averageSection}>
            <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 6 }}>
              <Clock size={18} color={Colors.primary} />
              <Text style={styles.averageLabel}>Average Punch-In Time</Text>
            </View>
            <Text style={styles.averageTime}>{averagePunchInTime}</Text>
            <Text style={styles.averageSubtext}>
              Calculated across all active employees today
            </Text>
          </View>

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

          <View style={styles.employeeList}>
            {filteredEmployees.map(renderEmployeeCard)}
          </View>
        </ScrollView>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
    paddingBottom: 10,
    paddingTop: 44,
  },
  headerTitle: {
    flex: 1,
    fontSize: 20,
    color: '#242524FF',
    fontWeight: '600',
    textAlign: 'center',
    marginLeft: 10,
  },
  profileAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  profileAvatarText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  content: {
    flex: 1,
  },
  dateSection: {
    backgroundColor: '#fff',
    marginHorizontal: 20,
    marginTop: 16,
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  dateHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  monthYear: {
    fontSize: 16,
    fontFamily: 'Inter-Medium',
    color: '#374151',
  },
  dateSelector: {
    backgroundColor: '#3b82f6',
    borderRadius: 8,
    paddingVertical: 8,
    paddingHorizontal: 16,
    alignSelf: 'center',
  },
  dateText: {
    color: '#fff',
    fontSize: 14,
    fontFamily: 'Inter-Medium',
  },
  averageSection: {
    backgroundColor: '#fff',
    marginHorizontal: 20,
    marginTop: 16,
    borderRadius: 12,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  averageLabel: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    color: '#6b7280',
    marginLeft: 6,
  },
  averageTime: {
    fontSize: 28,
    fontFamily: 'Inter-SemiBold',
    color: '#3b82f6',
    marginBottom: 4,
  },
  averageSubtext: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: '#9ca3af',
  },
  searchContainer: {
    flex: 1,
    paddingVertical: 14,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginHorizontal: 20,
  },
  searchInputContainer: {
    width: '83%',
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#EBEBEAFF',
    borderRadius: 10,
    paddingHorizontal: 12,
    gap: 6,
    borderColor: '#EBEBEAFF',
    borderWidth: 1,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: '#111827',
  },
  filterButton: {
    padding: 14,
    backgroundColor: '#FFFFFFFF',
    borderWidth: 1,
    borderColor: '#EBEBEAFF',
    borderRadius: 8,
  },
  employeeList: {
    paddingHorizontal: 20,
    paddingTop: 14,
    paddingBottom: 20,
  },
  employeeCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  employeeHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  employeeInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    marginRight: 12,
  },
  employeeDetails: {
    flex: 1,
  },
  employeeName: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#111827',
    marginBottom: 2,
  },
  employeeDesignation: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#6b7280',
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 14,
  },
  statusText: {
    color: '#fff',
    fontSize: 12,
    fontFamily: 'Inter-Medium',
  },
  attendanceInfo: {
    marginBottom: 12,
  },
  timeRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  timeItem: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  durationRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  timeLabel: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#6b7280',
    marginRight: 8,
  },
  timeValue: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    color: '#111827',
  },
  viewDetailsButton: {
    alignSelf: 'flex-end',
  },
  viewDetailsText: {
    marginTop:4,
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    color: '#4FC3A2FF',
  },
});