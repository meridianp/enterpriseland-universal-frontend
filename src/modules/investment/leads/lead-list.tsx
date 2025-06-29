'use client';

import { useState } from 'react';
import { 
  Building2, 
  User, 
  Mail, 
  Phone, 
  Calendar,
  TrendingUp,
  DollarSign,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import React from 'react';
import { cn } from '@/lib/utils';
import type { Lead, LeadStatus, LeadPriority } from '@/lib/types/leads.types';
import { formatDistanceToNow } from 'date-fns';

interface LeadListProps {
  leads: Lead[];
  onLeadClick: (lead: Lead) => void;
  selectedLeads: string[];
  onSelectionChange: (leads: string[]) => void;
}

type SortField = 'company_name' | 'lead_score' | 'status' | 'priority' | 'created_at' | 'next_action_date';
type SortOrder = 'asc' | 'desc';

export function LeadList({
  leads,
  onLeadClick,
  selectedLeads,
  onSelectionChange,
}: LeadListProps) {
  const [sortField, setSortField] = useState<SortField>('created_at');
  const [sortOrder, setSortOrder] = useState<SortOrder>('desc');

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortOrder('asc');
    }
  };

  const sortedLeads = [...leads].sort((a, b) => {
    const aValue = a[sortField] || '';
    const bValue = b[sortField] || '';
    
    if (sortOrder === 'asc') {
      return aValue > bValue ? 1 : -1;
    } else {
      return aValue < bValue ? 1 : -1;
    }
  });

  const handleSelectAll = () => {
    if (selectedLeads.length === leads.length) {
      onSelectionChange([]);
    } else {
      onSelectionChange(leads.map(lead => lead.id));
    }
  };

  const getStatusColor = (status: LeadStatus) => {
    const colors: Record<LeadStatus, string> = {
      NEW: 'bg-slate-500',
      QUALIFIED: 'bg-blue-500',
      CONTACTED: 'bg-indigo-500',
      MEETING_SCHEDULED: 'bg-purple-500',
      PROPOSAL_SENT: 'bg-orange-500',
      NEGOTIATING: 'bg-yellow-500',
      CONVERTED: 'bg-green-500',
      LOST: 'bg-red-500',
      ON_HOLD: 'bg-gray-500',
    };
    return colors[status] || 'bg-gray-500';
  };

  const getPriorityColor = (priority: LeadPriority) => {
    const colors: Record<LeadPriority, string> = {
      URGENT: 'text-red-600 bg-red-50',
      HIGH: 'text-orange-600 bg-orange-50',
      MEDIUM: 'text-yellow-600 bg-yellow-50',
      LOW: 'text-green-600 bg-green-50',
    };
    return colors[priority] || 'text-gray-600 bg-gray-50';
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-yellow-600';
    if (score >= 40) return 'text-orange-600';
    return 'text-red-600';
  };

  const SortButton = ({ field, children }: { field: SortField; children: React.ReactNode }) => (
    <Button
      variant="ghost"
      size="sm"
      className="h-auto p-0 font-medium hover:bg-transparent"
      onClick={() => handleSort(field)}
    >
      {children}
      {sortField === field && (
        sortOrder === 'asc' ? <ChevronUp className="ml-1 h-3 w-3" /> : <ChevronDown className="ml-1 h-3 w-3" />
      )}
    </Button>
  );

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-12">
              <Checkbox
                checked={selectedLeads.length === leads.length && leads.length > 0}
                onCheckedChange={handleSelectAll}
              />
            </TableHead>
            <TableHead>
              <SortButton field="company_name">Company</SortButton>
            </TableHead>
            <TableHead>Contact</TableHead>
            <TableHead>
              <SortButton field="status">Status</SortButton>
            </TableHead>
            <TableHead>
              <SortButton field="priority">Priority</SortButton>
            </TableHead>
            <TableHead className="text-center">
              <SortButton field="lead_score">Score</SortButton>
            </TableHead>
            <TableHead className="text-right">Value</TableHead>
            <TableHead>Assigned To</TableHead>
            <TableHead>
              <SortButton field="next_action_date">Next Action</SortButton>
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {sortedLeads.map((lead) => (
            <TableRow
              key={lead.id}
              className="cursor-pointer hover:bg-muted/50"
              onClick={() => onLeadClick(lead)}
            >
              <TableCell onClick={(e) => e.stopPropagation()}>
                <Checkbox
                  checked={selectedLeads.includes(lead.id)}
                  onCheckedChange={(checked) => {
                    if (checked) {
                      onSelectionChange([...selectedLeads, lead.id]);
                    } else {
                      onSelectionChange(selectedLeads.filter(id => id !== lead.id));
                    }
                  }}
                />
              </TableCell>
              <TableCell>
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <Building2 className="h-4 w-4 text-muted-foreground" />
                    <span className="font-medium">{lead.company_name}</span>
                  </div>
                  {lead.industry && (
                    <span className="text-sm text-muted-foreground">{lead.industry}</span>
                  )}
                </div>
              </TableCell>
              <TableCell>
                {lead.contact_name ? (
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <User className="h-3 w-3 text-muted-foreground" />
                      <span className="text-sm">{lead.contact_name}</span>
                    </div>
                    {lead.contact_email && (
                      <div className="flex items-center gap-2">
                        <Mail className="h-3 w-3 text-muted-foreground" />
                        <span className="text-xs text-muted-foreground">{lead.contact_email}</span>
                      </div>
                    )}
                  </div>
                ) : (
                  <span className="text-sm text-muted-foreground">No contact</span>
                )}
              </TableCell>
              <TableCell>
                <Badge 
                  className={cn('text-white border-0', getStatusColor(lead.status))}
                >
                  {lead.status.replace(/_/g, ' ')}
                </Badge>
              </TableCell>
              <TableCell>
                <Badge 
                  variant="outline"
                  className={getPriorityColor(lead.priority)}
                >
                  {lead.priority}
                </Badge>
              </TableCell>
              <TableCell className="text-center">
                <div className="flex items-center justify-center gap-1">
                  <TrendingUp className={cn('h-4 w-4', getScoreColor(lead.lead_score))} />
                  <span className={cn('font-medium', getScoreColor(lead.lead_score))}>
                    {lead.lead_score}
                  </span>
                </div>
              </TableCell>
              <TableCell className="text-right">
                {lead.conversion_value ? (
                  <div className="flex items-center justify-end gap-1">
                    <DollarSign className="h-3 w-3 text-muted-foreground" />
                    <span className="font-medium">
                      {(lead.conversion_value / 1000).toFixed(0)}k
                    </span>
                  </div>
                ) : (
                  <span className="text-muted-foreground">-</span>
                )}
              </TableCell>
              <TableCell>
                {lead.assigned_to_name ? (
                  <div className="flex items-center gap-2">
                    <Avatar className="h-6 w-6">
                      <AvatarFallback className="text-xs">
                        {lead.assigned_to_name.charAt(0).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <span className="text-sm">{lead.assigned_to_name}</span>
                  </div>
                ) : (
                  <span className="text-sm text-muted-foreground">Unassigned</span>
                )}
              </TableCell>
              <TableCell>
                {lead.next_action_date ? (
                  <div className="space-y-1">
                    <div className="flex items-center gap-1">
                      <Calendar className="h-3 w-3 text-muted-foreground" />
                      <span className={cn('text-sm', lead.is_overdue && 'text-red-600 font-medium')}>
                        {formatDistanceToNow(new Date(lead.next_action_date), { 
                          addSuffix: true 
                        })}
                      </span>
                    </div>
                    {lead.next_action_type && (
                      <span className="text-xs text-muted-foreground">
                        {lead.next_action_type.replace(/_/g, ' ').toLowerCase()}
                      </span>
                    )}
                  </div>
                ) : (
                  <span className="text-sm text-muted-foreground">-</span>
                )}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}