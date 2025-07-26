import { RadialChart } from '@/components/RadialCharts';
import { Colors } from '@/constants/Colors';
import DateTimePicker from '@react-native-community/datetimepicker';
import { router } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { ArrowUp, Bell, CalendarDays, ChartLine, ClipboardCheck, Dot, MailPlus, Users } from 'lucide-react-native';
import React, { useEffect, useState } from 'react';
import {
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';





const QuickActionCard = ({ icon: Icon, title, onPress, iconColor = Colors.primary }: {
  icon: any;
  title: string;
  onPress: () => void;
  iconColor?: string;
}) => (
  <TouchableOpacity style={styles.quickActionCard} onPress={onPress}>
    <View style={[styles.quickActionIcon, { backgroundColor: iconColor + '20' }]}>
      <Icon size={24} color={iconColor} />
    </View>
    <Text style={styles.quickActionTitle}>{title}</Text>
  </TouchableOpacity>
);

const Status = ({ label, value, trend, iconColor }: {
  label: string;
  value: string | number;
  trend?: string;
  iconColor: string;
}) => (
  <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-start', height: 40, width: '50%' }}>
    <Dot size={60} color={iconColor} />
    <Text>{label}: </Text>
    <Text>{value} {trend && <ArrowUp size={15} color={'green'} />}<Text style={{ fontSize: 10, color: 'green', fontWeight:'700', lineHeight:11 }}>{trend}</Text></Text>
  </View>
);

interface WorkingData {
  date: string;
  workingHours: number;
  present: number;
  absent: number;
  onLeave: number;
  lateCheckIn: number;
}

const mockData: WorkingData[] = [
  {
    date: '2023-11-14',
    workingHours: 7.8,
    present: 280,
    absent: 15,
    onLeave: 25,
    lateCheckIn: 30,
  },
];

export default function HomePage() {
  const getToday = () => {
    const d = new Date();
    return d.toISOString().slice(0, 10);
  };
  const [selectedDate, setSelectedDate] = useState(getToday()); // Default to today's date
  const [currentData, setCurrentData] = useState<WorkingData>(mockData[0]);
  const [showDatePicker, setShowDatePicker] = useState(false);

  useEffect(() => {
    const data = mockData.find(d => d.date === selectedDate) || mockData[0];
    setCurrentData(data);
  }, [selectedDate]);

  const getDisplayDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const chartData = [
    { percentage: 40, color: '#22C55E', label: 'Present' },
    { percentage: 30, color: '#EAB308', label: 'On Leave' },
    { percentage: 20, color: '#3B82F6', label: 'Late Check-in' },
    { percentage: 10, color: '#EF4444', label: 'Absent' },
  ];

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Text style={styles.companyName}>TechCorp Solutions</Text>
          <View style={styles.headerActions}>
            <TouchableOpacity>
              <Bell size={24} color="#6B7280" />
            </TouchableOpacity>
            <View style={styles.avatar}>
              <Text style={styles.avatarText}>JD</Text>
            </View>
          </View>
        </View>

        <TouchableOpacity style={{ backgroundColor: '#FFFFFF', marginHorizontal: 0, minWidth: '55%', justifyContent: 'center', alignItems: 'center', alignSelf: 'center', borderRadius: 10, marginTop: 5, padding: 6, boxShadow: '0px 0px 1px #171a1f12, 0px 0px 2px #171a1f1F', borderColor: '#EBEBEAFF', borderWidth: 1, flexDirection:'row', gap:4, marginBottom:20 }} onPress={() => setShowDatePicker(true)}>
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

        {/* <View style={styles.mainStatsContainer}>
          <View style={styles.circleContainer}>
            <View style={styles.circleOuter}>
              <View style={styles.circleInner}>
                <Text style={styles.mainHours}>7.8 hrs</Text>
                <Text style={styles.mainHoursLabel}>Avg. Working Hours</Text>
                <Text style={styles.mainHoursSubLabel}>(Yesterday)</Text>
              </View>
            </View>
          </View>
        </View> */}
        <View style={{ marginTop: 5 }}>
          <RadialChart
            data={chartData}
            centerValue={currentData.workingHours}
            centerLabel="hrs"
            centerSubtitle="Avg. Working Hours"
            centerSubsubtitle="(Yesterday)"
            size={240}
            strokeWidth={20}
          />
        </View>

        <View style={{ flex: 1, justifyContent: 'flex-start', width: '80%', alignSelf: 'flex-start', marginLeft:20 }}>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', }}>
            <Status label='Present' value='20' iconColor='#10B981' trend='5%' />
            <Status label='Absent' value='5' iconColor='#EF4444' />
          </View>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', }}>
            <Status label='On leave' value='3' iconColor={Colors.primary} />
            <Status label='Late Check-ins' value='2' iconColor='#F59E0B' />
          </View>
        </View>


        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Quick Actions</Text>
          <View style={styles.quickActionsGrid}>
            <QuickActionCard
              icon={MailPlus}
              title="Leave Approval"
              onPress={() => { }}
              iconColor="#EF4444"
            />
            <QuickActionCard
              icon={ClipboardCheck}
              title="View Attendance"
              onPress={() => router.push('/employees')}
              iconColor={Colors.primary}
            />
            <QuickActionCard
              icon={Users}
              title="Manage Employees"
              onPress={() => router.push('/employees')}
              iconColor="#06B6D4"
            />
            <QuickActionCard
              icon={ChartLine}
              title="Reports"
              onPress={() => router.push('/add-employee')}
              iconColor="#10B981"
            />
          </View>
        </View>
      </ScrollView>
      <StatusBar style="dark" />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    paddingTop: 28,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingBottom: 10,
    paddingHorizontal: 20,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  companyName: {
    fontSize: 18,
    fontWeight: '700',
    color: '#111827',
    textAlign: 'center',
    marginLeft: 34,
  },
  dateText: {
    fontSize: 14,
    color: '#6B7280',
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
  mainStatsContainer: {
    padding: 20,
    alignItems: 'center',
  },
  circleContainer: {
    width: 200,
    height: 200,
  },
  circleOuter: {
    width: 200,
    height: 200,
    borderRadius: 100,
    backgroundColor: '#10B981',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  circleInner: {
    width: 160,
    height: 160,
    borderRadius: 80,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  mainHours: {
    fontSize: 32,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 4,
  },
  mainHoursLabel: {
    fontSize: 12,
    color: '#6B7280',
    textAlign: 'center',
  },
  mainHoursSubLabel: {
    fontSize: 11,
    color: '#9CA3AF',
    textAlign: 'center',
  },
  statsGrid: {
    flexDirection: 'column',
    flexWrap: 'wrap',
    justifyContent: 'center',
    width: '60%',
  },
  statCard: {
    flex: 1,
    minWidth: '47%',
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  statHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  trendContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  trendText: {
    fontSize: 12,
    color: '#10B981',
    fontWeight: '600',
  },
  statValue: {
    fontSize: 24,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 14,
    color: '#6B7280',
  },
  section: {
    padding: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 16,
  },
  quickActionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  quickActionCard: {
    flex: 1,
    minWidth: '40%',
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  quickActionIcon: {
    width: 56,
    height: 56,
    borderRadius: 50,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  quickActionTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
    textAlign: 'center',
  },
});