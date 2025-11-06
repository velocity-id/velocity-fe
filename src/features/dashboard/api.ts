import { Campaign } from "./type";

const GRAPH_URL = "https://graph.facebook.com/v23.0";
const ACCESS_TOKEN = process.env.NEXT_PUBLIC_FB_ACCESS_TOKEN!;
const AD_ACCOUNT_ID = process.env.NEXT_PUBLIC_AD_ACCOUNT_ID!;

function ensureEnv() {
  if (!ACCESS_TOKEN || !AD_ACCOUNT_ID) {
    throw new Error(
      "Missing env: NEXT_PUBLIC_FB_ACCESS_TOKEN or NEXT_PUBLIC_AD_ACCOUNT_ID"
    );
  }
}

async function fetchJSON(url: string) {
  const res = await fetch(url, { method: "GET" });
  const json = await res.json();
  if (!res.ok) {
    const msg = json?.error?.message || "Meta Ads request failed";
    throw new Error(msg);
  }
  return json;
}

export async function fetchCampaigns(): Promise<Campaign[]> {
  ensureEnv();

  const campaignUrl = new URL(`${GRAPH_URL}/act_${AD_ACCOUNT_ID}/campaigns`);
  campaignUrl.search = new URLSearchParams({
    fields: "id,name,objective,status,daily_budget,created_time",
    access_token: ACCESS_TOKEN,
    limit: "100",
  }).toString();

  const campaignJson = await fetchJSON(campaignUrl.toString());
  const campaigns = campaignJson.data ?? [];
  if (campaigns.length === 0) return [] as Campaign[];

  const insightsUrl = new URL(`${GRAPH_URL}/act_${AD_ACCOUNT_ID}/insights`);
  insightsUrl.search = new URLSearchParams({
    fields: "campaign_id,spend,clicks,impressions,actions",
    level: "campaign",
    date_preset: "last_30d",
    access_token: ACCESS_TOKEN,
    limit: "500",
  }).toString();

  const insightsJson = await fetchJSON(insightsUrl.toString());
  const insights = insightsJson.data ?? [];

  const merged: Campaign[] = campaigns.map((c: any) => {
    const found = insights.find((i: any) => i.campaign_id === c.id);
    const spend = found ? Number(found.spend || 0) : 0;
    const clicks = found ? Number(found.clicks || 0) : 0;
    const impressions = found ? Number(found.impressions || 0) : 0;
    const conversions = Number(
      found?.actions?.find(
        (a: any) => a.action_type === "offsite_conversion.fb_pixel_purchase"
      )?.value || 0
    );

    return {
      id: c.id,
      name: c.name,
      objective: c.objective ?? "Unknown",
      adsets: 0,
      ads: 0,
      budget: c.daily_budget ? `Rp${(Number(c.daily_budget) / 100).toLocaleString("id-ID")}` : "-",
      spend,
      clicks,
      impressions,
      conv: conversions,
      date: new Date(c.created_time).toLocaleDateString("id-ID", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      }),
      status: c.status ?? "INACTIVE",
    } as Campaign;
  });

  return merged;
}

export async function fetchInsights(range: "7d" | "30d") {
  ensureEnv();
  const preset = range === "7d" ? "last_7d" : "last_30d";

  const url = new URL(`${GRAPH_URL}/act_${AD_ACCOUNT_ID}/insights`);
  url.search = new URLSearchParams({
    fields: "date_start,spend,clicks,impressions,actions",
    level: "account",
    time_increment: "1",
    date_preset: preset,
    access_token: ACCESS_TOKEN,
  }).toString();

  const json = await fetchJSON(url.toString());
  const rows = json.data ?? [];

  return rows.map((d: any) => ({
    date: d.date_start,
    spend: Number(d.spend || 0),
    clicks: Number(d.clicks || 0),
    impressions: Number(d.impressions || 0),
    conversions: Number(
      d.actions?.find(
        (a: any) => a.action_type === "offsite_conversion.fb_pixel_purchase"
      )?.value || 0
    ),
  }));
}