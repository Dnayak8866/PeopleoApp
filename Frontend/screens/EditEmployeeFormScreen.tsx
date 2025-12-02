import { updateEmployee } from '@/services/api/employees';
import { editEmployeeScreenStyles } from '@/styles/editEmployeeScreenStyles';
import DateTimePicker from '@react-native-community/datetimepicker';
import * as ImagePicker from 'expo-image-picker';
import { useRouter } from 'expo-router';
import {
  Briefcase,
  CalendarDays,
  Camera,
  ChevronDown,
  ChevronLeft,
  ChevronUp,
  Clock10,
  MapPin,
  Notebook,
  User
} from 'lucide-react-native';
import React, { useState } from 'react';
import {
  Alert,
  Image,
  KeyboardAvoidingView,
  SafeAreaView,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View
} from 'react-native';

interface FormData {
  profileImage: string;
  fullName: string;
  mobileNo: string;
  gender: string;
  dateOfBirth: string;
  department: string;
  designation: string;
  workingHours: string;
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
  label: string;
  value: string;
}

const DEPARTMENTS: DropdownItem[] = [
  { label: 'Engineering', value: 'engineering' },
  { label: 'Human Resources', value: 'hr' },
  { label: 'Marketing', value: 'marketing' },
  { label: 'Sales', value: 'sales' },
  { label: 'Finance', value: 'finance' },
  { label: 'Operations', value: 'operations' },
  { label: 'Customer Support', value: 'support' },
];

const DESIGNATIONS: DropdownItem[] = [
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
];

const GENDERS: DropdownItem[] = [
  { label: 'Male', value: 'male' },
  { label: 'Female', value: 'female' },
  { label: 'Other', value: 'other' },
  { label: 'Prefer not to say', value: 'prefer_not_to_say' },
];

const WORKING_HOURS = [
  { label: '9 AM - 5 PM', value: '9am_5pm' },
  { label: '11 PM - 7 PM', value: '11pm_7pm' },
  { label: '1 PM - 9 PM', value: '1pm_9pm' },
];

export default function EditProfileScreen() {
  const router = useRouter();
  const styles = editEmployeeScreenStyles();
  const [formData, setFormData] = useState<FormData>({
    profileImage: '',
    fullName: '',
    mobileNo: '',
    gender: '',
    dateOfBirth: '',
    department: '',
    designation: '',
    workingHours: '9am_5pm',
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

    if (!formData.fullName.trim()) {
      newErrors.fullName = 'Employee name is required';
    }

    if (!formData.mobileNo.trim()) {
      newErrors.mobileNo = 'Mobile number is required';
    }

    if (!formData.gender) {
      newErrors.gender = 'Gender is required';
    }

    if (!formData.dateOfBirth) {
      newErrors.dateOfBirth = 'Date of birth is required';
    }

    if (!formData.department) {
      newErrors.department = 'Department is required';
    }

    if (!formData.designation) {
      newErrors.designation = 'Designation is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleUpdate = async() => {
    if (!validateForm()) {
      Alert.alert('Validation Error', 'Please fill all required fields');
      return;
    }
    try {
      await updateEmployee(employeeId, formData);
      Alert.alert(
        'Success',
        'Profile updated successfully!',
        [{ text: 'OK', onPress: () => router.back() }]
      );
    } catch (error) {
      console.error('Failed to update employee:', error);
      Alert.alert('Error', 'Failed to update profile. Please try again later.');
    }
  };

  const handleDateChange = (event: any, selectedDate?: Date) => {
    setShowDatePicker(false);
    if (selectedDate) {
      const formattedDate = selectedDate.toISOString().split('T')[0];
      handleInputChange('dateOfBirth', formattedDate);
    }
  };

  const renderSection = (title: string, icon: React.ReactNode, children: React.ReactNode) => (
    <View style={styles.section}>
      <View style={styles.sectionHeader}>
        {icon}
        <Text style={styles.sectionTitle}>{title}</Text>
      </View>
      {children}
    </View>
  );

  const renderInput = (
    placeholder: string,
    field: keyof FormData,
    keyboardType: 'default' | 'email-address' | 'phone-pad' | 'numeric' = 'default',
    maxLength?: number,
  ) => (
    <View style={styles.inputContainer}>
      <TextInput
        style={[styles.input, errors[field] && styles.inputError]}
        placeholder={placeholder}
        placeholderTextColor="#9CA3AF"
        value={formData[field]}
        onChangeText={(value) => handleInputChange(field, value)}
        keyboardType={keyboardType}
        maxLength={maxLength}
      />
      {errors[field] && <Text style={styles.errorText}>{errors[field]}</Text>}
    </View>
  );

  const renderDropdown = (
    field: keyof FormData,
    placeholder: string,
    onPress?: () => void,
    data?: DropdownItem[],
    showDropdown?: boolean,
    onSelect?: (value: string) => void
  ) => (
    <View style={styles.inputContainer}>
      <TouchableOpacity
        style={[styles.dropdownWrapper, errors[field] && styles.inputError]}
        onPress={onPress}
        activeOpacity={0.7}
      >
        <Text style={[
          styles.dropdownPlaceholder,
          formData[field] && styles.dropdownSelected
        ]}>
          {formData[field] ? getSelectedLabel(field) : placeholder}
        </Text>
        {showDropdown ? <ChevronUp size={20} color='#9CA3AF'/> : <ChevronDown size={20} color="#9CA3AF" />}
      </TouchableOpacity>
      {showDropdown && data && (
        <View style={styles.dropdownList}>
          <ScrollView style={{ maxHeight: 200 }}>
            {data.map((item, idx) => (
              <TouchableOpacity
                key={item.value}
                style={styles.dropdownListItem}
                onPress={() => {
                  onSelect?.(item.value);
                  if (field === 'gender') setShowGenderDropdown(false);
                  if (field === 'department') setShowDepartmentDropdown(false);
                  if (field === 'designation') setShowDesignationDropdown(false);
                }}
              >
                <Text style={styles.dropdownListItemText}>{item.label}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
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
      >
        <Text style={[
          styles.dropdownPlaceholder,
          formData[field] && styles.dropdownSelected
        ]}>
          {formData[field] ? formatDate(formData[field]) : placeholder}
        </Text>
        <CalendarDays size={20} color="#9CA3AF" />
      </TouchableOpacity>
      {errors[field] && <Text style={styles.errorText}>{errors[field]}</Text>}
    </View>
  );

  const getSelectedLabel = (field: keyof FormData): string => {
    if (field === 'department') {
      return DEPARTMENTS.find(item => item.value === formData[field])?.label || '';
    }
    if (field === 'designation') {
      return DESIGNATIONS.find(item => item.value === formData[field])?.label || '';
    }
    if (field === 'gender') {
      return GENDERS.find(item => item.value === formData[field])?.label || '';
    }
    if (field === 'workingHours') {
      return WORKING_HOURS.find(item => item.value === formData[field])?.label || '';
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
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView style={{ flex: 1 }} behavior="padding">
        <View style={styles.container}>
          {(showGenderDropdown || showDepartmentDropdown || showDesignationDropdown) && (
            <TouchableWithoutFeedback
              onPress={() => {
                setShowGenderDropdown(false);
                setShowDepartmentDropdown(false);
                setShowDesignationDropdown(false);
              }}
            >
              <View style={styles.overlay} />
            </TouchableWithoutFeedback>
          )}
          
          <View style={styles.header}>
            <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
              <ChevronLeft size={24} color="#374151" />
            </TouchableOpacity>
            <Text style={styles.headerTitle}>Edit Profile</Text>
          </View>

          <ScrollView 
            style={styles.scrollView} 
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ paddingBottom: 100 }}
          >
            <View style={styles.photoSection}>
              <TouchableOpacity style={styles.photoContainer} onPress={handleImagePicker}>
                {formData.profileImage ? (
                  <Image source={{ uri: formData.profileImage }} style={styles.profileImage} />
                ) : (
                  <View style={styles.photoPlaceholder}>
                    <Camera size={32} color="#9CA3AF" />
                  </View>
                )}
              </TouchableOpacity>
              <Text style={styles.photoPlaceholderText}>Tap to upload photo</Text>
            </View>

            <View style={styles.formContainer}>
              {renderSection('Basic details', <User size={20} color="#6366F1" />, (
                <>
                  {renderInput('Employee Name', 'fullName')}
                  {renderInput('Mobile No', 'mobileNo', 'phone-pad')}
                  {renderDropdown('gender','Gender',() => setShowGenderDropdown((prev) => !prev),
                    GENDERS, showGenderDropdown, (value) => handleInputChange('gender', value)
                  )}
                  {renderDatePicker('DOB', 'dateOfBirth', () => {
                    setDatePickerDate(formData.dateOfBirth ? new Date(formData.dateOfBirth) : new Date());
                    setShowDatePicker(true);
                  })}
                </>
              ))}

              {renderSection('Job Details', <Briefcase size={20} color="#6366F1" />, (
                <>
                  {renderDropdown(
                    'department',
                    'Department',
                    () => {
                      setShowDepartmentDropdown((prev) => !prev);
                      setShowDesignationDropdown(false);
                      setShowGenderDropdown(false);
                    },
                    DEPARTMENTS,
                    showDepartmentDropdown,
                    (value) => handleInputChange('department', value)
                  )}
                  {renderDropdown(
                    'designation',
                    'Designation',
                    () => {
                      setShowDesignationDropdown((prev) => !prev);
                      setShowDepartmentDropdown(false);
                      setShowGenderDropdown(false);
                    },
                    DESIGNATIONS,
                    showDesignationDropdown,
                    (value) => handleInputChange('designation', value)
                  )}
                </>
              ))}

              {renderSection('Working hours', <Clock10 size={20} color="#6366F1" />, (
                <View style={styles.workingHoursContainer}>
                  {WORKING_HOURS.map((shift, index) => (
                    <TouchableOpacity
                      key={index}
                      style={[
                        styles.workingHourButton,
                        formData.workingHours === shift.value && styles.workingHourButtonSelected,
                      ]}
                      onPress={() => handleInputChange('workingHours', shift.value)}
                    >
                      <Text
                        style={[
                          styles.workingHourText,
                          formData.workingHours === shift.value && styles.workingHourTextSelected,
                        ]}
                      >
                        {shift.label}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              ))}

              {renderSection('Address Details', <MapPin size={20} color="#6366F1" />, (
                <>
                  {renderInput('House no/Flat no', 'houseNo')}
                  {renderInput('Area Landmark', 'areaLandmark')}
                  <View style={styles.rowInputs}>
                    <View style={styles.halfInput}>
                        <TextInput
                          style={[styles.input, errors.zipcode && styles.inputError]}
                          placeholder="Zipcode"
                          placeholderTextColor="#9CA3AF"
                          value={formData.zipcode}
                          onChangeText={(value) => handleInputChange('zipcode', value)}
                          keyboardType="numeric"
                        />
                        {errors.zipcode && <Text style={styles.errorText}>{errors.zipcode}</Text>}
                    </View>
                    <View style={styles.halfInput}>
                        <TextInput
                          style={[styles.input, errors.city && styles.inputError]}
                          placeholder="City"
                          placeholderTextColor="#9CA3AF"
                          value={formData.city}
                          onChangeText={(value) => handleInputChange('city', value)}
                        />
                        {errors.city && <Text style={styles.errorText}>{errors.city}</Text>}
                    </View>
                  </View>
                  <View style={styles.rowInputs}>
                    <View style={styles.halfInput}>
                        <TextInput
                          style={[styles.input, errors.state && styles.inputError]}
                          placeholder="State"
                          placeholderTextColor="#9CA3AF"
                          value={formData.state}
                          onChangeText={(value) => handleInputChange('state', value)}
                        />
                        {errors.state && <Text style={styles.errorText}>{errors.state}</Text>}
                    </View>
                    <View style={styles.halfInput}>
                        <TextInput
                          style={[styles.input, errors.country && styles.inputError]}
                          placeholder="Country"
                          placeholderTextColor="#9CA3AF"
                          value={formData.country}
                          onChangeText={(value) => handleInputChange('country', value)}
                        />
                        {errors.country && <Text style={styles.errorText}>{errors.country}</Text>}
                    </View>
                  </View>
                </>
              ))}

              {renderSection('Additional Information', <Notebook size={20} color="#6366F1" />, (
                <>
                  {renderInput('Aadhar No.', 'aadharNumber', 'numeric')}
                  {renderInput('PAN No.', 'panNumber')}
                </>
              ))}
            </View>

            <View style={styles.bottomSpacer} />
          </ScrollView>

          {/* Fixed Update button at the bottom */}
          <View style={styles.fixedButtonContainer}>
            <TouchableOpacity style={styles.updateButton} onPress={handleUpdate}>
              <Text style={styles.updateButtonText}>Update</Text>
            </TouchableOpacity>
          </View>

          {showDatePicker && (
            <DateTimePicker
              value={datePickerDate}
              mode="date"
              display="default"
              onChange={handleDateChange}
              maximumDate={new Date()}
            />
          )}
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}