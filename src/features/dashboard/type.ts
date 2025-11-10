// Struktur data Campaign
export type Campaign = {
  id: string;                     // ID unik campaign dari Meta Ads
  name: string;                   // Nama campaign
  objective: string;              // Tujuan campaign (SALES, TRAFFIC, dsb.)
  adsets: number;                 // Jumlah Ad Set dalam campaign
  ads: number;                    // Jumlah Ads dalam campaign
  budget: string;                 // Budget dalam format "Rp..."
  spend: string | number;         // Total pengeluaran (spend)
  conv: number;                   // Jumlah konversi
  date: string;                   // Tanggal dibuat
  status: "ACTIVE" | "PAUSED" | "INACTIVE" | string; // Status campaign
};

// Struktur data Insights (Chart)
export type InsightData = {
  name: string;           // tanggal (date_start dari Meta API)
  clicks: number;         // jumlah klik
  impressions: number;    // jumlah impresi
  conversions: number;    // jumlah konversi
  spend: number;          // total pengeluaran per hari
};
