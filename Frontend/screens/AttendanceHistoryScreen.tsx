import React, { useState, useCallback, useEffect, useRef } from 'react';
import {
    View,
    Text,
    ScrollView,
    TouchableOpacity,
    StyleSheet,
    ActivityIndicator,
    Dimensions,
    Platform,
    Animated,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useFocusEffect } from 'expo-router';
import { ChevronLeft, ChevronRight, CalendarDays, Clock, CheckCircle2, AlertCircle, Compass } from 'lucide-react-native';
import { useAuth } from '@/context/AuthContext';
import HistoryIllustration from '@/components/illustrations/HistoryIllustration';
import {
    getEmployeeAttendanceHistory,
    getEmployeeStats,
} from '@/services/api/attendance';
import { Colors } from '@/constants/Colors';
import { LinearGradient } from 'expo-linear-gradient';
import { StatusBar } from 'expo-status-bar';

const { width } = Dimensions.get('window');

const DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

const MONTH_NAMES = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December',
];

type AttendanceLog = {
    date: string;
    punchIn: string | null;
    punchOut: string | null;
    workedHours: string;
    status: string;
    leaveType: string | null;
};

import { useTheme } from '@/context/ThemeContext';

export default function AttendanceHistoryScreen() {
    const { userDetails } = useAuth();
    const { isDarkMode, colors } = useTheme();
    const today = new Date();

    const [month, setMonth] = useState(today.getMonth()); // 0-indexed
    const [year, setYear] = useState(today.getFullYear());
    const [selectedDay, setSelectedDay] = useState(today.getDate());

    const [logs, setLogs] = useState<AttendanceLog[]>([]);
    const [stats, setStats] = useState<{
        presentDays: number;
        lateDays: number;
        totalHours: number;
    }>({ presentDays: 0, lateDays: 0, totalHours: 0 });
    const [isLoading, setIsLoading] = useState(false);

    const fadeAnim = useRef(new Animated.Value(0)).current;
    const slideAnim = useRef(new Animated.Value(15)).current;

    const fetchData = useCallback(async () => {
        if (!userDetails?.id) return;
        setIsLoading(true);
        try {
            const [history, employeeStats] = await Promise.all([
                getEmployeeAttendanceHistory(userDetails.id, month + 1, year),
                getEmployeeStats(userDetails.id, month + 1, year),
            ]);

            setLogs(history);

            let late = 0;
            let totalMins = 0;
            for (const log of history) {
                if (log.status === 'Late') late++;
                if (log.workedHours) {
                    const match = log.workedHours.match(/(\d+)h\s*(\d+)m/);
                    if (match) {
                        totalMins += parseInt(match[1]) * 60 + parseInt(match[2]);
                    }
                }
            }

            setStats({
                presentDays: employeeStats?.monthlySummary?.presentDays ?? 0,
                lateDays: late,
                totalHours: Math.round(totalMins / 60),
            });
        } catch (e) {
            console.error('Failed to load attendance data:', e);
        } finally {
            setIsLoading(false);
        }
    }, [userDetails?.id, month, year]);

    useFocusEffect(
        useCallback(() => {
            fetchData();
        }, [fetchData])
    );

    useEffect(() => {
        if (!isLoading) {
            fadeAnim.setValue(0);
            slideAnim.setValue(15);
            Animated.parallel([
                Animated.timing(fadeAnim, {
                    toValue: 1,
                    duration: 450,
                    useNativeDriver: true,
                }),
                Animated.timing(slideAnim, {
                    toValue: 0,
                    duration: 450,
                    useNativeDriver: true,
                }),
            ]).start();
        }
    }, [isLoading, logs]);

    // Calendar helpers
    const firstDayOfMonth = new Date(year, month, 1).getDay(); // 0=Sun
    const startOffset = (firstDayOfMonth === 0 ? 6 : firstDayOfMonth - 1);
    const daysInMonth = new Date(year, month + 1, 0).getDate();

    const goToPrevMonth = () => {
        if (month === 0) { setMonth(11); setYear(y => y - 1); }
        else setMonth(m => m - 1);
        setSelectedDay(1);
    };

    const goToNextMonth = () => {
        if (month === 11) { setMonth(0); setYear(y => y + 1); }
        else setMonth(m => m + 1);
        setSelectedDay(1);
    };

    // Build calendar grid
    const calendarCells: (number | null)[] = [];
    for (let i = 0; i < startOffset; i++) calendarCells.push(null);
    for (let d = 1; d <= daysInMonth; d++) calendarCells.push(d);
    while (calendarCells.length % 7 !== 0) calendarCells.push(null);
    const weeks = [];
    for (let i = 0; i < calendarCells.length; i += 7) {
        weeks.push(calendarCells.slice(i, i + 7));
    }

    const isCurrentMonth =
        month === today.getMonth() && year === today.getFullYear();

    const getLogForDay = (day: number): AttendanceLog | undefined => {
        const dateKey = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
        return logs.find(l => l.date === dateKey);
    };

    const getDayDot = (day: number) => {
        const log = getLogForDay(day);
        if (!log) return null;
        if (log.status === 'Present') return '#10b981';
        if (log.status === 'Late') return '#f59e0b';
        if (log.status === 'Absent') return '#ef4444';
        if (log.status === 'Leave') return '#6366f1';
        return null;
    };

    const getStatusStyle = (status: string) => {
        switch (status) {
            case 'Present': return { bg: '#ECFDF5', text: '#10B981', label: 'ON TIME' };
            case 'Late': return { bg: '#FEF3C7', text: '#D97706', label: 'LATE' };
            case 'Absent': return { bg: '#F1F5F9', text: '#64748B', label: 'ABSENT' };
            case 'Leave': return { bg: '#EEF2FF', text: '#6366f1', label: 'LEAVE' };
            default: return { bg: '#F1F5F9', text: '#64748B', label: status.toUpperCase() };
        }
    };

    const formatLogDate = (dateStr: string) => {
        const d = new Date(dateStr + 'T00:00:00');
        return {
            month: MONTH_NAMES[d.getMonth()].slice(0, 3).toUpperCase(),
            day: String(d.getDate()).padStart(2, '0'),
        };
    };

    const selectedDayLog = getLogForDay(selectedDay);

    return (
        <SafeAreaView style={[styles.safeContainer, { backgroundColor: colors.background }]}>
            <StatusBar style={isDarkMode ? 'light' : 'dark'} />

            {/* Header */}
            <View style={[styles.header, { backgroundColor: colors.background }]}>
                <View style={styles.headerTitleContainer}>
                    <Text style={[styles.welcomeText, { color: colors.primary }]}>Attendance Logs</Text>
                    <Text style={[styles.headerTitle, { color: colors.textPrimary }]}>My History</Text>
                </View>
            </View>

            <ScrollView
                style={styles.container}
                showsVerticalScrollIndicator={false}
                contentContainerStyle={styles.scrollContent}
            >
                {/* Stats Summary Welcome Card */}
                <View style={[styles.welcomeCard, { borderColor: isDarkMode ? 'rgba(129, 140, 248, 0.2)' : 'rgba(99, 102, 241, 0.08)' }]}>
                    <LinearGradient
                        colors={isDarkMode ? ['#151D30', '#1E1B4B'] : ['#EEF2FF', '#F5F3FF']}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 1 }}
                        style={styles.welcomeGradient}
                    >
                        <View style={styles.welcomeTextContainer}>
                            <Text style={[styles.welcomeQuote, { color: colors.primary }]}>Monthly Summary</Text>
                            <Text style={[styles.ownerName, { color: colors.textPrimary }]}>
                                {MONTH_NAMES[month].slice(0, 3)} {year}
                            </Text>

                            {/* Mini Stats Grid inside welcome card */}
                            <View style={[styles.miniStatsGrid, { backgroundColor: isDarkMode ? '#0F172A' : '#FFFFFF', borderWidth: 1, borderColor: colors.border }]}>
                                <View style={styles.miniStatItem}>
                                    <Text style={[styles.miniStatValue, { color: '#10b981' }]}>
                                        {String(stats.presentDays).padStart(2, '0')}
                                    </Text>
                                    <Text style={[styles.miniStatLabel, { color: colors.textSecondary }]}>Present</Text>
                                </View>
                                <View style={[styles.miniStatDivider, { backgroundColor: colors.border }]} />
                                <View style={styles.miniStatItem}>
                                    <Text style={[styles.miniStatValue, { color: '#f59e0b' }]}>
                                        {String(stats.lateDays).padStart(2, '0')}
                                    </Text>
                                    <Text style={[styles.miniStatLabel, { color: colors.textSecondary }]}>Late</Text>
                                </View>
                                <View style={[styles.miniStatDivider, { backgroundColor: colors.border }]} />
                                <View style={styles.miniStatItem}>
                                    <Text style={[styles.miniStatValue, { color: colors.primary }]}>
                                        {stats.totalHours}h
                                    </Text>
                                    <Text style={[styles.miniStatLabel, { color: colors.textSecondary }]}>Worked</Text>
                                </View>
                            </View>
                        </View>
                        <View style={styles.illustrationWrapper}>
                            <HistoryIllustration width={105} height={85} isDarkMode={isDarkMode} />
                        </View>
                    </LinearGradient>
                </View>

                {/* Calendar Card */}
                <View style={[styles.calendarCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
                    {/* Month Navigation */}
                    <View style={styles.monthNav}>
                        <View style={styles.monthTitleWrapper}>
                            <CalendarDays size={18} color={colors.primary} />
                            <Text style={[styles.monthText, { color: colors.textPrimary }]}>
                                {MONTH_NAMES[month]} {year}
                            </Text>
                        </View>
                        <View style={styles.navButtons}>
                          <TouchableOpacity
                            style={[styles.navBtn, { backgroundColor: colors.surface }]}
                            onPress={goToPrevMonth}
                            activeOpacity={0.7}
                          >
                            <ChevronLeft size={16} color={colors.textSecondary} />
                          </TouchableOpacity>
                          <TouchableOpacity
                            style={[styles.navBtn, { backgroundColor: colors.surface }]}
                            onPress={goToNextMonth}
                            activeOpacity={0.7}
                          >
                            <ChevronRight size={16} color={colors.textSecondary} />
                          </TouchableOpacity>
                        </View>
                    </View>

                    {/* Day labels */}
                    <View style={styles.dayLabelsRow}>
                        {DAYS.map((d, idx) => (
                            <Text key={idx} style={[styles.dayLabel, { color: colors.textSecondary }]}>{d}</Text>
                        ))}
                    </View>

                    {/* Calendar Grid */}
                    {weeks.map((week, wi) => (
                        <View key={wi} style={styles.weekRow}>
                            {week.map((day, di) => {
                                if (!day) return <View key={di} style={styles.dayCell} />;
                                const isSelected = day === selectedDay;
                                const dotColor = getDayDot(day);
                                const isPast = new Date(year, month, day) > today;
                                const isToday = isCurrentMonth && day === today.getDate();

                                return (
                                    <TouchableOpacity
                                        key={di}
                                        style={[
                                            styles.dayCell,
                                            isSelected && styles.dayCellSelected,
                                            isToday && !isSelected && styles.dayCellToday,
                                        ]}
                                        onPress={() => setSelectedDay(day)}
                                        activeOpacity={0.7}
                                    >
                                        <Text
                                            style={[
                                                styles.dayText,
                                                { color: colors.textPrimary },
                                                isSelected && styles.dayTextSelected,
                                                isToday && !isSelected && styles.dayTextToday,
                                                isPast && !isSelected && styles.dayTextFuture,
                                            ]}
                                        >
                                            {day}
                                        </Text>
                                        {dotColor && !isSelected && (
                                            <View style={[styles.dot, { backgroundColor: dotColor }]} />
                                        )}
                                    </TouchableOpacity>
                                );
                            })}
                        </View>
                    ))}
                </View>

                {/* Selected Day Log Panel */}
                <View style={styles.selectedDayPanel}>
                    <Text style={[styles.selectedDayTitle, { color: colors.textPrimary }]}>
                        Day Summary: {selectedDay} {MONTH_NAMES[month].slice(0, 3)}
                    </Text>
                    {selectedDayLog ? (
                        <View style={[styles.logSummaryCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
                            <View style={styles.summaryBadgeRow}>
                                <View style={[styles.summaryStatusBadge, { backgroundColor: isDarkMode ? '#1E293B' : getStatusStyle(selectedDayLog.status).bg }]}>
                                    <Text style={[styles.summaryStatusText, { color: getStatusStyle(selectedDayLog.status).text }]}>
                                        {getStatusStyle(selectedDayLog.status).label}
                                    </Text>
                                </View>
                                <View style={[styles.summaryHoursBadge, { backgroundColor: isDarkMode ? '#1E1B4B' : '#EEF2FF' }]}>
                                    <Clock size={12} color={colors.primary} />
                                    <Text style={[styles.summaryHoursText, { color: colors.textPrimary }]}>{selectedDayLog.workedHours || '0h 0m'}</Text>
                                </View>
                            </View>
                            
                            {selectedDayLog.punchIn ? (
                                <View style={[styles.summaryTimesRow, { backgroundColor: isDarkMode ? '#1E293B' : '#F8FAFC', borderColor: colors.border }]}>
                                    <View style={styles.timeValueCell}>
                                        <Text style={[styles.timeLabelText, { color: colors.textSecondary }]}>PUNCH IN</Text>
                                        <Text style={[styles.timeValText, { color: colors.textPrimary }]}>{selectedDayLog.punchIn}</Text>
                                    </View>
                                    <View style={[styles.timeDividerLine, { backgroundColor: colors.border }]} />
                                    <View style={styles.timeValueCell}>
                                        <Text style={[styles.timeLabelText, { color: colors.textSecondary }]}>PUNCH OUT</Text>
                                        <Text style={[styles.timeValText, { color: colors.textPrimary }]}>{selectedDayLog.punchOut || '--:--'}</Text>
                                    </View>
                                </View>
                            ) : (
                                <Text style={[styles.noPunchText, { color: colors.textSecondary }]}>No check-in logs registered for this date.</Text>
                            )}
                        </View>
                    ) : (
                        <View style={[styles.emptyDayCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
                            <Text style={[styles.emptyDayText, { color: colors.textSecondary }]}>No attendance records logged.</Text>
                        </View>
                    )}
                </View>

                {/* Daily Logs */}
                <View style={styles.sectionHeader}>
                    <Text style={[styles.sectionTitle, { color: colors.textPrimary }]}>Monthly History Log</Text>
                </View>

                <Animated.View style={{ opacity: fadeAnim, transform: [{ translateY: slideAnim }] }}>
                    {isLoading ? (
                        <View style={styles.loaderWrapper}>
                            <ActivityIndicator size="large" color={colors.primary} />
                            <Text style={[styles.loaderText, { color: colors.textSecondary }]}>Syncing logs...</Text>
                        </View>
                    ) : logs.length === 0 ? (
                        <View style={[styles.emptyState, { backgroundColor: colors.card, borderColor: colors.border }]}>
                            <Text style={[styles.emptyText, { color: colors.textSecondary }]}>No attendance records for this month.</Text>
                        </View>
                    ) : (
                        logs.map((log, idx) => {
                            const { month: logMonth, day: logDay } = formatLogDate(log.date);
                            const status = getStatusStyle(log.status);
                            return (
                                <View key={idx} style={[styles.logCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
                                    {/* Date Badge */}
                                    <View style={[styles.dateBadge, { backgroundColor: isDarkMode ? '#1E293B' : '#F1F5F9' }]}>
                                        <Text style={[styles.dateBadgeMonth, { color: colors.primary }]}>{logMonth}</Text>
                                        <Text style={[styles.dateBadgeDay, { color: colors.textPrimary }]}>{logDay}</Text>
                                    </View>

                                    {/* Log Info */}
                                    <View style={styles.logInfo}>
                                        {log.status === 'Absent' || !log.punchIn ? (
                                            <>
                                                <Text style={[styles.logTime, { color: colors.textPrimary }]}>—— : ——</Text>
                                                <Text style={[styles.logWorked, { color: colors.textSecondary }]}>
                                                    {log.leaveType || 'Absent'}
                                                </Text>
                                            </>
                                        ) : (
                                            <>
                                                <Text style={[styles.logTime, { color: colors.textPrimary }]}>
                                                    {log.punchIn} - {log.punchOut || '--:--'}
                                                </Text>
                                                <Text style={[styles.logWorked, { color: colors.textSecondary }]}>{log.workedHours} worked</Text>
                                            </>
                                        )}
                                    </View>

                                    {/* Status Badge */}
                                    <View style={[styles.statusBadge, { backgroundColor: isDarkMode ? '#1E293B' : status.bg }]}>
                                        <Text style={[styles.statusText, { color: status.text }]}>
                                            {status.label}
                                        </Text>
                                    </View>
                                </View>
                            );
                        })
                    )}
                </Animated.View>

                <View style={{ height: 30 }} />
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
        paddingBottom: 40,
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

    // --- Welcome Banner ---
    welcomeCard: {
        borderRadius: 22,
        overflow: 'hidden',
        borderWidth: 1,
        borderColor: 'rgba(99, 102, 241, 0.08)',
        marginBottom: 20,
    },
    welcomeGradient: {
        flexDirection: 'row',
        padding: 16,
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    welcomeTextContainer: {
        flex: 1.2,
        paddingRight: 6,
    },
    welcomeQuote: {
        fontSize: 11,
        color: '#6366f1',
        fontWeight: '700',
        textTransform: 'uppercase',
        letterSpacing: 0.5,
    },
    ownerName: {
        fontSize: 24,
        fontWeight: '800',
        color: '#1E1B4B',
        marginTop: 2,
        marginBottom: 10,
    },
    miniStatsGrid: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#FFFFFF',
        borderRadius: 14,
        paddingVertical: 10,
        paddingHorizontal: 8,
        shadowColor: '#6366f1',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.02,
        shadowRadius: 6,
        elevation: 1,
    },
    miniStatItem: {
        flex: 1,
        alignItems: 'center',
    },
    miniStatValue: {
        fontSize: 15,
        fontWeight: '800',
    },
    miniStatLabel: {
        fontSize: 9,
        color: '#64748B',
        fontWeight: '700',
        textTransform: 'uppercase',
        marginTop: 1,
    },
    miniStatDivider: {
        width: 1.5,
        height: 24,
        backgroundColor: '#F1F5F9',
    },
    illustrationWrapper: {
        flex: 0.8,
        alignItems: 'center',
        justifyContent: 'center',
    },

    // --- Calendar Card ---
    calendarCard: {
        backgroundColor: '#FFFFFF',
        borderRadius: 22,
        padding: 16,
        marginBottom: 20,
        borderWidth: 1,
        borderColor: '#F1F5F9',
        shadowColor: '#6366f1',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.03,
        shadowRadius: 12,
        elevation: 3,
    },
    monthNav: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 16,
        paddingHorizontal: 4,
    },
    monthTitleWrapper: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    monthText: {
        fontSize: 15,
        fontWeight: '800',
        color: '#1E1B4B',
    },
    navButtons: {
        flexDirection: 'row',
        gap: 6,
    },
    navBtn: {
        width: 32,
        height: 32,
        borderRadius: 10,
        backgroundColor: '#F8FAFC',
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 1,
        borderColor: '#E2E8F0',
    },
    dayLabelsRow: {
        flexDirection: 'row',
        marginBottom: 8,
    },
    dayLabel: {
        flex: 1,
        textAlign: 'center',
        fontSize: 11,
        fontWeight: '700',
        color: '#94A3B8',
        textTransform: 'uppercase',
    },
    weekRow: {
        flexDirection: 'row',
        marginBottom: 4,
    },
    dayCell: {
        flex: 1,
        height: 38,
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 10,
        position: 'relative',
    },
    dayCellSelected: {
        backgroundColor: '#6366f1',
    },
    dayCellToday: {
        backgroundColor: '#EEF2FF',
    },
    dayText: {
        fontSize: 13,
        fontWeight: '700',
        color: '#1E293B',
    },
    dayTextSelected: {
        color: '#FFFFFF',
    },
    dayTextToday: {
        color: '#6366f1',
    },
    dayTextFuture: {
        color: '#CBD5E1',
    },
    dot: {
        position: 'absolute',
        bottom: 4,
        width: 4,
        height: 4,
        borderRadius: 2,
    },

    // --- Selected Day Panel ---
    selectedDayPanel: {
        marginBottom: 24,
    },
    selectedDayTitle: {
        fontSize: 14,
        fontWeight: '700',
        color: '#1E1B4B',
        marginBottom: 10,
        paddingHorizontal: 4,
    },
    logSummaryCard: {
        backgroundColor: '#FFFFFF',
        borderRadius: 18,
        padding: 14,
        borderWidth: 1,
        borderColor: '#F1F5F9',
        shadowColor: '#6366f1',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.02,
        shadowRadius: 10,
        elevation: 2,
    },
    summaryBadgeRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10,
        marginBottom: 12,
    },
    summaryStatusBadge: {
        paddingHorizontal: 10,
        paddingVertical: 5,
        borderRadius: 8,
    },
    summaryStatusText: {
        fontSize: 10,
        fontWeight: '800',
        textTransform: 'uppercase',
    },
    summaryHoursBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
        backgroundColor: '#EEF2FF',
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 8,
    },
    summaryHoursText: {
        fontSize: 11,
        color: '#6366f1',
        fontWeight: '700',
    },
    summaryTimesRow: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#F8FAFC',
        borderRadius: 12,
        padding: 10,
        borderWidth: 1,
        borderColor: '#F1F5F9',
    },
    timeValueCell: {
        flex: 1,
        alignItems: 'center',
    },
    timeLabelText: {
        fontSize: 9,
        color: '#64748B',
        fontWeight: '700',
    },
    timeValText: {
        fontSize: 13,
        color: '#1E293B',
        fontWeight: '800',
        marginTop: 2,
    },
    timeDividerLine: {
        width: 1.5,
        height: 24,
        backgroundColor: '#E2E8F0',
    },
    noPunchText: {
        fontSize: 12,
        color: '#64748B',
        fontWeight: '600',
        textAlign: 'center',
        paddingVertical: 6,
    },
    emptyDayCard: {
        backgroundColor: '#FFFFFF',
        borderRadius: 18,
        padding: 16,
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 1,
        borderColor: '#F1F5F9',
    },
    emptyDayText: {
        fontSize: 12,
        color: '#64748B',
        fontWeight: '600',
    },

    // --- Section Header ---
    sectionHeader: {
        marginBottom: 12,
    },
    sectionTitle: {
        fontSize: 16,
        fontWeight: '700',
        color: '#1E1B4B',
    },

    // --- Log Cards ---
    logCard: {
        backgroundColor: '#FFFFFF',
        borderRadius: 18,
        padding: 14,
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 10,
        borderWidth: 1,
        borderColor: '#F1F5F9',
        shadowColor: '#6366f1',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.02,
        shadowRadius: 8,
        elevation: 2,
    },
    dateBadge: {
        width: 44,
        alignItems: 'center',
        marginRight: 14,
    },
    dateBadgeMonth: {
        fontSize: 10,
        fontWeight: '700',
        color: '#94A3B8',
        letterSpacing: 0.5,
    },
    dateBadgeDay: {
        fontSize: 18,
        fontWeight: '800',
        color: '#1E293B',
        lineHeight: 22,
        marginTop: 1,
    },
    logInfo: {
        flex: 1,
    },
    logTime: {
        fontSize: 14,
        fontWeight: '700',
        color: '#1E293B',
        marginBottom: 3,
    },
    logWorked: {
        fontSize: 12,
        color: '#64748B',
        fontWeight: '500',
    },
    statusBadge: {
        paddingHorizontal: 10,
        paddingVertical: 5,
        borderRadius: 10,
        alignItems: 'center',
        justifyContent: 'center',
    },
    statusText: {
        fontSize: 10,
        fontWeight: '800',
        textTransform: 'uppercase',
    },

    // --- Empty State ---
    emptyState: {
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 40,
        backgroundColor: '#FFFFFF',
        borderRadius: 18,
        borderWidth: 1,
        borderColor: '#F1F5F9',
    },
    emptyText: {
        color: '#64748B',
        fontSize: 13,
        fontWeight: '500',
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
});
