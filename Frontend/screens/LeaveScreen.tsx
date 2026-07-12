import { Colors } from '@/constants/Colors';
import { leavesScreenStyles } from '@/styles/leavesScreenStyles';
import { router } from 'expo-router';
import { Bell, ChevronRight, Plus, Filter, ChevronDown, Check } from 'lucide-react-native';
import { useEffect, useState } from 'react';
import { ScrollView, Text, TouchableOpacity, View, ActivityIndicator, Alert, Modal, Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuth } from '@/context/AuthContext';
import { getEmployeeLeaves } from '@/services/api/leaves';
import { useMasterDataContext } from '@/context/MasterDataContext';


export default function LeavesScreen() {
  const [selectedFilter, setSelectedFilter] = useState<string>('All');
  const [leaves, setLeaves] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showFilterDropdown, setShowFilterDropdown] = useState(false);
  const { userId } = useAuth();
  const { leaveTypes } = useMasterDataContext();
  const styles = leavesScreenStyles();

  useEffect(() => {
    if (userId) {
      fetchLeaves();
    }
  }, [userId]);

  const fetchLeaves = async () => {
    try {
      setIsLoading(true);
      const data = await getEmployeeLeaves(userId!);
      setLeaves(data);
    } catch (error) {
      console.error('Error fetching leaves:', error);
      Alert.alert('Error', 'Failed to fetch leave applications');
    } finally {
      setIsLoading(false);
    }
  };

  const filteredApplications = leaves.filter(app => {
    if (selectedFilter === 'All') return true;
    const typeName = app.leave_type?.type_name || '';
    return typeName.toLowerCase().includes(selectedFilter.toLowerCase());
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Pending': return '#fbbf24';
      case 'Approved': return '#10b981';
      case 'Rejected': return '#ef4444';
      default: return '#6b7280';
    }
  };

  const getStatusBgColor = (status: string) => {
    switch (status) {
      case 'Pending': return '#fef3c7';
      case 'Approved': return '#d1fae5';
      case 'Rejected': return '#fee2e2';
      default: return '#f3f4f6';
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Leaves</Text>
        <View style={styles.headerRight}>
          <TouchableOpacity
            style={styles.notificationButton}
            onPress={() => router.push('/notifications')}
          >
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

      <View style={styles.filterSection}>
        <TouchableOpacity
          style={styles.filterTrigger}
          onPress={() => setShowFilterDropdown(!showFilterDropdown)}
          activeOpacity={0.7}
        >
          <View style={styles.filterTriggerLeft}>
            <Filter size={20} color={Colors.primary} style={{ marginRight: 8 }} />
            <Text style={styles.filterTriggerText}>
              Filter: <Text style={{ fontWeight: '700', color: Colors.primary }}>{selectedFilter}</Text>
            </Text>
          </View>
          <ChevronDown size={20} color="#9ca3af" />
        </TouchableOpacity>

        {showFilterDropdown && (
          <View style={styles.dropdownMenu}>
            {['All', ...leaveTypes.map(t => t.type_name)].map((filter) => (
              <TouchableOpacity
                key={filter}
                style={styles.dropdownItem}
                onPress={() => {
                  setSelectedFilter(filter);
                  setShowFilterDropdown(false);
                }}
              >
                <Text style={[
                  styles.dropdownItemText,
                  selectedFilter === filter && styles.dropdownItemTextActive
                ]}>
                  {filter}
                </Text>
                {selectedFilter === filter && (
                  <Check size={18} color={Colors.primary} />
                )}
              </TouchableOpacity>
            ))}
          </View>
        )}
      </View>

      {/* Backdrop to close dropdown when clicking outside */}
      {showFilterDropdown && (
        <Pressable
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            zIndex: 90
          }}
          onPress={() => setShowFilterDropdown(false)}
        />
      )}

      <ScrollView style={{ ...styles.scrollView, marginTop: 10 }} showsVerticalScrollIndicator={false}>
        {isLoading ? (
          <ActivityIndicator size="large" color={Colors.primary} style={{ marginTop: 50 }} />
        ) : filteredApplications.length === 0 ? (
          <View style={{ alignItems: 'center', marginTop: 50 }}>
            <Text style={{ color: '#6b7280' }}>No leave applications found</Text>
          </View>
        ) : (
          filteredApplications.map((application) => (
            <TouchableOpacity key={application.leave_id} style={styles.leaveCard}>
              <View style={styles.leaveCardContent}>
                <Text style={styles.applicationType}>
                  {application.leave_type?.type_name || 'Leave'} Application
                </Text>
                <Text style={styles.applicationDate}>
                  {new Date(application.from_date).toLocaleDateString()} - {new Date(application.to_date).toLocaleDateString()}
                </Text>
                <Text style={[
                  styles.leaveTypeText,
                  { color: '#6366f1' }
                ]}>
                  {application.status}
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
          ))
        )}
      </ScrollView>
    </SafeAreaView>
  );
}