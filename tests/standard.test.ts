import { expect, test, suite } from "vite-plus/test";
import * as zSchemas from "./fixtures/zod.ts";
import * as vSchemas from "./fixtures/valibot.ts";
import * as aSchemas from "./fixtures/arktype.ts";

import { allOf, oneOf } from "../src/standard.ts";
import { StandardSchemaV1 } from "@standard-schema/spec";

suite("oneOf", () => {
  const idSchema = oneOf([zSchemas.idSchema, vSchemas.idSchema, aSchemas.idSchema]);

  test("use Zod schema", async () => {
    const data: StandardSchemaV1.InferInput<typeof idSchema> = { id: "1" };
    const testResult = await idSchema["~standard"].validate(data);
    expect(testResult.issues).toBeFalsy();
    const baseResult = await zSchemas.idSchema["~standard"].validate(data);
    expect(testResult).toStrictEqual(baseResult);
  });

  test("use Valibot schema", async () => {
    const data: StandardSchemaV1.InferInput<typeof idSchema> = { id: 1 };
    const testResult = await idSchema["~standard"].validate(data);
    expect(testResult.issues).toBeFalsy();
    const baseResult = await vSchemas.idSchema["~standard"].validate(data);
    expect(testResult).toStrictEqual(baseResult);
  });

  test("use ArkType schema", async () => {
    const data: StandardSchemaV1.InferInput<typeof idSchema> = { id: null };
    const testResult = await idSchema["~standard"].validate(data);
    expect(testResult.issues).toBeFalsy();
    const baseResult = await aSchemas.idSchema["~standard"].validate(data);
    expect(testResult).toStrictEqual(baseResult);
  });
});

suite("allOf", () => {
  const contributiveSchema = allOf([
    zSchemas.contributiveSchema,
    vSchemas.contributiveSchema,
    aSchemas.contributiveSchema,
  ]);

  test("Combine all schemas", async () => {
    const data: StandardSchemaV1.InferInput<typeof contributiveSchema> = {
      name: "test",
      count: 10,
      meta: {
        noop: true,
        notes: "More!",
      },
    };
    const testResult = await contributiveSchema["~standard"].validate(data);
    expect.assert(!testResult.issues);

    const zodResult = await zSchemas.contributiveSchema["~standard"].validate(data);
    expect.assert(!zodResult.issues);
    const valibotResult = await vSchemas.contributiveSchema["~standard"].validate(data);
    expect.assert(!valibotResult.issues);
    const arktypeResult = await aSchemas.contributiveSchema["~standard"].validate(data);
    expect.assert(!arktypeResult.issues);

    const expectedObject = {
      ...zodResult.value,
      ...valibotResult.value,
      ...arktypeResult.value,
    };

    expect(testResult.value).toStrictEqual(expectedObject);
  });

  test("Work properly even if omitted field from the arktype schema", async () => {
    const data: StandardSchemaV1.InferInput<typeof contributiveSchema> = {
      name: "test",
      count: 5,
      meta: { noop: true },
    };
    const testResult = await contributiveSchema["~standard"].validate(data);
    expect.assert(!testResult.issues);

    const zodResult = await zSchemas.contributiveSchema["~standard"].validate(data);
    expect.assert(!zodResult.issues);
    const valibotResult = await vSchemas.contributiveSchema["~standard"].validate(data);
    expect.assert(!valibotResult.issues);

    const expectedObject = {
      ...zodResult.value,
      ...valibotResult.value,
    };

    expect(testResult.value).toStrictEqual(expectedObject);
  });

  test("Fail if one of the schemas don't match", async () => {
    const data: Omit<StandardSchemaV1.InferInput<typeof contributiveSchema>, "count"> = {
      name: "test",
      meta: {
        noop: false,
        notes: "Less!",
      },
    };
    const testResult = await contributiveSchema["~standard"].validate(data);
    expect.assert(testResult.issues);
    expect(testResult.issues.length).toEqual(1);
  });
});
