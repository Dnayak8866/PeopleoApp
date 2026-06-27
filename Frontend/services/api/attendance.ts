import { PunchInData, PunchOutData, DailySummary, AttendanceEmployee } from '../types/attendance';
import api from './apiService';
import * as Location from 'expo-location';

export const getTodaySessionStatus = async (employeeId: number): Promise<any> => {
    try {
        const todayStr = new Date().toISOString().split('T')[0];
        const response = await api.get(`/attendance/session-status/${employeeId}`, {
            params: { date: todayStr }
        });
        return response.data;
    } catch (error) {
        console.error('Failed to get session status:', error);
        throw error;
    }
};

const getLocationFast = async (): Promise<Location.LocationObject | null> => {
    try {
        // Check permission without showing dialog every time
        const { status } = await Location.getForegroundPermissionsAsync();

        if (status !== 'granted') {
            // Only show the permission dialog if not yet granted
            const { status: newStatus } = await Location.requestForegroundPermissionsAsync();
            if (newStatus !== 'granted') return null;
        }

        // Try last-known position first — it's instant (cached by OS)
        const lastKnown = await Location.getLastKnownPositionAsync({
            maxAge: 5 * 60 * 1000, // Accept if not older than 5 minutes
            requiredAccuracy: 500,  // Within 500 meters is good enough
        });
        if (lastKnown) return lastKnown;

        // Fall back to live location with a 5-second timeout to avoid hanging
        const locationPromise = Location.getCurrentPositionAsync({
            accuracy: Location.Accuracy.Balanced,
        });
        const timeoutPromise = new Promise<null>((resolve) =>
            setTimeout(() => resolve(null), 5000)
        );
        return await Promise.race([locationPromise, timeoutPromise]);
    } catch (locationError) {
        console.warn('Failed to get location:', locationError);
        return null;
    }
};

export const punchIn = async (data: PunchInData): Promise<any> => {
    try {
        const location = await getLocationFast();

        const punchInPayload = {
            employee_id: data.employee_id,
            attendance_date: data.attendance_date.toISOString().split('T')[0],
            punch_in_latitude: location?.coords.latitude ?? data.punch_in_latitude,
            punch_in_longitude: location?.coords.longitude ?? data.punch_in_longitude,
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
        const location = await getLocationFast();

        const punchOutPayload = {
            employee_id: data.employee_id,
            attendance_date: data.attendance_date.toISOString().split('T')[0],
            punch_out_latitude: location?.coords.latitude ?? data.punch_out_latitude,
            punch_out_longitude: location?.coords.longitude ?? data.punch_out_longitude,
            is_punch_out_from_office: data.is_punch_out_from_office ?? true,
        };

        const response = await api.post('/attendance/punch-out', punchOutPayload);
        return response.data;
    } catch (error) {
        console.error('Failed to punch out:', error);
        throw error;
    }
};

export const getDailyAttendanceSummary = async (date: string, companyId: number): Promise<DailySummary> => {
    try {
        const response = await api.get('/attendance/daily-summary', {
            params: { date, company_id: companyId },
        });
        return response.data;
    } catch (error) {
        console.error('Failed to fetch daily summary:', error);
        throw error;
    }
};

export const getAttendanceByDate = async (date: string, companyId: number): Promise<AttendanceEmployee[]> => {
    try {
        const response = await api.get('/attendance/by-date', {
            params: { date, company_id: companyId },
        });
        return response.data;
    } catch (error) {
        console.error('Failed to fetch attendance by date:', error);
        throw error;
    }
};

export const getEmployeeAttendancePercentage = async (
    employeeId: number,
    month: number,
    year: number,
    companyId?: number,
): Promise<{ percentage: number; presentDays: number; absentDays: number; totalDays: number }> => {
    try {
        const response = await api.get('/attendance/percentage', {
            params: { employeeId, month, year, companyId },
        });
        return response.data;
    } catch (error) {
        console.error('Failed to fetch attendance percentage:', error);
        throw error;
    }
};

export const getEmployeeStats = async (
    employeeId: number,
    month: number,
    year: number
): Promise<any> => {
    try {
        const response = await api.get('/attendance/employee-stats', {
            params: { employeeId, month, year },
        });
        return response.data;
    } catch (error) {
        console.error('Failed to fetch employee stats:', error);
        throw error;
    }
};

export const getCompanyStats = async (
    companyId: number,
    month: number,
    year: number
): Promise<any> => {
    try {
        const response = await api.get('/attendance/company-stats', {
            params: { companyId, month, year },
        });
        return response.data;
    } catch (error) {
        console.error('Failed to fetch company stats:', error);
        throw error;
    }
};

export const getEmployeeAttendanceHistory = async (
    employeeId: number,
    month: number,
    year: number
): Promise<{
    date: string;
    punchIn: string | null;
    punchOut: string | null;
    workedHours: string;
    status: string;
    leaveType: string | null;
}[]> => {
    try {
        const response = await api.get('/attendance/employee-history', {
            params: { employeeId, month, year },
        });
        return response.data;
    } catch (error) {
        console.error('Failed to fetch attendance history:', error);
        throw error;
    }
};
