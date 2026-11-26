import React, { useState } from 'react';
import { Alert, ScrollView, StyleSheet, View } from 'react-native';
import {
  Button,
  Dialog,
  Divider,
  Icon,
  List,
  Portal,
  Switch,
  Text,
  TextInput,
} from 'react-native-paper';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { MMKV } from 'react-native-mmkv';
import { GlassCard, LiquidBackground, useGlassTokens } from '../components/LiquidGlass';

const storage = new MMKV();

export default function SettingsScreen() {
  const insets = useSafeAreaInsets();
  const g = useGlassTokens();

  const [systemTheme, setSystemTheme] = useState<boolean>(
    storage.getBoolean('useSystemTheme') ?? true
  );
  const [darkMode, setDarkMode] = useState<boolean>(
    storage.getBoolean('isDarkMode') ?? false
  );
  const [oldLogin, setOldLogin] = useState<boolean>(
    storage.getBoolean('useOldLogin') ?? false
  );
  const [tenantCode, setTenantCode] = useState<string>(
    storage.getString('tenantCode') ?? ''
  );
  const [tenantDialogVisible, setTenantDialogVisible] = useState(false);
  const [tempTenantCode, setTempTenantCode] = useState(tenantCode);

  const toggleSystemTheme = (val: boolean) => {
    setSystemTheme(val);
    storage.set('useSystemTheme', val);
  };

  const toggleDarkMode = (val: boolean) => {
    setDarkMode(val);
    storage.set('isDarkMode', val);
  };

  const toggleOldLogin = (val: boolean) => {
    setOldLogin(val);
    storage.set('useOldLogin', val);
  };

  const saveTenantCode = () => {
    const cleaned = tempTenantCode.trim();
    setTenantCode(cleaned);
    storage.set('tenantCode', cleaned);
    setTenantDialogVisible(false);
  };

  return (
    <LiquidBackground>
      <ScrollView
        contentContainerStyle={[
          styles.scrollContent,
          {
            paddingTop: insets.top + 18,
            paddingBottom: insets.bottom + 115,
          },
        ]}
        showsVerticalScrollIndicator={false}
      >
        {/* Header transparan dengan badge kecil agar logo ITB di background tetap terlihat */}
        <GlassCard radius={20} style={styles.headerCard}>
          <View style={styles.headerRow}>
            <View style={[styles.headerBadge, { backgroundColor: g.accentSoft }]}>
              <Icon source="cog" size={22} color={g.accent} />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={[styles.headerTitle, { color: g.textPrimary }]}>
                Settings
              </Text>
              <Text style={[styles.headerSubtitle, { color: g.textSecondary }]}>
                Preferensi tampilan dan konfigurasi ruang ujian
              </Text>
            </View>
          </View>
        </GlassCard>

        {/* Ruang pandang tengah agar logo ITB di wallpaper terlihat utuh */}
        <View style={styles.logoShowcaseSpacer} />

        {/* Grup 1: General */}
        <GlassCard radius={24} style={styles.sectionCard}>
          <Text style={[styles.sectionLabel, { color: g.accent }]}>
            GENERAL
          </Text>
          <List.Item
            title="System Dark Mode"
            description="Ikuti tema sistem perangkat"
            titleStyle={{ color: g.textPrimary, fontWeight: '600' }}
            descriptionStyle={{ color: g.textSecondary, fontSize: 12 }}
            left={(props) => (
              <List.Icon {...props} icon="theme-light-dark" color={g.accent} />
            )}
            right={() => (
              <Switch
                value={systemTheme}
                onValueChange={toggleSystemTheme}
                color={g.accent}
              />
            )}
          />
          <Divider style={{ backgroundColor: g.innerDivider }} />
          <List.Item
            title="Dark Mode"
            description="Aktifkan mode kaca gelap"
            titleStyle={{
              color: systemTheme ? g.textSecondary : g.textPrimary,
              fontWeight: '600',
            }}
            descriptionStyle={{ color: g.textSecondary, fontSize: 12 }}
            disabled={systemTheme}
            left={(props) => (
              <List.Icon
                {...props}
                icon="weather-night"
                color={systemTheme ? g.textSecondary : g.accent}
              />
            )}
            right={() => (
              <Switch
                value={darkMode}
                onValueChange={toggleDarkMode}
                disabled={systemTheme}
                color={g.accent}
              />
            )}
          />
        </GlassCard>

        {/* Grup 2: Ujian Settings */}
        <GlassCard radius={24} style={styles.sectionCard}>
          <Text style={[styles.sectionLabel, { color: g.accent }]}>
            UJIAN SETTINGS
          </Text>
          <List.Item
            title="Tenant Code"
            description={tenantCode ? `Aktif: ${tenantCode}` : 'Belum diatur'}
            titleStyle={{ color: g.textPrimary, fontWeight: '600' }}
            descriptionStyle={{ color: g.textSecondary, fontSize: 12 }}
            left={(props) => (
              <List.Icon {...props} icon="domain" color={g.accent} />
            )}
            right={(props) => (
              <List.Icon {...props} icon="chevron-right" color={g.textSecondary} />
            )}
            onPress={() => {
              setTempTenantCode(tenantCode);
              setTenantDialogVisible(true);
            }}
          />
          <Divider style={{ backgroundColor: g.innerDivider }} />
          <List.Item
            title="Old Login Screen"
            description="Gunakan halaman masuk versi klasik"
            titleStyle={{ color: g.textPrimary, fontWeight: '600' }}
            descriptionStyle={{ color: g.textSecondary, fontSize: 12 }}
            left={(props) => (
              <List.Icon {...props} icon="login-variant" color={g.accent} />
            )}
            right={() => (
              <Switch
                value={oldLogin}
                onValueChange={toggleOldLogin}
                color={g.accent}
              />
            )}
          />
        </GlassCard>

        {/* Grup 3: Application */}
        <GlassCard radius={24} style={styles.sectionCard}>
          <Text style={[styles.sectionLabel, { color: g.accent }]}>
            APPLICATION
          </Text>
          <List.Item
            title="Check for Updates"
            description="Periksa pembaruan versi aplikasi"
            titleStyle={{ color: g.textPrimary, fontWeight: '600' }}
            descriptionStyle={{ color: g.textSecondary, fontSize: 12 }}
            left={(props) => (
              <List.Icon {...props} icon="update" color={g.accent} />
            )}
            right={(props) => (
              <List.Icon {...props} icon="chevron-right" color={g.textSecondary} />
            )}
            onPress={() =>
              Alert.alert('Info Versi', 'Aplikasi sudah menggunakan versi terbaru.')
            }
          />
        </GlassCard>
      </ScrollView>

      <Portal>
        <Dialog
          visible={tenantDialogVisible}
          onDismiss={() => setTenantDialogVisible(false)}
          style={{
            backgroundColor: g.glassBgStrong,
            borderRadius: 24,
            borderWidth: 1,
            borderColor: g.glassBorder,
          }}
        >
          <Dialog.Title style={{ color: g.textPrimary }}>
            Tenant Code
          </Dialog.Title>
          <Dialog.Content>
            <TextInput
              mode="outlined"
              label="Kode Instansi / Sekolah"
              value={tempTenantCode}
              onChangeText={setTempTenantCode}
              autoCapitalize="none"
            />
          </Dialog.Content>
          <Dialog.Actions>
            <Button
              textColor={g.textSecondary}
              onPress={() => setTenantDialogVisible(false)}
            >
              Batal
            </Button>
            <Button textColor={g.accent} onPress={saveTenantCode}>
              Simpan
            </Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>
    </LiquidBackground>
  );
}

const styles = StyleSheet.create({
  scrollContent: {
    paddingHorizontal: 18,
  },
  headerCard: {
    padding: 16,
    marginBottom: 12,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
  },
  headerBadge: {
    width: 44,
    height: 44,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: '800',
    letterSpacing: -0.3,
  },
  headerSubtitle: {
    fontSize: 12.5,
    marginTop: 2,
  },
  logoShowcaseSpacer: {
    height: 150,
  },
  sectionCard: {
    paddingTop: 14,
    paddingBottom: 6,
    paddingHorizontal: 6,
    marginBottom: 14,
  },
  sectionLabel: {
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 1.1,
    marginLeft: 16,
    marginBottom: 4,
  },
});
