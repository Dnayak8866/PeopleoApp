import React, { useState, useCallback } from 'react';
import {
    View,
    Text,
    ScrollView,
    TouchableOpacity,
    StyleSheet,
    ActivityIndicator,
    Dimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useFocusEffect } from 'expo-router';
import { ChevronLeft, ChevronRight } from 'lucide-react-native';
import { useAuth } from '@/context/AuthContext';
import {
    getEmployeeAttendanceHistory,
    getEmployeeStats,
} from '@/services/api/attendance';
import { Colors } from '@/constants/Colors';

const { width } = Dimensions.get('window');

const DAYS = ['M', 'T', 'W', 'T', 'F', 'S', 'S'];

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

export default function AttendanceHistoryScreen() {
    const { userDetails } = useAuth();
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

    const fetchData = useCallback(async () => {
        if (!userDetails?.id) return;
        setIsLoading(true);
        try {
            const [history, employeeStats] = await Promise.all([
                getEmployeeAttendanceHistory(userDetails.id, month + 1, year),
                getEmployeeStats(userDetails.id, month + 1, year),
            ]);

            setLogs(history);

            // Calculate stats from history
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

    // Calendar helpers
    const firstDayOfMonth = new Date(year, month, 1).getDay(); // 0=Sun
    // Convert to Monday-first (0=Mon, 6=Sun)
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
            case 'Present': return { bg: '#dcfce7', text: '#16a34a', label: 'ON TIME' };
            case 'Late': return { bg: '#fee2e2', text: '#dc2626', label: 'LATE' };
            case 'Absent': return { bg: '#f3f4f6', text: '#6b7280', label: 'ABSENT' };
            case 'Leave': return { bg: '#ede9fe', text: '#7c3aed', label: 'LEAVE' };
            default: return { bg: '#f3f4f6', text: '#6b7280', label: status.toUpperCase() };
        }
    };

    const formatLogDate = (dateStr: string) => {
        const d = new Date(dateStr + 'T00:00:00');
        return {
            month: MONTH_NAMES[d.getMonth()].slice(0, 3).toUpperCase(),
            day: String(d.getDate()).padStart(2, '0'),
        };
    };

    return (
        <SafeAreaView style={styles.container}>
            {/* Header */}
            <View style={styles.header}>
                <Text style={styles.headerTitle}>Attendance History</Text>
            </View>

            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
                {/* Calendar Card */}
                <View style={styles.calendarCard}>
                    {/* Month Navigation */}
                    <View style={styles.monthNav}>
                        <Text style={styles.monthText}>
                            {MONTH_NAMES[month]} {year}
                        </Text>
                        <View style={styles.navButtons}>
                            <TouchableOpacity style={styles.navBtn} onPress={goToPrevMonth}>
                                <ChevronLeft size={18} color="#374151" />
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.navBtn} onPress={goToNextMonth}>
                                <ChevronRight size={18} color="#374151" />
                            </TouchableOpacity>
                        </View>
                    </View>

                    {/* Day labels */}
                    <View style={styles.dayLabelsRow}>
                        {DAYS.map((d, idx) => (
                            <Text key={idx} style={styles.dayLabel}>{d}</Text>
                        ))}
                    </View>

                    {/* Calendar Grid */}
                    {weeks.map((week, wi) => (
                        <View key={wi} style={styles.weekRow}>
                            {week.map((day, di) => {
                                if (!day) return <View key={di} style={styles.dayCell} />;
                                const isToday = isCurrentMonth && day === today.getDate();
                                const isSelected = day === selectedDay;
                                const dotColor = getDayDot(day);
                                const isPast = new Date(year, month, day) > today;
                                return (
                                    <TouchableOpacity
                                        key={di}
                                        style={[
                                            styles.dayCell,
                                            isSelected && styles.dayCellSelected,
                                        ]}
                                        onPress={() => setSelectedDay(day)}
                                        activeOpacity={0.7}
                                    >
                                        <Text
                                            style={[
                                                styles.dayText,
                                                isSelected && styles.dayTextSelected,
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

                {/* Stats Cards */}
                <View style={styles.statsRow}>
                    <View style={[styles.statCard, styles.statCardBlue]}>
                        <Text style={[styles.statNumber, { color: Colors.primary }]}>
                            {String(stats.presentDays).padStart(2, '0')}
                        </Text>
                        <Text style={[styles.statLabel, { color: Colors.primary }]}>PRESENT</Text>
                    </View>
                    <View style={[styles.statCard, styles.statCardRed]}>
                        <Text style={[styles.statNumber, { color: '#ef4444' }]}>
                            {String(stats.lateDays).padStart(2, '0')}
                        </Text>
                        <Text style={[styles.statLabel, { color: '#ef4444' }]}>LATE</Text>
                    </View>
                    <View style={[styles.statCard, styles.statCardGreen]}>
                        <Text style={[styles.statNumber, { color: '#10b981' }]}>
                            {stats.totalHours}h
                        </Text>
                        <Text style={[styles.statLabel, { color: '#10b981' }]}>TOTAL HRS</Text>
                    </View>
                </View>

                {/* Daily Logs */}
                <View style={styles.sectionHeader}>
                    <Text style={styles.sectionTitle}>Daily Logs</Text>
                    <TouchableOpacity>
                        <Text style={styles.viewAll}>View All</Text>
                    </TouchableOpacity>
                </View>

                {isLoading ? (
                    <ActivityIndicator size="large" color={Colors.primary} style={{ marginTop: 30 }} />
                ) : logs.length === 0 ? (
                    <View style={styles.emptyState}>
                        <Text style={styles.emptyText}>No attendance records for this month</Text>
                    </View>
                ) : (
                    logs.map((log, idx) => {
                        const { month: logMonth, day: logDay } = formatLogDate(log.date);
                        const status = getStatusStyle(log.status);
                        return (
                            <View key={idx} style={styles.logCard}>
                                {/* Date Badge */}
                                <View style={styles.dateBadge}>
                                    <Text style={styles.dateBadgeMonth}>{logMonth}</Text>
                                    <Text style={styles.dateBadgeDay}>{logDay}</Text>
                                </View>

                                {/* Log Info */}
                                <View style={styles.logInfo}>
                                    {log.status === 'Absent' || !log.punchIn ? (
                                        <>
                                            <Text style={styles.logTime}>-- : --</Text>
                                            <Text style={styles.logWorked}>
                                                {log.leaveType || 'Absent'}
                                            </Text>
                                        </>
                                    ) : (
                                        <>
                                            <Text style={styles.logTime}>
                                                {log.punchIn} - {log.punchOut || '--:--'}
                                            </Text>
                                            <Text style={styles.logWorked}>{log.workedHours} worked</Text>
                                        </>
                                    )}
                                </View>

                                {/* Status Badge */}
                                <View style={[styles.statusBadge, { backgroundColor: status.bg }]}>
                                    <Text style={[styles.statusText, { color: status.text }]}>
                                        {status.label}
                                    </Text>
                                </View>
                            </View>
                        );
                    })
                )}

                <View style={{ height: 20 }} />
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f3f4f8',
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: 20,
        paddingVertical: 14,
        backgroundColor: '#fff',
        borderBottomWidth: 1,
        borderBottomColor: '#e5e7eb',
    },
    headerTitle: {
        fontSize: 18,
        fontWeight: '700',
        color: '#111827',
    },
    scrollContent: {
        paddingHorizontal: 16,
        paddingTop: 16,
    },

    // Calendar
    calendarCard: {
        backgroundColor: '#fff',
        borderRadius: 16,
        padding: 16,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.06,
        shadowRadius: 8,
        elevation: 3,
        marginBottom: 16,
    },
    monthNav: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 16,
    },
    monthText: {
        fontSize: 16,
        fontWeight: '700',
        color: '#111827',
    },
    navButtons: {
        flexDirection: 'row',
        gap: 4,
    },
    navBtn: {
        width: 32,
        height: 32,
        borderRadius: 8,
        backgroundColor: '#f3f4f6',
        alignItems: 'center',
        justifyContent: 'center',
    },
    dayLabelsRow: {
        flexDirection: 'row',
        marginBottom: 6,
    },
    dayLabel: {
        flex: 1,
        textAlign: 'center',
        fontSize: 12,
        fontWeight: '600',
        color: '#9ca3af',
    },
    weekRow: {
        flexDirection: 'row',
        marginBottom: 2,
    },
    dayCell: {
        flex: 1,
        height: 40,
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 20,
        position: 'relative',
    },
    dayCellSelected: {
        backgroundColor: Colors.primary,
    },
    dayText: {
        fontSize: 14,
        fontWeight: '500',
        color: '#111827',
    },
    dayTextSelected: {
        color: '#fff',
        fontWeight: '700',
    },
    dayTextFuture: {
        color: '#d1d5db',
    },
    dot: {
        position: 'absolute',
        bottom: 3,
        width: 4,
        height: 4,
        borderRadius: 2,
    },

    // Stats
    statsRow: {
        flexDirection: 'row',
        gap: 10,
        marginBottom: 20,
    },
    statCard: {
        flex: 1,
        borderRadius: 14,
        paddingVertical: 16,
        alignItems: 'center',
        justifyContent: 'center',
    },
    statCardBlue: {
        backgroundColor: '#eef0fd',
    },
    statCardRed: {
        backgroundColor: '#fef2f2',
    },
    statCardGreen: {
        backgroundColor: '#ecfdf5',
    },
    statNumber: {
        fontSize: 28,
        fontWeight: '800',
        letterSpacing: -1,
    },
    statLabel: {
        fontSize: 10,
        fontWeight: '700',
        letterSpacing: 0.5,
        marginTop: 2,
    },

    // Section
    sectionHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 12,
    },
    sectionTitle: {
        fontSize: 17,
        fontWeight: '700',
        color: '#111827',
    },
    viewAll: {
        fontSize: 13,
        color: Colors.primary,
        fontWeight: '600',
    },

    // Log Cards
    logCard: {
        backgroundColor: '#fff',
        borderRadius: 14,
        padding: 14,
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 10,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 4,
        elevation: 2,
    },
    dateBadge: {
        width: 44,
        alignItems: 'center',
        marginRight: 14,
    },
    dateBadgeMonth: {
        fontSize: 10,
        fontWeight: '600',
        color: '#9ca3af',
        letterSpacing: 0.5,
    },
    dateBadgeDay: {
        fontSize: 20,
        fontWeight: '800',
        color: '#111827',
        lineHeight: 24,
    },
    logInfo: {
        flex: 1,
    },
    logTime: {
        fontSize: 14,
        fontWeight: '600',
        color: '#111827',
        marginBottom: 2,
    },
    logWorked: {
        fontSize: 12,
        color: '#9ca3af',
    },
    statusBadge: {
        paddingHorizontal: 10,
        paddingVertical: 5,
        borderRadius: 20,
        alignItems: 'center',
        justifyContent: 'center',
    },
    statusText: {
        fontSize: 11,
        fontWeight: '700',
        letterSpacing: 0.4,
    },

    // Empty
    emptyState: {
        alignItems: 'center',
        marginTop: 40,
        marginBottom: 20,
    },
    emptyText: {
        color: '#9ca3af',
        fontSize: 14,
    },
});
