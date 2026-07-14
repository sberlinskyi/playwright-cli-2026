import type { Page, Locator } from '@playwright/test';
import type { CheckoutInfo } from '../utilities/factories/checkoutFactory';

export class CheckoutPage {
  readonly page: Page;
  readonly firstNameInput: Locator;
  readonly lastNameInput: Locator;
  readonly emailInput: Locator;
  readonly addressInput: Locator;
  readonly cityInput: Locator;
  readonly stateInput: Locator;
  readonly zipCodeInput: Locator;
  readonly cardNumberInput: Locator;
  readonly expiryDateInput: Locator;
  readonly cvvInput: Locator;
  readonly completeOrderButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.firstNameInput = page.getByTestId('first-name-input');
    this.lastNameInput = page.getByTestId('last-name-input');
    this.emailInput = page.getByTestId('email-input');
    this.addressInput = page.getByTestId('address-input');
    this.cityInput = page.getByTestId('city-input');
    this.stateInput = page.getByTestId('state-input');
    this.zipCodeInput = page.getByTestId('zip-code-input');
    this.cardNumberInput = page.getByTestId('card-number-input');
    this.expiryDateInput = page.getByTestId('expiry-date-input');
    this.cvvInput = page.getByTestId('cvv-input');
    this.completeOrderButton = page.getByTestId('complete-order-button');
  }

  async fillShippingAndPayment(info: CheckoutInfo) {
    await this.firstNameInput.fill(info.firstName);
    await this.lastNameInput.fill(info.lastName);
    await this.emailInput.fill(info.email);
    await this.addressInput.fill(info.address);
    await this.cityInput.fill(info.city);
    await this.stateInput.fill(info.state);
    await this.zipCodeInput.fill(info.zipCode);
    await this.cardNumberInput.fill(info.cardNumber);
    await this.expiryDateInput.fill(info.expiryDate);
    await this.cvvInput.fill(info.cvv);
  }

  async completeOrder() {
    await this.completeOrderButton.click();
  }
}
