import api from "./apiService";

export const getLeaveTypes = async () => {
  try {
    const response = await api.get('/leave-types');
    return response.data;
  } catch (error) {
    console.error('Failed to fetch leave types:', error);
    throw error;
  }
};

export const applyLeave = async (leaveData: any) => {
  try {
    const response = await api.post('/leaves/apply', leaveData);
    return response.data;
  } catch (error) {
    console.error('Failed to apply for leave:', error);
    throw error;
  }
};

export const getEmployeeLeaves = async (employeeId: number) => {
  try {
    const response = await api.get(`/leaves/employee/${employeeId}`);
    return response.data;
  } catch (error) {
    console.error('Failed to fetch employee leaves:', error);
    throw error;
  }
};

export const getLeaveBalances = async (employeeId: number, companyId: number) => {
  try {
    const response = await api.get(`/leaves/balances/${employeeId}/${companyId}`);
    return response.data;
  } catch (error) {
    console.error('Failed to fetch leave balances:', error);
    throw error;
  }
};

export interface PendingLeave {
  leave_id: number;
  employee_id: number;
  employee_name: string;
  employee_avatar: string | null;
  leave_type: string;
  from_date: string;
  to_date: string;
  reason: string;
  applied_at: string;
  status: string;
}

export const getPendingLeaves = async (companyId: number): Promise<PendingLeave[]> => {
  try {
    const response = await api.get(`/leaves/pending/${companyId}`);
    return response.data;
  } catch (error) {
    console.error('Failed to fetch pending leaves:', error);
    throw error;
  }
};

export const approveLeave = async (leaveId: number, approvedBy: number): Promise<any> => {
  try {
    const response = await api.patch(`/leaves/${leaveId}/approve`, { approved_by: approvedBy });
    return response.data;
  } catch (error) {
    console.error('Failed to approve leave:', error);
    throw error;
  }
};

export const rejectLeave = async (leaveId: number): Promise<any> => {
  try {
    const response = await api.patch(`/leaves/${leaveId}/reject`);
    return response.data;
  } catch (error) {
    console.error('Failed to reject leave:', error);
    throw error;
  }
};

export const getEmployeeLeavesCount = async (employeeId: number): Promise<{ total_leaves_taken: number }> => {
  try {
    const response = await api.get(`/leaves/count/${employeeId}`);
    return response.data;
  } catch (error) {
    console.error('Failed to fetch employee leaves count:', error);
    throw error;
  }
};

export const getPendingLeavesCount = async (companyId: number): Promise<{ count: number }> => {
  try {
    const response = await api.get(`/leaves/pending-count/${companyId}`);
    return response.data;
  } catch (error) {
    console.error('Failed to fetch pending leaves count:', error);
    throw error;
  }
};