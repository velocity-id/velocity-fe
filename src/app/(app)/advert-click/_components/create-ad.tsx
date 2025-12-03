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
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";


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
  const [open, setOpen] = useState(false);
  const [keyword, setKeyword] = useState("");
  const [loadingGen, setLoadingGen] = useState(false);
  const [promos, setPromos] = useState<string[]>([]);
  const [selectedPromo, setSelectedPromo] = useState<string>("");


  const generatePromos = async () => {
    if (!keyword.trim()) return;

    try {
      setLoadingGen(true);

      const res = await fetch(
        "https://generativelanguage.googleapis.com/v1/models/gemini-2.0-flash:generateContent?key=AIzaSyC7O79XaZbVRJKp0ARwvpDL5r6bVLiqGnQ",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            contents: [
              {
                parts: [
                  {
                    text: `Buatkan 3 kalimat promosi tentang ${keyword} dalam format nomor langsung dan tidak usah ada intro penjelasan darimu, juga tidak usah ada gaya tulisan bold atau italic dan lain lain`
                  }
                ]
              }
            ]
          }),
        }
      );

      const data = await res.json();

      // raw text dari gemini
      const rawText =
        data.candidates?.[0]?.content?.parts?.[0]?.text ?? "";

      // proses → list promos
      const cleaned = rawText
        .trim()
        .split("\n")
        .filter((line) => line.trim() !== "")
        .map((line) => line.replace(/^\d+\.\s*/, ""));

      // simpan di state, tampilkan sebagai list
      setPromos(cleaned);
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingGen(false);
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

          {/* === Ad Message === */}
          <div>
            <h2 className="font-semibold mb-2">Ad Message</h2>
            <p className="text-sm text-gray-500 mb-2">Enter message for your ad</p>

            <div className="flex items-start gap-3">

              {/* Input */}
              <Input
                name="ad.message"
                placeholder="Write your message..."
                value={formik.values.ad.message}
                onChange={(e) => formik.setFieldValue("ad.message", e.target.value)}
                onBlur={formik.handleBlur("ad.message")}
                className="w-[300px]"
              />

              {/* Button to open popup */}
              <Dialog open={open} onOpenChange={setOpen}>
                <DialogTrigger asChild>
                  <Button variant="outline" className=" cursor-pointer">CopyClicks</Button>
                </DialogTrigger>

                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Generate Promo Message</DialogTitle>
                  </DialogHeader>

                  {/* Input keyword */}
                  <div className="space-y-3 mt-4">
                    <Label>Keyword Produk</Label>
                    <Input
                      placeholder="misal: sepatu"
                      value={keyword}
                      onChange={(e) => setKeyword(e.target.value)}
                    />
                  </div>

                  {/* Button generate */}
                  <Button
                    className="mt-4"
                    disabled={loadingGen}
                    onClick={generatePromos}
                  >
                    {loadingGen ? "Generating..." : "Generate"}
                  </Button>

                  {/* List hasil promo */}
                  {promos.length > 0 && (
                    <div className="mt-5 space-y-3">
                      <Label>Pilih Salah Satu</Label>

                      {promos.map((text, idx) => (
                        <div
                          key={idx}
                          className={`p-3 border rounded cursor-pointer ${selectedPromo === text ? "bg-gray-100" : ""
                            }`}
                          onClick={() => setSelectedPromo(text)}
                        >
                          {text}
                        </div>
                      ))}

                      {/* Confirm Button */}
                      <DialogFooter>
                        <Button
                          disabled={!selectedPromo}
                          onClick={() => {
                            formik.setFieldValue("ad.message", selectedPromo);
                            setOpen(false);
                          }}
                        >
                          Use this
                        </Button>
                      </DialogFooter>
                    </div>
                  )}
                </DialogContent>
              </Dialog>

            </div>

            {formik.touched.ad?.message && formik.errors.ad?.message && (
              <p className="text-xs text-red-500 mt-1">
                {formik.errors.ad.message}
              </p>
            )}
          </div>


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
