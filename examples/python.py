#!/usr/bin/env python3
import json
import os
import sys
import urllib.parse
import urllib.request

base = os.environ.get("KAIROS_API_BASE", "").rstrip("/")
api_key = os.environ.get("KAIROS_API_KEY", "")

if not base or not api_key:
    sys.exit("Set KAIROS_API_BASE and KAIROS_API_KEY first.")

query = urllib.parse.urlencode(
    {
        "lat": 6.2442,
        "lon": -75.5812,
        "radiusKm": 8,
        "religion": "all",
    }
)
request = urllib.request.Request(
    f"{base}/v1/places/nearest?{query}",
    headers={"X-API-Key": api_key},
)

with urllib.request.urlopen(request, timeout=20) as response:
    payload = json.load(response)

print(json.dumps(payload, indent=2, ensure_ascii=False))
