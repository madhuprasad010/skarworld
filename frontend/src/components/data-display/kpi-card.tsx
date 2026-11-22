import { cn, formatCompactNumber, formatPercentage } from '@/lib/utils';
import { ArrowDown, ArrowUp, Minus, type LucideIcon } from 'lucide-react';

interface KPICardProps {
  title: string;
  value: string | number;
  change?: number;
  changeLabel?: string;
  icon?: LucideIcon;
  format?: 'number' | 'currency' | 'percentage' | 'compact';
  className?: string;
}

export function KPICard({
  title,
  value,
  change,
  changeLabel = 'vs last period',
  icon: Icon,
  className,
}: KPICardProps) {
  const isPositive = change !== undefined && change > 0;
  const isNegative = change !== undefined && change < 0;
  const isNeutral = change === undefined || change === 0;

  return (
    <div
      className={cn(
        'rounded-lg border bg-card p-6 shadow-sm transition-shadow hover:shadow-md',
        className
      )}
    >
      <div className="flex items-center justify-between">
        <p className="text-sm font-medium text-muted-foreground">{title}</p>
        {Icon && (
          <div className="rounded-md bg-primary/10 p-2">
            <Icon className="h-4 w-4 text-primary" />
          </div>
        )}
      </div>
      <div className="mt-3">
        <p className="text-2xl font-bold tracking-tight text-foreground">
          {typeof value === 'number' ? formatCompactNumber(value) : value}
        </p>
        {change !== undefined && (
          <div className="mt-1 flex items-center gap-1">
            <span
              className={cn(
                'inline-flex items-center gap-0.5 text-xs font-medium',
                isPositive && 'text-success',
                isNegative && 'text-destructive',
                isNeutral && 'text-muted-foreground'
              )}
            >
              {isPositive && <ArrowUp className="h-3 w-3" />}
              {isNegative && <ArrowDown className="h-3 w-3" />}
              {isNeutral && <Minus className="h-3 w-3" />}
              {formatPercentage(Math.abs(change))}
            </span>
            <span className="text-xs text-muted-foreground">{changeLabel}</span>
          </div>
        )}
      </div>
    </div>
  );
}
