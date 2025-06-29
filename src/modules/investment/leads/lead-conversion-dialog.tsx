'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import type { Lead, LeadConversionInput } from '@/lib/types/leads.types';

const conversionSchema = z.object({
  notes: z.string().optional(),
  conversionType: z.enum(['partner', 'assessment', 'both']),
  createPartner: z.boolean(),
  partnerName: z.string().optional(),
  partnerType: z.string().optional(),
  createAssessment: z.boolean(),
  assessmentTitle: z.string().optional(),
  assessmentType: z.string().optional(),
});

type ConversionFormData = z.infer<typeof conversionSchema>;

interface LeadConversionDialogProps {
  lead: Lead;
  onClose: () => void;
  onConvert: (data: LeadConversionInput) => void;
}

export function LeadConversionDialog({ lead, onClose, onConvert }: LeadConversionDialogProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<ConversionFormData>({
    resolver: zodResolver(conversionSchema),
    defaultValues: {
      notes: '',
      conversionType: 'partner',
      createPartner: true,
      partnerName: lead.company_name,
      partnerType: 'DEVELOPER',
      createAssessment: false,
      assessmentTitle: `${lead.company_name} Initial Assessment`,
      assessmentType: 'INITIAL',
    },
  });

  const conversionType = form.watch('conversionType');

  const handleSubmit = (data: ConversionFormData) => {
    setIsSubmitting(true);
    
    const conversionData: LeadConversionInput = {
      notes: data.notes,
      create_partner: data.conversionType === 'partner' || data.conversionType === 'both',
      create_assessment: data.conversionType === 'assessment' || data.conversionType === 'both',
    };

    if (conversionData.create_partner) {
      conversionData.partner_data = {
        name: data.partnerName,
        type: data.partnerType,
        contact_person: lead.contact_name,
      };
    }

    if (conversionData.create_assessment) {
      conversionData.assessment_data = {
        title: data.assessmentTitle,
        type: data.assessmentType,
      };
    }

    onConvert(conversionData);
  };

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Convert Lead</DialogTitle>
          <DialogDescription>
            Convert &quot;{lead.company_name}&quot; to a development partner and/or create an assessment.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="conversionType"
              render={({ field }) => (
                <FormItem className="space-y-3">
                  <FormLabel>Conversion Type</FormLabel>
                  <FormControl>
                    <RadioGroup
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                      className="flex flex-col space-y-1"
                    >
                      <FormItem className="flex items-center space-x-3 space-y-0">
                        <FormControl>
                          <RadioGroupItem value="partner" />
                        </FormControl>
                        <FormLabel className="font-normal">
                          Create Development Partner
                        </FormLabel>
                      </FormItem>
                      <FormItem className="flex items-center space-x-3 space-y-0">
                        <FormControl>
                          <RadioGroupItem value="assessment" />
                        </FormControl>
                        <FormLabel className="font-normal">
                          Create Assessment Only
                        </FormLabel>
                      </FormItem>
                      <FormItem className="flex items-center space-x-3 space-y-0">
                        <FormControl>
                          <RadioGroupItem value="both" />
                        </FormControl>
                        <FormLabel className="font-normal">
                          Create Both Partner and Assessment
                        </FormLabel>
                      </FormItem>
                    </RadioGroup>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {(conversionType === 'partner' || conversionType === 'both') && (
              <div className="space-y-4 border rounded-lg p-4">
                <h4 className="font-medium">Partner Details</h4>
                
                <FormField
                  control={form.control}
                  name="partnerName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Partner Name</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="partnerType"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Partner Type</FormLabel>
                      <FormControl>
                        <RadioGroup
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                          className="flex flex-row space-x-4"
                        >
                          <FormItem className="flex items-center space-x-2 space-y-0">
                            <FormControl>
                              <RadioGroupItem value="DEVELOPER" />
                            </FormControl>
                            <FormLabel className="font-normal">Developer</FormLabel>
                          </FormItem>
                          <FormItem className="flex items-center space-x-2 space-y-0">
                            <FormControl>
                              <RadioGroupItem value="INVESTOR" />
                            </FormControl>
                            <FormLabel className="font-normal">Investor</FormLabel>
                          </FormItem>
                          <FormItem className="flex items-center space-x-2 space-y-0">
                            <FormControl>
                              <RadioGroupItem value="OPERATOR" />
                            </FormControl>
                            <FormLabel className="font-normal">Operator</FormLabel>
                          </FormItem>
                        </RadioGroup>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            )}

            {(conversionType === 'assessment' || conversionType === 'both') && (
              <div className="space-y-4 border rounded-lg p-4">
                <h4 className="font-medium">Assessment Details</h4>
                
                <FormField
                  control={form.control}
                  name="assessmentTitle"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Assessment Title</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="assessmentType"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Assessment Type</FormLabel>
                      <FormControl>
                        <RadioGroup
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                          className="flex flex-row space-x-4"
                        >
                          <FormItem className="flex items-center space-x-2 space-y-0">
                            <FormControl>
                              <RadioGroupItem value="INITIAL" />
                            </FormControl>
                            <FormLabel className="font-normal">Initial</FormLabel>
                          </FormItem>
                          <FormItem className="flex items-center space-x-2 space-y-0">
                            <FormControl>
                              <RadioGroupItem value="FOLLOW_UP" />
                            </FormControl>
                            <FormLabel className="font-normal">Follow-up</FormLabel>
                          </FormItem>
                          <FormItem className="flex items-center space-x-2 space-y-0">
                            <FormControl>
                              <RadioGroupItem value="FINAL" />
                            </FormControl>
                            <FormLabel className="font-normal">Final</FormLabel>
                          </FormItem>
                        </RadioGroup>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            )}

            <FormField
              control={form.control}
              name="notes"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Conversion Notes</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Add any notes about this conversion..."
                      rows={3}
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    These notes will be added to the lead&apos;s activity timeline.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter>
              <Button type="button" variant="outline" onClick={onClose}>
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? 'Converting...' : 'Convert Lead'}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}