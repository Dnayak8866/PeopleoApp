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

interface FormData {
  empName: string;
  phoneNumber: string;
  gender: string;
  dob: string;
  department: string;
  designation: string;
  joiningDate: string;
  selectedShift: string;
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

const DEPARTMENTS: DropdownItem[] = [
  { label: 'Engineering', value: 'engineering' },
  { label: 'Human Resources', value: 'hr' },
  { label: 'Finance', value: 'finance' },
  { label: 'Marketing', value: 'marketing' },
  { label: 'Sales', value: 'sales' },
  { label: 'Customer Support', value: 'customer_support' },
  { label: 'Operations', value: 'operations' },
  { label: 'IT', value: 'it' },
  { label: 'Legal', value: 'legal' },
  { label: 'Product', value: 'product' },
];

export default function AddEmployeeScreen() {
  const router = useRouter();
  const [formData, setFormData] = useState<FormData>({
    empName: '',
    phoneNumber: '',
    gender: '',
    dob: '',
    department: '',
    designation: '',
    joiningDate: '',
    selectedShift: '',
  });

  const [errors, setErrors] = useState<ValidationErrors>({});
  const [showDepartmentDropdown, setShowDepartmentDropdown] = useState(false);
  const [showDesignationDropdown, setShowDesignationDropdown] = useState(false);
  const [showGenderDropdown, setShowGenderDropdown] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showJoiningDatePicker, setShowJoiningDatePicker] = useState(false);
  const [datePickerDate, setDatePickerDate] = useState(new Date());
  const styles = addEmployeeScreenStyles();

  const handleInputChange = (field: keyof FormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: ValidationErrors = {};

    if (!formData.empName.trim()) {
      newErrors.empName = 'Full name is required';
    } else if (formData.empName.trim().length < 2) {
      newErrors.empName = 'Full name must be at least 2 characters';
    }

    if (!formData.phoneNumber.trim()) {
      newErrors.phoneNumber = 'Phone number is required';
    } else if (!/^\+?[\d\s\-\(\)]{10,}$/.test(formData.phoneNumber.trim())) {
      newErrors.phoneNumber = 'Please enter a valid phone number';
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

    if (!formData.department) {
      newErrors.department = 'Department is required';
    }

    if (!formData.designation) {
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
      console.log("formData", formData);
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
      handleInputChange('dob', formattedDate);
    }
  };

  const handleJoiningDateChange = (event: any, selectedDate?: Date) => {
    setShowJoiningDatePicker(false);
    if (selectedDate) {
      const formattedDate = selectedDate.toISOString().split('T')[0];
      handleInputChange('joiningDate', formattedDate);
    }
  };

  const renderSection = (title: string, children: React.ReactNode, icon?: React.ReactNode) => (
    <View style={styles.section}>
      <View style={{flexDirection:'row', marginHorizontal:20, alignItems:'center', marginBottom:10}}>
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
    
    const selectedItem = data.find(item => item.value === formData[field]);
    return selectedItem ? selectedItem.label : placeholder;
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
          {showDropdown ? <ChevronUp size={20} color='#9CA3AF'/> : <ChevronDown size={20} color="#9CA3AF" />}
        </TouchableOpacity>
        {showDropdown && (
          <View style={styles.dropdownList}>
            <ScrollView style={{ maxHeight: 200 }}>
              {data.map((item) => (
                <TouchableOpacity
                  key={item.value}
                  style={[
                    styles.dropdownListItem,
                    formData[field] === item.value && styles.dropdownListItemSelected
                  ]}
                  onPress={() => {
                    handleInputChange(field, item.value);
                    onToggleDropdown(); // Close dropdown after selection
                  }}
                >
                  <Text style={[
                    styles.dropdownListItemText,
                    formData[field] === item.value && styles.dropdownListItemTextSelected
                  ]}>
                    {item.label}
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

  const closeAllDropdowns = () => {
    setShowGenderDropdown(false);
    setShowDepartmentDropdown(false);
    setShowDesignationDropdown(false);
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#FFFFFF' }}>
      <KeyboardAvoidingView style={{ flex: 1 }} behavior="padding">
        <View style={styles.container}>
          {/* {(showGenderDropdown || showDepartmentDropdown || showDesignationDropdown) && (
            <TouchableWithoutFeedback onPress={closeAllDropdowns}>
              <View style={styles.overlay} />
            </TouchableWithoutFeedback>
          )} */}
          <View style={styles.header}>
            <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
              <ChevronLeft size={24} color="#374151" />
            </TouchableOpacity>
            <Text style={styles.headerTitle}>Add Employee</Text>
          </View>

          <ScrollView style={[styles.scrollView, styles.contentSpacing]} showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 100 }}>

            {renderSection('Basic Details', (
              <>
                {renderInput('empName', 'Employee Name', 'default', 30)}
                {renderInput('phoneNumber', 'Mobile Number','phone-pad', 10)}
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
                {renderDatePicker( 'dob', 'DOB', () => {
                  setDatePickerDate(formData.dob ? new Date(formData.dob) : new Date());
                  setShowDatePicker(true);
                })}
              </>
            ), <UserRound size={20} color={Colors.primary}/>)}

            {renderSection('Job Details',(
              <>
                {renderDropdown(
                  'department',
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
                  'designation',
                  'Designation',
                  JOB_TITLES,
                  showDesignationDropdown,
                  () => {
                    setShowDesignationDropdown(!showDesignationDropdown);
                    setShowDepartmentDropdown(false);
                    setShowGenderDropdown(false);
                  }
                )}
                {renderDatePicker('joiningDate', 'Joining date', () => {
                  setDatePickerDate(formData.joiningDate ? new Date(formData.joiningDate) : new Date());
                  setShowJoiningDatePicker(true);
                })}
              </>
            ), <Briefcase size={20} color={Colors.primary}/>)}

            {renderSection('Working Hours', (
              <View style={{ paddingHorizontal: 20, marginBottom: 20 }}>
                <ScrollView horizontal showsHorizontalScrollIndicator={false}>
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
                        (9 AM - 5 PM)
                      </Text>
                    </TouchableOpacity>
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
                        (5 PM - 1 AM)
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
                        (1 AM - 9 AM)
                      </Text>
                    </TouchableOpacity>
                  </View>
                </ScrollView>
                {errors.selectedShift && <Text style={styles.errorText}>{errors.selectedShift}</Text>}
              </View>
            ), <Clock10 size={20} color={Colors.primary}/>)}

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