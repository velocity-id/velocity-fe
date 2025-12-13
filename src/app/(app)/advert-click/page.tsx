"use client";

import { useEffect, useState } from "react";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import { Button } from "@/components/ui/button";
import {
    Stepper,
    StepperContent,
    StepperIndicator,
    StepperItem,
    StepperNav,
    StepperPanel,
    StepperSeparator,
    StepperTitle,
    StepperTrigger,
} from "@/components/ui/stepper";
import {
    Check,
    LoaderCircleIcon,
    Megaphone,
    Target,
    Layers,
} from "lucide-react";
import { CommonHeader } from "@/components/common/common-header";
import CreateCampaign from "./_components/create-campaign";
import CreateAdSet from "./_components/create-ad-set";
import CreateAd from "./_components/create-ad";
import { getSession } from "next-auth/react";
import { useAlert } from "@/hooks/use-alert";
import { useLoading } from "@/hooks/use-loading";

const FullSchema = Yup.object().shape({
    budget_mode: Yup.string().required("Required"),
    selectedAdAccount: Yup.string().required("Required"),
    campaign: Yup.object().shape({
        name: Yup.string().required("Required"),
        objective: Yup.string().required("Required"),
        status: Yup.string().required("Required"),
        special_ad_categories: Yup.array().of(Yup.string()).min(1, "Required"),
        bid_strategy: Yup.string().optional(),
    }),
    adset: Yup.object().shape({
        name: Yup.string().required("Required"),
        daily_budget: Yup.number().required("Required").min(100),
        geo_locations: Yup.object().shape({
            countries: Yup.array().of(Yup.string()).min(1, "Required"),
            bid_strategy: Yup.string().optional(),
        }),
    }),
    ad: Yup.object().shape({
        name: Yup.string().required("Required"),
        // creative_id: Yup.string().required("Required"),
        status: Yup.string().required("Required"),
        image_file: Yup.mixed().required("Image required"),
        message: Yup.string().required("Message required"),
    }),
});

export type InitialFormType = {
    selectedAdAccount: string;
    budget_mode: string;
    campaign: {
        name: string;
        objective: string;
        status: string;
        special_ad_categories: string[];
        bid_strategy: string;
        daily_budget: number;
    };
    adset: {
        name: string;
        daily_budget: number;
        geo_locations: {
            countries: string[];
        };
        saved_audience_ids: string[];
        bid_strategy: string;
    };
    ad: {
        name: string;
        creative_id: string;
        status: string;
        image_file: File | null;
        image_hash: string;
        message: string;
    };
};



const initialValues: InitialFormType = {
    selectedAdAccount: "",
    budget_mode: "CBO", // enum: CBO atau ABO
    campaign: {
        name: "",
        objective: "OUTCOME_AWARENESS",
        status: "PAUSED",
        special_ad_categories: ["NONE"],
        bid_strategy: "LOWEST_COST_WITHOUT_CAP",
        daily_budget: 1000,
    },
    adset: {
        name: "",
        daily_budget: 1000,
        geo_locations: { countries: ["US"] },
        saved_audience_ids: [],
        bid_strategy: "LOWEST_COST_WITHOUT_CAP",
    },
    ad: { name: "", creative_id: "", status: "ACTIVE", image_file: null, image_hash: "", message: "" },
};

const steps = [
    { title: "Campaign", icon: Megaphone },
    { title: "Ad Set", icon: Target },
    { title: "Ad", icon: Layers },
];

export default function Component() {
    const [currentStep, setCurrentStep] = useState(1);
    const { setLoading } = useLoading();

    const accessToken = 'EAAPZB0wXT18ABP0T3ikLlNiOeUBfnrQRamhYVfUZCSHEpt9ZA5UovMy5wkACZBoQ5ZB94DgiIogBnrwuweYZAZBY3wi7zhNSMa5eZCdj8Sv6Jzdr6CW3zJ4OFpPkWbj1s1uUDRcfasZBepGQDTcqAg8K7ZC3CpdjNS7cZCZCe9pqd177O4ZCTZB6pMxgcxvqHFFP3XFFvYDY1bGZBysNRre9PaSCwkv2pnatvmM0FCIJ5BqZAth64VPOywnUdMpf1Wl1ZCU54WTJS2vkooCrqGMp0nmCX1gsLCydrXJZBuMTA1';
    const { showAlert } = useAlert();
    return (
        <Formik
            initialValues={initialValues}
            validationSchema={FullSchema}
            onSubmit={async (values, { resetForm }) => {
                try {
                    setLoading(true);

                    // === 1. CAMPAIGN ===
                    const cForm = new FormData();
                    cForm.append("name", values.campaign.name);
                    cForm.append("objective", values.campaign.objective);
                    cForm.append("status", values.campaign.status);
                    cForm.append(
                        "special_ad_categories",
                        JSON.stringify(values.campaign.special_ad_categories)
                    );

                    if (values.budget_mode === "CBO") {
                        // CBO mode: budget & bid_strategy di campaign
                        cForm.append("bid_strategy", values.campaign.bid_strategy);
                        cForm.append("daily_budget", String(values.campaign.daily_budget));
                    } else {
                        cForm.append("is_adset_budget_sharing_enabled", "false");
                    }
                    cForm.append("access_token", accessToken);


                    const cRes = await fetch(
                        `https://graph.facebook.com/v24.0/${values.selectedAdAccount}/campaigns`,
                        { method: "POST", body: cForm }
                    );
                    const cJson = await cRes.json();
                    if (!cJson.id) throw new Error("Campaign failed");

                    // === 2. AD SET (LOOP PER audienceId) ===
                    for (const audienceId of values.adset.saved_audience_ids) {

                        // ----------------------------------------
                        // 2A. CREATE AD SET
                        // ----------------------------------------
                        const aForm = new FormData();
                        aForm.append("name", values.adset.name + " - " + audienceId);
                        aForm.append("campaign_id", cJson.id);
                        // === BID STRATEGY LOGIC ===
                        if (values.budget_mode === "ABO") {
                            // ABO: bid strategy di ad set
                            aForm.append("bid_strategy", values.adset.bid_strategy);
                            aForm.append("daily_budget", String(values.adset.daily_budget));
                        } else {
                            // CBO: jangan kirim bid_strategy atau budget ke ad set
                            // Meta akan reject jika dikirim
                        }
                        aForm.append("billing_event", "IMPRESSIONS");

                        // gunakan saved audience
                        aForm.append("audience_id", audienceId);

                        aForm.append(
                            "targeting",
                            JSON.stringify({
                                geo_locations: values.adset.geo_locations,
                            })
                        );

                        aForm.append("access_token", accessToken);

                        const aRes = await fetch(
                            `https://graph.facebook.com/v24.0/${values.selectedAdAccount}/adsets`,
                            { method: "POST", body: aForm }
                        );

                        const aJson = await aRes.json();
                        if (!aJson.id) throw new Error("Ad Set failed for audience: " + audienceId);

                        // ----------------------------------------
                        // 3. UPLOAD IMAGE (PER ADSET)
                        // ----------------------------------------
                        const imgForm = new FormData();
                        if (values.ad.image_file) {
                            imgForm.append("filename", values.ad.image_file);
                        }

                        imgForm.append("access_token", accessToken);

                        const imgRes = await fetch(
                            `https://graph.facebook.com/v24.0/${values.selectedAdAccount}/adimages`,
                            { method: "POST", body: imgForm }
                        );

                        const imgJson = await imgRes.json();
                        let imageHash: string | undefined;
                        if (values.ad.image_file) {
                            imageHash =
                                imgJson?.images?.[values.ad.image_file.name]?.hash;
                        }

                        if (!imageHash) throw new Error("Image upload failed");

                        // ----------------------------------------
                        // 4. CREATE CREATIVE (PER ADSET)
                        // ----------------------------------------
                        const creativeForm = new FormData();
                        creativeForm.append("name", values.ad.name + " - " + audienceId);
                        creativeForm.append(
                            "object_story_spec",
                            JSON.stringify({
                                page_id: "822499580957870",
                                link_data: {
                                    message: values.ad.message,
                                    image_hash: imageHash,
                                    link: "https://example.com",
                                },
                            })
                        );
                        creativeForm.append("access_token", accessToken);

                        const creativeRes = await fetch(
                            `https://graph.facebook.com/v24.0/${values.selectedAdAccount}/adcreatives`,
                            { method: "POST", body: creativeForm }
                        );
                        const creativeJson = await creativeRes.json();
                        if (!creativeJson.id) throw new Error("Creative failed per audience");

                        // ----------------------------------------
                        // 5. CREATE AD (PER ADSET)
                        // ----------------------------------------
                        const adForm = new FormData();
                        adForm.append("name", values.ad.name + " - " + audienceId);
                        adForm.append("adset_id", aJson.id);
                        adForm.append(
                            "creative",
                            JSON.stringify({ creative_id: creativeJson.id })
                        );
                        adForm.append("status", values.ad.status);
                        adForm.append("access_token", accessToken);

                        const adRes = await fetch(
                            `https://graph.facebook.com/v24.0/${values.selectedAdAccount}/ads`,
                            { method: "POST", body: adForm }
                        );

                        const adJson = await adRes.json();
                        if (!adJson.id) throw new Error("Ad failed per audience");
                    }


                    showAlert("Success", "All items created successfully.", "success");
                    setCurrentStep(1);
                    resetForm();
                } catch (e) {
                    console.error(e);
                    showAlert("Error", "Failed creating items", "error");
                } finally {
                    setLoading(false);

                }
            }}
        >
            {({ values, errors, touched, handleChange, setFieldValue, handleBlur, handleReset, handleSubmit }) => (
                <Form>
                    <CommonHeader title="Advert Click" subtitle="Kelola Campaign, Ad Set, Ad." />
                    <div className="h-10"></div>

                    <Stepper
                        value={currentStep}
                        onValueChange={setCurrentStep}
                        indicators={{
                            completed: <Check className="size-4" />,
                            loading: <LoaderCircleIcon className="size-4 animate-spin" />,
                        }}
                        className="space-y-8"
                    >
                        <StepperNav className="gap-3 mb-15">
                            {steps.map((step, index) => (
                                <StepperItem key={index} step={index + 1} className="relative flex-1 items-start">
                                    <StepperTrigger className="flex flex-col items-start justify-center gap-2.5 grow" asChild>
                                        <StepperIndicator className="size-8 border-2 data-[state=completed]:bg-green-500">
                                            <step.icon className="size-4" />
                                        </StepperIndicator>
                                        <div className="flex flex-col items-start gap-1">
                                            <div className="text-[10px] font-semibold uppercase text-muted-foreground">
                                                Step {index + 1}
                                            </div>
                                            <StepperTitle className="text-start text-base font-semibold">
                                                {step.title}
                                            </StepperTitle>
                                        </div>
                                    </StepperTrigger>

                                    {steps.length > index + 1 && (
                                        <StepperSeparator className="absolute top-4 inset-x-0 start-9" />
                                    )}
                                </StepperItem>
                            ))}
                        </StepperNav>

                        <StepperPanel className="text-sm">
                            <StepperContent value={1} className="flex items-center justify-center">
                                <CreateCampaign formik={{ values, errors, touched, handleChange, setFieldValue, handleBlur, handleReset }} />
                            </StepperContent>
                            <StepperContent value={2} className="flex items-center justify-center">
                                <CreateAdSet formik={{ values, errors, touched, handleChange, setFieldValue, handleBlur, handleReset }} />
                            </StepperContent>
                            <StepperContent value={3} className="flex items-center justify-center">
                                <CreateAd formik={{ values, errors, touched, handleChange, setFieldValue, handleBlur, handleReset }} />
                            </StepperContent>
                        </StepperPanel>

                        <div className="flex items-center justify-between gap-2.5">
                            {currentStep > 1 ? (
                                <Button variant="outline" onClick={() => setCurrentStep((prev) => prev - 1)}>
                                    Previous
                                </Button>
                            ) : (
                                <div></div>
                            )}

                            <Button
                                type={currentStep === 3 ? "submit" : "button"}
                                onClick={() => {
                                    if (currentStep < 3) setCurrentStep((prev) => prev + 1);
                                }}
                            >
                                {currentStep > 2 ? "Save" : "Next"}
                            </Button>
                        </div>
                    </Stepper>
                </Form>
            )}
        </Formik>
    );
}
