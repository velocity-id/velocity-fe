export async function getAudiences(adAccountId: string) {
  const accessToken = process.env.NEXT_PUBLIC_FB_ACCESS_TOKEN;
  if (!accessToken) throw new Error("Missing NEXT_PUBLIC_FB_ACCESS_TOKEN");

  const url = `https://graph.facebook.com/v23.0/act_${adAccountId}/customaudiences?fields=id,name,approximate_count&access_token=${accessToken}`;

  console.log("Fetching custom audiences:", url);

  const res = await fetch(url);
  const data = await res.json();

  if (!res.ok) {
    console.error("FAILED:", data);
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


//fungsi untuk mengambil lookalike audience
export async function getLookalikeAudiences(adAccountId: string) {
  const accessToken = process.env.NEXT_PUBLIC_FB_ACCESS_TOKEN;
  if (!accessToken) throw new Error("Missing NEXT_PUBLIC_FB_ACCESS_TOKEN");

  const url = `https://graph.facebook.com/v23.0/act_${adAccountId}/customaudiences?fields=id,name,subtype,approximate_count,lookalike_spec&access_token=${accessToken}`;

  console.log("LOOKALIKE REQUEST:", url);

  const res = await fetch(url);
  const data = await res.json();

  console.log("RAW LOOKALIKE RESPONSE:", data);

  if (!res.ok) throw new Error(data.error?.message || "Failed to fetch lookalikes");

  return (data.data || []).filter(
    (aud: any) =>
      aud.subtype === "LOOKALIKE" ||
      (aud.lookalike_spec && aud.lookalike_spec.origin_audience_id)
  );
}


//mengambil fungsi saved audience
export async function getSavedAudiences(adAccountId: string) {
  const accessToken = process.env.NEXT_PUBLIC_FB_ACCESS_TOKEN;
  if (!accessToken) throw new Error("Missing FB Token");

  const url = `https://graph.facebook.com/v23.0/act_${adAccountId}/saved_audiences?fields=id,name,approximate_count&access_token=${accessToken}`;

  const res = await fetch(url);
  const data = await res.json();
  if (!res.ok) throw new Error(data.error?.message || "Failed to fetch saved audience");

  return data.data || [];
}
