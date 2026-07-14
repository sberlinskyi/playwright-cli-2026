import { test, expect } from '../../fixtures/uiFixture';
import users from '../../testData/users.json';
import { createCheckoutInfo } from '../../utilities/factories/checkoutFactory';

test.describe('Critical User Workflow', () => {
  test('Complete the full purchase journey from login to order confirmation', async ({
    loginAs,
    productsPage,
    cartPage,
    checkoutPage,
    orderConfirmationPage,
  }) => {
    await loginAs(users.standardUser.username, users.standardUser.password);
    await expect(productsPage.heading).toBeVisible();

    await productsPage.addProductToCart(1);
    await productsPage.goToCart();
    await expect(cartPage.itemText('Codemify Backpack')).toBeVisible();

    await cartPage.proceedToCheckout();
    await checkoutPage.fillShippingAndPayment(createCheckoutInfo());
    await checkoutPage.completeOrder();

    await expect(orderConfirmationPage.successHeading).toBeVisible();
    await expect(orderConfirmationPage.thankYouMessage).toBeVisible();
  });

  test('Locked out user scenario', async ({ loginAs, loginPage, productsPage }) => {
    await loginAs(users.lockedOutUser.username, users.lockedOutUser.password);

    await expect(loginPage.errorMessage).toHaveText('Sorry, this user has been locked out.');
    await expect(productsPage.heading).not.toBeVisible();
  });

  test('should allow user to remove an item from the cart', async ({ loginAs, productsPage, cartPage }) => {
    await loginAs(users.standardUser.username, users.standardUser.password);

    await productsPage.addProductToCart(1);
    await productsPage.addProductToCart(3);
    await productsPage.goToCart();

    await expect(cartPage.cartItems).toHaveCount(2);

    await cartPage.removeItem(1);

    await expect(cartPage.cartItems).toHaveCount(1);
    await expect(cartPage.itemText('Codemify Backpack')).not.toBeVisible();
    await expect(cartPage.itemHeading('Codemify Bolt T-Shirt')).toBeVisible();
  });

  test('should allow user to adjust the item quantity in the cart', async ({ loginAs, productsPage, cartPage }) => {
    await loginAs(users.standardUser.username, users.standardUser.password);

    await productsPage.addProductToCart(1);
    await productsPage.goToCart();

    const quantity = cartPage.quantityValue();
    await expect(quantity).toHaveText('1');

    await cartPage.increaseQuantity(1);
    await expect(quantity).toHaveText('2');
    await expect(cartPage.itemText('$29.99 × 2 = $59.98')).toBeVisible();

    await cartPage.decreaseQuantity(1);
    await expect(quantity).toHaveText('1');
    await expect(cartPage.itemText('$29.99 × 1 = $29.99')).toBeVisible();
  });
});
