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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { WizardStepProps } from '../types';
import { Leaf, Shield, Users, Building, Award } from 'lucide-react';

export function ESGComplianceStep({ data, onUpdate }: WizardStepProps) {
  const { control, watch } = useFormContext();
  
  const hasEnergyRating = watch('esg_compliance.has_energy_rating');
  const hasSustainabilityCert = watch('esg_compliance.has_sustainability_certification');

  return (
    <div className="space-y-6">
      {/* Environmental */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Leaf className="h-5 w-5" />
            Environmental
          </CardTitle>
          <CardDescription>
            Energy efficiency and environmental impact
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <FormField
            control={control}
            name="esg_compliance.has_energy_rating"
            render={({ field }) => (
              <FormItem className="space-y-3">
                <FormLabel>Energy Performance Certificate (EPC)</FormLabel>
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
                        Has EPC rating
                      </FormLabel>
                    </FormItem>
                    <FormItem className="flex items-center space-x-3 space-y-0">
                      <FormControl>
                        <RadioGroupItem value="false" />
                      </FormControl>
                      <FormLabel className="font-normal">
                        No EPC rating / Not applicable
                      </FormLabel>
                    </FormItem>
                  </RadioGroup>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {hasEnergyRating && (
            <FormField
              control={control}
              name="esg_compliance.energy_rating"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>EPC Rating</FormLabel>
                  <Select value={field.value} onValueChange={field.onChange}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select rating" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="A">A (92-100) - Very efficient</SelectItem>
                      <SelectItem value="B">B (81-91) - Efficient</SelectItem>
                      <SelectItem value="C">C (69-80) - Average</SelectItem>
                      <SelectItem value="D">D (55-68) - Below average</SelectItem>
                      <SelectItem value="E">E (39-54) - Poor</SelectItem>
                      <SelectItem value="F">F (21-38) - Very poor</SelectItem>
                      <SelectItem value="G">G (1-20) - Extremely poor</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          )}

          <FormField
            control={control}
            name="esg_compliance.renewable_energy_percentage"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Renewable Energy Usage (%)</FormLabel>
                <FormControl>
                  <Select value={field.value?.toString()} onValueChange={(value) => field.onChange(parseInt(value))}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select percentage" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="0">0% - No renewable energy</SelectItem>
                      <SelectItem value="25">25% - Partial renewable</SelectItem>
                      <SelectItem value="50">50% - Half renewable</SelectItem>
                      <SelectItem value="75">75% - Mostly renewable</SelectItem>
                      <SelectItem value="100">100% - Fully renewable</SelectItem>
                    </SelectContent>
                  </Select>
                </FormControl>
                <FormDescription>
                  Solar, wind, or other renewable sources
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={control}
            name="esg_compliance.carbon_neutral_target"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Carbon Neutral Target</FormLabel>
                <Select value={field.value} onValueChange={field.onChange}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select target" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="achieved">Already achieved</SelectItem>
                    <SelectItem value="2025">By 2025</SelectItem>
                    <SelectItem value="2030">By 2030</SelectItem>
                    <SelectItem value="2040">By 2040</SelectItem>
                    <SelectItem value="2050">By 2050</SelectItem>
                    <SelectItem value="none">No target set</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={control}
            name="esg_compliance.water_conservation_measures"
            render={({ field }) => (
              <FormItem className="space-y-3">
                <FormLabel>Water Conservation Measures</FormLabel>
                <div className="space-y-2">
                  {[
                    { id: 'low_flow', label: 'Low-flow fixtures' },
                    { id: 'rainwater', label: 'Rainwater harvesting' },
                    { id: 'greywater', label: 'Greywater recycling' },
                    { id: 'smart_meters', label: 'Smart water meters' },
                  ].map((item) => (
                    <FormItem
                      key={item.id}
                      className="flex flex-row items-start space-x-3 space-y-0"
                    >
                      <FormControl>
                        <Checkbox
                          checked={field.value?.includes(item.id)}
                          onCheckedChange={(checked) => {
                            return checked
                              ? field.onChange([...(field.value || []), item.id])
                              : field.onChange(
                                  field.value?.filter((value: string) => value !== item.id)
                                )
                          }}
                        />
                      </FormControl>
                      <FormLabel className="font-normal">
                        {item.label}
                      </FormLabel>
                    </FormItem>
                  ))}
                </div>
                <FormMessage />
              </FormItem>
            )}
          />
        </CardContent>
      </Card>

      {/* Social */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Users className="h-5 w-5" />
            Social
          </CardTitle>
          <CardDescription>
            Community impact and student wellbeing
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <FormField
            control={control}
            name="esg_compliance.wellbeing_features"
            render={({ field }) => (
              <FormItem className="space-y-3">
                <FormLabel>Wellbeing Features</FormLabel>
                <div className="space-y-2">
                  {[
                    { id: 'mental_health_support', label: 'Mental health support services' },
                    { id: 'fitness_facilities', label: 'On-site fitness facilities' },
                    { id: 'social_spaces', label: 'Dedicated social spaces' },
                    { id: 'study_areas', label: '24/7 study areas' },
                    { id: 'outdoor_spaces', label: 'Outdoor recreation spaces' },
                  ].map((item) => (
                    <FormItem
                      key={item.id}
                      className="flex flex-row items-start space-x-3 space-y-0"
                    >
                      <FormControl>
                        <Checkbox
                          checked={field.value?.includes(item.id)}
                          onCheckedChange={(checked) => {
                            return checked
                              ? field.onChange([...(field.value || []), item.id])
                              : field.onChange(
                                  field.value?.filter((value: string) => value !== item.id)
                                )
                          }}
                        />
                      </FormControl>
                      <FormLabel className="font-normal">
                        {item.label}
                      </FormLabel>
                    </FormItem>
                  ))}
                </div>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={control}
            name="esg_compliance.accessibility_standard"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Accessibility Standards</FormLabel>
                <Select value={field.value} onValueChange={field.onChange}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select standard" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="full_compliance">Full DDA/Equality Act compliance</SelectItem>
                    <SelectItem value="partial_compliance">Partial compliance</SelectItem>
                    <SelectItem value="basic_compliance">Basic compliance only</SelectItem>
                    <SelectItem value="exceeds_requirements">Exceeds requirements</SelectItem>
                  </SelectContent>
                </Select>
                <FormDescription>
                  Disability access and inclusion standards
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={control}
            name="esg_compliance.community_engagement"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Community Engagement Level</FormLabel>
                <Select value={field.value} onValueChange={field.onChange}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select level" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="very_active">Very Active (Regular programs)</SelectItem>
                    <SelectItem value="active">Active (Occasional programs)</SelectItem>
                    <SelectItem value="minimal">Minimal engagement</SelectItem>
                    <SelectItem value="none">No community programs</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={control}
            name="esg_compliance.local_employment_percentage"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Local Employment (%)</FormLabel>
                <Select value={field.value?.toString()} onValueChange={(value) => field.onChange(parseInt(value))}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select percentage" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="0">0-25%</SelectItem>
                    <SelectItem value="25">25-50%</SelectItem>
                    <SelectItem value="50">50-75%</SelectItem>
                    <SelectItem value="75">75-100%</SelectItem>
                  </SelectContent>
                </Select>
                <FormDescription>
                  Percentage of staff hired locally
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        </CardContent>
      </Card>

      {/* Governance */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Shield className="h-5 w-5" />
            Governance
          </CardTitle>
          <CardDescription>
            Corporate governance and compliance
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <FormField
            control={control}
            name="esg_compliance.data_protection_compliance"
            render={({ field }) => (
              <FormItem className="space-y-3">
                <FormLabel>Data Protection Compliance</FormLabel>
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
                        GDPR/Data protection compliant
                      </FormLabel>
                    </FormItem>
                    <FormItem className="flex items-center space-x-3 space-y-0">
                      <FormControl>
                        <RadioGroupItem value="false" />
                      </FormControl>
                      <FormLabel className="font-normal">
                        Not compliant / In progress
                      </FormLabel>
                    </FormItem>
                  </RadioGroup>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={control}
            name="esg_compliance.health_safety_rating"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Health & Safety Rating</FormLabel>
                <Select value={field.value} onValueChange={field.onChange}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select rating" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="excellent">Excellent - No incidents</SelectItem>
                    <SelectItem value="good">Good - Minor incidents only</SelectItem>
                    <SelectItem value="satisfactory">Satisfactory - Some concerns</SelectItem>
                    <SelectItem value="poor">Poor - Major concerns</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={control}
            name="esg_compliance.anti_corruption_policy"
            render={({ field }) => (
              <FormItem className="space-y-3">
                <FormLabel>Anti-Corruption & Ethics</FormLabel>
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
                        Has comprehensive anti-corruption policy
                      </FormLabel>
                    </FormItem>
                    <FormItem className="flex items-center space-x-3 space-y-0">
                      <FormControl>
                        <RadioGroupItem value="false" />
                      </FormControl>
                      <FormLabel className="font-normal">
                        No formal policy in place
                      </FormLabel>
                    </FormItem>
                  </RadioGroup>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={control}
            name="esg_compliance.board_diversity_percentage"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Board Diversity (%)</FormLabel>
                <Select value={field.value?.toString()} onValueChange={(value) => field.onChange(parseInt(value))}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select percentage" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="0">0-25%</SelectItem>
                    <SelectItem value="25">25-40%</SelectItem>
                    <SelectItem value="40">40-60%</SelectItem>
                    <SelectItem value="60">60%+</SelectItem>
                  </SelectContent>
                </Select>
                <FormDescription>
                  Gender and ethnic diversity on board
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        </CardContent>
      </Card>

      {/* Certifications */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Award className="h-5 w-5" />
            Certifications & Standards
          </CardTitle>
          <CardDescription>
            Sustainability certifications and industry standards
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <FormField
            control={control}
            name="esg_compliance.has_sustainability_certification"
            render={({ field }) => (
              <FormItem className="space-y-3">
                <FormLabel>Sustainability Certification</FormLabel>
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
                        Has sustainability certification
                      </FormLabel>
                    </FormItem>
                    <FormItem className="flex items-center space-x-3 space-y-0">
                      <FormControl>
                        <RadioGroupItem value="false" />
                      </FormControl>
                      <FormLabel className="font-normal">
                        No certification
                      </FormLabel>
                    </FormItem>
                  </RadioGroup>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {hasSustainabilityCert && (
            <FormField
              control={control}
              name="esg_compliance.certifications"
              render={({ field }) => (
                <FormItem className="space-y-3">
                  <FormLabel>Certifications Held</FormLabel>
                  <div className="space-y-2">
                    {[
                      { id: 'breeam', label: 'BREEAM' },
                      { id: 'leed', label: 'LEED' },
                      { id: 'well', label: 'WELL Building Standard' },
                      { id: 'iso14001', label: 'ISO 14001' },
                      { id: 'passivhaus', label: 'Passivhaus' },
                    ].map((item) => (
                      <FormItem
                        key={item.id}
                        className="flex flex-row items-start space-x-3 space-y-0"
                      >
                        <FormControl>
                          <Checkbox
                            checked={field.value?.includes(item.id)}
                            onCheckedChange={(checked) => {
                              return checked
                                ? field.onChange([...(field.value || []), item.id])
                                : field.onChange(
                                    field.value?.filter((value: string) => value !== item.id)
                                  )
                            }}
                          />
                        </FormControl>
                        <FormLabel className="font-normal">
                          {item.label}
                        </FormLabel>
                      </FormItem>
                    ))}
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />
          )}

          <FormField
            control={control}
            name="esg_compliance.esg_reporting_frequency"
            render={({ field }) => (
              <FormItem>
                <FormLabel>ESG Reporting Frequency</FormLabel>
                <Select value={field.value} onValueChange={field.onChange}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select frequency" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="quarterly">Quarterly</SelectItem>
                    <SelectItem value="biannual">Bi-annual</SelectItem>
                    <SelectItem value="annual">Annual</SelectItem>
                    <SelectItem value="none">No regular reporting</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* ESG Notes */}
          <FormField
            control={control}
            name="esg_compliance.notes"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Additional ESG Notes</FormLabel>
                <FormControl>
                  <textarea
                    className="flex min-h-[80px] w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    placeholder="Any additional ESG initiatives, commitments, or considerations..."
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