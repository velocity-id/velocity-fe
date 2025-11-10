// features/profile/api.ts
import { ProfileData } from "./type";

export async function fetchProfileData(): Promise<ProfileData> {
  // simulasi data seperti dari server
  const response: ProfileData = {
    business: {
      name: "PT Velocity Indonesia",
      location: "Jakarta, Indonesia",
      website: "www.velocity.co.id",
      phone: "+62 21 1234 5678",
      email: "info@velocity.co.id",
      since: "15 Jan 2020",
      verified: true,
    },
    metaAds: {
      managerId: "2237849152",
      adAccountName: "Velocity Official Ads",
      adAccountId: "act_102983554",
      currency: "IDR (Indonesian Rupiah)",
      created: "15 Jan 2020",
      status: "active",
    },
    manager: {
      name: "Velocity Business Manager",
      verified: true,
      teamMembers: 8,
      teamDetails: "3 Admins, 5 Advertisers",
      adAccounts: 3,
      tokenStatus: "Active",
      tokenExpiry: "27 Nov 2025",
    },
    campaigns: {
      impressions: 120400,
      clicks: 1200,
      spend: "7.8M",
      currency: "IDR"
    },
    social: {
      facebook: [
        { name: "Velocity Official", handle: "@velocityofficial", followers: "125K", category: "Technology" },
        { name: "Velocity Gaming", handle: "@velocitygaming", followers: "85K", category: "Gaming" },
      ],
      instagram: [
        { name: "@velocityofficial", followers: "92K", posts: 1234 },
        { name: "@velocitygaming", followers: "63K", posts: 856 },
      ],
    },
  };

  // simulasi delay 500ms seperti fetch sungguhan
  await new Promise((r) => setTimeout(r, 500));
  return response;
}
