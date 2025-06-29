'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { WizardProgress } from './WizardProgress';
import { WizardStepWrapper } from './WizardStep';
import { WizardStep, WizardState, AssessmentFormData } from './types';
import { useCreateAssessment, useUpdateAssessment } from '@/lib/hooks/useAssessmentQueries';
import { Assessment } from '@/lib/types/assessment.types';

// Import step components (to be created)
import { BasicInfoStep } from './steps/BasicInfoStep';
import { PartnerSelectionStep } from './steps/PartnerSelectionStep';
import { SchemeSelectionStep } from './steps/SchemeSelectionStep';
import { StakeholderInfoStep } from './steps/StakeholderInfoStep';
import { FinancialInfoStep } from './steps/FinancialInfoStep';
import { CreditInfoStep } from './steps/CreditInfoStep';
import { OperationalInfoStep } from './steps/OperationalInfoStep';
import { LocationMarketStep } from './steps/LocationMarketStep';
import { EconomicMetricsStep } from './steps/EconomicMetricsStep';
import { ESGComplianceStep } from './steps/ESGComplianceStep';
import { RiskAssessmentStep } from './steps/RiskAssessmentStep';
import { ReviewSubmitStep } from './steps/ReviewSubmitStep';

// Define wizard steps
const wizardSteps: WizardStep[] = [
  {
    id: 'basic-info',
    title: 'Basic Info',
    description: 'Assessment type and general information',
    component: BasicInfoStep,
  },
  {
    id: 'partner-selection',
    title: 'Partner',
    description: 'Select or create development partner',
    component: PartnerSelectionStep,
  },
  {
    id: 'scheme-selection',
    title: 'Scheme',
    description: 'Select or create PBSA scheme',
    component: SchemeSelectionStep,
  },
  {
    id: 'stakeholder-info',
    title: 'Stakeholders',
    description: 'Ownership and governance information',
    component: StakeholderInfoStep,
  },
  {
    id: 'financial-info',
    title: 'Financials',
    description: 'Revenue, EBITDA, and financial metrics',
    component: FinancialInfoStep,
  },
  {
    id: 'credit-info',
    title: 'Credit',
    description: 'Credit ratings and checks',
    component: CreditInfoStep,
  },
  {
    id: 'operational-info',
    title: 'Operations',
    description: 'Experience and portfolio details',
    component: OperationalInfoStep,
  },
  {
    id: 'location-market',
    title: 'Location',
    description: 'Market fundamentals and demographics',
    component: LocationMarketStep,
  },
  {
    id: 'economic-metrics',
    title: 'Economics',
    description: 'Costs, yields, and returns',
    component: EconomicMetricsStep,
  },
  {
    id: 'esg-compliance',
    title: 'ESG',
    description: 'Environmental, social, and governance',
    component: ESGComplianceStep,
  },
  {
    id: 'risk-assessment',
    title: 'Risks',
    description: 'Risk evaluation across categories',
    component: RiskAssessmentStep,
  },
  {
    id: 'review-submit',
    title: 'Review',
    description: 'Review and submit assessment',
    component: ReviewSubmitStep,
  },
];

interface AssessmentWizardProps {
  assessment?: Assessment;
  mode?: 'create' | 'edit';
  onComplete?: (data: any) => void | Promise<void>;
  onCancel?: () => void;
  isSubmitting?: boolean;
}

const STORAGE_KEY = 'assessment-wizard-state';

export function AssessmentWizard({ 
  assessment, 
  mode = 'create',
  onComplete,
  onCancel,
  isSubmitting = false
}: AssessmentWizardProps) {
  const router = useRouter();
  const createMutation = useCreateAssessment();
  const updateMutation = useUpdateAssessment();

  // Initialize state from localStorage or assessment
  const [wizardState, setWizardState] = useState<WizardState>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved && mode === 'create') {
        const parsed = JSON.parse(saved);
        return {
          ...parsed,
          lastSaved: parsed.lastSaved ? new Date(parsed.lastSaved) : undefined,
        };
      }
    }

    return {
      currentStep: 0,
      completedSteps: [],
      formData: assessment || {},
      isDirty: false,
    };
  });

  // Save state to localStorage on changes
  useEffect(() => {
    if (mode === 'create' && wizardState.isDirty) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(wizardState));
    }
  }, [wizardState, mode]);

  // Handle step navigation
  const goToStep = useCallback((stepIndex: number) => {
    if (stepIndex < 0 || stepIndex >= wizardSteps.length) return;
    
    setWizardState(prev => ({
      ...prev,
      currentStep: stepIndex,
    }));
  }, []);

  const goToNext = useCallback(() => {
    setWizardState(prev => ({
      ...prev,
      currentStep: Math.min(prev.currentStep + 1, wizardSteps.length - 1),
      completedSteps: Array.from(new Set([...prev.completedSteps, prev.currentStep])),
    }));
  }, []);

  const goToPrevious = useCallback(() => {
    setWizardState(prev => ({
      ...prev,
      currentStep: Math.max(prev.currentStep - 1, 0),
    }));
  }, []);

  // Handle form data updates
  const updateFormData = useCallback((data: Partial<AssessmentFormData>) => {
    setWizardState(prev => ({
      ...prev,
      formData: { ...prev.formData, ...data },
      isDirty: true,
    }));
  }, []);

  // Handle save draft
  const saveDraft = useCallback(async () => {
    try {
      const { formData } = wizardState;
      
      if (mode === 'create') {
        // For now, just save to localStorage
        setWizardState(prev => ({
          ...prev,
          lastSaved: new Date(),
        }));
        toast.success('Draft saved successfully');
      } else if (assessment?.id) {
        // Update existing assessment
        await updateMutation.mutateAsync({
          id: assessment.id,
          data: formData as any,
        });
        toast.success('Assessment updated successfully');
      }
    } catch (error) {
      toast.error('Failed to save draft');
    }
  }, [wizardState, mode, assessment, updateMutation]);

  // Handle final submission
  const handleSubmit = useCallback(async () => {
    try {
      const { formData } = wizardState;
      
      if (onComplete) {
        // Use the provided onComplete handler
        await onComplete(formData);
        // Clear localStorage on successful submission
        localStorage.removeItem(STORAGE_KEY);
      } else if (mode === 'create') {
        const result = await createMutation.mutateAsync(formData as any);
        // Clear localStorage on successful submission
        localStorage.removeItem(STORAGE_KEY);
        toast.success('Assessment created successfully');
        router.push(`/assessments/${result.id}`);
      } else if (assessment?.id) {
        await updateMutation.mutateAsync({
          id: assessment.id,
          data: formData as any,
        });
        toast.success('Assessment updated successfully');
        router.push(`/assessments/${assessment.id}`);
      }
    } catch (error) {
      toast.error('Failed to submit assessment');
    }
  }, [wizardState, mode, assessment, createMutation, updateMutation, router, onComplete]);

  const currentStepConfig = wizardSteps[wizardState.currentStep];

  return (
    <div className="max-w-6xl mx-auto">
      {/* Progress indicator */}
      <WizardProgress
        steps={wizardSteps}
        currentStep={wizardState.currentStep}
        completedSteps={wizardState.completedSteps}
        onStepClick={goToStep}
      />

      {/* Current step */}
      <div className="mt-8">
        <WizardStepWrapper
          step={currentStepConfig}
          data={wizardState.formData}
          onUpdate={updateFormData}
          onNext={goToNext}
          onPrevious={goToPrevious}
          onSave={saveDraft}
          onSubmit={handleSubmit}
          onCancel={onCancel}
          isFirstStep={wizardState.currentStep === 0}
          isLastStep={wizardState.currentStep === wizardSteps.length - 1}
          isSubmitting={isSubmitting}
        />
      </div>

      {/* Last saved indicator */}
      {wizardState.lastSaved && (
        <div className="mt-4 text-center text-sm text-muted-foreground">
          Last saved: {wizardState.lastSaved.toLocaleTimeString()}
        </div>
      )}
    </div>
  );
}