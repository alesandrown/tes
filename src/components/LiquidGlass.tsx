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
    bgBase: isDark ? '#0B1324' : '#EEF4FA',
    // Warna kaca disesuaikan agar menyatu dengan nuansa biru & putih wallpaper ITB
    glassBg: isDark ? 'rgba(12, 22, 42, 0.64)' : 'rgba(255, 255, 255, 0.72)',
    glassBgStrong: isDark ? 'rgba(10, 18, 36, 0.84)' : 'rgba(255, 255, 255, 0.88)',
    glassBorder: isDark ? 'rgba(147, 197, 253, 0.24)' : 'rgba(255, 255, 255, 0.92)',
    glassHighlight: isDark ? 'rgba(191, 219, 254, 0.42)' : 'rgba(255, 255, 255, 1)',
    innerDivider: isDark ? 'rgba(148, 163, 184, 0.16)' : 'rgba(15, 23, 42, 0.08)',
    textPrimary: isDark ? '#F8FAFC' : '#0F172A',
    textSecondary: isDark ? '#CBD5E1' : '#334155',
    // Aksen biru khas ITB (#005AAB / #38BDF8)
    accent: isDark ? '#38BDF8' : '#005AAB',
    accentSoft: isDark ? 'rgba(56, 189, 248, 0.20)' : 'rgba(0, 90, 171, 0.14)',
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
      blurRadius={2}
      style={[styles.container, { backgroundColor: g.bgBase }, style]}
    >
      <View
        style={[
          styles.overlay,
          {
            backgroundColor: g.isDark
              ? 'rgba(8, 15, 30, 0.35)'
              : 'rgba(255, 255, 255, 0.08)',
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
              ? 'rgba(255,255,255,0.08)'
              : 'rgba(255,255,255,0.60)',
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
