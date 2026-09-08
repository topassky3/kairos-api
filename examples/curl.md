# cURL examples

Set the deployment host and your direct Kairos API key first:

```bash
export KAIROS_API_BASE="https://YOUR_KAIROS_HOST"
export KAIROS_API_KEY="YOUR_API_KEY"
```

## Nearest place

```bash
curl --silent --show-error --fail-with-body \
  -H "X-API-Key: $KAIROS_API_KEY" \
  "$KAIROS_API_BASE/v1/places/nearest?lat=6.2442&lon=-75.5812&radiusKm=8&religion=all"
```

## Nearby places

```bash
curl --silent --show-error --fail-with-body \
  -H "X-API-Key: $KAIROS_API_KEY" \
  "$KAIROS_API_BASE/v1/places/nearby?lat=6.2442&lon=-75.5812&radiusKm=8&religion=christian&denomination=catholic&limit=20&offset=0"
```

## Fetch by stable ID

```bash
curl --silent --show-error --fail-with-body \
  -H "X-API-Key: $KAIROS_API_KEY" \
  "$KAIROS_API_BASE/v1/places/osm:node:123456"
```

The cURL examples return a non-zero status on HTTP errors while keeping the JSON response body visible.

Use IDs returned by Kairos rather than assuming that the example ID exists in a deployment.
