# Standard Schema Helpers

This package contains helper utilities for the Standard Schema spec.

## API

### `oneOf`

Returns a wrapper schema that checks if the input value matches **one** of the provided schemas.

### `allOf`

Returns a wrapper schema that checks if the input value matches **all** of the provided schemas.

### `union`

Returns a wrapper schema that discriminates a union by a specific part of the input value.
