import { test as base, expect } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';
import { ProductsPage } from '../pages/ProductsPage';
import { CartPage } from '../pages/CartPage';
import { CheckoutPage } from '../pages/CheckoutPage';
import { OrderConfirmationPage } from '../pages/OrderConfirmationPage';

export const APP_URL = 'https://codemify-demo-app.vercel.app/demo-app';

type Fixtures = {
  loginPage: LoginPage;
  productsPage: ProductsPage;
  cartPage: CartPage;
  checkoutPage: CheckoutPage;
  orderConfirmationPage: OrderConfirmationPage;
  loginAs: (username: string, password: string) => Promise<void>;
};

export const test = base.extend<Fixtures>({
  loginPage: async ({ page }, use) => {
    await use(new LoginPage(page));
  },

  productsPage: async ({ page }, use) => {
    await use(new ProductsPage(page));
  },

  cartPage: async ({ page }, use) => {
    await use(new CartPage(page));
  },

  checkoutPage: async ({ page }, use) => {
    await use(new CheckoutPage(page));
  },

  orderConfirmationPage: async ({ page }, use) => {
    await use(new OrderConfirmationPage(page));
  },

  loginAs: async ({ loginPage }, use) => {
    await use(async (username: string, password: string) => {
      await loginPage.goto(APP_URL);
      await loginPage.login(username, password);
    });
  },
});

export { expect };
