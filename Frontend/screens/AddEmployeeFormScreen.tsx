import { createEmployee } from '@/services/api/employees';
import { Colors } from '@/constants/Colors';
import { addEmployeeScreenStyles } from '@/styles/addEmployeeScreenStyles';
import DateTimePicker from '@react-native-community/datetimepicker';
import { useRouter } from 'expo-router';
import {
  Briefcase,
  CalendarDays,
  ChevronDown,
  ChevronLeft,
  ChevronUp,
  Clock10,
  UserRound
} from 'lucide-react-native';
import React, { useState } from 'react';
import {
  Alert,
  KeyboardAvoidingView,
  SafeAreaView,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from 'react-native';
import { useMasterDataContext } from '@/context/MasterDataContext';
import { formatToOptions } from '@/utils/utils';

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
  const styles = addEmployeeScreenStyles();
  const { designations = [], departments = [], shiftTimings = [] } = useMasterDataContext();
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
      newErrors.fullName = 'Full name must be at least 2 characters';
    }

    if (!formData.phone_number.trim()) {
      newErrors.phone_number = 'Phone number is required';
    } else if (!/^\+?[\d\s\-\(\)]{10,}$/.test(formData.phone_number.trim())) {
      newErrors.phoneNumber = 'Please enter a valid phone number';
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
        newErrors.joiningDate = 'Joining date cannot be in the future';
      }
    }

    if (!formData.shift_id) {
      newErrors.shift = 'Please select a shift';
    }

    if (!formData.department_id) {
      newErrors.department = 'Department is required';
    }

    if (!formData.designation_id) {
      newErrors.designation = 'Designation is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = async () => {
    if (!validateForm()) {
      Alert.alert('Validation Error', 'Please enter the required fields correctly.');
      return;
    }
    try {
      await createEmployee(formData);
      Alert.alert(
        'Success',
        'Employee added successfully!',
        [{ text: 'OK', onPress: () => router.back() }]
      );
    } catch (error) {
      console.error('Error saving employee:', error);
      Alert.alert('Error', 'Failed to add employee. Please try again later.');
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

  const renderSection = (title: string, children: React.ReactNode, icon?: React.ReactNode) => (
    <View style={styles.section}>
      <View style={{ flexDirection: 'row', marginHorizontal: 20, alignItems: 'center', marginBottom: 10 }}>
        {icon && <View style={styles.inputIcon}>{icon}</View>}
        <Text style={styles.sectionTitle}>{title}</Text>
      </View>
      {children}
    </View>
  );

  const renderInput = (
    field: keyof FormData,
    placeholder: string,
    keyboardType: 'default' | 'email-address' | 'phone-pad' | 'numeric' = 'default',
    maxLength?: number,
  ) => (
    <View style={styles.inputContainer}>
      <View style={[styles.inputWrapper, errors[field] && styles.inputError]}>
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

  const getDropdownDisplayText = (field: keyof FormData, data: DropdownItem[], placeholder: string): string => {
    if (!formData[field]) return placeholder;

    const selectedItem = data.find(item => item.id === formData[field]);
    return selectedItem ? selectedItem.value : placeholder;
  };

  const renderDropdown = (
    field: keyof FormData,
    placeholder: string,
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
          activeOpacity={0.7}
        >
          <Text style={[
            styles.dropdownPlaceholder,
            formData[field] ? styles.dropdownSelected : null
          ]}>
            {displayText}
          </Text>
          {showDropdown ? <ChevronUp size={20} color='#9CA3AF' /> : <ChevronDown size={20} color="#9CA3AF" />}
        </TouchableOpacity>
        {showDropdown && (
          <View style={styles.dropdownList}>
            <ScrollView style={{ maxHeight: 200 }}>
              {data.map((item) => (
                <TouchableOpacity
                  key={item.id}
                  style={[
                    styles.dropdownListItem,
                    formData[field] === item.id && styles.dropdownListItemSelected
                  ]}
                  onPress={() => {
                    handleInputChange(field, item.id);
                    onToggleDropdown(); // Close dropdown after selection
                  }}
                >
                  <Text style={[
                    styles.dropdownListItemText,
                    formData[field] === item.id && styles.dropdownListItemTextSelected
                  ]}>
                    {item.value}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
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
    icon?: React.ReactNode,
  ) => (
    <View style={styles.inputContainer}>
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
        <CalendarDays size={20} color="#9CA3AF" />
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

  const closeAllDropdowns = () => {
    setShowGenderDropdown(false);
    setShowDepartmentDropdown(false);
    setShowDesignationDropdown(false);
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#FFFFFF' }}>
      <KeyboardAvoidingView style={{ flex: 1 }} behavior="padding">
        <View style={styles.container}>
          <View style={styles.header}>
            <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
              <ChevronLeft size={24} color="#374151" />
            </TouchableOpacity>
            <Text style={styles.headerTitle}>Add Employee</Text>
          </View>

          <ScrollView style={[styles.scrollView, styles.contentSpacing]} showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 100 }}>

            {renderSection('Basic Details', (
              <>
                {renderInput('full_name', 'Employee Name', 'default', 30)}
                {renderInput('phone_number', 'Mobile Number', 'phone-pad', 10)}
                {renderInput('email', 'Email', 'email-address', 30)}
                {renderDropdown(
                  'gender',
                  'Gender',
                  GENDERS,
                  showGenderDropdown,
                  () => {
                    setShowGenderDropdown(!showGenderDropdown);
                    setShowDepartmentDropdown(false);
                    setShowDesignationDropdown(false);
                  }
                )}
                {renderDatePicker('dob', 'DOB', () => {
                  setDatePickerDate(formData.dob ? new Date(formData.dob) : new Date());
                  setShowDatePicker(true);
                })}
              </>
            ), <UserRound size={20} color={Colors.primary} />)}

            {renderSection('Job Details', (
              <>
                {renderDropdown(
                  'department_id',
                  'Department',
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
                  DESIGNATIONS,
                  showDesignationDropdown,
                  () => {
                    setShowDesignationDropdown(!showDesignationDropdown);
                    setShowDepartmentDropdown(false);
                    setShowGenderDropdown(false);
                  }
                )}
                {renderDatePicker('joining_date', 'Joining date', () => {
                  setDatePickerDate(formData.joining_date ? new Date(formData.joining_date) : new Date());
                  setShowJoiningDatePicker(true);
                })}
              </>
            ), <Briefcase size={20} color={Colors.primary} />)}

            {renderSection('Working Hours', (
              <View style={{ paddingHorizontal: 20, marginBottom: 20 }}>
                <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                  <View style={styles.shiftRow}>
                    {shiftTimings.map((shift) => (
                      <TouchableOpacity
                        key={shift.shift_id}
                        style={[
                          styles.shiftButton,
                          formData.shift_id === shift.shift_id.toString() && styles.shiftButtonSelected,
                        ]}
                        onPress={() => {
                          handleInputChange('shift_id', shift.shift_id.toString());
                        }}
                      >
                        <Text
                          style={[
                            styles.shiftButtonText,
                            formData.shift_id === shift.shift_id.toString() && styles.shiftButtonTextSelected,
                          ]}
                        >
                          {`(${formatTime(shift.from_time)} - ${formatTime(shift.to_time)})`}
                        </Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                </ScrollView>
                {errors.selectedShift && <Text style={styles.errorText}>{errors.selectedShift}</Text>}
              </View>
            ), <Clock10 size={20} color={Colors.primary} />)}

            <View style={styles.bottomSpacer} />
          </ScrollView>

          {/* Fixed Add Employee button at the bottom */}
          <View style={styles.fixedButtonContainer}>
            <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
              <Text style={styles.saveButtonText}>Add Employee</Text>
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