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
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { WizardStepProps } from '../types';
import { CreditCard, Shield, FileCheck, AlertCircle } from 'lucide-react';
import { CreditRating } from '@/lib/types/assessment.types';

export function CreditInfoStep({ data, onUpdate }: WizardStepProps) {
  const { control, watch } = useFormContext();
  
  const hasCreditDefaults = watch('credit_info.has_credit_defaults');
  const hasLegalIssues = watch('credit_info.has_legal_issues');

  return (
    <div className="space-y-6">
      {/* Credit Rating */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <CreditCard className="h-5 w-5" />
            Credit Rating
          </CardTitle>
          <CardDescription>
            Current credit rating and score information
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <FormField
            control={control}
            name="credit_info.credit_rating"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Credit Rating</FormLabel>
                <Select value={field.value} onValueChange={field.onChange}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select credit rating" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value={CreditRating.AAA}>AAA - Prime</SelectItem>
                    <SelectItem value={CreditRating.AA}>AA - High Grade</SelectItem>
                    <SelectItem value={CreditRating.A}>A - Upper Medium Grade</SelectItem>
                    <SelectItem value={CreditRating.BBB}>BBB - Lower Medium Grade</SelectItem>
                    <SelectItem value={CreditRating.BB}>BB - Non-Investment Grade</SelectItem>
                    <SelectItem value={CreditRating.B}>B - Highly Speculative</SelectItem>
                    <SelectItem value={CreditRating.CCC}>CCC - Substantial Risk</SelectItem>
                    <SelectItem value={CreditRating.CC}>CC - Very High Risk</SelectItem>
                    <SelectItem value={CreditRating.C}>C - Near Default</SelectItem>
                    <SelectItem value={CreditRating.D}>D - Default</SelectItem>
                    <SelectItem value={CreditRating.NR}>NR - Not Rated</SelectItem>
                  </SelectContent>
                </Select>
                <FormDescription>
                  Investment grade: AAA to BBB | Non-investment grade: BB and below
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              control={control}
              name="credit_info.credit_score"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Credit Score</FormLabel>
                  <FormControl>
                    <Input 
                      type="number" 
                      placeholder="e.g., 750"
                      min={300}
                      max={850}
                      {...field}
                      onChange={(e) => field.onChange(e.target.value ? parseInt(e.target.value) : null)}
                    />
                  </FormControl>
                  <FormDescription>
                    Business credit score (300-850)
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={control}
              name="credit_info.rating_agency"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Rating Agency</FormLabel>
                  <Select value={field.value} onValueChange={field.onChange}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select agency" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="moodys">Moody's</SelectItem>
                      <SelectItem value="sp">S&P Global</SelectItem>
                      <SelectItem value="fitch">Fitch Ratings</SelectItem>
                      <SelectItem value="dbrs">DBRS Morningstar</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </CardContent>
      </Card>

      {/* Credit History */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Shield className="h-5 w-5" />
            Credit History
          </CardTitle>
          <CardDescription>
            Payment history and credit defaults
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <FormField
            control={control}
            name="credit_info.has_credit_defaults"
            render={({ field }) => (
              <FormItem className="space-y-3">
                <FormLabel>Credit Defaults</FormLabel>
                <FormControl>
                  <RadioGroup
                    onValueChange={(value) => field.onChange(value === 'true')}
                    value={field.value?.toString()}
                    className="flex flex-col space-y-1"
                  >
                    <FormItem className="flex items-center space-x-3 space-y-0">
                      <FormControl>
                        <RadioGroupItem value="false" />
                      </FormControl>
                      <FormLabel className="font-normal">
                        No credit defaults in the past 5 years
                      </FormLabel>
                    </FormItem>
                    <FormItem className="flex items-center space-x-3 space-y-0">
                      <FormControl>
                        <RadioGroupItem value="true" />
                      </FormControl>
                      <FormLabel className="font-normal">
                        Has credit defaults or payment issues
                      </FormLabel>
                    </FormItem>
                  </RadioGroup>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {hasCreditDefaults && (
            <FormField
              control={control}
              name="credit_info.default_details"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Default Details</FormLabel>
                  <FormControl>
                    <textarea
                      className="flex min-h-[80px] w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                      placeholder="Provide details of credit defaults, amounts, dates, and resolution status..."
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          )}

          <FormField
            control={control}
            name="credit_info.payment_history"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Payment History</FormLabel>
                <Select value={field.value} onValueChange={field.onChange}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select payment history" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="excellent">Excellent - Always on time</SelectItem>
                    <SelectItem value="good">Good - Rarely late</SelectItem>
                    <SelectItem value="fair">Fair - Occasionally late</SelectItem>
                    <SelectItem value="poor">Poor - Frequently late</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </CardContent>
      </Card>

      {/* Banking & References */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <FileCheck className="h-5 w-5" />
            Banking & References
          </CardTitle>
          <CardDescription>
            Banking relationships and credit references
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              control={control}
              name="credit_info.primary_bank"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Primary Bank</FormLabel>
                  <FormControl>
                    <Input 
                      placeholder="e.g., HSBC, JPMorgan Chase"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={control}
              name="credit_info.banking_relationship_years"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Years with Bank</FormLabel>
                  <FormControl>
                    <Input 
                      type="number" 
                      placeholder="e.g., 10"
                      min={0}
                      {...field}
                      onChange={(e) => field.onChange(e.target.value ? parseInt(e.target.value) : null)}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <FormField
            control={control}
            name="credit_info.trade_references_count"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Trade References Available</FormLabel>
                <Select value={field.value?.toString()} onValueChange={(value) => field.onChange(parseInt(value))}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select number of references" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="0">None</SelectItem>
                    <SelectItem value="1">1 reference</SelectItem>
                    <SelectItem value="2">2 references</SelectItem>
                    <SelectItem value="3">3 references</SelectItem>
                    <SelectItem value="4">4+ references</SelectItem>
                  </SelectContent>
                </Select>
                <FormDescription>
                  Number of trade references that can verify payment history
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        </CardContent>
      </Card>

      {/* Legal & Compliance */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <AlertCircle className="h-5 w-5" />
            Legal & Compliance
          </CardTitle>
          <CardDescription>
            Legal issues and covenant compliance
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <FormField
            control={control}
            name="credit_info.has_legal_issues"
            render={({ field }) => (
              <FormItem className="space-y-3">
                <FormLabel>Legal Issues</FormLabel>
                <FormControl>
                  <RadioGroup
                    onValueChange={(value) => field.onChange(value === 'true')}
                    value={field.value?.toString()}
                    className="flex flex-col space-y-1"
                  >
                    <FormItem className="flex items-center space-x-3 space-y-0">
                      <FormControl>
                        <RadioGroupItem value="false" />
                      </FormControl>
                      <FormLabel className="font-normal">
                        No ongoing legal disputes or issues
                      </FormLabel>
                    </FormItem>
                    <FormItem className="flex items-center space-x-3 space-y-0">
                      <FormControl>
                        <RadioGroupItem value="true" />
                      </FormControl>
                      <FormLabel className="font-normal">
                        Has legal disputes or compliance issues
                      </FormLabel>
                    </FormItem>
                  </RadioGroup>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {hasLegalIssues && (
            <FormField
              control={control}
              name="credit_info.legal_issue_details"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Legal Issue Details</FormLabel>
                  <FormControl>
                    <textarea
                      className="flex min-h-[80px] w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                      placeholder="Provide details of legal disputes, compliance issues, or regulatory actions..."
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          )}

          <FormField
            control={control}
            name="credit_info.covenant_compliance"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Financial Covenant Compliance</FormLabel>
                <Select value={field.value} onValueChange={field.onChange}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select compliance status" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="full_compliance">Full Compliance</SelectItem>
                    <SelectItem value="minor_breach">Minor Breach (Waived)</SelectItem>
                    <SelectItem value="material_breach">Material Breach</SelectItem>
                    <SelectItem value="not_applicable">Not Applicable</SelectItem>
                  </SelectContent>
                </Select>
                <FormDescription>
                  Compliance with loan covenants and financial agreements
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        </CardContent>
      </Card>
    </div>
  );
}