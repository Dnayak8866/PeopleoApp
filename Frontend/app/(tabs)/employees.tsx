import { Colors } from '@/constants/Colors';
import Checkbox from 'expo-checkbox';
import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import {
  Bell,
  Edit,
  Mail,
  MessageCircle,
  Phone,
  Search,
  Trash2,
  UserPlus
} from 'lucide-react-native';
import React, { useState } from 'react';
import {
  Alert,
  Image,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';

interface Employee {
  id: string;
  name: string;
  position: string;
  avatar?: string;
  initials?: string;
  backgroundColor?: string;
}

const employees: Employee[] = [
  {
    id: '1',
    name: 'Alice Jo',
    position: 'Software Engineer',
    initials: 'AJ',
    backgroundColor: '#14B8A6',
  },
  {
    id: '2',
    name: 'John Doe',
    position: 'Product Manager',
    avatar: 'https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=400',
  },
  {
    id: '3',
    name: 'Sophia Chen',
    position: 'UX Designer',
    avatar: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=400',
  },
  {
    id: '4',
    name: 'Robert Davis',
    position: 'Marketing',
    initials: 'RD',
    backgroundColor: '#9CA3AF',
  },
  {
    id: '5',
    name: 'Isabella Martinez',
    position: 'HR Business Partner',
    avatar: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=400',
  },
];

export default function EmployeesScreen() {
  const [searchText, setSearchText] = useState('');
  const [selectedEmployees, setSelectedEmployees] = useState<Set<string>>(new Set());
  const [selectAll, setSelectAll] = useState(false);
  const router = useRouter();

  const filteredEmployees = employees.filter(employee =>
    employee.name.toLowerCase().includes(searchText.toLowerCase()) ||
    employee.position.toLowerCase().includes(searchText.toLowerCase())
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
    Alert.alert('Call', `Calling ${employee.name}`);
  };

  const handleMessage = (employee: Employee) => {
    Alert.alert('Message', `Messaging ${employee.name}`);
  };

  const handleDelete = (employee: Employee) => {
    Alert.alert(
      'Delete Employee',
      `Are you sure you want to delete ${employee.name}?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete', style: 'destructive', onPress: () => {
            Alert.alert('Deleted', `${employee.name} has been removed`);
          }
        },
      ]
    );
  };

  const handleAddEmployee = () => {
    router.push('/add-employee');
  };

  const renderAvatar = (employee: Employee) => {
    if (employee.avatar) {
      return (
        <Image
          source={{ uri: employee.avatar }}
          style={styles.avatar}
        />
      );
    }

    return (
      <View style={[styles.avatarPlaceholder, { backgroundColor: employee.backgroundColor }]}>
        <Text style={styles.avatarText}>{employee.initials}</Text>
      </View>
    );
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#FFFFFF'}}>
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Employees</Text>
          <TouchableOpacity style={styles.notificationButton}>
            <Bell size={24} color="#374151" />
          </TouchableOpacity>
          <View style={styles.profileAvatar}>
            <Text style={styles.profileAvatarText}>JD</Text>
          </View>
        </View>

        <View style={styles.searchContainer}>
          <View style={styles.searchInputContainer}>
            <Search size={20} color="#9CA3AF" />
            <TextInput
              style={styles.searchInput}
              placeholder="Search employees..."
              placeholderTextColor="#9CA3AF"
              value={searchText}
              onChangeText={setSearchText}
            />
          </View>
        </View>

        <View style={{ flex: 1, backgroundColor: Colors.background }}>
          <View style={styles.selectAllContainer}>
            <Checkbox
              style={styles.checkbox}
              value={selectAll}
              onValueChange={toggleSelectAll}
              color={selectAll ? Colors.primary : undefined}
            />
            <Text style={styles.selectAllText}>Select All</Text>
          </View>

          <ScrollView style={styles.employeeList} showsVerticalScrollIndicator={false}>
            {filteredEmployees.map((employee) => (
              <View key={employee.id} style={styles.employeeCard}>
                <Checkbox
                  style={styles.checkbox}
                  value={selectedEmployees.has(employee.id)}
                  onValueChange={() => toggleEmployeeSelection(employee.id)}
                  color={selectedEmployees.has(employee.id) ? Colors.primary : undefined}
                />

                {renderAvatar(employee)}

                <View style={styles.employeeInfo}>
                  <Text style={styles.employeeName}>{employee.name}</Text>
                  <Text style={styles.employeePosition}>{employee.position}</Text>
                </View>

                <View style={styles.actionButtons}>
                  <TouchableOpacity
                    style={styles.actionButton}
                    onPress={() => handleCall(employee)}
                  >
                    <Phone size={16} color="#EF4444" />
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.actionButton}
                    onPress={() => handleMessage(employee)}
                  >
                    <MessageCircle size={16} color="#EF4444" />
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.actionButton}
                    onPress={() => handleDelete(employee)}
                  >
                    <Mail size={16} color="#EF4444" />
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.actionButton}
                    onPress={() => handleDelete(employee)}
                  >
                    <Edit size={16} color="grey" />
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.actionButton}
                    onPress={() => handleDelete(employee)}
                  >
                    <Trash2 size={16} color="#EF4444" />
                  </TouchableOpacity>
                </View>
              </View>
            ))}
          </ScrollView>

          <TouchableOpacity style={styles.fab} onPress={handleAddEmployee}>
            <UserPlus size={24} color="#FFFFFF" />
          </TouchableOpacity>
        </View>
      </View>
      <StatusBar style="dark" />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 14,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 20,
    backgroundColor: '#FFFFFF',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1F2937',
    flex: 1,
    textAlign: 'center',
    marginLeft: 64,
  },
  notificationButton: {
    padding: 8,
    marginRight: 12,
  },
  profileAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  profileAvatarText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  searchContainer: {
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  searchInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F7F7F780',
    borderRadius: 10,
    paddingHorizontal: 12,
    gap: 6,
    borderColor:'#EBEBEA99',
    borderWidth: 1,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: '#1F2937',
    backgroundColor: '#F7F7F780'
  },
  selectAllContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 10,
    marginLeft: 18,
  },
  selectAllButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  selectAllText: {
    fontSize: 16,
    color: '#374151',
    fontWeight: '500',
  },
  employeeList: {
    flex: 1,
    marginHorizontal: 10,
  },
  employeeCard: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 14,
    marginHorizontal: 8,
    borderRadius: 8,
    marginBottom: 10,
    backgroundColor: '#FFFFFF',
    boxShadow: '0px 0px 1px #171a1f12, 0px 0px 2px #171a1f1F'
  },
  checkbox: {
    width: 20,
    height: 20,
    marginRight: 16,
    borderRadius: 4,
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    marginRight: 16,
  },
  avatarPlaceholder: {
    width: 48,
    height: 48,
    borderRadius: 24,
    marginRight: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '600',
  },
  employeeInfo: {
    flex: 1,
  },
  employeeName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 4,
  },
  employeePosition: {
    fontSize: 14,
    color: '#6B7280',
  },
  actionButtons: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    width: 120,
  },
  actionButton: {
    padding: 5,
    borderRadius: 6,
    marginLeft: 6,
  },
  fab: {
    position: 'absolute',
    right: 20,
    bottom: 30,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: Colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
});