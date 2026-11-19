import * as THREE from 'three';

const LANES = [-3.8, 0, 3.8];
const SWIPE_THRESHOLD = 18;

export function createControls(player, options = {}) {
  const c = {
    player,
    lane: 1,
    targetX: 0,
    jumpVelocity: 0,
    isJumping: false,
    isSliding: false,
    slideTimer: 0,
    enabled: true,
    keys: {},
    sensitivity: options.sensitivity || 1,
    buttons: [],
    touchStart: null,
    swipeSurface: options.swipeSurface || document.getElementById('game-canvas')
  };

  const keydown = e => {
    if (['ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown', ' '].includes(e.key)) e.preventDefault();
    c.keys[e.key.toLowerCase()] = true;
    if (e.repeat || !c.enabled) return;
    if (e.key === 'ArrowLeft' || e.key.toLowerCase() === 'a') moveLeft(c);
    if (e.key === 'ArrowRight' || e.key.toLowerCase() === 'd') moveRight(c);
    if (e.key === 'ArrowUp' || e.key === ' ' || e.key.toLowerCase() === 'w') jump(c);
    if (e.key === 'ArrowDown' || e.key.toLowerCase() === 's') slide(c);
  };

  const keyup = e => { c.keys[e.key.toLowerCase()] = false; };
  window.addEventListener('keydown', keydown);
  window.addEventListener('keyup', keyup);

  const bind = (id, fn) => {
    const el = document.getElementById(id);
    if (!el) return;
    const h = e => {
      e.preventDefault();
      if (c.enabled) fn(c);
    };
    el.addEventListener('pointerdown', h);
    c.buttons.push(() => el.removeEventListener('pointerdown', h));
  };

  bind('left-button', moveLeft);
  bind('right-button', moveRight);
  bind('jump-button', jump);
  bind('slide-button', slide);

  // Touch gestures are read only from the game canvas, not from menu/HUD buttons.
  const surface = c.swipeSurface;
  const pointerDown = e => {
    if (!c.enabled || e.pointerType === 'mouse') return;
    c.touchStart = { x: e.clientX, y: e.clientY, id: e.pointerId };
    try { surface.setPointerCapture(e.pointerId); } catch {}
  };
  const pointerUp = e => {
    if (!c.enabled || !c.touchStart || c.touchStart.id !== e.pointerId) {
      c.touchStart = null;
      return;
    }
    const dx = e.clientX - c.touchStart.x;
    const dy = e.clientY - c.touchStart.y;
    c.touchStart = null;

    if (Math.max(Math.abs(dx), Math.abs(dy)) < SWIPE_THRESHOLD) return;
    if (Math.abs(dx) > Math.abs(dy) * 1.15) {
      if (dx < 0) moveLeft(c);
      else moveRight(c);
    } else {
      if (dy < 0) jump(c);
      else slide(c);
    }
  };
  const pointerCancel = () => { c.touchStart = null; };

  if (surface) {
    surface.addEventListener('pointerdown', pointerDown, { passive: true });
    surface.addEventListener('pointerup', pointerUp, { passive: true });
    surface.addEventListener('pointercancel', pointerCancel, { passive: true });
    c.buttons.push(() => {
      surface.removeEventListener('pointerdown', pointerDown);
      surface.removeEventListener('pointerup', pointerUp);
      surface.removeEventListener('pointercancel', pointerCancel);
    });
  }

  c.dispose = () => {
    window.removeEventListener('keydown', keydown);
    window.removeEventListener('keyup', keyup);
    c.buttons.forEach(fn => fn());
  };

  return c;
}

export function moveLeft(c) {
  if (c?.enabled) c.lane = Math.max(0, c.lane - 1);
}

export function moveRight(c) {
  if (c?.enabled) c.lane = Math.min(2, c.lane + 1);
}

export function jump(c) {
  if (c?.enabled && !c.isJumping && !c.isSliding) {
    c.isJumping = true;
    c.jumpVelocity = 10;
  }
}

export function slide(c) {
  if (c?.enabled && !c.isJumping) {
    c.isSliding = true;
    c.slideTimer = 0.75;
  }
}

export function updateControls(c, delta) {
  if (!c || !c.enabled) return;
  delta = Math.min(Math.max(delta, 0), 0.05);
  c.targetX = LANES[c.lane];
  c.player.position.x = THREE.MathUtils.damp(c.player.position.x, c.targetX, 19 * c.sensitivity, delta);

  if (c.isJumping) {
    c.player.position.y += c.jumpVelocity * delta;
    c.jumpVelocity -= 25 * delta;
    if (c.player.position.y <= 0) {
      c.player.position.y = 0;
      c.jumpVelocity = 0;
      c.isJumping = false;
    }
  }

  if (c.isSliding) {
    c.slideTimer -= delta;
    if (c.slideTimer <= 0) c.isSliding = false;
  }
}

export function getControlState(c) {
  return c ? {
    lane: c.lane,
    isJumping: c.isJumping,
    isSliding: c.isSliding,
    jumping: c.isJumping,
    sliding: c.isSliding
  } : {};
}

export function setControlsEnabled(c, enabled) {
  if (c) {
    c.enabled = enabled;
    c.touchStart = null;
  }
}

export function resetControls(c) {
  if (!c) return;
  c.lane = 1;
  c.targetX = 0;
  c.player.position.set(0, 0, 0);
  c.jumpVelocity = 0;
  c.isJumping = false;
  c.isSliding = false;
  c.slideTimer = 0;
  c.keys = {};
  c.touchStart = null;
}

export function disposeControls(c) {
  c?.dispose?.();
}
