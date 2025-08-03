import { Dimensions, StyleSheet } from "react-native";

export const splashScreenStyles = () => {
    const { width, height } = Dimensions.get('window');
    return StyleSheet.create({
        container: {
            flex: 1,
        },
        gradient: {
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
            position: 'relative',
        },
        bgElement: {
            position: 'absolute',
            borderRadius: 1000,
            backgroundColor: 'rgba(255, 255, 255, 0.05)',
        },
        bgElement1: {
            width: 200,
            height: 200,
            top: height * 0.1,
            left: width * 0.1,
        },
        bgElement2: {
            width: 150,
            height: 150,
            bottom: height * 0.2,
            right: width * 0.1,
        },
        bgElement3: {
            width: 100,
            height: 100,
            top: height * 0.3,
            right: width * 0.2,
        },
        logoContainer: {
            alignItems: 'center',
            justifyContent: 'center',
            paddingHorizontal: 40,
        },
        logoText: {
            fontSize: Math.min(width * 0.15, 80),
            fontWeight: '700',
            color: '#ffffff',
            letterSpacing: -1,
            textAlign: 'center',
            textShadowColor: 'rgba(0, 0, 0, 0.3)',
            textShadowOffset: { width: 0, height: 4 },
            textShadowRadius: 8,
        },
        underline: {
            width: 60,
            height: 3,
            backgroundColor: '#ffffff',
            borderRadius: 2,
            marginTop: 10,
            opacity: 0.8,
        },
        subtitle: {
            fontSize: 16,
            fontWeight: '300',
            color: 'rgba(255, 255, 255, 0.85)',
            textAlign: 'center',
            marginTop: 20,
            letterSpacing: 0.5,
            lineHeight: 22,
        },
        loadingContainer: {
            flexDirection: 'row',
            justifyContent: 'center',
            alignItems: 'center',
            marginTop: 40,
            gap: 10,
        },
        dot: {
            width: 10,
            height: 10,
            borderRadius: 5,
            backgroundColor: 'rgba(255, 255, 255, 0.7)',
            marginHorizontal: 2,
        },
    });
}