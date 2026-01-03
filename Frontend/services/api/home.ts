import api from './apiService';
import { UserDetails } from '@/context/AuthContext';
import {
    Role,
    Designation,
    Department,
    LeaveType,
    ShiftTiming,
} from '../types/masterData.types';

export interface CompanyDetails {
    id: number;
    name: string;
    email: string;
    contactNumber: string;
    address: string;
}

export interface MasterData {
    roles: Role[];
    departments: Department[];
    designations: Designation[];
    leaveTypes: LeaveType[];
    shiftTimings: ShiftTiming[];
}

export interface HomePageDetails {
    user: UserDetails;
    company: CompanyDetails;
    masterData: MasterData;
}

export const getHomePageDetails = async (userId: number, companyId: number): Promise<HomePageDetails> => {
    try {
        const response = await api.post('/auth/home-page-details', {
            userId,
            companyId,
        });
        return response.data;
    } catch (error) {
        console.error('Failed to fetch home page details:', error);
        throw error;
    }
};
