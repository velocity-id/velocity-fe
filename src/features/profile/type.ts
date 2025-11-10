// src/features/profile/type.ts

export interface ProfileData {
  business: BusinessData;
  metaAds: MetaAdsData;
  manager: ManagerData;
  social: SocialData;
  campaigns?: CampaignSummary;
}

// ================= BUSINESS =================
export interface BusinessData {
  name: string;
  location: string;
  website: string;
  phone: string;
  email: string;
  since: string;
  verified: boolean;
}

// ================= META ADS =================
export interface MetaAdsData {
  managerId: string;
  adAccountName: string;
  adAccountId: string;
  currency: string;
  created: string;
  status?: 'active' | 'inactive';
}

// ================= MANAGER =================
export interface ManagerData {
  name: string;
  verified: boolean;
  teamMembers: number;
  adAccounts: number;
  tokenStatus: string;
  tokenExpiry: string;
  teamDetails?: string;
}

// ================= SOCIAL =================
export interface SocialData {
  facebook: FacebookPage[];
  instagram: InstagramAccount[];
}

export interface FacebookPage {
  name: string;
  handle: string;
  followers: string;
  category: string;
  verified?: boolean;
}

export interface InstagramAccount {
  name: string;
  followers: string;
  posts: number;
  verified?: boolean;
}

// ================= CAMPAIGN SUMMARY =================
export interface CampaignSummary {
  impressions: number;
  clicks: number;
  spend: string;
  currency: string;
}
