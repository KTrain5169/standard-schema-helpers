import type { StandardJSONSchemaV1 } from "@standard-schema/spec";
import type { AllOfInput, AllOfOutput, AnyOfInput, AnyOfOutput } from "./types";
import { assignJsonSchemaSpec } from "./core";

/* @__NO_SIDE_EFFECTS__ */
function createSchema<const I, const O>(
  field: string,
  schemas: readonly StandardJSONSchemaV1[],
): StandardJSONSchemaV1<I, O> {
  return {
    "~standard": {
      vendor: "standard-schema-helper",
      version: 1,
      jsonSchema: assignJsonSchemaSpec(schemas, field),
    },
  };
}

/* @__NO_SIDE_EFFECTS__ */
export function oneOf<const S extends readonly Pick<StandardJSONSchemaV1, "~standard">[]>(
  schemas: S,
): S[number] {
  return createSchema("oneOf", schemas);
}

/* @__NO_SIDE_EFFECTS__ */
export function allOf<const S extends readonly Pick<StandardJSONSchemaV1, "~standard">[]>(
  schemas: S,
): StandardJSONSchemaV1<AllOfInput<S>, AllOfOutput<S>> {
  return createSchema("allOf", schemas);
}

/* @__NO_SIDE_EFFECTS__ */
export function anyOf<const S extends readonly Pick<StandardJSONSchemaV1, "~standard">[]>(
  schemas: S,
): StandardJSONSchemaV1<AnyOfInput<S>, AnyOfOutput<S>> {
  return createSchema("anyOf", schemas);
}
