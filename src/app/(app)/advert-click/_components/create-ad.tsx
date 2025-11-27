"use client";

type CopyClickItem = {
  id: string;
  name: string;
  audience_size_lower_bound: number;
  audience_size_upper_bound: number;
};

import React from 'react'
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Image, Play } from "lucide-react";
import FacebookPreview from "./facebookPreview"


export default function AdPage() {
const [selectedFormat, setSelectedFormat] = useState<"image" | "video" | null>("image");
const [selectedFile, setSelectedFile] = useState<string | null>(null);
const [showPopup, setShowPopup] = useState(false);
const [selectedFileName, setSelectedFileName] = useState<string>("");
const [uploadProgress, setUploadProgress] = useState<number>(0);
const [searchQuery, setSearchQuery] = useState("");
const [searchResults, setSearchResults] = useState<CopyClickItem[]>([]);
const [loadingSearch, setLoadingSearch] = useState(false);
const [primaryText, setPrimaryText] = useState("");
const [headline, setHeadline] = useState("")
const [description, setDescription] = useState("")
const [url, setUrl] = useState("")
const [mediaUrl, setMediaUrl] = useState("")
const [mediaType, setMediaType] = useState("")




const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
  const file = e.target.files?.[0];
  if (file) {
    setSelectedFileName(file.name);
    setSelectedFile(URL.createObjectURL(file));
    setMediaUrl(URL.createObjectURL(file))
    setMediaType(selectedFormat || "")
  }
};

const fetchCopyClicks = async () => {
  if (!searchQuery) return;

  try {
    setLoadingSearch(true);

    const interestList = JSON.stringify([searchQuery]);

    const response = await fetch(
      `https://graph.facebook.com/v24.0/search?interest_list=${encodeURIComponent(interestList)}&type=adinterestsuggestion&access_token=EAAPZB0wXT18ABQKers7HcBZBrhSW8ZBXGlPigRQZA5ZBGum3U6CbgezMotpgpj2ZAm3BHtPeqZBZCoq1XR7WzViN5miZBk5bqZAsVYrOO8B2IMuokzYpbkiZBAEHzK5Et9X3BIZCMcHNy3Y5KPk1rZBZB2LIpkZBwYS4yXYfZBlVggFAZA52SC2dUW1mBd1DUZBCZCwaa9INfJWIwHK26ZAEysRFeZBEPVTppWaC9m3LzZCRSPJi6Eh83taV4n2RR4WeSQQ3J7oBY974Qe1PMALan2XKT8lRBbGQXAiZCB51EGiovTs`
    );

    const data = await response.json();
    setSearchResults(data.data || []);
  } catch (err) {
    console.error(err);
  } finally {
    setLoadingSearch(false);
  }
};


const handleSelectCopyClick = (item: CopyClickItem) => {
  setPrimaryText(item.name);
  setShowPopup(false);
};




return (
  <div className="grid grid-cols-1 lg:grid-cols-2 gap-2 p-2 bg-gray-50">

    {/* Kolom Kiri */}
    <div className="flex-1  space-y-4">
      
      <Card>
        <CardHeader>
          <CardTitle>Idenity</CardTitle>
        </CardHeader>
        <CardContent className="px-5 space-y-4">
          <div className='space-y-2'>
            <Label>Pilih Facebook Page</Label>
            <Select>
              <SelectTrigger>
                <SelectValue placeholder="Velocity Well" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="velocity">Velocity Well</SelectItem>
              </SelectContent>
              <SelectContent>
                <SelectItem value="Toko cerita">Toko ceria</SelectItem>
              </SelectContent>
              <SelectContent>
                <SelectItem value="Rumah Impian">Rumah Impian</SelectItem>
              </SelectContent>
              <SelectContent>
                <SelectItem value="lbshop">lbshop</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className='space-y-2'>
            <Label>Pilih Instagram Page</Label>
            <Select>
              <SelectTrigger>
                <SelectValue placeholder="VelocityWell.upiedun" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ig">VelocityWell.upiedun</SelectItem>
                <SelectItem value="ig">VelocityWell@upiedun</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Ad Format */}
        <Card>
          <CardHeader>
            <CardTitle>Ad Format</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex gap-4">
              <button
                onClick={() => {
                  setSelectedFormat("image");
                  setSelectedFile(null);
                }}
                className={`flex flex-col items-center justify-center w-1/2 p-4 border rounded-lg transition cursor-pointer
                ${selectedFormat === "image" ? "border-blue-400 bg-slate-100" : "border-gray-300 hover:border-blue-300"}`}
              >
                <Image size={36} className="mb-2" />
                <span>Single Image</span>
              </button>

              <button
                onClick={() => {
                  setSelectedFormat("video");
                  setSelectedFile(null);
                }}
                className={`flex flex-col items-center justify-center w-1/2 p-4 border rounded-lg transition cursor-pointer
                ${selectedFormat === "video" ? "border-blue-400 bg-slate-100" : "border-gray-300 hover:border-blue-300"}`}
              >
                <Play size={36} className="mb-2" />
                <span>Single Video</span>
              </button>
            </div>
          </CardContent>
        </Card>

        {/* Ad Media */}
        <Card>
          <CardHeader>
            <CardTitle>Ad Media</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Label className="font-semibold">
              {selectedFormat === "image" ? "Upload Image" : "Upload Video"}
            </Label>

            {/* Custom Upload Button */}
            <div className="flex items-center gap-3">
              <label
                htmlFor="file-upload"
                className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg shadow cursor-pointer transition transform hover:scale-105 active:scale-95"
              >
                Choose File
              </label>
              <span className="text-sm text-gray-600">
                {selectedFileName ? selectedFileName : "No file chosen"}
              </span>
            </div>

            {/* Hidden input */}
            <input
              id="file-upload"
              type="file"
              accept={selectedFormat === "image" ? "image/*" : "video/*"}
              onChange={handleFileUpload}
              className="hidden"
            />

        {/* Popup untuk CopyClicks */}
        {showPopup && (
          <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
            <div className="bg-white rounded-xl shadow-lg w-[480px] p-5 relative animate-in fade-in duration-200">
              {/* Header */}
              <div className="flex justify-between items-center border-b pb-2 mb-4">
                <h2 className="text-lg font-semibold text-gray-800">CopyClicks</h2>
                <Button
                  size="icon"
                  variant="ghost"
                  className="text-gray-500 hover:text-gray-800"
                  onClick={() => setShowPopup(false)}
                >
                  ✕
                </Button>
              </div>

              {/* Form Input */}
              <div className="space-y-4">
                <Label className="text-sm font-medium">Primary Text</Label>

                <div className="flex items-center gap-2">
                  <Select>
                    <SelectTrigger className="w-[130px]">
                      <SelectValue placeholder="Problem" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="problem">Problem</SelectItem>
                      <SelectItem value="solution">Solution</SelectItem>
                    </SelectContent>
                  </Select>

                  <Input
                    placeholder="Type problem your product solves here"
                    className="flex-1"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />


                  <Button
                    className="bg-blue-500 text-white hover:bg-blue-600"
                    onClick={fetchCopyClicks}
                  >
                    Generate
                  </Button>
                </div>

                {/* Hasil pencarian */}
                <div className="mt-3 space-y-2 max-h-64 overflow-y-auto">

                  {loadingSearch && (
                    <p className="text-sm text-gray-500">Loading...</p>
                  )}

                  {!loadingSearch && searchResults.length === 0 && searchQuery !== "" && (

                    <p className="text-sm text-gray-400">No result found</p>
                  )}

                  {searchResults.map((item) => (
                    <div
                      key={item.id}
                      className="p-2 border rounded cursor-pointer hover:bg-gray-100"
                      onClick={() => handleSelectCopyClick(item)}
                    >
                      <p className="font-medium">{item.name}</p>
                      <p className="text-xs text-gray-500">
                        Audience size {item.audience_size_lower_bound}
                        {" - "}
                        {item.audience_size_upper_bound}
                      </p>
                    </div>
                  ))}
                </div>



                {/* Tombol Insert */}
                <div className="pt-2 text-right">
                  <Button className="bg-gray-800 text-white hover:bg-gray-900 px-6">
                    Insert
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}

          </CardContent>
        </Card>

      {/* Ad Copy */}
      <Card>
        <CardHeader>
          <CardTitle>Ad Copy</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className='flex justify-between items-center space-y-2'>
            <Label>Primary Text</Label>
            <Button
              onClick={() => setShowPopup(true)}
              className='bg-blue-500 text-white hover:bg-blue-600'> Copy Clicks
              </Button>
          </div>
          <div>
            <textarea
              value={primaryText}
              onChange={(e) => setPrimaryText(e.target.value)}
              className="w-full p-2 border rounded"
            />

          </div>
          <div className='space-y-2'>
            <Label>Headline</Label>
            <input
              value={headline}
              onChange={(e) => setHeadline(e.target.value)}
              placeholder="Insert your headline text"
              className="w-full p-2 border rounded"
            />

          </div>
        </CardContent>
      </Card>

      {/* Web URL */}
      <Card>
        <CardHeader>
          <CardTitle>Web URL</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <input
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="Insert your website URL"
            className="w-full p-2 border rounded"
          />

            <label className="block mb-2 font-medium">
              Call to Action
              <p className='font-normal'>
                Choose to Call Action</p>
            </label>          
            <Select>
              <SelectTrigger>
                <SelectValue placeholder="Shop Now" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="shop">Shop Now</SelectItem>
                <SelectItem value="shop">Apawe sok</SelectItem>
              </SelectContent>
            </Select>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Pixel Tracking</CardTitle>
        </CardHeader>

        <CardContent className="leading-5 text-sm">
          <p>Report Conversions see activity and build audiences for ad targeting</p>
        </CardContent>

        {/* Bagian form */}
        <div className="px-6 space-y-2">
          <div className="space-y-1">
            <label className="block text-sm">Pixel Tracking</label>
            <input placeholder="" className="p-1.5 border rounded w-full" />
          </div>

          <div className="space-y-1">
            <label className="block text-sm">Conversion event</label>
            <input placeholder="" className="p-1.5 border rounded w-full" />
          </div>

          <div className="space-y-1">
            <label className="block text-sm">URL Parameters (optionals)</label>
            <input placeholder="" className="p-1.5 border rounded w-full" />
          </div>
        </div>
      </Card>


      <Card>
        <CardHeader>
          <CardTitle>Ad Set Name</CardTitle>
          <p>Set Ad Set Name</p>
        </CardHeader>
        <div className="px-6 space-y-2">
          <input placeholder="Location, Age, Gender, Targeting, Type name" className="w-full p-2 border rounded" />
          <p>Preview = Indonesia, 18-30, Men & Women--</p>
        </div>
      </Card>
    </div>

        <FacebookPreview className="sticky top-4 self-start"
          primaryText={primaryText}
          headline={headline}
          description={description}
          url={url}
          mediaUrl={mediaUrl}
          mediaType={mediaType}
        />
      </div>
  );
}