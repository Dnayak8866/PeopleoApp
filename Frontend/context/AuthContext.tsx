import { login as loginApi } from '@/services/api/auth';
import { UserDetails } from '@/services/types/auth';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { jwtDecode } from 'jwt-decode';
import React, { createContext, ReactNode, useContext, useEffect, useState } from 'react';

interface UserJwt {
  role: string;
  [key: string]: any;
}

interface AuthContextType {
  user: UserJwt | null;
  userDetails: UserDetails | null;
  companyId: number | null;
  accessToken: string | null;
  refreshToken: string | null;
  loading: boolean;
  login: (phone: string, pin: string) => Promise<boolean>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<UserJwt | null>(null);
  const [userDetails, setUserDetails] = useState<UserDetails | null>(null);
  const [companyId, setCompanyId] = useState<number | null>(null);
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [refreshToken, setRefreshToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  // Restore auth state from AsyncStorage
  useEffect(() => {
    const restoreAuth = async () => {
      setLoading(true);
      try {
        const storedAccessToken = await AsyncStorage.getItem('accessToken');
        const storedRefreshToken = await AsyncStorage.getItem('refreshToken');
        const storedUserDetails = await AsyncStorage.getItem('userDetails');
        const storedCompanyId = await AsyncStorage.getItem('companyId');

        if (storedAccessToken) {
          setAccessToken(storedAccessToken);
          setUser(jwtDecode<UserJwt>(storedAccessToken));
        }
        if (storedRefreshToken) setRefreshToken(storedRefreshToken);
        if (storedUserDetails) setUserDetails(JSON.parse(storedUserDetails));
        if (storedCompanyId) setCompanyId(parseInt(storedCompanyId, 10));
      } catch (e) {
        setUser(null);
        setUserDetails(null);
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
      const { accessToken, refreshToken, user: userData, companyId: userCompanyId } = response;

      const userInfo = jwtDecode<UserJwt>(accessToken);

      await AsyncStorage.setItem('accessToken', accessToken);
      await AsyncStorage.setItem('refreshToken', refreshToken);
      await AsyncStorage.setItem('userInfo', JSON.stringify(userInfo));
      await AsyncStorage.setItem('userDetails', JSON.stringify(userData));
      await AsyncStorage.setItem('companyId', userCompanyId.toString());

      setAccessToken(accessToken);
      setRefreshToken(refreshToken);
      setUser(userInfo);
      setUserDetails(userData);
      setCompanyId(userCompanyId);

      return true;
    } catch (e) {
      console.error('Login error:', e);
      setUser(null);
      setUserDetails(null);
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
    await AsyncStorage.removeItem('userInfo');
    await AsyncStorage.removeItem('userDetails');
    await AsyncStorage.removeItem('companyId');
    setUser(null);
    setUserDetails(null);
    setCompanyId(null);
    setAccessToken(null);
    setRefreshToken(null);
    setLoading(false);
  };

  return (
    <AuthContext.Provider value={{ user, userDetails, companyId, accessToken, refreshToken, loading, login, logout }}>
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