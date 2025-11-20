import { Card, Group, Stack, Text, Box } from '@mantine/core';
import { IconTrendingUp, IconTrendingDown } from '@tabler/icons-react';

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

export function StatCard({ title, subtitle, value, unit, change, icon, className, accentColor }: StatCardProps) {
  return (
    <Card
      shadow="sm"
      padding="lg"
      className={className}
      styles={{
        root: {
          backgroundColor: 'white',
          transition: 'box-shadow 0.2s',
          '&:hover': {
            boxShadow: 'var(--mantine-shadow-md)',
          },
        },
      }}
    >
      <Stack gap="xs">
        {accentColor && (
          <Box
            h={4}
            w={64}
            style={{
              borderRadius: 'var(--mantine-radius-md)',
              backgroundColor: accentColors[accentColor],
            }}
          />
        )}
        <Stack gap={0}>
          <Text fw={500} c="green.5">
            {title}
          </Text>
          {subtitle && (
            <Text size="xs" c="gray.5">
              {subtitle}
            </Text>
          )}
        </Stack>
        <Group gap="xs" align="baseline">
          <Text size="xl" fw={500} c="green.8">
            {value}
          </Text>
          {unit && (
            <Text size="sm" fw={500} c="green.5">
              {unit}
            </Text>
          )}
        </Group>
        {change && (
          <Group gap={4} mt={4}>
            {change.positive ? (
              <IconTrendingUp size={14} color="var(--mantine-color-green-6)" />
            ) : (
              <IconTrendingDown size={14} color="var(--mantine-color-red-6)" />
            )}
            <Text size="xs" fw={600} c={change.positive ? 'green.6' : 'red.6'}>
              {change.value}
            </Text>
          </Group>
        )}
        {icon && <Box pt={8} c="gray.4">{icon}</Box>}
      </Stack>
    </Card>
  );
}
