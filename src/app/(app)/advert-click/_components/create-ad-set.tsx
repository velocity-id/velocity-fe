"use client";

import { FormikValues } from "formik";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useEffect, useState } from "react";
import { getListAdInterest } from "@/features/ad-set/api";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { AdInterest } from "@/features/ad-set/type";

type CreateAdSetProps = {
  formik: FormikValues;
};

export default function CreateAdSet({ formik }: CreateAdSetProps) {
  const [listAdInterest, setListAdInterest] = useState<AdInterest[]>([]);
  const [interestQuery, setInterestQuery] = useState("");
  const [loadingInterest, setLoadingInterest] = useState(false);
  const [limit, setLimit] = useState(20);



  // ad set name -- start
  const [adsetParts, setAdsetParts] = useState<string[]>([]);
  const addPart = (p: string) =>
    setAdsetParts((x) => (x.includes(p) ? x : [...x, p]));

  const previewName = adsetParts
    .map((p) => {
      if (p === "Location")
        return formik.values.adset.geo_locations.countries[0];

      if (p === "Audience")
        return formik.values.adset.detailed_targeting
          .map((x: { id: string; name: string }) => x.name)
          .join(",");


      return "";
    })
    .filter(Boolean)
    .join(" | ");

  useEffect(() => {
    if (previewName) {
      formik.setFieldValue("adset.name", previewName);
    }
  }, [previewName]);
  // ad set name -- end


  const searchInterest = async () => {
    if (!interestQuery) return;

    try {
      setLoadingInterest(true);
      const data = await getListAdInterest(interestQuery, limit);
      setListAdInterest(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingInterest(false);
    }
  };


  return (
    <div className="w-full">
      <Card className="shadow-lg border w-full">
        <CardContent className="space-y-6 p-6">
          {/* === Detailed Targeting === */}
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" className="w-[300px] justify-between">
                {formik.values.adset.detailed_targeting.length > 0
                  ? `${formik.values.adset.detailed_targeting.length} selected`
                  : "Choose Detailed Targeting"}
              </Button>
            </PopoverTrigger>

            <PopoverContent className="w-[400px] p-3 space-y-2">
              {/* Search input */}
              <div className="flex gap-2">
                <Input
                  placeholder="Search interest (ex: sepatu, coffee)"
                  value={interestQuery}
                  onChange={(e) => setInterestQuery(e.target.value)}
                />
                <Input
                  type="number"
                  min={1}
                  max={100}
                  className="w-[80px]"
                  value={limit}
                  onChange={(e) => setLimit(Number(e.target.value))}
                />

                <Button size="sm" onClick={searchInterest} disabled={loadingInterest}>
                  {loadingInterest ? "..." : "Search"}
                </Button>
              </div>

              {/* Result list */}
              <div className="max-h-[220px] overflow-y-auto flex flex-col gap-2">
                {listAdInterest.map((sa) => {
                  const checked = formik.values.adset.detailed_targeting.some(
                    (x: { id: string, name: string }) => x.id == sa.id
                  );

                  return (
                    <label
                      key={sa.id}
                      className="flex items-center gap-2 cursor-pointer text-sm"
                    >
                      <input
                        type="checkbox"
                        checked={checked}
                        onChange={() => {
                          let current = [...formik.values.adset.detailed_targeting];

                          if (checked) {
                            current = current.filter((x) => x.id !== sa.id);
                          } else {
                            current.push({
                              id: sa.id,
                              name: sa.name,
                            });
                          }

                          formik.setFieldValue("adset.detailed_targeting", current);
                        }}

                      />
                      <span>{sa.name}</span>
                    </label>
                  );
                })}

                {!loadingInterest && listAdInterest.length === 0 && (
                  <p className="text-xs text-gray-500 text-center">
                    No result
                  </p>
                )}
              </div>
            </PopoverContent>
          </Popover>



          <Separator />

          {/* === Daily Budget === */}
          {formik.values.budget_mode === "ABO" ? (
            <div>
              <h2 className="font-semibold mb-2">Daily Budget</h2>
              <p className="text-sm text-gray-500 mb-2">Enter Daily Budget</p>

              <Input
                type="number"
                min={100000}
                name="adset.daily_budget"
                placeholder="Daily Budget"
                value={formik.values.adset.daily_budget}
                onChange={(e) => formik.setFieldValue("adset.daily_budget", Number(e.target.value))}
                onBlur={formik.handleBlur("adset.daily_budget")}
                className="w-[200px]"
              />

              {formik.touched.adset?.daily_budget && formik.errors.adset?.daily_budget && (
                <p className="text-xs text-red-500 mt-1">{formik.errors.adset.daily_budget}</p>
              )}
            </div>

          ) : null}

          <Separator />

          {/* === Geo Location - Countries === */}
          <div>
            <h2 className="font-semibold mb-2">Country Targeting</h2>
            <p className="text-sm text-gray-500 mb-2">Select Country</p>

            <Select
              value={formik.values.adset.geo_locations.countries[0]}
              onValueChange={(val) =>
                formik.setFieldValue("adset.geo_locations.countries", [val])
              }
            >
              <SelectTrigger className="w-[200px]">
                <SelectValue placeholder="Select Country" />
              </SelectTrigger>

              <SelectContent>
                <SelectItem value="US">United States</SelectItem>
                <SelectItem value="ID">Indonesia</SelectItem>
                <SelectItem value="SG">Singapore</SelectItem>
                <SelectItem value="MY">Malaysia</SelectItem>
                <SelectItem value="PH">Philippines</SelectItem>
                <SelectItem value="IN">India</SelectItem>
              </SelectContent>
            </Select>

            {formik.touched.adset?.geo_locations?.countries &&
              formik.errors.adset?.geo_locations?.countries && (
                <p className="text-xs text-red-500 mt-1">
                  {formik.errors.adset.geo_locations.countries}
                </p>
              )}
          </div>

          <Separator />

          {/* Ad Set Name */}
          <div>
            <h2 className="font-semibold mb-2">Ad Set Name</h2>
            <p className="text-sm text-gray-500 mb-2">Set Ad Set Name</p>

            <div className="flex flex-wrap items-center gap-2 border rounded-md p-2">
              {adsetParts.map((p) => (
                <span
                  key={p}
                  className="bg-blue-100 text-blue-700 px-2 py-1 rounded-full text-xs"
                >
                  {p}
                </span>
              ))}

              <Button variant="ghost" size="sm" onClick={() => addPart("Location")}>
                + Location
              </Button>
              <Button variant="ghost" size="sm" onClick={() => addPart("Audience")}>
                + Audience
              </Button>

              <Button
                variant="ghost"
                size="sm"
                className="text-gray-500"
                onClick={() => {
                  setAdsetParts([])
                  formik.setFieldValue("adset.name", previewName);

                }}
              >
                Clear
              </Button>
            </div> 

            <Input
              className="
                  mt-2 w-[300px]
                  read-only:opacity-100
                  read-only:bg-background
                  read-only:text-foreground
                  read-only:cursor-default
                "
              name="adset.name"
              readOnly
              value={formik.values.adset.name}
              placeholder="Ad Set Name"
            />

          </div>

        </CardContent>
      </Card>
    </div>
  );
}
