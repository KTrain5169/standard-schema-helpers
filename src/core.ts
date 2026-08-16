import type { StandardJSONSchemaV1, StandardSchemaV1 } from "@standard-schema/spec";
import { deepmerge } from "deepmerge-ts";
import type { AllOfOutput, AnyOfOutput } from "./types";

export function assignReturn(
  schemas: readonly StandardJSONSchemaV1[],
  field: string,
  put: "input" | "output",
  options: StandardJSONSchemaV1.Options,
): Record<string, unknown> {
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

export function assignJsonSchemaSpec(
  schemas: readonly StandardJSONSchemaV1[],
  field: string,
): StandardJSONSchemaV1.Converter {
  return {
    input(options) {
      return assignReturn(schemas, field, "input", options);
    },
    output(options) {
      return assignReturn(schemas, field, "output", options);
    },
  } as const;
}

export function oneOfValidatorFactory(
  schemas: readonly StandardSchemaV1[],
): (value: unknown) => Promise<StandardSchemaV1.Result<unknown>> {
  return async (value: unknown) => {
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
}

export function allOfValidatorFactory<const S extends readonly StandardSchemaV1[]>(
  schemas: S,
): (value: unknown) => Promise<StandardSchemaV1.Result<AllOfOutput<S>>> {
  return async (value: unknown) => {
    const results: unknown[] = [];

    for (const s of schemas) {
      const result = await s["~standard"].validate(value);

      if (result.issues) {
        return result;
      }

      results.push(result.value);
    }

    const returnObject = deepmerge({}, ...results) as AllOfOutput<S>;

    return {
      value: returnObject,
    };
  };
}

export function anyOfValidatorFunction<const S extends readonly StandardSchemaV1[]>(
  schemas: S,
): (value: unknown) => Promise<StandardSchemaV1.Result<AnyOfOutput<S>>> {
  return async (value: unknown) => {
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
      const finalResult = deepmerge({}, ...results) as AnyOfOutput<S>;
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
}
