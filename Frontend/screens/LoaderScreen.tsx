import { Colors } from '@/constants/Colors';
import LoaderIllustration from '@/components/illustrations/LoaderIllustration';
import { useAuth } from '@/context/AuthContext';
import { useMasterDataContext } from '@/context/MasterDataContext';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import React, { useEffect, useState, useRef } from 'react';
import {
    Animated,
    Dimensions,
    Platform,
    StyleSheet,
    Text,
    View,
    StatusBar,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const { width } = Dimensions.get('window');

// Loading step definitions
const LOADING_STEPS = [
    { label: 'Authenticating profile', icon: 'finger-print-outline' as const },
    { label: 'Fetching your data', icon: 'cloud-download-outline' as const },
    { label: 'Setting up workspace', icon: 'construct-outline' as const },
    { label: 'Securing connections', icon: 'shield-checkmark-outline' as const },
];

export default function LoaderScreen() {
    const router = useRouter();
    const { userId, companyId, logout, setUserDetails } = useAuth();
    const { fetchHomePageDetails } = useMasterDataContext();

    const progress = useRef(new Animated.Value(0)).current;
    const pulseAnim = useRef(new Animated.Value(1)).current;
    const fadeIn = useRef(new Animated.Value(0)).current;
    const slideUp = useRef(new Animated.Value(30)).current;
    const dotOpacity1 = useRef(new Animated.Value(0.3)).current;
    const dotOpacity2 = useRef(new Animated.Value(0.3)).current;
    const dotOpacity3 = useRef(new Animated.Value(0.3)).current;

    const [percentage, setPercentage] = useState(0);
    const [currentStep, setCurrentStep] = useState(0);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        // Percentage listener
        const id = progress.addListener(({ value }) => {
            setPercentage(Math.floor(value * 100));
        });

        // Entrance animations
        Animated.parallel([
            Animated.timing(fadeIn, {
                toValue: 1,
                duration: 600,
                useNativeDriver: true,
            }),
            Animated.timing(slideUp, {
                toValue: 0,
                duration: 600,
                useNativeDriver: true,
            }),
        ]).start();

        // Pulse animation for the progress ring
        Animated.loop(
            Animated.sequence([
                Animated.timing(pulseAnim, {
                    toValue: 1.06,
                    duration: 1200,
                    useNativeDriver: true,
                }),
                Animated.timing(pulseAnim, {
                    toValue: 1,
                    duration: 1200,
                    useNativeDriver: true,
                }),
            ])
        ).start();

        // Dot loading animation
        const animateDots = () => {
            Animated.loop(
                Animated.sequence([
                    Animated.timing(dotOpacity1, { toValue: 1, duration: 400, useNativeDriver: true }),
                    Animated.timing(dotOpacity2, { toValue: 1, duration: 400, useNativeDriver: true }),
                    Animated.timing(dotOpacity3, { toValue: 1, duration: 400, useNativeDriver: true }),
                    Animated.parallel([
                        Animated.timing(dotOpacity1, { toValue: 0.3, duration: 300, useNativeDriver: true }),
                        Animated.timing(dotOpacity2, { toValue: 0.3, duration: 300, useNativeDriver: true }),
                        Animated.timing(dotOpacity3, { toValue: 0.3, duration: 300, useNativeDriver: true }),
                    ]),
                ])
            ).start();
        };
        animateDots();

        loadDataAndNavigate();

        return () => {
            progress.removeListener(id);
        };
    }, []);

    const loadDataAndNavigate = async () => {
        try {
            // Step 1: Start (0% -> 20%)
            setCurrentStep(0);
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

            setCurrentStep(1);
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

            setCurrentStep(2);
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

            setCurrentStep(3);
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

            {/* Background gradient blobs */}
            <View style={styles.blobContainer}>
                <LinearGradient
                    colors={['#eef2ff', '#e0e7ff', '#f5f3ff']}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                    style={styles.blob1}
                />
                <LinearGradient
                    colors={['#ddd6fe', '#c7d2fe', '#e9d5ff']}
                    start={{ x: 1, y: 0 }}
                    end={{ x: 0, y: 1 }}
                    style={styles.blob2}
                />
                <LinearGradient
                    colors={['#e0e7ff', '#ede9fe']}
                    start={{ x: 0, y: 1 }}
                    end={{ x: 1, y: 0 }}
                    style={styles.blob3}
                />
            </View>

            {/* Header */}
            <View style={styles.header}>
                <View style={styles.logoPill}>
                    <LinearGradient
                        colors={['#6366f1', '#7c3aed']}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 1 }}
                        style={styles.logoGradient}
                    >
                        <Ionicons name="apps" size={16} color="#fff" />
                    </LinearGradient>
                    <Text style={styles.logoText}>Peopleo</Text>
                </View>
                <View style={styles.versionBadge}>
                    <Text style={styles.versionText}>v1.0.0</Text>
                </View>
            </View>

            {/* Main Content */}
            <Animated.View
                style={[
                    styles.centerContent,
                    {
                        opacity: fadeIn,
                        transform: [{ translateY: slideUp }],
                    },
                ]}
            >
                {error ? (
                    <View style={styles.errorCard}>
                        <View style={styles.errorIconCircle}>
                            <Ionicons name="alert-circle" size={36} color="#ef4444" />
                        </View>
                        <Text style={styles.errorTitle}>Something went wrong</Text>
                        <Text style={styles.errorText}>{error}</Text>
                        <View style={styles.errorRedirectBadge}>
                            <Ionicons name="arrow-back-outline" size={14} color="#6366f1" />
                            <Text style={styles.errorRedirectText}>Redirecting to login...</Text>
                        </View>
                    </View>
                ) : (
                    <>
                        {/* Illustration */}
                        <View style={styles.illustrationWrapper}>
                            <Animated.View style={{ transform: [{ scale: pulseAnim }] }}>
                                <LoaderIllustration width={width * 0.75} height={width * 0.6} />
                            </Animated.View>
                        </View>

                        {/* Title + animated dots */}
                        <View style={styles.titleContainer}>
                            <Text style={styles.mainTitle}>
                                {LOADING_STEPS[currentStep]?.label}
                            </Text>
                            <View style={styles.dotsRow}>
                                <Animated.View style={[styles.loadingDot, { opacity: dotOpacity1 }]} />
                                <Animated.View style={[styles.loadingDot, { opacity: dotOpacity2 }]} />
                                <Animated.View style={[styles.loadingDot, { opacity: dotOpacity3 }]} />
                            </View>
                        </View>

                        {/* Step indicators */}
                        <View style={styles.stepsContainer}>
                            {LOADING_STEPS.map((step, index) => (
                                <View key={index} style={styles.stepRow}>
                                    <View
                                        style={[
                                            styles.stepIconCircle,
                                            index < currentStep && styles.stepIconDone,
                                            index === currentStep && styles.stepIconActive,
                                        ]}
                                    >
                                        {index < currentStep ? (
                                            <Ionicons name="checkmark" size={12} color="#fff" />
                                        ) : (
                                            <Ionicons
                                                name={step.icon}
                                                size={12}
                                                color={index === currentStep ? '#6366f1' : '#94a3b8'}
                                            />
                                        )}
                                    </View>
                                    <Text
                                        style={[
                                            styles.stepLabel,
                                            index < currentStep && styles.stepLabelDone,
                                            index === currentStep && styles.stepLabelActive,
                                        ]}
                                    >
                                        {step.label}
                                    </Text>
                                    {index < LOADING_STEPS.length - 1 && (
                                        <View style={styles.stepConnector}>
                                            <View
                                                style={[
                                                    styles.stepConnectorLine,
                                                    index < currentStep && styles.stepConnectorDone,
                                                ]}
                                            />
                                        </View>
                                    )}
                                </View>
                            ))}
                        </View>
                    </>
                )}
            </Animated.View>

            {/* Bottom Progress Bar */}
            {!error && (
                <View style={styles.bottomSection}>
                    <View style={styles.progressCard}>
                        <View style={styles.progressHeader}>
                            <View style={styles.progressLabelRow}>
                                <View style={styles.progressPulse} />
                                <Text style={styles.progressTitle}>
                                    {LOADING_STEPS[currentStep]?.label}...
                                </Text>
                            </View>
                            <View style={styles.percentBadge}>
                                <Text style={styles.percentText}>{percentage}%</Text>
                            </View>
                        </View>
                        <View style={styles.progressBarBg}>
                            <Animated.View style={[styles.progressBarFillWrapper, { width: progressWidth }]}>
                                <LinearGradient
                                    colors={['#6366f1', '#7c3aed', '#a855f7']}
                                    start={{ x: 0, y: 0 }}
                                    end={{ x: 1, y: 0 }}
                                    style={styles.progressBarFill}
                                />
                            </Animated.View>
                        </View>
                    </View>
                    <View style={styles.footerRow}>
                        <Ionicons name="lock-closed" size={12} color="#94a3b8" />
                        <Text style={styles.footerNote}>
                            Secure connection · Do not close the app
                        </Text>
                    </View>
                </View>
            )}
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FAFBFF',
    },

    // --- Background blobs ---
    blobContainer: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
    },
    blob1: {
        position: 'absolute',
        top: -60,
        right: -40,
        width: 200,
        height: 200,
        borderRadius: 100,
        opacity: 0.6,
    },
    blob2: {
        position: 'absolute',
        top: '40%',
        left: -60,
        width: 160,
        height: 160,
        borderRadius: 80,
        opacity: 0.4,
    },
    blob3: {
        position: 'absolute',
        bottom: -40,
        right: -20,
        width: 140,
        height: 140,
        borderRadius: 70,
        opacity: 0.5,
    },

    // --- Header ---
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 24,
        paddingTop: Platform.OS === 'ios' ? 4 : 10,
        paddingBottom: 8,
    },
    logoPill: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    logoGradient: {
        width: 32,
        height: 32,
        borderRadius: 10,
        justifyContent: 'center',
        alignItems: 'center',
    },
    logoText: {
        fontSize: 17,
        fontWeight: '800',
        color: '#1e1b4b',
        letterSpacing: -0.3,
    },
    versionBadge: {
        backgroundColor: '#eef2ff',
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: '#e0e7ff',
    },
    versionText: {
        fontSize: 11,
        color: '#6366f1',
        fontWeight: '600',
    },

    // --- Center content ---
    centerContent: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 24,
    },
    illustrationWrapper: {
        marginBottom: 20,
        alignItems: 'center',
    },

    // --- Title + dots ---
    titleContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 28,
    },
    mainTitle: {
        fontSize: 20,
        fontWeight: '700',
        color: '#1e1b4b',
        letterSpacing: -0.3,
    },
    dotsRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginLeft: 4,
        gap: 3,
    },
    loadingDot: {
        width: 5,
        height: 5,
        borderRadius: 2.5,
        backgroundColor: '#6366f1',
    },

    // --- Steps ---
    stepsContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        flexWrap: 'nowrap',
        gap: 0,
    },
    stepRow: {
        alignItems: 'center',
        flexDirection: 'row',
        gap: 4,
    },
    stepIconCircle: {
        width: 26,
        height: 26,
        borderRadius: 13,
        backgroundColor: '#f1f5f9',
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 1.5,
        borderColor: '#e2e8f0',
    },
    stepIconDone: {
        backgroundColor: '#6366f1',
        borderColor: '#6366f1',
    },
    stepIconActive: {
        backgroundColor: '#eef2ff',
        borderColor: '#6366f1',
    },
    stepLabel: {
        display: 'none', // Hide labels to keep it compact, only show icons
    },
    stepLabelDone: {},
    stepLabelActive: {},
    stepConnector: {
        width: 20,
        height: 2,
        justifyContent: 'center',
        marginHorizontal: 2,
    },
    stepConnectorLine: {
        height: 2,
        backgroundColor: '#e2e8f0',
        borderRadius: 1,
    },
    stepConnectorDone: {
        backgroundColor: '#6366f1',
    },

    // --- Bottom section ---
    bottomSection: {
        paddingHorizontal: 24,
        paddingBottom: Platform.OS === 'ios' ? 16 : 32,
        alignItems: 'center',
    },
    progressCard: {
        backgroundColor: '#FFFFFF',
        width: '100%',
        borderRadius: 20,
        padding: 20,
        marginBottom: 16,
        shadowColor: '#6366f1',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.08,
        shadowRadius: 16,
        elevation: 6,
        borderWidth: 1,
        borderColor: 'rgba(99, 102, 241, 0.06)',
    },
    progressHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 14,
    },
    progressLabelRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    progressPulse: {
        width: 8,
        height: 8,
        borderRadius: 4,
        backgroundColor: '#6366f1',
    },
    progressTitle: {
        fontSize: 13,
        color: '#475569',
        fontWeight: '600',
    },
    percentBadge: {
        backgroundColor: '#eef2ff',
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: 8,
    },
    percentText: {
        fontSize: 13,
        color: '#6366f1',
        fontWeight: '800',
    },
    progressBarBg: {
        width: '100%',
        height: 8,
        backgroundColor: '#F1F5F9',
        borderRadius: 4,
        overflow: 'hidden',
    },
    progressBarFillWrapper: {
        height: '100%',
        borderRadius: 4,
        overflow: 'hidden',
    },
    progressBarFill: {
        flex: 1,
        borderRadius: 4,
    },
    footerRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
    },
    footerNote: {
        fontSize: 12,
        color: '#94A3B8',
        fontWeight: '500',
    },

    // --- Error ---
    errorCard: {
        backgroundColor: '#FFFFFF',
        borderRadius: 24,
        padding: 32,
        alignItems: 'center',
        width: '100%',
        shadowColor: '#ef4444',
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.08,
        shadowRadius: 24,
        elevation: 8,
        borderWidth: 1,
        borderColor: '#fecaca',
    },
    errorIconCircle: {
        width: 72,
        height: 72,
        borderRadius: 36,
        backgroundColor: '#fef2f2',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 20,
        borderWidth: 1,
        borderColor: '#fecaca',
    },
    errorTitle: {
        fontSize: 20,
        fontWeight: '800',
        color: '#1e1b4b',
        marginBottom: 8,
    },
    errorText: {
        fontSize: 14,
        color: '#64748b',
        textAlign: 'center',
        lineHeight: 22,
        marginBottom: 20,
    },
    errorRedirectBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#eef2ff',
        paddingHorizontal: 16,
        paddingVertical: 10,
        borderRadius: 12,
        gap: 6,
    },
    errorRedirectText: {
        fontSize: 13,
        color: '#6366f1',
        fontWeight: '600',
    },
});
