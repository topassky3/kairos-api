# Authentication

Kairos supports direct API access with an API key sent in the `X-API-Key` HTTP header.

This document covers **direct Kairos API access**. If you use Kairos through a marketplace such as Zyla, use the authentication method documented by that marketplace.

## Base URL

```text
https://kairos.yarumaltech.com
```

## Send your API key

Set your key as an environment variable:

```bash
export KAIROS_API_KEY="YOUR_API_KEY"
```

Then send it in the `X-API-Key` header:

```bash
curl --silent --show-error --fail-with-body \
  -H "X-API-Key: $KAIROS_API_KEY" \
  "https://kairos.yarumaltech.com/v1/places/nearest?lat=6.96333&lon=-75.41722&radiusKm=8&religion=all"
```

Direct Kairos API keys are intended for the public `/v1/*` API.

## Keep keys secret

Treat an API key like a password.

Do not:

- commit it to Git
- place it in public frontend JavaScript
- include it in screenshots, logs, issues, or support messages
- store it in a public repository
- send it as a query parameter

Prefer environment variables or a server-side secrets manager.

## Authentication errors

### HTTP 401 — Unauthorized

Kairos returns `401` when authentication is missing, invalid, or no longer active.

Example:

```json
{
  "error": {
    "code": "UNAUTHORIZED",
    "message": "Authentication required"
  }
}
```

### HTTP 403 — Forbidden

Kairos can return `403` when a valid credential is used in an authorization context where it is not permitted.

Example:

```json
{
  "error": {
    "code": "FORBIDDEN",
    "message": "Access forbidden"
  }
}
```

## Rate limits and quotas

Successful direct-key responses expose usage information through response headers:

```text
X-RateLimit-Limit
X-RateLimit-Remaining
X-RateLimit-Reset
X-Monthly-Quota-Limit
X-Monthly-Quota-Remaining
X-Monthly-Quota-Reset
```

If the active minute limit or monthly quota is exhausted, Kairos returns HTTP `429`.

Minute limit example:

```json
{
  "error": {
    "code": "RATE_LIMIT_EXCEEDED",
    "message": "Rate limit exceeded"
  }
}
```

Monthly quota example:

```json
{
  "error": {
    "code": "MONTHLY_QUOTA_EXCEEDED",
    "message": "Monthly quota exceeded"
  }
}
```

A `429` response also includes a `Retry-After` header.

## Marketplace access

Marketplace authentication is separate from direct Kairos authentication.

For example, a marketplace may require its own bearer token or API key and then forward requests to Kairos. In that case, follow the marketplace documentation rather than sending a direct Kairos key.

## Next steps

- Start with the [Quickstart](quickstart.md).
- Review search options in `filters.md` once available.
- See the full machine-readable contract in [`../openapi/kairos-v1.yaml`](../openapi/kairos-v1.yaml).
