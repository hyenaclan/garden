import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';

interface StatCardProps {
  title: string;
  value: string | number;
  unit?: string;
  change?: {
    value: string;
    positive?: boolean;
  };
  icon?: React.ReactNode;
  className?: string;
}

export function StatCard({ title, value, unit, change, icon, className }: StatCardProps) {
  return (
    <Card className={cn('bg-white border-gray-200 shadow-sm hover:shadow-md transition-shadow', className)}>
      <CardContent className="p-5">
        <div className="space-y-1">
          <p className="text-xs font-medium uppercase tracking-wide" style={{ color: '#6b7280' }}>{title}</p>
          <div className="flex items-baseline gap-1.5">
            <p className="text-2xl font-bold" style={{ color: '#065f46' }}>
              {value}
            </p>
            {unit && <span className="text-sm font-medium" style={{ color: '#6b7280' }}>{unit}</span>}
          </div>
          {change && (
            <div className="flex items-center gap-1 pt-1">
              <span
                className={cn(
                  'text-xs font-semibold',
                  change.positive ? 'text-green-600' : 'text-red-600'
                )}
              >
                {change.positive ? '↑' : '↓'} {change.value}
              </span>
            </div>
          )}
          {icon && <div className="pt-2 text-gray-400">{icon}</div>}
        </div>
      </CardContent>
    </Card>
  );
}
