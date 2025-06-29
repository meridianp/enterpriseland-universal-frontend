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
import { DollarSign, TrendingUp, Percent, Calendar } from 'lucide-react';
import { Currency, DebtRatioCategory } from '@/lib/types/assessment.types';
import { formatCurrency } from '@/lib/utils';

export function FinancialInfoStep({ data, onUpdate }: WizardStepProps) {
  const { control, watch } = useFormContext();
  
  // Watch currency to format values correctly
  const currency = watch('financial_info.currency') || Currency.USD;
  const revenue = watch('financial_info.revenue');
  const ebitda = watch('financial_info.ebitda');
  const totalDebt = watch('financial_info.total_debt');
  const netWorth = watch('financial_info.net_worth');

  // Calculate ratios
  const ebitdaMargin = revenue && ebitda ? ((ebitda / revenue) * 100).toFixed(1) : '0';
  const debtToEquity = netWorth && totalDebt ? (totalDebt / netWorth).toFixed(2) : '0';

  return (
    <div className="space-y-6">
      {/* Financial Year */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            Reporting Period
          </CardTitle>
          <CardDescription>
            Specify the financial year for this assessment
          </CardDescription>
        </CardHeader>
        <CardContent>
          <FormField
            control={control}
            name="financial_info.financial_year"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Financial Year</FormLabel>
                <FormControl>
                  <Input 
                    type="number" 
                    placeholder={new Date().getFullYear().toString()}
                    {...field}
                    onChange={(e) => field.onChange(e.target.value ? parseInt(e.target.value) : null)}
                  />
                </FormControl>
                <FormDescription>
                  Year ending for the financial data provided
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        </CardContent>
      </Card>

      {/* Revenue & Profitability */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            Revenue & Profitability
          </CardTitle>
          <CardDescription>
            Annual revenue and EBITDA figures
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Currency Selection */}
          <FormField
            control={control}
            name="financial_info.currency"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Currency</FormLabel>
                <Select value={field.value || Currency.USD} onValueChange={field.onChange}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select currency" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value={Currency.USD}>USD - US Dollar</SelectItem>
                    <SelectItem value={Currency.EUR}>EUR - Euro</SelectItem>
                    <SelectItem value={Currency.GBP}>GBP - British Pound</SelectItem>
                    <SelectItem value={Currency.JPY}>JPY - Japanese Yen</SelectItem>
                    <SelectItem value={Currency.AUD}>AUD - Australian Dollar</SelectItem>
                    <SelectItem value={Currency.CAD}>CAD - Canadian Dollar</SelectItem>
                    <SelectItem value={Currency.CHF}>CHF - Swiss Franc</SelectItem>
                    <SelectItem value={Currency.CNY}>CNY - Chinese Yuan</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Revenue */}
            <FormField
              control={control}
              name="financial_info.revenue"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Annual Revenue</FormLabel>
                  <FormControl>
                    <Input 
                      type="number" 
                      placeholder="0"
                      {...field}
                      onChange={(e) => field.onChange(e.target.value ? parseFloat(e.target.value) : null)}
                    />
                  </FormControl>
                  {revenue && (
                    <FormDescription>
                      {formatCurrency(revenue, currency)}
                    </FormDescription>
                  )}
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* EBITDA */}
            <FormField
              control={control}
              name="financial_info.ebitda"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>EBITDA</FormLabel>
                  <FormControl>
                    <Input 
                      type="number" 
                      placeholder="0"
                      {...field}
                      onChange={(e) => field.onChange(e.target.value ? parseFloat(e.target.value) : null)}
                    />
                  </FormControl>
                  {ebitda && (
                    <FormDescription>
                      {formatCurrency(ebitda, currency)} ({ebitdaMargin}% margin)
                    </FormDescription>
                  )}
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </CardContent>
      </Card>

      {/* Debt & Equity */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <DollarSign className="h-5 w-5" />
            Balance Sheet Metrics
          </CardTitle>
          <CardDescription>
            Debt levels and equity position
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Total Debt */}
            <FormField
              control={control}
              name="financial_info.total_debt"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Total Debt</FormLabel>
                  <FormControl>
                    <Input 
                      type="number" 
                      placeholder="0"
                      {...field}
                      onChange={(e) => field.onChange(e.target.value ? parseFloat(e.target.value) : null)}
                    />
                  </FormControl>
                  {totalDebt && (
                    <FormDescription>
                      {formatCurrency(totalDebt, currency)}
                    </FormDescription>
                  )}
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Net Worth */}
            <FormField
              control={control}
              name="financial_info.net_worth"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Net Worth / Equity</FormLabel>
                  <FormControl>
                    <Input 
                      type="number" 
                      placeholder="0"
                      {...field}
                      onChange={(e) => field.onChange(e.target.value ? parseFloat(e.target.value) : null)}
                    />
                  </FormControl>
                  {netWorth && (
                    <FormDescription>
                      {formatCurrency(netWorth, currency)}
                    </FormDescription>
                  )}
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          {/* Debt Ratio Category */}
          <FormField
            control={control}
            name="financial_info.debt_ratio_category"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Debt Ratio Assessment</FormLabel>
                <Select value={field.value} onValueChange={field.onChange}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select debt ratio category" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value={DebtRatioCategory.LOW}>Low (&lt; 30%)</SelectItem>
                    <SelectItem value={DebtRatioCategory.MODERATE}>Moderate (30-50%)</SelectItem>
                    <SelectItem value={DebtRatioCategory.HIGH}>High (50-70%)</SelectItem>
                    <SelectItem value={DebtRatioCategory.VERY_HIGH}>Very High (&gt; 70%)</SelectItem>
                  </SelectContent>
                </Select>
                <FormDescription>
                  Debt-to-Equity Ratio: {debtToEquity}x
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        </CardContent>
      </Card>

      {/* Funding Sources */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Percent className="h-5 w-5" />
            Funding Sources
          </CardTitle>
          <CardDescription>
            Primary sources of funding and capital
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              control={control}
              name="financial_info.primary_funding_source"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Primary Funding Source</FormLabel>
                  <FormControl>
                    <Input 
                      placeholder="e.g., Bank loans, Private equity"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={control}
              name="financial_info.funding_diversification"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Funding Diversification</FormLabel>
                  <Select value={field.value} onValueChange={field.onChange}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select diversification level" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="single">Single Source</SelectItem>
                      <SelectItem value="limited">Limited (2-3 sources)</SelectItem>
                      <SelectItem value="moderate">Moderate (4-5 sources)</SelectItem>
                      <SelectItem value="high">High (6+ sources)</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          {/* Additional Financial Notes */}
          <FormField
            control={control}
            name="financial_info.notes"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Additional Financial Notes</FormLabel>
                <FormControl>
                  <textarea
                    className="flex min-h-[80px] w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    placeholder="Any additional financial information or context..."
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