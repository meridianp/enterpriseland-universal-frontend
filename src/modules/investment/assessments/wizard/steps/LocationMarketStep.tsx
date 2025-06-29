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
import { Slider } from "@/components/ui/slider";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { WizardStepProps } from '../types';
import { MapPin, Train, GraduationCap, ShoppingBag, Percent } from 'lucide-react';

export function LocationMarketStep({ data, onUpdate }: WizardStepProps) {
  const { control, watch } = useFormContext();
  
  const proximityToUni = watch('location_market.proximity_to_university');
  const proximityToCenter = watch('location_market.proximity_to_city_center');

  return (
    <div className="space-y-6">
      {/* Location Demographics */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <MapPin className="h-5 w-5" />
            Location Demographics
          </CardTitle>
          <CardDescription>
            Key demographic and location characteristics
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              control={control}
              name="location_market.student_population"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Total Student Population</FormLabel>
                  <FormControl>
                    <Input 
                      type="number" 
                      placeholder="e.g., 50000"
                      min={0}
                      {...field}
                      onChange={(e) => field.onChange(e.target.value ? parseInt(e.target.value) : null)}
                    />
                  </FormControl>
                  <FormDescription>
                    Total students in the city/area
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={control}
              name="location_market.international_student_percentage"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>International Students (%)</FormLabel>
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
                    Percentage of international students
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <FormField
            control={control}
            name="location_market.city_type"
            render={({ field }) => (
              <FormItem>
                <FormLabel>City Type</FormLabel>
                <Select value={field.value} onValueChange={field.onChange}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select city type" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="major_city">Major City (1M+ population)</SelectItem>
                    <SelectItem value="large_city">Large City (500K-1M)</SelectItem>
                    <SelectItem value="medium_city">Medium City (100K-500K)</SelectItem>
                    <SelectItem value="small_city">Small City/Town (&lt; 100K)</SelectItem>
                    <SelectItem value="university_town">University Town</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={control}
            name="location_market.university_ranking"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Primary University Ranking</FormLabel>
                <Select value={field.value} onValueChange={field.onChange}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select ranking tier" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="top_10">Top 10 (Russell Group/Elite)</SelectItem>
                    <SelectItem value="top_25">Top 25</SelectItem>
                    <SelectItem value="top_50">Top 50</SelectItem>
                    <SelectItem value="mid_tier">Mid-Tier (50-100)</SelectItem>
                    <SelectItem value="lower_tier">Lower Tier (100+)</SelectItem>
                  </SelectContent>
                </Select>
                <FormDescription>
                  National or international ranking of main university
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        </CardContent>
      </Card>

      {/* Proximity & Accessibility */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <GraduationCap className="h-5 w-5" />
            Proximity & Accessibility
          </CardTitle>
          <CardDescription>
            Distance to key locations and transport links
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <FormField
            control={control}
            name="location_market.proximity_to_university"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Distance to University (minutes walk)</FormLabel>
                <FormControl>
                  <div className="space-y-2">
                    <Slider
                      min={0}
                      max={60}
                      step={5}
                      value={[field.value || 0]}
                      onValueChange={(value) => field.onChange(value[0])}
                      className="w-full"
                    />
                    <div className="flex justify-between text-sm text-muted-foreground">
                      <span>0 min</span>
                      <span className="font-medium text-foreground">
                        {proximityToUni || 0} minutes
                      </span>
                      <span>60 min</span>
                    </div>
                  </div>
                </FormControl>
                <FormDescription>
                  Walking time to main campus/facilities
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={control}
            name="location_market.proximity_to_city_center"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Distance to City Center (minutes)</FormLabel>
                <FormControl>
                  <div className="space-y-2">
                    <Slider
                      min={0}
                      max={60}
                      step={5}
                      value={[field.value || 0]}
                      onValueChange={(value) => field.onChange(value[0])}
                      className="w-full"
                    />
                    <div className="flex justify-between text-sm text-muted-foreground">
                      <span>0 min</span>
                      <span className="font-medium text-foreground">
                        {proximityToCenter || 0} minutes
                      </span>
                      <span>60 min</span>
                    </div>
                  </div>
                </FormControl>
                <FormDescription>
                  By public transport or walking
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              control={control}
              name="location_market.public_transport_quality"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Public Transport Quality</FormLabel>
                  <Select value={field.value} onValueChange={field.onChange}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select quality level" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="excellent">Excellent (Metro/Tram + Bus)</SelectItem>
                      <SelectItem value="good">Good (Frequent buses)</SelectItem>
                      <SelectItem value="adequate">Adequate (Regular service)</SelectItem>
                      <SelectItem value="poor">Poor (Limited service)</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={control}
              name="location_market.train_station_distance"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Distance to Train Station (km)</FormLabel>
                  <FormControl>
                    <Input 
                      type="number" 
                      placeholder="e.g., 2.5"
                      min={0}
                      step={0.1}
                      {...field}
                      onChange={(e) => field.onChange(e.target.value ? parseFloat(e.target.value) : null)}
                    />
                  </FormControl>
                  <FormDescription>
                    To main railway station
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </CardContent>
      </Card>

      {/* Local Amenities */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <ShoppingBag className="h-5 w-5" />
            Local Amenities & Services
          </CardTitle>
          <CardDescription>
            Nearby facilities and attractions
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <FormField
            control={control}
            name="location_market.amenities_within_walking"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Local Amenities</FormLabel>
                <Select value={field.value} onValueChange={field.onChange}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select amenity level" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="comprehensive">Comprehensive (All essentials within 10 min)</SelectItem>
                    <SelectItem value="good">Good (Most essentials nearby)</SelectItem>
                    <SelectItem value="adequate">Adequate (Basic shops/services)</SelectItem>
                    <SelectItem value="limited">Limited (Few local amenities)</SelectItem>
                  </SelectContent>
                </Select>
                <FormDescription>
                  Shops, restaurants, gyms, healthcare within walking distance
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={control}
            name="location_market.safety_rating"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Area Safety Rating</FormLabel>
                <Select value={field.value} onValueChange={field.onChange}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select safety rating" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="very_safe">Very Safe (Low crime, well-lit)</SelectItem>
                    <SelectItem value="safe">Safe (Average crime rates)</SelectItem>
                    <SelectItem value="moderate">Moderate (Some concerns)</SelectItem>
                    <SelectItem value="concerns">Safety Concerns (Higher crime)</SelectItem>
                  </SelectContent>
                </Select>
                <FormDescription>
                  Based on crime statistics and student feedback
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        </CardContent>
      </Card>

      {/* Market Dynamics */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Percent className="h-5 w-5" />
            Market Dynamics
          </CardTitle>
          <CardDescription>
            Supply, demand, and competitive landscape
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              control={control}
              name="location_market.pbsa_supply_ratio"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>PBSA Supply Ratio (%)</FormLabel>
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
                    PBSA beds / total students
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={control}
              name="location_market.average_rental_growth"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Annual Rental Growth (%)</FormLabel>
                  <FormControl>
                    <Input 
                      type="number" 
                      placeholder="e.g., 5"
                      step={0.1}
                      {...field}
                      onChange={(e) => field.onChange(e.target.value ? parseFloat(e.target.value) : null)}
                    />
                  </FormControl>
                  <FormDescription>
                    3-year average
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <FormField
            control={control}
            name="location_market.competition_level"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Competition Level</FormLabel>
                <Select value={field.value} onValueChange={field.onChange}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select competition level" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="low">Low (Few competitors)</SelectItem>
                    <SelectItem value="moderate">Moderate (Some competition)</SelectItem>
                    <SelectItem value="high">High (Many operators)</SelectItem>
                    <SelectItem value="saturated">Saturated (Oversupplied)</SelectItem>
                  </SelectContent>
                </Select>
                <FormDescription>
                  Number of competing PBSA operators in the area
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={control}
            name="location_market.demand_trend"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Demand Trend</FormLabel>
                <Select value={field.value} onValueChange={field.onChange}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select demand trend" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="growing_strongly">Growing Strongly (&gt;5% annually)</SelectItem>
                    <SelectItem value="growing">Growing (2-5% annually)</SelectItem>
                    <SelectItem value="stable">Stable (0-2% change)</SelectItem>
                    <SelectItem value="declining">Declining (negative growth)</SelectItem>
                  </SelectContent>
                </Select>
                <FormDescription>
                  Student enrollment and housing demand trends
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Market Notes */}
          <FormField
            control={control}
            name="location_market.market_notes"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Additional Market Notes</FormLabel>
                <FormControl>
                  <textarea
                    className="flex min-h-[80px] w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    placeholder="Any additional market insights, upcoming developments, or local factors..."
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