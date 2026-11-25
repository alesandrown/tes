import React from 'react';
import { StyleProp, StyleSheet, View, ViewStyle } from 'react-native';
import { useTheme } from 'react-native-paper';

export function useGlassTokens() {
  const theme = useTheme();
  const isDark = theme.dark;

  return {
    isDark,
    bgBase: isDark ? '#070B14' : '#EEF4FA',
    orbPrimary: isDark ? 'rgba(34, 211, 238, 0.22)' : 'rgba(14, 165, 233, 0.20)',
    orbSecondary: isDark ? 'rgba(99, 102, 241, 0.22)' : 'rgba(56, 189, 248, 0.18)',
    orbAccent: isDark ? 'rgba(16, 185, 129, 0.14)' : 'rgba(99, 102, 241, 0.14)',
    glassBg: isDark ? 'rgba(20, 28, 46, 0.62)' : 'rgba(255, 255, 255, 0.72)',
    glassBgStrong: isDark ? 'rgba(15, 23, 42, 0.82)' : 'rgba(255, 255, 255, 0.88)',
    glassBorder: isDark ? 'rgba(255, 255, 255, 0.14)' : 'rgba(255, 255, 255, 0.90)',
    glassHighlight: isDark ? 'rgba(255, 255, 255, 0.22)' : 'rgba(255, 255, 255, 1)',
    innerDivider: isDark ? 'rgba(255, 255, 255, 0.08)' : 'rgba(15, 23, 42, 0.07)',
    textPrimary: isDark ? '#F8FAFC' : '#0F172A',
    textSecondary: isDark ? '#94A3B8' : '#475569',
    accent: isDark ? '#22D3EE' : '#0284C7',
    accentSoft: isDark ? 'rgba(34, 211, 238, 0.16)' : 'rgba(2, 132, 199, 0.12)',
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
    <View style={[styles.container, { backgroundColor: g.bgBase }, style]}>
      <View style={[styles.orbTopLeft, { backgroundColor: g.orbPrimary }]} />
      <View style={[styles.orbCenterRight, { backgroundColor: g.orbSecondary }]} />
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
}: {
  children: React.ReactNode;
  style?: StyleProp<ViewStyle>;
  radius?: number;
  strong?: boolean;
}) {
  const g = useGlassTokens();

  return (
    <View
      style={[
        styles.glassCard,
        {
          borderRadius: radius,
          backgroundColor: strong ? g.glassBgStrong : g.glassBg,
          borderColor: g.glassBorder,
          borderTopColor: g.glassHighlight,
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
              ? 'rgba(255,255,255,0.04)'
              : 'rgba(255,255,255,0.45)',
          },
        ]}
      />
      {children}
    </View>
  );
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
    shadowOpacity: 0.14,
    shadowRadius: 20,
    elevation: 4,
  },
  specularSheen: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 18,
  },
});
