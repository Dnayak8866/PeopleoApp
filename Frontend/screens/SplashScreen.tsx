import { LinearGradient } from 'expo-linear-gradient';
import React, { useEffect, useRef } from 'react';
import {
  Animated,
  Dimensions,
  StatusBar,
  Text,
  View,
  StyleSheet,
  Platform,
} from 'react-native';
import SplashIllustration from '@/components/illustrations/SplashIllustration';

const { width, height } = Dimensions.get('window');

interface SplashScreenProps {
  onAnimationComplete?: () => void;
}

const SplashScreen = ({ onAnimationComplete }: SplashScreenProps) => {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(25)).current;
  const scaleAnim = useRef(new Animated.Value(0.92)).current;
  
  const dotAnims = useRef([
    new Animated.Value(0),
    new Animated.Value(0),
    new Animated.Value(0),
  ]).current;

  useEffect(() => {
    // Entrance animations
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 1200,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 1200,
        useNativeDriver: true,
      }),
      Animated.timing(scaleAnim, {
        toValue: 1,
        duration: 1200,
        useNativeDriver: true,
      }),
    ]).start();

    // Pulse sequence animation for loading dots
    const animateDots = () => {
      const animations = dotAnims.map((anim, index) =>
        Animated.loop(
          Animated.sequence([
            Animated.timing(anim, {
              toValue: 1,
              duration: 600,
              delay: index * 200,
              useNativeDriver: true,
            }),
            Animated.timing(anim, {
              toValue: 0,
              duration: 600,
              useNativeDriver: true,
            }),
          ])
        )
      );
      Animated.stagger(200, animations).start();
    };

    const timer = setTimeout(animateDots, 600);

    const completeTimer = setTimeout(() => {
      if (onAnimationComplete) {
        onAnimationComplete();
      }
    }, 4500);

    return () => {
      clearTimeout(timer);
      clearTimeout(completeTimer);
    };
  }, []);

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#0B0F19" />
      
      <LinearGradient
        colors={['#0B0F19', '#1E1B4B', '#0F172A']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.gradient}
      >
        {/* Glow ambient backdrops */}
        <View style={styles.glowCircle1} />
        <View style={styles.glowCircle2} />

        <Animated.View
          style={[
            styles.contentContainer,
            {
              opacity: fadeAnim,
              transform: [
                { translateY: slideAnim },
                { scale: scaleAnim },
              ],
            },
          ]}
        >
          {/* Custom Splash Vector Illustration */}
          <View style={styles.illustrationWrapper}>
            <SplashIllustration width={220} height={160} />
          </View>

          {/* Logo Name & Slogan */}
          <Text style={styles.logoText}>Peopleo</Text>
          <View style={styles.underline} />
          
          <Text style={styles.subtitle}>
            Elevate teamwork with effortless attendance tracking
          </Text>

          {/* Loading Dot Indicators */}
          <View style={styles.loadingContainer}>
            {dotAnims.map((anim, index) => (
              <Animated.View
                key={index}
                style={[
                  styles.dot,
                  {
                    opacity: anim.interpolate({
                      inputRange: [0, 1],
                      outputRange: [0.3, 1],
                    }),
                    transform: [
                      {
                        scale: anim.interpolate({
                          inputRange: [0, 1],
                          outputRange: [1, 1.35],
                        }),
                      },
                    ],
                  },
                ]}
              />
            ))}
          </View>
        </Animated.View>

        {/* Footer brand details */}
        <Animated.View style={[styles.footerTextContainer, { opacity: fadeAnim }]}>
          <Text style={styles.footerVersion}>Version 1.2.0</Text>
          <Text style={styles.footerCopyright}>© {new Date().getFullYear()} Peopleo. All rights reserved.</Text>
        </Animated.View>
      </LinearGradient>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0B0F19',
  },
  gradient: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 30,
  },
  glowCircle1: {
    position: 'absolute',
    top: height * 0.15,
    left: -60,
    width: 220,
    height: 220,
    borderRadius: 110,
    backgroundColor: 'rgba(99, 102, 241, 0.08)',
    filter: Platform.OS === 'ios' ? 'blur(40px)' : undefined,
  },
  glowCircle2: {
    position: 'absolute',
    bottom: height * 0.2,
    right: -80,
    width: 260,
    height: 260,
    borderRadius: 130,
    backgroundColor: 'rgba(139, 92, 246, 0.06)',
    filter: Platform.OS === 'ios' ? 'blur(50px)' : undefined,
  },
  contentContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
  },
  illustrationWrapper: {
    marginBottom: 28,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#6366f1',
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.12,
    shadowRadius: 20,
  },
  logoText: {
    fontSize: 38,
    fontWeight: '900',
    color: '#FFFFFF',
    letterSpacing: 1.5,
    textShadowColor: 'rgba(99, 102, 241, 0.3)',
    textShadowOffset: { width: 0, height: 4 },
    textShadowRadius: 10,
  },
  underline: {
    width: 42,
    height: 4.5,
    backgroundColor: '#6366f1',
    borderRadius: 3,
    marginTop: 8,
    marginBottom: 16,
  },
  subtitle: {
    fontSize: 13,
    color: '#94A3B8',
    textAlign: 'center',
    lineHeight: 20,
    fontWeight: '600',
    maxWidth: 240,
    marginBottom: 36,
  },
  loadingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    height: 20,
    gap: 8,
  },
  dot: {
    width: 7,
    height: 7,
    borderRadius: 3.5,
    backgroundColor: '#6366f1',
  },
  footerTextContainer: {
    position: 'absolute',
    bottom: Platform.OS === 'ios' ? 44 : 32,
    alignItems: 'center',
  },
  footerVersion: {
    fontSize: 11,
    fontWeight: '700',
    color: '#475569',
    letterSpacing: 0.8,
    textTransform: 'uppercase',
  },
  footerCopyright: {
    fontSize: 10,
    color: '#475569',
    fontWeight: '500',
    marginTop: 4,
  },
});

export default SplashScreen;