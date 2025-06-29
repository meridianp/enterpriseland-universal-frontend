'use client';

import { useDroppable } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { cn } from '@/lib/utils';
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { LeadCard } from './lead-card';
import type { Lead, LeadStatus } from '@/lib/types/leads.types';

interface PipelineColumnProps {
  status: LeadStatus;
  label: string;
  color: string;
  leads: Lead[];
  onLeadClick: (lead: Lead) => void;
  selectedLeads: string[];
  onSelectionChange: (leads: string[]) => void;
}

export function PipelineColumn({
  status,
  label,
  color,
  leads,
  onLeadClick,
  selectedLeads,
  onSelectionChange,
}: PipelineColumnProps) {
  const { setNodeRef, isOver } = useDroppable({
    id: status,
  });

  const totalValue = leads.reduce((sum, lead) => sum + (lead.conversion_value || 0), 0);

  return (
    <div
      ref={setNodeRef}
      className={cn(
        'flex flex-col w-80 bg-muted/50 rounded-lg transition-colors',
        isOver && 'bg-muted ring-2 ring-primary/20'
      )}
    >
      <div className="p-4 border-b">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <div className={cn('w-3 h-3 rounded-full', color)} />
            <h3 className="font-semibold">{label}</h3>
          </div>
          <Badge variant="secondary">{leads.length}</Badge>
        </div>
        {totalValue > 0 && (
          <p className="text-sm text-muted-foreground">
            ${totalValue.toLocaleString()}
          </p>
        )}
      </div>

      <ScrollArea className="flex-1 h-[600px]">
        <div className="p-2 space-y-2">
          <SortableContext
            items={leads.map(lead => lead.id)}
            strategy={verticalListSortingStrategy}
          >
            {leads.map(lead => (
              <LeadCard
                key={lead.id}
                lead={lead}
                onClick={() => onLeadClick(lead)}
                isSelected={selectedLeads.includes(lead.id)}
                onSelectionChange={(selected) => {
                  if (selected) {
                    onSelectionChange([...selectedLeads, lead.id]);
                  } else {
                    onSelectionChange(selectedLeads.filter(id => id !== lead.id));
                  }
                }}
              />
            ))}
          </SortableContext>
        </div>
      </ScrollArea>
    </div>
  );
}