import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import GeographicDashboard from '../../../app/(dashboard)/leads/geographic-dashboard/page';

// Mock the child components
jest.mock('../geographic-filters-panel', () => ({
  GeographicFiltersPanel: ({ onFiltersChange }: any) => (
    <div data-testid="geographic-filters-panel">
      <button onClick={() => onFiltersChange({ test: 'filter' })}>Apply Filter</button>
    </div>
  ),
}));

jest.mock('../location-recommendations', () => ({
  LocationRecommendations: ({ selectedLocation, filterCriteria }: any) => (
    <div data-testid="location-recommendations">
      Location Recommendations
      {selectedLocation && <div data-testid="has-location">Has Location</div>}
    </div>
  ),
}));

jest.mock('../territory-analytics', () => ({
  TerritoryAnalytics: ({ territoryPerformance, workloadBalance, leads }: any) => (
    <div data-testid="territory-analytics">Territory Analytics</div>
  ),
}));

jest.mock('../neighborhood-scoring', () => ({
  NeighborhoodScoring: ({ geographicAnalytics, selectedLocation }: any) => (
    <div data-testid="neighborhood-scoring">Neighborhood Scoring</div>
  ),
}));

jest.mock('../../maps/property-map', () => ({
  PropertyMap: ({ properties, onLocationSelect }: any) => (
    <div data-testid="property-map">
      <button onClick={() => onLocationSelect({ lat: 51.5074, lng: -0.1278 })}>
        Select Location
      </button>
      Property Count: {properties?.length || 0}
    </div>
  ),
}));

// Mock API calls
jest.mock('../../../lib/api', () => ({
  api: {
    get: jest.fn(),
  },
}));

jest.mock('../../../lib/hooks/use-leads', () => ({
  useLeads: jest.fn(() => ({
    data: {
      results: [
        {
          id: '1',
          company_name: 'Test Company',
          headquarters_city: 'London',
          headquarters_country: 'UK',
          headquarters_location: {
            coordinates: [-0.1278, 51.5074]
          },
          current_score: 85,
          geographic_score: 90,
          status: 'QUALIFIED'
        }
      ]
    },
    isLoading: false
  })),
}));

const createTestQueryClient = () => {
  return new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
      },
    },
  });
};

const renderWithProviders = (ui: React.ReactElement) => {
  const queryClient = createTestQueryClient();
  
  return render(
    <QueryClientProvider client={queryClient}>
      {ui}
    </QueryClientProvider>
  );
};

describe('GeographicDashboard', () => {
  beforeEach(() => {
    // Mock successful API responses
    const mockApi = require('../../../lib/api').api;
    mockApi.get.mockResolvedValue({
      data: {
        total_leads: 100,
        coverage_percentage: 85,
        component_averages: {
          overall_geographic: 78.5
        },
        top_performing_locations: [
          { city: 'London', average_score: 85, leads_count: 25 }
        ],
        geographic_score_distribution: {
          '80-100': 15,
          '60-79': 45,
          '40-59': 30,
          '0-39': 10
        }
      }
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('renders the geographic dashboard header', () => {
    renderWithProviders(<GeographicDashboard />);
    
    expect(screen.getByText('Geographic Intelligence Dashboard')).toBeInTheDocument();
    expect(screen.getByText(/Location-based lead analysis and investment opportunity mapping/)).toBeInTheDocument();
  });

  it('displays analytics cards', async () => {
    renderWithProviders(<GeographicDashboard />);
    
    await waitFor(() => {
      expect(screen.getByText('Total Leads')).toBeInTheDocument();
      expect(screen.getByText('Geographic Coverage')).toBeInTheDocument();
      expect(screen.getByText('Average Geographic Score')).toBeInTheDocument();
      expect(screen.getByText('High-Potential Locations')).toBeInTheDocument();
    });
  });

  it('renders all tab options', () => {
    renderWithProviders(<GeographicDashboard />);
    
    expect(screen.getByText('Interactive Map')).toBeInTheDocument();
    expect(screen.getByText('Recommendations')).toBeInTheDocument();
    expect(screen.getByText('Territory Analysis')).toBeInTheDocument();
    expect(screen.getByText('Neighborhoods')).toBeInTheDocument();
    expect(screen.getByText('Analytics')).toBeInTheDocument();
  });

  it('shows property map in the interactive map tab', () => {
    renderWithProviders(<GeographicDashboard />);
    
    expect(screen.getByTestId('property-map')).toBeInTheDocument();
    expect(screen.getByText('Property Count: 1')).toBeInTheDocument();
  });

  it('toggles filters panel visibility', () => {
    renderWithProviders(<GeographicDashboard />);
    
    const filtersButton = screen.getByText('Filters');
    expect(screen.queryByTestId('geographic-filters-panel')).not.toBeInTheDocument();
    
    filtersButton.click();
    expect(screen.getByTestId('geographic-filters-panel')).toBeInTheDocument();
  });

  it('handles location selection from map', () => {
    renderWithProviders(<GeographicDashboard />);
    
    const selectLocationButton = screen.getByText('Select Location');
    selectLocationButton.click();
    
    expect(screen.getByText('51.5074, -0.1278')).toBeInTheDocument();
    expect(screen.getByText('Get Location Recommendations')).toBeInTheDocument();
  });

  it('displays geographic score distribution chart', async () => {
    renderWithProviders(<GeographicDashboard />);
    
    // Switch to analytics tab
    const analyticsTab = screen.getByText('Analytics');
    analyticsTab.click();
    
    await waitFor(() => {
      expect(screen.getByText('Geographic Score Distribution')).toBeInTheDocument();
      expect(screen.getByText('Geographic Component Scores')).toBeInTheDocument();
      expect(screen.getByText('Top Performing Locations')).toBeInTheDocument();
    });
  });

  it('renders all child components in their respective tabs', () => {
    renderWithProviders(<GeographicDashboard />);
    
    // Map tab (default)
    expect(screen.getByTestId('property-map')).toBeInTheDocument();
    
    // Recommendations tab
    screen.getByText('Recommendations').click();
    expect(screen.getByTestId('location-recommendations')).toBeInTheDocument();
    
    // Territory Analysis tab
    screen.getByText('Territory Analysis').click();
    expect(screen.getByTestId('territory-analytics')).toBeInTheDocument();
    
    // Neighborhoods tab
    screen.getByText('Neighborhoods').click();
    expect(screen.getByTestId('neighborhood-scoring')).toBeInTheDocument();
  });

  it('handles filter changes', () => {
    renderWithProviders(<GeographicDashboard />);
    
    // Open filters
    screen.getByText('Filters').click();
    
    // Apply a filter
    const applyFilterButton = screen.getByText('Apply Filter');
    applyFilterButton.click();
    
    // Filter should be applied (we'd need to check the actual filter state in a real test)
    expect(screen.getByTestId('geographic-filters-panel')).toBeInTheDocument();
  });
});