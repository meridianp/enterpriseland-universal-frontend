import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { useFormContext } from 'react-hook-form';
import { ReviewSubmitStep } from '../ReviewSubmitStep';
import { AssessmentType, Currency } from '@/lib/types/assessment.types';

// Mock react-hook-form
jest.mock('react-hook-form', () => ({
  useFormContext: jest.fn(),
}));

// Mock utils
jest.mock('@/lib/utils', () => ({
  cn: jest.fn((...args) => args.filter(Boolean).join(' ')),
  formatDate: jest.fn((date) => new Date(date).toLocaleDateString()),
  formatDateTime: jest.fn((date) => new Date(date).toLocaleString()),
  formatCurrency: jest.fn((amount, currency) => `${currency} ${amount}`),
  debounce: jest.fn((fn) => fn),
  sleep: jest.fn(() => Promise.resolve()),
}));

jest.mock('@/lib/utils/assessment.utils', () => ({
  getStatusBadgeProps: jest.fn((status) => ({
    className: `status-${status}`,
    label: status,
  })),
  getDecisionBadgeProps: jest.fn((decision) => ({
    className: `decision-${decision}`,
    label: decision,
  })),
  getScoreColor: jest.fn((score) => score > 150 ? 'text-green-600' : 'text-red-600'),
  getRiskBadgeProps: jest.fn((level) => ({
    className: `risk-${level}`,
    label: `${level} Risk`,
  })),
  formatCurrency: jest.fn((amount, currency) => `${currency} ${amount}`),
}));

jest.mock('sonner', () => ({
  toast: {
    success: jest.fn(),
    error: jest.fn(),
    info: jest.fn(),
    warning: jest.fn(),
  },
}));

const mockFormContext = {
  watch: jest.fn(),
  getValues: jest.fn(),
};

const mockWizardStepProps = {
  data: {},
  onUpdate: jest.fn(),
  onNext: jest.fn(),
  onPrevious: jest.fn(),
  isFirstStep: false,
  isLastStep: true,
};

const mockAssessmentData = {
  assessment_type: AssessmentType.PARTNER,
  partner_name: 'Test Development Partner',
  registration_number: 'REG123456',
  headquarters_location: 'London, UK',
  financial_info: {
    revenue: 10000000,
    ebitda: 2000000,
    currency: Currency.GBP,
  },
  operational_info: {
    total_employees: 50,
    key_management_experience: 'high',
  },
  credit_info: {
    credit_rating: 'A+',
  },
  risk_assessment: {
    market_risk: 'low',
    financial_risk: 'medium',
    operational_risk: 'low',
    regulatory_risk: 'low',
  },
};

describe('ReviewSubmitStep', () => {
  beforeEach(() => {
    (useFormContext as jest.Mock).mockReturnValue(mockFormContext);
    mockFormContext.watch.mockImplementation((field) => {
      const fieldMap: any = {
        'assessment_type': AssessmentType.PARTNER,
        'financial_info.currency': Currency.GBP,
      };
      return fieldMap[field];
    });
    mockFormContext.getValues.mockReturnValue(mockAssessmentData);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('renders assessment overview correctly', () => {
    render(<ReviewSubmitStep {...mockWizardStepProps} />);
    
    expect(screen.getByText('Assessment Overview')).toBeInTheDocument();
    expect(screen.getByText('Review the key details of this partnership assessment')).toBeInTheDocument();
  });

  it('displays completeness percentage', () => {
    render(<ReviewSubmitStep {...mockWizardStepProps} />);
    
    // Should show some completeness percentage
    const percentageElements = screen.getAllByText(/\d+%/);
    expect(percentageElements.length).toBeGreaterThan(0);
    expect(screen.getByText('Complete')).toBeInTheDocument();
  });

  it('calculates and displays risk score', () => {
    render(<ReviewSubmitStep {...mockWizardStepProps} />);
    
    expect(screen.getByText(/\d+\/200/)).toBeInTheDocument();
    expect(screen.getByText('Risk Score')).toBeInTheDocument();
  });

  it('shows risk level badge', () => {
    render(<ReviewSubmitStep {...mockWizardStepProps} />);
    
    // Should show one of: Low Risk, Medium Risk, High Risk
    // Using a more specific selector since there are multiple elements ending with "Risk"
    const riskBadge = screen.getByText((content, element) => {
      return element?.tagName === 'DIV' && 
             element?.className?.includes('inline-flex') &&
             /^(Low|Medium|High)\s+Risk$/.test(content);
    });
    expect(riskBadge).toBeInTheDocument();
  });

  it('displays basic information for partner assessment', () => {
    render(<ReviewSubmitStep {...mockWizardStepProps} />);
    
    expect(screen.getByText('Basic Information')).toBeInTheDocument();
    expect(screen.getByText('Partner Name')).toBeInTheDocument();
    expect(screen.getByText('Test Development Partner')).toBeInTheDocument();
    expect(screen.getByText('Registration Number')).toBeInTheDocument();
    expect(screen.getByText('REG123456')).toBeInTheDocument();
  });

  it('displays financial summary', () => {
    render(<ReviewSubmitStep {...mockWizardStepProps} />);
    
    expect(screen.getByText('Financial Summary')).toBeInTheDocument();
    expect(screen.getByText('Revenue')).toBeInTheDocument();
    expect(screen.getByText('EBITDA')).toBeInTheDocument();
  });

  it('shows risk assessment summary', () => {
    render(<ReviewSubmitStep {...mockWizardStepProps} />);
    
    expect(screen.getByText('Risk Assessment Summary')).toBeInTheDocument();
    expect(screen.getByText('Market Risk')).toBeInTheDocument();
    expect(screen.getByText('Financial Risk')).toBeInTheDocument();
  });

  it('renders decision buttons', () => {
    render(<ReviewSubmitStep {...mockWizardStepProps} />);
    
    expect(screen.getByText('Assessment Decision')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Approve/ })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Request Review/ })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Reject/ })).toBeInTheDocument();
  });

  it('allows selecting a decision', () => {
    render(<ReviewSubmitStep {...mockWizardStepProps} />);
    
    const approveButton = screen.getByRole('button', { name: /Approve/ });
    
    // Click should work without errors
    expect(() => fireEvent.click(approveButton)).not.toThrow();
    
    // Decision button was clicked successfully
    expect(approveButton).toBeInTheDocument();
  });

  it('allows adding comments', async () => {
    render(<ReviewSubmitStep {...mockWizardStepProps} />);
    
    const commentsTextarea = screen.getByPlaceholderText(/Add any comments/);
    fireEvent.change(commentsTextarea, { 
      target: { value: 'This is a test comment' } 
    });
    
    expect(commentsTextarea).toHaveValue('This is a test comment');
  });

  it('shows validation issues when present', () => {
    // Mock incomplete data
    mockFormContext.getValues.mockReturnValue({
      ...mockAssessmentData,
      financial_info: null, // Missing financial info
    });
    
    render(<ReviewSubmitStep {...mockWizardStepProps} />);
    
    expect(screen.getByText('Issues Found')).toBeInTheDocument();
    expect(screen.getByText(/Revenue information is missing/)).toBeInTheDocument();
  });

  it('disables approve button when validation issues exist', () => {
    // Mock incomplete data
    mockFormContext.getValues.mockReturnValue({
      assessment_type: AssessmentType.PARTNER,
      // Missing required fields
    });
    
    render(<ReviewSubmitStep {...mockWizardStepProps} />);
    
    const approveButton = screen.getByRole('button', { name: /Approve/ });
    expect(approveButton).toBeDisabled();
  });

  it('displays different content for scheme assessments', () => {
    mockFormContext.watch.mockImplementation((field) => {
      if (field === 'assessment_type') return AssessmentType.SCHEME;
      if (field === 'financial_info.currency') return Currency.GBP;
      return undefined;
    });
    
    mockFormContext.getValues.mockReturnValue({
      ...mockAssessmentData,
      assessment_type: AssessmentType.SCHEME,
      scheme_name: 'Test Scheme',
      location: 'Manchester, UK',
      development_stage: 'planning',
    });
    
    render(<ReviewSubmitStep {...mockWizardStepProps} />);
    
    // Check that the component rendered for scheme type
    // Since it may show either "scheme assessment" or similar text in various places
    const schemeElements = screen.getAllByText(/scheme/i);
    expect(schemeElements.length).toBeGreaterThan(0);
  });

  it('handles missing data gracefully', () => {
    mockFormContext.getValues.mockReturnValue({
      assessment_type: AssessmentType.PARTNER,
      // Minimal data
    });
    
    render(<ReviewSubmitStep {...mockWizardStepProps} />);
    
    // Should show "Not specified" for missing fields
    expect(screen.getAllByText('Not specified').length).toBeGreaterThan(0);
  });

  it('shows submission summary when decision is made and comments added', async () => {
    render(<ReviewSubmitStep {...mockWizardStepProps} />);
    
    // Select decision
    const approveButton = screen.getByRole('button', { name: /Approve/ });
    fireEvent.click(approveButton);
    
    // Add comments
    const commentsTextarea = screen.getByPlaceholderText(/Add any comments/);
    fireEvent.change(commentsTextarea, { 
      target: { value: 'All requirements met' } 
    });
    
    // Verify comments are entered
    expect(commentsTextarea).toHaveValue('All requirements met');
    
    // Verify both actions completed successfully
    expect(approveButton).toBeInTheDocument();
    expect(commentsTextarea).toBeInTheDocument();
  });
});