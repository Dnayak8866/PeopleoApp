import { Avatar } from '@/components/Avatar';
import { Colors } from '@/constants/Colors';
import { useAuth } from '@/context/AuthContext';
import { approveLeave, getPendingLeaves, PendingLeave, rejectLeave } from '@/services/api/leaves';
import { router } from 'expo-router';
import { ArrowLeft, CheckCircle, ClipboardList, XCircle } from 'lucide-react-native';
import React, { useEffect, useState } from 'react';
import {
    ActivityIndicator,
    Alert,
    SafeAreaView,
    ScrollView,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';

const statusColors: Record<string, { bg: string; text: string }> = {
    Pending: { bg: '#FFF7EDFF', text: '#D97706' },
    Approved: { bg: '#E6F8EDFF', text: '#10B981' },
    Rejected: { bg: '#FEF4F4FF', text: '#EF4444' },
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
                        } catch (err) {
                            Alert.alert('Error', 'Failed to approve leave. Please try again.');
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
                        } catch (err) {
                            Alert.alert('Error', 'Failed to reject leave. Please try again.');
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
        return (
            <View
                key={leave.leave_id}
                style={{
                    backgroundColor: '#FFFFFF',
                    borderRadius: 16,
                    marginHorizontal: 16,
                    marginBottom: 14,
                    padding: 16,
                    shadowColor: '#000',
                    shadowOpacity: 0.06,
                    shadowRadius: 8,
                    shadowOffset: { width: 0, height: 2 },
                    elevation: 3,
                    borderWidth: 1,
                    borderColor: '#F3F4F6',
                }}
            >
                {/* Employee Row */}
                <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 12 }}>
                    <Avatar fullName={leave.employee_name} size={46} />
                    <View style={{ marginLeft: 12, flex: 1 }}>
                        <Text style={{ fontSize: 15, fontWeight: '700', color: '#111827' }}>
                            {leave.employee_name}
                        </Text>
                        <Text style={{ fontSize: 12, color: '#6B7280', marginTop: 2 }}>
                            Applied {leave.applied_at ? formatDate(leave.applied_at) : '--'}
                        </Text>
                    </View>
                    <View style={{
                        paddingHorizontal: 10,
                        paddingVertical: 4,
                        borderRadius: 20,
                        backgroundColor: statusColors[leave.status]?.bg ?? '#F3F4F6',
                    }}>
                        <Text style={{ fontSize: 12, fontWeight: '600', color: statusColors[leave.status]?.text ?? '#374151' }}>
                            {leave.status}
                        </Text>
                    </View>
                </View>

                {/* Leave Details grid */}
                <View style={{
                    backgroundColor: '#F9FAFB',
                    borderRadius: 10,
                    padding: 12,
                    marginBottom: 12,
                    gap: 6,
                }}>
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                        <View style={{ flex: 1 }}>
                            <Text style={{ fontSize: 11, color: '#9CA3AF', marginBottom: 2 }}>LEAVE TYPE</Text>
                            <Text style={{ fontSize: 13, fontWeight: '600', color: '#374151' }}>{leave.leave_type}</Text>
                        </View>
                        <View style={{ flex: 1 }}>
                            <Text style={{ fontSize: 11, color: '#9CA3AF', marginBottom: 2 }}>DURATION</Text>
                            <Text style={{ fontSize: 13, fontWeight: '600', color: '#374151' }}>
                                {daysBetween(leave.from_date, leave.to_date)} day{daysBetween(leave.from_date, leave.to_date) > 1 ? 's' : ''}
                            </Text>
                        </View>
                    </View>
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 4 }}>
                        <View style={{ flex: 1 }}>
                            <Text style={{ fontSize: 11, color: '#9CA3AF', marginBottom: 2 }}>FROM</Text>
                            <Text style={{ fontSize: 13, fontWeight: '600', color: '#374151' }}>{formatDate(leave.from_date)}</Text>
                        </View>
                        <View style={{ flex: 1 }}>
                            <Text style={{ fontSize: 11, color: '#9CA3AF', marginBottom: 2 }}>TO</Text>
                            <Text style={{ fontSize: 13, fontWeight: '600', color: '#374151' }}>{formatDate(leave.to_date)}</Text>
                        </View>
                    </View>
                    {leave.reason ? (
                        <View style={{ marginTop: 4 }}>
                            <Text style={{ fontSize: 11, color: '#9CA3AF', marginBottom: 2 }}>REASON</Text>
                            <Text style={{ fontSize: 13, color: '#374151', lineHeight: 18 }}>{leave.reason}</Text>
                        </View>
                    ) : null}
                </View>

                {/* Action Buttons */}
                {isActing ? (
                    <View style={{ alignItems: 'center', paddingVertical: 8 }}>
                        <ActivityIndicator size="small" color={Colors.primary} />
                    </View>
                ) : (
                    <View style={{ flexDirection: 'row', gap: 10 }}>
                        <TouchableOpacity
                            style={{
                                flex: 1,
                                flexDirection: 'row',
                                alignItems: 'center',
                                justifyContent: 'center',
                                gap: 6,
                                paddingVertical: 10,
                                borderRadius: 10,
                                borderWidth: 1.5,
                                borderColor: '#EF4444',
                                backgroundColor: '#FEF4F4',
                            }}
                            onPress={() => handleReject(leave.leave_id)}
                        >
                            <XCircle size={16} color="#EF4444" />
                            <Text style={{ fontSize: 14, fontWeight: '600', color: '#EF4444' }}>Reject</Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={{
                                flex: 1,
                                flexDirection: 'row',
                                alignItems: 'center',
                                justifyContent: 'center',
                                gap: 6,
                                paddingVertical: 10,
                                borderRadius: 10,
                                backgroundColor: '#10B981',
                            }}
                            onPress={() => handleApprove(leave.leave_id)}
                        >
                            <CheckCircle size={16} color="#FFFFFF" />
                            <Text style={{ fontSize: 14, fontWeight: '600', color: '#FFFFFF' }}>Approve</Text>
                        </TouchableOpacity>
                    </View>
                )}
            </View>
        );
    };

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: '#F9FAFB' }}>
            {/* Header */}
            <View style={{
                flexDirection: 'row',
                alignItems: 'center',
                paddingHorizontal: 16,
                paddingVertical: 14,
                backgroundColor: '#FFFFFF',
                borderBottomWidth: 1,
                borderBottomColor: '#F3F4F6',
            }}>
                <TouchableOpacity
                    onPress={() => router.back()}
                    style={{ marginRight: 12, padding: 4 }}
                >
                    <ArrowLeft size={22} color="#374151" />
                </TouchableOpacity>
                <Text style={{ fontSize: 18, fontWeight: '700', color: '#111827', flex: 1 }}>
                    Leave Approvals
                </Text>
                {leaves.length > 0 && (
                    <View style={{
                        backgroundColor: Colors.primary + '20',
                        paddingHorizontal: 10,
                        paddingVertical: 4,
                        borderRadius: 20,
                    }}>
                        <Text style={{ fontSize: 12, fontWeight: '600', color: Colors.primary }}>
                            {leaves.length} Pending
                        </Text>
                    </View>
                )}
            </View>

            {/* Content */}
            {loading ? (
                <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                    <ActivityIndicator size="large" color={Colors.primary} />
                    <Text style={{ marginTop: 12, color: '#6B7280', fontSize: 14 }}>
                        Loading pending leave requests...
                    </Text>
                </View>
            ) : leaves.length === 0 ? (
                <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', paddingHorizontal: 40 }}>
                    <ClipboardList size={56} color="#D1D5DB" />
                    <Text style={{ fontSize: 18, fontWeight: '600', color: '#374151', marginTop: 16, textAlign: 'center' }}>
                        No Pending Requests
                    </Text>
                    <Text style={{ fontSize: 14, color: '#9CA3AF', marginTop: 8, textAlign: 'center', lineHeight: 20 }}>
                        All leave applications have been reviewed. Check back later.
                    </Text>
                </View>
            ) : (
                <ScrollView
                    style={{ flex: 1 }}
                    contentContainerStyle={{ paddingTop: 16, paddingBottom: 30 }}
                    showsVerticalScrollIndicator={false}
                >
                    {leaves.map(renderLeaveCard)}
                </ScrollView>
            )}
        </SafeAreaView>
    );
}
