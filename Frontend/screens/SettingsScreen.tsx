import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Switch,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { ChevronLeft, ChevronRight, Bell, Shield, Moon, Globe, HelpCircle, FileText } from 'lucide-react-native';
import SettingsIllustration from '@/components/illustrations/SettingsIllustration';
import { LinearGradient } from 'expo-linear-gradient';
import { StatusBar } from 'expo-status-bar';

export default function SettingsScreen() {
  const router = useRouter();

  // Settings states
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [biometricsEnabled, setBiometricsEnabled] = useState(false);
  const [darkModeEnabled, setDarkModeEnabled] = useState(false);

  const SettingRow = ({ icon: Icon, label, value, type, onValueChange, subText }: any) => (
    <View style={styles.settingRow}>
      <View style={styles.settingRowLeft}>
        <View style={styles.iconWrapper}>
          <Icon size={18} color="#6366f1" />
        </View>
        <View style={styles.settingTextWrapper}>
          <Text style={styles.settingLabel}>{label}</Text>
          {subText && <Text style={styles.settingSubtext}>{subText}</Text>}
        </View>
      </View>

      {type === 'switch' ? (
        <Switch
          value={value}
          onValueChange={onValueChange}
          trackColor={{ false: '#CBD5E1', true: '#C7D2FE' }}
          thumbColor={value ? '#6366f1' : '#F1F5F9'}
          ios_backgroundColor="#CBD5E1"
        />
      ) : (
        <View style={styles.settingRowRight}>
          {value && <Text style={styles.settingValueText}>{value}</Text>}
          <ChevronRight size={16} color="#94A3B8" />
        </View>
      )}
    </View>
  );

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
          <Text style={styles.headerTitle}>Settings</Text>
        </View>
      </View>

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
              <Text style={styles.welcomeQuote}>App Preferences</Text>
              <Text style={styles.ownerName}>Control</Text>
              <Text style={styles.welcomeDesc}>
                Customize notifications, toggle biometric authentication, and configure display parameters.
              </Text>
            </View>
            <View style={styles.illustrationWrapper}>
              <SettingsIllustration width={110} height={90} />
            </View>
          </LinearGradient>
        </View>

        {/* Account settings */}
        <Text style={styles.sectionTitle}>Account & Security</Text>
        <View style={styles.settingsCard}>
          <SettingRow
            icon={Bell}
            label="Push Notifications"
            subText="Get check-in alerts and leave updates"
            type="switch"
            value={notificationsEnabled}
            onValueChange={setNotificationsEnabled}
          />
          <View style={styles.divider} />
          <SettingRow
            icon={Shield}
            label="Biometric Login"
            subText="Use fingerprint or face scanner to unlock"
            type="switch"
            value={biometricsEnabled}
            onValueChange={setBiometricsEnabled}
          />
        </View>

        {/* Preferences settings */}
        <Text style={styles.sectionTitle}>App Preferences</Text>
        <View style={styles.settingsCard}>
          <SettingRow
            icon={Moon}
            label="Dark Mode"
            subText="Toggle display contrast themes"
            type="switch"
            value={darkModeEnabled}
            onValueChange={setDarkModeEnabled}
          />
          <View style={styles.divider} />
          <TouchableOpacity activeOpacity={0.7}>
            <SettingRow
              icon={Globe}
              label="App Language"
              value="English"
              type="link"
            />
          </TouchableOpacity>
        </View>

        {/* Support & Legal */}
        <Text style={styles.sectionTitle}>Support & Legal</Text>
        <View style={styles.settingsCard}>
          <TouchableOpacity activeOpacity={0.7}>
            <SettingRow
              icon={HelpCircle}
              label="Help & FAQ Support"
              type="link"
            />
          </TouchableOpacity>
          <View style={styles.divider} />
          <TouchableOpacity activeOpacity={0.7}>
            <SettingRow
              icon={FileText}
              label="Privacy Policy"
              type="link"
            />
          </TouchableOpacity>
          <View style={styles.divider} />
          <TouchableOpacity activeOpacity={0.7}>
            <SettingRow
              icon={FileText}
              label="Terms of Service"
              type="link"
            />
          </TouchableOpacity>
        </View>
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

  // --- Section Titles ---
  sectionTitle: {
    fontSize: 12,
    fontWeight: '700',
    color: '#64748B',
    textTransform: 'uppercase',
    letterSpacing: 0.8,
    marginBottom: 10,
    marginTop: 20,
    paddingHorizontal: 2,
  },

  // --- Settings Card ---
  settingsCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 22,
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderWidth: 1,
    borderColor: '#F1F5F9',
    shadowColor: '#6366f1',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.02,
    shadowRadius: 12,
    elevation: 2,
  },
  settingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
  },
  settingRowLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    marginRight: 10,
  },
  iconWrapper: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: '#EEF2FF',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  settingTextWrapper: {
    flex: 1,
  },
  settingLabel: {
    fontSize: 14,
    fontWeight: '700',
    color: '#1E293B',
  },
  settingSubtext: {
    fontSize: 11,
    color: '#64748B',
    fontWeight: '500',
    marginTop: 2,
  },
  settingRowRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  settingValueText: {
    fontSize: 12,
    color: '#64748B',
    fontWeight: '600',
  },
  divider: {
    height: 1,
    backgroundColor: '#F1F5F9',
    width: '100%',
  },
});
