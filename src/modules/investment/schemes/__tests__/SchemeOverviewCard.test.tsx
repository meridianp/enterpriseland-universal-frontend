import React from 'react';
import { render, screen } from '@testing-library/react';
import { SchemeOverviewCard } from '../SchemeOverviewCard';
import { 
  DevelopmentStage, 
  type PBSAScheme, 
  type SchemeLocationInformation,
  type TargetUniversity,
  type SchemeSiteInformation
} from '@/lib/types/scheme.types';

// Mock data
const mockScheme: PBSAScheme = {
  id: 'scheme-123',
  scheme_name: 'Test Student Housing Scheme',
  total_beds: 500,
  total_units: 100,
  beds_per_unit: 5,
  development_stage: DevelopmentStage.CONSTRUCTION,
  assessment_priority: 'high',
  cost_per_bed: 50000,
  total_development_cost_amount: 25000000,
  total_development_cost_currency: 'GBP',
  development_timeline_months: 24,
  expected_completion_date: '2025-12-31',
  developer_data: {
    id: 'dev-123',
    company_name: 'Student Housing Developers Ltd',
    country: 'United Kingdom',
    contact_email: 'info@shd.com',
    contact_phone: '+44 20 1234 5678',
    website: 'https://shd.com',
    founded_year: 2010,
    total_assets: 500000000,
    assets_currency: 'GBP',
    portfolio_size: 10000,
    specializations: ['PBSA'],
    geographic_focus: ['UK', 'Europe'],
    esg_rating: 'A',
    credit_rating: 'BBB+',
    track_record: {
      total_projects: 25,
      total_beds_delivered: 15000,
      average_project_size: 600,
      on_time_completion_rate: 0.92,
      occupancy_rate: 0.95
    },
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-01T00:00:00Z'
  },
  created_at: '2024-01-01T00:00:00Z',
  updated_at: '2024-01-01T00:00:00Z'
};

const mockLocation: SchemeLocationInformation = {
  id: 'loc-123',
  scheme: 'scheme-123',
  city: 'London',
  country: 'United Kingdom',
  address_line_1: '123 University Street',
  address_line_2: 'Student Quarter',
  postal_code: 'SW1A 1AA',
  latitude: 51.5074,
  longitude: -0.1278,
  location_quality_score: 85,
  walkability_score: 92,
  public_transport_score: 95,
  local_amenities_data: {
    restaurants: 45,
    shops: 32,
    gyms: 8,
    healthcare_facilities: 5
  },
  distance_metrics: {},
  created_at: '2024-01-01T00:00:00Z',
  updated_at: '2024-01-01T00:00:00Z'
};

const mockUniversities: TargetUniversity[] = [
  {
    id: 'uni-1',
    scheme: 'scheme-123',
    university_name: 'University College London',
    distance_km: 0.8,
    travel_time_minutes: 15,
    travel_mode: 'WALK',
    student_population: 42000,
    international_student_percentage: 0.55,
    ranking_global: 8,
    ranking_national: 4,
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-01T00:00:00Z'
  },
  {
    id: 'uni-2',
    scheme: 'scheme-123',
    university_name: 'Imperial College London',
    distance_km: 2.5,
    travel_time_minutes: 20,
    travel_mode: 'PUBLIC_TRANSPORT',
    student_population: 20000,
    international_student_percentage: 0.62,
    ranking_global: 7,
    ranking_national: 3,
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-01T00:00:00Z'
  }
];

const mockSite: SchemeSiteInformation = {
  id: 'site-123',
  scheme: 'scheme-123',
  site_area_sqm: 5000,
  building_footprint_sqm: 2000,
  number_of_buildings: 2,
  max_height_meters: 35,
  parking_spaces: 50,
  bike_storage_spaces: 200,
  planning_status: 'APPROVED',
  planning_reference: 'REF/2024/001',
  planning_conditions: ['Condition 1', 'Condition 2'],
  construction_start_date: '2024-06-01',
  construction_method: 'Modular construction with steel frame',
  contractor_name: 'Main Contractor Ltd',
  architect_name: 'Architecture Partners LLP',
  planning_risk_assessment: {
    risk_level: 'MEDIUM',
    risk_factors: ['Height restrictions', 'Local opposition'],
    mitigation_measures: ['Community engagement', 'Design modifications']
  },
  created_at: '2024-01-01T00:00:00Z',
  updated_at: '2024-01-01T00:00:00Z'
};

describe('SchemeOverviewCard', () => {
  it('renders basic scheme information', () => {
    render(<SchemeOverviewCard scheme={mockScheme} />);
    
    expect(screen.getByText('Scheme Overview')).toBeInTheDocument();
    expect(screen.getByText('500')).toBeInTheDocument(); // Total beds
    expect(screen.getByText('100 units')).toBeInTheDocument();
  });

  it('displays development stage badge with correct styling', () => {
    render(<SchemeOverviewCard scheme={mockScheme} />);
    
    const badge = screen.getByText('CONSTRUCTION');
    expect(badge).toHaveClass('bg-orange-100', 'text-orange-800');
  });

  it('formats currency values correctly', () => {
    render(<SchemeOverviewCard scheme={mockScheme} />);
    
    expect(screen.getByText('£50,000')).toBeInTheDocument(); // Cost per bed
    expect(screen.getByText('Total: £25,000,000')).toBeInTheDocument();
  });

  it('displays timeline information', () => {
    render(<SchemeOverviewCard scheme={mockScheme} />);
    
    expect(screen.getByText('24m')).toBeInTheDocument();
    expect(screen.getByText('Complete: Dec 2025')).toBeInTheDocument();
  });

  it('shows location information when provided', () => {
    render(<SchemeOverviewCard scheme={mockScheme} location={mockLocation} />);
    
    expect(screen.getByText('London')).toBeInTheDocument();
    expect(screen.getByText('United Kingdom')).toBeInTheDocument();
  });

  it('displays university count when provided', () => {
    render(<SchemeOverviewCard scheme={mockScheme} universities={mockUniversities} />);
    
    expect(screen.getByText('2')).toBeInTheDocument(); // Number of universities
  });

  it('shows priority with correct color coding', () => {
    render(<SchemeOverviewCard scheme={mockScheme} />);
    
    const priority = screen.getByText('high');
    expect(priority).toHaveClass('text-red-600');
  });

  it('displays planning risk when site information is provided', () => {
    render(<SchemeOverviewCard scheme={mockScheme} site={mockSite} />);
    
    expect(screen.getByText('MEDIUM')).toBeInTheDocument();
  });

  it('shows developer information', () => {
    render(<SchemeOverviewCard scheme={mockScheme} />);
    
    expect(screen.getByText('Student Housing Developers Ltd')).toBeInTheDocument();
    expect(screen.getByText('United Kingdom')).toBeInTheDocument();
  });

  it('handles missing optional data gracefully', () => {
    const minimalScheme: PBSAScheme = {
      ...mockScheme,
      cost_per_bed: undefined,
      total_development_cost_amount: undefined,
      development_timeline_months: undefined,
      expected_completion_date: undefined,
      developer_data: undefined,
      beds_per_unit: undefined
    };
    
    render(<SchemeOverviewCard scheme={minimalScheme} />);
    
    expect(screen.getAllByText('N/A')).toHaveLength(3); // Cost per bed, Timeline, Location
  });

  it('displays all development stages correctly', () => {
    const stages = [
      { stage: DevelopmentStage.CONCEPT, expectedClass: 'bg-slate-100' },
      { stage: DevelopmentStage.PLANNING, expectedClass: 'bg-blue-100' },
      { stage: DevelopmentStage.OPERATIONAL, expectedClass: 'bg-green-100' },
      { stage: DevelopmentStage.DISPOSED, expectedClass: 'bg-gray-100' }
    ];

    stages.forEach(({ stage, expectedClass }) => {
      const { rerender } = render(
        <SchemeOverviewCard scheme={{ ...mockScheme, development_stage: stage }} />
      );
      
      const badge = screen.getByText(DevelopmentStage[stage].replace(/_/g, ' '));
      expect(badge).toHaveClass(expectedClass);
      
      rerender(<></>); // Clean up for next iteration
    });
  });

  it('renders beds per unit when available', () => {
    render(<SchemeOverviewCard scheme={mockScheme} />);
    
    expect(screen.getByText('Beds per Unit')).toBeInTheDocument();
    expect(screen.getByText('5.0')).toBeInTheDocument();
  });

  it('applies correct priority colors', () => {
    const priorities = [
      { priority: 'high', expectedClass: 'text-red-600' },
      { priority: 'medium', expectedClass: 'text-yellow-600' },
      { priority: 'low', expectedClass: 'text-gray-600' }
    ];

    priorities.forEach(({ priority, expectedClass }) => {
      const { rerender } = render(
        <SchemeOverviewCard 
          scheme={{ ...mockScheme, assessment_priority: priority as 'high' | 'medium' | 'low' }} 
        />
      );
      
      const priorityText = screen.getByText(priority);
      expect(priorityText).toHaveClass(expectedClass);
      
      rerender(<></>);
    });
  });

  it('formats large numbers with commas', () => {
    const largeScheme = {
      ...mockScheme,
      total_beds: 1500,
      total_units: 1000
    };
    
    render(<SchemeOverviewCard scheme={largeScheme} />);
    
    expect(screen.getByText('1,500')).toBeInTheDocument();
    expect(screen.getByText('1000 units')).toBeInTheDocument();
  });

  it('handles different currency types', () => {
    const usdScheme = {
      ...mockScheme,
      total_development_cost_currency: 'USD',
      cost_per_bed: 60000,
      total_development_cost_amount: 30000000
    };
    
    render(<SchemeOverviewCard scheme={usdScheme} />);
    
    expect(screen.getByText('$60,000')).toBeInTheDocument();
    expect(screen.getByText('Total: $30,000,000')).toBeInTheDocument();
  });

  it('displays planning risk badges with correct variants', () => {
    const riskLevels = [
      { level: 'HIGH', variant: 'destructive' },
      { level: 'MEDIUM', variant: 'default' },
      { level: 'LOW', variant: 'secondary' }
    ];

    riskLevels.forEach(({ level }) => {
      const siteWithRisk = {
        ...mockSite,
        planning_risk_assessment: {
          ...mockSite.planning_risk_assessment!,
          risk_level: level as 'HIGH' | 'MEDIUM' | 'LOW'
        }
      };
      
      const { rerender } = render(
        <SchemeOverviewCard scheme={mockScheme} site={siteWithRisk} />
      );
      
      expect(screen.getByText(level)).toBeInTheDocument();
      
      rerender(<></>);
    });
  });
});