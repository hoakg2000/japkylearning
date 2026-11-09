import 'server-only';
import { getTranslations } from 'next-intl/server';

const POS = ['n', 'v1', 'v5', 'vs', 'vk', 'adj-i', 'adj-na', 'adj-no', 'adv', 'exp', 'num', 'pn', 'int', 'prt', 'vt', 'vi', 'n-adv', 'ctr', 'suf', 'pref'] as const;

/** Translated labels for WordCard (server components). */
export async function wordLabels() {
  const t = await getTranslations('Word');
  const pos: Record<string, string> = {};
  for (const p of POS) pos[p] = t(`pos.${p}`);
  // JMdict godan codes (v5k, v5m, v5u…) share one label.
  for (const v of ['v5k', 'v5g', 'v5s', 'v5t', 'v5n', 'v5b', 'v5m', 'v5r', 'v5u', 'v5k-s', 'v5r-i', 'v5aru']) pos[v] = t('pos.v5');
  return { example: t('example'), strokes: t('strokes'), details: t('details'), pos };
}
