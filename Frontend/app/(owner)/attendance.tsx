import { Colors } from '@/constants/Colors';
import { attendanceScreenStyles } from '@/styles/attendanceScreenStyles';
import DateTimePicker from '@react-native-community/datetimepicker';
import { useRouter } from 'expo-router';
import { CalendarDays, Clock, Filter, Hourglass, Search, Timer } from 'lucide-react-native';
import React, { useEffect, useMemo, useRef, useState } from 'react';
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
  const styles = attendanceScreenStyles();

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
        onPress={() => router.push(`/employee/${employee.id}`)}
      >
        <Text style={styles.viewDetailsText}>View Details →</Text>
      </TouchableOpacity>
    </View>
  );

  const scrollRef = useRef<ScrollView>(null);

  // Fixed scrolling logic
  const scrollToSelectedDate = () => {
    const selectedDay = new Date(selectedDate).getDate();
    const daysInMonth = getMonthDays(selectedDate);
    const selectedIndex = daysInMonth.indexOf(selectedDay);
    
    if (selectedIndex !== -1) {
      // Calculate the scroll position
      // Each day takes up approximately 44px (36px width + 8px margin)
      const itemWidth = 44;
      const scrollPosition = selectedIndex * itemWidth - 40; // Offset to center
      
      setTimeout(() => {
        scrollRef.current?.scrollTo({ 
          x: Math.max(0, scrollPosition), 
          animated: true 
        });
      }, 100);
    }
  };

  // Scroll to selected date when it changes
  useEffect(() => {
    scrollToSelectedDate();
  }, [selectedDate]);

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
                      {
                        backgroundColor: isSelected ? Colors.primary : '#F3F4F6',
                      }
                    ]}
                  >
                    <Text style={[
                      styles.dayButtonText,
                      { color: isSelected ? '#FFFFFF' : '#374151' }
                    ]}>
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
  
});