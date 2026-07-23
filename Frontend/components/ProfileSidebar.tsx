import React, { useEffect, useRef } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Modal,
  Animated,
  Dimensions,
  TouchableWithoutFeedback,
  StyleSheet,
  Platform,
  ScrollView,
} from 'react-native';
import { Settings, Lock, LogOut, ChevronRight, User, ChevronLeft } from 'lucide-react-native';
import { Avatar } from './Avatar';
import { useRouter } from 'expo-router';
import { BlurView } from 'expo-blur';
import { LinearGradient } from 'expo-linear-gradient';
import ProfileIllustration from './illustrations/ProfileIllustration';

const { width, height } = Dimensions.get('window');

interface ProfileSidebarProps {
  isVisible: boolean;
  onClose: () => void;
  userDetails: any;
  onLogout: () => void;
}

export const ProfileSidebar: React.FC<ProfileSidebarProps> = ({
  isVisible,
  onClose,
  userDetails,
  onLogout,
}) => {
  const router = useRouter();
  const slideAnim = useRef(new Animated.Value(width)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (isVisible) {
      Animated.parallel([
        Animated.timing(slideAnim, {
          toValue: 0,
          duration: 350,
          useNativeDriver: true,
        }),
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 350,
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      Animated.parallel([
        Animated.timing(slideAnim, {
          toValue: width,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.timing(fadeAnim, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [isVisible]);

  const handleLogout = () => {
    onClose();
    onLogout();
  };

  const MenuItem = ({ label, icon: Icon, color, bg, onPress }: any) => (
    <TouchableOpacity style={styles.menuItem} onPress={onPress} activeOpacity={0.7}>
      <View style={[styles.iconContainer, { backgroundColor: bg }]}>
        <Icon size={20} color={color} />
      </View>
      <Text style={[styles.menuItemText, label === 'Logout' && styles.logoutText]}>{label}</Text>
      <ChevronRight size={16} color="#94A3B8" style={styles.menuItemChevron} />
    </TouchableOpacity>
  );

  return (
    <Modal
      transparent
      visible={isVisible}
      animationType="none"
      onRequestClose={onClose}
      statusBarTranslucent={true}
    >
      <View style={styles.overlay}>
        {/* Backdrop overlay fades in */}
        <TouchableWithoutFeedback onPress={onClose}>
          <Animated.View style={[styles.backdrop, { opacity: fadeAnim }]} />
        </TouchableWithoutFeedback>

        {/* Sidebar Container slides in from right */}
        <Animated.View
          style={[
            styles.sidebarContainer,
            { transform: [{ translateX: slideAnim }] },
          ]}
        >
          {/* Glass blur background on iOS */}
          {Platform.OS === 'ios' && (
            <BlurView intensity={90} style={StyleSheet.absoluteFill} tint="light" />
          )}

          {/* Close button at the top */}
          <TouchableOpacity
            style={styles.closeButton}
            onPress={onClose}
            hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
          >
            <View style={styles.closeIconWrapper}>
              <ChevronLeft size={20} color="#6366f1" />
            </View>
          </TouchableOpacity>

          <ScrollView
            style={styles.scrollView}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.scrollContent}
          >
            {/* Header profile details */}
            <View style={styles.profileSection}>
              <View style={styles.avatarBorder}>
                <Avatar
                  fullName={userDetails?.fullName || 'User'}
                  size={84}
                  uri={userDetails?.avatar}
                />
              </View>
              <Text style={styles.userName} numberOfLines={1}>
                {userDetails?.fullName || 'Employee'}
              </Text>
              <View style={styles.roleBadge}>
                <Text style={styles.userRole}>
                  {userDetails?.role || 'Team Member'}
                </Text>
              </View>
            </View>

            {/* Gradient Illustration Divider Card */}
            <View style={styles.welcomeCard}>
              <LinearGradient
                colors={['#EEF2FF', '#F5F3FF']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.welcomeGradient}
              >
                <View style={styles.welcomeTextContainer}>
                  <Text style={styles.welcomeQuote}>Workspace Details</Text>
                  <Text style={styles.welcomeDesc}>
                    Review status, edit profile details, or configure settings.
                  </Text>
                </View>
                <View style={styles.illustrationWrapper}>
                  <ProfileIllustration width={90} height={70} />
                </View>
              </LinearGradient>
            </View>

            {/* List links */}
            <View style={styles.menuItems}>
              <MenuItem
                label="Edit Profile"
                icon={User}
                color="#6366f1"
                bg="#EEF2FF"
                onPress={() => {
                  onClose();
                  router.push({
                    pathname: '/employee/edit',
                    params: { id: userDetails?.id }
                  });
                }}
              />
              <MenuItem
                label="Settings"
                icon={Settings}
                color="#8B5CF6"
                bg="#F5F3FF"
                onPress={() => {
                  onClose();
                  router.push('/settings');
                }}
              />
              <MenuItem
                label="Reset Password"
                icon={Lock}
                color="#3B82F6"
                bg="#EFF6FF"
                onPress={() => {
                  onClose();
                  router.push('/reset-password');
                }}
              />
              <MenuItem
                label="Logout"
                icon={LogOut}
                color="#EF4444"
                bg="#FEF2F2"
                onPress={handleLogout}
              />
            </View>

            {/* Version Footer */}
            <View style={styles.footer}>
              <Text style={styles.versionText}>Version 1.0.0</Text>
            </View>
          </ScrollView>
        </Animated.View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    flexDirection: 'row',
  },
  backdrop: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(30, 27, 75, 0.4)',
  },
  sidebarContainer: {
    width: width * 0.78,
    backgroundColor: Platform.OS === 'ios' ? 'rgba(255, 255, 255, 0.85)' : '#FFFFFF',
    height: '100%',
    marginLeft: 'auto',
    borderTopLeftRadius: 30,
    borderBottomLeftRadius: 30,
    shadowColor: '#1E1B4B',
    shadowOffset: { width: -10, height: 0 },
    shadowOpacity: 0.1,
    shadowRadius: 24,
    elevation: 10,
    overflow: 'hidden',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: Platform.OS === 'ios' ? 90 : 80,
    paddingBottom: 40,
  },
  closeButton: {
    position: 'absolute',
    top: Platform.OS === 'ios' ? 44 : 36,
    left: 20,
    zIndex: 100,
  },
  closeIconWrapper: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: '#F1F5F9',
    shadowColor: '#6366f1',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 6,
    elevation: 2,
  },

  // --- Profile Section ---
  profileSection: {
    alignItems: 'center',
    marginBottom: 24,
  },
  avatarBorder: {
    borderWidth: 3.5,
    borderColor: '#EEF2FF',
    borderRadius: 50,
    padding: 2.5,
    marginBottom: 12,
    shadowColor: '#6366f1',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
  },
  userName: {
    fontSize: 18,
    fontWeight: '800',
    color: '#1E1B4B',
    marginBottom: 4,
  },
  roleBadge: {
    backgroundColor: '#F1F5F9',
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: 6,
  },
  userRole: {
    fontSize: 11,
    color: '#64748B',
    fontWeight: '700',
    textTransform: 'uppercase',
  },

  // --- Welcome Card ---
  welcomeCard: {
    borderRadius: 18,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(99, 102, 241, 0.08)',
    marginBottom: 24,
  },
  welcomeGradient: {
    flexDirection: 'row',
    padding: 14,
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  welcomeTextContainer: {
    flex: 1.2,
    paddingRight: 6,
  },
  welcomeQuote: {
    fontSize: 10,
    color: '#6366f1',
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  welcomeDesc: {
    fontSize: 10,
    color: '#64748B',
    lineHeight: 14,
    marginTop: 2,
  },
  illustrationWrapper: {
    flex: 0.8,
    alignItems: 'center',
    justifyContent: 'center',
  },

  // --- Menu List ---
  menuItems: {
    gap: 6,
    marginBottom: 20,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 8,
    borderRadius: 14,
  },
  iconContainer: {
    width: 38,
    height: 38,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 14,
  },
  menuItemText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#334155',
  },
  logoutText: {
    color: '#EF4444',
  },
  menuItemChevron: {
    marginLeft: 'auto',
  },

  // --- Footer ---
  footer: {
    alignItems: 'center',
    marginTop: 20,
  },
  versionText: {
    fontSize: 9,
    color: '#94A3B8',
    fontWeight: '800',
    letterSpacing: 1,
    textTransform: 'uppercase',
  },
});
