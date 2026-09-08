#!/usr/bin/env python3
import json
import os
import sys
import urllib.error
import urllib.parse
import urllib.request

base = os.environ.get("KAIROS_API_BASE", "").rstrip("/")
api_key = os.environ.get("KAIROS_API_KEY", "")

if not base or not api_key:
    sys.exit("Set KAIROS_API_BASE and KAIROS_API_KEY first.")

query = urllib.parse.urlencode(
    {
        "lat": os.environ.get("KAIROS_LAT", "6.2442"),
        "lon": os.environ.get("KAIROS_LON", "-75.5812"),
        "radiusKm": os.environ.get("KAIROS_RADIUS_KM", "8"),
        "religion": os.environ.get("KAIROS_RELIGION", "all"),
    }
)
request = urllib.request.Request(
    f"{base}/v1/places/nearest?{query}",
    headers={"X-API-Key": api_key},
)

try:
    with urllib.request.urlopen(request, timeout=20) as response:
        payload = json.load(response)
except urllib.error.HTTPError as error:
    try:
        payload = json.load(error)
        print(json.dumps(payload, indent=2, ensure_ascii=False), file=sys.stderr)
    except (json.JSONDecodeError, UnicodeDecodeError):
        print(f"Kairos returned HTTP {error.code}", file=sys.stderr)
    sys.exit(1)
except urllib.error.URLError as error:
    print(f"Could not reach Kairos: {error.reason}", file=sys.stderr)
    sys.exit(1)

print(json.dumps(payload, indent=2, ensure_ascii=False))
