"use client";

import { FormikValues } from "formik";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { useState } from "react";

type CreateAdProps = {
  formik: FormikValues;
};

export default function CreateAd({ formik }: CreateAdProps) {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedImage(URL.createObjectURL(file));
    }
  };

  return (
    <div className="w-full">
      <Card className="shadow-lg border w-full">
        <CardContent className="space-y-6 p-6">

{/* === Ad Media Upload === */}
<Card className="shadow-md border w-full">
  <CardHeader>
    <CardTitle className="text-lg">Ad Media</CardTitle>
  </CardHeader>

  <CardContent className="space-y-4">

    {/* Upload Label */}
    <label className="font-medium">Choose Image</label>

    {/* Hidden Input */}
    <input
      id="upload"
      type="file"
      accept="image/*"
      onChange={(e) => {
        const file = e.target.files?.[0];
        if (file) {
          setSelectedImage(URL.createObjectURL(file));
          formik.setFieldValue("ad.image_file", file);
        }
      }}
      className="hidden"
    />

    {/* Upload Button */}
    <label
      htmlFor="upload"
      className="cursor-pointer px-4 py-2 border rounded bg-gray-100 hover:bg-gray-200 inline-flex items-center gap-2 text-sm"
    >
      Select File
    </label>

    {/* Preview */}
    {selectedImage && (
      <div className="mt-4 w-full flex justify-center">
        <img
          src={selectedImage}
          alt="Selected"
          className="max-w-xs rounded shadow"
        />
      </div>
    )}

  </CardContent>
</Card>

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
