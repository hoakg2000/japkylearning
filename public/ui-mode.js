/* eslint-disable */
// Sets UI mode and display preferences before paint (docs/06-UI-UX.md §4).
// Loaded as a file: the CSP has no inline-script nonce (ADR 0013).
(function () {
  var html = document.documentElement;
  var mode = 'full';
  var display = {};
  try {
    mode = localStorage.getItem('japky-ui') || (matchMedia('(prefers-reduced-motion: reduce)').matches ? 'minimal' : 'full');
    display = JSON.parse(localStorage.getItem('japky-display') || '{}');
  } catch (_) {}
  html.dataset.ui = mode;
  html.dataset.furigana = display.furigana === 'never' ? 'off' : 'on';
  html.dataset.romaji = display.romaji === false ? 'off' : 'on';
  // Hán-Việt defaults on for Vietnamese, off for English (F13).
  var hv = display.hanViet === undefined ? html.lang === 'vi' : display.hanViet;
  html.dataset.hanviet = hv ? 'on' : 'off';
})();
