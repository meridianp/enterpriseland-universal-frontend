'use client';

import { useRef, useState } from 'react';
import { DndContext, DragEndEvent, DragOverlay, closestCenter } from '@dnd-kit/core';
import { 
  SortableContext, 
  horizontalListSortingStrategy,
  verticalListSortingStrategy 
} from '@dnd-kit/sortable';
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { LeadCard } from './lead-card';
import { PipelineColumn } from './pipeline-column';
import type { Lead, LeadStatus } from '@/lib/types/leads.types';
import { useUpdateLeadStatus } from '@/lib/hooks/use-leads';
import { toast } from 'sonner';

interface LeadPipelineProps {
  leadsByStatus: Record<LeadStatus, Lead[]>;
  onLeadClick: (lead: Lead) => void;
  selectedLeads: string[];
  onSelectionChange: (leads: string[]) => void;
}

const PIPELINE_STAGES: { status: LeadStatus; label: string; color: string }[] = [
  { status: 'NEW', label: 'New', color: 'bg-slate-500' },
  { status: 'QUALIFIED', label: 'Qualified', color: 'bg-blue-500' },
  { status: 'CONTACTED', label: 'Contacted', color: 'bg-indigo-500' },
  { status: 'MEETING_SCHEDULED', label: 'Meeting Scheduled', color: 'bg-purple-500' },
  { status: 'PROPOSAL_SENT', label: 'Proposal Sent', color: 'bg-orange-500' },
  { status: 'NEGOTIATING', label: 'Negotiating', color: 'bg-yellow-500' },
  { status: 'CONVERTED', label: 'Converted', color: 'bg-green-500' },
];

export function LeadPipeline({
  leadsByStatus,
  onLeadClick,
  selectedLeads,
  onSelectionChange,
}: LeadPipelineProps) {
  const [activeId, setActiveId] = useState<string | null>(null);
  const updateStatus = useUpdateLeadStatus();

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    
    if (!over || active.id === over.id) {
      setActiveId(null);
      return;
    }

    const leadId = active.id as string;
    const newStatus = over.id as LeadStatus;
    
    // Find the lead
    let lead: Lead | undefined;
    for (const status of Object.keys(leadsByStatus)) {
      const found = leadsByStatus[status as LeadStatus].find(l => l.id === leadId);
      if (found) {
        lead = found;
        break;
      }
    }

    if (!lead || lead.status === newStatus) {
      setActiveId(null);
      return;
    }

    // Update lead status
    updateStatus.mutate(
      { leadId, status: newStatus },
      {
        onSuccess: () => {
          toast.success(`Lead moved to ${PIPELINE_STAGES.find(s => s.status === newStatus)?.label}`);
        },
        onError: () => {
          toast.error('Failed to update lead status');
        },
      }
    );

    setActiveId(null);
  };

  const activeLead = activeId
    ? Object.values(leadsByStatus).flat().find(lead => lead.id === activeId)
    : null;

  return (
    <DndContext
      collisionDetection={closestCenter}
      onDragStart={(event) => setActiveId(event.active.id as string)}
      onDragEnd={handleDragEnd}
    >
      <ScrollArea className="w-full">
        <div className="flex gap-4 pb-4 min-w-max">
          <SortableContext
            items={PIPELINE_STAGES.map(stage => stage.status)}
            strategy={horizontalListSortingStrategy}
          >
            {PIPELINE_STAGES.map(stage => (
              <PipelineColumn
                key={stage.status}
                status={stage.status}
                label={stage.label}
                color={stage.color}
                leads={leadsByStatus[stage.status] || []}
                onLeadClick={onLeadClick}
                selectedLeads={selectedLeads}
                onSelectionChange={onSelectionChange}
              />
            ))}
          </SortableContext>
        </div>
        <ScrollBar orientation="horizontal" />
      </ScrollArea>

      <DragOverlay>
        {activeId && activeLead ? (
          <LeadCard lead={activeLead} isDragging />
        ) : null}
      </DragOverlay>
    </DndContext>
  );
}