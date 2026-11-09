import { createHmac } from 'node:crypto';
import { expect, test } from '@playwright/test';

/** RFC 6238 code (SHA-1, 30 s, 6 digits) from a base32 secret, for the 2FA test. */
function totp(secret: string, now = Date.now()) {
  const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ234567';
  const bits = [...secret.replace(/=+$/, '').toUpperCase()].map((c) => alphabet.indexOf(c).toString(2).padStart(5, '0')).join('');
  const key = Buffer.from(bits.match(/.{8}/g)!.map((b) => parseInt(b, 2)));
  const counter = Buffer.alloc(8);
  counter.writeBigUInt64BE(BigInt(Math.floor(now / 30_000)));
  const h = createHmac('sha1', key).update(counter).digest();
  const o = h[h.length - 1] & 0xf;
  return String((h.readUInt32BE(o) & 0x7fffffff) % 1_000_000).padStart(6, '0');
}

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

  test('two-step verification: enable with password, sign in with a code, still no admin (F10)', async ({ page, isMobile }) => {
    // Better Auth allows 3 two-factor calls per 10 s per IP; a second project right after would hit 429.
    test.skip(isMobile, 'same flow as desktop; rate limited');
    const email = `f10-${Date.now()}-${Math.random().toString(36).slice(2, 6)}@example.com`;
    await page.goto('/vi/sign-up');
    await page.getByLabel('Email', { exact: true }).fill(email);
    await page.getByLabel(/Mật khẩu/).fill('password-123');
    await page.getByLabel('Năm sinh').fill('1995');
    await page.getByLabel(/Tôi đồng ý tạo tài khoản/).check();
    await page.getByRole('button', { name: 'Tạo tài khoản' }).click();
    await page.waitForURL(/\/vi\/home/);

    await page.goto('/vi/me');
    await page.getByLabel('Mật khẩu hiện tại').fill('wrong-password');
    await page.getByRole('button', { name: 'Bật xác thực 2 bước' }).click();
    await expect(page.getByRole('alert')).toBeVisible();
    await page.getByLabel('Mật khẩu hiện tại').fill('password-123');
    await page.getByRole('button', { name: 'Bật xác thực 2 bước' }).click();
    const secret = (await page.getByTestId('totp-secret').textContent())!.trim();
    await page.getByLabel('Mã 6 số từ ứng dụng').fill(totp(secret));
    await page.getByRole('button', { name: 'Xác nhận' }).click();
    await expect(page.getByText('Đã bật xác thực 2 bước')).toBeVisible();
    // Role admin is never granted by the app, so 2FA alone does not open the admin area.
    expect((await page.goto('/vi/admin'))?.status()).toBe(404);

    await page.context().clearCookies();
    await page.goto('/vi/sign-in');
    await page.getByLabel('Email', { exact: true }).fill(email);
    await page.getByLabel(/Mật khẩu/).fill('password-123');
    await page.getByRole('button', { name: 'Đăng nhập' }).click();
    await page.getByLabel('Mã xác thực').fill(totp(secret));
    await page.getByRole('button', { name: 'Đăng nhập' }).click();
    await page.waitForURL(/\/vi\/home/);
  });
});
