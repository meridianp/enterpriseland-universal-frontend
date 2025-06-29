'use client';

import { useState } from 'react';
import { 
  Mail, 
  Phone, 
  Calendar,
  UserPlus,
  Tag,
  Trash2,
  FileDown,
  TrendingUp,
  CheckCircle,
  X,
} from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useBulkAction, useExportLeads } from '@/lib/hooks/use-leads';
import { toast } from 'sonner';
import type { LeadStatus, LeadPriority } from '@/lib/types/leads.types';

interface QuickActionsProps {
  selectedLeads: string[];
  onClearSelection: () => void;
}

export function QuickActions({ selectedLeads, onClearSelection }: QuickActionsProps) {
  const [showBulkDialog, setShowBulkDialog] = useState(false);
  const [bulkAction, setBulkAction] = useState<'status' | 'priority' | 'assign' | 'tag'>('status');
  const [bulkValue, setBulkValue] = useState('');
  const [bulkTags, setBulkTags] = useState('');

  const bulkActionMutation = useBulkAction();
  const exportMutation = useExportLeads();

  const handleBulkAction = () => {
    if (!bulkValue && bulkAction !== 'tag') {
      toast.error('Please select a value');
      return;
    }

    const data: any = {};
    switch (bulkAction) {
      case 'status':
        data.status = bulkValue as LeadStatus;
        break;
      case 'priority':
        data.priority = bulkValue as LeadPriority;
        break;
      case 'assign':
        data.assigned_to = bulkValue;
        break;
      case 'tag':
        data.tags = bulkTags.split(',').map(tag => tag.trim()).filter(Boolean);
        break;
    }

    bulkActionMutation.mutate(
      {
        lead_ids: selectedLeads,
        action: `UPDATE_${bulkAction.toUpperCase()}` as any,
        data,
      },
      {
        onSuccess: (result) => {
          toast.success(`Successfully updated ${result.success} leads`);
          if (result.failed > 0) {
            toast.error(`Failed to update ${result.failed} leads`);
          }
          setShowBulkDialog(false);
          onClearSelection();
        },
        onError: () => {
          toast.error('Failed to perform bulk action');
        },
      }
    );
  };

  const handleExport = (format: 'csv' | 'excel') => {
    exportMutation.mutate(
      { format },
      {
        onSuccess: (blob) => {
          const url = window.URL.createObjectURL(blob);
          const a = document.createElement('a');
          a.href = url;
          a.download = `leads-export.${format === 'csv' ? 'csv' : 'xlsx'}`;
          document.body.appendChild(a);
          a.click();
          window.URL.revokeObjectURL(url);
          document.body.removeChild(a);
          toast.success('Export completed');
        },
        onError: () => {
          toast.error('Failed to export leads');
        },
      }
    );
  };

  if (selectedLeads.length === 0) {
    return null;
  }

  return (
    <>
      <div className="bg-muted/50 border rounded-lg p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <CheckCircle className="h-4 w-4 text-primary" />
            <span className="text-sm font-medium">
              {selectedLeads.length} lead{selectedLeads.length > 1 ? 's' : ''} selected
            </span>
          </div>

          <div className="flex items-center gap-2">
            {/* Quick Actions */}
            <Button
              size="sm"
              variant="outline"
              onClick={() => toast.info('Email feature coming soon')}
            >
              <Mail className="h-4 w-4 mr-1" />
              Email
            </Button>

            <Button
              size="sm"
              variant="outline"
              onClick={() => toast.info('Call feature coming soon')}
            >
              <Phone className="h-4 w-4 mr-1" />
              Call
            </Button>

            <Button
              size="sm"
              variant="outline"
              onClick={() => toast.info('Schedule feature coming soon')}
            >
              <Calendar className="h-4 w-4 mr-1" />
              Schedule
            </Button>

            {/* Bulk Actions Dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button size="sm" variant="outline">
                  Bulk Actions
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>Bulk Actions</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={() => {
                    setBulkAction('status');
                    setShowBulkDialog(true);
                  }}
                >
                  Update Status
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => {
                    setBulkAction('priority');
                    setShowBulkDialog(true);
                  }}
                >
                  Update Priority
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => {
                    setBulkAction('assign');
                    setShowBulkDialog(true);
                  }}
                >
                  <UserPlus className="h-4 w-4 mr-2" />
                  Assign To
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => {
                    setBulkAction('tag');
                    setShowBulkDialog(true);
                  }}
                >
                  <Tag className="h-4 w-4 mr-2" />
                  Add Tags
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={() => toast.info('Score feature coming soon')}
                >
                  <TrendingUp className="h-4 w-4 mr-2" />
                  Recalculate Score
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  className="text-destructive"
                  onClick={() => toast.warning('Delete feature coming soon')}
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  Delete
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Export */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button size="sm" variant="outline">
                  <FileDown className="h-4 w-4 mr-1" />
                  Export
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem onClick={() => handleExport('csv')}>
                  Export as CSV
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleExport('excel')}>
                  Export as Excel
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            <Button
              size="sm"
              variant="ghost"
              onClick={onClearSelection}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Bulk Action Dialog */}
      <Dialog open={showBulkDialog} onOpenChange={setShowBulkDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {bulkAction === 'status' && 'Update Status'}
              {bulkAction === 'priority' && 'Update Priority'}
              {bulkAction === 'assign' && 'Assign Leads'}
              {bulkAction === 'tag' && 'Add Tags'}
            </DialogTitle>
            <DialogDescription>
              This action will be applied to {selectedLeads.length} selected lead{selectedLeads.length > 1 ? 's' : ''}.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            {bulkAction === 'status' && (
              <div className="space-y-2">
                <Label>New Status</Label>
                <Select value={bulkValue} onValueChange={setBulkValue}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="NEW">New</SelectItem>
                    <SelectItem value="QUALIFIED">Qualified</SelectItem>
                    <SelectItem value="CONTACTED">Contacted</SelectItem>
                    <SelectItem value="MEETING_SCHEDULED">Meeting Scheduled</SelectItem>
                    <SelectItem value="PROPOSAL_SENT">Proposal Sent</SelectItem>
                    <SelectItem value="NEGOTIATING">Negotiating</SelectItem>
                    <SelectItem value="CONVERTED">Converted</SelectItem>
                    <SelectItem value="LOST">Lost</SelectItem>
                    <SelectItem value="ON_HOLD">On Hold</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            )}

            {bulkAction === 'priority' && (
              <div className="space-y-2">
                <Label>New Priority</Label>
                <Select value={bulkValue} onValueChange={setBulkValue}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select priority" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="URGENT">Urgent</SelectItem>
                    <SelectItem value="HIGH">High</SelectItem>
                    <SelectItem value="MEDIUM">Medium</SelectItem>
                    <SelectItem value="LOW">Low</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            )}

            {bulkAction === 'assign' && (
              <div className="space-y-2">
                <Label>Assign To</Label>
                <Input
                  placeholder="Enter user ID or email"
                  value={bulkValue}
                  onChange={(e) => setBulkValue(e.target.value)}
                />
              </div>
            )}

            {bulkAction === 'tag' && (
              <div className="space-y-2">
                <Label>Tags</Label>
                <Textarea
                  placeholder="Enter tags separated by commas"
                  value={bulkTags}
                  onChange={(e) => setBulkTags(e.target.value)}
                  rows={3}
                />
                <p className="text-sm text-muted-foreground">
                  Example: investment, high-priority, follow-up
                </p>
              </div>
            )}
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setShowBulkDialog(false)}>
              Cancel
            </Button>
            <Button onClick={handleBulkAction} disabled={bulkActionMutation.isPending}>
              {bulkActionMutation.isPending ? 'Updating...' : 'Apply'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}