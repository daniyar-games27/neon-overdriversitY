<!DOCTYPE html>
<html lang="ru">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no">
  <meta name="theme-color" content="#070b16">
  <title>NEON: OVERDRIVE</title>
  <link rel="stylesheet" href="./style.css">
  <script type="importmap">
    {
      "imports": {
        "three": "https://cdn.jsdelivr.net/npm/three@0.180.0/build/three.module.js"
      }
    }
  </script>
</head>
<body>
  <div id="game-container">
    <canvas id="game-canvas"></canvas>

    <section id="main-menu" class="screen active">
      <div class="brand">NEON<span>:</span> OVERDRIVE</div>
      <p class="tagline">RUN THE CITY. BREAK THE LIMIT.</p>
      <div class="menu-panel">
        <p class="eyebrow">NEXUS CITY // 2097</p>
        <h1>СИСТЕМА<br><span>АКТИВИРОВАНА</span></h1>
        <p class="muted">Ты — ZERO. Город не прощает ошибок.</p>
        <div class="profile-strip">
          <div><small>УРОВЕНЬ</small><strong id="profile-level">1</strong><span id="profile-xp">0 / 500 XP</span></div>
          <div><small>КРЕДИТЫ</small><strong id="profile-coins">0</strong><span>NEON CREDITS</span></div>
          <div><small>РЕКОРД</small><strong id="profile-best">0</strong><span>POINTS</span></div>
        </div>
        <div class="daily-panel"><div class="daily-heading">ЕЖЕДНЕВНЫЕ ПРОТОКОЛЫ <span id="achievement-count">0/5</span></div><div id="daily-list"></div></div>
        <button id="costume-button" class="secondary">ПЕРСОНАЖИ И ОБРАЗЫ</button>
        <button id="progress-button" class="secondary">АРХИВ ДОСТИЖЕНИЙ</button>
        <label class="difficulty-picker">СЛОЖНОСТЬ
          <select id="difficulty-select">
            <option value="easy">НЕОНОВЫЙ ТУРИСТ</option>
            <option value="normal" selected>ГОРОДСКОЙ РЕЖИМ</option>
            <option value="hard">ПЕРЕГРУЗКА</option>
          </select>
        </label>
        <button id="play-button" class="primary">НАЧАТЬ ЗАБЕГ</button>
        <button id="settings-button" class="secondary">НАСТРОЙКИ</button>
      </div>
      <div class="menu-footer">PERSONAL BEST: <span id="menu-best">0</span> M</div>
    </section>

    <section id="pause-menu" class="screen">
      <div class="menu-panel compact">
        <p class="eyebrow">RUN PAUSED</p>
        <h2>ПАУЗА</h2>
        <button id="resume-button" class="primary">ПРОДОЛЖИТЬ</button>
        <button id="restart-button" class="secondary">ЗАНОВО</button>
        <button id="menu-button" class="secondary">ГЛАВНОЕ МЕНЮ</button>
      </div>
    </section>

    <section id="results-screen" class="screen">
      <div class="menu-panel compact">
        <p class="eyebrow">RUN COMPLETE</p>
        <h2>ЗАБЕГ ОКОНЧЕН</h2>
        <div class="result-number"><span id="final-distance">0</span><small>МЕТРОВ</small></div>
        <div class="result-stats"><div>КРИСТАЛЛЫ <strong id="final-crystals">0</strong></div><div>КОМБО <strong id="final-combo">×1</strong></div><div>НАГРАДА <strong id="final-reward">0 CR</strong></div></div>
        <p>СЧЁТ: <strong id="final-score">0</strong></p>
        <button id="retry-button" class="primary">ЕЩЁ РАЗ</button>
        <button id="results-menu-button" class="secondary">В МЕНЮ</button>
      </div>
    </section>

    <section id="settings-menu" class="screen">
      <div class="menu-panel compact">
        <p class="eyebrow">SYSTEM CONFIGURATION</p>
        <h2>НАСТРОЙКИ</h2>
        <label>Качество графики
          <select id="quality-select">
            <option value="low">Низкое</option>
            <option value="medium">Среднее</option>
            <option value="high" selected>Высокое</option>
          </select>
        </label>
        <label>Громкость <input id="volume-slider" type="range" min="0" max="1" step="0.05" value="0.7"></label>
        <button id="settings-back" class="secondary">НАЗАД</button>
      </div>
    </section>

    <div id="game-hud" class="hud hidden">
      <div class="hud-top">
        <div class="hud-chip"><small>DISTANCE</small><strong id="distance">0 m</strong></div>
        <div class="hud-chip"><small>SCORE</small><strong id="score">0</strong></div>
        <div class="hud-chip"><small>ENERGY</small><strong id="energy">100%</strong></div>
        <button id="pause-button" class="pause-btn" aria-label="Пауза">Ⅱ</button>
      </div>
      <div class="speed-box"><span id="speed-display">0</span><small>KM/H</small><div id="run-status" class="run-status">COMBO ×1</div><div id="power-status" class="power-status">NO ACTIVE MODULES</div><div id="difficulty-status" class="run-status">CITY MODE</div></div>
    </div>

    <div id="mobile-controls" class="mobile-controls hidden">
      <div class="steer">
        <button id="left-button" aria-label="Влево">‹</button>
        <button id="right-button" aria-label="Вправо">›</button>
      </div>
      <div class="actions">
        <button id="slide-button">SLIDE</button>
        <button id="jump-button">JUMP</button>
      </div>
    </div>
    <section id="progress-screen" class="screen">
      <div class="menu-panel compact progress-panel">
        <p class="eyebrow">ZERO // PERSONAL ARCHIVE</p>
        <h2>ДОСТИЖЕНИЯ</h2>
        <div id="achievement-list" class="achievement-list"></div>
        <button id="progress-back" class="secondary">НАЗАД</button>
      </div>
    </section>
    <section id="characters-screen" class="screen">
      <div class="menu-panel compact progress-panel">
        <p class="eyebrow">ZERO // IDENTITY SYSTEM</p>
        <h2>ОБРАЗЫ</h2>
        <p class="muted character-note">Выбирай доступный образ. Новые варианты открываются с повышением уровня.</p>
        <div id="costume-list" class="costume-list"></div>
        <button id="characters-back" class="secondary">НАЗАД</button>
      </div>
    </section>
    <div id="notification" class="notification"></div>
  </div>
  <script type="module" src="./main.js"></script>
</body>
</html>
