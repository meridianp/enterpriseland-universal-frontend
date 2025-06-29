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
import { Building, Users, Briefcase, TrendingUp } from 'lucide-react';

export function OperationalInfoStep({ data, onUpdate }: WizardStepProps) {
  const { control, watch } = useFormContext();
  
  const hasMultipleSites = watch('operational_info.has_multiple_sites');
  const portfolioType = watch('operational_info.portfolio_type');

  return (
    <div className="space-y-6">
      {/* Company Experience */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Briefcase className="h-5 w-5" />
            Company Experience
          </CardTitle>
          <CardDescription>
            Operational history and expertise
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              control={control}
              name="operational_info.years_in_operation"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Years in Operation</FormLabel>
                  <FormControl>
                    <Input 
                      type="number" 
                      placeholder="e.g., 15"
                      min={0}
                      {...field}
                      onChange={(e) => field.onChange(e.target.value ? parseInt(e.target.value) : null)}
                    />
                  </FormControl>
                  <FormDescription>
                    Years since company establishment
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={control}
              name="operational_info.years_in_student_housing"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Years in Student Housing</FormLabel>
                  <FormControl>
                    <Input 
                      type="number" 
                      placeholder="e.g., 10"
                      min={0}
                      {...field}
                      onChange={(e) => field.onChange(e.target.value ? parseInt(e.target.value) : null)}
                    />
                  </FormControl>
                  <FormDescription>
                    Specific experience in PBSA sector
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <FormField
            control={control}
            name="operational_info.management_experience"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Management Team Experience</FormLabel>
                <Select value={field.value} onValueChange={field.onChange}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select experience level" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="extensive">Extensive (15+ years average)</SelectItem>
                    <SelectItem value="strong">Strong (10-15 years average)</SelectItem>
                    <SelectItem value="moderate">Moderate (5-10 years average)</SelectItem>
                    <SelectItem value="limited">Limited (&lt; 5 years average)</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </CardContent>
      </Card>

      {/* Team & Resources */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Users className="h-5 w-5" />
            Team & Resources
          </CardTitle>
          <CardDescription>
            Staffing and operational capacity
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              control={control}
              name="operational_info.total_employees"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Total Employees</FormLabel>
                  <FormControl>
                    <Input 
                      type="number" 
                      placeholder="e.g., 250"
                      min={0}
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
              name="operational_info.operations_team_size"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Operations Team Size</FormLabel>
                  <FormControl>
                    <Input 
                      type="number" 
                      placeholder="e.g., 50"
                      min={0}
                      {...field}
                      onChange={(e) => field.onChange(e.target.value ? parseInt(e.target.value) : null)}
                    />
                  </FormControl>
                  <FormDescription>
                    Staff dedicated to property operations
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <FormField
            control={control}
            name="operational_info.has_in_house_maintenance"
            render={({ field }) => (
              <FormItem className="space-y-3">
                <FormLabel>Maintenance Capabilities</FormLabel>
                <FormControl>
                  <RadioGroup
                    onValueChange={(value) => field.onChange(value === 'true')}
                    value={field.value?.toString()}
                    className="flex flex-col space-y-1"
                  >
                    <FormItem className="flex items-center space-x-3 space-y-0">
                      <FormControl>
                        <RadioGroupItem value="true" />
                      </FormControl>
                      <FormLabel className="font-normal">
                        In-house maintenance team
                      </FormLabel>
                    </FormItem>
                    <FormItem className="flex items-center space-x-3 space-y-0">
                      <FormControl>
                        <RadioGroupItem value="false" />
                      </FormControl>
                      <FormLabel className="font-normal">
                        Outsourced maintenance services
                      </FormLabel>
                    </FormItem>
                  </RadioGroup>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </CardContent>
      </Card>

      {/* Portfolio Details */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Building className="h-5 w-5" />
            Portfolio Information
          </CardTitle>
          <CardDescription>
            Current property portfolio and operational scale
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              control={control}
              name="operational_info.total_beds_managed"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Total Beds Under Management</FormLabel>
                  <FormControl>
                    <Input 
                      type="number" 
                      placeholder="e.g., 5000"
                      min={0}
                      {...field}
                      onChange={(e) => field.onChange(e.target.value ? parseInt(e.target.value) : null)}
                    />
                  </FormControl>
                  <FormDescription>
                    Across all properties
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={control}
              name="operational_info.number_of_properties"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Number of Properties</FormLabel>
                  <FormControl>
                    <Input 
                      type="number" 
                      placeholder="e.g., 15"
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
            name="operational_info.portfolio_type"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Portfolio Type</FormLabel>
                <Select value={field.value} onValueChange={field.onChange}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select portfolio type" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="owned">Fully Owned</SelectItem>
                    <SelectItem value="managed">Third-Party Managed</SelectItem>
                    <SelectItem value="mixed">Mixed (Owned & Managed)</SelectItem>
                    <SelectItem value="franchised">Franchised</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          {portfolioType === 'mixed' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={control}
                name="operational_info.owned_beds"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Owned Beds</FormLabel>
                    <FormControl>
                      <Input 
                        type="number" 
                        placeholder="e.g., 3000"
                        min={0}
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
                name="operational_info.managed_beds"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Managed Beds</FormLabel>
                    <FormControl>
                      <Input 
                        type="number" 
                        placeholder="e.g., 2000"
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
          )}

          <FormField
            control={control}
            name="operational_info.has_multiple_sites"
            render={({ field }) => (
              <FormItem className="space-y-3">
                <FormLabel>Geographic Presence</FormLabel>
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
                        Single location/city
                      </FormLabel>
                    </FormItem>
                    <FormItem className="flex items-center space-x-3 space-y-0">
                      <FormControl>
                        <RadioGroupItem value="true" />
                      </FormControl>
                      <FormLabel className="font-normal">
                        Multiple locations across regions
                      </FormLabel>
                    </FormItem>
                  </RadioGroup>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {hasMultipleSites && (
            <FormField
              control={control}
              name="operational_info.geographic_regions"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Geographic Regions</FormLabel>
                  <FormControl>
                    <Input 
                      placeholder="e.g., UK, Ireland, Netherlands"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    List countries or regions of operation
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          )}
        </CardContent>
      </Card>

      {/* Growth & Performance */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            Growth & Performance
          </CardTitle>
          <CardDescription>
            Historical performance and growth trajectory
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <FormField
            control={control}
            name="operational_info.occupancy_rate"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Average Occupancy Rate (%)</FormLabel>
                <FormControl>
                  <Input 
                    type="number" 
                    placeholder="e.g., 95"
                    min={0}
                    max={100}
                    {...field}
                    onChange={(e) => field.onChange(e.target.value ? parseFloat(e.target.value) : null)}
                  />
                </FormControl>
                <FormDescription>
                  Portfolio-wide average for last 12 months
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={control}
            name="operational_info.annual_growth_rate"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Annual Portfolio Growth Rate (%)</FormLabel>
                <FormControl>
                  <Input 
                    type="number" 
                    placeholder="e.g., 15"
                    {...field}
                    onChange={(e) => field.onChange(e.target.value ? parseFloat(e.target.value) : null)}
                  />
                </FormControl>
                <FormDescription>
                  Average growth over last 3 years
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={control}
            name="operational_info.technology_systems"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Technology & Systems</FormLabel>
                <Select value={field.value} onValueChange={field.onChange}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select technology level" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="advanced">Advanced (Full PMS, CRM, automated systems)</SelectItem>
                    <SelectItem value="modern">Modern (Good PMS, some automation)</SelectItem>
                    <SelectItem value="basic">Basic (Essential systems only)</SelectItem>
                    <SelectItem value="legacy">Legacy (Outdated systems)</SelectItem>
                  </SelectContent>
                </Select>
                <FormDescription>
                  Property management and operational systems
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