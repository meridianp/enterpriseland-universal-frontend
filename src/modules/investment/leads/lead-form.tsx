'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { X } from 'lucide-react';
import type { CreateLeadInput, UpdateLeadInput, Lead } from '@/lib/types/leads.types';

const leadFormSchema = z.object({
  // Required fields
  company_name: z.string().min(1, 'Company name is required'),
  source: z.enum([
    'MARKET_INTELLIGENCE',
    'REFERRAL',
    'WEBSITE',
    'EVENT',
    'COLD_OUTREACH',
    'PARTNER',
    'OTHER',
  ]),
  
  // Contact information
  contact_name: z.string().optional(),
  contact_email: z.string().email('Invalid email').optional().or(z.literal('')),
  contact_phone: z.string().optional(),
  contact_title: z.string().optional(),
  
  // Lead details
  status: z.enum([
    'NEW',
    'QUALIFIED',
    'CONTACTED',
    'MEETING_SCHEDULED',
    'PROPOSAL_SENT',
    'NEGOTIATING',
    'CONVERTED',
    'LOST',
    'ON_HOLD',
  ]).optional(),
  priority: z.enum(['LOW', 'MEDIUM', 'HIGH', 'URGENT']).optional(),
  source_details: z.string().optional(),
  
  // Business information
  industry: z.string().optional(),
  company_size: z.string().optional(),
  annual_revenue: z.number().optional(),
  employee_count: z.number().optional(),
  website: z.string().url('Invalid URL').optional().or(z.literal('')),
  linkedin_url: z.string().url('Invalid URL').optional().or(z.literal('')),
  
  // Location
  country: z.string().optional(),
  city: z.string().optional(),
  
  // Other
  notes: z.string().optional(),
  tags: z.array(z.string()).optional(),
  assigned_to: z.string().optional(),
  target_company: z.string().optional(),
});

type LeadFormData = z.infer<typeof leadFormSchema>;

interface LeadFormProps {
  lead?: Lead;
  onSubmit: (data: CreateLeadInput | UpdateLeadInput) => void;
  onCancel: () => void;
  isSubmitting?: boolean;
}

export function LeadForm({ lead, onSubmit, onCancel, isSubmitting = false }: LeadFormProps) {
  const form = useForm<LeadFormData>({
    resolver: zodResolver(leadFormSchema),
    defaultValues: {
      company_name: lead?.company_name || '',
      source: lead?.source || 'OTHER',
      contact_name: lead?.contact_name || '',
      contact_email: lead?.contact_email || '',
      contact_phone: lead?.contact_phone || '',
      contact_title: lead?.contact_title || '',
      status: lead?.status || 'NEW',
      priority: lead?.priority || 'MEDIUM',
      source_details: lead?.source_details || '',
      industry: lead?.industry || '',
      company_size: lead?.company_size || '',
      annual_revenue: lead?.annual_revenue,
      employee_count: lead?.employee_count,
      website: lead?.website || '',
      linkedin_url: lead?.linkedin_url || '',
      country: lead?.country || '',
      city: lead?.city || '',
      notes: lead?.notes || '',
      tags: lead?.tags || [],
      assigned_to: lead?.assigned_to || '',
      target_company: lead?.target_company || '',
    },
  });

  const tags = form.watch('tags') || [];

  const handleSubmit = (data: LeadFormData) => {
    // Convert empty strings to undefined
    const cleanedData = Object.entries(data).reduce((acc, [key, value]) => {
      if (value === '') {
        return acc;
      }
      return { ...acc, [key]: value };
    }, {} as any);

    onSubmit(cleanedData);
  };

  const addTag = (tag: string) => {
    const currentTags = form.getValues('tags') || [];
    if (tag && !currentTags.includes(tag)) {
      form.setValue('tags', [...currentTags, tag]);
    }
  };

  const removeTag = (tagToRemove: string) => {
    const currentTags = form.getValues('tags') || [];
    form.setValue('tags', currentTags.filter(tag => tag !== tagToRemove));
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
        <Tabs defaultValue="basic" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="basic">Basic Info</TabsTrigger>
            <TabsTrigger value="contact">Contact</TabsTrigger>
            <TabsTrigger value="business">Business</TabsTrigger>
            <TabsTrigger value="additional">Additional</TabsTrigger>
          </TabsList>

          <TabsContent value="basic" className="space-y-4 mt-6">
            <FormField
              control={form.control}
              name="company_name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Company Name *</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter company name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="source"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Lead Source *</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select source" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="MARKET_INTELLIGENCE">Market Intelligence</SelectItem>
                        <SelectItem value="REFERRAL">Referral</SelectItem>
                        <SelectItem value="WEBSITE">Website</SelectItem>
                        <SelectItem value="EVENT">Event</SelectItem>
                        <SelectItem value="COLD_OUTREACH">Cold Outreach</SelectItem>
                        <SelectItem value="PARTNER">Partner</SelectItem>
                        <SelectItem value="OTHER">Other</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="source_details"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Source Details</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., Referred by John Smith" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="status"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Status</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select status" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="NEW">New</SelectItem>
                        <SelectItem value="QUALIFIED">Qualified</SelectItem>
                        <SelectItem value="CONTACTED">Contacted</SelectItem>
                        <SelectItem value="MEETING_SCHEDULED">Meeting Scheduled</SelectItem>
                        <SelectItem value="PROPOSAL_SENT">Proposal Sent</SelectItem>
                        <SelectItem value="NEGOTIATING">Negotiating</SelectItem>
                        <SelectItem value="CONVERTED">Converted</SelectItem>
                        <SelectItem value="LOST">Lost</SelectItem>
                        <SelectItem value="ON_HOLD">On Hold</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="priority"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Priority</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select priority" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="LOW">Low</SelectItem>
                        <SelectItem value="MEDIUM">Medium</SelectItem>
                        <SelectItem value="HIGH">High</SelectItem>
                        <SelectItem value="URGENT">Urgent</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </TabsContent>

          <TabsContent value="contact" className="space-y-4 mt-6">
            <FormField
              control={form.control}
              name="contact_name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Contact Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter contact name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="contact_email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Contact Email</FormLabel>
                    <FormControl>
                      <Input type="email" placeholder="email@example.com" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="contact_phone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Contact Phone</FormLabel>
                    <FormControl>
                      <Input placeholder="+1 (555) 000-0000" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="contact_title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Contact Title</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., CEO, VP of Sales" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </TabsContent>

          <TabsContent value="business" className="space-y-4 mt-6">
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="industry"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Industry</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., Technology, Healthcare" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="company_size"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Company Size</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select size" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="startup">Startup (1-10)</SelectItem>
                        <SelectItem value="small">Small (11-50)</SelectItem>
                        <SelectItem value="medium">Medium (51-200)</SelectItem>
                        <SelectItem value="large">Large (201-1000)</SelectItem>
                        <SelectItem value="enterprise">Enterprise (1000+)</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="annual_revenue"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Annual Revenue ($)</FormLabel>
                    <FormControl>
                      <Input 
                        type="number" 
                        placeholder="e.g., 1000000" 
                        {...field}
                        onChange={(e) => field.onChange(e.target.value ? parseInt(e.target.value) : undefined)}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="employee_count"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Employee Count</FormLabel>
                    <FormControl>
                      <Input 
                        type="number" 
                        placeholder="e.g., 50" 
                        {...field}
                        onChange={(e) => field.onChange(e.target.value ? parseInt(e.target.value) : undefined)}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="website"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Website</FormLabel>
                  <FormControl>
                    <Input type="url" placeholder="https://example.com" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="linkedin_url"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>LinkedIn URL</FormLabel>
                  <FormControl>
                    <Input type="url" placeholder="https://linkedin.com/company/..." {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </TabsContent>

          <TabsContent value="additional" className="space-y-4 mt-6">
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="country"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Country</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., United States" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="city"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>City</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., New York" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="notes"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Notes</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="Enter any additional notes..."
                      rows={4}
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormItem>
              <FormLabel>Tags</FormLabel>
              <div className="space-y-2">
                <div className="flex gap-2">
                  <Input
                    placeholder="Add a tag..."
                    onKeyPress={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        const input = e.target as HTMLInputElement;
                        addTag(input.value);
                        input.value = '';
                      }
                    }}
                  />
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => {
                      const input = document.querySelector('input[placeholder="Add a tag..."]') as HTMLInputElement;
                      if (input?.value) {
                        addTag(input.value);
                        input.value = '';
                      }
                    }}
                  >
                    Add
                  </Button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {tags.map((tag) => (
                    <Badge key={tag} variant="secondary" className="gap-1">
                      {tag}
                      <X
                        className="h-3 w-3 cursor-pointer"
                        onClick={() => removeTag(tag)}
                      />
                    </Badge>
                  ))}
                </div>
              </div>
            </FormItem>
          </TabsContent>
        </Tabs>

        <div className="flex justify-end gap-2 pt-4">
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancel
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? 'Saving...' : lead ? 'Update Lead' : 'Create Lead'}
          </Button>
        </div>
      </form>
    </Form>
  );
}