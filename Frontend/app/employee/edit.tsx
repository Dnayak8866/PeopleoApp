import EditProfileScreen from '@/screens/EditEmployeeFormScreen';
import { Stack } from 'expo-router';
import React from 'react';

const EditEmployee = () => {
  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />
      <EditProfileScreen />
    </>
  )
}

export default EditEmployee;