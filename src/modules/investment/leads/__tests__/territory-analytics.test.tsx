import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { TerritoryAnalytics } from '../territory-analytics';

// Mock API
jest.mock('../../../lib/api', () => ({
  api: {
    get: jest.fn(),
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

const mockTerritoryPerformance = {
  team_averages: {
    avg_leads_per_member: 12.5,
    avg_geographic_score: 78.2,
    avg_lead_score: 73.8,
    avg_qualified_leads: 8.5,
    avg_conversion_rate: 2.3
  },
  team_performance: [
    {
      user_id: '1',
      name: 'John Doe',
      total_leads: 15,
      geographic_leads: 13,
      avg_geographic_score: 82.5,
      avg_lead_score: 76.2,
      qualified_leads: 10,
      converted_leads: 3,
      recent_activities: 25,
      territory_coverage: {
        neighborhoods: 8,
        cities: 3,
        geographic_spread: 53.3
      },
      workload_balance: {
        total_leads: 15,
        high_priority_leads: 5,
        workload_intensity: 33.3
      }
    },
    {
      user_id: '2',
      name: 'Jane Smith',
      total_leads: 10,
      geographic_leads: 9,
      avg_geographic_score: 74.8,
      avg_lead_score: 71.5,
      qualified_leads: 7,
      converted_leads: 1,
      recent_activities: 18,
      territory_coverage: {
        neighborhoods: 5,
        cities: 2,
        geographic_spread: 50.0
      },
      workload_balance: {
        total_leads: 10,
        high_priority_leads: 3,
        workload_intensity: 30.0
      }
    }
  ],
  recommendations: [
    '2 team members need improved geographic analysis coverage',
    'Consider rebalancing lead distribution across team members'
  ]
};

const mockWorkloadBalance = {
  total_leads: 25,
  total_members: 2,
  avg_leads_per_member: 12.5,
  balance_score: 85.2,
  workload_analysis: [
    {
      user_id: '1',
      name: 'John Doe',
      lead_count: 15,
      avg_score: 76.2,
      geographic_leads: 13,
      geographic_coverage: 86.7,
      variance_from_average: 2.5,
      variance_percent: 20.0
    },
    {
      user_id: '2',
      name: 'Jane Smith',
      lead_count: 10,
      avg_score: 71.5,
      geographic_leads: 9,
      geographic_coverage: 90.0,
      variance_from_average: -2.5,
      variance_percent: -20.0
    }
  ],
  overloaded_members: [
    {
      user_id: '1',
      name: 'John Doe',
      lead_count: 15,
      variance_percent: 20.0,
      variance_from_average: 2.5
    }
  ],
  underloaded_members: [
    {
      user_id: '2',
      name: 'Jane Smith',
      lead_count: 10,
      variance_percent: -20.0,
      variance_from_average: -2.5
    }
  ],
  balancing_recommendations: [
    {
      type: 'redistribute_from',
      member_id: '1',
      member_name: 'John Doe',
      current_leads: 15,
      suggested_leads: 12,
      leads_to_redistribute: 3,
      reason: 'Reduce workload by 3 leads to achieve balance'
    }
  ]
};

const mockLeads = [
  {
    id: '1',
    company_name: 'Test Company 1',
    current_score: 85,
    status: 'QUALIFIED'
  }
];

describe('TerritoryAnalytics', () => {
  beforeEach(() => {
    const mockApi = require('../../../lib/api').api;
    mockApi.get.mockResolvedValue({
      total_leads: 5,
      coverage_analysis: {
        neighborhoods_covered: 3,
        avg_geographic_score: 80.5
      },
      performance_metrics: {
        conversion_rate: 15.2
      }
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('renders territory analytics header', () => {
    renderWithProviders(
      <TerritoryAnalytics 
        territoryPerformance={mockTerritoryPerformance}
        workloadBalance={mockWorkloadBalance}
        leads={mockLeads}
      />
    );
    
    expect(screen.getByText('Territory Analytics')).toBeInTheDocument();
    expect(screen.getByText(/Comprehensive territory performance analysis and workload optimization/)).toBeInTheDocument();
  });

  it('displays all three main tabs', () => {
    renderWithProviders(
      <TerritoryAnalytics 
        territoryPerformance={mockTerritoryPerformance}
        workloadBalance={mockWorkloadBalance}
        leads={mockLeads}
      />
    );
    
    expect(screen.getByText('Team Performance')).toBeInTheDocument();
    expect(screen.getByText('Workload Balance')).toBeInTheDocument();
    expect(screen.getByText('Individual Analysis')).toBeInTheDocument();
  });

  it('shows team performance overview', () => {
    renderWithProviders(
      <TerritoryAnalytics 
        territoryPerformance={mockTerritoryPerformance}
        workloadBalance={mockWorkloadBalance}
        leads={mockLeads}
      />
    );
    
    expect(screen.getByText('Team Performance Overview')).toBeInTheDocument();
    expect(screen.getByText('12.5')).toBeInTheDocument(); // avg_leads_per_member
    expect(screen.getByText('78.2')).toBeInTheDocument(); // avg_geographic_score
    expect(screen.getByText('73.8')).toBeInTheDocument(); // avg_lead_score
  });

  it('displays individual team member cards', () => {
    renderWithProviders(
      <TerritoryAnalytics 
        territoryPerformance={mockTerritoryPerformance}
        workloadBalance={mockWorkloadBalance}
        leads={mockLeads}
      />
    );
    
    expect(screen.getByText('John Doe')).toBeInTheDocument();
    expect(screen.getByText('Jane Smith')).toBeInTheDocument();
    expect(screen.getByText('15 leads')).toBeInTheDocument();
    expect(screen.getByText('10 leads')).toBeInTheDocument();
  });

  it('shows top performer badge for high-scoring members', () => {
    renderWithProviders(
      <TerritoryAnalytics 
        territoryPerformance={mockTerritoryPerformance}
        workloadBalance={mockWorkloadBalance}
        leads={mockLeads}
      />
    );
    
    expect(screen.getByText('Top Performer')).toBeInTheDocument(); // John Doe has 82.5 avg_geographic_score
  });

  it('displays performance recommendations', () => {
    renderWithProviders(
      <TerritoryAnalytics 
        territoryPerformance={mockTerritoryPerformance}
        workloadBalance={mockWorkloadBalance}
        leads={mockLeads}
      />
    );
    
    expect(screen.getByText('Performance Recommendations')).toBeInTheDocument();
    expect(screen.getByText('2 team members need improved geographic analysis coverage')).toBeInTheDocument();
    expect(screen.getByText('Consider rebalancing lead distribution across team members')).toBeInTheDocument();
  });

  it('switches to workload balance tab and shows balance overview', async () => {
    const user = userEvent.setup();
    
    renderWithProviders(
      <TerritoryAnalytics 
        territoryPerformance={mockTerritoryPerformance}
        workloadBalance={mockWorkloadBalance}
        leads={mockLeads}
      />
    );
    
    await user.click(screen.getByText('Workload Balance'));
    
    expect(screen.getByText('Workload Balance Overview')).toBeInTheDocument();
    expect(screen.getByText('25')).toBeInTheDocument(); // total_leads
    expect(screen.getByText('2')).toBeInTheDocument(); // total_members
    expect(screen.getByText('85.2')).toBeInTheDocument(); // balance_score
  });

  it('shows workload distribution for each member', async () => {
    const user = userEvent.setup();
    
    renderWithProviders(
      <TerritoryAnalytics 
        territoryPerformance={mockTerritoryPerformance}
        workloadBalance={mockWorkloadBalance}
        leads={mockLeads}
      />
    );
    
    await user.click(screen.getByText('Workload Balance'));
    
    expect(screen.getByText('Workload Distribution')).toBeInTheDocument();
    expect(screen.getByText('+20%')).toBeInTheDocument(); // John's variance
    expect(screen.getByText('-20%')).toBeInTheDocument(); // Jane's variance
  });

  it('displays overloaded and underloaded member alerts', async () => {
    const user = userEvent.setup();
    
    renderWithProviders(
      <TerritoryAnalytics 
        territoryPerformance={mockTerritoryPerformance}
        workloadBalance={mockWorkloadBalance}
        leads={mockLeads}
      />
    );
    
    await user.click(screen.getByText('Workload Balance'));
    
    expect(screen.getByText('Overloaded Members')).toBeInTheDocument();
    expect(screen.getByText('Underloaded Members')).toBeInTheDocument();
    expect(screen.getByText('15 leads (20% above average)')).toBeInTheDocument();
    expect(screen.getByText('10 leads (20% below average)')).toBeInTheDocument();
  });

  it('shows balancing recommendations', async () => {
    const user = userEvent.setup();
    
    renderWithProviders(
      <TerritoryAnalytics 
        territoryPerformance={mockTerritoryPerformance}
        workloadBalance={mockWorkloadBalance}
        leads={mockLeads}
      />
    );
    
    await user.click(screen.getByText('Workload Balance'));
    
    expect(screen.getByText('Balancing Recommendations')).toBeInTheDocument();
    expect(screen.getByText('Reduce workload by 3 leads to achieve balance')).toBeInTheDocument();
    expect(screen.getByText('Reduce by 3')).toBeInTheDocument();
  });

  it('allows member selection for individual analysis', async () => {
    const user = userEvent.setup();
    
    renderWithProviders(
      <TerritoryAnalytics 
        territoryPerformance={mockTerritoryPerformance}
        workloadBalance={mockWorkloadBalance}
        leads={mockLeads}
      />
    );
    
    // Click on John Doe's card to select him
    await user.click(screen.getAllByText('John Doe')[0]);
    
    // Switch to individual analysis tab
    await user.click(screen.getByText('Individual Analysis'));
    
    await waitFor(() => {
      expect(screen.getByText('Individual Territory Analysis')).toBeInTheDocument();
      expect(screen.getByText('5')).toBeInTheDocument(); // total_leads from API mock
    });
  });

  it('shows message when no member is selected for individual analysis', async () => {
    const user = userEvent.setup();
    
    renderWithProviders(
      <TerritoryAnalytics 
        territoryPerformance={mockTerritoryPerformance}
        workloadBalance={mockWorkloadBalance}
        leads={mockLeads}
      />
    );
    
    await user.click(screen.getByText('Individual Analysis'));
    
    expect(screen.getByText('Select a Team Member')).toBeInTheDocument();
    expect(screen.getByText('Click on a team member in the Performance tab to view their detailed territory analysis.')).toBeInTheDocument();
  });

  it('allows clearing member selection', async () => {
    const user = userEvent.setup();
    
    renderWithProviders(
      <TerritoryAnalytics 
        territoryPerformance={mockTerritoryPerformance}
        workloadBalance={mockWorkloadBalance}
        leads={mockLeads}
      />
    );
    
    // Select a member first
    await user.click(screen.getAllByText('John Doe')[0]);
    
    // Clear selection button should appear
    expect(screen.getByText('Clear Selection')).toBeInTheDocument();
    
    // Click clear selection
    await user.click(screen.getByText('Clear Selection'));
    
    // Should go back to no selection state
    await user.click(screen.getByText('Individual Analysis'));
    expect(screen.getByText('Select a Team Member')).toBeInTheDocument();
  });
});