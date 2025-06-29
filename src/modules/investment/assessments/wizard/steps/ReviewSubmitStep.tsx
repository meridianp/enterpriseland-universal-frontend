'use client';

import { useState } from 'react';
import { useFormContext } from 'react-hook-form';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { 
  Building2, 
  Users, 
  DollarSign, 
  BarChart3, 
  MapPin, 
  AlertTriangle,
  CheckCircle,
  FileText,
  Clock,
  Calculator
} from 'lucide-react';
import { WizardStepProps } from '../types';
import { formatCurrency } from '@/lib/utils';
import { Currency, AssessmentType } from '@/lib/types/assessment.types';

export function ReviewSubmitStep({ data, onUpdate }: WizardStepProps) {
  const { watch, getValues } = useFormContext();
  const [comments, setComments] = useState('');
  const [decision, setDecision] = useState<'approve' | 'reject' | 'review' | null>(null);
  
  const formData = getValues();
  const assessmentType = watch('assessment_type');
  const currency = watch('financial_info.currency') || Currency.GBP;
  
  // Calculate completeness
  const calculateCompleteness = () => {
    const requiredFields = {
      basicInfo: ['partner_name', 'business_description'].filter(field => formData[field]),
      financialInfo: ['revenue', 'ebitda'].filter(field => formData.financial_info?.[field]),
      operationalInfo: ['total_employees', 'key_management_experience'].filter(field => formData.operational_info?.[field]),
    };
    
    const totalRequired = 10; // Adjust based on actual requirements
    const completed = Object.values(requiredFields).flat().length;
    return Math.round((completed / totalRequired) * 100);
  };
  
  const completeness = calculateCompleteness();
  
  // Calculate risk score (simplified)
  const calculateRiskScore = () => {
    let totalScore = 0;
    let maxScore = 0;
    
    // Financial risk factors
    const debtRatio = formData.financial_info?.debt_ratio_category;
    if (debtRatio) {
      const scores = { low: 40, medium: 25, high: 10 };
      totalScore += scores[debtRatio as keyof typeof scores] || 0;
      maxScore += 40;
    }
    
    // Credit rating
    const creditRating = formData.credit_info?.credit_rating;
    if (creditRating) {
      // Simplified scoring based on rating
      const ratingScore = creditRating.includes('A') ? 35 : creditRating.includes('B') ? 20 : 10;
      totalScore += ratingScore;
      maxScore += 35;
    }
    
    // Management experience
    const experience = formData.operational_info?.key_management_experience;
    if (experience) {
      const scores = { high: 25, medium: 15, low: 5 };
      totalScore += scores[experience as keyof typeof scores] || 0;
      maxScore += 25;
    }
    
    return maxScore > 0 ? Math.round((totalScore / maxScore) * 200) : 0;
  };
  
  const riskScore = calculateRiskScore();
  
  const getRiskLevel = (score: number) => {
    if (score >= 150) return { level: 'Low', color: 'text-green-600', bgColor: 'bg-green-50' };
    if (score >= 100) return { level: 'Medium', color: 'text-yellow-600', bgColor: 'bg-yellow-50' };
    return { level: 'High', color: 'text-red-600', bgColor: 'bg-red-50' };
  };
  
  const riskLevel = getRiskLevel(riskScore);
  
  // Validation checks
  const validationIssues = [];
  if (completeness < 80) validationIssues.push('Assessment is less than 80% complete');
  if (!formData.financial_info?.revenue) validationIssues.push('Revenue information is missing');
  if (!formData.operational_info?.total_employees) validationIssues.push('Employee count is missing');
  
  const canSubmit = validationIssues.length === 0;
  
  return (
    <div className="space-y-6">
      {/* Assessment Overview */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Assessment Overview
          </CardTitle>
          <CardDescription>
            Review the key details of this {assessmentType === AssessmentType.PARTNER ? 'partnership' : 'scheme'} assessment
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-primary">{completeness}%</div>
              <div className="text-sm text-muted-foreground">Complete</div>
            </div>
            <div className="text-center">
              <div className={`text-2xl font-bold ${riskLevel.color}`}>{riskScore}/200</div>
              <div className="text-sm text-muted-foreground">Risk Score</div>
            </div>
            <div className="text-center">
              <Badge className={`${riskLevel.bgColor} ${riskLevel.color} border-0`}>
                {riskLevel.level} Risk
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>
      
      {/* Validation Issues */}
      {validationIssues.length > 0 && (
        <Alert>
          <AlertTriangle className="h-4 w-4" />
          <AlertTitle>Issues Found</AlertTitle>
          <AlertDescription>
            <ul className="mt-2 space-y-1">
              {validationIssues.map((issue, index) => (
                <li key={index} className="text-sm">• {issue}</li>
              ))}
            </ul>
          </AlertDescription>
        </Alert>
      )}
      
      {/* Key Information Summary */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Basic Information */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Building2 className="h-4 w-4" />
              Basic Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {assessmentType === AssessmentType.PARTNER ? (
              <>
                <div>
                  <Label className="text-sm font-medium">Partner Name</Label>
                  <p className="text-sm text-muted-foreground">{formData.partner_name || 'Not specified'}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium">Registration Number</Label>
                  <p className="text-sm text-muted-foreground">{formData.registration_number || 'Not specified'}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium">Location</Label>
                  <p className="text-sm text-muted-foreground">{formData.headquarters_location || 'Not specified'}</p>
                </div>
              </>
            ) : (
              <>
                <div>
                  <Label className="text-sm font-medium">Scheme Name</Label>
                  <p className="text-sm text-muted-foreground">{formData.scheme_name || 'Not specified'}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium">Location</Label>
                  <p className="text-sm text-muted-foreground">{formData.location || 'Not specified'}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium">Development Stage</Label>
                  <p className="text-sm text-muted-foreground">{formData.development_stage || 'Not specified'}</p>
                </div>
              </>
            )}
          </CardContent>
        </Card>
        
        {/* Financial Summary */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <DollarSign className="h-4 w-4" />
              Financial Summary
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {formData.financial_info?.revenue && (
              <div>
                <Label className="text-sm font-medium">Revenue</Label>
                <p className="text-sm text-muted-foreground">
                  {formatCurrency(formData.financial_info.revenue, currency)}
                </p>
              </div>
            )}
            {formData.financial_info?.ebitda && (
              <div>
                <Label className="text-sm font-medium">EBITDA</Label>
                <p className="text-sm text-muted-foreground">
                  {formatCurrency(formData.financial_info.ebitda, currency)}
                </p>
              </div>
            )}
            {formData.financial_info?.net_worth && (
              <div>
                <Label className="text-sm font-medium">Net Worth</Label>
                <p className="text-sm text-muted-foreground">
                  {formatCurrency(formData.financial_info.net_worth, currency)}
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
      
      {/* Risk Assessment Summary */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <BarChart3 className="h-4 w-4" />
            Risk Assessment Summary
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {formData.risk_assessment?.market_risk && (
              <div>
                <Label className="text-sm font-medium">Market Risk</Label>
                <Badge variant={formData.risk_assessment.market_risk === 'low' ? 'default' : 'destructive'}>
                  {formData.risk_assessment.market_risk}
                </Badge>
              </div>
            )}
            {formData.risk_assessment?.financial_risk && (
              <div>
                <Label className="text-sm font-medium">Financial Risk</Label>
                <Badge variant={formData.risk_assessment.financial_risk === 'low' ? 'default' : 'destructive'}>
                  {formData.risk_assessment.financial_risk}
                </Badge>
              </div>
            )}
            {formData.risk_assessment?.operational_risk && (
              <div>
                <Label className="text-sm font-medium">Operational Risk</Label>
                <Badge variant={formData.risk_assessment.operational_risk === 'low' ? 'default' : 'destructive'}>
                  {formData.risk_assessment.operational_risk}
                </Badge>
              </div>
            )}
            {formData.risk_assessment?.regulatory_risk && (
              <div>
                <Label className="text-sm font-medium">Regulatory Risk</Label>
                <Badge variant={formData.risk_assessment.regulatory_risk === 'low' ? 'default' : 'destructive'}>
                  {formData.risk_assessment.regulatory_risk}
                </Badge>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
      
      {/* Decision & Comments */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <CheckCircle className="h-4 w-4" />
            Assessment Decision
          </CardTitle>
          <CardDescription>
            Provide your assessment decision and any additional comments
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-wrap gap-2">
            <Button
              variant={decision === 'approve' ? 'default' : 'outline'}
              onClick={() => setDecision('approve')}
              disabled={!canSubmit}
              className="flex items-center gap-2"
            >
              <CheckCircle className="h-4 w-4" />
              Approve
            </Button>
            <Button
              variant={decision === 'review' ? 'default' : 'outline'}
              onClick={() => setDecision('review')}
            >
              <Clock className="h-4 w-4" />
              Request Review
            </Button>
            <Button
              variant={decision === 'reject' ? 'destructive' : 'outline'}
              onClick={() => setDecision('reject')}
            >
              <AlertTriangle className="h-4 w-4" />
              Reject
            </Button>
          </div>
          
          <div>
            <Label htmlFor="comments">Comments & Notes</Label>
            <Textarea
              id="comments"
              placeholder="Add any comments, conditions, or notes about this assessment..."
              value={comments}
              onChange={(e) => setComments(e.target.value)}
              className="mt-2"
              rows={4}
            />
          </div>
        </CardContent>
      </Card>
      
      {/* Submission Summary */}
      {decision && (
        <Alert>
          <CheckCircle className="h-4 w-4" />
          <AlertTitle>Ready to Submit</AlertTitle>
          <AlertDescription>
            This assessment will be submitted with a decision to <strong>{decision}</strong>.
            {comments && ` Additional comments: "${comments.slice(0, 100)}${comments.length > 100 ? '...' : ''}"`}
          </AlertDescription>
        </Alert>
      )}
    </div>
  );
}