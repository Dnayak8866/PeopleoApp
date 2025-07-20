import { Colors } from '@/constants/Colors';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Bell, Calendar, ChevronLeft, ChevronRight, Clock, LogIn, LogOut, Timer } from 'lucide-react-native';
import React, { useState } from 'react';
import {
  Image,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

type AttendanceStatus = 'Present' | 'Absent' | 'Late' | 'Leave' | 'Holiday';

interface DailyAttendance {
  date: string;
  day: string;
  status: AttendanceStatus;
  entryTime: string | null;
  exitTime: string | null;
  workingHours: string;
}

interface MonthlySummary {
  avgPunchIn: string;
  avgPunchOut: string;
  totalHours: string;
}

const months = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
];

const statusColors = {
  Present: { background: '#E6F8EDFF', color: '#4CAF50FF' },
  Absent: { background: '#FEF4F4FF', color: '#EB5757FF' },
  Late: { background: '#FFFBEBFF', color: '#F7B500FF' },
  Leave: { background: '#DBEAFEFF', color: '#1D4ED8FF' },
   Holiday: { background: '#F3F4F6FF', color: '#636AE8FF' },
};


const attendanceData: DailyAttendance[] = [
  {
    date: '01',
    day: 'Monday',
    status: 'Present',
    entryTime: '09:05 AM',
    exitTime: '06:10 PM',
    workingHours: '9h 05m',
  },
  {
    date: '02',
    day: 'Tuesday',
    status: 'Present',
    entryTime: '08:58 AM',
    exitTime: '06:05 PM',
    workingHours: '9h 07m',
  },
  {
    date: '03',
    day: 'Wednesday',
    status: 'Late',
    entryTime: '09:15 AM',
    exitTime: '06:30 PM',
    workingHours: '9h 15m',
  },
  {
    date: '04',
    day: 'Thursday',
    status: 'Present',
    entryTime: '09:02 AM',
    exitTime: '06:08 PM',
    workingHours: '9h 06m',
  },
  {
    date: '05',
    day: 'Friday',
    status: 'Holiday',
    entryTime: null,
    exitTime: null,
    workingHours: '0h 00m',
  },
  {
    date: '08',
    day: 'Monday',
    status: 'Present',
    entryTime: '09:00 AM',
    exitTime: '06:00 PM',
    workingHours: '9h 00m',
  },
  {
    date: '09',
    day: 'Tuesday',
    status: 'Absent',
    entryTime: null,
    exitTime: null,
    workingHours: '0h 00m',
  },
  {
    date: '10',
    day: 'Wednesday',
    status: 'Present',
    entryTime: '08:55 AM',
    exitTime: '06:15 PM',
    workingHours: '9h 20m',
  },
];

const monthlySummary: MonthlySummary = {
  avgPunchIn: '09:05 AM',
  avgPunchOut: '06:02 PM',
  totalHours: '8h 57m',
};

export default function EmployeeDetailsScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const [currentDate, setCurrentDate] = useState(new Date(2023, 10)); // November 2023

  const employee = {
    id: '1',
    name: 'Sophia Rodriguez',
    designation: 'Software Engineer',
    avatar: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&dpr=2',
  };

  const navigateMonth = (direction: 'prev' | 'next') => {
    const newDate = new Date(currentDate);
    newDate.setMonth(newDate.getMonth() + (direction === 'next' ? 1 : -1));
    setCurrentDate(newDate);
  };

  const renderAttendanceCard = (attendance: DailyAttendance) => (
    <View key={attendance.date} style={[styles.attendanceCard, { borderLeftColor: statusColors[attendance.status].color, }]}>
      <View style={styles.dateSection}>
        <View style={{ position: 'relative', marginRight: 12, }}>
          <Calendar size={50} color={statusColors[attendance.status].color} />
          <View style={{ position: 'absolute', top: 20, left: 15 }}>
            <Text style={[styles.dateText, { color: statusColors[attendance.status].color }]}>{attendance.date}</Text>
          </View>
          <Text style={styles.dayText}>{attendance.day}</Text>
        </View>
        <View style={styles.timeSection}>
          <View style={styles.timeRow}>
            <View style={styles.timeItem}>
              <LogIn size={16} color="#1D4ED8FF" />
              <Text style={[styles.timeLabel, {marginLeft:8}]}>In:</Text>
              <Text style={styles.timeValue}>{attendance.entryTime || 'N/A'}</Text>
            </View>
            <View style={styles.timeItem}>
              <LogOut size={16} color="#FF5724FF" />
              <Text style={[styles.timeLabel, {marginLeft:8}]}>Out:</Text>
              <Text style={styles.timeValue}>{attendance.exitTime || 'N/A'}</Text>
            </View>
            <View style={styles.workingHoursRow}>
              <Clock size={16} color="#FFA75AFF" />
              <Text style={styles.workingHoursText}>Working Hours: </Text>
              <Text style={styles.timeValue}>{attendance.workingHours || 'N/A'}</Text>
            </View>
          </View>
        </View>
        <View style={styles.dayInfo}>
          <View style={[styles.statusBadge, { backgroundColor: statusColors[attendance.status].background }]}>
            <Text style={[styles.statusText, {color:statusColors[attendance.status].color}]}>{attendance.status}</Text>
          </View>
        </View>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>TechCorp Solutions</Text>
        <View style={styles.headerActions}>
          <TouchableOpacity>
            <Bell size={24} color="#6B7280" />
          </TouchableOpacity>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>JD</Text>
          </View>
        </View>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.employeeSection}>
          <Image source={{ uri: employee.avatar }} style={styles.employeeAvatar} />
          <View style={styles.employeeInfo}>
            <Text style={styles.employeeName}>{employee.name}</Text>
            <Text style={styles.employeeDesignation}>{employee.designation}</Text>
          </View>
        </View>

        <View style={styles.summarySection}>
          <Text style={styles.sectionTitle}>Monthly Summary</Text>
          <View style={styles.summaryGrid}>
            <View style={styles.summaryCard}>
              <View style={styles.summaryIcon}>
                <Timer size={30} color="#FF5724FF" />
              </View>
              <Text style={styles.summaryValue}>{monthlySummary.avgPunchIn}</Text>
              <Text style={styles.summaryLabel}>Avg Punch In</Text>
            </View>
            <View style={styles.summaryCard}>
              <View style={styles.summaryIcon}>
                <LogOut size={30} color="#FF5724FF" />
              </View>
              <Text style={styles.summaryValue}>{monthlySummary.avgPunchOut}</Text>
              <Text style={styles.summaryLabel}>Avg Punch Out</Text>
            </View>
            <View style={styles.summaryCard}>
              <View style={styles.summaryIcon}>
                <Clock size={30} color="#FF5724FF" />
              </View>
              <Text style={styles.summaryValue}>{monthlySummary.totalHours}</Text>
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
          {attendanceData.map(renderAttendanceCard)}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
    paddingTop: 20,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 14,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  backButton: {
    padding: 4,
  },
  headerTitle: {
    fontSize: 18,
    fontFamily: 'Inter-SemiBold',
    color: '#111827',
  },
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  placeholder: {
    width: 32,
  },
  content: {
    flex: 1,
  },
  employeeSection: {
    flexDirection: 'row',
    alignItems: 'center',
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
  employeeAvatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginRight: 16,
  },
  employeeInfo: {
    flex: 1,
  },
  employeeName: {
    fontSize: 20,
    fontFamily: 'Inter-SemiBold',
    color: '#111827',
    marginBottom: 4,
  },
  employeeDesignation: {
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: '#6b7280',
  },
  summarySection: {
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
  sectionTitle: {
    fontSize: 18,
    fontFamily: 'Inter-SemiBold',
    color: '#111827',
    marginBottom: 16,
  },
  summaryGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  summaryCard: {
    flex: 1,
    alignItems: 'center',
    marginHorizontal: 4,
  },
  summaryIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  summaryValue: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
    color: '#111827',
    marginBottom: 4,
  },
  summaryLabel: {
    fontSize: 12,
    fontFamily: 'Inter',
    color: '#6b7280',
    textAlign: 'center',
  },
  monthSection: {
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
  monthHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  monthText: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
    color: '#636AE8FF',
    padding:6,
    paddingHorizontal: 10,
    borderRadius: 14,
    backgroundColor: Colors.primaryLight,
  },
  attendanceSection: {
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 20,
  },
  attendanceCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    borderLeftWidth: 6,
    paddingTop: 8,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    flex:1,
  },
  dateSection: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    flex: 1,
  },
  dateText: {
    color: '#fff',
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
  },
  dayInfo: { 
    
  },
  dayText: {
    fontSize: 12,
    fontFamily: 'Inter-Medium',
    color: '#8C8D8BFF',
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: {
    color: '#fff',
    fontSize: 12,
    fontFamily: 'Inter-Medium',
  },
  timeSection: {
    paddingTop: 12,
  },
  timeRow: {
    flexDirection: 'column',
    justifyContent: 'space-between',
    marginBottom: 8,
    gap: 6,
  },
  timeItem: {
    flex: 1,
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
  workingHoursRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  workingHoursText: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    color: '#6b7280',
    marginLeft: 8,
  },
});