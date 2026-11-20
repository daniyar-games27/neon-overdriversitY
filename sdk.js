// Yandex Games SDK integration. Standalone play remains supported.
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
      initPromise = null;
      return { available: false };
    }
  })();
  return initPromise;
}

export async function signalGameReady() {
  try {
    const result = await initPlatformSDK();
    result.sdk?.features?.LoadingAPI?.ready?.();
  } catch (error) {
    console.warn('[NEON] Could not signal game readiness.', error);
  }
}

export function getPlatformSDK() {
  return sdkInstance;
}

export function gameplayStart() {
  try { sdkInstance?.features?.GameplayAPI?.start?.(); }
  catch (error) { console.warn('[NEON] Gameplay start signal failed.', error); }
}

export function gameplayStop() {
  try { sdkInstance?.features?.GameplayAPI?.stop?.(); }
  catch (error) { console.warn('[NEON] Gameplay stop signal failed.', error); }
}

export async function showFullscreenAd() {
  const sdk = sdkInstance || (await initPlatformSDK()).sdk;
  if (!sdk?.adv?.showFullscreenAdv) return false;
  return new Promise(resolve => {
    let settled = false;
    const finish = shown => {
      if (settled) return;
      settled = true;
      resolve(!!shown);
    };
    try {
      sdk.adv.showFullscreenAdv({
        callbacks: {
          onClose: wasShown => finish(wasShown),
          onError: error => {
            console.warn('[NEON] Fullscreen ad failed.', error);
            finish(false);
          }
        }
      });
    } catch (error) {
      console.warn('[NEON] Fullscreen ad could not be shown.', error);
      finish(false);
    }
  });
}

export async function showRewardedAd(onRewarded) {
  const sdk = sdkInstance || (await initPlatformSDK()).sdk;
  if (!sdk?.adv?.showRewardedVideo) return false;
  return new Promise(resolve => {
    let rewarded = false;
    let settled = false;
    const finish = () => {
      if (settled) return;
      settled = true;
      resolve(rewarded);
    };
    try {
      sdk.adv.showRewardedVideo({
        callbacks: {
          onOpen: gameplayStop,
          onRewarded: () => {
            if (rewarded) return;
            rewarded = true;
            try { onRewarded?.(); }
            catch (error) { console.warn('[NEON] Reward callback failed.', error); }
          },
          onClose: finish,
          onError: error => {
            console.warn('[NEON] Rewarded ad failed.', error);
            finish();
          }
        }
      });
    } catch (error) {
      console.warn('[NEON] Rewarded ad could not be shown.', error);
      finish();
    }
  });
}
