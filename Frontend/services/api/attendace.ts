import { PunchInData, PunchOutData } from '../types/attendance';
import api from './apiService';
import * as Location from 'expo-location';

export const getTodaySessionStatus = async (employeeId: number): Promise<any> => {
  try {
    const response = await api.get(`/attendance/session-status/${employeeId}`);
    return response.data;
  } catch (error) {
    console.error('Failed to get session status:', error);
    throw error;
  }
};


export const punchIn = async (data: PunchInData): Promise<any> => {
  try {
    console.log('Punch in data:', data);
    
    let location: Location.LocationObject | null = null;
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status === 'granted') {
        location = await Location.getCurrentPositionAsync({
          accuracy: Location.Accuracy.Balanced,
        });
      }
    } catch (locationError) {
      console.warn('Failed to get location:', locationError);
    }

    const punchInPayload = {
      employee_id: data.employee_id,
      attendance_date: data.attendance_date.toISOString().split('T')[0],
      punch_in_latitude: location?.coords.latitude || data.punch_in_latitude,
      punch_in_longitude: location?.coords.longitude || data.punch_in_longitude,
      is_punch_in_from_office: data.is_punch_in_from_office ?? true,
      shift_id: data.shift_id,
    };

    const response = await api.post('/attendance/punch-in', punchInPayload);
    return response.data;
  } catch (error) {
    console.error('Failed to punch in:', error);
    throw error;
  }
};

export const punchOut = async (data: PunchOutData): Promise<any> => {
  try {
    console.log('Punch out data:', data);
    
    let location: Location.LocationObject | null = null;
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status === 'granted') {
        location = await Location.getCurrentPositionAsync({
          accuracy: Location.Accuracy.Balanced,
        });
      }
    } catch (locationError) {
      console.warn('Failed to get location:', locationError);
    }

    const punchOutPayload = {
      employee_id: data.employee_id,
      attendance_date: data.attendance_date.toISOString().split('T')[0],
      punch_out_latitude: location?.coords.latitude || data.punch_out_latitude,
      punch_out_longitude: location?.coords.longitude || data.punch_out_longitude,
      is_punch_out_from_office: data.is_punch_out_from_office ?? true,
    };

    const response = await api.post('/attendance/punch-out', punchOutPayload);
    return response.data;
  } catch (error) {
    console.error('Failed to punch out:', error);
    throw error;
  }
};