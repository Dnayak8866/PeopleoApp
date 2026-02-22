import React, { useState } from 'react';
import { TouchableOpacity } from 'react-native';
import { Avatar } from './Avatar';
import { ProfileSidebar } from './ProfileSidebar';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'expo-router';

interface HeaderAvatarProps {
    size?: number;
}

export const HeaderAvatar: React.FC<HeaderAvatarProps> = ({ size = 40 }) => {
    const { userDetails, logout } = useAuth();
    const [isSidebarVisible, setIsSidebarVisible] = useState(false);
    const router = useRouter();

    const handleLogout = async () => {
        await logout();
        router.replace('/(auth)/login');
    };

    return (
        <>
            <TouchableOpacity onPress={() => setIsSidebarVisible(true)}>
                <Avatar
                    fullName={userDetails?.fullName || 'User'}
                    size={size}
                />
            </TouchableOpacity>
            <ProfileSidebar
                isVisible={isSidebarVisible}
                onClose={() => setIsSidebarVisible(false)}
                userDetails={userDetails}
                onLogout={handleLogout}
            />
        </>
    );
};
