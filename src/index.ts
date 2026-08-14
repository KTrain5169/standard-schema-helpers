import type { StandardSchemaV1 } from "@standard-schema/spec";

/**
 * Create a wrapper schema that checks the array of schemas.
 * If the input value matches **one** of the schemas in the array, then it will return with the typed data.
 * Otherwise, all schema issues will be compiled and returned as an issue array.
 * @param schemas An array of {@link StandardSchemaV1 Standard Schemas}
 * @returns A {@link StandardSchemaV1 Standard Schema-compliant} wrapper.
 */
/* @__NO_SIDE_EFFECTS__ */
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

type UnionToIntersection<U> = (U extends unknown ? (x: U) => void : never) extends (
  x: infer I,
) => void
  ? I
  : never;

type AllOfInput<S extends readonly StandardSchemaV1[]> = UnionToIntersection<
  StandardSchemaV1.InferInput<S[number]>
>;

type AllOfOutput<S extends readonly StandardSchemaV1[]> = UnionToIntersection<
  StandardSchemaV1.InferOutput<S[number]>
>;

/**
 * Creates a wrapper schema that checks the array of schemas.
 * If the input value matches **all** of the schemas in the array, then it will return with the typed data.
 * Otherwise, the first schema's issue will be compiled and return as an issue array.
 */
/* @__NO_SIDE_EFFECTS__ */
export function allOf<const S extends readonly Pick<StandardSchemaV1, "~standard">[]>(
  schemas: S,
): StandardSchemaV1<AllOfInput<S>, AllOfOutput<S>> {
  const validate = async (value: unknown) => {
    const results: unknown[] = [];

    for (const s of schemas) {
      const result = await s["~standard"].validate(value);

      if (result.issues) {
        return result;
      }

      results.push(result.value);
    }

    const returnObject = Object.assign({}, ...results);

    return {
      value: returnObject,
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

type AnyOfInput<S extends readonly StandardSchemaV1[]> = StandardSchemaV1.InferInput<S[number]>;

type AnyOfOutput<S extends readonly StandardSchemaV1[]> = S extends readonly [
  infer Head extends StandardSchemaV1,
  ...infer Tail extends readonly StandardSchemaV1[],
]
  ?
      | StandardSchemaV1.InferOutput<Head>
      | (Tail extends readonly [] ? never : StandardSchemaV1.InferOutput<Head> & AnyOfOutput<Tail>)
      | AnyOfOutput<Tail>
  : never;

/**
 * Creates a wrapper schema that checks the array of schemas.
 * If the input value matches **one or more** of the schemas in the array, then it will return with the typed data.
 * Otherwise, all issues will be compiled together.
 * This is a mix between `allOf` and `oneOf`.
 */
/* @__NO_SIDE_EFFECTS__ */
export function anyOf<const S extends readonly Pick<StandardSchemaV1, "~standard">[]>(
  schemas: S,
): StandardSchemaV1<AnyOfInput<S>, AnyOfOutput<S>> {
  const validate = async (value: unknown) => {
    const results: unknown[] = [];
    const errors: StandardSchemaV1.Issue[] = [];

    for (const s of schemas) {
      const result = await s["~standard"].validate(value);
      if (result.issues) {
        errors.push(...result.issues);
      } else {
        results.push(result.value);
      }
    }

    if (results.length !== 0) {
      const finalResult = Object.assign({}, ...results);
      return {
        value: finalResult,
      };
    } else if (errors.length !== 0) {
      return {
        issues: errors,
      };
    } else {
      return {
        issues: [
          {
            message: "No schema matched, but no issues were returned by any validator.",
          },
        ],
      };
    }
  };

  return {
    "~standard": {
      vendor: "standard-schema-helpers",
      version: 1,
      validate,
    },
  };
}
