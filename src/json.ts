import type { StandardJSONSchemaV1 } from "@standard-schema/spec";
import type { AllOfInput, AllOfOutput, AnyOfInput, AnyOfOutput } from "./types";

/* @__NO_SIDE_EFFECTS__ */
function createSchema<const I, const O>(
  field: string,
  schemas: readonly StandardJSONSchemaV1[],
): StandardJSONSchemaV1<I, O> {
  function assignReturn(put: "input" | "output", options: StandardJSONSchemaV1.Options) {
    let object: Record<string, unknown> = {};
    if (schemas.length === 1) {
      object = schemas[0]["~standard"].jsonSchema[put](options);
    } else {
      object[field as keyof typeof object] = schemas.map((s) =>
        s["~standard"].jsonSchema[put](options),
      );
    }
    return object;
  }
  return {
    "~standard": {
      vendor: "standard-schema-helper",
      version: 1,
      jsonSchema: {
        input(options) {
          return assignReturn("input", options);
        },
        output(options) {
          return assignReturn("output", options);
        },
      } as const,
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
