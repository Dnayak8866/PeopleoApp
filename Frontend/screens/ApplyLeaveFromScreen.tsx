import { applyLeaveFormScreenStyles } from '@/styles/applyLeaveFormScreenStyles';
import DateTimePicker from '@react-native-community/datetimepicker';
import { router } from 'expo-router';
import { Banknote, Bell, BriefcaseBusiness, CalendarDays, ChevronDown, ChevronLeft, HeartPulse, Moon, Sun } from 'lucide-react-native';
import { useState } from 'react';
import { ScrollView, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';


export default function ApplyLeaveFormScreen() {
    const [startDate, setStartDate] = useState(new Date());
    const [endDate, setEndDate] = useState(new Date());
    const [showStartPicker, setShowStartPicker] = useState(false);
    const [showEndPicker, setShowEndPicker] = useState(false);
    const [leaveType, setLeaveType] = useState('Casual Leave');
    const [showLeaveTypeDropdown, setShowLeaveTypeDropdown] = useState(false);
    const [duration, setDuration] = useState<'Full Day' | 'Half Day'>('Full Day');
    const [reason, setReason] = useState('');
    const styles = applyLeaveFormScreenStyles();
    
    const leaveTypes = ['Casual Leave', 'Sick Leave', 'Earned Leave'];
    

    const onStartDateChange = (event: any, selectedDate?: Date) => {
        setShowStartPicker(false);
        if (selectedDate) {
            setStartDate(selectedDate);
        }
    };

    const onEndDateChange = (event: any, selectedDate?: Date) => {
        setShowEndPicker(false);
        if (selectedDate) {
            setEndDate(selectedDate);
        }
    };

    const handleSubmit = () => {
        // Handle form submission
        console.log('Submitting leave application...');
        router.back();
    };

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity
                    style={styles.backButton}
                    onPress={() => router.push('/(employee)/leave')}
                >
                    <ChevronLeft size={24} color="#374151" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Apply for Leave</Text>
                <View style={styles.headerRight}>
                    <TouchableOpacity style={styles.notificationButton}>
                        <Bell size={24} color="#374151" />
                    </TouchableOpacity>
                    <View style={styles.profileAvatar}>
                        <Text style={styles.profileInitial}>J</Text>
                    </View>
                </View>
            </View>

            <ScrollView 
                style={styles.scrollView} 
                showsVerticalScrollIndicator={false}
                onScrollBeginDrag={() => setShowLeaveTypeDropdown(false)}>
                <View style={styles.content}>
                    <Text style={styles.sectionTitle}>Your Leave Balance</Text>

                    <View style={styles.balanceContainer}>
                        <View style={styles.balanceCard}>
                            <View style={styles.balanceInfo}>
                                <View style={[styles.balanceIcon, { backgroundColor: '#0056B31A' }]}>
                                    <BriefcaseBusiness size={24} color="#3b82f6" />
                                </View>
                                <Text style={styles.balanceLabel}>Casual Leave</Text>
                            </View>
                            <View style={styles.balanceValue}>
                                <Text style={styles.balanceNumber}>5</Text>
                                <Text style={styles.balanceDays}>days</Text>
                            </View>
                        </View>

                        <View style={styles.balanceCard}>
                            <View style={[styles.balanceInfo]}>
                                <View style={[styles.balanceIcon, { backgroundColor: '#22C55E1A' }]}>
                                    <HeartPulse size={24} color="#0056B3FF" />
                                </View>
                                <Text style={styles.balanceLabel}>Sick Leave</Text>
                            </View>
                            <View style={styles.balanceValue}>
                                <Text style={[styles.balanceNumber, { color: '#16A34AFF' }]}>3</Text>
                                <Text style={styles.balanceDays}>days</Text>
                            </View>
                        </View>

                        <View style={styles.balanceCard}>
                            <View style={[styles.balanceInfo]}>
                                <View style={[styles.balanceIcon, { backgroundColor: '#F973161A' }]}>
                                    <Banknote size={24} color="#3b82f6" />
                                </View>
                                <Text style={styles.balanceLabel}>Earned Leave</Text>
                            </View>
                            <View style={styles.balanceValue}>
                                <Text style={[styles.balanceNumber, { color: '#ef4444' }]}>12</Text>
                                <Text style={styles.balanceDays}>days</Text>
                            </View>
                        </View>
                    </View>

                    <Text style={styles.sectionTitle}>Apply for Leave</Text>

                    <View style={styles.formContainer}>
                        <View style={styles.inputGroup}>
                            <Text style={styles.inputLabel}>Start Date</Text>
                            <TouchableOpacity 
                                style={styles.dateInput}
                                onPress={() => setShowStartPicker(true)}
                            >
                                <CalendarDays size={20} color="#9ca3af" />
                                <Text style={styles.dateInputText}>
                                    {startDate.toLocaleDateString()}
                                </Text>
                            </TouchableOpacity>
                            {showStartPicker && (
                                <DateTimePicker
                                    value={startDate}
                                    mode="date"
                                    display="default"
                                    onChange={onStartDateChange}
                                    minimumDate={new Date()}
                                    accentColor='red'
                                />
                            )}
                        </View>

                        <View style={styles.inputGroup}>
                            <Text style={styles.inputLabel}>End Date</Text>
                            <TouchableOpacity 
                                style={styles.dateInput}
                                onPress={() => setShowEndPicker(true)}
                            >
                                <CalendarDays size={20} color="#9ca3af" />
                                <Text style={styles.dateInputText}>
                                    {endDate.toLocaleDateString()}
                                </Text>
                            </TouchableOpacity>
                            {showEndPicker && (
                                <DateTimePicker
                                    value={endDate}
                                    mode="date"
                                    display="default"
                                    onChange={onEndDateChange}
                                    minimumDate={startDate}
                                />
                            )}
                        </View>

                        <View style={styles.inputGroup}>
                            <Text style={styles.inputLabel}>Leave Type</Text>
                            <TouchableOpacity 
                                style={styles.dropdown}
                                onPress={() => setShowLeaveTypeDropdown(!showLeaveTypeDropdown)}
                            >
                                <Text style={styles.dropdownText}>{leaveType}</Text>
                                <ChevronDown size={20} color="#9ca3af" />
                            </TouchableOpacity>
                            {showLeaveTypeDropdown && (
                                <View style={{
                                    position: 'absolute',
                                    top: '100%',
                                    left: 0,
                                    right: 0,
                                    backgroundColor: 'white',
                                    borderRadius: 8,
                                    shadowColor: '#000',
                                    shadowOffset: {
                                        width: 0,
                                        height: 2,
                                    },
                                    shadowOpacity: 0.25,
                                    shadowRadius: 3.84,
                                    elevation: 5,
                                    zIndex: 1000,
                                }}>
                                    {leaveTypes.map((type) => (
                                        <TouchableOpacity
                                            key={type}
                                            style={{
                                                padding: 15,
                                                borderBottomWidth: type !== leaveTypes[leaveTypes.length - 1] ? 1 : 0,
                                                borderBottomColor: '#e5e7eb',
                                            }}
                                            onPress={() => {
                                                setLeaveType(type);
                                                setShowLeaveTypeDropdown(false);
                                            }}
                                        >
                                            <Text style={{
                                                color: '#374151',
                                                fontSize: 16,
                                            }}>
                                                {type}
                                            </Text>
                                        </TouchableOpacity>
                                    ))}
                                </View>
                            )}
                        </View>

                        <View style={styles.inputGroup}>
                            <Text style={styles.inputLabel}>Duration</Text>
                            <View style={styles.durationContainer}>
                                <TouchableOpacity
                                    style={[
                                        styles.durationButton,
                                        duration === 'Full Day' && styles.durationButtonActive,
                                    ]}
                                    onPress={() => setDuration('Full Day')}
                                >
                                    <Sun size={20} color={duration === 'Full Day' ? '#ffffff' : '#6b7280'} />
                                    <Text style={[
                                        styles.durationButtonText,
                                        duration === 'Full Day' && styles.durationButtonTextActive,
                                    ]}>
                                        Full Day
                                    </Text>
                                </TouchableOpacity>

                                <TouchableOpacity
                                    style={[
                                        styles.durationButton,
                                        duration === 'Half Day' && styles.durationButtonActive,
                                    ]}
                                    onPress={() => setDuration('Half Day')}
                                >
                                    <Moon size={20} color={duration === 'Half Day' ? '#ffffff' : '#6b7280'} />
                                    <Text style={[
                                        styles.durationButtonText,
                                        duration === 'Half Day' && styles.durationButtonTextActive,
                                    ]}>
                                        Half Day
                                    </Text>
                                </TouchableOpacity>
                            </View>
                        </View>

                        <View style={styles.inputGroup}>
                            <Text style={styles.inputLabel}>Reason for Leave</Text>
                            <TextInput
                                style={styles.textArea}
                                placeholder="Enter your reason for leave..."
                                placeholderTextColor="#9ca3af"
                                value={reason}
                                onChangeText={setReason}
                                multiline
                                numberOfLines={4}
                                textAlignVertical="top"
                            />
                        </View>

                        <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
                            <Text style={styles.submitButtonText}>Submit Leave Application</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}