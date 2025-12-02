import api from './apiService';
import {
  Role,
  Designation,
  Department,
  LeaveType,
  ShiftTiming,
} from '../types/masterData.types';

export const getRoles = async (companyId: number): Promise<Role[]> => {
  const resp = await api.get('/roles', { params: { companyId } });
  return resp.data;
};

export const getDesignations = async (companyId: number): Promise<Designation[]> => {
  const resp = await api.get('/designations', { params: { companyId } });
  return resp.data;
};

export const getDepartments = async (companyId: number): Promise<Department[]> => {
  const resp = await api.get('/departments', { params: { companyId } });
  return resp.data;
};

export const getLeaveTypes = async (companyId: number): Promise<LeaveType[]> => {
  const resp = await api.get('/leave-types', { params: { companyId } });
  return resp.data;
};

export const getShiftTimings = async (companyId: number): Promise<ShiftTiming[]> => {
  const resp = await api.get('/shift-timings', { params: { companyId } });
  return resp.data;
};
