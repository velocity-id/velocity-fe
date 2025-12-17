"use client";

import { FormikValues } from "formik";
import { useEffect, useState } from "react";

import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { getAdAccounts } from "@/features/campaign/api";
import { CampaignAdAccount, CampaignObjectiveItem } from "@/features/campaign/type";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useLoading } from "@/hooks/use-loading";

type CreateCampaignProps = {
  formik: FormikValues;
}

export default function CreateCampaign({ formik }: CreateCampaignProps) {
  const { setLoading } = useLoading();
  const [adAccount, setAdAccount] = useState<CampaignAdAccount[]>([]);
  const [objectives, setObjectives] = useState<CampaignObjectiveItem[]>([]);

  // Campaign name -- start
  const [campaignParts, setCampaignParts] = useState<string[]>([]);
  const addPart = (p: string) =>
    setCampaignParts((x) => (x.includes(p) ? x : [...x, p]));

  const previewName = campaignParts
    .map((p) => {
      if (p === "Objective")
        return objectives.find(
          (o) => o.value === formik.values.campaign.objective
        )?.label;

      if (p === "Budget")
        return formik.values.budget_mode;

      if (p === "Account")
        return adAccount.find(
          (a) => a.id === formik.values.selectedAdAccount
        )?.name;

      return "";
    })
    .filter(Boolean)
    .join(" | ");
  useEffect(() => {
    if (previewName) {
      formik.setFieldValue("campaign.name", previewName);
    }
  }, [previewName]);
  // Campaign name -- end



  // //constant untuk objective
  const CampaignObjective: CampaignObjectiveItem[] = [
    { value: "OUTCOME_AWARENESS", label: "Awareness" },
    { value: "OUTCOME_TRAFFIC", label: "Traffic" },
    { value: "OUTCOME_ENGAGEMENT", label: "Engagement" },
    { value: "OUTCOME_LEADS", label: "Leads" },
    { value: "OUTCOME_APP_PROMOTION", label: "App Promotion" },
    { value: "OUTCOME_SALES", label: "Sales" },
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
              value={formik.values.campaign.objective}
              onValueChange={(val) => formik.setFieldValue("campaign.objective", val)}
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
            {formik.touched.campaign && formik.errors.campaign && (
              <p className="text-xs text-red-500 mt-1">{formik.errors.campaign.objective}</p>
            )}
          </div>

          <Separator />

          {/* Budget Mode */}
          <div>
            <h2 className="font-semibold mb-2">Budget Mode</h2>
            <p className="text-sm text-gray-500 mb-2">CBO or ABO</p>

            <div className="flex items-center gap-3">
              <Switch
                checked={formik.values.budget_mode === "CBO"}
                onCheckedChange={(checked) =>
                  formik.setFieldValue("budget_mode", checked ? "CBO" : "ABO")
                }
              />
              <span className="text-sm text-gray-700">
                {formik.values.budget_mode === "CBO" ? "CBO (Campaign Budget Optimization)" : "ABO (Ad Set Budget Optimization)"}
              </span>
            </div>

            {formik.touched.budget_mode && formik.errors.budget_mode && (
              <p className="text-xs text-red-500 mt-1">{formik.errors.budget_mode}</p>
            )}
          </div>

          {/* Budget Cost shown only when CBO */}
          {formik.values.budget_mode === "CBO" && (
            <div>
              <h2 className="font-semibold mb-2">Budget Cost</h2>

              <div className="flex flex-col">
                <p className="text-sm text-gray-500 mb-2">Daily Budget</p>

                <Input
                  name="daily_budget"
                  type="number"
                  placeholder="Rp"
                  value={formik.values.campaign.daily_budget ?? ""}
                  onChange={(e) => formik.setFieldValue("campaign.daily_budget", e.target.value)}
                  className="w-[160px]"
                />
              </div>

              {formik.touched.campaign?.daily_budget && formik.errors.campaign?.daily_budget && (
                <p className="text-xs text-red-500 mt-1">{formik.errors.campaign.daily_budget}</p>
              )}
            </div>
          )}

          <Separator />

          {/* Campaign Name */}
          <div>
            <h2 className="font-semibold mb-2">Campaign Name</h2>
            <p className="text-sm text-gray-500 mb-2">Set Campaign Name</p>

            <div className="flex flex-wrap items-center gap-2 border rounded-md p-2">
              {campaignParts.map((p) => (
                <span
                  key={p}
                  className="bg-blue-100 text-blue-700 px-2 py-1 rounded-full text-xs"
                >
                  {p}
                </span>
              ))}

              <Button variant="ghost" size="sm" onClick={() => addPart("Objective")}>
                + Objective
              </Button>

              <Button variant="ghost" size="sm" onClick={() => addPart("Budget")}>
                + Budget
              </Button>

              <Button variant="ghost" size="sm" onClick={() => addPart("Account")}>
                + Account
              </Button>

              <Button
                variant="ghost"
                size="sm"
                className="text-gray-500"
                onClick={() => {
                  setCampaignParts([])
                formik.setFieldValue("campaign.name", '');
                }}
              >
                Clear
              </Button>
            </div>

            <Input
              className="mt-2 w-[300px]"
              name="campaign.name"
              value={formik.values.campaign.name}
              onChange={(e) =>
                formik.setFieldValue("campaign.name", e.target.value)
              }
              placeholder="Campaign Name"
            />
          </div>


          <Separator />
        </CardContent>
      </Card>
    </div>
  );
}
