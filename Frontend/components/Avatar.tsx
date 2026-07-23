import { View, Text, StyleSheet, ViewStyle, TextStyle, Image } from 'react-native';
import { Colors } from '@/constants/Colors';

interface AvatarProps {
    fullName: string;
    size?: number;
    backgroundColor?: string;
    textColor?: string;
    style?: ViewStyle;
    textStyle?: TextStyle;
    uri?: string;
}

/**
 * Avatar component that displays user initials or an image
 */
export const Avatar: React.FC<AvatarProps> = ({
    fullName,
    size = 40,
    backgroundColor = Colors.primary,
    textColor = '#FFFFFF',
    style,
    textStyle,
    uri,
}) => {
    const getInitials = (name: string): string => {
        if (!name || name.trim() === '') {
            return '?';
        }

        const nameParts = name.trim().split(/\s+/); // Split by whitespace

        if (nameParts.length === 0) {
            return '?';
        }

        if (nameParts.length === 1) {
            // Only first name exists
            return nameParts[0].charAt(0).toUpperCase();
        }

        // First and last name (skip middle names if any)
        const firstName = nameParts[0];
        const lastName = nameParts[nameParts.length - 1];

        return (firstName.charAt(0) + lastName.charAt(0)).toUpperCase();
    };

    const initials = getInitials(fullName);
    const borderRadius = size / 2;

    return (
        <View
            style={[
                styles.avatar,
                {
                    width: size,
                    height: size,
                    borderRadius,
                    backgroundColor,
                },
                style,
            ]}
        >
            {uri ? (
                <Image
                    source={{ uri }}
                    style={{
                        width: size,
                        height: size,
                        borderRadius,
                    }}
                />
            ) : (
                <Text
                    style={[
                        styles.avatarText,
                        {
                            color: textColor,
                            fontSize: size * 0.4, // Scale font size based on avatar size
                        },
                        textStyle,
                    ]}
                >
                    {initials}
                </Text>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    avatar: {
        justifyContent: 'center',
        alignItems: 'center',
    },
    avatarText: {
        fontWeight: '600',
    },
});
