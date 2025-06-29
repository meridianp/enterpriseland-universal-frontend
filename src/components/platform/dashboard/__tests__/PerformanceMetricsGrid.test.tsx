import React from 'react';
import { render, screen, within } from '@testing-library/react';
import { PerformanceMetricsGrid } from '../PerformanceMetricsGrid';
import { usePerformanceMetrics, useDashboardOverview } from '@/lib/hooks/useAnalyticsQueries';

// Mock the hooks
jest.mock('@/lib/hooks/useAnalyticsQueries');

const mockUsePerformanceMetrics = usePerformanceMetrics as jest.MockedFunction<typeof usePerformanceMetrics>;
const mockUseDashboardOverview = useDashboardOverview as jest.MockedFunction<typeof useDashboardOverview>;

// Mock data
const mockPerformanceData = {
  data: {
    kpis: {
      assessment_throughput: {
        current_value: 18.5,
        previous_value: 16.2,
        change_percentage: 14.2,
        trend_direction: 'up' as const,
        target_value: 20,
        is_on_track: true
      },
      risk_score_improvement: {
        current_value: 1.8,
        previous_value: 1.5,
        change_percentage: 20.0,
        trend_direction: 'up' as const,
        target_value: 2.0,
        is_on_track: true
      },
      partner_satisfaction: {
        current_value: 92.5,
        previous_value: 89.0,
        change_percentage: 3.9,
        trend_direction: 'up' as const,
        target_value: 90,
        is_on_track: true
      },
      operational_efficiency: {
        current_value: 8.7,
        previous_value: 8.2,
        change_percentage: 6.1,
        trend_direction: 'up' as const,
        target_value: 8.5,
        is_on_track: true
      }
    },
    alerts: {
      high_priority: 2,
      medium_priority: 5,
      low_priority: 8,
      recent_alerts: []
    },
    time_period: 'last_30_days'
  }
};

const mockDashboardData = {
  data: {
    platform_metrics: {
      total_assessments: 1200,
      active_assessments: 150,
      completed_assessments: 850,
      assessment_completion_rate: 70.8,
      average_assessment_time_days: 12.5,
      risk_assessments_completed: 680,
      average_risk_score: 3.2,
      high_risk_count: 45,
      total_investment_value: 2500000000,
      assessed_investment_value: 1800000000,
      total_due_diligence_hours: 15000,
      average_hours_per_assessment: 17.6
    },
    assessment_status_distribution: {},
    assessment_trends: {},
    geographic_distribution: {},
    assessment_types_breakdown: {},
    recent_activities: []
  }
};

describe('PerformanceMetricsGrid', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    
    // Default successful response
    mockUsePerformanceMetrics.mockReturnValue({
      data: mockPerformanceData,
      isLoading: false,
      error: null,
      refetch: jest.fn()
    } as any);
    
    mockUseDashboardOverview.mockReturnValue({
      data: mockDashboardData,
      isLoading: false,
      error: null,
      refetch: jest.fn()
    } as any);
  });

  it('renders performance metrics header', () => {
    render(<PerformanceMetricsGrid />);
    
    expect(screen.getByText('Performance Metrics')).toBeInTheDocument();
  });

  it('displays all KPI cards', () => {
    render(<PerformanceMetricsGrid />);
    
    expect(screen.getByText('Assessment Throughput')).toBeInTheDocument();
    expect(screen.getByText('Completion Rate')).toBeInTheDocument();
    expect(screen.getByText('Avg. Assessment Time')).toBeInTheDocument();
    expect(screen.getByText('Risk Score Improvement')).toBeInTheDocument();
    expect(screen.getByText('Partner Satisfaction')).toBeInTheDocument();
    expect(screen.getByText('Operational Efficiency')).toBeInTheDocument();
  });

  it('shows correct metric values', () => {
    render(<PerformanceMetricsGrid />);
    
    expect(screen.getByText('18.5')).toBeInTheDocument(); // Assessment throughput
    expect(screen.getByText('70.8%')).toBeInTheDocument(); // Completion rate
    expect(screen.getByText('12.5')).toBeInTheDocument(); // Avg assessment time
    expect(screen.getByText('1.8')).toBeInTheDocument(); // Risk score improvement
    expect(screen.getByText('92.5%')).toBeInTheDocument(); // Partner satisfaction
    expect(screen.getByText('8.7')).toBeInTheDocument(); // Operational efficiency
  });

  it('displays trend indicators correctly', () => {
    render(<PerformanceMetricsGrid />);
    
    // Check for trend percentages
    expect(screen.getByText('14.2%')).toBeInTheDocument();
    expect(screen.getByText('2.5%')).toBeInTheDocument(); // Default trend for completion rate
    expect(screen.getByText('8.3%')).toBeInTheDocument(); // Default trend for assessment time
    expect(screen.getByText('20.0%')).toBeInTheDocument();
    expect(screen.getByText('3.9%')).toBeInTheDocument();
    expect(screen.getByText('6.1%')).toBeInTheDocument();
  });

  it('shows progress bars for each metric', () => {
    render(<PerformanceMetricsGrid />);
    
    const progressBars = screen.getAllByRole('progressbar');
    expect(progressBars).toHaveLength(6);
  });

  it('displays benchmark comparisons', () => {
    render(<PerformanceMetricsGrid />);
    
    expect(screen.getByText('Target: 15/week')).toBeInTheDocument();
    expect(screen.getByText('Target: 85%')).toBeInTheDocument();
    expect(screen.getByText('Target: ≤10 days')).toBeInTheDocument();
    expect(screen.getByText('Target: 1.5 pts')).toBeInTheDocument();
    expect(screen.getByText('Target: 90%')).toBeInTheDocument();
    expect(screen.getByText('Target: 8.5')).toBeInTheDocument();
  });

  it('shows on track/below target badges', () => {
    render(<PerformanceMetricsGrid />);
    
    const onTrackBadges = screen.getAllByText('On Track');
    const belowTargetBadges = screen.getAllByText('Below Target');
    
    expect(onTrackBadges.length + belowTargetBadges.length).toBe(6);
  });

  it('displays alerts summary when alerts exist', () => {
    render(<PerformanceMetricsGrid />);
    
    expect(screen.getByText('15 alerts')).toBeInTheDocument(); // Total alerts
    expect(screen.getByText('Performance Alerts')).toBeInTheDocument();
    expect(screen.getByText('2')).toBeInTheDocument(); // High priority
    expect(screen.getByText('5')).toBeInTheDocument(); // Medium priority
    expect(screen.getByText('8')).toBeInTheDocument(); // Low priority
  });

  it('shows correct alert priority labels', () => {
    render(<PerformanceMetricsGrid />);
    
    expect(screen.getByText('High Priority')).toBeInTheDocument();
    expect(screen.getByText('Medium Priority')).toBeInTheDocument();
    expect(screen.getByText('Low Priority')).toBeInTheDocument();
  });

  it('displays benchmark performance summary', () => {
    render(<PerformanceMetricsGrid />);
    
    expect(screen.getByText('Benchmark Performance')).toBeInTheDocument();
    expect(screen.getByText('Above Target')).toBeInTheDocument();
    expect(screen.getByText('Below Target')).toBeInTheDocument();
    expect(screen.getByText('out of 6 KPIs')).toBeInTheDocument();
    expect(screen.getByText('needs improvement')).toBeInTheDocument();
  });

  it('shows loading state correctly', () => {
    mockUsePerformanceMetrics.mockReturnValue({
      data: null,
      isLoading: true,
      error: null,
      refetch: jest.fn()
    } as any);
    
    render(<PerformanceMetricsGrid />);
    
    // Should show skeleton loaders
    const skeletons = screen.getAllByTestId(/skeleton/i);
    expect(skeletons.length).toBeGreaterThan(0);
  });

  it('displays error state when data loading fails', () => {
    mockUsePerformanceMetrics.mockReturnValue({
      data: null,
      isLoading: false,
      error: new Error('Failed to load'),
      refetch: jest.fn()
    } as any);
    
    render(<PerformanceMetricsGrid />);
    
    expect(screen.getByText('Failed to load performance metrics. Please try again later.')).toBeInTheDocument();
  });

  it('applies custom className', () => {
    const { container } = render(<PerformanceMetricsGrid className="custom-metrics" />);
    
    const card = container.querySelector('.custom-metrics');
    expect(card).toBeInTheDocument();
  });

  it('passes filters to hooks', () => {
    const filters = {
      time_period: 'last_7_days',
      partner_ids: ['partner-1', 'partner-2'],
      assessment_statuses: ['completed', 'in_progress']
    };
    
    render(<PerformanceMetricsGrid filters={filters} />);
    
    expect(mockUsePerformanceMetrics).toHaveBeenCalledWith(filters);
    expect(mockUseDashboardOverview).toHaveBeenCalledWith(filters);
  });

  it('handles no alerts scenario', () => {
    mockUsePerformanceMetrics.mockReturnValue({
      data: {
        ...mockPerformanceData,
        data: {
          ...mockPerformanceData.data,
          alerts: {
            high_priority: 0,
            medium_priority: 0,
            low_priority: 0,
            recent_alerts: []
          }
        }
      },
      isLoading: false,
      error: null,
      refetch: jest.fn()
    } as any);
    
    render(<PerformanceMetricsGrid />);
    
    // Should not show alerts badge or section
    expect(screen.queryByText(/alerts/i)).not.toBeInTheDocument();
  });

  it('calculates correct benchmark counts', () => {
    render(<PerformanceMetricsGrid />);
    
    // Find the benchmark summary section
    const benchmarkSection = screen.getByText('Benchmark Performance').closest('div');
    
    if (benchmarkSection) {
      // Check for specific numbers (these will depend on the mock data)
      const aboveTarget = within(benchmarkSection).getByText('5');
      const belowTarget = within(benchmarkSection).getByText('1');
      
      expect(aboveTarget).toBeInTheDocument();
      expect(belowTarget).toBeInTheDocument();
    }
  });

  it('applies correct color coding for trends', () => {
    render(<PerformanceMetricsGrid />);
    
    // Positive trends should have green color
    const positivePercentages = screen.getAllByText(/14\.2%|20\.0%|3\.9%|6\.1%/);
    positivePercentages.forEach(element => {
      expect(element.closest('div')).toHaveClass('text-green-600');
    });
  });

  it('shows correct icons for each metric', () => {
    render(<PerformanceMetricsGrid />);
    
    // Check that icons are rendered (they're SVGs)
    const metricCards = screen.getAllByText(/assessments\/week|days to complete|points improved|satisfaction score|efficiency index/);
    expect(metricCards).toHaveLength(6);
  });

  it('formats large numbers correctly', () => {
    // Test with larger numbers
    const largeNumberData = {
      ...mockPerformanceData,
      data: {
        ...mockPerformanceData.data,
        kpis: {
          ...mockPerformanceData.data.kpis,
          assessment_throughput: {
            ...mockPerformanceData.data.kpis.assessment_throughput,
            current_value: 1234.5
          }
        }
      }
    };
    
    mockUsePerformanceMetrics.mockReturnValue({
      data: largeNumberData,
      isLoading: false,
      error: null,
      refetch: jest.fn()
    } as any);
    
    render(<PerformanceMetricsGrid />);
    
    expect(screen.getByText('1234.5')).toBeInTheDocument();
  });

  it('handles missing data gracefully', () => {
    mockUsePerformanceMetrics.mockReturnValue({
      data: null,
      isLoading: false,
      error: null,
      refetch: jest.fn()
    } as any);
    
    mockUseDashboardOverview.mockReturnValue({
      data: null,
      isLoading: false,
      error: null,
      refetch: jest.fn()
    } as any);
    
    render(<PerformanceMetricsGrid />);
    
    // Should render without crashing
    expect(screen.getByText('Performance Metrics')).toBeInTheDocument();
  });

  it('displays alert badge with correct variant', () => {
    render(<PerformanceMetricsGrid />);
    
    const alertBadge = screen.getByText('15 alerts');
    expect(alertBadge.closest('[class*="badge"]')).toHaveClass('destructive'); // Because high priority > 0
  });

  it('shows secondary badge when only low/medium alerts', () => {
    mockUsePerformanceMetrics.mockReturnValue({
      data: {
        ...mockPerformanceData,
        data: {
          ...mockPerformanceData.data,
          alerts: {
            high_priority: 0,
            medium_priority: 5,
            low_priority: 8,
            recent_alerts: []
          }
        }
      },
      isLoading: false,
      error: null,
      refetch: jest.fn()
    } as any);
    
    render(<PerformanceMetricsGrid />);
    
    const alertBadge = screen.getByText('13 alerts');
    expect(alertBadge.closest('[class*="badge"]')).toHaveClass('secondary');
  });
});