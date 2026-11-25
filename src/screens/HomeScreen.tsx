import React, { useState } from 'react';
import { KeyboardAvoidingView, Platform, StyleSheet, View } from 'react-native';
import { Button, Icon, Text, TextInput, useTheme } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { useMMKVString } from 'react-native-mmkv';
import { storage } from '../services/storage';
import verifyTenantCode from '../services/verifyTenantCode';
import { GlassCard, LiquidBackground, useGlassTokens } from '../components/LiquidGlass';

const styles = StyleSheet.create({
  root: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 20,
    paddingBottom: 88,
    gap: 20,
  },
  badge: {
    alignSelf: 'flex-start',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    borderWidth: 1,
  },
  card: {
    padding: 20,
    gap: 12,
  },
  input: {
    backgroundColor: 'transparent',
    height: 56,
  },
  outline: {
    borderRadius: 16,
    borderWidth: 1,
  },
  supporting: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    minHeight: 22,
  },
  button: {
    borderRadius: 22,
    marginTop: 4,
  },
  buttonContent: {
    height: 54,
  },
  buttonLabel: {
    fontSize: 15,
    fontWeight: '700',
    letterSpacing: 0.3,
  },
  heroCard: {
    padding: 24,
    gap: 16,
  },
  iconCircle: {
    width: 52,
    height: 52,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
  },
});

function EnterCodeTenantScreen() {
  const [tenantCode, setTenantCode] = useState('');
  const [tenantError, setTenantError] = useState('');
  const [tenantCheckingState, setTenantCheckingState] = useState(false);
  const theme = useTheme();
  const g = useGlassTokens();

  async function checkTenantCode() {
    if (!tenantCode.trim()) return;
    setTenantCheckingState(true);
    const result = await verifyTenantCode(tenantCode);

    if (result.success) {
      storage.set('tenant_name', result.tenant_name);
      storage.set('tenant_code', result.tenant_code);
      setTenantError('');
    } else {
      setTenantError(result.message);
    }
    setTenantCheckingState(false);
  }

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      style={styles.root}
    >
      <View style={{ gap: 10 }}>
        <View
          style={[
            styles.badge,
            { backgroundColor: g.accentSoft, borderColor: g.glassBorder },
          ]}
        >
          <Icon source="shield-lock-outline" size={15} color={g.accent} />
          <Text style={{ color: g.accent, fontSize: 12, fontWeight: '700' }}>
            SECURE EXAM PORTAL
          </Text>
        </View>

        <Text
          variant="displaySmall"
          style={{ color: g.textPrimary, fontWeight: '800', letterSpacing: -0.5 }}
        >
          Kode Instansi
        </Text>
        <Text variant="bodyMedium" style={{ color: g.textSecondary, lineHeight: 21 }}>
          Masukkan kode yang diberikan oleh sekolah atau instansi Anda untuk memulai sesi ujian.
        </Text>
      </View>

      <GlassCard style={styles.card} radius={28}>
        <TextInput
          mode="outlined"
          label="Kode sekolah / instansi"
          value={tenantCode}
          onChangeText={(text) => {
            setTenantCode(text);
            setTenantError('');
          }}
          autoCapitalize="none"
          autoCorrect={false}
          returnKeyType="done"
          onSubmitEditing={checkTenantCode}
          error={!!tenantError}
          outlineStyle={[
            styles.outline,
            { borderColor: tenantError ? theme.colors.error : g.glassBorder },
          ]}
          style={styles.input}
          right={
            tenantError ? (
              <TextInput.Icon icon="alert-circle" color={theme.colors.error} />
            ) : tenantCode.length > 0 ? (
              <TextInput.Icon icon="close-circle" onPress={() => setTenantCode('')} />
            ) : undefined
          }
        />

        <View style={{ gap: 4 }}>
          {!!tenantError && (
            <Text variant="bodySmall" style={{ color: theme.colors.error }}>
              {tenantError}
            </Text>
          )}

          <View style={styles.supporting}>
            <Icon source="code-tags" size={16} color={g.textSecondary} />
            <Text variant="bodySmall" style={{ color: g.textSecondary }}>
              Contoh: smkn1-bandung atau 123456
            </Text>
          </View>
        </View>

        <Button
          mode="contained"
          onPress={checkTenantCode}
          disabled={!tenantCode || tenantCheckingState}
          loading={tenantCheckingState}
          buttonColor={g.accent}
          textColor="#04131C"
          contentStyle={styles.buttonContent}
          labelStyle={styles.buttonLabel}
          style={styles.button}
        >
          {tenantCheckingState ? 'Memvalidasi...' : 'Lanjutkan'}
        </Button>
      </GlassCard>
    </KeyboardAvoidingView>
  );
}

function NormalHomeScreen({ tenantName }: { tenantName: string }) {
  const navigation = useNavigation<any>();
  const g = useGlassTokens();

  return (
    <View style={styles.root}>
      <GlassCard style={styles.heroCard} radius={30}>
        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
          <View
            style={[
              styles.iconCircle,
              { backgroundColor: g.accentSoft, borderColor: g.glassBorder },
            ]}
          >
            <Icon source="school-outline" size={26} color={g.accent} />
          </View>

          <View
            style={[
              styles.badge,
              { backgroundColor: g.accentSoft, borderColor: g.glassBorder },
            ]}
          >
            <Icon source="check-decagram" size={14} color={g.accent} />
            <Text style={{ color: g.accent, fontSize: 12, fontWeight: '700' }}>
              TERHUBUNG
            </Text>
          </View>
        </View>

        <View style={{ gap: 6 }}>
          <Text variant="labelLarge" style={{ color: g.textSecondary }}>
            Selamat datang di ruang ujian
          </Text>
          <Text
            variant="headlineMedium"
            style={{ color: g.textPrimary, fontWeight: '800', letterSpacing: -0.3 }}
          >
            {tenantName}
          </Text>
        </View>

        <View
          style={{
            padding: 14,
            borderRadius: 16,
            backgroundColor: g.isDark ? 'rgba(255,255,255,0.04)' : 'rgba(15,23,42,0.04)',
            flexDirection: 'row',
            alignItems: 'center',
            gap: 10,
          }}
        >
          <Icon source="keyboard-outline" size={20} color={g.accent} />
          <Text variant="bodySmall" style={{ flex: 1, color: g.textSecondary, lineHeight: 18 }}>
            Keyboard internal aman aktif. Pastikan koneksi internet stabil sebelum masuk.
          </Text>
        </View>

        <Button
          mode="contained"
          icon="arrow-right"
          onPress={() => navigation.navigate('Browser')}
          buttonColor={g.accent}
          textColor="#04131C"
          contentStyle={[styles.buttonContent, { flexDirection: 'row-reverse' }]}
          labelStyle={styles.buttonLabel}
          style={styles.button}
        >
          Mulai Ujian
        </Button>
      </GlassCard>
    </View>
  );
}

export default function HomeScreen() {
  const [tenantName] = useMMKVString('tenant_name');

  return (
    <LiquidBackground>
      <SafeAreaView style={{ flex: 1 }} edges={['top']}>
        {tenantName ? (
          <NormalHomeScreen tenantName={tenantName} />
        ) : (
          <EnterCodeTenantScreen />
        )}
      </SafeAreaView>
    </LiquidBackground>
  );
}
