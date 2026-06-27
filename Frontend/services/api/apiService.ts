import { storage } from '../secureStorage';
import axios from 'axios';
import { router } from 'expo-router';
import { getAccessToken } from './auth';
import Constants from 'expo-constants';

export const API_BASE_URL =
  Constants?.expoConfig?.extra?.apiUri ??
  process.env.EXPO_PUBLIC_API_URI ??
  'http://localhost:3000/api/';

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
    const token = await storage.getItemAsync('accessToken');
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

    // Guard: if config is missing (e.g. network error before request was sent)
    if (!originalRequest) {
      return Promise.reject(error);
    }

    // Check if the error comes from the refresh token endpoint itself
    if (originalRequest.url?.includes('/auth/accessToken')) {
      // Refresh token failed or expired
      await storage.deleteItemAsync('accessToken');
      await storage.deleteItemAsync('refreshToken');
      await storage.deleteItemAsync('userInfo');
      router.replace('/(auth)/login');
      return Promise.reject(error);
    }

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      try {
        const refreshToken = await storage.getItemAsync('refreshToken');
        if (refreshToken) {
          const res = await getAccessToken(refreshToken);
          const newAccessToken = res.accessToken;
          await storage.setItemAsync('accessToken', newAccessToken);
          // Update the Authorization header and retry the original request
          originalRequest.headers['Authorization'] = `Bearer ${newAccessToken}`;
          return api(originalRequest);
        }
      } catch (refreshError) {
        // Refresh failed: clear storage and optionally redirect to login
        await storage.deleteItemAsync('accessToken');
        await storage.deleteItemAsync('refreshToken');
        await storage.deleteItemAsync('userInfo');
        router.replace('/(auth)/login');
      }
    }
    return Promise.reject(error);
  }
);

export default api; 