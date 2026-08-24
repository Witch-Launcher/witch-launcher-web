import { HeroWebGPU } from './renderer.js';

// ---------- Language toggle ----------
const html = document.documentElement;
function setLang(lang) {
  html.setAttribute('lang', lang);
  html.classList.toggle('lang-vi', lang === 'vi');
  html.classList.toggle('lang-en', lang === 'en');
  localStorage.setItem('witch-lang', lang);
  const btn = document.getElementById('langToggle');
  if (btn) btn.setAttribute('aria-label', lang === 'vi' ? 'Switch to English' : 'Chuyển sang Tiếng Việt');
}
(function initLang() {
  const saved = localStorage.getItem('witch-lang');
  const prefersVi = !saved && (navigator.language || '').toLowerCase().startsWith('vi');
  setLang(saved || (prefersVi ? 'vi' : 'en'));
})();
const langToggle = document.getElementById('langToggle');
if (langToggle) langToggle.addEventListener('click', () => {
  setLang(html.getAttribute('lang') === 'vi' ? 'en' : 'vi');
});

// ---------- Mobile nav ----------
const navToggle = document.getElementById('navToggle');
const navLinks = document.getElementById('navLinks');
if (navToggle && navLinks) {
  navToggle.addEventListener('click', () => {
    const open = navLinks.classList.toggle('open');
    navToggle.setAttribute('aria-expanded', String(open));
  });
  navLinks.querySelectorAll('a').forEach(a => a.addEventListener('click', () => navLinks.classList.remove('open')));
}

// ---------- Scroll reveal ----------
const io = new IntersectionObserver((entries) => {
  entries.forEach(e => {
    if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); }
  });
}, { threshold: 0.12 });
document.querySelectorAll('[data-reveal]').forEach(el => io.observe(el));

// ---------- Sticky nav shadow ----------
const nav = document.querySelector('.nav');
const onScroll = () => { if (nav) nav.classList.toggle('scrolled', window.scrollY > 24); };
window.addEventListener('scroll', onScroll, { passive: true });
onScroll();

// ---------- Footer year ----------
const y = document.getElementById('year');
if (y) y.textContent = String(new Date().getFullYear());

// ---------- WebGPU hero + video background ----------
const canvas = document.getElementById('gpu');
const fallback = document.getElementById('gpuFallback');
const video = document.getElementById('heroVideo');

if (video) {
  video.play().catch(() => {});
  video.addEventListener('error', () => {
    // only fall back if WebGPU is also unavailable
    if (canvas && canvas.style.display !== 'none') return;
    if (fallback) {
      fallback.style.display = 'flex';
      const note = document.getElementById('gpuNote');
      if (note) note.textContent = (html.getAttribute('lang') === 'vi')
        ? 'Không thể phát video — đang hiển thị nền thay thế.'
        : 'Unable to play video — showing fallback background.';
    }
  });
}

if (canvas) {
  const hero = new HeroWebGPU(canvas, () => {
    // WebGPU unavailable -> hide canvas, keep the video as background
    canvas.style.display = 'none';
  });
  hero.init().then(ok => { if (ok) hero.start(); });
  // pause when tab hidden to save resources
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) hero.stop(); else if (hero.supported) hero.start();
  });
}

// ---------- Video blur on scroll: sharp at top, blurred when scrolling down ----------
(function scrollBlur() {
  const root = document.documentElement;
  let cur = -1, ticking = false;
  function apply() {
    ticking = false;
    const p = Math.min(1, Math.max(0, window.scrollY / (window.innerHeight * 0.8)));
    const blur = Math.round(p * 20 * 10) / 10;   // 0px (top) -> 20px
    const scrim = 0.4 + p * 0.5;                  // 0.40 -> 0.90
    if (Math.abs(blur - cur) > 0.2) {
      cur = blur;
      if (video) video.style.filter = `blur(${blur}px) brightness(0.95)`;
      root.style.setProperty('--scrim', scrim.toFixed(3));
    }
  }
  window.addEventListener('scroll', () => {
    if (!ticking) { ticking = true; requestAnimationFrame(apply); }
  }, { passive: true });
  apply();
})();

// ---------- Tự động lấy danh sách file từ GitHub Releases (cache + bảng version lazy) ----------
function bi(vi, en) { return '<span class="vi">' + vi + '</span><span class="en">' + en + '</span>'; }
function escapeHtml(s) {
  return String(s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
}
function fmtSize(b) {
  if (!b) return '';
  const u = ['B', 'KB', 'MB', 'GB']; let i = 0, n = b;
  while (n >= 1024 && i < u.length - 1) { n /= 1024; i++; }
  return (Math.round(n * 10) / 10) + ' ' + u[i];
}
function renderAssets(r) {
  const assets = (r.assets && r.assets.length)
    ? r.assets.map(a => {
        const size = fmtSize(a.size);
        return '<a class="asset" href="' + a.browser_download_url + '" target="_blank" rel="noopener" download>'
          + '<span class="asset-ico"><svg viewBox="0 0 24 24"><path d="M12 3v12M7 10l5 5 5-5M5 21h14"/></svg></span>'
          + '<span class="asset-name">' + escapeHtml(a.name) + '</span>'
          + (size ? '<span class="asset-size">' + size + '</span>' : '')
          + '<span class="asset-go">' + bi('Tải về', 'Download') + ' &rarr;</span>'
          + '</a>';
      }).join('')
    : '<div class="asset-none">' + bi('Không có file đính kèm.', 'No attached files.') + '</div>';
  return '<div class="asset-list">' + assets + '</div>';
}

const RELEASES_API = 'https://api.github.com/repos/Ynnyny/Witch_launcher/releases?per_page=30';
const CACHE_KEY = 'witch_releases_cache_v1';
const CACHE_TTL = 10 * 60 * 1000; // 10 phút
let allReleases = [];

function readCache(allowStale) {
  try {
    const raw = localStorage.getItem(CACHE_KEY);
    if (!raw) return null;
    const o = JSON.parse(raw);
    if (!o || !Array.isArray(o.data) || !o.data.length) return null;
    if (!allowStale && Date.now() - o.time > CACHE_TTL) return null; // hết hạn
    return o.data;
  } catch (e) { return null; }
}
function writeCache(data) {
  try { localStorage.setItem(CACHE_KEY, JSON.stringify({ time: Date.now(), data })); } catch (e) {}
}
function renderTable(stale) {
  let html = '<div class="rel-table">';
  allReleases.forEach((r, i) => {
    const date = r.published_at ? new Date(r.published_at).toLocaleDateString() : '';
    const pre = !!r.prerelease;
    const badge = pre
      ? '<span class="rel-badge pre">' + bi('Pre-release', 'Pre-release') + '</span>'
      : '<span class="rel-badge rel">' + bi('Release', 'Release') + '</span>';
    const latest = i === 0 ? '<span class="rel-badge latest">' + bi('Mới nhất', 'Latest') + '</span>' : '';
    html += '<div class="rel-row-wrap">'
      + '<button class="rel-row" type="button" data-i="' + i + '" aria-expanded="false">'
        + '<span class="rel-ver">' + escapeHtml(r.tag_name || '') + '</span>'
        + latest + badge
        + '<span class="rel-date">' + date + '</span>'
        + '<span class="rel-caret"><svg viewBox="0 0 24 24"><path d="M6 9l6 6 6-6"/></svg></span>'
      + '</button>'
      + '<div class="rel-body" id="rel-body-' + i + '" hidden></div>'
      + '</div>';
  });
  html += '</div>';
  if (stale) html += '<div class="rel-stale">' + bi('Đang hiển thị bản cache (chưa thể làm mới lúc này).', 'Showing cached data (could not refresh now).') + '</div>';
  document.getElementById('releaseList').innerHTML = html;
}
async function loadReleases() {
  const list = document.getElementById('releaseList');
  const ver = document.getElementById('statusVer');
  if (!list) return;
  const cached = readCache(false);
  if (cached) {
    allReleases = cached;
    if (ver && allReleases[0]) ver.textContent = allReleases[0].tag_name || ver.textContent;
    renderTable(false);
    return;
  }
  try {
    const res = await fetch(RELEASES_API, { headers: { 'Accept': 'application/vnd.github+json' } });
    if (!res.ok) throw new Error('HTTP ' + res.status);
    const releases = await res.json();
    const real = releases.filter(r => !r.draft);
    if (!real.length) throw new Error('empty');
    writeCache(real);
    allReleases = real;
    if (ver && real[0].tag_name) ver.textContent = real[0].tag_name;
    renderTable(false);
  } catch (e) {
    const stale = readCache(true); // dùng cache cũ dù hết hạn
    if (stale && stale.length) {
      allReleases = stale;
      if (ver && allReleases[0]) ver.textContent = allReleases[0].tag_name || ver.textContent;
      renderTable(true);
      return;
    }
    list.innerHTML = '<div class="release-fallback">'
      + '<p>' + bi('Không thể tải từ GitHub.', 'Could not load from GitHub.') + '</p>'
      + '<a class="btn btn-primary" href="https://github.com/Ynnyny/Witch_launcher/releases" target="_blank" rel="noopener">'
      + bi('Mở trang Releases', 'Open Releases page') + '</a></div>';
  }
}
// Lazy: chỉ render file của version khi người dùng bấm vào
document.getElementById('releaseList').addEventListener('click', (ev) => {
  const row = ev.target.closest('.rel-row');
  if (!row) return;
  const i = +row.dataset.i;
  const body = document.getElementById('rel-body-' + i);
  if (!body) return;
  const open = row.getAttribute('aria-expanded') === 'true';
  if (open) {
    row.setAttribute('aria-expanded', 'false');
    body.hidden = true;
  } else {
    row.setAttribute('aria-expanded', 'true');
    if (!body.dataset.loaded) {
      body.innerHTML = renderAssets(allReleases[i]);
      body.dataset.loaded = '1';
    }
    body.hidden = false;
  }
});
loadReleases();
