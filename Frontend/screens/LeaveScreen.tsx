import { Colors } from '@/constants/Colors';
import { router } from 'expo-router';
import { Bell, ChevronRight, Plus, Filter, ChevronDown, Check, CalendarDays, ClipboardList, Plane } from 'lucide-react-native';
import React, { useEffect, useState, useRef } from 'react';
import {
  ScrollView,
  Text,
  TouchableOpacity,
  View,
  ActivityIndicator,
  Alert,
  Pressable,
  StyleSheet,
  Dimensions,
  Platform,
  Animated,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuth } from '@/context/AuthContext';
import LeaveIllustration from '@/components/illustrations/LeaveIllustration';
import { getEmployeeLeaves } from '@/services/api/leaves';
import { useMasterDataContext } from '@/context/MasterDataContext';
import { LinearGradient } from 'expo-linear-gradient';
import { StatusBar } from 'expo-status-bar';

const { width } = Dimensions.get('window');

type LeaveStatus = 'Approved' | 'Pending' | 'Rejected';

const statusStyles: Record<LeaveStatus, { bg: string; text: string }> = {
  Approved: { bg: '#ECFDF5', text: '#10B981' },
  Pending: { bg: '#FFFBEB', text: '#F59E0B' },
  Rejected: { bg: '#FEF2F2', text: '#EF4444' },
};

export default function LeavesScreen() {
  const [selectedFilter, setSelectedFilter] = useState<string>('All');
  const [leaves, setLeaves] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showFilterDropdown, setShowFilterDropdown] = useState(false);
  const { userId } = useAuth();
  const { leaveTypes } = useMasterDataContext();

  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(15)).current;

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

  useEffect(() => {
    if (!isLoading) {
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
    }
  }, [isLoading, leaves]);

  const filteredApplications = leaves.filter(app => {
    if (selectedFilter === 'All') return true;
    const typeName = app.leave_type?.type_name || '';
    return typeName.toLowerCase().includes(selectedFilter.toLowerCase());
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Pending': return '#F59E0B';
      case 'Approved': return '#10B981';
      case 'Rejected': return '#EF4444';
      default: return '#64748B';
    }
  };

  const getStatusBgColor = (status: string) => {
    switch (status) {
      case 'Pending': return '#FFFBEB';
      case 'Approved': return '#ECFDF5';
      case 'Rejected': return '#FEF2F2';
      default: return '#F1F5F9';
    }
  };

  const getDisplayDate = (dateString: string) => {
    const d = new Date(dateString);
    return d.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  return (
    <SafeAreaView style={styles.safeContainer}>
      <StatusBar style="dark" />

      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerTitleContainer}>
          <Text style={styles.welcomeText}>Time Off</Text>
          <Text style={styles.headerTitle}>Leaves</Text>
        </View>
        <View style={styles.headerActions}>
          <TouchableOpacity
            style={styles.bellButton}
            onPress={() => router.push('/notifications')}
            hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
          >
            <Bell size={22} color="#1E293B" />
            <View style={styles.bellBadge} />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView
        style={styles.container}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Welcome Time Off Card & Illustration */}
        <View style={styles.welcomeCard}>
          <LinearGradient
            colors={['#EEF2FF', '#F5F3FF']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.welcomeGradient}
          >
            <View style={styles.welcomeTextContainer}>
              <Text style={styles.welcomeQuote}>Planning Time Off?</Text>
              <Text style={styles.ownerName}>Holidays</Text>
              <Text style={styles.welcomeDesc}>
                Submit a leave request, track approval logs, and view your active leave balances.
              </Text>
              
              <TouchableOpacity
                style={styles.applyBtnPill}
                onPress={() => router.push('/employee/apply-leave')}
                activeOpacity={0.75}
              >
                <Text style={styles.applyBtnText}>Apply Now</Text>
              </TouchableOpacity>
            </View>
            <View style={styles.illustrationWrapper}>
              <LeaveIllustration width={110} height={90} />
            </View>
          </LinearGradient>
        </View>

        {/* Filter Section */}
        <View style={styles.filterSection}>
          <TouchableOpacity
            style={styles.filterTrigger}
            onPress={() => setShowFilterDropdown(!showFilterDropdown)}
            activeOpacity={0.8}
          >
            <View style={styles.filterTriggerLeft}>
              <Filter size={16} color="#6366f1" style={{ marginRight: 8 }} />
              <Text style={styles.filterTriggerText}>
                Category: <Text style={styles.filterTriggerActive}>{selectedFilter}</Text>
              </Text>
            </View>
            <ChevronDown size={16} color="#94A3B8" />
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
                  activeOpacity={0.7}
                >
                  <Text style={[
                    styles.dropdownItemText,
                    selectedFilter === filter && styles.dropdownItemTextActive
                  ]}>
                    {filter}
                  </Text>
                  {selectedFilter === filter && (
                    <Check size={16} color="#6366f1" />
                  )}
                </TouchableOpacity>
              ))}
            </View>
          )}
        </View>

        {/* Backdrop to close dropdown when clicking outside */}
        {showFilterDropdown && (
          <Pressable
            style={styles.dropdownBackdrop}
            onPress={() => setShowFilterDropdown(false)}
          />
        )}

        {/* Logs Applications List */}
        <View style={styles.logsSection}>
          <Text style={styles.logsSectionTitle}>My Applications</Text>

          <Animated.View style={{ opacity: fadeAnim, transform: [{ translateY: slideAnim }] }}>
            {isLoading ? (
              <View style={styles.loaderWrapper}>
                <ActivityIndicator size="large" color="#6366f1" />
                <Text style={styles.loaderText}>Syncing records...</Text>
              </View>
            ) : filteredApplications.length === 0 ? (
              <View style={styles.emptyState}>
                <ClipboardList size={40} color="#94A3B8" style={{ marginBottom: 12 }} />
                <Text style={styles.emptyText}>No leave applications found.</Text>
              </View>
            ) : (
              filteredApplications.map((application) => {
                const statusColor = getStatusColor(application.status);
                const statusBg = getStatusBgColor(application.status);
                return (
                  <TouchableOpacity
                    key={application.leave_id}
                    style={styles.leaveCard}
                    activeOpacity={0.7}
                    onPress={() => {}}
                  >
                    <View style={styles.leaveCardContent}>
                      <View style={styles.leaveTypeBadge}>
                        <Text style={styles.leaveTypeBadgeText} numberOfLines={1}>
                          {application.leave_type?.type_name || 'Leave'}
                        </Text>
                      </View>
                      <Text style={styles.applicationDate} numberOfLines={1}>
                        {getDisplayDate(application.from_date)} - {getDisplayDate(application.to_date)}
                      </Text>
                      <Text style={styles.applicationReason} numberOfLines={1}>
                        {application.reason || 'No reason provided'}
                      </Text>
                    </View>
                    <View style={styles.leaveCardRight}>
                      <View style={[styles.statusBadge, { backgroundColor: statusBg }]}>
                        <Text style={[styles.statusText, { color: statusColor }]}>
                          {application.status}
                        </Text>
                      </View>
                      <View style={styles.chevronWrapper}>
                        <ChevronRight size={14} color="#94A3B8" />
                      </View>
                    </View>
                  </TouchableOpacity>
                );
              })
            )}
          </Animated.View>
        </View>
      </ScrollView>

      {/* Floating Action Button */}
      {!isLoading && (
        <TouchableOpacity
          style={styles.fab}
          onPress={() => router.push('/employee/apply-leave')}
          activeOpacity={0.85}
        >
          <LinearGradient
            colors={['#6366f1', '#7c3aed']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.fabGradient}
          >
            <Plus size={24} color="#FFFFFF" />
          </LinearGradient>
        </TouchableOpacity>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeContainer: {
    flex: 1,
    backgroundColor: '#FAFBFF',
  },
  container: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingBottom: 100, // Space for FAB
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
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  bellButton: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: '#F1F5F9',
  },
  bellBadge: {
    position: 'absolute',
    top: 9,
    right: 9,
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#EF4444',
  },

  // --- Welcome Card ---
  welcomeCard: {
    borderRadius: 22,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(99, 102, 241, 0.08)',
    marginBottom: 20,
  },
  welcomeGradient: {
    flexDirection: 'row',
    padding: 20,
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  welcomeTextContainer: {
    flex: 1.2,
    paddingRight: 10,
  },
  welcomeQuote: {
    fontSize: 12,
    color: '#6366f1',
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  ownerName: {
    fontSize: 24,
    fontWeight: '800',
    color: '#1E1B4B',
    marginVertical: 2,
  },
  welcomeDesc: {
    fontSize: 11,
    color: '#64748B',
    lineHeight: 16,
    marginBottom: 12,
  },
  applyBtnPill: {
    alignSelf: 'flex-start',
    backgroundColor: '#6366f1',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 10,
    shadowColor: '#6366f1',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 3,
  },
  applyBtnText: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: '700',
  },
  illustrationWrapper: {
    flex: 0.8,
    alignItems: 'center',
    justifyContent: 'center',
  },

  // --- Filter ---
  filterSection: {
    marginBottom: 24,
    zIndex: 100,
  },
  filterTrigger: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderWidth: 1.5,
    borderColor: '#E2E8F0',
  },
  filterTriggerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  filterTriggerText: {
    fontSize: 13,
    color: '#64748B',
    fontWeight: '500',
  },
  filterTriggerActive: {
    fontWeight: '700',
    color: '#6366f1',
  },
  dropdownMenu: {
    position: 'absolute',
    top: '105%',
    left: 0,
    right: 0,
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    paddingVertical: 8,
    shadowColor: '#6366f1',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.08,
    shadowRadius: 16,
    elevation: 6,
    borderWidth: 1.5,
    borderColor: '#E2E8F0',
    zIndex: 1000,
  },
  dropdownItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  dropdownItemText: {
    fontSize: 13,
    color: '#475569',
    fontWeight: '600',
  },
  dropdownItemTextActive: {
    color: '#6366f1',
    fontWeight: '800',
  },
  dropdownBackdrop: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 90,
  },

  // --- Logs List ---
  logsSection: {
    flex: 1,
  },
  logsSectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1E1B4B',
    marginBottom: 14,
  },
  leaveCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#F1F5F9',
    shadowColor: '#6366f1',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.03,
    shadowRadius: 10,
    elevation: 3,
  },
  leaveCardContent: {
    flex: 1,
    paddingRight: 6,
  },
  leaveTypeBadge: {
    alignSelf: 'flex-start',
    backgroundColor: '#EEF2FF',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
    marginBottom: 6,
  },
  leaveTypeBadgeText: {
    fontSize: 10,
    color: '#6366f1',
    fontWeight: '700',
  },
  applicationDate: {
    fontSize: 15,
    fontWeight: '800',
    color: '#1E293B',
    marginBottom: 4,
  },
  applicationReason: {
    fontSize: 12,
    color: '#64748B',
    fontWeight: '500',
  },
  leaveCardRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  statusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 8,
  },
  statusText: {
    fontSize: 10,
    fontWeight: '800',
    textTransform: 'uppercase',
  },
  chevronWrapper: {
    width: 24,
    height: 24,
    borderRadius: 8,
    backgroundColor: '#F8FAFC',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },

  // --- Loader ---
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

  // --- Empty State ---
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 48,
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#F1F5F9',
  },
  emptyText: {
    color: '#64748B',
    fontSize: 13,
    fontWeight: '600',
  },

  // --- FAB ---
  fab: {
    position: 'absolute',
    right: 20,
    bottom: 30,
    borderRadius: 20,
    shadowColor: '#6366f1',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.35,
    shadowRadius: 12,
    elevation: 8,
    overflow: 'hidden',
  },
  fabGradient: {
    width: 52,
    height: 52,
    justifyContent: 'center',
    alignItems: 'center',
  },
});