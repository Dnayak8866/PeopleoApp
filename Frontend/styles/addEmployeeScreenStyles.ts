import { Colors } from "@/constants/Colors"
import { StyleSheet } from "react-native"

export const addEmployeeScreenStyles = () => {
    return StyleSheet.create({
        container: {
            flex: 1,
            backgroundColor: '#FFFFFF',
            paddingTop: 20,
        },
        header: {
            flexDirection: 'row',
            alignItems: 'center',
            paddingHorizontal: 20,
            backgroundColor: '#FFFFFF',
            borderBottomWidth: 1,
            borderBottomColor: '#E5E7EB',
            paddingTop: 12,
            paddingBottom: 8,
            marginBottom: 18,
        },
        backButton: {
            padding: 6,
            marginRight: 4,
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: '#F3F4F6',
            borderRadius: 50,
        },
        headerTitle: {
            fontSize: 16,
            fontWeight: '600',
            color: '#1F2937',
            flex: 1,
            textAlign: 'center',
        },
        scrollView: {
            flex: 1,
            backgroundColor: '#FFFFFF',
        },
        contentSpacing: {
            marginTop: 18,
        },
        section: {
            backgroundColor: '#FFFFFF',
            marginBottom: 2,
            paddingVertical: 4,
        },
        sectionTitle: {
            fontSize: 16,
            fontWeight: '600',
            color: Colors.primary,
        },
        inputContainer: {
            paddingHorizontal: 20,
            marginBottom: 20,
        },
        inputWrapper: {
            flexDirection: 'row',
            alignItems: 'center',
            backgroundColor: '#FFFFFF',
            borderWidth: 1,
            borderColor: '#BCC1CAFF',
            borderRadius: 8,
            paddingHorizontal: 16,
        },
        inputError: {
            borderColor: '#EF4444',
        },
        inputIcon: {
            marginRight: 8,
        },
        input: {
            flex: 1,
            fontSize: 16,
            color: '#000000',
        },
        dropdownWrapper: {
            flexDirection: 'row',
            alignItems: 'center',
            backgroundColor: '#FFFFFF',
            borderWidth: 1,
            borderColor: '#BCC1CAFF',
            borderRadius: 8,
            paddingHorizontal: 16,
            paddingVertical: 12,
        },
        dropdownPlaceholder: {
            flex: 1,
            fontSize: 16,
            color: '#9CA3AF',
        },
        dropdownSelected: {
            color: '#171A1FFF',
        },
        errorText: {
            fontSize: 12,
            color: '#EF4444',
            marginTop: 4,
            marginLeft: 4,
        },
        saveButton: {
            backgroundColor: Colors.primary,
            marginHorizontal: 20,
            marginTop: 0,
            paddingVertical: 16,
            borderRadius: 12,
            alignItems: 'center',
            shadowColor: Colors.primary,
            shadowOffset: {
                width: 0,
                height: 4,
            },
            shadowOpacity: 0.3,
            shadowRadius: 8,
            elevation: 8,
        },
        saveButtonText: {
            color: '#FFFFFF',
            fontSize: 16,
            fontWeight: '600',
        },
        bottomSpacer: {
            height: 40,
        },
        shiftButton: {
            paddingVertical: 8,
            paddingHorizontal: 14,
            borderRadius: 18,
            backgroundColor: '#EBEBEAFF',
            height: 38,
        },
        shiftButtonSelected: {
            backgroundColor: '#ede9fe',
        },
        shiftButtonText: {
            color: '#6B7280',
            fontSize: 14,
            fontWeight: '500',
        },
        shiftButtonTextSelected: {
            color: Colors.primary,
            fontWeight: '600',
        },
        shiftRow: {
            flexDirection: 'row',
            justifyContent: 'flex-start',
            marginTop: 8,
            gap: 10,
        },
        dropdownList: {
            backgroundColor: '#fff',
            borderWidth: 1,
            borderColor: '#BCC1CAFF',
            borderRadius: 8,
            marginTop: 2,
            zIndex: 100,
            position: 'absolute',
            left: 20,
            right: 20,
            top: 45,
        },
        dropdownListItem: {
            padding: 14,
            borderBottomWidth: 1,
            borderBottomColor: '#F3F4F6',
        },
        dropdownListItemSelected: {
            backgroundColor: '#F0F9FF',
        },
        dropdownListItemText: {
            fontSize: 16,
            color: '#1F2937',
        },
        dropdownListItemTextSelected: {
            color: Colors.primary,
            fontWeight: '600',
        },
        overlay: {
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            zIndex: 99,
        },
        fixedButtonContainer: {
            position: 'absolute',
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: '#fff',
            paddingBottom: 20,
            paddingTop: 12,
            shadowColor: '#000',
            shadowOffset: { width: 0, height: -4 },
            shadowOpacity: 0.12,
            shadowRadius: 12,
            elevation: 16,
            zIndex: 200,
        },
    })
}