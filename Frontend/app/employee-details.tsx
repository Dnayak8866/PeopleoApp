import React from 'react';
import EmployeeDetailsScreen from '@/screens/EmployeeDetailsScreen';
import { useAuth } from '@/context/AuthContext';

export default function EmployeeDetailsPage() {
  const { userDetails } = useAuth();
  const id = userDetails?.id ? userDetails.id.toString() : '';

  return <EmployeeDetailsScreen employeeId={id} />;
}