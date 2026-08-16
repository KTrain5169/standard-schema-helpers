import type {
  StandardJSONSchemaV1,
  StandardSchemaV1,
  StandardTypedV1,
} from "@standard-schema/spec";

export type StandardSchemaCombinedV1<Input = unknown, Output = Input> = StandardSchemaV1<
  Input,
  Output
> &
  StandardJSONSchemaV1<Input, Output>;

type UnionToIntersection<U> = (U extends unknown ? (x: U) => void : never) extends (
  x: infer I,
) => void
  ? I
  : never;

export type AllOfInput<S extends readonly StandardTypedV1[]> = UnionToIntersection<
  StandardTypedV1.InferInput<S[number]>
>;

export type AllOfOutput<S extends readonly StandardTypedV1[]> = UnionToIntersection<
  StandardTypedV1.InferOutput<S[number]>
>;

export type AnyOfInput<S extends readonly StandardTypedV1[]> = StandardTypedV1.InferInput<
  S[number]
>;

export type AnyOfOutput<S extends readonly StandardTypedV1[]> = S extends readonly [
  infer Head extends StandardTypedV1,
  ...infer Tail extends readonly StandardTypedV1[],
]
  ?
      | StandardTypedV1.InferOutput<Head>
      | (Tail extends readonly [] ? never : StandardTypedV1.InferOutput<Head> & AnyOfOutput<Tail>)
      | AnyOfOutput<Tail>
  : never;
