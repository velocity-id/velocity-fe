"use client";

import { useEffect, useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";

import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Loader2, Plus } from "lucide-react";
import { Switch } from "@/components/ui/switch"
import { getAdAccounts } from "@/features/campaign/api";
import { CampaignAdAccount} from "@/features/campaign/type";
import { CampaignObjectiveItem } from "@/features/campaign/type";
import { CampaignBudgetItem } from "@/features/campaign/type";
import { BidStrategyItem } from "@/features/campaign/type";
import { ScheduleIncreaseItem } from "@/features/campaign/type";



// Skema Validasi Yup
const campaignSchema = Yup.object({
  adAccount: Yup.string().required("Ad Account is required"),
  objective: Yup.string().required("Objective is required"),
  campaignName: Yup.string().required("Campaign Name is required"),

  enableCampaignBudget: Yup.boolean(),
  enableSchedule: Yup.boolean(),
  budgetType: Yup.string().nullable(),
  budgetCost: Yup.number()
  .typeError("Budget must be a number")
  .positive("Budget must be greater than 0")
  .nullable()
  .when("enableCampaignBudget", {
    is: true,
    then: (schema) => schema.required("Budget cost is required"),
    otherwise: (schema) => schema.nullable(),
  }),
  bidStrategy: Yup.string().nullable(),
  scheduleFrom: Yup.string().nullable(),
  scheduleTo: Yup.string().nullable(),
  schedulePeriods: Yup.array().of(
    Yup.object({
      startDate: Yup.string().nullable(),
      endDate: Yup.string().nullable(),
      increaseType: Yup.string().required("Increase type is required"),
      increaseAmount: Yup.number()
        .typeError("Increase amount must be a number")
        .required("Increase amount is required"),
    })
  ),
});

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

  //helper: find label 
  function findLabel(list: { value: string; label: string }[], value?: string | null) {
  if (!value) return "";
  const found = list.find((i) => i.value === value);
  return found ? found.label : value;
  }

export default function CreateCampaign() {
  const [loading, setLoading] = useState(true);
  const [campaignParts, setCampaignParts] = useState<string[]>([]);
  const [adAccount, setAdAccount] = useState<CampaignAdAccount[]>([]);
  const [objectives, setObjectives] = useState<CampaignObjectiveItem[]>([]);

// Inisialisasi Formik
  const formik = useFormik({
      initialValues: {
      objective: "",
      enableCampaignBudget: false,
      enableSchedule: false,
      budgetType: null,
      budgetCost: null,
      bidStrategy: null,
      schedulePeriods: [
      {
        startDate: "",
        endDate: "",
        increaseType: "value",
        increaseAmount: 0,
      }
      ],
      adAccount: "",
      campaignName: "",
    },
    validationSchema: campaignSchema,
    onSubmit: (values) => {
      console.log("Submitted:", values);
      alert("Campaign created successfully!");
    },
  });
  
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

  const addCampaignPart = (part: string) => {
    if (!campaignParts.includes(part)) setCampaignParts([...campaignParts, part]);
  };

  const clearCampaignParts = () => setCampaignParts([]);

  // Mapping → label pill → nilai actual dari formik
  const resolveCampaignPart = (part: string) => {
    switch (part) {
      case "Objective":
        return findLabel(CampaignObjective, formik.values.objective);

      case "Budget Type":
        return formik.values.enableCampaignBudget
          ? findLabel(CampaignBudget, formik.values.budgetType)
          : "";

      case "Budget Cost":
        return formik.values.enableCampaignBudget && formik.values.budgetCost
          ? `Rp ${formik.values.budgetCost}`
          : "";

      case "Bid Strategy":
        return formik.values.enableCampaignBudget
          ? findLabel(BidStrategy, formik.values.bidStrategy)
          : "";

      case "Schedule Date Range":
        if (!formik.values.enableSchedule) return "";

        const s = formik.values.schedulePeriods?.[0];
        return s?.startDate && s?.endDate
          ? `${s.startDate} → ${s.endDate}`
          : "";

      default:
        return part;
    }
  };

  return (
    <div className="w-full">
      <form onSubmit={formik.handleSubmit}>
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
                  value={formik.values.adAccount}
                  onValueChange={(val) => formik.setFieldValue("adAccount", val)}
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

            {/* Campaign Budget */}
              <div className="mb-6">
                <div className="flex items-center justify-between mb-2">
                  <h2 className="font-semibold">Campaign Budget</h2>

                  {/* Toggle Switch */}
                  <Switch
                    checked={formik.values.enableCampaignBudget}
                    onCheckedChange={(val) =>
                      formik.setFieldValue("enableCampaignBudget", val)
                    }
                  />
                </div>

                <p className="text-sm text-gray-500 mb-2">
                  Distribute your budget across ad sets to get more results.
                </p>

                {/* === ONLY SHOW WHEN SWITCH IS ON === */}
                {formik.values.enableCampaignBudget && (
                  <>
                    {/* Budget Type + Cost */}
                    <div className="flex items-center gap-4 mb-4">
                      
                      {/* Budget Type */}
                      <div className="flex flex-col">
                        <p className="text-sm text-gray-500 mb-2">Budget</p>
                        <Select
                          value={formik.values.budgetType ?? ""}
                          onValueChange={(val) => formik.setFieldValue("budgetType", val)}
                        >
                          <SelectTrigger className="w-[180px]">
                            <SelectValue placeholder="Select Budget Type" />
                          </SelectTrigger>
                          <SelectContent>
                            {CampaignBudget.map((item) => (
                              <SelectItem key={item.value} value={item.value}>
                                {item.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>

                      {/* Budget Cost */}
                      <div className="flex flex-col">
                        <p className="text-sm text-gray-500 mb-2">Budget Cost</p>
                        <Input
                          name="budgetCost"
                          type="number"
                          placeholder="Rp"
                          value={formik.values.budgetCost ?? ""}
                          onChange={(e) => formik.setFieldValue("budgetCost", e.target.value)}
                          className="w-[160px]"
                        />
                      </div>
                    </div>

                    <Separator />

                    {/* Bid Strategy */}
                    <div className="mt-4">
                      <h2 className="font-semibold mb-2">Campaign Bid Strategy</h2>
                      <Select
                        value={formik.values.bidStrategy ?? ""}
                        onValueChange={(val) => formik.setFieldValue("bidStrategy", val)}
                      >
                        <SelectTrigger className="">
                          <SelectValue placeholder="Select bid strategy" />
                        </SelectTrigger>
                        <SelectContent>
                          {BidStrategy.map((item) => (
                            <SelectItem key={item.value} value={item.value}>
                              {item.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    {/* Campaign Schedule Toggle */}
                    <Separator className="my-4" />

                    <div>
                      <h2 className="font-semibold mb-2">Budget Scheduling</h2>

                      {/* Check to show scheduling */}
                      <div className="flex items-center gap-2 mb-4">
                        <Switch
                          checked={formik.values.enableSchedule}
                          onCheckedChange={(val) => formik.setFieldValue("enableSchedule", val)}
                        />
                        <p className="text-sm">Schedule budget increases</p>
                      </div>

                      {/* === ONLY SHOW WHEN SCHEDULE IS ENABLED === */}
                      {formik.values.enableSchedule && formik.values.schedulePeriods.map((p, index) => (
                        <div key={index} className="mt-4 p-4 border rounded-lg bg-gray-50">

                          <h3 className="text-sm font-medium mb-3">Time period for budget increase</h3>

                          {/* Start / End Date */}
                          <div className="flex gap-4 mb-4">
                            <div className="flex flex-col">
                              <label className="text-xs mb-1">Starts on</label>
                              <Input
                                type="datetime-local"
                                value={p.startDate}
                                onChange={(e) =>
                                  formik.setFieldValue(`schedulePeriods.${index}.startDate`, e.target.value)
                                }
                                className="w-[240px]"
                              />
                            </div>

                            <div className="flex flex-col">
                              <label className="text-xs mb-1">Ends on</label>
                              <Input
                                type="datetime-local"
                                value={p.endDate}
                                onChange={(e) =>
                                  formik.setFieldValue(`schedulePeriods.${index}.endDate`, e.target.value)
                                }
                                className="w-[240px]"
                              />
                            </div>
                          </div>

                          {/* Increase Type + Amount */}
                          <div className="flex items-center justify-between gap-4 w-full">
                            {/* Increase Type */}
                            <div className="flex-1">
                              <Select
                                value={p.increaseType}
                                onValueChange={(val) =>
                                  formik.setFieldValue(`schedulePeriods.${index}.increaseType`, val)
                                }
                              >
                                <SelectTrigger className="w-full">
                                  <SelectValue placeholder="Increase daily budget" />
                                </SelectTrigger>

                                <SelectContent>
                                  {ScheduleIncreaseType.map((item) => (
                                    <SelectItem key={item.value} value={item.value}>
                                      {item.label}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                            </div>

                            {/* Increase Amount */}
                            <div className="flex items-center gap-2 w-[200px]">
                              <Input
                                type="number"
                                placeholder="Amount"
                                value={p.increaseAmount}
                                onChange={(e) =>
                                  formik.setFieldValue(
                                    `schedulePeriods.${index}.increaseAmount`,
                                    e.target.value
                                  )
                                }
                              />
                              <span className="text-sm w-10">
                                {p.increaseType === "value" ? "IDR" : "%"}
                              </span>
                            </div>
                          </div>

                        </div>
                      ))}
                    </div>
                  </>
                )}
              </div>

              <Separator />


            {/* Campaign Name */}
            <div>
              <h2 className="font-semibold mb-2">Campaign Name</h2>
              <p className="text-sm text-gray-500 mb-2">Set Campaign Name</p>

              <div className="flex flex-wrap items-center gap-2 border rounded-md p-2">

                {/* Render pills sesuai pilihan user */}
                {campaignParts.map((part, i) => (
                  <span
                    key={i}
                    className="bg-blue-100 text-blue-700 px-2 py-1 rounded-full text-xs flex items-center gap-1"
                  >
                    {part}
                  </span>
                ))}

                {/*dropdown menu */}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon">
                      <Plus className="w-4 h-4" />
                    </Button>
                  </DropdownMenuTrigger>

                  <DropdownMenuContent>
                    <DropdownMenuItem onClick={() => addCampaignPart("Objective")}>
                      Objective
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => addCampaignPart("Budget Type")}>
                      Budget Type
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => addCampaignPart("Budget Cost")}>
                      Budget Cost
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => addCampaignPart("Bid Strategy")}>
                      Bid Strategy
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => addCampaignPart("Schedule Date Range")}>
                      Schedule Date Range
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>

                {/* clear all */}
                <Button
                  variant="ghost"
                  className="text-xs text-gray-500"
                  onClick={clearCampaignParts}
                >
                  Clear All
                </Button>
              </div>

              {/* preview section */}
              <div className="mt-4">
                <p className="font-medium text-gray-700">Preview:</p>

                <p className="text-sm text-gray-500 font-semibold mt-2">
                  {campaignParts.length > 0
                  ? campaignParts.map(resolveCampaignPart).filter(Boolean).join(" | ")
                  : "Set campaign name..."}

                </p>
              </div>
            </div>
            <Separator />
          </CardContent>
        </Card>
      </form>
    </div>
  );
}
