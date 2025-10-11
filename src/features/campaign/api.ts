import { CreateCampaignResponse, CampaignForm } from "./type"

export type CreateCampaignsResult = {
    success: boolean
    results: CreateCampaignResponse[]
    errors?: string[]
}

export async function createCampaigns(forms: CampaignForm[]): Promise<CreateCampaignsResult> {
    const results: CreateCampaignResponse[] = []
    const errors: string[] = []

    const accessToken = process.env.NEXT_PUBLIC_FB_ACCESS_TOKEN
    const accountId = process.env.NEXT_PUBLIC_AD_ACCOUNT_ID

    if (!accessToken || !accountId) {
        throw new Error("Missing environment variables: NEXT_PUBLIC_FB_ACCESS_TOKEN or NEXT_PUBLIC_AD_ACCOUNT_ID")
    }

    for (const form of forms) {
        try {
            const body = new FormData()
            body.append("name", form.name)
            body.append("objective", form.objective)
            body.append("status", form.status)
            body.append("special_ad_categories", form.specialAdCategories)
            body.append("access_token", accessToken)

            const res = await fetch(`https://graph.facebook.com/v23.0/act_${accountId}/campaigns`, {
                method: "POST",
                body,
            })

            const data = await res.json()

            const item: CreateCampaignResponse = {
                id: data.id,
                error: data.error
                    ? {
                        message: data.error.message,
                        type: data.error.type,
                        code: data.error.code,
                        error_subcode: data.error.error_subcode,
                        fbtrace_id: data.error.fbtrace_id,
                    }
                    : {},
            }

            if (data.error) {
                errors.push(data.error.message || JSON.stringify(data.error))
            }

            results.push(item)
        } catch (_err: unknown) {
            const msg = "Failed to create campaign due to unexpected error."
            errors.push(msg)
            results.push({
                error: {
                    message: msg,
                    type: "InternalError",
                    code: 500,
                    error_subcode: 0,
                    fbtrace_id: "local",
                },
            })
        }
    }

    const overallSuccess = errors.length === 0

    return {
        success: overallSuccess,
        results,
        errors: errors.length ? errors : undefined,
    }
}
