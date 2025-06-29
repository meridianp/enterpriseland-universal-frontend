'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { addDays, format } from 'date-fns';
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { CalendarIcon } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useCreateActivity, useActivityTemplates } from '@/lib/hooks/use-leads';
import { toast } from 'sonner';
import type { ActivityType, CreateActivityInput } from '@/lib/types/leads.types';

const activitySchema = z.object({
  activity_type: z.enum(['NOTE', 'EMAIL', 'CALL', 'MEETING', 'TASK']),
  title: z.string().min(1, 'Title is required'),
  description: z.string().min(1, 'Description is required'),
  duration_minutes: z.number().optional(),
  outcome: z.string().optional(),
  next_action: z.string().optional(),
  next_action_date: z.date().optional(),
  participants: z.array(z.string()).optional(),
});

type ActivityFormData = z.infer<typeof activitySchema>;

interface ActivityDialogProps {
  leadId: string;
  onClose: () => void;
}

const ACTIVITY_TYPES: { value: ActivityType; label: string }[] = [
  { value: 'NOTE', label: 'Note' },
  { value: 'EMAIL', label: 'Email' },
  { value: 'CALL', label: 'Call' },
  { value: 'MEETING', label: 'Meeting' },
  { value: 'TASK', label: 'Task' },
];

const QUICK_DATES = [
  { label: 'Tomorrow', value: 1 },
  { label: 'In 3 days', value: 3 },
  { label: 'Next week', value: 7 },
  { label: 'In 2 weeks', value: 14 },
];

export function ActivityDialog({ leadId, onClose }: ActivityDialogProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const createActivity = useCreateActivity();
  const { data: templates } = useActivityTemplates();

  const form = useForm<ActivityFormData>({
    resolver: zodResolver(activitySchema),
    defaultValues: {
      activity_type: 'NOTE',
      title: '',
      description: '',
      duration_minutes: undefined,
      outcome: '',
      next_action: '',
      next_action_date: undefined,
      participants: [],
    },
  });

  const activityType = form.watch('activity_type');

  const handleSubmit = (data: ActivityFormData) => {
    setIsSubmitting(true);

    const activityData: CreateActivityInput = {
      lead: leadId,
      activity_type: data.activity_type as ActivityType,
      title: data.title,
      description: data.description,
      duration_minutes: data.duration_minutes,
      outcome: data.outcome,
      next_action: data.next_action,
      next_action_date: data.next_action_date?.toISOString(),
      participants: data.participants,
    };

    createActivity.mutate(activityData, {
      onSuccess: () => {
        toast.success('Activity logged successfully');
        onClose();
      },
      onError: () => {
        toast.error('Failed to log activity');
        setIsSubmitting(false);
      },
    });
  };

  const applyTemplate = (templateId: string) => {
    const template = templates?.find(t => t.id === templateId);
    if (template) {
      form.setValue('description', template.template_content);
    }
  };

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Log Activity</DialogTitle>
          <DialogDescription>
            Record an interaction or activity for this lead.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="activity_type"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Activity Type</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select activity type" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {ACTIVITY_TYPES.map(type => (
                        <SelectItem key={type.value} value={type.value}>
                          {type.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Title</FormLabel>
                  <FormControl>
                    <Input placeholder="Brief summary of the activity" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Detailed description of the activity..."
                      rows={4}
                      {...field}
                    />
                  </FormControl>
                  {templates && templates.length > 0 && (
                    <FormDescription>
                      <Select onValueChange={applyTemplate}>
                        <SelectTrigger className="w-full mt-1">
                          <SelectValue placeholder="Use a template..." />
                        </SelectTrigger>
                        <SelectContent>
                          {templates
                            .filter(t => t.activity_type === activityType)
                            .map(template => (
                              <SelectItem key={template.id} value={template.id}>
                                {template.name}
                              </SelectItem>
                            ))}
                        </SelectContent>
                      </Select>
                    </FormDescription>
                  )}
                  <FormMessage />
                </FormItem>
              )}
            />

            {(activityType === 'CALL' || activityType === 'MEETING') && (
              <FormField
                control={form.control}
                name="duration_minutes"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Duration (minutes)</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        placeholder="30"
                        {...field}
                        onChange={(e) => field.onChange(e.target.value ? parseInt(e.target.value) : undefined)}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}

            <FormField
              control={form.control}
              name="outcome"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Outcome</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., Positive, Follow-up needed, Not interested" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="next_action"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Next Action</FormLabel>
                  <FormControl>
                    <Input placeholder="What needs to happen next?" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="next_action_date"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Next Action Date</FormLabel>
                  <div className="space-y-2">
                    <FormControl>
                      <Input
                        type="date"
                        {...field}
                        value={field.value ? format(field.value, 'yyyy-MM-dd') : ''}
                        onChange={(e) => field.onChange(e.target.value ? new Date(e.target.value) : undefined)}
                        min={format(new Date(), 'yyyy-MM-dd')}
                      />
                    </FormControl>
                    <div className="grid grid-cols-4 gap-1">
                      {QUICK_DATES.map((quick) => (
                        <Button
                          key={quick.value}
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => field.onChange(addDays(new Date(), quick.value))}
                        >
                          {quick.label}
                        </Button>
                      ))}
                    </div>
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter>
              <Button type="button" variant="outline" onClick={onClose}>
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? 'Saving...' : 'Log Activity'}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}