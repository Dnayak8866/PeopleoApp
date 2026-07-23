import { Avatar } from '@/components/Avatar';
import { Colors } from '@/constants/Colors';
import { useAuth } from '@/context/AuthContext';
import { showSuccessToast, showErrorToast } from '@/services/toast';
import { approveLeave, getPendingLeaves, PendingLeave, rejectLeave } from '@/services/api/leaves';
import { router } from 'expo-router';
import { ArrowLeft, CheckCircle, ClipboardList, XCircle, CalendarDays, Clock, FileText, ChevronLeft } from 'lucide-react-native';
import React, { useEffect, useState, useRef } from 'react';
import {
  ActivityIndicator,
  Alert,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
  StyleSheet,
  Dimensions,
  Platform,
  Animated,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import ApprovalIllustration from '@/components/illustrations/ApprovalIllustration';
import { LinearGradient } from 'expo-linear-gradient';
import { StatusBar } from 'expo-status-bar';

const { width } = Dimensions.get('window');

const statusColors: Record<string, { bg: string; text: string }> = {
  Pending: { bg: '#FFFBEB', text: '#D97706' },
  Approved: { bg: '#ECFDF5', text: '#10B981' },
  Rejected: { bg: '#FEF2F2', text: '#EF4444' },
};

const formatDate = (dateStr: string) => {
  if (!dateStr) return '--';
  return new Date(dateStr).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
};

const daysBetween = (from: string, to: string) => {
  const diff = new Date(to).getTime() - new Date(from).getTime();
  return Math.ceil(diff / (1000 * 60 * 60 * 24)) + 1;
};

export default function LeaveApprovalsScreen() {
  const { userDetails } = useAuth();
  const [leaves, setLeaves] = useState<PendingLeave[]>([]);
  const [loading, setLoading] = useState(false);
  const [actionLoading, setActionLoading] = useState<Record<number, 'approve' | 'reject' | null>>({});

  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(15)).current;

  const fetchPendingLeaves = async () => {
    if (!userDetails?.companyId) return;
    setLoading(true);
    try {
      const data = await getPendingLeaves(userDetails.companyId);
      setLeaves(data);
    } catch (err) {
      console.error('Failed to load pending leaves:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPendingLeaves();
  }, [userDetails?.companyId]);

  useEffect(() => {
    if (!loading) {
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
  }, [loading, leaves]);

  const handleApprove = async (leaveId: number) => {
    if (!userDetails?.id) return;
    Alert.alert(
      'Approve Leave',
      'Are you sure you want to approve this leave request?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Approve',
          style: 'default',
          onPress: async () => {
            setActionLoading(prev => ({ ...prev, [leaveId]: 'approve' }));
            try {
              await approveLeave(leaveId, userDetails.id);
              setLeaves(prev => prev.filter(l => l.leave_id !== leaveId));
              showSuccessToast('Approved', 'Leave request approved successfully.');
            } catch (err) {
              showErrorToast('Error', 'Failed to approve leave. Please try again.');
            } finally {
              setActionLoading(prev => ({ ...prev, [leaveId]: null }));
            }
          },
        },
      ]
    );
  };

  const handleReject = async (leaveId: number) => {
    Alert.alert(
      'Reject Leave',
      'Are you sure you want to reject this leave request?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Reject',
          style: 'destructive',
          onPress: async () => {
            setActionLoading(prev => ({ ...prev, [leaveId]: 'reject' }));
            try {
              await rejectLeave(leaveId);
              setLeaves(prev => prev.filter(l => l.leave_id !== leaveId));
              showSuccessToast('Rejected', 'Leave request rejected.');
            } catch (err) {
              showErrorToast('Error', 'Failed to reject leave. Please try again.');
            } finally {
              setActionLoading(prev => ({ ...prev, [leaveId]: null }));
            }
          },
        },
      ]
    );
  };

  const renderLeaveCard = (leave: PendingLeave) => {
    const isActing = actionLoading[leave.leave_id] != null;
    const countDays = daysBetween(leave.from_date, leave.to_date);

    return (
      <View key={leave.leave_id} style={styles.leaveCard}>
        {/* Employee Row */}
        <View style={styles.employeeRow}>
          <Avatar fullName={leave.employee_name} size={44} />
          <View style={styles.employeeInfo}>
            <Text style={styles.employeeName} numberOfLines={1}>
              {leave.employee_name}
            </Text>
            <Text style={styles.appliedTime}>
              Applied {leave.applied_at ? formatDate(leave.applied_at) : '--'}
            </Text>
          </View>
          <View style={[styles.statusBadge, { backgroundColor: statusColors[leave.status]?.bg ?? '#F1F5F9' }]}>
            <Text style={[styles.statusText, { color: statusColors[leave.status]?.text ?? '#64748B' }]}>
              {leave.status}
            </Text>
          </View>
        </View>

        {/* Leave Details Box */}
        <View style={styles.detailsBox}>
          <View style={styles.detailsRow}>
            <View style={styles.detailCell}>
              <Text style={styles.detailLabel}>Leave Type</Text>
              <Text style={styles.detailValue}>{leave.leave_type}</Text>
            </View>
            <View style={styles.detailCell}>
              <Text style={styles.detailLabel}>Duration</Text>
              <Text style={styles.detailValue}>
                {countDays} day{countDays > 1 ? 's' : ''}
              </Text>
            </View>
          </View>
          <View style={styles.detailsRow}>
            <View style={styles.detailCell}>
              <Text style={styles.detailLabel}>From Date</Text>
              <Text style={styles.detailValue}>{formatDate(leave.from_date)}</Text>
            </View>
            <View style={styles.detailCell}>
              <Text style={styles.detailLabel}>To Date</Text>
              <Text style={styles.detailValue}>{formatDate(leave.to_date)}</Text>
            </View>
          </View>
          {leave.reason ? (
            <View style={styles.reasonWrapper}>
              <Text style={styles.detailLabel}>Reason</Text>
              <Text style={styles.reasonText}>{leave.reason}</Text>
            </View>
          ) : null}
        </View>

        {/* Action Buttons */}
        {isActing ? (
          <View style={styles.actionLoader}>
            <ActivityIndicator size="small" color="#6366f1" />
          </View>
        ) : (
          <View style={styles.buttonsRow}>
            <TouchableOpacity
              style={styles.rejectBtn}
              onPress={() => handleReject(leave.leave_id)}
              activeOpacity={0.7}
            >
              <XCircle size={15} color="#EF4444" />
              <Text style={styles.rejectBtnText}>Reject</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.approveBtn}
              onPress={() => handleApprove(leave.leave_id)}
              activeOpacity={0.85}
            >
              <LinearGradient
                colors={['#10B981', '#059669']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.approveGradient}
              >
                <CheckCircle size={15} color="#FFFFFF" />
                <Text style={styles.approveBtnText}>Approve</Text>
              </LinearGradient>
            </TouchableOpacity>
          </View>
        )}
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.safeContainer}>
      <StatusBar style="dark" />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => router.back()}
          style={styles.backButton}
          hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
        >
          <ChevronLeft size={22} color="#1E293B" />
        </TouchableOpacity>
        <View style={styles.headerTitleContainer}>
          <Text style={styles.headerTitle}>Leave Approvals</Text>
        </View>
        {leaves.length > 0 && (
          <View style={styles.countBadge}>
            <Text style={styles.countBadgeText}>{leaves.length} Pending</Text>
          </View>
        )}
      </View>

      {/* Content */}
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Welcome Card & Illustration */}
        <View style={styles.welcomeCard}>
          <LinearGradient
            colors={['#EEF2FF', '#F5F3FF']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.welcomeGradient}
          >
            <View style={styles.welcomeTextContainer}>
              <Text style={styles.welcomeQuote}>Manager Dashboard</Text>
              <Text style={styles.ownerName}>Review Form</Text>
              <Text style={styles.welcomeDesc}>
                Approve or reject leave applications submitted by employees within your workspace.
              </Text>
            </View>
            <View style={styles.illustrationWrapper}>
              <ApprovalIllustration width={110} height={90} />
            </View>
          </LinearGradient>
        </View>

        {loading ? (
          <View style={styles.loaderWrapper}>
            <ActivityIndicator size="large" color="#6366f1" />
            <Text style={styles.loaderText}>Syncing requests...</Text>
          </View>
        ) : leaves.length === 0 ? (
          <View style={styles.emptyState}>
            <ClipboardList size={48} color="#94A3B8" style={{ marginBottom: 16 }} />
            <Text style={styles.emptyTitle}>No Pending Requests</Text>
            <Text style={styles.emptyDesc}>
              All employee leave applications have been reviewed. Check back later.
            </Text>
          </View>
        ) : (
          <Animated.View style={{ opacity: fadeAnim, transform: [{ translateY: slideAnim }] }}>
            {leaves.map(renderLeaveCard)}
          </Animated.View>
        )}
      </ScrollView>
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
    paddingTop: 16,
    paddingBottom: 40,
  },

  // --- Header ---
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: Platform.OS === 'ios' ? 4 : 10,
    paddingBottom: 12,
  },
  backButton: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: '#F1F5F9',
  },
  headerTitleContainer: {
    flex: 1,
    marginLeft: 14,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: '#1E1B4B',
  },
  countBadge: {
    backgroundColor: '#EEF2FF',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 8,
  },
  countBadgeText: {
    fontSize: 11,
    fontWeight: '800',
    color: '#6366f1',
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
    paddingRight: 8,
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
  },
  illustrationWrapper: {
    flex: 0.8,
    alignItems: 'center',
    justifyContent: 'center',
  },

  // --- Leave Card ---
  leaveCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 22,
    padding: 16,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: '#F1F5F9',
    shadowColor: '#6366f1',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.03,
    shadowRadius: 10,
    elevation: 3,
  },
  employeeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 14,
  },
  employeeInfo: {
    flex: 1,
    marginLeft: 12,
  },
  employeeName: {
    fontSize: 15,
    fontWeight: '800',
    color: '#1E293B',
  },
  appliedTime: {
    fontSize: 11,
    color: '#94A3B8',
    fontWeight: '600',
    marginTop: 2,
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  statusText: {
    fontSize: 10,
    fontWeight: '800',
    textTransform: 'uppercase',
  },

  // --- Details Grid ---
  detailsBox: {
    backgroundColor: '#F8FAFC',
    borderRadius: 14,
    padding: 12,
    marginBottom: 14,
    gap: 8,
    borderWidth: 1,
    borderColor: '#F1F5F9',
  },
  detailsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  detailCell: {
    flex: 1,
  },
  detailLabel: {
    fontSize: 9,
    color: '#94A3B8',
    fontWeight: '700',
    textTransform: 'uppercase',
    marginBottom: 2,
  },
  detailValue: {
    fontSize: 13,
    fontWeight: '700',
    color: '#334155',
  },
  reasonWrapper: {
    marginTop: 4,
    borderTopWidth: 1,
    borderTopColor: '#E2E8F0',
    paddingTop: 8,
  },
  reasonText: {
    fontSize: 12,
    color: '#475569',
    lineHeight: 18,
    fontWeight: '500',
  },

  // --- Actions ---
  actionLoader: {
    alignItems: 'center',
    paddingVertical: 12,
  },
  buttonsRow: {
    flexDirection: 'row',
    gap: 12,
  },
  rejectBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    height: 44,
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: '#EF4444',
    backgroundColor: '#FFFFFF',
  },
  rejectBtnText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#EF4444',
  },
  approveBtn: {
    flex: 1,
    borderRadius: 12,
    overflow: 'hidden',
  },
  approveGradient: {
    height: 44,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
  },
  approveBtnText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#FFFFFF',
  },

  // --- Loader ---
  loaderWrapper: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 80,
    gap: 8,
  },
  loaderText: {
    fontSize: 13,
    color: '#64748B',
    fontWeight: '500',
  },

  // --- Empty State ---
  emptyState: {
    flex: 0.8,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 40,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#1E1B4B',
    marginTop: 16,
  },
  emptyDesc: {
    fontSize: 13,
    color: '#64748B',
    marginTop: 8,
    textAlign: 'center',
    lineHeight: 20,
    fontWeight: '500',
  },
});
