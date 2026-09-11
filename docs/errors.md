# Errors

Kairos public API errors use a consistent JSON envelope:

```json
{
  "error": {
    "code": "ERROR_CODE",
    "message": "Human-readable message"
  }
}
```

This guide documents the public error behavior for **Kairos v1**.

## HTTP status codes

| HTTP status | Error code | Meaning |
| --- | --- | --- |
| `400` | `INVALID_REQUEST` | A query or path parameter is invalid. |
| `401` | `UNAUTHORIZED` | Authentication is missing, invalid, or revoked. |
| `403` | `FORBIDDEN` | The credential is not valid for the requested route or authorization context. |
| `404` | `NOT_FOUND` | The requested resource does not exist. |
| `405` | `METHOD_NOT_ALLOWED` | The HTTP method is not supported for that route. |
| `429` | `RATE_LIMIT_EXCEEDED` | The active minute request limit has been exhausted. |
| `429` | `MONTHLY_QUOTA_EXCEEDED` | The active monthly quota has been exhausted. |
| `500` | `INTERNAL_ERROR` | Kairos encountered an internal server error. |
| `503` | `SERVICE_UNAVAILABLE` | A required Kairos dependency is temporarily unavailable. |
| `503` | `UPSTREAM_UNAVAILABLE` | The upstream data source is temporarily unavailable. |

## 400 — Invalid request

Kairos returns `INVALID_REQUEST` when a request parameter or public place ID is invalid.

Example:

```json
{
  "error": {
    "code": "INVALID_REQUEST",
    "message": "Invalid request"
  }
}
```

Examples of invalid input include:

- latitude outside `-90..90`
- longitude outside `-180..180`
- `radiusKm <= 0`
- `radiusKm > 20`
- unsupported `religion`
- malformed `denomination`
- `limit` outside `1..200`
- negative `offset`
- malformed public place ID

A valid public place ID has this form:

```text
osm:<node|way|relation>:<positive-id>
```

## 401 — Unauthorized

Returned when authentication is missing, invalid, or revoked.

```json
{
  "error": {
    "code": "UNAUTHORIZED",
    "message": "Authentication required"
  }
}
```

For direct Kairos access, send the API key using:

```text
X-API-Key: YOUR_API_KEY
```

See [Authentication](authentication.md).

## 403 — Forbidden

Returned when a credential is presented in an authorization context where it is not allowed.

```json
{
  "error": {
    "code": "FORBIDDEN",
    "message": "Access forbidden"
  }
}
```

Do not treat `403` as a signal to retry repeatedly. Verify that you are using the correct authentication method and route.

## 404 — Not found

Returned when a requested resource is not found.

```json
{
  "error": {
    "code": "NOT_FOUND",
    "message": "Resource not found"
  }
}
```

For `GET /v1/places/{id}`, use an ID previously returned by Kairos whenever possible.

## 405 — Method not allowed

Returned when the route exists but the HTTP method is unsupported.

```json
{
  "error": {
    "code": "METHOD_NOT_ALLOWED",
    "message": "Method not allowed"
  }
}
```

Kairos v1 public place endpoints currently use `GET`.

## 429 — Rate limit or quota exceeded

Kairos can return two different public error codes with HTTP `429`.

### Minute rate limit

```json
{
  "error": {
    "code": "RATE_LIMIT_EXCEEDED",
    "message": "Rate limit exceeded"
  }
}
```

### Monthly quota

```json
{
  "error": {
    "code": "MONTHLY_QUOTA_EXCEEDED",
    "message": "Monthly quota exceeded"
  }
}
```

A `429` response includes:

```text
Retry-After
X-RateLimit-Limit
X-RateLimit-Remaining
X-RateLimit-Reset
X-Monthly-Quota-Limit
X-Monthly-Quota-Remaining
X-Monthly-Quota-Reset
```

Use `Retry-After` to determine when another request can be attempted.

## 500 — Internal error

Unexpected internal failures are normalized so internal implementation details are not exposed.

```json
{
  "error": {
    "code": "INTERNAL_ERROR",
    "message": "Internal server error"
  }
}
```

A `500` can usually be retried later if the request itself is valid.

## 503 — Temporarily unavailable

Kairos uses HTTP `503` for temporary dependency or upstream failures.

### Service unavailable

```json
{
  "error": {
    "code": "SERVICE_UNAVAILABLE",
    "message": "Service temporarily unavailable"
  }
}
```

### Upstream unavailable

```json
{
  "error": {
    "code": "UPSTREAM_UNAVAILABLE",
    "message": "Upstream temporarily unavailable"
  }
}
```

These errors represent temporary availability problems rather than invalid request parameters.

## Recommended client behavior

A simple client policy is:

- `400`: fix the request before retrying
- `401`: verify or replace the credential
- `403`: verify the route and authorization context
- `404`: verify the resource ID
- `405`: use a supported HTTP method
- `429`: wait according to `Retry-After`
- `500`: retry later with bounded backoff
- `503`: retry later with bounded backoff

Avoid unbounded retry loops.

## Example with cURL

`--fail-with-body` returns a non-zero exit status for HTTP errors while preserving Kairos's JSON error body:

```bash
curl --silent --show-error --fail-with-body \
  -H "X-API-Key: $KAIROS_API_KEY" \
  "https://kairos.yarumaltech.com/v1/places/nearest?lat=6.96333&lon=-75.41722&radiusKm=8&religion=all"
```

## Next steps

- Start with the [Quickstart](quickstart.md).
- See [Authentication](authentication.md).
- See [Search Filters and Pagination](filters.md).
- See the complete OpenAPI contract in [`../openapi/kairos-v1.yaml`](../openapi/kairos-v1.yaml).
