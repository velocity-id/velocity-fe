import { getSession } from "next-auth/react";
import { Campaign } from "./type";

const GRAPH_URL = "https://graph.facebook.com/v24.0";


export async function fetchCampaigns(adAcountId: string): Promise<Campaign[]> {
  const session = await getSession();
  const accessToken = session?.accessToken;

  if (!accessToken) {
    throw new Error("Unauthorized");
  }

  const url = new URL(`${GRAPH_URL}/act_${adAcountId}/campaigns`);
  url.search = new URLSearchParams({
    fields: "id,name,objective,status,created_time",
    limit: "100",
    access_token: accessToken,
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

export type InsightRow = {
  date_start: string;
  spend?: string;
  clicks?: string;
  impressions?: string;
};

export async function fetchInsights(
  adAccountId: string,
  range: "7d" | "30d"
): Promise<InsightRow[]> {
  const session = await getSession();
  const accessToken = session?.accessToken;

  if (!accessToken) {
    throw new Error("Unauthorized");
  }

  const date_preset = range === "30d" ? "last_30d" : "last_7d";

  const url = new URL(`${GRAPH_URL}/act_${adAccountId}/insights`);
  url.search = new URLSearchParams({
    fields: "date_start,spend,clicks,impressions",
    date_preset,
    time_increment: "1", 
    access_token: accessToken,
  }).toString();

  const res = await fetch(url.toString());
  const json = await res.json();

  if (!res.ok) {
    throw new Error(json.error?.message || "Gagal memuat insights");
  }

  return json.data ?? [];
}