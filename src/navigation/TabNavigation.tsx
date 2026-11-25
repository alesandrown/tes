import React, { useEffect, useRef, useState } from 'react';
import { Animated, LayoutChangeEvent, Pressable, StyleSheet, View } from 'react-native';
import { Icon, Text } from 'react-native-paper';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import HomeScreen from '../screens/HomeScreen';
import SettingsScreen from '../screens/SettingsScreen';
import AboutScreen from '../screens/AboutScreen';
import { useGlassTokens } from '../components/LiquidGlass';

const TABS = [
  { key: 'home', title: 'Home', focusedIcon: 'home', unfocusedIcon: 'home-outline' },
  { key: 'settings', title: 'Settings', focusedIcon: 'cog', unfocusedIcon: 'cog-outline' },
  { key: 'about', title: 'About', focusedIcon: 'information', unfocusedIcon: 'information-outline' },
] as const;

export default function TabNavigation() {
  const [index, setIndex] = useState(0);
  const [dockWidth, setDockWidth] = useState(0);
  const insets = useSafeAreaInsets();
  const g = useGlassTokens();

  const slideAnim = useRef(new Animated.Value(0)).current;
  const stretchAnim = useRef(new Animated.Value(1)).current;
  const fadeAnim = useRef(new Animated.Value(1)).current;

  const pillWidth = dockWidth > 0 ? (dockWidth - 12) / TABS.length : 0;

  useEffect(() => {
    Animated.parallel([
      Animated.spring(slideAnim, {
        toValue: index,
        useNativeDriver: true,
        stiffness: 220,
        damping: 20,
        mass: 0.85,
      }),
      Animated.sequence([
        Animated.timing(stretchAnim, {
          toValue: 1.12,
          duration: 130,
          useNativeDriver: true,
        }),
        Animated.spring(stretchAnim, {
          toValue: 1,
          useNativeDriver: true,
          stiffness: 260,
          damping: 16,
        }),
      ]),
    ]).start();
  }, [index, slideAnim, stretchAnim]);

  const handleSelectTab = (nextIndex: number) => {
    if (nextIndex === index) return;
    fadeAnim.setValue(0.88);
    setIndex(nextIndex);
    Animated.spring(fadeAnim, {
      toValue: 1,
      useNativeDriver: true,
      stiffness: 240,
      damping: 22,
    }).start();
  };

  const onDockLayout = (e: LayoutChangeEvent) => {
    setDockWidth(e.nativeEvent.layout.width);
  };

  const translateX = slideAnim.interpolate({
    inputRange: [0, 1, 2],
    outputRange: [0, pillWidth, pillWidth * 2],
  });

  return (
    <View style={{ flex: 1, backgroundColor: g.bgBase }}>
      <Animated.View style={{ flex: 1, opacity: fadeAnim }}>
        {index === 0 && <HomeScreen />}
        {index === 1 && <SettingsScreen />}
        {index === 2 && <AboutScreen />}
      </Animated.View>

      <View
        pointerEvents="box-none"
        style={[
          styles.dockWrapper,
          { bottom: Math.max(insets.bottom, 12) + 6 },
        ]}
      >
        <View
          onLayout={onDockLayout}
          style={[
            styles.glassDock,
            {
              backgroundColor: g.glassBgStrong,
              borderColor: g.glassBorder,
              borderTopColor: g.glassHighlight,
            },
          ]}
        >
          {pillWidth > 0 && (
            <Animated.View
              pointerEvents="none"
              style={[
                styles.liquidPill,
                {
                  width: pillWidth,
                  backgroundColor: g.accentSoft,
                  borderColor: g.glassHighlight,
                  transform: [{ translateX }, { scaleX: stretchAnim }],
                },
              ]}
            />
          )}

          {TABS.map((tab, i) => {
            const focused = index === i;
            return (
              <Pressable
                key={tab.key}
                onPress={() => handleSelectTab(i)}
                style={styles.tabItem}
              >
                <Icon
                  source={focused ? tab.focusedIcon : tab.unfocusedIcon}
                  size={21}
                  color={focused ? g.accent : g.textSecondary}
                />
                <Text
                  style={[
                    styles.tabLabel,
                    {
                      color: focused ? g.accent : g.textSecondary,
                      fontWeight: focused ? '700' : '500',
                    },
                  ]}
                >
                  {tab.title}
                </Text>
              </Pressable>
            );
          })}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  dockWrapper: {
    position: 'absolute',
    left: 20,
    right: 20,
    alignItems: 'center',
  },
  glassDock: {
    flexDirection: 'row',
    width: '100%',
    maxWidth: 420,
    padding: 6,
    borderRadius: 32,
    borderWidth: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.24,
    shadowRadius: 24,
    elevation: 10,
  },
  liquidPill: {
    position: 'absolute',
    top: 6,
    bottom: 6,
    left: 6,
    borderRadius: 26,
    borderWidth: 1,
  },
  tabItem: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 11,
    borderRadius: 26,
    gap: 7,
  },
  tabLabel: {
    fontSize: 13,
    letterSpacing: 0.2,
  },
});
