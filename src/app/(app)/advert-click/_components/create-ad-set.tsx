"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import { Switch } from "@/components/ui/switch"
import { Formik, Form, FieldArray, ErrorMessage } from "formik"
import * as Yup from "yup"
import { useEffect, useState } from "react"
import { getAudiences, getLocations, getLookalikeAudiences, getSavedAudiences  } from "@/features/ad-set/api"
import { Audience } from "@/features/ad-set/type"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { useDebounce } from "use-debounce"
import { AutomaticManualState, CreateAdSetPayload, } from "@/features/ad-set/type";
import { Checkbox } from "@/components/ui/checkbox";
import { DropdownMenuContent, DropdownMenuItem } from "@radix-ui/react-dropdown-menu"
import { DropdownMenu, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Plus } from "lucide-react"

// Skema Validasi Yup
const AdSetSchema = Yup.object().shape({
  adsets: Yup.array()
    .of(
      Yup.object().shape({
        location: Yup.string().required("Location is required"),
        audience: Yup.string().required("Audience is required"),
        ageMin: Yup.number().required().min(13).max(65),
        ageMax: Yup.number().required().min(13).max(65),
        gender: Yup.string().required("Gender is required"),
        placement: Yup.string().required("Placement is required"),
        frequencyControl: Yup.string().required("Frequency control is required"),
        adSetName: Yup.string().required("Ad set name is required"),
      })
    )
    .min(1, "At least one Ad Set is required"),
})

//constant untuk location
export const AdsetLocation = [
  { label: "Indonesia", value: "Indonesia" },
  { label: "Jakarta", value: "Jakarta" },
  { label: "Bandung", value: "Bandung" },
  { label: "Cimahi", value: "Cimahi" },
]

//constant untuk age
export const AdsetAge = Array.from({ length: 53 }, (_, i) => {
  const age = i + 13
  return { label: age.toString(), value: age }
})

//constant untuk gender
export const AdsetGender = [
  { label: "Men", value: "MEN" },
  { label: "Women", value: "WOMEN" },
  { label: "All", value: "ALL" },
]

//constant untuk automatic placement
export const AutomaticPlacement = [
  { label: "Automatic Placements (Recommended)", value: "AUTOMATIC" },
]

//constant untuk manual placement
export const ManualPlacement = [
  { label: "All Devices", value: "ALL" },
  { label: "Mobile Only", value: "MOBILE" },
  { label: "Desktop Only", value: "DESKTOP" },

  // Platforms
  { label: "Facebook", value: "facebook" },
  { label: "Instagram", value: "instagram" },
  { label: "Audience Network", value: "audience_network" },
  { label: "Messenger", value: "messenger" },
  { label: "WhatsApp", value: "whatsapp" },
  { label: "Threads", value: "threads" },
]

//constant untuk frequency control
export const AdsetFrequencyControl = [
  { label: "Target", value: "TARGET" },
  { label: "Limit", value: "LIMIT" },
]

//helper: find label dari value
export const findLabel = (arr: any[], value: any) => {
  const found = arr.find((item) => item.value === value)
  return found ? found.label : ""
}

export default function CreateAdSet() {
  const [suggestions, setSuggestions] = useState<any[]>([]) //  untuk menyimpan hasil lokasi
  const [searchQuery, setSearchQuery] = useState("") // untuk input pencarian lokasi
  const [debouncedQuery] = useDebounce(searchQuery, 1500) // supaya tidak spam API
  const [audiences, setAudiences] = useState<Audience[]>([]);
  const [lookalikeAudiences, setLookalikeAudiences] = useState<Audience[]>([]);
  const [savedAudience, setSavedAudience] = useState<Audience[]>([]); // saved audience
  const [placementMode, setPlacementMode] = useState<AutomaticManualState>(AutomaticManualState.AUTOMATIC );
  const [manualPlacements, setManualPlacements] = useState<string[]>([]);
  const [selectedDevice, setSelectedDevice] = useState("ALL")
  const [manualPlatforms, setManualPlatforms] = useState<string[]>([])
  const [adsetParts, setAdsetParts] = useState<string[]>([]);

  const adAccountId = process.env.NEXT_PUBLIC_AD_ACCOUNT_ID!

  const initialValues = {
    adsets: [
      {
        location: "",
        Audience: "",
        ageMin: 18,
        ageMax: 35,
        gender: "",
        placement: "",
        frequencyControl: "LIMIT",
        frequencyTimes: 2,
        frequencyDays: 7,
        adSetName: "",
        platforms: [] as string[],
      },
    ],
  }


  //placement
  const handleSubmit = async () => {
    const payload: CreateAdSetPayload = {
      automatic_manual_state: placementMode,

      ...(placementMode === AutomaticManualState.MANUAL && {
        manual_placements: manualPlatforms, 
        device_platform: selectedDevice, 
        }),
      optimization_goal: "",
      billing_event: ""
    };

    await fetch("/api/create-ad-set", {
      method: "POST",
      body: JSON.stringify(payload),
    });
  };


  // Fetch Custom Audiences
    useEffect(() => {
      async function fetchAudiences() {
      try {
        const normal = await getAudiences(adAccountId);
        const look = await getLookalikeAudiences(adAccountId);
        const saved = await getSavedAudiences(adAccountId);

        setAudiences([...normal, ...look]);
        setSavedAudience(saved);

            } catch (err) {
              console.error(err);
            }
          }
          fetchAudiences()
          }, []) 

 
    // Fetch Location Suggestions (berdasarkan query)
    useEffect(() => {
      if (!debouncedQuery || debouncedQuery.length < 2) {
        setSuggestions([])
        return
      }

      async function fetchLocations() {
        try {
          const locations = await getLocations(debouncedQuery)
          console.log("Location suggestions:", locations)
          setSuggestions(locations)
        } catch (err) {
          console.error("Error fetching locations:", err)
        }
      }

      fetchLocations()
    }, [debouncedQuery])

   // ad set name
    const addAdsetPart = (part: string) => {
      if (!adsetParts.includes(part)) {
        setAdsetParts([...adsetParts, part])
      }
    }
    const clearAdsetParts = () => setAdsetParts([])


    // Mapping → label pill → nilai actual dari formik
      const resolveAdsetPart = (part: string, adset: any) => {
        switch (part) {
          case "Location":
            return findLabel(AdsetLocation, adset.location);
          case "Age":
            return `${adset.ageMin} - ${adset.ageMax}`;
          case "Gender":
            return findLabel(AdsetGender, adset.gender);
          case "Audience":
            return adset.audience;
          case "Placement":
            if (adset.placement === "MANUAL" && adset.platforms?.length) {
              return `Manual: ${adset.platforms.map((p: any) => findLabel(ManualPlacement, p)).join(", ")}`;
            }
            return findLabel([...AutomaticPlacement, ...ManualPlacement], adset.placement);
          case "Frequency Control":
            return findLabel(AdsetFrequencyControl, adset.frequencyControl);
          default:
            return part;
        }
      };
 
    return (
      <Formik
        initialValues={initialValues}
        validationSchema={AdSetSchema}
        onSubmit={(values) => {
          console.log("AdSet Values:", values)
          alert("Ad Set(s) created successfully!")
        }}
      >
        {({ values, handleChange, handleBlur, setFieldValue }) => (
        <Form className=" w-full">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* KOLOM KIRI — FORM */}
            <div className="lg:col-span-1">
              <FieldArray
                name="adsets"
                render={(arrayHelpers) => (
                  <>
                    {values.adsets.map((adset, idx) => (
                      <Card key={idx} className="shadow-lg mb-6">
                        <CardHeader className="flex justify-between items-center">
                          <CardTitle>Ad Set {idx + 1}</CardTitle>
                          {/* Tombol hapus jika lebih dari 1 */}
                          {values.adsets.length > 1 && (
                            <Button
                              variant="destructive"
                              type="button"
                              onClick={() => arrayHelpers.remove(idx)}
                            >
                              Remove
                            </Button>
                          )}
                        </CardHeader>

                        <CardContent className="space-y-4">
                          {/* LOCATION FIELD */}
                          <div className="space-y-2">
                            <Label>Location</Label>

                            <Select
                              value={adset.location}
                              onValueChange={(val) => setFieldValue(`adsets.${idx}.location`, val)}
                            >
                              <SelectTrigger>
                                <SelectValue placeholder="Search or select location" />
                              </SelectTrigger>
                              <SelectContent>
                                <div className="p-2">
                                  <Input
                                    placeholder="Type to search..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="mb-2"
                                  />
                                </div>

                                {suggestions.length > 0 ? (
                                  suggestions.map((loc, i) => (
                                    <SelectItem key={i} value={loc.name}>
                                      {loc.name} ({loc.type})
                                    </SelectItem>
                                  ))
                                ) : (
                                  <div className="p-2 text-gray-500 text-sm">No locations found</div>
                                )}
                              </SelectContent>
                            </Select>

                            <ErrorMessage
                              name={`adsets.${idx}.location`}
                              component="p"
                              className="text-red-500 text-sm"
                            />
                          </div>

                          <Separator />

                          {/* AUDIENCE */}
                          <div className="flex justify-between items-center">
                          <Label>Audience</Label>
                        
                          <Select
                          onValueChange={(val) =>
                            setFieldValue(`adsets.${idx}.Audience`, val)
                          } >
                            <ErrorMessage
                              name={`adsets.${idx}.Audience`}
                              component="p"
                              className="text-red-500 text-sm"
                            />
                            <SelectTrigger className="w-[120px] text-xs">
                              <SelectValue placeholder="Create new" />
                            </SelectTrigger>
                            <SelectContent>
                              <div className="px-2 py-1 text-xs text-gray-500">Saved Audience</div>
                              {savedAudience.map(a => (
                                <SelectItem key={a.id} value={a.id}>{a.name}</SelectItem>
                              ))}

                              <Separator className="my-2"/>

                              <div className="px-2 py-1 text-xs text-gray-500">Custom Audience</div>
                              {audiences.map(a => (
                                <SelectItem key={a.id} value={a.id}>{a.name}</SelectItem>
                              ))}

                            </SelectContent>
                          </Select>
                        </div>

                          <Separator />

                          {/* AGE RANGE */}
                          <div className="flex gap-4">
                            <div className="space-y-2 w-1/2">
                              <Label>Min Age</Label>
                              <Input
                                type="number"
                                name={`adsets.${idx}.ageMin`}
                                value={adset.ageMin}
                                onChange={handleChange}
                              />
                              <ErrorMessage
                                name={`adsets.${idx}.ageMin`}
                                component="p"
                                className="text-red-500 text-sm"
                              />
                            </div>

                            <div className="space-y-2 w-1/2">
                              <Label>Max Age</Label>
                              <Input
                                type="number"
                                name={`adsets.${idx}.ageMax`}
                                value={adset.ageMax}
                                onChange={handleChange}
                              />
                              <ErrorMessage
                                name={`adsets.${idx}.ageMax`}
                                component="p"
                                className="text-red-500 text-sm"
                              />
                            </div>
                          </div>

                          <Separator />

                          {/* GENDER */}
                          <div className="space-y-2">
                            <Label>Gender</Label>
                            <Select
                              value={adset.gender}
                              onValueChange={(val) =>
                                setFieldValue(`adsets.${idx}.gender`, val)
                              }
                            >
                              <SelectTrigger>
                                <SelectValue placeholder="Select gender" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="MEN">Men</SelectItem>
                                <SelectItem value="WOMEN">Women</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>

                          <Separator />
                          {/* PLACEMENT MODE */}
                          <div className="space-y-2">
                            <Label>Placements</Label>

                            <Select
                              value={adset.placement}
                              onValueChange={(val) => setFieldValue(`adsets.${idx}.placement`, val)}
                            >
                              <SelectTrigger>
                                <SelectValue placeholder="Select placement" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="AUTOMATIC">Automatic Placement</SelectItem>
                                <SelectItem value="MANUAL">Manual Placement</SelectItem>
                              </SelectContent>
                            </Select>

                            {adset.placement === "MANUAL" && (
                              <div className="space-y-2 mt-2">
                                {/* ====================== DEVICES ====================== */}
                                <div className="space-y-2">
                                  <Label className="text-sm">Devices</Label>

                                  <Select
                                    value={selectedDevice}
                                    onValueChange={(val) => setSelectedDevice(val)}
                                  >
                                    <SelectTrigger>
                                      <SelectValue placeholder="All devices (recommended)" />
                                    </SelectTrigger>

                                    <SelectContent>
                                      <SelectItem value="ALL">All Devices (Recommended)</SelectItem>
                                      <SelectItem value="MOBILE">Mobile Only</SelectItem>
                                      <SelectItem value="DESKTOP">Desktop Only</SelectItem>
                                    </SelectContent>
                                  </Select>
                                </div>

                                {/* ====================== PLATFORMS ====================== */}
                                <div>
                                  <Label className="text-sm">Platforms</Label>

                                  <div className="grid grid-cols-2 gap-3 mt-2">
                                    {[
                                      { id: "facebook", label: "Facebook" },
                                      { id: "instagram", label: "Instagram" },
                                      { id: "audience_network", label: "Audience Network" },
                                      { id: "messenger", label: "Messenger" },
                                      { id: "whatsapp", label: "WhatsApp" },
                                      { id: "threads", label: "Threads" },
                                    ].map((item) => (
                                      <div key={item.id} className="flex items-center space-x-2">
                                        <Checkbox
                                          checked={adset.platforms?.includes(item.id)}
                                          onCheckedChange={(checked) => {
                                            const newPlatforms = checked
                                              ? [...(adset.platforms || []), item.id]
                                              : (adset.platforms || []).filter((p) => p !== item.id);
                                            setFieldValue(`adsets.${idx}.platforms`, newPlatforms);
                                          }}
                                        />
                                        <Label className="font-normal">{item.label}</Label>
                                      </div>
                                    ))}
                                  </div>
                                </div>
                              </div>
                            )}
                          </div>
                        <Separator />
      
                          {/* FREQUENCY CONTROL */}
                          <div className="space-y-2">
                            <Label>Frequency Control</Label>

                            <RadioGroup
                              value={adset.frequencyControl}
                              onValueChange={(val) => setFieldValue(`adsets.${idx}.frequencyControl`, val)}
                              className="space-y-3 mt-5"
                            >
                              {/* Target Option */}
                              <div className="flex items-start gap-3">
                                <RadioGroupItem value="TARGET" id={`target-${idx}`} />
                                <div className="flex flex-col">
                                  <Label htmlFor={`target-${idx}`} className="font-medium">
                                    Target
                                  </Label>
                                  <span className="text-sm text-gray-500">
                                    The average number of times you want people to see your ad
                                  </span>
                                </div>
                              </div>

                              {/* Limit Option */}
                              <div className="flex items-start gap-3">
                                <RadioGroupItem value="LIMIT" id={`limit-${idx}`} />
                                <div className="flex flex-col w-full">
                                  <Label htmlFor={`limit-${idx}`} className="font-medium">
                                    Limit
                                  </Label>
                                  <span className="text-sm text-gray-500 mb-3">
                                    The maximum number of times you want people to see your ad
                                  </span>

                                  {/* Input group (times & days) */}
                                  <div className="flex items-center gap-2">
                                    <Input
                                      type="number"
                                      min="1"
                                      name={`adsets.${idx}.frequencyTimes`}
                                      value={adset.frequencyTimes}
                                      onChange={handleChange}
                                      className="w-16"
                                    />
                                    <span>times every</span>
                                    <Input
                                      type="number"
                                      min="1"
                                      name={`adsets.${idx}.frequencyDays`}
                                      value={adset.frequencyDays}
                                      onChange={handleChange}
                                      className="w-16"
                                    />
                                    <span>day(s)</span>
                                  </div>

                                  <p className="text-xs text-muted-foreground mt-1">
                                    As a maximum, we will try to stay under {adset.frequencyTimes} impressions every {adset.frequencyDays} days.
                                  </p>
                                </div>
                              </div>
                            </RadioGroup>
                          </div>

                        <Separator /> 
                        {/* Ad Set Name */}
                        <div>
                          <h2 className="font-semibold mb-2">Ad Set Name</h2>
                          <p className="text-sm text-gray-500 mb-2">Set Ad Set Name</p>
                          
                          <div className="flex flex-wrap items-center gap-2 border rounded-md p-2">
                            {adsetParts.map((part, i) => (
                              <span 
                                key={i} 
                                className="bg-blue-100 text-blue-700 px-2 py-1 rounded-full text-xs flex items-center gap-1"
                                >
                                {part}
                              </span>
                            ))}

                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="icon">
                                  <Plus className="w-4 h-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent>
                                  <DropdownMenuItem onClick={() => addAdsetPart("Location")}>Location</DropdownMenuItem>
                                  <DropdownMenuItem onClick={() => addAdsetPart("Audience")}>Audience</DropdownMenuItem>
                                  <DropdownMenuItem onClick={() => addAdsetPart("Age")}>Age</DropdownMenuItem>
                                  <DropdownMenuItem onClick={() => addAdsetPart("Gender")}>Gender </DropdownMenuItem>
                                  <DropdownMenuItem onClick={() => addAdsetPart("Placement")}>Placement </DropdownMenuItem>
                                  <DropdownMenuItem onClick={() => addAdsetPart("Frequency Control")}> Frequency Control</DropdownMenuItem>
                              </DropdownMenuContent>
                              </DropdownMenu>
                            <Button variant="ghost" className="text-xs text-gray-500" onClick={clearAdsetParts}>Clear All 
                            </Button>
                          </div>

                          {/* preview section */}
                          <div className="mt-4">
                            <p className="font-medium text-gray-700">Preview:</p>

                            <p className="text-sm text-gray-500 font-semibold mt-2">
                              {adsetParts.length > 0
                              ? adsetParts.map((part) => resolveAdsetPart(part, values.adsets[idx])).filter(Boolean).join(" | ")
                              : "Set ad set name..."}

                            </p>
                          </div>

                        </div>
              
                        <Separator />
                        </CardContent>
                      </Card>
                    ))}
                  </>
                )}
              />

              <Separator className="my-6" />

              <Button type="submit" className="w-full">
                Submit All Ad Sets
              </Button>
            </div>

           
            {/* KOLOM KANAN — SPLIT SUMMARY */}
            <div className="lg:col-span-1">
              <Card className="shadow-md">
                <CardHeader>
                  <CardTitle>Ad Set Split Summary</CardTitle>
                  <p className="text-sm text-muted-foreground">
                    Check your ad set split summary
                  </p>
                </CardHeader>

                <CardContent className="space-y-4">
                  {/* Audience Targeting Switch */}
                  <div className="flex items-center justify-start gap-x-4">
                    <Switch defaultChecked />
                   <div className="flex flex-col">
                    <span>Audience Targeting</span>
                   </div>
                    <span className="ml-auto font-semibold">
                      Audience Variations
                    </span>
                  </div>

                  {/* Custom Audience */}
                  <div className="flex items-center justify-start gap-x-4">
                    <Switch defaultChecked />
                  <div className="flex flex-col">
                    <span>Custom Audience</span>
                  </div>
                    <span className="ml-auto font-semibold">
                      {values.adsets.length * 5} Variation
                    </span>
                  </div>

                  {/* Detail Targeting */}
                  <div className="flex items-center justify-start gap-x-4">
                    <Switch defaultChecked />
                   <div className="flex flex-col">
                    <span>Detail Targeting</span>
                  </div>
                    <span className="ml-auto text-gray-500">-</span>
                  </div>

                  <Separator />

                  {/* Total Ad Set */}
                  <div className="flex items-center justify-between">
                    <span>Total ad set</span>
                    <span className="font-semibold">{values.adsets.length}</span>
                  </div>

                  {/* Budget Type */}
                  <div className="flex items-center justify-between">
                    <span>Budget Type</span>
                    <Select defaultValue="DAILY">
                      <SelectTrigger className="w-[130px]">
                        <SelectValue placeholder="Daily Budget" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="DAILY">Daily Budget</SelectItem>
                        <SelectItem value="LIFETIME">Lifetime Budget</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Total Budget */}
                  <div className="flex items-center justify-between">
                    <span>Total Budget</span>
                    <Input
                      type="number"
                      placeholder="3,320,000"
                      className="w-[130px]"
                    />
                  </div>

                  <Button className="w-full mt-4">Check Audience Variation</Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </Form>
      )}
    </Formik>
  )
}


