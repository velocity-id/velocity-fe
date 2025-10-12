"use client"

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

import { Formik, Form, FieldArray, FormikErrors, ErrorMessage } from "formik"
import * as Yup from "yup"

const CampaignSchema = Yup.object().shape({
  campaigns: Yup.array()
    .of(
      Yup.object().shape({
        name: Yup.string().required("Campaign name is required"),
        objective: Yup.string().required("Objective is required"),
        status: Yup.string().required("Status is required"),
        specialAdCategories: Yup.string().required("Category is required"),
      })
    )
    .min(1, "At least one campaign is required"),
})

const initialValues = {
  campaigns: [
    { name: "", objective: "", status: "", specialAdCategories: "NONE" } as CampaignForm,
  ],
}

export default function CampaignScreen() {
  const { showAlert } = useAlert()
  const { setLoading } = useLoading()

  return (
    <Formik
      initialValues={initialValues}
      validationSchema={CampaignSchema}
      onSubmit={async (values: { campaigns: CampaignForm[] }, { resetForm }) => {
        setLoading(true, "Creating campaigns...")
        try {
          const responses = await Promise.allSettled(values.campaigns.map((form) => createCampaign(form)))

          const results: CreateCampaignResponse[] = []
          const errors: string[] = []

          for (const res of responses) {
            if (res.status === "fulfilled") {
              const data = res.value
              if (data.id) results.push(data)
              else if (data.error) {
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
            showAlert("Error", "Some campaigns failed to create.", "error")
          }
        } catch (err) {
          const msg = err instanceof Error ? err.message : String(err)
          showAlert("Error", msg, "error")
        } finally {
          setLoading(false)
          resetForm()
        }
      }}
    >
      {({ values, handleChange, handleBlur, setFieldValue }) => (
        <Form>
          <CommonHeader
            title="Create Campaigns"
            subtitle="Create multiple ad campaigns with ease using our intuitive form interface."
            extraActions={[
              <FieldArray
                name="campaigns"
                key="fieldArray"
                render={(arrayHelpers) => (
                  <Button
                    variant="default"
                    type="button"
                    onClick={() =>
                      arrayHelpers.push({
                        name: "",
                        objective: "",
                        status: "",
                        specialAdCategories: "NONE",
                      })
                    }
                  >
                    + Campaign
                  </Button>
                )}
              />,
            ]}
          />

          <Separator className="mb-4" />

          <FieldArray
            name="campaigns"
            render={() =>
              values.campaigns.map((form, idx) => (
                <Card key={idx} className="shadow-lg mb-6">
                  <CardHeader>
                    <CardTitle>Campaign Form {idx + 1}</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label>Name</Label>
                      <Input
                        name={`campaigns.${idx}.name`}
                        value={form.name}
                        onChange={handleChange}
                        onBlur={handleBlur}
                      />
                      <ErrorMessage
                        name={`campaigns.${idx}.name`}
                        component="p"
                        className="text-red-500 text-sm"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label>Objective</Label>
                      <Select
                        value={form.objective}
                        onValueChange={(val) =>
                          setFieldValue(`campaigns.${idx}.objective`, val)
                        }
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
                      <ErrorMessage
                        name={`campaigns.${idx}.objective`}
                        component="p"
                        className="text-red-500 text-sm"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label>Status</Label>
                      <Select
                        value={form.status}
                        onValueChange={(val) =>
                          setFieldValue(`campaigns.${idx}.status`, val)
                        }
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
                      <ErrorMessage
                        name={`campaigns.${idx}.status`}
                        component="p"
                        className="text-red-500 text-sm"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label>Special Ad Categories</Label>
                      <Select
                        value={form.specialAdCategories}
                        onValueChange={(val) =>
                          setFieldValue(`campaigns.${idx}.specialAdCategories`, val)
                        }
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
                      <ErrorMessage
                        name={`campaigns.${idx}.specialAdCategories`}
                        component="p"
                        className="text-red-500 text-sm"
                      />
                    </div>
                  </CardContent>
                </Card>
              ))
            }
          />

          <Separator className="mb-4" />
          <Button type="submit" className="w-full">
            Submit All Campaigns
          </Button>
        </Form>
      )}
    </Formik>
  )
}
