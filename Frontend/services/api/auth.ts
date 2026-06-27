import { jwtDecode } from 'jwt-decode';
import axios from 'axios';
import api, { API_BASE_URL } from './apiService';
import { LoginResponse, HomePageDetails } from '../types/auth';

export const validatePhone = async (phone: string): Promise<{ valid: boolean; message: string }> => {
  try {
    const response = await api.post('/auth/validate-phone', { phone });
    return response.data;
  } catch (error) {
    console.error('Failed to validate phone:', error);
    throw error;
  }
};

export const login = async (phone: string, pin: string): Promise<LoginResponse> => {
  try {
    const response = await api.post('/auth/login', {
      phone,
      password: pin,
    });
    return response.data;
  } catch (error) {
    console.error('Failed to login:', error);
    throw error;
  }
};

export const getAccessToken = async (refreshToken: string) => {
  try {
    const baseUrlCleaned = API_BASE_URL.endsWith('/') ? API_BASE_URL.slice(0, -1) : API_BASE_URL;
    const response = await axios.post(`${baseUrlCleaned}/auth/accessToken`, {
      refreshToken,
    });
    return response.data;
  } catch (error) {
    console.error('Failed to refresh access token:', error);
    throw error;
  }
};

export const decodeToken = (token: string) => {
  try {
    return jwtDecode(token);
  } catch (e) {
    return null;
  }
};