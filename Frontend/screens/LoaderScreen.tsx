import { Colors } from '@/constants/Colors';
import { useAuth } from '@/context/AuthContext';
import { useMasterDataContext } from '@/context/MasterDataContext';
import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Animated, StyleSheet, Text, View } from 'react-native';

export default function LoaderScreen() {
    const router = useRouter();
    const { userId, companyId, logout, setUserDetails } = useAuth();
    const { fetchHomePageDetails } = useMasterDataContext();
    const [progress] = useState(new Animated.Value(0));
    const [loadingText, setLoadingText] = useState('Initializing...');
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        Animated.timing(progress, {
            toValue: 1,
            duration: 3000,
            useNativeDriver: false,
        }).start();

        loadDataAndNavigate();
    }, []);

    const loadDataAndNavigate = async () => {
        try {
            if (!userId || !companyId) {
                setError('Authentication error. Please login again.');
                setTimeout(() => {
                    logout();
                    router.replace('/(auth)/login');
                }, 2000);
                return;
            }
            setLoadingText('Loading your data...');
            const homePageData = await fetchHomePageDetails(userId, companyId);

            if (!homePageData) {
                throw new Error('Failed to load data');
            }

            setUserDetails(homePageData.user);

            setLoadingText('Determining access level...');
            await new Promise(resolve => setTimeout(resolve, 500));

            const userRole = homePageData.masterData.roles.find(
                (role: any) => role.id === homePageData.user.roleId
            );

            if (!userRole) {
                throw new Error('User role not found');
            }

            setLoadingText('Redirecting...');
            await new Promise(resolve => setTimeout(resolve, 500));
            const isAdmin = userRole?.roleName?.toLowerCase() === 'admin';
            if (isAdmin) {
                router.replace('/(owner)/home');
            } else {
                router.replace('/(employee)/home');
            }

        } catch (err: any) {
            console.error('Loader error:', err);
            setError(err.message || 'Failed to load data. Please try again.');
            setTimeout(() => {
                logout();
                router.replace('/(auth)/login');
            }, 3000);
        }
    };

    const progressWidth = progress.interpolate({
        inputRange: [0, 1],
        outputRange: ['0%', '100%'],
    });

    return (
        <View style={styles.container}>
            <View style={styles.content}>

                {/* Loading Indicator */}
                <View style={styles.loaderContainer}>
                    {error ? (
                        <>
                            <Text style={styles.errorText}>{error}</Text>
                            <Text style={styles.errorSubText}>Redirecting to login...</Text>
                        </>
                    ) : (
                        <>
                            <ActivityIndicator size="large" color={Colors.primary} />
                            <Text style={styles.loadingText}>{loadingText}</Text>

                            {/* Progress Bar */}
                            <View style={styles.progressBarContainer}>
                                <Animated.View
                                    style={[
                                        styles.progressBar,
                                        { width: progressWidth }
                                    ]}
                                />
                            </View>
                        </>
                    )}
                </View>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.background,
        justifyContent: 'center',
        alignItems: 'center',
    },
    content: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        width: '100%',
        paddingHorizontal: 24,
    },
    logoContainer: {
        marginBottom: 24,
    },
    logoCircle: {
        width: 100,
        height: 100,
        borderRadius: 50,
        backgroundColor: Colors.primary,
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: Colors.primary,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 8,
    },
    logoText: {
        fontSize: 48,
        fontWeight: '700',
        color: '#fff',
    },
    appName: {
        fontSize: 32,
        fontWeight: '700',
        color: Colors.primary,
        marginBottom: 48,
        letterSpacing: 1,
    },
    loaderContainer: {
        alignItems: 'center',
        width: '100%',
    },
    loadingText: {
        marginTop: 16,
        fontSize: 16,
        color: Colors.primaryText,
        fontWeight: '500',
    },
    progressBarContainer: {
        width: '80%',
        height: 4,
        backgroundColor: '#E0E0E0',
        borderRadius: 2,
        marginTop: 24,
        overflow: 'hidden',
    },
    progressBar: {
        height: '100%',
        backgroundColor: Colors.primary,
        borderRadius: 2,
    },
    errorText: {
        fontSize: 16,
        color: '#EB5757',
        fontWeight: '600',
        textAlign: 'center',
        marginBottom: 8,
    },
    errorSubText: {
        fontSize: 14,
        color: '#666',
        textAlign: 'center',
    },
    footer: {
        position: 'absolute',
        bottom: 32,
        fontSize: 14,
        color: '#999',
        fontWeight: '500',
    },
});
