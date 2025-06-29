'use client';

import React, { useState } from 'react';
import { Search, Filter, X, User, Calendar } from 'lucide-react';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Slider } from "@/components/ui/slider";
// import { DateRangePicker } from "@/components/ui/date-range-picker";
import { useDebounce } from '@/lib/hooks/useDebounce';
import type { LeadFilters, LeadStatus, LeadPriority, LeadSource } from '@/lib/types/leads.types';

interface LeadFiltersBarProps {
  filters: LeadFilters;
  onFiltersChange: (filters: LeadFilters) => void;
  showMyLeads: boolean;
  onToggleMyLeads: (show: boolean) => void;
}

const STATUS_OPTIONS: { value: LeadStatus; label: string }[] = [
  { value: 'NEW', label: 'New' },
  { value: 'QUALIFIED', label: 'Qualified' },
  { value: 'CONTACTED', label: 'Contacted' },
  { value: 'MEETING_SCHEDULED', label: 'Meeting Scheduled' },
  { value: 'PROPOSAL_SENT', label: 'Proposal Sent' },
  { value: 'NEGOTIATING', label: 'Negotiating' },
  { value: 'CONVERTED', label: 'Converted' },
  { value: 'LOST', label: 'Lost' },
  { value: 'ON_HOLD', label: 'On Hold' },
];

const PRIORITY_OPTIONS: { value: LeadPriority; label: string }[] = [
  { value: 'URGENT', label: 'Urgent' },
  { value: 'HIGH', label: 'High' },
  { value: 'MEDIUM', label: 'Medium' },
  { value: 'LOW', label: 'Low' },
];

const SOURCE_OPTIONS: { value: LeadSource; label: string }[] = [
  { value: 'MARKET_INTELLIGENCE', label: 'Market Intelligence' },
  { value: 'REFERRAL', label: 'Referral' },
  { value: 'WEBSITE', label: 'Website' },
  { value: 'EVENT', label: 'Event' },
  { value: 'COLD_OUTREACH', label: 'Cold Outreach' },
  { value: 'PARTNER', label: 'Partner' },
  { value: 'OTHER', label: 'Other' },
];

export function LeadFiltersBar({
  filters,
  onFiltersChange,
  showMyLeads,
  onToggleMyLeads,
}: LeadFiltersBarProps) {
  const [searchTerm, setSearchTerm] = useState(filters.search || '');
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [scoreRange, setScoreRange] = useState<[number, number]>([
    filters.score_min || 0,
    filters.score_max || 100,
  ]);

  const debouncedSearch = useDebounce(searchTerm, 300);

  // Update filters when debounced search changes
  React.useEffect(() => {
    if (debouncedSearch !== filters.search) {
      onFiltersChange({ ...filters, search: debouncedSearch });
    }
  }, [debouncedSearch]);

  const handleClearFilters = () => {
    setSearchTerm('');
    setScoreRange([0, 100]);
    onFiltersChange({});
    onToggleMyLeads(false);
  };

  const activeFiltersCount = [
    filters.status,
    filters.priority,
    filters.source,
    filters.is_overdue,
    filters.score_min,
    filters.score_max,
    filters.created_after,
    filters.created_before,
    showMyLeads,
  ].filter(Boolean).length;

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-4">
        {/* Search */}
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search leads..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>

        {/* My Leads Toggle */}
        <div className="flex items-center gap-2">
          <Switch
            id="my-leads"
            checked={showMyLeads}
            onCheckedChange={onToggleMyLeads}
          />
          <Label htmlFor="my-leads" className="cursor-pointer">
            <div className="flex items-center gap-2">
              <User className="h-4 w-4" />
              My Leads
            </div>
          </Label>
        </div>

        {/* Quick Filters */}
        <Select
          value={filters.status as string}
          onValueChange={(value) => onFiltersChange({ ...filters, status: value as LeadStatus })}
        >
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="All Statuses" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Statuses</SelectItem>
            {STATUS_OPTIONS.map(option => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select
          value={filters.priority as string}
          onValueChange={(value) => onFiltersChange({ ...filters, priority: value as LeadPriority })}
        >
          <SelectTrigger className="w-[140px]">
            <SelectValue placeholder="All Priorities" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Priorities</SelectItem>
            {PRIORITY_OPTIONS.map(option => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* Advanced Filters */}
        <Popover open={showAdvanced} onOpenChange={setShowAdvanced}>
          <PopoverTrigger asChild>
            <Button variant="outline" className="gap-2">
              <Filter className="h-4 w-4" />
              Filters
              {activeFiltersCount > 0 && (
                <Badge variant="secondary" className="ml-1">
                  {activeFiltersCount}
                </Badge>
              )}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-96" align="end">
            <div className="space-y-4">
              <h4 className="font-medium">Advanced Filters</h4>

              {/* Source Filter */}
              <div className="space-y-2">
                <Label>Source</Label>
                <Select
                  value={filters.source as string}
                  onValueChange={(value) => onFiltersChange({ ...filters, source: value as LeadSource })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="All Sources" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Sources</SelectItem>
                    {SOURCE_OPTIONS.map(option => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Score Range */}
              <div className="space-y-2">
                <Label>Lead Score Range</Label>
                <div className="px-2">
                  <Slider
                    value={scoreRange}
                    onValueChange={setScoreRange}
                    max={100}
                    step={5}
                    className="w-full"
                  />
                  <div className="flex justify-between mt-1 text-sm text-muted-foreground">
                    <span>{scoreRange[0]}</span>
                    <span>{scoreRange[1]}</span>
                  </div>
                </div>
              </div>

              {/* Date Range */}
              <div className="space-y-2">
                <Label>Created Date</Label>
                <div className="flex gap-2">
                  <Input
                    type="date"
                    value={filters.created_after?.split('T')[0] || ''}
                    onChange={(e) => onFiltersChange({
                      ...filters,
                      created_after: e.target.value ? new Date(e.target.value).toISOString() : undefined,
                    })}
                    placeholder="From"
                  />
                  <Input
                    type="date"
                    value={filters.created_before?.split('T')[0] || ''}
                    onChange={(e) => onFiltersChange({
                      ...filters,
                      created_before: e.target.value ? new Date(e.target.value).toISOString() : undefined,
                    })}
                    placeholder="To"
                  />
                </div>
              </div>

              {/* Overdue Toggle */}
              <div className="flex items-center justify-between">
                <Label htmlFor="overdue">Show only overdue leads</Label>
                <Switch
                  id="overdue"
                  checked={filters.is_overdue || false}
                  onCheckedChange={(checked) => onFiltersChange({ ...filters, is_overdue: checked })}
                />
              </div>

              {/* Apply/Clear Buttons */}
              <div className="flex gap-2 pt-2">
                <Button
                  variant="outline"
                  size="sm"
                  className="flex-1"
                  onClick={() => {
                    onFiltersChange({
                      ...filters,
                      score_min: scoreRange[0],
                      score_max: scoreRange[1],
                    });
                    setShowAdvanced(false);
                  }}
                >
                  Apply Filters
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleClearFilters}
                >
                  Clear All
                </Button>
              </div>
            </div>
          </PopoverContent>
        </Popover>

        {/* Clear Filters */}
        {activeFiltersCount > 0 && (
          <Button
            variant="ghost"
            size="sm"
            onClick={handleClearFilters}
            className="gap-1"
          >
            <X className="h-3 w-3" />
            Clear
          </Button>
        )}
      </div>

      {/* Active Filters Display */}
      {activeFiltersCount > 0 && (
        <div className="flex flex-wrap gap-2">
          {showMyLeads && (
            <Badge variant="secondary" className="gap-1">
              My Leads
              <X
                className="h-3 w-3 cursor-pointer"
                onClick={() => onToggleMyLeads(false)}
              />
            </Badge>
          )}
          {filters.status && filters.status !== 'all' && (
            <Badge variant="secondary" className="gap-1">
              Status: {STATUS_OPTIONS.find(s => s.value === filters.status)?.label}
              <X
                className="h-3 w-3 cursor-pointer"
                onClick={() => onFiltersChange({ ...filters, status: undefined })}
              />
            </Badge>
          )}
          {filters.priority && filters.priority !== 'all' && (
            <Badge variant="secondary" className="gap-1">
              Priority: {PRIORITY_OPTIONS.find(p => p.value === filters.priority)?.label}
              <X
                className="h-3 w-3 cursor-pointer"
                onClick={() => onFiltersChange({ ...filters, priority: undefined })}
              />
            </Badge>
          )}
          {filters.is_overdue && (
            <Badge variant="secondary" className="gap-1">
              Overdue
              <X
                className="h-3 w-3 cursor-pointer"
                onClick={() => onFiltersChange({ ...filters, is_overdue: undefined })}
              />
            </Badge>
          )}
          {(filters.score_min || filters.score_max) && (
            <Badge variant="secondary" className="gap-1">
              Score: {filters.score_min || 0}-{filters.score_max || 100}
              <X
                className="h-3 w-3 cursor-pointer"
                onClick={() => {
                  onFiltersChange({ ...filters, score_min: undefined, score_max: undefined });
                  setScoreRange([0, 100]);
                }}
              />
            </Badge>
          )}
        </div>
      )}
    </div>
  );
}