export type Audience = {
  id: string;
  name: string;
  approximate_count?: number;
  subtype?: string;
  lookalike_spec?: {
    type: string;
    ratio: number;
    country: string;
    origin_audience_id: string;
  };
};

export type Location = {
  key: string;
  name: string;
  type: string;
  country_code: string;
  country_name: string;
  region: string;
  region_id: string;
  supports_region: boolean;
  supports_city: boolean;
};

//placement
export enum AutomaticManualState {
  UNSET = "UNSET",
  AUTOMATIC = "AUTOMATIC",
  MANUAL = "MANUAL",
}

export interface CreateAdSetPayload {
  automatic_manual_state: AutomaticManualState;
  manual_placements?: string[];

  optimization_goal: string;
  billing_event: string;
  promoted_object?: any;
}