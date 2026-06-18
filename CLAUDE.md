# CLAUDE.md

Project context for working in this repository.

## What this is

A static, dependency-free book-reader website for *Clean Code* by Robert C. Martin.
Originally a Bangla-only reader; it now serves **both Bangla and English** versions of
each chapter. Pure HTML/CSS/vanilla JS — no build step, no framework, no package manager.

## Running it

`fetch()` is used to load chapter HTML, so it must be served over HTTP (not `file://`):

```powershell
python -m http.server 8000   # then open http://localhost:8000
```

## File structure

- `index.html` — single page shell: sidebar, header, reading area, footer.
- `script.js` — all behavior: chapter data, sidebar/dropdown, chapter loading, theme.
- `style.css` — all styling, with light/dark themes via `[data-theme]` CSS variables.
- `chapters/` — **Bangla** chapter HTML fragments (`chapter-01.html` … `chapter-12.html`,
  `chapter-16.html`, `chapter-17.html`, `appendix.html`).
- `chapters-en/` — **English** chapter HTML fragments (`clean_code_chN_*.html`, ch 1–17).

The files in `chapters/` and `chapters-en/` are HTML **fragments**, not full documents —
they are fetched and injected into `#chapterContent`'s `.chapter-body`.

## How it works

- `chapters` array in `script.js` is the single source of truth. Each entry has:
  `{ id, bn (title), en (title), bnFile, enFile }`. `bnFile`/`enFile` are `null` when that
  language is not yet available.
- The sidebar renders each chapter as a **dropdown**: clicking the chapter name expands an
  accordion with two options — **বাংলা ভিউ** and **English view**.
- `loadChapter(id, lang)` fetches the matching file and renders the header + body in that
  language. It auto-falls back to the available language if the requested one is missing.
- View state is reflected in the URL hash: `#chapter-03-en` (linkable / restored on reload).
- Theme (light/dark) is toggled via the header button and persisted in `localStorage`.

## Content coverage

All 18 chapters (1–17 + Appendix) are available in **both** Bangla and English.

The dropdown still supports per-language availability: if a `bnFile`/`enFile` is set to
`null`, that option renders disabled with a "(শীঘ্রই)" / "(soon)" tag and `loadChapter`
auto-falls back to the available language. When adding new content, drop the fragment in the
right folder and set its `bnFile`/`enFile` in the `chapters` array.

## Conventions

- The Bangla/English folders use **different naming schemes** — always map via the
  `chapters` array rather than deriving filenames.
- 2-space indentation; vanilla JS only; keep the no-build, no-dependency approach.
- UI strings appear in both Bangla and English depending on the active `lang`.
