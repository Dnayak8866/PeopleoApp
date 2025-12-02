import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { getAccessToken } from './auth';

const API_BASE_URL = process.env.API_URI || 'http://192.168.1.28:3000';

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor: Attach access token if available
api.interceptors.request.use(
  async (config) => {
    // Log which API URL and method we're calling (helps debugging network requests)
    try {
      const base = config.baseURL || API_BASE_URL || '';
      const url = config.url || '';
      // Handle cases where url might already be absolute or contains a leading slash
      const fullUrl = base
        ? url.startsWith('http')
          ? url
          : `${base.replace(/\/$/, '')}/${url.replace(/^\//, '')}`
        : url;
      const method = (config.method || 'get').toString().toUpperCase();
      console.log(`[api] ${method} ${fullUrl}`);
    } catch (logErr) {
      console.warn('[api] Failed to log request URL', logErr);
    }
    const token = await AsyncStorage.getItem('accessToken');
    if (token && config.headers) {
      config.headers['authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor: Handle 401, refresh token, etc.
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      try {
        const refreshToken = await AsyncStorage.getItem('refreshToken');
        if (refreshToken) {
          const res = await getAccessToken(refreshToken);
          const { accessToken: newAccessToken } = res.data;
          await AsyncStorage.setItem('accessToken', newAccessToken);
          // Update the Authorization header and retry the original request
          originalRequest.headers['Authorization'] = `Bearer ${newAccessToken}`;
          return api(originalRequest);
        }
      } catch (refreshError) {
        // Refresh failed: clear storage and optionally redirect to login
        await AsyncStorage.removeItem('accessToken');
        await AsyncStorage.removeItem('refreshToken');
        await AsyncStorage.removeItem('userInfo');
        // router.navigate('/login'); // Redirect to login page
      }
    }
    return Promise.reject(error);
  }
);

export default api; 