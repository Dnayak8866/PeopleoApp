import { Colors } from '@/constants/Colors';
import { useResponsive } from '@/utils/responsive';
import { StyleSheet } from 'react-native';
export const homeScreenStyles = () => {
    const { screenWidth, deviceType } = useResponsive();

    return StyleSheet.create({
        container: {
            flex: 1,
            backgroundColor: Colors.background,
        },
        header: {
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            paddingHorizontal: 20,
            paddingTop: 44,
            paddingBottom: 10,
            backgroundColor: '#fff',
            borderBottomWidth: 1,
            borderBottomColor: '#E5E7EB',
        },
        greeting: {
            flex: 1,
            fontSize: 18,
            fontWeight: '600',
            color: '#111827',
            textAlign: 'center',
        },
        headerIcons: {
            flexDirection: 'row',
            alignItems: 'center',
            gap: 12,
        },
        iconButton: {
            padding: 8,
        },
        avatar: {
            width: 40,
            height: 40,
            borderRadius: 20,
            backgroundColor: Colors.primary,
            justifyContent: 'center',
            alignItems: 'center',
        },
        avatarText: {
            color: '#fff',
            fontSize: 16,
            fontWeight: '600',
        },
        timeSection: {
            alignItems: 'center',
            paddingVertical: 30,
        },
        timeText: {
            fontSize: 48,
            fontWeight: '700',
            color: '#111827',
        },
        dateText: {
            fontSize: 18,
            color: '#9CA3AF',
            fontWeight: '500',
        },
        punchSection: {
            alignItems: 'center',
            paddingVertical: 20,
        },
        punchButton: {
            width: 200,
            height: 200,
            borderRadius: 100,
            marginBottom: 16,
            boxShadow: '0px 17px 35px #636AE87D, 0px 0px 2px #636AE81F'
        },
        pulseWrapper: {
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
            position: 'relative',
        },
        pulseCircle: {
            position: 'absolute',
            width: 200,
            height: 200,
            borderRadius: 100,
            backgroundColor: '#1CC8A5',
        },
        gradientButton: {
            width: '100%',
            height: '100%',
            borderRadius: 100,
            justifyContent: 'center',
            alignItems: 'center',
        },
        punchText: {
            fontSize: 18,
            fontWeight: '600',
            color: '#111827',
        },
        locationSection: {
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 8,
            paddingHorizontal: 20,
            paddingVertical: 14,
        },
        locationText: {
            fontSize: 16,
            color: '#9CA3AF',
        },
        statsSection: {
            flexDirection: 'row',
            justifyContent: 'space-between',
            paddingHorizontal: 10,
            paddingVertical: 18,
            backgroundColor: '#fff',
            marginHorizontal: 15,
            borderRadius: 16,
            marginTop: 6,
            marginBottom: 10,
            boxShadow: '0px 4px 9px #171a1f1C, 0px 0px 2px #171a1f1F',
            borderColor: '#F3F4F6FF',
            borderWidth: 1,
        },
        statCard: {
            alignItems: 'center',
            flex: 1,
            minWidth: 0,
        },
        divider: {
            width: 1,
            height: 110,
            backgroundColor: '#E5E7EB',
            alignSelf: 'center',
            marginHorizontal: 5,
        },
        progressRing: {
            marginBottom: 12,
        },
        progressCircle: {
            width: 80,
            height: 80,
            borderRadius: 40,
            borderWidth: 6,
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: '#fff',
        },
        statNumber: {
            fontSize: 16,
            fontWeight: '700',
            color: '#111827',
        },
        statLabel: {
            fontSize: 14,
            color: '#9CA3AF',
            textAlign: 'center',
        },
    });
}