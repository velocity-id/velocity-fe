"use client";

import { FormikValues } from "formik";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";

type CreateAdProps = {
  formik: FormikValues;
};

export default function CreateAd({ formik }: CreateAdProps) {
  return (
    <div className="w-full">
      <Card className="shadow-lg border w-full">
        <CardContent className="space-y-6 p-6">

          {/* === Ad Name === */}
          <div>
            <h2 className="font-semibold mb-2">Ad Name</h2>
            <p className="text-sm text-gray-500 mb-2">Enter Ad Name</p>

            <Input
              name="ad.name"
              placeholder="Enter Ad Name"
              value={formik.values.ad.name}
              onChange={(e) => formik.setFieldValue("ad.name", e.target.value)}
              onBlur={formik.handleBlur("ad.name")}
              className="w-[300px]"
            />

            {formik.touched.ad?.name && formik.errors.ad?.name && (
              <p className="text-xs text-red-500 mt-1">
                {formik.errors.ad.name}
              </p>
            )}
          </div>

          <Separator />

          {/* === Creative ID === */}
          <div>
            <h2 className="font-semibold mb-2">Creative ID</h2>
            <p className="text-sm text-gray-500 mb-2">Paste Creative ID</p>

            <Input
              name="ad.creative_id"
              placeholder="Enter Creative ID"
              value={formik.values.ad.creative_id}
              onChange={(e) => formik.setFieldValue("ad.creative_id", e.target.value)}
              onBlur={formik.handleBlur("ad.creative_id")}
              className="w-[300px]"
            />

            {formik.touched.ad?.creative_id && formik.errors.ad?.creative_id && (
              <p className="text-xs text-red-500 mt-1">
                {formik.errors.ad.creative_id}
              </p>
            )}
          </div>

          <Separator />

          {/* === Status === */}
          <div>
            <h2 className="font-semibold mb-2">Ad Status</h2>
            <p className="text-sm text-gray-500 mb-2">Select Ad Status</p>

            <Select
              value={formik.values.ad.status}
              onValueChange={(val) => formik.setFieldValue("ad.status", val)}
            >
              <SelectTrigger className="w-[200px]">
                <SelectValue placeholder="Select Status" />
              </SelectTrigger>

              <SelectContent>
                <SelectItem value="ACTIVE">Active</SelectItem>
                <SelectItem value="PAUSED">Paused</SelectItem>
              </SelectContent>
            </Select>

            {formik.touched.ad?.status && formik.errors.ad?.status && (
              <p className="text-xs text-red-500 mt-1">
                {formik.errors.ad.status}
              </p>
            )}
          </div>

          <Separator />
        </CardContent>
      </Card>
    </div>
  );
}
