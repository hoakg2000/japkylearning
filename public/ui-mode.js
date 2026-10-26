/* eslint-disable */
// Sets Full/Minimal UI mode before paint (docs/06-UI-UX.md §4). Loaded as a file: CSP has no inline-script nonce.
(function () {
  var mode = 'full';
  try {
    mode = localStorage.getItem('japky-ui') || (matchMedia('(prefers-reduced-motion: reduce)').matches ? 'minimal' : 'full');
  } catch (_) {}
  document.documentElement.dataset.ui = mode;
})();
