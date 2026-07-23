import { createEmployee } from '@/services/api/employees';
import { showSuccessToast, showErrorToast } from '@/services/toast';
import { Colors } from '@/constants/Colors';
import DateTimePicker from '@react-native-community/datetimepicker';
import { useRouter } from 'expo-router';
import {
  Briefcase,
  CalendarDays,
  ChevronDown,
  ChevronLeft,
  ChevronUp,
  Clock,
  UserRound,
  Mail,
  Phone,
} from 'lucide-react-native';
import React, { useState } from 'react';
import {
  Alert,
  KeyboardAvoidingView,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  StyleSheet,
  Dimensions,
  Platform,
} from 'react-native';
import { useMasterDataContext } from '@/context/MasterDataContext';
import { useAuth } from '@/context/AuthContext';
import { formatToOptions } from '@/utils/utils';
import { SafeAreaView } from 'react-native-safe-area-context';
import AddEmployeeIllustration from '@/components/illustrations/AddEmployeeIllustration';
import { LinearGradient } from 'expo-linear-gradient';
import { StatusBar } from 'expo-status-bar';

const { width } = Dimensions.get('window');

interface FormData {
  full_name: string;
  phone_number: string;
  email: string;
  gender: string;
  dob: string;
  department_id: string;
  designation_id: string;
  joining_date: string;
  shift_id: string;
}

interface ValidationErrors {
  [key: string]: string;
}

interface DropdownItem {
  id: string;
  value: string;
}

const GENDERS: DropdownItem[] = [
  { value: 'Male', id: 'male' },
  { value: 'Female', id: 'female' },
  { value: 'Other', id: 'other' },
  { value: 'Prefer not to say', id: 'prefer_not_to_say' },
];

export default function AddEmployeeScreen() {
  const router = useRouter();
  const [formData, setFormData] = useState<FormData>({
    full_name: '',
    phone_number: '',
    email: '',
    gender: '',
    dob: '',
    department_id: '',
    designation_id: '',
    joining_date: '',
    shift_id: '',
  });

  const [errors, setErrors] = useState<ValidationErrors>({});
  const [showDepartmentDropdown, setShowDepartmentDropdown] = useState(false);
  const [showDesignationDropdown, setShowDesignationDropdown] = useState(false);
  const [showGenderDropdown, setShowGenderDropdown] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showJoiningDatePicker, setShowJoiningDatePicker] = useState(false);
  const [datePickerDate, setDatePickerDate] = useState(new Date());

  const { designations = [], departments = [], shiftTimings = [] } = useMasterDataContext();
  const { companyId } = useAuth();
  
  const DEPARTMENTS = formatToOptions(departments, 'department_id', 'name');
  const DESIGNATIONS = formatToOptions(designations, 'designation_id', 'name');

  const handleInputChange = (field: keyof FormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: ValidationErrors = {};

    if (!formData.full_name.trim()) {
      newErrors.full_name = 'Full name is required';
    } else if (formData.full_name.trim().length < 2) {
      newErrors.full_name = 'Full name must be at least 2 characters';
    }

    if (!formData.phone_number.trim()) {
      newErrors.phone_number = 'Phone number is required';
    } else if (!/^\+?[\d\s\-\(\)]{10,}$/.test(formData.phone_number.trim())) {
      newErrors.phone_number = 'Please enter a valid phone number';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email.trim())) {
      newErrors.email = 'Please enter a valid email address';
    }

    if (!formData.gender) {
      newErrors.gender = 'Gender is required';
    }

    if (!formData.dob) {
      newErrors.dob = 'Date of birth is required';
    } else {
      const birthDate = new Date(formData.dob);
      const today = new Date();
      const age = today.getFullYear() - birthDate.getFullYear();
      if (age < 18 || age > 65) {
        newErrors.dob = 'Employee must be between 18 and 65 years old';
      }
    }

    if (!formData.joining_date) {
      newErrors.joining_date = 'Joining date is required';
    } else {
      const joiningDate = new Date(formData.joining_date);
      const today = new Date();
      if (joiningDate > today) {
        newErrors.joining_date = 'Joining date cannot be in the future';
      }
    }

    if (!formData.shift_id) {
      newErrors.shift_id = 'Please select a shift';
    }

    if (!formData.department_id) {
      newErrors.department_id = 'Department is required';
    }

    if (!formData.designation_id) {
      newErrors.designation_id = 'Designation is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = async () => {
    if (!validateForm()) {
      showErrorToast('Validation Error', 'Please enter the required fields correctly.');
      return;
    }
    try {
      await createEmployee({ ...formData, company_id: companyId });
      showSuccessToast('Success', 'Employee added successfully!');
      router.back();
    } catch (error) {
      console.error('Error saving employee:', error);
      showErrorToast('Error', 'Failed to add employee. Please try again later.');
      return;
    }
  };

  const handleDateChange = (event: any, selectedDate?: Date) => {
    setShowDatePicker(false);
    if (selectedDate) {
      const formattedDate = selectedDate.toISOString().split('T')[0];
      handleInputChange('dob', formattedDate);
    }
  };

  const handleJoiningDateChange = (event: any, selectedDate?: Date) => {
    setShowJoiningDatePicker(false);
    if (selectedDate) {
      const formattedDate = selectedDate.toISOString().split('T')[0];
      handleInputChange('joining_date', formattedDate);
    }
  };

  const renderInput = (
    field: keyof FormData,
    placeholder: string,
    icon: React.ReactNode,
    keyboardType: 'default' | 'email-address' | 'phone-pad' | 'numeric' = 'default',
    maxLength?: number,
  ) => (
    <View style={styles.inputContainer}>
      <View style={[styles.inputWrapper, errors[field] && styles.inputError]}>
        <View style={styles.inputIconContainer}>{icon}</View>
        <TextInput
          style={styles.input}
          placeholder={placeholder}
          placeholderTextColor="#94A3B8"
          value={formData[field]}
          onChangeText={(value) => handleInputChange(field, value)}
          keyboardType={keyboardType}
          maxLength={maxLength}
        />
      </View>
      {errors[field] && <Text style={styles.errorText}>{errors[field]}</Text>}
    </View>
  );

  const getDropdownDisplayText = (field: keyof FormData, data: DropdownItem[], placeholder: string): string => {
    if (!formData[field]) return placeholder;
    const selectedItem = data.find(item => item.id.toString() === formData[field].toString());
    return selectedItem ? selectedItem.value : placeholder;
  };

  const renderDropdown = (
    field: keyof FormData,
    placeholder: string,
    icon: React.ReactNode,
    data: DropdownItem[],
    showDropdown: boolean,
    onToggleDropdown: () => void,
  ) => {
    const displayText = getDropdownDisplayText(field, data, placeholder);

    return (
      <View style={styles.inputContainer}>
        <TouchableOpacity
          style={[styles.dropdownWrapper, errors[field] && styles.inputError]}
          onPress={onToggleDropdown}
          activeOpacity={0.8}
        >
          <View style={styles.inputIconContainer}>{icon}</View>
          <Text style={[
            styles.dropdownPlaceholder,
            formData[field] ? styles.dropdownSelected : null
          ]}>
            {displayText}
          </Text>
          {showDropdown ? <ChevronUp size={16} color='#94A3B8' /> : <ChevronDown size={16} color="#94A3B8" />}
        </TouchableOpacity>
        {showDropdown && (
          <View style={styles.dropdownList}>
            {data.map((item) => (
              <TouchableOpacity
                key={item.id}
                style={[
                  styles.dropdownListItem,
                  formData[field].toString() === item.id.toString() && styles.dropdownListItemSelected
                ]}
                onPress={() => {
                  handleInputChange(field, item.id.toString());
                  onToggleDropdown();
                }}
                activeOpacity={0.7}
              >
                <Text style={[
                  styles.dropdownListItemText,
                  formData[field].toString() === item.id.toString() && styles.dropdownListItemTextSelected
                ]}>
                  {item.value}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        )}
        {errors[field] && <Text style={styles.errorText}>{errors[field]}</Text>}
      </View>
    );
  };

  const renderDatePicker = (
    field: keyof FormData,
    placeholder: string,
    onPress?: () => void,
  ) => (
    <View style={styles.inputContainer}>
      <TouchableOpacity
        style={[styles.dropdownWrapper, errors[field] && styles.inputError]}
        onPress={onPress}
        activeOpacity={0.8}
      >
        <View style={styles.inputIconContainer}>
          <CalendarDays size={18} color="#6366f1" />
        </View>
        <Text style={[
          styles.dropdownPlaceholder,
          formData[field] && styles.dropdownSelected
        ]}>
          {formData[field] ? formatDate(formData[field]) : placeholder}
        </Text>
        <ChevronDown size={16} color="#94A3B8" />
      </TouchableOpacity>
      {errors[field] && <Text style={styles.errorText}>{errors[field]}</Text>}
    </View>
  );

  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const formatTime = (timeString: string) => {
    if (!timeString) return '';
    const [hours, minutes] = timeString.split(':');
    const hour = parseInt(hours, 10);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const formattedHour = hour % 12 || 12;
    return `${formattedHour} ${ampm}`;
  };

  return (
    <SafeAreaView style={styles.safeContainer}>
      <StatusBar style="dark" />
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => router.back()}
            hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
          >
            <ChevronLeft size={22} color="#1E293B" />
          </TouchableOpacity>
          <View style={styles.headerTitleContainer}>
            <Text style={styles.headerTitle}>Add Employee</Text>
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
                <Text style={styles.welcomeQuote}>New Team Member</Text>
                <Text style={styles.ownerName}>Add Profile</Text>
                <Text style={styles.welcomeDesc}>
                  Register personal details, assign department / designation, and configure work shifts.
                </Text>
              </View>
              <View style={styles.illustrationWrapper}>
                <AddEmployeeIllustration width={110} height={90} />
              </View>
            </LinearGradient>
          </View>

          {/* Form details */}
          <View style={styles.formCard}>
            {/* Basic details */}
            <Text style={styles.sectionTitle}>Basic Details</Text>
            {renderInput('full_name', 'Full Name', <UserRound size={18} color="#6366f1" />)}
            {renderInput('phone_number', 'Mobile Number', <Phone size={18} color="#6366f1" />, 'phone-pad', 10)}
            {renderInput('email', 'Email Address', <Mail size={18} color="#6366f1" />, 'email-address')}
            
            {renderDropdown(
              'gender',
              'Gender',
              <UserRound size={18} color="#6366f1" />,
              GENDERS,
              showGenderDropdown,
              () => {
                setShowGenderDropdown(!showGenderDropdown);
                setShowDepartmentDropdown(false);
                setShowDesignationDropdown(false);
              }
            )}
            
            {renderDatePicker('dob', 'Date of Birth', () => {
              setDatePickerDate(formData.dob ? new Date(formData.dob) : new Date(2000, 0, 1));
              setShowDatePicker(true);
            })}

            {/* Job Details */}
            <Text style={[styles.sectionTitle, { marginTop: 12 }]}>Job Details</Text>
            {renderDropdown(
              'department_id',
              'Department',
              <Briefcase size={18} color="#6366f1" />,
              DEPARTMENTS,
              showDepartmentDropdown,
              () => {
                setShowDepartmentDropdown(!showDepartmentDropdown);
                setShowDesignationDropdown(false);
                setShowGenderDropdown(false);
              }
            )}

            {renderDropdown(
              'designation_id',
              'Designation',
              <Briefcase size={18} color="#6366f1" />,
              DESIGNATIONS,
              showDesignationDropdown,
              () => {
                setShowDesignationDropdown(!showDesignationDropdown);
                setShowDepartmentDropdown(false);
                setShowGenderDropdown(false);
              }
            )}

            {renderDatePicker('joining_date', 'Joining Date', () => {
              setDatePickerDate(formData.joining_date ? new Date(formData.joining_date) : new Date());
              setShowJoiningDatePicker(true);
            })}

            {/* Working Hours */}
            <Text style={[styles.sectionTitle, { marginTop: 12 }]}>Working Hours</Text>
            <View style={styles.shiftContainer}>
              {shiftTimings.map((shift) => (
                <TouchableOpacity
                  key={shift.shift_id}
                  style={[
                    styles.shiftButton,
                    formData.shift_id === shift.shift_id.toString() && styles.shiftButtonSelected,
                  ]}
                  onPress={() => handleInputChange('shift_id', shift.shift_id.toString())}
                  activeOpacity={0.8}
                >
                  <Clock size={14} color={formData.shift_id === shift.shift_id.toString() ? '#ffffff' : '#64748B'} />
                  <Text style={[
                    styles.shiftButtonText,
                    formData.shift_id === shift.shift_id.toString() && styles.shiftButtonTextSelected,
                  ]}>
                    {shift.shift_name} ({formatTime(shift.from_time)} - {formatTime(shift.to_time)})
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
            {errors.shift_id && <Text style={styles.errorText}>{errors.shift_id}</Text>}

            {/* Save Button */}
            <TouchableOpacity style={styles.saveButton} onPress={handleSave} activeOpacity={0.85}>
              <LinearGradient
                colors={['#6366f1', '#7c3aed']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.saveButtonGradient}
              >
                <Text style={styles.saveButtonText}>Add Employee</Text>
              </LinearGradient>
            </TouchableOpacity>
          </View>
        </ScrollView>

        {showDatePicker && (
          <DateTimePicker
            value={datePickerDate}
            mode="date"
            display="default"
            onChange={handleDateChange}
            maximumDate={new Date()}
          />
        )}

        {showJoiningDatePicker && (
          <DateTimePicker
            value={datePickerDate}
            mode="date"
            display="default"
            onChange={handleJoiningDateChange}
            maximumDate={new Date()}
          />
        )}
      </KeyboardAvoidingView>
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

  // --- Form ---
  formCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 22,
    padding: 20,
    borderWidth: 1,
    borderColor: '#F1F5F9',
    shadowColor: '#6366f1',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.04,
    shadowRadius: 16,
    elevation: 3,
    gap: 14,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '800',
    color: '#1E1B4B',
    marginBottom: 4,
    paddingHorizontal: 2,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  inputContainer: {
    width: '100%',
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8FAFC',
    borderRadius: 12,
    height: 48,
    borderWidth: 1.5,
    borderColor: '#E2E8F0',
    paddingHorizontal: 12,
    gap: 10,
  },
  inputIconContainer: {
    width: 24,
    height: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  input: {
    flex: 1,
    fontSize: 13,
    color: '#1E293B',
    fontWeight: '600',
  },
  inputError: {
    borderColor: '#EF4444',
  },
  errorText: {
    fontSize: 11,
    color: '#EF4444',
    fontWeight: '600',
    marginTop: 4,
    marginLeft: 4,
  },

  // --- Dropdown ---
  dropdownWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8FAFC',
    borderRadius: 12,
    height: 48,
    borderWidth: 1.5,
    borderColor: '#E2E8F0',
    paddingHorizontal: 12,
  },
  dropdownPlaceholder: {
    flex: 1,
    fontSize: 13,
    color: '#94A3B8',
    fontWeight: '600',
    marginLeft: 10,
  },
  dropdownSelected: {
    color: '#1E293B',
  },
  dropdownList: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: '#E2E8F0',
    overflow: 'hidden',
    marginTop: 2,
    shadowColor: '#6366f1',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.08,
    shadowRadius: 16,
    elevation: 5,
  },
  dropdownListItem: {
    padding: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  dropdownListItemSelected: {
    backgroundColor: '#F8FAFC',
  },
  dropdownListItemText: {
    fontSize: 13,
    color: '#475569',
    fontWeight: '600',
  },
  dropdownListItemTextSelected: {
    color: '#6366f1',
    fontWeight: '800',
  },

  // --- Shifts ---
  shiftContainer: {
    gap: 8,
  },
  shiftButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8FAFC',
    borderWidth: 1.5,
    borderColor: '#E2E8F0',
    borderRadius: 12,
    paddingHorizontal: 14,
    height: 44,
    gap: 8,
  },
  shiftButtonSelected: {
    backgroundColor: '#6366f1',
    borderColor: '#6366f1',
  },
  shiftButtonText: {
    fontSize: 12,
    color: '#475569',
    fontWeight: '700',
  },
  shiftButtonTextSelected: {
    color: '#FFFFFF',
  },

  // --- Save Button ---
  saveButton: {
    borderRadius: 12,
    overflow: 'hidden',
    marginTop: 10,
  },
  saveButtonGradient: {
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#6366f1',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.25,
    shadowRadius: 12,
    elevation: 4,
  },
  saveButtonText: {
    fontSize: 15,
    fontWeight: '700',
    color: '#ffffff',
    letterSpacing: 0.5,
  },
});