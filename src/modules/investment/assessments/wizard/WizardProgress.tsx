'use client';

import { Check, Circle } from 'lucide-react';
import { cn } from '@/lib/utils';
import { WizardStep } from './types';

interface WizardProgressProps {
  steps: WizardStep[];
  currentStep: number;
  completedSteps: number[];
  onStepClick: (stepIndex: number) => void;
}

export function WizardProgress({
  steps,
  currentStep,
  completedSteps,
  onStepClick,
}: WizardProgressProps) {
  return (
    <div className="w-full px-4 py-6">
      <div className="relative">
        {/* Progress line */}
        <div className="absolute left-0 top-5 h-0.5 w-full bg-muted">
          <div
            data-testid="progress-bar"
            className="h-full bg-primary transition-all duration-500"
            style={{
              width: `${(Math.max(...completedSteps, currentStep) / (steps.length - 1)) * 100}%`,
            }}
          />
        </div>

        {/* Steps */}
        <div className="relative flex justify-between">
          {steps.map((step, index) => {
            const isCompleted = completedSteps.includes(index);
            const isCurrent = currentStep === index;
            const isClickable = isCompleted || isCurrent;

            return (
              <div
                key={step.id}
                className={cn(
                  "flex flex-col items-center",
                  isClickable && "cursor-pointer"
                )}
                onClick={() => isClickable && onStepClick(index)}
              >
                <div
                  className={cn(
                    "relative z-10 flex h-10 w-10 items-center justify-center rounded-full border-2 bg-background transition-all duration-200",
                    isCompleted && "border-primary bg-primary text-primary-foreground",
                    isCurrent && "border-primary",
                    !isCompleted && !isCurrent && "border-muted"
                  )}
                >
                  {isCompleted ? (
                    <Check className="h-5 w-5" />
                  ) : (
                    <span className="text-sm font-medium">{index + 1}</span>
                  )}
                </div>
                <div className="mt-2 text-center">
                  <p
                    className={cn(
                      "text-xs font-medium hidden sm:block",
                      (isCompleted || isCurrent) && "text-foreground",
                      !isCompleted && !isCurrent && "text-muted-foreground"
                    )}
                  >
                    {step.title}
                  </p>
                  {/* Show only current step title on mobile */}
                  {isCurrent && (
                    <p className="text-xs font-medium text-foreground sm:hidden">
                      {step.title}
                    </p>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}