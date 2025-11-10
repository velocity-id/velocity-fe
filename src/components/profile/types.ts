export interface BusinessData {
  name: string;
  location: string;
  website: string;
  phone: string;
  email: string;
  since: string;
  verified: boolean;
}

export interface MetaAdsData {
  managerId: string;
  adAccountName: string;
  adAccountId: string;
  currency: string;
  created: string;
}

export interface ManagerData {
  name: string;
  verified: boolean;
  teamMembers: number;
  adAccounts: number;
  tokenStatus: string;
  tokenExpiry: string;
}

export interface SocialData {
  facebook: FacebookPage[];
  instagram: InstagramAccount[];
}

export interface FacebookPage {
  name: string;
  handle: string;
  followers: string;
  category: string;
}

export interface InstagramAccount {
  name: string;
  followers: string;
  posts: number;
}