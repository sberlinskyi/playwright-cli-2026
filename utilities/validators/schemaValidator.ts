import Ajv, { JSONSchemaType } from 'ajv';

const ajv = new Ajv();

/**
 * Validates `data` against the given JSON schema.
 * Returns `{ isValid: true }` on success, or `{ isValid: false, errors }` with
 * human-readable Ajv error details on failure.
 */
export function validateSchema<T>(data: unknown, schema: JSONSchemaType<T>): { isValid: boolean; errors?: string } {
  const validate = ajv.compile(schema);
  const isValid = validate(data) as boolean;

  return isValid ? { isValid } : { isValid, errors: JSON.stringify(validate.errors) };
}
