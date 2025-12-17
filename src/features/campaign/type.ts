export type CampaignForm = {
    name: string
    objective: CampaignObjective
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

export type CampaignObjective =
  | "OUTCOME_AWARENESS"
  | "OUTCOME_TRAFFIC"
  | "OUTCOME_ENGAGEMENT"
  | "OUTCOME_LEADS"
  | "OUTCOME_APP_PROMOTION"
  | "OUTCOME_SALES";

export type CampaignObjectiveItem = {
  value: CampaignObjective;
  label: string;
}

export type CampaignBudget = "daily_budget" | "lifetime_budget";

export type CampaignBudgetItem = {
  value: CampaignBudget;
  label: string;
};

export type BidStrategy = "LOWEST_COST_WITHOUT_CAP" | "COST_CAP" | "LOWEST_COST_WITH_BID_CAP";

export type BidStrategyItem = {
  value: BidStrategy;
  label: string;
};

export type CampaignScheduleMode = "always" | "scheduled";

export interface CampaignScheduleModeItem {
  value: CampaignScheduleMode;
  label: string;
}

export type ScheduleIncreaseType = "value" | "percentage";

export interface ScheduleIncreaseItem {
  value: ScheduleIncreaseType;
  label: string;
}

export interface CampaignSchedulePeriod {
  startDate: string; 
  endDate: string;
  increaseType: ScheduleIncreaseType;
  increaseAmount: number;
}

export type CampaignBidStrategy = {
  id: string;
  name: string;
  bid_strategy: string;
};
export interface Campaign {
  id: string;
  name: string;
  status: string;
  objective: string;
  effective_status: string;
}