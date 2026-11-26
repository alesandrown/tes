import { useNavigation } from '@react-navigation/native';
import { BackHandler, StyleSheet, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import WebView, { WebViewNavigation } from 'react-native-webview';
import { storage } from '../services/storage';
import DeviceInfo from 'react-native-device-info';
import { useCallback, useEffect, useRef, useState } from 'react';
import Svg, { Path } from 'react-native-svg';
import { Kiosk } from '../services/kiosk';
import { useMMKVBoolean } from 'react-native-mmkv';
import { Button, Dialog, Portal, Text } from 'react-native-paper';
import SystemNavigationBar from 'react-native-system-navigation-bar';
import Keyboard, { buildInjectedJs, type KeyPressType } from '../components/Keyboard';

const EUjianVersion = "3.1.4";

const ACCENT_CYAN = '#22D3EE';
const BG_PRIMARY = '#0B0F19';
const SURFACE = '#151B2B';
const TEXT_SECONDARY = '#94A3B8';

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: BG_PRIMARY,
  },
  progressContainer: {
    height: 8,
    width: '100%',
  },
  progressGlow: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 8,
    backgroundColor: ACCENT_CYAN,
    opacity: 0.25,
  },
  progressTrack: {
    height: 3,
    width: '100%',
    backgroundColor: 'rgba(255,255,255,0.08)',
    overflow: 'hidden',
  },
  progressFill: {
    height: 3,
    backgroundColor: ACCENT_CYAN,
  },
  webview: {
    flex: 1,
    backgroundColor: BG_PRIMARY,
  },
  statusBar: {
    height: 28,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 10,
    backgroundColor: SURFACE,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: 'rgba(255,255,255,0.08)',
  },
  batteryText: {
    color: TEXT_SECONDARY,
    fontSize: 12,
  },
  refreshButton: {
    paddingHorizontal: 10,
    paddingVertical: 2,
  },
  clockText: {
    color: TEXT_SECONDARY,
    fontSize: 12,
    fontVariant: ['tabular-nums'],
  },
});

function formatClock(date: Date) {
  const hh = String(date.getHours()).padStart(2, '0');
  const mm = String(date.getMinutes()).padStart(2, '0');
  return `${hh}:${mm}`;
}

const BRIDGE_SCRIPT = `
(function () {
  try {
    var NON_TEXT_TYPES = {
      radio: true,
      checkbox: true,
      button: true,
      submit: true,
      reset: true,
      file: true,
      image: true,
      range: true,
      color: true,
      hidden: true
    };

    function isEditable(el) {
      if (!el) return false;
      if (el.isContentEditable) return true;
      var tag = el.tagName;
      if (tag === 'TEXTAREA') return true;
      if (tag === 'INPUT') {
        var type = (el.type || el.getAttribute('type') || 'text').toLowerCase();
        return !NON_TEXT_TYPES[type];
      }
      return false;
    }

    function post(payload) {
      if (window.ReactNativeWebView) {
        window.ReactNativeWebView.postMessage(JSON.stringify(payload));
      }
    }

    if (window.__ejInstalled) return;
    window.__ejInstalled = true;

    window.__ejMode = { inApp: true };

    function applyKeyboardMode(el) {
      if (!isEditable(el)) return;
      if (window.__ejMode.inApp) {
        if (el.getAttribute('inputmode') !== 'none') el.setAttribute('inputmode', 'none');
        if (!el.hasAttribute('readonly')) el.setAttribute('readonly', 'true');
      } else {
        if (el.getAttribute('inputmode') === 'none') el.removeAttribute('inputmode');
        if (el.hasAttribute('readonly')) el.removeAttribute('readonly');
      }
    }

    function applyModeToAll(root) {
      if (!root) return;
      if (isEditable(root)) applyKeyboardMode(root);
      var els = root.querySelectorAll ? root.querySelectorAll('input, textarea, [contenteditable]') : [];
      for (var i = 0; i < els.length; i++) applyKeyboardMode(els[i]);
    }

    window.__ejSetMode = function (inApp) {
      window.__ejMode.inApp = !!inApp;
      applyModeToAll(document.body);
      var active = document.activeElement;
      if (!inApp && isEditable(active)) {
        active.blur();
        active.focus();
      }
    };

    window.__ej = {
      i: function (ch) {
        var el = document.activeElement;
        if (!isEditable(el)) return;

        if (el.isContentEditable) {
          if (ch === '\\b') {
            document.execCommand('delete');
          } else {
            document.execCommand('insertText', false, ch);
          }
          return;
        }

        var start = el.selectionStart == null ? el.value.length : el.selectionStart;
        var end = el.selectionEnd == null ? el.value.length : el.selectionEnd;
        var value = el.value;

        if (ch === '\\b') {
          if (start === end) {
            if (start === 0) return;
            el.value = value.slice(0, start - 1) + value.slice(end);
            start = end = start - 1;
          } else {
            el.value = value.slice(0, start) + value.slice(end);
          }
        } else {
          el.value = value.slice(0, start) + ch + value.slice(end);
          start = end = start + ch.length;
        }

        el.selectionStart = el.selectionEnd = start;
        el.dispatchEvent(new Event('input', { bubbles: true }));
      },

      ok: function () {
        var el = document.activeElement;
        if (!isEditable(el)) return;

        if (el.isContentEditable) {
          document.execCommand('insertLineBreak');
          el.dispatchEvent(new Event('input', { bubbles: true }));
          return;
        }

        var start = el.selectionStart == null ? el.value.length : el.selectionStart;
        var end = el.selectionEnd == null ? el.value.length : el.selectionEnd;
        var value = el.value || '';

        el.value = value.slice(0, start) + '\\n' + value.slice(end);
        el.selectionStart = el.selectionEnd = start + 1;
        el.dispatchEvent(new Event('input', { bubbles: true }));
        el.dispatchEvent(new Event('change', { bubbles: true }));
      },
    };

    document.addEventListener('focusin', function (e) {
      if (!isEditable(e.target)) {
        post({ kind: 'eujian-keyboard', event: 'blur' });
        return;
      }
      applyKeyboardMode(e.target);
      var inputType = e.target.tagName === 'INPUT' ? (e.target.type || 'text') : 'text';
      post({ kind: 'eujian-keyboard', event: 'focus', inputType: inputType });
    }, true);

    document.addEventListener('click', function (e) {
      var target = e.target;
      if (!target) return;
      var radioOrOption = target.closest
        ? target.closest('input[type="radio"], input[type="checkbox"], [role="radio"], [role="checkbox"], label')
        : null;

      if (radioOrOption) {
        var linkedInput = null;
        if (radioOrOption.tagName === 'LABEL') {
          linkedInput = radioOrOption.htmlFor
            ? document.getElementById(radioOrOption.htmlFor)
            : radioOrOption.querySelector('input, textarea');
        } else {
          linkedInput = radioOrOption;
        }

        if (!linkedInput || !isEditable(linkedInput)) {
          if (document.activeElement && isEditable(document.activeElement)) {
            document.activeElement.blur();
          }
          post({ kind: 'eujian-keyboard', event: 'blur' });
        }
      }
    }, true);

    document.addEventListener('focusout', function (e) {
      if (!isEditable(e.target)) return;
      post({ kind: 'eujian-keyboard', event: 'blur' });
    }, true);

    var def = function (p, v) {
      Object.defineProperty(document, p, { get: function () { return v; }, configurable: true });
    };
    def('hidden', false);
    def('visibilityState', 'visible');
    def('webkitHidden', false);
    def('webkitVisibilityState', 'visible');
    document.hasFocus = function () { return true; };

    var block = function (e) { e.stopImmediatePropagation(); };
    document.addEventListener('visibilitychange', block, true);
    window.addEventListener('visibilitychange', block, true);
    window.addEventListener('pagehide', block, true);
    window.addEventListener('blur', function (e) {
      if (e.target === window) e.stopImmediatePropagation();
    }, true);

    new MutationObserver(function (mutations) {
      for (var i = 0; i < mutations.length; i++) {
        var added = mutations[i].addedNodes;
        for (var j = 0; j < added.length; j++) {
          if (added[j].nodeType === 1) applyModeToAll(added[j]);
        }
      }
    }).observe(document.documentElement, { childList: true, subtree: true });

    function onReady() {
      applyModeToAll(document.body);
    }
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', onReady);
    } else {
      onReady();
    }
  } catch (err) {
    if (window.ReactNativeWebView) {
      window.ReactNativeWebView.postMessage(JSON.stringify({ kind: 'bridge-error', msg: String(err) }));
    }
  }
})();
true;
`;

export default function BrowserScreen() {
  const isNumeric = (s: string) => /^\d+$/.test(s);

  const webviewRef = useRef<any>(null);

  const [progress, setProgress] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [batteryLevel, setBatteryLevel] = useState(-1);
  const [clock, setClock] = useState(formatClock(new Date()));
  const [forceOldLogin] = useMMKVBoolean("force_old_login");
  const [warningExitDialog, setWarningExitDialog] = useState(false);
  const [lastWarningExitDialog, setLastWarningExitDialog] = useState(false);

  const [hidden, setHidden] = useState(false);

  const [keyboardVisible, setKeyboardVisible] = useState(false);
  const [inputType, setInputType] = useState<"text" | "number">('text');

  const [useKnockoffKeyboard, setUseKnockoffKeyboard] = useState(true);

  useEffect(() => {
    if (hidden) {
      SystemNavigationBar.setImmersive("sticky");
    } else {
      SystemNavigationBar.show();
    }
  }, [hidden]);

  const handleRefresh = useCallback(() => {
    webviewRef.current?.reload();
  }, []);

  const handleLock = useCallback(async () => {
    if (!(await Kiosk.isEnabled())) {
      await Kiosk.enable();
      setHidden(true);
    } else if (await Kiosk.isEnabled()) {
      await Kiosk.disable();
      setHidden(false);
    }
  }, []);

  useEffect(() => {
    const id = setInterval(() => setClock(formatClock(new Date())), 1000);
    return () => clearInterval(id);
  }, []);

  useEffect(() => {
    const updateBattery = async () => {
      const level = await DeviceInfo.getBatteryLevel();
      setBatteryLevel(level);
    };

    updateBattery();
    const interval = setInterval(updateBattery, 30000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      () => {
        if (keyboardVisible) {
          setKeyboardVisible(false);
          return true;
        }
        if (hidden) {
          return true;
        }

        setWarningExitDialog(true);
        return true;
      }
    );

    return () => backHandler.remove();
  }, [hidden, keyboardVisible]);

  const tenantCode = storage.getString('tenant_code');
  const navigation = useNavigation();

  if (tenantCode === undefined) {
    return (
      <SafeAreaView style={{ flex: 1 }} edges={['top', 'bottom']}>
        <Text>
          something went wrong.
        </Text>
      </SafeAreaView>
    );
  }

  const uri = forceOldLogin
    ? `https://e-ujian.com/${tenantCode}/gologin`
    : isNumeric(tenantCode)
      ? `https://e-ujian.com/${tenantCode}/gologin`
      : `https://app.e-ujian.com/${tenantCode}/login`;

  const ua = DeviceInfo.getUserAgentSync();

  const batteryText =
    batteryLevel === -1 ? '🔋 --%' : `🔋 ${Math.round(batteryLevel * 100)}%`;

  const handleNavChange = async (navState: WebViewNavigation) => {
    if (navState.url.includes('seb-quit-confirmed')) {
      navigation.goBack();

      if (await Kiosk.isEnabled()) {
        await Kiosk.disable();
        setHidden(false);
        SystemNavigationBar.show();
      }
    }
  };

  const handleMessage = useCallback((event: any) => {
    let msg;
    try {
      msg = JSON.parse(event.nativeEvent.data);
    } catch (e) {
      return;
    }
    if (msg.kind !== 'eujian-keyboard') return;

    if (msg.event === 'focus') {
      setInputType(msg.inputType === 'number' ? 'number' : 'text');
      setKeyboardVisible(true);
    } else if (msg.event === 'blur') {
      setKeyboardVisible(false);
    }
  }, []);

  useEffect(() => {
    webviewRef.current?.injectJavaScript(`__ejSetMode(${useKnockoffKeyboard}); true;`);
  }, [useKnockoffKeyboard]);

  const handleLoadStart = useCallback(() => {
    setIsLoading(true);
  }, []);

  const handleLoadEnd = useCallback(() => {
    setIsLoading(false);
    webviewRef.current?.injectJavaScript(`__ejSetMode(${useKnockoffKeyboard}); true;`);
  }, [useKnockoffKeyboard]);

  const handleKeyPress = useCallback(({ output, type }: { output: string; type: KeyPressType }) => {
    let js;
    if (type === 'ok') {
      js = `__ej.ok(); true;`;
    } else {
      js = buildInjectedJs(output, type);
    }
    webviewRef.current?.injectJavaScript(js);
  }, []);

  return (
    <SafeAreaView style={[styles.root, { flex: 1 }]} edges={['top', 'bottom']}>
      <View style={styles.progressContainer}>
        {isLoading && <View style={styles.progressGlow} />}
        {isLoading && (
          <View style={styles.progressTrack}>
            <View
              style={[
                styles.progressFill,
                { width: `${Math.max(progress * 100, 4)}%` },
              ]}
            />
          </View>
        )}
      </View>

      <WebView
        ref={webviewRef}
        source={{ uri: uri }}
        style={styles.webview}
        onLoadStart={handleLoadStart}
        onLoadEnd={handleLoadEnd}
        onLoadProgress={({ nativeEvent }) => setProgress(nativeEvent.progress)}
        userAgent={ua + ` EujianBrowser/${EUjianVersion}`}
        onNavigationStateChange={handleNavChange}
        injectedJavaScriptBeforeContentLoaded={BRIDGE_SCRIPT}
        onMessage={handleMessage}
      />

      <View style={styles.statusBar}>
        <TouchableOpacity onPress={handleLock} style={{ paddingVertical: 4 }}>
          <Text style={styles.batteryText} numberOfLines={1}>
            {batteryText}
          </Text>
        </TouchableOpacity>

        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <TouchableOpacity onPress={handleRefresh} style={styles.refreshButton}>
            <Svg width={24} height={24} viewBox="0 0 24 24">
              <Path
                fill={"#6B7280"}
                d="M17.65,6.35C16.2,4.9 14.21,4 12,4c-4.42,0 -7.99,3.58 -7.99,8s3.57,8 7.99,8c3.73,0 6.84,-2.55 7.73,-6h-2.08c-0.82,2.33 -3.04,4 -5.65,4 -3.31,0 -6,-2.69 -6,-6s2.69,-6 6,-6c1.66,0 3.14,0.69 4.22,1.78L13,11h7V4l-2.35,2.35z"
              />
            </Svg>
          </TouchableOpacity>

          <TouchableOpacity onPress={() => setUseKnockoffKeyboard(prev => !prev)}>
            <Text style={styles.clockText}>{clock}</Text>
          </TouchableOpacity>
        </View>
      </View>

      {keyboardVisible && useKnockoffKeyboard && (
        <Keyboard
          inputType={inputType}
          onKeyPress={handleKeyPress}
        />
      )}

      <Portal>
        <Dialog visible={warningExitDialog} onDismiss={() => setWarningExitDialog(false)}>
          <Dialog.Icon icon="alert" />
          <Dialog.Title style={{ textAlign: 'center' }}>Exit?</Dialog.Title>
          <Dialog.Content>
            <Text variant="bodyMedium">
              You pressed the back button. Are you sure want to exit?
            </Text>
          </Dialog.Content>
          <Dialog.Actions>
            <Button
              onPress={() => {
                setWarningExitDialog(false);
                setLastWarningExitDialog(true);
              }}
            >
              Exit
            </Button>
            <Button mode='contained' onPress={() => setWarningExitDialog(false)}>Cancel</Button>
          </Dialog.Actions>
        </Dialog>

        <Dialog visible={lastWarningExitDialog} onDismiss={() => setLastWarningExitDialog(false)}>
          <Dialog.Icon icon="alert" />
          <Dialog.Title style={{ textAlign: 'center' }}>LAST WARNING</Dialog.Title>
          <Dialog.Content>
            <Text variant="bodyMedium">
              Are you REALLY sure want to exit?
            </Text>
          </Dialog.Content>
          <Dialog.Actions>
            <View
              style={{ flex: 1, flexDirection: "row", justifyContent: "space-between" }}
            
