import EmployeeDetailsScreen from '@/screens/EmployeeDetailsScreen';
import { Stack, useLocalSearchParams } from 'expo-router';

export default function EmployeeDetailsById() {
  const params = useLocalSearchParams();
  const id = typeof params.id === 'string' ? params.id : Array.isArray(params.id) ? params.id[0] : '';

  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />
      <EmployeeDetailsScreen employeeId={id} />
    </>
  );
}