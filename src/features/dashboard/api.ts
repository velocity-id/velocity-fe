import { Campaign } from "./type";

const GRAPH_URL = "https://graph.facebook.com/v23.0";
const ACCESS_TOKEN = process.env.NEXT_PUBLIC_FB_ACCESS_TOKEN!;
const AD_ACCOUNT_ID = process.env.NEXT_PUBLIC_AD_ACCOUNT_ID!;

// ✅ 1. Tetap: Mengambil list campaign + insight summary
export async function fetchCampaigns(): Promise<Campaign[]> {
  if (!ACCESS_TOKEN || !AD_ACCOUNT_ID) {
    throw new Error(
      "Missing environment variables: NEXT_PUBLIC_FB_ACCESS_TOKEN or NEXT_PUBLIC_AD_ACCOUNT_ID"
    );
  }

  // --- Campaign list ---
  const campaignUrl = new URL(`${GRAPH_URL}/act_${AD_ACCOUNT_ID}/campaigns`);
  campaignUrl.search = new URLSearchParams({
    fields: "id,name,objective,status,daily_budget,created_time",
    access_token: ACCESS_TOKEN,
    limit: "100",
  }).toString();

  const campaignRes = await fetch(campaignUrl.toString());
  const campaignJson = await campaignRes.json();

  if (!campaignRes.ok) {
    throw new Error(campaignJson.error?.message || "Gagal memuat campaign");
  }

  const campaigns = campaignJson.data ?? [];

  // --- Insights summary (per campaign, total 30 hari) ---
  const insightsUrl = new URL(`${GRAPH_URL}/act_${AD_ACCOUNT_ID}/insights`);
  insightsUrl.search = new URLSearchParams({
    fields: "campaign_id,spend,clicks,impressions,actions",
    date_preset: "last_30d",
    level: "campaign",
    access_token: ACCESS_TOKEN,
    limit: "500",
  }).toString();

  const insightsRes = await fetch(insightsUrl.toString());
  const insightsJson = await insightsRes.json();

  if (!insightsRes.ok) {
    throw new Error(insightsJson.error?.message || "Gagal memuat insights");
  }

  const insights = insightsJson.data ?? [];

  // --- Merge campaign + insights ---
  return campaigns.map((c: any) => {
    const found = insights.find((i: any) => i.campaign_id === c.id);

    const spend = found ? Number(found.spend || 0) : 0;
    const clicks = found ? Number(found.clicks || 0) : 0;
    const impressions = found ? Number(found.impressions || 0) : 0;
    const conversions =
      found?.actions?.find(
        (a: any) =>
          a.action_type === "offsite_conversion.fb_pixel_purchase"
      )?.value || 0;

    return {
      id: c.id,
      name: c.name,
      objective: c.objective ?? "Unknown",
      budget: c.daily_budget
        ? Number(c.daily_budget) / 100
        : 0,
      spend, // ✅ PERBAIKAN: angka, bukan string
      clicks,
      impressions,
      conversions,
      date: c.created_time,
      status: c.status ?? "INACTIVE",
    };
  });
}

// ✅ 2. Tambahan baru: fetchInsights (untuk chart + total spend)
export async function fetchInsights(range: "7d" | "30d") {
  const preset = range === "7d" ? "last_7d" : "last_30d";

  const url = new URL(`${GRAPH_URL}/act_${AD_ACCOUNT_ID}/insights`);
  url.search = new URLSearchParams({
    fields: "date_start,spend,clicks,impressions,actions",
    level: "account",
    time_increment: "1", // ✅ daily breakdown untuk chart
    date_preset: preset,
    access_token: ACCESS_TOKEN,
  }).toString();

  const res = await fetch(url.toString());
  const json = await res.json();

  if (!res.ok) {
    throw new Error(json.error?.message || "Gagal memuat insights harian");
  }

  return json.data.map((d: any) => ({
    date: d.date_start,
    spend: Number(d.spend || 0),
    clicks: Number(d.clicks || 0),
    impressions: Number(d.impressions || 0),
    conversions:
      d.actions?.find(
        (a: any) =>
          a.action_type === "offsite_conversion.fb_pixel_purchase"
      )?.value || 0,
  }));
}
