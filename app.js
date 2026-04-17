/* === CURSOR === */
const cursor = document.getElementById('cursor');
const trail = document.getElementById('cursorTrail');
let mx = 0, my = 0, tx = 0, ty = 0;
document.addEventListener('mousemove', e => {
  mx = e.clientX; my = e.clientY;
  cursor.style.left = mx + 'px';
  cursor.style.top = my + 'px';
});
function animateTrail() {
  tx += (mx - tx) * 0.12;
  ty += (my - ty) * 0.12;
  trail.style.left = tx + 'px';
  trail.style.top = ty + 'px';
  requestAnimationFrame(animateTrail);
}
animateTrail();
document.querySelectorAll('a, button, .project-card, .cert-card, .achievement-card, .gallery-item').forEach(el => {
  el.addEventListener('mouseenter', () => {
    cursor.style.transform = 'translate(-50%,-50%) scale(2.5)';
    trail.style.opacity = '0.2';
  });
  el.addEventListener('mouseleave', () => {
    cursor.style.transform = 'translate(-50%,-50%) scale(1)';
    trail.style.opacity = '0.5';
  });
});

/* === CANVAS PARTICLE NETWORK === */
const canvas = document.getElementById('canvas-bg');
const ctx = canvas.getContext('2d');
let W = canvas.width = window.innerWidth;
let H = canvas.height = window.innerHeight;
window.addEventListener('resize', () => { W = canvas.width = window.innerWidth; H = canvas.height = window.innerHeight; });
const PARTICLE_COUNT = 80;
const particles = [];
const isDark = () => document.documentElement.getAttribute('data-theme') === 'dark';
class Particle {
  constructor() { this.reset(); }
  reset() {
    this.x = Math.random() * W; this.y = Math.random() * H;
    this.vx = (Math.random() - 0.5) * 0.4; this.vy = (Math.random() - 0.5) * 0.4;
    this.r = Math.random() * 2 + 0.5; this.alpha = Math.random() * 0.5 + 0.2;
  }
  update() {
    this.x += this.vx; this.y += this.vy;
    if (this.x < 0 || this.x > W) this.vx *= -1;
    if (this.y < 0 || this.y > H) this.vy *= -1;
  }
  draw() {
    const color = isDark() ? '0,212,255' : '0,102,204';
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(${color},${this.alpha})`;
    ctx.fill();
  }
}
for (let i = 0; i < PARTICLE_COUNT; i++) particles.push(new Particle());
function drawConnections() {
  const color = isDark() ? '0,212,255' : '0,102,204';
  for (let i = 0; i < particles.length; i++) {
    for (let j = i + 1; j < particles.length; j++) {
      const dx = particles[i].x - particles[j].x;
      const dy = particles[i].y - particles[j].y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < 130) {
        ctx.beginPath();
        ctx.moveTo(particles[i].x, particles[i].y);
        ctx.lineTo(particles[j].x, particles[j].y);
        ctx.strokeStyle = `rgba(${color},${0.12 * (1 - dist / 130)})`;
        ctx.lineWidth = 0.5;
        ctx.stroke();
      }
    }
  }
}
function animateCanvas() {
  ctx.clearRect(0, 0, W, H);
  particles.forEach(p => { p.update(); p.draw(); });
  drawConnections();
  requestAnimationFrame(animateCanvas);
}
animateCanvas();

/* === THEME TOGGLE === */
const themeToggle = document.getElementById('themeToggle');
const themeLabel = document.getElementById('themeLabel');
const navToggle = document.getElementById('navToggle');
const navLinksContainer = document.querySelector('.nav-links');

themeToggle.addEventListener('click', () => {
  const html = document.documentElement;
  const current = html.getAttribute('data-theme');
  const next = current === 'dark' ? 'light' : 'dark';
  html.setAttribute('data-theme', next);
  themeLabel.textContent = next === 'dark' ? 'Dark' : 'Light';
});

navToggle.addEventListener('click', () => {
  navLinksContainer.classList.toggle('show');
});

navLinksContainer.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => {
    navLinksContainer.classList.remove('show');
  });
});

window.addEventListener('resize', () => {
  if (window.innerWidth > 1024) {
    navLinksContainer.classList.remove('show');
  }
});

/* === TYPEWRITER === */
const phrases = [
  'Building scalable REST APIs with Spring Boot...',
  'Designing microservices architectures...',
  'Crafting full-stack Java applications...',
  'Ranked #1 in BCA for 5 semesters...',
  'Published Scopus-indexed research papers...',
];
let phraseIdx = 0, charIdx = 0, deleting = false;
const typeEl = document.getElementById('typewriter');
function type() {
  const phrase = phrases[phraseIdx];
  if (!deleting) {
    typeEl.textContent = phrase.substring(0, charIdx + 1);
    charIdx++;
    if (charIdx === phrase.length) { deleting = true; setTimeout(type, 1800); return; }
  } else {
    typeEl.textContent = phrase.substring(0, charIdx - 1);
    charIdx--;
    if (charIdx === 0) { deleting = false; phraseIdx = (phraseIdx + 1) % phrases.length; }
  }
  setTimeout(type, deleting ? 40 : 65);
}
type();

/* === SCROLL REVEAL === */
const reveals = document.querySelectorAll('.reveal');
const observer = new IntersectionObserver((entries) => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      e.target.classList.add('visible');
      e.target.querySelectorAll('.skill-bar-fill').forEach(bar => { bar.style.width = bar.dataset.width + '%'; });
    }
  });
}, { threshold: 0.1 });
reveals.forEach(r => observer.observe(r));
document.querySelectorAll('.skill-bar-fill').forEach(bar => {
  const barObserver = new IntersectionObserver(entries => {
    if (entries[0].isIntersecting) bar.style.width = bar.dataset.width + '%';
  }, { threshold: 0.5 });
  barObserver.observe(bar);
});

/* === PROJECT TABS === */
const tabs = document.querySelectorAll('.project-tab');
const panels = document.querySelectorAll('.project-panel');
tabs.forEach(tab => {
  tab.addEventListener('click', () => {
    tabs.forEach(t => t.classList.remove('active'));
    panels.forEach(p => p.classList.remove('active'));
    tab.classList.add('active');
    const panel = document.getElementById('tab-' + tab.dataset.tab);
    if (panel) panel.classList.add('active');
    else document.getElementById('tab-all').classList.add('active');
  });
});

/* === PROJECT CARD SPOTLIGHT === */
document.querySelectorAll('.project-card').forEach(card => {
  card.addEventListener('mousemove', e => {
    const rect = card.getBoundingClientRect();
    card.style.setProperty('--mx', ((e.clientX - rect.left) / rect.width * 100) + '%');
    card.style.setProperty('--my', ((e.clientY - rect.top) / rect.height * 100) + '%');
  });
});

/* === SMOOTH SCROLL === */
document.querySelectorAll('[data-target]').forEach(el => {
  el.addEventListener('click', e => {
    e.preventDefault();
    const target = document.getElementById(el.dataset.target);
    if (target) target.scrollIntoView({ behavior: 'smooth', block: 'start' });
  });
});

/* === NAV ACTIVE === */
const navSections = document.querySelectorAll('section[id]');
const navLinks = document.querySelectorAll('.nav-links a');
window.addEventListener('scroll', () => {
  let current = '';
  navSections.forEach(s => { if (window.scrollY >= s.offsetTop - 100) current = s.id; });
  navLinks.forEach(l => {
    l.style.color = '';
    if (l.dataset.target === current) l.style.color = 'var(--accent)';
  });
}, { passive: true });

/* === MODAL === */
const modalOverlay = document.getElementById('modalOverlay');
const modalClose = document.getElementById('modalClose');
const modalImgWrap = document.getElementById('modalImgWrap');
const modalTitleEl = document.getElementById('modalTitle');
const modalSubtitleEl = document.getElementById('modalSubtitle');
const modalActionsEl = document.getElementById('modalActions');

function openModal(title, subtitle, imgSrc, id) {
  modalTitleEl.textContent = title;
  modalSubtitleEl.textContent = subtitle;
  
  const cleanPath = imgSrc.trim();
  const isPDF = cleanPath.toLowerCase().endsWith('.pdf');
  
  if (isPDF) {
    modalImgWrap.innerHTML = `
      <div class="modal-pdf-view" style="width:100%; height:80vh; max-height:600px; overflow:hidden; border-radius:12px; border: 1px solid var(--border); background: #f5f5f5;">
        <iframe src="${cleanPath}" width="100%" height="100%" style="border:none;"></iframe>
      </div>`;
  } else {
    modalImgWrap.innerHTML = `
      <div class="modal-img-placeholder" id="modalLoader">
        <div class="placeholder-icon">🖼️</div>
        <p>Loading document...</p>
      </div>`;
    const img = new Image();
    img.onload = () => { 
      modalImgWrap.innerHTML = ''; 
      modalImgWrap.appendChild(img); 
      img.style.width='100%'; 
      img.style.display='block'; 
      img.style.borderRadius='12px'; 
    };
    img.onerror = () => {
      modalImgWrap.innerHTML = `
        <div class="modal-pdf-placeholder" style="padding: 3rem;">
          <div class="placeholder-icon">❌</div>
          <p>Unable to load file: <br><code style="font-size:0.7rem; color:var(--accent);">${cleanPath}</code></p>
        </div>`;
    };
    img.src = cleanPath;
  }

  // Actions
  modalActionsEl.innerHTML = `
    <a href="${cleanPath}" download class="modal-btn" style="background: var(--surface2); color: var(--text3); border-color: var(--border);">⬇ Download Copy</a>
    <a href="${cleanPath}" target="_blank" class="modal-btn" style="background: var(--accent); color: var(--bg); border-color: var(--accent);">🔗 Open Full Size / View</a>
  `;
  modalOverlay.classList.add('active');
  document.body.style.overflow = 'hidden';
}

modalClose.addEventListener('click', closeModal);
modalOverlay.addEventListener('click', e => { if (e.target === modalOverlay) closeModal(); });
document.addEventListener('keydown', e => { if (e.key === 'Escape') closeModal(); });
function closeModal() {
  modalOverlay.classList.remove('active');
  document.body.style.overflow = '';
}