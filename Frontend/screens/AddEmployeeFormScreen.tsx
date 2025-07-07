import DateTimePicker from '@react-native-community/datetimepicker';
import * as ImagePicker from 'expo-image-picker';
import { useRouter } from 'expo-router';
import {
  Building,
  Calendar,
  Camera,
  ChevronDown,
  ChevronLeft,
  FileText,
  Mail,
  MapPin,
  Phone,
  User
} from 'lucide-react-native';
import React, { useState } from 'react';
import {
  Alert,
  Image,
  KeyboardAvoidingView,
  Modal,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';

interface FormData {
  profileImage: string;
  fullName: string;
  jobTitle: string;
  phoneNumber: string;
  email: string;
  employeeId: string;
  gender: string;
  dateOfBirth: string;
  joiningDate: string;
  selectedShift: string;
  salary: string;
  addressLine1: string;
  addressLine2: string;
  city: string;
  state: string;
  zipCode: string;
  aadharNumber: string;
  panNumber: string;
}

interface ValidationErrors {
  [key: string]: string;
}

interface DropdownItem {
  label: string;
  value: string;
}

const JOB_TITLES: DropdownItem[] = [
  { label: 'Software Engineer', value: 'software_engineer' },
  { label: 'Senior Software Engineer', value: 'senior_software_engineer' },
  { label: 'Team Lead', value: 'team_lead' },
  { label: 'Project Manager', value: 'project_manager' },
  { label: 'Product Manager', value: 'product_manager' },
  { label: 'UI/UX Designer', value: 'ui_ux_designer' },
  { label: 'DevOps Engineer', value: 'devops_engineer' },
  { label: 'Quality Assurance', value: 'quality_assurance' },
  { label: 'Business Analyst', value: 'business_analyst' },
  { label: 'Data Analyst', value: 'data_analyst' },
  { label: 'HR Manager', value: 'hr_manager' },
  { label: 'Finance Manager', value: 'finance_manager' },
  { label: 'Marketing Manager', value: 'marketing_manager' },
  { label: 'Sales Executive', value: 'sales_executive' },
  { label: 'Customer Support', value: 'customer_support' },
];

const GENDERS: DropdownItem[] = [
  { label: 'Male', value: 'male' },
  { label: 'Female', value: 'female' },
  { label: 'Other', value: 'other' },
  { label: 'Prefer not to say', value: 'prefer_not_to_say' },
];

export default function AddEmployeeScreen() {
  const router = useRouter();
  const [formData, setFormData] = useState<FormData>({
    profileImage: '',
    fullName: '',
    jobTitle: '',
    phoneNumber: '',
    email: '',
    employeeId: '',
    gender: '',
    dateOfBirth: '',
    joiningDate: '',
    selectedShift: '',
    salary: '',
    addressLine1: '',
    addressLine2: '',
    city: '',
    state: '',
    zipCode: '',
    aadharNumber: '',
    panNumber: '',
  });

  const [errors, setErrors] = useState<ValidationErrors>({});
  const [showJobTitleModal, setShowJobTitleModal] = useState(false);
  const [showGenderModal, setShowGenderModal] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showJoiningDatePicker, setShowJoiningDatePicker] = useState(false);
  const [datePickerDate, setDatePickerDate] = useState(new Date());

  const handleInputChange = (field: keyof FormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const handleImagePicker = async() => {
    console.log("calling image picker");
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['livePhotos', 'images'],
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });
    console.log("result", result);
     if (!result.canceled && result.assets && result.assets.length > 0) {
      console.log("code reached here");
      setFormData({...formData, profileImage: result.assets[0].uri });
    }
  };

  const validateForm = (): boolean => {
    const newErrors: ValidationErrors = {};

    if (!formData.fullName.trim()) {
      newErrors.fullName = 'Full name is required';
    } else if (formData.fullName.trim().length < 2) {
      newErrors.fullName = 'Full name must be at least 2 characters';
    }

    if (!formData.jobTitle) {
      newErrors.jobTitle = 'Job title is required';
    }

    if (!formData.phoneNumber.trim()) {
      newErrors.phoneNumber = 'Phone number is required';
    } else if (!/^\+?[\d\s\-\(\)]{10,}$/.test(formData.phoneNumber.trim())) {
      newErrors.phoneNumber = 'Please enter a valid phone number';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email.trim())) {
      newErrors.email = 'Please enter a valid email address';
    }

    if (!formData.employeeId.trim()) {
      newErrors.employeeId = 'Employee ID is required';
    } else if (formData.employeeId.trim().length < 3) {
      newErrors.employeeId = 'Employee ID must be at least 3 characters';
    }

    if (!formData.gender) {
      newErrors.gender = 'Gender is required';
    }

    if (!formData.dateOfBirth) {
      newErrors.dateOfBirth = 'Date of birth is required';
    } else {
      const birthDate = new Date(formData.dateOfBirth);
      const today = new Date();
      const age = today.getFullYear() - birthDate.getFullYear();
      if (age < 18 || age > 65) {
        newErrors.dateOfBirth = 'Employee must be between 18 and 65 years old';
      }
    }

    if (!formData.joiningDate) {
      newErrors.joiningDate = 'Joining date is required';
    } else {
      const joiningDate = new Date(formData.joiningDate);
      const today = new Date();
      if (joiningDate > today) {
        newErrors.joiningDate = 'Joining date cannot be in the future';
      }
    }

    if (!formData.selectedShift) {
      newErrors.selectedShift = 'Please select a shift';
    }

    if (!formData.addressLine1.trim()) {
      newErrors.addressLine1 = 'Address line 1 is required';
    }

    if (!formData.city.trim()) {
      newErrors.city = 'City is required';
    }

    if (!formData.state.trim()) {
      newErrors.state = 'State is required';
    }

    if (!formData.zipCode.trim()) {
      newErrors.zipCode = 'Zip code is required';
    } else if (!/^\d{5,6}$/.test(formData.zipCode.trim())) {
      newErrors.zipCode = 'Please enter a valid zip code (5-6 digits)';
    }

    if (!formData.aadharNumber.trim()) {
      newErrors.aadharNumber = 'Aadhar number is required';
    } else if (!/^\d{12}$/.test(formData.aadharNumber.replace(/\s/g, ''))) {
      newErrors.aadharNumber = 'Aadhar number must be 12 digits';
    }

    if (!formData.panNumber.trim()) {
      newErrors.panNumber = 'PAN number is required';
    } else if (!/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/.test(formData.panNumber.trim().toUpperCase())) {
      newErrors.panNumber = 'Please enter a valid PAN number (e.g., ABCDE1234F)';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = () => {
    if (!validateForm()) {
      Alert.alert('Validation Error', 'Please fix the errors and try again');
      return;
    }
    console.log("formData", formData);
    Alert.alert(
      'Success',
      'Employee added successfully!',
      [{ text: 'OK', onPress: () => router.back() }]
    );
  };

  const handleDateChange = (event: any, selectedDate?: Date) => {
    setShowDatePicker(false);
    if (selectedDate) {
      const formattedDate = selectedDate.toISOString().split('T')[0];
      handleInputChange('dateOfBirth', formattedDate);
    }
  };

  const handleJoiningDateChange = (event: any, selectedDate?: Date) => {
    setShowJoiningDatePicker(false);
    if (selectedDate) {
      const formattedDate = selectedDate.toISOString().split('T')[0];
      handleInputChange('joiningDate', formattedDate);
    }
  };

  const renderSection = (title: string, children: React.ReactNode) => (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>{title}</Text>
      <View style={{ height: 1, backgroundColor: '#E5E7EB', marginHorizontal: 20, marginBottom: 15 }} />
      {children}
    </View>
  );

  const renderInput = (
    label: string,
    field: keyof FormData,
    placeholder: string,
    icon?: React.ReactNode,
    keyboardType: 'default' | 'email-address' | 'phone-pad' | 'numeric' = 'default',
    maxLength?: number,
    multiline = false,
  ) => (
    <View style={styles.inputContainer}>
      <Text style={styles.inputLabel}>{label}</Text>
      <View style={[styles.inputWrapper, errors[field] && styles.inputError]}>
        {icon && <View style={styles.inputIcon}>{icon}</View>}
        <TextInput
          style={[styles.input]}
          placeholder={placeholder}
          placeholderTextColor="#9CA3AF"
          value={formData[field]}
          onChangeText={(value) => handleInputChange(field, value)}
          keyboardType={keyboardType}
          numberOfLines={1}
          maxLength={maxLength}
        />
      </View>
      {errors[field] && <Text style={styles.errorText}>{errors[field]}</Text>}
    </View>
  );

  const renderDropdown = (
    label: string,
    field: keyof FormData,
    placeholder: string,
    icon?: React.ReactNode,
    onPress?: () => void
  ) => (
    <View style={styles.inputContainer}>
      <Text style={styles.inputLabel}>{label}</Text>
      <TouchableOpacity
        style={[styles.dropdownWrapper, errors[field] && styles.inputError]}
        onPress={onPress}
      >
        {icon && <View style={styles.inputIcon}>{icon}</View>}
        <Text style={[
          styles.dropdownPlaceholder,
          formData[field] && styles.dropdownSelected
        ]}>
          {formData[field] ? getSelectedLabel(field) : placeholder}
        </Text>
        <ChevronDown size={20} color="#9CA3AF" />
      </TouchableOpacity>
      {errors[field] && <Text style={styles.errorText}>{errors[field]}</Text>}
    </View>
  );

  const renderDatePicker = (
    label: string,
    field: keyof FormData,
    placeholder: string,
    icon?: React.ReactNode,
    onPress?: () => void
  ) => (
    <View style={styles.inputContainer}>
      <Text style={styles.inputLabel}>{label}</Text>
      <TouchableOpacity
        style={[styles.dropdownWrapper, errors[field] && styles.inputError]}
        onPress={onPress}
      >
        {icon && <View style={styles.inputIcon}>{icon}</View>}
        <Text style={[
          styles.dropdownPlaceholder,
          formData[field] && styles.dropdownSelected
        ]}>
          {formData[field] ? formatDate(formData[field]) : placeholder}
        </Text>
        <Calendar size={20} color="#9CA3AF" />
      </TouchableOpacity>
      {errors[field] && <Text style={styles.errorText}>{errors[field]}</Text>}
    </View>
  );

  const getSelectedLabel = (field: keyof FormData): string => {
    if (field === 'jobTitle') {
      return JOB_TITLES.find(item => item.value === formData[field])?.label || '';
    }
    if (field === 'gender') {
      return GENDERS.find(item => item.value === formData[field])?.label || '';
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

  const renderModal = (
    visible: boolean,
    onClose: () => void,
    title: string,
    data: DropdownItem[],
    onSelect: (value: string) => void
  ) => (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={true}
      onRequestClose={onClose}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>{title}</Text>
            <TouchableOpacity onPress={onClose}>
              <Text style={styles.modalCloseButton}>×</Text>
            </TouchableOpacity>
          </View>
          <ScrollView style={styles.modalScrollView}>
            {data.map((item, index) => (
              <TouchableOpacity
                key={index}
                style={styles.modalItem}
                onPress={() => {
                  onSelect(item.value);
                  onClose();
                }}
              >
                <Text style={styles.modalItemText}>{item.label}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
      </View>
    </Modal>
  );

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#F9FAFB' }}>
      <KeyboardAvoidingView style={{ flex: 1 }} behavior="padding">
        <View style={styles.container}>
          <View style={styles.header}>
            <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
              <ChevronLeft size={24} color="#374151" />
            </TouchableOpacity>
            <Text style={styles.headerTitle}>Add Employee</Text>
          </View>

          <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
            <View style={styles.photoSection}>
              <TouchableOpacity style={styles.photoContainer} onPress={handleImagePicker}>
                {formData.profileImage ? (
                  <Image source={{ uri: formData.profileImage }} style={styles.profileImage} />
                ) : (
                  <View style={styles.photoPlaceholder}>
                    <Camera size={36} color="#8C8D8BFF" />
                  </View>
                )}
              </TouchableOpacity>
              <Text style={styles.photoPlaceholderText}>{!formData.profileImage ? `Tap to upload photo`: `Tap to edit`}</Text>
            </View>

            {renderSection('Employee Basic Details', (
              <>
                {renderInput('Employee Name', 'fullName', 'Enter full name', <User size={20} color="#9CA3AF" />)}
                {renderDropdown('Job Title', 'jobTitle', 'Select Job Title', <Building size={20} color="#9CA3AF" />, () => setShowJobTitleModal(true))}
                {renderInput('Phone Number', 'phoneNumber', 'e.g, +1234567890', <Phone size={20} color="#9CA3AF" />, 'phone-pad', 10)}
                {renderInput('Email ID', 'email', 'e.g., john.doe@example.com', <Mail size={20} color="#9CA3AF" />, 'email-address')}
                {renderInput('Employee ID', 'employeeId', 'e.g., EMP12345', <Building size={20} color="#9CA3AF" />)}
                {renderDropdown('Gender', 'gender', 'Select gender', <User size={20} color="#9CA3AF" />, () => setShowGenderModal(true))}
                {renderDatePicker('Date of Birth', 'dateOfBirth', 'Select date', <Calendar size={20} color="#9CA3AF" />, () => {
                  setDatePickerDate(formData.dateOfBirth ? new Date(formData.dateOfBirth) : new Date());
                  setShowDatePicker(true);
                })}
                {renderDatePicker('Joining Date', 'joiningDate', 'Select date', <Calendar size={20} color="#9CA3AF" />, () => {
                  setDatePickerDate(formData.joiningDate ? new Date(formData.joiningDate) : new Date());
                  setShowJoiningDatePicker(true);
                })}
              </>
            ))}

            {renderSection('Shift Details', (
              <View style={{ paddingHorizontal: 20, marginBottom: 20 }}>
                <Text style={styles.inputLabel}>Shift Timing</Text>

                <View style={styles.shiftButtonRow}>
                  <View style={styles.shiftRow}>
                    <TouchableOpacity
                      style={[
                        styles.shiftButton,
                        formData.selectedShift === 'morning' && styles.shiftButtonSelected,
                      ]}
                      onPress={() => {
                        setFormData({ ...formData, selectedShift: 'morning' });
                        if (errors.selectedShift) {
                          setErrors(prev => ({ ...prev, selectedShift: '' }));
                        }
                      }}
                    >
                      <Text
                        style={[
                          styles.shiftButtonText,
                          formData.selectedShift === 'morning' && styles.shiftButtonTextSelected,
                        ]}
                      >
                        Morning (9 AM - 5 PM)
                      </Text>
                    </TouchableOpacity>
                  </View>

                  <View style={[styles.shiftRow, { flexDirection: 'row', gap: 6 }]}>
                    <TouchableOpacity
                      style={[
                        styles.shiftButton,
                        formData.selectedShift === 'evening' && styles.shiftButtonSelected,
                      ]}
                      onPress={() => {
                        setFormData({ ...formData, selectedShift: 'evening' });
                        if (errors.selectedShift) {
                          setErrors(prev => ({ ...prev, selectedShift: '' }));
                        }
                      }}
                    >
                      <Text
                        style={[
                          styles.shiftButtonText,
                          formData.selectedShift === 'evening' && styles.shiftButtonTextSelected,
                        ]}
                      >
                        Evening (5 PM - 1 AM)
                      </Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                      style={[
                        styles.shiftButton,
                        formData.selectedShift === 'night' && styles.shiftButtonSelected,
                      ]}
                      onPress={() => {
                        setFormData({ ...formData, selectedShift: 'night' });
                        if (errors.selectedShift) {
                          setErrors(prev => ({ ...prev, selectedShift: '' }));
                        }
                      }}
                    >
                      <Text
                        style={[
                          styles.shiftButtonText,
                          formData.selectedShift === 'night' && styles.shiftButtonTextSelected,
                        ]}
                      >
                        Night (1 AM - 9 AM)
                      </Text>
                    </TouchableOpacity>
                  </View>
                </View>
                {errors.selectedShift && <Text style={styles.errorText}>{errors.selectedShift}</Text>}
              </View>
            ))}

            {renderSection('Address Details', (
              <>
                {renderInput('Address Line 1', 'addressLine1', 'House No, Street Name', <MapPin size={20} color="#9CA3AF" />)}
                {renderInput('Address Line 2', 'addressLine2', 'Area, Landmark', <MapPin size={20} color="#9CA3AF" />)}
                {renderInput('City', 'city', 'Enter city')}
                {renderInput('State', 'state', 'Enter state')}
                {renderInput('Zip Code', 'zipCode', 'e.g, 123456', undefined, 'numeric', 6)}
              </>
            ))}

            {renderSection('Additional Information', (
              <>
                {renderInput('Aadhar Number', 'aadharNumber', 'Enter Aadhar Number', <FileText size={20} color="#9CA3AF" />, 'numeric', 12)}
                {renderInput('PAN Number', 'panNumber', 'Enter PAN Number', <FileText size={20} color="#9CA3AF" />,'default',10)}
              </>
            ))}

            <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
              <Text style={styles.saveButtonText}>Add Employee</Text>
            </TouchableOpacity>

            <View style={styles.bottomSpacer} />
          </ScrollView>

          {renderModal(
            showJobTitleModal,
            () => setShowJobTitleModal(false),
            'Select Job Title',
            JOB_TITLES,
            (value) => handleInputChange('jobTitle', value)
          )}

          {renderModal(
            showGenderModal,
            () => setShowGenderModal(false),
            'Select Gender',
            GENDERS,
            (value) => handleInputChange('gender', value)
          )}

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
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
    paddingTop: 20,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
    paddingTop: 12,
    paddingBottom: 8,
  },
  backButton: {
    padding: 6,
    marginRight: 4,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F3F4F6',
    borderRadius: 50,
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
    flex: 1,
    textAlign: 'center',
    marginLeft: -35,
  },
  scrollView: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  photoSection: {
    alignItems: 'center',
    paddingVertical: 32,
    marginBottom: 8,
  },
  photoContainer: {
    width: 90,
    height: 90,
    borderRadius: 50,
    borderWidth: 2,
    borderColor: '#EBEBEAFF',
    borderStyle: 'dashed',
    overflow: 'hidden',
  },
  profileImage: {
    width: '100%',
    height: '100%',
  },
  photoPlaceholder: {
    width: '100%',
    height: '100%',
    backgroundColor: '#F7F7F7FF',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderStyle: 'dashed',
  },
  photoPlaceholderText: {
    fontSize: 16,
    color: '#9CA3AF',
    marginTop: 8,
    textAlign: 'center',
  },
  section: {
    backgroundColor: '#F9FAFB',
    marginBottom: 6,
    paddingVertical: 10,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#171A1FFF',
    marginBottom: 10,
    paddingHorizontal: 20,
  },
  inputContainer: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: '#242524FF',
    marginBottom: 8,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#BCC1CAFF',
    borderRadius: 8,
    paddingHorizontal: 16,
  },
  inputError: {
    borderColor: '#EF4444',
  },
  inputIcon: {
    marginRight: 8,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: '#000000',
  },
  dropdownWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#BCC1CAFF',
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  dropdownPlaceholder: {
    flex: 1,
    fontSize: 16,
    color: '#9CA3AF',
    marginLeft: 8,
  },
  dropdownSelected: {
    color: '#171A1FFF',
  },
  errorText: {
    fontSize: 12,
    color: '#EF4444',
    marginTop: 4,
    marginLeft: 4,
  },
  saveButton: {
    backgroundColor: '#8B5CF6',
    marginHorizontal: 20,
    marginTop: 14,
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    shadowColor: '#8B5CF6',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  saveButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  bottomSpacer: {
    height: 40,
  },
  shiftButtonRow: {
    flexDirection: 'column',
    flexWrap: 'wrap',
    gap: 10,
    marginTop: 8,
  },
  shiftButton: {
    paddingVertical: 8,
    paddingHorizontal: 10,
    borderRadius: 16,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    height: 38,
  },
  shiftButtonSelected: {
    backgroundColor: '#ede9fe',
    borderColor: '#8B5CF6',
  },
  shiftButtonText: {
    color: '#6B7280',
    fontSize: 14,
    fontWeight: '500',
  },
  shiftButtonTextSelected: {
    color: '#8B5CF6',
    fontWeight: '600',
  },
  shiftRow: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    marginTop: 8,
  },
  // Modal styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: '70%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1F2937',
  },
  modalCloseButton: {
    fontSize: 24,
    color: '#6B7280',
    fontWeight: '300',
  },
  modalScrollView: {
    maxHeight: 400,
  },
  modalItem: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  modalItemText: {
    fontSize: 16,
    color: '#1F2937',
  },
});