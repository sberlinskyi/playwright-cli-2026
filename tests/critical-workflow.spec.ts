import { test, expect } from '@playwright/test';

test('critical user workflow: login and add product to cart', async ({ page }) => {
  await page.goto('https://codemify-demo-app.vercel.app/demo-app');

  await page.fill('input[placeholder="Username"]', 'standard_user');
  await page.fill('input[placeholder="Password"]', 'my_secret_code');
  await page.click('button.login-button');

  await expect(page.getByRole('heading', { name: 'Products' })).toBeVisible();

  await page.getByRole('button', { name: 'Add to Cart' }).first().click();

  await page.locator('button.nav-link', { hasText: 'Cart' }).click();

  await expect(page.getByText('Codemify Backpack')).toBeVisible();
});
