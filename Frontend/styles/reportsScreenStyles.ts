import { Colors } from "@/constants/Colors";
import { StyleSheet } from "react-native";

export const reportsScreenStyles = () => {
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
            paddingVertical: 15,
            backgroundColor: '#FFFFFF',
            borderBottomWidth: 1,
            borderBottomColor: '#E5E5E7',
        },
        headerTitle: {
            flex: 1,
            fontSize: 22,
            fontWeight: 'bold',
            color: Colors.primaryText,
            textAlign: 'center'
        },
        headerIcons: {
            flexDirection: 'row',
            alignItems: 'center',
        },
        iconButton: {
            marginRight: 15,
        },
        profileIcon: {
            width: 32,
            height: 32,
            borderRadius: 16,
            backgroundColor: '#FF3B30',
            justifyContent: 'center',
            alignItems: 'center',
        },
        profileText: {
            color: '#FFFFFF',
            fontSize: 12,
            fontWeight: 'bold',
        },
        scrollView: {
            flex: 1,
        },
        dateSelector: {
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            backgroundColor: '#F7F7F7FF',
            marginHorizontal: 20,
            marginTop: 20,
            paddingHorizontal: 15,
            paddingVertical: 20,
            borderRadius: 8,
            borderWidth: 1,
            borderColor: '#EBEBEAFF',
        },
        dateText: {
            fontSize: 16,
            color: '#636AE8FF',
            fontWeight: '500',
        },
        section: {
            marginTop: 20,
            paddingHorizontal: 20,
        },
        sectionHeader: {
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: 14,
        },
        sectionTitle: {
            fontSize: 18,
            fontWeight: 'bold',
            color: Colors.primaryText,
            marginBottom: 15,
        },
        sectionAction: {
            padding: 5,
        },
        divider: {
            height: 4,
            backgroundColor: '#EBEBEAFF',
            marginHorizontal: 20,
            marginTop: 20,
        },
        metricsGrid: {
            flexDirection: 'row',
            flexWrap: 'wrap',
            justifyContent: 'space-between',
        },
        metricCard: {
            width: '48%',
            backgroundColor: '#FFFFFF',
            borderRadius: 12,
            padding: 16,
            marginBottom: 15,
            borderWidth: 1,
            borderColor: '#E5E5E7',
        },
        metricIcon: {
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: 12,
        },
        metricLabel: {
            fontSize: 14,
            color: '#8C8D8BFF',
            marginBottom: 4,
        },
        metricValue: {
            fontSize: 24,
            fontWeight: 'bold',
            color: Colors.primaryText,
            marginBottom: 8,
        },
        metricChange: {
            fontSize: 13,
            fontWeight: '500',
            textAlign: 'center'
        },
        chartCard: {
            backgroundColor: '#FFFFFF',
            borderRadius: 12,
            padding: 16,
            marginBottom: 15,
            borderWidth: 1,
            borderColor: '#E5E5E7',
        },
        chartHeader: {
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: 16,
        },
        chartTitle: {
            fontSize: 16,
            fontWeight: '600',
            color: Colors.primaryText,
        },
        chartActions: {
            flexDirection: 'row',
        },
        chartAction: {
            marginLeft: 12,
            padding: 4,
        },
        chart: {
            borderRadius: 8,
        },
        employeeList: {
            backgroundColor: '#FFFFFF',
            borderRadius: 12,
            borderWidth: 1,
            borderColor: '#E5E5E7',
        },
        employeeItem: {
            flexDirection: 'row',
            alignItems: 'center',
            paddingHorizontal: 16,
            paddingVertical: 12,
            borderBottomWidth: 1,
            borderBottomColor: '#E5E5E7',
        },
        avatar: {
            width: 40,
            height: 40,
            borderRadius: 20,
            justifyContent: 'center',
            alignItems: 'center',
            marginRight: 12,
        },
        avatarText: {
            color: '#FFFFFF',
            fontSize: 14,
            fontWeight: 'bold',
        },
        employeeInfo: {
            flex: 1,
        },
        employeeName: {
            fontSize: 16,
            fontWeight: '500',
            color: Colors.primaryText,
            marginBottom: 2,
        },
        employeeDepartment: {
            fontSize: 13,
            color: '#8E8E93',
        },
        employeeHours: {
            fontSize: 16,
            fontWeight: '600',
            color: Colors.primaryText,
        },
    });
};