# Standard Schema Helpers

This package contains helper utilities for the Standard Schema spec.

> [!WARN]
> This library hasn't been tested yet, you're welcome to use it, but please keep in mind that this package was initially made within the span of a day, so there may be uncaught cases.

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

> [!WARN]
> Consider this the most "experimental" of this entire library. Unit tests have not been set up for it yet.

## Notes

- Deep merging uses the [`deepmerge-ts`](https://npmx.dev/package/deepmerge-ts) library.
