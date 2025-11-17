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
