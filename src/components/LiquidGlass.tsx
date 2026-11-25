import React, { useRef } from 'react';
import {
  Animated,
  ImageBackground,
  Pressable,
  StyleProp,
  StyleSheet,
  View,
  ViewStyle,
} from 'react-native';
import { useTheme } from 'react-native-paper';

export function useGlassTokens() {
  const theme = useTheme();
  const isDark = theme.dark;

  return {
    isDark,
    bgBase: isDark ? '#070B14' : '#EEF4FA',
    glassBg: isDark ? 'rgba(15, 23, 42, 0.58)' : 'rgba(255, 255, 255, 0.68)',
    glassBgStrong: isDark ? 'rgba(10, 15, 30, 0.78)' : 'rgba(255, 255, 255, 0.85)',
    glassBorder: isDark ? 'rgba(255, 255, 255, 0.16)' : 'rgba(255, 255, 255, 0.90)',
    glassHighlight: isDark ? 'rgba(255, 255, 255, 0.28)' : 'rgba(255, 255, 255, 1)',
    innerDivider: isDark ? 'rgba(255, 255, 255, 0.10)' : 'rgba(15, 23, 42, 0.08)',
    textPrimary: isDark ? '#F8FAFC' : '#0F172A',
    textSecondary: isDark ? '#CBD5E1' : '#475569',
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

  return (
    <ImageBackground
      source={require('../assets/bg-wallpaper.jpg')}
      resizeMode="cover"
      blurRadius={12}
      style={[styles.container, { backgroundColor: g.bgBase }, style]}
    >
      <View
        style={[
          styles.overlay,
          {
            backgroundColor: g.isDark
              ? 'rgba(7, 11, 20, 0.38)'
              : 'rgba(238, 244, 250, 0.25)',
          },
        ]}
      >
        {children}
      </View>
    </ImageBackground>
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
  },
  overlay: {
    flex: 1,
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
