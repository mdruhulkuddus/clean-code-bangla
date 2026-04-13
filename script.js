// Chapter data
const chapters = [
  { id: 1, bn: "পরিচ্ছন্ন কোড", en: "Clean Code" },
  { id: 2, bn: "অর্থবহ নামকরণ", en: "Meaningful Names" },
  { id: 3, bn: "ফাংশন", en: "Functions" },
  { id: 4, bn: "কমেন্টস", en: "Comments" },
  { id: 5, bn: "ফরম্যাটিং", en: "Formatting" },
  { id: 6, bn: "অবজেক্ট ও ডাটা স্ট্রাকচার", en: "Objects and Data Structures" },
  { id: 7, bn: "এরর হ্যান্ডলিং", en: "Error Handling" },
  { id: 8, bn: "বাউন্ডারিজ", en: "Boundaries" },
  { id: 9, bn: "ইউনিট টেস্ট", en: "Unit Tests" },
  { id: 10, bn: "ক্লাস", en: "Classes" },
  { id: 11, bn: "সিস্টেমস", en: "Systems" },
  { id: 12, bn: "ইমার্জেন্স", en: "Emergence" },
  { id: 13, bn: "কনকারেন্সি", en: "Concurrency" },
  { id: 14, bn: "ধারাবাহিক পরিমার্জন", en: "Successive Refinement" },
  { id: 15, bn: "JUnit ইন্টার্নালস", en: "JUnit Internals" },
  { id: 16, bn: "SerialDate রিফ্যাক্টরিং", en: "Refactoring SerialDate" },
  { id: 17, bn: "স্মেলস ও হিউরিস্টিকস", en: "Smells and Heuristics" },
  { id: 18, bn: "এপেন্ডিক্স", en: "Appendix" },
];

let currentChapter = 1;

// DOM elements
const sidebarNav = document.getElementById("sidebarNav");
const sidebar = document.getElementById("sidebar");
const sidebarOverlay = document.getElementById("sidebarOverlay");
const sidebarClose = document.getElementById("sidebarClose");
const menuBtn = document.getElementById("menuBtn");
const chapterContent = document.getElementById("chapterContent");
const chapterNav = document.getElementById("chapterNav");
const themeToggle = document.getElementById("themeToggle");
const themeIcon = document.getElementById("themeIcon");

// Build sidebar
function buildSidebar() {
  sidebarNav.innerHTML = chapters.map(ch => `
    <button class="sidebar-item${ch.id === currentChapter ? ' active' : ''}" data-id="${ch.id}">
      <span class="sidebar-num">${String(ch.id).padStart(2, '0')}</span>
      <div>
        <div class="sidebar-title-bn">${ch.bn}</div>
        <div class="sidebar-title-en">${ch.en}</div>
      </div>
    </button>
  `).join('');
}

// Load chapter
async function loadChapter(id) {
  currentChapter = id;
  const ch = chapters[id - 1];
  const pad = String(id).padStart(2, '0');

  // Show chapter header + loading
  chapterContent.innerHTML = `
    <div class="chapter-header-num">অধ্যায় ${pad}</div>
    <h1 class="chapter-header-bn">${ch.bn}</h1>
    <p class="chapter-header-en">${ch.en}</p>
    <div class="chapter-divider"></div>
    <div class="chapter-body"><p>লোড হচ্ছে...</p></div>
  `;

  try {
    // Special handling for Appendix (id 18)
    const chapterFile = id === 18 ? 'chapters/appendix.html' : `chapters/chapter-${pad}.html`;
    const res = await fetch(chapterFile);
    if (!res.ok) throw new Error("Not found");
    const html = await res.text();
    chapterContent.innerHTML = `
      <div class="chapter-header-num">অধ্যায় ${pad}</div>
      <h1 class="chapter-header-bn">${ch.bn}</h1>
      <p class="chapter-header-en">${ch.en}</p>
      <div class="chapter-divider"></div>
      <div class="chapter-body">${html}</div>
    `;
  } catch {
    chapterContent.querySelector('.chapter-body').innerHTML =
      '<p>এই অধ্যায়ের বিষয়বস্তু শীঘ্রই আসছে...</p>';
  }

  // Build nav
  buildChapterNav();
  buildSidebar();
  window.scrollTo({ top: 0, behavior: 'smooth' });

  // Update URL hash
  history.replaceState(null, '', `#chapter-${pad}`);
}

// Build prev/next nav
function buildChapterNav() {
  const prev = currentChapter > 1 ? chapters[currentChapter - 2] : null;
  const next = currentChapter < chapters.length ? chapters[currentChapter] : null;

  chapterNav.innerHTML = `
    ${prev ? `
      <button class="nav-btn prev" onclick="loadChapter(${prev.id})">
        <div class="nav-btn-label">← পূর্ববর্তী</div>
        <div class="nav-btn-title">${prev.bn}</div>
      </button>
    ` : '<div class="nav-spacer"></div>'}
    ${next ? `
      <button class="nav-btn next" onclick="loadChapter(${next.id})">
        <div class="nav-btn-label">পরবর্তী →</div>
        <div class="nav-btn-title">${next.bn}</div>
      </button>
    ` : '<div class="nav-spacer"></div>'}
  `;
}

// Sidebar toggle
function openSidebar() {
  sidebar.classList.add('open');
  sidebarOverlay.classList.add('open');
}
function closeSidebar() {
  sidebar.classList.remove('open');
  sidebarOverlay.classList.remove('open');
}

menuBtn.addEventListener('click', openSidebar);
sidebarClose.addEventListener('click', closeSidebar);
sidebarOverlay.addEventListener('click', closeSidebar);

sidebarNav.addEventListener('click', (e) => {
  const btn = e.target.closest('.sidebar-item');
  if (btn) {
    loadChapter(Number(btn.dataset.id));
    closeSidebar();
  }
});

// Theme toggle
function setTheme(dark) {
  document.documentElement.setAttribute('data-theme', dark ? 'dark' : 'light');
  localStorage.setItem('theme', dark ? 'dark' : 'light');
  // Swap icon
  themeIcon.innerHTML = dark
    ? '<circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/>'
    : '<path d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z"/>';
}

themeToggle.addEventListener('click', () => {
  const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
  setTheme(!isDark);
});

// Init
(function init() {
  // Theme
  const saved = localStorage.getItem('theme');
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  setTheme(saved === 'dark' || (!saved && prefersDark));

  // Load from hash or default
  const hash = window.location.hash;
  const match = hash.match(/chapter-(\d+)/);
  const startId = match ? Math.min(Math.max(Number(match[1]), 1), chapters.length) : 1;
  loadChapter(startId);
})();
