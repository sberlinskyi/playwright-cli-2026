import { test, expect } from '@playwright/test';

test('codemify AI Engineering navigation with mocked API calls', async ({ page }) => {
  await page.route('**/stat.tildaapi.one/event*', route =>
    route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: '[]',
    })
  );

  await page.route('**/codemify.com/cdn-cgi/rum*', route =>
    route.fulfill({
      status: 204,
      body: '',
    })
  );

  await page.route('**/k.clarity.ms/collect', route =>
    route.fulfill({
      status: 204,
      body: '',
    })
  );

  await page.goto('https://codemify.com/', { waitUntil: 'domcontentloaded' });

  await page.locator('a', { hasText: 'AI Courses' }).first().click();
  await page.locator('a', { hasText: 'AI Engineering' }).first().click();

  await expect(page).toHaveURL(/AI-Engineering/);
  await expect(page.locator('h1')).toBeVisible();
});

test('codemify AI Engineering access is blocked when critical page request fails', async ({ page }) => {
  await page.route('**/stat.tildaapi.one/event*', route =>
    route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: '[]',
    })
  );

  await page.route('**/codemify.com/cdn-cgi/rum*', route =>
    route.fulfill({
      status: 204,
      body: '',
    })
  );

  await page.route('**/k.clarity.ms/collect', route =>
    route.fulfill({
      status: 204,
      body: '',
    })
  );

  await page.route('**/AI-Engineering*', route =>
    route.fulfill({
      status: 403,
      contentType: 'text/plain',
      body: 'Access blocked by policy',
    })
  );

  await page.goto('https://codemify.com/', { waitUntil: 'domcontentloaded' });

  await page.locator('a', { hasText: 'AI Courses' }).first().click();

  const responsePromise = page.waitForResponse(response =>
    response.url().includes('/AI-Engineering') && response.status() === 403
  );

  await page.locator('a', { hasText: 'AI Engineering' }).first().click();
  const response = await responsePromise;

  await expect(response.status()).toBe(403);
  await expect(page.locator('body')).toContainText('Access blocked by policy');
  await expect(page.locator('h1')).toHaveCount(0);
});
