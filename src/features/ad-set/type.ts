export type CustomAudience = {
  id: string;
  name: string;
  approximate_count?: number;
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

export type SavedAudience = {
  id: string;
  name: string;
};

export type AdInterest = {
  id: string,
  name: string,
  audience_size_lower_bound: string,
  audience_size_upper_bound: string,
  path: string[],
  description: string,
  topic: string
};