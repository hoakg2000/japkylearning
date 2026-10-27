import AxeBuilder from '@axe-core/playwright';
import { expect, test } from '@playwright/test';

test.describe('P0/P1 smoke', () => {
  test('security headers and locale redirect', async ({ request }) => {
    const res = await request.get('/vi');
    expect(res.status()).toBe(200);
    const csp = res.headers()['content-security-policy'];
    expect(csp).toContain("frame-ancestors 'none'");
    expect(csp).toContain("object-src 'none'");
    expect(res.headers()['x-frame-options']).toBe('DENY');
    const root = await request.get('/', { maxRedirects: 0 });
    expect(root.status()).toBe(307);
  });

  test('landing renders in both locales without accessibility violations', async ({ page }) => {
    for (const [path, title] of [['/vi', 'Học tiếng Nhật mỗi ngày'], ['/en', 'Learn Japanese every day']] as const) {
      await page.goto(path);
      await expect(page.getByRole('heading', { level: 1 })).toHaveText(title);
      const axe = await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa']).analyze();
      expect(axe.violations.filter((v) => v.impact === 'critical' || v.impact === 'serious'), JSON.stringify(axe.violations.map((v) => v.id))).toEqual([]);
    }
  });

  test('first-run quiz → onboarding → kana chart', async ({ page }) => {
    await page.goto('/vi');
    for (let i = 0; i < 5; i++) {
      const prompt = page.getByText(`Câu ${i + 1}/5`);
      await expect(prompt).toBeVisible();
      await page.locator('section[aria-label] button').first().click();
    }
    await page.waitForURL(/\/vi\/onboarding\?score=\d/);
    await page.getByRole('button', { name: 'Chưa biết gì' }).click();
    await page.getByRole('button', { name: /Tokutei Ginou/ }).click();
    await page.getByRole('button', { name: /Đều đặn/ }).click();
    await page.getByRole('button', { name: 'Bắt đầu học' }).click();
    await page.waitForURL(/\/vi\/kana$/);
    await expect(page.getByRole('heading', { level: 1 })).toContainText('Hiragana');
  });

  test('kana chart shows stroke order for a selected character', async ({ page }) => {
    await page.goto('/vi/kana');
    await page.getByRole('button', { name: /^あ\s*a$/ }).click();
    await expect(page.getByRole('img', { name: /Thứ tự nét của あ, 3 nét/ })).toBeVisible();
  });

  test('kana quiz saves progress as a guest and Today shows the streak', async ({ page }) => {
    await page.goto('/vi/kana/quiz');
    await page.getByRole('button', { name: /Bắt đầu/ }).click();
    for (let i = 0; i < 10; i++) {
      await page.locator('.grid button').first().click();
      await page.getByRole('button', { name: 'Tiếp' }).click();
    }
    await expect(page.getByText(/Đúng \d+\/10 câu/)).toBeVisible();
    await expect(page.getByText(/ngày liên tiếp/)).toBeVisible({ timeout: 15_000 });
    await page.goto('/vi/home');
    await expect(page.getByText('Bạn đang học với tư cách khách.')).toBeVisible();
    await expect(page.getByText(/XP/).first()).toBeVisible();
    // F7: missed kana (always picking the first option misses some) are due for review today.
    await page.goto('/vi/review');
    await expect(page.getByText('Kana', { exact: true })).toBeVisible();
    // F3: the time zone changes once per study day.
    await page.goto('/vi/me');
    const zone = page.getByLabel('Múi giờ học');
    const other = async () => ((await zone.inputValue()) === 'Asia/Tokyo' ? 'Asia/Ho_Chi_Minh' : 'Asia/Tokyo');
    await zone.selectOption(await other());
    await expect(page.getByText('Đã lưu')).toBeVisible();
    await zone.selectOption(await other());
    await expect(page.getByText('Hôm nay bạn đã đổi múi giờ rồi. Hãy thử lại vào ngày mai.')).toBeVisible();
  });

  test('sign-up rejects under-16 and keeps guest progress for 16+', async ({ page }) => {
    // Earn XP as a guest first.
    await page.goto('/vi/kana/quiz');
    await page.getByRole('button', { name: /Bắt đầu/ }).click();
    for (let i = 0; i < 10; i++) {
      await page.locator('.grid button').first().click();
      await page.getByRole('button', { name: 'Tiếp' }).click();
    }
    await expect(page.getByText(/ngày liên tiếp/)).toBeVisible({ timeout: 15_000 });

    await page.goto('/vi/sign-up');
    const email = `e2e-${Date.now()}-${Math.random().toString(36).slice(2, 6)}@example.com`;
    await page.getByLabel('Email', { exact: true }).fill(email);
    await page.getByLabel(/Mật khẩu/).fill('password-123');
    await page.getByLabel('Năm sinh').fill(String(new Date().getFullYear() - 12));
    await page.getByLabel(/Tôi đồng ý tạo tài khoản/).check();
    await page.getByRole('button', { name: 'Tạo tài khoản' }).click();
    await expect(page.locator('form').getByRole('alert')).toContainText('16');

    await page.getByLabel('Năm sinh').fill('1995');
    await page.getByRole('button', { name: 'Tạo tài khoản' }).click();
    await page.waitForURL(/\/vi\/home/);
    await page.goto('/vi/me');
    await expect(page.getByText(email)).toBeVisible();
    await expect(page.getByText(/Streak 1 ngày|Streak 0 ngày/)).toBeVisible();
    const exported = await page.request.get('/api/me/export');
    const data = await exported.json();
    expect(data.xpEvents.length).toBeGreaterThan(0);
    expect(data.consents.map((c: { purpose: string }) => c.purpose)).toContain('account');
  });

  test('UI mode and locale toggles', async ({ page, isMobile }) => {
    test.skip(isMobile, 'header toggles checked on desktop');
    await page.goto('/vi/kana');
    await page.getByRole('button', { name: 'Đầy đủ' }).click();
    await expect(page.locator('html')).toHaveAttribute('data-ui', 'minimal');
    await page.reload();
    await expect(page.locator('html')).toHaveAttribute('data-ui', 'minimal');
    await page.getByRole('button', { name: 'Ngôn ngữ' }).click();
    await page.waitForURL(/\/en\/kana/);
    await expect(page.getByRole('heading', { level: 1 })).toContainText('chart');
  });
});
