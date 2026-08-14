import * as v from "valibot";

export const idSchema = v.object({
  id: v.number(),
  description: v.optional(v.string()),
});

export const contributiveSchema = v.object({
  count: v.pipe(v.number(), v.integer()),
});
