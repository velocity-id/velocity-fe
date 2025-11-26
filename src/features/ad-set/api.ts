export async function getCustomAudiences(adAccountId: string) {
  const accessToken = process.env.NEXT_PUBLIC_FB_ACCESS_TOKEN;

  if (!accessToken) {
    throw new Error("Missing NEXT_PUBLIC_FB_ACCESS_TOKEN");
  }

  const url = `https://graph.facebook.com/v23.0/act_${adAccountId}/customaudiences?fields=id,name,approximate_count&access_token=${accessToken}`;
  console.log("Fetching custom audiences from:", url);

  const res = await fetch(url, { method: "GET" });
  const data = await res.json();

  console.log("Response from Facebook:", data);

  if (!res.ok) {
    console.error("Failed to fetch custom audiences:", data);
    throw new Error(data.error?.message || "Failed to fetch audiences");
  }

  return data.data || [];
}

// Fungsi untuk ambil Location Suggestions (Targeting)
export async function getLocations(query: string) {
  const accessToken = process.env.NEXT_PUBLIC_FB_ACCESS_TOKEN;

  if (!accessToken) {
    throw new Error("Missing NEXT_PUBLIC_FB_ACCESS_TOKEN");
  }

  const url = `https://graph.facebook.com/v23.0/search?type=adgeolocation&location_types=["city","region","country"]&q=${encodeURIComponent(
    query
  )}&access_token=${accessToken}`;

  console.log("Fetching locations from:", url);

  const res = await fetch(url, { method: "GET" });
  const data = await res.json();

  console.log("Response from Facebook (Location):", data);

  if (!res.ok) {
    console.error("Failed to fetch locations:", data);
    throw new Error(data.error?.message || "Failed to fetch locations");
  }

  return data.data || [];
}
