'use client';

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { X, MapPin, Target, TrendingUp } from 'lucide-react';

const geographicFiltersSchema = z.object({
  // Geographic Score Filters
  geographic_score_min: z.number().min(0).max(100).optional(),
  geographic_score_max: z.number().min(0).max(100).optional(),
  accessibility_score_min: z.number().min(0).max(100).optional(),
  accessibility_score_max: z.number().min(0).max(100).optional(),
  university_proximity_score_min: z.number().min(0).max(100).optional(),
  university_proximity_score_max: z.number().min(0).max(100).optional(),
  market_demand_score_min: z.number().min(0).max(100).optional(),
  competition_score_min: z.number().min(0).max(100).optional(),
  
  // Location-based Filters
  near_latitude: z.number().optional(),
  near_longitude: z.number().optional(),
  radius_km: z.number().min(1).max(50).optional(),
  
  // Neighborhood and University Filters
  neighborhood_name: z.string().optional(),
  university_name: z.string().optional(),
  
  // Status Filters
  has_geographic_data: z.boolean().optional(),
  needs_geographic_update: z.boolean().optional(),
  
  // Predefined Filters
  filter_type: z.string().optional(),
});

type GeographicFiltersData = z.infer<typeof geographicFiltersSchema>;

interface GeographicFiltersPanelProps {
  onFiltersChange: (filters: GeographicFiltersData) => void;
  currentFilters: GeographicFiltersData;
}

const PREDEFINED_FILTERS = [
  { value: 'high_geographic_score', label: 'High Geographic Score (≥80)', icon: <TrendingUp className="h-4 w-4" /> },
  { value: 'excellent_accessibility', label: 'Excellent Accessibility (≥85)', icon: <MapPin className="h-4 w-4" /> },
  { value: 'university_proximity', label: 'Close to Universities (≥90)', icon: <Target className="h-4 w-4" /> },
  { value: 'high_demand_markets', label: 'High Demand Markets (≥80)', icon: <TrendingUp className="h-4 w-4" /> },
  { value: 'low_competition', label: 'Low Competition (≥75)', icon: <Target className="h-4 w-4" /> },
  { value: 'needs_geo_update', label: 'Needs Geographic Update', icon: <MapPin className="h-4 w-4" /> },
  { value: 'geo_complete', label: 'Complete Geographic Analysis', icon: <Target className="h-4 w-4" /> },
];

export function GeographicFiltersPanel({ onFiltersChange, currentFilters }: GeographicFiltersPanelProps) {
  const [activeFilters, setActiveFilters] = useState<string[]>([]);
  const [showAdvanced, setShowAdvanced] = useState(false);

  const form = useForm<GeographicFiltersData>({
    resolver: zodResolver(geographicFiltersSchema),
    defaultValues: currentFilters,
  });

  const { watch, setValue, reset, handleSubmit } = form;
  const watchedValues = watch();

  // Update active filters display
  useEffect(() => {
    const active = [];
    
    if (watchedValues.geographic_score_min || watchedValues.geographic_score_max) {
      active.push(`Geographic Score: ${watchedValues.geographic_score_min || 0}-${watchedValues.geographic_score_max || 100}`);
    }
    
    if (watchedValues.accessibility_score_min) {
      active.push(`Accessibility: ≥${watchedValues.accessibility_score_min}`);
    }
    
    if (watchedValues.university_proximity_score_min) {
      active.push(`University Proximity: ≥${watchedValues.university_proximity_score_min}`);
    }
    
    if (watchedValues.market_demand_score_min) {
      active.push(`Market Demand: ≥${watchedValues.market_demand_score_min}`);
    }
    
    if (watchedValues.competition_score_min) {
      active.push(`Competition: ≥${watchedValues.competition_score_min}`);
    }
    
    if (watchedValues.near_latitude && watchedValues.near_longitude) {
      active.push(`Location: ${watchedValues.near_latitude.toFixed(3)}, ${watchedValues.near_longitude.toFixed(3)} (${watchedValues.radius_km || 10}km)`);
    }
    
    if (watchedValues.neighborhood_name) {
      active.push(`Neighborhood: ${watchedValues.neighborhood_name}`);
    }
    
    if (watchedValues.university_name) {
      active.push(`University: ${watchedValues.university_name}`);
    }
    
    if (watchedValues.has_geographic_data) {
      active.push('Has Geographic Data');
    }
    
    if (watchedValues.needs_geographic_update) {
      active.push('Needs Update');
    }
    
    if (watchedValues.filter_type) {
      const predefined = PREDEFINED_FILTERS.find(f => f.value === watchedValues.filter_type);
      if (predefined) {
        active.push(`Preset: ${predefined.label}`);
      }
    }
    
    setActiveFilters(active);
  }, [watchedValues]);

  const onSubmit = (data: GeographicFiltersData) => {
    onFiltersChange(data);
  };

  const handlePredefinedFilter = (filterType: string) => {
    setValue('filter_type', filterType);
    // Clear other filters when using predefined
    setValue('geographic_score_min', undefined);
    setValue('geographic_score_max', undefined);
    setValue('accessibility_score_min', undefined);
    setValue('university_proximity_score_min', undefined);
    setValue('market_demand_score_min', undefined);
    setValue('competition_score_min', undefined);
    
    handleSubmit(onSubmit)();
  };

  const clearFilters = () => {
    reset();
    onFiltersChange({});
  };

  const removeFilter = (filterIndex: number) => {
    // This would implement logic to remove specific filters
    // For now, we'll just clear all filters
    clearFilters();
  };

  return (
    <div className="space-y-6">
      {/* Active Filters Display */}
      {activeFilters.length > 0 && (
        <div className="flex flex-wrap gap-2">
          <Label className="text-sm font-medium text-charcoal">Active Filters:</Label>
          {activeFilters.map((filter, index) => (
            <Badge 
              key={index} 
              variant="outline" 
              className="text-deep-blue bg-deep-blue/10 flex items-center space-x-1"
            >
              <span>{filter}</span>
              <button 
                onClick={() => removeFilter(index)}
                className="ml-1 hover:text-orange"
              >
                <X className="h-3 w-3" />
              </button>
            </Badge>
          ))}
          <Button 
            size="sm" 
            variant="ghost" 
            onClick={clearFilters}
            className="text-orange hover:text-orange/80"
          >
            Clear All
          </Button>
        </div>
      )}

      {/* Predefined Filters */}
      <div className="space-y-3">
        <Label className="text-sm font-medium text-charcoal">Quick Filters</Label>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
          {PREDEFINED_FILTERS.map((filter) => (
            <Button
              key={filter.value}
              variant={watchedValues.filter_type === filter.value ? "default" : "outline"}
              size="sm"
              onClick={() => handlePredefinedFilter(filter.value)}
              className="flex items-center space-x-2 text-xs"
            >
              {filter.icon}
              <span className="truncate">{filter.label.split(' (')[0]}</span>
            </Button>
          ))}
        </div>
      </div>

      {/* Advanced Filters Toggle */}
      <div className="flex items-center space-x-2">
        <Switch
          checked={showAdvanced}
          onCheckedChange={setShowAdvanced}
          id="advanced-filters"
        />
        <Label htmlFor="advanced-filters" className="text-sm text-charcoal">
          Advanced Filters
        </Label>
      </div>

      {/* Advanced Filters */}
      {showAdvanced && (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            
            {/* Geographic Score Range */}
            <Card className="p-4 bg-white border-turquoise/20">
              <div className="space-y-3">
                <Label className="text-sm font-medium text-charcoal">Geographic Score Range</Label>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <Label htmlFor="geo-min" className="text-xs text-muted-foreground">Min</Label>
                    <Input
                      id="geo-min"
                      type="number"
                      min="0"
                      max="100"
                      placeholder="0"
                      {...form.register('geographic_score_min', { valueAsNumber: true })}
                    />
                  </div>
                  <div>
                    <Label htmlFor="geo-max" className="text-xs text-muted-foreground">Max</Label>
                    <Input
                      id="geo-max"
                      type="number"
                      min="0"
                      max="100"
                      placeholder="100"
                      {...form.register('geographic_score_max', { valueAsNumber: true })}
                    />
                  </div>
                </div>
              </div>
            </Card>

            {/* Accessibility Score */}
            <Card className="p-4 bg-white border-turquoise/20">
              <div className="space-y-3">
                <Label className="text-sm font-medium text-charcoal">Min Accessibility Score</Label>
                <div className="space-y-2">
                  <Slider
                    value={[watchedValues.accessibility_score_min || 0]}
                    onValueChange={(value) => setValue('accessibility_score_min', value[0])}
                    max={100}
                    step={5}
                    className="w-full"
                  />
                  <div className="text-center text-sm text-muted-foreground">
                    {watchedValues.accessibility_score_min || 0}
                  </div>
                </div>
              </div>
            </Card>

            {/* University Proximity */}
            <Card className="p-4 bg-white border-turquoise/20">
              <div className="space-y-3">
                <Label className="text-sm font-medium text-charcoal">Min University Proximity</Label>
                <div className="space-y-2">
                  <Slider
                    value={[watchedValues.university_proximity_score_min || 0]}
                    onValueChange={(value) => setValue('university_proximity_score_min', value[0])}
                    max={100}
                    step={5}
                    className="w-full"
                  />
                  <div className="text-center text-sm text-muted-foreground">
                    {watchedValues.university_proximity_score_min || 0}
                  </div>
                </div>
              </div>
            </Card>

            {/* Market Demand */}
            <Card className="p-4 bg-white border-turquoise/20">
              <div className="space-y-3">
                <Label className="text-sm font-medium text-charcoal">Min Market Demand</Label>
                <div className="space-y-2">
                  <Slider
                    value={[watchedValues.market_demand_score_min || 0]}
                    onValueChange={(value) => setValue('market_demand_score_min', value[0])}
                    max={100}
                    step={5}
                    className="w-full"
                  />
                  <div className="text-center text-sm text-muted-foreground">
                    {watchedValues.market_demand_score_min || 0}
                  </div>
                </div>
              </div>
            </Card>

            {/* Competition Score */}
            <Card className="p-4 bg-white border-turquoise/20">
              <div className="space-y-3">
                <Label className="text-sm font-medium text-charcoal">Min Competition Score</Label>
                <div className="space-y-2">
                  <Slider
                    value={[watchedValues.competition_score_min || 0]}
                    onValueChange={(value) => setValue('competition_score_min', value[0])}
                    max={100}
                    step={5}
                    className="w-full"
                  />
                  <div className="text-center text-sm text-muted-foreground">
                    {watchedValues.competition_score_min || 0}
                  </div>
                </div>
              </div>
            </Card>

            {/* Location-based Filter */}
            <Card className="p-4 bg-white border-turquoise/20">
              <div className="space-y-3">
                <Label className="text-sm font-medium text-charcoal">Location Search</Label>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <Label htmlFor="lat" className="text-xs text-muted-foreground">Latitude</Label>
                    <Input
                      id="lat"
                      type="number"
                      step="0.000001"
                      placeholder="51.5074"
                      {...form.register('near_latitude', { valueAsNumber: true })}
                    />
                  </div>
                  <div>
                    <Label htmlFor="lng" className="text-xs text-muted-foreground">Longitude</Label>
                    <Input
                      id="lng"
                      type="number"
                      step="0.000001"
                      placeholder="-0.1278"
                      {...form.register('near_longitude', { valueAsNumber: true })}
                    />
                  </div>
                </div>
                <div>
                  <Label htmlFor="radius" className="text-xs text-muted-foreground">Radius (km)</Label>
                  <Input
                    id="radius"
                    type="number"
                    min="1"
                    max="50"
                    placeholder="10"
                    {...form.register('radius_km', { valueAsNumber: true })}
                  />
                </div>
              </div>
            </Card>

          </div>

          {/* Text Filters */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="neighborhood" className="text-sm font-medium text-charcoal">Neighborhood Name</Label>
              <Input
                id="neighborhood"
                placeholder="Search neighborhoods..."
                {...form.register('neighborhood_name')}
              />
            </div>
            <div>
              <Label htmlFor="university" className="text-sm font-medium text-charcoal">University Name</Label>
              <Input
                id="university"
                placeholder="Search universities..."
                {...form.register('university_name')}
              />
            </div>
          </div>

          {/* Boolean Filters */}
          <div className="flex items-center space-x-6">
            <div className="flex items-center space-x-2">
              <Switch
                checked={watchedValues.has_geographic_data || false}
                onCheckedChange={(checked) => setValue('has_geographic_data', checked)}
                id="has-geo-data"
              />
              <Label htmlFor="has-geo-data" className="text-sm text-charcoal">
                Has Geographic Data
              </Label>
            </div>
            <div className="flex items-center space-x-2">
              <Switch
                checked={watchedValues.needs_geographic_update || false}
                onCheckedChange={(checked) => setValue('needs_geographic_update', checked)}
                id="needs-update"
              />
              <Label htmlFor="needs-update" className="text-sm text-charcoal">
                Needs Geographic Update
              </Label>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center space-x-3">
            <Button type="submit" className="bg-deep-blue hover:bg-deep-blue/90">
              Apply Filters
            </Button>
            <Button type="button" variant="outline" onClick={clearFilters}>
              Clear All
            </Button>
          </div>
        </form>
      )}
    </div>
  );
}