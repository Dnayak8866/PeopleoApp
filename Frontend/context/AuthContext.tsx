import { login as loginApi } from '@/services/api/auth';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { jwtDecode } from 'jwt-decode';
import React, { createContext, ReactNode, useContext, useEffect, useState } from 'react';

interface DecodedAccessToken {
  sub: number;        // userId
  companyId: number;
}

export interface UserDetails {
  id: number;
  fullName: string;
  email: string;
  phoneNumber: string;
  roleId: number;
  departmentId: number;
  designationId: number;
  employeeCode: string;
  companyId: number;
}

interface AuthContextType {
  userId: number | null;
  companyId: number | null;
  accessToken: string | null;
  refreshToken: string | null;
  userDetails: UserDetails | null;
  loading: boolean;
  login: (phone: string, pin: string) => Promise<boolean>;
  logout: () => Promise<void>;
  setUserDetails: (details: UserDetails | null) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [userId, setUserId] = useState<number | null>(null);
  const [companyId, setCompanyId] = useState<number | null>(null);
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [refreshToken, setRefreshToken] = useState<string | null>(null);
  const [userDetails, setUserDetails] = useState<UserDetails | null>(null);
  const [loading, setLoading] = useState(true);

  // Restore auth state from AsyncStorage
  useEffect(() => {
    const restoreAuth = async () => {
      setLoading(true);
      try {
        const storedAccessToken = await AsyncStorage.getItem('accessToken');
        const storedRefreshToken = await AsyncStorage.getItem('refreshToken');

        if (storedAccessToken) {
          setAccessToken(storedAccessToken);
          const decoded = jwtDecode<DecodedAccessToken>(storedAccessToken);
          setUserId(decoded.sub);
          setCompanyId(decoded.companyId);
        }
        if (storedRefreshToken) setRefreshToken(storedRefreshToken);
      } catch (e) {
        setUserId(null);
        setCompanyId(null);
        setAccessToken(null);
        setRefreshToken(null);
      } finally {
        setLoading(false);
      }
    };
    restoreAuth();
  }, []);

  const login = async (phone: string, pin: string) => {
    setLoading(true);
    try {
      const response = await loginApi(phone, pin);
      const { accessToken, refreshToken } = response;
      const decoded = jwtDecode<DecodedAccessToken>(accessToken);
      await AsyncStorage.setItem('accessToken', accessToken);
      await AsyncStorage.setItem('refreshToken', refreshToken);
      await AsyncStorage.setItem('companyId', decoded.companyId.toString());
      await AsyncStorage.setItem('userId', decoded.sub.toString());

      setAccessToken(accessToken);
      setRefreshToken(refreshToken);
      setUserId(decoded.sub);
      setCompanyId(decoded.companyId);
      return true;
    } catch (e) {
      console.error('Login error:', e);
      setUserId(null);
      setCompanyId(null);
      setAccessToken(null);
      setRefreshToken(null);
      return false;
    } finally {
      setLoading(false);
    }
  };

  // Logout function
  const logout = async () => {
    setLoading(true);
    await AsyncStorage.removeItem('accessToken');
    await AsyncStorage.removeItem('refreshToken');
    await AsyncStorage.removeItem('companyId');
    await AsyncStorage.removeItem('userId');
    setUserId(null);
    setCompanyId(null);
    setAccessToken(null);
    setRefreshToken(null);
    setUserDetails(null);
    setLoading(false);
  };

  return (
    <AuthContext.Provider value={{ userId, companyId, accessToken, refreshToken, userDetails, loading, login, logout, setUserDetails }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};