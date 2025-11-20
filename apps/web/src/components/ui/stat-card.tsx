import { Card, CardContent, Box, Typography } from '@mui/material';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import TrendingDownIcon from '@mui/icons-material/TrendingDown';

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
  accentColor?: 'blue' | 'green' | 'yellow' | 'teal' | 'purple' | 'pink' | 'orange' | 'red' | 'indigo' | 'cyan';
}

const accentColors = {
  blue: '#3b82f6',
  green: '#22c55e',
  yellow: '#eab308',
  teal: '#14b8a6',
  purple: '#a855f7',
  pink: '#ec4899',
  orange: '#f97316',
  red: '#ef4444',
  indigo: '#6366f1',
  cyan: '#06b6d4',
};

export function StatCard({ title, subtitle, value, unit, change, icon, accentColor }: StatCardProps) {
  return (
    <Card
      sx={{
        bgcolor: 'background.paper',
        transition: 'box-shadow 0.2s',
        '&:hover': {
          boxShadow: 3,
        },
      }}
    >
      <CardContent sx={{ p: 2.5 }}>
        {accentColor && (
          <Box
            sx={{
              height: 4,
              width: 64,
              borderRadius: 999,
              bgcolor: accentColors[accentColor],
              mb: 1.5,
            }}
          />
        )}
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
          <Box>
            <Typography sx={{ fontWeight: 500, color: 'primary.main' }}>{title}</Typography>
            {subtitle && (
              <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                {subtitle}
              </Typography>
            )}
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'baseline', gap: 0.75 }}>
            <Typography variant="h4" sx={{ fontWeight: 500, color: 'secondary.main' }}>
              {value}
            </Typography>
            {unit && (
              <Typography variant="body2" sx={{ fontWeight: 500, color: 'primary.main' }}>
                {unit}
              </Typography>
            )}
          </Box>
          {change && (
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, pt: 0.5 }}>
              {change.positive ? (
                <TrendingUpIcon sx={{ fontSize: 14, color: 'success.main' }} />
              ) : (
                <TrendingDownIcon sx={{ fontSize: 14, color: 'error.main' }} />
              )}
              <Typography
                variant="caption"
                sx={{
                  fontWeight: 600,
                  color: change.positive ? 'success.main' : 'error.main',
                }}
              >
                {change.value}
              </Typography>
            </Box>
          )}
          {icon && (
            <Box sx={{ pt: 1, color: 'grey.400' }}>{icon}</Box>
          )}
        </Box>
      </CardContent>
    </Card>
  );
}
