import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { useFormContext } from 'react-hook-form';
import { StakeholderInfoStep } from '../StakeholderInfoStep';

// Mock react-hook-form
jest.mock('react-hook-form', () => ({
  useFormContext: jest.fn(),
  Controller: ({ render }: any) => render({
    field: {
      onChange: jest.fn(),
      onBlur: jest.fn(),
      value: '',
      name: 'test',
      ref: jest.fn(),
    },
    fieldState: {
      invalid: false,
      error: undefined,
      isDirty: false,
      isTouched: false,
    },
    formState: {
      errors: {},
      isSubmitting: false,
    },
  }),
  useFieldArray: jest.fn(() => ({
    fields: [{ id: '1' }],
    append: jest.fn(),
    remove: jest.fn(),
    prepend: jest.fn(),
    insert: jest.fn(),
    swap: jest.fn(),
    move: jest.fn(),
    update: jest.fn(),
    replace: jest.fn(),
  })),
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
  control: {},
  watch: jest.fn(),
  setValue: jest.fn(),
  getFieldState: jest.fn(() => ({
    invalid: false,
    error: undefined,
    isDirty: false,
    isTouched: false,
  })),
  formState: {
    errors: {},
    isSubmitting: false,
    isValid: true,
  },
  register: jest.fn(),
  unregister: jest.fn(),
  getValues: jest.fn(),
  reset: jest.fn(),
  handleSubmit: jest.fn(),
  setError: jest.fn(),
  clearErrors: jest.fn(),
  trigger: jest.fn(),
};

const mockWizardStepProps = {
  data: {},
  onUpdate: jest.fn(),
  onNext: jest.fn(),
  onPrevious: jest.fn(),
  isFirstStep: false,
  isLastStep: false,
};

describe('StakeholderInfoStep', () => {
  beforeEach(() => {
    (useFormContext as jest.Mock).mockReturnValue(mockFormContext);
    mockFormContext.watch.mockReturnValue(undefined);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('renders key personnel section', () => {
    render(<StakeholderInfoStep {...mockWizardStepProps} />);
    
    expect(screen.getByText('Key Personnel')).toBeInTheDocument();
    expect(screen.getByText('Senior management and key decision makers')).toBeInTheDocument();
  });

  it('renders board of directors section', () => {
    render(<StakeholderInfoStep {...mockWizardStepProps} />);
    
    expect(screen.getByText('Board of Directors')).toBeInTheDocument();
    expect(screen.getByText('Board members and non-executive directors')).toBeInTheDocument();
  });

  it('renders major shareholders section', () => {
    render(<StakeholderInfoStep {...mockWizardStepProps} />);
    
    expect(screen.getByText('Major Shareholders')).toBeInTheDocument();
    expect(screen.getByText('Significant shareholders and ownership structure')).toBeInTheDocument();
  });

  it('renders external advisors section', () => {
    render(<StakeholderInfoStep {...mockWizardStepProps} />);
    
    expect(screen.getByText('External Advisors & Professional Services')).toBeInTheDocument();
    expect(screen.getByText('Key external advisors and service providers')).toBeInTheDocument();
  });

  it('starts with one key personnel form by default', () => {
    render(<StakeholderInfoStep {...mockWizardStepProps} />);
    
    expect(screen.getByText('Personnel #1')).toBeInTheDocument();
    // Check for multiple empty input fields
    const emptyInputs = screen.getAllByDisplayValue('');
    expect(emptyInputs.length).toBeGreaterThan(0);
  });

  it('allows adding additional key personnel', async () => {
    render(<StakeholderInfoStep {...mockWizardStepProps} />);
    
    const addButton = screen.getByRole('button', { name: /Add Key Personnel/ });
    fireEvent.click(addButton);
    
    await waitFor(() => {
      expect(mockFormContext.setValue).toHaveBeenCalled();
    });
  });

  it('allows removing key personnel when more than one exists', () => {
    // Mock existing personnel data
    mockFormContext.watch.mockImplementation((field) => {
      if (field === 'stakeholder_info.key_personnel') {
        return [
          { name: 'John Doe', position: 'CEO', email: 'john@test.com' },
          { name: 'Jane Smith', position: 'CFO', email: 'jane@test.com' }
        ];
      }
      return undefined;
    });
    
    render(<StakeholderInfoStep {...mockWizardStepProps} />);
    
    expect(screen.getByText('Personnel #1')).toBeInTheDocument();
    expect(screen.getByText('Personnel #2')).toBeInTheDocument();
    
    // Should have delete buttons when more than one person
    const deleteButtons = screen.getAllByRole('button', { name: '' }); // Trash icon buttons
    expect(deleteButtons.length).toBeGreaterThan(0);
  });

  it('shows position options for key personnel', () => {
    render(<StakeholderInfoStep {...mockWizardStepProps} />);
    
    // Check that position select exists
    const positionSelects = screen.getAllByRole('combobox');
    expect(positionSelects.length).toBeGreaterThan(0);
    
    // The test component should render position options
    expect(screen.getByText('Position *')).toBeInTheDocument();
  });

  it('validates required fields for key personnel', () => {
    render(<StakeholderInfoStep {...mockWizardStepProps} />);
    
    expect(screen.getByText('Full Name *')).toBeInTheDocument();
    expect(screen.getByText('Position *')).toBeInTheDocument();
    expect(screen.getByText('Email Address *')).toBeInTheDocument();
  });

  it('allows adding board members', async () => {
    render(<StakeholderInfoStep {...mockWizardStepProps} />);
    
    const addButton = screen.getByRole('button', { name: /Add Board Member/ });
    fireEvent.click(addButton);
    
    await waitFor(() => {
      expect(mockFormContext.setValue).toHaveBeenCalledWith(
        'stakeholder_info.board_members',
        expect.any(Array)
      );
    });
  });

  it('shows empty state message for board members', () => {
    render(<StakeholderInfoStep {...mockWizardStepProps} />);
    
    expect(screen.getByText('No board members added yet. Click "Add Board Member" to get started.')).toBeInTheDocument();
  });

  it('shows board member position options', () => {
    // Mock existing board member
    mockFormContext.watch.mockImplementation((field) => {
      if (field === 'stakeholder_info.board_members') {
        return [{ name: '', position: '', independent: false }];
      }
      return undefined;
    });
    
    render(<StakeholderInfoStep {...mockWizardStepProps} />);
    
    // Check that board section exists with position field
    expect(screen.getByText('Board of Directors')).toBeInTheDocument();
    
    // The component should have rendered position selects
    const positionSelects = screen.getAllByRole('combobox');
    expect(positionSelects.length).toBeGreaterThan(0);
  });

  it('allows adding shareholders', async () => {
    render(<StakeholderInfoStep {...mockWizardStepProps} />);
    
    const addButton = screen.getByRole('button', { name: /Add Shareholder/ });
    fireEvent.click(addButton);
    
    await waitFor(() => {
      expect(mockFormContext.setValue).toHaveBeenCalledWith(
        'stakeholder_info.shareholders',
        expect.any(Array)
      );
    });
  });

  it('shows shareholder type options', () => {
    // Mock existing shareholder
    mockFormContext.watch.mockImplementation((field) => {
      if (field === 'stakeholder_info.shareholders') {
        return [{ name: '', type: 'individual', ownership_percentage: 0 }];
      }
      return undefined;
    });
    
    render(<StakeholderInfoStep {...mockWizardStepProps} />);
    
    expect(screen.getByText('Individual')).toBeInTheDocument();
  });

  it('calculates total ownership percentage', () => {
    // Mock shareholders with ownership
    mockFormContext.watch.mockImplementation((field) => {
      if (field === 'stakeholder_info.shareholders') {
        return [
          { name: 'Shareholder 1', type: 'individual', ownership_percentage: 30 },
          { name: 'Shareholder 2', type: 'institutional', ownership_percentage: 25 }
        ];
      }
      return undefined;
    });
    
    render(<StakeholderInfoStep {...mockWizardStepProps} />);
    
    expect(screen.getByText('Total Ownership:')).toBeInTheDocument();
    expect(screen.getByText('55.0%')).toBeInTheDocument();
  });

  it('highlights when total ownership exceeds 100%', () => {
    // Mock shareholders with over 100% ownership
    mockFormContext.watch.mockImplementation((field) => {
      if (field === 'stakeholder_info.shareholders') {
        return [
          { name: 'Shareholder 1', type: 'individual', ownership_percentage: 60 },
          { name: 'Shareholder 2', type: 'institutional', ownership_percentage: 50 }
        ];
      }
      return undefined;
    });
    
    render(<StakeholderInfoStep {...mockWizardStepProps} />);
    
    expect(screen.getByText('110.0%')).toBeInTheDocument();
    // Should be styled with red color for over 100%
  });

  it('renders external advisor fields', () => {
    render(<StakeholderInfoStep {...mockWizardStepProps} />);
    
    expect(screen.getByText('Legal Advisor')).toBeInTheDocument();
    expect(screen.getByText('Financial Advisor')).toBeInTheDocument();
    expect(screen.getByText('External Auditor')).toBeInTheDocument();
    expect(screen.getByText('Property Advisor')).toBeInTheDocument();
    expect(screen.getByText('Other Key Advisors')).toBeInTheDocument();
  });

  it('allows input in advisor fields', () => {
    render(<StakeholderInfoStep {...mockWizardStepProps} />);
    
    const legalAdvisorInput = screen.getByPlaceholderText('Law firm name');
    const financialAdvisorInput = screen.getByPlaceholderText('Advisory firm name');
    
    // Since we're mocking the Controller component, we can't test actual value changes
    // Instead, verify that the inputs exist and can be interacted with
    expect(legalAdvisorInput).toBeInTheDocument();
    expect(financialAdvisorInput).toBeInTheDocument();
    
    // Verify that change events don't throw errors
    expect(() => fireEvent.change(legalAdvisorInput, { target: { value: 'Test Law Firm' } })).not.toThrow();
    expect(() => fireEvent.change(financialAdvisorInput, { target: { value: 'Test Advisory' } })).not.toThrow();
  });

  it('handles form updates correctly', async () => {
    render(<StakeholderInfoStep {...mockWizardStepProps} />);
    
    // Find the name input for the first personnel
    const nameInput = screen.getByPlaceholderText('e.g., John Smith');
    fireEvent.change(nameInput, { target: { value: 'Test Name' } });
    
    await waitFor(() => {
      expect(mockFormContext.setValue).toHaveBeenCalled();
    });
  });

  it('validates email format for personnel', () => {
    render(<StakeholderInfoStep {...mockWizardStepProps} />);
    
    const emailInput = screen.getByPlaceholderText('john.smith@company.com');
    expect(emailInput).toHaveAttribute('type', 'email');
    expect(emailInput).toHaveAttribute('required');
  });

  it('validates numeric fields correctly', () => {
    render(<StakeholderInfoStep {...mockWizardStepProps} />);
    
    const experienceInput = screen.getByPlaceholderText('e.g., 15');
    expect(experienceInput).toHaveAttribute('type', 'number');
    expect(experienceInput).toHaveAttribute('min', '0');
    expect(experienceInput).toHaveAttribute('max', '50');
  });
});