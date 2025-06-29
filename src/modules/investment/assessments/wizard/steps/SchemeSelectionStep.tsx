'use client';

import { useState } from 'react';
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
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { WizardStepProps } from '../types';
import { useSchemes } from '@/lib/hooks/useAssessmentQueries';
import { MapPin, Search } from 'lucide-react';
import { LoadingSpinner } from '@/components/common/loading-spinner';
import { SchemeType, SchemeStatus } from '@/lib/types/assessment.types';

export function SchemeSelectionStep({ data, onUpdate }: WizardStepProps) {
  const { control } = useFormContext();
  const [searchTerm, setSearchTerm] = useState('');
  const { data: schemes, isLoading } = useSchemes();

  const filteredSchemes = schemes?.results.filter(scheme =>
    scheme.scheme_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    scheme.location_city.toLowerCase().includes(searchTerm.toLowerCase()) ||
    scheme.location_country.toLowerCase().includes(searchTerm.toLowerCase())
  ) || [];

  return (
    <div className="space-y-6">
      <Tabs defaultValue="existing" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="existing">Select Existing Scheme</TabsTrigger>
          <TabsTrigger value="new">Create New Scheme</TabsTrigger>
        </TabsList>

        <TabsContent value="existing" className="space-y-4">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search schemes..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>

          {/* Scheme List */}
          {isLoading ? (
            <div className="flex justify-center py-8">
              <LoadingSpinner />
            </div>
          ) : (
            <FormField
              control={control}
              name="schemeId"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <RadioGroup
                      value={field.value}
                      onValueChange={field.onChange}
                      className="grid grid-cols-1 gap-4"
                    >
                      {filteredSchemes.map((scheme) => (
                        <Card key={scheme.id} className="cursor-pointer hover:border-primary transition-colors">
                          <CardContent className="p-4">
                            <label htmlFor={scheme.id} className="cursor-pointer">
                              <RadioGroupItem value={scheme.id} id={scheme.id} className="sr-only" />
                              <div className="flex items-start space-x-3">
                                <MapPin className="h-5 w-5 text-muted-foreground mt-0.5" />
                                <div className="flex-1">
                                  <h4 className="font-medium">{scheme.scheme_name}</h4>
                                  <div className="text-sm text-muted-foreground mt-1 space-y-1">
                                    <p>Location: {scheme.location_city}, {scheme.location_country}</p>
                                    <p>Beds: {scheme.total_beds}</p>
                                    <p>Site Area: {scheme.site_area_value} {scheme.site_area_unit}</p>
                                  </div>
                                </div>
                              </div>
                            </label>
                          </CardContent>
                        </Card>
                      ))}
                    </RadioGroup>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          )}
        </TabsContent>

        <TabsContent value="new" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>New PBSA Scheme</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Scheme Name */}
              <FormField
                control={control}
                name="newScheme.name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Scheme Name</FormLabel>
                    <FormControl>
                      <Input placeholder="University Heights Student Accommodation" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Location */}
              <FormField
                control={control}
                name="newScheme.location"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Location</FormLabel>
                    <FormControl>
                      <Input placeholder="Manchester, UK" {...field} />
                    </FormControl>
                    <FormDescription>
                      City and country where the scheme is located
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Scheme Type */}
              <FormField
                control={control}
                name="newScheme.type"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Scheme Type</FormLabel>
                    <Select value={field.value} onValueChange={field.onChange}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select scheme type" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value={SchemeType.STUDENT}>Student Accommodation</SelectItem>
                        <SelectItem value={SchemeType.RESIDENTIAL}>Residential</SelectItem>
                        <SelectItem value={SchemeType.COMMERCIAL}>Commercial</SelectItem>
                        <SelectItem value={SchemeType.MIXED}>Mixed Use</SelectItem>
                        <SelectItem value={SchemeType.OTHER}>Other</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Status */}
              <FormField
                control={control}
                name="newScheme.status"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Development Status</FormLabel>
                    <Select value={field.value} onValueChange={field.onChange}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select status" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value={SchemeStatus.PLANNING}>Planning</SelectItem>
                        <SelectItem value={SchemeStatus.APPROVED}>Approved</SelectItem>
                        <SelectItem value={SchemeStatus.UNDER_CONSTRUCTION}>Under Construction</SelectItem>
                        <SelectItem value={SchemeStatus.COMPLETED}>Completed</SelectItem>
                        <SelectItem value={SchemeStatus.ON_HOLD}>On Hold</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Units and Investment */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={control}
                  name="newScheme.total_units"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Total Units</FormLabel>
                      <FormControl>
                        <Input 
                          type="number" 
                          placeholder="250" 
                          {...field}
                          onChange={(e) => field.onChange(e.target.value ? parseInt(e.target.value) : null)}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={control}
                  name="newScheme.total_investment"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Total Investment (£)</FormLabel>
                      <FormControl>
                        <Input 
                          type="number" 
                          placeholder="25000000" 
                          {...field}
                          onChange={(e) => field.onChange(e.target.value ? parseFloat(e.target.value) : null)}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}