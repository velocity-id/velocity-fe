import { CreateCampaignResponse, CampaignForm, CampaignAdAccount } from "./type"

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