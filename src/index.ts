import type { StandardSchemaV1 } from "@standard-schema/spec";

/**
 * Create a wrapper schema that checks the array of schemas.
 * If the input values matches **one** of the schemas in the array, then it will return with the typed data.
 * Otherwise, all schema issues will be compiled and returned as an issue array.
 * @param schemas An array of {@link StandardSchemaV1 Standard Schemas}
 * @returns A {@link StandardSchemaV1 Standard Schema-compliant} wrapper.
 */
export function oneOf<const TInput, const TOutput>(
  schemas: StandardSchemaV1<TInput, TOutput>[],
): StandardSchemaV1<TInput, TOutput> {
  const validateFunc = async (value: unknown): Promise<StandardSchemaV1.Result<TOutput>> => {
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
      validate: validateFunc,
    },
  };
}
