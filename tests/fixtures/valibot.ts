import * as v from "valibot";

export const idSchema = v.object({
  id: v.number(),
  description: v.optional(v.string()),
});
