import EmployeeDetailsScreen from '@/screens/EmployeeDetailsScreen'
import { useLocalSearchParams } from 'expo-router'
import React from 'react'
import { StyleSheet } from 'react-native'

const Attendance = () => {
   const { id } = useLocalSearchParams<{ id: string }>()
  return (
    <EmployeeDetailsScreen employeeId={id}/>
  )
}

export default Attendance

const styles = StyleSheet.create({})