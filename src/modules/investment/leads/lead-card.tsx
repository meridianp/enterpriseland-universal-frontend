'use client';

import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { 
  Building2, 
  User, 
  Mail, 
  Phone, 
  Calendar,
  AlertCircle,
  TrendingUp,
  DollarSign,
  GripVertical,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import type { Lead } from '@/lib/types/leads.types';
import { formatDistanceToNow } from 'date-fns';

interface LeadCardProps {
  lead: Lead;
  onClick?: () => void;
  isSelected?: boolean;
  onSelectionChange?: (selected: boolean) => void;
  isDragging?: boolean;
}

export function LeadCard({
  lead,
  onClick,
  isSelected = false,
  onSelectionChange,
  isDragging = false,
}: LeadCardProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging: isSortableDragging,
  } = useSortable({ 
    id: lead.id,
    disabled: isDragging,
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const handleCheckboxClick = (e: React.MouseEvent) => {
    e.stopPropagation();
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'URGENT':
        return 'bg-red-500';
      case 'HIGH':
        return 'bg-orange-500';
      case 'MEDIUM':
        return 'bg-yellow-500';
      case 'LOW':
        return 'bg-green-500';
      default:
        return 'bg-gray-500';
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-yellow-600';
    if (score >= 40) return 'text-orange-600';
    return 'text-red-600';
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={cn(
        'relative',
        isSortableDragging && 'opacity-50'
      )}
    >
      <Card
        className={cn(
          'cursor-pointer transition-all hover:shadow-md',
          isSelected && 'ring-2 ring-primary',
          isDragging && 'shadow-lg rotate-3'
        )}
        onClick={onClick}
      >
        <CardContent className="p-4">
          <div className="flex items-start gap-3">
            {!isDragging && onSelectionChange && (
              <Checkbox
                checked={isSelected}
                onCheckedChange={onSelectionChange}
                onClick={handleCheckboxClick}
                className="mt-1"
              />
            )}

            <div 
              className="absolute right-2 top-2 cursor-grab active:cursor-grabbing"
              {...attributes}
              {...listeners}
            >
              <GripVertical className="h-4 w-4 text-muted-foreground" />
            </div>

            <div className="flex-1 space-y-3">
              {/* Company and Score */}
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-2">
                  <Building2 className="h-4 w-4 text-muted-foreground" />
                  <h4 className="font-semibold line-clamp-1">{lead.company_name}</h4>
                </div>
                <div className="flex items-center gap-2">
                  <TrendingUp className={cn('h-4 w-4', getScoreColor(lead.lead_score))} />
                  <span className={cn('text-sm font-medium', getScoreColor(lead.lead_score))}>
                    {lead.lead_score}
                  </span>
                </div>
              </div>

              {/* Contact Info */}
              {lead.contact_name && (
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <User className="h-3 w-3" />
                  <span className="line-clamp-1">{lead.contact_name}</span>
                  {lead.contact_title && (
                    <span className="text-xs">• {lead.contact_title}</span>
                  )}
                </div>
              )}

              {/* Priority and Value */}
              <div className="flex items-center justify-between">
                <Badge 
                  variant="outline" 
                  className={cn('gap-1', getPriorityColor(lead.priority), 'text-white border-0')}
                >
                  {lead.priority}
                </Badge>
                {lead.conversion_value && (
                  <div className="flex items-center gap-1 text-sm font-medium">
                    <DollarSign className="h-3 w-3" />
                    {(lead.conversion_value / 1000).toFixed(0)}k
                  </div>
                )}
              </div>

              {/* Tags */}
              {lead.tags && lead.tags.length > 0 && (
                <div className="flex flex-wrap gap-1">
                  {lead.tags.slice(0, 3).map(tag => (
                    <Badge key={tag} variant="secondary" className="text-xs">
                      {tag}
                    </Badge>
                  ))}
                  {lead.tags.length > 3 && (
                    <Badge variant="secondary" className="text-xs">
                      +{lead.tags.length - 3}
                    </Badge>
                  )}
                </div>
              )}

              {/* Assignment and Dates */}
              <div className="flex items-center justify-between text-xs text-muted-foreground">
                {lead.assigned_to_name && (
                  <div className="flex items-center gap-1">
                    <Avatar className="h-5 w-5">
                      <AvatarFallback className="text-xs">
                        {lead.assigned_to_name.charAt(0).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <span>{lead.assigned_to_name}</span>
                  </div>
                )}
                <div className="flex items-center gap-2">
                  {lead.is_overdue && (
                    <AlertCircle className="h-3 w-3 text-red-500" />
                  )}
                  {lead.next_action_date && (
                    <div className="flex items-center gap-1">
                      <Calendar className="h-3 w-3" />
                      <span>
                        {formatDistanceToNow(new Date(lead.next_action_date), { 
                          addSuffix: true 
                        })}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}