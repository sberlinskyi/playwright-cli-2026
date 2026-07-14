import type { Page, Locator } from '@playwright/test';

export class OrderConfirmationPage {
  readonly page: Page;
  readonly successHeading: Locator;
  readonly thankYouMessage: Locator;

  constructor(page: Page) {
    this.page = page;
    this.successHeading = page.getByRole('heading', { name: /Order Placed Successfully/ });
    this.thankYouMessage = page.getByText('Thank you for your purchase.');
  }
}
