// Struktur data Campaign untuk dashboard

export type Campaign = {
  id: string;
  name: string;
  objective: string;
  adsets: number;
  ads: number;
  budget: string;
  spend: string | number;
  conv: number;
  date: string;
  status: "ACTIVE" | "PAUSED" | "INACTIVE" | string;
};

// Struktur data untuk chart Meta Ads Insights
export type InsightData = {
  name: string;
  clicks: number;
  impressions: number;
  conversions: number;
  spend: number;
};
