import { Colors } from '@/constants/Colors';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { Bell, LocateFixed, Pointer } from 'lucide-react-native';
import React from 'react';
import { SafeAreaView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export default function ClockInScreen() {
  const currentTime = new Date();
  const router = useRouter()
  const timeString = currentTime.toLocaleTimeString('en-US', { 
    hour: '2-digit', 
    minute: '2-digit',
    hour12: true 
  });
  const dateString = currentTime.toLocaleDateString('en-US', { 
    weekday: 'long', 
    month: 'short',
    day: 'numeric'
  });

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.greeting}>Hello, John Doe!</Text>
        </View>
        <View style={styles.headerIcons}>
          <TouchableOpacity style={styles.iconButton}>
            <Bell size={24} color="#666" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.avatar} onPress={()=>{router.push('/reports')}}>
            <Text style={styles.avatarText}>JD</Text>
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.timeSection}>
        <Text style={styles.timeText}>{timeString}</Text>
        <Text style={styles.dateText}>{dateString}</Text>
      </View>

      <View style={styles.punchSection}>
        <TouchableOpacity style={styles.punchButton}>
          <LinearGradient
            colors={['#1CC8A5', '#2563EB']}
            style={styles.gradientButton}
            start={{ x: 0.5, y: 0 }}
            end={{ x: 0.5, y: 1 }}>
            <View style={styles.fingerIcon}>
              <Pointer size={90} color="white" />
            </View>
          </LinearGradient>
        </TouchableOpacity>
        <Text style={styles.punchText}>Punch in</Text>
      </View>

      <View style={styles.locationSection}>
        <LocateFixed size={24} color="#888888FF" />
        <Text style={styles.locationText}><Text style={{fontWeight:'bold'}}>Location :</Text>  You are not in Office reach</Text>
      </View>

      <View style={styles.statsSection}>
        <View style={styles.statCard}>
          <View style={styles.progressRing}>
            <View style={[styles.progressCircle, { borderColor: '#3B82F6' }]}>
              <Text style={styles.statNumber}>72%</Text>
            </View>
          </View>
          <Text style={styles.statLabel}>Attendance</Text>
        </View>

        <View style={styles.divider}/>

        <View style={styles.statCard}>
          <View style={styles.progressRing}>
            <View style={[styles.progressCircle, { borderColor: '#8B5CF6' }]}>
              <Text style={styles.statNumber}>03</Text>
            </View>
          </View>
          <Text style={styles.statLabel}>Leave taken</Text>
        </View>
            <View style={styles.divider}/>
        <View style={styles.statCard}>
          <View style={styles.progressRing}>
            <View style={[styles.progressCircle, { borderColor: '#EC4899' }]}>
              <Text style={styles.statNumber}>05</Text>
            </View>
          </View>
          <Text style={styles.statLabel}>Salary Countdown</Text>
        </View>
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
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 44,
    paddingBottom: 10,
    borderBottomColor: '#E5E7EB',
    borderBottomWidth: 1,
    backgroundColor: '#FFFFFF',
    boxShadow:' 0px 0px 1px #171a1f12, 0px 0px 2px #171a1f1F'
  },
  greeting: {
    fontSize: 18,
    fontWeight: '600',
    color: '#111827',
  },
  headerIcons: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  iconButton: {
    padding: 8,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: {
    color: 'white',
    fontWeight: '600',
    fontSize: 16,
  },
  timeSection: {
    alignItems: 'center',
    paddingVertical: 30,
    backgroundColor: Colors.background,
  },
  timeText: {
    fontSize: 48,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 8,
  },
  dateText: {
    fontSize: 18,
    color: '#9CA3AF',
    fontWeight: '500',
  },
  punchSection: {
    alignItems: 'center',
    paddingVertical: 20,
    backgroundColor: Colors.background,
  },
  punchButton: {
    width: 200,
    height: 200,
    borderRadius: 100,
    marginBottom: 16,
    boxShadow: '0px 17px 35px #636AE87D, 0px 0px 2px #636AE81F'
  },
  gradientButton: {
    width: '100%',
    height: '100%',
    borderRadius: 100,
    justifyContent: 'center',
    alignItems: 'center',
  },
  fingerIcon: {
    alignItems: 'center',
  },
  punchText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#111827',
  },
  locationSection: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
    paddingVertical: 14,
    gap: 8,
    backgroundColor: Colors.background,
  },
  locationText: {
    fontSize: 18,
    color: '#9CA3AF',
  },
  statsSection: {
    flexDirection: 'row',
    alignItems : 'center',
    justifyContent: 'space-around',
    paddingHorizontal: 20,
    paddingVertical: 18,
    backgroundColor: '#FFFFFF',
    marginHorizontal: 20,
    borderRadius: 16,
    marginTop: 10,
    boxShadow: '0px 4px 9px #171a1f1C, 0px 0px 2px #171a1f1F'
  },
  statCard: {
    alignItems: 'center',
    minWidth: 90,
  },
  divider : {
    width: 1,
    height: 110,
    backgroundColor: '#E5E7EB',
    alignSelf:'center',
    marginHorizontal: 10,
  },
  progressRing: {
    marginBottom: 12,
  },
  progressCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    borderWidth: 6,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white',
  },
  statNumber: {
    fontSize: 16,
    fontWeight: '700',
    color: '#111827',
  },
  statLabel: {
    fontSize: 14,
    color: '#9CA3AF',
    textAlign: 'center',
  },
});