'use client';

import { useFormContext } from 'react-hook-form';
import { 
  FormField, 
  FormItem, 
  FormLabel, 
  FormControl, 
  FormMessage,
  FormDescription 
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { WizardStepProps } from '../types';
import { Calculator, PoundSterling, TrendingDown, Building2, Percent } from 'lucide-react';
import { Currency } from '@/lib/types/assessment.types';
import { formatCurrency } from '@/lib/utils';

export function EconomicMetricsStep({ data, onUpdate }: WizardStepProps) {
  const { control, watch } = useFormContext();
  
  // Watch currency and values for calculations
  const currency = watch('financial_info.currency') || Currency.GBP;
  const developmentCost = watch('economic_metrics.total_development_cost');
  const expectedNOI = watch('economic_metrics.expected_noi');
  const expectedRent = watch('economic_metrics.expected_annual_rent');
  const operatingCosts = watch('economic_metrics.operating_costs_per_bed');
  const totalBeds = watch('scheme_info.total_beds') || watch('economic_metrics.scheme_beds') || 0;
  
  // Calculate yield
  const expectedYield = developmentCost && expectedNOI ? 
    ((expectedNOI / developmentCost) * 100).toFixed(2) : '0';
  
  // Calculate total operating costs
  const totalOperatingCosts = operatingCosts && totalBeds ? 
    operatingCosts * totalBeds : 0;

  return (
    <div className="space-y-6">
      {/* Development Costs */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Calculator className="h-5 w-5" />
            Development Economics
          </CardTitle>
          <CardDescription>
            Project costs and development metrics
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              control={control}
              name="economic_metrics.total_development_cost"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Total Development Cost</FormLabel>
                  <FormControl>
                    <Input 
                      type="number" 
                      placeholder="0"
                      {...field}
                      onChange={(e) => field.onChange(e.target.value ? parseFloat(e.target.value) : null)}
                    />
                  </FormControl>
                  {developmentCost && (
                    <FormDescription>
                      {formatCurrency(developmentCost, currency)}
                    </FormDescription>
                  )}
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={control}
              name="economic_metrics.cost_per_bed"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Cost per Bed</FormLabel>
                  <FormControl>
                    <Input 
                      type="number" 
                      placeholder="0"
                      {...field}
                      onChange={(e) => field.onChange(e.target.value ? parseFloat(e.target.value) : null)}
                    />
                  </FormControl>
                  {field.value && (
                    <FormDescription>
                      {formatCurrency(field.value, currency)}
                    </FormDescription>
                  )}
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <FormField
            control={control}
            name="economic_metrics.land_cost_percentage"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Land Cost as % of Total</FormLabel>
                <FormControl>
                  <Input 
                    type="number" 
                    placeholder="e.g., 25"
                    min={0}
                    max={100}
                    {...field}
                    onChange={(e) => field.onChange(e.target.value ? parseFloat(e.target.value) : null)}
                  />
                </FormControl>
                <FormDescription>
                  Percentage of total development cost
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={control}
            name="economic_metrics.construction_period_months"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Construction Period (months)</FormLabel>
                <FormControl>
                  <Input 
                    type="number" 
                    placeholder="e.g., 24"
                    min={0}
                    {...field}
                    onChange={(e) => field.onChange(e.target.value ? parseInt(e.target.value) : null)}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </CardContent>
      </Card>

      {/* Revenue & Yields */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <PoundSterling className="h-5 w-5" />
            Revenue & Returns
          </CardTitle>
          <CardDescription>
            Expected income and investment returns
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              control={control}
              name="economic_metrics.expected_annual_rent"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Expected Annual Rent</FormLabel>
                  <FormControl>
                    <Input 
                      type="number" 
                      placeholder="0"
                      {...field}
                      onChange={(e) => field.onChange(e.target.value ? parseFloat(e.target.value) : null)}
                    />
                  </FormControl>
                  {expectedRent && (
                    <FormDescription>
                      {formatCurrency(expectedRent, currency)}
                    </FormDescription>
                  )}
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={control}
              name="economic_metrics.average_rent_per_bed_per_week"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Average Rent per Bed/Week</FormLabel>
                  <FormControl>
                    <Input 
                      type="number" 
                      placeholder="e.g., 150"
                      {...field}
                      onChange={(e) => field.onChange(e.target.value ? parseFloat(e.target.value) : null)}
                    />
                  </FormControl>
                  {field.value && (
                    <FormDescription>
                      {formatCurrency(field.value, currency)} per week
                    </FormDescription>
                  )}
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              control={control}
              name="economic_metrics.expected_noi"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Expected Net Operating Income (NOI)</FormLabel>
                  <FormControl>
                    <Input 
                      type="number" 
                      placeholder="0"
                      {...field}
                      onChange={(e) => field.onChange(e.target.value ? parseFloat(e.target.value) : null)}
                    />
                  </FormControl>
                  {field.value && (
                    <FormDescription>
                      {formatCurrency(field.value, currency)}
                    </FormDescription>
                  )}
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={control}
              name="economic_metrics.target_yield"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Target Yield (%)</FormLabel>
                  <FormControl>
                    <Input 
                      type="number" 
                      placeholder="e.g., 6.5"
                      step={0.1}
                      {...field}
                      onChange={(e) => field.onChange(e.target.value ? parseFloat(e.target.value) : null)}
                    />
                  </FormControl>
                  <FormDescription>
                    Expected: {expectedYield}%
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <FormField
            control={control}
            name="economic_metrics.stabilized_occupancy"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Stabilized Occupancy Rate (%)</FormLabel>
                <FormControl>
                  <Input 
                    type="number" 
                    placeholder="e.g., 95"
                    min={0}
                    max={100}
                    {...field}
                    onChange={(e) => field.onChange(e.target.value ? parseFloat(e.target.value) : null)}
                  />
                </FormControl>
                <FormDescription>
                  Expected occupancy after stabilization period
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        </CardContent>
      </Card>

      {/* Operating Metrics */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <TrendingDown className="h-5 w-5" />
            Operating Costs
          </CardTitle>
          <CardDescription>
            Operational expenses and efficiency metrics
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              control={control}
              name="economic_metrics.operating_costs_per_bed"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Operating Costs per Bed/Year</FormLabel>
                  <FormControl>
                    <Input 
                      type="number" 
                      placeholder="e.g., 2500"
                      {...field}
                      onChange={(e) => field.onChange(e.target.value ? parseFloat(e.target.value) : null)}
                    />
                  </FormControl>
                  {field.value && totalBeds > 0 && (
                    <FormDescription>
                      Total: {formatCurrency(totalOperatingCosts, currency)}
                    </FormDescription>
                  )}
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={control}
              name="economic_metrics.management_fee_percentage"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Management Fee (%)</FormLabel>
                  <FormControl>
                    <Input 
                      type="number" 
                      placeholder="e.g., 5"
                      step={0.1}
                      min={0}
                      max={20}
                      {...field}
                      onChange={(e) => field.onChange(e.target.value ? parseFloat(e.target.value) : null)}
                    />
                  </FormControl>
                  <FormDescription>
                    As percentage of gross income
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <FormField
            control={control}
            name="economic_metrics.utilities_inclusion"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Utilities Inclusion</FormLabel>
                <Select value={field.value} onValueChange={field.onChange}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select utilities arrangement" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="all_inclusive">All Inclusive</SelectItem>
                    <SelectItem value="partial">Partial (Some utilities)</SelectItem>
                    <SelectItem value="tenant_pays">Tenant Pays All</SelectItem>
                    <SelectItem value="capped">Capped Usage</SelectItem>
                  </SelectContent>
                </Select>
                <FormDescription>
                  How utilities are handled in rent
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        </CardContent>
      </Card>

      {/* Market Comparisons */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Building2 className="h-5 w-5" />
            Market Comparisons
          </CardTitle>
          <CardDescription>
            How the scheme compares to market benchmarks
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <FormField
            control={control}
            name="economic_metrics.rent_vs_market"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Rent vs Market Average</FormLabel>
                <Select value={field.value} onValueChange={field.onChange}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select comparison" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="premium">Premium (+10% above)</SelectItem>
                    <SelectItem value="above_average">Above Average (5-10% above)</SelectItem>
                    <SelectItem value="market_rate">Market Rate (±5%)</SelectItem>
                    <SelectItem value="below_average">Below Average (5-10% below)</SelectItem>
                    <SelectItem value="discount">Discount (&gt;10% below)</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={control}
            name="economic_metrics.cost_vs_market"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Development Cost vs Market</FormLabel>
                <Select value={field.value} onValueChange={field.onChange}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select comparison" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="well_below">Well Below Market (&lt;80%)</SelectItem>
                    <SelectItem value="below">Below Market (80-95%)</SelectItem>
                    <SelectItem value="market">Market Rate (95-105%)</SelectItem>
                    <SelectItem value="above">Above Market (105-120%)</SelectItem>
                    <SelectItem value="well_above">Well Above Market (&gt;120%)</SelectItem>
                  </SelectContent>
                </Select>
                <FormDescription>
                  Construction costs compared to local benchmarks
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        </CardContent>
      </Card>

      {/* Exit Strategy */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Percent className="h-5 w-5" />
            Exit Strategy & Returns
          </CardTitle>
          <CardDescription>
            Investment exit assumptions and returns
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              control={control}
              name="economic_metrics.exit_cap_rate"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Exit Cap Rate (%)</FormLabel>
                  <FormControl>
                    <Input 
                      type="number" 
                      placeholder="e.g., 5.5"
                      step={0.1}
                      {...field}
                      onChange={(e) => field.onChange(e.target.value ? parseFloat(e.target.value) : null)}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={control}
              name="economic_metrics.target_irr"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Target IRR (%)</FormLabel>
                  <FormControl>
                    <Input 
                      type="number" 
                      placeholder="e.g., 15"
                      step={0.1}
                      {...field}
                      onChange={(e) => field.onChange(e.target.value ? parseFloat(e.target.value) : null)}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <FormField
            control={control}
            name="economic_metrics.hold_period_years"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Expected Hold Period (years)</FormLabel>
                <FormControl>
                  <Input 
                    type="number" 
                    placeholder="e.g., 7"
                    min={1}
                    max={30}
                    {...field}
                    onChange={(e) => field.onChange(e.target.value ? parseInt(e.target.value) : null)}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Economic Notes */}
          <FormField
            control={control}
            name="economic_metrics.notes"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Additional Economic Notes</FormLabel>
                <FormControl>
                  <textarea
                    className="flex min-h-[80px] w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    placeholder="Any additional economic assumptions, risks, or considerations..."
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </CardContent>
      </Card>
    </div>
  );
}