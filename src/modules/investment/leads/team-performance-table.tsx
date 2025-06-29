'use client';

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import type { LeadAnalytics } from '@/lib/types/leads.types';

interface TeamPerformanceTableProps {
  analytics: LeadAnalytics;
}

export function TeamPerformanceTable({ analytics }: TeamPerformanceTableProps) {
  const teamData = analytics.team.by_assignee.map(member => {
    const activities = analytics.team.activity_metrics.find(
      a => a.user_id === member.user_id
    );
    return {
      ...member,
      ...activities,
    };
  });

  const maxLeads = Math.max(...teamData.map(m => m.total_leads));
  const maxConversion = Math.max(...teamData.map(m => m.conversion_rate));

  const getPerformanceColor = (rate: number) => {
    if (rate >= 30) return 'text-green-600';
    if (rate >= 20) return 'text-yellow-600';
    if (rate >= 10) return 'text-orange-600';
    return 'text-red-600';
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Team Performance</CardTitle>
        <CardDescription>
          Individual performance metrics and activity levels
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Team Member</TableHead>
              <TableHead>Total Leads</TableHead>
              <TableHead>Converted</TableHead>
              <TableHead>Conversion Rate</TableHead>
              <TableHead>Avg. Days to Convert</TableHead>
              <TableHead>Activities</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {teamData.map((member) => (
              <TableRow key={member.user_id}>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <Avatar className="h-8 w-8">
                      <AvatarFallback className="text-xs">
                        {member.user_name.split(' ').map(n => n[0]).join('').toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <span className="font-medium">{member.user_name}</span>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="space-y-1">
                    <span className="font-medium">{member.total_leads}</span>
                    <Progress 
                      value={(member.total_leads / maxLeads) * 100} 
                      className="h-1"
                    />
                  </div>
                </TableCell>
                <TableCell>{member.converted_leads}</TableCell>
                <TableCell>
                  <span className={`font-medium ${getPerformanceColor(member.conversion_rate)}`}>
                    {member.conversion_rate.toFixed(1)}%
                  </span>
                </TableCell>
                <TableCell>
                  {member.average_days_to_convert.toFixed(0)} days
                </TableCell>
                <TableCell>
                  <div className="flex gap-2">
                    {member.emails_count > 0 && (
                      <Badge variant="outline" className="text-xs">
                        {member.emails_count} emails
                      </Badge>
                    )}
                    {member.calls_count > 0 && (
                      <Badge variant="outline" className="text-xs">
                        {member.calls_count} calls
                      </Badge>
                    )}
                    {member.meetings_count > 0 && (
                      <Badge variant="outline" className="text-xs">
                        {member.meetings_count} meetings
                      </Badge>
                    )}
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>

        {/* Team Summary */}
        <div className="mt-6 grid grid-cols-4 gap-4 pt-4 border-t">
          <div>
            <p className="text-sm text-muted-foreground">Team Average</p>
            <p className="text-2xl font-bold">
              {(analytics.overview.conversion_rate).toFixed(1)}%
            </p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Total Activities</p>
            <p className="text-2xl font-bold">
              {analytics.team.activity_metrics.reduce(
                (sum, m) => sum + m.activities_count, 0
              )}
            </p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Active Members</p>
            <p className="text-2xl font-bold">{teamData.length}</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Avg. Response Time</p>
            <p className="text-2xl font-bold">
              {analytics.overview.average_days_to_convert.toFixed(0)}d
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}