import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

interface RiskBadgeProps {
  score: number; // 1-5 star rating
  className?: string;
  showLabel?: boolean;
}

export function RiskBadge({ score, className, showLabel = true }: RiskBadgeProps) {
  // Ensure score is between 1 and 5
  const normalizedScore = Math.max(1, Math.min(5, Math.round(score)));
  
  const stars = '⭐'.repeat(normalizedScore);
  
  const getRiskLabel = (score: number) => {
    if (score >= 4) return 'Low Risk';
    if (score >= 3) return 'Moderate Risk';
    return 'Higher Risk';
  };
  
  const getRiskVariant = (score: number): 'default' | 'secondary' | 'destructive' | 'outline' => {
    if (score >= 4) return 'default';
    if (score >= 3) return 'secondary';
    return 'destructive';
  };
  
  const getRiskColors = (score: number) => {
    if (score >= 4) return 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border-emerald-500/20';
    if (score >= 3) return 'bg-amber-500/10 text-amber-700 dark:text-amber-400 border-amber-500/20';
    return 'bg-rose-500/10 text-rose-700 dark:text-rose-400 border-rose-500/20';
  };

  return (
    <Badge 
      className={cn(
        'font-semibold text-xs px-3 py-1 border',
        getRiskColors(normalizedScore),
        className
      )}
    >
      <span className="mr-1">{stars}</span>
      {showLabel && <span>{getRiskLabel(normalizedScore)}</span>}
    </Badge>
  );
}
