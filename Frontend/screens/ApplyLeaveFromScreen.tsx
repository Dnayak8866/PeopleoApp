import { Colors } from '@/constants/Colors';
import { applyLeaveFormScreenStyles } from '@/styles/applyLeaveFormScreenStyles';
import { router } from 'expo-router';
import { Banknote, Bell, BriefcaseBusiness, CalendarDays, ChevronDown, ChevronLeft, HeartPulse, Moon, Sun } from 'lucide-react-native';
import { useState } from 'react';
import { Modal, ScrollView, Text, TextInput, TouchableOpacity, View, Alert, ActivityIndicator } from 'react-native';
import { Calendar } from 'react-native-calendars';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuth } from '@/context/AuthContext';
import { useMasterDataContext } from '@/context/MasterDataContext';
import { applyLeave, getLeaveBalances } from '@/services/api/leaves';
import { useEffect } from 'react';


export default function ApplyLeaveFormScreen() {
    const [startDate, setStartDate] = useState(new Date());
    const [endDate, setEndDate] = useState(new Date());
    const [showCalendar, setShowCalendar] = useState(false);
    const [selectingDate, setSelectingDate] = useState<'start' | 'end'>('start');
    const [leaveType, setLeaveType] = useState('Casual Leave');
    const [showLeaveTypeDropdown, setShowLeaveTypeDropdown] = useState(false);
    const [duration, setDuration] = useState<'Full Day' | 'Half Day'>('Full Day');
    const [reason, setReason] = useState('');
    const [selectedLeaveTypeId, setSelectedLeaveTypeId] = useState<number | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [leaveBalances, setLeaveBalances] = useState<any[]>([]);
    const [isLoadingBalances, setIsLoadingBalances] = useState(true);

    const { userId, companyId } = useAuth();
    const { leaveTypes } = useMasterDataContext();
    const styles = applyLeaveFormScreenStyles();

    useEffect(() => {
        if (userId && companyId) {
            fetchBalances();
        }
    }, [userId, companyId]);

    useEffect(() => {
        if (leaveTypes.length > 0 && !selectedLeaveTypeId) {
            setLeaveType(leaveTypes[0].type_name);
            setSelectedLeaveTypeId(leaveTypes[0].leave_type_id);
        }
    }, [leaveTypes]);

    const fetchBalances = async () => {
        try {
            setIsLoadingBalances(true);
            const data = await getLeaveBalances(userId!, companyId!);
            setLeaveBalances(data);
        } catch (error) {
            console.error('Error fetching balances:', error);
        } finally {
            setIsLoadingBalances(false);
        }
    };

    const formatDate = (date: Date) => {
        return date.toISOString().split('T')[0];
    };

    const handleDateSelect = (day: any) => {
        const selectedDate = new Date(day.timestamp);
        if (selectingDate === 'start') {
            setStartDate(selectedDate);
            if (selectedDate > endDate) {
                setEndDate(selectedDate);
            }
        } else {
            if (selectedDate >= startDate) {
                setEndDate(selectedDate);
            }
        }
        setShowCalendar(false);
    };

    const handleSubmit = async () => {
        if (!userId) {
            Alert.alert('Error', 'User not authenticated');
            return;
        }

        if (!selectedLeaveTypeId) {
            Alert.alert('Error', 'Please select a leave type');
            return;
        }

        if (!reason.trim()) {
            Alert.alert('Error', 'Please enter a reason for leave');
            return;
        }

        try {
            setIsSubmitting(true);
            const leaveData = {
                employee_id: userId,
                leave_type_id: selectedLeaveTypeId,
                from_date: formatDate(startDate),
                to_date: formatDate(endDate),
                reason: reason,
                duration: duration,
            };

            await applyLeave(leaveData);
            Alert.alert('Success', 'Leave application submitted successfully', [
                { text: 'OK', onPress: () => router.push('/(employee)/leave') }
            ]);
        } catch (error: any) {
            console.error('Failed to submit leave:', error);
            const errorMessage = error.response?.data?.message || 'Failed to submit leave application. Please try again.';
            Alert.alert('Error', errorMessage);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity
                    style={styles.backButton}
                    onPress={() => router.push('/(employee)/leave')}
                >
                    <ChevronLeft size={24} color="#374151" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Apply for Leave</Text>
                <View style={styles.headerRight}>
                    <TouchableOpacity
                        style={styles.notificationButton}
                        onPress={() => router.push('/notifications')}
                    >
                        <Bell size={24} color="#374151" />
                    </TouchableOpacity>
                    <View style={styles.profileAvatar}>
                        <Text style={styles.profileInitial}>J</Text>
                    </View>
                </View>
            </View>

            <ScrollView
                style={styles.scrollView}
                showsVerticalScrollIndicator={false}
                onScrollBeginDrag={() => setShowLeaveTypeDropdown(false)}>
                <View style={styles.content}>
                    <Text style={styles.sectionTitle}>Your Leave Balance</Text>

                    <View style={styles.balanceContainer}>
                        {isLoadingBalances ? (
                            <ActivityIndicator size="small" color={Colors.primary} />
                        ) : leaveBalances.length === 0 ? (
                            <Text style={{ color: '#6b7280', textAlign: 'center', width: '100%', padding: 10 }}>No leave types found</Text>
                        ) : (
                            leaveBalances.map((balance) => {
                                const isSick = balance.type_name.toLowerCase().includes('sick');
                                const isEarned = balance.type_name.toLowerCase().includes('earned');

                                let icon = <BriefcaseBusiness size={24} color="#3b82f6" />;
                                let iconBg = '#0056B31A';
                                let numColor = '#3b82f6';

                                if (isSick) {
                                    icon = <HeartPulse size={24} color="#0056B3FF" />;
                                    iconBg = '#22C55E1A';
                                    numColor = '#16A34AFF';
                                } else if (isEarned) {
                                    icon = <Banknote size={24} color="#3b82f6" />;
                                    iconBg = '#F973161A';
                                    numColor = '#ef4444';
                                }

                                return (
                                    <View key={balance.leave_type_id} style={styles.balanceCard}>
                                        <View style={styles.balanceInfo}>
                                            <View style={[styles.balanceIcon, { backgroundColor: iconBg }]}>
                                                {icon}
                                            </View>
                                            <Text style={styles.balanceLabel}>{balance.type_name}</Text>
                                        </View>
                                        <View style={styles.balanceValue}>
                                            <Text style={[styles.balanceNumber, { color: numColor }]}>{balance.remaining}</Text>
                                            <Text style={styles.balanceDays}>days</Text>
                                        </View>
                                    </View>
                                );
                            })
                        )}
                    </View>

                    <Text style={styles.sectionTitle}>Apply for Leave</Text>

                    <View style={styles.formContainer}>
                        <View style={styles.inputGroup}>
                            <Text style={styles.inputLabel}>Start Date</Text>
                            <TouchableOpacity
                                style={styles.dateInput}
                                onPress={() => {
                                    setSelectingDate('start');
                                    setShowCalendar(true);
                                }}
                            >
                                <CalendarDays size={20} color="#9ca3af" />
                                <Text style={styles.dateInputText}>
                                    {startDate.toLocaleDateString()}
                                </Text>
                            </TouchableOpacity>
                        </View>

                        <View style={styles.inputGroup}>
                            <Text style={styles.inputLabel}>End Date</Text>
                            <TouchableOpacity
                                style={styles.dateInput}
                                onPress={() => {
                                    setSelectingDate('end');
                                    setShowCalendar(true);
                                }}
                            >
                                <CalendarDays size={20} color="#9ca3af" />
                                <Text style={styles.dateInputText}>
                                    {endDate.toLocaleDateString()}
                                </Text>
                            </TouchableOpacity>
                        </View>

                        <Modal
                            visible={showCalendar}
                            transparent={true}
                            animationType="fade"
                            onRequestClose={() => setShowCalendar(false)}
                        >
                            <TouchableOpacity
                                style={styles.modalOverlay}
                                activeOpacity={1}
                                onPress={() => setShowCalendar(false)}
                            >
                                <View style={styles.calendarContainer}>
                                    <Calendar
                                        current={selectingDate === 'start' ? formatDate(startDate) : formatDate(endDate)}
                                        minDate={selectingDate === 'end' ? formatDate(startDate) : formatDate(new Date())}
                                        onDayPress={handleDateSelect}
                                        markedDates={{
                                            [formatDate(startDate)]: {
                                                startingDay: true,
                                                color: Colors.primary,
                                                textColor: 'white'
                                            },
                                            [formatDate(endDate)]: {
                                                endingDay: true,
                                                color: Colors.primary,
                                                textColor: 'white'
                                            }
                                        }}
                                        theme={{
                                            todayTextColor: '#3b82f6',
                                            selectedDayBackgroundColor: '#3b82f6',
                                            selectedDayTextColor: '#ffffff',
                                        }}
                                    />
                                </View>
                            </TouchableOpacity>
                        </Modal>
                    </View>

                    <View style={styles.inputGroup}>
                        <Text style={styles.inputLabel}>Leave Type</Text>
                        <TouchableOpacity
                            style={styles.dropdown}
                            onPress={() => setShowLeaveTypeDropdown(!showLeaveTypeDropdown)}
                        >
                            <Text style={styles.dropdownText}>{leaveType}</Text>
                            <ChevronDown size={20} color="#9ca3af" />
                        </TouchableOpacity>
                        {showLeaveTypeDropdown && (
                            <View style={{
                                position: 'absolute',
                                top: '100%',
                                left: 0,
                                right: 0,
                                backgroundColor: 'white',
                                borderRadius: 8,
                                shadowColor: '#000',
                                shadowOffset: {
                                    width: 0,
                                    height: 2,
                                },
                                shadowOpacity: 0.25,
                                shadowRadius: 3.84,
                                elevation: 5,
                                zIndex: 1000,
                            }}>
                                {leaveTypes.map((type) => (
                                    <TouchableOpacity
                                        key={type.leave_type_id}
                                        style={{
                                            padding: 15,
                                            borderBottomWidth: type !== leaveTypes[leaveTypes.length - 1] ? 1 : 0,
                                            borderBottomColor: '#e5e7eb',
                                        }}
                                        onPress={() => {
                                            setLeaveType(type.type_name);
                                            setSelectedLeaveTypeId(type.leave_type_id);
                                            setShowLeaveTypeDropdown(false);
                                        }}
                                    >
                                        <Text style={{
                                            color: '#374151',
                                            fontSize: 16,
                                        }}>
                                            {type.type_name}
                                        </Text>
                                    </TouchableOpacity>
                                ))}
                            </View>
                        )}
                    </View>

                    <View style={styles.inputGroup}>
                        <Text style={styles.inputLabel}>Duration</Text>
                        <View style={styles.durationContainer}>
                            <TouchableOpacity
                                style={[
                                    styles.durationButton,
                                    duration === 'Full Day' && styles.durationButtonActive,
                                ]}
                                onPress={() => setDuration('Full Day')}
                            >
                                <Sun size={20} color={duration === 'Full Day' ? '#ffffff' : '#6b7280'} />
                                <Text style={[
                                    styles.durationButtonText,
                                    duration === 'Full Day' && styles.durationButtonTextActive,
                                ]}>
                                    Full Day
                                </Text>
                            </TouchableOpacity>

                            <TouchableOpacity
                                style={[
                                    styles.durationButton,
                                    duration === 'Half Day' && styles.durationButtonActive,
                                ]}
                                onPress={() => setDuration('Half Day')}
                            >
                                <Moon size={20} color={duration === 'Half Day' ? '#ffffff' : '#6b7280'} />
                                <Text style={[
                                    styles.durationButtonText,
                                    duration === 'Half Day' && styles.durationButtonTextActive,
                                ]}>
                                    Half Day
                                </Text>
                            </TouchableOpacity>
                        </View>
                    </View>

                    <View style={styles.inputGroup}>
                        <Text style={styles.inputLabel}>Reason for Leave</Text>
                        <TextInput
                            style={styles.textArea}
                            placeholder="Enter your reason for leave..."
                            placeholderTextColor="#9ca3af"
                            value={reason}
                            onChangeText={setReason}
                            multiline
                            numberOfLines={4}
                            textAlignVertical="top"
                        />
                    </View>

                    <TouchableOpacity
                        style={[styles.submitButton, isSubmitting && { opacity: 0.7 }]}
                        onPress={handleSubmit}
                        disabled={isSubmitting}
                    >
                        {isSubmitting ? (
                            <ActivityIndicator color="white" />
                        ) : (
                            <Text style={styles.submitButtonText}>Submit Leave Application</Text>
                        )}
                    </TouchableOpacity>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}