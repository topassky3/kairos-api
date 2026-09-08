const base = (process.env.KAIROS_API_BASE ?? "").replace(/\/$/, "");
const apiKey = process.env.KAIROS_API_KEY ?? "";

if (!base || !apiKey) {
  console.error("Set KAIROS_API_BASE and KAIROS_API_KEY first.");
  process.exit(1);
}

const url = new URL(`${base}/v1/places/nearby`);
url.searchParams.set("lat", process.env.KAIROS_LAT ?? "6.2442");
url.searchParams.set("lon", process.env.KAIROS_LON ?? "-75.5812");
url.searchParams.set("radiusKm", process.env.KAIROS_RADIUS_KM ?? "8");
url.searchParams.set("religion", process.env.KAIROS_RELIGION ?? "all");
url.searchParams.set("limit", process.env.KAIROS_LIMIT ?? "10");
url.searchParams.set("offset", process.env.KAIROS_OFFSET ?? "0");

let response;
try {
  response = await fetch(url, {
    headers: { "X-API-Key": apiKey },
  });
} catch (error) {
  console.error(`Could not reach Kairos: ${error.message}`);
  process.exit(1);
}

const text = await response.text();
let body;
try {
  body = JSON.parse(text);
} catch {
  body = text;
}

if (!response.ok) {
  console.error(
    typeof body === "string" ? body : JSON.stringify(body, null, 2),
  );
  process.exit(1);
}

console.log(typeof body === "string" ? body : JSON.stringify(body, null, 2));
