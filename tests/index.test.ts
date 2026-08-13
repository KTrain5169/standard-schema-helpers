import { expect, test, suite } from "vite-plus/test";
import * as zSchemas from "./fixtures/zod.ts";
import * as vSchemas from "./fixtures/valibot.ts";
import * as aSchemas from "./fixtures/arktype.ts";

import { oneOf } from "../src/index.ts";

suite("oneOf", () => {
  const idSchema = oneOf([zSchemas.idSchema, vSchemas.idSchema, aSchemas.idSchema]);

  test("use Zod schema", async () => {
    const data = { id: "1" };
    const testResult = await idSchema["~standard"].validate(data);
    expect(testResult.issues).toBeFalsy();
    const baseResult = await zSchemas.idSchema["~standard"].validate(data);
    expect(testResult).toStrictEqual(baseResult);
  });

  test("use Valibot schema", async () => {
    const data = { id: 1 };
    const testResult = await idSchema["~standard"].validate(data);
    expect(testResult.issues).toBeFalsy();
    const baseResult = await vSchemas.idSchema["~standard"].validate(data);
    expect(testResult).toStrictEqual(baseResult);
  });

  test("use ArkType schema", async () => {
    const data = { id: null };
    const testResult = await idSchema["~standard"].validate(data);
    expect(testResult.issues).toBeFalsy();
    const baseResult = await aSchemas.idSchema["~standard"].validate(data);
    expect(testResult).toStrictEqual(baseResult);
  });
});
