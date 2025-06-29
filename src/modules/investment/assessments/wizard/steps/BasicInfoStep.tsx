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
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Card, CardContent } from "@/components/ui/card";
import { WizardStepProps } from '../types';
import { Building2, FileText } from 'lucide-react';

export function BasicInfoStep({ data, onUpdate }: WizardStepProps) {
  const { control } = useFormContext();

  return (
    <div className="space-y-6">
      {/* Assessment Type Selection */}
      <FormField
        control={control}
        name="type"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Assessment Type</FormLabel>
            <FormControl>
              <RadioGroup
                value={field.value || 'partner'}
                onValueChange={field.onChange}
                className="grid grid-cols-1 md:grid-cols-2 gap-4"
              >
                <Card className="cursor-pointer hover:border-primary transition-colors">
                  <CardContent className="p-4">
                    <label htmlFor="partner" className="cursor-pointer">
                      <RadioGroupItem value="partner" id="partner" className="sr-only" />
                      <div className="flex items-start space-x-3">
                        <Building2 className="h-5 w-5 text-muted-foreground mt-0.5" />
                        <div className="flex-1">
                          <h4 className="font-medium">Development Partner</h4>
                          <p className="text-sm text-muted-foreground mt-1">
                            Assess a property development company or investment partner
                          </p>
                        </div>
                      </div>
                    </label>
                  </CardContent>
                </Card>

                <Card className="cursor-pointer hover:border-primary transition-colors">
                  <CardContent className="p-4">
                    <label htmlFor="scheme" className="cursor-pointer">
                      <RadioGroupItem value="scheme" id="scheme" className="sr-only" />
                      <div className="flex items-start space-x-3">
                        <FileText className="h-5 w-5 text-muted-foreground mt-0.5" />
                        <div className="flex-1">
                          <h4 className="font-medium">PBSA Scheme</h4>
                          <p className="text-sm text-muted-foreground mt-1">
                            Assess a Purpose-Built Student Accommodation project
                          </p>
                        </div>
                      </div>
                    </label>
                  </CardContent>
                </Card>
              </RadioGroup>
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      {/* Assessment Name */}
      <FormField
        control={control}
        name="name"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Assessment Name</FormLabel>
            <FormControl>
              <Input 
                placeholder="e.g., Q4 2024 Partner Review - ABC Developments" 
                {...field}
              />
            </FormControl>
            <FormDescription>
              A descriptive name to identify this assessment
            </FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />

      {/* Description */}
      <FormField
        control={control}
        name="description"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Description</FormLabel>
            <FormControl>
              <Textarea 
                placeholder="Provide context for this assessment..."
                rows={4}
                {...field}
              />
            </FormControl>
            <FormDescription>
              Include the purpose, scope, and any special considerations
            </FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />

      {/* Assessment Period */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <FormField
          control={control}
          name="assessment_date"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Assessment Date</FormLabel>
              <FormControl>
                <Input 
                  type="date"
                  {...field}
                  value={field.value || new Date().toISOString().split('T')[0]}
                />
              </FormControl>
              <FormDescription>
                Date this assessment is being conducted
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={control}
          name="review_period"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Review Period</FormLabel>
              <FormControl>
                <Input 
                  placeholder="e.g., Q4 2024"
                  {...field}
                />
              </FormControl>
              <FormDescription>
                Period covered by this assessment
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
    </div>
  );
}