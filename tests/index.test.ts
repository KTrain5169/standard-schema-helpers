import { expect, test } from "vite-plus/test";
import * as zSchemas from "./fixtures/zod.ts";
import * as vSchemas from "./fixtures/valibot.ts";

import { oneOf } from "../src/index.ts";

test("oneOf", () => {
  const idSchema = oneOf([zSchemas.idSchema, vSchemas.idSchema]);

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
});
