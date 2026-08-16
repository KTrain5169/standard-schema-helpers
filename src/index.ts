import type { StandardSchemaV1 } from "@standard-schema/spec";

import type { AllOfInput, AllOfOutput, AnyOfInput, AnyOfOutput } from "./types";
import { allOfValidatorFactory, anyOfValidatorFunction, oneOfValidatorFactory } from "./core";

/**
 * Create a wrapper schema that checks the array of schemas.
 * If the input value matches **one** of the schemas in the array, then it will return with the typed data.
 * Otherwise, all schema issues will be compiled and returned as an issue array.
 * @param schemas An array of {@link StandardSchemaV1 Standard Schemas}
 * @returns A {@link StandardSchemaV1 Standard Schema-compliant} wrapper.
 */
/* @__NO_SIDE_EFFECTS__ */
export function oneOf<const S extends readonly Pick<StandardSchemaV1, "~standard">[]>(
  schemas: S,
): S[number] {
  return {
    "~standard": {
      vendor: "standard-schema-helpers",
      version: 1,
      validate: oneOfValidatorFactory(schemas),
    },
  };
}

/**
 * Creates a wrapper schema that checks the array of schemas.
 * If the input value matches **all** of the schemas in the array, then it will return with the typed data.
 * Otherwise, the first schema's issue will be compiled and return as an issue array.
 * @param schemas An array of {@link StandardSchemaV1 Standard Schemas}
 * @returns A {@link StandardSchemaV1 Standard Schema-compliant} wrapper.
 */
/* @__NO_SIDE_EFFECTS__ */
export function allOf<const S extends readonly Pick<StandardSchemaV1, "~standard">[]>(
  schemas: S,
): StandardSchemaV1<AllOfInput<S>, AllOfOutput<S>> {
  return {
    "~standard": {
      vendor: "standard-schema-helpers",
      version: 1,
      validate: allOfValidatorFactory(schemas),
    },
  };
}

/**
 * Creates a wrapper schema that checks the array of schemas.
 * If the input value matches **one or more** of the schemas in the array, then it will return with the typed data.
 * Otherwise, all issues will be compiled together.
 * This is a mix between `allOf` and `oneOf`.
 * @param schemas An array of {@link StandardSchemaV1 Standard Schemas}
 * @returns A {@link StandardSchemaV1 Standard Schema-compliant} wrapper.
 */
/* @__NO_SIDE_EFFECTS__ */
export function anyOf<const S extends readonly Pick<StandardSchemaV1, "~standard">[]>(
  schemas: S,
): StandardSchemaV1<AnyOfInput<S>, AnyOfOutput<S>> {
  return {
    "~standard": {
      vendor: "standard-schema-helpers",
      version: 1,
      validate: anyOfValidatorFunction(schemas),
    },
  };
}
