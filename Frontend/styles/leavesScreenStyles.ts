import { Colors } from "@/constants/Colors";
import { StyleSheet } from "react-native";

export const leavesScreenStyles = () => {
    return StyleSheet.create({
        container: {
            flex: 1,
            backgroundColor: '#ffffff',
            paddingTop: 16,
        },
        header: {
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            paddingHorizontal: 20,
            paddingVertical: 16,
            backgroundColor: '#ffffff',
        },
        headerTitle: {
            fontSize: 24,
            fontWeight: '700',
            color: '#111827',
        },
        headerRight: {
            flexDirection: 'row',
            alignItems: 'center',
            gap: 12,
        },
        notificationButton: {
            width: 40,
            height: 40,
            alignItems: 'center',
            justifyContent: 'center',
        },
        addButton: {
            width: 40,
            height: 40,
            backgroundColor: Colors.primary,
            borderRadius: 20,
            alignItems: 'center',
            justifyContent: 'center',
        },
        filterContainer: {
            flexDirection: 'row',
            justifyContent: 'space-between',
            backgroundColor: '#E8E9EAFF',
            alignItems: 'center',
            marginHorizontal: 20,
            borderRadius: 10,
            paddingVertical: 4,
            paddingHorizontal: 4,
        },
        filterButton: {
            flex: 1,
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'center',
            borderRadius: 10,
            borderWidth: 1,
            borderColor: '#e5e7eb',
            gap: 6,
            paddingVertical: 12,
        },
        filterButtonActive: {
            backgroundColor: '#FFFFFF',
        },
        filterDot: {
            width: 8,
            height: 8,
            borderRadius: 4,
        },
        filterText: {
            fontSize: 14,
            fontWeight: '500',
            color: '#6b7280',
        },
        filterTextActive: {
            color: '#374151',
        },
        scrollView: {
            flex: 1,
            paddingHorizontal: 20,
        },
        monthHeader: {
            fontSize: 16,
            fontWeight: '600',
            color: '#9ca3af',
            marginTop: 24,
            marginBottom: 16,
        },
        leaveCard: {
            flexDirection: 'row',
            alignItems: 'center',
            backgroundColor: '#ffffff',
            borderRadius: 12,
            padding: 16,
            marginBottom: 12,
            shadowColor: '#000',
            shadowOffset: {
                width: 0,
                height: 1,
            },
            shadowOpacity: 0.05,
            shadowRadius: 2,
            elevation: 1,
        },
        leaveCardContent: {
            flex: 1,
        },
        applicationType: {
            fontSize: 16,
            fontWeight: '500',
            color: '#969BA6FF',
            marginBottom: 4,
        },
        applicationDate: {
            fontSize: 18,
            fontWeight: '700',
            color: '#111827',
            marginBottom: 4,
        },
        leaveTypeText: {
            fontSize: 14,
            fontWeight: '600',
        },
        leaveCardRight: {
            flexDirection: 'row',
            alignItems: 'center',
            gap: 12,
        },
        statusBadge: {
            paddingHorizontal: 12,
            paddingVertical: 6,
            borderRadius: 8,
        },
        statusText: {
            fontSize: 12,
            fontWeight: '600',
        },
    });
}