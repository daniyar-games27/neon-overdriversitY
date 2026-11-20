from pathlib import Path
import shutil
import sys

ROOT = Path(__file__).resolve().parent

def replace_once(text, old, new, label):
    count = text.count(old)
    if count != 1:
        raise RuntimeError(f"{label}: ожидался 1 фрагмент, найдено {count}. Файлы не будут изменены.")
    return text.replace(old, new, 1)

files = ["sdk.js", "main.js", "index.html"]
missing = [name for name in files if not (ROOT / name).is_file()]
if missing:
    raise SystemExit("Не найдены файлы: " + ", ".join(missing) + "\nРаспакуй архив в корень папки игры.")

backup = ROOT / "_backup_before_yandex_sdk"
backup.mkdir(exist_ok=True)
for name in files:
    target = ROOT / name
    backup_file = backup / name
    if not backup_file.exists():
        shutil.copy2(target, backup_file)

sdk = r"""// Yandex Games SDK integration. Standalone play remains supported.
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
"""

# Validate all source edits before writing any file.
main_path = ROOT / "main.js"
index_path = ROOT / "index.html"
main = main_path.read_text(encoding="utf-8")
index = index_path.read_text(encoding="utf-8")

main_new = replace_once(
    main,
    "import {initPlatformSDK,signalGameReady} from './sdk.js';",
    "import {initPlatformSDK,signalGameReady,gameplayStart,gameplayStop,showFullscreenAd,showRewardedAd} from './sdk.js';",
    "Импорт SDK"
)
main_new = replace_once(
    main_new,
    "getAchievementList,selectCostume} from './progression.js';",
    "getAchievementList,selectCostume,addCoins} from './progression.js';",
    "Импорт addCoins"
)
main_new = replace_once(main_new, "showGameInterface();applySettings();initializeAudio(audio)", "showGameInterface();gameplayStart();applySettings();initializeAudio(audio)", "Старт геймплея")
main_new = replace_once(main_new, "game.state='paused';setControlsEnabled(controls,false);", "game.state='paused';gameplayStop();setControlsEnabled(controls,false);", "Пауза")
main_new = replace_once(main_new, "showGameInterface();resumeAudio(audio)", "showGameInterface();gameplayStart();resumeAudio(audio)", "Возобновление")
main_new = replace_once(main_new, "game.state='results';setControlsEnabled(controls,false);", "game.state='results';gameplayStop();setControlsEnabled(controls,false);", "Конец забега")
main_new = replace_once(
    main_new,
    "if(result.earned?.length)showNotification(`ДОСТИЖЕНИЕ: ${result.earned[0]}`);}",
    "if(result.earned?.length)showNotification(`ДОСТИЖЕНИЕ: ${result.earned[0]}`);showFullscreenAd();}",
    "Полноэкранная реклама после забега"
)
main_new = replace_once(main_new, "function returnMenu(){game.state='menu';setControlsEnabled(controls,false);", "function returnMenu(){game.state='menu';gameplayStop();setControlsEnabled(controls,false);", "Возврат в меню")
main_new = replace_once(
    main_new,
    "bind('play-button',startGame);",
    """bind('rewarded-ad-button',async()=>{const button=document.getElementById('rewarded-ad-button');if(!button||button.disabled)return;button.disabled=true;button.textContent='ЗАГРУЗКА РЕКЛАМЫ…';const rewarded=await showRewardedAd(()=>{addCoins(progress,50);renderProgress();showNotification('+50 NEON CREDITS');});button.disabled=false;button.textContent='РЕКЛАМА: +50 NEON CREDITS';if(!rewarded)showNotification('РЕКЛАМА НЕДОСТУПНА');});
bind('play-button',startGame);""",
    "Кнопка rewarded-рекламы"
)
index_new = replace_once(
    index,
    '        <button id="retry-button" class="primary">ЕЩЁ РАЗ</button>',
    '        <button id="rewarded-ad-button" class="secondary" type="button">РЕКЛАМА: +50 NEON CREDITS</button>\n        <button id="retry-button" class="primary">ЕЩЁ РАЗ</button>',
    "Кнопка на экране результатов"
)

# Apply only after all checks passed.
(ROOT / "sdk.js").write_text(sdk, encoding="utf-8")
main_path.write_text(main_new, encoding="utf-8")
index_path.write_text(index_new, encoding="utf-8")
print("ГОТОВО. Обновлены sdk.js, main.js, index.html.")
print("Резервные копии: _backup_before_yandex_sdk")
print("Теперь проверь локальный запуск, затем отправь 3 изменённых файла в GitHub.")
