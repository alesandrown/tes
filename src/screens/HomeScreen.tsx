import React, { useState } from 'react';
import {
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import {
  Button,
  Dialog,
  Icon,
  Portal,
  Switch,
  Text,
  TextInput,
} from 'react-native-paper';
import { storage } from '../services/storage';

const COLORS = {
  bgMain: '#0D1318',
  bgHeader: '#121E23',
  cardBg: '#161F27',
  iconBoxBg: '#1E2934',
  badgeBg: '#0E2B2A',
  badgeBorder: '#164544',
  teal: '#14B8A6',
  purple: '#A855F7',
  pink: '#F43F5E',
  infoBg: '#0E2324',
  infoBorder: '#153638',
  textPrimary: '#F1F5F9',
  textSecondary: '#94A3B8',
  textMuted: '#64748B',
};

export default function HomeScreen() {
  const navigation = useNavigation<any>();

  const [schoolName, setSchoolName] = useState<string>(
    storage.getString('school_display_name') ?? 'NAMA INSTANSI / SEKOLAH'
  );
  const [tenantCode, setTenantCode] = useState<string>(
    storage.getString('tenant_code') ?? ''
  );
  const [oldLogin, setOldLogin] = useState<boolean>(
    storage.getBoolean('force_old_login') ?? false
  );

  const [editDialogVisible, setEditDialogVisible] = useState(false);
  const [tempSchoolName, setTempSchoolName] = useState(schoolName);
  const [tempTenantCode, setTempTenantCode] = useState(tenantCode);
  const [aboutDialogVisible, setAboutDialogVisible] = useState(false);

  const handleSaveConfig = () => {
    const cleanName = tempSchoolName.trim() || 'NAMA INSTANSI / SEKOLAH';
    const cleanCode = tempTenantCode.trim();

    setSchoolName(cleanName);
    storage.set('school_display_name', cleanName);

    setTenantCode(cleanCode);
    if (cleanCode.length > 0) {
      storage.set('tenant_code', cleanCode);
    } else {
      storage.delete('tenant_code');
    }

    setEditDialogVisible(false);
  };

  const handleStartExam = () => {
    if (!tenantCode) {
      setTempSchoolName(schoolName);
      setTempTenantCode('');
      setEditDialogVisible(true);
      return;
    }
    navigation.navigate('Browser');
  };

  return (
    <SafeAreaView style={styles.root} edges={['top', 'bottom']}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Header Atas */}
        <View style={styles.headerSection}>
          <View style={styles.statusBadge}>
            <View style={styles.statusDot} />
            <Text style={styles.statusText}>SIAP UJIAN</Text>
          </View>

          <Text style={styles.welcomeLabel}>Selamat datang</Text>

          <TouchableOpacity
            activeOpacity={0.75}
            onPress={() => {
              setTempSchoolName(schoolName);
              setTempTenantCode(tenantCode);
              setEditDialogVisible(true);
            }}
          >
            <Text style={styles.institutionTitle}>{schoolName}</Text>
          </TouchableOpacity>
        </View>

        {/* Konten Menu */}
        <View style={styles.menuSection}>
          <Text style={styles.menuSectionLabel}>MENU</Text>

          {/* Kartu 1: Mulai Ujian */}
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={handleStartExam}
            style={[styles.menuCard, { borderColor: COLORS.teal }]}
          >
            <View style={styles.menuIconBox}>
              <Icon source="play" size={24} color={COLORS.teal} />
            </View>
            <View style={styles.menuTextGroup}>
              <Text style={styles.menuTitle}>Mulai Ujian</Text>
              <Text style={styles.menuSubtitle}>
                Masuk ke sesi ujian online
              </Text>
            </View>
            <Icon source="chevron-right" size={20} color={COLORS.textMuted} />
          </TouchableOpacity>

          {/* Kartu 2: Tentang Aplikasi */}
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={() => setAboutDialogVisible(true)}
            style={[styles.menuCard, { borderColor: 'rgba(148, 163, 184, 0.22)' }]}
          >
            <View style={styles.menuIconBox}>
              <View style={styles.circleInfoOutline}>
                <Text style={styles.circleInfoLetter}>i</Text>
              </View>
            </View>
            <View style={styles.menuTextGroup}>
              <Text style={styles.menuTitle}>Tentang Aplikasi</Text>
              <Text style={styles.menuSubtitle}>
                Informasi dan panduan penggunaan
              </Text>
            </View>
            <Icon source="chevron-right" size={20} color={COLORS.textMuted} />
          </TouchableOpacity>

          {/* Kartu 3: Reset Kode */}
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={() => {
              setTempSchoolName(schoolName);
              setTempTenantCode(tenantCode);
              setEditDialogVisible(true);
            }}
            style={[styles.menuCard, { borderColor: COLORS.pink }]}
          >
            <View style={styles.menuIconBox}>
              <Icon source="refresh" size={24} color={COLORS.pink} />
            </View>
            <View style={styles.menuTextGroup}>
              <Text style={styles.menuTitle}>Reset Kode</Text>
              <Text style={styles.menuSubtitle}>
                {tenantCode
                  ? `Ganti ke kode instansi lain (${tenantCode})`
                  : 'Ganti ke kode instansi lain'}
              </Text>
            </View>
            <Icon source="chevron-right" size={20} color={COLORS.textMuted} />
          </TouchableOpacity>

          {/* Kotak Peringatan Kiosk */}
          <View style={styles.infoBanner}>
            <Icon source="shield-half-full" size={22} color={COLORS.teal} />
            <Text style={styles.infoBannerText}>
              Mode kiosk akan aktif saat ujian untuk menjaga integritas
            </Text>
          </View>
        </View>
      </ScrollView>

      {/* Dialog Input Nama Sekolah & Kode Tenant Manual */}
      <Portal>
        <Dialog
          visible={editDialogVisible}
          onDismiss={() => setEditDialogVisible(false)}
          style={styles.dialogBox}
        >
          <Dialog.Title style={{ color: COLORS.textPrimary }}>
            Atur Instansi & Kode
          </Dialog.Title>
          <Dialog.Content style={{ gap: 12 }}>
            <TextInput
              mode="outlined"
              label="Nama Instansi / Sekolah"
              value={tempSchoolName}
              onChangeText={setTempSchoolName}
              textColor={COLORS.textPrimary}
              outlineColor="rgba(148,163,184,0.3)"
              activeOutlineColor={COLORS.teal}
              style={{ backgroundColor: COLORS.bgMain }}
            />
            <TextInput
              mode="outlined"
              label="Kode Instansi (Tenant Code)"
              value={tempTenantCode}
              onChangeText={setTempTenantCode}
              autoCapitalize="none"
              textColor={COLORS.textPrimary}
              outlineColor="rgba(148,163,184,0.3)"
              activeOutlineColor={COLORS.teal}
              style={{ backgroundColor: COLORS.bgMain }}
            />
            <View style={styles.switchRow}>
              <Text style={{ color: COLORS.textSecondary, fontSize: 13.5 }}>
                Gunakan Old Login Screen
              </Text>
              <Switch
                value={oldLogin}
                color={COLORS.teal}
                onValueChange={(val) => {
                  setOldLogin(val);
                  storage.set('force_old_login', val);
                }}
              />
            </View>
          </Dialog.Content>
          <Dialog.Actions>
            <Button
              textColor={COLORS.textSecondary}
              onPress={() => setEditDialogVisible(false)}
            >
              Batal
            </Button>
            <Button textColor={COLORS.teal} onPress={handleSaveConfig}>
              Simpan
            </Button>
          </Dialog.Actions>
        </Dialog>

        <Dialog
          visible={aboutDialogVisible}
          onDismiss={() => setAboutDialogVisible(false)}
          style={styles.dialogBox}
        >
          <Dialog.Title style={{ color: COLORS.textPrimary }}>
            Tentang Aplikasi
          </Dialog.Title>
          <Dialog.Content>
            <Text style={{ color: COLORS.textSecondary, lineHeight: 20 }}>
              Browser klien kustom berbasis React Native dengan keyboard bawaan aplikasi, menu salin/tempel tekan lama, dan mode layar penuh.
            </Text>
          </Dialog.Content>
          <Dialog.Actions>
            <Button
              textColor={COLORS.teal}
              onPress={() => setAboutDialogVisible(false)}
            >
              Tutup
            </Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: COLORS.bgMain,
  },
  scrollContent: {
    flexGrow: 1,
    paddingBottom: 28,
  },
  headerSection: {
    backgroundColor: COLORS.bgHeader,
    paddingHorizontal: 22,
    paddingTop: 22,
    paddingBottom: 32,
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    backgroundColor: COLORS.badgeBg,
    borderWidth: 1,
    borderColor: COLORS.badgeBorder,
    borderRadius: 20,
    paddingHorizontal: 13,
    paddingVertical: 5,
    marginBottom: 20,
    gap: 8,
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: COLORS.teal,
  },
  statusText: {
    color: COLORS.teal,
    fontSize: 11.5,
    fontWeight: '700',
    letterSpacing: 0.9,
  },
  welcomeLabel: {
    color: COLORS.textSecondary,
    fontSize: 14.5,
    marginBottom: 6,
  },
  institutionTitle: {
    color: COLORS.textPrimary,
    fontSize: 25,
    fontWeight: '800',
    lineHeight: 33,
    letterSpacing: 0.3,
  },
  menuSection: {
    paddingHorizontal: 20,
    paddingTop: 24,
    gap: 15,
  },
  menuSectionLabel: {
    color: COLORS.textMuted,
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 1.3,
    marginBottom: 2,
  },
  menuCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.cardBg,
    borderRadius: 18,
    borderWidth: 1.3,
    paddingVertical: 18,
    paddingHorizontal: 18,
    gap: 16,
  },
  menuIconBox: {
    width: 50,
    height: 50,
    borderRadius: 14,
    backgroundColor: COLORS.iconBoxBg,
    alignItems: 'center',
    justifyContent: 'center',
  },
  circleInfoOutline: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 1.8,
    borderColor: COLORS.purple,
    alignItems: 'center',
    justifyContent: 'center',
  },
  circleInfoLetter: {
    color: COLORS.purple,
    fontSize: 13,
    fontWeight: '700',
    lineHeight: 15,
  },
  menuTextGroup: {
    flex: 1,
  },
  menuTitle: {
    color: COLORS.textPrimary,
    fontSize: 16.5,
    fontWeight: '700',
    marginBottom: 3,
  },
  menuSubtitle: {
    color: COLORS.textSecondary,
    fontSize: 12.5,
    lineHeight: 17,
  },
  infoBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.infoBg,
    borderWidth: 1,
    borderColor: COLORS.infoBorder,
    borderRadius: 16,
    paddingVertical: 16,
    paddingHorizontal: 18,
    marginTop: 6,
    gap: 14,
  },
  infoBannerText: {
    flex: 1,
    color: COLORS.textSecondary,
    fontSize: 12.5,
    lineHeight: 18,
  },
  dialogBox: {
    backgroundColor: COLORS.cardBg,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.08)',
  },
  switchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 4,
  },
});
