// ── Particules canvas ────────────────────────────────────────
const canvas = document.getElementById('particles');
const ctx    = canvas.getContext('2d');

function resize() {
  canvas.width  = window.innerWidth;
  canvas.height = window.innerHeight;
}
resize();
window.addEventListener('resize', resize);

const PARTICLE_COUNT = 55;
const particles = Array.from({ length: PARTICLE_COUNT }, () => ({
  x:     Math.random() * window.innerWidth,
  y:     Math.random() * window.innerHeight,
  r:     Math.random() * 1.6 + 0.3,
  vx:    (Math.random() - .5) * .35,
  vy:    -(Math.random() * .5 + .15),
  alpha: Math.random() * .5 + .1,
  life:  Math.random(),
}));

let particlesActive = true;
let rafId = null;

function drawParticles() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  if (!particlesActive) return;
  particles.forEach(p => {
    p.x += p.vx;
    p.y += p.vy;
    p.life += .004;
    if (p.life > 1) {
      p.x    = Math.random() * canvas.width;
      p.y    = canvas.height + 10;
      p.life = 0;
    }
    const a = p.alpha * Math.sin(p.life * Math.PI);
    ctx.beginPath();
    ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(245, 158, 11, ${a})`;
    ctx.fill();
  });
  rafId = requestAnimationFrame(drawParticles);
}
drawParticles();

// ── Typewriter nom en boucle ──────────────────────────────────
const nameEl  = document.querySelector('.name');
const nameTxt = 'Nasch';
let   nIndex  = 0;
let   typing  = true;
nameEl.innerHTML = '<span class="name-cursor">|</span>';

function typeName() {
  if (typing) {
    nameEl.innerHTML = nameTxt.slice(0, nIndex) + '<span class="name-cursor">|</span>';
    nIndex++;
    if (nIndex > nameTxt.length) {
      typing = false;
      setTimeout(typeName, 1800);
      return;
    }
    setTimeout(typeName, 180);
  } else {
    nameEl.innerHTML = nameTxt.slice(0, nIndex) + '<span class="name-cursor">|</span>';
    nIndex--;
    if (nIndex < 0) {
      typing = true;
      nIndex = 0;
      setTimeout(typeName, 600);
      return;
    }
    setTimeout(typeName, 100);
  }
}
setTimeout(typeName, 400);

// ── Parallax souris ───────────────────────────────────────────
const page = document.querySelector('.page');
document.addEventListener('mousemove', (e) => {
  const cx = window.innerWidth  / 2;
  const cy = window.innerHeight / 2;
  const dx = (e.clientX - cx) / cx;
  const dy = (e.clientY - cy) / cy;
  page.style.transform = `translate(${dx * -8}px, ${dy * -6}px)`;
}, { passive: true });

// ── Volume widget ─────────────────────────────────────────────
const volumeBtn    = document.getElementById('volume-btn');
const volumeSlider = document.getElementById('volume-slider');
const volIcon      = document.getElementById('vol-icon');

const ICONS = {
  high: '<path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3A4.5 4.5 0 0 0 14 7.97v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z"/>',
  low:  '<path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3A4.5 4.5 0 0 0 14 7.97v8.05c1.48-.73 2.5-2.25 2.5-4.02z"/>',
  mute: '<path d="M16.5 12A4.5 4.5 0 0 0 14 7.97v2.21l2.45 2.45c.03-.2.05-.41.05-.63zm2.5 0c0 .94-.2 1.82-.54 2.64l1.51 1.51A8.796 8.796 0 0 0 21 12c0-4.28-3-7.86-7-8.77v2.06c2.89.86 5 3.54 5 6.71zM4.27 3 3 4.27 7.73 9H3v6h4l5 5v-6.73l4.25 4.25c-.67.52-1.42.93-2.25 1.18v2.06A8.99 8.99 0 0 0 17.73 18l1.99 2L21 18.73 4.27 3zM12 4 9.91 6.09 12 8.18V4z"/>',
};

function updateVolIcon(vol) {
  if (vol === 0)      volIcon.innerHTML = ICONS.mute;
  else if (vol < 50)  volIcon.innerHTML = ICONS.low;
  else                volIcon.innerHTML = ICONS.high;
}

// Force le curseur croix même pendant le drag du slider
const CURSOR_URL = "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='32' height='32' viewBox='0 0 32 32'%3E%3Cline x1='16' y1='2' x2='16' y2='30' stroke='black' stroke-width='4' stroke-linecap='round'/%3E%3Cline x1='2' y1='16' x2='30' y2='16' stroke='black' stroke-width='4' stroke-linecap='round'/%3E%3Cline x1='16' y1='2' x2='16' y2='30' stroke='white' stroke-width='2' stroke-linecap='round'/%3E%3Cline x1='2' y1='16' x2='30' y2='16' stroke='white' stroke-width='2' stroke-linecap='round'/%3E%3C/svg%3E\") 16 16, crosshair";

volumeSlider.addEventListener('mousedown', () => {
  document.documentElement.style.setProperty('cursor', CURSOR_URL, 'important');
});
document.addEventListener('mouseup', () => {
  document.documentElement.style.removeProperty('cursor');
});

volumeSlider.addEventListener('input', () => {
  const vol = parseInt(volumeSlider.value);
  audio.volume = vol / 100;
  updateVolIcon(vol);
});

let lastVol = 100;
volumeBtn.addEventListener('click', () => {
  if (audio.volume > 0) {
    lastVol = Math.round(audio.volume * 100);
    audio.volume = 0;
    volumeSlider.value = 0;
    updateVolIcon(0);
  } else {
    audio.volume = lastVol / 100;
    volumeSlider.value = lastVol;
    updateVolIcon(lastVol);
  }
});

// ── Splash → lance la musique ─────────────────────────────────
const audio  = document.getElementById('audio');
const splash = document.getElementById('splash');
splash.addEventListener('click', () => {
  audio.play();
  splash.classList.add('hidden');
}, { once: true });

// ── Player ────────────────────────────────────────────────────
const fillEl    = document.getElementById('progress-fill');
const curEl     = document.getElementById('time-current');
const totalEl   = document.getElementById('time-total');
const trackEl   = document.getElementById('progress-track');
const playerEl  = document.querySelector('.player');
const btnPlay   = document.getElementById('btn-play');
const iconPause = document.getElementById('icon-pause');
const iconPlay  = document.getElementById('icon-play');

function fmt(s) {
  if (!isFinite(s)) return '--:--';
  return `${Math.floor(s / 60)}:${String(Math.floor(s % 60)).padStart(2, '0')}`;
}

audio.addEventListener('timeupdate', () => {
  const pct = audio.duration ? (audio.currentTime / audio.duration) * 100 : 0;
  fillEl.style.width = pct + '%';
  trackEl.setAttribute('aria-valuenow', Math.round(pct));
  curEl.textContent = fmt(audio.currentTime);
});

audio.addEventListener('loadedmetadata', () => {
  totalEl.textContent = fmt(audio.duration);
});

function syncIcon() {
  const paused = audio.paused;
  iconPause.style.display = paused ? 'none' : '';
  iconPlay.style.display  = paused ? '' : 'none';
  btnPlay.setAttribute('aria-label', paused ? 'Lecture' : 'Pause');

  particlesActive = !paused;
  if (!paused) {
    cancelAnimationFrame(rafId);
    drawParticles();
  } else {
    cancelAnimationFrame(rafId);
    ctx.clearRect(0, 0, canvas.width, canvas.height);
  }
}
audio.addEventListener('play',  syncIcon);
audio.addEventListener('pause', syncIcon);

btnPlay.addEventListener('click', () => {
  audio.paused ? audio.play() : audio.pause();
});

trackEl.addEventListener('click', (e) => {
  if (!audio.duration) return;
  const rect = trackEl.getBoundingClientRect();
  audio.currentTime = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width)) * audio.duration;
});

document.getElementById('btn-prev').addEventListener('click', () => {
  audio.currentTime = 0;
});

document.getElementById('btn-next').addEventListener('click', () => {
  audio.currentTime = Math.min(audio.currentTime + 10, audio.duration || 0);
});
