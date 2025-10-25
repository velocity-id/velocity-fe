'use client'

import { useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
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
} from '@/components/ui/stepper';
import { BookUser, Check, CreditCard, Layers, ListTodo, LoaderCircleIcon, LockKeyhole, Megaphone, ShoppingBag, Target } from 'lucide-react';
import CreateCampaign from './_components/create-campaign';
import CreateAdSet from './_components/create-ad-set';
import { CommonHeader } from '@/components/common/common-header';

const steps = [
    { title: 'Campaign', icon: Megaphone },
    { title: 'Ad Set', icon: Target },
    { title: 'Ad', icon: Layers },
];

export default function Component() {
    const [currentStep, setCurrentStep] = useState(1);

    return (
        <div>
            <CommonHeader
                title='Advert Click'
                subtitle='Kelola Campaign, Ad Set, Ad.'
            />
            <div className='h-10'></div>
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
                    {steps.map((step, index) => {
                        return (
                            <StepperItem key={index} step={index + 1} className="relative flex-1 items-start">
                                <StepperTrigger className="flex flex-col items-start justify-center gap-2.5 grow" asChild>
                                    <StepperIndicator className="size-8 border-2 data-[state=completed]:text-white data-[state=completed]:bg-green-500 data-[state=inactive]:bg-transparent data-[state=inactive]:border-border data-[state=inactive]:text-muted-foreground">
                                        <step.icon className="size-4" />
                                    </StepperIndicator>
                                    <div className="flex flex-col items-start gap-1">
                                        <div className="text-[10px] font-semibold uppercase text-muted-foreground">Step {index + 1}</div>
                                        <StepperTitle className="text-start text-base font-semibold group-data-[state=inactive]/step:text-muted-foreground">
                                            {step.title}
                                        </StepperTitle>
                                    </div>
                                </StepperTrigger>

                                {steps.length > index + 1 && (
                                    <StepperSeparator className="absolute top-4 inset-x-0 start-9 m-0 group-data-[orientation=horizontal]/stepper-nav:w-[calc(100%-2rem)] group-data-[orientation=horizontal]/stepper-nav:flex-none  group-data-[state=completed]/step:bg-green-500" />
                                )}
                            </StepperItem>
                        );
                    })}
                </StepperNav>

                <StepperPanel className="text-sm">
                    <StepperContent key={'create-campaign'} value={1} className="flex items-center justify-center">
                        <CreateCampaign />
                    </StepperContent>
                    <StepperContent key={'create-ad-set'} value={2} className="flex items-center justify-center">
                        <CreateAdSet />
                    </StepperContent>
                    <StepperContent key={'create-ad'} value={3} className="flex items-center justify-center">
                        <div>ad</div>
                    </StepperContent>
                </StepperPanel>

                <div className="flex items-center justify-between gap-2.5">
                    {currentStep > 1 ? <Button variant="outline" onClick={() => setCurrentStep((prev) => prev - 1)} disabled={currentStep === 1}>
                        Previous
                    </Button> : <div></div>}

                    <Button
                        variant="default"
                        onClick={() => {
                            if (currentStep < 3) {
                                setCurrentStep((prev) => prev + 1)

                            } else {
                                setCurrentStep(1);
                                alert('Created Successfully')
                            }
                        }
                        }
                    >
                        Next
                    </Button>
                </div>
            </Stepper>
        </div>

    );
}
