# Kairos Quickstart

Get your first Kairos Places of Worship API response in a few minutes.

This guide is for **direct Kairos API access** using the `X-API-Key` header.

> If you use Kairos through an API marketplace such as Zyla, use the authentication method and base URL provided by that marketplace instead.

## 1. Requirements

You only need:

- `curl`
- a direct Kairos API key

Production base URL:

```text
https://kairos.yarumaltech.com
```

Never commit a real API key to source control.

## 2. Set your API key

On Linux, macOS, WSL, or Git Bash:

```bash
export KAIROS_API_KEY="YOUR_API_KEY"
```

Kairos direct API keys are sent through the `X-API-Key` header.

## 3. Make your first request

Find the nearest place of worship:

```bash
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

## 4. List nearby places

```bash
curl --silent --show-error --fail-with-body \
  -H "X-API-Key: $KAIROS_API_KEY" \
  "https://kairos.yarumaltech.com/v1/places/nearby?lat=6.96333&lon=-75.41722&radiusKm=8&religion=all&limit=10&offset=0"
```

Results are returned ordered by distance.

## 5. Fetch a place by ID

Use an ID returned by Kairos:

```bash
curl --silent --show-error --fail-with-body \
  -H "X-API-Key: $KAIROS_API_KEY" \
  "https://kairos.yarumaltech.com/v1/places/osm:way:164880258"
```

For ID lookups, `distance_m` is `null` because there is no origin coordinate.

## Search parameters

Spatial endpoints support:

- `lat`: required, from `-90` to `90`
- `lon`: required, from `-180` to `180`
- `radiusKm`: optional, default `8`, maximum `20`
- `religion`: optional, default `all`
- `denomination`: optional

Supported religion values:

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

- `limit`: from `1` to `200`, default `50`
- `offset`: `0` or greater, default `0`

## Errors

Errors use a consistent JSON envelope:

```json
{
  "error": {
    "code": "INVALID_REQUEST",
    "message": "..."
  }
}
```

Common HTTP statuses include:

- `400` invalid request
- `401` missing or invalid authentication
- `403` forbidden authorization context
- `404` place not found
- `405` unsupported HTTP method
- `429` rate limit or monthly quota exceeded
- `500` internal error
- `503` dependency temporarily unavailable

## Next steps

- See the complete OpenAPI contract in [`../openapi/kairos-v1.yaml`](../openapi/kairos-v1.yaml).
- See runnable examples in [`../examples/`](../examples/).
