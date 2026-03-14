/* ===================================================
   RISHI ABINANDHAN — 3D Interactive Desk Portfolio
   Three.js + GSAP
   =================================================== */

'use strict';

// ─── DATA ────────────────────────────────────────────
const PROJECTS = [
  {
    title: 'Customer Churn Prediction',
    desc: 'Telecom customer churn model under Project KAVIGAL using Random Forest. Improved project accuracy and usability.',
    tech: ['Python', 'Random Forest', 'Streamlit','Pandas'],
    github: 'https://github.com/rishi-abinandhan',
    demo: '#'
  },
  {
    title: 'Car Price Prediction',
    desc: 'ML system to estimate vehicle prices based on brand, model, mileage, fuel type. Compared multiple ML algorithms.',
    tech: ['Python', 'ML', 'ipywidgets', 'Pandas'],
    github: 'https://github.com/rishi-abinandhan',
    demo: '#'
  },
  {
    title: '3D Portfolio Website',
    desc: 'Futuristic interactive desk portfolio built with Three.js & GSAP showcasing projects in an immersive 3D workspace.',
    tech: ['Three.js', 'GSAP', 'HTML', 'CSS'],
    github: 'https://github.com/rishi-abinandhan',
    demo: '#'
  }
];

const SKILLS = [
  { name: 'Python',        pct: 88, color: '#00F5FF' },
  { name: 'Machine Learning', pct: 80, color: '#8B5CF6' },
  { name: 'Data Analysis', pct: 85, color: '#00F5FF' },
  { name: 'SQL',           pct: 78, color: '#8B5CF6' },
  { name: 'Power BI',      pct: 75, color: '#00F5FF' },
  { name: 'Streamlit',     pct: 72, color: '#8B5CF6' },
  { name: 'HTML/CSS',      pct: 80, color: '#00F5FF' },
  { name: 'JavaScript',    pct: 65, color: '#8B5CF6' },
  { name: 'Microsoft Excel', pct: 82, color: '#00F5FF' },
  { name: 'AI / Prompt Eng', pct: 78, color: '#8B5CF6' }
];

// ─── STATE ───────────────────────────────────────────
let activePanel = null;
let isPanelOpen = false;
let mouse = { x: 0, y: 0 };
let targetCamOffset = { x: 0, y: 0 };
let currentCamOffset = { x: 0, y: 0 };
let baseCameraY = 7;
let baseCameraZ = 9;
let isIntroPlaying = true;

// ─── SCENE SETUP ─────────────────────────────────────
const canvas = document.getElementById('canvas3d');
const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: false });
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
renderer.outputEncoding = THREE.sRGBEncoding;
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 1.1;

const scene = new THREE.Scene();
scene.fog = new THREE.FogExp2(0x0a0a12, 0.055);
scene.background = new THREE.Color(0x0a0a12);

const camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 100);
camera.position.set(0, 7, 9);
camera.lookAt(0, 0, 0);

// ─── CAMERA RESPONSIVENESS ───────────────────────────
function updateCameraForScreen() {
  const aspect = window.innerWidth / window.innerHeight;
  camera.aspect = aspect;
  
  if (aspect < 0.6) {
    // Very narrow portrait (Mobile)
    camera.fov = 75;
    baseCameraY = 13;
    baseCameraZ = 17;
  } else if (aspect < 1.0) {
    // Portrait / Square (Tablet)
    camera.fov = 65;
    baseCameraY = 10;
    baseCameraZ = 13;
  } else if (window.innerWidth < 1024) {
    // Small Desktop / Landscape tablet
    camera.fov = 50;
    baseCameraY = 8;
    baseCameraZ = 10;
  } else {
    // Desktop view
    camera.fov = 45;
    baseCameraY = 7;
    baseCameraZ = 9;
  }
  
  if (!isIntroPlaying) {
    camera.position.y = baseCameraY;
    camera.position.z = baseCameraZ;
  }
  camera.updateProjectionMatrix();
}

updateCameraForScreen(); // Initial setup

// ─── RESIZE ──────────────────────────────────────────
window.addEventListener('resize', () => {
  updateCameraForScreen();
  renderer.setSize(window.innerWidth, window.innerHeight);
});

// ─── LIGHTS ──────────────────────────────────────────
const ambientLight = new THREE.AmbientLight(0x1a1a30, 0.6);
scene.add(ambientLight);

const rimLight = new THREE.DirectionalLight(0x4433ff, 0.5);
rimLight.position.set(-5, 8, -5);
scene.add(rimLight);

// Desk lamp point light (starts off, turns on in intro)
const lampLight = new THREE.PointLight(0xFFB347, 0, 8, 2);
lampLight.position.set(2.5, 2.5, -0.5);
lampLight.castShadow = true;
lampLight.shadow.mapSize.set(512, 512);
scene.add(lampLight);

// Subtle fill light from front
const fillLight = new THREE.DirectionalLight(0x00F5FF, 0.25);
fillLight.position.set(0, 4, 8);
scene.add(fillLight);

// ─── MATERIALS ───────────────────────────────────────
const deskMat = new THREE.MeshStandardMaterial({
  color: 0x825424, // Brighter woody brown
  roughness: 0.55,
  metalness: 0.1
});
const deskLegMat = new THREE.MeshStandardMaterial({ color: 0x2a1a06, roughness: 0.7 });
const laptopBodyMat = new THREE.MeshStandardMaterial({ color: 0x222232, roughness: 0.3, metalness: 0.7 });
const laptopScreenMat = new THREE.MeshStandardMaterial({ color: 0x060611, roughness: 0.2, metalness: 0.2, emissive: 0x000000 });
const notebookMat = new THREE.MeshStandardMaterial({ color: 0x1a3a1a, roughness: 0.8 });
const notebookPageMat = new THREE.MeshStandardMaterial({ color: 0xf0ede0, roughness: 0.95 });
const tabletMat = new THREE.MeshStandardMaterial({ color: 0x111120, roughness: 0.25, metalness: 0.6 });
const phoneMat = new THREE.MeshStandardMaterial({ color: 0x0d0d1a, roughness: 0.2, metalness: 0.5 });
const paperMat = new THREE.MeshStandardMaterial({ color: 0xf5f0e8, roughness: 0.98 });
const mugMat = new THREE.MeshStandardMaterial({ color: 0x8B5CF6, roughness: 0.5, metalness: 0.05 });
const mugLiquidMat = new THREE.MeshStandardMaterial({ color: 0x3d1a00, roughness: 0.9 });
const lampBaseMat = new THREE.MeshStandardMaterial({ color: 0xc0a060, roughness: 0.4, metalness: 0.5 });
const lampShade = new THREE.MeshStandardMaterial({ color: 0xffe0a0, roughness: 0.6, emissive: 0x000000 });
const glowMat = new THREE.MeshStandardMaterial({ color: 0x00F5FF, emissive: 0x00F5FF, emissiveIntensity: 0.8 });

// ─── DESK GEOMETRY ───────────────────────────────────
// Desk surface
const desk = new THREE.Mesh(new THREE.BoxGeometry(10, 0.15, 6), deskMat);
desk.receiveShadow = true;
desk.position.set(0, 0, 0);
scene.add(desk);

// Desk edge trim (front)
const edgeTrim = new THREE.Mesh(new THREE.BoxGeometry(10, 0.05, 0.08), new THREE.MeshStandardMaterial({ color: 0x6b4020, roughness: 0.4 }));
edgeTrim.position.set(0, 0.05, 3.04);
scene.add(edgeTrim);

// Desk legs
[[-4.6, -3, -2.6], [4.6, -3, -2.6], [-4.6, -3, 2.6], [4.6, -3, 2.6]].forEach(([x, y, z]) => {
  const leg = new THREE.Mesh(new THREE.BoxGeometry(0.18, 6, 0.18), deskLegMat);
  leg.position.set(x, y, z);
  leg.castShadow = true;
  scene.add(leg);
});

// ─── HELPER: build rounded box ─────────────────────────
function box(w, h, d, mat, pos, rot) {
  const m = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), mat);
  m.position.set(...pos);
  if (rot) m.rotation.set(...rot);
  m.castShadow = true;
  m.receiveShadow = true;
  scene.add(m);
  return m;
}

// ─── LAPTOP ────────────────────────────────────────────
const laptopGroup = new THREE.Group();
scene.add(laptopGroup);
laptopGroup.position.set(-1.5, 0.08, 0.3);
laptopGroup.rotation.y = 0.1;

// Base
const laptopBase = new THREE.Mesh(new THREE.BoxGeometry(2.4, 0.1, 1.65), laptopBodyMat);
laptopBase.position.y = 0; laptopBase.castShadow = true;
laptopGroup.add(laptopBase);

// Screen
const laptopScreen = new THREE.Mesh(new THREE.BoxGeometry(2.4, 1.6, 0.06), laptopBodyMat);
laptopScreen.position.set(0, 0.85, -0.8);
laptopScreen.rotation.x = -1.1;
laptopGroup.add(laptopScreen);

// Screen display
const screenDisplay = new THREE.Mesh(new THREE.BoxGeometry(2.2, 1.42, 0.01), laptopScreenMat);
screenDisplay.position.set(0, 0.84, -0.77);
screenDisplay.rotation.x = -1.1;
laptopGroup.add(screenDisplay);

// Keyboard area
const keyboard = new THREE.Mesh(new THREE.BoxGeometry(2.1, 0.005, 1.2), new THREE.MeshStandardMaterial({ color: 0x1a1a2a, roughness: 0.5 }));
keyboard.position.set(0, 0.056, 0.1);
laptopGroup.add(keyboard);

// ─── NOTEBOOK ──────────────────────────────────────────
const notebookGroup = new THREE.Group();
scene.add(notebookGroup);
notebookGroup.position.set(2.8, 0.08, 1.2);
notebookGroup.rotation.y = -0.15;

const nbCover = new THREE.Mesh(new THREE.BoxGeometry(1.5, 0.07, 2.0), notebookMat);
nbCover.castShadow = true;
notebookGroup.add(nbCover);
const nbPage = new THREE.Mesh(new THREE.BoxGeometry(1.42, 0.05, 1.9), notebookPageMat);
nbPage.position.y = 0.03;
notebookGroup.add(nbPage);

// spiral lines on notebook
for (let i = 0; i < 8; i++) {
  const spiral = new THREE.Mesh(
    new THREE.CylinderGeometry(0.035, 0.035, 0.15, 8),
    new THREE.MeshStandardMaterial({ color: 0x888888, metalness: 0.5 })
  );
  spiral.rotation.x = Math.PI / 2;
  spiral.position.set(-0.8, 0.06, -0.8 + i * 0.24);
  notebookGroup.add(spiral);
}

// ─── TABLET ────────────────────────────────────────────
const tabletGroup = new THREE.Group();
scene.add(tabletGroup);
tabletGroup.position.set(1.9, 0.08, -1.2);
tabletGroup.rotation.y = 0.2;
tabletGroup.rotation.z = -0.06;

const tabletBody = new THREE.Mesh(new THREE.BoxGeometry(1.4, 0.065, 2.0), tabletMat);
tabletBody.castShadow = true;
tabletGroup.add(tabletBody);
const tabletScreen = new THREE.Mesh(new THREE.BoxGeometry(1.26, 0.01, 1.85), new THREE.MeshStandardMaterial({ color: 0x050510, roughness: 0.1, emissive: 0x000000 }));
tabletScreen.position.y = 0.038;
tabletGroup.add(tabletScreen);

// ─── SMARTPHONE ────────────────────────────────────────
const phoneGroup = new THREE.Group();
scene.add(phoneGroup);
phoneGroup.position.set(4.0, 0.08, 1.0);
phoneGroup.rotation.y = 0.3;

const phoneBody = new THREE.Mesh(new THREE.BoxGeometry(0.6, 0.07, 1.25), phoneMat);
phoneBody.castShadow = true;
phoneGroup.add(phoneBody);
const phoneScreen = new THREE.Mesh(new THREE.BoxGeometry(0.52, 0.01, 1.12), new THREE.MeshStandardMaterial({ color: 0x030308, roughness: 0.05, emissive: 0x000000 }));
phoneScreen.position.y = 0.04;
phoneGroup.add(phoneScreen);

// ─── RESUME PAPER ──────────────────────────────────────
const paperGroup = new THREE.Group();
scene.add(paperGroup);
paperGroup.position.set(-2.8, 0.08, 1.1);
paperGroup.rotation.y = -0.08;

const paperSheet = new THREE.Mesh(new THREE.BoxGeometry(1.7, 0.015, 2.2), paperMat);
paperSheet.castShadow = true;
paperGroup.add(paperSheet);
// Lines on paper
for (let i = 0; i < 10; i++) {
  const line = new THREE.Mesh(
    new THREE.BoxGeometry(1.4, 0.005, 0.015),
    new THREE.MeshStandardMaterial({ color: 0xbbbbbb })
  );
  line.position.set(0, 0.012, -0.9 + i * 0.2);
  paperGroup.add(line);
}

// ─── COFFEE MUG ────────────────────────────────────────
const mugGroup = new THREE.Group();
scene.add(mugGroup);
mugGroup.position.set(-3.5, 0.08, -0.6);

// mug body
const mugBody = new THREE.Mesh(new THREE.CylinderGeometry(0.3, 0.26, 0.7, 20), mugMat);
mugBody.castShadow = true;
mugGroup.add(mugBody);
// mug interior
const mugInner = new THREE.Mesh(new THREE.CylinderGeometry(0.24, 0.24, 0.04, 20), mugLiquidMat);
mugInner.position.y = 0.33;
mugGroup.add(mugInner);
// mug handle
const handleCurve = new THREE.QuadraticBezierCurve3(
  new THREE.Vector3(0.3, 0.15, 0),
  new THREE.Vector3(0.55, 0.15, 0),
  new THREE.Vector3(0.3, -0.15, 0)
);
const handlePoints = handleCurve.getPoints(16);
const handleGeo = new THREE.TubeGeometry(
  new THREE.CatmullRomCurve3(handlePoints), 16, 0.04, 8, false
);
const handle = new THREE.Mesh(handleGeo, mugMat);
mugGroup.add(handle);

// ─── DESK LAMP ─────────────────────────────────────────
const lampGroup = new THREE.Group();
scene.add(lampGroup);
lampGroup.position.set(3.5, 0.08, -1.5);

// base
const lampBaseM = new THREE.Mesh(new THREE.CylinderGeometry(0.3, 0.32, 0.1, 16), lampBaseMat);
lampGroup.add(lampBaseM);
// arm 1
const arm1 = new THREE.Mesh(new THREE.CylinderGeometry(0.04, 0.04, 1.5, 8), lampBaseMat);
arm1.position.set(0, 0.8, 0);
arm1.rotation.z = 0.3;
lampGroup.add(arm1);
// arm 2
const arm2 = new THREE.Mesh(new THREE.CylinderGeometry(0.04, 0.04, 1.2, 8), lampBaseMat);
arm2.position.set(0.35, 1.8, 0);
arm2.rotation.z = -0.5;
lampGroup.add(arm2);
// shade
const shade = new THREE.Mesh(new THREE.ConeGeometry(0.35, 0.45, 16, 1, true), lampShade);
shade.position.set(0.6, 2.58, 0);
shade.rotation.z = Math.PI;
lampGroup.add(shade);

// ─── PARTICLES ─────────────────────────────────────────
const PARTICLE_COUNT = 280;
const pGeo = new THREE.BufferGeometry();
const pPos = new Float32Array(PARTICLE_COUNT * 3);
const pVel = new Float32Array(PARTICLE_COUNT * 3);

for (let i = 0; i < PARTICLE_COUNT; i++) {
  pPos[i * 3]     = (Math.random() - 0.5) * 12;
  pPos[i * 3 + 1] = Math.random() * 5 + 0.2;
  pPos[i * 3 + 2] = (Math.random() - 0.5) * 8;
  pVel[i * 3]     = (Math.random() - 0.5) * 0.003;
  pVel[i * 3 + 1] = Math.random() * 0.002 + 0.0008;
  pVel[i * 3 + 2] = (Math.random() - 0.5) * 0.003;
}

pGeo.setAttribute('position', new THREE.BufferAttribute(pPos, 3));
const pMat = new THREE.PointsMaterial({
  color: 0xffeedd,
  size: 0.035,
  sizeAttenuation: true,
  transparent: true,
  opacity: 0,
  depthWrite: false
});
const particles = new THREE.Points(pGeo, pMat);
scene.add(particles);

// ─── CLICKABLE OBJECTS MAP ─────────────────────────────
const clickables = [
  { group: laptopGroup,  name: 'laptop',   label: '🖥️ Projects',  panel: 'panel-projects'  },
  { group: notebookGroup,name: 'notebook', label: '📓 About Me',  panel: 'panel-about'     },
  { group: tabletGroup,  name: 'tablet',   label: '📱 Skills',    panel: 'panel-skills'    },
  { group: phoneGroup,   name: 'phone',    label: '📲 LinkedIn',  panel: 'panel-linkedin'  },
  { group: paperGroup,   name: 'paper',    label: '📄 Resume',    panel: 'panel-resume'    },
  { group: mugGroup,     name: 'mug',      label: '☕ Contact',   panel: 'panel-contact'   }
];

// collect all child meshes and tag them with parent name
const raycasterMeshes = [];
clickables.forEach(obj => {
  obj.group.traverse(child => {
    if (child.isMesh) {
      child.userData.clickable = obj.name;
      child.userData.label = obj.label;
      child.userData.panelId = obj.panel;
      raycasterMeshes.push(child);
    }
  });
});

// ─── POPULATE PANELS ──────────────────────────────────
function buildProjects() {
  const grid = document.getElementById('projects-grid');
  PROJECTS.forEach(p => {
    const card = document.createElement('div');
    card.className = 'project-card';
    card.innerHTML = `
      <h3>${p.title}</h3>
      <p>${p.desc}</p>
      <div class="project-tech">${p.tech.map(t => `<span class="tech-tag">${t}</span>`).join('')}</div>
      <div class="project-links">
        <a href="${p.github}" target="_blank" class="project-link github">⌥ GitHub</a>
        <a href="${p.demo}" target="_blank" class="project-link demo">▷ Demo</a>
      </div>`;
    grid.appendChild(card);
  });
}

function buildSkills() {
  const grid = document.getElementById('skills-grid');
  SKILLS.forEach(s => {
    const el = document.createElement('div');
    el.className = 'skill-item';
    el.innerHTML = `
      <div class="skill-header">
        <span class="skill-name">${s.name}</span>
        <span class="skill-pct">${s.pct}%</span>
      </div>
      <div class="skill-bar-track">
        <div class="skill-bar-fill" data-pct="${s.pct}" style="background: linear-gradient(90deg, ${s.color}, ${s.color === '#00F5FF' ? '#8B5CF6' : '#00F5FF'});"></div>
      </div>`;
    grid.appendChild(el);
  });
}

// Update phone time
function updatePhoneTime() {
  const el = document.getElementById('phone-time');
  if (el) {
    const now = new Date();
    el.textContent = `${String(now.getHours()).padStart(2,'0')}:${String(now.getMinutes()).padStart(2,'0')}`;
  }
}
setInterval(updatePhoneTime, 30000);
updatePhoneTime();

buildProjects();
buildSkills();

// Resume download link
document.getElementById('resume-download-btn').href = 'resume.pdf';

// ─── RAYCASTER ────────────────────────────────────────
const raycaster = new THREE.Raycaster();
const mouseNDC = new THREE.Vector2();
const tooltip = document.getElementById('tooltip');

function getNDC(clientX, clientY) {
  mouseNDC.x = (clientX / window.innerWidth) * 2 - 1;
  mouseNDC.y = -(clientY / window.innerHeight) * 2 + 1;
}

let hoveredObj = null;
window.addEventListener('mousemove', e => {
  mouse.x = (e.clientX / window.innerWidth - 0.5) * 2;
  mouse.y = (e.clientY / window.innerHeight - 0.5) * 2;
  targetCamOffset.x = -mouse.x * 0.35;
  targetCamOffset.y = -mouse.y * 0.2;

  if (isPanelOpen) return;
  getNDC(e.clientX, e.clientY);
  raycaster.setFromCamera(mouseNDC, camera);
  const hits = raycaster.intersectObjects(raycasterMeshes);

  if (hits.length) {
    const name = hits[0].object.userData.clickable;
    const label = hits[0].object.userData.label;
    if (name !== hoveredObj) {
      hoveredObj = name;
      document.body.style.cursor = 'pointer';
      tooltip.textContent = label;
      tooltip.classList.remove('hidden');
    }
    tooltip.style.left = (e.clientX + 16) + 'px';
    tooltip.style.top  = (e.clientY - 10) + 'px';
  } else {
    if (hoveredObj) {
      hoveredObj = null;
      document.body.style.cursor = 'crosshair';
      tooltip.classList.add('hidden');
    }
  }
});

// ─── PANEL OPEN / CLOSE ───────────────────────────────
function openPanel(panelId) {
  if (isPanelOpen) return;
  isPanelOpen = true;
  activePanel = panelId;
  const panel = document.getElementById(panelId);
  panel.classList.remove('hidden');
  panel.classList.add('active');
  document.getElementById('close-btn').classList.remove('hidden');

  // Animate bars if skills
  if (panelId === 'panel-skills') {
    setTimeout(() => {
      document.querySelectorAll('.skill-bar-fill').forEach(el => {
        el.style.width = el.dataset.pct + '%';
      });
    }, 120);
  }

  gsap.fromTo(panel,
    { opacity: 0, scale: 0.85, y: 30 },
    { opacity: 1, scale: 1, y: 0, duration: 0.55, ease: 'back.out(1.7)' }
  );

  // screen glow effects
  if (panelId === 'panel-projects') {
    gsap.to(laptopScreenMat, { emissiveIntensity: 0.6, duration: 0.5 });
    laptopScreenMat.emissive.set(0x00F5FF);
  }
  if (panelId === 'panel-skills') {
    gsap.to(tabletGroup.scale, { x: 1.06, y: 1.06, z: 1.06, duration: 0.4, yoyo: true, repeat: 1 });
  }
}

function closePanel() {
  if (!isPanelOpen || !activePanel) return;
  const panel = document.getElementById(activePanel);
  gsap.to(panel, {
    opacity: 0, scale: 0.85, y: 30, duration: 0.35, ease: 'power2.in',
    onComplete: () => {
      panel.classList.add('hidden');
      panel.classList.remove('active');
    }
  });

  if (activePanel === 'panel-projects') {
    gsap.to(laptopScreenMat, { emissiveIntensity: 0, duration: 0.5 });
  }

  isPanelOpen = false;
  activePanel = null;
  document.getElementById('close-btn').classList.add('hidden');
}

document.getElementById('close-btn').addEventListener('click', closePanel);
window.addEventListener('keydown', e => { if (e.key === 'Escape') closePanel(); });

// ─── CLICK HANDLER ────────────────────────────────────
window.addEventListener('click', e => {
  if (e.target.closest('.glass-panel') || e.target.closest('#close-btn')) return;
  if (isPanelOpen) { closePanel(); return; }

  getNDC(e.clientX, e.clientY);
  raycaster.setFromCamera(mouseNDC, camera);
  const hits = raycaster.intersectObjects(raycasterMeshes);
  if (hits.length) {
    const { panelId, clickable } = hits[0].object.userData;
    animateObjectClick(clickable);
    openPanel(panelId);
  }
});

// ─── OBJECT CLICK ANIMATION ───────────────────────────
function animateObjectClick(name) {
  const obj = clickables.find(c => c.name === name);
  if (!obj) return;
  const g = obj.group;
  gsap.to(g.position, {
    y: 0.45, duration: 0.22, ease: 'power2.out',
    onComplete: () => gsap.to(g.position, { y: 0.08, duration: 0.35, ease: 'bounce.out' })
  });
}

// ─── TOUCH HANDLER FOR MOBILE ─────────────────────────
window.addEventListener('touchstart', e => {
  if (e.target.closest('.glass-panel') || e.target.closest('#close-btn')) return;
  if (isPanelOpen) return; // let closePanel handle closing if clicking outside

  // For touch, prevent default to avoid double-firing with click
  // But only if we actually hit an object
  if (e.touches.length > 0) {
    getNDC(e.touches[0].clientX, e.touches[0].clientY);
    raycaster.setFromCamera(mouseNDC, camera);
    const hits = raycaster.intersectObjects(raycasterMeshes);
    if (hits.length) {
      // e.preventDefault(); // Sometimes prevents scrolling panels, so be careful
      const { panelId, clickable } = hits[0].object.userData;
      animateObjectClick(clickable);
      openPanel(panelId);
    }
  }
}, { passive: false });

// ─── CONTACT FORM ─────────────────────────────────────
function handleContactSubmit(e) {
  e.preventDefault();
  const btn = document.getElementById('send-btn');
  const label = document.getElementById('send-label');
  label.textContent = 'Sending…';
  btn.disabled = true;

  spawnParticles();

  setTimeout(() => {
    document.getElementById('contact-form').style.display = 'none';
    const success = document.getElementById('contact-success');
    success.classList.remove('hidden');
    setTimeout(() => success.classList.add('show'), 10);
  }, 1200);
}
window.handleContactSubmit = handleContactSubmit;

function spawnParticles() {
  const container = document.getElementById('send-particles');
  for (let i = 0; i < 18; i++) {
    const dot = document.createElement('div');
    const angle = (i / 18) * 360;
    const dist = 40 + Math.random() * 40;
    dot.style.cssText = `
      position:absolute; width:5px; height:5px; border-radius:50%;
      background: hsl(${Math.random() * 60 + 170}, 100%, 65%);
      top:50%; left:50%; margin:-2.5px;
      --dx:${Math.cos(angle * Math.PI/180) * dist}px;
      --dy:${Math.sin(angle * Math.PI/180) * dist}px;
      animation: particle-burst 0.7s ease-out ${i * 0.03}s forwards;
    `;
    container.appendChild(dot);
    setTimeout(() => dot.remove(), 900);
  }
}

// ─── INTRO SEQUENCE ───────────────────────────────────
function runIntro() {
  const fill = document.getElementById('loader-fill');
  const label = document.getElementById('loader-label');
  const overlay = document.getElementById('intro-overlay');
  const introText = document.getElementById('intro-text');
  const hintBar = document.getElementById('hint-bar');

  const steps = [
    {pct: 15, text: 'Building desk environment…'},
    {pct: 35, text: 'Setting up lighting…'},
    {pct: 55, text: 'Loading portfolio data…'},
    {pct: 75, text: 'Calibrating hover effects…'},
    {pct: 95, text: 'Almost ready…'},
  ];

  let idx = 0;
  const loadInterval = setInterval(() => {
    if (idx >= steps.length) {
      clearInterval(loadInterval);
      return;
    }
    fill.style.width = steps[idx].pct + '%';
    label.textContent = steps[idx].text;
    idx++;
  }, 400);

  // Show intro text after 1.5s
  gsap.to(introText, { opacity: 1, y: 0, duration: 1.2, delay: 1.5, ease: 'power2.out' });

  // Lamp turns on
  gsap.to(lampLight, { intensity: 2.5, duration: 1.5, delay: 1.8, ease: 'power2.inOut', onStart: () => {
    gsap.to(lampShade, { emissiveIntensity: 0.3, duration: 1.5, delay: 0 });
    lampShade.emissive.set(0xFFB347);
  }});

  // Particles fade in
  gsap.to(pMat, { opacity: 0.55, duration: 2, delay: 2, ease: 'power2.inOut' });

  // Camera zoom intro
  camera.position.set(0, baseCameraY + 7, baseCameraZ + 9);
  
  gsap.to(camera.position, {
    y: baseCameraY, z: baseCameraZ, duration: 3, delay: 1, ease: 'power2.inOut',
    onUpdate: () => camera.lookAt(0, 0, 0),
    onComplete: () => { isIntroPlaying = false; }
  });

  // Fade out overlay after 4.5s
  setTimeout(() => {
    fill.style.width = '100%';
    label.textContent = 'Welcome!';
    setTimeout(() => {
      gsap.to(overlay, {
        opacity: 0, duration: 0.9, ease: 'power2.inOut',
        onComplete: () => {
          overlay.style.display = 'none';
          hintBar.classList.remove('hidden');
          gsap.fromTo(hintBar, { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.7, ease: 'back.out(1.7)' });
          
          const welcome = document.getElementById('welcome-text');
          if (welcome) {
            welcome.classList.remove('hidden');
            setTimeout(() => welcome.classList.add('visible'), 100);
          }
        }
      });
    }, 500);
  }, 4200);
}

runIntro();

// ─── ANIMATION LOOP ───────────────────────────────────
const clock = new THREE.Clock();

function animate() {
  requestAnimationFrame(animate);
  const t = clock.getElapsedTime();

  if (!isIntroPlaying) {
    // Parallax camera
    currentCamOffset.x += (targetCamOffset.x - currentCamOffset.x) * 0.06;
    currentCamOffset.y += (targetCamOffset.y - currentCamOffset.y) * 0.06;
    camera.position.x = currentCamOffset.x;
    camera.position.y = baseCameraY + currentCamOffset.y;
    camera.position.z = baseCameraZ;
    camera.lookAt(0, 0, 0);
  }

  // Particles drift
  const positions = pGeo.attributes.position.array;
  for (let i = 0; i < PARTICLE_COUNT; i++) {
    positions[i * 3]     += pVel[i * 3];
    positions[i * 3 + 1] += pVel[i * 3 + 1];
    positions[i * 3 + 2] += pVel[i * 3 + 2];
    // wrap
    if (positions[i * 3]     >  6)  positions[i * 3]     = -6;
    if (positions[i * 3]     < -6)  positions[i * 3]     =  6;
    if (positions[i * 3 + 1] >  6)  positions[i * 3 + 1] = 0.2;
    if (positions[i * 3 + 2] >  4)  positions[i * 3 + 2] = -4;
    if (positions[i * 3 + 2] < -4)  positions[i * 3 + 2] =  4;
  }
  pGeo.attributes.position.needsUpdate = true;

  // Gentle mug bob
  mugGroup.position.y = 0.08 + Math.sin(t * 1.2) * 0.012;

  // Phone slight tilt
  phoneGroup.rotation.z = Math.sin(t * 0.8) * 0.03;

  // Lamp flicker (very subtle)
  lampLight.intensity = 2.5 + Math.sin(t * 8) * 0.04;

  renderer.render(scene, camera);
}

animate();
