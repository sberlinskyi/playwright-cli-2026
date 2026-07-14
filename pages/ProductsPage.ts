import type { Page, Locator } from '@playwright/test';
import { BasePage } from './BasePage';

export class ProductsPage extends BasePage {
  readonly heading: Locator;

  constructor(page: Page) {
    super(page);
    this.heading = page.getByRole('heading', { name: 'Products' });
  }

  addToCartButton(productId: number): Locator {
    return this.page.getByTestId(`add-to-cart-${productId}`);
  }

  async addProductToCart(productId: number) {
    await this.addToCartButton(productId).click();
  }
}
