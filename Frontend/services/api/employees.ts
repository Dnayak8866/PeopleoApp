import api from './apiService';

export const getEmployees = async () => {
  try {
    const response = await api.get('/user');
    return response.data;
  } catch (error) {
    console.error('Failed to fetch employees:', error);
    throw error;
  }
};

export const getEmployeeDetailsById = async (id: any) => {
  try {
    const response = await api.get(`/user/${id}`);
    return response.data;
  } catch (error) {
    console.error('Failed to fetch employee:', error);
    throw error;
  }
};

export const createEmployee = async (employeeData: any) => {
  try {
    if (!employeeData.role_id) {
      employeeData.role_id = 2; // Default: employee role
    }
    const response = await api.post('/user', employeeData);
    return response.data;
  } catch (error) {
    console.error('Failed to create employee:', error);
    throw error;
  }
};

export const updateEmployee = async (id: any, employeeData: any) => {
  try {
    const response = await api.patch(`/user/${id}`, employeeData);
    return response.data;
  } catch (error) {
    console.error('Failed to update employee:', error);
    throw error;
  }
};

export const deleteEmployee = async (id: any) => {
  try {
    const response = await api.delete(`/user/${id}`);
    return response.data;
  } catch (error) {
    console.error('Failed to delete employee:', error);
    throw error;
  }
};