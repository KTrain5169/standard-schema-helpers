import { type } from "arktype";

export const idSchema = type({
  id: "null",
  "description?": "string",
});

export const contributiveSchema = type({
  "notes?": "string",
});
