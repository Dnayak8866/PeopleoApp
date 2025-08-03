import { login as loginApi } from '@/api/auth';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { jwtDecode } from 'jwt-decode';
import React, { createContext, ReactNode, useContext, useEffect, useState } from 'react';

interface UserJwt {
  role: string;
  [key: string]: any;
}

interface AuthContextType {
  user: UserJwt | null;
  accessToken: string | null;
  refreshToken: string | null;
  loading: boolean;
  login: (phone: string, pin: string) => Promise<boolean>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<UserJwt | null>(null);
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
        if (storedAccessToken) {
          setAccessToken(storedAccessToken);
          setUser(jwtDecode<UserJwt>(storedAccessToken));
        }
        if (storedRefreshToken) setRefreshToken(storedRefreshToken);
      } catch (e) {
        setUser(null);
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
      const { accessToken, refreshToken } = response.data;
      const userInfo = jwtDecode<UserJwt>(accessToken);
      await AsyncStorage.setItem('accessToken', accessToken);
      await AsyncStorage.setItem('refreshToken', refreshToken);
      await AsyncStorage.setItem('userInfo', JSON.stringify(userInfo));
      setAccessToken(accessToken);
      setRefreshToken(refreshToken);
      setUser(userInfo);
      return true;
    } catch (e) {
      setUser(null);
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
    setUser(null);
    setAccessToken(null);
    setRefreshToken(null);
    setLoading(false);
  };

  return (
    <AuthContext.Provider value={{ user, accessToken, refreshToken, loading, login, logout }}>
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