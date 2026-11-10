import AxeBuilder from '@axe-core/playwright';
import { createHmac } from 'node:crypto';
import { expect, test } from '@playwright/test';

const serious = async (page: import('@playwright/test').Page) => {
  const axe = await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa']).analyze();
  return axe.violations.filter((v) => v.impact === 'critical' || v.impact === 'serious').map((v) => v.id);
};

test.describe('P5 packs, chat, reminders', () => {
  test('kaigo pack: listed, static, unreviewed note, accessible', async ({ page }) => {
    await page.goto('/vi/packs');
    await page.getByRole('link', { name: /Kaigo/ }).click();
    await expect(page).toHaveURL(/\/vi\/packs\/kaigo$/);
    await expect(page.getByRole('heading', { level: 1 })).toContainText('Kaigo');
    await expect(page.getByRole('note')).toBeVisible();
    await expect(page.getByText('介護').first()).toBeVisible();
    expect(await serious(page)).toEqual([]);
  });

  test('add the whole pack to review with one button; a second click adds nothing (F3)', async ({ page }) => {
    await page.goto('/vi/packs/kaigo');
    await page.getByRole('button', { name: 'Thêm tất cả vào ôn tập' }).click();
    await expect(page.getByRole('status')).toContainText(/Đã thêm \d+ thẻ/);
    await page.getByRole('button', { name: 'Thêm tất cả vào ôn tập' }).click();
    await expect(page.getByRole('status')).toContainText('Tất cả từ đã có trong ôn tập');
  });

  test('pack-only word and kanji have their own pages linking back to the pack', async ({ page }) => {
    await page.goto('/vi/words/japky-kaigoshi');
    await expect(page.getByRole('link', { name: 'Điều dưỡng (Kaigo)' })).toBeVisible();
    const res = await page.goto('/vi/kanji/%E8%AD%B7');
    expect(res?.status()).toBe(200);
    await expect(page.getByText('HỘ').first()).toBeVisible();
  });

  test('chat tutor is off by default: API 404 before any check', async ({ request }) => {
    const res = await request.post('/api/chat', { data: { locale: 'vi', messages: [{ role: 'user', content: 'は và が?' }] } });
    expect(res.status()).toBe(404);
  });

  test('reminder unsubscribe rejects an unsigned link', async ({ request }) => {
    expect((await request.get('/api/reminders/unsubscribe?u=someone&t=bad')).status()).toBe(400);
  });

  test('reminder unsubscribe: GET only asks (link scanners), POST turns it off (RFC 8058 one-click)', async ({ request }) => {
    // Same secret as the e2e server (playwright.config.ts).
    const t = createHmac('sha256', 'e2e-secret-e2e-secret-e2e-secret-32').update('unsubscribe:someone').digest('base64url');
    const url = `/api/reminders/unsubscribe?u=someone&t=${t}`;
    const get = await request.get(url);
    expect(get.status()).toBe(200);
    expect(await get.text()).toContain('<form method="post">');
    expect((await request.post(url)).status()).toBe(200);
    expect(await (await request.post(url, { form: { 'List-Unsubscribe': 'One-Click' } })).text()).toContain('Email reminders are off');
    expect((await request.post('/api/reminders/unsubscribe?u=someone&t=bad')).status()).toBe(400);
  });
});
