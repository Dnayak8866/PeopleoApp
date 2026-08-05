import { Colors } from '@/constants/Colors';
import { Avatar } from '@/components/Avatar';
import EmployeeListIllustration from '@/components/illustrations/EmployeeListIllustration';
import Checkbox from 'expo-checkbox';
import { useFocusEffect, useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { LinearGradient } from 'expo-linear-gradient';
import {
  Bell,
  Edit,
  Mail,
  MessageSquare,
  Phone,
  Search,
  SearchX,
  Trash2,
  UserPlus,
  Users,
  ChevronRight,
} from 'lucide-react-native';
import React, { useEffect, useState, useRef } from 'react';
import {
  Alert,
  Animated,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  Dimensions,
  Platform,
} from 'react-native';
import { getEmployees, deleteEmployee } from '../../services/api/employees';
import { getPositionNameById } from '@/utils/utils';
import { useAuth } from '@/context/AuthContext';
import { useMasterDataContext } from '@/context/MasterDataContext';
import { showSuccessToast, showErrorToast } from '@/services/toast';
import * as Linking from 'expo-linking';
import { useTheme } from '@/context/ThemeContext';
import { SafeAreaView } from 'react-native-safe-area-context';

const { width } = Dimensions.get('window');

interface Employee {
  id: string;
  fullName: string;
  phoneNumber: string;
  email: string;
  designationId: number;
  avatar?: string;
  initials?: string;
  backgroundColor?: string;
}

const SkeletonItem = () => {
  const animatedValue = useRef(new Animated.Value(0)).current;
  const { isDarkMode, colors } = useTheme();

  useEffect(() => {
    const startAnimation = () => {
      Animated.sequence([
        Animated.timing(animatedValue, {
          toValue: 1,
          duration: 800,
          useNativeDriver: true,
        }),
        Animated.timing(animatedValue, {
          toValue: 0,
          duration: 800,
          useNativeDriver: true,
        }),
      ]).start(() => startAnimation());
    };

    startAnimation();
  }, []);

  const opacity = animatedValue.interpolate({
    inputRange: [0, 1],
    outputRange: [0.3, 0.7],
  });

  const skeletonFill = isDarkMode ? '#1E293B' : '#E5E7EB';

  return (
    <View style={[styles.employeeCard, { backgroundColor: colors.card, borderColor: colors.border, flexDirection: 'column', alignItems: 'stretch', padding: 16 }]}>
      <View style={{ flexDirection: 'row', alignItems: 'center' }}>
        <Animated.View style={[styles.skeletonCheckbox, { backgroundColor: skeletonFill, opacity }]} />
        <Animated.View style={[styles.skeletonAvatar, { backgroundColor: skeletonFill, opacity }]} />
        <View style={styles.employeeInfo}>
          <Animated.View style={[styles.skeletonName, { backgroundColor: skeletonFill, opacity }]} />
          <Animated.View style={[styles.skeletonPosition, { backgroundColor: skeletonFill, opacity }]} />
        </View>
      </View>
      <View style={[styles.divider, { backgroundColor: colors.border }]} />
      <View style={[styles.actionButtons, { justifyContent: 'space-between', marginTop: 12, paddingHorizontal: 4 }]}>
        {[...Array(5)].map((_, index) => (
          <Animated.View key={index} style={[styles.skeletonActionButton, { backgroundColor: skeletonFill, opacity }]} />
        ))}
      </View>
    </View>
  );
};

export default function EmployeesScreen() {
  const [searchText, setSearchText] = useState('');
  const [selectedEmployees, setSelectedEmployees] = useState<Set<string>>(new Set());
  const [selectAll, setSelectAll] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [employees, setEmployees] = useState<Employee[]>([]);
  const router = useRouter();
  const { isDarkMode, colors } = useTheme();
  const { userDetails } = useAuth();
  const { designations } = useMasterDataContext();

  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(20)).current;

  useFocusEffect(
    React.useCallback(() => {
      let isActive = true;
      setIsLoading(true);
      getEmployees()
        .then((data) => {
          if (isActive && Array.isArray(data)) {
            setEmployees(data);
          } else if (isActive) {
            setEmployees([]);
          }
        })
        .catch((error) => {
          setEmployees([]);
        })
        .finally(() => {
          if (isActive) setIsLoading(false);
        });
      return () => {
        isActive = false;
      };
    }, [])
  );

  useEffect(() => {
    if (!isLoading) {
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
  }, [isLoading]);

  const filteredEmployees = employees.filter(employee =>
    employee?.fullName?.toLowerCase()?.includes(searchText?.toLowerCase())
  );

  const toggleSelectAll = () => {
    if (selectAll) {
      setSelectedEmployees(new Set());
    } else {
      setSelectedEmployees(new Set(filteredEmployees.map(emp => emp.id)));
    }
    setSelectAll(!selectAll);
  };

  const toggleEmployeeSelection = (employeeId: string) => {
    const newSelected = new Set(selectedEmployees);
    if (newSelected.has(employeeId)) {
      newSelected.delete(employeeId);
    } else {
      newSelected.add(employeeId);
    }
    setSelectedEmployees(newSelected);
    setSelectAll(newSelected.size === filteredEmployees.length);
  };

  const handleCall = (employee: Employee) => {
    Linking.openURL(`tel:${employee.phoneNumber}`);
  };

  const handleMessage = (employee: Employee) => {
    Linking.openURL(`sms:${employee.phoneNumber}`);
  };

  const handleEmail = (employee: Employee) => {
    Linking.openURL(`mailto:${employee.email}`);
  };

  const handleDelete = (employee: Employee) => {
    Alert.alert(
      'Delete Employee',
      `Are you sure you want to delete ${employee.fullName}?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              await deleteEmployee(employee.id);
              setEmployees((prev) => prev.filter((e) => e.id !== employee.id));
              showSuccessToast('Deleted', `${employee.fullName} has been removed`);
            } catch (error) {
              console.error('Failed to delete employee:', error);
              showErrorToast('Error', 'Failed to delete employee. Please try again.');
            }
          },
        },
      ]
    );
  };

  const handleAddEmployee = () => {
    router.push('/employee/add');
  };

  const renderAvatar = (employee: Employee) => {
    if (employee?.avatar) {
      return (
        <Image
          source={{ uri: employee.avatar }}
          style={styles.avatar}
        />
      );
    }

    return (
      <Avatar
        fullName={employee.fullName}
        backgroundColor={employee.backgroundColor}
        style={styles.avatarPlaceholder}
      />
    );
  };

  const renderEmployeeList = () => {
    if (isLoading) {
      return (
        <View style={styles.listPadding}>
          <View style={styles.skeletonSelectAllRow}>
            <View style={styles.skeletonCheckbox} />
            <View style={styles.skeletonSelectAllText} />
          </View>
          {[...Array(4)].map((_, index) => (
            <SkeletonItem key={index} />
          ))}
        </View>
      );
    }

    if (filteredEmployees.length === 0) {
      const isSearching = searchText.length > 0;
      return (
        <View style={styles.noEmployeesContainer}>
          <View style={styles.noEmployeesIllustration}>
            <EmployeeListIllustration width={200} height={140} />
          </View>
          <Text style={[styles.emptyStateTitle, { color: colors.textPrimary }]}>
            {isSearching ? 'No match found' : 'No employees yet'}
          </Text>
          <Text style={[styles.emptyStateSubtitle, { color: colors.textSecondary }]}>
            {isSearching
              ? `We couldn't find any employees matching "${searchText}". Try another search term.`
              : "It looks like you haven't added any employees yet. Build your workspace team now!"}
          </Text>
          {!isSearching && (
            <TouchableOpacity style={styles.emptyStateButton} onPress={handleAddEmployee}>
              <Text style={styles.emptyStateButtonText}>Add First Employee</Text>
            </TouchableOpacity>
          )}
        </View>
      );
    }

    return (
      <Animated.View style={[styles.listPadding, { opacity: fadeAnim, transform: [{ translateY: slideAnim }] }]}>
        <View style={styles.selectAllContainer}>
          <Checkbox
            style={styles.checkbox}
            value={selectAll}
            onValueChange={toggleSelectAll}
            color={selectAll ? '#6366f1' : undefined}
          />
          <Text style={styles.selectAllText}>
            Select All ({selectedEmployees.size} / {filteredEmployees.length})
          </Text>
        </View>

        {filteredEmployees?.map((employee) => {
          const isSelected = selectedEmployees.has(employee.id);
          return (
            <View
              key={employee.id}
              style={[
                styles.employeeCard,
                { backgroundColor: colors.card, borderColor: colors.border },
                isSelected && styles.employeeCardSelected,
                { flexDirection: 'column', alignItems: 'stretch', padding: 16 }
              ]}
            >
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <Checkbox
                  style={styles.checkbox}
                  value={isSelected}
                  onValueChange={() => toggleEmployeeSelection(employee.id)}
                  color={isSelected ? colors.primary : undefined}
                />

                <TouchableOpacity
                  style={[styles.profileTapArea, { marginLeft: 12 }]}
                  onPress={() => router.push({ pathname: '/employee/[id]', params: { id: employee.id } })}
                  activeOpacity={0.7}
                >
                  {renderAvatar(employee)}

                  <View style={styles.employeeInfo}>
                    <Text style={[styles.employeeName, { color: colors.textPrimary }]} numberOfLines={1}>
                      {employee.fullName}
                    </Text>
                    <View style={[styles.designationBadge, { backgroundColor: isDarkMode ? '#1E293B' : '#F1F5F9' }]}>
                      <Text style={[styles.designationText, { color: colors.textSecondary }]} numberOfLines={1}>
                        {getPositionNameById(employee.designationId, designations)}
                      </Text>
                    </View>
                  </View>
                </TouchableOpacity>
              </View>

              <View style={[styles.divider, { backgroundColor: colors.border }]} />

              <View style={[styles.actionButtons, { justifyContent: 'space-between', marginTop: 12, paddingHorizontal: 4 }]}>
                <TouchableOpacity
                  style={[styles.actionButton, { backgroundColor: isDarkMode ? '#1E1B4B' : '#EEF2FF', flex: 1, height: 32, borderRadius: 8, flexDirection: 'row', gap: 6, marginHorizontal: 2 }]}
                  onPress={() => handleCall(employee)}
                  hitSlop={{ top: 8, bottom: 8, left: 6, right: 6 }}
                >
                  <Phone size={13} color={colors.primary} />
                  <Text style={{ fontSize: 11, fontWeight: '700', color: colors.primary }}>Call</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[styles.actionButton, { backgroundColor: isDarkMode ? '#064E3B' : '#ECFDF5', flex: 1, height: 32, borderRadius: 8, flexDirection: 'row', gap: 6, marginHorizontal: 2 }]}
                  onPress={() => handleMessage(employee)}
                  hitSlop={{ top: 8, bottom: 8, left: 6, right: 6 }}
                >
                  <MessageSquare size={13} color="#10B981" />
                  <Text style={{ fontSize: 11, fontWeight: '700', color: '#10B981' }}>SMS</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[styles.actionButton, { backgroundColor: isDarkMode ? '#78350F' : '#FFFBEB', flex: 1, height: 32, borderRadius: 8, flexDirection: 'row', gap: 6, marginHorizontal: 2 }]}
                  onPress={() => handleEmail(employee)}
                  hitSlop={{ top: 8, bottom: 8, left: 6, right: 6 }}
                >
                  <Mail size={13} color="#F59E0B" />
                  <Text style={{ fontSize: 11, fontWeight: '700', color: '#F59E0B' }}>Email</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[styles.actionButton, { backgroundColor: isDarkMode ? '#1E293B' : '#F1F5F9', flex: 1, height: 32, borderRadius: 8, flexDirection: 'row', gap: 6, marginHorizontal: 2 }]}
                  onPress={() => router.push({ pathname: '/employee/edit', params: { id: employee.id } })}
                  hitSlop={{ top: 8, bottom: 8, left: 6, right: 6 }}
                >
                  <Edit size={13} color={colors.textSecondary} />
                  <Text style={{ fontSize: 11, fontWeight: '700', color: colors.textSecondary }}>Edit</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[styles.actionButton, { backgroundColor: isDarkMode ? '#7F1D1D' : '#FEF2F2', flex: 1, height: 32, borderRadius: 8, flexDirection: 'row', gap: 6, marginHorizontal: 2 }]}
                  onPress={() => handleDelete(employee)}
                  hitSlop={{ top: 8, bottom: 8, left: 6, right: 6 }}
                >
                  <Trash2 size={13} color="#EF4444" />
                  <Text style={{ fontSize: 11, fontWeight: '700', color: '#EF4444' }}>Delete</Text>
                </TouchableOpacity>
              </View>
            </View>
          );
        })}
      </Animated.View>
    );
  };

  return (
    <SafeAreaView style={[styles.outerContainer, { backgroundColor: colors.background }]}>
      <StatusBar style={isDarkMode ? 'light' : 'dark'} />

      {/* Header section with Illustration */}
      <View style={[styles.topSection, { backgroundColor: colors.background }]}>
        <View style={styles.header}>
          <View style={styles.headerTitleContainer}>
            <Text style={[styles.welcomeText, { color: colors.primary }]}>Manage Team</Text>
            <Text style={[styles.headerTitle, { color: colors.textPrimary }]}>Employees</Text>
          </View>
          <View style={styles.headerActions}>
            <TouchableOpacity
              style={[styles.bellButton, { backgroundColor: colors.card, borderColor: colors.border }]}
              onPress={() => router.push('/notifications')}
            >
              <Bell size={22} color={colors.textPrimary} />
              <View style={styles.bellBadge} />
            </TouchableOpacity>
            <Avatar
              fullName={userDetails?.fullName || 'User'}
              size={36}
              uri={userDetails?.avatar}
            />
          </View>
        </View>

        {/* Dynamic welcome illustration in header */}
        <View style={[styles.headerCard, { borderColor: isDarkMode ? 'rgba(129, 140, 248, 0.2)' : 'rgba(99, 102, 241, 0.08)' }]}>
          <LinearGradient
            colors={isDarkMode ? ['#151D30', '#1E1B4B'] : ['#EEF2FF', '#F5F3FF']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.headerCardGradient}
          >
            <View style={styles.headerCardText}>
              <Text style={[styles.cardHeaderTitle, { color: colors.textPrimary }]}>Team Directory</Text>
              <Text style={[styles.cardHeaderDesc, { color: colors.textSecondary }]}>
                Add, manage, and communicate with your team members in one tap.
              </Text>
            </View>
            <View style={styles.headerCardIllustration}>
              <EmployeeListIllustration width={100} height={80} />
            </View>
          </LinearGradient>
        </View>

        {/* Floating Search input */}
        <View style={styles.searchWrapper}>
          <View style={[styles.searchContainer, { backgroundColor: colors.card, borderColor: colors.border }]}>
            <Search size={18} color={colors.textMuted} style={styles.searchIcon} />
            <TextInput
              style={[styles.searchInput, { color: colors.textPrimary }]}
              placeholder="Search by employee name..."
              placeholderTextColor={colors.textMuted}
              value={searchText}
              onChangeText={setSearchText}
              editable={!isLoading}
            />
          </View>
        </View>
      </View>

      {/* Main List */}
      <View style={[styles.listContainer, { backgroundColor: colors.background }]}>
        <ScrollView
          style={styles.scrollView}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          {renderEmployeeList()}
        </ScrollView>

        {!isLoading && (
          <TouchableOpacity style={styles.fab} onPress={handleAddEmployee} activeOpacity={0.85}>
            <LinearGradient
              colors={['#6366f1', '#7c3aed']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.fabGradient}
            >
              <UserPlus size={22} color="#FFFFFF" />
            </LinearGradient>
          </TouchableOpacity>
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  outerContainer: {
    flex: 1,
    backgroundColor: '#FAFBFF',
  },
  topSection: {
    backgroundColor: '#FAFBFF',
    paddingBottom: 8,
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
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
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

  // --- Header Card ---
  headerCard: {
    marginHorizontal: 20,
    borderRadius: 18,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(99, 102, 241, 0.06)',
    marginBottom: 16,
  },
  headerCardGradient: {
    flexDirection: 'row',
    padding: 16,
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  headerCardText: {
    flex: 1.3,
    paddingRight: 8,
  },
  cardHeaderTitle: {
    fontSize: 15,
    fontWeight: '800',
    color: '#1E1B4B',
  },
  cardHeaderDesc: {
    fontSize: 11,
    color: '#64748B',
    marginTop: 4,
    lineHeight: 15,
  },
  headerCardIllustration: {
    flex: 0.7,
    alignItems: 'center',
    justifyContent: 'center',
  },

  // --- Search ---
  searchWrapper: {
    paddingHorizontal: 20,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    paddingHorizontal: 12,
    borderWidth: 1.5,
    borderColor: '#E2E8F0',
    shadowColor: '#6366f1',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.02,
    shadowRadius: 8,
    elevation: 2,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    height: 44,
    fontSize: 14,
    color: '#1E293B',
    fontWeight: '500',
  },

  // --- Main List Container ---
  listContainer: {
    flex: 1,
    backgroundColor: '#FAFBFF',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 100, // Extra space for FAB
  },
  listPadding: {
    paddingHorizontal: 20,
    paddingTop: 8,
  },

  // --- Select All ---
  selectAllContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 4,
    marginBottom: 8,
  },
  checkbox: {
    width: 18,
    height: 18,
    borderRadius: 5,
    borderWidth: 1.5,
    borderColor: '#CBD5E1',
  },
  selectAllText: {
    fontSize: 13,
    color: '#475569',
    fontWeight: '700',
    marginLeft: 12,
  },

  // --- Employee Card ---
  employeeCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#F1F5F9',
    shadowColor: '#6366f1',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.03,
    shadowRadius: 12,
    elevation: 3,
  },
  employeeCardSelected: {
    borderColor: '#C7D2FE',
    backgroundColor: '#FAF5FF80',
  },
  profileTapArea: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  avatar: {
    width: 44,
    height: 44,
    borderRadius: 14,
  },
  avatarPlaceholder: {
    width: 44,
    height: 44,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  employeeInfo: {
    flex: 1,
    marginLeft: 12,
  },
  employeeName: {
    fontSize: 15,
    fontWeight: '800',
    color: '#1E293B',
    marginBottom: 4,
  },
  designationBadge: {
    alignSelf: 'flex-start',
    backgroundColor: '#EEF2FF',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 6,
  },
  designationText: {
    fontSize: 10,
    color: '#6366f1',
    fontWeight: '700',
  },
  divider: {
    height: 1,
    backgroundColor: '#F1F5F9',
    marginTop: 12,
  },

  // --- Actions ---
  actionButtons: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  actionButton: {
    justifyContent: 'center',
    alignItems: 'center',
  },

  // --- FAB ---
  fab: {
    position: 'absolute',
    right: 20,
    bottom: 60,
    borderRadius: 20,
    shadowColor: '#6366f1',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.35,
    shadowRadius: 12,
    elevation: 8,
    overflow: 'hidden',
  },
  fabGradient: {
    width: 52,
    height: 52,
    justifyContent: 'center',
    alignItems: 'center',
  },

  // --- Empty State ---
  noEmployeesContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 60,
    paddingHorizontal: 40,
  },
  noEmployeesIllustration: {
    marginBottom: 20,
    alignItems: 'center',
  },
  emptyStateTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#1E1B4B',
    textAlign: 'center',
  },
  emptyStateSubtitle: {
    fontSize: 13,
    color: '#64748B',
    marginTop: 8,
    textAlign: 'center',
    lineHeight: 18,
    marginBottom: 20,
  },
  emptyStateButton: {
    backgroundColor: '#6366f1',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 12,
  },
  emptyStateButtonText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '700',
  },

  // --- Skeletons ---
  skeletonSelectAllRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 4,
    marginBottom: 8,
  },
  skeletonCheckbox: {
    width: 18,
    height: 18,
    backgroundColor: '#E2E8F0',
    borderRadius: 5,
  },
  skeletonSelectAllText: {
    height: 14,
    backgroundColor: '#E2E8F0',
    borderRadius: 4,
    width: 100,
    marginLeft: 12,
  },
  skeletonAvatar: {
    width: 44,
    height: 44,
    backgroundColor: '#E2E8F0',
    borderRadius: 14,
    marginLeft: 12,
  },
  skeletonName: {
    height: 14,
    backgroundColor: '#E2E8F0',
    borderRadius: 4,
    marginBottom: 6,
    width: '75%',
  },
  skeletonPosition: {
    height: 12,
    backgroundColor: '#E2E8F0',
    borderRadius: 4,
    width: '50%',
  },
  skeletonActionButton: {
    width: 28,
    height: 28,
    backgroundColor: '#E2E8F0',
    borderRadius: 8,
  },
});