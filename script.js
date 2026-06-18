// Chapter data
// bnFile / enFile point to the source HTML for each language (null = not available yet)
const chapters = [
  { id: 1, bn: "পরিচ্ছন্ন কোড", en: "Clean Code", bnFile: "chapters/chapter-01.html", enFile: "chapters-en/clean_code_ch1_clean_code.html" },
  { id: 2, bn: "অর্থবহ নামকরণ", en: "Meaningful Names", bnFile: "chapters/chapter-02.html", enFile: "chapters-en/clean_code_ch2_meaningful_names.html" },
  { id: 3, bn: "ফাংশন", en: "Functions", bnFile: "chapters/chapter-03.html", enFile: "chapters-en/clean_code_ch3_functions.html" },
  { id: 4, bn: "কমেন্টস", en: "Comments", bnFile: "chapters/chapter-04.html", enFile: "chapters-en/clean_code_ch4_comments.html" },
  { id: 5, bn: "ফরম্যাটিং", en: "Formatting", bnFile: "chapters/chapter-05.html", enFile: "chapters-en/clean_code_ch5_formatting.html" },
  { id: 6, bn: "অবজেক্ট ও ডাটা স্ট্রাকচার", en: "Objects and Data Structures", bnFile: "chapters/chapter-06.html", enFile: "chapters-en/clean_code_ch6_objects_data.html" },
  { id: 7, bn: "এরর হ্যান্ডলিং", en: "Error Handling", bnFile: "chapters/chapter-07.html", enFile: "chapters-en/clean_code_ch7_error_handling.html" },
  { id: 8, bn: "বাউন্ডারিজ", en: "Boundaries", bnFile: "chapters/chapter-08.html", enFile: "chapters-en/clean_code_ch8_boundaries.html" },
  { id: 9, bn: "ইউনিট টেস্ট", en: "Unit Tests", bnFile: "chapters/chapter-09.html", enFile: "chapters-en/clean_code_ch9_unit_tests.html" },
  { id: 10, bn: "ক্লাস", en: "Classes", bnFile: "chapters/chapter-10.html", enFile: "chapters-en/clean_code_ch10_classes.html" },
  { id: 11, bn: "সিস্টেমস", en: "Systems", bnFile: "chapters/chapter-11.html", enFile: "chapters-en/clean_code_ch11_systems.html" },
  { id: 12, bn: "ইমার্জেন্স", en: "Emergence", bnFile: "chapters/chapter-12.html", enFile: "chapters-en/clean_code_ch12_emergence.html" },
  { id: 13, bn: "কনকারেন্সি", en: "Concurrency", bnFile: "chapters/chapter-13.html", enFile: "chapters-en/clean_code_ch13_concurrency.html" },
  { id: 14, bn: "ধারাবাহিক পরিমার্জন", en: "Successive Refinement", bnFile: "chapters/chapter-14.html", enFile: "chapters-en/clean_code_ch14_successive_refinement.html" },
  { id: 15, bn: "JUnit ইন্টার্নালস", en: "JUnit Internals", bnFile: "chapters/chapter-15.html", enFile: "chapters-en/clean_code_ch15_junit_internals.html" },
  { id: 16, bn: "SerialDate রিফ্যাক্টরিং", en: "Refactoring SerialDate", bnFile: "chapters/chapter-16.html", enFile: "chapters-en/clean_code_ch16_refactoring_serialdate.html" },
  { id: 17, bn: "স্মেলস ও হিউরিস্টিকস", en: "Smells and Heuristics", bnFile: "chapters/chapter-17.html", enFile: "chapters-en/clean_code_ch17_smells_heuristics.html" },
  { id: 18, bn: "এপেন্ডিক্স", en: "Appendix", bnFile: "chapters/appendix.html", enFile: "chapters-en/clean_code_ch18_appendixA_concurrency_ii.html" },
];

let currentChapter = 1;
let currentLang = "bn"; // 'bn' | 'en'

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
  sidebarNav.innerHTML = chapters.map(ch => {
    const isActive = ch.id === currentChapter;
    const bnDisabled = !ch.bnFile ? ' disabled' : '';
    const enDisabled = !ch.enFile ? ' disabled' : '';
    const bnActive = isActive && currentLang === 'bn' ? ' active' : '';
    const enActive = isActive && currentLang === 'en' ? ' active' : '';
    return `
    <div class="sidebar-group${isActive ? ' open' : ''}" data-id="${ch.id}">
      <button class="sidebar-item sidebar-toggle${isActive ? ' active' : ''}" data-id="${ch.id}">
        <span class="sidebar-num">${String(ch.id).padStart(2, '0')}</span>
        <div class="sidebar-titles">
          <div class="sidebar-title-en">${ch.en}</div>
          <div class="sidebar-title-bn">${ch.bn}</div>
        </div>
        <svg class="sidebar-caret" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="6 9 12 15 18 9"/></svg>
      </button>
      <div class="sidebar-submenu">
        <button class="sidebar-sub${enActive}${enDisabled}" data-id="${ch.id}" data-lang="en"${enDisabled ? ' disabled' : ''}>
          English view${ch.enFile ? '' : ' <span class="sub-soon">(soon)</span>'}
        </button>
        <button class="sidebar-sub${bnActive}${bnDisabled}" data-id="${ch.id}" data-lang="bn"${bnDisabled ? ' disabled' : ''}>
          বাংলা ভিউ${ch.bnFile ? '' : ' <span class="sub-soon">(শীঘ্রই)</span>'}
        </button>
      </div>
    </div>
  `;
  }).join('');
}

// Load chapter
async function loadChapter(id, lang = currentLang) {
  const ch = chapters[id - 1];
  if (!ch) return;

  // Fall back to whichever language is available for this chapter
  if (lang === 'bn' && !ch.bnFile && ch.enFile) lang = 'en';
  if (lang === 'en' && !ch.enFile && ch.bnFile) lang = 'bn';

  currentChapter = id;
  currentLang = lang;
  const pad = String(id).padStart(2, '0');
  const file = lang === 'en' ? ch.enFile : ch.bnFile;

  const headerHtml = `
    <div class="chapter-header-num">${lang === 'en' ? 'Chapter' : 'অধ্যায়'} ${pad}</div>
    <h1 class="chapter-header-bn">${lang === 'en' ? ch.en : ch.bn}</h1>
    <p class="chapter-header-en">${lang === 'en' ? ch.bn : ch.en}</p>
    <span class="chapter-lang-badge">${lang === 'en' ? 'English' : 'বাংলা'}</span>
    <div class="chapter-divider"></div>
  `;

  // Show chapter header + loading
  chapterContent.innerHTML = `${headerHtml}<div class="chapter-body"><p>${lang === 'en' ? 'Loading...' : 'লোড হচ্ছে...'}</p></div>`;

  try {
    if (!file) throw new Error("Not available");
    const res = await fetch(file);
    if (!res.ok) throw new Error("Not found");
    const html = await res.text();
    chapterContent.innerHTML = `${headerHtml}<div class="chapter-body">${html}</div>`;
  } catch {
    chapterContent.querySelector('.chapter-body').innerHTML =
      lang === 'en'
        ? '<p>This chapter is coming soon...</p>'
        : '<p>এই অধ্যায়ের বিষয়বস্তু শীঘ্রই আসছে...</p>';
  }

  // Build nav
  buildChapterNav();
  buildSidebar();
  window.scrollTo({ top: 0, behavior: 'smooth' });

  // Update URL hash
  history.replaceState(null, '', `#chapter-${pad}-${lang}`);
}

// Build prev/next nav
function buildChapterNav() {
  const prev = currentChapter > 1 ? chapters[currentChapter - 2] : null;
  const next = currentChapter < chapters.length ? chapters[currentChapter] : null;
  const prevLabel = currentLang === 'en' ? '← Previous' : '← পূর্ববর্তী';
  const nextLabel = currentLang === 'en' ? 'Next →' : 'পরবর্তী →';
  const title = (ch) => currentLang === 'en' ? ch.en : ch.bn;

  chapterNav.innerHTML = `
    ${prev ? `
      <button class="nav-btn prev" onclick="loadChapter(${prev.id})">
        <div class="nav-btn-label">${prevLabel}</div>
        <div class="nav-btn-title">${title(prev)}</div>
      </button>
    ` : '<div class="nav-spacer"></div>'}
    ${next ? `
      <button class="nav-btn next" onclick="loadChapter(${next.id})">
        <div class="nav-btn-label">${nextLabel}</div>
        <div class="nav-btn-title">${title(next)}</div>
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
  // Language option clicked
  const sub = e.target.closest('.sidebar-sub');
  if (sub && !sub.disabled) {
    loadChapter(Number(sub.dataset.id), sub.dataset.lang);
    closeSidebar();
    return;
  }

  // Chapter header clicked -> toggle its dropdown
  const toggle = e.target.closest('.sidebar-toggle');
  if (toggle) {
    const group = toggle.closest('.sidebar-group');
    const isOpen = group.classList.contains('open');
    // Close other open groups
    sidebarNav.querySelectorAll('.sidebar-group.open').forEach(g => {
      if (g !== group) g.classList.remove('open');
    });
    group.classList.toggle('open', !isOpen);
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
  const match = hash.match(/chapter-(\d+)(?:-(bn|en))?/);
  const startId = match ? Math.min(Math.max(Number(match[1]), 1), chapters.length) : 1;
  const startLang = match && match[2] ? match[2] : 'bn';
  loadChapter(startId, startLang);
})();
