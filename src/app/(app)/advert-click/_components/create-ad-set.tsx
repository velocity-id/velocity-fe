"use client";

import { FormikValues } from "formik";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useEffect, useState } from "react";
import { getSavedAudiences } from "@/features/ad-set/api";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";

type CreateAdSetProps = {
  formik: FormikValues;
};

export default function CreateAdSet({ formik }: CreateAdSetProps) {
  const [savedAudiences, setSavedAudiences] = useState([]);

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

          {/* === Ad Set Name === */}
          <div>
            <h2 className="font-semibold mb-2">Ad Set Name</h2>
            <p className="text-sm text-gray-500 mb-2">Set Ad Set Name</p>

            <Input
              name="adset.name"
              placeholder="Enter Ad Set Name"
              value={formik.values.adset.name}
              onChange={(e) => formik.setFieldValue("adset.name", e.target.value)}
              onBlur={formik.handleBlur("adset.name")}
              className="w-[300px]"
            />

            {formik.touched.adset?.name && formik.errors.adset?.name && (
              <p className="text-xs text-red-500 mt-1">{formik.errors.adset.name}</p>
            )}
          </div>

          <Separator />
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
        </CardContent>
      </Card>
    </div>
  );
}
