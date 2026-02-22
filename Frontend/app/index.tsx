import { useAuth } from '@/context/AuthContext';
import { Redirect } from 'expo-router';

export default function Index() {
  const { userId, userDetails, loading } = useAuth();

  if (loading) {
    return null;
  }

  if (!userId) {
    return <Redirect href="/(auth)/login" />;
  }

  // If we have userId but not userDetails yet, go to loader
  if (!userDetails) {
    return <Redirect href="/loader" />;
  }

  // Redirect based on user role
  // roleId 1 is typically Admin/Owner
  if (userDetails.roleId === 1) {
    return <Redirect href="/(owner)/home" />;
  } else {
    return <Redirect href="/(employee)/home" />;
  }
}
