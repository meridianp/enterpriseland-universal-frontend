import { z } from 'zod';
import { 
  Assessment,
  DevelopmentPartner,
  PBSAScheme,
  CreateAssessmentInput
} from '@/lib/types/assessment.types';

export interface WizardStepProps {
  data: Partial<AssessmentFormData>;
  onUpdate: (data: Partial<AssessmentFormData>) => void;
  onNext: () => void;
  onPrevious: () => void;
  isFirstStep: boolean;
  isLastStep: boolean;
}

export interface AssessmentFormData extends Partial<CreateAssessmentInput> {
  // Additional wizard-specific fields
  partnerId?: string;
  schemeId?: string;
  newPartner?: Partial<DevelopmentPartner>;
  newScheme?: Partial<PBSAScheme>;
}

export interface WizardStep {
  id: string;
  title: string;
  description: string;
  component: React.ComponentType<WizardStepProps>;
  validationSchema?: z.ZodType<any>;
}

export interface WizardState {
  currentStep: number;
  completedSteps: number[];
  formData: Partial<AssessmentFormData>;
  isDirty: boolean;
  lastSaved?: Date;
}