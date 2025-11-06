import axios from "axios";
import { Campaign } from "./type";

// Meta Ads API setup
const GRAPH_URL = "https://graph.facebook.com/v23.0";
const ACCESS_TOKEN = process.env.NEXT_PUBLIC_META_ACCESS_TOKEN!;
const AD_ACCOUNT_ID = process.env.NEXT_PUBLIC_META_AD_ACCOUNT_ID!;

// GET CAMPAIGNS
export async function fetchCampaigns(): Promise<Campaign[]> {
  if (!ACCESS_TOKEN || !AD_ACCOUNT_ID) {
    console.warn("⚠️ Missing Meta Ads token or account ID. Returning mock data.");
    return [
      {
        id: "1",
        name: "Mock Campaign",
        objective: "SALES",
        adsets: 3,
        ads: 7,
        budget: "Rp100.000",
        spend: "Rp80.000",
        conv: 5,
        date: "06 Nov 2025",
        status: "ACTIVE",
      },
    ];
  }

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
  } catch (err: any) {
    console.error("❌ Gagal memuat data Meta Ads:", err.response?.data || err);
    return [];
  }
}

// GET INSIGHTS (chart data)
export async function fetchInsights(range: "7d" | "30d") {
  if (!ACCESS_TOKEN || !AD_ACCOUNT_ID) return [];

  try {
    const since =
      range === "7d"
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
      conversions:
        item.actions?.find(
          (a: any) => a.action_type === "offsite_conversion.fb_pixel_purchase"
        )?.value || 0,
      spend: Number(item.spend) || 0,
    }));
  } catch (err: any) {
    console.error("❌ Gagal memuat insights Meta Ads:", err.response?.data || err);
    return [];
  }
}

// CREATE CAMPAIGN
export async function createCampaign(payload: {
  name: string;
  objective: string;
}) {
  if (!ACCESS_TOKEN || !AD_ACCOUNT_ID)
    return { success: false, message: "Token Meta Ads belum dikonfigurasi." };

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
  } catch (err: any) {
    console.error("❌ Gagal membuat campaign:", err.response?.data || err);
    return { success: false };
  }
}
