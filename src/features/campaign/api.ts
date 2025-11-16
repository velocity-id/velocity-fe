import { CreateCampaignResponse, CampaignForm, CampaignAdAccount, CampaignBudget, CampaignBidStrategy } from "./type"


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

export async function getCampaignObjectives(): Promise<string[]> {
  const accessToken = process.env.NEXT_PUBLIC_FB_ACCESS_TOKEN;
  const accountId = process.env.NEXT_PUBLIC_AD_ACCOUNT_ID;

  const res = await fetch(
    `https://graph.facebook.com/v23.0/act_${accountId}/campaigns?fields=objective&access_token=${accessToken}`
  );

  const data = await res.json();
  return Array.from(new Set(data.data.map((item: any) => item.objective)));
}

export async function getCampaignBudgets(): Promise<CampaignBudget[]> {
  const accessToken = process.env.NEXT_PUBLIC_FB_ACCESS_TOKEN;
  const accountId = process.env.NEXT_PUBLIC_AD_ACCOUNT_ID;

  const res = await fetch(
    `https://graph.facebook.com/v23.0/act_${accountId}/campaigns?fields=id,name,status,daily_budget,lifetime_budget,budget_remaining&access_token=${accessToken}`
  );

  if (!res.ok) {
    throw new Error("Failed to fetch campaign budgets from Meta Ads API");
  }

  const data = await res.json();

  return data.data.map((item: any) => ({
    id: item.id,
    name: item.name,
    status: item.status,
    daily_budget: item.daily_budget,
    lifetime_budget: item.lifetime_budget,
    budget_remaining: item.budget_remaining,
  }));
  }

export async function getCampaignBidStrategies(): Promise<CampaignBidStrategy[]> {
  const accessToken = process.env.NEXT_PUBLIC_FB_ACCESS_TOKEN;
  const accountId = process.env.NEXT_PUBLIC_AD_ACCOUNT_ID;

  const res = await fetch(
    `https://graph.facebook.com/v23.0/act_${accountId}/campaigns?fields=id,name,bid_strategy&access_token=${accessToken}`
  );

  if (!res.ok) {
    throw new Error("Failed to fetch bid strategies from Meta Ads API");
  }

  const data = await res.json();

  // Transform data ke bentuk yang kita definisikan
  return data.data.map((item: any) => ({
    id: item.id,
    name: item.name,
    bid_strategy: item.bid_strategy,
  }));
}