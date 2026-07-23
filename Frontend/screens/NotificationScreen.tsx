import React, { useState, useEffect, useCallback, useRef } from 'react';
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ActivityIndicator,
  Alert,
  Dimensions,
  Platform,
  Animated,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Colors } from '@/constants/Colors';
import { useRouter } from 'expo-router';
import { AlertTriangle, Calendar, CheckCircle2, ChevronLeft, Info, BellRing, ClipboardCheck } from 'lucide-react-native';
import { useAuth } from '@/context/AuthContext';
import { showErrorToast } from '@/services/toast';
import NotificationIllustration from '@/components/illustrations/NotificationIllustration';
import { getNotifications, markAllNotificationsAsRead, markNotificationAsRead, NotificationItem } from '@/services/api/notifications';
import { LinearGradient } from 'expo-linear-gradient';
import { StatusBar } from 'expo-status-bar';

const { width } = Dimensions.get('window');

const getRelativeTime = (dateString: string) => {
  try {
    const now = new Date();
    const date = new Date(dateString);
    const diffMs = now.getTime() - date.getTime();
    const diffSec = Math.floor(diffMs / 1000);
    const diffMin = Math.floor(diffSec / 60);
    const diffHr = Math.floor(diffMin / 60);
    const diffDay = Math.floor(diffHr / 24);

    if (diffSec < 60) return 'Just now';
    if (diffMin < 60) return `${diffMin}m ago`;
    if (diffHr < 24) return `${diffHr}h ago`;
    if (diffDay === 1) return 'Yesterday';
    return `${diffDay}d ago`;
  } catch (e) {
    return '';
  }
};

const getNotificationMeta = (type: string) => {
  switch (type) {
    case 'success':
      return { icon: CheckCircle2, color: '#10B981', bg: '#ECFDF5' };
    case 'warning':
      return { icon: AlertTriangle, color: '#F59E0B', bg: '#FFFBEB' };
    case 'calendar':
      return { icon: Calendar, color: '#8B5CF6', bg: '#F5F3FF' };
    case 'info':
    default:
      return { icon: Info, color: '#3B82F6', bg: '#EFF6FF' };
  }
};

export default function NotificationScreen() {
  const router = useRouter();
  const { userDetails } = useAuth();
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [loading, setLoading] = useState(true);

  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(15)).current;

  const fetchNotifications = useCallback(async () => {
    if (!userDetails?.id) return;
    try {
      setLoading(true);
      const data = await getNotifications(userDetails.id);
      setNotifications(data || []);
    } catch (error) {
      console.error('Failed to load notifications:', error);
      showErrorToast('Error', 'Failed to load notifications');
    } finally {
      setLoading(false);
    }
  }, [userDetails?.id]);

  useEffect(() => {
    fetchNotifications();
  }, [fetchNotifications]);

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
  }, [loading, notifications]);

  const handleMarkAllRead = async () => {
    if (!userDetails?.id) return;
    try {
      await markAllNotificationsAsRead(userDetails.id);
      setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
    } catch (error) {
      console.error('Failed to mark all as read:', error);
      showErrorToast('Error', 'Failed to mark all as read');
    }
  };

  const handleNotificationPress = async (item: NotificationItem) => {
    if (item.isRead) return;
    try {
      await markNotificationAsRead(item.id);
      setNotifications(prev => prev.map(n => n.id === item.id ? { ...n, isRead: true } : n));
    } catch (error) {
      console.error('Failed to mark notification as read:', error);
    }
  };

  const unread = notifications.filter(n => !n.isRead);
  const read = notifications.filter(n => n.isRead);

  const renderCard = (item: NotificationItem) => {
    const { icon: Icon, color, bg } = getNotificationMeta(item.type);
    const timeStr = getRelativeTime(item.createdAt);

    return (
      <TouchableOpacity
        key={item.id}
        style={[styles.notificationCard, !item.isRead && styles.unreadCard]}
        onPress={() => handleNotificationPress(item)}
        activeOpacity={0.8}
      >
        <View style={[styles.iconContainer, { backgroundColor: bg }]}>
          <Icon size={20} color={color} />
        </View>
        <View style={styles.textContainer}>
          <View style={styles.cardHeader}>
            <Text style={[styles.cardTitle, !item.isRead && styles.unreadText]} numberOfLines={1}>
              {item.title}
            </Text>
            <Text style={styles.timeText}>{timeStr}</Text>
          </View>
          <Text style={styles.messageText}>{item.message}</Text>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={styles.safeContainer}>
      <StatusBar style="dark" />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}
          hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
        >
          <ChevronLeft size={22} color="#1E293B" />
        </TouchableOpacity>
        <View style={styles.headerTitleContainer}>
          <Text style={styles.headerTitle}>Notifications</Text>
        </View>
      </View>

      {loading ? (
        <View style={styles.loaderWrapper}>
          <ActivityIndicator size="large" color="#6366f1" />
          <Text style={styles.loaderText}>Syncing updates...</Text>
        </View>
      ) : (
        <ScrollView
          style={styles.container}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
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
                <Text style={styles.welcomeQuote}>Stay Updated</Text>
                <Text style={styles.ownerName}>Alert Logs</Text>
                <Text style={styles.welcomeDesc}>
                  View workspace announcements, punch status confirmations, and time-off request updates.
                </Text>
              </View>
              <View style={styles.illustrationWrapper}>
                <NotificationIllustration width={110} height={90} />
              </View>
            </LinearGradient>
          </View>

          <Animated.View style={{ opacity: fadeAnim, transform: [{ translateY: slideAnim }] }}>
            {unread.length > 0 && (
              <>
                <View style={styles.sectionHeader}>
                  <Text style={styles.sectionTitle}>Recent</Text>
                  <TouchableOpacity onPress={handleMarkAllRead} activeOpacity={0.7}>
                    <Text style={styles.markRead}>Mark all as read</Text>
                  </TouchableOpacity>
                </View>
                {unread.map(renderCard)}
              </>
            )}

            <View style={[styles.sectionHeader, { marginTop: unread.length === 0 ? 10 : 20 }]}>
              <Text style={styles.sectionTitle}>Earlier</Text>
            </View>

            {read.length === 0 && unread.length === 0 ? (
              <View style={styles.emptyState}>
                <BellRing size={40} color="#94A3B8" style={{ marginBottom: 12 }} />
                <Text style={styles.emptyText}>No notifications yet.</Text>
              </View>
            ) : read.length === 0 ? (
              <View style={styles.emptyState}>
                <ClipboardCheck size={40} color="#94A3B8" style={{ marginBottom: 12 }} />
                <Text style={styles.emptyText}>No older notifications.</Text>
              </View>
            ) : (
              read.map(renderCard)
            )}
          </Animated.View>
        </ScrollView>
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

  // --- Section Headers ---
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 14,
    paddingHorizontal: 4,
  },
  sectionTitle: {
    fontSize: 12,
    fontWeight: '700',
    color: '#64748B',
    textTransform: 'uppercase',
    letterSpacing: 0.8,
  },
  markRead: {
    fontSize: 12,
    color: '#6366f1',
    fontWeight: '700',
  },

  // --- Cards ---
  notificationCard: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    marginBottom: 12,
    padding: 16,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#F1F5F9',
    shadowColor: '#6366f1',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.02,
    shadowRadius: 10,
    elevation: 2,
  },
  unreadCard: {
    backgroundColor: '#F4F7FF',
    borderLeftWidth: 3.5,
    borderLeftColor: '#6366f1',
  },
  iconContainer: {
    width: 42,
    height: 42,
    borderRadius: 10,
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
    fontSize: 14,
    fontWeight: '700',
    color: '#1E1B4B',
    flex: 1,
    marginRight: 8,
  },
  unreadText: {
    fontWeight: '800',
    color: '#1E1B4B',
  },
  timeText: {
    fontSize: 11,
    color: '#94A3B8',
    fontWeight: '600',
  },
  messageText: {
    fontSize: 12,
    color: '#64748B',
    lineHeight: 18,
    fontWeight: '500',
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
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 48,
    backgroundColor: '#FFFFFF',
    borderRadius: 22,
    borderWidth: 1,
    borderColor: '#F1F5F9',
    marginTop: 6,
  },
  emptyText: {
    color: '#64748B',
    fontSize: 13,
    fontWeight: '600',
  },
});
