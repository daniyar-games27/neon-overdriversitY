const isMobileDevice = () =>
  (typeof window !== 'undefined') &&
  (window.matchMedia?.('(pointer: coarse)').matches || window.innerWidth < 760);

export const QUALITY_PRESETS = {
  low: {
    pixelRatio: 0.8,
    shadows: false,
    antialias: false
  },
  medium: {
    pixelRatio: 1,
    shadows: false,
    antialias: false
  },
  high: {
    pixelRatio: Math.min(
      (typeof window !== 'undefined' ? window.devicePixelRatio : 1) || 1,
      isMobileDevice() ? 1.25 : 1.5
    ),
    // Real-time shadow maps are disabled on touch devices to avoid heavy GPU load.
    shadows: !isMobileDevice(),
    antialias: !isMobileDevice()
  }
};

const DEFAULT = {
  quality: 'high',
  soundEnabled: true,
  masterVolume: 0.7,
  effectsEnabled: true,
  particlesEnabled: true,
  bloomEnabled: false,
  cameraShake: true,
  controlSensitivity: 1,
  showFPS: false
};

export function createSettings() {
  const defaults = { ...DEFAULT, quality: isMobileDevice() ? 'medium' : 'high' };
  try {
    return { ...defaults, ...JSON.parse(localStorage.getItem('neon-settings') || '{}') };
  } catch {
    return defaults;
  }
}

function save(s) {
  try { localStorage.setItem('neon-settings', JSON.stringify(s)); } catch {}
}

export function getSettings(s) {
  return { ...s };
}

export function getQualityPreset(s) {
  const preset = QUALITY_PRESETS[s?.quality] || QUALITY_PRESETS.medium;
  // Recalculate high-quality pixel ratio if the browser/device orientation changed.
  if (s?.quality === 'high') {
    return {
      ...preset,
      pixelRatio: Math.min(
        (typeof window !== 'undefined' ? window.devicePixelRatio : 1) || 1,
        isMobileDevice() ? 1.25 : 1.5
      ),
      shadows: !isMobileDevice(),
      antialias: !isMobileDevice()
    };
  }
  return preset;
}

export function setSetting(s, k, v) {
  if (!s || !(k in DEFAULT)) return;
  s[k] = v;
  save(s);
}

export function setQuality(s, q) {
  if (!QUALITY_PRESETS[q]) return;
  s.quality = q;
  save(s);
}

export function setVolume(s, v) {
  setSetting(s, 'masterVolume', Math.max(0, Math.min(1, v)));
}

export function setSensitivity(s, v) {
  setSetting(s, 'controlSensitivity', Math.max(0.3, Math.min(2, v)));
}

export function resetSettings(s) {
  if (!s) return;
  Object.assign(s, { ...DEFAULT, quality: isMobileDevice() ? 'medium' : 'high' });
  save(s);
}

export const isSoundEnabled = s => !!s?.soundEnabled;
export const areEffectsEnabled = s => !!s?.effectsEnabled;
export const areParticlesEnabled = s => !!s?.particlesEnabled;
export const isBloomEnabled = s => !!s?.bloomEnabled;
export const isCameraShakeEnabled = s => !!s?.cameraShake;

export function applyGraphicsSettings(s, renderer) {
  const p = getQualityPreset(s);
  renderer.setPixelRatio(p.pixelRatio);
  renderer.setSize(window.innerWidth, window.innerHeight, false);
  renderer.shadowMap.enabled = p.shadows;
  renderer.shadowMap.type = 1; // THREE.BasicShadowMap; avoids expensive soft-shadow filtering.
  return p;
}

export function getSettingsInfo(s) {
  return getSettings(s);
}
