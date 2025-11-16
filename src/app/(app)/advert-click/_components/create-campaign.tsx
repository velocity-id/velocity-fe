"use client";

import { useEffect, useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { Separator } from "@/components/ui/separator";
import { Loader2, Plus } from "lucide-react";
import { getAdAccounts } from "@/features/campaign/api";
import { CampaignAdAccount } from "@/features/campaign/type";
import { getCampaignObjectives } from "@/features/campaign/api";
import { getCampaignBudgets} from "@/features/campaign/api";
import { CampaignBudget} from "@/features/campaign/type";
import { getCampaignBidStrategies} from "@/features/campaign/api";
import { CampaignBidStrategy } from "@/features/campaign/type";

// Skema Validasi Yup
const campaignSchema = Yup.object({
  // campaignType: Yup.string().required("Campaign type is required"),
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
  const [objectives, setObjectives] = useState<string[]>([]);
  const [budgets, setBudgets] = useState<CampaignBudget[]>([]);
  const [bidStrategies, setBidStrategies] = useState<CampaignBidStrategy[]>([]);

  //static options for budget type
  const budgetTypeOptions = [
    { value: "daily", label: "Daily Budget" },
    { value: "lifetime", label: "Lifetime Budget" },
  ];

  // Unique bid strategy list (karena bisa duplikat antar campaign)
  const uniqueBidStrategies = Array.from(
    new Set(bidStrategies.map((b) => b.bid_strategy))
  ).filter(Boolean);

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
    const fetchObjectives = async () => {
      try {
        const res = await getCampaignObjectives();
        console.log("Hasil dari getCampaignObjectives:", res);
        setObjectives(res);
      } catch (err) {
        console.error("Gagal mengambil data objective:", err);
      }
    };
    fetchObjectives();
  }, []);

  //fetch budget
  useEffect(() => {
  const fetchBudgets = async () => {
    try {
      const res = await getCampaignBudgets();
      console.log("Hasil budget dari API:", res);
      setBudgets(res);
    } catch (err) {
      console.error("Gagal ambil budget:", err);
    }
  };
  fetchBudgets();
  }, []);

  //fetch bid strategy
  useEffect(() => {
    const fetchBidStrategies = async () => {
      try {
        const res = await getCampaignBidStrategies(); 
        console.log("Hasil Bid Strategy dari API:", res);
        setBidStrategies(res);
      } catch (err) {
        console.error("Gagal ambil bid strategy:", err);
      }
    };
    fetchBidStrategies();
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

            {/* Campaign Type */}
            {/*<div>
              <h2 className="font-semibold mb-2">Campaign Type</h2>
              <p className="text-sm text-gray-500 mb-2">Choose Campaign Type</p>
              <Select
                value={formik.values.campaignType}
                onValueChange={(val) => formik.setFieldValue("campaignType", val)}
              >
                <SelectTrigger className="w-[200px]">
                  <SelectValue placeholder="Select Campaign Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="NONE">NONE</SelectItem>
                  <SelectItem value="ICO_ONLY">ICO_ONLY</SelectItem>
                </SelectContent>
              </Select>
              {formik.touched.campaignType && formik.errors.campaignType && (
                <p className="text-xs text-red-500 mt-1">{formik.errors.campaignType}</p>
              )}
            </div>

            <Separator /> */}

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
                      <SelectItem key={item} value={item}>
                        {item.replace("OUTCOME_", "").replace("_", " ")}
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
                    {budgetTypeOptions.map((item) => (
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
              <RadioGroup
                value={formik.values.bidStrategy}
                onValueChange={(val) => formik.setFieldValue("bidStrategy", val)}
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="lowest" id="lowest" />
                  <label htmlFor="lowest" className="text-sm">Lowest Cost</label>
                </div>
              </RadioGroup>
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
              {formik.touched.schedule && formik.errors.schedule && (
                <p className="text-xs text-red-500 mt-1">{formik.errors.schedule}</p>
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

            {/* Submit */}
            <div className="flex justify-end">
              <Button type="submit" className="">
                Submit Campaign
              </Button>
            </div>
          </CardContent>
        </Card>
      </form>
    </div>
  );
}
