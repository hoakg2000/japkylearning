import { expect, test, type Page } from '@playwright/test';
import grammar from '../content/levels/n5/grammar.json';
import words from '../content/levels/n5/words.json';

type W = (typeof words)[number];

/** Captures the text passed to speechSynthesis so listening questions can be answered. */
async function spySpeech(page: Page) {
  await page.addInitScript(() => {
    const w = window as unknown as { __spoken: string[] };
    w.__spoken = [];
    const orig = window.speechSynthesis.speak.bind(window.speechSynthesis);
    window.speechSynthesis.speak = (u: SpeechSynthesisUtterance) => {
      w.__spoken.push(u.text);
      try {
        orig(u);
      } catch {}
    };
  });
}

const baseText = (page: Page, selector: string) =>
  page.locator(selector).first().evaluate((el) => {
    const c = el.cloneNode(true) as HTMLElement;
    c.querySelectorAll('rt, rp').forEach((n) => n.remove());
    return (c.textContent ?? '').trim();
  });

/** Picks the correct option for the current lesson-test question using the content files. */
async function answerCorrectly(page: Page) {
  const prompt = (await page.locator('.min-h-36 p.text-sm').first().textContent())?.trim() ?? '';
  const options = page.locator('.grid button');
  const texts = await options.evaluateAll((els) =>
    els.map((el) => {
      const c = el.cloneNode(true) as HTMLElement;
      c.querySelectorAll('rt, rp, .text-xs').forEach((n) => n.remove());
      return (c.textContent ?? '').trim();
    }),
  );
  let target = '';
  if (prompt.includes('nghĩa')) {
    const surface = await baseText(page, '.min-h-36 [lang=ja]');
    target = (words as W[]).find((w) => w.surface === surface)!.meanings.vi;
  } else if (prompt.includes('Đọc')) {
    const surface = await baseText(page, '.min-h-36 [lang=ja]');
    target = (words as W[]).find((w) => w.surface === surface)!.reading;
  } else if (prompt.includes('nghe')) {
    const spoken = await page.evaluate(() => (window as unknown as { __spoken: string[] }).__spoken.at(-1));
    target = texts.find((t) => (words as W[]).some((w) => w.surface === t && w.reading === spoken)) ?? '';
  } else {
    const sentence = (await page.locator('.min-h-36 p[lang=ja]').textContent())?.replace(/ /g, '') ?? '';
    const c = grammar.flatMap((g) => g.cloze).find((x) => x.ja.replace(x.blank, '') === sentence);
    target = c?.blank ?? '';
  }
  const index = texts.indexOf(target);
  expect(index, `answer "${target}" for "${prompt}" in ${JSON.stringify(texts)}`).toBeGreaterThanOrEqual(0);
  await options.nth(index).click();
}

test.describe('P2 N5 core', () => {
  test('lesson page is static, shows vocabulary with Hán-Việt and grammar', async ({ page }) => {
    await page.goto('/vi/learn/n5/1');
    await expect(page.getByRole('heading', { level: 1 })).toHaveText('Chào hỏi, tự giới thiệu');
    await expect(page.getByText('HỌC SINH').first()).toBeVisible();
    await expect(page.getByRole('heading', { name: /N1 は N2 です/ })).toBeVisible();
    await page.getByRole('button', { name: 'Hán-Việt' }).click();
    await expect(page.getByText('HỌC SINH').first()).toBeHidden();
  });

  test('kanji and word pages', async ({ page }) => {
    await page.goto('/vi/kanji/学');
    await expect(page.getByText('HỌC', { exact: true })).toBeVisible();
    await expect(page.getByRole('img', { name: /Thứ tự nét của 学/ })).toBeVisible();
    await page.goto('/en/words/jmdict-1206900');
    await expect(page.getByText('student (esp. a university student)').or(page.getByText('học sinh, sinh viên'))).toBeVisible();
    const sitemap = await page.request.get('/sitemap.xml');
    expect(await sitemap.text()).toContain('/vi/kanji/');
  });

  test('pass lesson 1 test → cards created → review → Today', async ({ page }) => {
    test.setTimeout(120_000);
    await spySpeech(page);
    await page.goto('/vi/learn/n5/1/practice?step=test');
    await expect(page.getByText(/Câu 1\//)).toBeVisible();
    const total = Number((await page.getByText(/Câu 1\/\d+/).textContent())!.split('/')[1]);
    for (let i = 0; i < total; i++) {
      await expect(page.getByText(`Câu ${i + 1}/${total}`)).toBeVisible();
      await answerCorrectly(page);
    }
    await expect(page.getByText('100%')).toBeVisible({ timeout: 20_000 });
    await expect(page.getByText(/Đã thêm \d+ thẻ/)).toBeVisible();

    await page.goto('/vi/home');
    await expect(page.getByText(/Ôn \d+ thẻ/).first()).toBeVisible();

    await page.goto('/vi/review');
    for (let i = 0; i < 3; i++) {
      await page.getByRole('button', { name: 'Hiện đáp án' }).click();
      await page.getByRole('button', { name: /Nhớ/ }).click();
    }
    await expect(page.getByText(/4\/20|4\/\d+/)).toBeVisible();

    await page.goto('/vi/learn/n5');
    await expect(page.getByText('✓ Đã xong').first()).toBeVisible();
  });
});
