import { Colors } from '@/constants/Colors';
import { employeeListScreenStyles } from '@/styles/employeeListScreenStyles';
import Checkbox from 'expo-checkbox';
import { useFocusEffect, useRouter } from 'expo-router';
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
import React, { useEffect, useState } from 'react';
import {
  Alert,
  Animated,
  Image,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { getEmployees } from '../../api/employees';

interface Employee {
  id: string;
  name: string;
  position: string;
  avatar?: string;
  initials?: string;
  backgroundColor?: string;
}

const SkeletonItem = () => {
  const animatedValue = new Animated.Value(0);
  const styles = employeeListScreenStyles();

  useEffect(() => {
    const startAnimation = () => {
      Animated.sequence([
        Animated.timing(animatedValue, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: false,
        }),
        Animated.timing(animatedValue, {
          toValue: 0,
          duration: 1000,
          useNativeDriver: false,
        }),
      ]).start(() => startAnimation());
    };

    startAnimation();
  }, []);

  const opacity = animatedValue.interpolate({
    inputRange: [0, 1],
    outputRange: [0.3, 0.7],
  });

  return (
    <View style={styles.employeeCard}>
      <Animated.View style={[styles.skeletonCheckbox, { opacity }]} />
      
      <Animated.View style={[styles.skeletonAvatar, { opacity }]} />
      
      <View style={styles.employeeInfo}>
        <Animated.View style={[styles.skeletonName, { opacity }]} />
        <Animated.View style={[styles.skeletonPosition, { opacity }]} />
      </View>
      
      <View style={styles.actionButtons}>
        {[...Array(5)].map((_, index) => (
          <Animated.View key={index} style={[styles.skeletonActionButton, { opacity }]} />
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
  const styles = employeeListScreenStyles();

  const dummyEmployees: Employee[] = [
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

  useFocusEffect(
    React.useCallback(() => {
      let isActive = true;
      setIsLoading(true);
      getEmployees()
        .then((data) => {
          if (isActive && Array.isArray(data)) {
            setEmployees(data);
          } else if (isActive) {
            setEmployees(dummyEmployees);
          }
        })
        .catch((error) => {
          setEmployees(dummyEmployees);
        })
        .finally(() => {
          if (isActive) setIsLoading(false);
        });
      return () => {
        isActive = false;
      };
    }, [])
  );

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
    router.push('/employee/add');
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

  const renderEmployeeList = () => {
    if (isLoading) {
      return (
        <>
          <View style={styles.selectAllContainer}>
            <Animated.View style={styles.skeletonCheckbox} />
            <Animated.View style={styles.skeletonSelectAllText} />
          </View>
          
          {[...Array(5)].map((_, index) => (
            <SkeletonItem key={index} />
          ))}
        </>
      );
    }

    return (
      <>
        <View style={styles.selectAllContainer}>
          <Checkbox
            style={styles.checkbox}
            value={selectAll}
            onValueChange={toggleSelectAll}
            color={selectAll ? Colors.primary : undefined}
          />
          <Text style={styles.selectAllText}>Select All</Text>
        </View>

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
      </>
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
              editable={!isLoading}
            />
          </View>
        </View>

        <View style={{ flex: 1, backgroundColor: Colors.background }}>
          <ScrollView style={styles.employeeList} showsVerticalScrollIndicator={false}>
            {renderEmployeeList()}
          </ScrollView>

          {!isLoading && (
            <TouchableOpacity style={styles.fab} onPress={handleAddEmployee}>
              <UserPlus size={24} color="#FFFFFF" />
            </TouchableOpacity>
          )}
        </View>
      </View>
      <StatusBar style="dark" />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  
});