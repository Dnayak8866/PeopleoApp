import { jwtDecode } from 'jwt-decode';
import api from './apiService';
import { LoginResponse, HomePageDetails } from '../types/auth';

export const login = async (phone: string, pin: string): Promise<LoginResponse> => {
  try {
    console.log("phone,pin", phone, pin);
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
    const response = await api.post('/auth/accessToken', {
      refreshToken,
    });
    return response.data;
  } catch (error) {
    console.error('Failed to refresh access token:', error);
    throw error;
  }
};

export const getHomePageDetails = async (): Promise<HomePageDetails> => {
  try {
    const response = await api.get('/auth/home-page-details');
    return response.data;
  } catch (error) {
    console.error('Failed to fetch home page details:', error);
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