import { Colors } from '@/constants/Colors';
import { router } from 'expo-router';
import {
  Banknote,
  Bell,
  BriefcaseBusiness,
  CalendarDays,
  ChevronDown,
  ChevronLeft,
  HeartPulse,
  Moon,
  Sun,
} from 'lucide-react-native';
import React, { useState, useEffect, useRef } from 'react';
import {
  Modal,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  Alert,
  ActivityIndicator,
  StyleSheet,
  Dimensions,
  Platform,
  Animated,
} from 'react-native';
import { Calendar } from 'react-native-calendars';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuth } from '@/context/AuthContext';
import { useMasterDataContext } from '@/context/MasterDataContext';
import { showSuccessToast, showErrorToast } from '@/services/toast';
import ApplyLeaveIllustration from '@/components/illustrations/ApplyLeaveIllustration';
import { applyLeave, getLeaveBalances } from '@/services/api/leaves';
import { LinearGradient } from 'expo-linear-gradient';
import { StatusBar } from 'expo-status-bar';
import { useTheme } from '@/context/ThemeContext';

const { width } = Dimensions.get('window');

export default function ApplyLeaveFormScreen() {
  const { isDarkMode, colors } = useTheme();
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

  const { userId, companyId, userDetails } = useAuth();
  const { leaveTypes } = useMasterDataContext();

  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(15)).current;

  const profileInitial = userDetails?.fullName?.charAt(0)?.toUpperCase() ?? 'U';

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

  useEffect(() => {
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
  }, [leaveBalances]);

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
      showErrorToast('Error', 'User not authenticated');
      return;
    }

    if (!selectedLeaveTypeId) {
      showErrorToast('Error', 'Please select a leave type');
      return;
    }

    if (!reason.trim()) {
      showErrorToast('Error', 'Please enter a reason for leave');
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
      showSuccessToast('Success', 'Leave application submitted successfully');
      router.push('/(employee)/leave');
    } catch (error: any) {
      console.error('Failed to submit leave:', error);
      const errorMessage = error.response?.data?.message || 'Failed to submit leave application. Please try again.';
      showErrorToast('Error', errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <SafeAreaView style={[styles.safeContainer, { backgroundColor: colors.background }]}>
      <StatusBar style={isDarkMode ? 'light' : 'dark'} />

      {/* Header */}
      <View style={[styles.header, { backgroundColor: colors.background }]}>
        <TouchableOpacity
          style={[styles.backButton, { backgroundColor: colors.card, borderColor: colors.border }]}
          onPress={() => router.push('/(employee)/leave')}
          hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
        >
          <ChevronLeft size={22} color={colors.textPrimary} />
        </TouchableOpacity>
        <View style={styles.headerTitleContainer}>
          <Text style={[styles.headerTitle, { color: colors.textPrimary }]}>Apply Leave</Text>
        </View>
        <View style={styles.headerActions}>
          <TouchableOpacity
            style={[styles.bellButton, { backgroundColor: colors.card, borderColor: colors.border }]}
            onPress={() => router.push('/notifications')}
          >
            <Bell size={22} color={colors.textPrimary} />
            <View style={styles.bellBadge} />
          </TouchableOpacity>
          <View style={[styles.profileAvatar, { backgroundColor: colors.primary }]}>
            <Text style={styles.profileInitial}>{profileInitial}</Text>
          </View>
        </View>
      </View>

      <ScrollView
        style={styles.container}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
        onScrollBeginDrag={() => setShowLeaveTypeDropdown(false)}
      >
        {/* Welcome Card & Illustration */}
        <View style={[styles.welcomeCard, { borderColor: isDarkMode ? 'rgba(129, 140, 248, 0.2)' : 'rgba(99, 102, 241, 0.08)' }]}>
          <LinearGradient
            colors={isDarkMode ? ['#151D30', '#1E1B4B'] : ['#EEF2FF', '#F5F3FF']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.welcomeGradient}
          >
            <View style={styles.welcomeTextContainer}>
              <Text style={[styles.welcomeQuote, { color: colors.primary }]}>Leave Request</Text>
              <Text style={[styles.ownerName, { color: colors.textPrimary }]}>Apply Form</Text>
              <Text style={[styles.welcomeDesc, { color: colors.textSecondary }]}>
                Complete the details below to submit your time-off request for manager review.
              </Text>
            </View>
            <View style={styles.illustrationWrapper}>
              <ApplyLeaveIllustration width={110} height={90} />
            </View>
          </LinearGradient>
        </View>

        {/* Balance Section */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.textPrimary }]}>Leave Balance</Text>
          
          <View style={styles.balanceContainer}>
            {isLoadingBalances ? (
              <View style={styles.balanceLoader}>
                <ActivityIndicator size="small" color={colors.primary} />
                <Text style={[styles.balanceLoaderText, { color: colors.textSecondary }]}>Fetching stats...</Text>
              </View>
            ) : leaveBalances.length === 0 ? (
              <View style={[styles.emptyBalancesCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
                <Text style={[styles.emptyBalancesText, { color: colors.textSecondary }]}>No leave types found.</Text>
              </View>
            ) : (
              <Animated.View style={[styles.balanceGrid, { opacity: fadeAnim, transform: [{ translateY: slideAnim }] }]}>
                {leaveBalances.map((balance) => {
                  const isSick = balance.type_name.toLowerCase().includes('sick');
                  const isEarned = balance.type_name.toLowerCase().includes('earned');

                  let icon = <BriefcaseBusiness size={18} color={colors.primary} />;
                  let iconBg = isDarkMode ? '#1E1B4B' : '#EEF2FF';
                  let numColor = colors.primary;

                  if (isSick) {
                    icon = <HeartPulse size={18} color="#10B981" />;
                    iconBg = isDarkMode ? '#064E3B' : '#ECFDF5';
                    numColor = '#10B981';
                  } else if (isEarned) {
                    icon = <Banknote size={18} color="#EF4444" />;
                    iconBg = isDarkMode ? '#7F1D1D' : '#FEF2F2';
                    numColor = '#EF4444';
                  }

                  return (
                    <View key={balance.leave_type_id} style={[styles.balanceCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
                      <View style={styles.balanceHeader}>
                        <View style={[styles.balanceIcon, { backgroundColor: iconBg }]}>
                          {icon}
                        </View>
                        <Text style={[styles.balanceLabel, { color: colors.textSecondary }]} numberOfLines={1}>
                          {balance.type_name}
                        </Text>
                      </View>
                      <View style={styles.balanceValueRow}>
                        <Text style={[styles.balanceNumber, { color: numColor }]}>
                          {balance.remaining}
                        </Text>
                        <Text style={[styles.balanceDays, { color: colors.textMuted }]}>days remaining</Text>
                      </View>
                    </View>
                  );
                })}
              </Animated.View>
            )}
          </View>
        </View>

        {/* Form Section */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.textPrimary }]}>Application Details</Text>

          <View style={[styles.formCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
            {/* Dates Selectors */}
            <View style={styles.datesRow}>
              <View style={styles.dateField}>
                <Text style={[styles.inputLabel, { color: colors.textPrimary }]}>Start Date</Text>
                <TouchableOpacity
                  style={[styles.dateInput, { backgroundColor: isDarkMode ? '#1E293B' : '#F8FAFC', borderColor: colors.border }]}
                  onPress={() => {
                    setSelectingDate('start');
                    setShowCalendar(true);
                  }}
                  activeOpacity={0.75}
                >
                  <CalendarDays size={16} color={colors.textMuted} />
                  <Text style={[styles.dateInputText, { color: colors.textPrimary }]}>
                    {startDate.toLocaleDateString()}
                  </Text>
                </TouchableOpacity>
              </View>

              <View style={styles.dateField}>
                <Text style={[styles.inputLabel, { color: colors.textPrimary }]}>End Date</Text>
                <TouchableOpacity
                  style={[styles.dateInput, { backgroundColor: isDarkMode ? '#1E293B' : '#F8FAFC', borderColor: colors.border }]}
                  onPress={() => {
                    setSelectingDate('end');
                    setShowCalendar(true);
                  }}
                  activeOpacity={0.75}
                >
                  <CalendarDays size={16} color={colors.textMuted} />
                  <Text style={[styles.dateInputText, { color: colors.textPrimary }]}>
                    {endDate.toLocaleDateString()}
                  </Text>
                </TouchableOpacity>
              </View>
            </View>

            {/* Leave Type Selector */}
            <View style={styles.inputGroup}>
              <Text style={[styles.inputLabel, { color: colors.textPrimary }]}>Leave Type</Text>
              <TouchableOpacity
                style={[styles.dropdown, { backgroundColor: isDarkMode ? '#1E293B' : '#F8FAFC', borderColor: colors.border }]}
                onPress={() => setShowLeaveTypeDropdown(!showLeaveTypeDropdown)}
                activeOpacity={0.8}
              >
                <Text style={[styles.dropdownText, { color: colors.textPrimary }]}>{leaveType}</Text>
                <ChevronDown size={18} color={colors.textMuted} />
              </TouchableOpacity>
              {showLeaveTypeDropdown && (
                <View style={[styles.dropdownMenu, { backgroundColor: colors.card, borderColor: colors.border }]}>
                  {leaveTypes.map((type) => (
                    <TouchableOpacity
                      key={type.leave_type_id}
                      style={styles.dropdownItem}
                      onPress={() => {
                        setLeaveType(type.type_name);
                        setSelectedLeaveTypeId(type.leave_type_id);
                        setShowLeaveTypeDropdown(false);
                      }}
                      activeOpacity={0.7}
                    >
                      <Text style={[styles.dropdownItemText, { color: colors.textPrimary }]}>{type.type_name}</Text>
                    </TouchableOpacity>
                  ))}
                </View>
              )}
            </View>

            {/* Duration Selector */}
            <View style={styles.inputGroup}>
              <Text style={[styles.inputLabel, { color: colors.textPrimary }]}>Duration</Text>
              <View style={[styles.durationContainer, { backgroundColor: isDarkMode ? '#1E293B' : '#F8FAFC', borderColor: colors.border }]}>
                <TouchableOpacity
                  style={[
                    styles.durationButton,
                    { backgroundColor: duration === 'Full Day' ? colors.primary : (isDarkMode ? '#0F172A' : '#FFFFFF') },
                    duration === 'Full Day' && styles.durationButtonActive,
                  ]}
                  onPress={() => setDuration('Full Day')}
                  activeOpacity={0.8}
                >
                  <Sun size={16} color={duration === 'Full Day' ? '#ffffff' : colors.textSecondary} />
                  <Text style={[
                    styles.durationButtonText,
                    { color: duration === 'Full Day' ? '#ffffff' : colors.textSecondary },
                  ]}>
                    Full Day
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[
                    styles.durationButton,
                    { backgroundColor: duration === 'Half Day' ? colors.primary : (isDarkMode ? '#0F172A' : '#FFFFFF') },
                    duration === 'Half Day' && styles.durationButtonActive,
                  ]}
                  onPress={() => setDuration('Half Day')}
                  activeOpacity={0.8}
                >
                  <Moon size={16} color={duration === 'Half Day' ? '#ffffff' : colors.textSecondary} />
                  <Text style={[
                    styles.durationButtonText,
                    { color: duration === 'Half Day' ? '#ffffff' : colors.textSecondary },
                  ]}>
                    Half Day
                  </Text>
                </TouchableOpacity>
              </View>
            </View>

            {/* Reason */}
            <View style={styles.inputGroup}>
              <Text style={[styles.inputLabel, { color: colors.textPrimary }]}>Reason for Leave</Text>
              <TextInput
                style={[styles.textArea, { backgroundColor: isDarkMode ? '#1E293B' : '#F8FAFC', borderColor: colors.border, color: colors.textPrimary }]}
                placeholder="Enter your reason for leave..."
                placeholderTextColor={colors.textMuted}
                value={reason}
                onChangeText={setReason}
                multiline
                numberOfLines={4}
                textAlignVertical="top"
              />
            </View>

            {/* Submit Button */}
            <TouchableOpacity
              style={[styles.submitButton, isSubmitting && { opacity: 0.7 }]}
              onPress={handleSubmit}
              disabled={isSubmitting}
              activeOpacity={0.85}
            >
              <LinearGradient
                colors={['#6366f1', '#7c3aed']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.submitButtonGradient}
              >
                {isSubmitting ? (
                  <ActivityIndicator color="white" />
                ) : (
                  <Text style={styles.submitButtonText}>Submit Application</Text>
                )}
              </LinearGradient>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>

      {/* Calendar Modal */}
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
          <View style={[styles.calendarContainer, { backgroundColor: colors.card, borderColor: colors.border }]}>
            <Calendar
              current={selectingDate === 'start' ? formatDate(startDate) : formatDate(endDate)}
              minDate={selectingDate === 'end' ? formatDate(startDate) : formatDate(new Date())}
              onDayPress={handleDateSelect}
              markedDates={{
                [formatDate(startDate)]: {
                  startingDay: true,
                  color: colors.primary,
                  textColor: 'white'
                },
                [formatDate(endDate)]: {
                  endingDay: true,
                  color: colors.primary,
                  textColor: 'white'
                }
              }}
              theme={{
                backgroundColor: colors.card,
                calendarBackground: colors.card,
                textSectionTitleColor: colors.textSecondary,
                selectedDayBackgroundColor: colors.primary,
                selectedDayTextColor: '#ffffff',
                todayTextColor: colors.primary,
                dayTextColor: colors.textPrimary,
                textDisabledColor: colors.textMuted,
                monthTextColor: colors.textPrimary,
                arrowColor: colors.primary,
              }}
            />
          </View>
        </TouchableOpacity>
      </Modal>
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
  profileAvatar: {
    width: 36,
    height: 36,
    backgroundColor: '#C7D2FE',
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  profileInitial: {
    fontSize: 14,
    fontWeight: '700',
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

  // --- Section ---
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1E1B4B',
    marginBottom: 14,
    paddingHorizontal: 2,
  },

  // --- Balance ---
  balanceContainer: {
    marginBottom: 8,
  },
  balanceLoader: {
    paddingVertical: 24,
    alignItems: 'center',
    gap: 6,
  },
  balanceLoaderText: {
    fontSize: 12,
    color: '#64748B',
    fontWeight: '500',
  },
  emptyBalancesCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 20,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#F1F5F9',
  },
  emptyBalancesText: {
    fontSize: 13,
    color: '#64748B',
    fontWeight: '500',
  },
  balanceGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  balanceCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    padding: 14,
    borderWidth: 1,
    borderColor: '#F1F5F9',
    width: (width - 52) / 2,
    shadowColor: '#6366f1',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.02,
    shadowRadius: 8,
    elevation: 2,
    gap: 12,
  },
  balanceHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  balanceIcon: {
    width: 32,
    height: 32,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  balanceLabel: {
    flex: 1,
    fontSize: 11,
    color: '#64748B',
    fontWeight: '700',
  },
  balanceValueRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: 4,
  },
  balanceNumber: {
    fontSize: 24,
    fontWeight: '800',
  },
  balanceDays: {
    fontSize: 11,
    color: '#64748B',
    fontWeight: '500',
  },

  // --- Form ---
  formCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 22,
    padding: 20,
    borderWidth: 1,
    borderColor: '#F1F5F9',
    shadowColor: '#6366f1',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.04,
    shadowRadius: 16,
    elevation: 3,
    gap: 18,
  },
  datesRow: {
    flexDirection: 'row',
    gap: 12,
  },
  dateField: {
    flex: 1,
    gap: 8,
  },
  inputLabel: {
    fontSize: 13,
    fontWeight: '700',
    color: '#334155',
    letterSpacing: 0.3,
  },
  dateInput: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8FAFC',
    borderRadius: 12,
    paddingHorizontal: 12,
    height: 48,
    borderWidth: 1.5,
    borderColor: '#E2E8F0',
    gap: 10,
  },
  dateInputText: {
    fontSize: 13,
    color: '#1E293B',
    fontWeight: '600',
  },
  inputGroup: {
    gap: 8,
  },
  dropdown: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#F8FAFC',
    borderRadius: 12,
    paddingHorizontal: 16,
    height: 48,
    borderWidth: 1.5,
    borderColor: '#E2E8F0',
  },
  dropdownText: {
    fontSize: 14,
    color: '#1E293B',
    fontWeight: '600',
  },
  dropdownMenu: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    shadowColor: '#6366f1',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.08,
    shadowRadius: 16,
    elevation: 5,
    borderWidth: 1.5,
    borderColor: '#E2E8F0',
    overflow: 'hidden',
    marginTop: 2,
  },
  dropdownItem: {
    padding: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  dropdownItemText: {
    color: '#475569',
    fontSize: 13,
    fontWeight: '600',
  },
  durationContainer: {
    flexDirection: 'row',
    gap: 10,
    backgroundColor: '#F8FAFC',
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: '#E2E8F0',
    padding: 4,
  },
  durationButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 8,
    height: 40,
    gap: 6,
  },
  durationButtonActive: {
    backgroundColor: '#6366f1',
    shadowColor: '#6366f1',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 3,
  },
  durationButtonText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#64748B',
  },
  durationButtonTextActive: {
    color: '#ffffff',
    fontWeight: '700',
  },
  textArea: {
    backgroundColor: '#F8FAFC',
    borderRadius: 12,
    padding: 14,
    borderWidth: 1.5,
    borderColor: '#E2E8F0',
    fontSize: 13,
    color: '#1E293B',
    minHeight: 100,
    fontWeight: '500',
  },
  submitButton: {
    borderRadius: 12,
    overflow: 'hidden',
    marginTop: 8,
  },
  submitButtonGradient: {
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#6366f1',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.25,
    shadowRadius: 12,
    elevation: 4,
  },
  submitButtonText: {
    fontSize: 15,
    fontWeight: '700',
    color: '#ffffff',
    letterSpacing: 0.5,
  },

  // --- Modal Overlay ---
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(30, 27, 75, 0.4)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  calendarContainer: {
    backgroundColor: '#ffffff',
    borderRadius: 24,
    padding: 16,
    width: width - 48,
    shadowColor: '#6366f1',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.15,
    shadowRadius: 24,
    elevation: 10,
    borderWidth: 1,
    borderColor: 'rgba(99, 102, 241, 0.1)',
  },
});