import { Card, Group, Stack, Title, Text, Button } from '@mantine/core';
import { IconSeeding } from '@tabler/icons-react';

export default function Seedbox() {
  return (
    <Card shadow="sm" padding="xl">
      <Group justify="space-between" align="flex-start">
        <Group align="flex-start" gap="md">
          <IconSeeding size={32} color="var(--mantine-color-green-5)" style={{ flexShrink: 0, marginTop: 4 }} />
          <Stack gap="xs">
            <Title order={2} size="h3" c="green.8">
              Seedbox
            </Title>
            <Text c="green.5">
              Manage your seed inventory, planting schedules, and variety information
            </Text>
          </Stack>
        </Group>
        <Button color="green" px="xl" style={{ flexShrink: 0 }}>
          Go to Seedbox
        </Button>
      </Group>
    </Card>
  );
}
