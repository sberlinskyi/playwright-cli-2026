import type { Page, Locator } from '@playwright/test';

/**
 * Shared app shell — the top navigation bar that is present on every
 * authenticated view (Products, Cart, Checkout, Order Confirmation).
 */
export class BasePage {
  readonly page: Page;
  readonly productsNavButton: Locator;
  readonly cartNavButton: Locator;
  readonly logoutButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.productsNavButton = page.locator('button.nav-link', { hasText: 'Products' });
    this.cartNavButton = page.locator('button.nav-link', { hasText: 'Cart' });
    this.logoutButton = page.locator('button.nav-link', { hasText: 'Logout' });
  }

  async goToProducts() {
    await this.productsNavButton.click();
  }

  async goToCart() {
    await this.cartNavButton.click();
  }

  async logout() {
    await this.logoutButton.click();
  }
}
