# Kairos — Places of Worship API

Find nearby places of worship worldwide through one normalized HTTP API, without managing Overpass queries, OSM schemas, geospatial storage, caching, or provider-specific response formats.

This repository is the public developer surface for **Kairos v1**. It contains the API contract and runnable examples; the production backend implementation remains separate.

## Quick start

Kairos direct access uses an API key in the `X-API-Key` header. The public production hostname is deployment-specific, so examples use environment variables instead of hardcoding a host or credential.

```bash
export KAIROS_API_BASE="https://YOUR_KAIROS_HOST"
export KAIROS_API_KEY="YOUR_API_KEY"

curl -fsS \
  -H "X-API-Key: $KAIROS_API_KEY" \
  "$KAIROS_API_BASE/v1/places/nearest?lat=6.2442&lon=-75.5812&radiusKm=8&religion=all"
```

Never commit a real API key to source control.

## Public endpoints

| Method | Endpoint | Purpose |
| --- | --- | --- |
| `GET` | `/v1/places/nearest` | Return the nearest matching place, or `data: null` when no match exists. |
| `GET` | `/v1/places/nearby` | Return a distance-ordered page of nearby matches. |
| `GET` | `/v1/places/{id}` | Return one place by stable `osm:<type>:<id>` public ID. |

### Common spatial parameters

`lat` and `lon` are required for spatial searches. `radiusKm` defaults to `8` and must be greater than `0` and at most `20`.

`religion` defaults to `all` and accepts:

`all`, `christian`, `muslim`, `jewish`, `hindu`, `buddhist`, `sikh`, `shinto`, `other`.

`denomination` is optional and accepts a normalized ASCII slug up to 64 characters.

`/nearby` additionally supports `limit` (`1..200`, default `50`) and `offset` (`>=0`, default `0`).

## Response shape

Kairos exposes a normalized place object rather than raw OSM tags:

```json
{
  "data": {
    "id": "osm:node:123456",
    "name": "Example Place",
    "location": { "lat": 6.2442, "lon": -75.5812 },
    "religion": "christian",
    "denomination": "catholic",
    "distance_m": 342.5,
    "source": {
      "provider": "openstreetmap",
      "osm_type": "node",
      "osm_id": 123456
    }
  },
  "meta": { "radius_km_used": 10 }
}
```

Fields such as `name`, `religion`, `denomination`, and `distance_m` can be `null` when the value is unavailable. Kairos does not fabricate missing source data.

## Errors

Public errors use one envelope:

```json
{
  "error": {
    "code": "INVALID_REQUEST",
    "message": "..."
  }
}
```

Relevant codes include `INVALID_REQUEST`, `UNAUTHORIZED`, `FORBIDDEN`, `NOT_FOUND`, `METHOD_NOT_ALLOWED`, `RATE_LIMIT_EXCEEDED`, `MONTHLY_QUOTA_EXCEEDED`, `INTERNAL_ERROR`, `SERVICE_UNAVAILABLE`, and `UPSTREAM_UNAVAILABLE`.

## Rate limits and monthly quotas

Direct-key responses expose quota information through headers such as:

- `X-RateLimit-Limit`
- `X-RateLimit-Remaining`
- `X-RateLimit-Reset`
- `X-Monthly-Quota-Limit`
- `X-Monthly-Quota-Remaining`
- `X-Monthly-Quota-Reset`

A throttled request returns HTTP `429` and `Retry-After`.

## OpenAPI

The machine-readable contract is in [`openapi/kairos-v1.yaml`](openapi/kairos-v1.yaml). It is the source of truth for parameters, schemas, examples, authentication, and public error responses.

## Examples

- [`examples/curl.md`](examples/curl.md)
- [`examples/python.py`](examples/python.py)
- [`examples/node.mjs`](examples/node.mjs)

All examples read the base URL and API key from environment variables. No production credential belongs in this repository.
