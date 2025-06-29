import React from 'react';
import { render, screen } from '@/lib/test-utils';
import { MetricCard } from '../MetricCard';
import { DollarSign } from 'lucide-react';

describe('MetricCard', () => {
  const defaultProps = {
    title: 'Total Revenue',
    value: '$1,234,567',
  };

  it('should render title and value', () => {
    render(<MetricCard {...defaultProps} />);
    
    expect(screen.getByText('Total Revenue')).toBeInTheDocument();
    expect(screen.getByText('$1,234,567')).toBeInTheDocument();
  });

  it('should render description when provided', () => {
    render(
      <MetricCard {...defaultProps} description="Revenue for Q4 2023" />
    );
    
    expect(screen.getByText('Revenue for Q4 2023')).toBeInTheDocument();
  });

  it('should render icon when provided', () => {
    render(
      <MetricCard 
        {...defaultProps} 
        icon={<DollarSign data-testid="dollar-icon" />} 
      />
    );
    
    expect(screen.getByTestId('dollar-icon')).toBeInTheDocument();
  });

  it('should render increase trend with correct styling', () => {
    render(
      <MetricCard 
        {...defaultProps} 
        change={{ value: 15.5, type: 'increase' }}
      />
    );
    
    // Check for trend value
    expect(screen.getByText('+15.5%')).toBeInTheDocument();
    expect(screen.getByText('from last period')).toBeInTheDocument();
    
    // Check for up arrow icon
    const trendContainer = screen.getByText('+15.5%').parentElement;
    expect(trendContainer).toHaveClass('text-green-600');
  });

  it('should render decrease trend with correct styling', () => {
    render(
      <MetricCard 
        {...defaultProps} 
        change={{ value: -8.2, type: 'decrease' }}
      />
    );
    
    // Check for trend value
    expect(screen.getByText('-8.2%')).toBeInTheDocument();
    
    // Check for down arrow icon and red color
    const trendContainer = screen.getByText('-8.2%').parentElement;
    expect(trendContainer).toHaveClass('text-red-600');
  });

  it('should render neutral trend with correct styling', () => {
    render(
      <MetricCard 
        {...defaultProps} 
        change={{ value: 0, type: 'neutral' }}
      />
    );
    
    // Check for trend value
    expect(screen.getByText('0%')).toBeInTheDocument();
    
    // Check for neutral icon and gray color
    const trendContainer = screen.getByText('0%').parentElement;
    expect(trendContainer).toHaveClass('text-gray-600');
  });

  it('should not render trend section when change is not provided', () => {
    render(<MetricCard {...defaultProps} />);
    
    expect(screen.queryByText('from last period')).not.toBeInTheDocument();
  });

  it('should accept custom className', () => {
    const { container } = render(
      <MetricCard {...defaultProps} className="custom-class" />
    );
    
    // Find the div with the custom class (skip the script tag)
    const cardDiv = container.querySelector('.custom-class');
    expect(cardDiv).toBeInTheDocument();
    expect(cardDiv).toHaveClass('custom-class');
  });

  it('should handle numeric value', () => {
    render(<MetricCard title="User Count" value={42} />);
    
    expect(screen.getByText('42')).toBeInTheDocument();
  });

  it('should handle zero value', () => {
    render(<MetricCard title="Errors" value={0} />);
    
    expect(screen.getByText('0')).toBeInTheDocument();
  });

  it('should render positive change without explicit plus sign in value', () => {
    render(
      <MetricCard 
        {...defaultProps} 
        change={{ value: 5, type: 'increase' }}
      />
    );
    
    // Should add + sign for positive values
    expect(screen.getByText('+5%')).toBeInTheDocument();
  });

  it('should render all elements in correct structure', () => {
    render(
      <MetricCard 
        title="Active Users"
        value="1,234"
        description="Currently online"
        change={{ value: 23, type: 'increase' }}
        icon={<DollarSign data-testid="icon" />}
      />
    );
    
    // Check all elements are present
    expect(screen.getByText('Active Users')).toBeInTheDocument();
    expect(screen.getByText('1,234')).toBeInTheDocument();
    expect(screen.getByText('Currently online')).toBeInTheDocument();
    expect(screen.getByText('+23%')).toBeInTheDocument();
    expect(screen.getByTestId('icon')).toBeInTheDocument();
  });

  it('should apply correct styling to title', () => {
    render(<MetricCard {...defaultProps} />);
    
    const title = screen.getByText('Total Revenue');
    expect(title).toHaveClass('text-sm', 'font-medium', 'text-muted-foreground');
  });

  it('should apply correct styling to value', () => {
    render(<MetricCard {...defaultProps} />);
    
    const value = screen.getByText('$1,234,567');
    expect(value).toHaveClass('text-2xl', 'font-bold');
  });
});