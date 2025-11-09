import React, { useEffect, useRef } from 'react';
import { Animated, Dimensions, Easing, StyleSheet, Text, View } from 'react-native';
import Svg, { Circle, G } from 'react-native-svg';

const { width } = Dimensions.get('window');

interface ChartData {
  percentage: number;
  color: string;
  label: string;
}

interface RadialChartProps {
  data: ChartData[];
  centerValue: number;
  centerLabel: string;
  centerSubtitle: string;
  centerSubsubtitle: string;
  size?: number;
  strokeWidth?: number;
}

const AnimatedCircle = Animated.createAnimatedComponent(Circle);

export function RadialChart({
  data,
  centerValue,
  centerLabel,
  centerSubtitle,
  centerSubsubtitle,
  size = 200,
  strokeWidth = 25,
}: RadialChartProps) {
  const animatedValues = useRef(data.map(() => new Animated.Value(0))).current;
  const center = size / 2;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  
  // Ensure percentages add up to 100% (or warn if they don't)
  const totalPercentage = data.reduce((sum, item) => sum + item.percentage, 0);
  
  useEffect(() => {
    // Reset all animations
    animatedValues.forEach(animatedValue => animatedValue.setValue(0));
    
    // Animate each segment with a slight delay
    const animations = animatedValues.map((animatedValue, index) => 
      Animated.timing(animatedValue, {
        toValue: 1,
        duration: 1200,
        delay: index * 150,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: false,
      })
    );
    
    Animated.parallel(animations).start();
  }, [data]);

  const renderSegments = () => {
    let currentAngle = -90; // Start from top (12 o'clock position)
    
    return data.map((item, index) => {
      // Calculate the arc length based on percentage
      const arcLength = (item.percentage / 100) * circumference;
      const strokeDasharray = arcLength;
      const strokeDashoffset = circumference - arcLength;
      
      // Calculate rotation angle for this segment
      const rotation = currentAngle;
      
      // Update current angle for next segment
      currentAngle += (item.percentage / 100) * 360;
      
      return (
        <AnimatedCircle
          key={index}
          cx={center}
          cy={center}
          r={radius}
          fill="none"
          stroke={item.color}
          strokeWidth={strokeWidth}
          strokeDasharray={`${strokeDasharray} ${circumference}`}
          strokeDashoffset={animatedValues[index].interpolate({
            inputRange: [0, 1],
            outputRange: [circumference, strokeDashoffset],
          })}
          strokeLinecap="round"
          transform={`rotate(${rotation} ${center} ${center})`}
        />
      );
    });
  };

  return (
    <View style={styles.container}>
      {/* Chart Container */}
      <View style={[styles.chartContainer, { width: size, height: size }]}>
        <Svg width={size} height={size}>
          <G>
            {/* Background circle - light gray */}
            <Circle
              cx={center}
              cy={center}
              r={radius}
              fill="none"
              stroke="#F3F4F6"
              strokeWidth={strokeWidth}
            />
            {/* Data segments */}
            {renderSegments()}
          </G>
        </Svg>
        
        {/* Center content */}
        <View style={styles.centerContent}>
          <View style={styles.centerTextContainer}>
            <Text style={styles.centerValue}>
              {centerValue.toFixed(1)} <Text style={styles.centerLabel}>{centerLabel}</Text>
            </Text>
            <Text style={styles.centerSubtitle}>{centerSubtitle}</Text>
            <Text style={styles.centerSubsubtitle}>{centerSubsubtitle}</Text>
          </View>
        </View>
      </View>
    </View>
  );
}

// Example usage component with data matching the reference image
export default function App() {
  const chartData = [
    { percentage: 78, color: '#10B981', label: 'Present' },      // 78% - Green (dominant)
    { percentage: 8, color: '#F59E0B', label: 'On Leave' },     // 8% - Yellow/Orange  
    { percentage: 7, color: '#EF4444', label: 'Absent' },       // 7% - Red
    { percentage: 7, color: '#3B82F6', label: 'Late Check-in' } // 7% - Blue
  ];

  return (
    <RadialChart
      data={chartData}
      centerValue={7.8}
      centerLabel="hrs"
      centerSubtitle="Avg. Working Hours"
      centerSubsubtitle="(Yesterday)"
      size={200}
      strokeWidth={25}
    />
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  chartContainer: {
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
  },
  centerContent: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    alignItems: 'center',
    justifyContent: 'center',
  },
  centerTextContainer: {
    alignItems: 'center',
  },
  centerValue: {
    fontSize: 32,
    fontWeight: '700',
    color: '#111827',
    textAlign: 'center',
  },
  centerLabel: {
    fontSize: 18,
    fontWeight: '500',
    color: '#6B7280',
  },
  centerSubtitle: {
    fontSize: 13,
    fontWeight: '500',
    color: '#6B7280',
    textAlign: 'center',
    marginTop: 4,
  },
  centerSubsubtitle: {
    fontSize: 11,
    fontWeight: '400',
    color: '#9CA3AF',
    textAlign: 'center',
    marginTop: 2,
  },
});