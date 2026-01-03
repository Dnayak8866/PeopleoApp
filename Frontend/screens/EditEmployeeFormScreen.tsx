import { useMasterDataContext } from '@/context/MasterDataContext';
import { editEmployeeScreenStyles } from '@/styles/editEmployeeScreenStyles';
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
  Clock10,
  MapPin,
  Notebook,
  User
} from 'lucide-react-native';
import React, { useState, useEffect } from 'react';
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
  const styles = editEmployeeScreenStyles();
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
      Alert.alert('Error', 'Failed to fetch employee details');
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
      newErrors.fullName = 'Employee name is required';
    }

    if (!formData.phone_number.trim()) {
      newErrors.mobileNo = 'Mobile number is required';
    }

    if (!formData.gender) {
      newErrors.gender = 'Gender is required';
    }

    if (!formData.dob) {
      newErrors.dateOfBirth = 'Date of birth is required';
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

  const handleUpdate = async () => {
    if (!validateForm()) {
      Alert.alert('Validation Error', 'Please fill all required fields');
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
      handleInputChange('dob', formattedDate);
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
        {showDropdown ? <ChevronUp size={20} color='#9CA3AF' /> : <ChevronDown size={20} color="#9CA3AF" />}
      </TouchableOpacity>
      {showDropdown && data && (
        <View style={styles.dropdownList}>
          <ScrollView style={{ maxHeight: 200 }}>
            {data.map((item, idx) => (
              <TouchableOpacity
                key={item.id}
                style={styles.dropdownListItem}
                onPress={() => {
                  onSelect?.(item.id.toString());
                  if (field === 'gender') setShowGenderDropdown(false);
                  if (field === 'department_id') setShowDepartmentDropdown(false);
                  if (field === 'designation_id') setShowDesignationDropdown(false);
                }}
              >
                <Text style={styles.dropdownListItemText}>{item.value}</Text>
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
    if (field === 'department_id') {
      return DEPARTMENTS.find(item => item.id == formData[field])?.value || '';
    }
    if (field === 'designation_id') {
      return DESIGNATIONS.find(item => item.id == formData[field])?.value || '';
    }
    if (field === 'gender') {
      return GENDERS.find(item => item.id == formData[field])?.value || '';
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
                  {renderInput('Employee Name', 'full_name')}
                  {renderInput('Mobile No', 'phone_number', 'phone-pad')}
                  {renderInput('Email', 'email')}
                  {renderDropdown('gender', 'Gender', () => setShowGenderDropdown((prev) => !prev),
                    GENDERS, showGenderDropdown, (value) => handleInputChange('gender', value)
                  )}
                  {renderDatePicker('DOB', 'dob', () => {
                    setDatePickerDate(formData.dob ? new Date(formData.dob) : new Date());
                    setShowDatePicker(true);
                  })}
                </>
              ))}

              {renderSection('Job Details', <Briefcase size={20} color="#6366F1" />, (
                <>
                  {renderDropdown(
                    'department_id',
                    'Department',
                    () => {
                      setShowDepartmentDropdown((prev) => !prev);
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
                    () => {
                      setShowDesignationDropdown((prev) => !prev);
                      setShowDepartmentDropdown(false);
                      setShowGenderDropdown(false);
                    },
                    DESIGNATIONS,
                    showDesignationDropdown,
                    (value) => handleInputChange('designation_id', value)
                  )}
                </>
              ))}

              {renderSection('Working hours', <Clock10 size={20} color="#6366F1" />, (
                <View style={styles.workingHoursContainer}>
                  {shiftTimings.map((shift: any, index: number) => (
                    <TouchableOpacity
                      key={index}
                      style={[
                        styles.workingHourButton,
                        formData.shift_id === shift.shift_id.toString() && styles.workingHourButtonSelected,
                      ]}
                      onPress={() => handleInputChange('shift_id', shift.shift_id.toString())}
                    >
                      <Text
                        style={[
                          styles.workingHourText,
                          formData.shift_id === shift.shift_id.toString() && styles.workingHourTextSelected,
                        ]}
                      >
                        {/* Format time logic needed here if not already available, reusing simple string for now if possible or raw time */}
                        {shift.shift_name} ({shift.from_time.slice(0, 5)} - {shift.to_time.slice(0, 5)})
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