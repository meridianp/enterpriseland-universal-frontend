import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { SchemeFinancialChart } from '../SchemeFinancialChart';
import { type PBSAScheme, DevelopmentStage } from '@/lib/types/scheme.types';

// Mock recharts to avoid rendering issues in tests
jest.mock('recharts', () => ({
  ResponsiveContainer: ({ children }: any) => <div data-testid="responsive-container">{children}</div>,
  PieChart: ({ children }: any) => <div data-testid="pie-chart">{children}</div>,
  Pie: ({ children, data, label }: any) => (
    <div data-testid="pie" data-items={data?.length}>
      {data?.map((item: any, index: number) => (
        <div key={index} data-testid={`pie-segment-${index}`}>
          {item.name}: {item.value}
        </div>
      ))}
      {children}
    </div>
  ),
  BarChart: ({ children, data }: any) => (
    <div data-testid="bar-chart" data-items={data?.length}>
      {data?.map((item: any, index: number) => (
        <div key={index} data-testid={`bar-${index}`}>
          {item.name}: {item.value}
        </div>
      ))}
      {children}
    </div>
  ),
  Bar: ({ children }: any) => <div data-testid="bar">{children}</div>,
  Cell: () => <div data-testid="cell" />,
  XAxis: () => <div data-testid="x-axis" />,
  YAxis: () => <div data-testid="y-axis" />,
  CartesianGrid: () => <div data-testid="cartesian-grid" />,
  Tooltip: () => <div data-testid="tooltip" />,
  Legend: () => <div data-testid="legend" />,
}));

const mockScheme: PBSAScheme = {
  id: 'scheme-123',
  scheme_name: 'Test Student Housing',
  total_beds: 500,
  total_units: 100,
  development_stage: DevelopmentStage.CONSTRUCTION,
  assessment_priority: 'high',
  total_development_cost_amount: 25000000,
  total_development_cost_currency: 'GBP',
  cost_per_bed: 50000,
  estimated_gcd_amount: 2000000,
  estimated_gcd_currency: 'GBP',
  created_at: '2024-01-01T00:00:00Z',
  updated_at: '2024-01-01T00:00:00Z'
};

describe('SchemeFinancialChart', () => {
  it('renders all tab options', () => {
    render(<SchemeFinancialChart scheme={mockScheme} />);
    
    expect(screen.getByRole('tab', { name: 'Cost Breakdown' })).toBeInTheDocument();
    expect(screen.getByRole('tab', { name: 'Market Comparison' })).toBeInTheDocument();
    expect(screen.getByRole('tab', { name: 'Key Metrics' })).toBeInTheDocument();
  });

  it('displays cost breakdown by default', () => {
    render(<SchemeFinancialChart scheme={mockScheme} />);
    
    expect(screen.getByText('Development Cost Breakdown')).toBeInTheDocument();
    expect(screen.getByText('Estimated allocation of total development costs')).toBeInTheDocument();
    expect(screen.getByTestId('pie-chart')).toBeInTheDocument();
  });

  it('calculates and displays cost breakdown segments', () => {
    render(<SchemeFinancialChart scheme={mockScheme} />);
    
    // Check for cost breakdown items
    expect(screen.getByText('Construction')).toBeInTheDocument();
    expect(screen.getByText('Land')).toBeInTheDocument();
    expect(screen.getByText('Professional Fees')).toBeInTheDocument();
    expect(screen.getByText('Finance Costs')).toBeInTheDocument();
    expect(screen.getByText('Other')).toBeInTheDocument();
  });

  it('switches to market comparison tab', () => {
    render(<SchemeFinancialChart scheme={mockScheme} />);
    
    const comparisonTab = screen.getByRole('tab', { name: 'Market Comparison' });
    fireEvent.click(comparisonTab);
    
    expect(screen.getByText('Cost per Bed Comparison')).toBeInTheDocument();
    expect(screen.getByText('How this scheme compares to market benchmarks')).toBeInTheDocument();
    expect(screen.getByTestId('bar-chart')).toBeInTheDocument();
  });

  it('displays market comparison data', () => {
    render(<SchemeFinancialChart scheme={mockScheme} />);
    
    fireEvent.click(screen.getByRole('tab', { name: 'Market Comparison' }));
    
    expect(screen.getByText('This Scheme: 50000')).toBeInTheDocument();
    expect(screen.getByText('Market Average: 55000')).toBeInTheDocument();
    expect(screen.getByText('Market Low: 40000')).toBeInTheDocument();
    expect(screen.getByText('Market High: 65000')).toBeInTheDocument();
  });

  it('switches to key metrics tab', () => {
    render(<SchemeFinancialChart scheme={mockScheme} />);
    
    const metricsTab = screen.getByRole('tab', { name: 'Key Metrics' });
    fireEvent.click(metricsTab);
    
    expect(screen.getByText('Financial Metrics Summary')).toBeInTheDocument();
    expect(screen.getByText('Key financial indicators for the scheme')).toBeInTheDocument();
  });

  it('displays all available metrics', () => {
    render(<SchemeFinancialChart scheme={mockScheme} />);
    
    fireEvent.click(screen.getByRole('tab', { name: 'Key Metrics' }));
    
    expect(screen.getByText('Total Cost')).toBeInTheDocument();
    expect(screen.getByText('Cost/Bed')).toBeInTheDocument();
    expect(screen.getByText('Est. GCD')).toBeInTheDocument();
    
    // Check formatted values
    expect(screen.getByText('£25,000,000')).toBeInTheDocument();
    expect(screen.getByText('£50,000')).toBeInTheDocument();
    expect(screen.getByText('£2,000,000')).toBeInTheDocument();
  });

  it('handles missing financial data gracefully', () => {
    const schemeWithoutData: PBSAScheme = {
      ...mockScheme,
      total_development_cost_amount: undefined,
      cost_per_bed: undefined,
      estimated_gcd_amount: undefined
    };
    
    render(<SchemeFinancialChart scheme={schemeWithoutData} />);
    
    expect(screen.getByText('No financial data available')).toBeInTheDocument();
  });

  it('renders cost breakdown when only total cost is available', () => {
    const schemeWithPartialData: PBSAScheme = {
      ...mockScheme,
      cost_per_bed: undefined,
      estimated_gcd_amount: undefined
    };
    
    render(<SchemeFinancialChart scheme={schemeWithPartialData} />);
    
    expect(screen.getByText('Development Cost Breakdown')).toBeInTheDocument();
    expect(screen.getByTestId('pie-chart')).toBeInTheDocument();
  });

  it('handles different currencies', () => {
    const usdScheme: PBSAScheme = {
      ...mockScheme,
      total_development_cost_currency: 'USD',
      estimated_gcd_currency: 'USD'
    };
    
    render(<SchemeFinancialChart scheme={usdScheme} />);
    
    fireEvent.click(screen.getByRole('tab', { name: 'Key Metrics' }));
    
    // Currency formatting should use USD
    expect(screen.getByText('$25,000,000')).toBeInTheDocument();
    expect(screen.getByText('$50,000')).toBeInTheDocument();
    expect(screen.getByText('$2,000,000')).toBeInTheDocument();
  });

  it('calculates cost per bed when not provided', () => {
    const schemeWithoutCostPerBed: PBSAScheme = {
      ...mockScheme,
      cost_per_bed: undefined
    };
    
    render(<SchemeFinancialChart scheme={schemeWithoutCostPerBed} />);
    
    // Should calculate cost breakdown based on total cost / beds
    expect(screen.getByTestId('pie-chart')).toBeInTheDocument();
    expect(screen.getByText('Construction')).toBeInTheDocument();
  });

  it('displays empty state for comparison when cost per bed is missing', () => {
    const schemeWithoutCostPerBed: PBSAScheme = {
      ...mockScheme,
      cost_per_bed: undefined
    };
    
    render(<SchemeFinancialChart scheme={schemeWithoutCostPerBed} />);
    
    fireEvent.click(screen.getByRole('tab', { name: 'Market Comparison' }));
    
    expect(screen.getByText('Comparison data not available')).toBeInTheDocument();
  });

  it('renders multiple chart types correctly', () => {
    render(<SchemeFinancialChart scheme={mockScheme} />);
    
    // Check pie chart in breakdown
    expect(screen.getByTestId('pie-chart')).toBeInTheDocument();
    
    // Check bar chart in comparison
    fireEvent.click(screen.getByRole('tab', { name: 'Market Comparison' }));
    expect(screen.getByTestId('bar-chart')).toBeInTheDocument();
    
    // Check bar chart in metrics
    fireEvent.click(screen.getByRole('tab', { name: 'Key Metrics' }));
    const barCharts = screen.getAllByTestId('bar-chart');
    expect(barCharts).toHaveLength(1);
  });

  it('preserves tab state when switching', () => {
    render(<SchemeFinancialChart scheme={mockScheme} />);
    
    // Switch to comparison tab
    fireEvent.click(screen.getByRole('tab', { name: 'Market Comparison' }));
    expect(screen.getByText('Cost per Bed Comparison')).toBeInTheDocument();
    
    // Switch to metrics tab
    fireEvent.click(screen.getByRole('tab', { name: 'Key Metrics' }));
    expect(screen.getByText('Financial Metrics Summary')).toBeInTheDocument();
    
    // Switch back to breakdown
    fireEvent.click(screen.getByRole('tab', { name: 'Cost Breakdown' }));
    expect(screen.getByText('Development Cost Breakdown')).toBeInTheDocument();
  });

  it('displays correct number of chart segments', () => {
    render(<SchemeFinancialChart scheme={mockScheme} />);
    
    const pie = screen.getByTestId('pie');
    expect(pie.getAttribute('data-items')).toBe('5'); // 5 cost breakdown categories
  });

  it('displays correct number of comparison bars', () => {
    render(<SchemeFinancialChart scheme={mockScheme} />);
    
    fireEvent.click(screen.getByRole('tab', { name: 'Market Comparison' }));
    
    const barChart = screen.getByTestId('bar-chart');
    expect(barChart.getAttribute('data-items')).toBe('4'); // 4 comparison items
  });

  it('formats large numbers correctly in metrics', () => {
    const largeScheme: PBSAScheme = {
      ...mockScheme,
      total_development_cost_amount: 150000000,
      cost_per_bed: 300000,
      estimated_gcd_amount: 15000000
    };
    
    render(<SchemeFinancialChart scheme={largeScheme} />);
    
    fireEvent.click(screen.getByRole('tab', { name: 'Key Metrics' }));
    
    expect(screen.getByText('£150,000,000')).toBeInTheDocument();
    expect(screen.getByText('£300,000')).toBeInTheDocument();
    expect(screen.getByText('£15,000,000')).toBeInTheDocument();
  });
});