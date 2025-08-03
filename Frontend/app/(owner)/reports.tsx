import { reportsScreenStyles } from '@/styles/reportsScreenStyles';
import { StatusBar } from 'expo-status-bar';
import { Bell, Briefcase, CalendarX, ChevronDown, Clock, Download, Share, UserCheck, Users, UserX } from 'lucide-react-native';
import { Dimensions, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { BarChart, LineChart } from 'react-native-chart-kit';
import { SafeAreaView } from 'react-native-safe-area-context';

const screenWidth = Dimensions.get('window').width;

export default function ReportsScreen() {
  const keyMetrics = [
    { label: 'Attendance %', value: '93.5%', change: '+2%', changeType: 'positive', icon: <UserCheck size={24} color={'#16A34AFF'}/> },
    { label: 'Total Employees', value: '250', change: 'No Change', changeType: 'neutral', icon: <Users size={24} color={'#2563EBFF'}/> },
    { label: 'Absent %', value: '3.2%', change: '-0.5%', changeType: 'positive', icon: <UserX size={24} color={'#DC2626FF'}/> },
    { label: 'On Leave %', value: '2.8%', change: '-0.3%', changeType: 'positive', icon: <CalendarX size={24} color={'#9333EAFF'}/> },
    { label: 'Late Check-ins', value: '15%', change: '+2%', changeType: 'negative', icon: <Clock size={24} color={'#EA580CFF'}/> },
    { label: 'Avg Work Hours', value: '40.5 hrs', change: '-0.5 hrs', changeType: 'negative', icon: <Briefcase size={24} color={'#0891B2FF'}/> },
  ];

  const employees = [
    { name: 'Alice Johnson', department: 'Development', hours: '165 hrs', avatar: 'AJ', color: '#007AFF' },
    { name: 'Bob Williams', department: 'Development', hours: '158 hrs', avatar: 'BW', color: '#6D6D70' },
    { name: 'Charlie Brown', department: 'HR', hours: '176 hrs', avatar: 'CB', color: '#007AFF' },
    { name: 'Diana Prince', department: 'Marketing', hours: '140 hrs', avatar: 'DP', color: '#AF52DE' },
  ];

  const chartConfig = {
    backgroundColor: '#FFFFFF',
    backgroundGradientFrom: '#FFFFFF',
    backgroundGradientTo: '#FFFFFF',
    decimalPlaces: 1,
    color: (opacity = 1) => `rgba(0, 122, 255, ${opacity})`,
    labelColor: (opacity = 1) => `rgba(142, 142, 147, ${opacity})`,
    style: {
      borderRadius: 12,
    },
    propsForDots: {
      r: '4',
      strokeWidth: '2',
      stroke: '#007AFF',
    },
    propsForBackgroundLines: {
      strokeWidth: 1,
      stroke: '#E5E5E7',
      strokeDasharray: '',
    },
    propsForLabels: {
      fontSize: 12,
    },
  };

  const barChartConfig = {
    ...chartConfig,
    color: (opacity = 1) => `rgba(255, 59, 48, ${opacity})`,
    barPercentage: 0.7,
    fillShadowGradient: '#FF3B30',
    fillShadowGradientOpacity: 1,
  };

  const attendanceTrendData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
    datasets: [
      {
        data: [91.5, 93.2, 92.8, 94.1, 93.5, 94.2],
        color: (opacity = 1) => `rgba(0, 122, 255, ${opacity})`,
        strokeWidth: 3,
      },
    ],
  };

  const lateCheckinsData = {
    labels: ['HR', 'Sales', 'Marketing', 'Dev', 'Support'],
    datasets: [
      {
        data: [12, 18, 15, 24, 10],
      },
    ],
  };

  const weeklyHoursData = {
    labels: ['W1', 'W2', 'W3', 'W4'],
    datasets: [
      {
        data: [39.5, 41.2, 40.8, 40.5],
        color: (opacity = 1) => `rgba(0, 122, 255, ${opacity})`,
        strokeWidth: 3,
      },
    ],
  };
  const styles = reportsScreenStyles();

  const MetricCard = ({ metric }: any) => (
    <View style={styles.metricCard}>
      <View style={styles.metricIcon}>
        {metric.icon}
        <Text style={styles.metricLabel}>{metric.label}</Text>
      </View>
      <Text style={styles.metricValue}>{metric.value}</Text>
      <View style={{ 
        backgroundColor: metric.changeType === 'positive' ? '#DCFCE7FF': metric.changeType === 'negative' ? '#FEE2E2FF': '#F3F4F6FF', 
        paddingHorizontal: 8, 
        paddingVertical: 6, 
        borderRadius: 8 
      }}>
        <Text style={[
          styles.metricChange,
          { color: metric.changeType === 'positive' ? '#34C759' : metric.changeType === 'negative' ? '#FF3B30' : '#8E8E93' }
        ]}>
          {metric.change} {metric.changeType !== 'neutral' && 'vs Last Month'}
        </Text>
      </View>
    </View>
  );

  const EmployeeItem = ({ employee }: any) => (
    <View style={styles.employeeItem}>
      <View style={[styles.avatar, { backgroundColor: employee.color }]}>
        <Text style={styles.avatarText}>{employee.avatar}</Text>
      </View>
      <View style={styles.employeeInfo}>
        <Text style={styles.employeeName}>{employee.name}</Text>
        <Text style={styles.employeeDepartment}>{employee.department}</Text>
      </View>
      <Text style={styles.employeeHours}>{employee.hours}</Text>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Reports</Text>
        <View style={styles.headerIcons}>
          <TouchableOpacity style={styles.iconButton}>
            <Bell size={24} color="#007AFF" />
          </TouchableOpacity>
          <View style={styles.profileIcon}>
            <Text style={styles.profileText}>HR</Text>
          </View>
        </View>
      </View>

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <TouchableOpacity style={styles.dateSelector}>
          <Text style={styles.dateText}>01 Jan - 31 Jan 2024</Text>
          <ChevronDown size={20} color="#007AFF" />
        </TouchableOpacity>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Key Metrics</Text>
          <View style={styles.metricsGrid}>
            {keyMetrics.map((metric, index) => (
              <MetricCard key={index} metric={metric} />
            ))}
          </View>
        </View>

        <View style={styles.divider} />

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Attendance Analytics</Text>
          
          <View style={styles.chartCard}>
            <View style={styles.chartHeader}>
              <Text style={styles.chartTitle}>Attendance Trend</Text>
              <View style={styles.chartActions}>
                <TouchableOpacity style={styles.chartAction}>
                  <Download size={16} color="#8E8E93" />
                </TouchableOpacity>
                <TouchableOpacity style={styles.chartAction}>
                  <Share size={16} color="#8E8E93" />
                </TouchableOpacity>
              </View>
            </View>
            <LineChart
              data={attendanceTrendData}
              width={screenWidth - 72}
              height={200}
              chartConfig={chartConfig}
              bezier
              style={styles.chart}
              withInnerLines={true}
              withOuterLines={false}
              withVerticalLines={false}
              withHorizontalLines={true}
              fromZero={false}
              segments={4}
            />
          </View>

          <View style={styles.chartCard}>
            <View style={styles.chartHeader}>
              <Text style={styles.chartTitle}>Late Check-ins by Department</Text>
              <View style={styles.chartActions}>
                <TouchableOpacity style={styles.chartAction}>
                  <Download size={16} color="#8E8E93" />
                </TouchableOpacity>
                <TouchableOpacity style={styles.chartAction}>
                  <Share size={16} color="#8E8E93" />
                </TouchableOpacity>
              </View>
            </View>
            <BarChart
              data={lateCheckinsData}
              width={screenWidth - 70}
              height={200}
              chartConfig={barChartConfig}
              style={styles.chart}
              showValuesOnTopOfBars={true}
              withInnerLines={false}
              withHorizontalLines={true}
              fromZero={true}
              segments={4}
            />
          </View>

          <View style={styles.chartCard}>
            <View style={styles.chartHeader}>
              <Text style={styles.chartTitle}>Weekly Work Hour Trend</Text>
              <View style={styles.chartActions}>
                <TouchableOpacity style={styles.chartAction}>
                  <Download size={16} color="#8E8E93" />
                </TouchableOpacity>
                <TouchableOpacity style={styles.chartAction}>
                  <Share size={16} color="#8E8E93" />
                </TouchableOpacity>
              </View>
            </View>
            <LineChart
              data={weeklyHoursData}
              width={screenWidth - 72}
              height={200}
              chartConfig={chartConfig}
              bezier
              style={styles.chart}
              withInnerLines={true}
              withOuterLines={false}
              withVerticalLines={false}
              withHorizontalLines={true}
              fromZero={false}
              segments={4}
            />
          </View>
        </View>

        <View style={[styles.section, {marginBottom:14}]}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Employee Overview</Text>
            <TouchableOpacity style={styles.sectionAction}>
              <Download size={16} color="#8E8E93" />
            </TouchableOpacity>
          </View>
          <View style={styles.employeeList}>
            {employees.map((employee, index) => (
              <EmployeeItem key={index} employee={employee} />
            ))}
          </View>
        </View>
      </ScrollView>
      <StatusBar style="dark" />
    </SafeAreaView>
  );
}