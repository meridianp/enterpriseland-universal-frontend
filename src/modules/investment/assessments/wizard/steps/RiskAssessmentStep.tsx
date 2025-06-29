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
import { Slider } from "@/components/ui/slider";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { WizardStepProps } from '../types';
import { 
  AlertTriangle, 
  TrendingDown, 
  Shield, 
  Briefcase,
  Users,
  Gavel
} from 'lucide-react';
import { RiskLevel } from '@/lib/types/assessment.types';
import { getRiskLevelBadgeProps } from '@/lib/utils/assessment.utils';

interface RiskCategory {
  id: string;
  name: string;
  description: string;
  icon: React.ElementType;
  factors: string[];
}

const riskCategories: RiskCategory[] = [
  {
    id: 'financial_risk',
    name: 'Financial Risk',
    description: 'Assess the financial stability and creditworthiness',
    icon: TrendingDown,
    factors: [
      'Credit rating and history',
      'Debt-to-equity ratio',
      'Cash flow stability',
      'Revenue concentration'
    ]
  },
  {
    id: 'operational_risk',
    name: 'Operational Risk',
    description: 'Evaluate operational capabilities and efficiency',
    icon: Briefcase,
    factors: [
      'Management experience',
      'Project delivery track record',
      'Operational processes',
      'Technology infrastructure'
    ]
  },
  {
    id: 'market_risk',
    name: 'Market Risk',
    description: 'Consider market conditions and competitive position',
    icon: AlertTriangle,
    factors: [
      'Market demand trends',
      'Competition intensity',
      'Economic conditions',
      'Location factors'
    ]
  },
  {
    id: 'compliance_risk',
    name: 'Compliance Risk',
    description: 'Review regulatory and legal compliance',
    icon: Gavel,
    factors: [
      'Regulatory compliance history',
      'Legal disputes or issues',
      'License and permit status',
      'ESG compliance'
    ]
  },
  {
    id: 'reputation_risk',
    name: 'Reputation Risk',
    description: 'Assess reputation and stakeholder relationships',
    icon: Users,
    factors: [
      'Brand reputation',
      'Customer satisfaction',
      'Media coverage',
      'Partnership history'
    ]
  },
  {
    id: 'strategic_risk',
    name: 'Strategic Risk',
    description: 'Evaluate strategic alignment and future viability',
    icon: Shield,
    factors: [
      'Business model sustainability',
      'Strategic plan clarity',
      'Innovation capability',
      'Succession planning'
    ]
  }
];

function getRiskLevelFromScore(score: number): RiskLevel {
  if (score <= 3) return RiskLevel.LOW;
  if (score <= 7) return RiskLevel.MEDIUM;
  return RiskLevel.HIGH;
}

export function RiskAssessmentStep({ data, onUpdate }: WizardStepProps) {
  const { control, watch } = useFormContext();

  // Calculate overall risk score
  const riskScores = watch([
    'risk_assessment.financial_risk',
    'risk_assessment.operational_risk',
    'risk_assessment.market_risk',
    'risk_assessment.compliance_risk',
    'risk_assessment.reputation_risk',
    'risk_assessment.strategic_risk'
  ]);

  const overallScore = riskScores.filter(Boolean).length > 0
    ? riskScores.reduce((sum, score) => sum + (score || 0), 0) / riskScores.filter(Boolean).length
    : 0;

  const overallRiskLevel = getRiskLevelFromScore(overallScore);
  const overallRiskProps = getRiskLevelBadgeProps(overallRiskLevel);

  return (
    <div className="space-y-6">
      {/* Overall Risk Summary */}
      <Card>
        <CardHeader>
          <CardTitle>Overall Risk Assessment</CardTitle>
          <CardDescription>
            Based on the individual risk categories below
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-2xl font-bold">{overallScore.toFixed(1)}/10</p>
              <p className="text-sm text-muted-foreground">Average Risk Score</p>
            </div>
            <Badge className={overallRiskProps.className}>
              {overallRiskProps.label}
            </Badge>
          </div>
        </CardContent>
      </Card>

      {/* Individual Risk Categories */}
      <div className="space-y-4">
        {riskCategories.map((category) => {
          const fieldName = `risk_assessment.${category.id}` as const;
          const score = watch(fieldName) || 0;
          const riskLevel = getRiskLevelFromScore(score);
          const riskProps = getRiskLevelBadgeProps(riskLevel);

          return (
            <Card key={category.id}>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex items-start space-x-3">
                    <category.icon className="h-5 w-5 text-muted-foreground mt-0.5" />
                    <div>
                      <CardTitle className="text-lg">{category.name}</CardTitle>
                      <CardDescription>{category.description}</CardDescription>
                    </div>
                  </div>
                  <Badge className={riskProps.className}>
                    {score}/10
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <FormField
                  control={control}
                  name={fieldName}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Risk Score (0 = Low, 10 = High)</FormLabel>
                      <FormControl>
                        <div className="space-y-3">
                          <Slider
                            min={0}
                            max={10}
                            step={1}
                            value={[field.value || 0]}
                            onValueChange={(value) => field.onChange(value[0])}
                            className="w-full"
                          />
                          <div className="flex justify-between text-xs text-muted-foreground">
                            <span>Low Risk</span>
                            <span>Medium Risk</span>
                            <span>High Risk</span>
                          </div>
                        </div>
                      </FormControl>
                      <FormDescription>
                        Consider these factors when scoring:
                      </FormDescription>
                      <ul className="text-sm text-muted-foreground space-y-1 ml-4">
                        {category.factors.map((factor, index) => (
                          <li key={index} className="list-disc">{factor}</li>
                        ))}
                      </ul>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Risk Mitigation Notes */}
                <FormField
                  control={control}
                  name={`risk_assessment.${category.id}_notes`}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Mitigation Notes (Optional)</FormLabel>
                      <FormControl>
                        <textarea
                          className="flex min-h-[80px] w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                          placeholder={`Describe any mitigation strategies or additional context for this risk category...`}
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Risk Summary Notes */}
      <Card>
        <CardHeader>
          <CardTitle>Risk Summary</CardTitle>
          <CardDescription>
            Provide an overall risk assessment summary and recommendations
          </CardDescription>
        </CardHeader>
        <CardContent>
          <FormField
            control={control}
            name="risk_assessment.overall_notes"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <textarea
                    className="flex min-h-[120px] w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    placeholder="Summarize the key risks, mitigation strategies, and your overall recommendation..."
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </CardContent>
      </Card>
    </div>
  );
}