import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { LocationRecommendations } from '../location-recommendations';

// Mock API
jest.mock('../../../lib/api', () => ({
  api: {
    get: jest.fn(),
    post: jest.fn(),
  },
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

const mockLocation = { lat: 51.5074, lng: -0.1278 };

const mockNearbyLeads = {
  results: [
    {
      id: '1',
      company_name: 'Test Company 1',
      headquarters_city: 'London',
      headquarters_country: 'UK',
      current_score: 85,
      geographic_score: 90,
      accessibility_score: 88,
      university_proximity_score: 92,
      status: 'QUALIFIED',
      distance_km: 2.5,
      target_neighborhood: { name: 'Central London' },
      assigned_to: null
    },
    {
      id: '2',
      company_name: 'Test Company 2',
      headquarters_city: 'London',
      headquarters_country: 'UK',
      current_score: 75,
      geographic_score: 80,
      accessibility_score: 78,
      university_proximity_score: 85,
      status: 'CONTACTED',
      distance_km: 5.2,
      target_neighborhood: { name: 'West London' },
      assigned_to: { id: '1', name: 'John Doe' }
    }
  ]
};

const mockOptimalAssignments = {
  recommended_assignments: [
    {
      assigned_to_name: 'John Doe',
      lead_count: 3,
      avg_match_score: 85.5,
      recommendation: 'Assign 3 leads with average match score of 85.5',
      assignments: [
        {
          lead_id: '1',
          company_name: 'Test Company 1',
          match_score: 90,
          reason: 'Geographic proximity; Balanced workload'
        },
        {
          lead_id: '2',
          company_name: 'Test Company 2',
          match_score: 85,
          reason: 'High-value lead match; Team member availability'
        }
      ]
    }
  ],
  assignment_impact: {
    total_assignments: 3,
    affected_team_members: 2,
    avg_workload_after: 8.5,
    balance_improvement: 'Improves workload balance by 15.2%'
  },
  optimization_score: 87.2
};

const mockMarketTargets = {
  results: [
    {
      id: '1',
      company_name: 'Market Target 1',
      location_city: 'London',
      location_country: 'UK',
      intelligence_score: 88,
      discovery_score: 92,
      sector: 'Technology',
      business_model: 'SaaS Platform',
      discovery_source: 'News Analysis'
    }
  ]
};

describe('LocationRecommendations', () => {
  beforeEach(() => {
    const mockApi = require('../../../lib/api').api;
    mockApi.get.mockImplementation((url: string) => {
      if (url.includes('location_recommendations')) {
        return Promise.resolve(mockNearbyLeads);
      }
      if (url.includes('market-intelligence/targets')) {
        return Promise.resolve(mockMarketTargets);
      }
      return Promise.resolve({ results: [] });
    });
    
    mockApi.post.mockImplementation((url: string) => {
      if (url.includes('optimize_assignments')) {
        return Promise.resolve(mockOptimalAssignments);
      }
      return Promise.resolve({});
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('renders without location selected', () => {
    renderWithProviders(
      <LocationRecommendations selectedLocation={null} filterCriteria={{}} />
    );
    
    expect(screen.getByText('Location Recommendations')).toBeInTheDocument();
    expect(screen.getByText(/Select a location on the map to get targeted recommendations/)).toBeInTheDocument();
  });

  it('renders with location selected', () => {
    renderWithProviders(
      <LocationRecommendations selectedLocation={mockLocation} filterCriteria={{}} />
    );
    
    expect(screen.getByText(/Recommendations for location 51.5074, -0.1278/)).toBeInTheDocument();
  });

  it('displays recommendation type buttons', () => {
    renderWithProviders(
      <LocationRecommendations selectedLocation={mockLocation} filterCriteria={{}} />
    );
    
    expect(screen.getByText('Nearby Leads')).toBeInTheDocument();
    expect(screen.getByText('Optimal Assignments')).toBeInTheDocument();
    expect(screen.getByText('Market Targets')).toBeInTheDocument();
  });

  it('disables location-dependent buttons when no location', () => {
    renderWithProviders(
      <LocationRecommendations selectedLocation={null} filterCriteria={{}} />
    );
    
    const nearbyButton = screen.getByText('Nearby Leads');
    const marketButton = screen.getByText('Market Targets');
    const optimalButton = screen.getByText('Optimal Assignments');
    
    expect(nearbyButton).toBeDisabled();
    expect(marketButton).toBeDisabled();
    expect(optimalButton).not.toBeDisabled(); // This one doesn't require location
  });

  it('switches between recommendation types', async () => {
    const user = userEvent.setup();
    
    renderWithProviders(
      <LocationRecommendations selectedLocation={mockLocation} filterCriteria={{}} />
    );
    
    // Start with nearby leads (default)
    await waitFor(() => {
      expect(screen.getByText('Test Company 1')).toBeInTheDocument();
    });
    
    // Switch to optimal assignments
    await user.click(screen.getByText('Optimal Assignments'));
    
    await waitFor(() => {
      expect(screen.getByText('Assignment Impact')).toBeInTheDocument();
      expect(screen.getByText('John Doe')).toBeInTheDocument();
    });
    
    // Switch to market targets
    await user.click(screen.getByText('Market Targets'));
    
    await waitFor(() => {
      expect(screen.getByText('Market Target 1')).toBeInTheDocument();
      expect(screen.getByText('Technology')).toBeInTheDocument();
    });
  });

  it('displays nearby leads correctly', async () => {
    renderWithProviders(
      <LocationRecommendations selectedLocation={mockLocation} filterCriteria={{}} />
    );
    
    await waitFor(() => {
      expect(screen.getByText('Test Company 1')).toBeInTheDocument();
      expect(screen.getByText('Test Company 2')).toBeInTheDocument();
      expect(screen.getByText('Score: 85')).toBeInTheDocument();
      expect(screen.getByText('Score: 75')).toBeInTheDocument();
      expect(screen.getByText('2.5km away')).toBeInTheDocument();
      expect(screen.getByText('5.2km away')).toBeInTheDocument();
    });
  });

  it('shows assign button for unassigned leads', async () => {
    renderWithProviders(
      <LocationRecommendations selectedLocation={mockLocation} filterCriteria={{}} />
    );
    
    await waitFor(() => {
      const assignButtons = screen.getAllByText('Assign Lead');
      expect(assignButtons).toHaveLength(1); // Only Test Company 1 is unassigned
    });
  });

  it('displays optimal assignments with impact analysis', async () => {
    const user = userEvent.setup();
    
    renderWithProviders(
      <LocationRecommendations selectedLocation={mockLocation} filterCriteria={{}} />
    );
    
    await user.click(screen.getByText('Optimal Assignments'));
    
    await waitFor(() => {
      expect(screen.getByText('Assignment Impact')).toBeInTheDocument();
      expect(screen.getByText('3')).toBeInTheDocument(); // Total assignments
      expect(screen.getByText('2')).toBeInTheDocument(); // Team members
      expect(screen.getByText('87.2')).toBeInTheDocument(); // Optimization score
      expect(screen.getByText('John Doe')).toBeInTheDocument();
      expect(screen.getByText('3 leads • Score: 85.5')).toBeInTheDocument();
    });
  });

  it('displays market intelligence targets', async () => {
    const user = userEvent.setup();
    
    renderWithProviders(
      <LocationRecommendations selectedLocation={mockLocation} filterCriteria={{}} />
    );
    
    await user.click(screen.getByText('Market Targets'));
    
    await waitFor(() => {
      expect(screen.getByText('Market Target 1')).toBeInTheDocument();
      expect(screen.getByText('Intelligence Score: 88')).toBeInTheDocument();
      expect(screen.getByText('Technology')).toBeInTheDocument();
      expect(screen.getByText('SaaS Platform')).toBeInTheDocument();
      expect(screen.getByText('News Analysis')).toBeInTheDocument();
      expect(screen.getByText('Create Lead')).toBeInTheDocument();
    });
  });

  it('handles loading states', () => {
    const mockApi = require('../../../lib/api').api;
    mockApi.get.mockImplementation(() => new Promise(() => {})); // Never resolves
    
    renderWithProviders(
      <LocationRecommendations selectedLocation={mockLocation} filterCriteria={{}} />
    );
    
    expect(screen.getByText('Loading recommendations...')).toBeInTheDocument();
  });

  it('shows appropriate message when no location is selected for nearby/market', () => {
    renderWithProviders(
      <LocationRecommendations selectedLocation={null} filterCriteria={{}} />
    );
    
    expect(screen.getByText('Select a Location')).toBeInTheDocument();
    expect(screen.getByText('Click on the map or use the filters to select a location for targeted recommendations.')).toBeInTheDocument();
  });
});