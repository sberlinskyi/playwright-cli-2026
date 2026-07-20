import { test, expect } from '@playwright/test';
import { APP_URL } from '../../fixtures/demoFixture';
import {
  productSchema,
  productsListSchema,
  productNotFoundErrorSchema,
} from '../../utilities/schemas/productSchema';
import { validateSchema } from '../../utilities/validators/schemaValidator';

test.describe('Products API', () => {
  test('GET /api/products - Products page - should return the full product list', async ({
    request,
  }) => {
    const response = await request.get(`${APP_URL}/api/products`);

    expect(response.status(), 'Products API should respond with 200').toBe(200);
    expect(response.headers()['content-type'], 'Response content type should be JSON').toContain('application/json');

    const products = await response.json();

    const { isValid, errors } = validateSchema(products, productsListSchema);
    expect(isValid, `Response payload should match the products schema: ${errors}`).toBe(true);
  });

  test('GET /api/products/:id - should return a single product for a valid id', async ({ request }) => {
    const response = await request.get(`${APP_URL}/api/products/1`);

    expect(response.status(), 'Single product API should respond with 200 for a valid id').toBe(200);
    expect(response.headers()['content-type'], 'Response content type should be JSON').toContain('application/json');

    const product = await response.json();

    expect(product.id, 'Returned product id should match the requested id').toBe(1);

    const { isValid, errors } = validateSchema(product, productSchema);
    expect(isValid, `Response payload should match the single product schema: ${errors}`).toBe(true);
  });

  test('GET /api/products/:id - should return 404 for a nonexistent id', async ({ request }) => {
    const response = await request.get(`${APP_URL}/api/products/999`);

    expect(response.status(), 'Products API should respond with 404 for a nonexistent id').toBe(404);

    const body = await response.json();

    const { isValid, errors } = validateSchema(body, productNotFoundErrorSchema);
    expect(isValid, `Error response payload should match the not-found error schema: ${errors}`).toBe(true);
    expect(body.message, 'Error message should indicate the product was not found').toBe('Product not found');
  });

  test('GET /api/products/:id - should return 404 for a non-numeric id', async ({ request }) => {
    const response = await request.get(`${APP_URL}/api/products/abc`);

    expect(response.status(), 'Products API should respond with 404 for a non-numeric id').toBe(404);
  });

  test('POST /api/products - unsupported method should not succeed', async ({ request }) => {
    const response = await request.post(`${APP_URL}/api/products`);

    // NOTE: the API currently returns 500 instead of 405 for unsupported methods.
    // This assertion pins down the current (buggy) behavior so the suite fails
    // loudly if it changes, prompting a follow-up to correct it to 405.
    expect(response.status(), 'POST should not be treated as a successful request').toBe(500);
  });

  test('GET /api/products - all products should have valid, consistent data', async ({ request }) => {
    const response = await request.get(`${APP_URL}/api/products`);
    const products = await response.json();

    const ids = products.map((product: { id: number }) => product.id);
    expect(new Set(ids).size, 'Product ids should be unique').toBe(ids.length);

    for (const product of products) {
      expect(product.price, `Product "${product.name}" price should be greater than 0`).toBeGreaterThan(0);
      expect(product.stock, `Product "${product.name}" stock should not be negative`).toBeGreaterThanOrEqual(0);
      expect(product.name.trim().length, `Product ${product.id} name should not be empty`).toBeGreaterThan(0);
      expect(
        product.description.trim().length,
        `Product ${product.id} description should not be empty`
      ).toBeGreaterThan(0);
    }
  });

  test('GET /api/products - response headers should be set correctly', async ({ request }) => {
    const response = await request.get(`${APP_URL}/api/products`);
    const headers = response.headers();

    expect(headers['content-type'], 'Content-Type header should be application/json').toContain('application/json');
    expect(headers['cache-control'], 'Cache-Control header should be present').toBeTruthy();
    expect(headers['etag'], 'ETag header should be present').toBeTruthy();
    expect(headers['access-control-allow-origin'], 'CORS header should allow all origins').toBe('*');
  });

  test('GET /api/products - unsupported query params should be ignored', async ({ request }) => {
    const response = await request.get(`${APP_URL}/api/products?foo=bar`);

    expect(response.status(), 'Unsupported query params should not break the request').toBe(200);

    const products = await response.json();

    const { isValid, errors } = validateSchema(products, productsListSchema);
    expect(isValid, `Response payload should still match the products schema: ${errors}`).toBe(true);
  });
});
