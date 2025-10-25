"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from "@/components/ui/dropdown-menu"
import { Separator } from "@/components/ui/separator"
import { Loader2, Plus, Upload } from "lucide-react"

export default function CreateCampaign() {
  const [loading, setLoading] = useState(true)
  const [budgetCost, setBudgetCost] = useState("")
  const [campaignParts, setCampaignParts] = useState<string[]>(["Create Date", "Campaign Budget", "Type Name"])

  const addCampaignPart = (part: string) => {
    if (!campaignParts.includes(part)) {
      setCampaignParts([...campaignParts, part])
    }
  }
  const clearCampaignParts = () => setCampaignParts([])


  // simulasi loading akun
  setTimeout(() => setLoading(false), 1500)

  return (
    <div className="w-full">
      <Card className="shadow-lg border w-full">
        <CardContent className="space-y-6 p-6">
          {/* Ad Account */}
          <div>
              <h2 className="font-semibold mb-2">Ad Account</h2>
              {loading ? (
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Loader2 className="animate-spin w-4 h-4" />
                  Loading Ad Account...
                </div>
              ) : (
                <p>Ad Account Loaded</p>
              )}
          </div>

          <Separator />

          {/* Campaign Type */}
          <div>
              <h2 className="font-semibold mb-2">Campaign Type</h2>
              <p className="text-sm text-gray-500 mb-2">Choose Campaign Type</p>
              <Select defaultValue="NONE">
                <SelectTrigger className="w-[200px]">
                  <SelectValue placeholder="Select Campaign Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="NONE">NONE</SelectItem>
                  <SelectItem value="ICO_ONLY">ICO_ONLY</SelectItem>
                </SelectContent>
              </Select>
          </div>

          <Separator />

          {/* Objective */}
          <div>
              <h2 className="font-semibold mb-2">Objective</h2>
              <p className="text-sm text-gray-500 mb-2">Choose Objective</p>
              <Select defaultValue="OUTCOME_APP_PROMOTION">
                <SelectTrigger className="w-[200px]">
                  <SelectValue placeholder="Select Objective" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="OUTCOME_APP_PROMOTION">App_Promotion</SelectItem>
                  <SelectItem value="OUTCOME_AWARENESS">Awareness</SelectItem>
                  <SelectItem value="OUTCOME_ENGAGEMENT">Engagement</SelectItem>
                  <SelectItem value="OUTCOME_LEADS">Leads</SelectItem>
                  <SelectItem value="OUTCOME_SALES">Sales</SelectItem>
                  <SelectItem value="OUTCOME_TRAFFIC">Traffic</SelectItem>
                </SelectContent>
              </Select>
          </div>

          <Separator />

          {/* Campaign Budget */}
          <h2 className="font-semibold mb-2">Campaign Budget</h2>
          <div className="flex items-center gap-4">
            <div className="flex flex-col">
              <p className="text-sm text-gray-500 mb-2">Set Campaign Budget</p>
              <Select defaultValue="Daily Budget">
                <SelectTrigger className="w-[160px] ">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Daily Budget">Daily Budget</SelectItem>
                  <SelectItem value="Lifetime Budget">Lifetime Budget</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex flex-col justify-center">
              <p className="text-sm text-gray-500 mb-2">Budget Cost</p>
              <Input
                placeholder="Enter Budget Cost"
                value={budgetCost}
                onChange={(e) => setBudgetCost(e.target.value)}
                className="w-[160px]"
              />
            </div>
          </div>

          <Separator />

          {/* Bid Strategy */}
          <div>
              <h2 className="font-semibold mb-2">Bid Strategy</h2>
              <p className="text-sm text-gray-500 mb-2">Choose Bid Strategi</p>
              <RadioGroup defaultValue="lowest">
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="lowest" id="lowest" />
                  <label htmlFor="lowest" className="text-sm">Lowest Cost</label>
                </div>
              </RadioGroup>
          </div>

          <Separator />

          {/* Campaign Schedule */}
          <div>
              <h2 className="font-semibold mb-2">Campaign Schedule</h2>
              <p className="text-sm text-gray-500 mb-2">Choose Campaign Schedule</p>
              <RadioGroup defaultValue="always">
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="always" id="always" />
                  <label htmlFor="always" className="text-sm">Run ads all the time</label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="schedule" id="schedule" />
                  <label htmlFor="schedule" className="text-sm">Run ads on a schedule</label>
                </div>
              </RadioGroup>
          </div>

          <Separator />


          {/* Campaign Name */}
          <div>
              <h2 className="font-semibold mb-2">Campaign Name</h2>
              <p className="text-sm text-gray-500 mb-2">Set Campaign Name</p>

              <div className="flex flex-wrap items-center gap-2 border rounded-md p-2">
                {campaignParts.map((part, i) => (
                  <span key={i} className="bg-blue-100 text-blue-700 px-2 py-1 rounded-full text-xs flex items-center gap-1">
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
                    <DropdownMenuItem onClick={() => addCampaignPart("Objective")}>Objective</DropdownMenuItem>
                    <DropdownMenuItem onClick={() => addCampaignPart("Created Date")}>Created Date</DropdownMenuItem>
                    <DropdownMenuItem onClick={() => addCampaignPart("Budget Campaign Type")}>Budget Campaign Type</DropdownMenuItem>
                    <DropdownMenuItem onClick={() => addCampaignPart("Campaign Budget")}>Campaign Budget</DropdownMenuItem>
                    <DropdownMenuItem onClick={() => addCampaignPart("Campaign Bid Strategy")}>Campaign Bid Strategy</DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
                <Button variant="ghost" className="text-xs text-gray-500" onClick={clearCampaignParts}>Clear All 
                </Button>
              </div>

              <p className="text-sm text-gray-500 mt-2">
                Preview: lorem ipsum
              </p>
          </div>

          <Separator />
        </CardContent>
      </Card>
    </div>
  )
}
