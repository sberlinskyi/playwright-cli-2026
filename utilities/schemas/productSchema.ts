import { JSONSchemaType } from 'ajv';

export type Product = {
  id: number;
  name: string;
  price: number;
  description: string;
  category: string;
  stock: number;
  image: string;
};

const productProperties = {
  id: { type: 'number' },
  name: { type: 'string' },
  price: { type: 'number' },
  description: { type: 'string' },
  category: { type: 'string' },
  stock: { type: 'number' },
  image: { type: 'string' },
} as const;

const productRequired = ['id', 'name', 'price', 'description', 'category', 'stock', 'image'] as const;

export const productSchema: JSONSchemaType<Product> = {
  type: 'object',
  properties: productProperties,
  required: [...productRequired],
  additionalProperties: false,
};

export const productsListSchema: JSONSchemaType<Product[]> = {
  type: 'array',
  minItems: 1,
  items: productSchema,
};

export type ProductNotFoundError = {
  message: string;
};

export const productNotFoundErrorSchema: JSONSchemaType<ProductNotFoundError> = {
  type: 'object',
  properties: {
    message: { type: 'string' },
  },
  required: ['message'],
  additionalProperties: false,
};
