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
import { useTheme } from '@/context/ThemeContext';

export default function SettingsScreen() {
  const router = useRouter();
  const { isDarkMode, toggleDarkMode, colors } = useTheme();

  // Settings states
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [biometricsEnabled, setBiometricsEnabled] = useState(false);

  const SettingRow = ({ icon: Icon, label, value, type, onValueChange, subText }: any) => (
    <View style={styles.settingRow}>
      <View style={styles.settingRowLeft}>
        <View style={[styles.iconWrapper, { backgroundColor: isDarkMode ? '#1E1B4B' : '#EEF2FF' }]}>
          <Icon size={18} color={colors.primary} />
        </View>
        <View style={styles.settingTextWrapper}>
          <Text style={[styles.settingLabel, { color: colors.textPrimary }]}>{label}</Text>
          {subText && <Text style={[styles.settingSubtext, { color: colors.textSecondary }]}>{subText}</Text>}
        </View>
      </View>

      {type === 'switch' ? (
        <Switch
          value={value}
          onValueChange={onValueChange}
          trackColor={{ false: isDarkMode ? '#334155' : '#CBD5E1', true: isDarkMode ? '#6366F1' : '#C7D2FE' }}
          thumbColor={value ? (isDarkMode ? '#818CF8' : '#6366f1') : (isDarkMode ? '#64748B' : '#F1F5F9')}
          ios_backgroundColor="#CBD5E1"
        />
      ) : (
        <View style={styles.settingRowRight}>
          {value && <Text style={[styles.settingValueText, { color: colors.textSecondary }]}>{value}</Text>}
          <ChevronRight size={16} color={colors.textMuted} />
        </View>
      )}
    </View>
  );

  return (
    <SafeAreaView style={[styles.safeContainer, { backgroundColor: colors.background }]}>
      <StatusBar style={isDarkMode ? 'light' : 'dark'} />
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={[styles.backButton, { backgroundColor: colors.card, borderColor: colors.border }]}
          onPress={() => router.back()}
          hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
        >
          <ChevronLeft size={22} color={colors.textPrimary} />
        </TouchableOpacity>
        <View style={styles.headerTitleContainer}>
          <Text style={[styles.headerTitle, { color: colors.textPrimary }]}>Settings</Text>
        </View>
      </View>

      <ScrollView
        style={styles.container}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
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
              <Text style={[styles.welcomeQuote, { color: colors.primary }]}>App Preferences</Text>
              <Text style={[styles.ownerName, { color: colors.textPrimary }]}>Control</Text>
              <Text style={[styles.welcomeDesc, { color: colors.textSecondary }]}>
                Customize notifications, toggle biometric authentication, and configure display parameters.
              </Text>
            </View>
            <View style={styles.illustrationWrapper}>
              <SettingsIllustration width={110} height={90} />
            </View>
          </LinearGradient>
        </View>

        {/* Account settings */}
        <Text style={[styles.sectionTitle, { color: colors.textSecondary }]}>Account & Security</Text>
        <View style={[styles.settingsCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <SettingRow
            icon={Bell}
            label="Push Notifications"
            subText="Get check-in alerts and leave updates"
            type="switch"
            value={notificationsEnabled}
            onValueChange={setNotificationsEnabled}
          />
          <View style={[styles.divider, { backgroundColor: colors.border }]} />
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
        <Text style={[styles.sectionTitle, { color: colors.textSecondary }]}>App Preferences</Text>
        <View style={[styles.settingsCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <SettingRow
            icon={Moon}
            label="Dark Mode"
            subText="Toggle display contrast themes"
            type="switch"
            value={isDarkMode}
            onValueChange={toggleDarkMode}
          />
          <View style={[styles.divider, { backgroundColor: colors.border }]} />
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
        <Text style={[styles.sectionTitle, { color: colors.textSecondary }]}>Support & Legal</Text>
        <View style={[styles.settingsCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <TouchableOpacity activeOpacity={0.7}>
            <SettingRow
              icon={HelpCircle}
              label="Help & FAQ Support"
              type="link"
            />
          </TouchableOpacity>
          <View style={[styles.divider, { backgroundColor: colors.border }]} />
          <TouchableOpacity activeOpacity={0.7}>
            <SettingRow
              icon={FileText}
              label="Privacy Policy"
              type="link"
            />
          </TouchableOpacity>
          <View style={[styles.divider, { backgroundColor: colors.border }]} />
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
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1.5,
  },
  headerTitleContainer: {
    flex: 1,
    marginLeft: 14,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '800',
  },

  // --- Welcome Card ---
  welcomeCard: {
    borderRadius: 22,
    overflow: 'hidden',
    borderWidth: 1,
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
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  ownerName: {
    fontSize: 24,
    fontWeight: '800',
    marginVertical: 2,
  },
  welcomeDesc: {
    fontSize: 11,
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
    textTransform: 'uppercase',
    letterSpacing: 0.8,
    marginBottom: 10,
    marginTop: 20,
    paddingHorizontal: 2,
  },

  // --- Settings Card ---
  settingsCard: {
    borderRadius: 22,
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderWidth: 1,
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
  },
  settingSubtext: {
    fontSize: 11,
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
    fontWeight: '600',
  },
  divider: {
    height: 1,
    width: '100%',
  },
});
