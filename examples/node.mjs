const base = (process.env.KAIROS_API_BASE ?? "").replace(/\/$/, "");
const apiKey = process.env.KAIROS_API_KEY ?? "";

if (!base || !apiKey) {
  console.error("Set KAIROS_API_BASE and KAIROS_API_KEY first.");
  process.exit(1);
}

const url = new URL(`${base}/v1/places/nearby`);
url.searchParams.set("lat", "6.2442");
url.searchParams.set("lon", "-75.5812");
url.searchParams.set("radiusKm", "8");
url.searchParams.set("religion", "all");
url.searchParams.set("limit", "10");
url.searchParams.set("offset", "0");

const response = await fetch(url, {
  headers: { "X-API-Key": apiKey },
});

const body = await response.json();
if (!response.ok) {
  console.error(JSON.stringify(body, null, 2));
  process.exit(1);
}

console.log(JSON.stringify(body, null, 2));
