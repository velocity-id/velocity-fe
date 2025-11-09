"use client";

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



export default function AdPage() {
const [selectedImage, setSelectedImage] = useState<string | null>(null);

const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
const file = e.target.files?.[0];
if (file) {
setSelectedImage(URL.createObjectURL(file));
}
};

return (
  <div className="flex flex-col lg:flex-row gap-4 p-6 bg-gray-50 min-h-screen">
    {/* Kolom Kanan */}
    <div className="flex-1 space-y-4">
      
      <Card>
        <CardHeader>
          <CardTitle>Idenity</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className='space-y-2'>
            <Label>Pilih Facebook Page</Label>
            <Select>
              <SelectTrigger>
                <SelectValue placeholder="Velocity Well" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="velocity">Velocity Well</SelectItem>
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

      {/* Ad Type */}
      <Card>
        <CardHeader>
          <CardTitle>Ad Type</CardTitle>
        </CardHeader>
        <CardContent>
          <Button variant="outline" className="w-full">
            New Ad
          </Button>
        </CardContent>
      </Card>

      {/* Ad Format */}
      <Card>
        <CardHeader>
          <CardTitle>Ad Format</CardTitle>
        </CardHeader>
        <CardContent>
          <Button variant="outline" className="w-full">
            Single Image or Video
          </Button>
        </CardContent>
      </Card>

      {/* Ad Media */}
      <Card>
        <CardHeader>
          <CardTitle>Ad Media</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <label>Choose Image</label>
          <input type="file" accept="image/*" onChange={handleImageUpload} />
          {selectedImage && (
            <img src={selectedImage} alt="Selected" className="mt-4 max-w-full h-auto rounded" />
          )}
        </CardContent>
      </Card>

      {/* Ad Copy */}
      <Card>
        <CardHeader>
          <CardTitle>Ad Copy</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className='space-y-2'>
            <Label>Primary Text</Label>
            <textarea placeholder="Insert your primary key to show to our audience" className="w-full p-2 border rounded" />
          </div>
          <div className='space-y-2'>
            <Label>Headline</Label>
            <input placeholder="Insert your headline text" className="w-full p-2 border rounded" />
          </div>
        </CardContent>
      </Card>

      {/* Web URL */}
      <Card>
        <CardHeader>
          <CardTitle>Web URL</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <input placeholder="Insert your website URL" className="w-full p-2 border rounded" />
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
          <p>Preview : Indonesia, 18-30, Men & Women--</p>
        </div>
      </Card>
    </div>

  <div className="flex-1">
    <Card className="sticky top-2">
      <CardHeader>
        <CardTitle>Mobile News Feed</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="border rounded-lg p-3 flex justify-center bg-white">
          {selectedImage ? (
            <img src={selectedImage} alt="Preview" className="max-h-64" />
          ) : (
            <div className="text-gray-400">Image preview</div>
          )}
        </div>
        <div className='space-y-2'>
          <Label>CopyClicks</Label>
          <Select>
            <SelectTrigger>
              <SelectValue placeholder="Problem" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="problem">Problem</SelectItem>
              <SelectItem value="solution">Solution</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="border rounded-lg p-3 space-y-2">
          <p className="text-sm">“Apakah Anda ingin meningkatkan omzet hingga tiga kali lipat?”</p>
          <p className="text-sm">“Maukah perusahaan Anda meraih pendapatan tiga kali lebih besar?”</p>
          <p className="text-sm">“Maukah Anda mengembangkan usaha dengan omzet meningkat tiga kali lipat?”</p>
        </div>
        <div className="flex justify-between">
          <Button variant="outline">Generate More Suggestion</Button>
          <Button>Insert</Button>
        </div>
      </CardContent>
    </Card>
  </div>
</div>
);
}