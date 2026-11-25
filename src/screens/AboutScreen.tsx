import React, { useMemo, useState } from 'react';
import { Image, ScrollView, StyleSheet, View } from 'react-native';
import DeviceInfo from 'react-native-device-info';
import { Icon, Text, TouchableRipple } from 'react-native-paper';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { GlassCard, LiquidBackground, useGlassTokens } from '../components/LiquidGlass';

type ContributorType = {
  name: string;
  role: string;
  githubName?: string;
  notes?: string;
  task?: string;
  githubProfileUrl?: string;
};

const CONTRIBUTORS: ContributorType[] = [
  {
    name: 'Bjorka',
    role: 'Larp King',
    githubName: 'none',
    task: 'Liquid Glass UI redesign, built-in secure keyboard integration, and release build.',
    notes: 'Built for a cleaner, distraction-free exam experience.',
    githubProfileUrl: 'https://github.com/alesandrown.png',
  },
];

function FieldRow({
  icon,
  label,
  value,
}: {
  icon: string;
  label: string;
  value?: string;
}) {
  const g = useGlassTokens();
  return (
    <View style={{ paddingHorizontal: 18, paddingVertical: 14, gap: 4 }}>
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
        <Icon source={icon} size={15} color={g.accent} />
        <Text
          style={{
            color: g.accent,
            fontSize: 12,
            fontWeight: '700',
            letterSpacing: 0.6,
            textTransform: 'uppercase',
          }}
        >
          {label}
        </Text>
      </View>
      <Text
        variant="bodyMedium"
        style={{ color: value ? g.textPrimary : g.textSecondary, lineHeight: 21 }}
      >
        {value ?? 'Not recorded'}
      </Text>
    </View>
  );
}

export default function AboutScreen() {
  const insets = useSafeAreaInsets();
  const g = useGlassTokens();

  const [index, setIndex] = useState(0);
  const contributor = useMemo(() => CONTRIBUTORS[index], [index]);
  const goTo = (num: number) =>
    setIndex((index + num + CONTRIBUTORS.length) % CONTRIBUTORS.length);

  return (
    <LiquidBackground>
      <SafeAreaView style={{ flex: 1 }} edges={['top']}>
        <View style={styles.header}>
          <Text
            variant="headlineMedium"
            style={{ color: g.textPrimary, fontWeight: '800', letterSpacing: -0.4 }}
          >
            About
          </Text>
          <Text variant="bodySmall" style={{ color: g.textSecondary, marginTop: 2 }}>
            Informasi pengembang dan versi aplikasi
          </Text>
        </View>

        <ScrollView
          contentContainerStyle={{
            paddingHorizontal: 20,
            paddingTop: 10,
            paddingBottom: insets.bottom + 110,
            gap: 16,
          }}
          showsVerticalScrollIndicator={false}
        >
          {CONTRIBUTORS.length > 1 && (
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
              <TouchableRipple
                onPress={() => goTo(-1)}
                style={[
                  styles.navArrow,
                  { backgroundColor: g.glassBg, borderColor: g.glassBorder },
                ]}
                borderless
              >
                <Icon source="chevron-left" size={22} color={g.textPrimary} />
              </TouchableRipple>

              <View style={{ flex: 1, flexDirection: 'row', gap: 6 }}>
                {CONTRIBUTORS.map((_, i) => {
                  const selected = i === index;
                  return (
                    <TouchableRipple
                      key={i}
                      onPress={() => setIndex(i)}
                      style={{
                        flex: 1,
                        height: 8,
                        borderRadius: 4,
                        backgroundColor: selected ? g.accent : g.innerDivider,
                      }}
                    >
                      <View />
                    </TouchableRipple>
                  );
                })}
              </View>

              <TouchableRipple
                onPress={() => goTo(1)}
                style={[
                  styles.navArrow,
                  { backgroundColor: g.glassBg, borderColor: g.glassBorder },
                ]}
                borderless
              >
                <Icon source="chevron-right" size={22} color={g.textPrimary} />
              </TouchableRipple>
            </View>
          )}

          <GlassCard radius={28} style={styles.profileCard}>
            <View style={styles.avatarRing}>
              {contributor.githubProfileUrl ? (
                <Image
                  source={{ uri: contributor.githubProfileUrl }}
                  style={styles.avatar}
                  resizeMode="cover"
                />
              ) : (
                <View style={[styles.avatar, { backgroundColor: g.accentSoft }]}>
                  <Icon source="account" size={32} color={g.accent} />
                </View>
              )}
            </View>

            <View style={{ flex: 1, gap: 4 }}>
              <View
                style={[
                  styles.roleBadge,
                  { backgroundColor: g.accentSoft, borderColor: g.glassBorder },
                ]}
              >
                <Text style={{ color: g.accent, fontSize: 11, fontWeight: '700' }}>
                  {contributor.role}
                </Text>
              </View>

              <Text
                variant="titleLarge"
                style={{ color: g.textPrimary, fontWeight: '800', letterSpacing: -0.2 }}
              >
                {contributor.name}
              </Text>

              {contributor.githubName && (
                <Text variant="bodySmall" style={{ color: g.textSecondary }}>
                  {contributor.githubName}
                </Text>
              )}
            </View>
          </GlassCard>

          <GlassCard radius={24}>
            <FieldRow icon="hammer-wrench" label="Task & Focus" value={contributor.task} />
            <View style={{ height: 1, backgroundColor: g.innerDivider, marginHorizontal: 18 }} />
            <FieldRow icon="format-quote-close" label="Notes" value={contributor.notes} />
          </GlassCard>

          <GlassCard radius={24}>
            <View style={styles.versionRow}>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
                <View
                  style={[
                    styles.versionIcon,
                    { backgroundColor: g.accentSoft, borderColor: g.glassBorder },
                  ]}
                >
                  <Icon source="cellphone-check" size={20} color={g.accent} />
                </View>
                <View>
                  <Text style={{ color: g.textPrimary, fontWeight: '700', fontSize: 15 }}>
                    E-Ujian Browser
                  </Text>
                  <Text style={{ color: g.textSecondary, fontSize: 12 }}>
                    Liquid Glass Edition
                  </Text>
                </View>
              </View>

              <View
                style={[
                  styles.versionPill,
                  { backgroundColor: g.accentSoft, borderColor: g.glassBorder },
                ]}
              >
                <Text style={{ color: g.accent, fontWeight: '800', fontSize: 13 }}>
                  v{DeviceInfo.getVersion()}
                </Text>
              </View>
            </View>
          </GlassCard>
        </ScrollView>
      </SafeAreaView>
    </LiquidBackground>
  );
}

const styles = StyleSheet.create({
  header: {
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 8,
  },
  navArrow: {
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  profileCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
    gap: 16,
  },
  avatarRing: {
    padding: 3,
    borderRadius: 38,
    borderWidth: 1.5,
    borderColor: 'rgba(34, 211, 238, 0.55)',
  },
  avatar: {
    width: 66,
    height: 66,
    borderRadius: 33,
    alignItems: 'center',
    justifyContent: 'center',
  },
  roleBadge: {
    alignSelf: 'flex-start',
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: 12,
    borderWidth: 1,
  },
  versionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 18,
  },
  versionIcon: {
    width: 42,
    height: 42,
    borderRadius: 14,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  versionPill: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 14,
    borderWidth: 1,
  },
});
