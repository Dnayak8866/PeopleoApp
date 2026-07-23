import { useMasterDataContext } from '@/context/MasterDataContext';
import { showSuccessToast, showErrorToast } from '@/services/toast';
import { formatToOptions } from '@/utils/utils';
import DateTimePicker from '@react-native-community/datetimepicker';
import * as ImagePicker from 'expo-image-picker';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { getEmployeeDetailsById, updateEmployee } from '@/services/api/employees';
import {
  Briefcase,
  CalendarDays,
  Camera,
  ChevronDown,
  ChevronLeft,
  ChevronUp,
  Clock,
  MapPin,
  Notebook,
  User,
  Phone,
  Mail,
  Home,
} from 'lucide-react-native';
import React, { useState, useEffect } from 'react';
import {
  Alert,
  Image,
  KeyboardAvoidingView,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
  StyleSheet,
  Dimensions,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import AddEmployeeIllustration from '@/components/illustrations/AddEmployeeIllustration';
import { LinearGradient } from 'expo-linear-gradient';
import { StatusBar } from 'expo-status-bar';

const { width } = Dimensions.get('window');

interface FormData {
  profileImage: string;
  full_name: string;
  phone_number: string;
  email: string;
  gender: string;
  dob: string;
  department_id: string;
  designation_id: string;
  shift_id: string;
  houseNo: string;
  areaLandmark: string;
  zipcode: string;
  city: string;
  state: string;
  country: string;
  aadharNumber: string;
  panNumber: string;
}

interface ValidationErrors {
  [key: string]: string;
}

interface DropdownItem {
  id: string | number;
  value: string;
}

const GENDERS: DropdownItem[] = [
  { value: 'Male', id: 'male' },
  { value: 'Female', id: 'female' },
  { value: 'Other', id: 'other' },
  { value: 'Prefer not to say', id: 'prefer_not_to_say' },
];

export default function EditProfileScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams();
  const [formData, setFormData] = useState<FormData>({
    profileImage: '',
    full_name: '',
    phone_number: '',
    email: '',
    gender: '',
    dob: '',
    department_id: '',
    designation_id: '',
    shift_id: '',
    houseNo: '',
    areaLandmark: '',
    zipcode: '',
    city: '',
    state: '',
    country: '',
    aadharNumber: '',
    panNumber: '',
  });

  const [errors, setErrors] = useState<ValidationErrors>({});
  const [showDepartmentDropdown, setShowDepartmentDropdown] = useState(false);
  const [showDesignationDropdown, setShowDesignationDropdown] = useState(false);
  const [showGenderDropdown, setShowGenderDropdown] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [datePickerDate, setDatePickerDate] = useState(new Date());
  const [employeeId, setEmployeeId] = useState<string>('');
  const { designations = [], departments = [], shiftTimings = [] } = useMasterDataContext();
  
  const DEPARTMENTS = formatToOptions(departments, 'department_id', 'name');
  const DESIGNATIONS = formatToOptions(designations, 'designation_id', 'name');

  useEffect(() => {
    if (id) {
      setEmployeeId(id as string);
      fetchEmployeeDetails(id as string);
    }
  }, [id]);

  const fetchEmployeeDetails = async (empId: string) => {
    try {
      const data = await getEmployeeDetailsById(empId);
      setFormData({
        profileImage: data.avatar || '',
        full_name: data.fullName || data.full_name || '',
        phone_number: data.phoneNumber || data.phone_number || '',
        email: data.email || '',
        gender: data.gender || '',
        dob: data.dob || '',
        department_id: (data.departmentId || data.department_id) ? (data.departmentId || data.department_id).toString() : '',
        designation_id: (data.designationId || data.designation_id) ? (data.designationId || data.designation_id).toString() : '',
        shift_id: (data.shiftId || data.shift_id) ? (data.shiftId || data.shift_id).toString() : '',
        houseNo: data.house_no || data.houseNo || '',
        areaLandmark: data.area_landmark || data.areaLandmark || '',
        zipcode: data.zipcode || '',
        city: data.city || '',
        state: data.state || '',
        country: data.country || '',
        aadharNumber: data.aadhar_number || data.aadharNumber || '',
        panNumber: data.pan_number || data.panNumber || '',
      });

      if (data.dob) {
        setDatePickerDate(new Date(data.dob));
      }

    } catch (error) {
      console.error('Error fetching employee details:', error);
      showErrorToast('Error', 'Failed to fetch employee details');
    }
  };

  const handleInputChange = (field: keyof FormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const handleImagePicker = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['livePhotos', 'images'],
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });
    if (!result.canceled && result.assets && result.assets.length > 0) {
      setFormData({ ...formData, profileImage: result.assets[0].uri });
    }
  };

  const validateForm = (): boolean => {
    const newErrors: ValidationErrors = {};

    if (!formData.full_name.trim()) {
      newErrors.full_name = 'Employee name is required';
    }

    if (!formData.phone_number.trim()) {
      newErrors.phone_number = 'Mobile number is required';
    }

    if (!formData.gender) {
      newErrors.gender = 'Gender is required';
    }

    if (!formData.dob) {
      newErrors.dob = 'Date of birth is required';
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

  const handleUpdate = async () => {
    if (!validateForm()) {
      showErrorToast('Validation Error', 'Please fill all required fields');
      return;
    }
    try {
      const payload = {
        full_name: formData.full_name,
        phone_number: formData.phone_number,
        gender: formData.gender,
        dob: formData.dob,
        department_id: formData.department_id,
        designation_id: formData.designation_id,
        shift_id: formData.shift_id,
        house_no: formData.houseNo,
        area_landmark: formData.areaLandmark,
        zipcode: formData.zipcode,
        city: formData.city,
        state: formData.state,
        country: formData.country,
        aadhar_number: formData.aadharNumber,
        pan_number: formData.panNumber,
        avatar: formData.profileImage,
      };

      await updateEmployee(employeeId, payload);
      showSuccessToast('Success', 'Profile updated successfully!');
      router.back();
    } catch (error) {
      console.error('Failed to update employee:', error);
      showErrorToast('Error', 'Failed to update profile. Please try again later.');
    }
  };

  const handleDateChange = (event: any, selectedDate?: Date) => {
    setShowDatePicker(false);
    if (selectedDate) {
      const formattedDate = selectedDate.toISOString().split('T')[0];
      handleInputChange('dob', formattedDate);
    }
  };

  const renderInput = (
    placeholder: string,
    field: keyof FormData,
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

  const renderDropdown = (
    field: keyof FormData,
    placeholder: string,
    icon: React.ReactNode,
    onPress?: () => void,
    data?: DropdownItem[],
    showDropdown?: boolean,
    onSelect?: (value: string) => void
  ) => (
    <View style={styles.inputContainer}>
      <TouchableOpacity
        style={[styles.dropdownWrapper, errors[field] && styles.inputError]}
        onPress={onPress}
        activeOpacity={0.8}
      >
        <View style={styles.inputIconContainer}>{icon}</View>
        <Text style={[
          styles.dropdownPlaceholder,
          formData[field] && styles.dropdownSelected
        ]}>
          {formData[field] ? getSelectedLabel(field) : placeholder}
        </Text>
        {showDropdown ? <ChevronUp size={16} color='#94A3B8' /> : <ChevronDown size={16} color="#94A3B8" />}
      </TouchableOpacity>
      {showDropdown && data && (
        <View style={styles.dropdownList}>
          {data.map((item) => (
            <TouchableOpacity
              key={item.id}
              style={[
                styles.dropdownListItem,
                formData[field].toString() === item.id.toString() && styles.dropdownListItemSelected
              ]}
              onPress={() => {
                onSelect?.(item.id.toString());
                if (field === 'gender') setShowGenderDropdown(false);
                if (field === 'department_id') setShowDepartmentDropdown(false);
                if (field === 'designation_id') setShowDesignationDropdown(false);
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

  const renderDatePicker = (
    placeholder: string,
    field: keyof FormData,
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

  const getSelectedLabel = (field: keyof FormData): string => {
    if (field === 'department_id') {
      return DEPARTMENTS.find(item => item.id.toString() === formData[field].toString())?.value || '';
    }
    if (field === 'designation_id') {
      return DESIGNATIONS.find(item => item.id.toString() === formData[field].toString())?.value || '';
    }
    if (field === 'gender') {
      return GENDERS.find(item => item.id === formData[field])?.value || '';
    }
    if (field === 'shift_id') {
      const shift = shiftTimings.find((item: any) => item.shift_id.toString() === formData[field]);
      return shift ? `${shift.shift_name} (${shift.from_time.slice(0, 5)} - ${shift.to_time.slice(0, 5)})` : '';
    }
    return formData[field];
  };

  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
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
            <Text style={styles.headerTitle}>Edit Profile</Text>
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
                <Text style={styles.welcomeQuote}>Modify Profile</Text>
                <Text style={styles.ownerName}>Update Info</Text>
                <Text style={styles.welcomeDesc}>
                  Update basic personal details, address information, and upload identification documents.
                </Text>
              </View>
              <View style={styles.illustrationWrapper}>
                <AddEmployeeIllustration width={110} height={90} />
              </View>
            </LinearGradient>
          </View>

          {/* Profile Photo Area */}
          <View style={styles.photoCard}>
            <TouchableOpacity style={styles.photoContainer} onPress={handleImagePicker} activeOpacity={0.9}>
              {formData.profileImage ? (
                <Image source={{ uri: formData.profileImage }} style={styles.profileImage} />
              ) : (
                <View style={styles.photoPlaceholder}>
                  <Camera size={26} color="#6366f1" />
                </View>
              )}
            </TouchableOpacity>
            <Text style={styles.photoPlaceholderText}>Tap avatar to update profile photo</Text>
          </View>

          {/* Form details */}
          <View style={styles.formCard}>
            {/* Basic details */}
            <Text style={styles.sectionTitle}>Basic Details</Text>
            {renderInput('Employee Name', 'full_name', <User size={18} color="#6366f1" />)}
            {renderInput('Mobile No', 'phone_number', <Phone size={18} color="#6366f1" />, 'phone-pad')}
            {renderInput('Email Address', 'email', <Mail size={18} color="#6366f1" />, 'email-address')}
            
            {renderDropdown('gender', 'Gender', <User size={18} color="#6366f1" />,
              () => {
                setShowGenderDropdown(!showGenderDropdown);
                setShowDepartmentDropdown(false);
                setShowDesignationDropdown(false);
              },
              GENDERS, showGenderDropdown, (value) => handleInputChange('gender', value)
            )}
            
            {renderDatePicker('Date of Birth', 'dob', () => {
              setDatePickerDate(formData.dob ? new Date(formData.dob) : new Date(2000, 0, 1));
              setShowDatePicker(true);
            })}

            {/* Job Details */}
            <Text style={[styles.sectionTitle, { marginTop: 12 }]}>Job Details</Text>
            {renderDropdown(
              'department_id',
              'Department',
              <Briefcase size={18} color="#6366f1" />,
              () => {
                setShowDepartmentDropdown(!showDepartmentDropdown);
                setShowDesignationDropdown(false);
                setShowGenderDropdown(false);
              },
              DEPARTMENTS,
              showDepartmentDropdown,
              (value) => handleInputChange('department_id', value)
            )}

            {renderDropdown(
              'designation_id',
              'Designation',
              <Briefcase size={18} color="#6366f1" />,
              () => {
                setShowDesignationDropdown(!showDesignationDropdown);
                setShowDepartmentDropdown(false);
                setShowGenderDropdown(false);
              },
              DESIGNATIONS,
              showDesignationDropdown,
              (value) => handleInputChange('designation_id', value)
            )}

            {/* Working Hours */}
            <Text style={[styles.sectionTitle, { marginTop: 12 }]}>Working Hours</Text>
            <View style={styles.shiftContainer}>
              {shiftTimings.map((shift: any, index: number) => (
                <TouchableOpacity
                  key={index}
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
                    {shift.shift_name} ({shift.from_time.slice(0, 5)} - {shift.to_time.slice(0, 5)})
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            {/* Address Details */}
            <Text style={[styles.sectionTitle, { marginTop: 12 }]}>Address Details</Text>
            {renderInput('House / Flat No.', 'houseNo', <Home size={18} color="#6366f1" />)}
            {renderInput('Area Landmark', 'areaLandmark', <MapPin size={18} color="#6366f1" />)}
            
            <View style={styles.rowInputs}>
              <View style={[styles.halfInput, { marginRight: 6 }]}>
                {renderInput('Zipcode', 'zipcode', <MapPin size={16} color="#6366f1" />, 'numeric')}
              </View>
              <View style={[styles.halfInput, { marginLeft: 6 }]}>
                {renderInput('City', 'city', <MapPin size={16} color="#6366f1" />)}
              </View>
            </View>

            <View style={styles.rowInputs}>
              <View style={[styles.halfInput, { marginRight: 6 }]}>
                {renderInput('State', 'state', <MapPin size={16} color="#6366f1" />)}
              </View>
              <View style={[styles.halfInput, { marginLeft: 6 }]}>
                {renderInput('Country', 'country', <MapPin size={16} color="#6366f1" />)}
              </View>
            </View>

            {/* Additional Information */}
            <Text style={[styles.sectionTitle, { marginTop: 12 }]}>Additional Information</Text>
            {renderInput('Aadhar Card Number', 'aadharNumber', <Notebook size={18} color="#6366f1" />, 'numeric')}
            {renderInput('PAN Card Number', 'panNumber', <Notebook size={18} color="#6366f1" />)}

            {/* Update Button */}
            <TouchableOpacity style={styles.saveButton} onPress={handleUpdate} activeOpacity={0.85}>
              <LinearGradient
                colors={['#6366f1', '#7c3aed']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.saveButtonGradient}
              >
                <Text style={styles.saveButtonText}>Update Profile</Text>
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

  // --- Photo Section ---
  photoCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 22,
    padding: 20,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#F1F5F9',
    marginBottom: 20,
    shadowColor: '#6366f1',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.02,
    shadowRadius: 10,
    elevation: 2,
  },
  photoContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    borderWidth: 3.5,
    borderColor: '#EEF2FF',
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
    marginBottom: 10,
    shadowColor: '#6366f1',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
  },
  profileImage: {
    width: '100%',
    height: '100%',
  },
  photoPlaceholder: {
    width: '100%',
    height: '100%',
    backgroundColor: '#F8FAFC',
    justifyContent: 'center',
    alignItems: 'center',
  },
  photoPlaceholderText: {
    fontSize: 12,
    color: '#64748B',
    fontWeight: '600',
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

  // --- Shifts & Row Inputs ---
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
  rowInputs: {
    flexDirection: 'row',
    width: '100%',
  },
  halfInput: {
    flex: 1,
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