// Optional Yandex Games SDK bootstrap. The game remains playable outside the platform.
let sdkInstance = null;
let initPromise = null;

export function initPlatformSDK() {
  if (initPromise) return initPromise;
  initPromise = (async () => {
    try {
      if (!window.YaGames?.init) return { available: false };
      sdkInstance = await window.YaGames.init();
      return { available: true, sdk: sdkInstance };
    } catch (error) {
      console.warn('[NEON] Platform SDK initialization failed; continuing standalone.', error);
      sdkInstance = null;
      return { available: false };
    }
  })();
  return initPromise;
}

export async function signalGameReady() {
  try {
    const sdk = sdkInstance || (await initPlatformSDK()).sdk;
    const loading = sdk?.features?.LoadingAPI;
    if (loading?.ready) await loading.ready();
  } catch (error) {
    console.warn('[NEON] Could not signal game readiness.', error);
  }
}

export function getPlatformSDK() { return sdkInstance; }
