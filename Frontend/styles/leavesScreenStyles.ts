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
        filterSection: {
            marginHorizontal: 20,
            zIndex: 100,
        },
        filterTrigger: {
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            backgroundColor: '#f3f4f6',
            borderRadius: 12,
            paddingHorizontal: 16,
            paddingVertical: 12,
            borderWidth: 1,
            borderColor: '#e5e7eb',
        },
        filterTriggerLeft: {
            flexDirection: 'row',
            alignItems: 'center',
        },
        filterTriggerText: {
            fontSize: 15,
            color: '#374151',
        },
        dropdownMenu: {
            position: 'absolute',
            top: '105%',
            left: 0,
            right: 0,
            backgroundColor: '#ffffff',
            borderRadius: 12,
            paddingVertical: 8,
            shadowColor: '#000',
            shadowOffset: {
                width: 0,
                height: 4,
            },
            shadowOpacity: 0.1,
            shadowRadius: 8,
            elevation: 5,
            borderWidth: 1,
            borderColor: '#f3f4f6',
            zIndex: 1000,
        },
        dropdownItem: {
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            paddingHorizontal: 16,
            paddingVertical: 12,
        },
        dropdownItemText: {
            fontSize: 15,
            color: '#4b5563',
        },
        dropdownItemTextActive: {
            color: Colors.primary,
            fontWeight: '600',
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