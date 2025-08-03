import { Colors } from '@/constants/Colors';
import { leavesScreenStyles } from '@/styles/leavesScreenStyles';
import { router } from 'expo-router';
import { Bell, ChevronRight, Plus } from 'lucide-react-native';
import { useState } from 'react';
import { ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

interface LeaveApplication {
  id: string;
  type: 'Half Day' | 'Full Day' | '3 Days';
  date: string;
  dateRange?: string;
  leaveType: 'Casual' | 'Sick';
  status: 'Awaiting' | 'Approved' | 'Declined';
}

const leaveApplications: LeaveApplication[] = [
  {
    id: '1',
    type: 'Half Day',
    date: 'Wed, 16 Dec',
    leaveType: 'Casual',
    status: 'Awaiting',
  },
  {
    id: '2', 
    type: 'Full Day',
    date: 'Mon, 28 Nov',
    leaveType: 'Sick',
    status: 'Approved',
  },
  {
    id: '3',
    type: '3 Days',
    date: 'Tue, 22 Nov - Fri, 25 Nov',
    leaveType: 'Casual',
    status: 'Declined',
  },
  {
    id: '4',
    type: 'Full Day',
    date: 'Wed, 02 Nov',
    leaveType: 'Sick',
    status: 'Approved',
  },
];

export default function LeavesScreen() {
  const [selectedFilter, setSelectedFilter] = useState<'All' | 'Casual' | 'Sick'>('All');
  const styles = leavesScreenStyles();

  const filteredApplications = leaveApplications.filter(app => {
    if (selectedFilter === 'All') return true;
    return app.leaveType === selectedFilter;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Awaiting': return '#fbbf24';
      case 'Approved': return '#10b981';
      case 'Declined': return '#ef4444';
      default: return '#6b7280';
    }
  };

  const getStatusBgColor = (status: string) => {
    switch (status) {
      case 'Awaiting': return '#fef3c7';
      case 'Approved': return '#d1fae5';
      case 'Declined': return '#fee2e2';
      default: return '#f3f4f6';
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Leaves</Text>
        <View style={styles.headerRight}>
          <TouchableOpacity style={styles.notificationButton}>
            <Bell size={24} color="#374151" />
          </TouchableOpacity>
          <TouchableOpacity 
            style={styles.addButton}
            onPress={() => router.push('/employee/apply-leave')}
          >
            <Plus size={24} color="#ffffff" />
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.filterContainer}>
        {['All', 'Casual', 'Sick'].map((filter) => (
          <TouchableOpacity
            key={filter}
            style={[
              styles.filterButton,
              selectedFilter === filter && styles.filterButtonActive,
            ]}
            onPress={() => setSelectedFilter(filter as 'All' | 'Casual' | 'Sick')}
          >
            {filter !== 'All' && (
              <View style={[
                styles.filterDot,
                { backgroundColor: filter === 'Casual' ? '#fbbf24' : Colors.primary }
              ]} />
            )}
            <Text style={[
              styles.filterText,
              selectedFilter === filter && styles.filterTextActive,
            ]}>
              {filter}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <Text style={styles.monthHeader}>December 2020</Text>
        
        {filteredApplications.slice(0, 1).map((application) => (
          <TouchableOpacity key={application.id} style={styles.leaveCard}>
            <View style={styles.leaveCardContent}>
              <Text style={styles.applicationType}>{application.type} Application</Text>
              <Text style={styles.applicationDate}>{application.date}</Text>
              <Text style={[
                styles.leaveTypeText,
                { color: application.leaveType === 'Casual' ? '#fbbf24' : '#6366f1' }
              ]}>
                {application.leaveType}
              </Text>
            </View>
            <View style={styles.leaveCardRight}>
              <View style={[
                styles.statusBadge,
                { backgroundColor: getStatusBgColor(application.status) }
              ]}>
                <Text style={[
                  styles.statusText,
                  { color: getStatusColor(application.status) }
                ]}>
                  {application.status}
                </Text>
              </View>
              <ChevronRight size={20} color="#9ca3af" />
            </View>
          </TouchableOpacity>
        ))}

        <Text style={styles.monthHeader}>November 2020</Text>
        
        {filteredApplications.slice(1).map((application) => (
          <TouchableOpacity key={application.id} style={styles.leaveCard}>
            <View style={styles.leaveCardContent}>
              <Text style={styles.applicationType}>{application.type} Application</Text>
              <Text style={styles.applicationDate}>{application.date}</Text>
              <Text style={[
                styles.leaveTypeText,
                { color: application.leaveType === 'Casual' ? '#fbbf24' : '#6366f1' }
              ]}>
                {application.leaveType}
              </Text>
            </View>
            <View style={styles.leaveCardRight}>
              <View style={[
                styles.statusBadge,
                { backgroundColor: getStatusBgColor(application.status) }
              ]}>
                <Text style={[
                  styles.statusText,
                  { color: getStatusColor(application.status) }
                ]}>
                  {application.status}
                </Text>
              </View>
              <ChevronRight size={20} color="#9ca3af" />
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}