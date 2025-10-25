"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import { Switch } from "@/components/ui/switch"
import { CommonHeader } from "@/components/common/common-header"
import { Formik, Form, FieldArray, ErrorMessage } from "formik"
import * as Yup from "yup"

const AdSetSchema = Yup.object().shape({
  adsets: Yup.array()
    .of(
      Yup.object().shape({
        location: Yup.string().required("Location is required"),
        customAudience: Yup.string().required("Custom audience is required"),
        ageMin: Yup.number().required().min(13).max(65),
        ageMax: Yup.number().required().min(13).max(65),
        gender: Yup.string().required("Gender is required"),
        placement: Yup.string().required("Placement is required"),
        conversionWindow: Yup.string().required("Conversion window is required"),
        adSetName: Yup.string().required("Ad set name is required"),
      })
    )
    .min(1, "At least one Ad Set is required"),
})

const initialValues = {
  adsets: [
    {
      location: "",
      customAudience: "",
      ageMin: 18,
      ageMax: 35,
      gender: "",
      placement: "AUTOMATIC",
      conversionWindow: "7DAYS_CLICK",
      adSetName: "",
    },
  ],
}


export default function AdSetScreen() {
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
        <Form>
          <CommonHeader
            title="Create Ad Sets"
            subtitle="Create Ad Sets."
          />

          <Separator className="mb-4" />
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
                          {/* LOCATION */}
                          <div className="space-y-2">
                            <Label>Location</Label>
                            <Input
                              name={`adsets.${idx}.location`}
                              placeholder="e.g. Indonesia"
                              value={adset.location}
                              onChange={handleChange}
                              onBlur={handleBlur}
                            />
                            <ErrorMessage
                              name={`adsets.${idx}.location`}
                              component="p"
                              className="text-red-500 text-sm"
                            />
                          </div>

                          {/* CUSTOM AUDIENCE */}
                          <div className="space-y-2">
                            <Label>Custom Audience</Label>
                            <Input
                              name={`adsets.${idx}.customAudience`}
                              placeholder="e.g. Lookalike Audience ID"
                              value={adset.customAudience}
                              onChange={handleChange}
                              onBlur={handleBlur}
                            />
                            <ErrorMessage
                              name={`adsets.${idx}.customAudience`}
                              component="p"
                              className="text-red-500 text-sm"
                            />
                          </div>

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

                          {/* PLACEMENT */}
                          <div className="space-y-2">
                            <Label>Placement</Label>
                            <Select
                              value={adset.placement}
                              onValueChange={(val) =>
                                setFieldValue(`adsets.${idx}.placement`, val)
                              }
                            >
                              <SelectTrigger>
                                <SelectValue placeholder="Select placement" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="AUTOMATIC">
                                  Automatic Placement (Recommended)
                                </SelectItem>
                                <SelectItem value="MANUAL">
                                  Manual Placement
                                </SelectItem>
                              </SelectContent>
                            </Select>
                          </div>

                          {/* CONVERSION WINDOW */}
                          <div className="space-y-2">
                            <Label>Conversion Window</Label>
                            <Select
                              value={adset.conversionWindow}
                              onValueChange={(val) =>
                                setFieldValue(
                                  `adsets.${idx}.conversionWindow`,
                                  val
                                )
                              }
                            >
                              <SelectTrigger>
                                <SelectValue placeholder="Select conversion window" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="7DAYS_CLICK">
                                  7 Days Click or 1 Day View
                                </SelectItem>
                                <SelectItem value="1DAY_CLICK">
                                  1 Day Click
                                </SelectItem>
                              </SelectContent>
                            </Select>
                          </div>

                          {/* AD SET NAME */}
                          <div className="space-y-2">
                            <Label>Ad Set Name</Label>
                            <Input
                              name={`adsets.${idx}.adSetName`}
                              placeholder="e.g. Indonesia-18-35-Men & Women"
                              value={adset.adSetName}
                              onChange={handleChange}
                            />
                          </div>
                        </CardContent>
                      </Card>
                    ))}

                    {/* Tombol tambah ad set baru */}
                    {/* <Button
                      variant="default"
                      type="button"
                      onClick={() =>
                        arrayHelpers.push({
                          location: "",
                          customAudience: "",
                          ageMin: 18,
                          ageMax: 35,
                          gender: "",
                          placement: "AUTOMATIC",
                          conversionWindow: "7DAYS_CLICK",
                          adSetName: "",
                        })
                      }
                    >
                      + Add More Ad Set
                    </Button> */}
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
              <Card className="sticky top-4 shadow-md">
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
