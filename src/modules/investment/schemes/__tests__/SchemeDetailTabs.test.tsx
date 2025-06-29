import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { SchemeDetailTabs } from '../SchemeDetailTabs';
import { 
  DevelopmentStage,
  PlanningStatus,
  UniversityType,
  type PBSAScheme, 
  type SchemeLocationInformation,
  type TargetUniversity,
  type SchemeSiteInformation
} from '@/lib/types/scheme.types';

// Mock the child components
jest.mock('../SchemeLocationMap', () => ({
  SchemeLocationMap: ({ location }: any) => (
    <div data-testid="scheme-location-map">
      Map for {location?.city}
    </div>
  )
}));

jest.mock('../SchemeFinancialChart', () => ({
  SchemeFinancialChart: ({ scheme }: any) => (
    <div data-testid="scheme-financial-chart">
      Financial chart for {scheme?.scheme_name}
    </div>
  )
}));

const mockScheme: PBSAScheme = {
  id: 'scheme-123',
  scheme_name: 'Test Student Housing',
  total_beds: 500,
  total_units: 100,
  beds_per_unit: 5,
  development_stage: DevelopmentStage.CONSTRUCTION,
  assessment_priority: 'high',
  total_development_cost_amount: 25000000,
  total_development_cost_currency: 'GBP',
  cost_per_bed: 50000,
  development_timeline_months: 24,
  construction_start_date: '2024-06-01',
  expected_completion_date: '2026-06-01',
  operational_start_date: '2026-09-01',
  is_active: true,
  created_at: '2024-01-01T00:00:00Z',
  updated_at: '2024-03-15T00:00:00Z'
};

const mockLocation: SchemeLocationInformation = {
  id: 'loc-123',
  scheme: 'scheme-123',
  address: '123 University Street',
  city: 'London',
  region: 'Greater London',
  country: 'United Kingdom',
  postcode: 'SW1A 1AA',
  location_type: 'city_center',
  latitude: 51.5074,
  longitude: -0.1278,
  nearest_train_station: 'King\'s Cross',
  train_station_distance_km: 0.8,
  airport_proximity: 'Heathrow Airport (45 min)',
  public_transport_rating: 4.5,
  total_student_population: 380000,
  competitive_schemes_nearby: 15,
  transport_accessibility_score: 92,
  local_market_description: 'Prime central London location with excellent transport links',
  created_at: '2024-01-01T00:00:00Z',
  updated_at: '2024-01-01T00:00:00Z'
};

const mockUniversities: TargetUniversity[] = [
  {
    id: 'uni-1',
    scheme: 'scheme-123',
    university_name: 'University College London',
    university_type: UniversityType.RESEARCH_UNIVERSITY,
    distance_to_campus_km: 0.8,
    proximity_score: 95,
    walking_time_minutes: 15,
    cycling_time_minutes: 5,
    public_transport_time_minutes: 10,
    total_student_population: 42000,
    international_student_pct: 55,
    postgraduate_student_pct: 48,
    university_provided_beds: 7500,
    estimated_demand_capture_pct: 8,
    target_student_segment: 'International postgraduate students',
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-01T00:00:00Z'
  }
];

const mockSite: SchemeSiteInformation = {
  id: 'site-123',
  scheme: 'scheme-123',
  site_area_value: 0.5,
  site_area_unit: 'hectares',
  site_area_sq_m: 5000,
  site_configuration: 'single_block',
  max_height_stories: 15,
  beds_per_hectare: 1000,
  topography: 'flat',
  ground_conditions: 'good',
  plot_ratio: 4.5,
  planning_status: PlanningStatus.APPROVED,
  planning_reference: 'REF/2024/001',
  planning_submission_date: '2023-06-01',
  planning_decision_date: '2024-01-15',
  planning_conditions: 'Subject to affordable housing contribution and transport improvements',
  contamination_risk: 'LOW',
  flood_risk: 'LOW',
  development_feasibility_score: 85,
  development_constraints: 'Height restrictions due to nearby heritage buildings',
  design_opportunities: 'Corner site allows for distinctive architectural treatment',
  environmental_considerations: 'Requires sustainable drainage system',
  infrastructure_upgrades_required: 'Minor electrical substation upgrade needed',
  created_at: '2024-01-01T00:00:00Z',
  updated_at: '2024-01-01T00:00:00Z'
};

describe('SchemeDetailTabs', () => {
  it('renders all tab options', () => {
    render(<SchemeDetailTabs scheme={mockScheme} />);
    
    expect(screen.getByRole('tab', { name: 'Overview' })).toBeInTheDocument();
    expect(screen.getByRole('tab', { name: 'Location' })).toBeInTheDocument();
    expect(screen.getByRole('tab', { name: 'Universities' })).toBeInTheDocument();
    expect(screen.getByRole('tab', { name: 'Site Info' })).toBeInTheDocument();
    expect(screen.getByRole('tab', { name: 'Economics' })).toBeInTheDocument();
    expect(screen.getByRole('tab', { name: 'Operations' })).toBeInTheDocument();
  });

  describe('Overview Tab', () => {
    it('displays development timeline correctly', () => {
      render(<SchemeDetailTabs scheme={mockScheme} />);
      
      expect(screen.getByText('Current Stage: Construction')).toBeInTheDocument();
      expect(screen.getByText('80%')).toBeInTheDocument(); // Construction progress
      expect(screen.getByText('Jun 1, 2024')).toBeInTheDocument(); // Construction start
      expect(screen.getByText('Jun 1, 2026')).toBeInTheDocument(); // Expected completion
      expect(screen.getByText('Sep 1, 2026')).toBeInTheDocument(); // Operational start
    });

    it('shows development timeline in months', () => {
      render(<SchemeDetailTabs scheme={mockScheme} />);
      
      expect(screen.getByText(/Total development timeline:/)).toBeInTheDocument();
      expect(screen.getByText('24 months')).toBeInTheDocument();
    });

    it('displays key metrics', () => {
      render(<SchemeDetailTabs scheme={mockScheme} />);
      
      expect(screen.getByText('500')).toBeInTheDocument(); // Total beds
      expect(screen.getByText('100')).toBeInTheDocument(); // Total units
      expect(screen.getByText('5.0')).toBeInTheDocument(); // Beds per unit
      expect(screen.getByText('HIGH')).toBeInTheDocument(); // Priority
    });

    it('handles missing optional data', () => {
      const minimalScheme = { ...mockScheme, total_units: undefined, beds_per_unit: undefined };
      render(<SchemeDetailTabs scheme={minimalScheme} />);
      
      expect(screen.getAllByText('N/A')).toHaveLength(2);
    });
  });

  describe('Location Tab', () => {
    it('displays location map when location data is provided', () => {
      render(<SchemeDetailTabs scheme={mockScheme} location={mockLocation} />);
      
      fireEvent.click(screen.getByRole('tab', { name: 'Location' }));
      
      expect(screen.getByTestId('scheme-location-map')).toBeInTheDocument();
      expect(screen.getByText('Map for London')).toBeInTheDocument();
    });

    it('shows location details', () => {
      render(<SchemeDetailTabs scheme={mockScheme} location={mockLocation} />);
      
      fireEvent.click(screen.getByRole('tab', { name: 'Location' }));
      
      expect(screen.getByText('123 University Street')).toBeInTheDocument();
      expect(screen.getByText(/London, Greater London/)).toBeInTheDocument();
      expect(screen.getByText(/United Kingdom SW1A 1AA/)).toBeInTheDocument();
    });

    it('displays transport information', () => {
      render(<SchemeDetailTabs scheme={mockScheme} location={mockLocation} />);
      
      fireEvent.click(screen.getByRole('tab', { name: 'Location' }));
      
      expect(screen.getByText("King's Cross")).toBeInTheDocument();
      expect(screen.getByText('(0.8 km)')).toBeInTheDocument();
      expect(screen.getByText('Heathrow Airport (45 min)')).toBeInTheDocument();
      expect(screen.getByText('4.5/5')).toBeInTheDocument(); // Transport rating
    });

    it('shows market information', () => {
      render(<SchemeDetailTabs scheme={mockScheme} location={mockLocation} />);
      
      fireEvent.click(screen.getByRole('tab', { name: 'Location' }));
      
      expect(screen.getByText('380,000')).toBeInTheDocument(); // Student population
      expect(screen.getByText('15')).toBeInTheDocument(); // Competitive schemes
      expect(screen.getByText('92')).toBeInTheDocument(); // Transport score
    });

    it('handles missing location data', () => {
      render(<SchemeDetailTabs scheme={mockScheme} />);
      
      fireEvent.click(screen.getByRole('tab', { name: 'Location' }));
      
      expect(screen.getByText('No location information available')).toBeInTheDocument();
    });
  });

  describe('Universities Tab', () => {
    it('displays university information', () => {
      render(<SchemeDetailTabs scheme={mockScheme} universities={mockUniversities} />);
      
      fireEvent.click(screen.getByRole('tab', { name: 'Universities' }));
      
      expect(screen.getByText('University College London')).toBeInTheDocument();
      expect(screen.getByText(/RESEARCH UNIVERSITY.*0.8 km from scheme/)).toBeInTheDocument();
      expect(screen.getByText('Proximity Score: 95')).toBeInTheDocument();
    });

    it('shows transport times to university', () => {
      render(<SchemeDetailTabs scheme={mockScheme} universities={mockUniversities} />);
      
      fireEvent.click(screen.getByRole('tab', { name: 'Universities' }));
      
      expect(screen.getByText('15 min')).toBeInTheDocument(); // Walking
      expect(screen.getByText('5 min')).toBeInTheDocument(); // Cycling
      expect(screen.getByText('10 min')).toBeInTheDocument(); // Public transport
    });

    it('displays student demographics', () => {
      render(<SchemeDetailTabs scheme={mockScheme} universities={mockUniversities} />);
      
      fireEvent.click(screen.getByRole('tab', { name: 'Universities' }));
      
      expect(screen.getByText('42,000')).toBeInTheDocument(); // Total students
      expect(screen.getByText('55%')).toBeInTheDocument(); // International students
      expect(screen.getByText('48%')).toBeInTheDocument(); // Postgraduate students
      expect(screen.getByText('8%')).toBeInTheDocument(); // Demand capture
    });

    it('shows target student segment', () => {
      render(<SchemeDetailTabs scheme={mockScheme} universities={mockUniversities} />);
      
      fireEvent.click(screen.getByRole('tab', { name: 'Universities' }));
      
      expect(screen.getByText('Target Segment:')).toBeInTheDocument();
      expect(screen.getByText('International postgraduate students')).toBeInTheDocument();
    });

    it('handles no universities', () => {
      render(<SchemeDetailTabs scheme={mockScheme} universities={[]} />);
      
      fireEvent.click(screen.getByRole('tab', { name: 'Universities' }));
      
      expect(screen.getByText('No target universities defined')).toBeInTheDocument();
    });
  });

  describe('Site Info Tab', () => {
    it('displays site characteristics', () => {
      render(<SchemeDetailTabs scheme={mockScheme} site={mockSite} />);
      
      fireEvent.click(screen.getByRole('tab', { name: 'Site Info' }));
      
      expect(screen.getByText('0.5 hectares')).toBeInTheDocument();
      expect(screen.getByText('(5,000 sq m)')).toBeInTheDocument();
      expect(screen.getByText('single block')).toBeInTheDocument();
      expect(screen.getByText('15 stories')).toBeInTheDocument();
      expect(screen.getByText('1000')).toBeInTheDocument(); // Beds per hectare
    });

    it('shows ground conditions and topography', () => {
      render(<SchemeDetailTabs scheme={mockScheme} site={mockSite} />);
      
      fireEvent.click(screen.getByRole('tab', { name: 'Site Info' }));
      
      expect(screen.getByText('flat')).toBeInTheDocument();
      expect(screen.getByText('good')).toBeInTheDocument();
      expect(screen.getByText('4.5')).toBeInTheDocument(); // Plot ratio
    });

    it('displays planning status', () => {
      render(<SchemeDetailTabs scheme={mockScheme} site={mockSite} />);
      
      fireEvent.click(screen.getByRole('tab', { name: 'Site Info' }));
      
      expect(screen.getByText('Approved')).toBeInTheDocument();
      expect(screen.getByText('REF/2024/001')).toBeInTheDocument();
      expect(screen.getByText('Jun 1, 2023')).toBeInTheDocument(); // Submission
      expect(screen.getByText('Jan 15, 2024')).toBeInTheDocument(); // Decision
    });

    it('shows planning conditions', () => {
      render(<SchemeDetailTabs scheme={mockScheme} site={mockSite} />);
      
      fireEvent.click(screen.getByRole('tab', { name: 'Site Info' }));
      
      expect(screen.getByText('Planning Conditions')).toBeInTheDocument();
      expect(screen.getByText(/affordable housing contribution/)).toBeInTheDocument();
    });

    it('displays risk assessments', () => {
      render(<SchemeDetailTabs scheme={mockScheme} site={mockSite} />);
      
      fireEvent.click(screen.getByRole('tab', { name: 'Site Info' }));
      
      // Check risk badges
      const lowBadges = screen.getAllByText('LOW');
      expect(lowBadges).toHaveLength(2); // Contamination and flood risk
      expect(screen.getByText('85/100')).toBeInTheDocument(); // Feasibility score
    });

    it('shows constraints and opportunities', () => {
      render(<SchemeDetailTabs scheme={mockScheme} site={mockSite} />);
      
      fireEvent.click(screen.getByRole('tab', { name: 'Site Info' }));
      
      expect(screen.getByText(/Height restrictions/)).toBeInTheDocument();
      expect(screen.getByText(/Corner site allows/)).toBeInTheDocument();
      expect(screen.getByText(/sustainable drainage/)).toBeInTheDocument();
    });

    it('handles missing site data', () => {
      render(<SchemeDetailTabs scheme={mockScheme} />);
      
      fireEvent.click(screen.getByRole('tab', { name: 'Site Info' }));
      
      expect(screen.getByText('No site information available')).toBeInTheDocument();
    });
  });

  describe('Economics Tab', () => {
    it('displays financial overview', () => {
      render(<SchemeDetailTabs scheme={mockScheme} />);
      
      fireEvent.click(screen.getByRole('tab', { name: 'Economics' }));
      
      expect(screen.getByText('£25,000,000')).toBeInTheDocument(); // Total cost
      expect(screen.getByText('£50,000')).toBeInTheDocument(); // Cost per bed
    });

    it('renders financial chart component', () => {
      render(<SchemeDetailTabs scheme={mockScheme} />);
      
      fireEvent.click(screen.getByRole('tab', { name: 'Economics' }));
      
      expect(screen.getByTestId('scheme-financial-chart')).toBeInTheDocument();
      expect(screen.getByText('Financial chart for Test Student Housing')).toBeInTheDocument();
    });
  });

  describe('Operations Tab', () => {
    it('displays operational status', () => {
      render(<SchemeDetailTabs scheme={mockScheme} />);
      
      fireEvent.click(screen.getByRole('tab', { name: 'Operations' }));
      
      expect(screen.getByText('Active')).toBeInTheDocument();
      expect(screen.getByText('Sep 1, 2026')).toBeInTheDocument(); // Operational since
    });

    it('shows assessment priority', () => {
      render(<SchemeDetailTabs scheme={mockScheme} />);
      
      fireEvent.click(screen.getByRole('tab', { name: 'Operations' }));
      
      expect(screen.getByText('HIGH PRIORITY')).toBeInTheDocument();
    });

    it('displays last updated date', () => {
      render(<SchemeDetailTabs scheme={mockScheme} />);
      
      fireEvent.click(screen.getByRole('tab', { name: 'Operations' }));
      
      expect(screen.getByText('Mar 15, 2024')).toBeInTheDocument();
    });

    it('handles inactive scheme', () => {
      const inactiveScheme = { ...mockScheme, is_active: false };
      render(<SchemeDetailTabs scheme={inactiveScheme} />);
      
      fireEvent.click(screen.getByRole('tab', { name: 'Operations' }));
      
      expect(screen.getByText('Inactive')).toBeInTheDocument();
    });
  });

  it('maintains tab state when switching', () => {
    render(<SchemeDetailTabs scheme={mockScheme} location={mockLocation} />);
    
    // Switch to location tab
    fireEvent.click(screen.getByRole('tab', { name: 'Location' }));
    expect(screen.getByText('Location Details')).toBeInTheDocument();
    
    // Switch to universities tab
    fireEvent.click(screen.getByRole('tab', { name: 'Universities' }));
    expect(screen.getByText('No target universities defined')).toBeInTheDocument();
    
    // Switch back to overview
    fireEvent.click(screen.getByRole('tab', { name: 'Overview' }));
    expect(screen.getByText('Development Timeline')).toBeInTheDocument();
  });

  it('handles all development stages correctly', () => {
    const stages = [
      { stage: DevelopmentStage.CONCEPT, expectedProgress: '10%' },
      { stage: DevelopmentStage.FEASIBILITY, expectedProgress: '25%' },
      { stage: DevelopmentStage.PLANNING, expectedProgress: '40%' },
      { stage: DevelopmentStage.OPERATIONAL, expectedProgress: '100%' },
    ];

    stages.forEach(({ stage, expectedProgress }) => {
      const { rerender } = render(
        <SchemeDetailTabs scheme={{ ...mockScheme, development_stage: stage }} />
      );
      
      expect(screen.getByText(expectedProgress)).toBeInTheDocument();
      
      rerender(<></>);
    });
  });

  it('applies correct badge variants for priorities', () => {
    const priorities = [
      { priority: 'high', expectedClass: 'destructive' },
      { priority: 'medium', expectedClass: 'default' },
      { priority: 'low', expectedClass: 'secondary' }
    ];

    priorities.forEach(({ priority }) => {
      const { rerender } = render(
        <SchemeDetailTabs 
          scheme={{ ...mockScheme, assessment_priority: priority as 'high' | 'medium' | 'low' }} 
        />
      );
      
      expect(screen.getByText(priority.toUpperCase())).toBeInTheDocument();
      
      rerender(<></>);
    });
  });
});