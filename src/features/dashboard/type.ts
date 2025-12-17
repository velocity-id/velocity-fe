// Struktur data Campaign
export type Campaign = {
  id: string;                     // ID unik campaign dari Meta Ads
  name: string;                   // Nama campaign
  objective: string;              // Tujuan campaign (SALES, TRAFFIC, dsb.)
  status: "ACTIVE" | "PAUSED" | "INACTIVE" | string; // Status campaign
  created_time: string;                   // Tanggal dibuat
};