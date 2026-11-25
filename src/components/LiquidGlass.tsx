import React, { useEffect, useRef } from 'react';
import { Animated, Easing, Pressable, StyleProp, StyleSheet, View, ViewStyle } from 'react-native';
import { useTheme } from 'react-native-paper';

export function useGlassTokens() {
  const theme = useTheme();
  const isDark = theme.dark;

  return {
    isDark,
    bgBase: isDark ? '#070B14' : '#EEF4FA',
    orbPrimary: isDark ? 'rgba(34, 211, 238, 0.25)' : 'rgba(14, 165, 233, 0.22)',
    orbSecondary: isDark ? 'rgba(99, 102, 241, 0.24)' : 'rgba(56, 189, 248, 0.20)',
    orbAccent: isDark ? 'rgba(16, 185, 129, 0.16)' : 'rgba(99, 102, 241, 0.16)',
    glassBg: isDark ? 'rgba(20, 28, 46, 0.60)' : 'rgba(255, 255, 255, 0.72)',
    glassBgStrong: isDark ? 'rgba(15, 23, 42, 0.82)' : 'rgba(255, 255, 255, 0.88)',
    glassBorder: isDark ? 'rgba(255, 255, 255, 0.15)' : 'rgba(255, 255, 255, 0.92)',
    glassHighlight: isDark ? 'rgba(255, 255, 255, 0.26)' : 'rgba(255, 255, 255, 1)',
    innerDivider: isDark ? 'rgba(255, 255, 255, 0.08)' : 'rgba(15, 23, 42, 0.07)',
    textPrimary: isDark ? '#F8FAFC' : '#0F172A',
    textSecondary: isDark ? '#94A3B8' : '#475569',
    accent: isDark ? '#22D3EE' : '#0284C7',
    accentSoft: isDark ? 'rgba(34, 211, 238, 0.18)' : 'rgba(2, 132, 199, 0.14)',
  };
}

export function LiquidBackground({
  children,
  style,
}: {
  children: React.ReactNode;
  style?: StyleProp<ViewStyle>;
}) {
  const g = useGlassTokens();
  const floatAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(floatAnim, {
          toValue: 1,
          duration: 6000,
          easing: Easing.inOut(Easing.sin),
          useNativeDriver: true,
        }),
        Animated.timing(floatAnim, {
          toValue: 0,
          duration: 6000,
          easing: Easing.inOut(Easing.sin),
          useNativeDriver: true,
        }),
      ])
    );
    loop.start();
    return () => loop.stop();
  }, [floatAnim]);

  const orb1TranslateX = floatAnim.interpolate({ inputRange: [0, 1], outputRange: [-15, 25] });
  const orb1TranslateY = floatAnim.interpolate({ inputRange: [0, 1], outputRange: [-10, 20] });
  const orb1Scale = floatAnim.interpolate({ inputRange: [0, 1], outputRange: [1, 1.12] });

  const orb2TranslateX = floatAnim.interpolate({ inputRange: [0, 1], outputRange: [20, -25] });
  const orb2TranslateY = floatAnim.interpolate({ inputRange: [0, 1], outputRange: [15, -20] });

  return (
    <View style={[styles.container, { backgroundColor: g.bgBase }, style]}>
      <Animated.View
        style={[
          styles.orbTopLeft,
          {
            backgroundColor: g.orbPrimary,
            transform: [
              { translateX: orb1TranslateX },
              { translateY: orb1TranslateY },
              { scale: orb1Scale },
            ],
          },
        ]}
      />
      <Animated.View
        style={[
          styles.orbCenterRight,
          {
            backgroundColor: g.orbSecondary,
            transform: [{ translateX: orb2TranslateX }, { translateY: orb2TranslateY }],
          },
        ]}
      />
      <View style={[styles.orbBottomLeft, { backgroundColor: g.orbAccent }]} />
      {children}
    </View>
  );
}

export function GlassCard({
  children,
  style,
  radius = 24,
  strong = false,
  interactive = false,
}: {
  children: React.ReactNode;
  style?: StyleProp<ViewStyle>;
  radius?: number;
  strong?: boolean;
  interactive?: boolean;
}) {
  const g = useGlassTokens();
  const scale = useRef(new Animated.Value(1)).current;

  const handlePressIn = () => {
    if (!interactive) return;
    Animated.spring(scale, {
      toValue: 0.975,
      useNativeDriver: true,
      speed: 28,
      bounciness: 8,
    }).start();
  };

  const handlePressOut = () => {
    if (!interactive) return;
    Animated.spring(scale, {
      toValue: 1,
      useNativeDriver: true,
      speed: 20,
      bounciness: 12,
    }).start();
  };

  const cardBody = (
    <Animated.View
      style={[
        styles.glassCard,
        {
          borderRadius: radius,
          backgroundColor: strong ? g.glassBgStrong : g.glassBg,
          borderColor: g.glassBorder,
          borderTopColor: g.glassHighlight,
          transform: [{ scale }],
        },
        style,
      ]}
    >
      <View
        pointerEvents="none"
        style={[
          styles.specularSheen,
          {
            borderTopLeftRadius: radius,
            borderTopRightRadius: radius,
            backgroundColor: g.isDark
              ? 'rgba(255,255,255,0.06)'
              : 'rgba(255,255,255,0.55)',
          },
        ]}
      />
      {children}
    </Animated.View>
  );

  if (interactive) {
    return (
      <Pressable onPressIn={handlePressIn} onPressOut={handlePressOut}>
        {cardBody}
      </Pressable>
    );
  }

  return cardBody;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    overflow: 'hidden',
  },
  orbTopLeft: {
    position: 'absolute',
    top: -90,
    left: -70,
    width: 280,
    height: 280,
    borderRadius: 140,
  },
  orbCenterRight: {
    position: 'absolute',
    top: '32%',
    right: -100,
    width: 300,
    height: 300,
    borderRadius: 150,
  },
  orbBottomLeft: {
    position: 'absolute',
    bottom: -70,
    left: 20,
    width: 260,
    height: 260,
    borderRadius: 130,
  },
  glassCard: {
    borderWidth: 1,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.16,
    shadowRadius: 22,
    elevation: 4,
  },
  specularSheen: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 20,
  },
});
