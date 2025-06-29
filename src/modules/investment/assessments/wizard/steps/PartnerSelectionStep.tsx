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
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { WizardStepProps } from '../types';
import { usePartners } from '@/lib/hooks/useAssessmentQueries';
import { Building2, Plus, Search } from 'lucide-react';
import { LoadingSpinner } from '@/components/common/loading-spinner';

export function PartnerSelectionStep({ data, onUpdate }: WizardStepProps) {
  const { control } = useFormContext();
  const [searchTerm, setSearchTerm] = useState('');
  const { data: partners, isLoading } = usePartners();

  const filteredPartners = partners?.results.filter(partner =>
    partner.company_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    partner.trading_name?.toLowerCase().includes(searchTerm.toLowerCase())
  ) || [];

  return (
    <div className="space-y-6">
      <Tabs defaultValue="existing" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="existing">Select Existing Partner</TabsTrigger>
          <TabsTrigger value="new">Create New Partner</TabsTrigger>
        </TabsList>

        <TabsContent value="existing" className="space-y-4">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search partners..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>

          {/* Partner List */}
          {isLoading ? (
            <div className="flex justify-center py-8">
              <LoadingSpinner />
            </div>
          ) : (
            <FormField
              control={control}
              name="partnerId"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <RadioGroup
                      value={field.value}
                      onValueChange={field.onChange}
                      className="grid grid-cols-1 gap-4"
                    >
                      {filteredPartners.map((partner) => (
                        <Card key={partner.id} className="cursor-pointer hover:border-primary transition-colors">
                          <CardContent className="p-4">
                            <label htmlFor={partner.id} className="cursor-pointer">
                              <RadioGroupItem value={partner.id} id={partner.id} className="sr-only" />
                              <div className="flex items-start space-x-3">
                                <Building2 className="h-5 w-5 text-muted-foreground mt-0.5" />
                                <div className="flex-1">
                                  <h4 className="font-medium">{partner.company_name}</h4>
                                  <div className="text-sm text-muted-foreground mt-1 space-y-1">
                                    <p>{partner.headquarter_city}, {partner.headquarter_country}</p>
                                    {partner.trading_name && <p>Trading as: {partner.trading_name}</p>}
                                    {partner.website_url && <p>Website: {partner.website_url}</p>}
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
              <CardTitle>New Development Partner</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Partner Name */}
              <FormField
                control={control}
                name="newPartner.name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Company Name</FormLabel>
                    <FormControl>
                      <Input placeholder="ABC Developments Ltd" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Partner Type */}
              <FormField
                control={control}
                name="newPartner.type"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Partner Type</FormLabel>
                    <Select value={field.value} onValueChange={field.onChange}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select partner type" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="developer">Developer</SelectItem>
                        <SelectItem value="investor">Investor</SelectItem>
                        <SelectItem value="operator">Operator</SelectItem>
                        <SelectItem value="contractor">Contractor</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Contact Information */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={control}
                  name="newPartner.contact_email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Contact Email</FormLabel>
                      <FormControl>
                        <Input type="email" placeholder="contact@example.com" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={control}
                  name="newPartner.contact_phone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Contact Phone</FormLabel>
                      <FormControl>
                        <Input type="tel" placeholder="+44 20 1234 5678" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* Address */}
              <FormField
                control={control}
                name="newPartner.address"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Address</FormLabel>
                    <FormControl>
                      <Input placeholder="123 Main Street, London, UK" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Website */}
              <FormField
                control={control}
                name="newPartner.website"
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
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}