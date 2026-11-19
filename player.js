import * as THREE from 'three';

// Shared materials keep the highly detailed ZERO model inexpensive to render.
const MAT = {
  undersuit: new THREE.MeshStandardMaterial({ color: 0x080f1c, metalness: .35, roughness: .62 }),
  armor: new THREE.MeshStandardMaterial({ color: 0x26364c, metalness: .82, roughness: .24 }),
  armorLight: new THREE.MeshStandardMaterial({ color: 0x52677f, metalness: .88, roughness: .2 }),
  accent: new THREE.MeshStandardMaterial({ color: 0x00eaff, emissive: 0x00aabb, emissiveIntensity: 1.8, metalness: .25, roughness: .28 }),
  accentSoft: new THREE.MeshStandardMaterial({ color: 0x00a9c4, emissive: 0x006b82, emissiveIntensity: 1.1 }),
  visor: new THREE.MeshStandardMaterial({ color: 0x03101c, emissive: 0x007caa, emissiveIntensity: 1.45, metalness: .9, roughness: .12 }),
  rubber: new THREE.MeshStandardMaterial({ color: 0x02060c, roughness: .88 }),
  glass: new THREE.MeshStandardMaterial({ color: 0x9beeff, emissive: 0x1689aa, emissiveIntensity: .65, metalness: .45, roughness: .12 })
};

function part(parent, geometry, material, position, name, rotation) {
  const mesh = new THREE.Mesh(geometry, material);
  mesh.position.set(...position);
  if (rotation) mesh.rotation.set(...rotation);
  mesh.castShadow = true;
  mesh.receiveShadow = true;
  if (name) mesh.name = name;
  parent.add(mesh);
  return mesh;
}
function box(parent, size, material, pos, name, rot) {
  return part(parent, new THREE.BoxGeometry(...size), material, pos, name, rot);
}
function sphere(parent, radius, material, pos, scale = [1, 1, 1], name) {
  const m = part(parent, new THREE.SphereGeometry(radius, 16, 12), material, pos, name);
  m.scale.set(...scale);
  return m;
}
function cylinder(parent, rt, rb, h, material, pos, rot = [0, 0, 0], name) {
  return part(parent, new THREE.CylinderGeometry(rt, rb, h, 10), material, pos, name, rot);
}

export function createPlayer(scene) {
  const root = new THREE.Group();
  root.name = 'ZERO';
  const p = {};
  p.body = new THREE.Group();
  root.add(p.body);

  // Torso: layered chest plate, abdominal segments and luminous reactor.
  box(p.body, [.72, .78, .36], MAT.undersuit, [0, 1.48, 0], 'torso-core');
  box(p.body, [.82, .48, .43], MAT.armor, [0, 1.72, .015], 'chest-plate');
  box(p.body, [.64, .13, .455], MAT.armorLight, [0, 1.91, .018], 'upper-chest-ridge');
  box(p.body, [.25, .28, .035], MAT.undersuit, [0, 1.54, .235], 'reactor-frame');
  sphere(p.body, .105, MAT.accent, [0, 1.55, .27], [1, 1, .42], 'chest-reactor');
  for (const s of [-1, 1]) {
    box(p.body, [.13, .34, .045], MAT.accentSoft, [s * .29, 1.69, .247], 'chest-light');
    box(p.body, [.27, .12, .39], MAT.armorLight, [s * .22, 1.28, .005], 'abdominal-armor');
    box(p.body, [.22, .055, .4], MAT.armor, [s * .22, 1.17, .005], 'lower-ab-plate');
  }
  // Back-mounted compact energy pack and exhausts.
  box(p.body, [.48, .58, .22], MAT.undersuit, [0, 1.57, -.29], 'backpack-core');
  box(p.body, [.58, .36, .16], MAT.armor, [0, 1.66, -.43], 'backpack-shell');
  for (const s of [-1, 1]) {
    cylinder(p.body, .075, .095, .28, MAT.accentSoft, [s * .2, 1.39, -.43], [Math.PI / 2, 0, 0], 'thruster');
    box(p.body, [.07, .28, .055], MAT.accent, [s * .24, 1.65, -.525], 'pack-light');
  }

  // Helmet with jaw guard, crown plates, side comms and a wide luminous visor.
  p.head = new THREE.Group();
  p.head.position.y = 2.27;
  p.body.add(p.head);
  sphere(p.head, .29, MAT.undersuit, [0, 0, 0], [1, 1.08, .94], 'helmet-shell');
  sphere(p.head, .305, MAT.armor, [0, .045, -.015], [1, .94, .88], 'helmet-outer-shell');
  box(p.head, [.49, .16, .105], MAT.visor, [0, .015, .258], 'panoramic-visor');
  box(p.head, [.39, .025, .018], MAT.accent, [0, .095, .315], 'visor-top-glow');
  box(p.head, [.37, .07, .035], MAT.armor, [0, -.105, .265], 'jaw-guard');
  box(p.head, [.16, .045, .025], MAT.accentSoft, [0, -.115, .29], 'jaw-light');
  box(p.head, [.24, .075, .035], MAT.armorLight, [0, .245, .13], 'helmet-crown');
  for (const s of [-1, 1]) {
    box(p.head, [.095, .19, .22], MAT.armorLight, [s * .29, -.005, -.005], 'helmet-ear');
    sphere(p.head, .055, MAT.accent, [s * .335, .015, .06], [1, 1, .65], 'comms-light');
    box(p.head, [.055, .13, .025], MAT.accentSoft, [s * .19, .19, .21], 'crown-stripe');
  }

  // Shoulder assemblies and articulated arms.
  p.leftArm = new THREE.Group(); p.leftArm.position.set(-.51, 1.79, 0); p.body.add(p.leftArm);
  p.rightArm = new THREE.Group(); p.rightArm.position.set(.51, 1.79, 0); p.body.add(p.rightArm);
  for (const [arm, s] of [[p.leftArm, -1], [p.rightArm, 1]]) {
    sphere(arm, .19, MAT.armor, [0, -.02, 0], [1.12, .9, 1], 'shoulder-joint');
    box(arm, [.34, .22, .34], MAT.armorLight, [s * .015, -.015, .015], 'shoulder-cap');
    box(arm, [.27, .055, .29], MAT.accentSoft, [s * .015, -.11, .03], 'shoulder-stripe');
    box(arm, [.22, .39, .25], MAT.undersuit, [0, -.32, 0], 'upper-arm');
    box(arm, [.25, .22, .29], MAT.armor, [0, -.29, .02], 'bicep-plate');
    sphere(arm, .105, MAT.armorLight, [0, -.55, .015], [1, .8, 1], 'elbow-joint');
    box(arm, [.25, .34, .28], MAT.armor, [0, -.72, .005], 'forearm-gauntlet');
    box(arm, [.27, .1, .3], MAT.armorLight, [0, -.63, .02], 'forearm-ridge');
    box(arm, [.055, .22, .025], MAT.accent, [s * .075, -.74, .15], 'forearm-light');
    box(arm, [.2, .16, .22], MAT.rubber, [0, -.96, .025], 'glove');
    box(arm, [.22, .055, .23], MAT.armorLight, [0, -.91, .035], 'glove-knuckle');
  }

  // Waist, belt modules and segmented leg armor.
  box(p.body, [.58, .2, .35], MAT.undersuit, [0, 1.02, 0], 'waist');
  box(p.body, [.68, .13, .4], MAT.armor, [0, 1.06, .025], 'utility-belt');
  box(p.body, [.17, .13, .045], MAT.accent, [0, 1.06, .24], 'belt-buckle');
  for (const s of [-1, 1]) {
    box(p.body, [.14, .2, .2], MAT.armorLight, [s * .34, 1.04, 0], 'belt-pouch');
  }
  p.leftLeg = new THREE.Group(); p.leftLeg.position.set(-.22, .91, 0); p.body.add(p.leftLeg);
  p.rightLeg = new THREE.Group(); p.rightLeg.position.set(.22, .91, 0); p.body.add(p.rightLeg);
  for (const [leg, s] of [[p.leftLeg, -1], [p.rightLeg, 1]]) {
    box(leg, [.3, .33, .31], MAT.undersuit, [0, -.14, 0], 'thigh-core');
    box(leg, [.34, .31, .34], MAT.armor, [0, -.17, .035], 'thigh-plate');
    box(leg, [.24, .07, .035], MAT.accentSoft, [0, -.08, .215], 'thigh-light');
    sphere(leg, .14, MAT.armorLight, [0, -.37, .025], [1, .75, 1], 'knee-joint');
    box(leg, [.34, .18, .34], MAT.armorLight, [0, -.4, .055], 'knee-guard');
    box(leg, [.27, .34, .29], MAT.armor, [0, -.62, .015], 'shin-guard');
    box(leg, [.055, .24, .025], MAT.accent, [s * .09, -.61, .17], 'shin-light');
    box(leg, [.34, .16, .48], MAT.undersuit, [0, -.84, .065], 'boot-base');
    box(leg, [.36, .13, .5], MAT.armor, [0, -.86, .09], 'boot-shell');
    box(leg, [.3, .045, .035], MAT.accentSoft, [0, -.79, .32], 'boot-glow');
    box(leg, [.37, .055, .49], MAT.rubber, [0, -.94, .09], 'boot-sole');
  }

  root.position.set(0, 0, 0);
  root.userData.animationParts = p;
  root.userData.accentMaterials = [MAT.accent, MAT.accentSoft];
  scene.add(root);
  return root;
}

export function updatePlayerAnimation(player, delta, state = 'run', speed = 1) {
  if (!player?.userData.animationParts) return;
  const p = player.userData.animationParts;
  player.userData.animTime = (player.userData.animTime || 0) + delta * speed * 8;
  const t = player.userData.animTime;
  if (state === 'slide') {
    p.body.rotation.x = .55; p.body.position.y = -.35;
    p.leftLeg.rotation.x = -.8; p.rightLeg.rotation.x = -.8;
    p.leftArm.rotation.x = .5; p.rightArm.rotation.x = .5;
  } else if (state === 'jump') {
    p.body.rotation.x = -.08; p.body.position.y = .12;
    p.leftLeg.rotation.x = -.45; p.rightLeg.rotation.x = .35;
    p.leftArm.rotation.x = -.7; p.rightArm.rotation.x = -.7;
  } else {
    p.body.rotation.x = 0; p.body.position.y = Math.abs(Math.sin(t * 2)) * .035;
    p.leftLeg.rotation.x = Math.sin(t) * .75; p.rightLeg.rotation.x = -Math.sin(t) * .75;
    p.leftArm.rotation.x = -Math.sin(t) * .55; p.rightArm.rotation.x = Math.sin(t) * .55;
  }
  p.head.rotation.y = Math.sin(t * .5) * .035;
}

export function setPlayerColor(player, color) {
  if (!player || !player.userData.accentMaterials) return;
  for (const material of player.userData.accentMaterials) {
    material.color.set(color);
    material.emissive.set(color);
  }
}
export function removePlayer(player, scene) { if (player && scene) scene.remove(player); }
