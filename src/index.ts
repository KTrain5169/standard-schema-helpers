import type { StandardSchemaV1 } from "@standard-schema/spec";

/**
 * Create a wrapper schema that checks the array of schemas.
 * If the input values matches **one** of the schemas in the array, then it will return with the typed data.
 * Otherwise, all schema issues will be compiled and returned as an issue array.
 * @param schemas An array of {@link StandardSchemaV1 Standard Schemas}
 * @returns A {@link StandardSchemaV1 Standard Schema-compliant} wrapper.
 */
/* @__PURE__ */
export function oneOf<const S extends Pick<StandardSchemaV1, "~standard">[]>(
  schemas: S,
): S[number] {
  const validate = async (value: unknown) => {
    const errors = [];
    for (const s of schemas) {
      const result = await s["~standard"].validate(value);
      if (!result.issues) {
        return result;
      } else {
        errors.push(...result.issues);
      }
    }
    return {
      issues: errors,
    };
  };

  return {
    "~standard": {
      vendor: "standard-schema-helpers",
      version: 1,
      validate,
    },
  };
}

/**
 * Creates a wrapper schema that checks the array of schemas.
 * If the input values matches **all** of the schemas in the array, then it will return with the typed data.
 * Otherwise, the first schema's issue will be compiled and return as an issue array.
 */
/* @__PURE__ */
export function allOf<const S extends Pick<StandardSchemaV1, "~standard">[]>(schema: S): void {}
