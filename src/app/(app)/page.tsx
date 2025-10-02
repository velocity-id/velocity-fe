"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"

type CampaignForm = {
  name: string
  objective: string
  status: string
  specialAdCategories: string
}

export default function CampaignScreen() {
  const [forms, setForms] = useState<CampaignForm[]>([
    { name: "", objective: "", status: "", specialAdCategories: "NONE" },
  ])

  const handleChange = (index: number, field: keyof CampaignForm, value: string) => {
    const newForms = [...forms]
    newForms[index][field] = value
    setForms(newForms)
  }

  const handleAddForm = () => {
    setForms([...forms, { name: "", objective: "", status: "", specialAdCategories: "NONE" }])
  }

  const handleSubmitAll = async () => {
    const results: any[] = []

    for (const form of forms) {
      const body = new FormData()
      body.append("name", form.name)
      body.append("objective", form.objective)
      body.append("status", form.status)
      body.append("special_ad_categories", form.specialAdCategories)
      body.append("access_token", process.env.NEXT_PUBLIC_FB_ACCESS_TOKEN as string)

      const res = await fetch(
        `https://graph.facebook.com/v23.0/act_${process.env.NEXT_PUBLIC_AD_ACCOUNT_ID}/campaigns`,
        {
          method: "POST",
          body,
        }
      )

      const data = await res.json()
      results.push(data)
    }

    console.log("All FB responses:", results)
    alert(`All campaign results: ${JSON.stringify(results)}`)
  }

  return (
    <div className="container mx-auto py-6 space-y-4">
      <Label className="text-4xl">Velocity Melawan Managix Gacor</Label>
      <Button onClick={handleAddForm}>+ Add Campaign Form</Button>
      <Separator />
      {forms.map((form, idx) => (
        <Card key={idx} className="shadow-lg">
          <CardHeader>
            <CardTitle>Campaign Form {idx + 1}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label>Name</Label>
              <Input
                value={form.name}
                onChange={(e) => handleChange(idx, "name", e.target.value)}
              />
            </div>

            <div>
              <Label>Objective</Label>
              <Select
                value={form.objective}
                onValueChange={(val) => handleChange(idx, "objective", val)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select objective" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="OUTCOME_TRAFFIC">Traffic</SelectItem>
                  <SelectItem value="OUTCOME_ENGAGEMENT">Engagement</SelectItem>
                  <SelectItem value="OUTCOME_AWARENESS">Awareness</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label>Status</Label>
              <Select
                value={form.status}
                onValueChange={(val) => handleChange(idx, "status", val)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ACTIVE">Active</SelectItem>
                  <SelectItem value="PAUSED">Paused</SelectItem>
                  <SelectItem value="DELETED">Deleted</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label>Special Ad Categories</Label>
              <Select
                value={form.specialAdCategories}
                onValueChange={(val) => handleChange(idx, "specialAdCategories", val)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="NONE">None</SelectItem>
                  <SelectItem value="HOUSING">Housing</SelectItem>
                  <SelectItem value="EMPLOYMENT">Employment</SelectItem>
                  <SelectItem value="CREDIT">Credit</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>
      ))}

      <Separator />
      <Button className="w-full" onClick={handleSubmitAll}>
        Submit All Campaigns
      </Button>
    </div>
  )
}
