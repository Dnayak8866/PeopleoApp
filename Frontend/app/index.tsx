
import { useAuth } from '@/context/AuthContext';
import { Redirect } from 'expo-router';

export default function Index() {
  const { user, loading } = useAuth();

  if (loading) {
    return null;
  }

  if (!user) {
    return <Redirect href="/(auth)/login" />;
  }

  // Redirect based on user role
  if (user.role === 'admin') {
    return <Redirect href="/(owner)/home" />;
  } else {
    return <Redirect href="/(employee)/home" />;
  }
}
