import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { TrendingUp, TrendingDown } from 'lucide-react';

interface StatCardProps {
  title: string;
  subtitle?: string;
  value: string | number;
  unit?: string;
  change?: {
    value: string;
    positive?: boolean;
  };
  icon?: React.ReactNode;
  className?: string;
  accentColor?: 'blue' | 'green' | 'yellow' | 'teal' | 'purple' | 'pink' | 'orange' | 'red' | 'indigo' | 'cyan';
}

const accentColorClasses = {
  blue: 'bg-blue-500',
  green: 'bg-green-500',
  yellow: 'bg-yellow-500',
  teal: 'bg-teal-500',
  purple: 'bg-purple-500',
  pink: 'bg-pink-500',
  orange: 'bg-orange-500',
  red: 'bg-red-500',
  indigo: 'bg-indigo-500',
  cyan: 'bg-cyan-500',
};

export function StatCard({ title, subtitle, value, unit, change, icon, className, accentColor }: StatCardProps) {
  return (
    <Card className={cn('bg-white border-gray-200 shadow-sm hover:shadow-md transition-shadow', className)}>
      <CardContent className="p-5">
        {accentColor && (
          <div className={cn('h-1 w-16 rounded-full mb-3', accentColorClasses[accentColor])} />
        )}
        <div className="space-y-1">
          <div>
            <p className="font-medium text-garden-primary">{title}</p>
            {subtitle && <p className="text-xs text-gray-500">{subtitle}</p>}
          </div>
          <div className="flex items-baseline gap-1.5">
            <p className="text-2xl font-medium text-garden-primary-darkest">
              {value}
            </p>
            {unit && <span className="text-sm font-medium text-garden-primary">{unit}</span>}
          </div>
          {change && (
            <div className="flex items-center gap-1 pt-1">
              {change.positive ? (
                <TrendingUp className="w-3.5 h-3.5 text-garden-primary" />
              ) : (
                <TrendingDown className="w-3.5 h-3.5 text-red-600" />
              )}
              <span
                className={cn(
                  'text-xs font-semibold',
                  change.positive ? 'text-garden-primary' : 'text-red-600'
                )}
              >
                {change.value}
              </span>
            </div>
          )}
          {icon && <div className="pt-2 text-gray-400">{icon}</div>}
        </div>
      </CardContent>
    </Card>
  );
}
