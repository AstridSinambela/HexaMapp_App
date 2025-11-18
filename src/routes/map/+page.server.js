export async function load() {
  const res = await fetch(
    "https://datahub.io/core/geo-countries/r/countries.geojson"
  );

  if (!res.ok) {
    throw new Error("Failed to load GeoJSON");
  }

  const data = await res.json();

  return {
    countries: data.features
  };
}
