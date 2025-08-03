import { Colors } from '@/constants/Colors';
import { CalendarDays, Clock, Filter, Hourglass, Search, Timer } from 'lucide-react-native';
import React from 'react';
import {
    Animated,
    SafeAreaView,
    ScrollView,
    StyleSheet,
    Text,
    View,
} from 'react-native';

// Skeleton shimmer animation component
const SkeletonShimmer = ({ width, height, borderRadius = 4, style = {} }) => {
  const shimmerAnimatedValue = new Animated.Value(0);

  React.useEffect(() => {
    const shimmerAnimation = Animated.loop(
      Animated.sequence([
        Animated.timing(shimmerAnimatedValue, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: false,
        }),
        Animated.timing(shimmerAnimatedValue, {
          toValue: 0,
          duration: 1000,
          useNativeDriver: false,
        }),
      ])
    );
    shimmerAnimation.start();
    return () => shimmerAnimation.stop();
  }, []);

  const opacity = shimmerAnimatedValue.interpolate({
    inputRange: [0, 1],
    outputRange: [0.3, 0.7],
  });

  return (
    <Animated.View
      style={[
        {
          width,
          height,
          backgroundColor: '#E5E7EB',
          borderRadius,
          opacity,
        },
        style,
      ]}
    />
  );
};

const SkeletonEmployeeCard = () => (
  <View style={styles.employeeCard}>
    <View style={styles.employeeHeader}>
      <View style={styles.employeeInfo}>
        <SkeletonShimmer width={48} height={48} borderRadius={24} />
        <View style={styles.employeeDetails}>
          <SkeletonShimmer width={120} height={16} borderRadius={8} style={{ marginBottom: 6 }} />
          <SkeletonShimmer width={90} height={14} borderRadius={6} />
        </View>
      </View>
      <SkeletonShimmer width={60} height={28} borderRadius={14} />
    </View>

    <View style={styles.attendanceInfo}>
      <View style={styles.timeRow}>
        <View style={styles.timeItem}>
          <Timer size={15} color="#E5E7EB" />
          <Text style={[styles.timeLabel, { marginLeft: 4, color: '#E5E7EB' }]}>Entry:</Text>
          <SkeletonShimmer width={60} height={14} borderRadius={6} />
        </View>
        <View style={styles.timeItem}>
          <Timer size={15} color="#E5E7EB" />
          <Text style={[styles.timeLabel, { marginLeft: 4, color: '#E5E7EB' }]}>Exit:</Text>
          <SkeletonShimmer width={60} height={14} borderRadius={6} />
        </View>
      </View>
      <View style={styles.durationRow}>
        <Hourglass size={15} color="#E5E7EB" />
        <Text style={[styles.timeLabel, { marginLeft: 4, color: '#E5E7EB' }]}>Duration:</Text>
        <SkeletonShimmer width={50} height={14} borderRadius={6} />
      </View>
    </View>

    <View style={{ flex: 1, borderWidth: 0.5, borderColor: '#F0F0F0FF', height: 0, marginBottom: 4 }} />
    <View style={styles.viewDetailsButton}>
      <SkeletonShimmer width={80} height={14} borderRadius={6} style={{ marginTop: 4 }} />
    </View>
  </View>
);

export default function AttendanceSkeletonScreen() {
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Daily Attendance</Text>
          <View style={styles.profileAvatar}>
            <Text style={styles.profileAvatarText}>JD</Text>
          </View>
        </View>

        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          {/* Date Section Skeleton */}
          <View style={styles.dateSection}>
            <View style={styles.dateHeader}>
              <CalendarDays size={22} color="#E5E7EB" />
              <SkeletonShimmer width={150} height={20} borderRadius={8} style={{ marginLeft: 4 }} />
            </View>
            
            <ScrollView 
              horizontal 
              showsHorizontalScrollIndicator={false} 
              style={{ marginVertical: 8 }}
              contentContainerStyle={{ paddingHorizontal: 8 }}
            >
              {Array.from({ length: 31 }, (_, i) => (
                <View
                  key={i}
                  style={[
                    styles.dayButton,
                    { backgroundColor: '#F3F4F6' }
                  ]}
                >
                  <SkeletonShimmer width={16} height={16} borderRadius={8} />
                </View>
              ))}
            </ScrollView>
          </View>

          {/* Average Section Skeleton */}
          <View style={styles.averageSection}>
            <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 6 }}>
              <Clock size={18} color="#E5E7EB" />
              <Text style={[styles.averageLabel, { color: '#E5E7EB' }]}>Average Punch-In Time</Text>
            </View>
            <SkeletonShimmer width={100} height={32} borderRadius={8} style={{ marginBottom: 4 }} />
            <SkeletonShimmer width={200} height={12} borderRadius={6} />
          </View>

          {/* Search Section Skeleton */}
          <View style={styles.searchContainer}>
            <View style={styles.searchInputContainer}>
              <Search size={20} color="#E5E7EB" />
              <View style={styles.searchInput}>
                <SkeletonShimmer width={180} height={16} borderRadius={8} />
              </View>
            </View>
            <View style={styles.filterButton}>
              <Filter size={16} color="#E5E7EB" />
            </View>
          </View>

          {/* Employee List Skeleton */}
          <View style={styles.employeeList}>
            {Array.from({ length: 4 }, (_, i) => (
              <SkeletonEmployeeCard key={i} />
            ))}
          </View>
        </ScrollView>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
    paddingBottom: 10,
    paddingTop: 44,
  },
  headerTitle: {
    flex: 1,
    fontSize: 20,
    color: '#242524FF',
    fontWeight: '600',
    textAlign: 'center',
    marginLeft: 10,
  },
  profileAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  profileAvatarText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  content: {
    flex: 1,
  },
  dateSection: {
    backgroundColor: '#fff',
    marginHorizontal: 20,
    marginTop: 16,
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  dateHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  dayButton: {
    borderRadius: 20,
    marginHorizontal: 4,
    padding: 8,
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: 36,
    minHeight: 36,
    position: 'relative',
  },
  averageSection: {
    backgroundColor: '#fff',
    marginHorizontal: 20,
    marginTop: 16,
    borderRadius: 12,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  averageLabel: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    color: '#6b7280',
    marginLeft: 6,
  },
  searchContainer: {
    flex: 1,
    paddingVertical: 14,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginHorizontal: 20,
  },
  searchInputContainer: {
    width: '83%',
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#EBEBEAFF',
    borderRadius: 10,
    paddingHorizontal: 12,
    gap: 6,
    borderColor: '#EBEBEAFF',
    borderWidth: 1,
    height: 48,
  },
  searchInput: {
    flex: 1,
    justifyContent: 'center',
  },
  filterButton: {
    padding: 14,
    backgroundColor: '#FFFFFFFF',
    borderWidth: 1,
    borderColor: '#EBEBEAFF',
    borderRadius: 8,
  },
  employeeList: {
    paddingHorizontal: 20,
    paddingTop: 14,
    paddingBottom: 20,
  },
  employeeCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  employeeHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  employeeInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  employeeDetails: {
    flex: 1,
    marginLeft: 12,
  },
  attendanceInfo: {
    marginBottom: 12,
  },
  timeRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  timeItem: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  durationRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  timeLabel: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#6b7280',
    marginRight: 8,
  },
  viewDetailsButton: {
    alignSelf: 'flex-end',
  },
});