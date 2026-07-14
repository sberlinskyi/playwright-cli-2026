import type { Page, Locator } from '@playwright/test';
import { BasePage } from './BasePage';

export class CartPage extends BasePage {
  readonly cartItems: Locator;
  readonly checkoutButton: Locator;
  readonly continueShoppingButton: Locator;

  constructor(page: Page) {
    super(page);
    this.cartItems = page.locator('.cart-item');
    this.checkoutButton = page.getByTestId('checkout-button');
    this.continueShoppingButton = page.getByRole('button', { name: 'Continue Shopping' });
  }

  removeButton(productId: number): Locator {
    return this.page.getByTestId(`remove-from-cart-${productId}`);
  }

  increaseQuantityButton(productId: number): Locator {
    return this.page.getByTestId(`increase-quantity-${productId}`);
  }

  decreaseQuantityButton(productId: number): Locator {
    return this.page.getByTestId(`decrease-quantity-${productId}`);
  }

  quantityValue(): Locator {
    return this.page.locator('.quantity-value');
  }

  itemHeading(name: string): Locator {
    return this.page.getByRole('heading', { name });
  }

  itemText(text: string): Locator {
    return this.page.getByText(text);
  }

  async removeItem(productId: number) {
    await this.removeButton(productId).click();
  }

  async increaseQuantity(productId: number) {
    await this.increaseQuantityButton(productId).click();
  }

  async decreaseQuantity(productId: number) {
    await this.decreaseQuantityButton(productId).click();
  }

  async proceedToCheckout() {
    await this.checkoutButton.click();
  }
}
