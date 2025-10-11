"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import { CommonHeader } from "@/components/common/common-header"
import { CommonAlertDialog } from "@/components/common/alert-dialog"
import { createCampaigns, CreateCampaignsResult } from "@/features/campaign/api"
import { CampaignForm, CreateCampaignResponse } from "@/features/campaign/type"

export default function CampaignScreen() {
  const [forms, setForms] = useState<CampaignForm[]>([
    { name: "", objective: "", status: "", specialAdCategories: "NONE" },
  ])

  const [dialog, setDialog] = useState({
    open: false,
    title: "",
    description: "",
    type: "info" as "success" | "warning" | "error" | "info",
  })

  const handleChange = (index: number, field: keyof CampaignForm, value: string) => {
    const newForms = [...forms]
    newForms[index][field] = value
    setForms(newForms)
  }

  const handleAddForm = () => {
    setForms([...forms, { name: "", objective: "", status: "", specialAdCategories: "NONE" }])
  }

  const handleSubmitAll = async () => {
    const results: CreateCampaignsResult = await createCampaigns(forms)
    console.log("Campaign creation results:", results)

    if (results.success) {
      setDialog({
        open: true,
        title: "Success",
        description: "All campaigns created successfully.",
        type: "success",
      })
    } else {
      setDialog({
        open: true,
        title: "Error",
        description: results.errors?.[0] || "An error occurred while creating campaigns.",
        type: "error",
      })
    }

  }

  return (
    <>
      <CommonHeader
        title="Create Campaigns"
        subtitle="Create multiple ad campaigns with ease using our intuitive form interface."
        extraActions={[
          <Button onClick={handleAddForm}>+ Campaign</Button>
        ]}
      />
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
      {dialog.open && (
        <CommonAlertDialog
          open={dialog.open}
          onOpenChange={(open) => setDialog((prev) => ({ ...prev, open }))}
          title={dialog.title}
          description={dialog.description}
          type={dialog.type}
        />
      )}
    </>
  )
}
