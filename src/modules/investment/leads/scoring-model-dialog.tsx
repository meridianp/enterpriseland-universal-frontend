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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { useCreateScoringModel } from '@/lib/hooks/use-leads';
import { toast } from 'sonner';
import type { ScoringModelType } from '@/lib/types/leads.types';

const modelSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  description: z.string().min(1, 'Description is required'),
  model_type: z.enum(['WEIGHTED_AVERAGE', 'NEURAL_NETWORK', 'DECISION_TREE', 'ENSEMBLE']),
  weights: z.object({
    business_alignment: z.number().min(0).max(1),
    market_presence: z.number().min(0).max(1),
    financial_strength: z.number().min(0).max(1),
    strategic_fit: z.number().min(0).max(1),
    engagement_level: z.number().min(0).max(1),
  }),
  thresholds: z.object({
    qualified: z.number().min(0).max(100),
    hot: z.number().min(0).max(100),
  }),
});

type ModelFormData = z.infer<typeof modelSchema>;

interface ScoringModelDialogProps {
  onClose: () => void;
}

const FEATURE_DESCRIPTIONS = {
  business_alignment: 'How well the lead aligns with your target business profile',
  market_presence: 'Market size, growth potential, and competitive position',
  financial_strength: 'Revenue, funding, and financial stability indicators',
  strategic_fit: 'Alignment with your strategic goals and partnerships',
  engagement_level: 'Responsiveness and interest shown in communications',
};

export function ScoringModelDialog({ onClose }: ScoringModelDialogProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const createModel = useCreateScoringModel();

  const form = useForm<ModelFormData>({
    resolver: zodResolver(modelSchema),
    defaultValues: {
      name: '',
      description: '',
      model_type: 'WEIGHTED_AVERAGE',
      weights: {
        business_alignment: 0.25,
        market_presence: 0.20,
        financial_strength: 0.20,
        strategic_fit: 0.20,
        engagement_level: 0.15,
      },
      thresholds: {
        qualified: 60,
        hot: 80,
      },
    },
  });

  const weights = form.watch('weights');
  const totalWeight = Object.values(weights).reduce((sum, w) => sum + w, 0);

  const handleSubmit = (data: ModelFormData) => {
    if (Math.abs(totalWeight - 1.0) > 0.01) {
      toast.error('Weights must sum to 100%');
      return;
    }

    setIsSubmitting(true);
    
    createModel.mutate(
      {
        name: data.name,
        description: data.description,
        model_type: data.model_type,
        parameters: {
          weights: data.weights,
          thresholds: data.thresholds,
          features: Object.keys(data.weights),
        },
      },
      {
        onSuccess: () => {
          toast.success('Scoring model created successfully');
          onClose();
        },
        onError: () => {
          toast.error('Failed to create scoring model');
          setIsSubmitting(false);
        },
      }
    );
  };

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[700px]">
        <DialogHeader>
          <DialogTitle>Create Scoring Model</DialogTitle>
          <DialogDescription>
            Define a new lead scoring model with custom weights and thresholds.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Model Name</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., Q4 2024 Enterprise Model" {...field} />
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
                      placeholder="Describe the purpose and approach of this model..."
                      rows={3}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="model_type"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Model Type</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select model type" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="WEIGHTED_AVERAGE">Weighted Average</SelectItem>
                      <SelectItem value="NEURAL_NETWORK">Neural Network</SelectItem>
                      <SelectItem value="DECISION_TREE">Decision Tree</SelectItem>
                      <SelectItem value="ENSEMBLE">Ensemble</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormDescription>
                    The algorithm used to calculate lead scores
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h4 className="text-sm font-medium">Feature Weights</h4>
                <span className={`text-sm ${Math.abs(totalWeight - 1.0) > 0.01 ? 'text-red-600' : 'text-green-600'}`}>
                  Total: {(totalWeight * 100).toFixed(0)}%
                </span>
              </div>

              {Object.entries(weights).map(([feature, weight]) => (
                <FormField
                  key={feature}
                  control={form.control}
                  name={`weights.${feature as keyof typeof weights}`}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="capitalize">
                        {feature.replace(/_/g, ' ')}
                      </FormLabel>
                      <div className="flex items-center gap-4">
                        <FormControl>
                          <Slider
                            value={[field.value * 100]}
                            onValueChange={(v) => field.onChange(v[0] / 100)}
                            max={100}
                            step={5}
                            className="flex-1"
                          />
                        </FormControl>
                        <span className="w-12 text-right text-sm font-medium">
                          {(field.value * 100).toFixed(0)}%
                        </span>
                      </div>
                      <FormDescription className="text-xs">
                        {FEATURE_DESCRIPTIONS[feature as keyof typeof FEATURE_DESCRIPTIONS]}
                      </FormDescription>
                    </FormItem>
                  )}
                />
              ))}
            </div>

            <div className="space-y-4">
              <h4 className="text-sm font-medium">Score Thresholds</h4>
              
              <FormField
                control={form.control}
                name="thresholds.qualified"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Qualified Lead Threshold</FormLabel>
                    <div className="flex items-center gap-4">
                      <FormControl>
                        <Slider
                          value={[field.value]}
                          onValueChange={(v) => field.onChange(v[0])}
                          max={100}
                          step={5}
                          className="flex-1"
                        />
                      </FormControl>
                      <span className="w-12 text-right text-sm font-medium">
                        {field.value}
                      </span>
                    </div>
                    <FormDescription>
                      Minimum score for a lead to be considered qualified
                    </FormDescription>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="thresholds.hot"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Hot Lead Threshold</FormLabel>
                    <div className="flex items-center gap-4">
                      <FormControl>
                        <Slider
                          value={[field.value]}
                          onValueChange={(v) => field.onChange(v[0])}
                          max={100}
                          step={5}
                          className="flex-1"
                        />
                      </FormControl>
                      <span className="w-12 text-right text-sm font-medium">
                        {field.value}
                      </span>
                    </div>
                    <FormDescription>
                      Minimum score for a lead to be considered hot/high-priority
                    </FormDescription>
                  </FormItem>
                )}
              />
            </div>

            <DialogFooter>
              <Button type="button" variant="outline" onClick={onClose}>
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting || Math.abs(totalWeight - 1.0) > 0.01}>
                {isSubmitting ? 'Creating...' : 'Create Model'}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}