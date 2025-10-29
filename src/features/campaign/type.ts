export type CampaignForm = {
    name: string
    objective: string
    status: string
    specialAdCategories: string
}

export type CreateCampaignResponse = {
    id?: string
    error?: {
        message?: string,
        type?: string,
        code?: number,
        error_subcode?: number,
        fbtrace_id?: string
    }
}

export type CampaignAdAccount = {
    id: string
    name: string
    account_status: string

}