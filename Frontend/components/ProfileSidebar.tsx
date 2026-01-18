import React, { useEffect, useRef } from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    Modal,
    Animated,
    Dimensions,
    TouchableWithoutFeedback,
} from 'react-native';
import { Settings, Lock, LogOut, ChevronRight } from 'lucide-react-native';
import { Avatar } from './Avatar';
import { sidebarStyles } from '@/styles/sidebarStyles';

const { width } = Dimensions.get('window');

interface ProfileSidebarProps {
    isVisible: boolean;
    onClose: () => void;
    userDetails: any;
    onLogout: () => void;
}

export const ProfileSidebar: React.FC<ProfileSidebarProps> = ({
    isVisible,
    onClose,
    userDetails,
    onLogout,
}) => {
    const styles = sidebarStyles();
    const slideAnim = useRef(new Animated.Value(width)).current;

    useEffect(() => {
        if (isVisible) {
            Animated.timing(slideAnim, {
                toValue: 0,
                duration: 300,
                useNativeDriver: true,
            }).start();
        } else {
            Animated.timing(slideAnim, {
                toValue: width,
                duration: 300,
                useNativeDriver: true,
            }).start();
        }
    }, [isVisible]);

    const handleLogout = () => {
        onClose();
        onLogout();
    };

    return (
        <Modal
            transparent
            visible={isVisible}
            animationType="none"
            onRequestClose={onClose}
            statusBarTranslucent={true}
        >
            <View style={styles.overlay}>
                <TouchableWithoutFeedback onPress={onClose}>
                    <View style={styles.backdrop} />
                </TouchableWithoutFeedback>

                <Animated.View
                    style={[
                        styles.sidebarContainer,
                        { transform: [{ translateX: slideAnim }] },
                    ]}>
                    <TouchableOpacity style={styles.closeButton} onPress={onClose}>
                        <View style={styles.closeIconWrapper}>
                            <ChevronRight size={20} color="#6B7280" />
                        </View>
                    </TouchableOpacity>

                    <View style={styles.content}>
                        <View style={styles.profileSection}>
                            <View style={styles.avatarContainer}>
                                <Avatar
                                    fullName={userDetails?.fullName || 'User'}
                                    size={100}
                                />
                            </View>
                            <Text style={styles.userName}>{userDetails?.fullName || 'John Doe'}</Text>
                            <Text style={styles.userRole}>{userDetails?.role || 'Product Designer'}</Text>
                        </View>

                        <View style={styles.divider} />

                        <View style={styles.menuItems}>
                            <TouchableOpacity style={styles.menuItem}>
                                <View style={styles.iconContainer}>
                                    <Settings size={22} color="#4B5563" />
                                </View>
                                <Text style={styles.menuItemText}>Settings</Text>
                            </TouchableOpacity>

                            <TouchableOpacity style={styles.menuItem}>
                                <View style={styles.iconContainer}>
                                    <Lock size={22} color="#4B5563" />
                                </View>
                                <Text style={styles.menuItemText}>Reset Password</Text>
                            </TouchableOpacity>

                            <TouchableOpacity style={[styles.menuItem, styles.logoutItem]} onPress={handleLogout}>
                                <View style={[styles.iconContainer, styles.logoutIconContainer]}>
                                    <LogOut size={22} color="#EF4444" />
                                </View>
                                <Text style={[styles.menuItemText, styles.logoutText]}>Logout</Text>
                            </TouchableOpacity>
                        </View>

                        <View style={styles.footer}>
                            <Text style={styles.versionText}>VERSION 1.0.0</Text>
                        </View>
                    </View>
                </Animated.View>
            </View>
        </Modal>
    );
};
