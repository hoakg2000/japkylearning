'use client';
// Client-side display preferences mirrored to <html data-*> (read before paint by public/ui-mode.js).

export type DisplayPrefs = { furigana: 'always' | 'unlearned' | 'never'; romaji: boolean; hanViet: boolean };
const KEY = 'japky-display';

export function readDisplayPrefs(): DisplayPrefs {
  const html = document.documentElement;
  return {
    furigana: html.dataset.furigana === 'off' ? 'never' : 'always',
    romaji: html.dataset.romaji !== 'off',
    hanViet: html.dataset.hanviet !== 'off',
  };
}

export function writeDisplayPrefs(p: DisplayPrefs) {
  const html = document.documentElement;
  html.dataset.furigana = p.furigana === 'never' ? 'off' : 'on';
  html.dataset.romaji = p.romaji ? 'on' : 'off';
  html.dataset.hanviet = p.hanViet ? 'on' : 'off';
  try {
    localStorage.setItem(KEY, JSON.stringify(p));
  } catch {}
}
