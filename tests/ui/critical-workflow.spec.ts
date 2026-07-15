import { test, expect } from '../../fixtures/demoFixture';
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
    await expect(productsPage.heading, 'Products heading should be visible after login').toBeVisible();

    await productsPage.addProductToCart(1);
    await productsPage.goToCart();
    await expect(cartPage.itemText('Codemify Backpack'), 'Backpack should appear in the cart').toBeVisible();

    await cartPage.proceedToCheckout();
    await checkoutPage.fillShippingAndPayment(createCheckoutInfo());
    await checkoutPage.completeOrder();

    await expect(orderConfirmationPage.successHeading, 'Order confirmation heading should be visible').toBeVisible();
    await expect(orderConfirmationPage.thankYouMessage, 'Thank-you message should be visible after order completion').toBeVisible();
  });

  test('Locked out user scenario', async ({ loginAs, loginPage, productsPage }) => {
    await loginAs(users.lockedOutUser.username, users.lockedOutUser.password);

    await expect(loginPage.errorMessage, 'Locked-out error message should be displayed').toHaveText(
      'Sorry, this user has been locked out.'
    );
    await expect(productsPage.heading, 'Products heading should not be visible for a locked-out user').not.toBeVisible();
  });

  test('should allow user to remove an item from the cart', async ({ loginAs, productsPage, cartPage }) => {
    await loginAs(users.standardUser.username, users.standardUser.password);

    await productsPage.addProductToCart(1);
    await productsPage.addProductToCart(3);
    await productsPage.goToCart();

    await expect(cartPage.cartItems, 'Cart should contain 2 items before removal').toHaveCount(2);

    await cartPage.removeItem(1);

    await expect(cartPage.cartItems, 'Cart should contain 1 item after removal').toHaveCount(1);
    await expect(cartPage.itemText('Codemify Backpack'), 'Removed Backpack should no longer be visible').not.toBeVisible();
    await expect(cartPage.itemHeading('Codemify Bolt T-Shirt'), 'Remaining Bolt T-Shirt should still be visible').toBeVisible();
  });

  test('should allow user to adjust the item quantity in the cart', async ({ loginAs, productsPage, cartPage }) => {
    await loginAs(users.standardUser.username, users.standardUser.password);

    await productsPage.addProductToCart(1);
    await productsPage.goToCart();

    const quantity = cartPage.quantityValue;
    await expect(quantity, 'Initial quantity should be 1').toHaveText('1');

    await cartPage.increaseQuantity(1);
    await expect(quantity, 'Quantity should increase to 2').toHaveText('2');
    await expect(cartPage.itemText('$29.99 × 2 = $59.98'), 'Line total should reflect quantity of 2').toBeVisible();

    await cartPage.decreaseQuantity(1);
    await expect(quantity, 'Quantity should decrease back to 1').toHaveText('1');
    await expect(cartPage.itemText('$29.99 × 1 = $29.99'), 'Line total should reflect quantity of 1').toBeVisible();
  });
});
