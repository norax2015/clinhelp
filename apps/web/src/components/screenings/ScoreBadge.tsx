import React from 'react';
import { Badge } from '@/components/ui/Badge';
import { type ScreeningSeverity } from '@/types';
import { titleCase } from '@/lib/utils';

interface ScoreBadgeProps {
  severity: ScreeningSeverity;
  score?: number;
  showScore?: boolean;
}

function severityVariant(severity: ScreeningSeverity) {
  switch (severity) {
    case 'minimal': return 'success';
    case 'mild': return 'info';
    case 'moderate': return 'warning';
    case 'moderately_severe': return 'warning';
    case 'severe': return 'danger';
    default: return 'default';
  }
}

export function ScoreBadge({ severity, score, showScore = true }: ScoreBadgeProps) {
  return (
    <Badge variant={severityVariant(severity)}>
      {showScore && score !== undefined ? `${score} — ` : ''}
      {titleCase(severity)}
    </Badge>
  );
}
