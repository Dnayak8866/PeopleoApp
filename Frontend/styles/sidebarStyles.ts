import { StyleSheet, Dimensions } from 'react-native';
import { Colors } from '@/constants/Colors';

const { width } = Dimensions.get('window');
const { height } = Dimensions.get('screen');

export const sidebarStyles = () => {
    return StyleSheet.create({
        overlay: {
            flex: 1,
            flexDirection: 'row',
            height: height,
        },
        backdrop: {
            flex: 1,
            backgroundColor: 'rgba(0,0,0,0.4)',
        },
        sidebarContainer: {
            width: width * 0.8,
            backgroundColor: '#fff',
            height: height,
            shadowColor: '#000',
            shadowOffset: { width: -2, height: 0 },
            shadowOpacity: 0.1,
            shadowRadius: 10,
            elevation: 5,
        },
        content: {
            flex: 1,
            paddingTop: 60,
            paddingHorizontal: 25,
        },
        closeButton: {
            position: 'absolute',
            top: 50,
            left: 20,
            zIndex: 10,
        },
        closeIconWrapper: {
            width: 36,
            height: 36,
            borderRadius: 18,
            backgroundColor: '#F3F4F6FF',
            justifyContent: 'center',
            alignItems: 'center',
        },
        profileSection: {
            alignItems: 'center',
            marginTop: 20,
            marginBottom: 30,
        },
        avatarContainer: {
            marginBottom: 15,
            borderWidth: 4,
            borderColor: '#F3F4F6FF',
            borderRadius: 60,
            padding: 2,
        },
        userName: {
            fontSize: 22,
            fontWeight: '700',
            color: '#1F2937',
            marginBottom: 4,
        },
        userRole: {
            fontSize: 16,
            color: '#6B7280',
            fontWeight: '500',
        },
        divider: {
            height: 1,
            backgroundColor: '#F3F4F6FF',
            width: '100%',
            marginBottom: 25,
        },
        menuItems: {
            flex: 1,
        },
        menuItem: {
            flexDirection: 'row',
            alignItems: 'center',
            paddingVertical: 10,
            marginBottom: 8,
        },
        iconContainer: {
            width: 48,
            height: 48,
            borderRadius: 12,
            backgroundColor: '#F8F9FBFF',
            justifyContent: 'center',
            alignItems: 'center',
            marginRight: 18,
        },
        menuItemText: {
            fontSize: 18,
            fontWeight: '600',
            color: '#374151',
        },
        logoutIconContainer: {
            backgroundColor: '#FEF2F2FF',
        },
        logoutText: {
            color: '#EF4444',
        },
        footer: {
            paddingBottom: 40,
            alignItems: 'center',
        },
        versionText: {
            fontSize: 12,
            color: '#9CA3AF',
            fontWeight: '700',
            letterSpacing: 1.2,
            textTransform: 'uppercase',
        },
    });
};
