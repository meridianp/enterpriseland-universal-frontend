import React from 'react';
import { render, screen, fireEvent } from '@/lib/test-utils';
import { WizardProgress } from '../WizardProgress';
import { WizardStep } from '../types';

describe('WizardProgress', () => {
  const mockSteps: WizardStep[] = [
    { id: 'basic', title: 'Basic Info', component: () => null },
    { id: 'partner', title: 'Partner Selection', component: () => null },
    { id: 'financial', title: 'Financial Info', component: () => null },
    { id: 'risk', title: 'Risk Assessment', component: () => null },
  ];

  const mockOnStepClick = jest.fn();

  const defaultProps = {
    steps: mockSteps,
    currentStep: 0,
    completedSteps: [],
    onStepClick: mockOnStepClick,
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should render all steps', () => {
    render(<WizardProgress {...defaultProps} />);
    
    mockSteps.forEach(step => {
      expect(screen.getByText(step.title)).toBeInTheDocument();
    });
  });

  it('should show step numbers for incomplete steps', () => {
    render(<WizardProgress {...defaultProps} />);
    
    // First step is current, others should show numbers
    expect(screen.getByText('1')).toBeInTheDocument();
    expect(screen.getByText('2')).toBeInTheDocument();
    expect(screen.getByText('3')).toBeInTheDocument();
    expect(screen.getByText('4')).toBeInTheDocument();
  });

  it('should show check marks for completed steps', () => {
    render(
      <WizardProgress {...defaultProps} completedSteps={[0, 1]} currentStep={2} />
    );
    
    // Should have 2 check icons for completed steps (lucide-check class)
    const checkIcons = document.querySelectorAll('.lucide-check');
    expect(checkIcons).toHaveLength(2);
  });

  it('should highlight current step', () => {
    render(<WizardProgress {...defaultProps} currentStep={2} />);
    
    // Check for the step circle elements that have the border-primary class
    const stepCircles = document.querySelectorAll('.border-primary');
    expect(stepCircles.length).toBeGreaterThan(0);
  });

  it('should allow clicking on completed steps', () => {
    render(
      <WizardProgress {...defaultProps} completedSteps={[0, 1]} currentStep={2} />
    );
    
    // Click on completed step - find the step container div
    const basicInfoStep = screen.getByText('Basic Info').closest('div[class*="flex flex-col items-center"]');
    fireEvent.click(basicInfoStep!);
    
    expect(mockOnStepClick).toHaveBeenCalledWith(0);
  });

  it('should allow clicking on current step', () => {
    render(<WizardProgress {...defaultProps} currentStep={1} />);
    
    // Click on current step - find the step container div
    const partnerSelectionStep = screen.getByText('Partner Selection').closest('div[class*="flex flex-col items-center"]');
    fireEvent.click(partnerSelectionStep!);
    
    expect(mockOnStepClick).toHaveBeenCalledWith(1);
  });

  it('should not allow clicking on future steps', () => {
    render(<WizardProgress {...defaultProps} currentStep={0} />);
    
    // Try to click on future step - find the step container div
    const riskAssessmentStep = screen.getByText('Risk Assessment').closest('div[class*="flex flex-col items-center"]');
    fireEvent.click(riskAssessmentStep!);
    
    expect(mockOnStepClick).not.toHaveBeenCalled();
  });

  it('should update progress bar width based on completed steps', () => {
    const { rerender } = render(<WizardProgress {...defaultProps} />);
    
    // Check initial progress (0%)
    const progressBar = screen.getByTestId('progress-bar');
    expect(progressBar).toHaveStyle({ width: '0%' });
    
    // Update to show 50% progress
    rerender(
      <WizardProgress {...defaultProps} completedSteps={[0]} currentStep={1} />
    );
    
    expect(progressBar).toHaveStyle({ width: '33.33333333333333%' }); // 1/3 of the way
  });

  it('should show correct progress for all completed', () => {
    render(
      <WizardProgress
        {...defaultProps}
        completedSteps={[0, 1, 2, 3]}
        currentStep={3}
      />
    );
    
    const progressBar = screen.getByTestId('progress-bar');
    expect(progressBar).toHaveStyle({ width: '100%' });
  });

  it('should have proper styling for different step states', () => {
    render(
      <WizardProgress
        {...defaultProps}
        completedSteps={[0]}
        currentStep={1}
      />
    );
    
    // Check completed step has both border-primary and bg-primary classes
    const completedStepCircles = document.querySelectorAll('.border-primary.bg-primary');
    expect(completedStepCircles.length).toBe(1);
    
    // Check current step has border-primary but not bg-primary
    const currentStepCircles = document.querySelectorAll('.border-primary:not(.bg-primary)');
    expect(currentStepCircles.length).toBe(1);
    
    // Check future steps have border-muted
    const futureStepCircles = document.querySelectorAll('.border-muted');
    expect(futureStepCircles.length).toBe(2);
  });

  it('should render with no completed steps', () => {
    render(<WizardProgress {...defaultProps} />);
    
    // Should not have any check marks
    const checkIcons = document.querySelectorAll('.lucide-check');
    expect(checkIcons).toHaveLength(0);
  });

  it('should handle single step', () => {
    const singleStep: WizardStep[] = [
      { id: 'only', title: 'Only Step', component: () => null },
    ];
    
    render(
      <WizardProgress
        steps={singleStep}
        currentStep={0}
        completedSteps={[]}
        onStepClick={mockOnStepClick}
      />
    );
    
    expect(screen.getByText('Only Step')).toBeInTheDocument();
  });

  it('should apply correct text styles', () => {
    render(
      <WizardProgress {...defaultProps} completedSteps={[0]} currentStep={1} />
    );
    
    // Completed step text
    expect(screen.getByText('Basic Info')).toHaveClass('text-foreground');
    
    // Current step text
    expect(screen.getByText('Partner Selection')).toHaveClass('text-foreground');
    
    // Future step text
    expect(screen.getByText('Risk Assessment')).toHaveClass('text-muted-foreground');
  });
});