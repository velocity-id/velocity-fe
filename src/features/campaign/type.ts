export type CampaignForm = {
    name: string
    objective: string
    status: string
    specialAdCategories: string
}

export type CreateCampaignResponse = {
    id?: string
    error?: {
        message?: string,
        type?: string,
        code?: number,
        error_subcode?: number,
        fbtrace_id?: string
    }
}

export type CampaignAdAccount = {
    id: string
    name: string
    account_status: string

}

export type CampaignBudget ={
  id: string;
  name: string;
  status: string;
  daily_budget: number;
  lifetime_budget: number;
  budget_remaining: number;
}

export type CampaignBidStrategy = {
  id: string;
  name: string;
  bid_strategy: string;
};