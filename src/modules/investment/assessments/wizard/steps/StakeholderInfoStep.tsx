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
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { WizardStepProps } from '../types';
import { Users, Building2, Mail, Phone, Plus, Trash2 } from 'lucide-react';
import { useState } from 'react';

interface KeyPersonnel {
  name: string;
  position: string;
  email: string;
  phone?: string;
  experience_years?: number;
  background?: string;
}

interface BoardMember {
  name: string;
  position: string;
  independent: boolean;
  experience_years?: number;
  background?: string;
}

interface Shareholder {
  name: string;
  type: 'individual' | 'institutional' | 'corporate';
  ownership_percentage: number;
  voting_rights?: number;
}

export function StakeholderInfoStep({ data, onUpdate }: WizardStepProps) {
  const { control, watch, setValue } = useFormContext();
  
  const [keyPersonnel, setKeyPersonnel] = useState<KeyPersonnel[]>(
    watch('stakeholder_info.key_personnel') || [{
      name: '',
      position: 'CEO',
      email: '',
      phone: '',
      experience_years: undefined,
      background: ''
    }]
  );
  
  const [boardMembers, setBoardMembers] = useState<BoardMember[]>(
    watch('stakeholder_info.board_members') || []
  );
  
  const [shareholders, setShareholders] = useState<Shareholder[]>(
    watch('stakeholder_info.shareholders') || []
  );
  
  const addKeyPersonnel = () => {
    const newPersonnel = [...keyPersonnel, {
      name: '',
      position: '',
      email: '',
      phone: '',
      experience_years: undefined,
      background: ''
    }];
    setKeyPersonnel(newPersonnel);
    setValue('stakeholder_info.key_personnel', newPersonnel);
  };
  
  const removeKeyPersonnel = (index: number) => {
    const updated = keyPersonnel.filter((_, i) => i !== index);
    setKeyPersonnel(updated);
    setValue('stakeholder_info.key_personnel', updated);
  };
  
  const updateKeyPersonnel = (index: number, field: keyof KeyPersonnel, value: any) => {
    const updated = [...keyPersonnel];
    updated[index] = { ...updated[index], [field]: value };
    setKeyPersonnel(updated);
    setValue('stakeholder_info.key_personnel', updated);
  };
  
  const addBoardMember = () => {
    const newMember = [...boardMembers, {
      name: '',
      position: '',
      independent: false,
      experience_years: undefined,
      background: ''
    }];
    setBoardMembers(newMember);
    setValue('stakeholder_info.board_members', newMember);
  };
  
  const removeBoardMember = (index: number) => {
    const updated = boardMembers.filter((_, i) => i !== index);
    setBoardMembers(updated);
    setValue('stakeholder_info.board_members', updated);
  };
  
  const updateBoardMember = (index: number, field: keyof BoardMember, value: any) => {
    const updated = [...boardMembers];
    updated[index] = { ...updated[index], [field]: value };
    setBoardMembers(updated);
    setValue('stakeholder_info.board_members', updated);
  };
  
  const addShareholder = () => {
    const newShareholder = [...shareholders, {
      name: '',
      type: 'individual' as const,
      ownership_percentage: 0,
      voting_rights: undefined
    }];
    setShareholders(newShareholder);
    setValue('stakeholder_info.shareholders', newShareholder);
  };
  
  const removeShareholder = (index: number) => {
    const updated = shareholders.filter((_, i) => i !== index);
    setShareholders(updated);
    setValue('stakeholder_info.shareholders', updated);
  };
  
  const updateShareholder = (index: number, field: keyof Shareholder, value: any) => {
    const updated = [...shareholders];
    updated[index] = { ...updated[index], [field]: value };
    setShareholders(updated);
    setValue('stakeholder_info.shareholders', updated);
  };
  
  return (
    <div className="space-y-6">
      {/* Key Personnel */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Users className="h-5 w-5" />
            Key Personnel
          </CardTitle>
          <CardDescription>
            Senior management and key decision makers
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {keyPersonnel.map((person, index) => (
            <div key={index} className="border rounded-lg p-4 space-y-4">
              <div className="flex justify-between items-center">
                <h4 className="font-medium">Personnel #{index + 1}</h4>
                {keyPersonnel.length > 1 && (
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => removeKeyPersonnel(index)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                )}
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <FormLabel>Full Name *</FormLabel>
                  <Input
                    value={person.name}
                    onChange={(e) => updateKeyPersonnel(index, 'name', e.target.value)}
                    placeholder="e.g., John Smith"
                    required
                  />
                </div>
                
                <div>
                  <FormLabel>Position *</FormLabel>
                  <Select
                    value={person.position}
                    onValueChange={(value) => updateKeyPersonnel(index, 'position', value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select position" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="CEO">Chief Executive Officer</SelectItem>
                      <SelectItem value="CFO">Chief Financial Officer</SelectItem>
                      <SelectItem value="COO">Chief Operating Officer</SelectItem>
                      <SelectItem value="CTO">Chief Technology Officer</SelectItem>
                      <SelectItem value="Managing Director">Managing Director</SelectItem>
                      <SelectItem value="Development Director">Development Director</SelectItem>
                      <SelectItem value="Head of Development">Head of Development</SelectItem>
                      <SelectItem value="Head of Asset Management">Head of Asset Management</SelectItem>
                      <SelectItem value="Other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <FormLabel>Email Address *</FormLabel>
                  <Input
                    type="email"
                    value={person.email}
                    onChange={(e) => updateKeyPersonnel(index, 'email', e.target.value)}
                    placeholder="john.smith@company.com"
                    required
                  />
                </div>
                
                <div>
                  <FormLabel>Phone Number</FormLabel>
                  <Input
                    type="tel"
                    value={person.phone || ''}
                    onChange={(e) => updateKeyPersonnel(index, 'phone', e.target.value)}
                    placeholder="+44 20 1234 5678"
                  />
                </div>
                
                <div>
                  <FormLabel>Years of Experience</FormLabel>
                  <Input
                    type="number"
                    value={person.experience_years || ''}
                    onChange={(e) => updateKeyPersonnel(index, 'experience_years', e.target.value ? parseInt(e.target.value) : undefined)}
                    placeholder="e.g., 15"
                    min={0}
                    max={50}
                  />
                </div>
              </div>
              
              <div>
                <FormLabel>Professional Background</FormLabel>
                <Textarea
                  value={person.background || ''}
                  onChange={(e) => updateKeyPersonnel(index, 'background', e.target.value)}
                  placeholder="Brief overview of relevant experience and qualifications..."
                  rows={3}
                />
              </div>
            </div>
          ))}
          
          <Button
            type="button"
            variant="outline"
            onClick={addKeyPersonnel}
            className="w-full"
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Key Personnel
          </Button>
        </CardContent>
      </Card>
      
      {/* Board Members */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Building2 className="h-5 w-5" />
            Board of Directors
          </CardTitle>
          <CardDescription>
            Board members and non-executive directors
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {boardMembers.length === 0 && (
            <p className="text-sm text-muted-foreground text-center py-4">
              No board members added yet. Click "Add Board Member" to get started.
            </p>
          )}
          
          {boardMembers.map((member, index) => (
            <div key={index} className="border rounded-lg p-4 space-y-4">
              <div className="flex justify-between items-center">
                <h4 className="font-medium">Board Member #{index + 1}</h4>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => removeBoardMember(index)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <FormLabel>Full Name *</FormLabel>
                  <Input
                    value={member.name}
                    onChange={(e) => updateBoardMember(index, 'name', e.target.value)}
                    placeholder="e.g., Jane Doe"
                    required
                  />
                </div>
                
                <div>
                  <FormLabel>Position *</FormLabel>
                  <Select
                    value={member.position}
                    onValueChange={(value) => updateBoardMember(index, 'position', value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select position" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Chairman">Chairman</SelectItem>
                      <SelectItem value="Vice Chairman">Vice Chairman</SelectItem>
                      <SelectItem value="Independent Director">Independent Director</SelectItem>
                      <SelectItem value="Non-Executive Director">Non-Executive Director</SelectItem>
                      <SelectItem value="Executive Director">Executive Director</SelectItem>
                      <SelectItem value="Audit Committee Chair">Audit Committee Chair</SelectItem>
                      <SelectItem value="Other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <FormLabel>Independent Director</FormLabel>
                  <Select
                    value={member.independent ? 'yes' : 'no'}
                    onValueChange={(value) => updateBoardMember(index, 'independent', value === 'yes')}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="yes">Yes</SelectItem>
                      <SelectItem value="no">No</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <FormLabel>Years of Experience</FormLabel>
                  <Input
                    type="number"
                    value={member.experience_years || ''}
                    onChange={(e) => updateBoardMember(index, 'experience_years', e.target.value ? parseInt(e.target.value) : undefined)}
                    placeholder="e.g., 20"
                    min={0}
                    max={50}
                  />
                </div>
              </div>
              
              <div>
                <FormLabel>Professional Background</FormLabel>
                <Textarea
                  value={member.background || ''}
                  onChange={(e) => updateBoardMember(index, 'background', e.target.value)}
                  placeholder="Brief overview of relevant experience and qualifications..."
                  rows={3}
                />
              </div>
            </div>
          ))}
          
          <Button
            type="button"
            variant="outline"
            onClick={addBoardMember}
            className="w-full"
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Board Member
          </Button>
        </CardContent>
      </Card>
      
      {/* Major Shareholders */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Building2 className="h-5 w-5" />
            Major Shareholders
          </CardTitle>
          <CardDescription>
            Significant shareholders and ownership structure
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {shareholders.length === 0 && (
            <p className="text-sm text-muted-foreground text-center py-4">
              No shareholders added yet. Click "Add Shareholder" to get started.
            </p>
          )}
          
          {shareholders.map((shareholder, index) => (
            <div key={index} className="border rounded-lg p-4 space-y-4">
              <div className="flex justify-between items-center">
                <h4 className="font-medium">Shareholder #{index + 1}</h4>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => removeShareholder(index)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <FormLabel>Shareholder Name *</FormLabel>
                  <Input
                    value={shareholder.name}
                    onChange={(e) => updateShareholder(index, 'name', e.target.value)}
                    placeholder="e.g., Investment Fund Ltd"
                    required
                  />
                </div>
                
                <div>
                  <FormLabel>Shareholder Type *</FormLabel>
                  <Select
                    value={shareholder.type}
                    onValueChange={(value) => updateShareholder(index, 'type', value)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="individual">Individual</SelectItem>
                      <SelectItem value="institutional">Institutional Investor</SelectItem>
                      <SelectItem value="corporate">Corporate Entity</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <FormLabel>Ownership Percentage (%) *</FormLabel>
                  <Input
                    type="number"
                    value={shareholder.ownership_percentage}
                    onChange={(e) => updateShareholder(index, 'ownership_percentage', e.target.value ? parseFloat(e.target.value) : 0)}
                    placeholder="e.g., 25.5"
                    min={0}
                    max={100}
                    step={0.1}
                    required
                  />
                </div>
                
                <div>
                  <FormLabel>Voting Rights (%)</FormLabel>
                  <Input
                    type="number"
                    value={shareholder.voting_rights || ''}
                    onChange={(e) => updateShareholder(index, 'voting_rights', e.target.value ? parseFloat(e.target.value) : undefined)}
                    placeholder="e.g., 25.5"
                    min={0}
                    max={100}
                    step={0.1}
                  />
                </div>
              </div>
            </div>
          ))}
          
          <Button
            type="button"
            variant="outline"
            onClick={addShareholder}
            className="w-full"
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Shareholder
          </Button>
          
          {shareholders.length > 0 && (
            <div className="mt-4 p-3 bg-muted rounded-lg">
              <p className="text-sm font-medium">Total Ownership: 
                <span className={`ml-1 ${
                  shareholders.reduce((sum, s) => sum + s.ownership_percentage, 0) > 100 
                    ? 'text-red-600' 
                    : 'text-green-600'
                }`}>
                  {shareholders.reduce((sum, s) => sum + s.ownership_percentage, 0).toFixed(1)}%
                </span>
              </p>
            </div>
          )}
        </CardContent>
      </Card>
      
      {/* External Advisors */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Mail className="h-5 w-5" />
            External Advisors & Professional Services
          </CardTitle>
          <CardDescription>
            Key external advisors and service providers
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              control={control}
              name="stakeholder_info.legal_advisor"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Legal Advisor</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Law firm name"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={control}
              name="stakeholder_info.financial_advisor"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Financial Advisor</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Advisory firm name"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={control}
              name="stakeholder_info.auditor"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>External Auditor</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Accounting firm name"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={control}
              name="stakeholder_info.property_advisor"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Property Advisor</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Property consultant name"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          
          <FormField
            control={control}
            name="stakeholder_info.other_advisors"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Other Key Advisors</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="List any other important advisors, consultants, or service providers..."
                    rows={3}
                    {...field}
                  />
                </FormControl>
                <FormDescription>
                  Include tax advisors, insurance brokers, technical consultants, etc.
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