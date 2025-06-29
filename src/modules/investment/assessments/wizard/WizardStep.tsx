'use client';

import { useEffect } from 'react';
import { useForm, FormProvider } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { ChevronLeft, ChevronRight, Save } from 'lucide-react';
import { WizardStep as WizardStepType, WizardStepProps } from './types';

interface WizardStepWrapperProps extends WizardStepProps {
  step: WizardStepType;
  onSave?: () => void;
  onSubmit?: () => void | Promise<void>;
  onCancel?: () => void;
  isSubmitting?: boolean;
}

export function WizardStepWrapper({
  step,
  data,
  onUpdate,
  onNext,
  onPrevious,
  onSave,
  onSubmit,
  onCancel,
  isFirstStep,
  isLastStep,
  isSubmitting,
}: WizardStepWrapperProps) {
  const methods = useForm({
    resolver: step.validationSchema ? zodResolver(step.validationSchema) : undefined,
    defaultValues: data,
    mode: 'onChange',
  });

  const { handleSubmit, formState: { errors, isValid }, watch } = methods;

  // Watch for form changes and update parent
  useEffect(() => {
    const subscription = watch((value: any) => {
      onUpdate(value);
    }) as any;
    return () => {
      if (subscription && subscription.unsubscribe) {
        subscription.unsubscribe();
      }
    };
  }, [watch, onUpdate]);

  const handleFormSubmit = async (formData: Record<string, any>) => {
    onUpdate(formData);
    if (isLastStep && onSubmit) {
      await onSubmit();
    } else if (!isLastStep) {
      onNext();
    }
  };

  const Component = step.component;

  return (
    <FormProvider {...methods}>
      <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>{step.title}</CardTitle>
            <CardDescription>{step.description}</CardDescription>
          </CardHeader>
          <CardContent>
            <Component
              data={data}
              onUpdate={onUpdate}
              onNext={onNext}
              onPrevious={onPrevious}
              isFirstStep={isFirstStep}
              isLastStep={isLastStep}
            />
          </CardContent>
          <CardFooter className="flex justify-between">
            <div className="flex gap-2">
              {!isFirstStep && (
                <Button
                  type="button"
                  variant="outline"
                  onClick={onPrevious}
                >
                  <ChevronLeft className="h-4 w-4 mr-2" />
                  Previous
                </Button>
              )}
              {onCancel && (
                <Button
                  type="button"
                  variant="ghost"
                  onClick={onCancel}
                >
                  Cancel
                </Button>
              )}
            </div>
            <div className="flex gap-2">
              {onSave && (
                <Button
                  type="button"
                  variant="outline"
                  onClick={onSave}
                  disabled={isSubmitting}
                >
                  <Save className="h-4 w-4 mr-2" />
                  Save Draft
                </Button>
              )}
              <Button
                type="submit"
                disabled={(step.validationSchema && !isValid) || isSubmitting}
              >
                {isSubmitting ? 'Submitting...' : isLastStep ? 'Submit Assessment' : 'Next'}
                {!isLastStep && !isSubmitting && <ChevronRight className="h-4 w-4 ml-2" />}
              </Button>
            </div>
          </CardFooter>
        </Card>
      </form>
    </FormProvider>
  );
}