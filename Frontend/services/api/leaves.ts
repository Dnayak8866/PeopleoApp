import api from "./apiService";

export const getLeaveTypes = async () => {
  try {
    const response = await api.get('/leavetypes');
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