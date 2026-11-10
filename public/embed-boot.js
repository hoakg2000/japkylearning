/* eslint-disable */
// Embed pages (F12): ?theme=light|dark and ?lang=vi|en are applied in the browser so the pages stay static.
// The only message sent to the host page is the content height.
(function () {
  try {
    var p = new URLSearchParams(location.search);
    var d = document.documentElement;
    var t = p.get('theme');
    if (t === 'dark' || (t !== 'light' && matchMedia('(prefers-color-scheme: dark)').matches)) d.classList.add('dark');
    if (p.get('lang') === 'en') d.lang = 'en';
    var send = function () {
      if (parent !== window) parent.postMessage({ japkyHeight: d.scrollHeight }, '*');
    };
    addEventListener('load', send);
    if (window.ResizeObserver) new ResizeObserver(send).observe(d);
  } catch (e) {}
})();
