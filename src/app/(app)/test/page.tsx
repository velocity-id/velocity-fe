// app/campaigns/page.tsx

import React from "react";
import { getCampaigns } from "@/features/campaign/api"; // sesuaikan path kamu

export default async function CampaignPage() {
  let campaigns = [];

  try {
    campaigns = await getCampaigns();
  } catch (error: any) {
    return (
      <div className="p-6">
        <h1 className="text-2xl font-bold mb-2">Campaigns</h1>
        <p className="text-red-600">Gagal memuat campaign: {error.message}</p>
      </div>
    );
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Campaign List</h1>

      {campaigns.length === 0 ? (
        <p className="text-gray-500">Tidak ada campaign ditemukan.</p>
      ) : (
        <div className="space-y-4">
          {campaigns.map((campaign: any) => (
            <div
              key={campaign.id}
              className="border rounded-lg p-4 shadow-sm bg-white"
            >
              <p className="font-semibold">📌 {campaign.name}</p>
              <p className="text-sm text-gray-600">ID: {campaign.id}</p>
              <p className="text-sm">
                Objective:{" "}
                <span className="font-medium">{campaign.objective}</span>
              </p>
              <p className="text-sm">
                Status: <span className="font-medium">{campaign.status}</span>
              </p>
              <p className="text-sm">
                Effective Status:{" "}
                <span className="font-medium">{campaign.effective_status}</span>
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
