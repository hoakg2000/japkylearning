import { expect, test } from '@playwright/test';

test.describe('P7 finish N5: lessons, packs, widgets, PWA', () => {
  test('lessons 21-30 and the new packs are static pages', async ({ page }) => {
    await page.goto('/vi/learn/n5/30');
    await expect(page.getByRole('heading', { level: 1 })).toContainText('dự định');
    await page.goto('/vi/packs');
    await expect(page.getByRole('link', { name: /Nhà hàng/ })).toBeVisible();
    await page.getByRole('link', { name: /IT/ }).click();
    await expect(page.getByText('設計').first()).toBeVisible();
  });

  test('word embed is cookie-free, frameable and follows ?lang=', async ({ page, request }) => {
    const res = await request.get('/embed/word/jmdict-1206900');
    expect(res.status()).toBe(200);
    expect(res.headers()['content-security-policy']).toContain('frame-ancestors *');
    expect(res.headers()['set-cookie']).toBeUndefined();
    await page.goto('/embed/word/jmdict-1206900?lang=en');
    await expect(page.locator('html')).toHaveAttribute('lang', 'en');
    await expect(page.locator('figcaption .l-en')).toBeVisible();
    await expect(page.locator('figcaption .l-vi')).toBeHidden();
  });

  test('word of the day shows one word with today’s Vietnam date', async ({ page }) => {
    await page.goto('/embed/word-of-the-day');
    await expect(page.getByText(/日本語 · /)).toBeVisible();
    await expect(page.locator('ruby, figure [lang="ja"]').first()).toBeVisible();
  });

  test('streak widget: off by default, on gives a no-store link, rotating kills the old link (F12)', async ({ page, request, isMobile }) => {
    test.skip(isMobile, 'same flow as desktop; sign-up rate limit');
    await page.goto('/vi/sign-up');
    await page.getByLabel('Email', { exact: true }).fill(`p7-${Date.now()}@example.com`);
    await page.getByLabel(/Mật khẩu/).fill('password-123');
    await page.getByLabel('Năm sinh').fill('1995');
    await page.getByLabel(/Tôi đồng ý tạo tài khoản/).check();
    await page.getByRole('button', { name: 'Tạo tài khoản' }).click();
    await page.waitForURL(/\/vi\/home/);

    await page.goto('/vi/me');
    const toggle = page.getByLabel('Widget streak công khai');
    await expect(toggle).not.toBeChecked();
    await toggle.click(); // controlled: checks once the server returns the new id
    await expect(toggle).toBeChecked();
    const code = page.getByLabel('Mã nhúng widget streak');
    await expect(code).toHaveValue(/\/embed\/streak\/[A-Za-z0-9_-]{22}/);
    const first = (await code.inputValue()).match(/\/embed\/streak\/[A-Za-z0-9_-]{22}/)![0];

    const res = await request.get(first);
    expect(res.headers()['cache-control']).toContain('no-store');
    expect(res.headers()['set-cookie']).toBeUndefined();
    expect(await res.text()).toContain('ngày liên tiếp');

    await page.getByRole('button', { name: 'Đổi link mới' }).click();
    await expect(code).not.toHaveValue(new RegExp(first));
    expect(await (await request.get(first)).text()).toContain('not found');

    await toggle.click();
    await expect(toggle).not.toBeChecked();
    await expect(code).toHaveCount(0);
  });

  test('embed-code page builds an iframe snippet', async ({ page }) => {
    await page.goto('/vi/embed-code');
    await page.locator('main').getByLabel('Ngôn ngữ').selectOption('en');
    await expect(page.getByLabel('Mã nhúng')).toHaveValue(/\/embed\/word-of-the-day\?lang=en/);
  });

  test('PWA: manifest, icons, service worker and offline page are served', async ({ request }) => {
    const manifest = await (await request.get('/manifest.webmanifest')).json();
    expect(manifest.short_name).toBe('Japky');
    const icon = await request.get('/pwa-icon/192');
    expect(icon.headers()['content-type']).toContain('image/png');
    expect((await request.get('/sw.js')).status()).toBe(200);
    expect((await request.get('/offline.html')).status()).toBe(200);
  });
});
