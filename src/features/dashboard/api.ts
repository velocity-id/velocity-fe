import axios from "axios";
import { Campaign } from "./type";

const GRAPH_URL = "https://graph.facebook.com/v23.0";
const ACCESS_TOKEN = process.env.NEXT_PUBLIC_META_ACCESS_TOKEN!;
const AD_ACCOUNT_ID = process.env.NEXT_PUBLIC_META_AD_ACCOUNT_ID!;

// GET CAMPAIGNS
export async function fetchCampaigns(): Promise<Campaign[]> {
  try {
    const res = await axios.get<{ data: any[] }>(
      `${GRAPH_URL}/act_${AD_ACCOUNT_ID}/campaigns`,
      {
        params: {
          fields: "id,name,objective,status,daily_budget,created_time",
          access_token: ACCESS_TOKEN,
        },
      }
    );

    return res.data.data.map((c) => ({
      id: c.id,
      name: c.name,
      objective: c.objective || "Unknown",
      adsets: 0,
      ads: 0,
      budget: c.daily_budget
        ? `Rp${(Number(c.daily_budget) / 100).toLocaleString("id-ID")}`
        : "-",
      spend: "-",
      conv: 0,
      date: new Date(c.created_time).toLocaleDateString("id-ID", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      }),
      status: c.status || "INACTIVE",
    }));
  } catch (err) {
    console.error("❌ Gagal memuat data Meta Ads:", err);
    return [];
  }
}

// GET INSIGHTS
export async function fetchInsights(range: "7d" | "30d") {
  try {
    const since = range === "7d"
      ? new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
      : new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
    const until = new Date();

    const res = await axios.get<{ data: any[] }>(
      `${GRAPH_URL}/act_${AD_ACCOUNT_ID}/insights`,
      {
        params: {
          fields: "date_start,clicks,impressions,spend,actions",
          time_range: JSON.stringify({
            since: since.toISOString().split("T")[0],
            until: until.toISOString().split("T")[0],
          }),
          access_token: ACCESS_TOKEN,
        },
      }
    );

    return res.data.data.map((item) => ({
      name: item.date_start,
      clicks: Number(item.clicks) || 0,
      impressions: Number(item.impressions) || 0,
      spend: Number(item.spend) || 0,
      conversions:
        item.actions?.find(
          (a: any) => a.action_type === "offsite_conversion.fb_pixel_purchase"
        )?.value || 0,
    }));
  } catch (err) {
    console.error("❌ Gagal memuat insights Meta Ads:", err);
    return [];
  }
}

// CREATE CAMPAIGN 
export async function createCampaign(payload: {
  name: string;
  objective: string;
}) {
  try {
    const res = await axios.post<{ id: string }>(
      `${GRAPH_URL}/act_${AD_ACCOUNT_ID}/campaigns`,
      {
        name: payload.name,
        objective: payload.objective,
        status: "PAUSED",
        access_token: ACCESS_TOKEN,
      }
    );

    return {
      success: true,
      data: {
        id: res.data.id,
        name: payload.name,
        objective: payload.objective,
        status: "PAUSED",
      },
    };
  } catch (err) {
    console.error("❌ Gagal membuat campaign:", err);
    return { success: false };
  }
}
