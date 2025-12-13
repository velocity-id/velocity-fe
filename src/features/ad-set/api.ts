import { getSession } from "next-auth/react";

export type SavedAudience = {
  id: string;
  name: string;
};


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


export async function getSavedAudiences(adAccountId: string): Promise<SavedAudience[]> {
  try {
    const session = await getSession();
    console.log("Session in getSavedAudiences:", session);

    if (!session?.accessToken) {
      throw new Error("No Facebook access token in session");
    }

    const accessToken = session.accessToken;

    const url = `https://graph.facebook.com/v24.0/${adAccountId}/saved_audiences?fields=id,name&access_token=${accessToken}`;

    const res = await fetch(url, { method: "GET" });

    if (!res.ok) {
      const errorText = await res.text();
      throw new Error(`Failed to fetch saved audiences: ${res.status} - ${errorText}`);
    }

    const data = await res.json();
    return data.data || [];

  } catch (err) {
    console.error("Error in getSavedAudiences():", err);
    throw err;
  }
}
