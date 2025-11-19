"use client";

import { useEffect, useState } from "react";
import { FormikValues, useFormik } from "formik";
import * as Yup from "yup";

import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Separator } from "@/components/ui/separator";
import { Loader2, Plus } from "lucide-react";
import { getAdAccounts } from "@/features/campaign/api";
import { CampaignAdAccount } from "@/features/campaign/type";
import { CampaignObjectiveItem } from "@/features/campaign/type";
import { CampaignBudgetItem } from "@/features/campaign/type";
import { BidStrategyItem } from "@/features/campaign/type";
import { ScheduleIncreaseItem } from "@/features/campaign/type";




// Skema Validasi Yup
const campaignSchema = Yup.object({
  adAccount: Yup.string().required("Ad Account is required"),
  objective: Yup.string().required("Objective is required"),
  budgetType: Yup.string().required("Budget type is required"),
  budgetCost: Yup.number()
    .typeError("Budget must be a number")
    .positive("Budget must be greater than 0")
    .required("Budget cost is required"),
  bidStrategy: Yup.string().required("Bid strategy is required"),
  schedule: Yup.string().required("Schedule option is required"),
  campaignName: Yup.string().required("campaign Name is required"),
});

type CreateCampaignProps = {
  formik: FormikValues; 
}


export default function CreateCampaign({formik}: CreateCampaignProps) {
  const [loading, setLoading] = useState(true);
  const [campaignParts, setCampaignParts] = useState<string[]>(["Create Date", "Campaign Budget", "Type Name"]);
  const [adAccount, setAdAccount] = useState<CampaignAdAccount[]>([]);
  const [objectives, setObjectives] = useState<CampaignObjectiveItem[]>([]);
  
  // //constant untuk objective
  const CampaignObjective: CampaignObjectiveItem[] = [
    { value: "OUTCOME_AWARENESS", label: "Awareness" },
    { value: "OUTCOME_TRAFFIC", label: "Traffic" },
    { value: "OUTCOME_ENGAGEMENT", label: "Engagement" },
    { value: "OUTCOME_LEADS", label: "Leads" },
    { value: "OUTCOME_APP_PROMOTION", label: "App Promotion" },
    { value: "OUTCOME_SALES", label: "Sales" },
  ];

  //constant untuk budget
  const CampaignBudget : CampaignBudgetItem[] =  [
    { value: "daily_budget", label: "Daily Budget" },
    { value: "lifetime_budget", label: "Lifetime Budget" },
  ];

  //constant untuk budget
  const BidStrategy : BidStrategyItem[] =  [
    { value: "LOWEST_COST_WITHOUT_CAP", label: "Highest Volume" },
    { value: "COST_CAP", label: "Cost per result goal" },
    { value: "LOWEST_COST_WITH_BID_CAP", label: "Bid cap" },
  ];

  //constant schedule increase
  const ScheduleIncreaseType: ScheduleIncreaseItem[] = [
  { value: "value", label: "Increase daily budget by value amount (Rp)" },
  { value: "percentage", label: "Increase daily budget by percentage (%)" }
  ];


  //Fetch Ad Accounts
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [resAdAccount] = await Promise.all([getAdAccounts()]);
        setAdAccount(resAdAccount);
      } catch (err) {
        console.error("Failed to fetch ad accounts:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  //Fetch Objective
  useEffect(() => {
    setObjectives(CampaignObjective);
  }, []);

  
  console.log('formik di create campaign:', formik.values);
  return (
    <div className="w-full">
        <Card className="shadow-lg border w-full">
          <CardContent className="space-y-6 p-6">

            {/* Ad Account */}
            <div>
              <h2 className="font-semibold mb-2">Ad Account</h2>
              {loading ? (
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Loader2 className="animate-spin w-4 h-4" />
                  Loading Ad Account...
                </div>
              ) : (
                <Select
                  value={formik.values.selectedAdAccount}
                  onValueChange={(val) => formik.setFieldValue("selectedAdAccount", val)}
                >
                  <SelectTrigger className="w-[200px]">
                    <SelectValue placeholder="Select Ad Account" />
                  </SelectTrigger>
                  <SelectContent>
                    {adAccount.map((item) => (
                      <SelectItem key={item.id} value={item.id}>
                        {item.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
              {formik.touched.adAccount && formik.errors.adAccount && (
                <p className="text-xs text-red-500 mt-1">{formik.errors.adAccount}</p>
              )}
            </div>

            <Separator />

            {/* Objective */}
            <div>
              <h2 className="font-semibold mb-2">Objective</h2>
              <p className="text-sm text-gray-500 mb-2">Choose Objective</p>
              <Select
                value={formik.values.objective}
                onValueChange={(val) => formik.setFieldValue("objective", val)}
              >
                <SelectTrigger className="w-[200px]">
                  <SelectValue placeholder="Select Objective" />
                </SelectTrigger>
                <SelectContent>
                  {objectives.map((item) => (
                    <SelectItem key={item.value} value={item.value}>
                      {item.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {formik.touched.objective && formik.errors.objective && (
                <p className="text-xs text-red-500 mt-1">{formik.errors.objective}</p>
              )}
            </div>

            <Separator />

            {/* Campaign Name */}
            <div>
              <h2 className="font-semibold mb-2">Campaign Name</h2>
              <p className="text-sm text-gray-500 mb-2">Set Campaign Name</p>
                <Input
                  name="campaignName"
                  placeholder="Enter Campaign Name"
                  value={formik.values.campaignName}
                  onChange={formik.handleChange("campaignName")}
                  onBlur={formik.handleBlur("campaignName")}
                  className="w-[300px]"
                />
                {formik.touched.campaignName && formik.errors.campaignName && (
                  <p className="text-xs text-red-500 mt-1">{formik.errors.campaignName}</p>
                )}
            </div>

            <Separator />
          </CardContent>
        </Card>
    </div>
  );
}
