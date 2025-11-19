'use client';
import { getSession } from "next-auth/react";
import { Campaign } from "@/features/campaign/type";
import { CreateCampaignResponse, CampaignForm, CampaignAdAccount, CampaignBudget, CampaignBidStrategy } from "./type"



/* ============================================================
    CREATE CAMPAIGN
   ============================================================ */
export async function createCampaign(
  form: CampaignForm,
): Promise<CreateCampaignResponse> {
  const session = await getSession();

  if (!session?.accessToken) {
    throw new Error("No Facebook access token in session");
  }

  const accessToken = session.accessToken;
  const accountId = process.env.NEXT_PUBLIC_AD_ACCOUNT_ID;

  if (!accountId) {
    throw new Error("Missing env: NEXT_PUBLIC_AD_ACCOUNT_ID");
  }

  const res = await fetch(
    `https://graph.facebook.com/v23.0/act_${accountId}/campaigns`,
    {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        access_token: accessToken,
        name: form.name,
        objective: form.objective,
        status: form.status,
        special_ad_categories: form.specialAdCategories,
      }),
    },
  );

  const data = await res.json();

  if (!res.ok) {
    return { error: data.error };
  }

  return { id: data.id };
}



/* ============================================================
    GET AD ACCOUNTS
   ============================================================ */
export async function getAdAccounts(): Promise<CampaignAdAccount[]> {
  try {
    const session = await getSession();
    console.log("Session in getAdAccounts:", session);

    if (!session?.accessToken) {
      throw new Error("No Facebook access token in session");
    }

    const accessToken = session.accessToken;

    const res = await fetch(
      `https://graph.facebook.com/v23.0/me/adaccounts?fields=id,name,account_status&access_token=${accessToken}`,
      { method: "GET" }
    );

    if (!res.ok) {
      const errorText = await res.text();
      throw new Error(`Failed to fetch ad accounts: ${res.status} - ${errorText}`);
    }

    const data = await res.json();
    return data.data || [];

  } catch (err) {
    console.error("Error in getAdAccounts():", err);
    throw err; // lempar lagi biar bisa ditangkap di UI
  }
}

export async function getCampaignObjectives(accessToken: string) {
  const res = await fetch(
    `https://graph.facebook.com/v23.0/metadata?fields=adobjectives&access_token=${accessToken}`
  );

  if (!res.ok) {
    throw new Error("Failed to fetch campaign objectives");
  }

  return res.json();
}

// export async function getCampaignObjectives(): Promise<CampaignObjectiveItem[]> {
//   return [];
// }

export async function createCampaignParams({
  adAccountId,
  accessToken,
  name,
  objective,
}: CreateCampaignParams): Promise<CreateCampaignResponse> {
  if (!accessToken || !adAccountId) {
    throw new Error("Missing adAccountId or accessToken");
  }

  const url = `https://graph.facebook.com/v23.0/act_${adAccountId}/campaigns`;

  const payload = new URLSearchParams();
  payload.append("name", name);
  payload.append("objective", objective);
  payload.append("status", "PAUSED");
  payload.append("special_ad_categories", "[]");
  payload.append("access_token", accessToken);

  const res = await fetch(url, {
    method: "POST",
    body: payload,
  });

  const data = await res.json();

  if (!res.ok) {
    console.error("Error creating campaign:", data);
    throw new Error(data.error?.message || "Failed to create campaign");
  }

  return data;
  }

  // Transform data ke bentuk yang kita definisikan
  return data.data.map((item: any) => ({
    id: item.id,
    name: item.name,
    bid_strategy: item.bid_strategy,
  }));
}
// export async function createCampaign(form: CampaignForm): Promise<CreateCampaignResponse> {
//   const accessToken = process.env.NEXT_PUBLIC_FB_ACCESS_TOKEN;
//   const accountId = process.env.NEXT_PUBLIC_AD_ACCOUNT_ID;

//   const payload = new URLSearchParams();
//   payload.append("name", form.name);
//   payload.append("objective", form.objective);
//   payload.append("status", "PAUSED");
//   payload.append("special_ad_categories", "[]");
  
//   // tambahkan logic budget
//   if (form.budgetType === "daily_budget") {
//     payload.append("daily_budget", String(Number(form.budgetCost) * 100)); // x100 = cents
//   } else {
//     payload.append("lifetime_budget", String(Number(form.budgetCost) * 100));
//   }

//   payload.append("access_token", accessToken!);

//   const res = await fetch(
//     `https://graph.facebook.com/v23.0/act_${accountId}/campaigns`,
//     {
//       method: "POST",
//       body: payload,
//     }
//   );

//   return res.json();
// }


// export async function getCampaignBidStrategies(): Promise<CampaignBidStrategy[]> {
//   const accessToken = process.env.NEXT_PUBLIC_FB_ACCESS_TOKEN;
//   const accountId = process.env.NEXT_PUBLIC_AD_ACCOUNT_ID;

//   const res = await fetch(
//     `https://graph.facebook.com/v23.0/act_${accountId}/campaigns?fields=id,name,bid_strategy&access_token=${accessToken}`
//   );

//   if (!res.ok) {
//     throw new Error("Failed to fetch bid strategies from Meta Ads API");
//   }

//   const data = await res.json();

//   // Transform data ke bentuk yang kita definisikan
//   return data.data.map((item: any) => ({
//     id: item.id,
//     name: item.name,
//     bid_strategy: item.bid_strategy,
//   }));
// }


export async function getCampaigns(): Promise<Campaign[]> {
  const session = await getSession();

  if (!session?.accessToken) {
    throw new Error("No FB access token in session");
  }

  const accessToken = session.accessToken;
  const accountId = process.env.NEXT_PUBLIC_AD_ACCOUNT_ID;

  if (!accountId) {
    throw new Error("Missing env: NEXT_PUBLIC_AD_ACCOUNT_ID");
  }

  const res = await fetch(
    `https://graph.facebook.com/v23.0/act_${accountId}/campaigns?fields=id,name,status,objective,effective_status&access_token=${accessToken}`,
    { method: "GET" },
  );

  if (!res.ok) {
    throw new Error(`Failed to fetch campaigns: ${res.statusText}`);
  }

  const data = await res.json();
  return data.data || [];
}
