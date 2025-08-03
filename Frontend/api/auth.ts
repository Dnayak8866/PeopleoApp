// import axios from 'axios'; // Uncomment when using real API
// import api from './apiService';
import { jwtDecode } from 'jwt-decode';

const dummyAccessToken =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiIxMjM0NTYiLCJwaG9uZSI6IjEyMzQ1Njc4OTAiLCJyb2xlIjoiYWRtaW4iLCJpYXQiOjE2ODAwMDAwMDAsImV4cCI6MTY4MDA4NjQwMH0.abc123';
const dummyRefreshToken =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiIxMjM0NTYiLCJpYXQiOjE2ODAwMDAwMDAsImV4cCI6MTY4MjU5MjAwMH0.def456';

export const login = async (phone: string, pin: string) => {
  await new Promise((resolve) => setTimeout(resolve, 500));
  return {
    data: {
      accessToken: dummyAccessToken,
      refreshToken: dummyRefreshToken,
    },
  };

    // --- Real API call example ---
  // try {
  //   const response = await api.post('/auth/login', {
  //     phone,
  //     pin,
  //   });
  //   return response;
  // } catch (error) {
  //   console.error('Failed to login:', error);
  //   throw error;
  // }
};

export const getAccessToken = async (refreshToken: string) => {
  await new Promise((resolve) => setTimeout(resolve, 300));
  return {
    data: {
      accessToken: dummyAccessToken,
    },
  };

  // --- Real API call example ---
  // try {
  //   const response = await api.post('/auth/accessToken', {
  //     refreshToken,
  //   });
  //   return response;
  // } catch (error) {
      //  console.error('Failed to refresh access token:', error);
  //   throw error;
  // }
};


export const decodeToken = (token: string) => {
  try {
    return jwtDecode(token);
  } catch (e) {
    return null;
  }
};
