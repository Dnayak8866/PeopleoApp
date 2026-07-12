import React from 'react';
import {
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Colors } from '@/constants/Colors';
import { useRouter } from 'expo-router';
import { AlertTriangle, Calendar, CheckCircle, ChevronLeft, Info } from 'lucide-react-native';

const notifications = [
    {
        id: 1,
        title: 'Leave Approved',
        message: 'Your sick leave application for Feb 24 has been approved.',
        time: '2 hours ago',
        type: 'success',
        icon: CheckCircle,
        color: '#10B981',
    },
    {
        id: 2,
        title: 'Check-in Reminder',
        message: "Don't forget to punch in before 9:15 AM to avoid late check-in.",
        time: '4 hours ago',
        type: 'info',
        icon: Info,
        color: '#3B82F6',
    },
    {
        id: 3,
        title: 'Holiday Tomorrow',
        message: 'Tomorrow is a public holiday on account of Chhatrapati Shivaji Maharaj Jayanti.',
        time: '1 day ago',
        type: 'calendar',
        icon: Calendar,
        color: '#8B5CF6',
    },
    {
        id: 4,
        title: 'Attendance Discrepancy',
        message: 'Your punch out time for Feb 19 was not recorded. please contact HR.',
        time: '2 days ago',
        type: 'warning',
        icon: AlertTriangle,
        color: '#F59E0B',
    },
];

export default function NotificationScreen() {
    const router = useRouter();

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
                    <ChevronLeft size={24} color="#374151" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Notifications</Text>
                <View style={{ width: 40 }} />
            </View>

            <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
                <View style={styles.sectionHeader}>
                    <Text style={styles.sectionTitle}>Recent</Text>
                    <TouchableOpacity>
                        <Text style={styles.markRead}>Mark all as read</Text>
                    </TouchableOpacity>
                </View>

                {notifications.map((item) => {
                    const Icon = item.icon;
                    return (
                        <TouchableOpacity key={item.id} style={styles.notificationCard}>
                            <View style={[styles.iconContainer, { backgroundColor: item.color + '15' }]}>
                                <Icon size={22} color={item.color} />
                            </View>
                            <View style={styles.textContainer}>
                                <View style={styles.cardHeader}>
                                    <Text style={styles.cardTitle}>{item.title}</Text>
                                    <Text style={styles.timeText}>{item.time}</Text>
                                </View>
                                <Text style={styles.messageText}>{item.message}</Text>
                            </View>
                        </TouchableOpacity>
                    );
                })}

                <View style={[styles.sectionHeader, { marginTop: 20 }]}>
                    <Text style={styles.sectionTitle}>Earlier</Text>
                </View>

                <View style={styles.emptyPast}>
                    <Text style={styles.emptyText}>No older notifications</Text>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F9FAFB',
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 16,
        paddingVertical: 14,
        backgroundColor: '#FFFFFF',
        borderBottomWidth: 1,
        borderBottomColor: '#F3F4F6',
    },
    headerTitle: {
        fontSize: 18,
        fontWeight: '700',
        color: '#111827',
    },
    backButton: {
        padding: 4,
    },
    content: {
        flex: 1,
    },
    sectionHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 20,
        paddingVertical: 16,
    },
    sectionTitle: {
        fontSize: 14,
        fontWeight: '600',
        color: '#6B7280',
        textTransform: 'uppercase',
        letterSpacing: 0.5,
    },
    markRead: {
        fontSize: 14,
        color: Colors.primary,
        fontWeight: '600',
    },
    notificationCard: {
        flexDirection: 'row',
        backgroundColor: '#FFFFFF',
        marginHorizontal: 16,
        marginBottom: 12,
        padding: 16,
        borderRadius: 16,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 2,
        elevation: 2,
    },
    iconContainer: {
        width: 44,
        height: 44,
        borderRadius: 12,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 14,
    },
    textContainer: {
        flex: 1,
    },
    cardHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 4,
    },
    cardTitle: {
        fontSize: 15,
        fontWeight: '700',
        color: '#111827',
    },
    timeText: {
        fontSize: 12,
        color: '#9CA3AF',
    },
    messageText: {
        fontSize: 14,
        color: '#4B5563',
        lineHeight: 20,
    },
    emptyPast: {
        alignItems: 'center',
        paddingVertical: 40,
    },
    emptyText: {
        fontSize: 14,
        color: '#9CA3AF',
    },
});
