import AxeBuilder from '@axe-core/playwright';
import { expect, test } from '@playwright/test';

test.describe('P6 speaking practice', () => {
  test('microphone is allowed only on the speaking route', async ({ request }) => {
    const speak = await request.get('/vi/speak/1');
    expect(speak.status()).toBe(200);
    expect(speak.headers()['permissions-policy']).toContain('microphone=(self)');
    const other = await request.get('/vi/learn/n5/1');
    expect(other.headers()['permissions-policy']).toContain('microphone=()');
    expect(other.headers()['permissions-policy']).not.toContain('microphone=(self)');
  });

  test('lesson links to speaking; a guest can listen but is asked to sign in before recording', async ({ page }) => {
    await page.goto('/vi/learn/n5/1');
    await page.evaluate(() => Object.assign(window, { __spa: true }));
    await page.getByRole('link', { name: /Luyện nói/ }).click();
    await expect(page).toHaveURL(/\/vi\/speak\/1$/);
    // Full document load, so the /speak Permissions-Policy applies (client navigation would keep microphone=()).
    expect(await page.evaluate(() => (window as { __spa?: boolean }).__spa)).toBeUndefined();
    expect(await page.evaluate(() => (document as Document & { featurePolicy?: { allowsFeature(f: string): boolean } }).featurePolicy?.allowsFeature('microphone'))).toBe(true);
    await expect(page.getByRole('button', { name: /Nghe/ }).first()).toBeVisible();
    await expect(page.getByRole('button', { name: /Đọc$/ })).toHaveCount(0);
    await expect(page.getByText(/Đăng nhập \(16 tuổi trở lên\)|chưa hỗ trợ nhận dạng/)).toBeVisible();
    const axe = await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa']).analyze();
    expect(axe.violations.filter((v) => v.impact === 'critical' || v.impact === 'serious').map((v) => v.id)).toEqual([]);
  });

  test('unknown lesson shows the not-found page', async ({ page }) => {
    // Same as lesson pages: notFound() after the static shell streams, so only the content is checked.
    await page.goto('/vi/speak/999');
    await expect(page.getByRole('heading', { name: 'Không tìm thấy trang' })).toBeVisible();
  });
});
