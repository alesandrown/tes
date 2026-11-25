import React, { useState } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
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
  const insets = useSafeAreaInsets();
  const g = useGlassTokens();

  return (
    <View style={{ flex: 1, backgroundColor: g.bgBase }}>
      <View style={{ flex: 1 }}>
        {index === 0 && <HomeScreen />}
        {index === 1 && <SettingsScreen />}
        {index === 2 && <AboutScreen />}
      </View>

      <View
        pointerEvents="box-none"
        style={[
          styles.dockWrapper,
          { bottom: Math.max(insets.bottom, 12) + 6 },
        ]}
      >
        <View
          style={[
            styles.glassDock,
            {
              backgroundColor: g.glassBgStrong,
              borderColor: g.glassBorder,
              borderTopColor: g.glassHighlight,
            },
          ]}
        >
          {TABS.map((tab, i) => {
            const focused = index === i;
            return (
              <Pressable
                key={tab.key}
                onPress={() => setIndex(i)}
                style={[
                  styles.tabItem,
                  focused && {
                    backgroundColor: g.accentSoft,
                    borderColor: g.glassHighlight,
                    borderWidth: 1,
                  },
                ]}
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
    gap: 6,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.22,
    shadowRadius: 24,
    elevation: 10,
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
