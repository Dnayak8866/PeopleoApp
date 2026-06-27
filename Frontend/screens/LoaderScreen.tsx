import { Colors } from '@/constants/Colors';
import { useAuth } from '@/context/AuthContext';
import { useMasterDataContext } from '@/context/MasterDataContext';
import { useRouter } from 'expo-router';
import React, { useEffect, useState, useRef } from 'react';
import {
    Animated,
    StyleSheet,
    Text,
    View,
    StatusBar
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function LoaderScreen() {
    const router = useRouter();
    const { userId, companyId, logout, setUserDetails } = useAuth();
    const { fetchHomePageDetails } = useMasterDataContext();

    const progress = useRef(new Animated.Value(0)).current;
    const spinValue = useRef(new Animated.Value(0)).current;
    const [loadingText, setLoadingText] = useState('Syncing attendance records...');
    const [percentage, setPercentage] = useState(0);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        // Simple listener to update percentage text
        const id = progress.addListener(({ value }) => {
            setPercentage(Math.floor(value * 100));
        });

        // Continuous spin animation (ActivityIndicator speed)
        Animated.loop(
            Animated.timing(spinValue, {
                toValue: 1,
                duration: 1200,
                useNativeDriver: true,
            })
        ).start();

        loadDataAndNavigate();

        return () => {
            progress.removeListener(id);
        };
    }, []);

    const spin = spinValue.interpolate({
        inputRange: [0, 1],
        outputRange: ['0deg', '360deg'],
    });

    const loadDataAndNavigate = async () => {
        try {
            // Step 1: Start (0% -> 20%)
            Animated.timing(progress, {
                toValue: 0.2,
                duration: 500,
                useNativeDriver: false,
            }).start();

            if (!userId || !companyId) {
                setError('Authentication error. Please login again.');
                setTimeout(() => {
                    logout();
                    router.replace('/(auth)/login');
                }, 2000);
                return;
            }

            setLoadingText('Authenticating your profile...');
            const homePageData = await fetchHomePageDetails(userId, companyId);

            // Step 2: Data Fetched (20% -> 40%)
            Animated.timing(progress, {
                toValue: 0.4,
                duration: 500,
                useNativeDriver: false,
            }).start();

            if (!homePageData) {
                throw new Error('Failed to load data');
            }

            setUserDetails(homePageData.user);

            setLoadingText('Setting up your workspace...');
            await new Promise(resolve => setTimeout(resolve, 800));

            const userRole = homePageData.masterData.roles.find(
                (role: any) => role.id === homePageData.user.roleId
            );

            if (!userRole) {
                throw new Error('User role not found');
            }

            // Step 3: Workspace Setup (40% -> 80%)
            Animated.timing(progress, {
                toValue: 0.8,
                duration: 800,
                useNativeDriver: false,
            }).start();

            setLoadingText('Finalizing secure connections...');
            await new Promise(resolve => setTimeout(resolve, 800));

            // Step 4: Finalize (80% -> 100%)
            Animated.timing(progress, {
                toValue: 1,
                duration: 500,
                useNativeDriver: false,
            }).start();

            await new Promise(resolve => setTimeout(resolve, 600));

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
        <SafeAreaView style={styles.container}>
            <StatusBar barStyle="dark-content" />

            {/* Header section */}
            <View style={styles.header}>
                <View style={styles.iconBox}>
                    <Ionicons name="business" size={20} color="#3b82f6" />
                </View>
                <Text style={styles.versionText}>V1.0.0</Text>
            </View>

            {/* Center Content */}
            <View style={styles.centerContent}>
                {error ? (
                    <View style={styles.errorContainer}>
                        <Ionicons name="alert-circle" size={64} color="#ef4444" />
                        <Text style={styles.errorText}>{error}</Text>
                        <Text style={styles.errorSubText}>Redirecting to login...</Text>
                    </View>
                ) : (
                    <>
                        {/* Circular Progress and Fingerprint Area */}
                        <View style={styles.loaderWrapper}>
                            {/* Base Faint Ring */}
                            <View style={styles.baseRing} />

                            {/* Spinning Arc (ActivityIndicator style) */}
                            <Animated.View
                                style={[
                                    styles.rotatingArc,
                                    { transform: [{ rotate: spin }] }
                                ]}
                            />

                            {/* Static Core with Fingerprint */}
                            <View style={styles.innerCircle}>
                                <Ionicons name="finger-print-outline" size={36} color="#3b82f6" />
                            </View>
                        </View>

                        <Text style={styles.mainTitle}>Authenticating your profile...</Text>
                        <Text style={styles.subTitle}>
                            Setting up your workspace and{"\n"}secure connections
                        </Text>

                        {/* Establishing Link Badge */}
                        <View style={styles.badge}>
                            <View style={styles.dot} />
                            <Text style={styles.badgeText}>ESTABLISHING LINK</Text>
                        </View>
                    </>
                )}
            </View>

            {/* Bottom Section */}
            {!error && (
                <View style={styles.bottomSection}>
                    <View style={styles.progressCard}>
                        <View style={styles.progressHeader}>
                            <Text style={styles.progressTitle}>Syncing attendance records...</Text>
                            <Text style={styles.progressPercent}>{percentage}%</Text>
                        </View>
                        <View style={styles.progressBarBg}>
                            <Animated.View style={[styles.progressBarFill, { width: progressWidth }]} />
                        </View>
                    </View>
                    <Text style={styles.footerNote}>
                        Please wait a moment. Do not close the app.
                    </Text>
                </View>
            )}
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F8FAFC',
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 24,
        paddingTop: 10,
    },
    iconBox: {
        width: 40,
        height: 40,
        backgroundColor: '#EBF2FF',
        borderRadius: 10,
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#D0E1FF',
    },
    versionText: {
        fontSize: 14,
        color: '#94A3B8',
        fontWeight: '500',
    },
    centerContent: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 40,
    },
    loaderWrapper: {
        width: 160,
        height: 160,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 40,
    },
    baseRing: {
        position: 'absolute',
        width: 140,
        height: 140,
        borderRadius: 70,
        borderWidth: 6,
        borderColor: '#F1F5F9', // Very soft gray ring
    },
    rotatingArc: {
        position: 'absolute',
        width: 140,
        height: 140,
        borderRadius: 70,
        borderWidth: 6,
        borderColor: 'transparent',
        borderTopColor: '#3b82f6', // Bright Blue
        borderRightColor: '#8b5cf6', // Violet/Indigo transition
    },
    innerCircle: {
        width: 90,
        height: 90,
        borderRadius: 45,
        backgroundColor: '#FFFFFF',
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.08,
        shadowRadius: 15,
        elevation: 5,
        zIndex: 10,
    },
    mainTitle: {
        fontSize: 22,
        fontWeight: '700',
        color: '#1E293B',
        textAlign: 'center',
        marginBottom: 12,
    },
    subTitle: {
        fontSize: 16,
        color: '#64748B',
        textAlign: 'center',
        lineHeight: 24,
        marginBottom: 32,
    },
    badge: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#E2EEFF',
        paddingHorizontal: 16,
        paddingVertical: 10,
        borderRadius: 20,
    },
    dot: {
        width: 8,
        height: 8,
        borderRadius: 4,
        backgroundColor: '#3b82f6',
        marginRight: 10,
    },
    badgeText: {
        fontSize: 12,
        color: '#3b82f6',
        fontWeight: '700',
        letterSpacing: 1,
    },
    bottomSection: {
        paddingHorizontal: 24,
        paddingBottom: 40,
        alignItems: 'center',
    },
    progressCard: {
        backgroundColor: '#FFFFFF',
        width: '100%',
        borderRadius: 20,
        padding: 20,
        marginBottom: 20,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.04,
        shadowRadius: 12,
        elevation: 4,
        borderWidth: 1,
        borderColor: '#F1F5F9',
    },
    progressHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 12,
    },
    progressTitle: {
        fontSize: 14,
        color: '#64748B',
        fontWeight: '500',
    },
    progressPercent: {
        fontSize: 12,
        color: '#64748B',
        fontWeight: '600',
    },
    progressBarBg: {
        width: '100%',
        height: 6,
        backgroundColor: '#F1F5F9',
        borderRadius: 3,
        overflow: 'hidden',
    },
    progressBarFill: {
        height: '100%',
        backgroundColor: '#6366f1',
        borderRadius: 3,
    },
    footerNote: {
        fontSize: 14,
        color: '#94A3B8',
        fontWeight: '500',
    },
    errorContainer: {
        alignItems: 'center',
    },
    errorText: {
        fontSize: 18,
        color: '#ef4444',
        fontWeight: '700',
        textAlign: 'center',
        marginTop: 20,
        marginBottom: 8,
    },
    errorSubText: {
        fontSize: 14,
        color: '#64748B',
        textAlign: 'center',
    },
});
