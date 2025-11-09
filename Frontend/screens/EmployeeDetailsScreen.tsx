import { employeeDetailsScreenStyles } from '@/styles/employeeDetailsScreenStyles';
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

export default function EmployeeDetailsScreen(employeeId: string) {
  const router = useRouter();
  const params = useLocalSearchParams();
  const [currentDate, setCurrentDate] = useState(new Date(2023, 10)); // November 2023
  const styles = employeeDetailsScreenStyles();

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
  
});