import { Campaign } from "./type";

const GRAPH_URL = "https://graph.facebook.com/v23.0";
const ACCESS_TOKEN = process.env.NEXT_PUBLIC_FB_ACCESS_TOKEN!;
const AD_ACCOUNT_ID = process.env.NEXT_PUBLIC_AD_ACCOUNT_ID!;


export async function fetchCampaigns(): Promise<Campaign[]> {
  if (!ACCESS_TOKEN || !AD_ACCOUNT_ID) {
    throw new Error(
      "Missing environment variables: NEXT_PUBLIC_FB_ACCESS_TOKEN or NEXT_PUBLIC_AD_ACCOUNT_ID"
    );
  }

  const url = new URL(`${GRAPH_URL}/act_${AD_ACCOUNT_ID}/campaigns`);
  url.search = new URLSearchParams({
    fields: "id,name,objective,status,created_time",
    limit: "100",
    access_token: ACCESS_TOKEN,
  }).toString();

  const res = await fetch(url.toString());
  const json = await res.json();

  if (!res.ok) {
    throw new Error(json.error?.message || "Gagal memuat campaign");
  }

  const campaigns = json.data ?? [];

  return campaigns.map((c: Campaign): Campaign => ({
    id: c.id,
    name: c.name,
    objective: c.objective ?? "Unknown",
    status: c.status ?? "INACTIVE",
    created_time: c.created_time,
  }));
}
