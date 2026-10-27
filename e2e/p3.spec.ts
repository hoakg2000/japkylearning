import { expect, test } from '@playwright/test';

test.describe('P3 showcase', () => {
  test('embed kanji is cookie-free and frameable by any site', async ({ request }) => {
    const res = await request.get('/embed/kanji/%E5%AD%A6');
    expect(res.status()).toBe(200);
    expect(res.headers()['content-security-policy']).toContain('frame-ancestors *');
    expect(res.headers()['set-cookie']).toBeUndefined();
    const html = await res.text();
    expect(html).toContain('HỌC');
  });

  test('embed of an unknown kanji shows no widget', async ({ request }) => {
    const res = await request.get('/embed/kanji/%E9%BE%8D');
    const html = await res.text();
    expect(html).not.toContain('<svg');
    expect(html).toContain('not found');
  });

  test('text-to-speech refuses guests and unknown voices', async ({ request }) => {
    expect((await request.get('/api/tts?word=jmdict-1206900&voice=x')).status()).toBe(401);
  });

  test('admin area is hidden from guests with HTTP 404 (F11)', async ({ page }) => {
    const res = await page.goto('/vi/admin');
    expect(res?.status()).toBe(404);
    await expect(page.getByRole('heading', { name: '404' })).toBeVisible();
    await expect(page.getByRole('heading', { name: 'Quản trị' })).toBeHidden();
  });

  test('AI test: a visitor without session sees the sign-in prompt, not questions', async ({ page }) => {
    await page.goto('/vi/tests/ai');
    await expect(page.getByRole('link', { name: 'Đăng nhập' })).toBeVisible();
  });

  test('AI test: a learner with too few words is told what to do', async ({ page }) => {
    const email = `p3-${Date.now()}-${Math.random().toString(36).slice(2, 6)}@example.com`;
    await page.goto('/vi/sign-up');
    await page.getByLabel('Email', { exact: true }).fill(email);
    await page.getByLabel(/Mật khẩu/).fill('password-123');
    await page.getByLabel('Năm sinh').fill('1995');
    await page.getByLabel(/Tôi đồng ý tạo tài khoản/).check();
    await page.getByRole('button', { name: 'Tạo tài khoản' }).click();
    await page.waitForURL(/\/vi\/home/);
    await page.goto('/vi/tests/ai');
    await expect(page.getByText('Học ít nhất 4 từ để có bài test.')).toBeVisible();
    // A signed-in non-admin gets the same 404 status.
    expect((await page.goto('/vi/admin'))?.status()).toBe(404);
  });
});
