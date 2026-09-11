# Search Filters and Pagination

Kairos provides a small, predictable set of filters for finding places of worship.

This document covers the public **Kairos v1** endpoints:

- `GET /v1/places/nearest`
- `GET /v1/places/nearby`

## Coordinates

Both spatial endpoints require:

- `lat`: latitude from `-90` to `90`
- `lon`: longitude from `-180` to `180`

Example:

```text
lat=6.96333
lon=-75.41722
```

Invalid or non-finite coordinates return HTTP `400` with `INVALID_REQUEST`.

## Search radius

`radiusKm` is optional.

- default: `8`
- minimum: greater than `0`
- maximum: `20`

Example:

```text
radiusKm=8
```

Kairos resolves the requested radius to an internal search bucket:

| Requested radius | `meta.radius_km_used` |
| --- | ---: |
| `0 < radiusKm <= 2` | `2` |
| `2 < radiusKm <= 5` | `5` |
| `5 < radiusKm <= 10` | `10` |
| `10 < radiusKm <= 20` | `20` |

For example, a request with `radiusKm=8` can return:

```json
{
  "meta": {
    "radius_km_used": 10
  }
}
```

## Religion

`religion` is optional and defaults to:

```text
all
```

Supported values are:

```text
all
christian
muslim
jewish
hindu
buddhist
sikh
shinto
other
```

The filter is case-insensitive after normalization.

Example:

```text
religion=muslim
```

To search across all supported religions:

```text
religion=all
```

Unknown values return HTTP `400`.

## Denomination

`denomination` is optional.

Kairos trims the input and normalizes it to lowercase.

Accepted denomination values:

- must contain between 1 and 64 characters
- must start with an ASCII letter or digit
- may contain ASCII letters, digits, `_`, or `-`

Examples:

```text
denomination=catholic
denomination=roman_catholic
denomination=seventh-day_adventist
denomination=sunni
denomination=orthodox
```

Unsafe or malformed values return HTTP `400`.

Because Kairos uses OpenStreetMap-backed source data, denomination values depend on what is available in the underlying data. Kairos does not fabricate missing denomination metadata.

## Combining religion and denomination

You can combine both filters.

Example:

```bash
curl --silent --show-error --fail-with-body \
  -H "X-API-Key: $KAIROS_API_KEY" \
  "https://kairos.yarumaltech.com/v1/places/nearby?lat=6.96333&lon=-75.41722&radiusKm=8&religion=christian&denomination=catholic&limit=20&offset=0"
```

## Pagination

Pagination is available on:

```text
GET /v1/places/nearby
```

### `limit`

- optional
- default: `50`
- minimum: `1`
- maximum: `200`

### `offset`

- optional
- default: `0`
- minimum: `0`

Example:

```text
limit=20
offset=40
```

The response includes pagination metadata:

```json
{
  "meta": {
    "radius_km_used": 10,
    "count": 20,
    "limit": 20,
    "offset": 40
  }
}
```

`count` is the number of places returned in the current response page.

## Nearest-place example

```bash
curl --silent --show-error --fail-with-body \
  -H "X-API-Key: $KAIROS_API_KEY" \
  "https://kairos.yarumaltech.com/v1/places/nearest?lat=6.96333&lon=-75.41722&radiusKm=8&religion=all"
```

The endpoint returns the nearest matching place or:

```json
{
  "data": null,
  "meta": {
    "radius_km_used": 10
  }
}
```

when no matching place is found.

## Nearby-places example

```bash
curl --silent --show-error --fail-with-body \
  -H "X-API-Key: $KAIROS_API_KEY" \
  "https://kairos.yarumaltech.com/v1/places/nearby?lat=6.96333&lon=-75.41722&radiusKm=8&religion=all&limit=10&offset=0"
```

Nearby results are returned ordered by distance.

When no matching places are found, Kairos returns an empty array:

```json
{
  "data": [],
  "meta": {
    "radius_km_used": 10,
    "count": 0,
    "limit": 10,
    "offset": 0
  }
}
```

## Next steps

- Start with the [Quickstart](quickstart.md).
- See [Authentication](authentication.md).
- See the full machine-readable contract in [`../openapi/kairos-v1.yaml`](../openapi/kairos-v1.yaml).
