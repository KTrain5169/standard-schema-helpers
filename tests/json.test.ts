import { suite, test, expect } from "vite-plus/test";
import { toStandardJsonSchema } from "@valibot/to-json-schema";
import * as zSchemas from "./fixtures/zod.ts";
import * as vSchemas from "./fixtures/valibot.ts";
import * as aSchemas from "./fixtures/arktype.ts";

import { oneOf } from "../src/json";

suite("oneOf", () => {
  test("should have `oneOf` for input and output schemas if multiple schemas are passed", async () => {
    const idSchemas = oneOf([
      zSchemas.idSchema,
      toStandardJsonSchema(vSchemas.idSchema),
      aSchemas.idSchema,
    ]);
    const inputSchema = idSchemas["~standard"].jsonSchema.input({ target: "draft-07" });
    expect(inputSchema).toHaveProperty("oneOf");
    const outputSchema = idSchemas["~standard"].jsonSchema.output({ target: "draft-07" });
    expect(outputSchema).toHaveProperty("oneOf");
  });
});
