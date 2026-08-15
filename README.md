# Standard Schema Helpers

This package contains helper utilities for the Standard Schema spec.

## API

### `oneOf`

Returns a wrapper schema that checks if the input value matches **one** of the provided schemas.

### `allOf`

Returns a wrapper schema that checks if the input value matches **all** of the provided schemas.
Succesful validation results will be deep merged together.

### `anyOf`

Returns a wrapper schema that checks if the input value matches **one or more** of the provided schemas.
If more than one matches, it will be deep merged, similar to `allOf`.
This acts as a mix between `allOf` and `oneOf`.

## Notes

- Deep merging uses the [`deepmerge-ts`](https://npmx.dev/package/deepmerge-ts) library.
