import AddEmployeeScreen from '@/screens/AddEmployeeFormScreen';
import { Stack } from 'expo-router';
import React from 'react';

const AddEmployee = () => {
  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />
      <AddEmployeeScreen />
    </>
  )
}

export default AddEmployee;