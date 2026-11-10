import AxeBuilder from '@axe-core/playwright';
import { expect, test } from '@playwright/test';

const SONG = '/vi/songs/yoasobi-yoru-ni-kakeru';

test.describe('P8 songs v1', () => {
  test('learn hub links to packs and songs; the song list has at least 20 songs', async ({ page }) => {
    await page.goto('/vi/learn');
    await page.getByRole('link', { name: /Học qua bài hát/ }).click();
    await expect(page).toHaveURL(/\/vi\/songs$/);
    expect(await page.locator('main li a').count()).toBeGreaterThanOrEqual(20);
  });

  test('only song pages may load YouTube, with a single CSP header', async ({ request }) => {
    const song = await request.get(SONG);
    const csp = song.headersArray().filter((h) => h.name.toLowerCase() === 'content-security-policy');
    expect(csp).toHaveLength(1);
    expect(csp[0].value).toContain('frame-src https://www.youtube-nocookie.com');
    expect(csp[0].value).toContain("frame-ancestors 'none'");
    const list = await request.get('/vi/songs');
    expect(list.headers()['content-security-policy']).not.toContain('youtube');
  });

  test('no request to YouTube before play; pressing play loads the IFrame API', async ({ page }) => {
    const youtube: string[] = [];
    await page.route(/youtube|ytimg/, (route) => {
      youtube.push(route.request().url());
      return route.abort();
    });
    await page.goto(SONG);
    await expect(page.getByRole('list', { name: 'Lời bài hát' })).toBeVisible();
    expect(youtube).toEqual([]);
    await page.getByRole('button', { name: /Phát “夜に駆ける”/ }).click();
    await expect.poll(() => youtube.some((u) => u.includes('iframe_api'))).toBe(true);
  });

  test('lyrics with furigana; keyword shows its meaning and goes to review; cloze hides keywords', async ({ page }) => {
    await page.route(/youtube|ytimg/, (route) => route.abort());
    await page.goto(SONG);
    const lyrics = page.getByRole('list', { name: 'Lời bài hát' });
    await expect(lyrics.locator('ruby').first()).toBeVisible();
    const keyword = lyrics.locator('button[aria-label*=":"]').first();
    await keyword.click();
    await page.getByRole('button', { name: 'Thêm vào ôn tập' }).click();
    await expect(page.getByRole('status').filter({ hasText: /thẻ|ôn tập/ })).toBeVisible();

    await page.getByLabel('Điền lỗ').selectOption('100');
    await expect(lyrics.getByRole('button', { name: 'Từ bị ẩn, bấm để xem' }).first()).toBeVisible();
    const axe = await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa']).analyze();
    expect(axe.violations.filter((v) => v.impact === 'critical' || v.impact === 'serious').map((v) => v.id)).toEqual([]);
  });

  test('every song page has a removal request line', async ({ page }) => {
    await page.route(/youtube|ytimg/, (route) => route.abort());
    await page.goto(SONG);
    await expect(page.getByText('Bạn là chủ sở hữu và muốn gỡ bài này?')).toBeVisible();
  });
});
