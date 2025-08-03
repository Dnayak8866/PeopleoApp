import * as Device from "expo-device";
import { useMemo } from "react";
import { Dimensions, Platform, StatusBar, useWindowDimensions } from "react-native";

interface SizeConfig {
    small: object,
    medium: object,
    large: object,
}

const BASE_WIDTH = 375;
const BASE_HEIGHT = 812;
const BREAKPOINTS = {
    smallPhone: 320,
    phone: 375,
    tablet: 768,
    laptop: 1024,
} as const;

const {width: SCREEN_WIDTH, height: SCREEN_HEIGHT} = Dimensions.get("window");
const WIDTH_SCALE = SCREEN_WIDTH / BASE_WIDTH;
const HEIGHT_SCALE = SCREEN_HEIGHT / BASE_HEIGHT;

const responsiveUtil = {
    w: (size: number): number => Math.round(size * WIDTH_SCALE),
    h: (size: number): number => Math.round(size * HEIGHT_SCALE),
    m: (size: number, factor: number = 0.5): number => Math.round(size + (WIDTH_SCALE - 1) * size * factor),
    f: (size: number): number => Math.round(size * Math.min(WIDTH_SCALE, HEIGHT_SCALE)),
}

const calculationCache = new Map<string, number>();

const getCachedCalculation = (
    type: 'w' | 'h' | 'm' | 'f',
    size: number,
    factor?: number
): number => {
    const key = `${type}_${size}_${factor || ''}`;
    if(!calculationCache.has(key)) {
        const result = factor !== undefined
            ? responsiveUtil[type](size, factor)
            : responsiveUtil[type](size);
        calculationCache.set(key, result);
    }
    return calculationCache.get(key)!;
}

export const useResponsive = () => {
    const { width, height } = useWindowDimensions();

    const deviceType = useMemo(() => ({
        isSmallPhone: width < BREAKPOINTS.phone,
        isPhone: width >= BREAKPOINTS.phone && width < BREAKPOINTS.tablet,
        isTablet: Device.DeviceType.TABLET == 2 && width < BREAKPOINTS.laptop,
        isSmallerTablet: width >=580 && width <= 680,
        isLaptop: width >= BREAKPOINTS.laptop,
    }),[width]);

    const platform = useMemo(() => ({
        isIOS: Platform.OS === 'ios',
        isAndroid: Platform.OS === 'android',
        isWeb: Platform.OS === 'web',
        version: Platform.Version,
    }),[]);

    const dimensions = useMemo(() => ({
        width,
        height,
        screenWidth: SCREEN_WIDTH,
        screenHeight: SCREEN_HEIGHT,
        statusBarHeight: Platform.OS === 'ios' ? 20 : StatusBar.currentHeight || 0,
        headerHeight: Platform.OS === 'ios' ? 44 : 56,
    }), [width, height]);

    const calculations = useMemo(() => ({
        calcWidth: (size: number) => getCachedCalculation('w', size),
        calcHeight: (size: number) => getCachedCalculation('h', size),
        calcFont: (size: number) => getCachedCalculation('f', size),
        calcModerate: (size: number, factor: number) => getCachedCalculation('m', size, factor),
    }), []);

    const getSafePadding = useMemo(()=> ({
        paddingTop: platform.isIOS ? dimensions.statusBarHeight : 0,
        paddingBottom: platform.isIOS ? 20 : 0,
    }),[platform.isIOS, dimensions.statusBarHeight]);

    return {
        deviceType,
        platform,
        dimensions,
        ...calculations,
        responsiveUtil,
        getSafePadding,
        isPortrait: height > width,
        isLandscape: width > height,
        screenWidth: width,
        screenHeight: height,
    };
}

export const createResponsiveStyle =<T extends object>(styleConfig: SizeConfig): T => {
    const {width} = useWindowDimensions();

    return useMemo(()=> {
        if(width < BREAKPOINTS.phone) return styleConfig.small as T;
        if(width < BREAKPOINTS.tablet) return styleConfig.medium as T;
        return styleConfig.large as T;
    }, [width, styleConfig]) as T;
};

export const deviceHeight = Dimensions.get('window').height;