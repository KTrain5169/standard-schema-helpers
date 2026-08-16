import {
  allOfValidatorFactory,
  anyOfValidatorFunction,
  assignJsonSchemaSpec,
  oneOfValidatorFactory,
} from "./core";
import type {
  AllOfInput,
  AllOfOutput,
  AnyOfInput,
  AnyOfOutput,
  StandardSchemaCombinedV1,
} from "./types";

/* @__NO_SIDE_EFFECTS__ */
export function oneOf<const S extends readonly Pick<StandardSchemaCombinedV1, "~standard">[]>(
  schemas: S,
): S[number] {
  return {
    "~standard": {
      vendor: "standard-schema-helper",
      version: 1,
      validate: oneOfValidatorFactory(schemas),
      jsonSchema: assignJsonSchemaSpec(schemas, "oneOf"),
    } as const,
  };
}

/* @__NO_SIDE_EFFECTS__ */
export function allOf<const S extends readonly Pick<StandardSchemaCombinedV1, "~standard">[]>(
  schemas: S,
): StandardSchemaCombinedV1<AllOfInput<S>, AllOfOutput<S>> {
  return {
    "~standard": {
      vendor: "standard-schema-helpers",
      version: 1,
      validate: allOfValidatorFactory(schemas),
      jsonSchema: assignJsonSchemaSpec(schemas, "allOf"),
    } as const,
  };
}

/* @__NO_SIDE_EFFECTS__ */
export function anyOf<const S extends readonly Pick<StandardSchemaCombinedV1, "~standard">[]>(
  schemas: S,
): StandardSchemaCombinedV1<AnyOfInput<S>, AnyOfOutput<S>> {
  return {
    "~standard": {
      vendor: "standard-schema-helpers",
      version: 1,
      validate: anyOfValidatorFunction(schemas),
      jsonSchema: assignJsonSchemaSpec(schemas, "anyOf"),
    },
  };
}
