import { CreateCampaignResponse, CampaignForm, CampaignAdAccount, CampaignObjectiveItem } from "./type"


export async function createCampaign(form: CampaignForm): Promise<CreateCampaignResponse> {
  const accessToken = process.env.NEXT_PUBLIC_FB_ACCESS_TOKEN
  const accountId = process.env.NEXT_PUBLIC_AD_ACCOUNT_ID

  if (!accessToken || !accountId) {
    throw new Error("Missing environment variables: NEXT_PUBLIC_FB_ACCESS_TOKEN or NEXT_PUBLIC_AD_ACCOUNT_ID")
  }

  const res = await fetch(`https://graph.facebook.com/v23.0/act_${accountId}/campaigns`, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      access_token: accessToken,
      name: form.name,
      objective: form.objective,
      status: form.status,
      special_ad_categories: form.specialAdCategories,
    }),
  })

  const data = await res.json()

  if (!res.ok) {
    const error = data.error ?? {
      message: "Unknown error from Facebook API",
      type: "InternalError",
      code: res.status,
      error_subcode: 0,
    }

    return {
      error: {
        message: error.message,
        type: error.type,
        code: error.code,
        error_subcode: error.error_subcode,
        fbtrace_id: error.fbtrace_id,
      },
    }
  }

  return { id: data.id }
}

export async function getAdAccounts(): Promise<CampaignAdAccount[]> {
  const accessToken = process.env.NEXT_PUBLIC_FB_ACCESS_TOKEN;
   if (!accessToken) {
    throw new Error("Missing environment variables: NEXT_PUBLIC_FB_ACCESS_TOKEN or NEXT_PUBLIC_AD_ACCOUNT_ID")
  }

  try {
    const res = await fetch(
      `https://graph.facebook.com/v23.0/me/adaccounts?fields=id,name,account_status&access_token=${accessToken}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    if (!res.ok) {
      throw new Error(`Failed to fetch ad accounts: ${res.statusText}`);
    }

    const data = await res.json();
    return data.data || [];
  } catch (error) {
    console.error("Error fetching ad accounts:", error);
    throw error;
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

// export async function createCampaignParams({
//   adAccountId,
//   accessToken,
//   name,
//   objective,
// }: CreateCampaignParams): Promise<CreateCampaignResponse> {
//   if (!accessToken || !adAccountId) {
//     throw new Error("Missing adAccountId or accessToken");
//   }

//   const url = `https://graph.facebook.com/v23.0/act_${adAccountId}/campaigns`;

//   const payload = new URLSearchParams();
//   payload.append("name", name);
//   payload.append("objective", objective);
//   payload.append("status", "PAUSED");
//   payload.append("special_ad_categories", "[]");
//   payload.append("access_token", accessToken);

//   const res = await fetch(url, {
//     method: "POST",
//     body: payload,
//   });

//   const data = await res.json();

//   if (!res.ok) {
//     console.error("Error creating campaign:", data);
//     throw new Error(data.error?.message || "Failed to create campaign");
//   }

//   return data;
//   }

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