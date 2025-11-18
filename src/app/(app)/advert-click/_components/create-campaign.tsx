"use client";

import { useEffect, useState } from "react";
import { useFormik } from "formik";
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



export default function CreateCampaign() {
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


  // Inisialisasi Formik
  const formik = useFormik({
    initialValues: {
      // campaignType: "",
      objective: "",
      budgetType: "",
      budgetCost: "",
      bidStrategy: "",
      schedule: "",
      schedulePeriods: [
      {
        startDate: "",
        endDate: "",
        increaseType: "value",
        increaseAmount: ""
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

  const addCampaignPart = (part: string) => {
    if (!campaignParts.includes(part)) setCampaignParts([...campaignParts, part]);
  };

  const clearCampaignParts = () => setCampaignParts([]);

  function setSelectedBudgetType(value: string): void {
    throw new Error("Function not implemented.");
  }

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
            <h2 className="font-semibold mb-2">Campaign Budget</h2>
            <div className="flex items-center gap-4">
              <div className="flex flex-col">
                <p className="text-sm text-gray-500 mb-2">Set Campaign Budget</p>
                <Select
                  value={formik.values.budgetType}
                  onValueChange={(val) => formik.setFieldValue("budgetType", val)}
                >
                  <SelectTrigger>
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
                {formik.touched.budgetType && formik.errors.budgetType && (
                  <p className="text-xs text-red-500 mt-1">{formik.errors.budgetType}</p>
                )}
              </div>

              <div className="flex flex-col justify-center">
                <p className="text-sm text-gray-500 mb-2">Budget Cost</p>
                <Input
                  name="budgetCost"
                  type="number"
                  placeholder="Enter Budget Cost"
                  value={formik.values.budgetCost}
                  onChange={(e) => formik.setFieldValue("budgetCost", e.target.value)}
                  onBlur={() => formik.setFieldTouched("budgetCost", true)}
                  className="w-[160px]"
                />
                {formik.touched.budgetCost && formik.errors.budgetCost && (
                  <p className="text-xs text-red-500 mt-1">{formik.errors.budgetCost}</p>
                )}
              </div>
            </div>

            <Separator />

            {/* Bid Strategy */}
            <div>
              <h2 className="font-semibold mb-2">Bid Strategy</h2>
              <p className="text-sm text-gray-500 mb-2">Choose Bid Strategy</p>
              <Select
                value={formik.values.bidStrategy}
                onValueChange={(val) => formik.setFieldValue("bidStrategy", val)}
              >
                <SelectTrigger>
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
              {formik.touched.bidStrategy && formik.errors.bidStrategy && (
                <p className="text-xs text-red-500 mt-1">{formik.errors.bidStrategy}</p>
              )}
            </div>

            <Separator />

            {/* Campaign Schedule */}
              <div>
                <h2 className="font-semibold mb-2">Campaign Schedule</h2>
                <p className="text-sm text-gray-500 mb-2">Choose Campaign Schedule</p>

                <RadioGroup
                  value={formik.values.schedule}
                  onValueChange={(val) => formik.setFieldValue("schedule", val)}
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="always" id="always" />
                    <label htmlFor="always" className="text-sm">Run ads all the time</label>
                  </div>

                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="schedule" id="schedule" />
                    <label htmlFor="schedule" className="text-sm">Run ads on a schedule</label>
                  </div>
                </RadioGroup>
              </div>

                {formik.values.schedule === "schedule" && (
                <div className="mt-4 p-4 border rounded-lg bg-gray-50">

                  <h3 className="text-sm font-medium mb-3">Time period for budget increase</h3>

                  {formik.values.schedulePeriods.map((p, index) => (
                    <div key={index} className="mb-6 p-3 bg-white border rounded-lg">

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
              )}

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
      </form>
    </div>
  );
}
