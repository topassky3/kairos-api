# Kairos — Places of Worship API

Find nearby places of worship worldwide through one normalized HTTP API, without managing Overpass queries, raw OpenStreetMap schemas, geospatial storage, caching, or provider-specific response formats.

This repository is the public developer surface for **Kairos v1**. It contains the API contract, guides, runnable examples, and a Postman collection. The production backend implementation remains separate.

## Try Kairos

The fastest public onboarding path is through the Kairos listing on Zyla, where a free trial is available:

https://zylalabs.com/es/api-marketplace/ciencia+y+educaci%c3%b3n/lugares+de+culto+kairos+api/13766

Marketplace authentication is handled by the marketplace. Do not send a direct Kairos API key when following marketplace-specific instructions.

For **direct Kairos access**, you need a Kairos API key provisioned for you.

Production base URL:

```text
https://kairos.yarumaltech.com
```

## Quick start

For direct access:

```bash
export KAIROS_API_KEY="YOUR_API_KEY"

curl --silent --show-error --fail-with-body \
  -H "X-API-Key: $KAIROS_API_KEY" \
  "https://kairos.yarumaltech.com/v1/places/nearest?lat=6.96333&lon=-75.41722&radiusKm=8&religion=all"
```

A successful response can look like:

```json
{
  "data": {
    "id": "osm:way:164880258",
    "name": "Basílica Nuestra Señora de La Merced",
    "location": {
      "lat": 6.9635248,
      "lon": -75.4165179
    },
    "religion": "christian",
    "denomination": "catholic",
    "distance_m": 80.52,
    "source": {
      "provider": "openstreetmap",
      "osm_type": "way",
      "osm_id": 164880258
    }
  },
  "meta": {
    "radius_km_used": 10
  }
}
```

Never commit a real API key to source control.

See the full [Quickstart](docs/quickstart.md).

## Public endpoints

| Method | Endpoint | Purpose |
| --- | --- | --- |
| `GET` | `/v1/places/nearest` | Return the nearest matching place, or `data: null` when no match exists. |
| `GET` | `/v1/places/nearby` | Return a distance-ordered page of nearby matches. |
| `GET` | `/v1/places/{id}` | Return one place by stable `osm:<type>:<id>` public ID. |

## Search filters

Spatial searches require `lat` and `lon`.

Optional filters include:

- `radiusKm` — default `8`, maximum `20`
- `religion` — default `all`
- `denomination`

Supported `religion` values:

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

`/v1/places/nearby` also supports:

- `limit` — `1..200`, default `50`
- `offset` — `>=0`, default `0`

See [Search Filters and Pagination](docs/filters.md).

## Authentication

Direct Kairos access uses:

```text
X-API-Key: YOUR_API_KEY
```

Marketplace authentication is separate and should follow the marketplace's own instructions.

See [Authentication](docs/authentication.md).

## Errors

Public errors use a consistent envelope:

```json
{
  "error": {
    "code": "INVALID_REQUEST",
    "message": "..."
  }
}
```

Kairos documents normalized behavior for `400`, `401`, `403`, `404`, `405`, `429`, `500`, and `503`.

See [Errors](docs/errors.md).

## Rate limits and monthly quotas

Direct-key responses can expose:

```text
X-RateLimit-Limit
X-RateLimit-Remaining
X-RateLimit-Reset
X-Monthly-Quota-Limit
X-Monthly-Quota-Remaining
X-Monthly-Quota-Reset
```

A throttled request returns HTTP `429` and includes `Retry-After`.

## OpenAPI

The machine-readable production contract is:

[`openapi/kairos-v1.yaml`](openapi/kairos-v1.yaml)

It documents:

- the production server
- authentication
- parameters and validation limits
- response schemas
- rate-limit and quota headers
- normalized public errors

## Postman

Import:

[`postman/kairos.postman_collection.json`](postman/kairos.postman_collection.json)

The collection includes all three public v1 endpoints and uses collection variables so no credential needs to be committed.

Set the `api_key` variable locally before running direct-access requests.

## Runnable examples

- [cURL](examples/curl.md)
- [Python](examples/python.py)
- [JavaScript / Node.js](examples/node.mjs)

## Documentation

- [Quickstart](docs/quickstart.md)
- [Authentication](docs/authentication.md)
- [Search Filters and Pagination](docs/filters.md)
- [Errors](docs/errors.md)
- [OpenAPI contract](openapi/kairos-v1.yaml)
- [Postman collection](postman/kairos.postman_collection.json)

## Data source

Kairos currently normalizes OpenStreetMap-backed place-of-worship data.

Source coverage and metadata completeness vary by location. Fields such as `name`, `religion`, `denomination`, and `distance_m` may be `null` when unavailable. Kairos does not fabricate missing source data.
