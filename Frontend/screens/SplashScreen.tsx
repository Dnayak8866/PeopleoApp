import { splashScreenStyles } from '@/styles/splashScreenStyles';
import { LinearGradient } from 'expo-linear-gradient';
import React, { useEffect, useRef } from 'react';
import {
  Animated,
  Dimensions,
  StatusBar,
  Text,
  View
} from 'react-native';

const { width, height } = Dimensions.get('window');

const SplashScreen = ({ onAnimationComplete }: any) => {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;
  const scaleAnim = useRef(new Animated.Value(0.8)).current;
  const dotAnims = useRef([
    new Animated.Value(0),
    new Animated.Value(0),
    new Animated.Value(0),
  ]).current;
  const styles = splashScreenStyles();

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 1500,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 1500,
        useNativeDriver: true,
      }),
      Animated.timing(scaleAnim, {
        toValue: 1,
        duration: 1500,
        useNativeDriver: true,
      }),
    ]).start();

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

    const timer = setTimeout(animateDots, 1000);

    const completeTimer = setTimeout(() => {
      if (onAnimationComplete) {
        onAnimationComplete();
      }
    }, 5000);

    return () => {
      clearTimeout(timer);
      clearTimeout(completeTimer);
    };
  }, []);

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#667eea" />
      
      <LinearGradient
        colors={['#667eea', '#764ba2']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.gradient}
      >
        <View style={[styles.bgElement, styles.bgElement1]} />
        <View style={[styles.bgElement, styles.bgElement2]} />
        <View style={[styles.bgElement, styles.bgElement3]} />

        <Animated.View
          style={[
            styles.logoContainer,
            {
              opacity: fadeAnim,
              transform: [
                { translateY: slideAnim },
                { scale: scaleAnim },
              ],
            },
          ]}
        >
          <Text style={styles.logoText}>Peopleo</Text>
          <View style={styles.underline} />
          
          <Animated.Text
            style={[
              styles.subtitle,
              { opacity: fadeAnim },
            ]}
          >
            Elevate team work with effortless attendance tracking
          </Animated.Text>

          <View style={styles.loadingContainer}>
            {dotAnims.map((anim, index) => (
              <Animated.View
                key={index}
                style={[
                  styles.dot,
                  {
                    opacity: anim,
                    transform: [
                      {
                        scale: anim.interpolate({
                          inputRange: [0, 1],
                          outputRange: [1, 1.3],
                        }),
                      },
                    ],
                  },
                ]}
              />
            ))}
          </View>
        </Animated.View>
      </LinearGradient>
    </View>
  );
};

export default SplashScreen;