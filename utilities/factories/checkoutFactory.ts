import { faker } from '@faker-js/faker';

export type CheckoutInfo = {
  firstName: string;
  lastName: string;
  email: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  cardNumber: string;
  expiryDate: string;
  cvv: string;
};

/**
 * Generates a fresh, valid-shaped set of checkout/shipping/payment data.
 * Pass `overrides` to pin down specific fields (e.g. for negative test cases).
 */
export function createCheckoutInfo(overrides: Partial<CheckoutInfo> = {}): CheckoutInfo {
  const firstName = faker.person.firstName();
  const lastName = faker.person.lastName();

  const month = faker.number.int({ min: 1, max: 12 }).toString().padStart(2, '0');
  const year = faker.number.int({ min: 26, max: 30 }).toString();

  return {
    firstName,
    lastName,
    email: faker.internet.email({ firstName, lastName }),
    address: faker.location.streetAddress(),
    city: faker.location.city(),
    state: faker.location.state({ abbreviated: true }),
    zipCode: faker.location.zipCode('#####'),
    cardNumber: `4${faker.string.numeric(15)}`,
    expiryDate: `${month}/${year}`,
    cvv: faker.finance.creditCardCVV(),
    ...overrides,
  };
}
