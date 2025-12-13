"use client";

import { FormikValues } from "formik";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useEffect, useState } from "react";
import { getSavedAudiences, SavedAudience } from "@/features/ad-set/api";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";

type CreateAdSetProps = {
  formik: FormikValues;
};

export default function CreateAdSet({ formik }: CreateAdSetProps) {
  const [savedAudiences, setSavedAudiences] = useState<SavedAudience[]>([]);

  // ad set name -- start
  const [adsetParts, setAdsetParts] = useState<string[]>([]);
  const addPart = (p: string) =>
    setAdsetParts((x) => (x.includes(p) ? x : [...x, p]));

  const previewName = adsetParts
    .map((p) => {
      if (p === "Location")
        return formik.values.adset.geo_locations.countries[0];

      if (p === "Audience")
        return formik.values.adset.saved_audience_ids
          .map((id: string) => savedAudiences.find((s) => s.id === id)?.name)
          .filter(Boolean)
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




  useEffect(() => {
    async function load() {
      try {
        const data = await getSavedAudiences(formik.values.selectedAdAccount);
        setSavedAudiences(data);
      } catch (err) {
        console.error(err);
      }
    }

    if (formik.values.selectedAdAccount) {
      load();
    }
  }, [formik.values.selectedAdAccount]);


  return (
    <div className="w-full">
      <Card className="shadow-lg border w-full">
        <CardContent className="space-y-6 p-6">
          <div>
            <h2 className="font-semibold mb-2">Saved Audience</h2>
            <p className="text-sm text-gray-500 mb-2">
              Select Saved Audience (multiple allowed)
            </p>

            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" className="w-[300px] justify-between">
                  {formik.values.adset.saved_audience_ids.length > 0
                    ? `${formik.values.adset.saved_audience_ids.length} selected`
                    : "Choose Saved Audience"}
                </Button>
              </PopoverTrigger>

              <PopoverContent className="w-[300px] p-2">
                <div className="flex flex-col gap-2">
                  {savedAudiences.map((sa) => {
                    const checked = formik.values.adset.saved_audience_ids.includes(sa.id);

                    return (
                      <label
                        key={sa.id}
                        className="flex items-center gap-2 cursor-pointer p-1"
                      >
                        <input
                          type="checkbox"
                          checked={checked}
                          onChange={() => {
                            let current = [...formik.values.adset.saved_audience_ids];

                            if (checked) {
                              current = current.filter((x) => x !== sa.id);
                            } else {
                              current.push(sa.id);
                            }

                            formik.setFieldValue("adset.saved_audience_ids", current);
                          }}
                        />
                        <span>{sa.name}</span>
                      </label>
                    );
                  })}
                </div>
              </PopoverContent>
            </Popover>
          </div>


          <Separator />

          {/* === Daily Budget === */}
          {formik.values.budget_mode === "ABO" ? (
            <div>
              <h2 className="font-semibold mb-2">Daily Budget</h2>
              <p className="text-sm text-gray-500 mb-2">Enter Daily Budget</p>

              <Input
                type="number"
                min={100}
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

          {/* Name Ad Set */}
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

            <p className="text-sm text-gray-500 font-semibold mt-2">
              {previewName || "Set ad set name..."}
            </p>

            <Input
              className="mt-2 w-[300px]"
              name="adset.name"
              value={formik.values.adset.name}
              onChange={(e) =>
                formik.setFieldValue("adset.name", e.target.value)
              }
              placeholder="Ad Set Name"
            />
          </div>

        </CardContent>
      </Card>
    </div>
  );
}
