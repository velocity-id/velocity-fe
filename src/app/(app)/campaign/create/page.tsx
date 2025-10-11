"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import { CommonHeader } from "@/components/common/common-header"
import { CampaignForm, CreateCampaignResponse } from "@/features/campaign/type"
import { createCampaign } from "@/features/campaign/api"
import { useLoading } from "@/hooks/use-loading"
import { useAlert } from "@/hooks/use-alert"



export default function CampaignScreen() {
  const { showAlert } = useAlert()
  const { setLoading } = useLoading()
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
    setLoading(true, "Creating campaigns...")
    try {
      const responses = await Promise.allSettled(forms.map((form) => createCampaign(form)))

      const results: CreateCampaignResponse[] = []
      const errors: string[] = []

      for (const res of responses) {
        if (res.status === "fulfilled") {
          const data = res.value
          if (data.id) {
            results.push(data)
          } else if (data.error) {
            errors.push(data.error.message!)
            results.push(data)
          }
        } else {
          const msg = res.reason instanceof Error ? res.reason.message : String(res.reason)
          errors.push(msg)
          results.push({
            error: {
              message: msg,
              type: "NetworkError",
              code: 500,
              error_subcode: 0,
            },
          })
        }
      }

      console.log("Campaign creation results:", results)

      if (errors.length === 0) {
        showAlert("Success", "All campaigns created successfully.", "success")

      } else {
        showAlert("Error", "An error occurred while creating campaigns.", "error")

      }
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err)
      showAlert("Error", "An error occurred while creating campaigns.", "error")

    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <CommonHeader
        title="Create Campaigns"
        subtitle="Create multiple ad campaigns with ease using our intuitive form interface."
        extraActions={[
          <Button variant="default" onClick={handleAddForm}>+ Campaign</Button>
        ]}
      />
      <Separator />
      {forms.map((form, idx) => (
        <Card key={idx} className="shadow-lg">
          <CardHeader>
            <CardTitle>Campaign Form {idx + 1}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Name</Label>
              <Input
                value={form.name}
                onChange={(e) => handleChange(idx, "name", e.target.value)}
              />
            </div>

            <div className="space-y-2">
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

            <div className="space-y-2">
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

            <div className="space-y-2">
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
    </>
  )
}
